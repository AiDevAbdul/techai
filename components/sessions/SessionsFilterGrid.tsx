"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, Clock, ArrowRight, Bell } from "lucide-react";
import SegmentedControl from "@/components/ui/segmented-control";
import type { Session } from "@/lib/content/sessions";
import { cn } from "@/lib/utils";

/*
 * SessionsFilterGrid — client wrapper for topic filter + session card grid.
 *
 * All sessions are loaded server-side and passed as props. The filter runs
 * client-side so no navigation or loading state is needed. SegmentedControl
 * handles keyboard navigation (arrow keys, Home/End).
 *
 * SessionCard uses the YouTube thumbnail as cover art for recorded sessions;
 * upcoming sessions show a placeholder with a bell icon.
 */

const TOPIC_OPTIONS = [
  { value: "all", label: "All" },
  { value: "Agentic AI", label: "Agentic AI" },
  { value: "Python Programming", label: "Python" },
  { value: "Social Media Marketing", label: "Social Media" },
] as const satisfies ReadonlyArray<{ value: string; label: string }>;

type TopicFilter = (typeof TOPIC_OPTIONS)[number]["value"];

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" },
  );
}

function SessionCard({ session }: { session: Session }) {
  const { frontmatter } = session;
  const isUpcoming = frontmatter.type === "upcoming";
  const hasValidId =
    frontmatter.youtubeId && YOUTUBE_ID_RE.test(frontmatter.youtubeId);
  const thumbnailUrl = hasValidId
    ? `https://img.youtube.com/vi/${frontmatter.youtubeId}/hqdefault.jpg`
    : null;

  return (
    <Link
      href={`/sessions/${frontmatter.slug}`}
      className="group bg-surface-elevated border-separator hover:border-separator-opaque flex flex-col overflow-hidden rounded-2xl border transition-shadow duration-[var(--dur-med)] hover:[box-shadow:var(--shadow-pop)]"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-surface-tertiary">
        {thumbnailUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumbnailUrl}
            alt=""
            aria-hidden
            className="h-full w-full object-cover transition-transform duration-[var(--dur-slow)] group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Bell
              size={32}
              strokeWidth={1.25}
              className="text-ink-tertiary"
              aria-hidden
            />
          </div>
        )}

        {/* Overlay badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isUpcoming ? (
            <span className="bg-surface-elevated/90 text-ink text-eyebrow rounded-pill px-3 py-1.5 font-medium tracking-[var(--track-eyebrow)] uppercase backdrop-blur-sm">
              Coming soon
            </span>
          ) : (
            <span className="bg-surface-elevated/90 text-accent rounded-full p-3 opacity-0 backdrop-blur-sm transition-opacity duration-[var(--dur-fast)] group-hover:opacity-100">
              <Play size={20} strokeWidth={1.5} aria-hidden />
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
          {frontmatter.topic}
        </p>

        <p className="serif text-ink text-headline leading-[1.2] tracking-[var(--track-title)] transition-colors duration-[var(--dur-fast)] group-hover:text-accent">
          {frontmatter.title}
        </p>

        <p className="text-ink-secondary text-footnote flex-1 leading-[1.55]">
          {frontmatter.summary}
        </p>

        {/* Meta + CTA row */}
        <div className="mt-1 flex items-center justify-between">
          <p className="text-ink-tertiary text-caption tabular-nums flex items-center gap-3">
            {frontmatter.duration && (
              <span className="inline-flex items-center gap-1">
                <Clock size={12} strokeWidth={1.75} aria-hidden />
                {frontmatter.duration} min
              </span>
            )}
            <span>{formatDate(frontmatter.date)}</span>
          </p>
          <span
            className={cn(
              "text-footnote font-medium inline-flex items-center gap-1",
              isUpcoming ? "text-ink-secondary" : "text-accent",
            )}
          >
            {isUpcoming ? "Notify me" : "Watch"}
            <ArrowRight
              size={13}
              strokeWidth={1.75}
              aria-hidden
              className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function SessionsFilterGrid({
  sessions,
}: {
  sessions: Session[];
}) {
  const [filter, setFilter] = useState<TopicFilter>("all");

  const filtered =
    filter === "all"
      ? sessions
      : sessions.filter((s) => s.frontmatter.topic === filter);

  return (
    <div>
      <SegmentedControl
        options={TOPIC_OPTIONS}
        value={filter}
        onChange={setFilter}
        ariaLabel="Filter sessions by topic"
        className="mb-10"
      />

      {filtered.length === 0 ? (
        <p className="text-ink-secondary text-callout py-16 text-center">
          No sessions yet in this topic — check back soon.
        </p>
      ) : (
        <ul
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
        >
          {filtered.map((session) => (
            <li key={session.frontmatter.slug}>
              <SessionCard session={session} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
