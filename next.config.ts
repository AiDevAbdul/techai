import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

/*
 * Next.js 16 config.
 *
 *  - cacheComponents: enable PPR + `use cache` / cacheLife / cacheTag (spec
 *    §10). Lab Notes use cacheTag('lab') for content revalidation; static
 *    routes still prerender, dynamic surfaces (Cache Components) flow in
 *    after first paint.
 *  - Bundle analyzer wraps the export; toggle with ANALYZE=true npm run build.
 *  - Images: default Vercel optimizer settings; AVIF gets priority via the
 *    `formats` order so the LCP image lands as AVIF on capable clients.
 */

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/*
 * Security headers — scoped to the third-party origins actually in use:
 * Plausible (analytics script), Google Analytics (gtag.js, supplemental
 * analytics), Microsoft Clarity (session recordings — loader on
 * www.clarity.ms, runtime on scripts.clarity.ms, uploads to a.clarity.ms),
 * Cal.com (booking embed), YouTube (nocookie player), Vercel
 * Analytics/Speed Insights, Resend (server-side only, so not needed in
 * connect-src for the browser).
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://plausible.io https://www.googletagmanager.com https://www.clarity.ms https://scripts.clarity.ms https://app.cal.com https://cal.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "frame-src https://www.youtube-nocookie.com https://cal.com https://app.cal.com",
  "connect-src 'self' https://plausible.io https://www.google-analytics.com https://a.clarity.ms https://c.clarity.ms https://app.cal.com https://cal.com https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Tailwind's atomic CSS stays small per-page, so inlining it into
    // <head> removes the render-blocking stylesheet request (LCP).
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
