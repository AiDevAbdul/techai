import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Lesson } from "./courses";

const YT_API = "https://www.googleapis.com/youtube/v3";

type RawItem = { position: number; videoId: string; title: string };

async function fetchAllPlaylistItems(
  playlistId: string,
  apiKey: string,
): Promise<RawItem[]> {
  const items: RawItem[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      part: "snippet",
      playlistId,
      maxResults: "50",
      key: apiKey,
      ...(pageToken ? { pageToken } : {}),
    });
    const res = await fetch(`${YT_API}/playlistItems?${params}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) break;
    const data = (await res.json()) as {
      items?: { snippet: { position: number; title: string; resourceId: { videoId: string } } }[];
      nextPageToken?: string;
    };

    for (const item of data.items ?? []) {
      const title = item.snippet.title;
      if (title === "Private video" || title === "Deleted video") continue;
      items.push({
        position: item.snippet.position + 1,
        videoId: item.snippet.resourceId.videoId,
        title,
      });
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return items;
}

type VideoDetail = { duration: string; description: string };

async function fetchVideoDetails(
  videoIds: string[],
  apiKey: string,
): Promise<Map<string, VideoDetail>> {
  const map = new Map<string, VideoDetail>();

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const params = new URLSearchParams({
      part: "contentDetails,snippet",
      id: batch.join(","),
      key: apiKey,
    });
    const res = await fetch(`${YT_API}/videos?${params}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) continue;
    const data = (await res.json()) as {
      items?: {
        id: string;
        contentDetails: { duration: string };
        snippet: { description: string };
      }[];
    };

    for (const item of data.items ?? []) {
      map.set(item.id, {
        duration: parseDuration(item.contentDetails.duration),
        description: item.snippet.description ?? "",
      });
    }
  }

  return map;
}

function parseDuration(iso: string): string {
  const h = iso.match(/(\d+)H/)?.[1];
  const m = iso.match(/(\d+)M/)?.[1];
  const s = iso.match(/(\d+)S/)?.[1];
  const parts: string[] = [];
  if (h) parts.push(`${h} hr`);
  if (m) parts.push(`${parseInt(m)} min`);
  if (!h && !m && s) parts.push(`${s} sec`);
  return parts.join(" ") || "—";
}

export async function getPlaylistLessons(playlistId: string): Promise<Lesson[]> {
  "use cache";
  // Playlists gain a lesson every week or two, not every hour. `days` (24h
  // revalidate) matches the real change rate; `cacheTag` below is the escape
  // hatch for publishing a video and wanting it live immediately.
  cacheLife("days");
  cacheTag(`yt-${playlistId}`);

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || !playlistId) return [];

  const items = await fetchAllPlaylistItems(playlistId, apiKey);
  const details = await fetchVideoDetails(
    items.map((i) => i.videoId),
    apiKey,
  );

  return items.map((item) => {
    const detail = details.get(item.videoId);
    return {
      slug: item.videoId,
      number: item.position,
      title: item.title,
      videoId: item.videoId,
      duration: detail?.duration ?? "—",
      description: detail?.description ?? "",
    } satisfies Lesson;
  });
}
