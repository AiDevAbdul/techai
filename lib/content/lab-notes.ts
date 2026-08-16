import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cacheLife, cacheTag } from "next/cache";
import {
  labNoteFrontmatterSchema,
  type LabNoteFrontmatter,
} from "./schemas";

/*
 * Lab Note loader — spec §7.7. Mirrors the case-study loader: read
 * `content/lab/*.mdx`, parse YAML frontmatter, validate with zod.
 * Build fails on malformed frontmatter (DoD §8).
 *
 * Sorting: newest first by `date` (descending). Frontmatter does not carry an
 * explicit `order` field — date is the order.
 *
 * Caching: `'use cache'` with cacheLife('max') + cacheTag('lab') per
 * spec §10. Notes ship via MDX in the repo, so nothing here changes between
 * deployments — a time-based revalidate would only rewrite identical bytes
 * into the ISR store on a timer. Invalidation is `revalidateTag('lab')` after
 * a content push hook, or implicit redeployment.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "lab");

export type LabNote = {
  frontmatter: LabNoteFrontmatter;
  body: string;
  filePath: string;
};

async function loadAll(): Promise<LabNote[]> {
  "use cache";
  cacheLife("max");
  cacheTag("lab");
  let entries: string[];
  try {
    entries = await fs.readdir(CONTENT_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
  const mdxFiles = entries.filter((name) => name.endsWith(".mdx"));
  const notes = await Promise.all(
    mdxFiles.map(async (filename) => {
      const filePath = path.join(CONTENT_DIR, filename);
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = matter(raw);
      const frontmatter = labNoteFrontmatterSchema.parse({
        ...parsed.data,
        slug: parsed.data.slug ?? filename.replace(/\.mdx$/, ""),
      });
      return {
        frontmatter,
        body: parsed.content,
        filePath,
      } satisfies LabNote;
    }),
  );
  notes.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
  return notes;
}

export async function getAllLabNotes(): Promise<LabNote[]> {
  return loadAll();
}

export async function getLabNoteBySlug(
  slug: string,
): Promise<LabNote | null> {
  const all = await loadAll();
  return all.find((n) => n.frontmatter.slug === slug) ?? null;
}

export async function getLabNoteSlugs(): Promise<string[]> {
  const all = await loadAll();
  return all.map((n) => n.frontmatter.slug);
}

/*
 * TOC helpers — scan the MDX body for `## ` H2 headings (lab notes use H2 as
 * the top section level; H1 is the page title). We rebuild the heading id with
 * the same slug-style the MDX H2 renderer uses, so anchors line up.
 */

export type TocEntry = {
  id: string;
  text: string;
};

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractToc(body: string): TocEntry[] {
  const lines = body.split("\n");
  const headings: TocEntry[] = [];
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match && match[1]) {
      const text = match[1].replace(/[`*_]/g, "").trim();
      headings.push({ id: slugifyHeading(text), text });
    }
  }
  return headings;
}

export function relatedNotes(
  current: LabNote,
  all: LabNote[],
  count = 2,
): LabNote[] {
  return all
    .filter((n) => n.frontmatter.slug !== current.frontmatter.slug)
    .slice(0, count);
}
