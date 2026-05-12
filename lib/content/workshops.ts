import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  workshopTopicsFileSchema,
  pastEngagementsFileSchema,
  type WorkshopTopic,
  type PastEngagement,
} from "./schemas";

/*
 * Server-only loaders for `content/workshops/*.mdx`. Spec §8.1 names two
 * files, each frontmatter-driven (the MDX body is unused but supported so
 * editorial notes have a home). Build fails on malformed frontmatter via
 * zod — same DoD contract as case studies and services.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "workshops");

export async function getWorkshopTopics(): Promise<WorkshopTopic[]> {
  "use cache";
  const raw = await fs.readFile(path.join(CONTENT_DIR, "topics.mdx"), "utf8");
  const parsed = matter(raw);
  const { topics } = workshopTopicsFileSchema.parse(parsed.data);
  return topics;
}

export async function getPastEngagements(): Promise<PastEngagement[]> {
  "use cache";
  const raw = await fs.readFile(
    path.join(CONTENT_DIR, "past-engagements.mdx"),
    "utf8",
  );
  const parsed = matter(raw);
  const { engagements } = pastEngagementsFileSchema.parse(parsed.data);
  return engagements
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));
}
