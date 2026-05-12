"use client";

import { useId, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/*
 * SegmentedControl — Apple-style pill segmented control (spec §6).
 *
 * Visual:
 *   - Outer track: rounded-pill, --bg-secondary, hairline border
 *   - Active pill: --bg-elevated + --shadow-pop, transform-tracks its segment
 *   - Idle labels: --label-secondary; hover lifts to --label-primary
 *
 * Behavior:
 *   - Controlled: pass `value` + `onChange`
 *   - Uncontrolled: pass `defaultValue`
 *   - Keyboard: ArrowLeft / ArrowRight cycle, Home / End jump
 *
 * Used primarily on /services to tab between Audit / Build / Workshop /
 * Speaking. shadcn ships a `Tabs` primitive but it carries a different visual
 * contract; this is the editorial flavor.
 */

export type SegmentedOption<V extends string> = {
  value: V;
  label: string;
};

type SegmentedControlProps<V extends string> = {
  options: readonly SegmentedOption<V>[];
  value?: V;
  defaultValue?: V;
  onChange?: (value: V) => void;
  ariaLabel: string;
  className?: string;
};

export default function SegmentedControl<V extends string>({
  options,
  value,
  defaultValue,
  onChange,
  ariaLabel,
  className,
}: SegmentedControlProps<V>) {
  const groupId = useId();
  const firstOption = options[0];
  if (!firstOption) {
    throw new Error("SegmentedControl requires at least one option");
  }
  const [internal, setInternal] = useState<V>(
    defaultValue ?? value ?? firstOption.value,
  );
  const current = value ?? internal;

  const trackRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<V, HTMLButtonElement>>(new Map());
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);

  useEffect(() => {
    const node = buttonRefs.current.get(current);
    const track = trackRef.current;
    if (!node || !track) return;
    const nodeRect = node.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    setThumb({ x: nodeRect.left - trackRect.left, w: nodeRect.width });
  }, [current, options.length]);

  function select(next: V) {
    if (value === undefined) setInternal(next);
    onChange?.(next);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const idx = options.findIndex((o) => o.value === current);
    if (idx < 0) return;
    let nextIdx: number | null = null;
    if (e.key === "ArrowRight") nextIdx = (idx + 1) % options.length;
    else if (e.key === "ArrowLeft")
      nextIdx = (idx - 1 + options.length) % options.length;
    else if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = options.length - 1;
    if (nextIdx !== null) {
      e.preventDefault();
      const next = options[nextIdx];
      if (next) {
        select(next.value);
        buttonRefs.current.get(next.value)?.focus();
      }
    }
  }

  return (
    <div
      ref={trackRef}
      role="radiogroup"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn(
        "border-separator bg-surface-secondary relative inline-flex items-center rounded-pill border p-1",
        className,
      )}
    >
      {thumb && (
        <span
          aria-hidden
          className="bg-surface-elevated absolute top-1 bottom-1 rounded-pill transition-[left,width] duration-[var(--dur-med)] ease-[var(--ease-out)]"
          style={{
            left: `${thumb.x}px`,
            width: `${thumb.w}px`,
            boxShadow: "var(--shadow-pop)",
          }}
        />
      )}
      {options.map((opt) => {
        const active = opt.value === current;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              if (el) buttonRefs.current.set(opt.value, el);
              else buttonRefs.current.delete(opt.value);
            }}
            type="button"
            role="radio"
            aria-checked={active}
            id={`${groupId}-${opt.value}`}
            tabIndex={active ? 0 : -1}
            onClick={() => select(opt.value)}
            className={cn(
              "relative z-10 rounded-pill px-4 py-1.5 text-footnote font-medium transition-colors duration-[var(--dur-fast)]",
              active ? "text-ink" : "text-ink-secondary hover:text-ink",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
