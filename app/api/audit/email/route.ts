import { z } from "zod";
import { renderToBuffer } from "@react-pdf/renderer";
import { AuditPdf } from "@/lib/audit/pdf";
import { AUDIT_QUESTIONS, type AuditAnswerId } from "@/lib/audit/types";

/*
 * /api/audit/email — capture endpoint (spec §7.8 step 4).
 *
 * Receives name + email + the final hypothesis + transcript. Renders a
 * branded PDF via @react-pdf/renderer (Node runtime — react-pdf needs
 * node:Buffer/stream APIs that aren't available on Edge). Sends the PDF
 * to the visitor and a transcript copy to the owner via Resend.
 *
 * No silent retries on failure. Returns `{ok:true}` on success;
 * `{ok:false, reason}` on failure. The client surfaces an inline error.
 *
 * Runtime: Fluid Compute (Next 16 default). React-PDF needs Node-y APIs
 * which Fluid provides without the old Edge-runtime caveats.
 */

export const maxDuration = 30;

const captureSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  hypothesis: z.string().min(1).max(40_000),
  transcript: z.record(z.string(), z.string()),
});

const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ?? "Abdul <info@abdulwahabai.com>";
const OWNER_INBOX =
  process.env.AUDIT_INBOX ??
  process.env.CONTACT_INBOX ??
  "info@abdulwahabai.com";

async function sendWithAttachment(input: {
  to: string;
  from: string;
  replyTo?: string;
  subject: string;
  text: string;
  attachmentBase64: string;
  attachmentName: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[audit/email] RESEND_API_KEY missing — skipping send.",
      { to: input.to },
    );
    return { ok: false, reason: "missing_api_key" };
  }
  const body: Record<string, unknown> = {
    from: input.from,
    to: [input.to],
    subject: input.subject,
    text: input.text,
    attachments: [
      {
        filename: input.attachmentName,
        content: input.attachmentBase64,
      },
    ],
  };
  if (input.replyTo) body.reply_to = input.replyTo;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[audit/email] Resend send failed", res.status, detail);
      return { ok: false, reason: "send_failed" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[audit/email] Resend fetch threw", err);
    return { ok: false, reason: "send_failed" };
  }
}

export async function POST(req: Request): Promise<Response> {
  const body = await req.json().catch(() => null);
  const parsed = captureSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, reason: "bad_request" },
      { status: 400 },
    );
  }

  const { name, email, hypothesis, transcript } = parsed.data;
  // Trim transcript to known fields only (defense in depth — client could
  // pass extra keys we don't render).
  const cleanTranscript: Record<AuditAnswerId, string> = {
    industry: "",
    workflow: "",
    owner: "",
    tools: "",
    success: "",
  };
  for (const q of AUDIT_QUESTIONS) {
    cleanTranscript[q.id] = transcript[q.id] ?? "";
  }

  // Render PDF in Node — react-pdf returns a Buffer here.
  const pdfBuffer = await renderToBuffer(
    AuditPdf({
      hypothesis,
      transcript: cleanTranscript,
      recipient: { name, email },
      generatedAt: new Date(),
    }),
  );
  const pdfBase64 = pdfBuffer.toString("base64");
  const pdfName = `workflow-audit-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;

  const firstName = name.split(/\s+/)[0] ?? name;

  const visitorText = [
    `Hi ${firstName},`,
    ``,
    `Attached is the one-page workflow audit you ran on abdulwahabai.com.`,
    `It's the bot's hypothesis, not the last word — reply to this email`,
    `if any of it looks off, or if you want to go deeper on the next step.`,
    ``,
    `If a 30-minute call is the right next move, book one here:`,
    `https://abdulwahabai.com/contact`,
    ``,
    `— Abdul`,
    `abdulwahabai.com`,
  ].join("\n");

  const ownerText = [
    `New /lab/audit completion`,
    ``,
    `Name:   ${name}`,
    `Email:  ${email}`,
    ``,
    `--- Transcript ---`,
    ...AUDIT_QUESTIONS.flatMap((q) => [
      ``,
      `Q: ${q.label}`,
      `A: ${cleanTranscript[q.id] || "—"}`,
    ]),
    ``,
    `--- Hypothesis ---`,
    hypothesis,
  ].join("\n");

  const [visitorSend, ownerSend] = await Promise.all([
    sendWithAttachment({
      to: email,
      from: FROM_ADDRESS,
      subject: "Your workflow audit — abdulwahabai.com",
      text: visitorText,
      attachmentBase64: pdfBase64,
      attachmentName: pdfName,
    }),
    sendWithAttachment({
      to: OWNER_INBOX,
      from: FROM_ADDRESS,
      replyTo: email,
      subject: `Audit complete — ${name}`,
      text: ownerText,
      attachmentBase64: pdfBase64,
      attachmentName: pdfName,
    }),
  ]);

  if (!visitorSend.ok && !ownerSend.ok) {
    return Response.json(
      {
        ok: false,
        reason: "send_failed",
        message:
          "Couldn't send the PDF — please email info@abdulwahabai.com for a copy.",
      },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
