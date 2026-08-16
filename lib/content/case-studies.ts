import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cacheLife } from "next/cache";
import {
  caseStudyFrontmatterSchema,
  type CaseStudyFrontmatter,
} from "./schemas";

/*
 * Server-only loader. Reads `content/case-studies/*.mdx`, parses YAML
 * frontmatter, validates with zod. Throws (via Zod) at build time if any
 * frontmatter is malformed — that's the "build fails on malformed
 * frontmatter" DoD from spec §8 / Day 4.
 *
 * Caching: each helper memoizes within a single request via the directory
 * `mtime` check. Next.js statically renders /work routes so the cost is
 * paid once per build, not per request.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

export type CaseStudy = {
  frontmatter: CaseStudyFrontmatter;
  body: string;
  filePath: string;
};

/*
 * No module-level cache: in dev that pins the result across HMR and hides
 * new MDX files. In prod every route is statically prerendered, so this
 * function runs once per build and the disk reads are noise. Trust the
 * framework's cache layer.
 */
async function loadAll(): Promise<CaseStudy[]> {
  "use cache";
  cacheLife("max");
  const entries = await fs.readdir(CONTENT_DIR);
  const mdxFiles = entries.filter((name) => name.endsWith(".mdx"));
  const studies = await Promise.all(
    mdxFiles.map(async (filename) => {
      const filePath = path.join(CONTENT_DIR, filename);
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = matter(raw);
      const frontmatter = caseStudyFrontmatterSchema.parse({
        ...parsed.data,
        slug: parsed.data.slug ?? filename.replace(/\.mdx$/, ""),
      });
      return {
        frontmatter,
        body: parsed.content,
        filePath,
      } satisfies CaseStudy;
    }),
  );
  studies.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
  return studies;
}

export async function getAllCaseStudies(): Promise<CaseStudy[]> {
  return loadAll();
}

export async function getCaseStudyBySlug(
  slug: string,
): Promise<CaseStudy | null> {
  const all = await loadAll();
  return all.find((c) => c.frontmatter.slug === slug) ?? null;
}

export async function getCaseStudySlugs(): Promise<string[]> {
  const all = await loadAll();
  return all.map((c) => c.frontmatter.slug);
}
