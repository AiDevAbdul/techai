"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";
import type { Lesson } from "@/lib/content/courses";

type Props = {
  courseSlug: string;
  currentLessonSlug: string;
  lessons: Lesson[];
  isInProgress?: boolean;
};

/*
 * Watched-lesson tracking is backed by localStorage, which is an *external
 * store* — not React state. It is read through `useSyncExternalStore` so we
 * never call setState from inside an effect (which would cascade renders) and
 * so cross-tab writes stay in sync.
 *
 * Hydration safety: the server has no localStorage, so `getServerSnapshot`
 * returns a shared empty set. React uses that same snapshot for the initial
 * client render, so the hydrated markup matches the server HTML exactly; the
 * real localStorage value is only adopted on the post-hydration re-read.
 */

const EMPTY_SEEN: ReadonlySet<string> = new Set<string>();

/** Cached snapshots keyed by storage key, so getSnapshot is referentially stable. */
const snapshotCache = new Map<
  string,
  { raw: string | null; value: ReadonlySet<string> }
>();

const listeners = new Map<string, Set<() => void>>();

function storageKey(courseSlug: string) {
  return `learn-seen-${courseSlug}`;
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // localStorage may be unavailable (private mode, blocked cookies)
    return null;
  }
}

function parseSeen(raw: string | null): ReadonlySet<string> {
  if (!raw) return EMPTY_SEEN;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY_SEEN;
    return new Set(parsed.filter((v): v is string => typeof v === "string"));
  } catch {
    return EMPTY_SEEN;
  }
}

function getSeenSnapshot(courseSlug: string): ReadonlySet<string> {
  const key = storageKey(courseSlug);
  const raw = readRaw(key);
  const cached = snapshotCache.get(key);
  // Return the identical Set when the underlying string is unchanged —
  // useSyncExternalStore compares snapshots by reference.
  if (cached && cached.raw === raw) return cached.value;
  const value = parseSeen(raw);
  snapshotCache.set(key, { raw, value });
  return value;
}

function getServerSeenSnapshot(): ReadonlySet<string> {
  return EMPTY_SEEN;
}

function emit(key: string) {
  for (const listener of listeners.get(key) ?? []) listener();
}

function subscribeSeen(courseSlug: string, onChange: () => void): () => void {
  const key = storageKey(courseSlug);
  let forKey = listeners.get(key);
  if (!forKey) {
    forKey = new Set();
    listeners.set(key, forKey);
  }
  forKey.add(onChange);

  // Keep other tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === key) onChange();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener("storage", onStorage);
    forKey.delete(onChange);
    if (forKey.size === 0) listeners.delete(key);
  };
}

function markSeen(courseSlug: string, lessonSlug: string): void {
  const key = storageKey(courseSlug);
  const current = getSeenSnapshot(courseSlug);
  if (current.has(lessonSlug)) return;
  const next = [...current, lessonSlug];
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // localStorage may be unavailable in some contexts — keep the in-memory
    // snapshot correct anyway so the UI still reflects this session.
    snapshotCache.set(key, {
      raw: snapshotCache.get(key)?.raw ?? null,
      value: new Set(next),
    });
    emit(key);
    return;
  }
  emit(key);
}

export default function LessonListClient({
  courseSlug,
  currentLessonSlug,
  lessons,
  isInProgress,
}: Props) {
  const subscribe = useCallback(
    (onChange: () => void) => subscribeSeen(courseSlug, onChange),
    [courseSlug],
  );
  const getSnapshot = useCallback(
    () => getSeenSnapshot(courseSlug),
    [courseSlug],
  );

  const seen = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSeenSnapshot,
  );

  // Writing to the external store — not setState — so no cascading render.
  useEffect(() => {
    markSeen(courseSlug, currentLessonSlug);
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
