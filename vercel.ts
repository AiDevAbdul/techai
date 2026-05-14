import { routes } from "@vercel/config/v1";
import type { VercelConfig } from "@vercel/config/v1";

/*
 * Vercel project configuration (typed alternative to vercel.json).
 * Spec §3 + plan §1.4.
 *
 * www → apex redirect (www.techai.pk → techai.pk, 308) is configured at the
 * Vercel domain settings level, not as a code routing rule.
 * This file handles framework declaration and HTTP security headers.
 */

export const config: VercelConfig = {
  framework: "nextjs",

  headers: [
    routes.header("/(.*)", [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ]),
  ],
};
