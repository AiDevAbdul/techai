import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/brand/Container";
import { getAllLabNotes } from "@/lib/content/lab-notes";

/*
 * Home — spec §7.1. All copy locked to spec; do not paraphrase without a spec
 * amendment + decisions-log entry.
 *
 * Section order (top → bottom): Hero · Who I work with · Recent Systems ·
 * How I work · Lab Notes · Closing CTA. Recent Systems is placeholder until
 * Day 4-5 wires the case-study pipeline. Lab Notes is empty-state until Day 9.
 */

export const metadata: Metadata = {
  title: "AI workflow systems for operators, teams, and communities",
  description:
    "Workflow automation, agentic systems, and team training — for companies that want AI in real operations, not slideshows.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Abdul Wahab — AI workflow systems for operators, teams, and communities",
    description:
      "Workflow automation, agentic systems, and team training — for companies that want AI in real operations, not slideshows.",
    url: "/",
    type: "website",
  },
};

const WHO = [
  {
    label: "Operators",
    href: "/services#audit",
    body: "Founders and ops leads who already know the bottleneck. We name it, route it, and ship the system that retires it.",
  },
  {
    label: "Teams",
    href: "/services#build",
    body: "Five-to-fifty-person teams adopting AI as routed workflow — not chat. Audit, build, train; observable from day one.",
  },
  {
    label: "Communities",
    href: "/services#workshop",
    body: "Bootcamps and workshops for educators, cohorts, and dev communities — Urdu-friendly when it helps the learner.",
  },
] as const;

const RECENT = [
  {
    slug: "meetplanner",
    eyebrow: "Operations · 2024",
    title: "MeetPlanner",
    outcome: "Cut scheduling friction 70% for distributed teams.",
    heroDiagram: "/diagrams/meetplanner-architecture.svg",
  },
  {
    slug: "marketing-dash",
    eyebrow: "Marketing · 2025",
    title: "Marketing Dashboard",
    outcome: "Daily channel reports drafted in 4 minutes, not 4 hours.",
    heroDiagram: "/diagrams/marketing-dash-architecture.svg",
  },
  {
    slug: "printing-press",
    eyebrow: "Manufacturing · 2025",
    title: "Printing Press",
    outcome: "Routed order intake → quote in under 90 seconds end-to-end.",
    heroDiagram: "/diagrams/printing-press-architecture.svg",
  },
] as const;

const STEPS = [
  {
    label: "Discovery",
    body: "30-minute call. We map the actual workflow on a whiteboard and name the two or three steps that bleed time.",
  },
  {
    label: "Audit",
    body: "One-page hypothesis: the problem, an architecture sketch, the stack, the risks, and the smallest next step worth taking.",
  },
  {
    label: "Build or Train",
    body: "Either I build the system end-to-end in weeks, or I run a workshop so your team can. Same playbook, two delivery modes.",
  },
] as const;

