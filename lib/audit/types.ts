/*
 * Shared types for the /lab/audit flow. Used by both the client UI and the
 * /api/audit/stream + /api/audit/email routes.
 */

export type AuditRole = "user" | "assistant";

export type AuditMessage = {
  role: AuditRole;
  content: string;
};

export const AUDIT_QUESTIONS = [
  {
    id: "industry",
    label: "What's your business or industry?",
    placeholder: "e.g. B2B marketing agency, manufacturing, education",
  },
  {
    id: "workflow",
    label: "What's the most repetitive workflow your team runs?",
    placeholder: "The thing that bleeds time every week.",
  },
  {
    id: "owner",
    label: "Who runs it today, and how often?",
    placeholder: "e.g. 2 ops people, ~10 hrs/week each",
  },
  {
    id: "tools",
    label: "What tools touch this workflow?",
    placeholder: "Slack, Sheets, Notion, your CRM, custom dashboards…",
  },
  {
    id: "success",
    label: "What would success look like in 90 days?",
    placeholder: "Be concrete — time saved, errors avoided, capacity unlocked.",
  },
] as const;

export type AuditAnswerId = (typeof AUDIT_QUESTIONS)[number]["id"];

export type AuditTranscript = Record<AuditAnswerId, string>;

export const AUDIT_TURN_TOKEN_CAP = 1200;
