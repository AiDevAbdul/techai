# Abdul Wahab — Portfolio Build Spec (v1 + v2)

> Engineering & design contract for the public site at the working folder `techai`.
> Strategic decisions inherited from `my-suggestions.md` (positioning, IA, conversion model, content strategy). This document locks in the **design system, component contracts, page specs, and engineering plan** required to ship v1 in 3 weeks — and the v2 extended scope agreed on 2026-05-14.
>
> Design language: **Apple HIG–inspired** (iPhone / macOS). Editorial light theme. Generous whitespace, restrained motion, hairline structure, continuous corner curves, system-style materials used sparingly.
>
> Owner: Abdul Wahab · Build lead: Claude (Opus 4.7) · v1 target launch: 3 weeks from kickoff · v2 target: Month 2–3 post-launch.

---

## 0. North Star

One sentence the site must earn the right to make:

> *"I build AI workflows for businesses and teach the people who run them how it works."*

Every page is graded on the **One-Question Test** from `my-suggestions.md §15`: in 45 seconds, can a cold visitor (a) understand what Abdul does, (b) believe he can do it, (c) know what to do next?

---

## 1. Scope

### 1.1 In scope for v1
- 9 pages: Home, Work index, 3 Case Studies, Services, Workshops, Lab index, About, Contact.
- 1 interactive AI demo: Workflow Audit Bot at `/lab/audit` (streaming, lead-capturing).
- 2 seed Lab Notes (MDX).
- Cal.com embed on `/contact` for 30-min discovery booking.
- Contact form → Resend → owner inbox.
- Plausible + Vercel Analytics wired.
- One Urdu video greeting (30–45s) on `/about`. **Site UI is English-only in v1.**

### 1.2 Out of scope for v1 (deferred to v2 — see §18)
- Google Analytics (GA4). Plausible + Vercel Analytics cover v1.
- Analytics dashboard (`/dashboard`).
- Admin panel + CMS migration (Payload CMS + Neon Postgres). MDX in repo is sufficient until content cadence outgrows it.
- Full Urdu UI translation. Urdu blog (`/ur/blog`) is v2.
- Newsletter signup with double opt-in (single-field "subscribe" only in v1).
- Lead-magnet PDFs ("30 Workflows…" etc.).
- Testimonials carousel (drop in if 1+ real quote exists by week 3).
- Second Lab demo (ROI calculator or diagram generator).
- Pagefind search on `/lab`.
- Speaking calendar with upcoming dates.
- Video case study walkthroughs.
- Private/gated technical appendices on case studies.
- Post-workshop resource portal.
- RSS feed + automated email digest.
- Lab Notes series format.
- Authentication, admin dashboard, comments.

### 1.3 Hard "no" list (kills credibility — do not implement)
Per `my-suggestions.md §13`: typing animations, particle / neural-net backgrounds, AI stock imagery, spinning 3D, code-styled section headers, "Available for hire" badges, dark + neon accents, "Let's build something amazing" CTAs.

---

## 2. Audiences & Success Metrics

### 2.1 The three audiences (locked)
1. **Operators** — SMB / mid-market owners and ops leads. Buy: workflow audits and builds.
2. **Teams** — Corporate L&D, founders running training initiatives. Buy: workshops.
3. **Communities** — Conference organizers, universities. Buy: speaking (often unpaid; high authority).

### 2.2 Success metrics (90 days post-launch)
| Metric | Target | Tooling |
|---|---|---|
| Discovery calls booked / month | ≥ 4 | Cal.com |
| Workshop / speaker inquiries / month | ≥ 2 | Form → Resend |
| Workflow Audit Bot completions | ≥ 25 | Custom event |
| Lab Notes published | 6 (cadence: 1 / 2 weeks) | Repo |
| Organic search impressions / month | ≥ 5,000 | Search Console |
| Lighthouse (mobile) Performance | ≥ 95 | Lab + CI |
| Largest Contentful Paint (mobile, p75) | ≤ 1.8 s | Vercel Speed Insights |

---

## 3. Tech Stack (locked)

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16, App Router** | Cache Components, PPR enabled, RSC by default. |
| Runtime | Node 24 LTS on Vercel | Edge runtime only for the audit bot's streaming route. (Was Node 22 in v1 draft; deviated 2026-05-12 — see plan §9.) |
| Styling | **Tailwind CSS v4** + design tokens | `@theme` directive; no JS theme provider. |
| Components | **shadcn/ui** | Customized to Apple HIG token set (see §5). |
| Type | **TypeScript strict** | `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` on. |
| Content | **MDX** in repo + `contentlayer2` *(or* `next-mdx-remote` *if contentlayer is unstable on Next 16 at build time — fall back without ceremony).* | Case studies, Lab Notes, workshop topics. |
| Forms | **Resend** for transactional email | Server Action endpoint, hCaptcha invisible. |
| Booking | **Cal.com inline embed** | `/contact` page; brand-color override = forest green. |
| Analytics | **Vercel Analytics** + **Plausible** | Plausible for content/SEO; Vercel for Web Vitals. |
| AI demo | **Vercel AI SDK v6** + **AI Gateway** | Streaming on Edge; model: `anthropic/claude-sonnet-4-6`. |
| Email infra | Resend domain on `abdulwahabai.com` | SPF/DKIM/DMARC verified before launch. |
| Deploy | Vercel | Single project; preview branches enabled. |
| Config | **`vercel.ts`** (not `vercel.json`) | Per current Vercel guidance. |
| Package manager | **npm** | Lockfile (`package-lock.json`) committed. (Was pnpm in v1 draft; deviated 2026-05-12 — see plan §9.) |
| Node version | Pinned via `.nvmrc` + `engines.node` |
| Domain | `abdulwahabai.com` (preferred) or `.ai` if available | Resolution: redirect www → apex. |

**Diagram pipeline.** Workflow diagrams authored in **Excalidraw** (`.excalidraw` source committed) → exported to **SVG** placed in `/public/diagrams/`. No raster diagrams in v1. Dark-mode variants are post-v1.

---

## 4. Information Architecture