export default async function Home() {
  const latestNotes = (await getAllLabNotes()).slice(0, 3);
  return (
    <main id="main" className="flex flex-1 flex-col">
      {/* ── 1. Hero ───────────────────────────────────────────────────── */}
      <section className="relative">
        <Container className="pt-18 pb-22 lg:pt-26 lg:pb-30">
          <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
            AI workflows · Training · Talks
          </p>
          <h1 className="serif text-ink mt-6 max-w-[18ch] text-[clamp(2.75rem,8vw,5.5rem)] leading-[1.05] tracking-[var(--track-display)]">
            I help businesses turn repetitive work into AI workflows.
          </h1>
          <p className="text-ink-secondary text-callout mt-8 max-w-[52ch]">
            Workflow automation, agentic systems, and team training — for
            companies that want AI in real operations, not slideshows.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href="/contact"
              className="bg-accent text-primary-foreground hover:bg-accent-hover plausible-event-name=cta_book_call inline-flex items-center justify-center rounded-pill px-5 py-2.5 text-callout font-medium transition-colors duration-[var(--dur-fast)]"
            >
              Book a 30-min call
            </Link>
            <Link
              href="/services"
              className="text-ink hover:text-accent text-callout inline-flex items-center gap-1.5 font-medium transition-colors duration-[var(--dur-fast)]"
            >
              See how I work
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
          <p className="text-ink-secondary text-footnote mt-14 flex items-center gap-3">
            <span aria-hidden className="bg-separator-opaque h-px w-8" />
            Trusted by teams in manufacturing, marketing, SaaS
            <span aria-hidden className="bg-separator-opaque h-px w-8" />
          </p>
        </Container>
      </section>

      {/* ── 2. Who I work with ───────────────────────────────────────── */}
      <section className="border-separator border-t">
        <Container className="py-22">
          <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
            Who I work with
          </p>
          <h2 className="text-ink text-title2 mt-3 max-w-[26ch] tracking-[var(--track-title)]">
            Three audiences. One operating model.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {WHO.map((card) => (
              <Link
                key={card.label}
                href={card.href}
                className="group bg-surface-elevated border-separator hover:border-separator-opaque flex flex-col rounded-2xl border p-7 transition-colors duration-[var(--dur-med)]"
              >
                <p className="text-ink text-headline font-medium tracking-[var(--track-title)]">
                  {card.label}
                </p>
                <p className="text-ink-secondary text-footnote mt-3 leading-[1.55]">
                  {card.body}
                </p>
                <span className="text-accent text-footnote mt-6 inline-flex items-center gap-1.5 font-medium">
                  See the offer
                  <ArrowRight
                    size={14}
                    strokeWidth={1.75}
                    aria-hidden
                    className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. Recent Systems ────────────────────────────────────────── */}
      <section className="border-separator border-t">
        <Container className="py-22">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
                Recent systems
              </p>
              <h2 className="text-ink text-title2 mt-3 max-w-[26ch] tracking-[var(--track-title)]">
                Three workflows, three industries.
              </h2>
            </div>
            <Link
              href="/work"
              className="text-ink hover:text-accent text-footnote hidden items-center gap-1.5 font-medium transition-colors duration-[var(--dur-fast)] sm:inline-flex"
            >
              All work
              <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
          <ul className="mt-12 grid gap-6 md:grid-cols-3" role="list">
            {RECENT.map((tile) => (
              <li key={tile.slug}>
                <Link
                  href={`/work/${tile.slug}`}
                  className="group bg-surface-elevated border-separator hover:border-separator-opaque flex h-full flex-col overflow-hidden rounded-2xl border transition-colors duration-[var(--dur-med)]"
                >
                  <div
                    aria-hidden
                    className="bg-surface-secondary border-separator relative aspect-[16/10] w-full overflow-hidden border-b"
                  >
                    <Image
                      src={tile.heroDiagram}
                      alt={`${tile.title} — workflow architecture`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-contain p-6"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
                      {tile.eyebrow}
                    </p>
                    <p className="serif text-ink text-headline mt-2 tracking-[-0.01em]">
                      {tile.title}
                    </p>
                    <p className="text-ink-secondary text-footnote mt-3 flex-1 leading-[1.55]">
                      {tile.outcome}
                    </p>
                    <span className="text-accent text-footnote mt-5 inline-flex items-center gap-1.5 font-medium">
                      Read the case study
                      <ArrowRight
                        size={14}
                        strokeWidth={1.75}
                        aria-hidden
                        className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── 4. How I work ────────────────────────────────────────────── */}
      <section className="border-separator border-t">
        <Container className="py-22">
          <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
            How I work
          </p>
          <h2 className="text-ink text-title2 mt-3 max-w-[28ch] tracking-[var(--track-title)]">
            Three steps from &ldquo;we should use AI&rdquo; to a system running in production.
          </h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-3" role="list">
            {STEPS.map((step, i) => (
              <li key={step.label} className="flex flex-col">
                <p className="text-accent text-caption tabular-nums font-medium tracking-[0.08em] uppercase">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <p className="text-ink text-title3 mt-3 font-medium tracking-[var(--track-title)]">
                  {step.label}
                </p>
                <p className="text-ink-secondary text-body mt-3 max-w-[36ch] leading-[1.55]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── 5. Lab Notes (latest 3) ──────────────────────────────────── */}
      <section className="border-separator border-t">
        <Container className="py-22">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
                Lab Notes
              </p>
              <h2 className="text-ink text-title2 mt-3 tracking-[var(--track-title)]">
                Writing from inside the work.
              </h2>
            </div>
            <Link
              href="/lab"
              className="text-ink hover:text-accent text-footnote hidden items-center gap-1.5 font-medium transition-colors duration-[var(--dur-fast)] sm:inline-flex"
            >
              All notes
              <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
          {latestNotes.length === 0 ? (
            <div className="border-separator mt-12 rounded-2xl border border-dashed p-10 text-center">
              <p className="text-ink-secondary text-callout max-w-[44ch] mx-auto">
                First notes land soon.
              </p>
            </div>
          ) : (
            <ul className="mt-12 grid gap-6 md:grid-cols-3" role="list">
              {latestNotes.map((n) => (
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
          )}
        </Container>
      </section>

      {/* ── 6. Closing CTA band ──────────────────────────────────────── */}
      <section className="border-separator bg-surface-secondary border-t">
        <Container className="py-22">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[34ch]">
              <h2 className="serif text-ink text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] tracking-[var(--track-title)]">
                Want a workflow audit?
              </h2>
              <p className="text-ink-secondary text-callout mt-4">
                Thirty minutes, no pitch. We&rsquo;ll map the bottleneck and decide
                if it&rsquo;s worth automating.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-accent text-primary-foreground hover:bg-accent-hover plausible-event-name=cta_book_call inline-flex items-center justify-center rounded-pill px-5 py-2.5 text-callout font-medium transition-colors duration-[var(--dur-fast)]"
            >
              Book a 30-min call
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
