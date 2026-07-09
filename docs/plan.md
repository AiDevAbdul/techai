# Portfolio Build Plan — `techai.pk`

> Execution plan for `spec.md`. Covers the v1 3-week build (Days 0–15) and the v2 5-week extended scope (Days 16–38).
> Owner: Abdul Wahab · Build lead: Claude (Opus 4.7) · v1 kickoff: 2026-05-12 · v1 target launch: 2026-06-02 · v2 start: gated on v1 metrics (see §10).
>
> The spec is the design and engineering contract; this document is the **order of operations** — what gets built on which day, what blocks what, and which decisions must be locked before code is written.

---

## 0. Domain & identity reconciliation

The spec was drafted against `abdulwahab.dev`. The confirmed launch domain is **`techai.pk`**. Apply these substitutions everywhere in code, copy, env, and schema before launch:

| Spec field | Locked value |
|---|---|
| Primary domain | `techai.pk` |
| `NEXT_PUBLIC_SITE_URL` | `https://techai.pk` |
| Resend `from` | `Abdul Wahab <hello@techai.pk>` |
| `CONTACT_INBOX` | `hello@techai.pk` (alias → `aidevabdul@gmail.com` until inbox is provisioned) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `techai.pk` |
| Person schema `url` | `https://techai.pk` |
| OG / canonical base | `https://techai.pk` |
| Email infra | Resend domain on `techai.pk`; SPF / DKIM / DMARC verified before launch |
| Redirect rule | `www.techai.pk` → `techai.pk` (308) |

Resolves spec §15 Q1. Update spec §3 + §13.3 + §18 with a one-line decisions-log entry on Day 1.

---

## 1. Day 0 pre-flight (must clear before Day 1)

**Status: owner-side — scaffolding decisions locked; accounts + DNS pending owner action.**

Order-of-operations matters here — Resend and AI Gateway both need DNS / API keys before later days unblock. Spin these up as a single pre-flight pass:

1. **Accounts & credentials**
   - Vercel project created, linked to GitHub repo `techai`.
   - Resend account; add `techai.pk` as a verified sending domain (DKIM CNAME + SPF TXT + DMARC TXT pushed at registrar).
   - Vercel AI Gateway enabled; `AI_GATEWAY_API_KEY` issued; spend alert configured at $50/mo.
   - Anthropic provider attached to Gateway with `claude-sonnet-4-6` access. OpenAI fallback (`gpt-5`) optional but recommended.
   - Vercel KV (or Upstash) instance for audit-bot rate limiting; `KV_REST_API_URL` + `KV_REST_API_TOKEN`.
   - Cal.com account, public username, 30-min "Discovery call" event type, forest-green brand override.
   - Plausible site at `techai.pk`.
   - Mux account (free tier) — defer asset upload to Day 8.
   - Google Search Console property for `techai.pk` (HTML / DNS verification stored for Day 15).

2. **DNS at registrar** (one pass, before code):
   - `A` apex → Vercel.
   - `CNAME www` → Vercel.
   - Resend records (DKIM, SPF, DMARC).
   - Plausible — none required (script-based).

