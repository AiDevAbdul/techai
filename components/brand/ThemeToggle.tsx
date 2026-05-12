"use client";

import { useEffect, useReducer, useRef } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

/*
 * Theme toggle — system | light | dark.
 *
 * The no-flash bootstrap in app/layout.tsx already set <html data-theme> at
 * paint time from localStorage. This component just lets the user change it.
 *
 * State lives in a useReducer rather than useState because the plan §2 Day 1
 * pins it to useReducer (keeps the contract explicit — easy to extend with
 * additional theme variants later without restructuring).
 */

export type Theme = "system" | "light" | "dark";

type Action = { type: "set"; theme: Theme };

function reducer(_: Theme, action: Action): Theme {
  return action.theme;
}

/*
 * Initial state: read what the bootstrap script wrote. On the server (where
 * `document` is undefined) default to "system" — the client will reconcile.
 * suppressHydrationWarning on <html> in layout.tsx tolerates the mismatch.
 */
function readInitial(): Theme {
  if (typeof document === "undefined") return "system";
  const attr = document.documentElement.getAttribute("data-theme");
  return attr === "light" || attr === "dark" ? attr : "system";
}

export default function ThemeToggle() {
  const [theme, dispatch] = useReducer(reducer, "system", readInitial);
  const isFirstRender = useRef(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      if (theme === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", theme);
    } catch {
      // localStorage unavailable (Safari private mode, etc.) — keep DOM in sync regardless
    }
    // Emit Plausible `theme_toggle` event on user-driven changes only,
    // not the initial mount/hydration.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.plausible?.("theme_toggle", { props: { theme } });
  }, [theme]);

  const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
    { value: "system", label: "System theme", Icon: Monitor },
    { value: "light", label: "Light theme", Icon: Sun },
    { value: "dark", label: "Dark theme", Icon: Moon },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="border-separator inline-flex items-center gap-0.5 rounded-pill border bg-[var(--bg-elevated)] p-0.5"
    >
      {options.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            onClick={() => dispatch({ type: "set", theme: value })}
            className={`flex h-7 w-7 items-center justify-center rounded-pill transition-[background-color,color] duration-[var(--dur-fast)] ${
              active
                ? "bg-accent text-white"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            <Icon size={14} strokeWidth={1.75} aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
