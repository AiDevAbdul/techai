# Portfolio Build Plan — `techai.pk`

> Execution plan for `spec.md`. Reads as a working contract for the 3-week build.
> Owner: Abdul Wahab · Build lead: Claude (Opus 4.7) · Kickoff: 2026-05-12 · Target launch: 2026-06-02.
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
| `CONTACT_INBOX` | `hello@techai.pk` (alias → `abdul@duckercreative.com` until inbox is provisioned) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `techai.pk` |
| Person schema `url` | `https://techai.pk` |
| OG / canonical base | `https://techai.pk` |
| Email infra | Resend domain on `techai.pk`; SPF / DKIM / DMARC verified before launch |
| Redirect rule | `www.techai.pk` → `techai.pk` (308) |

Resolves spec §15 Q1. Update spec §3 + §13.3 + §18 with a one-line decisions-log entry on Day 1.

---

## 1. Day 0 pre-flight (must clear before Day 1)

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

Goal: a deployable site with the design system, the home page populated with real copy, and the case-study pipeline working end-to-end through one fully-shipped study.

### Day 1 — Project bootstrap & design tokens
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

### Day 2 — Component pass + chrome
- `components/brand/Navbar.tsx` — sticky, material blur on scroll > 12px, focus ring, mobile sheet menu.
- `components/brand/Footer.tsx` — 3-column, copyright, theme toggle, `/ur` stub link (404 in v1 → swap to "coming soon" page so it's not a broken link).
- `components/brand/Container.tsx` — `max-w-[1200px]` rail, gutters 24/40/64.
- `components/ui/SegmentedControl.tsx` — custom, for `/services`.
- `components/ui/Pill.tsx` (badge variant).
- `components/ui/Prose.tsx` — Tailwind typography v4 with Apple-scale overrides.
- `:focus-visible` ring globally; `prefers-reduced-motion` global override.
- Skip-link component.

**Done when:** rendering Navbar + Footer + Container on a placeholder page passes axe-core with zero violations.

### Day 3 — Home page
- Hero from spec §7.1 (locked copy). Fraunces H1, `--t-display-xl` ≥1280px.
- "Who I work with" 3-card row (Operators / Teams / Communities) — cards anchor-link to `/services`.
- "Recent Systems" row — 3 placeholder case-study tiles (real diagrams ship Day 4–5).
- "How I work" — numbered 3-step list.
- "Lab Notes" — pulls latest 3 from MDX (empty state OK until Day 9).
- Closing CTA band.
- Metadata: title, description, OG image stub (real OG generation on Day 13).
- Plausible script wired; Vercel Analytics wrapper.

**Done when:** home renders with real copy on mobile + desktop; LCP ≤ 1.8s on Vercel preview; One-Question Test passes a cold-read.

### Day 4 — Case-study pipeline + MeetPlanner
- `lib/content/schemas.ts` — zod schemas per spec §7.3 frontmatter contract.
- `content/case-studies/meetplanner.mdx` — full draft per spec §7.3 template (1–10).
- `app/(marketing)/work/page.tsx` — editorial index list.
- `app/(marketing)/work/[slug]/page.tsx` — template renderer; `generateStaticParams`, `generateMetadata`.
- Excalidraw → SVG export for MeetPlanner architecture; place at `/public/diagrams/meetplanner-architecture.svg`.
- 3-up metric row component with tabular numerals.
- Inline pill row for stack.

**Done when:** `/work/meetplanner` renders end-to-end through MDX; build fails on malformed frontmatter; case-study OG metadata correct.

### Day 5 — Remaining case studies
- `content/case-studies/marketing-dash.mdx` + diagram SVG.
- `content/case-studies/printing-press.mdx` + diagram SVG.
- `/work` index ordered: MeetPlanner → Marketing Dash → Printing Press (locked).
- "What I'd do differently" paragraph mandatory on each — this is the trust play.

**Done when:** all 3 case studies render, diagrams are SVG, axe-core clean, mobile review at 375px passes.

**Week 1 buffer:** half a day. Most likely sinks: contentlayer2 Next 16 incompatibility (mitigation: switch to `next-mdx-remote` without ceremony), font loading edge cases, theme-toggle flash.

---

## 3. Week 2 — Content & service surfaces (Days 6–10)

Goal: every non-interactive page shipped with real content. Resend wired. Cal.com embedded. Urdu video on `/about`.

### Day 6 — `/services`
- Hero `"How I work with teams."`.
- Segmented control: Audit / Build / Workshop / Speaking.
- Tier cards from `content/services/*.mdx`: name, format, ideal-for, deliverables checklist, "starting from" anchor, CTA.
- Pricing visible on Audit ("starting from $1,500") per default decision.
- `Service` JSON-LD schema per tier.

### Day 7 — `/workshops`
- Hero + 3 format cards (Executive briefing / Team workshop / Hands-on bootcamp).
- Accordion topics catalog from `content/workshops/topics.mdx` (10–15 items).
- Past engagements: logo wall **or** dated list (whichever the real list supports — min 3).
- Outcomes section + one testimonial slot (drop if Q3 not resolved).
- Inquiry form: org, role, audience size, format, target dates, notes. Honeypot + hCaptcha invisible. Server Action → Resend.

### Day 8 — `/about` + Urdu video
- Three-paragraph editorial body.
- Speaking / workshop photo, full-bleed 16:9, `<Image>` with `priority` only if above-the-fold.
- Urdu greeting (30–45s): record, caption (English VTT), upload to Mux, embed via `@mux/mux-player-react` with `preload="metadata"` + poster.
- `Person` JSON-LD with `jobTitle`, `worksFor`, `sameAs` (LinkedIn, GitHub, X).
- Closing CTA + raw email.

### Day 9 — `/lab` index + 2 seed notes
- `/lab` editorial index: date · category · title · 1-line tease.
- `content/lab/context-engineering-for-ops-teams.mdx` (draft).
- `content/lab/workflow-diagram-worth-10-specs.mdx` (draft).
- Lab Note template: side-rail TOC (≥1024px), reading-rail `max-w-[68ch]`, code blocks via custom `CodeBlock` (JetBrains Mono 14px, copy button, no line numbers).
- Footer of post: 2 related notes + "Subscribe to Lab Notes" inline single-field form (no double opt-in in v1 per spec §1.2).
- `Article` JSON-LD per note.

### Day 10 — `/contact` + Resend wiring
- Two-column desktop layout: Cal.com inline embed (left) + form (right). Stack on mobile.
- Cal.com brand override = forest green via embed config.
- Form fields: name, email, org, message, budget (optional dropdown), honeypot.
- Server Action `/api/contact` → Resend transactional send to `CONTACT_INBOX` + auto-reply to sender.
- Success toast via sonner; inline confirmation; form clears.
- Verify SPF/DKIM/DMARC pass via Resend dashboard before Day 11.

**Week 2 buffer:** half a day. Most likely sinks: Resend domain verification DNS propagation, Mux upload + caption sync, Cal.com brand override edge cases.

---

## 4. Week 3 — Interactive demo, polish, launch (Days 11–15)

Goal: Audit Bot live, performance + a11y + SEO budgets met, content frozen, launch.

### Day 11 — Audit Bot UI + streaming
- `app/(lab)/lab/audit/page.tsx` — explainer card + start button; client component for chat surface.
- `app/api/audit/stream/route.ts` — `export const runtime = 'edge'`; `streamText` from AI SDK v6; model `anthropic/claude-sonnet-4-6` via AI Gateway.
- `lib/audit/prompt.ts` — system prompt with `cache_control: ephemeral` blocks.
- 5-question sequential flow, one question per turn; state via `useReducer`; persist transcript to `sessionStorage` until email capture.
- Hard cap output: 1,200 tokens/turn.
- Failure mode: Gateway error → "I'm offline right now — [book a call]." No silent retry.
- `aria-live="polite"` on streaming region; keyboard navigable.

### Day 12 — Audit Bot capture + PDF + rate limit
- After Q5: stream the one-page hypothesis (problem · architecture · stack · risks · next step).
- Capture form (name + work email) below hypothesis.
- PDF via `@react-pdf/renderer` — server-rendered, branded.
- Email via Resend: clean PDF to visitor + transcript copy to owner inbox.
- Rate limit via Vercel KV: 10 starts / IP / hour; copy: "Take a breath — try again in an hour or [book a call]."
- Cost tracking: AI Gateway dashboard; soft alert at $50/mo.
- Plausible custom events: `audit_start`, `audit_complete`, `audit_email_capture`.

### Day 13 — SEO + accessibility pass
- `app/og/[type]/route.tsx` via `@vercel/og` — Apple-keynote treatment (Fraunces title, hairline, accent dot). Render per route type.
- `app/sitemap.ts` (Next 16 native) + `app/robots.ts` — allow all; disallow `/api/*`.
- `alternates.canonical` on every page.
- All 10 custom analytics events wired (spec §12).
- axe-core via Playwright on `/`, `/work/meetplanner`, `/lab/audit`, `/contact` — zero violations.
- Manual VoiceOver pass on the four pages above.
- Heading order audit: one `<h1>`, no skipped levels.
- All forms: label + `aria-describedby` for errors.

### Day 14 — Performance pass
- Lighthouse CI on preview; targets per spec §10.
- `next-bundle-analyzer` — home JS ≤ 90 KB gz, CSS ≤ 15 KB gz.
- Image audit: AVIF priority, `<Image>` with `sizes` everywhere, only LCP image gets `priority`.
- Cache Components: enable PPR; `use cache` + `cacheLife('hours')` on Lab Notes; `cacheTag('lab')` for revalidation.
- Hero image ≤ 60 KB AVIF on mobile.
- Web fonts: confirm only weights 400/500/600 ship.
- Verify p75 LCP ≤ 1.8s mobile on Vercel Speed Insights.

### Day 15 — Content freeze + production cutover
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

**Week 3 buffer:** half a day. Most likely sinks: PDF rendering edge cases (server fonts, page breaks), AI Gateway rate-limit interaction with Vercel KV cold start, OG image generation perf.

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

## 7. Out of scope — do not build (enforces spec §1.2 + §1.3)

- Full Urdu UI translation, `/ur/blog`, locale routing beyond a `/ur` stub link.
- Lead-magnet PDF downloads beyond the audit-bot output.
- Testimonials carousel (single quote slot only).
- CMS, admin, auth, comments, search.
- Newsletter double opt-in.
- Typing animations, particle/neural backgrounds, AI stock imagery, spinning 3D, code-styled section headers, "Available for hire" badges, dark+neon accents, "Let's build something amazing" CTAs.
- `/resume`, `/skills`, `/stack`, `/portfolio` routes.
- Marquee / carousel components.
- View Transitions API.
- Dark-mode diagram variants.

If any of the above gets requested mid-build, push back and link the relevant spec section. The goal is a consultant page that reads like an Apple keynote chapter — not a personal site.

---

## 8. Definition of Done — project gate

The launch goes live when **every** item below is green. No partial launches.

- [ ] All 9 pages live at `techai.pk`.
- [ ] Workflow Audit Bot end-to-end: 5 questions → hypothesis → PDF arrives in test inbox.
- [ ] Cal.com booking confirmed in a real test booking.
- [ ] Contact form arrives in `CONTACT_INBOX` with auto-reply to sender.
- [ ] Plausible receiving all 10 events (spec §12).
- [ ] Sitemap submitted to Search Console; accepted.
- [ ] No third-party "powered by" branding visible.
- [ ] README documents env, build, content authoring, deploy.
- [ ] Owner can publish a Lab Note by adding an MDX file and pushing — no manual rebuild.
- [ ] Lighthouse mobile: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100 on `/`, `/work/meetplanner`, `/lab/audit`, `/contact`.
- [ ] axe-core: zero violations on the four pages above.
- [ ] OG images render correctly when shared on LinkedIn + iMessage.
- [ ] Banned-phrases sweep clean (spec §13).

---

## 9. Decisions made by this plan (append to spec §18 on Day 1)

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

---

*End of plan. The spec is the contract; this plan is the schedule. Edits land via PR with a one-line entry in §9 Decisions.*
