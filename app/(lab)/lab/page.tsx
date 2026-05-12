import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/brand/Container";
import { getAllLabNotes } from "@/lib/content/lab-notes";

/*
 * /lab — editorial index of Lab Notes (spec §7.7).
 *
 * Display: date · category · title · 1-line tease. Newest first.
 * No grid of cards — this is an editorial column, not a blog wall.
 */

export const metadata: Metadata = {
  title: "Lab — Field notes from AI workflow work",
  description:
    "Lab Notes — short essays on context engineering, workflow design, and what actually ships when AI meets operations.",
  alternates: { canonical: "/lab" },
  openGraph: {
    title: "Lab — Abdul Wahab",
    description:
      "Field notes from AI workflow work. Short, opinionated, written from inside the build.",
    url: "/lab",
    type: "website",
  },
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function LabIndex() {
  const notes = await getAllLabNotes();

  return (
    <main id="main" className="flex flex-1 flex-col">
      <Container as="section" className="pt-18 pb-14 lg:pt-26 lg:pb-18">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          Lab Notes
        </p>
        <h1 className="serif text-ink mt-6 max-w-[22ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          Field notes from AI workflow work.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[58ch] leading-[1.55]">
          Short essays from inside the build. Context engineering, workflow
          design, the parts of AI that operators have to live with after the
          demo. Roughly one every two weeks.
        </p>
      </Container>

      <Container as="section" className="pb-26">
        {notes.length === 0 ? (
          <p className="text-ink-secondary text-callout">
            First notes land soon — check back shortly.
          </p>
        ) : (
          <ul
            className="border-separator divide-separator divide-y border-y"
            role="list"
          >
            {notes.map((note) => (
              <li key={note.frontmatter.slug}>
                <Link
                  href={`/lab/${note.frontmatter.slug}`}
                  className="group grid gap-2 py-10 transition-colors duration-[var(--dur-fast)] sm:grid-cols-[12rem_1fr] sm:items-baseline sm:gap-10"
                >
                  <p className="text-ink-secondary text-eyebrow tabular-nums tracking-[var(--track-eyebrow)] uppercase">
                    {formatDate(note.frontmatter.date)}
                    <span aria-hidden className="mx-2">·</span>
                    {note.frontmatter.category}
                  </p>
                  <div className="max-w-[58ch]">
                    <p className="serif text-ink group-hover:text-accent text-title3 leading-[1.15] tracking-[var(--track-title)] transition-colors duration-[var(--dur-fast)]">
                      {note.frontmatter.title}
                    </p>
                    <p className="text-ink-secondary text-body mt-3 leading-[1.6]">
                      {note.frontmatter.summary}
                    </p>
                    <span className="text-accent text-footnote mt-4 inline-flex items-center gap-1.5 font-medium">
                      Read note
                      <ArrowRight
                        size={14}
                        strokeWidth={1.75}
                        aria-hidden
                        className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
                      />
                      <span className="text-ink-tertiary ml-3 font-normal">
                        {note.frontmatter.readingTime} min
                      </span>
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </main>
  );
}
