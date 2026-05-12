import type { MetadataRoute } from "next";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { getAllLabNotes } from "@/lib/content/lab-notes";

/*
 * Sitemap — Next 16 native (spec §11).
 *
 * Static pages first, then dynamic case-study + lab-note URLs pulled from
 * the MDX loaders. lastModified uses the build timestamp for static pages
 * and the frontmatter date for content. `/api/*` paths are not included
 * (robots.ts also disallows them).
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://techai.pk";

const STATIC_PATHS: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1.0 },
  { path: "/work", changeFrequency: "monthly", priority: 0.9 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/workshops", changeFrequency: "monthly", priority: 0.85 },
  { path: "/lab", changeFrequency: "weekly", priority: 0.8 },
  { path: "/lab/audit", changeFrequency: "monthly", priority: 0.85 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [studies, notes] = await Promise.all([
    getAllCaseStudies(),
    getAllLabNotes(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((entry) => ({
    url: `${SITE_URL}${entry.path}`,
    lastModified: now,
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));

  const caseStudyEntries: MetadataRoute.Sitemap = studies.map((s) => ({
    url: `${SITE_URL}/work/${s.frontmatter.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const labNoteEntries: MetadataRoute.Sitemap = notes.map((n) => ({
    url: `${SITE_URL}/lab/${n.frontmatter.slug}`,
    lastModified: new Date(n.frontmatter.date),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  return [...staticEntries, ...caseStudyEntries, ...labNoteEntries];
}
