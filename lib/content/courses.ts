import { getPlaylistLessons } from "./youtube";

export type Lesson = {
  slug: string;
  number: number;
  title: string;
  videoId: string;
  duration: string;
  description: string;
};

export type Course = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  audience: string;
  playlistId: string;
  status: "available" | "in-progress" | "coming-soon";
  lessons: Lesson[];
};

type CourseMeta = Omit<Course, "lessons"> & { staticLessons: Lesson[] };

const SMM_LESSONS: Lesson[] = [
  { slug: "a6OXVHcIyXo", number: 1, title: "Introduction to Social Media Management", videoId: "a6OXVHcIyXo", duration: "33 min", description: "A beginner's map of social media management as a discipline — what the job actually involves day to day, and what you'll be able to do by the end of this course." },
  { slug: "sS3E-0kmTEM", number: 2, title: "Content Creation With AI for SMM", videoId: "sS3E-0kmTEM", duration: "40 min", description: "How to use AI tools to plan, draft, and produce social content faster without losing the client's voice — practical prompting and workflow for SMM work." },
  { slug: "yqUU77OphME", number: 3, title: "How to Create and Optimize Your Facebook Business Page", videoId: "yqUU77OphME", duration: "40 min", description: "Setting up a Facebook Business Page correctly from scratch — profile, info, and structure choices that affect discoverability and trust." },
  { slug: "UFdV4gNA4Ek", number: 4, title: "Facebook Page Creation and Optimization", videoId: "UFdV4gNA4Ek", duration: "35 min", description: "Going deeper on Page optimization — categories, CTAs, and settings that most beginners get wrong when managing a client's Facebook presence." },
  { slug: "HEF8w-JOr0s", number: 5, title: "Post Scheduling with Meta Business Suite", videoId: "HEF8w-JOr0s", duration: "40 min", description: "Using Meta Business Suite to plan and schedule posts across Facebook and Instagram, and building a repeatable weekly scheduling workflow." },
  { slug: "j96Aj-Bnb4I", number: 6, title: "What is Social Media Management Strategy", videoId: "j96Aj-Bnb4I", duration: "40 min", description: "How to build an actual strategy behind the posting — goals, audience, and content pillars — instead of publishing without a plan." },
  { slug: "d2NROV5g79o", number: 7, title: "Social Media Audit Template and Client Approach", videoId: "d2NROV5g79o", duration: "39 min", description: "A practical audit template for reviewing a business's existing social presence, and how to walk a prospective client through the findings." },
  { slug: "kcVuMLQ6ycI", number: 8, title: "How to Create Social Media Reports", videoId: "kcVuMLQ6ycI", duration: "30 min", description: "Building client-ready performance reports that show real impact — what metrics matter, and how to present them clearly." },
  { slug: "woD24LRyW-E", number: 9, title: "How to Find and Deal with Clients", videoId: "woD24LRyW-E", duration: "40 min", description: "Where to find your first social media management clients, how to pitch the work, and how to manage the relationship once you land it." },
];

