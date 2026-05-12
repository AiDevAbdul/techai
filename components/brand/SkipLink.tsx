/*
 * SkipLink — first focusable element on every page.
 * Hidden off-screen until focused; spec §9 requires it for screen-reader and
 * keyboard navigation. Anchor target is `#main`, which the page-level <main>
 * element provides (see app/page.tsx and stub pages).
 */
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="bg-accent text-primary-foreground fixed top-4 left-4 z-50 -translate-y-20 rounded-md px-4 py-2 text-sm font-medium transition-transform duration-[var(--dur-fast)] focus:translate-y-0 focus-visible:outline-none"
    >
      Skip to content
    </a>
  );
}
