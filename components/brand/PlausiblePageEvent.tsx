"use client";

import { useEffect } from "react";

/*
 * Fire a single Plausible custom event on mount.
 *
 * Used for view-style events the spec §12 specifies per-slug:
 *   `case_study_view_{slug}` on /work/[slug]
 *   `lab_note_view_{slug}`  on /lab/[slug]
 *
 * Why a dedicated component instead of a useEffect inline: keeps the
 * server-rendered MDX page tree boring (no client transitions) and the
 * event is the only client-side concern.
 */

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

export default function PlausiblePageEvent({
  event,
  props,
}: {
  event: string;
  props?: Record<string, string | number | boolean>;
}) {
  useEffect(() => {
    window.plausible?.(event, props ? { props } : undefined);
  }, [event, props]);
  return null;
}
