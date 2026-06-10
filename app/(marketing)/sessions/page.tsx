import type { Metadata } from "next";
import Container from "@/components/brand/Container";
import SessionsFilterGrid from "@/components/sessions/SessionsFilterGrid";
import { getAllSessions } from "@/lib/content/sessions";

/*
 * /sessions — index of all live and recorded sessions (spec extension).
 *
 * Sessions are loaded server-side; topic filtering runs client-side inside
 * SessionsFilterGrid so the page itself is a server component with no
 * revalidation overhead. Newest-first is the default sort from the loader.
 */

export const metadata: Metadata = {
  title: "Sessions — Live and recorded learning sessions",
  description:
    "Watch recorded sessions or join live workshops on Agentic AI, Python programming, and social media strategy. Practical, hands-on, and built for operators and teams.",
  alternates: { canonical: "/sessions" },
  openGraph: {
    title: "Sessions — Abdul Wahab",
    description:
      "Live and recorded sessions on Agentic AI, Python programming, and social media strategy.",
    url: "/sessions",
    type: "website",
  },
};

export default async function SessionsPage() {
  const sessions = await getAllSessions();

  return (
    <main id="main" className="flex flex-1 flex-col">
      {/* Hero */}
      <Container as="section" className="pt-18 pb-14 lg:pt-26 lg:pb-18">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          Sessions
        </p>
        <h1 className="serif text-ink mt-6 max-w-[22ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          Learn by watching. Ask by joining live.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[58ch] leading-[1.55]">
          Recorded walkthroughs and live sessions on Agentic AI, Python
          automation, and social media strategy. Filter by topic or browse
          everything below.
        </p>
      </Container>

      {/* Filter + grid */}
      <Container as="section" className="pb-26">
        <SessionsFilterGrid sessions={sessions} />
      </Container>
    </main>
  );
}