```
/                         Home
/work                     Case-study index
/work/meetplanner         Case study — collaboration
/work/marketing-dash      Case study — decision intelligence
/work/printing-press      Case study — operations
/services                 Offer stack (Audit · Build · Workshop · Speaking)
/workshops                Authority page (formats, topics, past engagements, inquiry form)
/lab                      Lab Notes index (essays + prompt patterns + diagrams)
/lab/[slug]               Individual lab note (MDX)
/lab/audit                Workflow Audit Bot (interactive)
/about                    Story, photo, short Urdu video, calendar link
/contact                  Cal.com embed + form

/api/contact              POST — contact form
/api/audit/stream         POST — audit bot streaming (Edge runtime)
/sitemap.xml              Auto
/robots.txt               Auto
/og/[type]                Dynamic OG images via @vercel/og
```

**Forbidden routes** (signal "freelancer" not "consultant"): `/resume`, `/skills`, `/stack`, `/portfolio`.

---

## 5. Design System — Apple HIG, Editorial Light

> The visual language draws from Apple's product-marketing surfaces (apple.com, developer.apple.com, Apple Newsroom) and macOS Tahoe / iOS 19 system UI. **Not** the App Store editorial style (too playful) and **not** iCloud.com (too utilitarian). The bar is: a consultant page that reads like an Apple keynote chapter.

### 5.1 Design tenets
1. **Clarity** — typography does the heavy lifting; chrome recedes.
2. **Deference** — content first; UI is hairlines and whitespace, not boxes and shadows.
3. **Depth** — depth comes from typographic scale and a single tier of material/blur on sticky nav. No drop-shadow stacks.
4. **Continuous geometry** — corner radii are large and continuous (squircle-leaning).
5. **Restrained motion** — easing curves match iOS defaults; durations 180–360 ms; no parallax, no scroll-jacking, no Lottie unless content-bearing.
6. **One accent, used sparingly** — forest green for action, focus, and selection. Never decorative.

### 5.2 Color tokens

```css
/* tokens.css — light (default) */
:root {
  /* Surface */
  --bg:              #FBFBFD;   /* apple.com page bg, warm white */
  --bg-elevated:     #FFFFFF;
  --bg-secondary:    #F5F5F7;   /* apple.com section bg */
  --bg-tertiary:     #EFEFF1;
  --bg-inset:        #F2F2F4;

  /* Label / ink (Apple system-label parity) */
  --label-primary:   #1D1D1F;
  --label-secondary: #6E6E73;
  --label-tertiary:  #86868B;
  --label-quaternary:#C7C7CC;

  /* Separators — hairlines, NOT borders */
  --separator:       color-mix(in oklab, #000 12%, transparent);
  --separator-opaque:#D2D2D7;

  /* Brand accent — forest green (per my-suggestions.md §2.4) */
  --accent:          #15573D;
  --accent-hover:    #114730;
  --accent-pressed:  #0D3923;
  --accent-soft:     #E8F0EA;
  --accent-ring:     color-mix(in oklab, #15573D 35%, transparent);

  /* Semantic */
  --success:         #15573D;   /* uses brand */
  --warning:         #B25E09;
  --danger:          #B3261E;

  /* Code */
  --code-bg:         #F4F2EC;
  --code-ink:        #1D1D1F;

  /* Materials (used only for sticky nav + modal backdrops) */
  --material-thick:  rgba(255,255,255,0.78);
  --material-regular:rgba(255,255,255,0.66);
  --material-thin:   rgba(255,255,255,0.50);
  --material-blur:   saturate(180%) blur(20px);
}

/* Dark theme (toggle only — NOT default) */
:root[data-theme="dark"] {
  --bg:              #0B0B0D;
  --bg-elevated:     #131316;
  --bg-secondary:    #161618;
  --bg-tertiary:     #1C1C1F;
  --bg-inset:        #18181B;

  --label-primary:   #F5F5F7;
  --label-secondary: #A1A1A6;
  --label-tertiary:  #6E6E73;
  --label-quaternary:#3A3A3C;

  --separator:       color-mix(in oklab, #FFF 14%, transparent);
  --separator-opaque:#2C2C2E;

  --accent:          #6EC79A;
  --accent-hover:    #84D2AB;
  --accent-pressed:  #5BB789;
  --accent-soft:     #1B2D24;
  --accent-ring:     color-mix(in oklab, #6EC79A 35%, transparent);

  --code-bg:         #1A1A1D;
  --code-ink:        #F5F5F7;

  --material-thick:  rgba(20,20,22,0.72);
  --material-regular:rgba(20,20,22,0.58);
  --material-thin:   rgba(20,20,22,0.40);
}
```

Theme toggle: `system | light | dark`. Default `system`. Toggle lives only in the footer (not the nav) — keeps the nav clean. Persist in `localStorage` and `<html data-theme>` to avoid flash.

