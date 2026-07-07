import type { Metadata } from "next";
import Container from "@/components/brand/Container";
import AuditBot from "@/components/audit/AuditBot";

/*
 * /lab/audit — Workflow Audit Bot (spec §7.8).
 *
 * The single highest-leverage interactive surface. Layout is editorial:
 * explainer column (left) + the bot itself (right). On mobile both stack
 * with the bot below.
 */

export const metadata: Metadata = {
  title: "Workflow Audit — five questions, one answer",
  description:
    "Answer five questions and get a one-page automation hypothesis: the bottleneck, an architecture sketch, a recommended stack, one suggested next step.",
  alternates: { canonical: "/lab/audit" },
  openGraph: {
    title: "Workflow Audit Bot — Abdul Wahab",
    description:
      "Five questions, one hypothesis. A streaming workflow audit you can run in three minutes.",
    url: "/lab/audit",
    type: "website",
  },
};

export default function AuditPage() {
  return (
    <main id="main" className="flex flex-1 flex-col">
      <Container as="section" className="pt-18 pb-10 lg:pt-26 lg:pb-14">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          Lab · Audit bot
        </p>
        <h1 className="serif text-ink mt-6 max-w-[22ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          Five questions. One hypothesis.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[58ch] leading-[1.55]">
          The same five questions I ask on every discovery call, run through
          a streaming agent that drafts the one-page hypothesis I&rsquo;d
          write in front of you on a whiteboard. Takes about three minutes.
          Email yourself a PDF at the end.
        </p>
      </Container>

      <Container as="section" className="pb-26">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-14">
          <aside aria-label="What this is" className="self-start lg:sticky lg:top-24">
            <div className="border-separator bg-surface-secondary rounded-2xl border p-6 lg:p-7">
              <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
                What this is
              </p>
              <p className="text-ink text-body mt-3 leading-[1.55]">
                A streaming audit, not a chatbot. The model has a single job:
                run a tight discovery interview and end with a useful
                one-pager.
              </p>
              <ul className="text-ink-secondary text-footnote mt-5 grid gap-3 leading-[1.55]" role="list">
                <li className="before:bg-accent flex gap-3 before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full">
                  <span>Sonnet 4.6 via Vercel AI Gateway.</span>
                </li>
                <li className="before:bg-accent flex gap-3 before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full">
                  <span>Five questions, one per turn. No more.</span>
                </li>
                <li className="before:bg-accent flex gap-3 before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full">
                  <span>One-page PDF on capture; transcript not retained on the server.</span>
                </li>
                <li className="before:bg-accent flex gap-3 before:mt-2 before:h-1 before:w-1 before:shrink-0 before:rounded-full">
                  <span>Ten starts per hour per IP. Failure mode is honest.</span>
                </li>
              </ul>
            </div>
          </aside>

          <div>
            <AuditBot />
          </div>
        </div>
      </Container>
    </main>
  );
}
