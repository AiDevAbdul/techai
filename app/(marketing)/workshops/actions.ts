"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/email/send";

/*
 * /workshops inquiry — Server Action.
 *
 * Spec §7.5 fields: org, role, audience size, format, target dates, notes.
 * Plus a contact email (required to reply) and name (so the auto-reply
 * isn't addressed to "there"). Honeypot field is `company_website` — a
 * humans-leave-blank, bots-fill-it trap. Invisible hCaptcha runs server-side
 * via `hcaptcha_token`; verification is only enforced when HCAPTCHA_SECRET
 * is set so the form still works in dev without the integration.
 *
 * The shape returned to the client is intentionally narrow: ok + optional
 * field-level errors + an optional top-level message. The client renders a
 * sonner toast on ok=true and inline error text on ok=false.
 */

const formatEnum = z.enum([
  "executive-briefing",
  "team-workshop",
  "hands-on-bootcamp",
  "unsure",
]);

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email"),
  org: z.string().trim().min(1, "Organization is required").max(160),
  role: z.string().trim().min(1, "Role is required").max(120),
  audienceSize: z
    .string()
    .trim()
    .min(1, "Audience size is required")
    .max(60),
  format: formatEnum,
  targetDates: z.string().trim().max(160).optional().default(""),
  notes: z.string().trim().max(2000).optional().default(""),
});

export type WorkshopInquiryState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof inquirySchema>, string>>;
};

const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ?? "Abdul Wahab <info@abdulwahabai.com>";
const INBOX =
  process.env.WORKSHOP_INBOX ??
  process.env.CONTACT_INBOX ??
  "info@abdulwahabai.com";

const formatLabels: Record<z.infer<typeof formatEnum>, string> = {
  "executive-briefing": "Executive briefing",
  "team-workshop": "Team workshop",
  "hands-on-bootcamp": "Hands-on bootcamp",
  unsure: "Not sure yet",
};

async function verifyHCaptcha(token: string | null): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET;
  if (!secret) return true; // dev / unconfigured — let it through
  if (!token) return false;
  try {
    const params = new URLSearchParams();
    params.set("secret", secret);
    params.set("response", token);
    const res = await fetch("https://hcaptcha.com/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { success?: boolean };
    return Boolean(json.success);
  } catch {
    return false;
  }
}

export async function submitWorkshopInquiry(
  _prev: WorkshopInquiryState,
  formData: FormData,
): Promise<WorkshopInquiryState> {
  // Honeypot — silent reject. We pretend success to bots so they don't retry.
  const honey = formData.get("company_website");
  if (typeof honey === "string" && honey.trim().length > 0) {
    return { ok: true, message: "Thanks — I'll reply within two business days." };
  }

  const hcaptchaToken = formData.get("hcaptcha_token");
  const captchaOk = await verifyHCaptcha(
    typeof hcaptchaToken === "string" ? hcaptchaToken : null,
  );
  if (!captchaOk) {
    return {
      ok: false,
      message: "Captcha check failed — please refresh and try again.",
    };
  }

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    org: formData.get("org"),
    role: formData.get("role"),
    audienceSize: formData.get("audienceSize"),
    format: formData.get("format"),
    targetDates: formData.get("targetDates") ?? "",
    notes: formData.get("notes") ?? "",
  };

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    const errors: WorkshopInquiryState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !(key in errors!)) {
        (errors as Record<string, string>)[key] = issue.message;
      }
    }
    return {
      ok: false,
      message: "Please fix the highlighted fields and try again.",
      errors,
    };
  }

  const data = parsed.data;
  const formatLabel = formatLabels[data.format];

  const ownerLines = [
    `New workshop inquiry`,
    ``,
    `Name:           ${data.name}`,
    `Email:          ${data.email}`,
    `Organization:   ${data.org}`,
    `Role:           ${data.role}`,
    `Audience size:  ${data.audienceSize}`,
    `Format:         ${formatLabel}`,
    `Target dates:   ${data.targetDates || "—"}`,
    ``,
    `Notes:`,
    data.notes || "(none)",
  ];

  const replyLines = [
    `Hi ${data.name.split(/\s+/)[0] ?? data.name},`,
    ``,
    `Thanks for reaching out about a ${formatLabel.toLowerCase()} for ${data.org}.`,
    `I read every inquiry myself and will reply within two business days with`,
    `either a 30-minute planning slot or a few clarifying questions.`,
    ``,
    `In the meantime, if you want to share more context — sample workflows,`,
    `team composition, business goals — just reply to this email.`,
    ``,
    `— Abdul`,
    `abdulwahabai.com`,
  ];

  // Fire both sends in parallel. We don't fail the user-facing submit if one
  // of these returns ok:false — the inquiry is captured in logs either way,
  // and during dev the api key won't be set yet (Day 10 wires it).
  const [ownerSend, replySend] = await Promise.all([
    sendEmail({
      to: INBOX,
      from: FROM_ADDRESS,
      replyTo: data.email,
      subject: `Workshop inquiry — ${data.org} (${formatLabel})`,
      text: ownerLines.join("\n"),
    }),
    sendEmail({
      to: data.email,
      from: FROM_ADDRESS,
      subject: `Got your workshop inquiry — Abdul Wahab`,
      text: replyLines.join("\n"),
    }),
  ]);

  if (
    !ownerSend.ok &&
    ownerSend.reason === "send_failed" &&
    !replySend.ok &&
    replySend.reason === "send_failed"
  ) {
    return {
      ok: false,
      message:
        "Couldn't send the inquiry — please email info@abdulwahabai.com directly.",
    };
  }

  return {
    ok: true,
    message: "Inquiry sent — I'll reply within two business days.",
  };
}
