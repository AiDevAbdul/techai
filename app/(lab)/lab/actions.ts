"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/email/send";

/*
 * Lab Note inline subscribe — Server Action.
 *
 * One field (email). No double opt-in v1 (spec §7.7); the address is sent
 * to the owner inbox as a transactional capture. We can swap this for a
 * Resend Audience or ConvertKit later without touching the form.
 *
 * Honeypot: `company_website` — silent reject. Returns ok:true so bots
 * don't retry.
 *
 * Graceful in dev: the underlying `sendEmail` returns ok:false when
 * RESEND_API_KEY is missing; we still tell the user "got it" because the
 * UX is the same and the missing key is the owner's problem to fix.
 */

const subscribeSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

export type SubscribeState = {
  ok: boolean;
  message?: string;
  error?: string;
};

const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ?? "Abdul <info@abdulwahabai.com>";
const INBOX =
  process.env.LAB_INBOX ??
  process.env.CONTACT_INBOX ??
  "info@abdulwahabai.com";

export async function subscribeToLab(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const honey = formData.get("company_website");
  if (typeof honey === "string" && honey.trim().length > 0) {
    return { ok: true, message: "Subscribed." };
  }

  const parsed = subscribeSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Enter a valid email",
    };
  }

  await sendEmail({
    to: INBOX,
    from: FROM_ADDRESS,
    replyTo: parsed.data.email,
    subject: "Lab subscribe — new address",
    text: `New Lab subscriber: ${parsed.data.email}`,
  });

  return {
    ok: true,
    message: "Got it — next note lands in your inbox.",
  };
}
