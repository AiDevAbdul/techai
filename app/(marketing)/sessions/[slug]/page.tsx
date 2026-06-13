import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, ExternalLink, Bell } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Container from "@/components/brand/Container";
import PlausiblePageEvent from "@/components/brand/PlausiblePageEvent";
import Prose from "@/components/ui/prose";
import YouTubePlayer from "@/components/sessions/YouTubePlayer";
import SessionNotifyForm from "@/components/sessions/SessionNotifyForm";
import {
  getAllSessions,
  getSessionBySlug,
  getSessionSlugs,
} from "@/lib/content/sessions";

/*
 * /sessions/[slug] — session detail page.
 *
 * Recorded sessions: YouTube embed (privacy-enhanced) + session notes + resources.
 * Upcoming sessions: placeholder + notify form prominently above the fold.
 *
 * Video JSON-LD is included for recorded sessions so Google can index the video.
 * Upcoming sessions carry no video schema.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdulwahabai.com";

export async function generateStaticParams() {
  const slugs = await getSessionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const session = await getSessionBySlug(slug);
  if (!session) return {};
  const { title, summary } = session.frontmatter;
  return {
    title,
    description: summary,
    alternates: { canonical: `/sessions/${slug}` },
    openGraph: {
      title,
      description: summary,
      url: `/sessions/${slug}`,
      type: "website",
    },
  };
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSessionBySlug(slug);
  if (!session) notFound();

  const { frontmatter, body } = session;
  const isUpcoming = frontmatter.type === "upcoming";

  const videoJsonLd =
    frontmatter.youtubeId && /^[a-zA-Z0-9_-]{11}$/.test(frontmatter.youtubeId)
      ? {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: frontmatter.title,
          description: frontmatter.summary,
          uploadDate: frontmatter.date,
          embedUrl: `https://www.youtube-nocookie.com/embed/${frontmatter.youtubeId}`,
          author: {
            "@type": "Person",
            name: "Abdul Wahab",
            url: `${SITE_URL}/about`,
          },
          ...(frontmatter.duration
            ? { duration: `PT${frontmatter.duration}M` }
            : {}),
        }
      : null;

  return (
    <main id="main" className="flex flex-1 flex-col">
      <PlausiblePageEvent event={`session_view_${frontmatter.slug}`} />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <Container as="section" className="pt-14 pb-10 lg:pt-22 lg:pb-14">
        <Link
          href="/sessions"
          className="text-ink-secondary hover:text-ink text-footnote inline-flex items-center gap-1.5 transition-colors duration-[var(--dur-fast)]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
          All Sessions
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
            {frontmatter.topic}
          </span>
          {isUpcoming && (
            <span className="bg-accent-soft text-accent text-eyebrow rounded-pill px-2.5 py-1 font-medium tracking-[var(--track-eyebrow)] uppercase">
              Upcoming
            </span>
          )}
        </div>

        <h1 className="serif text-ink mt-4 max-w-[28ch] text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.08] tracking-[var(--track-display)]">
          {frontmatter.title}
        </h1>

        <p className="text-ink-secondary text-callout mt-5 max-w-[58ch] leading-[1.55]">
          {frontmatter.summary}
        </p>

        <p className="text-ink-tertiary text-footnote mt-4 flex flex-wrap items-center gap-4">
          {frontmatter.duration && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} strokeWidth={1.75} aria-hidden />
              {frontmatter.duration} min
            </span>
          )}
          <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
        </p>
      </Container>

      {/* ── Video / placeholder ────────────────────────────────────────── */}
      <Container as="section" className="pb-14">
        {frontmatter.youtubeId ? (
          <YouTubePlayer
            videoId={frontmatter.youtubeId}
            title={frontmatter.title}
          />
        ) : null}
        {(!frontmatter.youtubeId ||
          !/^[a-zA-Z0-9_-]{11}$/.test(frontmatter.youtubeId)) && (
          <div className="border-separator bg-surface-tertiary flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-2xl border">
            <Bell
              size={36}
              strokeWidth={1.25}
              className="text-ink-tertiary"
              aria-hidden
            />
            <p className="text-ink-secondary text-callout">
              {isUpcoming
                ? "This session hasn't recorded yet — join the notify list below."
                : "Video coming soon."}
            </p>
          </div>
        )}
      </Container>

      {/* ── Session notes (MDX body) ───────────────────────────────────── */}
      {body.trim() && (
        <Container as="section" className="pb-16">
          <Prose>
            <MDXRemote source={body} />
          </Prose>
        </Container>
      )}

      {/* ── Resources ─────────────────────────────────────────────────── */}
      {frontmatter.resources && frontmatter.resources.length > 0 && (
        <section
          aria-labelledby="resources-heading"
          className="border-separator border-t"
        >
          <Container className="py-14">
            <p
              id="resources-heading"
              className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase"
            >
              Session resources
            </p>
            <ul className="mt-5 flex flex-wrap gap-3" role="list">
              {frontmatter.resources.map((resource) => (
                <li key={resource.href}>
                  <a
                    href={resource.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface-elevated border-separator hover:border-separator-opaque text-ink text-footnote inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 transition-colors duration-[var(--dur-fast)]"
                  >
                    {resource.label}
                    <ExternalLink
                      size={13}
                      strokeWidth={1.75}
                      aria-hidden
                      className="text-ink-tertiary"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      {/* ── Notify + CTA ──────────────────────────────────────────────── */}
      <section
        aria-labelledby="session-notify-heading"
        className="border-separator bg-surface-secondary border-t"
      >
        <Container className="py-18">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
                {isUpcoming ? "Get notified" : "Stay in the loop"}
              </p>
              <h2
                id="session-notify-heading"
                className="serif text-ink mt-3 max-w-[20ch] text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] tracking-[var(--track-title)]"
              >
                {isUpcoming ? "Be first to join." : "Next session in your inbox."}
              </h2>
              <p className="text-ink-secondary text-callout mt-4 max-w-[40ch] leading-[1.55]">
                {isUpcoming
                  ? "I'll email you as soon as the date and link are confirmed. One email, no spam."
                  : "I run sessions every couple of weeks. Drop your email and I'll send you the link when the next one is live."}
              </p>
            </div>
            <div className="max-w-[36rem]">
              <SessionNotifyForm sessionSlug={frontmatter.slug} />
            </div>
          </div>
        </Container>
      </section>

      {videoJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
        />
      )}
    </main>
  );
}
