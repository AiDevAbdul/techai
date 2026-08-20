"use client";

import { useActionState, useEffect, useId, useMemo, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  submitDistrictRegistration,
  type DistrictRegistrationState,
} from "@/app/(marketing)/workshops/district-actions";
import { PROVINCES, districtsForProvince } from "@/lib/content/districts";

/*
 * /workshops "Bring this to your district" registration form.
 *
 * Same shape as `WorkshopInquiryForm.tsx` (useActionState, honeypot,
 * aria-describedby field errors, sonner toast on success) — deliberately
 * kept parallel rather than sharing a generic base, since the two forms
 * diverge on fields (org-level inquiry vs. individual/community signup).
 */

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

const INITIAL_STATE: DistrictRegistrationState = { ok: false };

const baseFieldClasses =
  "border-separator bg-surface-elevated text-ink placeholder:text-ink-tertiary focus-visible:border-accent focus-visible:ring-accent-ring/40 w-full rounded-md border px-3.5 py-2.5 text-body leading-[1.4] transition-colors duration-[var(--dur-fast)] outline-none focus-visible:ring-3";

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
      {pending ? "Registering…" : "Register interest"}
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

export default function DistrictSessionForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(
    submitDistrictRegistration,
    INITIAL_STATE,
  );
  const [province, setProvince] = useState<string>(PROVINCES[0] ?? "");
  const districts = useMemo(() => districtsForProvince(province), [province]);

  const idName = useId();
  const idEmail = useId();
  const idPhone = useId();
  const idProvince = useId();
  const idDistrict = useId();
  const idNotes = useId();
  const idStatus = useId();

  useEffect(() => {
    if (!state.ok || !state.message) return;
    toast.success(state.message);
    if (typeof window !== "undefined" && window.plausible) {
      window.plausible("cta_district_registration");
    }
    formRef.current?.reset();
    setProvince(PROVINCES[0] ?? "");
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
            Email
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
            htmlFor={idProvince}
            className="text-ink text-footnote font-medium block mb-2"
          >
            Province
          </label>
          <select
            id={idProvince}
            name="province"
            required
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            aria-invalid={Boolean(errors.province)}
            aria-describedby={
              errors.province ? `${idProvince}-error` : undefined
            }
            className={baseFieldClasses}
          >
            {PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <FieldError id={`${idProvince}-error`} message={errors.province} />
        </div>

        <div>
          <label
            htmlFor={idDistrict}
            className="text-ink text-footnote font-medium block mb-2"
          >
            District
          </label>
          <select
            id={idDistrict}
            name="district"
            required
            defaultValue=""
            aria-invalid={Boolean(errors.district)}
            aria-describedby={
              errors.district ? `${idDistrict}-error` : undefined
            }
            className={baseFieldClasses}
          >
            <option value="" disabled>
              Choose a district
            </option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <FieldError id={`${idDistrict}-error`} message={errors.district} />
        </div>
      </div>

      <div>
        <label
          htmlFor={idPhone}
          className="text-ink text-footnote font-medium block mb-2"
        >
          Phone / WhatsApp
        </label>
        <input
          id={idPhone}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="03xx xxxxxxx"
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={errors.phone ? `${idPhone}-error` : undefined}
          className={baseFieldClasses}
        />
        <FieldError id={`${idPhone}-error`} message={errors.phone} />
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-ink text-footnote font-medium mb-1">
          Delivery
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              {
                value: "onsite",
                label: "Onsite",
                body: "In your district, once demand is confirmed",
              },
              {
                value: "online",
                label: "Online",
                body: "Live, remote — no travel needed",
              },
            ] as const
          ).map((opt, i) => (
            <label
              key={opt.value}
              className={cn(
                "border-separator bg-surface-elevated hover:border-separator-opaque has-[input:checked]:border-accent has-[input:checked]:bg-accent-soft/40 has-[input:focus-visible]:ring-accent-ring/40 has-[input:focus-visible]:ring-3 group flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition-colors duration-[var(--dur-fast)]",
              )}
            >
              <input
                type="radio"
                name="deliveryMode"
                value={opt.value}
                defaultChecked={i === 0}
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
              Optional — audience, venue, timing
            </span>
          </span>
        </label>
        <textarea
          id={idNotes}
          name="notes"
          rows={4}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? `${idNotes}-error` : undefined}
          className={cn(baseFieldClasses, "min-h-[6rem] resize-y leading-[1.55]")}
        />
        <FieldError id={`${idNotes}-error`} message={errors.notes} />
      </div>

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
          No commitment — this just tells me where to plan sessions next.
        </p>
      </div>
    </form>
  );
}
