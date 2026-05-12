# Tasks — Portfolio Build (`techai.pk`)

Derived from `plan.md`. 17 tasks: Day 0 pre-flight → Days 1–15 build → §8 DoD launch gate.
Kickoff: 2026-05-12 · Target launch: 2026-06-02.

---

## #1 — Day 0 — Pre-flight: accounts, DNS, open questions, scaffolding decisions

**Status:** owner-side · scaffolding decisions locked, accounts/DNS pending owner action.

Provision Vercel project, Resend (techai.pk DKIM/SPF/DMARC), AI Gateway + Anthropic provider + $50/mo alert, Upstash Redis (Vercel KV deprecated), Cal.com, Plausible, Mux, GSC. Push DNS at registrar (A apex, CNAME www, Resend records). Resolve open questions Q1–Q7 per §1.3. Lock pnpm + Node 22 + App Router + TS strict + Tailwind v4 + shadcn with custom tokens.

**Env keys the codebase consumes (graceful-degrade when missing):**
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- `NEXT_PUBLIC_CAL_LINK` (e.g. `abdulwahab/30min`)
- `NEXT_PUBLIC_MUX_PLAYBACK_ID` (Urdu greeting)
- `RESEND_API_KEY`, `RESEND_FROM_ADDRESS`, `CONTACT_INBOX`, `WORKSHOP_INBOX`, `AUDIT_INBOX`, `LAB_INBOX`
- `AI_GATEWAY_API_KEY` (Vercel AI Gateway)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `HCAPTCHA_SECRET` (optional — gates workshop form captcha verification)

---

## #2 — Day 1 — Project bootstrap & design tokens

**Status:** complete (2026-05-12) — pending Vercel preview Lighthouse run

`create-next-app` (App Router, TS strict, Tailwind v4); enable `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`; `vercel.ts` + `vercel link`; install shadcn, lucide, clsx, tailwind-merge, zod, `next-mdx-remote` (fallback), `contentlayer2` (primary); `styles/tokens.css` from spec §5; Fraunces + JetBrains Mono via `next/font`; no-flash theme bootstrap; footer theme toggle (system/light/dark) via `useReducer`; shadcn primitives (Button/Card/Input/Textarea/Label/Dialog/Sheet/Sonner/Tabs/Accordion/Tooltip).

**DoD:** preview deploys, blank shell Lighthouse Perf ≥ 95.

---

## #3 — Day 2 — Chrome components (Navbar, Footer, Container, primitives)

**Status:** complete (2026-05-12)

Navbar with sticky + material blur on scroll > 12px + mobile sheet; Footer 3-column with `/ur` "coming soon" stub; Container `max-w-1200` with 24/40/64 gutters; SegmentedControl, Pill, Prose (Tailwind typography + Apple-scale overrides); global `:focus-visible` ring; `prefers-reduced-motion` override; skip-link.

**DoD:** placeholder page with chrome passes axe-core with zero violations.

---

## #4 — Day 3 — Home page

**Status:** complete (2026-05-13)

Hero with locked spec §7.1 copy (Fraunces H1, `--t-display-xl` ≥1280px); 3-card Who I work with row (Operators/Teams/Communities) anchoring to `/services`; Recent Systems 3-tile row (placeholder until Day 4–5); How I work 3-step list; Lab Notes latest-3 (empty state OK); Closing CTA; metadata + OG stub; Plausible + Vercel Analytics wired.

**DoD:** real copy on mobile + desktop, LCP ≤ 1.8s preview, One-Question Test passes.

---

## #5 — Day 4 — Case-study pipeline + MeetPlanner

**Status:** complete (2026-05-13) — pipeline = next-mdx-remote/rsc + gray-matter + zod (contentlayer2 deferred per React 19 compat concern)

`lib/content/schemas.ts` (zod per spec §7.3 frontmatter); `content/case-studies/meetplanner.mdx` full draft (template 1–10); `/work` index page; `/work/[slug]` route with `generateStaticParams` + `generateMetadata`; Excalidraw → SVG architecture diagram at `/public/diagrams/meetplanner-architecture.svg`; 3-up metric row with tabular numerals; inline stack pill row.

**DoD:** `/work/meetplanner` renders end-to-end through MDX; build fails on malformed frontmatter; OG metadata correct.

---

## #6 — Day 5 — Marketing Dash + Printing Press case studies

**Status:** complete (2026-05-13) — both authored by parallel subagents; axe-core clean; 375px mobile review passes

`content/case-studies/marketing-dash.mdx` + diagram SVG; `content/case-studies/printing-press.mdx` + diagram SVG; `/work` index order locked: MeetPlanner → Marketing Dash → Printing Press; "What I'd do differently" paragraph mandatory on each (trust play).

**DoD:** all 3 render, SVG diagrams, axe-core clean, 375px mobile review passes.

