"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/email/send";
import {
  CONTACT_TOPIC_VALUES,
  contactTopicLabel,
  isContactTopic,
  type ContactTopic,
} from "@/lib/contact-topics";

/*
 * /contact form — Server Action (spec §7.10).
 *
 * Fields: name, email, org, topic (optional, seeded from `?topic=`), message,
 * budget (optional dropdown), honeypot. Send transactional to CONTACT_INBOX +
 * auto-reply to sender. Returns the narrow {ok, message, errors} shape the
 * client renders inline.
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
  /* Never user-authored free text — it arrives from a `?topic=` link or the
   * select, and anything unrecognised is dropped before we get here. Keeping
   * it a closed enum means nothing arbitrary can reach the email subject. */
  topic: z.enum(CONTACT_TOPIC_VALUES as unknown as [ContactTopic, ...ContactTopic[]]).optional(),
});

export type ContactState = {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof z.infer<typeof contactSchema>, string>>;
};

const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ?? "Abdul Wahab <info@abdulwahabai.com>";
const INBOX =
  process.env.CONTACT_INBOX ?? "info@abdulwahabai.com";

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
  /* Unrecognised topic → treated as absent, not as a validation error. A stale
   * or hand-edited link must never block a real enquiry. */
  const topicRaw = formData.get("topic");
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    org: formData.get("org") ?? "",
    message: formData.get("message"),
    ...(typeof budgetRaw === "string" && budgetRaw.length > 0
      ? { budget: budgetRaw }
      : {}),
    ...(isContactTopic(topicRaw) ? { topic: topicRaw } : {}),
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
  const topicLabel = data.topic ? contactTopicLabel(data.topic) : "—";

  const ownerLines = [
    `New contact inquiry`,
    ``,
    `Name:     ${data.name}`,
    `Email:    ${data.email}`,
    `Org:      ${data.org || "—"}`,
    `Topic:    ${topicLabel}`,
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
    `abdulwahabai.com`,
  ];

  const [ownerSend, replySend] = await Promise.all([
    sendEmail({
      to: INBOX,
      from: FROM_ADDRESS,
      replyTo: data.email,
      /* Topic leads the subject so the inbox sorts itself — a mentorship
       * enquiry and a build enquiry need different reply modes. */
      subject: `Contact${data.topic ? ` [${contactTopicLabel(data.topic)}]` : ""} — ${data.name}${data.org ? ` · ${data.org}` : ""}`,
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
        "Couldn't send — please email info@abdulwahabai.com directly.",
    };
  }

  return {
    ok: true,
    message: "Sent — I'll reply within two business days.",
  };
}
