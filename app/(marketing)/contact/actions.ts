"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/email/send";

/*
 * /contact form — Server Action (spec §7.10).
 *
 * Fields: name, email, org, message, budget (optional dropdown), honeypot.
 * Send transactional to CONTACT_INBOX + auto-reply to sender. Returns the
 * narrow {ok, message, errors} shape the client renders inline.
 *
 * Shares `sendEmail` with the workshops form so credential and verification
 * paths are identical. Graceful in dev: missing RESEND_API_KEY logs the
 * payload and returns ok:true to the user (the form is the same UX whether
 * keys are wired or not; the captures still land in server logs).
 */

const budgetEnum = z.enum([
  "under-5k",
  "5k-15k",
  "15k-40k",
  "40k-plus",
  "not-sure",
]);

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email"),
  org: z.string().trim().max(160).optional().default(""),
  message: z
    .string()
    .trim()
    .min(20, "A sentence or two helps — please add a little more")
    .max(2000),
  budget: budgetEnum.optional(),
});

export type ContactState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof contactSchema>, string>>;
};

const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ?? "Abdul <hello@techai.pk>";
const INBOX =
  process.env.CONTACT_INBOX ?? "abdul@duckercreative.com";

const budgetLabels: Record<z.infer<typeof budgetEnum>, string> = {
  "under-5k": "Under $5k",
  "5k-15k": "$5k – $15k",
  "15k-40k": "$15k – $40k",
  "40k-plus": "$40k+",
  "not-sure": "Not sure yet",
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot — silent ok.
  const honey = formData.get("company_website");
  if (typeof honey === "string" && honey.trim().length > 0) {
    return {
      ok: true,
      message: "Thanks — I'll reply within two business days.",
    };
  }

  const budgetRaw = formData.get("budget");
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    org: formData.get("org") ?? "",
    message: formData.get("message"),
    ...(typeof budgetRaw === "string" && budgetRaw.length > 0
      ? { budget: budgetRaw }
      : {}),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
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
  const budgetLabel = data.budget ? budgetLabels[data.budget] : "—";

  const ownerLines = [
    `New contact inquiry`,
    ``,
    `Name:     ${data.name}`,
    `Email:    ${data.email}`,
    `Org:      ${data.org || "—"}`,
    `Budget:   ${budgetLabel}`,
    ``,
    `Message:`,
    data.message,
  ];

  const firstName = data.name.split(/\s+/)[0] ?? data.name;
  const replyLines = [
    `Hi ${firstName},`,
    ``,
    `Thanks for reaching out — got your note. I read every inbound`,
    `myself and will reply within two business days, usually with a`,
    `30-minute slot or a few clarifying questions.`,
    ``,
    `If you want to add anything in the meantime — sample workflow,`,
    `team composition, what success looks like — just reply to this`,
    `email.`,
    ``,
    `— Abdul`,
    `techai.pk`,
  ];

  const [ownerSend, replySend] = await Promise.all([
    sendEmail({
      to: INBOX,
      from: FROM_ADDRESS,
      replyTo: data.email,
      subject: `Contact — ${data.name}${data.org ? ` · ${data.org}` : ""}`,
      text: ownerLines.join("\n"),
    }),
    sendEmail({
      to: data.email,
      from: FROM_ADDRESS,
      subject: `Got your note — Abdul Wahab`,
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
        "Couldn't send — please email abdul@duckercreative.com directly.",
    };
  }

  return {
    ok: true,
    message: "Sent — I'll reply within two business days.",
  };
}
