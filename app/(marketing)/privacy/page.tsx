import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import Container from "@/components/brand/Container";

/*
 * /privacy — privacy policy.
 *
 * Written against what the code actually does, not a template. Every claim
 * here maps to a real call site:
 *
 *   - Analytics tags            → app/layout.tsx (all four, three env-gated)
 *   - Contact form              → app/(marketing)/contact/actions.ts
 *   - Workshop inquiry          → app/(marketing)/workshops/actions.ts
 *   - Sessions notify           → app/(marketing)/sessions/actions.ts
 *   - Lab subscribe             → app/(lab)/lab/actions.ts
 *   - Audit bot email capture   → app/api/audit/email/route.ts
 *   - Audit bot LLM turn        → app/api/audit/stream/route.ts (Anthropic)
 *   - Rate limit (IP in Redis)  → lib/audit/rate-limit.ts
 *   - Email transport           → lib/email/send.ts (Resend)
 *   - Booking embed             → components/brand/CalEmbed.tsx
 *   - Video embeds              → components/sessions/YouTubePlayer.tsx
 *
 * If any of those change, this page changes in the same commit. A privacy
 * policy that drifts from the code is worse than no policy at all.
 */

const OWNER_EMAIL = "info@abdulwahabai.com";
const LAST_UPDATED = "15 August 2026";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What this site collects, why, who processes it, and how to have it deleted. Plain English, accurate to what the code actually does.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy — Abdul Wahab",
    description:
      "What this site collects, why, who processes it, and how to have it deleted.",
    url: "/privacy",
    type: "article",
  },
};

/* Section shell — label rail on the left, reading rail on the right. Same
 * two-column grid /about uses, so the page reads as part of the site rather
 * than a legal annex bolted on. */
