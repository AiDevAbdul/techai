# abdulwahabai.com — Abdul Wahab Portfolio

Lead-gen portfolio site. Three audiences: Operators, Teams, Communities. Every page ends in book-a-call, request-a-workshop, or email capture.

- **Domain:** abdulwahabai.com · **Kickoff:** 2026-05-12 · **Target launch:** 2026-06-02 (3 weeks)
- **Stack:** Next.js 16 (App Router, TS strict), Tailwind v4, shadcn/ui, AI SDK v6, Vercel (AI Gateway + KV), Resend, Cal.com, Plausible, Contentlayer2 + MDX
- **Scope v1:** 10 pages (Home, Work, 3 Case Studies, Services, Mentorship, Workshops, Lab, About, Contact) + 1 streaming AI demo at `/lab/audit` + 2 Lab Notes
- **Design:** Apple HIG–inspired light editorial. Fraunces + JetBrains Mono. No dark+neon, no particles, no 3D, no typing animations. Restrained motion, hairline structure, continuous corner curves.

## Working docs (`docs/`)

- [`docs/spec.md`](docs/spec.md) — **build contract.** Design system, component contracts, page specs, engineering plan. Source of truth for what to build.
- [`docs/plan.md`](docs/plan.md) — **order of operations.** Day-by-day execution plan, domain reconciliation (`techai.pk` → `abdulwahabai.com`), decision gates.
- [`docs/tasks.md`](docs/tasks.md) — **17-task breakdown** from Day 0 pre-flight through §8 DoD launch gate. Update task status as work lands.
- [`docs/my-suggestions.md`](docs/my-suggestions.md) — strategy rationale (positioning, IA, conversion model). Read for *why*, not *what*.

## House rules

- The spec is the contract. If code and spec disagree, fix the code or amend the spec — never silently diverge.
- English-only UI in v1. Urdu video greeting on `/about` is the only Urdu surface. Full Urdu UI is v2.
- Three case studies is the cap (MeetPlanner, Marketing Dashboard, Printing Press). Do not add a fourth.
- Owner email: `aidevabdul@gmail.com`.

## Next.js 16 — read before touching framework code

@AGENTS.md
