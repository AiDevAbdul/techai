import Container from "@/components/brand/Container";

export const metadata = {
  title: "اردو — Coming soon",
  description: "Urdu version of the site is in v2 scope.",
  robots: { index: false, follow: false },
};

/*
 * /ur — stub for the Urdu locale link in the footer.
 *
 * v1 ships English-only UI (spec §1.2). The /ur route exists so the footer
 * link isn't a 404 and to plant the SEO intent. Real Urdu UI is v2 scope.
 * The about page's Urdu video greeting is the only Urdu surface in v1.
 */
export default function UrPage() {
  return (
    <main id="main" className="flex flex-1 flex-col">
      <Container as="section" className="py-22">
        <p className="text-ink-secondary text-eyebrow mb-6 tracking-[0.06em] uppercase">
          اردو · Urdu
        </p>
        <h1 className="serif text-ink text-[clamp(2rem,5vw,3rem)] leading-[1.1] tracking-[-0.014em]">
          The Urdu version is coming.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[44ch]" lang="ur" dir="rtl">
          فی الحال صرف انگریزی میں دستیاب ہے۔ مکمل اردو ورژن v2 میں آئے گا۔
        </p>
        <p className="text-ink-secondary text-callout mt-2 max-w-[44ch]">
          English-only for v1. Full Urdu version arrives in v2.
        </p>
      </Container>
    </main>
  );
}
