import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Sparkles, Users, Wrench } from "lucide-react";
import Container from "@/components/brand/Container";
import Pill from "@/components/ui/pill";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import WorkshopInquiryForm from "@/components/forms/WorkshopInquiryForm";
import DistrictSessionForm from "@/components/forms/DistrictSessionForm";
import {
  getWorkshopTopics,
  getPastEngagements,
} from "@/lib/content/workshops";
import { getTopDistricts } from "@/lib/db/district-registrations";

/*
 * Top-districts list is uncached, live DB data — under Cache Components it
 * must sit behind its own Suspense boundary so it doesn't force the whole
 * /workshops route to render dynamically.
 */
async function TopDistrictsList() {
  const topDistricts = await getTopDistricts(5);
  if (topDistricts.length === 0) {
    return (
      <p className="text-ink-secondary text-footnote mt-4">
        Registrations open — check back soon.
      </p>
    );
  }
  return (
    <ol className="border-separator divide-separator mt-4 divide-y border-y" role="list">
      {topDistricts.map((d, i) => (
        <li
          key={d.district}
          className="flex items-baseline justify-between gap-4 py-3"
        >
          <span className="text-ink text-footnote flex items-baseline gap-3">
            <span className="text-ink-tertiary text-caption tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            {d.district}
          </span>
          <span className="text-ink-secondary text-caption tabular-nums">
            {d.count} {d.count === 1 ? "registration" : "registrations"}
          </span>
        </li>
      ))}
    </ol>
  );
}

function TopDistrictsSkeleton() {
  return (
    <div
      className="border-separator mt-4 h-[8.5rem] animate-pulse border-y bg-[color:var(--surface-secondary)]"
      aria-hidden
    />
  );
}

/*
 * /workshops — spec §7.5.
 *
 * Section order:
 *  1. Hero
 *  2. Three format cards (Executive briefing / Team workshop / Hands-on bootcamp)
 *  3. Topics catalog accordion (10–15 items, from content/workshops/topics.mdx)
 *  4. Past engagements dated list (≥3, from content/workshops/past-engagements.mdx)
 *  5. Outcomes ("teams leave with…")
 *  6. District registration ("Bring this to your district") — Server Action →
 *     Supabase Postgres, top-5-by-demand list rendered live from the DB
 *  7. Inquiry form (Server Action → Resend)
 *
 * The optional testimonial slot (spec §7.5 item 6) is dropped per the
 * task contract: Q3 (which testimonials we have permission to publish) is
 * unresolved. Adding a placeholder testimonial would be slideware. The
 * outcomes section carries the trust beat instead.
 */

export const metadata: Metadata = {
  title: "Workshops & Speaking — AI training for teams",
  description:
    "Three formats, one playbook: executive briefings, team workshops, and hands-on bootcamps that ship working AI workflows by end of day.",
  alternates: { canonical: "/workshops" },
  openGraph: {
    title: "Workshops & Speaking — Abdul Wahab",
    description:
      "Hands-on AI workshops for teams. Executive briefings, team workshops, and bootcamps that ship — not slideware.",
    url: "/workshops",
    type: "website",
  },
};

const FORMAT_CARDS = [
  {
    icon: Sparkles,
    eyebrow: "Format 01",
    title: "Executive briefing",
    duration: "60–90 minutes",
    audience: "Leadership · Founders · Boards",
    body: "A non-technical session that names what AI can and cannot do for your business in the next 12 months. The deck is yours to keep; the bias against slideware is mine.",
    bullets: [
      "Real frameworks for evaluating AI initiatives",
      "Honest take on what's hype vs. what ships",
      "Q&A grounded in your actual stack",
    ],
  },
  {
    icon: Users,
    eyebrow: "Format 02",
    title: "Team workshop",
    duration: "Half-day to 2 days",
    audience: "5–50 people · cross-functional",
    body: "Curriculum built around your real workflows. Engineers, ops, and product in the same room. Every participant ships a working AI workflow they can run on Monday.",
    bullets: [
      "Tailored to two or three workflows you already run",
      "Hands-on labs over lectures — code or no-code",
      "30-day async follow-up included",
    ],
  },
  {
    icon: Wrench,
    eyebrow: "Format 03",
    title: "Hands-on bootcamp",
    duration: "2–5 days",
    audience: "Engineers · Operators · Builders",
    body: "The full builder track. Eval-first development, routing brains, prompt caching, observability — the production trio plus everything else needed to ship agents that survive contact with users.",
    bullets: [
      "Live build of a routed workflow end-to-end",
      "Cost, latency, and quality dashboards from day one",
      "Repository you can deploy the next morning",
    ],
  },
] as const;