const AI_DEV_LESSONS: Lesson[] = [
  { slug: "dwzgX2dT338", number: 1, title: "Claude Code For Free — Setup for Everyone", videoId: "dwzgX2dT338", duration: "1 hr 21 min", description: "A full setup walkthrough for Claude Code, including the free-tier path, so anyone can get an agentic coding workflow running from zero." },
  { slug: "eWbKRVN9wYQ", number: 2, title: "Claude Code Init Command — Documenting Your Project with CLAUDE.md", videoId: "eWbKRVN9wYQ", duration: "8 min", description: "How the /init command generates a CLAUDE.md file, and why documenting your project this way makes Claude Code dramatically more useful." },
  { slug: "jnm_nA-Gq7s", number: 3, title: "Compact, Clear, Context — Controlling Claude's Limit", videoId: "jnm_nA-Gq7s", duration: "14 min", description: "How context windows work in practice, why they run out, and techniques for keeping a long Claude Code session compact and effective." },
  { slug: "st0IPgMZ6OY", number: 4, title: "Claude.md Deep Dive: Build Your Perfect Knowledge System", videoId: "st0IPgMZ6OY", duration: "17 min", description: "A deeper look at structuring CLAUDE.md as a knowledge system — what to include, what to leave out, and how it shapes agent behavior." },
  { slug: "t6XxPJXupxY", number: 5, title: "What Are General Agents? Use of Claude Code", videoId: "t6XxPJXupxY", duration: "21 min", description: "An introduction to general-purpose agents inside Claude Code — what they're for and when to reach for one instead of doing it yourself." },
  { slug: "oO_GkA7gXdw", number: 6, title: "What is Digital FTE? Building Digital Employees with Agentic AI", videoId: "oO_GkA7gXdw", duration: "3 min", description: "The idea of a 'Digital FTE' — using agentic AI to take on ongoing work the way a full-time employee would, and what that looks like in practice." },
  { slug: "UQTpRNNxRSY", number: 7, title: "Gemini CLI in VSCode — Basics (Part 1)", videoId: "UQTpRNNxRSY", duration: "21 min", description: "Getting started with the Gemini CLI inside VSCode — installation, first commands, and the basics of the workflow." },
  { slug: "OCqwOaqRPr4", number: 8, title: "Gemini CLI in VSCode — Basics (Part 2)", videoId: "OCqwOaqRPr4", duration: "21 min", description: "Continuing the Gemini CLI walkthrough with more everyday commands and patterns for working inside VSCode." },
  { slug: "kcePd73sFxw", number: 9, title: "Prompt Engineering Fundamentals: Tokens, Structure, Results", videoId: "kcePd73sFxw", duration: "25 min", description: "Core prompt-engineering fundamentals — how tokens and structure affect output quality, and how to write prompts that get reliable results." },
  { slug: "8ORHBOv1Bcc", number: 10, title: "Claude's Persistent Memory: The Game-Changer Nobody's Talking About", videoId: "8ORHBOv1Bcc", duration: "26 min", description: "How Claude's persistent memory works, why it matters for long-running projects, and how to put it to use." },
  { slug: "1EjUZELHjVM", number: 11, title: "Teach Claude New Skills: Step-by-Step Guide to Agent Skills", videoId: "1EjUZELHjVM", duration: "34 min", description: "A step-by-step guide to building custom Agent Skills for Claude, so you can teach it new, repeatable capabilities." },
  { slug: "dUBK1Z5zF4k", number: 12, title: "Mastering Claude AI Skills: MCP Subagents and skill.md", videoId: "dUBK1Z5zF4k", duration: "36 min", description: "Going further into Claude AI skills — how MCP subagents and skill.md files fit together to extend what Claude Code can do." },
];

const COURSE_META: CourseMeta[] = [
  {
    slug: "social-media-management",
    title: "Social Media Management",
    subtitle: "For beginners and small business owners",
    description:
      "Learn social media management from scratch — content creation with AI, Facebook page setup, scheduling, audits, reporting, and landing your first clients.",
    audience: "Operators",
    playlistId: "PLYyJgoGsSKNsHeIMRps-qVuWRy0oms_Pc",
    status: "available",
    staticLessons: SMM_LESSONS,
  },
  {
    slug: "ai-driven-development",
    title: "AI Driven Development with Claude Code",
    subtitle: "Vibe coding, agentic workflows, and building with AI",
    description:
      "Master Claude Code from first setup to advanced agentic techniques — CLAUDE.md, persistent memory, skills, MCP subagents, Gemini CLI, and prompt engineering. New lessons added every week.",
    audience: "Teams",
    playlistId: "PLYyJgoGsSKNul4KN8mPiaYgGXQQIGDr_E",
    status: "in-progress",
    staticLessons: AI_DEV_LESSONS,
  },
  {
    slug: "agentic-ai",
    title: "Agentic AI",
    subtitle: "Build autonomous AI workflows from scratch",
    description:
      "A complete course on building agentic AI systems — from fundamentals to production multi-agent orchestration. Coming soon.",
    audience: "Communities",
    playlistId: "",
    status: "coming-soon",
    staticLessons: [],
  },
];

async function withLessons(meta: CourseMeta): Promise<Course> {
  const { staticLessons, ...rest } = meta;
  if (meta.status === "coming-soon" || !meta.playlistId) {
    return { ...rest, lessons: [] };
  }
  const live = await getPlaylistLessons(meta.playlistId);
  return { ...rest, lessons: live.length > 0 ? live : staticLessons };
}

export function getAllCourseMeta(): Omit<CourseMeta, "staticLessons">[] {
  return COURSE_META.map(({ staticLessons: _s, ...rest }) => rest);
}

export async function getAllCourses(): Promise<Course[]> {
  return Promise.all(COURSE_META.map(withLessons));
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const meta = COURSE_META.find((c) => c.slug === slug);
  if (!meta) return null;
  return withLessons(meta);
}

export async function getLessonBySlug(
  courseSlug: string,
  lessonSlug: string,
): Promise<{ course: Course; lesson: Lesson; index: number } | null> {
  const course = await getCourseBySlug(courseSlug);
  if (!course) return null;
  const index = course.lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return null;
  const lesson = course.lessons[index];
  if (!lesson) return null;
  return { course, lesson, index };
}

export async function getCourseSlugs(): Promise<string[]> {
  return COURSE_META.filter((c) => c.status !== "coming-soon").map(
    (c) => c.slug,
  );
}

export async function getLessonSlugs(courseSlug: string): Promise<string[]> {
  const course = await getCourseBySlug(courseSlug);
  if (!course) return [];
  return course.lessons.map((l) => l.slug);
}
