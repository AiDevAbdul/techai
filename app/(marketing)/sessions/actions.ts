"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/email/send";

/*
 * Sessions notify — Server Action.
 *
 * Captures email + session slug and forwards to the owner inbox.
 * Mirrors subscribeToLab: no double opt-in in v1; address is a transactional
 * capture that can be migrated to Resend Audience / ConvertKit later.
 *
 * Honeypot: `company_website` — silent reject.
 */

const notifySchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

export type SessionNotifyState = {
  ok: boolean;
  message?: string;
  error?: string;
};

const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ?? "Abdul Wahab <info@abdulwahabai.com>";
const INBOX =
  process.env.SESSIONS_INBOX ??
  process.env.CONTACT_INBOX ??
  "info@abdulwahabai.com";

export async function subscribeToSessions(
  _prev: SessionNotifyState,
  formData: FormData,
): Promise<SessionNotifyState> {
  const honey = formData.get("company_website");
  if (typeof honey === "string" && honey.trim().length > 0) {
    return { ok: true, message: "You're on the list." };
  }

  const parsed = notifySchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Enter a valid email",
    };
  }

  const sessionSlug = formData.get("session_slug") ?? "general";

  await sendEmail({
    to: INBOX,
    from: FROM_ADDRESS,
    replyTo: parsed.data.email,
    subject: `Sessions notify — ${sessionSlug}`,
    text: `New session notification request\nEmail: ${parsed.data.email}\nSession: ${sessionSlug}`,
  });

  return {
    ok: true,
    message: "You're on the list — I'll email you when the next session is live.",
  };
}
