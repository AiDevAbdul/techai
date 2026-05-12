"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  submitContact,
  type ContactState,
} from "@/app/(marketing)/contact/actions";

/*
 * /contact form (spec §7.10).
 *
 * Fields: name, email, org (optional), message, budget (optional dropdown),
 * honeypot. useActionState pattern mirrors the workshops form so visual
 * conventions and error semantics stay identical.
 *
 * Success edge: sonner toast + Plausible `cta_contact_submit` event + form
 * reset. Field-level errors render inline below the relevant input.
 */

const INITIAL_STATE: ContactState = { ok: false };

const BUDGET_OPTIONS = [
  { value: "", label: "Pick one (optional)" },
  { value: "under-5k", label: "Under $5k" },
  { value: "5k-15k", label: "$5k – $15k" },
  { value: "15k-40k", label: "$15k – $40k" },
  { value: "40k-plus", label: "$40k+" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

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
        "bg-accent text-primary-foreground hover:bg-accent-hover inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-callout font-medium transition-colors duration-[var(--dur-fast)]",
        "disabled:cursor-wait disabled:opacity-70",
      )}
    >
      {pending ? "Sending…" : "Send note"}
      <ArrowRight size={16} strokeWidth={1.75} aria-hidden />
    </button>
  );
}

function FieldError({
  id,
  message,
}: {
  id: string;
  message: string | undefined;
}) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-[color:var(--danger)] text-caption mt-1.5">
      {message}
    </p>
  );
}

const fieldBase =
  "border-separator bg-surface-elevated text-ink placeholder:text-ink-tertiary focus-visible:border-accent focus-visible:ring-accent-ring/40 w-full rounded-md border px-3.5 py-2.5 text-body leading-[1.4] transition-colors duration-[var(--dur-fast)] outline-none focus-visible:ring-3";

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(submitContact, INITIAL_STATE);
  const idName = useId();
  const idEmail = useId();
  const idOrg = useId();
  const idBudget = useId();
  const idMessage = useId();
  const idStatus = useId();
  const idHoney = useId();

  useEffect(() => {
    if (!state.ok || !state.message) return;
    toast.success(state.message);
    window.plausible?.("cta_contact_submit");
    formRef.current?.reset();
  }, [state]);

  const errors = state.errors ?? {};

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-5"
      noValidate
      aria-describedby={idStatus}
    >
      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10000px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor={idHoney}>Company website (leave blank)</label>
        <input
          id={idHoney}
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={idName}
            className="text-ink text-footnote font-medium block mb-2"
          >
            Your name
          </label>
          <input
            id={idName}
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${idName}-error` : undefined}
            className={fieldBase}
          />
          <FieldError id={`${idName}-error`} message={errors.name} />
        </div>

        <div>
          <label
            htmlFor={idEmail}
            className="text-ink text-footnote font-medium block mb-2"
          >
            Work email
          </label>
          <input
            id={idEmail}
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${idEmail}-error` : undefined}
            className={fieldBase}
          />
          <FieldError id={`${idEmail}-error`} message={errors.email} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <label
            htmlFor={idOrg}
            className="text-ink text-footnote font-medium block mb-2"
          >
            Organization{" "}
            <span className="text-ink-tertiary font-normal">(optional)</span>
          </label>
          <input
            id={idOrg}
            name="org"
            type="text"
            autoComplete="organization"
            aria-invalid={Boolean(errors.org)}
            aria-describedby={errors.org ? `${idOrg}-error` : undefined}
            className={fieldBase}
          />
          <FieldError id={`${idOrg}-error`} message={errors.org} />
        </div>

        <div>
          <label
            htmlFor={idBudget}
            className="text-ink text-footnote font-medium block mb-2"
          >
            Budget{" "}
            <span className="text-ink-tertiary font-normal">(optional)</span>
          </label>
          <select
            id={idBudget}
            name="budget"
            defaultValue=""
            className={cn(fieldBase, "appearance-none pr-9")}
          >
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor={idMessage}
          className="text-ink text-footnote font-medium block mb-2"
        >
          Message
        </label>
        <textarea
          id={idMessage}
          name="message"
          required
          rows={6}
          minLength={20}
          maxLength={2000}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? `${idMessage}-error` : `${idMessage}-hint`
          }
          placeholder="What you're trying to do, and where you're stuck. A few sentences is plenty."
          className={cn(fieldBase, "resize-y leading-[1.55]")}
        />
        {errors.message ? (
          <FieldError id={`${idMessage}-error`} message={errors.message} />
        ) : (
          <p
            id={`${idMessage}-hint`}
            className="text-ink-tertiary text-caption mt-1.5"
          >
            A sentence or two is enough — we&rsquo;ll dig in on the call.
          </p>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <p
          id={idStatus}
          aria-live="polite"
          className={cn(
            "text-footnote",
            state.ok ? "text-accent" : "text-[color:var(--danger)]",
          )}
        >
          {state.message && !state.ok ? state.message : ""}
        </p>
        <SubmitButton />
      </div>
    </form>
  );
}