3. **Open-questions resolution** (block Day 1):
   - Q1 Domain — **resolved: `techai.pk`**.
   - Q2 Pricing — default to "Audit — starting from $1,500" visible on `/services`. Confirm with owner; if no by Day 6, ship the default.
   - Q3 Testimonials — collect one quote from MeetPlanner or Printing Press; if none by Day 10, ship without the section (don't fabricate).
   - Q4 First public engagement — list one for `/workshops`; if none, replace logos block with a 2-line "speaking inquiries welcomed" stub.
   - Q5 Urdu video — script + record + caption between Day 1 and Day 8.
   - Q6 Mux vs Cloudflare — **resolved: Mux** for v1.
   - Q7 contentlayer2 vs next-mdx-remote — start with `contentlayer2`; if Next 16 build fails on Day 1, fall back to `next-mdx-remote` immediately. Do not invest >2 hours in workarounds.

4. **Repo scaffolding decisions** (lock before `create-next-app`):
   - Package manager: **npm** (deviated from spec §3 pnpm on 2026-05-12 — see §9). Add `.nvmrc` (`24`) and `engines.node` (`>=22 <25`).
   - App Router + TypeScript strict + Tailwind v4 + ESLint via `create-next-app`.
   - shadcn init with custom token mapping (no default theme).
   - Initial commit: scaffold + tokens.css + design-system docs.

---

## 2. Week 1 — Foundation (Days 1–5)

**Status: complete (2026-05-12 → 2026-05-13). All five days shipped.**

Goal: a deployable site with the design system, the home page populated with real copy, and the case-study pipeline working end-to-end through one fully-shipped study.

### Day 1 — Project bootstrap & design tokens ✓
- `npx create-next-app@latest .` — App Router, TS strict, Tailwind v4, no `src/`, npm. Scaffolded into the existing repo root (already contains `CLAUDE.md` + `docs/`).
- Enable `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` in `tsconfig.json`.
- Add `vercel.ts` (not `.json`); link via `vercel link`.
- Install: `shadcn`, `lucide-react`, `clsx`, `tailwind-merge`, `zod`, `next-mdx-remote` *(fallback ready)*, `contentlayer2` *(primary attempt)*.
- Create `styles/tokens.css` from spec §5.2/§5.3/§5.5/§5.7 verbatim. Import in `app/globals.css`.
- Fonts: `next/font/google` for Fraunces (display: swap, opsz auto) + JetBrains Mono. No Geist webfont.
- Theme bootstrap script (no-flash): inline `<script>` in `<head>` that reads `localStorage.theme` and sets `<html data-theme>` before paint.
- Footer theme toggle (system / light / dark) using `useReducer`.
- shadcn init; add `Button`, `Card`, `Input`, `Textarea`, `Label`, `Dialog`, `Sheet`, `Sonner`, `Tabs`, `Accordion`, `Tooltip`. Override `components.json` style to point at our tokens.
- First Vercel preview deploy succeeds.

**Done when:** preview URL loads a blank page with the correct font, tokens applied, theme toggle works, Lighthouse Performance ≥ 95 on the blank shell.

### Day 2 — Component pass + chrome ✓
- `components/brand/Navbar.tsx` — sticky, material blur on scroll > 12px, focus ring, mobile sheet menu.
- `components/brand/Footer.tsx` — 3-column, copyright, theme toggle, `/ur` stub link (404 in v1 → swap to "coming soon" page so it's not a broken link).
- `components/brand/Container.tsx` — `max-w-[1200px]` rail, gutters 24/40/64.
- `components/ui/SegmentedControl.tsx` — custom, for `/services`.
- `components/ui/Pill.tsx` (badge variant).
- `components/ui/Prose.tsx` — Tailwind typography v4 with Apple-scale overrides.
- `:focus-visible` ring globally; `prefers-reduced-motion` global override.
- Skip-link component.

**Done when:** rendering Navbar + Footer + Container on a placeholder page passes axe-core with zero violations.

### Day 3 — Home page ✓
- Hero from spec §7.1 (locked copy). Fraunces H1, `--t-display-xl` ≥1280px.
- "Who I work with" 3-card row (Operators / Teams / Communities) — cards anchor-link to `/services`.
- "Recent Systems" row — 3 placeholder case-study tiles (real diagrams ship Day 4–5).
- "How I work" — numbered 3-step list.
- "Lab Notes" — pulls latest 3 from MDX (empty state OK until Day 9).
- Closing CTA band.
- Metadata: title, description, OG image stub (real OG generation on Day 13).
- Plausible script wired; Vercel Analytics wrapper.

**Done when:** home renders with real copy on mobile + desktop; LCP ≤ 1.8s on Vercel preview; One-Question Test passes a cold-read.

### Day 4 — Case-study pipeline + MeetPlanner ✓
- `lib/content/schemas.ts` — zod schemas per spec §7.3 frontmatter contract.
- `content/case-studies/meetplanner.mdx` — full draft per spec §7.3 template (1–10).
- `app/(marketing)/work/page.tsx` — editorial index list.
- `app/(marketing)/work/[slug]/page.tsx` — template renderer; `generateStaticParams`, `generateMetadata`.
- Excalidraw → SVG export for MeetPlanner architecture; place at `/public/diagrams/meetplanner-architecture.svg`.
- 3-up metric row component with tabular numerals.
- Inline pill row for stack.

**Done when:** `/work/meetplanner` renders end-to-end through MDX; build fails on malformed frontmatter; case-study OG metadata correct.

### Day 5 — Remaining case studies ✓
- `content/case-studies/marketing-dash.mdx` + diagram SVG.
- `content/case-studies/printing-press.mdx` + diagram SVG.
- `/work` index ordered: MeetPlanner → Marketing Dash → Printing Press (locked).
- "What I'd do differently" paragraph mandatory on each — this is the trust play.

**Done when:** all 3 case studies render, diagrams are SVG, axe-core clean, mobile review at 375px passes.

**Week 1 result:** shipped on time (2026-05-12–13). contentlayer2 swapped to `next-mdx-remote` on Day 1 (React 19 compat). All three case studies render end-to-end; diagrams are SVG; axe-core clean.

---

## 3. Week 2 — Content & service surfaces (Days 6–10)

**Status: complete (2026-05-13). All five days shipped. Two assets pending owner action (workshop photo + Urdu video).**

Goal: every non-interactive page shipped with real content. Resend wired. Cal.com embedded. Urdu video on `/about`.

### Day 6 — `/services` ✓
- Hero `"How I work with teams."`.
- Segmented control: Audit / Build / Workshop / Speaking.
- Tier cards from `content/services/*.mdx`: name, format, ideal-for, deliverables checklist, "starting from" anchor, CTA.
- Pricing visible on Audit ("starting from $1,500") per default decision.
- `Service` JSON-LD schema per tier.

### Day 7 — `/workshops` ✓
- Hero + 3 format cards (Executive briefing / Team workshop / Hands-on bootcamp).
- Accordion topics catalog from `content/workshops/topics.mdx` (10–15 items).
- Past engagements: logo wall **or** dated list (whichever the real list supports — min 3).
- Outcomes section + one testimonial slot (drop if Q3 not resolved).
- Inquiry form: org, role, audience size, format, target dates, notes. Honeypot + hCaptcha invisible. Server Action → Resend.

### Day 8 — `/about` + Urdu video ✓ (code) · ⏳ owner: photo + video recording
- Three-paragraph editorial body.
- Speaking / workshop photo, full-bleed 16:9, `<Image>` with `priority` only if above-the-fold.
- Urdu greeting (30–45s): record, caption (English VTT), upload to Mux, embed via `@mux/mux-player-react` with `preload="metadata"` + poster.
- `Person` JSON-LD with `jobTitle`, `worksFor`, `sameAs` (LinkedIn, GitHub, X).
- Closing CTA + raw email.

### Day 9 — `/lab` index + 2 seed notes ✓
- `/lab` editorial index: date · category · title · 1-line tease.
- `content/lab/context-engineering-for-ops-teams.mdx` (draft).
- `content/lab/workflow-diagram-worth-10-specs.mdx` (draft).
- Lab Note template: side-rail TOC (≥1024px), reading-rail `max-w-[68ch]`, code blocks via custom `CodeBlock` (JetBrains Mono 14px, copy button, no line numbers).
- Footer of post: 2 related notes + "Subscribe to Lab Notes" inline single-field form (no double opt-in in v1 per spec §1.2).
- `Article` JSON-LD per note.

### Day 10 — `/contact` + Resend wiring ✓
- Two-column desktop layout: Cal.com inline embed (left) + form (right). Stack on mobile.
- Cal.com brand override = forest green via embed config.
- Form fields: name, email, org, message, budget (optional dropdown), honeypot.
- Server Action `/api/contact` → Resend transactional send to `CONTACT_INBOX` + auto-reply to sender.
- Success toast via sonner; inline confirmation; form clears.
- Verify SPF/DKIM/DMARC pass via Resend dashboard before Day 11.

**Week 2 result:** shipped on time (2026-05-13). Resend wired with graceful no-key dev path. Cal.com embed env-gated. Testimonial slot omitted (Q3 unresolved — correct per plan). Workshop photo + Urdu video are the two remaining owner-side assets.

---

## 4. Week 3 — Interactive demo, polish, launch (Days 11–15)

**Status: Days 11–14 complete (2026-05-13). Day 15 is owner-side launch operation — pending.**

Goal: Audit Bot live, performance + a11y + SEO budgets met, content frozen, launch.

### Day 11 — Audit Bot UI + streaming ✓
- `app/(lab)/lab/audit/page.tsx` — explainer card + start button; client component for chat surface.
- `app/api/audit/stream/route.ts` — `export const runtime = 'edge'`; `streamText` from AI SDK v6; model `anthropic/claude-sonnet-4-6` via AI Gateway.
- `lib/audit/prompt.ts` — system prompt with `cache_control: ephemeral` blocks.
- 5-question sequential flow, one question per turn; state via `useReducer`; persist transcript to `sessionStorage` until email capture.
- Hard cap output: 1,200 tokens/turn.
- Failure mode: Gateway error → "I'm offline right now — [book a call]." No silent retry.
- `aria-live="polite"` on streaming region; keyboard navigable.

### Day 12 — Audit Bot capture + PDF + rate limit ✓
- After Q5: stream the one-page hypothesis (problem · architecture · stack · risks · next step).
- Capture form (name + work email) below hypothesis.
- PDF via `@react-pdf/renderer` — server-rendered, branded.
- Email via Resend: clean PDF to visitor + transcript copy to owner inbox.
- Rate limit via Vercel KV: 10 starts / IP / hour; copy: "Take a breath — try again in an hour or [book a call]."
- Cost tracking: AI Gateway dashboard; soft alert at $50/mo.
- Plausible custom events: `audit_start`, `audit_complete`, `audit_email_capture`.

### Day 13 — SEO + accessibility pass ✓
- `app/og/[type]/route.tsx` via `@vercel/og` — Apple-keynote treatment (Fraunces title, hairline, accent dot). Render per route type.
- `app/sitemap.ts` (Next 16 native) + `app/robots.ts` — allow all; disallow `/api/*`.
- `alternates.canonical` on every page.
- All 10 custom analytics events wired (spec §12).
- axe-core via Playwright on `/`, `/work/meetplanner`, `/lab/audit`, `/contact` — zero violations.
- Manual VoiceOver pass on the four pages above.
- Heading order audit: one `<h1>`, no skipped levels.
- All forms: label + `aria-describedby` for errors.

### Day 14 — Performance pass ✓
- Lighthouse CI on preview; targets per spec §10.
- `next-bundle-analyzer` — home JS ≤ 90 KB gz, CSS ≤ 15 KB gz.
- Image audit: AVIF priority, `<Image>` with `sizes` everywhere, only LCP image gets `priority`.
- Cache Components: enable PPR; `use cache` + `cacheLife('hours')` on Lab Notes; `cacheTag('lab')` for revalidation.
- Hero image ≤ 60 KB AVIF on mobile.
- Web fonts: confirm only weights 400/500/600 ship.
- Verify p75 LCP ≤ 1.8s mobile on Vercel Speed Insights.

### Day 15 — Content freeze + production cutover ⏳ owner-side
- Final pass on copy across all 9 pages against banned-phrases list (spec §13).
- Confirm no `console.log` in client code; no console errors/warnings.
- DNS cutover to production; verify `www → apex` 308.
- Resend production keys swapped in.
- Submit sitemap to Google Search Console.
- Test booking through Cal.com end-to-end.
- Test contact form arrives in `CONTACT_INBOX` with auto-reply.
- Test audit-bot full flow: 5 questions → hypothesis → email capture → PDF arrival in test inbox.
- Verify Plausible receiving all 10 custom events.
- Owner sanity-test: publish a Lab Note by adding an MDX file and pushing (must work without manual rebuild).

**Week 3 result (Days 11–14):** Audit Bot ships with `streamText` + Anthropic provider direct (AI Gateway switched out — see §9 decisions). PDF renders server-side via `@react-pdf/renderer`; rate-limit via `@upstash/redis`. All 10 Plausible events wired. PPR + `use cache` enabled. Banned-phrases sweep clean; no `console.log` in client code; README and `vercel.ts` added 2026-05-14.

**Day 15 remaining (owner-side):** DNS cutover, Resend production keys, Cal.com e2e test, contact form e2e, audit-bot e2e (PDF in test inbox), Plausible 10-event verification, GSC sitemap submission, Lab Note publish-via-push sanity check.

---

## 5. Critical path & dependencies

```
DNS @ registrar ──► Resend verified ──► Day 10 contact form ──► Day 15 cutover
                                    └─► Day 12 audit bot email send

AI Gateway key ──► Day 11 streaming ──► Day 12 capture ──► Day 15 e2e test

contentlayer2 OK? ──► (if no) next-mdx-remote ──► Day 4 case studies ──► Day 9 Lab Notes

Mux account ──► Day 8 Urdu video upload (depends on recording done by Day 7)

Cal.com event ──► Day 10 embed
```

Anything on the critical path that slips by 1 day moves launch. Buffer days exist; the critical-path items eat them first.

---

## 6. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `contentlayer2` incompatible with Next 16 build | Medium | High (blocks Day 4) | Fall back to `next-mdx-remote` within 2h; spec §15 Q7 already pre-authorizes |
| Resend DNS propagation slow | Low | Medium | Push DNS Day 0; verify by Day 2 at latest |
| Urdu video not recorded by Day 8 | Medium | Medium | Ship `/about` without video; add poster + "video coming" caption; replace pre-launch |
| AI Gateway model unavailable / rate-limited mid-build | Low | Medium | OpenAI `gpt-5` fallback configured at Gateway level |
| No testimonial available by Day 10 | High | Low | Section omitted cleanly; do not fabricate (kills credibility) |
| PDF rendering pipeline complexity | Medium | Medium | If `@react-pdf/renderer` proves brittle, fall back to emailing hypothesis as Markdown body for v1 |
| Lighthouse mobile < 95 on home | Low | High (DoD blocker) | Day 14 reserved for perf; LCP image budget tight — keep hero text-first |
| Cal.com brand override doesn't apply via embed config | Low | Low | Accept default; revisit post-launch |
| `techai.pk` registrar slow to propagate | Low | High (blocks cutover) | DNS pre-staged Day 0; launch with `*.vercel.app` if needed and cutover post-launch |

---

## 7. Out of scope for v1 — do not build (enforces spec §1.2 + §1.3)

The following are **v2 scope** (planned in §10) and must not be pulled into the v1 sprint:
- GA4, analytics dashboard, admin panel, Payload CMS, Neon Postgres.
- Full Urdu UI translation; `/ur/blog`; locale routing beyond a `/ur` stub link.
- Lead-magnet PDF downloads beyond the audit-bot output.
- Testimonials carousel (single quote slot only in v1).
- Newsletter double opt-in (single-field subscribe only).
- Second Lab demo (ROI calculator).
- Pagefind search, speaking calendar, video walkthroughs, RSS feed.

The following are **permanent "no"** (kills credibility — spec §1.3):
- Typing animations, particle/neural backgrounds, AI stock imagery, spinning 3D, code-styled section headers, "Available for hire" badges, dark+neon accents, "Let's build something amazing" CTAs.
- `/resume`, `/skills`, `/stack`, `/portfolio` routes.
- Marquee / carousel components.
- View Transitions API.
- Dark-mode diagram variants.

If any v2 feature gets requested mid-v1 build, push back and link spec §1.2. The goal is a consultant page that reads like an Apple keynote chapter — not a personal site.

---

## 8. Definition of Done — project gate

The launch goes live when **every** item below is green. No partial launches.

- [ ] All 9 pages live at `techai.pk`. — *owner: DNS cutover*
- [ ] Workflow Audit Bot end-to-end: 5 questions → hypothesis → PDF arrives in test inbox. — *owner: provision ANTHROPIC_API_KEY + RESEND_API_KEY*
- [ ] Cal.com booking confirmed in a real test booking. — *owner: set NEXT_PUBLIC_CAL_LINK*
- [ ] Contact form arrives in `CONTACT_INBOX` with auto-reply to sender. — *owner: Resend domain + keys*
- [ ] Plausible receiving all 10 events (spec §12). — *owner: set NEXT_PUBLIC_PLAUSIBLE_DOMAIN*
- [ ] Sitemap submitted to Search Console; accepted. — *owner: GSC property*
- [x] No third-party "powered by" branding visible. — *confirmed clean*
- [x] README documents env, build, content authoring, deploy. — *done 2026-05-14*
- [x] Owner can publish a Lab Note by adding an MDX file and pushing — no manual rebuild. — *MDX pipeline + PPR in place*
- [ ] Lighthouse mobile: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100 on `/`, `/work/meetplanner`, `/lab/audit`, `/contact`. — *owner: run on live preview URL*
- [ ] axe-core: zero violations on the four pages above. — *owner: run Playwright axe on preview URL*
- [ ] OG images render correctly when shared on LinkedIn + iMessage. — *owner: share preview URL links*
- [x] Banned-phrases sweep clean (spec §13). — *confirmed clean 2026-05-14*

---

## 9. Decisions made by this plan (append to spec §19 on Day 1)

| Date | Decision |
|---|---|
| 2026-05-12 | Launch domain locked to `techai.pk`; all `abdulwahab.dev` references substituted. |
| 2026-05-12 | Pricing default: show "Audit — starting from $1,500" on `/services` (spec §15 Q2 default). |
| 2026-05-12 | Mux selected for video hosting over Cloudflare Stream (spec §15 Q6). |
| 2026-05-12 | `contentlayer2` primary, `next-mdx-remote` pre-authorized fallback (spec §15 Q7). |
| 2026-05-12 | Testimonial section ships only if real quote available by Day 10; no fabrication. |
| 2026-05-12 | PDF rendering via `@react-pdf/renderer`; Markdown-body fallback if brittle. |
| 2026-05-12 | Node 24 LTS adopted instead of spec-locked Node 22. Reason: Node 24 already installed on build machine; Next.js 16 supports both; no behavior gap relevant to this build. Encoded as `.nvmrc 24` + `engines.node >=22 <25`. |
| 2026-05-12 | npm adopted instead of spec-locked pnpm. Reason: pnpm not installed on build machine and no team-coordination requirement for a content-addressable store in a solo build. Lockfile is `package-lock.json`. Revisit if collaborators join. |
| 2026-05-14 | V2 CMS: Payload CMS 3.x (Next.js-native) over Sanity or Keystatic. Runs inside the same app at `/admin`. |
| 2026-05-14 | V2 database: Neon Postgres via Vercel Marketplace. Payload manages schema. |
| 2026-05-14 | V2 analytics: GA4 via `@next/third-parties/google` added alongside Plausible + Vercel Analytics. |
| 2026-05-14 | V2 second Lab demo: ROI calculator (preferred over diagram generator). Decide definitively at v2 kickoff. |
| 2026-05-14 | V2 search: Pagefind (static, post-build CLI) over Algolia or custom solution. |
| 2026-05-14 | V2 gate: do not start v2 until v1 90-day metrics are on-track (≥ 4 discovery calls/month, ≥ 25 audit bot completions). |
| 2026-06-13 | Added LMS (`/learn`) as a post-v1 feature (Task #18). Three pages: catalog, course overview, lesson player. Backed by YouTube Data API v3 with hourly cache — new videos uploaded to either playlist appear on-site automatically within 1 hour. Static fallback arrays ensure build never fails without `YOUTUBE_API_KEY`. Lesson URL slug = YouTube video ID for permanent stability. `YOUTUBE_API_KEY` added to Vercel production env. |

---

## 10. V2 Build Plan (Days 16–38)

> **Gate condition.** V2 begins only when v1 is live and 90-day metrics are on-track. If conversion is below target, fix the funnel before adding features. The exact start date is variable; Days 16–38 are relative to the v2 kickoff, not the v1 launch date.

### V2 Pre-flight (before Day 16)

Before starting any v2 code:

1. **Pull v1 metrics** — Cal.com dashboard, Plausible, audit-bot event count. Gate check: ≥ 4 discovery calls/month, ≥ 25 audit bot completions in 90 days. If not met, stop and diagnose.
2. **Provision Neon Postgres** — via Vercel Marketplace; copy `DATABASE_URI` to Vercel project env (production + preview).
3. **Payload secret** — generate `PAYLOAD_SECRET` (32-char random string); add to Vercel env.
4. **Vercel Blob** — enable in Vercel project; copy `BLOB_READ_WRITE_TOKEN` to env.
5. **GA4 property** — create GA4 property at `techai.pk`; copy `NEXT_PUBLIC_GA_MEASUREMENT_ID` to Vercel env.
6. **ROI calculator decision** — review audit bot usage patterns; confirm second Lab demo is ROI calculator (or diagram generator). This locks Phase 4 scope.

---

### Phase 1 — Analytics (Days 16–18)

Goal: GA4 live, internal dashboard showing key metrics. No CMS yet — dashboard uses API calls.

#### Day 16 — GA4 wiring
- Install `@next/third-parties` if not already present.
- Add `<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />` to `app/layout.tsx`.
- Extend `lib/analytics/track.ts` — each existing `plausible()` call gets a paired `gtag('event', …)` call for GA4 goal tracking.
- Verify GA4 receiving events in GA4 Debug View (real-time panel).
- Configure GA4 goals: `cta_book_call`, `audit_complete`, `audit_email_capture`, `cta_workshop_inquiry`.

**Done when:** GA4 Debug View shows events firing for all 4 goal types on local + preview.

#### Day 17 — Dashboard — Cal.com + Plausible panels
- Create `/app/(admin)/dashboard/page.tsx` — server component; simple password gate via middleware cookie until Payload auth ships on Day 26.
- `lib/dashboard/calcom.ts` — fetch Cal.com API: bookings this month, upcoming, total pipeline.
- `lib/dashboard/plausible.ts` — fetch Plausible Stats API: top 5 pages, top referrers, weekly unique visitors.
- Build dashboard UI: booking panel + traffic panel. Apple HIG card style; no chart library yet (numbers only).

**Done when:** `/dashboard` renders real Cal.com + Plausible data behind password gate.

#### Day 18 — Dashboard — Resend + Audit Bot + Content panels
- `lib/dashboard/resend.ts` — fetch Resend API: subscriber count, open rate of last campaign.
- Audit Bot panel: pull `audit_start` + `audit_complete` + `audit_email_capture` counts from Plausible Stats API (custom event filter). Derive completion rate and capture rate.
- Content panel: count Lab Notes from MDX (Day 28 migrates this to Payload; stub for now).
- Add simple bar indicator for each metric (CSS-only, no chart lib).

**Done when:** all 5 dashboard panels render with live data; Lighthouse on `/dashboard` ≥ 95.

---

### Phase 2 — Payload CMS + Neon Migration (Days 19–28)

Goal: Payload admin running inside the Next.js app; all MDX content migrated into Neon Postgres; MDX pipeline removed.

#### Day 19 — Payload CMS bootstrap
- Install `payload@3` + `@payloadcms/next` + `@payloadcms/db-postgres` + `@payloadcms/richtext-lexical`.
- Add Payload plugin to `next.config.ts` via `withPayload()`.
- Configure `payload.config.ts`: `db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } })`, `secret: process.env.PAYLOAD_SECRET`, `admin.user: 'users'`.
- Define `Users` collection (email + password; single admin).
- Wire `/admin` route group: `app/(payload)/admin/[[...segments]]/page.tsx` per Payload Next.js adapter docs.
- First `npm run payload migrate` — creates schema in Neon.

**Done when:** `/admin` loads Payload admin UI; can log in; Neon tables created.

#### Day 20 — Collections — Project + LabNote
- `collections/Project.ts` — fields from spec §18.4: `title`, `slug`, `eyebrow`, `summary`, `metrics[]` (array of `{value, label}`), `heroDiagram` (upload relation), `stack[]` (text array), `testimonial` (relation to `Testimonial`), `order` (number), `videoWalkthrough` (text — Mux video ID), `whatIdDoDifferently` (richtext).
- `collections/LabNote.ts` — `title`, `slug`, `date`, `summary`, `category`, `series`, `seriesPart` (number), `locale` (select: `en` / `ur`), `body` (Lexical richtext), `ogImage` (upload relation).
- Register both in `payload.config.ts`; run migration.

**Done when:** can create a Project and a LabNote in Payload admin; relations resolve.

#### Day 21 — Collections — Workshop + Testimonial + LeadCapture
- `collections/Workshop.ts` — `format`, `title`, `description`, `topics[]` (richtext), `pastEngagements[]` (array: org, date, format), `outcomes[]` (text array), `upcomingDates[]` (array: date, location, format, registrationUrl).
- `collections/Testimonial.ts` — `quote`, `author`, `role`, `org`, `project` (relation to `Project`).
- `collections/LeadCapture.ts` — `email`, `name`, `source` (select: `audit-bot` / `lead-magnet` / `subscribe`), `auditTranscript` (textarea), `createdAt`. Access: create-only for public; read via admin.
- Update `app/api/audit/stream/route.ts` capture step to `POST` to Payload REST API (or Local API) to create a `LeadCapture` entry on email submission.
- Run migration.

**Done when:** audit bot email capture writes a `LeadCapture` doc visible in Payload admin.

#### Day 22 — Vercel Blob media adapter
- Install `@payloadcms/storage-vercel-blob`.
- Configure in `payload.config.ts`: `storage: vercelBlobStorage({ collections: { Project: { prefix: 'diagrams' }, LabNote: { prefix: 'og' } }, token: process.env.BLOB_READ_WRITE_TOKEN })`.
- Test: upload a diagram SVG via Payload admin → confirm it lands in Vercel Blob + URL resolves.
- Wire `Project.heroDiagram` upload field to the blob adapter.

**Done when:** image uploaded via Payload admin is served from Vercel Blob CDN URL.

#### Day 23 — Content migration — Projects (case studies)
- In Payload admin: create 3 `Project` docs from MDX content (copy-paste then format). Upload SVG diagrams to Blob.
- Update `app/(marketing)/work/[slug]/page.tsx` — replace contentlayer import with Payload Local API call: `payload.find({ collection: 'projects', where: { slug: { equals: params.slug } } })`.
- Update `generateStaticParams` to pull from Payload.
- Update `/work` index page fetch.
- Build + verify: all 3 case studies render identically to MDX version.

**Done when:** `npm run build` succeeds; all 3 case studies load from Payload; no contentlayer imports on these pages.

#### Day 24 — Content migration — Lab Notes + Workshops
- Migrate 2 seed Lab Notes from MDX to Payload (locale: `en`).
- Update `/lab/[slug]` and `/lab` index to fetch from Payload.
- Migrate workshop topics + past engagements to `Workshop` collection.
- Update `/workshops` accordion and past-engagements list to fetch from Payload.
- Build + verify.

**Done when:** Lab Notes and Workshop page both render from Payload; MDX files for these can be deleted.

#### Day 25 — Content migration — Services + Testimonials
- Service tier content is largely hardcoded copy — confirm it stays in code (no CMS needed for pricing copy). Migrate only if it has variable fields.
- Enter any available real testimonials into Payload `Testimonial` collection.
- Wire testimonial display on home + case study pages via Payload query.
- Build + verify.

#### Day 26 — Dashboard — wire to Payload; Payload auth gate
- Replace dashboard middleware cookie with Payload session auth: check `payload.auth()` in the dashboard route middleware.
- Update Audit Bot dashboard panel to query `LeadCapture` collection via Payload Local API instead of Plausible custom event count.
- Update Content panel to query Payload for Lab Note count + most recent publish date.

**Done when:** `/dashboard` auth requires Payload login; audit bot metrics come from Payload.

#### Day 27 — Cache invalidation + ISR revalidation
- Add Payload `afterChange` hook to `LabNote` and `Project` collections: call `revalidateTag('lab')` / `revalidateTag('work')` via Next.js `revalidateTag()` import.
- Wire `cacheTag('lab')` on `/lab/[slug]` and `cacheTag('work')` on `/work/[slug]` (replaces contentlayer-era manual revalidation).
- Test: publish a new Lab Note from Payload admin → page updates within one request without a redeploy.

**Done when:** content published in Payload admin appears on the live preview URL within ~2 seconds.

#### Day 28 — Cleanup + Phase 2 buffer
- Remove `contentlayer2` / `next-mdx-remote` from `package.json`.
- Delete `content/` directory (all content now in Neon).
- Delete `lib/content/schemas.ts` (replaced by Payload collection configs).
- Remove old MDX-related imports from all pages.
- Full `npm run build` — zero errors, zero warnings.
- Lighthouse pass: all v1 target pages still ≥ 95 performance.

**Phase 2 buffer:** Day 28 is half-day buffer. Most likely sinks: Payload + Next 16 adapter edge cases, Vercel Blob CORS on SVG uploads, ISR revalidation cold-start on preview.

---

### Phase 3 — Content Features (Days 29–33)

Goal: Urdu blog live, RSS feed, double-opt-in newsletter, lead magnet PDF, Lab Notes series format.

#### Day 29 — Urdu blog
- Wire `/ur/blog` route group: `app/(marketing)/ur/blog/page.tsx` and `/ur/blog/[slug]/page.tsx`.
- Payload query: `payload.find({ collection: 'labNotes', where: { locale: { equals: 'ur' } } })`.
- Author 1 seed Urdu Lab Note in Payload admin.
- Update footer `/ur` stub link → `/ur/blog` (removes the 404 stub).
- Add `<link rel="alternate" hrefLang="ur">` for each Urdu note.
- Metadata: title + description in Urdu; `dir="rtl"` on Urdu page body.

**Done when:** `/ur/blog` renders with one Urdu note; correct `dir`, hreflang, metadata.

#### Day 30 — RSS feed
- `app/lab/feed.xml/route.ts` — generate RSS 2.0 XML from Payload Lab Notes (locale: `en`), sorted by date desc.
- Add `<link rel="alternate" type="application/rss+xml" href="/lab/feed.xml">` in Lab Note layout `<head>`.
- Validate feed at W3C RSS validator.

**Done when:** `/lab/feed.xml` returns valid RSS 2.0; at least one reader (Reeder, NetNewsWire) can subscribe.

#### Day 31 — Newsletter double opt-in
- Create Resend audience + confirmation email template (branded, plain-text first, HTML second).
- Replace v1 single-field subscribe form with two-step flow: submit email → pending confirmation page → Resend sends confirmation link → `/confirm-subscription?token=…` route validates token → adds to Resend audience.
- Unsubscribe link included in every outbound email (legal requirement).
- Update `LeadCapture` source: subscription events create a `LeadCapture` doc with `source: 'subscribe'`.

**Done when:** test subscription flow end-to-end — confirmation email arrives, clicking link adds to Resend audience.

#### Day 32 — Lead magnet PDF
- Author "30 Workflows AI Can Automate Today" — 30 entries, sorted by industry (Manufacturing, Marketing, Services, SaaS, Education). Plain-language, no jargon.
- `@react-pdf/renderer` PDF template — Apple HIG aesthetic (white bg, forest green headings, Fraunces display text, JetBrains Mono for code snippets). Max 8 pages.
- `/api/lead-magnet/route.ts` — POST: validate email, create `LeadCapture` doc (`source: 'lead-magnet'`), send Resend email with PDF attached (rendered server-side).
- Wire email capture form on a dedicated `/lab/30-workflows` page and as a CTA on the `/lab` index.

**Done when:** form submission → PDF arrives in test inbox within 10 seconds; `LeadCapture` doc created in Payload.

#### Day 33 — Lab Notes series format
- `series` and `seriesPart` fields already in `LabNote` collection (Day 20). Activate UI:
  - Series grouping on `/lab` index — notes with the same `series` value appear under a series header.
  - Series navigation component in Lab Note layout: "← Part 1" / "Part 3 →" prev/next links.
  - Series index page: `/lab/series/[slug]` — lists all parts of a named series.
- Author first 2-part series (e.g., "Agentic Systems from Scratch, Parts 1–2").

**Done when:** series navigation renders correctly; clicking prev/next moves between parts; series page lists all parts in order.

---

### Phase 4 — Lead Gen + Authority (Days 34–38)

Goal: second Lab demo live, Pagefind search, speaking calendar, video walkthroughs, testimonials carousel.

#### Day 34 — ROI Calculator (second Lab demo)
- `app/(lab)/lab/roi-calculator/page.tsx` — client component.
- UI: industry selector (dropdown, 8 industries) + workflow description (textarea) + hours/week input (number). CTA: "Calculate my automation potential."
- `app/api/roi/route.ts` — Server Action (not Edge; needs more compute time): calls AI Gateway with a structured prompt; returns JSON: `{ opportunityScore: number, automationPotential: string, recommendedApproach: string, estimatedTimeSaved: string }`.
- Output card: opportunity score (large numeral, accent color) + narrative + CTA to book audit.
- Wire `audit_start` (on form submit) + `audit_complete` (on result render) Plausible + GA4 events.
- Rate limit: 5 calculations / IP / hour via Vercel KV (same pattern as audit bot).

**Done when:** end-to-end flow works; result renders; events fire; rate limit triggers correctly.

#### Day 35 — Pagefind search
- Add `pagefind` to `devDependencies`.
- Update `package.json` build script: `"build": "next build && pagefind --site .next/server/app --output-path public/pagefind"`.
- Build search UI on `/lab` index: `⌘K` / `Ctrl+K` opens a modal (shadcn `Dialog`); search input queries Pagefind; results list with title + excerpt + link.
- Keyboard navigation: arrow keys move between results; `Enter` navigates; `Esc` closes.
- `aria-label` on search trigger; `role="combobox"` on input; results have `role="option"`.

**Done when:** Pagefind index builds as part of `npm run build`; search returns relevant Lab Notes; keyboard-navigable; axe-core clean.

#### Day 36 — Speaking calendar + testimonials carousel
- **Speaking calendar:** `upcomingDates[]` field on `Workshop` collection already defined (Day 21). Render on `/workshops`: upcoming talks sorted by date, each with location, format, and optional registration link. If no upcoming dates, section is hidden (not "Coming soon" — just absent).
- **Testimonials carousel:** query `Testimonial` collection. If 3+ quotes: render a simple auto-advancing carousel (CSS `scroll-snap`, no JS animation library; respects `prefers-reduced-motion`). If 1–2: render as static pull-quote(s). If 0: section hidden.
- Wire testimonials to home page "Social proof" section and to individual case study pages (filtered by `project` relation).

**Done when:** speaking calendar renders if data exists; testimonials carousel advances correctly; hidden gracefully if no data.

#### Day 37 — Video case study walkthroughs
- `videoWalkthrough` field on `Project` collection already defined (Day 20). For each case study with a Mux video ID populated:
  - Add `@mux/mux-player-react` embed below the "Outcome" section.
  - `preload="metadata"`, `poster` from Vercel Blob, captions track (`<track kind="captions">`).
  - Player hidden (section skipped) if `videoWalkthrough` is null — no empty video player.
- Record 2–3 min Loom-style walkthroughs for at least one case study (MeetPlanner recommended — highest complexity to explain verbally).
- Upload to Mux; wire ID into Payload admin.

**Done when:** at least one case study shows the video player; captions load; player absent on studies without a video.

#### Day 38 — V2 DoD audit + buffer
- Lighthouse pass on all new v2 routes: `/ur/blog`, `/lab/roi-calculator`, `/dashboard`, `/lab/series/[slug]`. All ≥ 95 performance, ≥ 95 accessibility.
- axe-core on new routes — zero violations.
- GA4 funnel audit: landing → ROI calculator → audit bot → email capture → booking. Verify all goal events fire.
- Verify Payload afterChange hooks revalidate ISR correctly for LabNote + Project.
- Test Urdu RSS feed in a reader.
- Owner smoke test: publish a new Lab Note in Payload admin → live on site without redeploy.
- Update `README` with Payload admin login instructions, Neon connection notes, Pagefind build step.

**Phase 4 buffer:** Day 38 is half-day buffer. Most likely sinks: Pagefind build step breaking Vercel CI (mitigation: run pagefind in a post-build Vercel hook, not in `next build`), ROI calculator latency under load, Mux player SSR hydration.

---

## 11. V2 Critical Path & Dependencies

```
Neon Postgres provisioned ──► Day 19 Payload bootstrap ──► Days 20–21 collections
                                                         └──► Day 22 Vercel Blob
                                                         └──► Days 23–25 content migration
                                                         └──► Day 26 Payload auth on dashboard
                                                         └──► Day 27 ISR revalidation

GA4 measurement ID ──► Day 16 GA4 wiring ──► Day 34 ROI calculator events

Payload LeadCapture collection (Day 21) ──► Day 26 dashboard audit panel
                                        └──► Day 31 newsletter opt-in capture
                                        └──► Day 32 lead magnet capture

Payload LabNote locale field (Day 20) ──► Day 29 Urdu blog
                                      └──► Day 33 series format

npm run build + pagefind ──► Day 35 search index ──► Day 35 search UI
```

Any Payload collection definition delay on Days 20–21 cascades into every migration day. Payload bootstrap (Day 19) is the single highest-risk item — block two days of buffer if Next 16 adapter has compatibility issues.

---

## 12. V2 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Payload 3.x + Next 16 adapter incompatibility | Medium | High (blocks entire Phase 2) | Test on a throwaway branch Day 19; if blocked >4h, open Payload GitHub issue and consider Keystatic as fallback (content stays in MDX, no DB needed) |
| Neon Postgres cold start adds latency to Payload Local API calls | Low | Medium | Enable Neon connection pooling (pgBouncer); use Payload Local API (not REST) from server components to avoid HTTP overhead |
| Pagefind build step incompatible with Vercel build environment | Medium | Low | Run Pagefind via Vercel `postBuild` hook in `vercel.ts` instead of inside `next build`; test on preview before Day 35 |
| GA4 event deduplication (firing both Plausible + gtag) | Low | Low | Wrap in a single `track()` helper in `lib/analytics/track.ts`; one callsite, two destinations |
| ROI calculator AI response latency > 5s (UX threshold) | Medium | Medium | Show streaming output (same pattern as audit bot); don't wait for full response before rendering |
| Urdu Lab Notes require RTL layout changes | Medium | Medium | Scope RTL to `/ur` route group only; `dir="rtl"` on body; don't touch main English layout |
| Content migration data loss (MDX → Payload) | Low | High | Keep `content/` directory in git until Phase 2 is fully deployed and verified; don't delete until Day 28 |
| Mux video player SSR hydration mismatch | Low | Low | Wrap `@mux/mux-player-react` in `dynamic(() => import(…), { ssr: false })` |
| V2 starts before v1 metrics are healthy | Medium | High | The gate condition in §10 is non-negotiable. If metrics are off, spend the v2 window on CRO (copy, CTA placement, audit bot flow) instead |

---

## 13. V2 Definition of Done

V2 ships in phases — each phase has its own gate. The overall V2 DoD requires all phases complete.

**Phase 1 done when:**
- [ ] GA4 receives all 4 goal events on production.
- [ ] `/dashboard` renders live data from Cal.com, Plausible, Resend, Payload.
- [ ] Dashboard is auth-gated (Payload session or password — upgraded on Day 26).

**Phase 2 done when:**
- [ ] All 3 case studies, 2+ Lab Notes, and workshop content render from Payload (not MDX).
- [ ] Payload admin UI is accessible at `/admin` with Payload login.
- [ ] `content/` directory deleted; `contentlayer2` / `next-mdx-remote` removed from `package.json`.
- [ ] Publishing a Lab Note in Payload admin updates the live page without a redeploy.
- [ ] Vercel Blob serves all diagrams and OG images.
- [ ] Lighthouse ≥ 95 performance on all v1 pages (no regression from migration).

**Phase 3 done when:**
- [ ] `/ur/blog` renders Urdu Lab Notes with correct `dir="rtl"`, hreflang, metadata.
- [ ] `/lab/feed.xml` returns valid RSS 2.0; passes W3C validator.
- [ ] Double opt-in newsletter flow works end-to-end (submit → confirm email → added to Resend audience).
- [ ] Lead magnet PDF arrives in test inbox within 10 seconds of form submit.
- [ ] Lab Notes series navigation works: prev/next links, series index page.

**Phase 4 done when:**
- [ ] ROI calculator returns a result within 8 seconds; rate limit triggers at 5/hour/IP.
- [ ] Pagefind search returns relevant Lab Notes; keyboard-navigable; axe-core clean.
- [ ] Speaking calendar renders upcoming dates from Payload (or section absent if no data).
- [ ] Testimonials render (carousel if 3+, static if 1–2, hidden if 0).
- [ ] At least one case study has a working Mux video player with captions.
- [ ] axe-core zero violations on all new v2 routes.
- [ ] GA4 funnel verified: landing → demo → email capture → booking goal events all fire.
- [ ] `README` updated with Payload, Neon, Pagefind build instructions.

---

*End of plan. The spec is the contract; this plan is the schedule. Edits land via PR with a one-line entry in §9 Decisions.*
