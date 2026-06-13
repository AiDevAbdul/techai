import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, BookOpen } from "lucide-react";
import Container from "@/components/brand/Container";
import { getCourseSlugs, getCourseBySlug } from "@/lib/content/courses";

export async function generateStaticParams() {
  const slugs = await getCourseSlugs();
  return slugs.map((course) => ({ course }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string }>;
}): Promise<Metadata> {
  const { course: courseSlug } = await params;
  const course = await getCourseBySlug(courseSlug);
  if (!course) return {};
  return {
    title: `${course.title} — Free course by Abdul Wahab`,
    description: course.description,
    alternates: { canonical: `/learn/${courseSlug}` },
    openGraph: {
      title: `${course.title} — Abdul Wahab`,
      description: course.description,
      url: `/learn/${courseSlug}`,
      type: "website",
    },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ course: string }>;
}) {
  const { course: courseSlug } = await params;
  const course = await getCourseBySlug(courseSlug);
  if (!course || course.status === "coming-soon") notFound();

  const firstLesson = course.lessons[0];

  const totalMins = course.lessons.reduce((sum, l) => {
    const hrParts = l.duration.match(/(\d+)\s*hr/);
    const minParts = l.duration.match(/(\d+)\s*min/);
    const hrs = hrParts?.[1] ? parseInt(hrParts[1]) * 60 : 0;
    const mins = minParts?.[1] ? parseInt(minParts[1]) : 0;
    return sum + hrs + mins;
  }, 0);
  const durationLabel =
    totalMins >= 60
      ? `${Math.floor(totalMins / 60)} hr ${totalMins % 60 ? `${totalMins % 60} min` : ""}`.trim()
      : `${totalMins} min`;

  return (
    <main id="main" className="flex flex-1 flex-col">
      {/* Hero */}
      <Container as="section" className="pt-14 pb-10 lg:pt-22 lg:pb-14">
        <Link
          href="/learn"
          className="text-ink-secondary hover:text-ink text-footnote inline-flex items-center gap-1.5 transition-colors duration-[var(--dur-fast)]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
          All Courses
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
            {course.audience}
          </span>
          {course.status === "in-progress" && (
            <span className="text-accent text-eyebrow rounded-pill border border-current px-2.5 py-0.5 tracking-[var(--track-eyebrow)] uppercase">
              Updating weekly
            </span>
          )}
        </div>

        <h1 className="serif text-ink mt-4 max-w-[26ch] text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.08] tracking-[var(--track-display)]">
          {course.title}
        </h1>

        <p className="text-ink-secondary text-callout mt-5 max-w-[58ch] leading-[1.55]">
          {course.description}
        </p>

        <p className="text-ink-tertiary text-footnote mt-5 flex flex-wrap items-center gap-5">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen size={13} strokeWidth={1.75} aria-hidden />
            {course.lessons.length} lessons
            {course.status === "in-progress" && "+"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={13} strokeWidth={1.75} aria-hidden />
            {durationLabel}
            {course.status === "in-progress" && "+"}
          </span>
          <span>Free · No sign-up required</span>
        </p>

        {firstLesson && (
          <Link
            href={`/learn/${course.slug}/${firstLesson.slug}`}
            className="bg-ink text-surface hover:bg-ink/90 mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-body font-medium transition-colors duration-[var(--dur-fast)]"
          >
            Start Course
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        )}
      </Container>

      {/* Lesson list */}
      <Container as="section" className="pb-26">
        <div className="border-separator border-t pt-12">
          <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
            Course content
          </p>

          <ol
            className="divide-separator mt-6 divide-y"
            role="list"
            aria-label={`${course.title} lessons`}
          >
            {course.lessons.map((lesson, i) => (
              <li key={lesson.slug}>
                <Link
                  href={`/learn/${course.slug}/${lesson.slug}`}
                  className="group flex items-center gap-6 py-6 transition-colors duration-[var(--dur-fast)] sm:gap-10"
                >
                  <span className="text-ink-tertiary text-eyebrow w-8 shrink-0 tabular-nums tracking-[var(--track-eyebrow)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-ink text-body group-hover:text-accent leading-snug transition-colors duration-[var(--dur-fast)]">
                      {lesson.title}
                    </p>
                    <p className="text-ink-tertiary text-footnote mt-1">
                      {lesson.duration}
                    </p>
                  </div>
                  <ArrowRight
                    size={16}
                    strokeWidth={1.5}
                    className="text-ink-tertiary group-hover:text-accent shrink-0 transition-colors duration-[var(--dur-fast)]"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ol>

          {course.status === "in-progress" && (
            <p className="text-ink-tertiary text-footnote mt-6 italic">
              More lessons are added every week as this course is actively being
              recorded.
            </p>
          )}
        </div>
      </Container>
    </main>
  );
}
