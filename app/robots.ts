import type { MetadataRoute } from "next";

/*
 * robots.txt — Next 16 native (spec §11).
 *
 * Allow all crawlers. Disallow /api/* (server routes are not indexable
 * content; same for /og generators). Point at the sitemap.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techai.pk";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/og/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
