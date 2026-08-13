import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Container from "@/components/brand/Container";
import ServicesNav from "@/components/brand/ServicesNav";
import Pill from "@/components/ui/pill";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SERVICES_SECTION_SCROLL_MARGIN } from "@/lib/services-nav-offset";
import {
  getAllMentorshipOffers,
  type Mentorship,
} from "@/lib/content/mentorship";

/*
 * /mentorship — spec §7.11 (amendment 2026-08-13).
 *
 * The page exists to answer one question without a reply from Abdul: "what do
 * you charge?" Every offer therefore shows a real PKR number. /services keeps
 * the corporate USD offer stack; this page is the local, priced ladder —
 * consultation → mentorship → team training → talks.
 *
 * Structure mirrors /services (hero → sticky nav → tier sections → closing
 * CTA) with three additions the individual audience needs: an audience
 * selector, one worked roadmap so "customized roadmap" is concrete, and an
 * explicit list of what is NOT promised — the buyers here have usually been
 * sold a job guarantee by someone before.
 */

export const metadata: Metadata = {
  title: "Mentorship & Training — 1:1 roadmaps into IT and AI",
  description:
    "One-to-one mentorship for professionals switching into IT and AI, team training for companies, and talks for communities. Transparent PKR pricing — consultation from PKR 10,000.",
  alternates: { canonical: "/mentorship" },
  openGraph: {
    title: "Mentorship & Training — Abdul Wahab",
    description:
      "Custom roadmaps into IT and AI for working professionals, team training, and community workshops. Prices published.",
    url: "/mentorship",
    type: "website",
  },
};

const SITE_URL = "https://abdulwahabai.com";

function offerJsonLd(offer: Mentorship) {
  const { frontmatter, body } = offer;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: frontmatter.name,
    serviceType: frontmatter.serviceType,
    description: body.replace(/\s+/g, " ").trim(),
    url: `${SITE_URL}/mentorship#${frontmatter.slug}`,
    provider: {
      "@type": "Person",
      name: "Abdul Wahab",
      url: SITE_URL,
    },
    areaServed: "PK",
    offers: {
      "@type": "Offer",
      price: String(frontmatter.priceValue),
      priceCurrency: frontmatter.priceCurrency,
      url: `${SITE_URL}${frontmatter.ctaHref}`,
      availability: "https://schema.org/InStock",
    },
  };
}

/* Who this is for — readers self-select here or leave. Naming the 40+
 * restarter explicitly is deliberate: most AI training in Pakistan quietly
 * assumes a 22-year-old CS graduate, and that assumption is the gap. */
const AUDIENCES = [
  {
    title: "Professionals switching in",
    body: "You have a career already — sales, finance, teaching, operations — and you can see where this is going. You want the shortest honest path from where you stand to paid work in IT or AI.",
  },
  {
    title: "Experienced people restarting",
    body: "You are past forty and every course you find seems written for someone half your age. You do not need a degree and you do not need to start over. You need a plan that respects what you already know.",
  },
  {
    title: "Teams and communities",
    body: "You are bringing a whole team onto AI tooling, or you run a university society, meetup, or incubator and want a working practitioner in the room instead of a slide deck about the future.",
  },
] as const;

/* One worked example. "Customized roadmap" is an abstraction until someone
 * sees a real six months laid out — this does more than three paragraphs of
 * promise. Anonymised; details changed. */
const ROADMAP_EXAMPLE = [
  {
    range: "Weeks 1–4",
    title: "Foundations, aimed at his own job",
    body: "Python basics taught entirely through export-order spreadsheets he already handles daily. Nothing abstract, nothing he could not use that same week.",
  },
  {
    range: "Weeks 5–8",
    title: "Automate the work he was already doing",
    body: "Scripts that pull order data, clean it, and generate the weekly report he used to build by hand. First visible win — four hours a week back.",
  },
  {
    range: "Weeks 9–16",
    title: "AI agents on real workflows",
    body: "An agent that drafts supplier follow-ups and flags delayed shipments. Built, broken, debugged, and rebuilt — which is the only way it sticks.",
  },
  {
    range: "Weeks 17–24",
    title: "Portfolio, positioning, first paid client",
    body: "Three shipped systems written up properly, a profile that reads like an operator rather than a beginner, and outreach to firms in his own industry — where his twelve years are an advantage, not a gap.",
  },
] as const;

