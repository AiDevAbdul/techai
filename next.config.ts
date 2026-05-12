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

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default withBundleAnalyzer(nextConfig);
