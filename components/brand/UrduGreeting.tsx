import { Play } from "lucide-react";

/*
 * UrduGreeting — Urdu-language 30–45s video greeting on /about (spec §7.9).
 *
 * Env-gated. While NEXT_PUBLIC_MUX_PLAYBACK_ID is unset we render an
 * editorial "recording lands soon" card so the page is shippable before
 * the asset is ready (Q5 in spec §15 — recording is the owner's task).
 *
 * When the playback id ships, swap the placeholder for `@mux/mux-player-react`:
 *     <MuxPlayer
 *       streamType="on-demand"
 *       playbackId={playbackId}
 *       preload="metadata"
 *       poster={`https://image.mux.com/${playbackId}/thumbnail.webp?time=2`}
 *       primaryColor="var(--accent)"
 *       accentColor="var(--accent)"
 *     >
 *       <track kind="captions" src="/about/urdu-greeting.en.vtt" srcLang="en" label="English" default />
 *     </MuxPlayer>
 *
 * Install: `pnpm add @mux/mux-player-react` then drop the placeholder branch.
 */

export default function UrduGreeting() {
  const playbackId = process.env.NEXT_PUBLIC_MUX_PLAYBACK_ID;

  return (
    <figure
      className="border-separator bg-surface-elevated overflow-hidden rounded-2xl border"
      aria-labelledby="urdu-greeting-caption"
    >
      <div className="relative aspect-[16/9] w-full">
        {playbackId ? (
          <video
            className="h-full w-full bg-black object-cover"
            controls
            preload="metadata"
            poster={`https://image.mux.com/${playbackId}/thumbnail.webp?time=2`}
            playsInline
          >
            <source
              src={`https://stream.mux.com/${playbackId}.m3u8`}
              type="application/x-mpegURL"
            />
            <track
              kind="captions"
              src="/about/urdu-greeting.en.vtt"
              srcLang="en"
              label="English"
              default
            />
            Your browser does not support the video element.
          </video>
        ) : (
          <div className="from-accent-soft to-surface-secondary absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br p-8 text-center">
            <span
              aria-hidden
              className="bg-surface-elevated border-separator text-accent flex h-14 w-14 items-center justify-center rounded-full border shadow-sm"
            >
              <Play size={20} strokeWidth={1.75} className="translate-x-[1px]" />
            </span>
            <p className="text-ink text-callout mt-5 max-w-[36ch] font-medium">
              A 30-second Urdu greeting from Abdul lands here at launch.
            </p>
            <p className="text-ink-secondary text-footnote mt-2 max-w-[40ch] leading-[1.55]">
              English captions ship with it. Until then, the rest of this
              page is the introduction.
            </p>
          </div>
        )}
      </div>
      <figcaption
        id="urdu-greeting-caption"
        className="border-separator text-ink-secondary text-caption flex flex-wrap items-center gap-x-3 gap-y-1 border-t px-6 py-3"
      >
        <span className="text-ink font-medium">Greeting · Urdu</span>
        <span aria-hidden>·</span>
        <span>30–45 seconds · English captions</span>
      </figcaption>
    </figure>
  );
}
