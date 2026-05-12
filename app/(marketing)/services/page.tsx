import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import Container from "@/components/brand/Container";
import ServicesNav from "@/components/brand/ServicesNav";
import { SERVICES_SECTION_SCROLL_MARGIN } from "@/lib/services-nav-offset";
import { getAllServices, type Service } from "@/lib/content/services";

/*
 * /services — spec §7.4. Offer stack: Audit, Build, Workshop, Speaking.
 *
 * Structure:
 *   - Hero ("How I work with teams.")
 *   - Sticky segmented control (ServicesNav, client) with scroll-spy + hash sync
 *   - Four tier <section> cards, each with id={slug} for anchor navigation
 *   - Service JSON-LD per tier (Schema.org)
 *   - Closing CTA band
 *
 * Each tier card structure is identical (visual rhythm matters more than per-
 * tier customization here). Structured fields come from frontmatter; the
 * MDX body is the short positioning paragraph rendered as the card eyebrow.
 *
 * Pricing decision (spec §15 Q2 default): show "Starting from $1,500" on
 * Audit; Build/Workshop/Speaking show non-numeric labels ("Custom",
 * "On request"). Numeric pricing on Audit also drives a Schema.org Offer.
 */

export const metadata: Metadata = {
  title: "Services — Audit, Build, Workshop, Speaking",
  description:
    "Four ways to work together: a one-week workflow audit, a fixed-scope build, a hands-on team workshop, or a keynote / executive briefing.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — Abdul Wahab",
    description:
      "Workflow audits, builds, workshops, and talks. Pick the delivery mode that fits your team.",
    url: "/services",
    type: "website",
  },
};

const SITE_URL = "https://techai.pk";

function serviceJsonLd(service: Service) {
  const { frontmatter, body } = service;
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: frontmatter.name,
    serviceType: frontmatter.serviceType,
    description: body.replace(/\s+/g, " ").trim(),
    url: `${SITE_URL}/services#${frontmatter.slug}`,
    provider: {
      "@type": "Person",
      name: "Abdul Wahab",
      url: SITE_URL,
    },
    areaServed: "Worldwide",
  };
  if (frontmatter.offerPrice && frontmatter.offerCurrency) {
    base.offers = {
      "@type": "Offer",
      price: String(frontmatter.offerPrice),
      priceCurrency: frontmatter.offerCurrency,
      url: `${SITE_URL}${frontmatter.ctaHref}`,
      availability: "https://schema.org/InStock",
    };
  }
  return base;
}

export default async function ServicesPage() {
  const services = await getAllServices();
  const tabs = services.map((s) => ({
    value: s.frontmatter.slug,
    label: s.frontmatter.tabLabel,
  }));

  return (
    <main id="main" className="flex flex-1 flex-col">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <Container as="section" className="pt-18 pb-16 lg:pt-26 lg:pb-22">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          Services
        </p>
        <h1 className="serif text-ink mt-6 max-w-[20ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          How I work with teams.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[58ch]">
          Four delivery modes for the same playbook: name the bottleneck,
          sketch the architecture, ship a system you can audit. Pick the one
          that fits where your team is today.
        </p>
      </Container>

      {/* ── Sticky tier nav (client) ───────────────────────────────────── */}
      <ServicesNav options={tabs} />

      {/* ── Tier sections ──────────────────────────────────────────────── */}
      <div>
        {services.map((service, i) => {
          const { frontmatter, body } = service;
          const ctaIsExternal = frontmatter.ctaHref.startsWith("http");
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
                  {/* Left rail — name, format, pricing, CTA */}
                  <div className="flex flex-col">
                    <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
                      Tier {String(frontmatter.order).padStart(2, "0")}
                    </p>
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
                      {frontmatter.priceDetail && (
                        <p className="text-ink-secondary text-footnote mt-2 leading-[1.5]">
                          {frontmatter.priceDetail}
                        </p>
                      )}
                      <Link
                        href={frontmatter.ctaHref}
                        {...(ctaIsExternal
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
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
                // Per-tier Service JSON-LD; one script per section (spec §7.4 + §8 SEO).
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(serviceJsonLd(service)),
                }}
              />
            </section>
          );
        })}
      </div>

      {/* ── Closing CTA ────────────────────────────────────────────────── */}
      <section className="border-separator bg-surface-secondary border-t">
        <Container className="py-22">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[40ch]">
              <h2 className="serif text-ink text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] tracking-[var(--track-title)]">
                Not sure which fits?
              </h2>
              <p className="text-ink-secondary text-callout mt-4">
                Thirty minutes on a call is usually enough to tell. No pitch,
                no slides — we map your workflow and you decide.
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