function Section({
  id,
  label,
  heading,
  children,
}: {
  id: string;
  label: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="border-separator border-t"
    >
      <Container className="py-18 lg:py-22">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <div>
            <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
              {label}
            </p>
            <h2
              id={`${id}-heading`}
              className="text-ink text-title2 mt-3 max-w-[18ch] tracking-[var(--track-title)]"
            >
              {heading}
            </h2>
          </div>
          <div className="text-ink text-body max-w-[64ch] space-y-6 leading-[1.65]">
            {children}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* Hairline definition row — used for the form inventory and the processor
 * list. Keeps the structure legible without inventing a table component. */
function Row({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="border-separator grid gap-1 border-t py-4 first:border-t-0 first:pt-0 sm:grid-cols-[13rem_1fr] sm:gap-6">
      <dt className="text-ink text-callout font-medium">{term}</dt>
      <dd className="text-ink-secondary text-callout leading-[1.55]">
        {children}
      </dd>
    </div>
  );
}

function Mail() {
  return (
    <a
      href={`mailto:${OWNER_EMAIL}`}
      className="text-ink underline-offset-4 hover:underline"
    >
      {OWNER_EMAIL}
    </a>
  );
}

export default function PrivacyPage() {
  return (
    <main id="main" className="flex flex-1 flex-col">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <Container as="section" className="pt-18 pb-14 lg:pt-26 lg:pb-18">
        <p className="text-ink-secondary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
          Privacy
        </p>
        <h1 className="serif text-ink mt-6 max-w-[20ch] text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-[var(--track-display)]">
          What this site knows about you.
        </h1>
        <p className="text-ink-secondary text-callout mt-6 max-w-[58ch] leading-[1.55]">
          This is a portfolio site run by one person. There is no user account,
          no login, and no customer database behind it. Almost everything below
          is either a form you chose to fill in, or an analytics tag counting
          page views. Written plainly, because a policy you can&rsquo;t read
          isn&rsquo;t consent.
        </p>
        <p className="text-ink-tertiary text-footnote mt-8 font-mono">
          Last updated: {LAST_UPDATED}
        </p>
      </Container>

      {/* ── The short version ───────────────────────────────────────────── */}
      <Section id="summary" label="Summary" heading="The short version.">
        <p>
          If you only read a paragraph, read this one. I collect two kinds of
          thing: what you type into a form, and anonymous-ish measurements of
          how pages get used. Form submissions arrive in my email inbox and
          nowhere else &mdash; there is no CRM, no marketing automation, no
          list I sell or rent. Measurement runs through third-party analytics
          tags, one of which records your session as a replay. If you want
          anything deleted, email <Mail /> and it&rsquo;s done.
        </p>
        <p>
          I am the data controller. I&rsquo;m based in Peshawar, Pakistan, and
          the services this site uses store data on servers in the United
          States and the European Union.
        </p>
      </Section>

      {/* ── Forms ───────────────────────────────────────────────────────── */}
      <Section
        id="forms"
        label="Forms"
        heading="What you type, and where it lands."
      >
        <p>
          Five forms on this site capture personal data. Every one of them does
          exactly the same thing with it: composes an email and sends it to my
          inbox through Resend. Nothing is written to a database, and nothing
          is stored on this site after the email is sent.
        </p>
        <dl className="mt-2">
          <Row term="Contact form">
            Name, email, and message are required. Organisation, enquiry topic,
            and a budget range are optional. I get one copy; you get an
            automatic acknowledgement at the address you entered.
          </Row>
          <Row term="Workshop inquiry">
            Name, email, organisation, your role, audience size, and preferred
            format are required. Target dates and free-text notes are optional.
            Same fan-out: a copy to me, an acknowledgement to you.
          </Row>
          <Row term="Lab note subscribe">
            Your email address, and nothing else. There is no double opt-in and
            no mailing-list platform yet &mdash; the address simply arrives in
            my inbox and I add it by hand when a note goes out.
          </Row>
          <Row term="Sessions notify">
            Your email address plus which session you asked about.
          </Row>
          <Row term="Audit bot">
            Your five free-text answers about your workflow, plus your name and
            email at the end. You get the resulting one-page PDF by email; I
            get the same PDF and a copy of the full transcript.
          </Row>
        </dl>
        <p>
          Each form also carries a hidden field that humans never see. If it
          comes back filled in, the submission is treated as a bot and quietly
          dropped. The workshop form additionally runs an invisible hCaptcha
          check when that integration is configured.
        </p>
      </Section>

      {/* ── The audit bot ───────────────────────────────────────────────── */}
      <Section
        id="audit-bot"
        label="Audit bot"
        heading="Your answers go to a language model."
      >
        <p>
          The workflow audit at <Link href="/lab/audit" className="text-accent underline-offset-4 hover:underline">/lab/audit</Link>{" "}
          is a real large language model, not a scripted quiz. Every answer you
          type is sent to Anthropic&rsquo;s API to generate the next question
          and the final hypothesis. Say that out loud before you paste anything
          in: <strong>don&rsquo;t put client names, credentials, or anything
          confidential into those five boxes.</strong> Describe the shape of
          the workflow, not the secrets inside it.
        </p>
        <p>
          Your answers are held in your own browser&rsquo;s session storage
          while you work through the questions, and cleared once the PDF is
          sent. To keep the demo from being abused, the first turn of each run
          records your IP address as a counter in a hosted Redis store; the
          counter expires automatically one hour later. That counter is the
          only place this site writes your IP anywhere it persists, and it is
          stored as-is rather than hashed.
        </p>
      </Section>

      {/* ── Analytics ───────────────────────────────────────────────────── */}
      <Section
        id="analytics"
        label="Measurement"
        heading="Analytics, and the one that records you."
      >
        <p>
          Up to five measurement tools run on this site. Three of them only
          load when I&rsquo;ve configured them, so what you actually get
          depends on when you visit &mdash; the honest answer is to assume all
          five are on.
        </p>
        <dl className="mt-2">
          <Row term="Plausible">
            Privacy-first page-view counting. No cookies, no cross-site
            identifiers, no individual profile. This is the number I actually
            look at.
          </Row>
          <Row term="Google Analytics 4">
            Supplemental. Sets cookies, records page views and events, and
            derives approximate location from your IP address. Google is a
            separate controller for what it collects.
          </Row>
          <Row term="Microsoft Clarity">
            Session recording and heatmaps. This one captures a replay of your
            visit &mdash; scrolling, clicks, mouse movement, and the pages you
            move between. Clarity masks form input by default, but treat it as
            the most invasive thing on the page, because it is.
          </Row>
          <Row term="Vercel Analytics">
            Aggregate traffic counting from the host. No cookies.
          </Row>
          <Row term="Vercel Speed Insights">
            Page-performance timings from real visits. No cookies.
          </Row>
        </dl>
      </Section>

      {/* ── Cookies + embeds ────────────────────────────────────────────── */}
      <Section
        id="cookies"
        label="Cookies"
        heading="Cookies, embeds, and opting out."
      >
        <p>
          This site sets no cookies of its own. The cookies you may pick up
          come from Google Analytics, Microsoft Clarity, and two embeds: the
          Cal.com booking calendar on the contact page, and the video player on
          session and lesson pages. Videos use YouTube&rsquo;s privacy-enhanced
          domain, which holds off on tracking cookies until you press play.
        </p>
        <p>
          Two things are kept in your browser&rsquo;s local storage and never
          leave your device: your light/dark theme choice, and which lessons
          you&rsquo;ve marked as watched. Clearing site data removes both.
        </p>
        <p>How to switch the tracking off:</p>
        <ul className="text-ink-secondary text-callout list-disc space-y-2 pl-5 leading-[1.55]">
          <li>
            <span className="text-ink">Google Analytics</span> &mdash; install
            Google&rsquo;s official browser opt-out add-on, or block the tag
            with any content blocker.
          </li>
          <li>
            <span className="text-ink">Microsoft Clarity</span> &mdash; Clarity
            honours the browser Do Not Track signal, so turning DNT on in your
            browser settings stops the recording. A content blocker works too.
          </li>
          <li>
            <span className="text-ink">Everything else</span> &mdash; a
            standard tracker blocker or blocking third-party cookies stops the
            rest. The site is built to work perfectly well with all of it
            blocked.
          </li>
        </ul>
      </Section>

      {/* ── Why ─────────────────────────────────────────────────────────── */}
      <Section
        id="why"
        label="Why"
        heading="The reason for each of these."
      >
        <p>
          <strong>Because you asked me to.</strong> Everything you type into a
          form is processed to answer you. You started the conversation; that
          is the basis, and you can end it at any time by asking me to delete
          the thread.
        </p>
        <p>
          <strong>Because I need to run the place.</strong> Analytics, the spam
          traps, and the audit bot&rsquo;s rate limit exist so I can tell which
          pages earn their keep and stop bots from burning my model budget.
          That&rsquo;s a legitimate interest, and it&rsquo;s the reason you can
          opt out of all of it without losing anything.
        </p>
        <p>
          If you are in the EU or UK and prefer the formal names: consent for
          the analytics and session-recording tags, and legitimate interests
          for correspondence, security, and abuse prevention.
        </p>
      </Section>

      {/* ── Processors ──────────────────────────────────────────────────── */}
      <Section
        id="processors"
        label="Processors"
        heading="Everyone else who touches it."
      >
        <p>
          I don&rsquo;t sell data, and I don&rsquo;t share it for advertising.
          These are the services involved in running the site, and the full
          list of who can see anything:
        </p>
        <dl className="mt-2">
          <Row term="Vercel">
            Hosting. Serves every page and keeps short-lived server logs that
            include IP addresses and user agents.
          </Row>
          <Row term="Resend">
            Email delivery. Every form submission passes through Resend on its
            way to my inbox and to your acknowledgement.
          </Row>
          <Row term="Google Workspace">
            Where my inbox lives. Your message sits there like any other email
            until it&rsquo;s deleted.
          </Row>
          <Row term="Anthropic">
            The language model behind the audit bot. Receives the five answers
            you type there.
          </Row>
          <Row term="Upstash">
            Hosted Redis. Holds the hourly audit-bot rate-limit counter keyed
            by IP address.
          </Row>
          <Row term="Cal.com">
            The booking calendar embedded on the contact page. If you book,
            your name, email, and any booking notes go to Cal.com.
          </Row>
          <Row term="YouTube">
            Video hosting for session and lesson pages, on the
            privacy-enhanced domain.
          </Row>
          <Row term="hCaptcha">
            Bot detection on the workshop form, when configured. Sees your IP
            and browser signals.
          </Row>
          <Row term="Analytics vendors">
            Google, Microsoft, Plausible, and Vercel, as described above.
          </Row>
        </dl>
        <p>
          I&rsquo;d also hand something over if a law legitimately required it
          &mdash; which has never happened, and I&rsquo;d tell you if it did,
          unless I were barred from doing so.
        </p>
      </Section>

      {/* ── Retention ───────────────────────────────────────────────────── */}
      <Section id="retention" label="Retention" heading="How long it sticks around.">
        <p>
          <strong>Emails from forms</strong> stay in my inbox as long as the
          conversation is useful &mdash; a live enquiry, an ongoing engagement,
          or a project I might reasonably need to look back on. If a thread has
          gone nowhere for two years, I delete it. If you&rsquo;d rather not
          wait, ask.
        </p>
        <p>
          <strong>Subscriber addresses</strong> stay until you tell me to drop
          them. Every note I send says how.
        </p>
        <p>
          <strong>The audit rate-limit counter</strong> expires one hour after
          it is created. <strong>Audit answers</strong> leave your browser as
          soon as the PDF is sent; the transcript survives only as the email
          copy in my inbox.
        </p>
        <p>
          <strong>Analytics</strong> follows each vendor&rsquo;s own schedule.
          Clarity keeps session recordings for a limited window set by
          Microsoft; Google Analytics is configured to expire user-level data
          on its shortest available setting; Plausible and Vercel keep only
          aggregates, which never expire because they aren&rsquo;t about you.
        </p>
      </Section>

      {/* ── Rights ──────────────────────────────────────────────────────── */}
      <Section id="rights" label="Your rights" heading="Ask, and it happens.">
        <p>
          There&rsquo;s no self-service dashboard here, and pretending
          otherwise would be theatre. One email to <Mail /> covers all of it:
          ask for a copy of what I hold, ask for a correction, ask me to delete
          it, ask me to stop emailing you, or ask me to stop processing
          altogether. I&rsquo;ll confirm within 30 days and usually much
          sooner &mdash; a deletion request is a search of my inbox and a
          keypress.
        </p>
        <p>
          I may ask you to confirm you&rsquo;re writing from the address on the
          record, which is the only way I can tell it&rsquo;s you. Depending on
          where you live you may also have the right to complain to a data
          protection authority; I&rsquo;d appreciate the chance to fix it
          first.
        </p>
      </Section>

      {/* ── Children ────────────────────────────────────────────────────── */}
      <Section id="children" label="Children" heading="Not built for under-16s.">
        <p>
          This site is aimed at working professionals and isn&rsquo;t directed
          at children. I don&rsquo;t knowingly collect data from anyone under
          16. If you&rsquo;re a parent or guardian and think a child has sent
          me something through a form here, email <Mail /> and I&rsquo;ll
          delete it.
        </p>
      </Section>

      {/* ── Changes ─────────────────────────────────────────────────────── */}
      <Section id="changes" label="Changes" heading="When this page changes.">
        <p>
          When the site starts doing something new with data, this page is
          updated in the same change that ships it &mdash; that&rsquo;s a rule
          I hold myself to, not a courtesy. The date at the top always reflects
          the last edit. If a change materially affects data I already hold,
          I&rsquo;ll email the people it affects rather than quietly editing
          this page.
        </p>
      </Section>

      {/* ── Contact ─────────────────────────────────────────────────────── */}
      <section className="border-separator bg-surface-secondary border-t">
        <Container className="py-18 lg:py-22">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[46ch]">
              <h2 className="serif text-ink text-[clamp(1.875rem,4vw,2.75rem)] leading-[1.1] tracking-[var(--track-title)]">
                Questions about any of this?
              </h2>
              <p className="text-ink-secondary text-callout mt-4 leading-[1.55]">
                Abdul Wahab, Peshawar, Pakistan. Write to <Mail /> &mdash;
                privacy questions get answered by the same person who wrote the
                code they&rsquo;re about.
              </p>
            </div>
            <Link
              href="/contact"
              className="border-separator text-ink hover:bg-surface rounded-pill text-callout inline-flex items-center gap-2 border px-5 py-2.5 font-medium transition-colors duration-[var(--dur-fast)]"
            >
              Use the contact form
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
