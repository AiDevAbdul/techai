import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cacheLife, cacheTag } from "next/cache";
import {
  sessionFrontmatterSchema,
  type SessionFrontmatter,
} from "./schemas";

const CONTENT_DIR = path.join(process.cwd(), "content", "sessions");

export type Session = {
  frontmatter: SessionFrontmatter;
  body: string;
  filePath: string;
};

async function loadAll(): Promise<Session[]> {
  "use cache";
  // Sessions ship as MDX in the repo, so this content cannot change between
  // deployments — an hourly revalidate just rewrote identical bytes into the
  // ISR store every hour, per cached segment. `max` (30d) leaves deploys and
  // `revalidateTag('sessions')` as the invalidation paths, which is the whole
  // truth about when this data actually changes.
  cacheLife("max");
  cacheTag("sessions");

  let entries: string[];
  try {
    entries = await fs.readdir(CONTENT_DIR);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }

  const mdxFiles = entries.filter((name) => name.endsWith(".mdx"));
  const sessions = await Promise.all(
    mdxFiles.map(async (filename) => {
      const filePath = path.join(CONTENT_DIR, filename);
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = matter(raw);
      const frontmatter = sessionFrontmatterSchema.parse({
        ...parsed.data,
        slug: parsed.data.slug ?? filename.replace(/\.mdx$/, ""),
      });
      return { frontmatter, body: parsed.content, filePath } satisfies Session;
    }),
  );

  sessions.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
  return sessions;
}

export async function getAllSessions(): Promise<Session[]> {
  return loadAll();
}

export async function getSessionBySlug(slug: string): Promise<Session | null> {
  const all = await loadAll();
  return all.find((s) => s.frontmatter.slug === slug) ?? null;
}

export async function getSessionSlugs(): Promise<string[]> {
  const all = await loadAll();
  return all.map((s) => s.frontmatter.slug);
}
