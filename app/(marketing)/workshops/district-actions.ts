"use server";

import { z } from "zod";
import { sendEmail } from "@/lib/email/send";
import { insertDistrictRegistration } from "@/lib/db/district-registrations";
import { PROVINCES, districtsForProvince } from "@/lib/content/districts";

/*
 * /workshops "Bring this to your district" — Server Action.
 *
 * Individual/community registration (no org field — distinct from
 * `submitWorkshopInquiry`, which is org-level). Persists to the
 * `district_registrations` table (source of truth for the top-5 demand
 * list) and best-effort notifies WORKSHOP_INBOX, mirroring the existing
 * dual-channel pattern.
 */

const districtSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(120),
    email: z.string().trim().email("Enter a valid email"),
    phone: z.string().trim().min(1, "Phone / WhatsApp is required").max(40),
    province: z.enum(PROVINCES as [string, ...string[]], {
      message: "Choose a province",
    }),
    district: z.string().trim().min(1, "District is required").max(120),
    deliveryMode: z.enum(["online", "onsite"], {
      message: "Choose online or onsite",
    }),
    notes: z.string().trim().max(1000).optional().default(""),
  })
  .refine((data) => districtsForProvince(data.province).includes(data.district), {
    message: "Choose a district in the selected province",
    path: ["district"],
  });

export type DistrictRegistrationState = {
  ok: boolean;
  message?: string;
  errors?: Partial<
    Record<
      "name" | "email" | "phone" | "province" | "district" | "deliveryMode" | "notes",
      string
    >
  >;
};

const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ?? "Abdul Wahab <info@abdulwahabai.com>";
const INBOX =
  process.env.WORKSHOP_INBOX ??
  process.env.CONTACT_INBOX ??
  "info@abdulwahabai.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdulwahabai.com";
const WHATSAPP_CHANNEL_URL = "https://whatsapp.com/channel/0029VaCUtI5FMqrU9qZ4so13";
const FACEBOOK_COMMUNITY_URL = "https://www.facebook.com/groups/actiondigital";
const YOUTUBE_URL = "https://youtube.com/aidevabdul";

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

export async function submitDistrictRegistration(
  _prev: DistrictRegistrationState,
  formData: FormData,
): Promise<DistrictRegistrationState> {
  // Honeypot — silent reject.
  const honey = formData.get("company_website");
  if (typeof honey === "string" && honey.trim().length > 0) {
    return { ok: true, message: "Registered — thanks for letting me know." };
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
    phone: formData.get("phone") ?? "",
    province: formData.get("province"),
    district: formData.get("district"),
    deliveryMode: formData.get("deliveryMode"),
    notes: formData.get("notes") ?? "",
  };

  const parsed = districtSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: DistrictRegistrationState["errors"] = {};
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

  const { ok: dbOk } = await insertDistrictRegistration(data);
  if (!dbOk) {
    return {
      ok: false,
      message: "Couldn't save your registration — please try again shortly.",
    };
  }

  const deliveryLabel = data.deliveryMode === "onsite" ? "Onsite" : "Online";

  const ownerLines = [
    `New district session registration`,
    ``,
    `Name:     ${data.name}`,
    `Email:    ${data.email}`,
    `Phone:    ${data.phone || "—"}`,
    `Province: ${data.province}`,
    `District: ${data.district}`,
    `Delivery: ${deliveryLabel}`,
    ``,
    `Notes:`,
    data.notes || "(none)",
  ];

  const firstName = data.name.trim().split(/\s+/)[0] ?? data.name;
  const confirmLines = [
    `Hi ${firstName},`,
    ``,
    `You're registered for a ${deliveryLabel.toLowerCase()} session in ${data.district}, ${data.province}. I'll email you as soon as a date is confirmed — enough people asking for the same district is what gets a session scheduled, so the more the merrier.`,
    ``,
    `In the meantime, join one of these for updates and free learning:`,
    ``,
    `WhatsApp channel: ${WHATSAPP_CHANNEL_URL}`,
    `Facebook community: ${FACEBOOK_COMMUNITY_URL}`,
    `YouTube: ${YOUTUBE_URL}`,
    `Free courses (Social Media Marketing, AI Driven Development): ${SITE_URL}/learn`,
    ``,
    `— Abdul`,
    `abdulwahabai.com`,
  ];

  // Best-effort — the DB write above is the source of truth for demand;
  // both sends below are just notifications and never block the response.
  await Promise.all([
    sendEmail({
      to: INBOX,
      from: FROM_ADDRESS,
      replyTo: data.email,
      subject: `District registration — ${data.district}, ${data.province} (${deliveryLabel})`,
      text: ownerLines.join("\n"),
    }),
    sendEmail({
      to: data.email,
      from: FROM_ADDRESS,
      subject: `You're registered — ${data.district} session`,
      text: confirmLines.join("\n"),
    }),
  ]);

  return {
    ok: true,
    message: "Registered — I'll be in touch when a session is scheduled near you.",
  };
}