const NOT_PROMISED = [
  "A job guarantee. Nobody honest can give you one, and anybody offering one is selling something else.",
  "Visa sponsorship, overseas placement, or introductions to employers abroad.",
  "Coaching you through interviews for work you cannot actually do. It fails at the probation stage and costs you more than the interview.",
  "Certificates that mean anything on their own. What you can build and show is the only credential that has ever mattered here.",
] as const;

const FAQ = [
  {
    q: "What language are sessions in?",
    a: "Whichever you are more comfortable in — English or Urdu, and in practice most one-to-one sessions run in both. Written materials and code are in English, because that is what you will meet in the work.",
  },
  {
    q: "Online or in person?",
    a: "One-to-one mentorship and consultations run online, so timezone and city are not a constraint. Team training and workshops run on-site anywhere in Pakistan or online, your choice; travel outside Lahore is billed at cost.",
  },
  {
    q: "What timings are available?",
    a: "Evenings and weekends are kept open specifically for people with full-time jobs. You pick a weekly slot at the start and we keep it, because a moving schedule is the fastest way for this to quietly stop happening.",
  },
  {
    q: "What if I miss a session?",
    a: "Tell me twenty-four hours ahead and we reschedule within the same month at no cost. A missed session with no notice is counted as used — that rule exists to protect the habit, not to catch you out.",
  },
  {
    q: "Can I pay monthly, or in instalments?",
    a: "Mentorship is billed month to month with no lock-in — you can stop before any cycle. For team training, payment is normally split across the program. If cost is genuinely the blocker, write to me and say so; a plan can usually be worked out.",
  },
  {
    q: "What do I need to have before starting?",
    a: "A laptop that can run a browser and a code editor comfortably — 8 GB of RAM is enough — a stable internet connection, and five to seven hours a week outside our sessions. No prior programming background is assumed.",
  },
  {
    q: "How do I know if this is worth it for me?",
    a: "Book the free twenty-minute fit call. If a group session, a free course, or simply reading for a month would serve you better, I will say so on that call. Sending someone away with the right advice has always been better business than taking a payment I do not deserve.",
  },
  {
    q: "Do you offer anything at reduced cost?",
    a: "Yes — reduced and free slots for student societies and non-profit community events, and reduced consultation rates for students. Ask, and be honest about your situation.",
  },
] as const;