**Label-level contrast contract (added 2026-05-12 from Day 2 axe-core sweep).** `--label-tertiary` (#86868B) on `--bg` (#FBFBFD) yields a 3.5:1 contrast ratio — passes WCAG AA only for *large text* (≥18.66 px / 14 pt bold). Do **not** use `--label-tertiary` (or its Tailwind alias `text-ink-tertiary`) for body, footnote, caption, or eyebrow type. For 12–17 px text on the default surface, use `--label-secondary` (#6E6E73, 4.6:1) or stronger. `--label-tertiary` is reserved for large display text, decorative marker glyphs (e.g., list bullet markers), and disabled-state text where a non-AA muting is acceptable.

**Accent-on contrast contract (added 2026-05-13 from Day 4 axe-core sweep).** Dark-theme `--accent` is `#6EC79A` (mint) — a *light* color tuned for legibility on dark surfaces. White text on it fails WCAG AA (~1.6:1). The token `--accent-on` (light: `#FFFFFF`, dark: `#0B0B0D`) is the only correct foreground for filled accent backgrounds. `--color-primary-foreground` and `--color-accent-foreground` (the shadcn-compat aliases) both route through `--accent-on` so primitives flip automatically. Never hardcode `#FFFFFF` or `text-white` on `bg-accent`.

### 5.3 Typography

System parity with Apple devices, web fallbacks elsewhere.

```css
:root {
  /* Stacks */
  --font-display: ui-sans-serif, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Geist", "Inter", system-ui, sans-serif;
  --font-text:    ui-sans-serif, -apple-system, BlinkMacSystemFont, "SF Pro Text",    "Geist", "Inter", system-ui, sans-serif;
  --font-mono:    ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace;
  --font-serif:   ui-serif, "New York", "Fraunces", Charter, Georgia, serif; /* hero H1 + case-study titles ONLY */

  /* Type scale — Apple Marketing scale (close approximation) */
  --t-eyebrow:   0.75rem;   /* 12px — uppercase eyebrows */
  --t-caption:   0.8125rem; /* 13px */
  --t-footnote:  0.875rem;  /* 14px */
  --t-body:      1.0625rem; /* 17px — Apple body */
  --t-callout:   1.1875rem; /* 19px */
  --t-headline:  1.4375rem; /* 23px */
  --t-title3:    1.75rem;   /* 28px */
  --t-title2:    2.25rem;   /* 36px */
  --t-title1:    3rem;      /* 48px */
  --t-display:   4.25rem;   /* 68px — hero, desktop */
  --t-display-xl:5.5rem;    /* 88px — only for the home H1, ≥1280px */

  /* Tracking — SF Pro Display is tighter than Text */
  --track-display: -0.022em;
  --track-title:   -0.014em;
  --track-body:     0;
  --track-eyebrow:  0.06em; /* uppercase eyebrows */

  /* Leading */
  --lh-display: 1.05;
  --lh-title:   1.1;
  --lh-body:    1.5;
  --lh-tight:   1.25;
}
```

Rules:
- Hero H1 and case-study titles use `--font-serif` (New York / Fraunces). Everything else uses `--font-display` or `--font-text`.
- Body copy: **17px** (Apple body parity). Down to 15px on `prose` aside captions.
- Web fonts: load **Fraunces** (display) and **JetBrains Mono** (code) from `next/font/google` with `display: swap`, `preload: true`, weight subsetting. **Do not** ship Geist as a webfont — system stack handles it on Apple devices; non-Apple devices fall back to Inter via Next font fallback metric matching.
- Optical sizing: enable `font-variation-settings: "opsz" auto` on Fraunces.
- Numerals: tabular nums for metrics (`font-variant-numeric: tabular-nums`).

### 5.4 Spacing, grid, layout

- **8pt grid.** Tailwind v4 default scale extended to include 1.5 (6px), 11 (44px), 13 (52px), 15 (60px), 18 (72px), 22 (88px), 26 (104px), 30 (120px).
- Page max-widths:
  - Marketing rails: `max-w-[1200px]`
  - Reading rails (case studies, Lab Notes): `max-w-[68ch]` for prose; `max-w-[920px]` for media bleed.
- Gutters: 24px mobile, 40px tablet, 64px desktop.
- Vertical rhythm: section padding `py-22` desktop / `py-13` mobile.
- Minimum touch target: 44 × 44 px (Apple HIG).

### 5.5 Radius, borders, elevation

```css
--radius-xs: 6px;
--radius-sm: 10px;
--radius-md: 14px;
--radius-lg: 18px;
--radius-xl: 24px;
--radius-2xl:32px;
--radius-pill: 999px;
```

- All radii use CSS `border-radius`. Squircle approximation: pair with subtle inner stroke (`inset 0 0 0 1px var(--separator)`) for cards to crisp the edge against `--bg-secondary`.
- Borders are **hairlines** (`1px solid var(--separator)`). No 2px borders anywhere.
- **Shadows are nearly absent.** One token only:
  ```css
  --shadow-pop: 0 1px 1px rgba(0,0,0,0.04), 0 10px 30px -10px rgba(0,0,0,0.08);
  ```
  Used on: hover state of `Card` (raise 1px), sticky nav scrolled state, modal/sheet.

### 5.6 Materials & vibrancy

Used in exactly **two** places in v1:

1. **Sticky top nav** when scrolled past 12 px:
   ```css
   background: var(--material-thick);
   backdrop-filter: var(--material-blur);
   -webkit-backdrop-filter: var(--material-blur);
   border-bottom: 1px solid var(--separator);
   ```
2. **Modal / Sheet backdrop** — `--material-regular` on the scrim.

Reduced-motion / Safari fallback: when `backdrop-filter` is unsupported, swap to solid `--bg-elevated` with `border-bottom`. No content depends on the blur.

### 5.7 Motion

```css
--ease-out:   cubic-bezier(0.22, 1, 0.36, 1);     /* iOS easeOut */
--ease-in-out:cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring:cubic-bezier(0.32, 0.72, 0, 1);     /* iOS sheet */
--dur-fast:   180ms;
--dur-med:    260ms;
--dur-slow:   360ms;
```

Patterns:
- **Press feedback**: `transform: scale(0.97)`; duration `--dur-fast`; ease `--ease-out`. Only on interactive elements with `:active`.
- **Hover lift on cards**: `translateY(-2px)` + `--shadow-pop`; duration `--dur-med`.
- **Page transitions**: none (Next App Router native). No view-transitions in v1.
- **Reveal on scroll**: opacity 0→1 + translateY(8px→0); intersection observer; **disabled** when `prefers-reduced-motion: reduce`.
- **No parallax. No counter animations. No marquee bands.**

### 5.8 Iconography

- **Lucide** as the base set (line-style, 1.5 stroke).
- Optional: SF Symbols replicas for nav glyphs (Apple-style geometric icons) via `@phosphor-icons/react` if Lucide reads too generic — pick one and stick to it.
- Decision lock: **Lucide only** in v1. Switching is a v2 decision.
- Icon weights: 1.5 stroke at 20px (inline), 1.75 stroke at 16px (UI chrome).

### 5.9 Imagery rules

- **No AI stock imagery.** Period.
- Workshop / speaking photos are the only people-shots used in chrome.
- Diagram-first hero treatment on case studies.
- All non-decorative imagery: `<Image>` with `alt`, intrinsic ratio set, AVIF priority, then WebP.
- Decorative SVGs marked `aria-hidden`.

---

## 6. Component Library (shadcn/ui + Apple overrides)

Pull these via `npx shadcn@latest add` and then theme to tokens above. Strip default variants we don't use.

| Component | Used on | Notes |
|---|---|---|
| `Button` | Globally | Variants: `primary` (accent), `secondary` (hairline ghost), `tertiary` (text-only with underline on hover), `destructive` (unused in v1). Sizes: `sm/md/lg`. Press scale 0.97. |
| `Link` (custom) | Body copy | Forest underline on hover; `:focus-visible` ring; `target=_blank` gets external icon. |
| `Card` | Home tiles, case study cards, Lab Note cards | Radius 18px, hairline inset stroke, hover lift. |
| `Badge` / `Pill` | Eyebrows ("Operations · 2024"), stack pills | Radius pill; `--label-secondary` on `--bg-secondary`. |
| `Navbar` | All pages | Sticky; material blur at scroll > 12 px. |
| `Footer` | All pages | Three-column; copyright line + theme toggle + locale switch (`/ur` link, v2 stub). |
| `Dialog` / `Sheet` | Contact CTA on mobile | shadcn defaults, restyled. |
| `Tabs` | `/services` offer stack | Segmented-control aesthetic (rounded pill, hairline divider). |
| `Accordion` | `/workshops` topics catalog | Hairline rows, plus-icon rotate. |
| `Tooltip` | Sparingly — workflow diagrams | Delay 350 ms. |
| `Form` + `Input` + `Textarea` | Contact + inquiry + audit bot | Floating label, 14px height. |
| `Toast` (sonner) | Form success/error | Bottom-right, slide-up. |
| `CodeBlock` (custom) | Lab Notes | `JetBrains Mono` 14px, `--code-bg`, no line numbers default, copy button. |
| `Prose` (Tailwind typography v4) | MDX | Customized for Apple type scale. |
| `Marquee` / `Carousel` | **NOT BUILT** | Banned in v1. |

**Segmented control** (custom, used on `/services`):
- Rounded `--radius-pill` outer; inner pill animates with `layoutId`-style transform.
- Hairline outer + `--bg-secondary` inner; active pill = `--bg-elevated` + `--shadow-pop`.

---

## 7. Page-Level Specs

> Each page is graded against the One-Question Test. Below: hero copy locked, structure locked, content fields enumerated. Wireframes match `my-suggestions.md §5`.

### 7.1 `/` — Home

**Hero**
- Eyebrow (small caps, 12px, accent on light): `AI WORKFLOWS · TRAINING · TALKS`
- H1 (Fraunces, `--t-display-xl`, tight leading):
  *"I help businesses turn repetitive work into AI workflows."*
- Subhead (`--t-callout`, `--label-secondary`):
  *"Workflow automation, agentic systems, and team training — for companies that want AI in real operations, not slideshows."*
- CTA row: `[ Book a 30-min call ]` (primary) · `[ See how I work → ]` (tertiary).
- Trust strip: `── Trusted by teams in manufacturing, marketing, SaaS ──` (in `--label-tertiary`).

**Sections (top → bottom)**
1. Hero (above the fold).
2. Who I work with — 3 cards (Operators / Teams / Communities). Card tap → anchor on `/services`.
3. Recent Systems — 3 case-study tiles with diagram thumb + 1-line outcome.
4. How I work — numbered 3-step list (Discovery / Audit / Build or Train).
5. Lab Notes (last 3).
6. Closing CTA band — *"Want a workflow audit? 30 minutes, no pitch."* + Cal.com link.
7. Footer.

**Forbidden on home**: hero portrait, typing animation, particle bg, "what I do" word cloud.

### 7.2 `/work` — Case-study index
- Editorial list, not a grid of screenshots. Each row: eyebrow (category · year), title (Fraunces), one-line outcome, hairline divider.
- Order: MeetPlanner → Marketing Dash → Printing Press. Locked.

### 7.3 `/work/[slug]` — Case study

Template (matches `my-suggestions.md §8`):

1. **Hero strip** — eyebrow · title (Fraunces, `--t-title1`) · 1-paragraph context.
2. **3-up metric row** — large numerals (`--t-title2`, tabular), 1-line captions.
3. **Hero visual** — workflow diagram (SVG from `/public/diagrams/`).
4. **The Problem** — ≤ 3 sentences. No "in today's fast-paced".
5. **The System** — architecture diagram + caption explaining the *one* decision that mattered most.
6. **What I built** — 4–6 bullets, each ≤ 12 words.
7. **Stack** — inline pill row.
8. **Outcome** — operator-language quote or 2-line summary.
9. **What I'd do differently** — one paragraph. This is the trust play. Mandatory.
10. **CTA**: `Book a similar engagement →`.

**MDX frontmatter contract:**
```yaml
slug: meetplanner
title: "MeetPlanner — Hybrid meeting orchestration"
eyebrow: "Operations · 2024"
client: "MeetPlanner Inc."         # or "Confidential"
duration: "4 weeks"
year: 2024
summary: "Cut scheduling friction 70% for distributed teams."
metrics:
  - { value: "70%", label: "less scheduling friction" }
  - { value: "12 hrs/wk", label: "reclaimed per team" }
  - { value: "4 weeks", label: "to MVP" }
heroDiagram: "/diagrams/meetplanner-architecture.svg"
stack: ["Next.js", "Postgres", "OpenAI", "Vercel"]
testimonial: { quote: "…", author: "…", role: "…" } # optional
order: 1
```

### 7.4 `/services` — Offer stack
- Hero: `"How I work with teams."`
- Segmented control (Audit / Build / Workshop / Speaking).
- Each tier card: name, format, ideal-for line, deliverables checklist, "starting from" anchor, primary CTA.
- Pricing display: `Audit — starting from $1,500` visible. Build/Workshop = "Custom" + CTA. (Decision pending; see §15 Open Questions Q2.)

### 7.5 `/workshops` — Authority page
Per `my-suggestions.md §11`:
1. Headline.
2. Three format cards (Executive briefing / Team workshop / Hands-on bootcamp).
3. Topics catalog (accordion, 10–15 items).
4. Past engagements (logo wall **or** dated list — minimum 3 at launch).
5. Outcomes ("teams leave with…").
6. One testimonial.
7. Inquiry form: org, role, audience size, format, target dates, notes.

### 7.6 `/lab` — Index
- Editorial list: date · category · title · 1-line tease.
- No infinite scroll. No filters in v1.

### 7.7 `/lab/[slug]` — Lab Note
- MDX. Frontmatter: `title, date, summary, category, readingTime, ogImage`.
- Side rail (desktop ≥ 1024px): TOC sticky.
- Footer of post: 2 related notes + "Subscribe to Lab Notes" inline form.

### 7.8 `/lab/audit` — Workflow Audit Bot ⭐
The single highest-leverage interactive surface. Built on AI SDK v6 + AI Gateway.

**Flow:**
1. Visitor lands → sees a brief explainer card + start button.
2. On start: chat surface streams 5 sequential questions (one at a time):
   - What's your business / industry?
   - What's the most repetitive workflow your team runs?
   - Who runs it today, and how often?
   - What tools touch this workflow?
   - What would success look like in 90 days?
3. After Q5: bot streams a **one-page automation hypothesis**:
   - Problem restatement.
   - Suggested workflow architecture (text + ASCII diagram).
   - Recommended stack (provider-agnostic).
   - Risks & dependencies.
   - Suggested next step (Audit / Build / Workshop).
4. Below the hypothesis: capture form (name + work email) → "Email me a clean PDF of this." → Resend sends PDF rendered server-side via `@react-pdf/renderer`.
5. Owner gets a parallel Resend notification with transcript + email.

**Engineering contract:**
- Route: `POST /api/audit/stream` (Edge runtime).
- Model: `anthropic/claude-sonnet-4-6` via AI Gateway (allows fallback to `openai/gpt-5` if Gateway routes).
- Streaming: `streamText` from AI SDK; UI consumes via `useChat`.
- State: client-side `useReducer`; transcript persisted to `sessionStorage` until email submitted.
- Rate limit: 10 starts per IP per hour (Vercel KV or Upstash); message: "Take a breath — try again in an hour or [book a call]."
- System prompt: lives in `lib/audit/prompt.ts`; cached via Anthropic prompt caching (`cache_control: ephemeral`).
- Tokens: hard cap output 1,200 tokens per turn.
- Cost ceiling: $0.06 per completed flow (Sonnet 4.6 input/output rates). Soft alert at $50/month spend via Gateway.
- Failure mode: on Gateway error, show "I'm offline right now — [book a call] for a human audit." Do not retry silently.

### 7.9 `/about`
- Editorial. Three paragraphs max:
  1. The duality — engineer who teaches.
  2. The work — what kinds of problems Abdul takes.
  3. The region — South Asian SMB context, why it's a moat (not a translation problem).
- Photo: speaking / workshop photo, full-bleed, 16:9 max. No headshot in v1.
- 30–45 s **Urdu video greeting** — `<video>` element, `preload="metadata"`, poster image, captions in English. Hosted on Mux or Cloudflare Stream (decide v1: Mux free tier).
- Closing: `[ Book a 30-min call ]` + raw email.

### 7.10 `/contact`
- Two columns desktop, stacked mobile.
- Left: Cal.com inline embed (30-min discovery).
- Right: form (name, email, org, message, budget [optional, dropdown], honeypot).
- Form submits to Server Action → Resend → owner inbox + auto-reply to sender.
- Success: toast + inline confirmation; clear form.

---

## 8. Content Model

### 8.1 MDX directory layout
```
content/
  case-studies/
    meetplanner.mdx
    marketing-dash.mdx
    printing-press.mdx
  lab/
    context-engineering-for-ops-teams.mdx
    workflow-diagram-worth-10-specs.mdx
  workshops/
    topics.mdx               # rendered into accordion
    past-engagements.mdx     # rendered into logos/list
  services/
    audit.mdx
    build.mdx
    workshop.mdx
    speaking.mdx
```

### 8.2 Frontmatter zod schemas
All MDX is parsed and validated at build via `zod`. Build fails on malformed frontmatter. Schemas live in `lib/content/schemas.ts`.

---

## 9. Accessibility

Target: **WCAG 2.2 AA**, with a stretch on AAA for body contrast.

Checklist (CI-enforced where possible):
- All interactive elements: 44×44 px minimum hit area.
- `:focus-visible` ring on every interactive: `outline: 2px solid var(--accent-ring); outline-offset: 2px;`. Never remove without a replacement.
- Color contrast: body text ≥ 7:1 (label-primary on bg). Secondary ≥ 4.5:1.
- Forms: every input has a `<label>`; errors associated via `aria-describedby`; error messages avoid color-only signaling.
- Motion: `prefers-reduced-motion: reduce` disables hover lifts, scroll reveals, video autoplay, and CSS `transition` durations are zeroed via media-query override.
- Skip link: `Skip to main content` first focusable.
- Heading order: one `<h1>` per page; no skipped levels.
- Video: captions track for the Urdu greeting; `<track kind="captions">`.
- Audit bot: keyboard-navigable; `aria-live="polite"` on streaming region; loading and error states announced.
- Diagrams: SVG with `<title>` and `<desc>`; long descriptions in adjacent caption.
- Tested with: axe-core in Playwright; manual VoiceOver pass on `/`, `/work/meetplanner`, `/lab/audit`, `/contact`.

---

## 10. Performance Budget

Mobile, p75 (Vercel Speed Insights):

| Metric | Budget |
|---|---|
| LCP | ≤ 1.8 s |
| INP | ≤ 200 ms |
| CLS | ≤ 0.05 |
| TTFB | ≤ 0.6 s |
| Total JS shipped (home, gz) | ≤ 90 KB |
| Total CSS shipped (home, gz) | ≤ 15 KB |
| Hero image (mobile) | ≤ 60 KB AVIF |
| Web fonts | ≤ 2 families, subset, preload |

Enforcement:
- Lighthouse CI on every preview deploy (GitHub Actions or Vercel checks).
- `next-bundle-analyzer` snapshot on main; PR fails if home JS > 100 KB gz.
- Cache Components (Next 16) on every static surface; `use cache` + `cacheLife("hours")` on Lab Note pages; `cacheTag("lab")` for revalidation.
- Images: `next/image` with `priority` on LCP image only; `sizes` attribute on every responsive image.
- Fonts: `next/font` `display: swap`; only weights actually used (400, 500, 600 — no 300 or 800 in v1).
- No client-side state libraries (no Redux/Zustand). Audit bot uses `useReducer`.

---

## 11. SEO & Metadata

- **Title pattern**: `{Page} — Abdul Wahab`. Home: `Abdul Wahab — AI Workflow Consultant & Technical Educator`.
- **Description**: max 155 chars per page. Locked copy for home: `"I help businesses turn repetitive work into AI workflows. Workflow automation, agentic systems, and team training for real operations."`
- **Canonical**: every page sets `alternates.canonical`.
- **`Person` schema** on `/about` with `jobTitle`, `worksFor`, `sameAs` (LinkedIn, GitHub, X).
- **`Article` schema** on Lab Notes.
- **`Service` schema** for each tier on `/services`.
- **OG images**: dynamic via `@vercel/og` per route — Apple-keynote treatment (Fraunces title, hairline, accent dot).
- **Sitemap**: auto via `next-sitemap` or Next 16 `sitemap.ts`.
- **Robots**: allow all; disallow `/api/*`.
- **Submit to Google Search Console** in week-3 launch step.

---

## 12. Analytics & Events

Plausible + Vercel Analytics. Track these custom events (no PII):

| Event | Trigger |
|---|---|
| `cta_book_call` | Any "Book a call" button click |
| `cta_workshop_inquiry` | Workshop form submit |
| `cta_contact_submit` | Contact form submit |
| `audit_start` | Audit bot question 1 rendered |
| `audit_complete` | Audit bot hypothesis rendered |
| `audit_email_capture` | PDF email submit |
| `case_study_view_{slug}` | Case study page view |
| `lab_note_view_{slug}` | Lab Note view |
| `lab_subscribe` | Subscribe form submit |
| `theme_toggle` | Theme changed (light/dark/system) |

No third-party trackers beyond Plausible + Vercel. No Hotjar / FullStory in v1.

---

## 13. Engineering Conventions

### 13.1 Repo layout
```
app/
  (marketing)/
    page.tsx                   # Home
    work/page.tsx
    work/[slug]/page.tsx
    services/page.tsx
    workshops/page.tsx
    about/page.tsx
    contact/page.tsx
  (lab)/
    lab/page.tsx
    lab/[slug]/page.tsx
    lab/audit/page.tsx
  api/
    contact/route.ts
    audit/stream/route.ts      # Edge
  layout.tsx
  globals.css
components/
  ui/                          # shadcn-managed
  brand/                       # custom (Navbar, Footer, Hero, etc.)
  case-study/
  lab/
content/                       # MDX
lib/
  content/schemas.ts
  audit/prompt.ts
  email/resend.ts
  analytics/track.ts
  seo/metadata.ts
  cache/tags.ts
public/
  diagrams/
  fonts/
  images/
styles/
  tokens.css
  prose.css
tests/
  e2e/                         # Playwright
vercel.ts
```

### 13.2 Coding standards
- Server Components by default. Reach for `"use client"` only when an interaction or browser API requires it.
- Server Actions for forms; never expose endpoints unless needed.
- One component per file; default-export the component, named-export types.
- Tailwind class order via `prettier-plugin-tailwindcss`.
- No barrel files (`index.ts` re-exports) outside `components/ui`.
- ESLint: `next/core-web-vitals`, `@typescript-eslint/strict`, `tailwindcss`, `simple-import-sort`.
- Prettier with 100-col width, single quotes, trailing commas.

### 13.3 Env vars
```
# Build
NEXT_PUBLIC_SITE_URL=https://abdulwahabai.com

# Email
RESEND_API_KEY=
CONTACT_INBOX=hello@abdulwahabai.com
CONTACT_FROM=Abdul Wahab <hello@abdulwahabai.com>

# AI
AI_GATEWAY_API_KEY=
AUDIT_MODEL=anthropic/claude-sonnet-4-6

# Rate limit (Vercel KV)
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=abdulwahabai.com

# Booking
NEXT_PUBLIC_CAL_USERNAME=abdulwahab
```

All public env vars `NEXT_PUBLIC_` prefixed. Secrets only in Vercel project env (never committed).

### 13.4 Git workflow
- Trunk-based; PRs into `main`; preview deploys per branch.
- Conventional commits.
- One required check: `vercel build` green + Lighthouse score ≥ 90 mobile.

---

## 14. Roadmap (3-week build)

### Week 1 — Foundation
- Day 1: `pnpm create next-app`, Tailwind v4, shadcn init, tokens.css, layout, fonts, base Navbar/Footer.
- Day 2: design-system component pass (Button, Card, Pill, Form, Dialog).
- Day 3: Home page (static, placeholder case studies + Lab Notes).
- Day 4: `/work` index + case-study template + 1 case study (MeetPlanner) wired through MDX schema.
- Day 5: Remaining 2 case studies. Diagrams in Excalidraw → SVG.

### Week 2 — Content & service surfaces
- Day 6: `/services` segmented control + content.
- Day 7: `/workshops` with topics accordion + inquiry form.
- Day 8: `/about` page including Urdu video upload to Mux + captions.
- Day 9: `/lab` index + 2 seed Lab Notes (drafts).
- Day 10: `/contact` page with Cal.com embed + form + Resend integration.

### Week 3 — Interactive demo, polish, launch
- Day 11: Workflow Audit Bot — UI + streaming route + system prompt + cache.
- Day 12: Audit Bot — PDF rendering + email capture + rate limit + telemetry.
- Day 13: SEO pass (OG images, schema, sitemap), accessibility pass (axe, VoiceOver).
- Day 14: Performance pass (Lighthouse, bundle analyzer, image audit).
- Day 15: Final content + content freeze + production cutover. Submit to Search Console.

Buffer days are baked into each week (assume 6 working days/week available, not 7).

---

## 15. Open Questions (blockers if unresolved by Day 1)

1. **Domain** — confirm `abdulwahabai.com` (recommended) vs `.ai` vs `.com`. Drives DNS, Resend setup, and email aliases.
2. **Pricing visibility** — show "Audit — starting from $1,500" on `/services` or gate it behind a discovery call? Default: **show** (filters tire-kickers, per `my-suggestions.md`). Confirm.
3. **Testimonials at launch** — even one operator quote from MeetPlanner or Printing Press changes the trust profile materially. Available?
4. **First public engagement listed on `/workshops` at launch** — even a small community talk. Available?
5. **Video greeting** — record the 30–45 s Urdu greeting before Day 8 (recording, captions, Mux upload). Plan?
6. **Mux vs. Cloudflare Stream** — Mux has the cleanest player and a free tier; Cloudflare Stream is cheaper at scale. Default Mux for v1.
7. **`contentlayer2` vs. `next-mdx-remote`** — contentlayer2 has had Next 16 compatibility issues recently. If it doesn't compile cleanly Day 1, fall back to `next-mdx-remote` without delay.

---

## 16. Definition of Done (per page)

A page ships only when **all** are true:
- [ ] Passes the One-Question Test (`my-suggestions.md §15`).
- [ ] Lighthouse mobile: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO = 100.
- [ ] axe-core: zero violations.
- [ ] `:focus-visible` on every interactive.
- [ ] `prefers-reduced-motion` honored.
- [ ] OG image renders correctly when shared on LinkedIn + iMessage.
- [ ] Mobile (375 px) and desktop (1280 px) reviewed in browser.
- [ ] No console errors or warnings.
- [ ] No `console.log` left in client code.
- [ ] CTA copy reviewed; no banned phrases (`my-suggestions.md §13`).

---

## 17. Definition of Done (project-level v1)

- [ ] All 9 pages live at `abdulwahabai.com`.
- [ ] Workflow Audit Bot working end-to-end, PDF arriving in test inbox.
- [ ] Cal.com booking confirmed in test booking.
- [ ] Contact form arriving in `CONTACT_INBOX` with auto-reply to sender.
- [ ] Plausible receiving events for the 10 custom events listed in §12.
- [ ] Submitted to Google Search Console; sitemap accepted.
- [ ] No "powered by" branding from third parties visible in chrome.
- [ ] README documents env, build, content authoring, and deploy.
- [ ] Owner can publish a new Lab Note by adding an MDX file and pushing (no manual rebuild).

---

---

## 18. V2 — Extended Scope

> V2 begins Month 2 post-launch, gated on v1 90-day metrics being on-track (≥ 4 discovery calls/month, ≥ 25 audit bot completions). If metrics are off, fix conversion before adding features.

### 18.1 V2 Scope

**Analytics**
- GA4 via `@next/third-parties/google` alongside existing Plausible + Vercel Analytics. All three serve different purposes: Plausible for privacy-first content/SEO, Vercel for Web Vitals, GA4 for funnel analysis and campaign attribution.

**Analytics Dashboard** (`/dashboard`, auth-gated)
- Panels: Cal.com API → bookings + pipeline; custom events → audit bot starts/completions/email captures; Plausible + GA4 Data API → top pages + referrers; Resend API → subscriber count + open rate; content panel → Lab Note count + last published.
- Refresh: manual pull on page load. No real-time in v2.

**Admin Panel + CMS** (Payload CMS, `/admin`)
- Payload CMS runs inside the same Next.js app (`/admin` route group).
- Replaces MDX-in-repo for day-to-day content management.
- Auth: Payload built-in email + password. Single admin user. No public-facing auth.
- Media: Vercel Blob via Payload storage adapter.
- Database: Neon Postgres (provisioned via Vercel Marketplace).

**Urdu content layer**
- `/ur/blog` and `/ur/blog/[slug]` — content layer only, not full UI translation.
- Urdu Lab Notes authored in Payload with locale field (`en` / `ur`).
- Stub `/ur` link already in v1 footer; expands to a landing page if data shows demand (v3).

**Lead generation upgrades**
- Lead magnet PDF: "30 Workflows AI Can Automate Today" — gated behind email, generated server-side via `@react-pdf/renderer`.
- Newsletter double opt-in via Resend (replaces v1 single-field subscribe).
- Video case study walkthroughs — 2–3 min Loom-style recordings embedded per case study.
- Private/gated technical appendices — email-gated deep-dive per case study for buyers in due diligence.
- Post-workshop resource portal — password-protected page per cohort (slides, templates, recordings).

**Second Lab demo**
- ROI calculator: "How many hours/week does your team lose to [task]?" → automation opportunity score → book audit CTA. Serves Operators; better lead qualifier than any form.
- Alternate: workflow diagram generator (describe process in text → Mermaid/SVG diagram). Decision deferred to v2 kickoff based on v1 audit bot usage patterns.

**Authority + discovery**
- Pagefind static search for Lab Notes (zero JS overhead, builds with the site).
- Speaking calendar on `/workshops` — upcoming dates listed; even one entry changes trust profile.
- Testimonials carousel once 3+ real quotes exist; single pull-quote if fewer.
- Lab Notes series format — named multi-part series for SEO clustering (e.g., "Agentic Systems from Scratch, Part 1–5").
- RSS feed (`/lab/feed.xml`) + automated email digest via Resend when a new Lab Note publishes.
- Dynamic OG images per Lab Note (already in v1 for `/og/[type]`; extend to per-slug generation).

### 18.2 V2 Tech Stack Additions

| Layer | Addition | Notes |
|---|---|---|
| CMS + Admin | **Payload CMS** | Next.js-native; ships inside the same app at `/admin`; Lexical rich-text editor; handles auth, media, and typed collections |
| Database | **Neon Postgres** (Vercel Marketplace) | Payload manages schema; replaces MDX flat-files as content store |
| Media | **Vercel Blob** | Payload storage adapter; image uploads from `/admin` |
| Auth | Payload built-in | Email + password for `/admin` and `/dashboard`; no Clerk/NextAuth needed |
| Analytics | **GA4** via `@next/third-parties/google` | Funnel analysis + campaign attribution; one script tag in root layout; measurement ID via `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| Search | **Pagefind** | Static full-text search over Lab Notes; CLI runs post-build; zero runtime overhead |
| PDF | **`@react-pdf/renderer`** | Lead magnet PDF + audit bot one-pager (already used in v1 audit flow) |

### 18.3 V2 Information Architecture Additions

```
/dashboard              Internal analytics panel (Payload auth-gated)
/admin                  Payload CMS admin UI (Payload auth-gated)
/ur                     Urdu landing page (stub → expanded)
/ur/blog                Urdu Lab Notes index
/ur/blog/[slug]         Individual Urdu Lab Note
/lab/[second-demo]      Second AI tool (ROI calculator or diagram generator — TBD)
/lab/feed.xml           RSS feed for Lab Notes
/workshops/[slug]       Individual workshop detail + registration (if needed)
```

### 18.4 Payload CMS — Collection Contracts

| Collection | Key fields | Notes |
|---|---|---|
| `Project` | `title`, `slug`, `eyebrow`, `summary`, `metrics[]`, `heroDiagram`, `stack[]`, `testimonial`, `order`, `videoWalkthrough` | Replaces `content/case-studies/*.mdx` |
| `LabNote` | `title`, `slug`, `date`, `summary`, `category`, `series`, `seriesPart`, `locale` (`en`/`ur`), `body` (Lexical) | Supports Urdu Lab Notes via locale field |
| `Workshop` | `format`, `title`, `description`, `topics[]`, `pastEngagements[]`, `outcomes[]`, `upcomingDates[]` | Powers `/workshops` accordion + speaking calendar |
| `Testimonial` | `quote`, `author`, `role`, `org`, `project` (relation to `Project`) | Referenced on home + case studies |
| `LeadCapture` | `email`, `name`, `source`, `auditTranscript`, `createdAt` | Write-only from audit bot; read in dashboard |

### 18.5 V2 Env Vars

```
# GA4
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Payload CMS + Neon
DATABASE_URI=          # Neon Postgres connection string
PAYLOAD_SECRET=        # JWT secret for Payload sessions

# Vercel Blob (media)
BLOB_READ_WRITE_TOKEN=
```

### 18.6 V2 Roadmap

**Phase 1 — Analytics (Week 1 of v2)**
- Wire GA4 via `@next/third-parties/google`; add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to Vercel env.
- Build `/dashboard` — static page, pulls from Cal.com + Plausible + Resend APIs at request time; Payload auth gate.
- Extend §12 custom events to also fire `gtag` calls for GA4 goal tracking.

**Phase 2 — Payload + Neon migration (Weeks 2–3 of v2)**
- Add Payload CMS to existing Next.js app; configure `/admin` route group.
- Provision Neon Postgres via Vercel Marketplace; set `DATABASE_URI`.
- Define collections (§19.4). Wire Vercel Blob as media adapter.
- Migrate existing MDX content into Payload admin.
- Update page data fetches to query Payload Local API instead of `contentlayer`.

**Phase 3 — Content features (Week 4 of v2)**
- Urdu blog: add `locale` field to `LabNote`; build `/ur/blog` routes.
- RSS feed at `/lab/feed.xml`.
- Newsletter double opt-in via Resend; lead magnet PDF via `@react-pdf/renderer`.
- Lab Notes series format: series title + part number in `LabNote` collection; series index UI on `/lab`.

**Phase 4 — Lead gen + authority (Week 5 of v2)**
- Second Lab demo (ROI calculator — decision at v2 kickoff).
- Pagefind: add post-build CLI step; wire search UI on `/lab`.
- Speaking calendar: `upcomingDates[]` on `Workshop` collection; render on `/workshops`.
- Video walkthroughs: embed field on `Project` collection.
- Testimonials carousel (if 3+ quotes in Payload by this point).

---

## 19. Decisions Log

| Date | Decision | Source |
|---|---|---|
| 2026-05-12 | Lock Apple HIG–inspired light editorial design system | this spec §5 |
| 2026-05-12 | Brand accent: forest green `#15573D` | `my-suggestions.md §2.4` |
| 2026-05-12 | Site UI English-only at v1; Urdu greeting video on About | `my-suggestions.md §2.5` |
| 2026-05-12 | Three audiences: Operators / Teams / Communities | `my-suggestions.md §3` |
| 2026-05-12 | Three case studies cap: MeetPlanner / Marketing Dash / Printing Press | `my-suggestions.md TL;DR` |
| 2026-05-12 | Tech stack: Next 16 + Tailwind v4 + shadcn + Vercel AI SDK v6 + AI Gateway + Resend + Cal.com + Plausible | this spec §3 |
| 2026-05-12 | Workflow Audit Bot at `/lab/audit` is the singular lead-magnet for v1 | `my-suggestions.md §6, §9` |
| 2026-05-12 | Pricing: show "Audit starting from $1,500"; Build/Workshop = custom | this spec §7.4 (pending owner confirm) |
| 2026-05-14 | V2 CMS: Payload CMS (Next.js-native, runs in same app) over Sanity or Keystatic | conversation 2026-05-14; §19.2 |
| 2026-05-14 | V2 database: Neon Postgres via Vercel Marketplace | conversation 2026-05-14; §19.2 |
| 2026-05-14 | V2 media: Vercel Blob via Payload storage adapter | conversation 2026-05-14; §19.2 |
| 2026-05-14 | V2 analytics: add GA4 alongside Plausible + Vercel Analytics (all three serve distinct purposes) | conversation 2026-05-14; §19.1 |
| 2026-05-14 | V2 second Lab demo: ROI calculator (preferred) or diagram generator — decide at v2 kickoff | conversation 2026-05-14; §19.1 |
| 2026-05-14 | V2 search: Pagefind (static, zero runtime cost) over Algolia or custom | conversation 2026-05-14; §19.2 |
| 2026-05-14 | V2 gated by v1 90-day metrics — fix conversion before adding features | conversation 2026-05-14; §19 |

---

*End of spec. Edits land via PR with a one-line entry in §19 Decisions Log.*
