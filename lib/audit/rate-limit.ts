import "server-only";
import { Redis } from "@upstash/redis";

/*
 * Audit Bot rate limit — 10 starts per IP per hour (spec §7.8).
 *
 * Backed by Upstash Redis (the documented Vercel KV successor). The client
 * is only constructed when both UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN are set; in dev or with no credentials, the
 * limiter is a no-op (allow everything) and we log a warning once at boot.
 *
 * Strategy: fixed window — a counter keyed by IP, expiring at the top of
 * the next hour. Simple, correct, no external dependencies beyond Redis.
 * The race on first INCR (set TTL the same call) is handled by checking the
 * incremented value and setting expiry only when it's 1.
 *
 * Counts STARTS, not turns. The client triggers a single rate-limit check
 * before issuing the first question; subsequent turns in the same flow are
 * unmetered (they're already inside the 10/hr budget).
 */

const WINDOW_SECONDS = 60 * 60;
const MAX_STARTS = 10;

let cachedClient: Redis | null | undefined;

function getClient(): Redis | null {
  if (cachedClient !== undefined) return cachedClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    console.warn(
      "[audit/rate-limit] UPSTASH_REDIS_REST_* missing — rate limit disabled.",
    );
    cachedClient = null;
    return null;
  }
  cachedClient = new Redis({ url, token });
  return cachedClient;
}

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfterSeconds: number };

export async function checkAuditRateLimit(
  ip: string,
): Promise<RateLimitResult> {
  const client = getClient();
  if (!client) return { ok: true, remaining: MAX_STARTS };

  const key = `audit:start:${ip}`;
  try {
    const count = await client.incr(key);
    if (count === 1) {
      await client.expire(key, WINDOW_SECONDS);
    }
    if (count > MAX_STARTS) {
      const ttl = await client.ttl(key);
      return {
        ok: false,
        retryAfterSeconds: ttl > 0 ? ttl : WINDOW_SECONDS,
      };
    }
    return { ok: true, remaining: Math.max(0, MAX_STARTS - count) };
  } catch (err) {
    // Fail open: a Redis outage shouldn't take down the demo. Log loudly.
    console.error("[audit/rate-limit] Redis call failed", err);
    return { ok: true, remaining: MAX_STARTS };
  }
}

export function clientIpFromHeaders(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip") ?? "unknown";
}
