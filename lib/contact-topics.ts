/*
 * Shared source of truth for the `?topic=` param on /contact.
 *
 * Every CTA across the site links to `/contact?topic=<value>`; the contact
 * form preselects the matching option and the Server Action puts the label in
 * the owner email subject. Values must stay stable — they are live in links
 * on /services and /mentorship, and in any link Abdul has already shared.
 *
 * Plain module (no "server-only"): imported by both the client form and the
 * Server Action so the two can never drift.
 *
 * Unknown values are treated as absent rather than rejected — a stale or
 * hand-edited link must never block a real enquiry from being sent.
 */

export const CONTACT_TOPICS = [
  { value: "mentorship", label: "1:1 mentorship" },
  { value: "consultation", label: "One-hour consultation" },
  { value: "team-training", label: "Team training" },
  { value: "talks", label: "Talk or workshop for a community" },
  { value: "audit", label: "Workflow audit" },
  { value: "build", label: "Build project" },
  { value: "workshop", label: "Team workshop" },
  { value: "speaking", label: "Speaking or executive briefing" },
  { value: "other", label: "Something else" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

const TOPIC_VALUES = CONTACT_TOPICS.map((t) => t.value) as readonly string[];

export const CONTACT_TOPIC_VALUES = TOPIC_VALUES as readonly ContactTopic[];

export function isContactTopic(value: unknown): value is ContactTopic {
  return typeof value === "string" && TOPIC_VALUES.includes(value);
}

export function contactTopicLabel(value: ContactTopic): string {
  return CONTACT_TOPICS.find((t) => t.value === value)?.label ?? value;
}
