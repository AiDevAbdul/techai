import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Container from "@/components/brand/Container";

/*
 * Root 404 — spec §5 idiom, same editorial rail as /about and /work.
 *
 * This file covers two cases at once (Next.js 16, app/not-found.tsx):
 *  1. Any URL that matches no route at all (/nope, /work/xyz/deeper).
 *  2. Any `notFound()` thrown in a segment that has no closer not-found.tsx —
 *     i.e. /work/[slug], /lab/[slug], /learn/[course], /learn/[course]/[lesson]
 *     and /sessions/[slug]. There is exactly one layout in the app
 *     (app/layout.tsx), and the (marketing)/(lab) route groups add none, so
 *     this page already renders inside Navbar + Footer. A group-level
 *     not-found.tsx would duplicate this file without adding chrome — so we
 *     deliberately don't ship one.
 *
 * No dynamic APIs are read here, so it prerenders cleanly under
 * `cacheComponents` and no loading.tsx / Suspense boundary is needed.
 *
 * Dead end → the four routes that carry the conversion model: proof (Work),
 * offer (Services), the free tier (Learn), and the ask (Contact).
 */

const DESTINATIONS = [
  {
    href: "/work",
    label: "Work",
    description: "Three case studies — the systems, the constraints, the numbers.",
  },
  {
    href: "/services",
    label: "Services",
    description: "Workflow audits, production builds, and team workshops.",
  },
  {
    href: "/learn",
    label: "Learn",
    description: "Courses and lessons on agentic AI, Python, and workflow design.",
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Book a 30-minute scoping call or request a workshop.",
  },
] as const;

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 flex-col">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <Container as="section" className="pt-18 pb-16 lg:pt-26 lg:pb-20">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          404
        </p>
        <h1 className="serif text-ink mt-6 max-w-[20ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          This page isn&rsquo;t here.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[54ch] leading-[1.55]">
          The address may have changed, or the link that brought you here was
          incomplete. Everything below is one click away.
        </p>
      </Container>

      {/* ── Ways forward ────────────────────────────────────────────────── */}
      <section aria-labelledby="elsewhere-heading" className="border-separator border-t">
        <Container className="py-16 lg:py-22">
          <h2
            id="elsewhere-heading"
            className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase"
          >
            Try one of these
          </h2>

          <ul className="divide-separator border-separator mt-8 divide-y border-y" role="list">
            {DESTINATIONS.map((destination) => (
              <li key={destination.href}>
                <Link
                  href={destination.href}
                  className="group flex flex-col gap-2 py-7 transition-colors duration-[var(--dur-fast)] sm:flex-row sm:items-baseline sm:gap-10"
                >
                  <span className="serif text-ink group-hover:text-accent text-headline min-w-[8rem] tracking-[-0.01em] transition-colors duration-[var(--dur-fast)]">
                    {destination.label}
                  </span>
                  <span className="text-ink-secondary text-footnote flex-1 leading-[1.55]">
                    {destination.description}
                  </span>
                  <ArrowUpRight
                    size={18}
                    strokeWidth={1.75}
                    aria-hidden
                    className="text-ink-tertiary group-hover:text-accent shrink-0 transition-colors duration-[var(--dur-fast)] sm:self-center"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────────────────── */}
      <section className="border-separator bg-surface-secondary border-t">
        <Container className="py-16 lg:py-22">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[42ch]">
              <h2 className="serif text-ink text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.1] tracking-[var(--track-title)]">
                Looking for something specific?
              </h2>
              <p className="text-ink-secondary text-callout mt-4 leading-[1.55]">
                Tell me what you were after and I&rsquo;ll point you at it — or
                book a 30-minute call and we&rsquo;ll skip straight to the work.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-accent text-primary-foreground hover:bg-accent-hover plausible-event-name=cta_book_call rounded-pill text-callout inline-flex items-center gap-2 px-5 py-2.5 font-medium transition-colors duration-[var(--dur-fast)]"
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
