import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import Container from "@/components/brand/Container";
import UrduGreeting from "@/components/brand/UrduGreeting";

/*
 * /about — spec §7.9.
 *
 * Section order:
 *  1. Hero (eyebrow + H1 + standfirst)
 *  2. Three editorial paragraphs — duality / the work / the region
 *  3. Speaking / workshop photo (16:9, no headshot)
 *  4. Urdu video greeting (env-gated; placeholder until the recording lands)
 *  5. Closing CTA + raw email
 *  6. Person JSON-LD
 *
 * English-only UI in v1 per spec §1.1; the Urdu greeting is the only
 * Urdu surface. Full Urdu UI is v2.
 */

const SITE_URL = "https://abdulwahabai.com";
const OWNER_EMAIL = "aidevabdul@gmail.com";

export const metadata: Metadata = {
  title: "About — engineer who teaches",
  description:
    "Abdul Wahab — AI workflow consultant and educator. I build routed, observable AI systems for operators and teach the teams that run them.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Abdul Wahab",
    description:
      "Engineer who teaches. AI workflow systems for operators, teams, and communities — built and taught from inside the work.",
    url: "/about",
    type: "profile",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abdul Wahab",
  url: `${SITE_URL}/about`,
  jobTitle: "AI Workflow Consultant & Technical Educator",
  worksFor: {
    "@type": "Organization",
    name: "abdulwahabai.com",
    url: SITE_URL,
  },
  email: `mailto:${OWNER_EMAIL}`,
  knowsAbout: [
    "AI workflow automation",
    "Agentic systems",
    "Retrieval-augmented generation",
    "Prompt engineering",
    "Workflow architecture",
    "Technical training",
  ],
  knowsLanguage: ["English", "Urdu"],
  sameAs: [
    "https://www.linkedin.com/in/abdulwahab/",
    "https://github.com/abdulwahab",
    "https://x.com/abdulwahab",
  ],
} as const;

export default function AboutPage() {
  return (
    <main id="main" className="flex flex-1 flex-col">
      {/* ── 1. Hero ─────────────────────────────────────────────────────── */}
      <Container as="section" className="pt-18 pb-16 lg:pt-26 lg:pb-22">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          About
        </p>
        <h1 className="serif text-ink mt-6 max-w-[20ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          The engineer who teaches.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[58ch] leading-[1.55]">
          I build AI workflows for businesses, and I teach the people who run
          them how it works underneath. Both halves are the practice — neither
          works without the other.
        </p>
        <p className="text-ink-secondary text-footnote mt-8 inline-flex items-center gap-2">
          <MapPin size={14} strokeWidth={1.75} aria-hidden />
          Karachi, Pakistan · working with teams across South Asia and the GCC
        </p>
      </Container>

      {/* ── 2. Editorial body — three paragraphs ────────────────────────── */}
      <section
        aria-labelledby="story-heading"
        className="border-separator border-t"
      >
        <Container className="py-22">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <div>
              <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
                Practice
              </p>
              <h2
                id="story-heading"
                className="text-ink text-title2 mt-3 max-w-[18ch] tracking-[var(--track-title)]"
              >
                Built and taught from inside the work.
              </h2>
            </div>

            <div className="text-ink text-body max-w-[60ch] space-y-7 leading-[1.65]">
              <p>
                The two halves of the practice are inseparable. Every audit
                ends as a teaching moment for the team that has to maintain
                what gets shipped, and every workshop is grounded in a system
                that someone — usually me — actually built and watched run in
                production. I don&rsquo;t trust AI explainers from people who
                only ship slides, and I don&rsquo;t trust AI builds from
                people who can&rsquo;t explain them to a room of operators.
              </p>
              <p>
                My best engagements are with founders and ops leads who
                already know which step in their workflow is bleeding time.
                They need someone to name the bottleneck, sketch the
                architecture, and ship the system that retires it. Three
                shapes of work: a workflow audit (one-page hypothesis,
                two-week turn), a workflow build (production system, six to
                twelve weeks, observable from day one), or a workshop where
                your team learns to do the same exercise on the next
                workflow without me in the room.
              </p>
              <p>
                I work mostly with teams across South Asia and the GCC. The
                North American AI playbook does not translate cleanly into a
                Karachi accounts team or a Lahore marketing studio &mdash;
                not because the technology is different, but because the
                workflows, the labor economics, and the operator instincts
                are. That gap is not a translation problem; it&rsquo;s a
                design problem. Closing it is most of the work.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 3. Speaking / workshop photo ────────────────────────────────── */}
      <section
        aria-label="From a recent workshop"
        className="border-separator border-t"
      >
        <Container className="py-22">
          <figure className="border-separator bg-surface-elevated overflow-hidden rounded-2xl border">
            <div className="bg-surface-secondary relative aspect-[16/9] w-full">
              {/*
                * Real workshop photo lands once a clearance pass is done.
                * Drop the file at /public/about/speaking.jpg and replace this
                * placeholder with:
                *   <Image src="/about/speaking.jpg" alt="..." fill priority sizes="(min-width:1024px) 1100px, 100vw" className="object-cover" />
                */}
              <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
                <p className="text-ink-secondary text-caption max-w-[40ch]">
                  Workshop photo lands once the venue clears it for publication.
                </p>
              </div>
            </div>
            <figcaption className="border-separator text-ink-secondary text-caption border-t px-6 py-3">
              From a recent hands-on bootcamp &mdash; engineers and operators
              in the same room, shipping a routed workflow by end of day two.
            </figcaption>
          </figure>
        </Container>
      </section>

      {/* ── 4. Urdu greeting ────────────────────────────────────────────── */}
      <section
        aria-labelledby="greeting-heading"
        className="border-separator border-t"
      >
        <Container className="py-22">
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <div>
              <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
                Greeting
              </p>
              <h2
                id="greeting-heading"
                className="text-ink text-title2 mt-3 max-w-[18ch] tracking-[var(--track-title)]"
              >
                Hello, in Urdu.
              </h2>
              <p className="text-ink-secondary text-callout mt-5 max-w-[38ch] leading-[1.55]">
                The rest of the site is English, but a short greeting in
                Urdu is the most honest opening I can offer to teams across
                Pakistan and the wider region. English captions on by
                default.
              </p>
            </div>
            <UrduGreeting />
          </div>
        </Container>
      </section>

      {/* ── 5. Closing CTA + raw email ──────────────────────────────────── */}
      <section className="border-separator bg-surface-secondary border-t">
        <Container className="py-22">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[40ch]">
              <h2 className="serif text-ink text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] tracking-[var(--track-title)]">
                Want to talk?
              </h2>
              <p className="text-ink-secondary text-callout mt-4 leading-[1.55]">
                Book a 30-minute call &mdash; no pitch, just scoping &mdash;
                or write to me directly at{" "}
                <a
                  href={`mailto:${OWNER_EMAIL}`}
                  className="text-ink underline-offset-4 hover:underline"
                >
                  {OWNER_EMAIL}
                </a>
                .
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

      {/* ── 6. Person JSON-LD ───────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </main>
  );
}
