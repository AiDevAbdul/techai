import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { mentorshipOfferSchema, type MentorshipOffer } from "./schemas";

/*
 * Server-only loader for `content/mentorship/*.mdx`. Same contract as the
 * services loader: read directory, parse frontmatter, validate with zod, sort
 * by `order`. Build fails on malformed frontmatter.
 *
 * The MDX body is the 1–2 sentence positioning paragraph shown on the offer
 * card. Everything structured (price, format, deliverables) lives in
 * frontmatter so the page owns visual hierarchy, not the author.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "mentorship");

export type Mentorship = {
  frontmatter: MentorshipOffer;
  body: string;
  filePath: string;
};

async function loadAll(): Promise<Mentorship[]> {
  "use cache";
  const entries = await fs.readdir(CONTENT_DIR);
  const mdxFiles = entries.filter((name) => name.endsWith(".mdx"));
  const offers = await Promise.all(
    mdxFiles.map(async (filename) => {
      const filePath = path.join(CONTENT_DIR, filename);
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = matter(raw);
      const frontmatter = mentorshipOfferSchema.parse({
        ...parsed.data,
        slug: parsed.data.slug ?? filename.replace(/\.mdx$/, ""),
      });
      return {
        frontmatter,
        body: parsed.content.trim(),
        filePath,
      } satisfies Mentorship;
    }),
  );
  offers.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
  return offers;
}

export async function getAllMentorshipOffers(): Promise<Mentorship[]> {
  return loadAll();
}

export type { MentorshipOffer };
