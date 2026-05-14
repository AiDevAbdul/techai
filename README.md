# techai.pk — Abdul Wahab Portfolio

Lead-gen portfolio for an AI workflow consultant. Three audiences: Operators, Teams, Communities. Every page ends in a book-a-call, workshop inquiry, or email capture.

Live: **techai.pk** · Stack: Next.js 16 · Tailwind v4 · shadcn/ui · AI SDK v6 · Vercel

---

## Local development

**Prerequisites:** Node 22–24, npm.

```bash
# 1. Install dependencies
npm install

# 2. Copy env vars and fill in values (see Env vars section below)
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site degrades gracefully when env vars are missing — Resend emails log to console, Cal.com embed shows a placeholder card, the Audit Bot returns a friendly error.

---

## Build & deploy

```bash
# Production build (local verification)
npm run build
npm run start

# Bundle size analysis
npm run analyze

# Type check only
npm run typecheck
```

**Deploy to Vercel:** push to `main`. Vercel auto-detects Next.js 16 and builds with the project's `next.config.ts`. Preview deploys are created for every branch.

**Production promotion:** merge to `main` → Vercel deploys automatically. No manual promotion step required.

---

## Env vars

Copy `.env.example` → `.env.local` and fill in each value. Required for full functionality:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical base URL (`https://techai.pk`) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Yes | Plausible site domain (`techai.pk`) |
| `NEXT_PUBLIC_CAL_LINK` | Yes | Cal.com booking slug (`abdulwahab/30min`) |
| `RESEND_API_KEY` | Yes (email) | Transactional email via Resend |
| `RESEND_FROM_ADDRESS` | Yes (email) | Verified sending address (`hello@techai.pk`) |
| `CONTACT_INBOX` | Yes (email) | Destination for contact form submissions |
| `AUDIT_INBOX` | Yes (email) | Destination for audit bot transcripts |
| `WORKSHOP_INBOX` | Yes (email) | Destination for workshop inquiries |
| `LAB_INBOX` | Yes (email) | Destination for Lab Notes subscribe |
| `UPSTASH_REDIS_REST_URL` | Yes (rate limit) | Upstash Redis URL for audit bot rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Yes (rate limit) | Upstash Redis token |
| `ANTHROPIC_API_KEY` | Yes (AI) | Anthropic API key for the Audit Bot |
| `NEXT_PUBLIC_MUX_PLAYBACK_ID` | Optional | Mux playback ID for Urdu video on `/about` |
| `HCAPTCHA_SECRET` | Optional | hCaptcha server-side secret (workshop form) |
| `ANALYZE` | Dev only | Set `true` to open bundle analyzer |

All secrets live in Vercel project settings (Environment Variables tab) — never committed to the repo.

---

## Content authoring

### Publish a Lab Note

1. Create `content/lab/your-note-slug.mdx` with this frontmatter:

```mdx
---
slug: your-note-slug
title: "Your Note Title"
date: "2026-06-01"
summary: "One sentence — what the reader learns."
category: "Workflow Design"
readingTime: 5
---

Your MDX content here. Supports headings, code blocks, and inline formatting.
```

2. Push to `main`. Vercel rebuilds and the note appears on `/lab` automatically. No manual rebuild or CMS action needed.

**Available categories:** `Workflow Design`, `Prompt Engineering`, `Agentic Systems`, `Case Study`, `Tools`.

**Code blocks** — use fenced code blocks with a language tag. The custom `CodeBlock` component renders them with a copy button and JetBrains Mono:

````mdx
```python
def my_function():
    pass
```
````

### Edit a case study

Case studies live in `content/case-studies/`. Edit the MDX file and push. Key frontmatter fields:

```yaml
metrics:
  - { value: "70%", label: "less scheduling friction" }
heroDiagram: "/diagrams/meetplanner-architecture.svg"
stack: ["Next.js", "Postgres", "OpenAI"]
```

Diagrams are authored in Excalidraw (`.excalidraw` sources in `public/diagrams/`) and exported as SVG.

### Edit services content

Services content lives in `content/services/audit.mdx`, `build.mdx`, `workshop.mdx`, `speaking.mdx`. Edit and push.

### Edit workshop topics / past engagements

- Topics accordion: `content/workshops/topics.mdx`
- Past engagements: `content/workshops/past-engagements.mdx`

---

## Architecture

```
app/
  (marketing)/          # Public marketing pages (Home, Work, Services, etc.)
  (lab)/                # Lab pages (Lab index, Lab Notes, Audit Bot)
  api/
    audit/stream/       # POST — Audit Bot streaming (Fluid Compute)
    audit/email/        # POST — Audit Bot PDF + email send
  og/[type]/            # Dynamic OG image generation
  layout.tsx            # Root layout (fonts, Plausible, Vercel Analytics)
components/
  brand/                # Navbar, Footer, CalEmbed, UrduGreeting, etc.
  ui/                   # shadcn/ui components (customized to design tokens)
  audit/                # AuditBot client component
  forms/                # ContactForm, WorkshopInquiryForm
  lab/                  # CodeBlock, SubscribeForm
content/
  case-studies/         # MDX case studies (3)
  lab/                  # MDX Lab Notes
  services/             # MDX service tier content
  workshops/            # MDX topics + past engagements
lib/
  audit/                # Rate limiting, PDF render, types, system prompt
  content/              # MDX loaders + Zod schemas
  email/                # Resend helper
styles/
  tokens.css            # Design system tokens (colors, type, spacing, motion)
public/
  diagrams/             # Workflow architecture SVGs (exported from Excalidraw)
```

**Key decisions:**
- Server Components by default; `"use client"` only where browser APIs are required.
- MDX parsed via `next-mdx-remote` + `gray-matter`; validated with Zod at build time.
- Audit Bot uses `streamText` from AI SDK v6 with the Anthropic provider.
- Rate limiting via `@upstash/redis` (fixed window, 10 starts / IP / hour).
- PDF rendered server-side via `@react-pdf/renderer` and emailed via Resend.
- Analytics: Plausible (custom events) + Vercel Analytics (Web Vitals).

---

## Design system

Design language: Apple HIG–inspired light editorial. Details in `docs/spec.md §5`.

- **Colors:** `styles/tokens.css` — forest green accent (`#15573D`), warm white surface (`#FBFBFD`).
- **Fonts:** Fraunces (display/serif — hero H1 and case study titles only) + JetBrains Mono (code).
- **Type scale:** Apple Marketing scale (12–88px). All sizes in `styles/tokens.css`.
- **Motion:** 180–360ms, iOS easing curves, `prefers-reduced-motion` respected globally.

**Hard no list** (spec §1.3): typing animations, particle backgrounds, AI stock imagery, spinning 3D, "Available for hire" badges, dark + neon accents, "Let's build something amazing" CTAs.

---

## Performance targets (mobile, p75)

| Metric | Target |
|---|---|
| LCP | ≤ 1.8 s |
| Total JS (home, gz) | ≤ 90 KB |
| Total CSS (home, gz) | ≤ 15 KB |
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse SEO | 100 |

Enforcement: `npm run analyze` for bundle size, Vercel Speed Insights for field data.
