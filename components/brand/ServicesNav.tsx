"use client";

import { useEffect, useState } from "react";
import SegmentedControl from "@/components/ui/segmented-control";
import { SERVICES_SECTION_SCROLL_MARGIN } from "@/lib/services-nav-offset";

/*
 * ServicesNav — sticky segmented control above the four tier sections on
 * `/services`. Three jobs:
 *
 *   1. Smooth-scroll to the corresponding `<section id={slug}>` on click,
 *      with an offset that accounts for the global sticky Navbar + this nav
 *      itself. Sections use `scroll-margin-top` so anchor jumps land below
 *      the chrome instead of behind it.
 *   2. IntersectionObserver mirrors the active pill to whichever section is
 *      currently in view, so the chrome stays honest as you scroll.
 *   3. Hash sync — `/services#workshop` opens with the workshop pill active
 *      and scrolled into view on mount. Click updates the hash via
 *      replaceState so back-button doesn't trap on every tab change.
 *
 * The Navbar sticks at top-0 and is ~48px tall, so this sits at top-12.
 * The combined offset (~120px including breathing) lives in
 * SERVICES_SECTION_SCROLL_MARGIN, exposed for the page to apply via inline style.
 */

type Option = { value: string; label: string };

type Props = {
  options: readonly Option[];
  /* Overridable so /mentorship can label its own tier list ("Mentorship
   * offers") instead of borrowing the /services wording. */
  ariaLabel?: string;
};

export default function ServicesNav({
  options,
  ariaLabel = "Service tiers",
}: Props) {
  const first = options[0];
  if (!first) throw new Error("ServicesNav needs at least one option");
  const [active, setActive] = useState<string>(first.value);

  /* Hash sync is handled implicitly: a fresh `/services#workshop` load lets
   * the browser native-scroll to the section (respecting scroll-margin-top
   * on each section), which then triggers the IntersectionObserver below
   * and marks workshop as active. No explicit setState-from-hash needed. */

  useEffect(() => {
    const sections = options
      .map((o) => document.getElementById(o.value))
      .filter((n): n is HTMLElement => n !== null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const top = visible[0];
        if (top) setActive(top.target.id);
      },
      {
        rootMargin: `-${SERVICES_SECTION_SCROLL_MARGIN + 16}px 0px -55% 0px`,
        threshold: 0,
      },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [options]);

  function onChange(next: string) {
    setActive(next);
    const node = document.getElementById(next);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${next}`);
  }

  return (
    <div className="border-separator sticky top-12 z-30 border-y bg-[var(--material-thick)] backdrop-blur-xl backdrop-saturate-150">
      {/* Centred when it fits, horizontally scrollable when it doesn't. The
       * /mentorship labels are longer than the /services ones and pushed the
       * whole page wide at 390px; `w-max` + `mx-auto` keeps the centring but
       * lets the control scroll inside its own box instead. */}
      <div className="overflow-x-auto px-6 py-3">
        <div className="mx-auto w-max">
          <SegmentedControl
            ariaLabel={ariaLabel}
            options={options}
            value={active}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
