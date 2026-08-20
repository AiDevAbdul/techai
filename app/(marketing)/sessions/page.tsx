import { redirect } from "next/navigation";

/*
 * /sessions — folded into /learn (spec extension consolidated 2026-08-20).
 * The session-listing UI now lives on /learn; individual /sessions/[slug]
 * detail pages are unchanged and keep their indexed URLs.
 */
export default function SessionsIndexRedirect() {
  redirect("/learn");
}
