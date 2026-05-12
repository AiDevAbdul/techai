import type { Metadata } from "next";
import Container from "@/components/brand/Container";
import CalEmbed from "@/components/brand/CalEmbed";
import ContactForm from "@/components/forms/ContactForm";

/*
 * /contact — spec §7.10.
 *
 * Two columns on desktop: Cal.com inline embed (left) + form (right).
 * Stacked on mobile (CalEmbed first; the form is the fallback path).
 * Cal.com booking link wired via NEXT_PUBLIC_CAL_LINK; the embed shows a
 * placeholder until the link is configured. Form posts to a Server Action
 * (actions.ts) that fans out to Resend (owner inbox + sender auto-reply).
 */

const OWNER_EMAIL = "abdul@duckercreative.com";

export const metadata: Metadata = {
  title: "Contact — book a call or send a note",
  description:
    "Book a 30-minute discovery call, or send a note. No pitch, no slides — we'll map the workflow and decide if it's worth automating.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Abdul Wahab",
    description:
      "Book a 30-minute discovery call, or send a note. Replies within two business days.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main id="main" className="flex flex-1 flex-col">
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <Container as="section" className="pt-18 pb-12 lg:pt-26 lg:pb-16">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          Contact
        </p>
        <h1 className="serif text-ink mt-6 max-w-[22ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          Book a call. Or send a note.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[58ch] leading-[1.55]">
          Thirty minutes on a call, no pitch, no slides — we map the workflow
          on a whiteboard and decide if it&rsquo;s worth automating. Prefer
          writing? The form below lands in my inbox; I read every inbound
          myself.
        </p>
      </Container>

      {/* ── Two-column body ────────────────────────────────────────────── */}
      <Container as="section" className="pb-26">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* Cal.com inline embed */}
          <section aria-labelledby="book-heading">
            <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
              Book
            </p>
            <h2
              id="book-heading"
              className="serif text-ink mt-3 text-[clamp(1.625rem,3vw,2rem)] leading-[1.1] tracking-[var(--track-title)]"
            >
              30 minutes, no pitch.
            </h2>
            <p className="text-ink-secondary text-footnote mt-3 max-w-[40ch] leading-[1.55]">
              Pick a slot that works. You&rsquo;ll get a confirmation with a
              Zoom link and a short note on what to send ahead.
            </p>
            <div className="mt-7">
              <CalEmbed />
            </div>
          </section>

          {/* Form */}
          <section aria-labelledby="note-heading">
            <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
              Or write
            </p>
            <h2
              id="note-heading"
              className="serif text-ink mt-3 text-[clamp(1.625rem,3vw,2rem)] leading-[1.1] tracking-[var(--track-title)]"
            >
              Send a note instead.
            </h2>
            <p className="text-ink-secondary text-footnote mt-3 max-w-[40ch] leading-[1.55]">
              Or write directly to{" "}
              <a
                href={`mailto:${OWNER_EMAIL}`}
                className="text-accent underline-offset-4 hover:underline"
              >
                {OWNER_EMAIL}
              </a>
              . Replies within two business days.
            </p>
            <div className="bg-surface-elevated border-separator mt-7 rounded-2xl border p-6 lg:p-8">
              <ContactForm />
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
