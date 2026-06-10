/*
 * YouTubePlayer — privacy-enhanced embed (youtube-nocookie.com).
 * No tracking scripts load until the user presses play.
 *
 * YouTube video IDs are exactly 11 chars ([a-zA-Z0-9_-]).
 * Returns null for invalid / placeholder IDs so the caller can render
 * its own fallback — avoids broken embeds while content is being prepared.
 */

const YOUTUBE_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

type Props = {
  videoId: string;
  title: string;
};

export default function YouTubePlayer({ videoId, title }: Props) {
  if (!YOUTUBE_ID_RE.test(videoId)) return null;

  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&color=white`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
      className="w-full aspect-video rounded-2xl border-0"
    />
  );
}
