"use client";

import { useEffect } from "react";
import Link from "next/link";
import Container from "@/components/brand/Container";
import "./globals.css";

/*
 * Last-resort error boundary (Next.js 16).
 *
 * global-error.tsx REPLACES app/layout.tsx when it fires, so everything the
 * root layout normally provides is gone: <html>/<body>, the stylesheet, the
 * font variables, the theme bootstrap, Navbar and Footer. Each is handled
 * deliberately below rather than left to chance:
 *
 *  - Styles: `import "./globals.css"` pulls in Tailwind + styles/tokens.css,
 *    so every design token (`--bg`, `--label-primary`, `--accent`, the type
 *    scale, radii) resolves exactly as elsewhere.
 *
 *  - Fonts: next/font loaders cannot run inside a Client Component, and error
 *    boundaries must be Client Components — so `--font-fraunces` /
 *    `--font-jetbrains-mono` are NOT defined here. This is intentional:
 *    styles/tokens.css declares those variables with full fallback chains
 *    (`--font-serif: var(--font-fraunces, ui-serif), "New York", Charter,
 *    Georgia, serif`), so `.serif` degrades to New York / Georgia and body
 *    text to the same system sans stack the rest of the site uses. The page
 *    is fully styled, just one display face off — an acceptable trade for a
 *    boundary that must never depend on the thing that just failed.
 *
 *  - Theme: <html data-theme="system"> is the server-rendered default (that
 *    exact attribute value is what styles/tokens.css keys its
 *    prefers-color-scheme block on), and the same inline bootstrap the root
 *    layout uses re-applies a stored light/dark choice before paint.
 *
 *  - Chrome: no Navbar/Footer — they mount under providers that may be part
 *    of the failure. A plain link home is the only exit offered.
 *
 * `metadata` exports are unavailable in a Client Component, so the document
 * title is set with React's <title>.
 *
 * The error object is never rendered: no message, no stack. Only `digest`,
 * a Next.js-generated hash carrying no detail from the original exception.
 */

const themeBootstrap = `(function () {
  try {
    var stored = localStorage.getItem('theme');
    var theme = stored === 'light' || stored === 'dark' ? stored : 'system';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'system');
  }
})();`;

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[app/global-error] root layout failed", error);
  }, [error]);

  return (
    <html lang="en" className="h-full" data-theme="system" suppressHydrationWarning>
      <body className="bg-surface text-ink flex min-h-full flex-col">
        <title>Something went wrong · Abdul Wahab</title>
        <meta name="robots" content="noindex" />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />

        <main id="main" className="flex flex-1 flex-col justify-center">
          <Container as="section" className="py-22">
            <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
              Something broke
            </p>
            <h1 className="serif text-ink mt-6 max-w-[20ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
              The site couldn&rsquo;t load.
            </h1>
            <p className="text-ink-secondary text-callout mt-6 max-w-[52ch] leading-[1.55]">
              This one is on my side. Reload and it will usually come back. If
              it doesn&rsquo;t, write to{" "}
              <a
                href="mailto:info@abdulwahabai.com"
                className="text-ink underline-offset-4 hover:underline"
              >
                info@abdulwahabai.com
              </a>{" "}
              and I&rsquo;ll look into it.
            </p>

            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={reset}
                className="bg-accent text-primary-foreground hover:bg-accent-hover rounded-pill text-callout inline-flex items-center gap-2 px-5 py-2.5 font-medium transition-colors duration-[var(--dur-fast)]"
              >
                Reload the page
              </button>
              <Link
                href="/"
                prefetch={false}
                className="text-ink hover:text-accent text-callout inline-flex items-center gap-2 font-medium transition-colors duration-[var(--dur-fast)]"
              >
                Go to the homepage
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
        </main>
      </body>
    </html>
  );
}