const OUTCOMES = [
  "A working AI workflow built around a real bottleneck — not a hypothetical demo.",
  "A shared vocabulary so engineering, ops, and leadership argue about the right things.",
  "An operator playbook: the team can run the same exercise on a new workflow without me.",
  "A 30-day async follow-up channel — questions answered, code reviewed, blockers unblocked.",
] as const;

function formatEngagementDate(date: string): string {
  // Accepts YYYY-MM or YYYY-MM-DD; renders as "Mar 2026" or "Mar 14, 2026".
  const [y, m, d] = date.split("-");
  if (!y || !m) return date;
  const month = new Date(Number(y), Number(m) - 1, 1).toLocaleString("en-US", {
    month: "short",
  });
  if (d) return `${month} ${Number(d)}, ${y}`;
  return `${month} ${y}`;
}

export default async function WorkshopsPage() {
  const [topics, engagements] = await Promise.all([
    getWorkshopTopics(),
    getPastEngagements(),
  ]);

  return (
    <main id="main" className="flex flex-1 flex-col">
      {/* ── 1. Hero ───────────────────────────────────────────────────── */}
      <Container as="section" className="pt-18 pb-16 lg:pt-26 lg:pb-22">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          Workshops · Speaking
        </p>
        <h1 className="serif text-ink mt-6 max-w-[22ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          Train your team. Talk to your community.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[58ch]">
          Three formats — executive briefing, team workshop, hands-on bootcamp.
          One playbook in all three rooms: name the bottleneck, sketch the
          architecture, ship a system you can audit. Urdu-friendly when it
          helps the learner.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href="#inquiry"
            className="bg-accent text-primary-foreground hover:bg-accent-hover inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-callout font-medium transition-colors duration-[var(--dur-fast)]"
          >
            Request a workshop
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
          <Link
            href="#topics"
            className="text-ink hover:text-accent text-callout inline-flex items-center gap-1.5 font-medium transition-colors duration-[var(--dur-fast)]"
          >
            Browse topics
            <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>
      </Container>

      {/* ── 2. Three format cards ─────────────────────────────────────── */}
      <section
        id="formats"
        aria-labelledby="formats-heading"
        className="border-separator border-t"
      >
        <Container className="py-22">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
                Formats
              </p>
              <h2
                id="formats-heading"
                className="text-ink text-title2 mt-3 max-w-[30ch] tracking-[var(--track-title)]"
              >
                Three shapes for the same playbook.
              </h2>
            </div>
            <p className="text-ink-secondary text-footnote max-w-[36ch]">
              Not sure which fits? Pick the closest in the form below — we
              decide together on a planning call.
            </p>
          </div>

          <ul className="mt-14 grid gap-6 md:grid-cols-3" role="list">
            {FORMAT_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <li
                  key={card.title}
                  className="bg-surface-elevated border-separator flex h-full flex-col rounded-2xl border p-7"
                >
                  <span
                    aria-hidden
                    className="bg-accent-soft text-accent flex h-10 w-10 items-center justify-center rounded-xl"
                  >
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <p className="text-accent text-eyebrow mt-6 font-medium tracking-[var(--track-eyebrow)] uppercase">
                    {card.eyebrow}
                  </p>
                  <h3 className="serif text-ink text-headline mt-2 tracking-[var(--track-title)]">
                    {card.title}
                  </h3>
                  <dl className="text-ink-secondary text-caption mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5">
                    <dt className="text-ink-secondary">Duration</dt>
                    <dd className="text-ink">{card.duration}</dd>
                    <dt className="text-ink-secondary">For</dt>
                    <dd className="text-ink">{card.audience}</dd>
                  </dl>
                  <p className="text-ink-secondary text-footnote mt-5 leading-[1.55]">
                    {card.body}
                  </p>
                  <ul
                    className="text-ink-secondary text-footnote mt-5 grid gap-2 leading-[1.5]"
                    role="list"
                  >
                    {card.bullets.map((b) => (
                      <li
                        key={b}
                        className="before:bg-accent flex gap-3 before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full"
                      >
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* ── 3. Topics catalog (accordion) ─────────────────────────────── */}
      <section
        id="topics"
        aria-labelledby="topics-heading"
        className="border-separator border-t"
      >
        <Container className="py-22">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div>
              <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
                Topics
              </p>
              <h2
                id="topics-heading"
                className="text-ink text-title2 mt-3 max-w-[18ch] tracking-[var(--track-title)]"
              >
                Twelve sessions you can mix into any format.
              </h2>
              <p className="text-ink-secondary text-callout mt-5 max-w-[42ch] leading-[1.55]">
                Pick two or three for a workshop, six to ten for a bootcamp.
                Every topic adapts to your stack — these summaries are the
                starting point, not the script.
              </p>
              <p className="text-ink-secondary text-footnote mt-8">
                Don&rsquo;t see what you need?{" "}
                <Link
                  href="#inquiry"
                  className="text-accent underline-offset-4 hover:underline"
                >
                  Tell me in the inquiry form
                </Link>{" "}
                — most engagements end up with at least one bespoke topic.
              </p>
            </div>

            <div>
              <Accordion className="border-separator border-t border-b">
                {topics.map((topic, i) => (
                  <AccordionItem
                    key={topic.title}
                    value={`topic-${i}`}
                    className="border-separator !border-b last:!border-b-0"
                  >
                    <AccordionTrigger className="!flex w-full !items-baseline !justify-between gap-6 !py-5 !text-callout !font-medium !text-ink hover:!no-underline">
                      <span className="flex flex-1 flex-col items-start gap-1.5 text-left">
                        <span className="text-ink-tertiary text-caption tabular-nums font-normal">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="serif text-ink text-headline tracking-[var(--track-title)]">
                          {topic.title}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-0">
                      <div className="grid gap-4 pb-2 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-10">
                        <p className="text-ink-secondary text-body max-w-[58ch] leading-[1.6]">
                          {topic.summary}
                        </p>
                        <Pill className="!whitespace-normal sm:!whitespace-nowrap">
                          {topic.audience}
                        </Pill>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 4. Past engagements ───────────────────────────────────────── */}
      <section
        id="engagements"
        aria-labelledby="engagements-heading"
        className="border-separator border-t"
      >
        <Container className="py-22">
          <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
            Past engagements
          </p>
          <h2
            id="engagements-heading"
            className="text-ink text-title2 mt-3 max-w-[26ch] tracking-[var(--track-title)]"
          >
            Where the playbook has run before.
          </h2>

          <ul
            className="border-separator divide-separator mt-12 divide-y border-y"
            role="list"
          >
            {engagements.map((e) => (
              <li
                key={`${e.date}-${e.org}-${e.title}`}
                className="grid gap-3 py-7 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-10"
              >
                <p className="text-ink-secondary text-eyebrow tabular-nums tracking-[var(--track-eyebrow)] uppercase">
                  {formatEngagementDate(e.date)}
                </p>
                <div>
                  <p className="serif text-ink text-headline tracking-[var(--track-title)]">
                    {e.title}
                  </p>
                  <p className="text-ink-secondary text-footnote mt-2">
                    {e.org} · {e.format}
                  </p>
                </div>
                <p className="text-ink-secondary text-caption sm:text-right">
                  {e.audience}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── 5. Outcomes ───────────────────────────────────────────────── */}
      <section
        aria-labelledby="outcomes-heading"
        className="border-separator border-t"
      >
        <Container className="py-22">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
            <div>
              <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
                Outcomes
              </p>
              <h2
                id="outcomes-heading"
                className="text-ink text-title2 mt-3 max-w-[20ch] tracking-[var(--track-title)]"
              >
                Teams leave with working systems, not notebooks of theory.
              </h2>
              <p className="text-ink-secondary text-callout mt-5 max-w-[40ch] leading-[1.55]">
                The bias in every room is the same: ship something on day
                one. Theory follows the working artifact, not the other way
                round.
              </p>
            </div>
            <ul className="grid gap-4" role="list">
              {OUTCOMES.map((outcome, i) => (
                <li
                  key={outcome}
                  className="border-separator bg-surface-elevated flex items-start gap-5 rounded-2xl border px-6 py-5"
                >
                  <span
                    aria-hidden
                    className="text-accent text-caption tabular-nums mt-0.5 font-medium"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-ink text-body leading-[1.55]">
                    {outcome}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* ── 6. District registration ──────────────────────────────────── */}
      <section
        id="districts"
        aria-labelledby="districts-heading"
        className="border-separator border-t"
      >
        <Container className="py-22">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div>
              <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
                Districts
              </p>
              <h2
                id="districts-heading"
                className="serif text-ink mt-4 max-w-[18ch] text-[clamp(2rem,4.5vw,3rem)] leading-[1.05] tracking-[var(--track-title)]"
              >
                Bring this to your district.
              </h2>
              <p className="text-ink-secondary text-callout mt-5 max-w-[40ch] leading-[1.55]">
                Register your interest — online or onsite — and I&rsquo;ll
                schedule the next &ldquo;Effective Use of AI&rdquo; session
                where demand is highest, starting with KP.
              </p>

              <div className="mt-10">
                <p className="text-ink text-caption tracking-[0.04em] uppercase">
                  Top districts by demand
                </p>
                <Suspense fallback={<TopDistrictsSkeleton />}>
                  <TopDistrictsList />
                </Suspense>
              </div>
            </div>

            <div className="bg-surface-elevated border-separator rounded-2xl border p-7 lg:p-10">
              <DistrictSessionForm />
            </div>
          </div>
        </Container>
      </section>

      {/* ── 7. Inquiry form ───────────────────────────────────────────── */}
      <section
        id="inquiry"
        aria-labelledby="inquiry-heading"
        className="border-separator bg-surface-secondary border-t"
      >
        <Container className="py-22">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
            <div>
              <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
                Request a workshop
              </p>
              <h2
                id="inquiry-heading"
                className="serif text-ink mt-4 max-w-[18ch] text-[clamp(2rem,4.5vw,3rem)] leading-[1.05] tracking-[var(--track-title)]"
              >
                Tell me about the room.
              </h2>
              <p className="text-ink-secondary text-callout mt-5 max-w-[40ch] leading-[1.55]">
                Five fields, two minutes. I&rsquo;ll reply with either a
                30-minute planning slot or a few clarifying questions —
                always within two business days.
              </p>
              <dl className="text-ink-secondary text-footnote mt-10 grid gap-5">
                <div>
                  <dt className="text-ink text-caption tracking-[0.04em] uppercase">
                    Travel
                  </dt>
                  <dd className="mt-2 max-w-[36ch] leading-[1.55]">
                    Peshawar-based. On-site in Pakistan, GCC, and remote
                    anywhere. Outside that, ask.
                  </dd>
                </div>
                <div>
                  <dt className="text-ink text-caption tracking-[0.04em] uppercase">
                    Languages
                  </dt>
                  <dd className="mt-2 max-w-[36ch] leading-[1.55]">
                    English by default · Urdu on request for South Asian
                    rooms.
                  </dd>
                </div>
                <div>
                  <dt className="text-ink text-caption tracking-[0.04em] uppercase">
                    Prefer a call first?
                  </dt>
                  <dd className="mt-2 max-w-[36ch] leading-[1.55]">
                    <Link
                      href="/contact"
                      className="text-accent underline-offset-4 hover:underline"
                    >
                      Book a 30-min slot
                    </Link>{" "}
                    instead — no pitch, just scoping.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-surface-elevated border-separator rounded-2xl border p-7 lg:p-10">
              <WorkshopInquiryForm />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
