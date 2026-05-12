import { streamText, gateway } from "ai";
import { z } from "zod";
import { AUDIT_SYSTEM_PROMPT } from "@/lib/audit/prompt";
import {
  AUDIT_QUESTIONS,
  AUDIT_TURN_TOKEN_CAP,
  type AuditAnswerId,
} from "@/lib/audit/types";
import {
  checkAuditRateLimit,
  clientIpFromHeaders,
} from "@/lib/audit/rate-limit";

/*
 * /api/audit/stream — Edge runtime streaming endpoint (spec §7.8).
 *
 * Wire shape:
 *   POST { turn: 0..4, answers: AuditTranscript, isFirstTurn?: boolean }
 *
 * Server reconstructs a message history from the answers map: each
 * AUDIT_QUESTIONS[i] is the assistant's question, each answers[id] is the
 * user's answer. The model receives the full prefix every turn so the
 * Anthropic prompt cache stays warm.
 *
 * Rate limit (10 starts/IP/hour) is checked only on the first turn — the
 * remaining four turns are inside the same flow and budget.
 *
 * Failure mode: on any throw, return 503 with the spec-mandated copy. The
 * client renders a "I'm offline right now — book a call" fallback. No
 * silent retries.
 *
 * Runtime: Fluid Compute (Next 16 default). Edge is no longer recommended
 * and Fluid runs streaming + provider SDKs natively without the Edge
 * runtime's polyfill quirks.
 */

const bodySchema = z.object({
  turn: z.number().int().min(0).max(4),
  answers: z.record(z.string(), z.string()),
  isFirstTurn: z.boolean().optional().default(false),
});

const ANSWER_IDS = AUDIT_QUESTIONS.map((q) => q.id) as readonly AuditAnswerId[];

export async function POST(req: Request): Promise<Response> {
  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return new Response("Bad request", { status: 400 });
  }

  const { turn, answers, isFirstTurn } = parsed.data;

  if (isFirstTurn) {
    const ip = clientIpFromHeaders(req.headers);
    const limit = await checkAuditRateLimit(ip);
    if (!limit.ok) {
      return Response.json(
        {
          error: "rate_limited",
          message:
            "Take a breath — try again in an hour or book a call instead.",
          retryAfterSeconds: limit.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        },
      );
    }
  }

  // Reconstruct the alternating user/assistant transcript from answers.
  // Turn N means "the user just submitted answer N; the model should respond
  // for turn N." We include every prior turn so the model has full context.
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [];
  for (let i = 0; i <= turn; i++) {
    const id = ANSWER_IDS[i];
    if (!id) continue;
    const answer = answers[id];
    if (typeof answer !== "string" || answer.trim().length === 0) {
      return new Response(`Missing answer for turn ${i}`, { status: 400 });
    }
    if (i > 0) {
      // Inject the previous assistant question so the model sees its own move.
      const prevQ = AUDIT_QUESTIONS[i];
      if (prevQ) messages.push({ role: "assistant", content: prevQ.label });
    }
    messages.push({ role: "user", content: answer });
  }

  try {
    const result = streamText({
      model: gateway("anthropic/claude-sonnet-4-6"),
      system: AUDIT_SYSTEM_PROMPT,
      messages,
      maxOutputTokens: AUDIT_TURN_TOKEN_CAP,
      providerOptions: {
        anthropic: {
          cacheControl: { type: "ephemeral" },
        },
      },
    });

    return result.toTextStreamResponse();
  } catch (err) {
    console.error("[audit/stream] gateway error", err);
    return Response.json(
      {
        error: "gateway_unavailable",
        message:
          "I'm offline right now — book a call for a human audit.",
      },
      { status: 503 },
    );
  }
}
