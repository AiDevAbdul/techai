/*
 * llms.txt — plain-text primer for AI agents/crawlers (spec §11 follow-up).
 * See https://llmstxt.org for the emerging convention.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdulwahabai.com";

function buildLlmsTxt(): string {
  return `# Abdul Wahab

AI workflow consultant and technical educator. Builds routed, observable AI
systems for operators, and teaches — free video courses, live sessions, and
paid training — the people who run them. Three audiences: Operators, Teams,
and Communities.

## Pages

- [Home](${SITE_URL}/)
- [Work (case studies)](${SITE_URL}/work)
- [Services (audit, build, workshop, speaking)](${SITE_URL}/services)
- [Mentorship & training (1:1 roadmaps, team training, talks — PKR pricing)](${SITE_URL}/mentorship)
- [Workshops & speaking](${SITE_URL}/workshops)
- [Learn (free video courses, lesson by lesson, plus live and recorded sessions): "Free Social Media Management Course with AI" and "AI Driven Development with Claude Code" — both available; "Agentic AI" coming soon](${SITE_URL}/learn)
- [Lab (field notes)](${SITE_URL}/lab)
- [Workflow audit demo (streaming AI teardown of a described workflow)](${SITE_URL}/lab/audit)
- [About](${SITE_URL}/about)
- [Contact](${SITE_URL}/contact)
- [اردو / Urdu landing page](${SITE_URL}/ur)

## Contact

Email: [info@abdulwahabai.com](mailto:info@abdulwahabai.com)
`;
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