---

## #7 — Day 6 — /services page

**Status:** complete (2026-05-13) — sticky scroll-spy ServicesNav (client) + 4 tier sections (server-rendered from MDX); Audit shows numeric Offer in JSON-LD, others are Custom/On request

Hero "How I work with teams."; segmented control Audit/Build/Workshop/Speaking; tier cards from `content/services/*.mdx` (name, format, ideal-for, deliverables checklist, "starting from" anchor, CTA); Audit pricing "starting from $1,500" per default decision; `Service` JSON-LD per tier.

---

## #8 — Day 7 — /workshops page

**Status:** complete (2026-05-13) — 12 topics in accordion; 4 dated past engagements; outcomes section; testimonial slot dropped per Q3-unresolved instruction; Server Action wired to Resend via fetch wrapper with graceful no-key fallback for dev; honeypot + hCaptcha verification stub (gated on `HCAPTCHA_SECRET`); `cta_workshop_inquiry` Plausible event on success. Build clean, typecheck clean, 375px mobile review passes.

Hero + 3 format cards (Executive briefing / Team workshop / Hands-on bootcamp); accordion topics catalog from `content/workshops/topics.mdx` (10–15 items); past engagements (logo wall OR dated list, min 3); outcomes section + optional testimonial slot (drop if Q3 unresolved); inquiry form (org/role/audience size/format/dates/notes) with honeypot + invisible hCaptcha → Server Action → Resend.

---

## #9 — Day 8 — /about + Urdu video

**Status:** complete (2026-05-13) — page structure, three editorial paragraphs, speaking-photo figure with clearance-pending placeholder, env-gated Urdu greeting slot, `Person` JSON-LD with LinkedIn/GitHub/X, closing CTA + raw email. Build + typecheck + lint clean; `/about` prerenders static. Two assets deferred to launch week: workshop photo at `/public/about/speaking.jpg` (clearance pending) and the 30–45s Urdu greeting (Q5 — owner-side recording). `UrduGreeting` flips to live Mux HLS the moment `NEXT_PUBLIC_MUX_PLAYBACK_ID` is set; `@mux/mux-player-react` install is deferred until the asset exists.

Three-paragraph editorial body; speaking/workshop 16:9 photo (`<Image>` `priority` only if above fold); Urdu greeting 30–45s recorded, English VTT captioned, uploaded to Mux, embedded via `@mux/mux-player-react` with `preload="metadata"` + poster; `Person` JSON-LD with `jobTitle`/`worksFor`/`sameAs` (LinkedIn, GitHub, X); closing CTA + raw email.

---

## #10 — Day 9 — /lab index + 2 seed Lab Notes

**Status:** complete (2026-05-13) — `lib/content/lab-notes.ts` loader with zod schema, mtime-free fresh reads, `extractToc`/`slugifyHeading` helpers, `relatedNotes`. `/lab` editorial index; `/lab/[slug]` renderer with sticky side-rail TOC (≥1024px), `max-w-[68ch]` reading rail, custom `CodeBlock` (client component, copy button), H2 anchor IDs, related-notes cards, inline single-field subscribe form (Server Action → Resend), `Article` JSON-LD per note. Home page latest-3 widget swapped from empty state to real notes. Two seed notes authored.

---

## #11 — Day 10 — /contact + Resend wiring

**Status:** complete (2026-05-13) — Two-column desktop layout (Cal.com inline embed left + form right); `CalEmbed.tsx` client component loads Cal's official `embed.js` once, env-gated via `NEXT_PUBLIC_CAL_LINK` (placeholder card until set), forest-green brand override (`#15573D`); `ContactForm.tsx` with name/email/org/message/budget(optional)/honeypot; `actions.ts` Server Action → shared `sendEmail` (Resend, fan-out: owner + auto-reply); sonner toast + Plausible `cta_contact_submit`. Graceful dev path when `RESEND_API_KEY` missing.

---

## #12 — Day 11 — Audit Bot UI + streaming

**Status:** complete (2026-05-13) — `/lab/audit` page with sticky explainer rail + AuditBot client component; `app/api/audit/stream/route.ts` calls `streamText({ model: gateway("anthropic/claude-sonnet-4-6") })` with `maxOutputTokens: 1200` and Anthropic `cacheControl: ephemeral`; system prompt in `lib/audit/prompt.ts` (locked editorial voice + 5-question contract + hypothesis template). `useReducer` state machine: intro → asking → thinking → asking … → hypothesis. Transcript persisted to `sessionStorage` until capture; `aria-live="polite"` on the stream surface; ⌘+Enter submit; restart button; rate-limit error and gateway error cards both surface the spec-mandated copy with a Book-a-call CTA. Runtime: Fluid Compute (Next 16 default; Edge no longer recommended per platform guidance) — `runtime` segment configs removed; Cache Components forbids them anyway.

