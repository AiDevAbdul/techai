"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { subscribeToLab, type SubscribeState } from "@/app/(lab)/lab/actions";

/*
 * Lab Note inline subscribe form.
 *
 * One field (email). Server Action returns ok=true → sonner toast + Plausible
 * `lab_subscribe` event + form reset. No double opt-in v1 per spec §7.7.
 *
 * Honeypot: `company_website` hidden field. Bots fill it; humans don't.
 */

const INITIAL_STATE: SubscribeState = { ok: false };

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
        "bg-accent text-primary-foreground hover:bg-accent-hover inline-flex items-center gap-2 rounded-pill px-4 py-2 text-footnote font-medium transition-colors duration-[var(--dur-fast)]",
        "disabled:cursor-wait disabled:opacity-70",
      )}
    >
      {pending ? "…" : "Subscribe"}
      <ArrowRight size={14} strokeWidth={1.75} aria-hidden />
    </button>
  );
}

export default function SubscribeForm() {
  const [state, formAction] = useActionState(subscribeToLab, INITIAL_STATE);
  const formRef = useRef<HTMLFormElement>(null);
  const emailId = useId();
  const errorId = useId();

  useEffect(() => {
    if (state.ok && state.message) {
      toast.success(state.message);
      window.plausible?.("lab_subscribe");
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      aria-label="Subscribe to Lab Notes"
      className="flex flex-col gap-3"
    >
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
      {/* Honeypot — visually hidden, reachable to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
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
        New notes every two weeks. Unsubscribe at the foot of any email.
      </p>
    </form>
  );
}
