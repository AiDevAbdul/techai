import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * Pill — spec §6 Badge/Pill row.
 *
 * Used for: case-study stack pills ("Next.js", "AI SDK"), eyebrows over
 * sections ("Operations · 2024"), and category chips on Lab Note cards.
 *
 * Variants tune semantic emphasis only — visual treatment is otherwise
 * identical (radius-pill, hairline-on-elevated, label-secondary ink). No
 * filled/outlined toggle: hairline is the contract.
 */

type Variant = "default" | "accent" | "code";

type PillProps = {
  variant?: Variant;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"span">, "children">;

const variantClasses: Record<Variant, string> = {
  default:
    "text-ink-secondary bg-surface-secondary border-separator",
  accent:
    "text-accent bg-[var(--accent-soft)] border-[color-mix(in_oklab,var(--accent)_18%,transparent)]",
  code:
    "text-[var(--code-ink)] bg-[var(--code-bg)] border-separator font-mono",
};

export default function Pill({
  variant = "default",
  className,
  children,
  ...rest
}: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border px-2.5 py-1 text-footnote leading-none whitespace-nowrap",
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
