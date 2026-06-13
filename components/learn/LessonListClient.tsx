"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import type { Lesson } from "@/lib/content/courses";

type Props = {
  courseSlug: string;
  currentLessonSlug: string;
  lessons: Lesson[];
  isInProgress?: boolean;
};

function storageKey(courseSlug: string) {
  return `learn-seen-${courseSlug}`;
}

function getSeen(courseSlug: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(storageKey(courseSlug));
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function markSeen(courseSlug: string, lessonSlug: string): Set<string> {
  const seen = getSeen(courseSlug);
  seen.add(lessonSlug);
  try {
    localStorage.setItem(storageKey(courseSlug), JSON.stringify([...seen]));
  } catch {
    // localStorage may be unavailable in some contexts
  }
  return seen;
}

export default function LessonListClient({
  courseSlug,
  currentLessonSlug,
  lessons,
  isInProgress,
}: Props) {
  const [seen, setSeen] = useState<Set<string>>(new Set());

  useEffect(() => {
    const updated = markSeen(courseSlug, currentLessonSlug);
    setSeen(new Set(updated));
  }, [courseSlug, currentLessonSlug]);

  const seenCount = lessons.filter((l) => seen.has(l.slug)).length;

  return (
    <div>
      {/* Progress summary */}
      <div className="mb-5 flex items-center justify-between">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          {seenCount} / {lessons.length} watched
        </p>
        {isInProgress && (
          <span className="text-accent text-eyebrow rounded-pill border border-current px-2.5 py-0.5 tracking-[var(--track-eyebrow)] uppercase">
            Updating
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className="bg-separator mb-6 h-px w-full overflow-hidden rounded-full">
        <div
          className="bg-accent h-full rounded-full transition-all duration-500"
          style={{
            width: lessons.length
              ? `${(seenCount / lessons.length) * 100}%`
              : "0%",
          }}
        />
      </div>

      {/* Lesson list */}
      <ol className="space-y-1" role="list">
        {lessons.map((lesson) => {
          const isCurrent = lesson.slug === currentLessonSlug;
          const isDone = seen.has(lesson.slug) && !isCurrent;

          return (
            <li key={lesson.slug}>
              <Link
                href={`/learn/${courseSlug}/${lesson.slug}`}
                aria-current={isCurrent ? "page" : undefined}
                className={[
                  "group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-[var(--dur-fast)]",
                  isCurrent
                    ? "bg-accent-soft"
                    : "hover:bg-surface-secondary",
                ].join(" ")}
              >
                <span
                  className={[
                    "mt-0.5 shrink-0 transition-colors duration-[var(--dur-fast)]",
                    isCurrent
                      ? "text-accent"
                      : isDone
                        ? "text-accent"
                        : "text-ink-tertiary group-hover:text-ink-secondary",
                  ].join(" ")}
                >
                  {isCurrent ? (
                    <PlayCircle size={16} strokeWidth={1.75} aria-hidden />
                  ) : isDone ? (
                    <CheckCircle2 size={16} strokeWidth={1.75} aria-hidden />
                  ) : (
                    <Circle size={16} strokeWidth={1.75} aria-hidden />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={[
                      "text-footnote block leading-snug",
                      isCurrent
                        ? "text-accent font-medium"
                        : isDone
                          ? "text-ink"
                          : "text-ink-secondary group-hover:text-ink",
                    ].join(" ")}
                  >
                    {lesson.number.toString().padStart(2, "0")} — {lesson.title}
                  </span>
                  <span className="text-ink-tertiary text-caption mt-0.5 block">
                    {lesson.duration}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
