"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  subscribeToSessions,
  type SessionNotifyState,
} from "@/app/(marketing)/sessions/actions";

/*
 * SessionNotifyForm — email capture for session notifications.
 *
 * Mirrors SubscribeForm in /lab. One field (email) + hidden session_slug.
 * Server Action sends the address to the owner inbox. Honeypot on
 * `company_website` silently rejects bots.
 */

const INITIAL_STATE: SessionNotifyState = { ok: false };

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "bg-accent text-primary-foreground hover:bg-accent-hover inline-flex items-center gap-2 rounded-pill px-4 py-2.5 text-footnote font-medium transition-colors duration-[var(--dur-fast)]",
        "disabled:cursor-wait disabled:opacity-70",
      )}
    >
      {pending ? "…" : "Notify me"}
      <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
    </button>
  );
}

export default function SessionNotifyForm({
  sessionSlug,
}: {
  sessionSlug: string;
}) {
  const [state, formAction] = useActionState(subscribeToSessions, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const emailId = useId();
  const errorId = useId();

  useEffect(() => {
    if (state.ok && state.message) {
      toast.success(state.message);
      window.plausible?.("session_notify", { props: { slug: sessionSlug } });
      formRef.current?.reset();
    }
  }, [state, sessionSlug]);

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      aria-label="Get notified of new sessions"
      className="flex flex-col gap-3"
    >
      <input type="hidden" name="session_slug" value={sessionSlug} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="flex-1">
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={Boolean(state.error)}
            aria-describedby={state.error ? errorId : undefined}
            className={cn(
              "border-separator bg-surface-elevated text-ink placeholder:text-ink-tertiary focus-visible:border-accent focus-visible:outline-accent w-full rounded-xl border px-4 py-2.5 text-callout transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
              state.error && "border-[color:var(--danger,#c1121f)]",
            )}
          />
        </div>
        <SubmitButton />
      </div>

      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="company_website">Company website</label>
        <input
          id="company_website"
          name="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.error && (
        <p
          id={errorId}
          role="alert"
          className="text-[color:var(--danger,#c1121f)] text-footnote"
        >
          {state.error}
        </p>
      )}
      <p className="text-ink-tertiary text-caption leading-[1.5]">
        I will email you when the next session is confirmed. No spam.
      </p>
    </form>
  );
}
