import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Container from "@/components/brand/Container";
import PlausiblePageEvent from "@/components/brand/PlausiblePageEvent";
import Prose from "@/components/ui/prose";
import CodeBlock from "@/components/lab/CodeBlock";
import SubscribeForm from "@/components/lab/SubscribeForm";
import {
  extractToc,
  getAllLabNotes,
  getLabNoteBySlug,
  relatedNotes,
  slugifyHeading,
} from "@/lib/content/lab-notes";

/*
 * /lab/[slug] — Lab Note renderer (spec §7.7).
 *
 * Layout:
 *   ≥1024px: side-rail TOC (left) + reading rail max-w-[68ch] (right)
 *   <1024px: single column; TOC collapses to a hidden disclosure (skip in v1
 *           — the notes are short and the rail surplus to value on mobile)
 *
 * MDX wiring:
 *   - `pre` → custom <CodeBlock> with copy button (no line numbers)
 *   - `h2`  → injects `id={slugifyHeading(children)}` so TOC anchors line up
 *
 * Post footer: 2 related notes (chronologically adjacent) + inline
 * single-field subscribe form. Article JSON-LD per note.
 */

const SITE_URL = "https://abdulwahabai.com";

export async function generateStaticParams() {
  const notes = await getAllLabNotes();
  return notes.map((n) => ({ slug: n.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = await getLabNoteBySlug(slug);
  if (!note) return {};
  const { title, summary, category, readingTime } = note.frontmatter;
  const ogParams = new URLSearchParams({
    title,
    eyebrow: `Lab note · ${category}`,
    meta: `${readingTime} min read`,
  });
  const ogUrl = `/og/lab-note?${ogParams.toString()}`;
  return {
    title,
    description: summary,
    alternates: { canonical: `/lab/${slug}` },
    openGraph: {
      title,
      description: summary,
      url: `/lab/${slug}`,
      type: "article",
      publishedTime: note.frontmatter.date,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogUrl],
    },
  };
}

function readChildrenText(children: unknown): string {
  if (typeof children === "string" || typeof children === "number")
    return String(children);
  if (Array.isArray(children)) return children.map(readChildrenText).join("");
  if (children && typeof children === "object" && "props" in children) {
    const props = (children as { props?: { children?: unknown } }).props;
    if (props && "children" in props) return readChildrenText(props.children);
  }
  return "";
}

function H2({
  children,
  ...rest
}: { children?: React.ReactNode } & React.HTMLAttributes<HTMLHeadingElement>) {
  const id = slugifyHeading(readChildrenText(children));
  return (
    <h2 id={id} {...rest}>
      {children}
    </h2>
  );
}

export default async function LabNotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = await getLabNoteBySlug(slug);
  if (!note) notFound();

  const all = await getAllLabNotes();
  const related = relatedNotes(note, all);
  const toc = extractToc(note.body);
  const { frontmatter, body } = note;

  const publishedDate = new Date(frontmatter.date);
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.summary,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: {
      "@type": "Person",
      name: "Abdul Wahab",
      url: `${SITE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "abdulwahabai.com",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/lab/${slug}`,
    },
    articleSection: frontmatter.category,
  };

  return (
    <main id="main" className="flex flex-1 flex-col">
      <PlausiblePageEvent event={`lab_note_view_${frontmatter.slug}`} />
      {/* ── Hero strip ─────────────────────────────────────────────────── */}
      <Container as="section" className="pt-14 pb-10 lg:pt-22 lg:pb-14">
        <Link
          href="/lab"
          className="text-ink-secondary hover:text-ink text-footnote inline-flex items-center gap-1.5 transition-colors duration-[var(--dur-fast)]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
          All Lab Notes
        </Link>
        <p className="text-ink-secondary text-eyebrow mt-10 tabular-nums tracking-[var(--track-eyebrow)] uppercase">
          <time dateTime={frontmatter.date}>{formattedDate}</time>
          <span aria-hidden className="mx-2">·</span>
          {frontmatter.category}
          <span aria-hidden className="mx-2">·</span>
          {frontmatter.readingTime} min read
        </p>
        <h1 className="serif text-ink mt-4 max-w-[24ch] text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.08] tracking-[var(--track-display)]">
          {frontmatter.title}
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[56ch] leading-[1.55]">
          {frontmatter.summary}
        </p>
      </Container>

      {/* ── Body with side-rail TOC ───────────────────────────────────── */}
      <Container as="section" className="pb-22">
        <div className="grid gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
          {toc.length > 0 ? (
            <aside
              aria-label="On this page"
              className="hidden lg:block"
            >
              <div className="sticky top-24">
                <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
                  On this page
                </p>
                <ol className="mt-4 space-y-2" role="list">
                  {toc.map((entry) => (
                    <li key={entry.id}>
                      <a
                        href={`#${entry.id}`}
                        className="text-ink-secondary hover:text-accent text-footnote leading-[1.4] transition-colors duration-[var(--dur-fast)]"
                      >
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          ) : (
            <div className="hidden lg:block" aria-hidden />
          )}

          <Prose>
            <MDXRemote
              source={body}
              components={{
                h2: H2,
                pre: CodeBlock,
              }}
            />
          </Prose>
        </div>
      </Container>

      {/* ── Related notes ──────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="border-separator border-t"
        >
          <Container className="py-18">
            <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
              Keep reading
            </p>
            <h2
              id="related-heading"
              className="text-ink text-title2 mt-3 tracking-[var(--track-title)]"
            >
              Related notes
            </h2>
            <ul
              className="mt-10 grid gap-6 md:grid-cols-2"
              role="list"
            >
              {related.map((n) => (
                <li key={n.frontmatter.slug}>
                  <Link
                    href={`/lab/${n.frontmatter.slug}`}
                    className="group bg-surface-elevated border-separator hover:border-separator-opaque flex h-full flex-col rounded-2xl border p-7 transition-colors duration-[var(--dur-med)]"
                  >
                    <p className="text-ink-secondary text-eyebrow tabular-nums tracking-[var(--track-eyebrow)] uppercase">
                      {n.frontmatter.category}
                      <span aria-hidden className="mx-2">·</span>
                      {n.frontmatter.readingTime} min
                    </p>
                    <p className="serif text-ink text-headline mt-3 tracking-[var(--track-title)]">
                      {n.frontmatter.title}
                    </p>
                    <p className="text-ink-secondary text-footnote mt-3 flex-1 leading-[1.55]">
                      {n.frontmatter.summary}
                    </p>
                    <span className="text-accent text-footnote mt-5 inline-flex items-center gap-1.5 font-medium">
                      Read note
                      <ArrowRight
                        size={14}
                        strokeWidth={1.75}
                        aria-hidden
                        className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* ── Inline subscribe ───────────────────────────────────────────── */}
      <section
        aria-labelledby="subscribe-heading"
        className="border-separator bg-surface-secondary border-t"
      >
        <Container className="py-18">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
                Subscribe
              </p>
              <h2
                id="subscribe-heading"
                className="serif text-ink mt-3 max-w-[20ch] text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] tracking-[var(--track-title)]"
              >
                Next note in your inbox.
              </h2>
              <p className="text-ink-secondary text-callout mt-4 max-w-[40ch] leading-[1.55]">
                One short essay every two weeks. No tracking pixels, no
                drip. Just the next note when it&rsquo;s ready.
              </p>
            </div>
            <div className="max-w-[36rem]">
              <SubscribeForm />
            </div>
          </div>
        </Container>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </main>
  );
}