export default async function MentorshipPage() {
  const offers = await getAllMentorshipOffers();
  const tabs = offers.map((o) => ({
    value: o.frontmatter.slug,
    label: o.frontmatter.tabLabel,
  }));

  return (
    <main id="main" className="flex flex-1 flex-col">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <Container as="section" className="pt-18 pb-14 lg:pt-26 lg:pb-18">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          Mentorship &amp; Training
        </p>
        <h1 className="serif text-ink mt-6 max-w-[20ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          A roadmap into IT and AI, written for your life.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[58ch] leading-[1.55]">
          You do not need a computer science degree. You do not need to be
          twenty-two. What you need is a plan built around the job you already
          have, the hours you actually get, and the years of experience nobody
          else is counting. Prices are below — all of them, in full.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/contact?topic=mentorship"
            className="bg-accent text-primary-foreground hover:bg-accent-hover plausible-event-name=cta_book_call inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-callout font-medium transition-colors duration-[var(--dur-fast)]"
          >
            Book a free 20-min fit call
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
          <Link
            href="#consultation"
            className="border-separator text-ink hover:bg-surface-secondary inline-flex items-center gap-2 rounded-pill border px-5 py-2.5 text-callout font-medium transition-colors duration-[var(--dur-fast)]"
          >
            See pricing
          </Link>
        </div>
      </Container>

      {/* ── Who this is for ────────────────────────────────────────────── */}
      <section
        aria-labelledby="audiences-heading"
        className="border-separator bg-surface-secondary border-t"
      >
        <Container className="py-18 lg:py-22">
          <h2
            id="audiences-heading"
            className="serif text-ink max-w-[24ch] text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] tracking-[var(--track-title)]"
          >
            Who this is for.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div
                key={a.title}
                className="border-separator bg-surface-elevated rounded-2xl border p-6 lg:p-7"
              >
                <h3 className="serif text-ink text-headline tracking-[var(--track-title)]">
                  {a.title}
                </h3>
                <p className="text-ink-secondary text-footnote mt-3 leading-[1.6]">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Sticky offer nav (client) ──────────────────────────────────── */}
      <ServicesNav options={tabs} ariaLabel="Mentorship offers" />

      {/* ── Offer sections ─────────────────────────────────────────────── */}
      <div>
        {offers.map((offer, i) => {
          const { frontmatter, body } = offer;
          return (
            <section
              key={frontmatter.slug}
              id={frontmatter.slug}
              aria-labelledby={`${frontmatter.slug}-heading`}
              className={
                i === 0
                  ? "pt-16 pb-16 lg:pt-20 lg:pb-20"
                  : "border-separator border-t pt-16 pb-16 lg:pt-20 lg:pb-20"
              }
              style={{ scrollMarginTop: `${SERVICES_SECTION_SCROLL_MARGIN}px` }}
            >
              <Container>
                <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
                  {/* Left rail — name, audience, format, pricing, CTA */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
                        {String(frontmatter.order).padStart(2, "0")}
                      </p>
                      <Pill>{frontmatter.audience}</Pill>
                    </div>
                    <h2
                      id={`${frontmatter.slug}-heading`}
                      className="serif text-ink mt-4 text-[clamp(2rem,4.5vw,3rem)] leading-[1.05] tracking-[var(--track-title)]"
                    >
                      {frontmatter.name}
                    </h2>
                    <p className="text-ink-secondary text-callout mt-5 max-w-[42ch] leading-[1.55]">
                      {body.replace(/\s+/g, " ").trim()}
                    </p>

                    <dl className="text-ink-secondary text-footnote mt-8 grid gap-y-3">
                      <div className="flex flex-col gap-1">
                        <dt className="text-ink-secondary text-caption tracking-[0.04em] uppercase">
                          Format
                        </dt>
                        <dd className="text-ink">{frontmatter.format}</dd>
                      </div>
                      <div className="flex flex-col gap-1">
                        <dt className="text-ink-secondary text-caption tracking-[0.04em] uppercase">
                          Duration
                        </dt>
                        <dd className="text-ink">{frontmatter.duration}</dd>
                      </div>
                      <div className="flex flex-col gap-1">
                        <dt className="text-ink-secondary text-caption tracking-[0.04em] uppercase">
                          Ideal for
                        </dt>
                        <dd className="text-ink max-w-[42ch] leading-[1.5]">
                          {frontmatter.idealFor}
                        </dd>
                      </div>
                    </dl>

                    <div className="border-separator mt-8 rounded-2xl border p-6">
                      <p className="text-ink-secondary text-caption tracking-[0.04em] uppercase">
                        Investment
                      </p>
                      <p className="serif text-ink mt-2 text-title3 tracking-[var(--track-title)]">
                        {frontmatter.priceLabel}
                      </p>
                      <p className="text-ink-secondary text-footnote mt-2 leading-[1.5]">
                        {frontmatter.priceDetail}
                      </p>
                      <Link
                        href={frontmatter.ctaHref}
                        className="bg-accent text-primary-foreground hover:bg-accent-hover mt-5 inline-flex items-center gap-2 rounded-pill px-4 py-2.5 text-footnote font-medium transition-colors duration-[var(--dur-fast)]"
                      >
                        {frontmatter.ctaLabel}
                        <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
                      </Link>
                    </div>
                  </div>

                  {/* Right rail — deliverables */}
                  <div className="lg:pt-2">
                    <p className="text-ink-secondary text-caption tracking-[0.04em] uppercase">
                      What you get
                    </p>
                    <ul className="mt-5 grid gap-3" role="list">
                      {frontmatter.deliverables.map((item) => (
                        <li
                          key={item}
                          className="border-separator bg-surface-elevated flex items-start gap-4 rounded-xl border px-5 py-4"
                        >
                          <span
                            aria-hidden
                            className="bg-accent-soft text-accent mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                          >
                            <Check size={13} strokeWidth={2.25} />
                          </span>
                          <span className="text-ink text-footnote leading-[1.55]">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Container>
              <script
                type="application/ld+json"
                // Per-offer Service + PKR Offer JSON-LD, one script per section.
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(offerJsonLd(offer)),
                }}
              />
            </section>
          );
        })}
      </div>

      {/* ── Worked roadmap example ─────────────────────────────────────── */}
      <section
        aria-labelledby="roadmap-heading"
        className="border-separator bg-surface-secondary border-t"
      >
        <Container className="py-18 lg:py-22">
          <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
            What a roadmap looks like
          </p>
          <h2
            id="roadmap-heading"
            className="serif text-ink mt-5 max-w-[26ch] text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] tracking-[var(--track-title)]"
          >
            Six months, one real person.
          </h2>
          <p className="text-ink-secondary text-callout mt-5 max-w-[58ch] leading-[1.55]">
            Thirty-eight, twelve years in textile export sales, no programming
            background, six hours a week after work. Details changed, shape
            kept. Yours will not look like this — that is rather the point.
          </p>

          <ol className="mt-12 grid gap-0" role="list">
            {ROADMAP_EXAMPLE.map((step, i) => (
              <li
                key={step.range}
                className={
                  i === 0
                    ? "border-separator grid gap-3 border-t py-7 sm:grid-cols-[10rem_1fr] sm:gap-10"
                    : "border-separator grid gap-3 border-t py-7 last:border-b sm:grid-cols-[10rem_1fr] sm:gap-10"
                }
              >
                <p className="text-ink-tertiary text-caption tabular-nums tracking-[0.04em] uppercase sm:pt-1">
                  {step.range}
                </p>
                <div>
                  <h3 className="serif text-ink text-headline tracking-[var(--track-title)]">
                    {step.title}
                  </h3>
                  <p className="text-ink-secondary text-footnote mt-2 max-w-[58ch] leading-[1.6]">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ── What I don't promise ───────────────────────────────────────── */}
      <section aria-labelledby="honest-heading" className="border-separator border-t">
        <Container className="py-18 lg:py-22">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <h2
                id="honest-heading"
                className="serif text-ink max-w-[18ch] text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] tracking-[var(--track-title)]"
              >
                What I don&rsquo;t promise.
              </h2>
              <p className="text-ink-secondary text-footnote mt-5 max-w-[38ch] leading-[1.6]">
                You have probably been promised some of these before. Here is
                where I am, plainly, so you can decide with the real terms in
                front of you.
              </p>
            </div>
            <ul className="grid gap-3" role="list">
              {NOT_PROMISED.map((item) => (
                <li
                  key={item}
                  className="border-separator bg-surface-elevated text-ink text-footnote rounded-xl border px-5 py-4 leading-[1.6]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── Logistics FAQ ──────────────────────────────────────────────── */}
      <section
        aria-labelledby="faq-heading"
        className="border-separator bg-surface-secondary border-t"
      >
        <Container className="py-18 lg:py-22">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div>
              <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
                Practical
              </p>
              <h2
                id="faq-heading"
                className="serif text-ink mt-5 max-w-[16ch] text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] tracking-[var(--track-title)]"
              >
                The questions people actually ask.
              </h2>
            </div>
            <div>
              <Accordion className="border-separator border-t border-b">
                {FAQ.map((item, i) => (
                  <AccordionItem
                    key={item.q}
                    value={`faq-${i}`}
                    className="border-separator !border-b last:!border-b-0"
                  >
                    <AccordionTrigger className="!flex w-full !items-baseline !justify-between gap-6 !py-5 !text-callout !font-medium !text-ink hover:!no-underline">
                      <span className="serif text-ink flex-1 text-left text-headline tracking-[var(--track-title)]">
                        {item.q}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-0">
                      <p className="text-ink-secondary text-body max-w-[58ch] pb-2 leading-[1.6]">
                        {item.a}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Closing CTA ────────────────────────────────────────────────── */}
      <section className="border-separator border-t">
        <Container className="py-22">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[42ch]">
              <h2 className="serif text-ink text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] tracking-[var(--track-title)]">
                Not sure which one?
              </h2>
              <p className="text-ink-secondary text-callout mt-4 leading-[1.55]">
                Twenty minutes on a call, free, no pitch. Tell me where you are
                and I will tell you what I would do in your position — including
                when that means not paying me anything.
              </p>
            </div>
            <Link
              href="/contact?topic=mentorship"
              className="bg-accent text-primary-foreground hover:bg-accent-hover plausible-event-name=cta_book_call inline-flex shrink-0 items-center gap-2 rounded-pill px-5 py-2.5 text-callout font-medium transition-colors duration-[var(--dur-fast)]"
            >
              Book a free fit call
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
        </Container>
      </section>

      {/* FAQ JSON-LD — the logistics answers are the page's most-searched
       * surface ("do you teach in Urdu", "is there a payment plan"). */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
    </main>
  );
}
