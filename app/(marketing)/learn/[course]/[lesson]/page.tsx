import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, ExternalLink } from "lucide-react";
import Container from "@/components/brand/Container";
import YouTubePlayer from "@/components/sessions/YouTubePlayer";
import LessonListClient from "@/components/learn/LessonListClient";
import {
  getCourseSlugs,
  getLessonBySlug,
  getLessonSlugs,
} from "@/lib/content/courses";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdulwahabai.com";

export async function generateStaticParams() {
  const params: { course: string; lesson: string }[] = [];
  const courseSlugs = await getCourseSlugs();
  for (const courseSlug of courseSlugs) {
    const lessonSlugs = await getLessonSlugs(courseSlug);
    for (const lesson of lessonSlugs) {
      params.push({ course: courseSlug, lesson });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}): Promise<Metadata> {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const result = await getLessonBySlug(courseSlug, lessonSlug);
  if (!result) return {};
  const { course, lesson } = result;
  const descSnippet = lesson.description
    ? lesson.description.slice(0, 160).replace(/\n/g, " ")
    : `Watch lesson ${lesson.number} of ${course.lessons.length} from "${course.title}". Free course by Abdul Wahab.`;
  return {
    title: `${lesson.title} — ${course.title}`,
    description: descSnippet,
    alternates: { canonical: `/learn/${courseSlug}/${lessonSlug}` },
    openGraph: {
      title: `${lesson.title} — ${course.title}`,
      description: descSnippet,
      url: `/learn/${courseSlug}/${lessonSlug}`,
      type: "video.episode",
    },
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course: courseSlug, lesson: lessonSlug } = await params;
  const result = await getLessonBySlug(courseSlug, lessonSlug);
  if (!result) notFound();

  const { course, lesson, index } = result;

  const prevLesson = index > 0 ? course.lessons[index - 1] : null;
  const nextLesson =
    index < course.lessons.length - 1 ? course.lessons[index + 1] : null;
  const isLastLesson = !nextLesson;

  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: lesson.title,
    description: lesson.description || `Lesson ${lesson.number} of ${course.title} — free course by Abdul Wahab.`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${lesson.videoId}`,
    author: {
      "@type": "Person",
      name: "Abdul Wahab",
      url: `${SITE_URL}/about`,
    },
  };

  return (
    <main id="main" className="flex flex-1 flex-col">
      {/* Breadcrumb */}
      <Container as="nav" aria-label="Breadcrumb" className="pt-6 pb-4">
        <ol
          className="text-footnote text-ink-secondary flex flex-wrap items-center gap-1.5"
          role="list"
        >
          <li>
            <Link
              href="/learn"
              className="hover:text-ink transition-colors duration-[var(--dur-fast)]"
            >
              Learn
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={`/learn/${course.slug}`}
              className="hover:text-ink transition-colors duration-[var(--dur-fast)]"
            >
              {course.title}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink max-w-[24ch] truncate" aria-current="page">
            {lesson.title}
          </li>
        </ol>
      </Container>

      {/* Video */}
      <Container as="section" className="pb-8">
        <YouTubePlayer videoId={lesson.videoId} title={lesson.title} />
      </Container>

      {/* Lesson info + lesson list */}
      <Container as="section" className="pb-16">
        <div className="grid gap-16 lg:grid-cols-[1fr_320px]">
          {/* Left: title, meta, description, nav */}
          <div>
            <p className="text-ink-tertiary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
              Lesson {lesson.number} of {course.lessons.length}
            </p>

            <h1 className="serif text-ink mt-3 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1] tracking-[var(--track-title)]">
              {lesson.title}
            </h1>

            <div className="text-ink-tertiary text-footnote mt-4 flex flex-wrap items-center gap-5">
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} strokeWidth={1.75} aria-hidden />
                {lesson.duration}
              </span>
              <a
                href={`https://www.youtube.com/watch?v=${lesson.videoId}&list=${course.playlistId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-ink inline-flex items-center gap-1.5 transition-colors duration-[var(--dur-fast)]"
              >
                Watch on YouTube
                <ExternalLink size={12} strokeWidth={1.75} aria-hidden />
              </a>
            </div>

            {/* Description */}
            {lesson.description && (
              <div className="border-separator mt-8 border-t pt-8">
                <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
                  About this lesson
                </p>
                <p className="text-ink-secondary text-callout mt-4 max-w-[64ch] whitespace-pre-line leading-[1.65]">
                  {lesson.description}
                </p>
              </div>
            )}

            {/* Prev / Next */}
            <div className="border-separator mt-10 flex items-center justify-between gap-4 border-t pt-8">
              {prevLesson ? (
                <Link
                  href={`/learn/${course.slug}/${prevLesson.slug}`}
                  className="group flex max-w-[45%] flex-col gap-1"
                >
                  <span className="text-ink-tertiary text-eyebrow inline-flex items-center gap-1.5 tracking-[var(--track-eyebrow)] uppercase">
                    <ArrowLeft size={12} strokeWidth={1.75} aria-hidden />
                    Previous
                  </span>
                  <span className="text-ink-secondary group-hover:text-ink text-footnote leading-snug transition-colors duration-[var(--dur-fast)]">
                    {prevLesson.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/learn/${course.slug}/${nextLesson.slug}`}
                  className="group flex max-w-[45%] flex-col items-end gap-1 text-right"
                >
                  <span className="text-ink-tertiary text-eyebrow inline-flex items-center gap-1.5 tracking-[var(--track-eyebrow)] uppercase">
                    Next
                    <ArrowRight size={12} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="text-ink-secondary group-hover:text-ink text-footnote leading-snug transition-colors duration-[var(--dur-fast)]">
                    {nextLesson.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>

            {/* End-of-course CTA */}
            {isLastLesson && (
              <div className="bg-surface-secondary border-separator mt-10 rounded-2xl border p-8">
                <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
                  {course.status === "in-progress"
                    ? "You're caught up"
                    : "Course complete"}
                </p>
                <h2 className="serif text-ink mt-3 text-[clamp(1.5rem,3vw,2rem)] leading-[1.1] tracking-[var(--track-title)]">
                  {course.status === "in-progress"
                    ? "New lessons drop every week."
                    : "Want to go deeper?"}
                </h2>
                <p className="text-ink-secondary text-callout mt-3 max-w-[42ch] leading-[1.55]">
                  {course.status === "in-progress"
                    ? "Subscribe on YouTube so you don't miss the next one, or book a session to work through these concepts with me directly."
                    : "Book a discovery call to apply these skills to your specific business context — or explore a live workshop for your team."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="bg-ink text-surface hover:bg-ink/90 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-body font-medium transition-colors duration-[var(--dur-fast)]"
                  >
                    Book a call
                    <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
                  </Link>
                  <a
                    href={`https://www.youtube.com/playlist?list=${course.playlistId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-separator hover:border-separator-opaque text-ink inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-body transition-colors duration-[var(--dur-fast)]"
                  >
                    Follow on YouTube
                    <ExternalLink size={14} strokeWidth={1.75} aria-hidden />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Right: lesson list with progress (client) */}
          <aside className="border-separator border-t pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
            <LessonListClient
              courseSlug={course.slug}
              currentLessonSlug={lesson.slug}
              lessons={course.lessons}
              isInProgress={course.status === "in-progress"}
            />
          </aside>
        </div>
      </Container>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
    </main>
  );
}
