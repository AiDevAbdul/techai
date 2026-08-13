/*
 * llms.txt — plain-text primer for AI agents/crawlers (spec §11 follow-up).
 * See https://llmstxt.org for the emerging convention.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abdulwahabai.com";

function buildLlmsTxt(): string {
  return `# Abdul Wahab

AI workflow consultant and technical educator. Builds routed, observable AI
systems for operators and teaches the teams that run them. Three audiences:
Operators, Teams, and Communities.

## Pages

- [Home](${SITE_URL}/)
- [Work (case studies)](${SITE_URL}/work)
- [Services (audit, build, workshop, speaking)](${SITE_URL}/services)
- [Mentorship & training (1:1 roadmaps, team training, talks — PKR pricing)](${SITE_URL}/mentorship)
- [Workshops & speaking](${SITE_URL}/workshops)
- [Lab (field notes)](${SITE_URL}/lab)
- [About](${SITE_URL}/about)
- [Contact](${SITE_URL}/contact)

## Contact

Email: [aidevabdul@gmail.com](mailto:aidevabdul@gmail.com)
`;
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
