import { z } from "zod";

/*
 * Frontmatter schemas — spec §7.3 + §8.2.
 *
 * Build fails on malformed frontmatter (DoD Day 4). The schemas live here
 * (not co-located) so the static index page + the dynamic [slug] route can
 * import the same parser without circular references.
 */

export const metricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});

export const testimonialSchema = z.object({
  quote: z.string().min(1),
  author: z.string().min(1),
  role: z.string().min(1),
});

export const caseStudyFrontmatterSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase kebab-case"),
  title: z.string().min(1),
  eyebrow: z.string().min(1),
  client: z.string().min(1),
  duration: z.string().min(1),
  year: z.number().int().gte(2000).lte(2100),
  summary: z.string().min(1),
  metrics: z.array(metricSchema).min(1).max(3),
  heroDiagram: z.string().regex(/^\/diagrams\/.+\.svg$/, "heroDiagram must point at /diagrams/*.svg"),
  stack: z.array(z.string().min(1)).min(1),
  testimonial: testimonialSchema.optional(),
  order: z.number().int().min(1),
});

export type CaseStudyFrontmatter = z.infer<typeof caseStudyFrontmatterSchema>;

export const labNoteFrontmatterSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  summary: z.string().min(1),
  category: z.string().min(1),
  readingTime: z.number().int().min(1),
  ogImage: z.string().optional(),
});

export type LabNoteFrontmatter = z.infer<typeof labNoteFrontmatterSchema>;

/*
 * Services — spec §7.4. Four tiers shipped in v1: Audit, Build, Workshop,
 * Speaking. Slug is enum-locked because the home page anchors to
 * `/services#audit` etc., and the segmented-control tab order is structural,
 * not editorial. `priceLabel` is a free string ("Starting from $1,500",
 * "Custom", "On request") because the layout never parses the number — the
 * Service JSON-LD reads numeric pricing from `offerPrice` instead.
 */
export const serviceFrontmatterSchema = z.object({
  slug: z.enum(["audit", "build", "workshop", "speaking"]),
  name: z.string().min(1),
  tabLabel: z.string().min(1).max(12),
  format: z.string().min(1),
  idealFor: z.string().min(1),
  priceLabel: z.string().min(1),
  priceDetail: z.string().optional(),
  ctaLabel: z.string().min(1),
  ctaHref: z.string().min(1),
  deliverables: z.array(z.string().min(1)).min(3).max(6),
  serviceType: z.string().min(1),
  offerPrice: z.number().int().positive().optional(),
  offerCurrency: z.literal("USD").optional(),
  order: z.number().int().min(1).max(4),
});

export type ServiceFrontmatter = z.infer<typeof serviceFrontmatterSchema>;

/*
 * Workshops — spec §7.5 + §8.1. Two MDX files drive this page:
 *
 *  - topics.mdx — frontmatter `topics: WorkshopTopic[]`, 10–15 items, rendered
 *    into an accordion. The MDX body is unused (kept for editorial notes that
 *    don't ship to the page).
 *  - past-engagements.mdx — frontmatter `engagements: PastEngagement[]`, min 3
 *    at launch, rendered into a dated list (logo wall is the alternate visual
 *    per spec but the dated list is the v1 choice — Q4 logos pending).
 *
 * Frontmatter-driven (not MDX body) because the page needs structured access
 * (accordion items, dated rows) and the editorial flexibility of MDX body
 * rendering isn't needed here — these are catalog entries, not prose.
 */
export const workshopTopicSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  audience: z.string().min(1),
});
export type WorkshopTopic = z.infer<typeof workshopTopicSchema>;

export const workshopTopicsFileSchema = z.object({
  topics: z.array(workshopTopicSchema).min(10).max(15),
});

export const pastEngagementSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "date must be YYYY-MM or YYYY-MM-DD"),
  org: z.string().min(1),
  title: z.string().min(1),
  format: z.string().min(1),
  audience: z.string().min(1),
});
export type PastEngagement = z.infer<typeof pastEngagementSchema>;

export const pastEngagementsFileSchema = z.object({
  engagements: z.array(pastEngagementSchema).min(3),
});
