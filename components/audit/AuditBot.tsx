"use client";

import {
  useCallback,
  useEffect,
  useId,
  useReducer,
  useRef,
  useState,
} from "react";
import { ArrowRight, RotateCcw, Play, AlertCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  AUDIT_QUESTIONS,
  type AuditAnswerId,
  type AuditMessage,
  type AuditTranscript,
} from "@/lib/audit/types";

/*
 * AuditBot — client UI for /lab/audit (spec §7.8).
 *
 * Flow shape:
 *   intro → q[0] → q[1] → ... → q[4] → hypothesis (streaming) → capture
 *
 * State machine implemented with useReducer. Transcript persists to
 * sessionStorage until email capture (then we clear). The /api/audit/stream
 * endpoint receives the answers map and the current turn index; we render
 * the assistant's streaming response inline.
 *
 * Failure mode: on Gateway error (any non-2xx, or a fetch throw), show the
 * spec-mandated "I'm offline right now — book a call" copy. Do not retry.
 */

const SESSION_KEY = "techai:audit:v1";

type Stage =
  | { kind: "intro" }
  | { kind: "asking"; turn: number }
  | { kind: "thinking"; turn: number; streamed: string }
  | { kind: "hypothesis"; streamed: string; complete: boolean }
  | { kind: "captured" }
  | { kind: "error"; reason: "rate_limited" | "gateway" };

type State = {
  stage: Stage;
  answers: Partial<AuditTranscript>;
  history: AuditMessage[];
};

type Action =
  | { type: "start" }
  | { type: "submitAnswer"; id: AuditAnswerId; value: string }
  | { type: "streamDelta"; delta: string }
  | { type: "streamDone" }
  | { type: "captureDone" }
  | { type: "error"; reason: "rate_limited" | "gateway" }
  | { type: "restart" }
  | { type: "hydrate"; state: State };

const initialState: State = {
  stage: { kind: "intro" },
  answers: {},
  history: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "start":
      return {
        ...state,
        stage: { kind: "asking", turn: 0 },
      };
    case "submitAnswer": {
      const next: State = {
        ...state,
        answers: { ...state.answers, [action.id]: action.value },
        history: [
          ...state.history,
          { role: "user", content: action.value },
        ],
      };
      const turn =
        state.stage.kind === "asking" ? state.stage.turn : state.history.length;
      next.stage = { kind: "thinking", turn, streamed: "" };
      return next;
    }
    case "streamDelta": {
      if (state.stage.kind !== "thinking") return state;
      return {
        ...state,
        stage: {
          ...state.stage,
          streamed: state.stage.streamed + action.delta,
        },
      };
    }
    case "streamDone": {
      if (state.stage.kind !== "thinking") return state;
      const { turn, streamed } = state.stage;
      const history = [
        ...state.history,
        { role: "assistant" as const, content: streamed },
      ];
      const isFinal = turn === AUDIT_QUESTIONS.length - 1;
      return {
        ...state,
        history,
        stage: isFinal
          ? { kind: "hypothesis", streamed, complete: true }
          : { kind: "asking", turn: turn + 1 },
      };
    }
    case "captureDone":
      return { ...state, stage: { kind: "captured" } };
    case "error":
      return { ...state, stage: { kind: "error", reason: action.reason } };
    case "restart":
      return initialState;
    case "hydrate":
      return action.state;
    default:
      return state;
  }
}

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

function sessionLoad(): State | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as State;
  } catch {
    return null;
  }
}

function sessionSave(state: State) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    /* quota or privacy mode — best effort */
  }
}

function sessionClear() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* noop */
  }
}

