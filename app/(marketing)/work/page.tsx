import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import Container from "@/components/brand/Container";
import Pill from "@/components/ui/pill";
import { getAllCaseStudies } from "@/lib/content/case-studies";

/*
 * /work — case-study index + open source/client projects.
 * Case studies: editorial list, order locked by frontmatter `order`.
 * Other projects: static grid with GitHub links.
 */

export const metadata: Metadata = {
  title: "Work — Case studies & projects",
  description:
    "Workflow systems, open-source tools, and client builds shipped end-to-end. The bottleneck named, the architecture sketched, the outcome measured.",
  alternates: { canonical: "/work" },
};

const OTHER_PROJECTS = [
  {
    id: "elementor-mcp",
    eyebrow: "Open Source · 2025",
    title: "Elementor MCP",
    description:
      "WordPress plugin exposing Elementor's full page-building API as MCP tools — up to 118 tools covering layout, widgets, theme builder, and custom widget generation. Lets Claude and other AI clients build pages programmatically.",
    stack: ["PHP", "WordPress", "MCP Protocol", "Elementor"],
    github: "https://github.com/AiDevAbdul/elementor-mcp",
  },
  {
    id: "ducker-analytica",
    eyebrow: "SaaS · 2025",
    title: "Ducker Analytica",
    description:
      "White-label marketing analytics platform for agencies. Aggregates Google Ads, Meta Ads, GA4, and Search Console into one branded dashboard with AI-powered chat, PDF reporting, and multi-tenant agency management.",
    stack: ["Next.js", "PostgreSQL", "Drizzle", "Upstash Redis", "AI SDK", "Vercel"],
    github: "https://github.com/AiDevAbdul/ducker-analytica",
  },
  {
    id: "wmk-auto",
    eyebrow: "Client Web · 2025",
    title: "WMK Auto Garage",
    description:
      "Marketing site for an elite auto repair specialist in Dubai. Covers 12 specialist services and 16 EV/hybrid brands. Built for local search visibility, Arabic-ready multilingual routing, and WhatsApp lead capture.",
    stack: ["Next.js 16", "TypeScript", "Tailwind v4", "Framer Motion"],
    github: "https://github.com/AiDevAbdul/wmk",
  },
  {
    id: "action-digital",
    eyebrow: "EdTech · 2025",
    title: "Action Digital Institute",
    description:
      "Full LMS and portfolio for an AI and digital marketing education institute. Student dashboard, course progress tracking, Stripe payments, certificate generation, and admin panel.",
    stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Stripe"],
    github: "https://github.com/AiDevAbdul/ActionDigital",
  },
] as const;

export default async function WorkIndex() {
  const studies = await getAllCaseStudies();

  return (
    <main id="main" className="flex flex-1 flex-col">
      <Container as="section" className="py-22 lg:py-26">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          Work
        </p>
        <h1 className="serif text-ink mt-6 max-w-[20ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          Workflow systems, platforms, and open source.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[52ch]">
          Three deep case studies — the bottleneck, the architecture, the
          outcome — plus open-source tools and client builds below.
        </p>

        {studies.length === 0 ? (
          <p className="text-ink-secondary text-callout mt-16">
            Case studies land Day 4–5. Check back shortly.
          </p>
        ) : (
          <ul className="mt-18 divide-separator border-separator divide-y border-y" role="list">
            {studies.map((s) => (
              <li key={s.frontmatter.slug}>
                <Link
                  href={`/work/${s.frontmatter.slug}`}
                  className="group flex flex-col gap-3 py-10 transition-colors duration-[var(--dur-fast)] sm:flex-row sm:items-baseline sm:gap-10"
                >
                  <p className="text-ink-secondary text-eyebrow w-32 shrink-0 tracking-[var(--track-eyebrow)] uppercase">
                    {s.frontmatter.eyebrow}
                  </p>
                  <div className="flex-1">
                    <h2 className="serif text-ink text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] tracking-[-0.014em] group-hover:text-accent transition-colors duration-[var(--dur-fast)]">
                      {s.frontmatter.title}
                    </h2>
                    <p className="text-ink-secondary text-callout mt-3 max-w-[56ch]">
                      {s.frontmatter.summary}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="text-ink-secondary group-hover:text-accent shrink-0 transition-colors duration-[var(--dur-fast)] sm:self-center"
                  >
                    <ArrowRight size={20} strokeWidth={1.5} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* ── More Projects ──────────────────────────────────────────── */}
        <div className="border-separator mt-22 border-t pt-16">
          <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
            More work
          </p>
          <h2 className="text-ink text-title2 mt-3 max-w-[30ch] tracking-[var(--track-title)]">
            Open source, platforms, and client builds.
          </h2>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2" role="list">
            {OTHER_PROJECTS.map((p) => (
              <li key={p.id}>
                <div className="bg-surface-elevated border-separator flex h-full flex-col rounded-2xl border p-7">
                  <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
                    {p.eyebrow}
                  </p>
                  <p className="serif text-ink text-headline mt-3 tracking-[-0.01em]">
                    {p.title}
                  </p>
                  <p className="text-ink-secondary text-footnote mt-3 flex-1 leading-[1.55]">
                    {p.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-2" role="list">
                    {p.stack.map((tech) => (
                      <li key={tech}>
                        <Pill variant="code">{tech}</Pill>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-hover text-footnote mt-5 inline-flex items-center gap-1.5 font-medium transition-colors duration-[var(--dur-fast)]"
                  >
                    View on GitHub
                    <ExternalLink size={13} strokeWidth={1.75} aria-hidden />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </main>
  );
}
