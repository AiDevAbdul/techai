"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CONTACT_TOPICS, isContactTopic } from "@/lib/contact-topics";

/*
 * "What's this about?" select on the /contact form, preselected from
 * `?topic=` (e.g. /contact?topic=mentorship from a /mentorship CTA).
 *
 * Visible rather than hidden on purpose: a visitor who lands on /contact
 * directly still gets to say what they want, and one arriving from the wrong
 * CTA can correct it.
 *
 * `useSearchParams` forces client-side rendering up to the nearest Suspense
 * boundary on a prerendered route (Next docs: use-search-params §Behavior), so
 * the boundary lives *here* rather than around the whole form — everything
 * else in ContactForm stays in the initial HTML. The fallback is the same
 * markup with no preselection, so there is no layout shift on hydration.
 */

type Props = {
  id: string;
  className: string;
};

function TopicSelect({ id, className, defaultValue }: Props & { defaultValue: string }) {
  return (
    <select id={id} name="topic" defaultValue={defaultValue} className={className}>
      <option value="">Pick one (optional)</option>
      {CONTACT_TOPICS.map((topic) => (
        <option key={topic.value} value={topic.value}>
          {topic.label}
        </option>
      ))}
    </select>
  );
}

function TopicSelectFromParams(props: Props) {
  const params = useSearchParams();
  const raw = params.get("topic");
  return <TopicSelect {...props} defaultValue={isContactTopic(raw) ? raw : ""} />;
}

export default function TopicField(props: Props) {
  return (
    <Suspense fallback={<TopicSelect {...props} defaultValue="" />}>
      <TopicSelectFromParams {...props} />
    </Suspense>
  );
}
