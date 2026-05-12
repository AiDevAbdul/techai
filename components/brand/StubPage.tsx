import Container from "./Container";

/*
 * StubPage — Day 2 chrome-only placeholder for IA routes that haven't been
 * built yet. Provides:
 *  - <main id="main"> so the skip-link target exists
 *  - one <h1> per page (axe-core gate)
 *  - eyebrow with the route name + week the real page lands
 *
 * Every stub page in `app/(marketing)` and `app/(lab)` uses this. Each gets
 * replaced by real content on its own day per docs/plan.md §§2–4. Delete
 * this file when the last stub goes away.
 */

type StubPageProps = {
  title: string;
  shipsOn: string;
  eyebrow?: string;
};

export default function StubPage({ title, shipsOn, eyebrow }: StubPageProps) {
  return (
    <main id="main" className="flex flex-1 flex-col">
      <Container as="section" className="py-22">
        {eyebrow && (
          <p className="text-ink-secondary text-eyebrow mb-6 tracking-[0.06em] uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="serif text-ink text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[-0.022em]">
          {title}
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[44ch]">
          This page is being built. Real content ships on <strong className="text-ink font-medium">{shipsOn}</strong>.
        </p>
      </Container>
    </main>
  );
}
