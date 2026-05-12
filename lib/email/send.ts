import "server-only";

/*
 * Resend transactional send — fetch-based wrapper.
 *
 * Day 10 wires Resend transactional from the contact form; this Day 7
 * helper exists so the workshops form has somewhere to send its inquiry.
 * Both paths share this primitive.
 *
 * Why fetch instead of the `resend` npm package: keeps the runtime
 * dependency surface flat (no extra SDK), and the Resend HTTP API is
 * trivially small. We can swap to the SDK on Day 10 without changing
 * callers — only this file changes.
 *
 * Graceful degradation: if `RESEND_API_KEY` is missing (env not yet
 * provisioned, local dev without the secret), the helper logs the would-be
 * payload and returns ok:false with a diagnostic reason. Callers decide
 * whether to surface the failure to the user or accept it silently — in
 * dev the form should still feel like it succeeds, so the page UX can be
 * tested. The production deploy will fail loud via the build-time env
 * check the contact-form work will add on Day 10.
 */

export type SendResult =
  | { ok: true; id: string }
  | { ok: false; reason: "missing_api_key" | "send_failed"; detail?: string };

export type SendEmailInput = {
  to: string | string[];
  from: string;
  subject: string;
  text: string;
  replyTo?: string;
  /** Optional HTML body. Plain text is preferred for the inquiry forms. */
  html?: string;
};

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export async function sendEmail(input: SendEmailInput): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[email] RESEND_API_KEY missing — skipping send.",
      { to: input.to, subject: input.subject },
    );
    return { ok: false, reason: "missing_api_key" };
  }

  const payload: Record<string, unknown> = {
    from: input.from,
    to: Array.isArray(input.to) ? input.to : [input.to],
    subject: input.subject,
    text: input.text,
  };
  if (input.html) payload.html = input.html;
  if (input.replyTo) payload.reply_to = input.replyTo;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[email] Resend send failed", res.status, detail);
      return { ok: false, reason: "send_failed", detail };
    }

    const json = (await res.json()) as { id?: string };
    return { ok: true, id: json.id ?? "" };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[email] Resend fetch threw", detail);
    return { ok: false, reason: "send_failed", detail };
  }
}