export default function AuditBot() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const draftId = useId();

  // Hydrate from sessionStorage on mount.
  useEffect(() => {
    const restored = sessionLoad();
    if (restored && restored.stage.kind !== "intro") {
      dispatch({ type: "hydrate", state: restored });
    }
  }, []);

  // Persist on every state change except `captured` (we cleared on capture).
  useEffect(() => {
    if (state.stage.kind === "intro" || state.stage.kind === "captured") return;
    sessionSave(state);
  }, [state]);

  const streamTurn = useCallback(
    async (turn: number, answers: AuditTranscript, isFirstTurn: boolean) => {
      try {
        const res = await fetch("/api/audit/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ turn, answers, isFirstTurn }),
        });
        if (res.status === 429) {
          dispatch({ type: "error", reason: "rate_limited" });
          return;
        }
        if (!res.ok || !res.body) {
          dispatch({ type: "error", reason: "gateway" });
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let streaming = true;
        while (streaming) {
          const { value, done } = await reader.read();
          if (done) {
            streaming = false;
            break;
          }
          const delta = decoder.decode(value, { stream: true });
          if (delta) dispatch({ type: "streamDelta", delta });
        }
        dispatch({ type: "streamDone" });
        if (turn === AUDIT_QUESTIONS.length - 1) {
          window.plausible?.("audit_complete");
        }
      } catch (err) {
        console.error("[audit] stream failed", err);
        dispatch({ type: "error", reason: "gateway" });
      }
    },
    [],
  );

  const handleStart = useCallback(() => {
    dispatch({ type: "start" });
    window.plausible?.("audit_start");
    queueMicrotask(() => inputRef.current?.focus());
  }, []);

  const handleSubmitAnswer = useCallback(() => {
    if (state.stage.kind !== "asking") return;
    const trimmed = draft.trim();
    if (trimmed.length < 2) return;
    const id = AUDIT_QUESTIONS[state.stage.turn]?.id;
    if (!id) return;
    const turn = state.stage.turn;
    const nextAnswers: AuditTranscript = {
      industry: state.answers.industry ?? "",
      workflow: state.answers.workflow ?? "",
      owner: state.answers.owner ?? "",
      tools: state.answers.tools ?? "",
      success: state.answers.success ?? "",
      [id]: trimmed,
    };
    dispatch({ type: "submitAnswer", id, value: trimmed });
    setDraft("");
    void streamTurn(turn, nextAnswers, turn === 0);
  }, [state, draft, streamTurn]);

  const handleRestart = useCallback(() => {
    sessionClear();
    dispatch({ type: "restart" });
    setDraft("");
  }, []);

  return (
    <div className="grid gap-6">
      {state.stage.kind === "intro" && (
        <IntroCard onStart={handleStart} />
      )}

      {state.stage.kind === "error" && (
        <ErrorCard reason={state.stage.reason} onRestart={handleRestart} />
      )}

      {state.stage.kind !== "intro" && state.stage.kind !== "error" && (
        <div
          className="bg-surface-elevated border-separator rounded-2xl border"
          aria-live="polite"
          aria-busy={state.stage.kind === "thinking"}
          ref={liveRef}
        >
          <TranscriptList history={state.history} />

          {state.stage.kind === "asking" && (
            <CurrentQuestion
              turn={state.stage.turn}
              draft={draft}
              setDraft={setDraft}
              onSubmit={handleSubmitAnswer}
              inputRef={inputRef}
              draftId={draftId}
            />
          )}

          {state.stage.kind === "thinking" && (
            <StreamingBubble text={state.stage.streamed} />
          )}

          {state.stage.kind === "hypothesis" && (
            <>
              <HypothesisBubble text={state.stage.streamed} />
              <CaptureForm
                hypothesis={state.stage.streamed}
                transcript={{
                  industry: state.answers.industry ?? "",
                  workflow: state.answers.workflow ?? "",
                  owner: state.answers.owner ?? "",
                  tools: state.answers.tools ?? "",
                  success: state.answers.success ?? "",
                }}
                onDone={() => {
                  sessionClear();
                  dispatch({ type: "captureDone" });
                }}
              />
            </>
          )}

          {state.stage.kind === "captured" && <CapturedCard />}

          {state.stage.kind !== "captured" && state.history.length > 0 && (
            <div className="border-separator flex items-center justify-between border-t px-6 py-4">
              <p className="text-ink-tertiary text-caption">
                {state.history.filter((m) => m.role === "user").length} of{" "}
                {AUDIT_QUESTIONS.length} answered
              </p>
              <button
                type="button"
                onClick={handleRestart}
                className="text-ink-secondary hover:text-ink text-caption inline-flex items-center gap-1.5 transition-colors duration-[var(--dur-fast)]"
              >
                <RotateCcw size={12} strokeWidth={1.75} aria-hidden />
                Start over
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function IntroCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="bg-surface-elevated border-separator rounded-2xl border p-7 lg:p-10">
      <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
        Workflow audit bot
      </p>
      <h2 className="serif text-ink mt-3 text-[clamp(1.625rem,3vw,2.25rem)] leading-[1.1] tracking-[var(--track-title)]">
        Five questions. One hypothesis.
      </h2>
      <p className="text-ink-secondary text-body mt-4 max-w-[58ch] leading-[1.55]">
        Answer five short questions and the bot drafts a one-page automation
        hypothesis in Abdul&rsquo;s voice — the bottleneck, a sketched
        architecture, a recommended stack, and one suggested next step. Takes
        about three minutes.
      </p>
      <p className="text-ink-tertiary text-caption mt-5 max-w-[58ch]">
        Email a clean PDF at the end. The conversation is not stored
        server-side. Rate-limited to ten starts per hour per IP.
      </p>
      <button
        type="button"
        onClick={onStart}
        className="bg-accent text-primary-foreground hover:bg-accent-hover mt-8 inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-callout font-medium transition-colors duration-[var(--dur-fast)]"
      >
        <Play size={14} strokeWidth={1.75} aria-hidden />
        Start the audit
      </button>
    </div>
  );
}

function ErrorCard({
  reason,
  onRestart,
}: {
  reason: "rate_limited" | "gateway";
  onRestart: () => void;
}) {
  const isRate = reason === "rate_limited";
  return (
    <div className="border-separator bg-surface-elevated rounded-2xl border p-7">
      <div className="text-accent flex items-start gap-3">
        <AlertCircle size={18} strokeWidth={1.75} aria-hidden className="mt-0.5" />
        <div>
          <p className="text-ink text-callout font-medium">
            {isRate ? "Take a breath." : "I'm offline right now."}
          </p>
          <p className="text-ink-secondary text-footnote mt-2 max-w-[48ch] leading-[1.55]">
            {isRate
              ? "Ten audit starts per hour per IP. Try again in an hour, or book a 30-minute call for a human audit."
              : "The bot can't reach the model right now. Book a 30-minute call for a human audit instead — same playbook, no waiting."}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/contact"
              className="bg-accent text-primary-foreground hover:bg-accent-hover plausible-event-name=cta_book_call inline-flex items-center gap-2 rounded-pill px-4 py-2 text-footnote font-medium transition-colors duration-[var(--dur-fast)]"
            >
              Book a call
              <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
            </Link>
            <button
              type="button"
              onClick={onRestart}
              className="text-ink-secondary hover:text-ink text-footnote inline-flex items-center gap-1.5 font-medium transition-colors duration-[var(--dur-fast)]"
            >
              <RotateCcw size={12} strokeWidth={1.75} aria-hidden />
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TranscriptList({ history }: { history: AuditMessage[] }) {
  if (history.length === 0) return null;
  return (
    <ol className="divide-separator divide-y" role="list">
      {history.map((m, i) => (
        <li key={i} className="px-6 py-5 lg:px-8">
          <p className="text-ink-tertiary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
            {m.role === "user" ? "You" : "Audit bot"}
          </p>
          <div
            className={cn(
              "text-ink mt-2 leading-[1.55]",
              m.role === "user" ? "text-body" : "text-body whitespace-pre-wrap",
            )}
          >
            {m.content}
          </div>
        </li>
      ))}
    </ol>
  );
}

function CurrentQuestion({
  turn,
  draft,
  setDraft,
  onSubmit,
  inputRef,
  draftId,
}: {
  turn: number;
  draft: string;
  setDraft: (v: string) => void;
  onSubmit: () => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  draftId: string;
}) {
  const q = AUDIT_QUESTIONS[turn];
  if (!q) return null;
  return (
    <div className="border-separator border-t px-6 py-6 lg:px-8">
      <p className="text-accent text-eyebrow tabular-nums font-medium tracking-[var(--track-eyebrow)] uppercase">
        Question {turn + 1} of {AUDIT_QUESTIONS.length}
      </p>
      <label
        htmlFor={draftId}
        className="serif text-ink mt-2 block text-headline tracking-[var(--track-title)]"
      >
        {q.label}
      </label>
      <textarea
        id={draftId}
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={q.placeholder}
        rows={3}
        maxLength={1200}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onSubmit();
          }
        }}
        className="border-separator bg-surface text-ink placeholder:text-ink-tertiary focus-visible:border-accent focus-visible:ring-accent-ring/40 mt-4 w-full resize-y rounded-md border px-3.5 py-2.5 text-body leading-[1.5] transition-colors focus-visible:ring-3 focus-visible:outline-none"
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-tertiary text-caption">
          ⌘ + Enter to submit
        </p>
        <button
          type="button"
          onClick={onSubmit}
          disabled={draft.trim().length < 2}
          className={cn(
            "bg-accent text-primary-foreground hover:bg-accent-hover inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-callout font-medium transition-colors duration-[var(--dur-fast)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          {turn === AUDIT_QUESTIONS.length - 1 ? "Draft my hypothesis" : "Next"}
          <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
        </button>
      </div>
    </div>
  );
}

function StreamingBubble({ text }: { text: string }) {
  return (
    <div className="border-separator border-t px-6 py-6 lg:px-8">
      <p className="text-ink-tertiary text-eyebrow tracking-[var(--track-eyebrow)] uppercase">
        Audit bot
      </p>
      <div className="text-ink mt-2 text-body leading-[1.55] whitespace-pre-wrap">
        {text || (
          <span className="text-ink-tertiary inline-flex items-center gap-1">
            Thinking
            <span className="ml-1 inline-flex gap-0.5">
              <span
                className="bg-ink-tertiary inline-block h-1 w-1 animate-pulse rounded-full"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="bg-ink-tertiary inline-block h-1 w-1 animate-pulse rounded-full"
                style={{ animationDelay: "120ms" }}
              />
              <span
                className="bg-ink-tertiary inline-block h-1 w-1 animate-pulse rounded-full"
                style={{ animationDelay: "240ms" }}
              />
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

function HypothesisBubble({ text }: { text: string }) {
  return (
    <div className="border-separator border-t px-6 py-7 lg:px-8">
      <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
        One-page hypothesis
      </p>
      <div className="text-ink mt-3 text-body leading-[1.6] whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}

function CaptureForm({
  hypothesis,
  transcript,
  onDone,
}: {
  hypothesis: string;
  transcript: AuditTranscript;
  onDone: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nameId = useId();
  const emailId = useId();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/audit/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, hypothesis, transcript }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { message?: string }
          | null;
        setError(
          data?.message ??
            "Couldn't send the PDF — please email aidevabdul@gmail.com.",
        );
        setSubmitting(false);
        return;
      }
      window.plausible?.("audit_email_capture");
      toast.success("PDF on the way — check your inbox.");
      onDone();
    } catch (err) {
      console.error(err);
      setError("Network error — please try again or write to aidevabdul@gmail.com.");
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-separator bg-surface-secondary border-t px-6 py-7 lg:px-8"
    >
      <p className="text-ink text-callout font-medium">
        Want a clean PDF of this in your inbox?
      </p>
      <p className="text-ink-secondary text-footnote mt-2 max-w-[48ch] leading-[1.55]">
        Branded one-pager + your inputs. I&rsquo;ll see a copy and may reply
        if it&rsquo;s the kind of thing I can move on quickly.
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={nameId}
            className="text-ink text-footnote font-medium block mb-2"
          >
            Your name
          </label>
          <input
            id={nameId}
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-separator bg-surface-elevated text-ink focus-visible:border-accent focus-visible:ring-accent-ring/40 w-full rounded-md border px-3.5 py-2.5 text-body leading-[1.4] transition-colors focus-visible:ring-3 focus-visible:outline-none"
          />
        </div>
        <div>
          <label
            htmlFor={emailId}
            className="text-ink text-footnote font-medium block mb-2"
          >
            Work email
          </label>
          <input
            id={emailId}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-separator bg-surface-elevated text-ink focus-visible:border-accent focus-visible:ring-accent-ring/40 w-full rounded-md border px-3.5 py-2.5 text-body leading-[1.4] transition-colors focus-visible:ring-3 focus-visible:outline-none"
          />
        </div>
      </div>
      {error && (
        <p
          role="alert"
          className="text-[color:var(--danger)] text-footnote mt-3"
        >
          {error}
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-tertiary text-caption max-w-[44ch]">
          Single email per audit; no list signup, no drip.
        </p>
        <button
          type="submit"
          disabled={submitting || name.trim().length < 1 || email.trim().length < 5}
          className="bg-accent text-primary-foreground hover:bg-accent-hover inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-callout font-medium transition-colors duration-[var(--dur-fast)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Email me the PDF"}
          <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
        </button>
      </div>
    </form>
  );
}

function CapturedCard() {
  return (
    <div className="px-6 py-7 lg:px-8">
      <p className="text-accent text-eyebrow font-medium tracking-[var(--track-eyebrow)] uppercase">
        Sent
      </p>
      <p className="serif text-ink mt-2 text-headline tracking-[var(--track-title)]">
        Check your inbox.
      </p>
      <p className="text-ink-secondary text-footnote mt-3 max-w-[48ch] leading-[1.55]">
        The PDF should arrive within a minute. If you want to take the next
        step, book a 30-minute call below.
      </p>
      <Link
        href="/contact"
        className="bg-accent text-primary-foreground hover:bg-accent-hover plausible-event-name=cta_book_call mt-5 inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-callout font-medium transition-colors duration-[var(--dur-fast)]"
      >
        Book a 30-min call
        <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
      </Link>
    </div>
  );
}
