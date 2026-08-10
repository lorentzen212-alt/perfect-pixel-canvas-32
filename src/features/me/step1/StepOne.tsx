import { Field } from "@/features/me/common/Field";
import { NextButton } from "@/features/me/common/buttons";
import { FlagNO } from "@/features/me/common/flags";
import { GOLD, SERIF } from "@/features/me/tokens";
import type { FormState } from "@/features/me/types";
import { hasProfileDetails, useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";
import { Calendar as CalendarIcon, ChevronDown, Phone } from "lucide-react";
import React from "react";
import { useState } from "react";

/* Lets a signed-in customer reuse their saved HotelGroupBook profile details. */
export function AccountPrefillPanel({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const { session, profile } = useAuth();
  const [prefilled, setPrefilled] = useState(false);
  if (!session) return null;
  const canPrefill = hasProfileDetails(profile);

  const apply = () => {
    const typed = form.contactPerson.trim() || form.email.trim() || form.company.trim();
    if (
      typed &&
      typeof window !== "undefined" &&
      !window.confirm("Replace the contact details you've already entered with your account details?")
    )
      return;
    setForm((s) => ({
      ...s,
      contactPerson:
        [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
        s.contactPerson,
      email: profile?.email || s.email,
      phone: profile?.phone || s.phone,
      company: profile?.company_name || s.company,
    }));
    setPrefilled(true);
  };

  return (
    <div
      className="mt-6 flex flex-col gap-3 rounded-[12px] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
      style={{ backgroundColor: "#FBF7EE", border: "1px solid rgba(184,138,46,0.28)" }}
    >
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold" style={{ color: "#0A1B2C" }}>
          {canPrefill ? "Use your account details?" : "Complete your profile"}
        </p>
        <p className="mt-0.5 text-[12.5px]" style={{ color: "#4A5866" }}>
          {canPrefill
            ? "We can fill in your contact information from your HotelGroupBook profile."
            : "Add your details once in your profile and reuse them on every request."}
        </p>
      </div>
      {canPrefill ? (
        prefilled ? (
          <span className="shrink-0 text-[12.5px] font-semibold" style={{ color: "#B88A2E" }}>
            ✓ Account details added
          </span>
        ) : (
          <button
            type="button"
            onClick={apply}
            className="shrink-0 rounded-[8px] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(180deg, #E7C878 0%, #C5A24B 55%, #A9853A 100%)",
              color: "#20180A",
            }}
          >
            Use my account details
          </button>
        )
      ) : (
        <Link
          to="/account"
          className="shrink-0 rounded-[8px] px-4 py-2 text-center text-[12px] font-semibold uppercase tracking-[0.12em]"
          style={{ border: "1px solid rgba(184,138,46,0.5)", color: "#B88A2E" }}
        >
          Complete profile
        </Link>
      )}
    </div>
  );
}

/* --------- Step 1 --------- */

export function StepOne({
  form,
  setForm,
  errors,
  onNext,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="flex items-start gap-5">
        <span
          className="hidden sm:inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "#F5EFE1" }}
        >
          <CalendarIcon size={24} strokeWidth={1.75} style={{ color: "#B88A2E" }} />
        </span>
        <div>
          <h2
            className="text-[#0A1B2C] text-3xl lg:text-[34px] leading-tight"
            style={{ fontFamily: SERIF }}
          >
            Step 1 – Event Details
          </h2>
          <div className="mt-2 h-[2px] w-16" style={{ backgroundColor: GOLD }} />
          <p className="mt-4 text-[#4A5866] text-[15px] max-w-xs leading-relaxed">
            Please provide basic information
            <br />
            about your event.
          </p>
        </div>
      </div>

      <AccountPrefillPanel form={form} setForm={setForm} />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">

        <Field
          label="Event name"
          required
          value={form.eventName}
          onChange={(v) => setForm((s) => ({ ...s, eventName: v }))}
          placeholder="Enter event name"
          error={errors.eventName}
        />
        <Field
          label="Company / Organization"
          required
          value={form.company}
          onChange={(v) => setForm((s) => ({ ...s, company: v }))}
          placeholder="Enter company / organization"
          error={errors.company}
        />
        <Field
          label="Contact person"
          required
          value={form.contactPerson}
          onChange={(v) => setForm((s) => ({ ...s, contactPerson: v }))}
          placeholder="Enter contact person"
          error={errors.contactPerson}
        />
        <Field
          label="Email"
          required
          type="email"
          value={form.email}
          onChange={(v) => setForm((s) => ({ ...s, email: v }))}
          placeholder="Enter email address"
          error={errors.email}
        />
        <div>
          <label className="block text-[14px] font-semibold text-[#0A1B2C]">
            Phone <span style={{ color: "#D64545" }}>*</span>
          </label>
          <div className="mt-2 flex gap-2">
            <div
              className="flex items-center gap-2 rounded-md border px-3 h-[46px] bg-white"
              style={{ borderColor: errors.phone ? "#D64545" : "#D9D3C4" }}
            >
              <FlagNO />
              <span className="text-[15px] text-[#0A1B2C]">{form.countryCode}</span>
              <ChevronDown size={16} className="text-[#4A5866]" />
            </div>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
              placeholder="123 45 678"
              className="flex-1 rounded-md border px-4 h-[46px] text-[15px] text-[#0A1B2C] outline-none focus:border-[#B88A2E] bg-white"
              style={{ borderColor: errors.phone ? "#D64545" : "#D9D3C4" }}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-[12px]" style={{ color: "#D64545" }}>
              {errors.phone}
            </p>
          )}
        </div>

        <div className="flex items-end justify-end">
          <NextButton onClick={onNext} label="Next Step" />
        </div>
      </div>
    </div>
  );
}