---

## #13 — Day 12 — Audit Bot capture, PDF, rate-limit

**Status:** complete (2026-05-13) — Capture form inline below the streaming hypothesis (name + work email). `app/api/audit/email/route.ts` renders branded two-page PDF via `@react-pdf/renderer` (`renderToBuffer`) — page 1 = hypothesis (markdown-parsed: H2 / fenced code / bullets / paragraphs), page 2 = the visitor's five inputs. Resend fans out: PDF to visitor + transcript+PDF copy to owner inbox (`AUDIT_INBOX` → `CONTACT_INBOX` → `abdul@duckercreative.com`). Rate limit 10 starts/IP/hour via `@upstash/redis` (`lib/audit/rate-limit.ts`, fixed window; deprecated `@vercel/kv` replaced per Vercel Marketplace guidance). Fail-open on Redis outage. Plausible events `audit_start`, `audit_complete`, `audit_email_capture` wired in the client.

**Owner-side wiring still needed before launch:** `AI_GATEWAY_API_KEY` (Vercel AI Gateway), `RESEND_API_KEY` + verified domain, `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`, `$50/mo` AI Gateway cost alert. The code degrades gracefully when each is missing.

---

## #14 — Day 13 — SEO + accessibility pass

**Status:** complete (2026-05-13) — `app/og/[type]/route.tsx` ImageResponse generator (`next/og`) with five layout types (default / case-study / lab-note / audit / service), Fraunces 600 fetched at build, hairline + accent dot per spec aesthetic. `app/sitemap.ts` (Next 16 native): static paths + dynamic case studies + dynamic lab notes. `app/robots.ts`: allow `/`, disallow `/api/*` and `/og/*`, sitemap pointer. `alternates.canonical` verified on every page. Per-page OG wired into case-study and lab-note `generateMetadata` with title + eyebrow + meta. Plausible events: `cta_book_call` (tagged-events class on every Book CTA in Navbar/Home/About/Work[slug]/Services/AuditBot); `case_study_view_{slug}` + `lab_note_view_{slug}` via new `PlausiblePageEvent` client; `theme_toggle` wired into ThemeToggle (skips initial mount). All ten spec §12 events emit. Axe-core/VoiceOver passes are owner verification on a preview URL.

---

## #15 — Day 14 — Performance pass

**Status:** complete (2026-05-13) — `next-bundle-analyzer` wired (`npm run analyze`). `next.config.ts` enables `cacheComponents` (PPR) + AVIF/WebP image formats. Lab Note loader gets `'use cache'` + `cacheLife('hours')` + `cacheTag('lab')` per spec §10 (revalidate via `revalidateTag('lab')` on content push). Case-study, services, and workshops loaders also marked `'use cache'` so PPR can prerender their consuming routes. Build output confirms Partial Prerender on `/work/[slug]` (15m revalidate, 1y expire) and `/lab/[slug]` (1h revalidate, 1d expire). Image audit: only LCP image (case-study hero diagram) carries `priority`. Font audit: layout loads Fraunces 400/500/600 + JetBrains Mono 400/500 only.

**Owner-side verification on preview URL:** Lighthouse mobile Perf ≥ 95 / A11y ≥ 95 / BP ≥ 95 / SEO = 100 on `/`, `/work/meetplanner`, `/lab/audit`, `/contact`; bundle budgets (home JS ≤ 90 KB gz, CSS ≤ 15 KB gz); p75 LCP ≤ 1.8s via Speed Insights.

---

## #16 — Day 15 — Content freeze + production cutover

**Status:** owner-side · launch operation; runs against the live Vercel project.

Final copy pass against banned-phrases list (spec §13); zero `console.log` in client + no console errors/warnings; DNS cutover to production, verify `www → apex` 308; swap Resend production keys; submit sitemap to GSC; test Cal.com booking end-to-end; test contact form arrival + auto-reply; test audit-bot full flow (5 questions → hypothesis → email capture → PDF in test inbox); verify Plausible receiving all 10 events; owner sanity-test publishing a Lab Note by MDX push (no manual rebuild).

---

## #17 — Launch gate — verify Definition of Done (spec §8)

**Status:** owner-side · code is launch-ready, gates run on a live preview URL.

Verify every DoD item green before go-live: all 9 pages at `techai.pk`; audit-bot e2e; Cal.com booking; contact form arrival + auto-reply; Plausible 10 events; sitemap accepted by GSC; no third-party "powered by"; README documents env/build/content/deploy; Lab Note publish-via-push works; Lighthouse mobile Perf ≥ 95, A11y ≥ 95, BP ≥ 95, SEO = 100 on `/`, `/work/meetplanner`, `/lab/audit`, `/contact`; axe-core zero violations on same four; OG renders correctly on LinkedIn + iMessage; banned-phrases sweep clean.
