import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cacheLife } from "next/cache";
import {
  serviceFrontmatterSchema,
  type ServiceFrontmatter,
} from "./schemas";

/*
 * Server-only loader for `content/services/*.mdx`. Mirrors the case-study
 * loader: read directory, parse frontmatter, validate with zod, sort by
 * `order`. Build fails on malformed frontmatter — same DoD contract as
 * Day 4 case studies.
 *
 * The MDX body for a service is a short positioning paragraph (1–2
 * sentences) rendered on the tier card. Structured fields (price, format,
 * deliverables) live in frontmatter so the layout owns visual hierarchy.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "services");

export type Service = {
  frontmatter: ServiceFrontmatter;
  body: string;
  filePath: string;
};

async function loadAll(): Promise<Service[]> {
  "use cache";
  cacheLife("max");
  const entries = await fs.readdir(CONTENT_DIR);
  const mdxFiles = entries.filter((name) => name.endsWith(".mdx"));
  const services = await Promise.all(
    mdxFiles.map(async (filename) => {
      const filePath = path.join(CONTENT_DIR, filename);
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = matter(raw);
      const frontmatter = serviceFrontmatterSchema.parse({
        ...parsed.data,
        slug: parsed.data.slug ?? filename.replace(/\.mdx$/, ""),
      });
      return {
        frontmatter,
        body: parsed.content.trim(),
        filePath,
      } satisfies Service;
    }),
  );
  services.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
  return services;
}

export async function getAllServices(): Promise<Service[]> {
  return loadAll();
}
