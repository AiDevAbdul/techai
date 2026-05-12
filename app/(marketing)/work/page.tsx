import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/brand/Container";
import { getAllCaseStudies } from "@/lib/content/case-studies";

/*
 * /work — case-study index. Editorial list, NOT a grid of screenshots
 * (spec §7.2). Order is locked by frontmatter `order`: MeetPlanner → Marketing
 * Dash → Printing Press. The loader sorts; the page just renders.
 */

export const metadata: Metadata = {
  title: "Work — Case studies",
  description:
    "Three workflow systems shipped end-to-end. The bottleneck named, the architecture sketched, the outcome measured.",
  alternates: { canonical: "/work" },
};

export default async function WorkIndex() {
  const studies = await getAllCaseStudies();

  return (
    <main id="main" className="flex flex-1 flex-col">
      <Container as="section" className="py-22 lg:py-26">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          Work
        </p>
        <h1 className="serif text-ink mt-6 max-w-[20ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          Three workflow systems, three industries.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[52ch]">
          Each case study runs through the same template: the bottleneck, the
          decision that mattered most, what I built, what I&rsquo;d do
          differently.
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
      </Container>
    </main>
  );
}
