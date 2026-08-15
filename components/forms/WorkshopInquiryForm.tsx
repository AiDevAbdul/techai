"use client";

import { useActionState, useEffect, useId, useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  submitWorkshopInquiry,
  type WorkshopInquiryState,
} from "@/app/(marketing)/workshops/actions";

/*
 * /workshops inquiry form.
 *
 * Driven by `useActionState` against `submitWorkshopInquiry` (server action
 * lives next to the page). Field-level errors are rendered inline with
 * aria-describedby; the action's `ok=true` path fires a sonner toast and a
 * Plausible `cta_workshop_inquiry` event (spec §12), then resets the form.
 *
 * Visual contract:
 *   - Hairline-bordered fields on --bg-elevated, --radius-md
 *   - Honeypot is visually hidden but reachable to bots (tabindex=-1, aria-hidden)
 *   - Submit button uses the accent pill (matches the rest of the page CTAs)
 *
 * The format radio group is rendered as labelled cards instead of a select
 * because the four options carry editorial weight — they're the "shape" of
 * the engagement, not a hidden dropdown choice.
 */

const FORMAT_OPTIONS = [
  {
    value: "executive-briefing",
    label: "Executive briefing",
    body: "60–90 min · for leadership",
  },
  {
    value: "team-workshop",
    label: "Team workshop",
    body: "Half-day to 2 days · 5–50 people",
  },
  {
    value: "hands-on-bootcamp",
    label: "Hands-on bootcamp",
    body: "2–5 days · engineers & ops",
  },
  {
    value: "unsure",
    label: "Not sure yet",
    body: "We'll figure it out on a call",
  },
] as const;

const INITIAL_STATE: WorkshopInquiryState = { ok: false };

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
      {pending ? "Sending…" : "Request a workshop"}
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
    <p id={id} className="text-[color:var(--danger)] text-caption mt-1.5">
      {message}
    </p>
  );
}

const baseFieldClasses =
  "border-separator bg-surface-elevated text-ink placeholder:text-ink-tertiary focus-visible:border-accent focus-visible:ring-accent-ring/40 w-full rounded-md border px-3.5 py-2.5 text-body leading-[1.4] transition-colors duration-[var(--dur-fast)] outline-none focus-visible:ring-3";

export default function WorkshopInquiryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(
    submitWorkshopInquiry,
    INITIAL_STATE,
  );

  // Per-field ids for aria-describedby wiring.
  const idName = useId();
  const idEmail = useId();
  const idOrg = useId();
  const idRole = useId();
  const idAudience = useId();
  const idDates = useId();
  const idNotes = useId();
  const idStatus = useId();

  // Fire toast + analytics event + reset on the action's success edge.
  useEffect(() => {
    if (!state.ok || !state.message) return;
    toast.success(state.message);
    if (typeof window !== "undefined" && window.plausible) {
      window.plausible("cta_workshop_inquiry");
    }
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
      {/* Honeypot — visually hidden, off-screen, aria-hidden so screen readers skip */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[10000px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor={`${idName}-honeypot`}>
          Company website (leave blank)
        </label>
        <input
          type="text"
          id={`${idName}-honeypot`}
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
            className={baseFieldClasses}
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
            className={baseFieldClasses}
          />
          <FieldError id={`${idEmail}-error`} message={errors.email} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={idOrg}
            className="text-ink text-footnote font-medium block mb-2"
          >
            Organization
          </label>
          <input
            id={idOrg}
            name="org"
            type="text"
            required
            autoComplete="organization"
            aria-invalid={Boolean(errors.org)}
            aria-describedby={errors.org ? `${idOrg}-error` : undefined}
            className={baseFieldClasses}
          />
          <FieldError id={`${idOrg}-error`} message={errors.org} />
        </div>

        <div>
          <label
            htmlFor={idRole}
            className="text-ink text-footnote font-medium block mb-2"
          >
            Your role
          </label>
          <input
            id={idRole}
            name="role"
            type="text"
            required
            autoComplete="organization-title"
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? `${idRole}-error` : undefined}
            placeholder="Head of Ops, CTO, L&D Lead…"
            className={baseFieldClasses}
          />
          <FieldError id={`${idRole}-error`} message={errors.role} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor={idAudience}
            className="text-ink text-footnote font-medium block mb-2"
          >
            Audience size
          </label>
          <input
            id={idAudience}
            name="audienceSize"
            type="text"
            required
            aria-invalid={Boolean(errors.audienceSize)}
            aria-describedby={
              errors.audienceSize ? `${idAudience}-error` : undefined
            }
            placeholder="e.g. 12 engineers + 4 PMs"
            className={baseFieldClasses}
          />
          <FieldError
            id={`${idAudience}-error`}
            message={errors.audienceSize}
          />
        </div>

        <div>
          <label
            htmlFor={idDates}
            className="text-ink text-footnote font-medium block mb-2"
          >
            <span className="inline-flex items-baseline gap-2">
              Target dates
              <span className="text-ink-tertiary text-caption font-normal">
                Optional
              </span>
            </span>
          </label>
          <input
            id={idDates}
            name="targetDates"
            type="text"
            placeholder="e.g. last week of June, or “Q3 flexible”"
            className={baseFieldClasses}
          />
        </div>
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-ink text-footnote font-medium mb-1">
          Format
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {FORMAT_OPTIONS.map((opt, i) => (
            <label
              key={opt.value}
              className={cn(
                "border-separator bg-surface-elevated hover:border-separator-opaque has-[input:checked]:border-accent has-[input:checked]:bg-accent-soft/40 has-[input:focus-visible]:ring-accent-ring/40 has-[input:focus-visible]:ring-3 group flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition-colors duration-[var(--dur-fast)]",
              )}
            >
              <input
                type="radio"
                name="format"
                value={opt.value}
                defaultChecked={i === 1 /* team-workshop default */}
                className="accent-[var(--accent)] mt-1"
                required
              />
              <span className="flex flex-col">
                <span className="text-ink text-footnote font-medium">
                  {opt.label}
                </span>
                <span className="text-ink-secondary text-caption mt-0.5">
                  {opt.body}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label
          htmlFor={idNotes}
          className="text-ink text-footnote font-medium block mb-2"
        >
          <span className="inline-flex items-baseline gap-2">
            Notes
            <span className="text-ink-tertiary text-caption font-normal">
              Workflows you want to focus on, goals, anything else
            </span>
          </span>
        </label>
        <textarea
          id={idNotes}
          name="notes"
          rows={5}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? `${idNotes}-error` : undefined}
          className={cn(baseFieldClasses, "min-h-[8rem] resize-y leading-[1.55]")}
        />
        <FieldError id={`${idNotes}-error`} message={errors.notes} />
      </div>

      {/* Reserve a slot for the hCaptcha token — populated by the invisible
          challenge when HCAPTCHA env is wired. Until then the action skips
          verification. */}
      <input type="hidden" name="hcaptcha_token" value="" />

      <div
        id={idStatus}
        role="status"
        aria-live="polite"
        className="min-h-[1.25rem]"
      >
        {state.message && !state.ok ? (
          <p className="text-[color:var(--danger)] text-footnote">
            {state.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <SubmitButton />
        <p className="text-ink-secondary text-caption max-w-[42ch]">
          Replies arrive from <span className="text-ink">info@abdulwahabai.com</span>{" "}
          within two business days.
        </p>
      </div>
    </form>
  );
}
