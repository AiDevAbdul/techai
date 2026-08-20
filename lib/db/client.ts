import "server-only";
import postgres from "postgres";

/*
 * Lazy Postgres singleton (Supabase-hosted, via the Supavisor pooler).
 * Mirrors `lib/email/send.ts`'s graceful-missing-env pattern: returns null
 * instead of throwing when DATABASE_URL isn't set yet, so `next build` and
 * local dev without the secret don't crash — callers decide how to degrade.
 */

let _sql: ReturnType<typeof postgres> | null = null;

export function getDb() {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  _sql = postgres(url, { ssl: "require" });
  return _sql;
}
