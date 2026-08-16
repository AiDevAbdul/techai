"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RotateCw } from "lucide-react";
import Container from "@/components/brand/Container";

/*
 * Root route-segment error boundary (Next.js 16).
 *
 * Wraps every page under app/layout.tsx, so Navbar + Footer still render
 * around it — the visitor keeps full navigation. Errors thrown *by the root
 * layout itself* escape this boundary and are caught by app/global-error.tsx.
 *
 * Nothing from `error` is rendered except `digest` — a Next.js-generated hash
 * with no payload from the original exception. `error.message` and stacks are
 * never shown: in production Next.js already replaces Server Component
 * messages with a generic string, but Client Component errors would leak
 * verbatim, so we don't print the message at all.
 *
 * console.error is the established client-side logging channel in this repo
 * (see components/audit/AuditBot.tsx); the house rule bans console.log, not
 * console.error.
 */

type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function RootError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("[app/error] route segment failed", error);
  }, [error]);

  return (
    <main id="main" className="flex flex-1 flex-col">
      <Container as="section" className="pt-18 pb-16 lg:pt-26 lg:pb-20">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          Something broke
        </p>
        <h1 className="serif text-ink mt-6 max-w-[20ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          This page didn&rsquo;t load.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[54ch] leading-[1.55]">
          The fault is on my side, not yours. Trying again usually clears it. If
          it doesn&rsquo;t, write to me and I&rsquo;ll fix it.
        </p>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={reset}
            className="bg-accent text-primary-foreground hover:bg-accent-hover rounded-pill text-callout inline-flex items-center gap-2 px-5 py-2.5 font-medium transition-colors duration-[var(--dur-fast)]"
          >
            <RotateCw size={16} strokeWidth={1.75} aria-hidden />
            Try again
          </button>
          <Link
            href="/"
            className="text-ink hover:text-accent text-callout inline-flex items-center gap-2 font-medium transition-colors duration-[var(--dur-fast)]"
          >
            Go to the homepage
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
          </Link>
        </div>

        {error.digest && (
          <p className="text-ink-tertiary text-caption mt-10">
            Reference{" "}
            <code className="text-ink-secondary bg-surface-secondary rounded-xs px-1.5 py-0.5 font-mono">
              {error.digest}
            </code>{" "}
            — include it if you get in touch.
          </p>
        )}
      </Container>

      <section className="border-separator bg-surface-secondary border-t">
        <Container className="py-16 lg:py-22">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[42ch]">
              <h2 className="serif text-ink text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.1] tracking-[var(--track-title)]">
                Still stuck?
              </h2>
              <p className="text-ink-secondary text-callout mt-4 leading-[1.55]">
                Send me the page you were trying to reach — or book a
                30-minute call and we&rsquo;ll talk about the work instead.
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-accent text-primary-foreground hover:bg-accent-hover rounded-pill text-callout inline-flex items-center gap-2 px-5 py-2.5 font-medium transition-colors duration-[var(--dur-fast)]"
            >
              Get in touch
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
