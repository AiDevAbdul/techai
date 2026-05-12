"use client";

import { useEffect, useRef } from "react";

/*
 * Cal.com inline embed — /contact (spec §7.10).
 *
 * Loads Cal.com's embed.js once, then mounts an inline calendar in the
 * referenced div. Brand color overridden to forest green (#15573D — the
 * site's `--accent` token).
 *
 * Calendar link: `NEXT_PUBLIC_CAL_LINK` (e.g. "abdulwahab/30min"). If
 * unset, renders a tasteful "calendar coming online soon" placeholder so
 * the page is shippable before the booking link is wired.
 *
 * Theme: passes "light" by default; the embed has its own styling and we
 * don't want it inheriting the site's data-theme attribute mid-flight.
 */

type CalApi = {
  (cmd: string, ...args: unknown[]): void;
  q?: unknown[];
  loaded?: boolean;
  ns?: Record<string, CalApi>;
};

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

const NAMESPACE = "30min";

export default function CalEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK;

  useEffect(() => {
    if (!calLink || !containerRef.current) return;

    const target = containerRef.current;
    const win = window;

    // Cal.com's official bootstrap, adapted to TypeScript. Idempotent —
    // mounting twice (StrictMode dev double-render) is safe.
    if (!win.Cal) {
      const cal = function (...args: unknown[]) {
        (cal.q = cal.q || []).push(args);
      } as CalApi;
      cal.q = [];
      cal.ns = {};
      win.Cal = cal;
      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      document.head.appendChild(script);
    }

    const Cal = win.Cal!;
    Cal("init", NAMESPACE, { origin: "https://cal.com" });
    const ns = Cal.ns?.[NAMESPACE];
    if (!ns) return;
    ns("inline", {
      elementOrSelector: target,
      calLink,
      layout: "month_view",
    });
    ns("ui", {
      theme: "light",
      cssVarsPerTheme: {
        light: { "cal-brand": "#15573D" },
      },
      hideEventTypeDetails: false,
    });
  }, [calLink]);

  if (!calLink) {
    return (
      <div className="border-separator bg-surface-elevated flex min-h-[480px] flex-col items-center justify-center rounded-2xl border p-10 text-center">
        <p className="text-ink text-callout max-w-[36ch] font-medium">
          Booking calendar lights up at launch.
        </p>
        <p className="text-ink-secondary text-footnote mt-3 max-w-[42ch] leading-[1.55]">
          Until then, send a note via the form — I read every inbound and
          reply within two business days.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="border-separator bg-surface-elevated min-h-[480px] overflow-hidden rounded-2xl border"
    />
  );
}
