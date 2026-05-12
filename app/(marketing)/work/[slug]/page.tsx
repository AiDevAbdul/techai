import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Container from "@/components/brand/Container";
import PlausiblePageEvent from "@/components/brand/PlausiblePageEvent";
import Pill from "@/components/ui/pill";
import Prose from "@/components/ui/prose";
import {
  getAllCaseStudies,
  getCaseStudyBySlug,
} from "@/lib/content/case-studies";

/*
 * /work/[slug] — case study renderer. Frame is the spec §7.3 template:
 *
 *  1. Hero strip (eyebrow + Fraunces title + 1-paragraph context)
 *  2. 3-up metric row (tabular numerals)
 *  3. Hero visual (SVG diagram from /public/diagrams)
 *  4-9. MDX body (problem / system / built / outcome / what-I'd-do-differently)
 *  10. Stack pill row + CTA band
 *
 * The MDX body owns sections 4–9 via H2s. The Pill row + CTA are fixed page
 * chrome — they don't belong in MDX because every case study needs them, and
 * the stack pills come from frontmatter, not body content.
 */

export async function generateStaticParams() {
  const studies = await getAllCaseStudies();
  return studies.map((s) => ({ slug: s.frontmatter.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) return {};
  const { title, summary, eyebrow } = study.frontmatter;
  const ogParams = new URLSearchParams({
    title,
    eyebrow: `${eyebrow} · case study`,
  });
  const ogUrl = `/og/case-study?${ogParams.toString()}`;
  return {
    title: `${title}`,
    description: summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title,
      description: summary,
      url: `/work/${slug}`,
      type: "article",
      images: [{ url: ogUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogUrl],
    },
    other: {
      "article:section": eyebrow,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  if (!study) notFound();

  const { frontmatter, body } = study;

  return (
    <main id="main" className="flex flex-1 flex-col">
      <PlausiblePageEvent event={`case_study_view_${frontmatter.slug}`} />
      {/* ── 1. Hero strip ─────────────────────────────────────────────── */}
      <Container as="section" className="pt-18 pb-12 lg:pt-26 lg:pb-16">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          {frontmatter.eyebrow}
        </p>
        <h1 className="serif text-ink mt-6 max-w-[24ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          {frontmatter.title}
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[60ch]">
          {frontmatter.summary}
        </p>
        <dl className="text-ink-secondary text-footnote mt-8 flex flex-wrap gap-x-8 gap-y-2">
          <div className="flex gap-2">
            <dt className="text-ink-secondary">Client</dt>
            <dd className="text-ink">{frontmatter.client}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-secondary">Duration</dt>
            <dd className="text-ink">{frontmatter.duration}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-secondary">Year</dt>
            <dd className="text-ink tabular-nums">{frontmatter.year}</dd>
          </div>
        </dl>
      </Container>

      {/* ── 2. 3-up metric row ────────────────────────────────────────── */}
      <Container as="section" className="pb-12">
        <ul className="border-separator grid grid-cols-1 gap-px overflow-hidden rounded-2xl border md:grid-cols-3 bg-separator" role="list">
          {frontmatter.metrics.map((m) => (
            <li
              key={m.label}
              className="bg-surface-elevated flex flex-col gap-2 p-8"
            >
              <p className="serif text-ink text-title2 tabular-nums tracking-[var(--track-title)]">
                {m.value}
              </p>
              <p className="text-ink-secondary text-footnote">{m.label}</p>
            </li>
          ))}
        </ul>
      </Container>

      {/* ── 3. Hero visual ────────────────────────────────────────────── */}
      <Container as="section" className="pb-22">
        <figure className="border-separator bg-surface-elevated overflow-hidden rounded-2xl border">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={frontmatter.heroDiagram}
              alt={`${frontmatter.title} — workflow architecture`}
              fill
              priority
              sizes="(min-width: 1024px) 1100px, 100vw"
              className="object-contain p-8"
            />
          </div>
          <figcaption className="border-separator text-ink-secondary text-caption border-t px-6 py-3">
            Architecture: sources → routing brain → resolution. Memory and
            audit trail run beneath.
          </figcaption>
        </figure>
      </Container>

      {/* ── 4-9. MDX body ────────────────────────────────────────────── */}
      <Container as="section" className="pb-22">
        <Prose>
          <MDXRemote source={body} />
        </Prose>
      </Container>

      {/* ── 10a. Stack pill row ───────────────────────────────────────── */}
      <Container as="section" className="pb-12">
        <div className="border-separator border-t pt-10">
          <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
            Stack
          </p>
          <ul className="mt-4 flex flex-wrap gap-2" role="list">
            {frontmatter.stack.map((tech) => (
              <li key={tech}>
                <Pill variant="code">{tech}</Pill>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      {/* ── 10b. Closing CTA ──────────────────────────────────────────── */}
      <section className="border-separator bg-surface-secondary border-t">
        <Container className="py-22">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[40ch]">
              <h2 className="serif text-ink text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] tracking-[var(--track-title)]">
                Book a similar engagement.
              </h2>
              <p className="text-ink-secondary text-callout mt-4">
                Thirty minutes, no pitch. We&rsquo;ll map your bottleneck
                against this template and decide if it&rsquo;s a fit.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-accent text-primary-foreground hover:bg-accent-hover plausible-event-name=cta_book_call inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-callout font-medium transition-colors duration-[var(--dur-fast)]"
            >
              Book a 30-min call
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
