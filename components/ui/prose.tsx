import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * Prose — MDX render surface for case studies and Lab Notes.
 *
 * Strategy: layer Apple-scale overrides on top of @tailwindcss/typography's
 * `prose` base. The base handles the boring parts (link underlines, list
 * indentation, blockquote spacing); the override block here pins:
 *
 *   - Body: 17px (var(--t-body)), leading 1.5, label-primary ink
 *   - Headings: display sans except h1, which can opt into Fraunces serif
 *     via the `serif-h1` flag (case-study titles only — spec §5.3)
 *   - Code: JetBrains Mono on --code-bg
 *   - Links: forest underline, accent ring on focus
 *   - Reading rail: max-w-[68ch] (caller can override with `wide`)
 */

type ProseProps = {
  children: ReactNode;
  /** Apply Fraunces (serif) to h1 — case-study titles only. */
  serifH1?: boolean;
  /** Drop the 68ch reading rail (caller controls width). */
  wide?: boolean;
} & Omit<ComponentPropsWithoutRef<"div">, "children">;

export default function Prose({
  children,
  serifH1 = false,
  wide = false,
  className,
  ...rest
}: ProseProps) {
  return (
    <div
      className={cn(
        // base typography plugin
        "prose prose-neutral dark:prose-invert",
        // reading rail unless caller opts out
        !wide && "max-w-[68ch]",
        // ── Apple-scale overrides ──
        // Body
        "prose-p:text-[var(--t-body)] prose-p:leading-[var(--lh-body)] prose-p:text-ink",
        // Headings — display sans by default
        "prose-headings:font-[var(--font-display)] prose-headings:text-ink prose-headings:tracking-[var(--track-title)]",
        "prose-h1:text-[var(--t-title1)] prose-h1:leading-[var(--lh-title)]",
        "prose-h2:text-[var(--t-title2)] prose-h2:leading-[var(--lh-title)] prose-h2:mt-15 prose-h2:mb-6",
        "prose-h3:text-[var(--t-title3)] prose-h3:leading-[var(--lh-title)] prose-h3:mt-11 prose-h3:mb-4",
        "prose-h4:text-[var(--t-headline)]",
        // Optional serif H1 (case-study titles)
        serifH1 && "prose-h1:[font-family:var(--font-serif)] prose-h1:[font-variation-settings:'opsz'_auto] prose-h1:tracking-[var(--track-display)] prose-h1:text-[var(--t-display)] prose-h1:leading-[var(--lh-display)]",
        // Links — forest underline, hairline offset
        "prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-[3px] prose-a:decoration-[1px]",
        // Strong / em — preserve weight, drop quote marks on blockquote
        "prose-strong:text-ink prose-strong:font-medium",
        // Code (inline)
        "prose-code:[font-family:var(--font-mono)] prose-code:text-[0.9em] prose-code:bg-[var(--code-bg)] prose-code:text-[var(--code-ink)] prose-code:rounded-[var(--radius-xs)] prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none",
        // Blockquote — editorial, no italic, hairline left rule
        "prose-blockquote:border-l-2 prose-blockquote:border-[var(--accent)] prose-blockquote:not-italic prose-blockquote:text-ink prose-blockquote:font-normal prose-blockquote:pl-6",
        // Lists
        "prose-li:text-ink prose-li:marker:text-ink-tertiary",
        // hr — hairline
        "prose-hr:border-separator prose-hr:my-15",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
