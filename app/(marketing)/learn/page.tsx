import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, BookOpen, Lock } from "lucide-react";
import Container from "@/components/brand/Container";
import SessionsFilterGrid from "@/components/sessions/SessionsFilterGrid";
import { getAllCourses } from "@/lib/content/courses";
import { getAllSessions } from "@/lib/content/sessions";

export const metadata: Metadata = {
  title: "Learn — Free courses and sessions by Abdul Wahab",
  description:
    "Free video courses on Social Media Management and AI Driven Development with Claude Code, plus live and recorded sessions on Agentic AI, Python, and social strategy. No sign-up required.",
  alternates: { canonical: "/learn" },
  openGraph: {
    title: "Learn — Free courses and sessions by Abdul Wahab",
    description:
      "Free video courses plus live and recorded sessions on Agentic AI, Python automation, and social media strategy. No sign-up required.",
    url: "/learn",
    type: "website",
  },
};

const STATUS_LABELS: Record<string, string> = {
  available: "Available now",
  "in-progress": "Updating weekly",
  "coming-soon": "Coming soon",
};

function totalMinutes(lessons: { duration: string }[]): string {
  const mins = lessons.reduce((sum, l) => {
    const hrParts = l.duration.match(/(\d+)\s*hr/);
    const minParts = l.duration.match(/(\d+)\s*min/);
    const hrs = hrParts?.[1] ? parseInt(hrParts[1]) * 60 : 0;
    const minVal = minParts?.[1] ? parseInt(minParts[1]) : 0;
    return sum + hrs + minVal;
  }, 0);
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h} hr ${m} min` : `${h} hr`;
  }
  return `${mins} min`;
}

export default async function LearnPage() {
  const [courses, sessions] = await Promise.all([
    getAllCourses(),
    getAllSessions(),
  ]);

  return (
    <main id="main" className="flex flex-1 flex-col">
      {/* Hero */}
      <Container as="section" className="pt-18 pb-14 lg:pt-26 lg:pb-18">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          Learn
        </p>
        <h1 className="serif text-ink mt-6 max-w-[22ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          Free courses. Real skills.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[54ch] leading-[1.55]">
          Everything I teach in workshops and client sessions, structured into
          free video courses. No sign-up. No paywalls. Just watch and apply.
        </p>
      </Container>

      {/* Course cards */}
      <Container as="section" className="pb-26">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {courses.map((course) => {
            const isAvailable = course.status !== "coming-soon";
            const total = course.lessons.length
              ? totalMinutes(course.lessons)
              : null;

            const card = (
              <div
                className={[
                  "border-separator flex h-full flex-col rounded-2xl border p-8 transition-colors duration-[var(--dur-fast)]",
                  isAvailable
                    ? "bg-surface-elevated hover:border-separator-opaque"
                    : "bg-surface-secondary opacity-75",
                ].join(" ")}
              >
                {/* Eyebrow */}
                <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
                  {course.audience}
                </p>

                {/* Title */}
                <h2 className="serif text-ink mt-3 text-[clamp(1.5rem,3vw,2rem)] leading-[1.1] tracking-[var(--track-title)]">
                  {course.title}
                </h2>

                {/* Subtitle */}
                <p className="text-ink-secondary text-callout mt-2 leading-[1.5]">
                  {course.subtitle}
                </p>

                {/* Stats */}
                <div className="text-ink-tertiary text-footnote mt-5 flex flex-wrap items-center gap-4">
                  {course.lessons.length > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen size={13} strokeWidth={1.75} aria-hidden />
                      {course.lessons.length} lessons
                    </span>
                  )}
                  {total && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} strokeWidth={1.75} aria-hidden />
                      {total}
                      {course.status === "in-progress" && "+"}
                    </span>
                  )}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Footer */}
                <div className="mt-8 flex items-center justify-between">
                  <span
                    className={[
                      "text-eyebrow tracking-[var(--track-eyebrow)] uppercase",
                      course.status === "available"
                        ? "text-success"
                        : course.status === "in-progress"
                          ? "text-accent"
                          : "text-ink-tertiary",
                    ].join(" ")}
                  >
                    {STATUS_LABELS[course.status]}
                  </span>
                  {isAvailable ? (
                    <ArrowRight
                      size={18}
                      strokeWidth={1.5}
                      className="text-ink-secondary group-hover:text-accent transition-colors duration-[var(--dur-fast)]"
                      aria-hidden
                    />
                  ) : (
                    <Lock
                      size={16}
                      strokeWidth={1.5}
                      className="text-ink-tertiary"
                      aria-hidden
                    />
                  )}
                </div>
              </div>
            );

            return (
              <li key={course.slug} className="flex">
                {isAvailable ? (
                  <Link
                    href={`/learn/${course.slug}`}
                    className="group flex w-full"
                  >
                    {card}
                  </Link>
                ) : (
                  <div className="flex w-full cursor-default">{card}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Container>

      {/* Sessions */}
      <section aria-labelledby="sessions-heading" className="border-separator border-t">
        <Container className="py-18 lg:py-22">
          <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
            Sessions
          </p>
          <h2
            id="sessions-heading"
            className="serif text-ink mt-3 max-w-[24ch] text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] tracking-[var(--track-title)]"
          >
            Live and recorded, outside the curriculum.
          </h2>
          <p className="text-ink-secondary text-callout mt-4 max-w-[54ch] leading-[1.55]">
            One-off sessions on Agentic AI, Python automation, and social
            media strategy — watch a recording or join the next live one.
          </p>
          <div className="mt-10">
            <SessionsFilterGrid sessions={sessions} />
          </div>
        </Container>
      </section>

      {/* CTA band */}
      <section className="border-separator bg-surface-secondary border-t">
        <Container className="py-18">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
                Want to go deeper?
              </p>
              <h2 className="serif text-ink mt-3 max-w-[28ch] text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] tracking-[var(--track-title)]">
                I run live workshops for teams and operators.
              </h2>
              <p className="text-ink-secondary text-callout mt-4 max-w-[48ch] leading-[1.55]">
                Hands-on, tailored to your context. Covers AI workflows,
                agentic systems, and social media strategy in practice.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href="/workshops"
                className="bg-ink text-surface hover:bg-ink/90 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-body font-medium transition-colors duration-[var(--dur-fast)]"
              >
                See workshops
                <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
