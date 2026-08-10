import { LeisureStepShell } from "@/features/leisure/shell/LeisureStepShell";
import { PHONE_COUNTRIES, S5FieldLabel, S5Input, S5_COUNTRIES, S5_HERO, S5_PANEL_IMAGE, s5FieldStyle } from "@/features/leisure/step5/fields";
import { S5_BORDER, S5_GOLD, S5_GOLD_LIGHT, S5_PLACEHOLDER, S5_SHELL, SERIF } from "@/features/leisure/tokens";
import { type StepKey } from "@/features/leisure/types";
import { hasProfileDetails, isProfileComplete, upsertProfile, useAuth } from "@/lib/auth";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ChevronDown, ShieldCheck, User } from "lucide-react";
import { useState } from "react";

export function LeisureStep5Screen({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  organisation,
  setOrganisation,
  additionalComments,
  setAdditionalComments,
  contactCountry,
  setContactCountry,

  canContinue,
  onNext,
  onBack,
  onStepGo,
}: {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  organisation: string;
  setOrganisation: (v: string) => void;
  additionalComments: string;
  setAdditionalComments: (v: string) => void;
  contactCountry?: string;
  setContactCountry?: (v: string) => void;
  canContinue: boolean;
  onNext: () => void;
  onBack: () => void;
  onStepGo: (s: StepKey) => void;
}) {
  const [dialCode, setDialCode] = useState("+47");
  const [localCountry, setLocalCountry] = useState("");
  const country = contactCountry ?? localCountry;
  const setCountry = setContactCountry ?? setLocalCountry;
  const [commentsFocused, setCommentsFocused] = useState(false);

  const { session, profile } = useAuth();
  const [prefilled, setPrefilled] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(false);
  const canPrefill = hasProfileDetails(profile);
  const profileComplete = isProfileComplete(profile);

  const dial = PHONE_COUNTRIES.find((p) => p.dial === dialCode) ?? PHONE_COUNTRIES[0];

  const applyAccountDetails = () => {
    if (!profile) return;
    const hasTyped =
      firstName.trim() || lastName.trim() || email.trim() || phone.trim() || organisation.trim();
    if (hasTyped && !prefilled) {
      const ok = window.confirm(
        "Replace the contact details you have already entered with your account details?",
      );
      if (!ok) return;
    }
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setEmail(profile.email || session?.user.email || "");
    if (profile.phone) {
      const match = PHONE_COUNTRIES.find((p) => profile.phone!.trim().startsWith(p.dial));
      if (match) {
        setDialCode(match.dial);
        setPhone(profile.phone.trim().slice(match.dial.length).trim());
      } else {
        setPhone(profile.phone);
      }
    }
    setOrganisation(profile.company_name ?? "");
    if (profile.country) {
      const c = S5_COUNTRIES.find(
        (x) =>
          x.code.toLowerCase() === profile.country!.trim().toLowerCase() ||
          x.name.toLowerCase() === profile.country!.trim().toLowerCase(),
      );
      if (c) setCountry(c.code);
    }
    setPrefilled(true);
  };

  const handleContinue = () => {
    if (session && saveToProfile) {
      const countryName = S5_COUNTRIES.find((c) => c.code === country)?.name ?? country;
      void upsertProfile(session.user.id, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim() || session.user.email || "",
        phone: phone.trim() ? `${dialCode} ${phone.trim()}` : null,
        company_name: organisation.trim() || null,
        country: countryName || null,
      });
    }
    onNext();
  };


  return (
    <LeisureStepShell
      activeStep={5}
      onStepGo={onStepGo}
      hideHero
      wide
      hero={S5_HERO}
      chapter="CHAPTER V"
      headline={
        <>
          Who should<br />we write to?
        </>
      }
      subtext={<>We'll send tailored offers to this person.</>}
    >
      <section
        className="mx-auto w-full max-w-[1450px] overflow-hidden rounded-[24px]"
        style={{
          backgroundColor: S5_SHELL,
          border: `1px solid ${S5_BORDER}`,
          boxShadow: "0 50px 110px -50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[24%_76%]">
          {/* ---------- LEFT: editorial ---------- */}
          <div
            className="relative flex min-h-[300px] flex-col justify-start overflow-hidden px-[34px] py-[36px] lg:min-h-full"
            style={{ borderRight: `1px solid ${S5_BORDER}` }}
          >
            <img
              src={S5_PANEL_IMAGE}
              alt="Matte black architectural wall with champagne gold light strip and gold branch arrangement"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "58% 78%" }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(6,10,16,0.28) 0%, rgba(6,10,16,0.12) 30%, rgba(6,10,16,0) 60%)",
              }}
            />
            <div className="relative z-10 max-w-[230px]">
              <div
                className="text-[10.5px] font-medium uppercase tracking-[0.38em]"
                style={{ color: S5_GOLD }}
              >
                Chapter V
              </div>
              <h1
                className="mt-4 text-[32px] leading-[1.07] font-medium text-white lg:text-[36px]"
                style={{ fontFamily: SERIF }}
              >
                Who should<br />we write to?
              </h1>
              <div
                className="mt-5 h-px w-[62px]"
                style={{ background: `linear-gradient(90deg, ${S5_GOLD}, rgba(201,164,92,0))` }}
              />
              <p
                className="mt-5 max-w-[240px] text-[14px] leading-[1.6]"
                style={{ color: "rgba(240,235,224,0.62)" }}
              >
                We'll send tailored offers to this person.
              </p>
            </div>
          </div>


          {/* ---------- RIGHT: form ---------- */}
          <div className="px-7 py-8 sm:px-10 lg:px-12 lg:py-9">
            <h2
              className="text-[28px] leading-tight font-medium text-white lg:text-[31px]"
              style={{ fontFamily: SERIF }}
            >
              Step 5 – Contact
            </h2>
            <p className="mt-1.5 text-[13.5px]" style={{ color: "rgba(240,235,224,0.55)" }}>
              Who should we contact?
            </p>

            {session && (
              <div
                className="mt-5 flex flex-col gap-3 rounded-[14px] px-5 py-3 sm:h-[64px] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-0"
                style={{
                  backgroundColor: "rgba(8,17,28,0.75)",
                  border: `1px solid ${S5_BORDER}`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <User size={20} strokeWidth={1.6} className="shrink-0" style={{ color: S5_GOLD }} />
                  <div className="min-w-0">
                    <p
                      className="text-[13.5px] font-medium leading-tight"
                      style={{ color: S5_GOLD_LIGHT, fontFamily: SERIF }}
                    >
                      {canPrefill ? "Use your account details" : "Complete your profile"}
                    </p>
                    <p
                      className="mt-0.5 truncate text-[12.5px] leading-tight"
                      style={{ color: "rgba(240,235,224,0.55)" }}
                    >
                      {canPrefill
                        ? "Fill the form using your HotelGroupBook profile."
                        : "Add your details once and reuse them — or just fill in the form below."}
                    </p>
                  </div>
                </div>
                {canPrefill ? (
                  prefilled ? (
                    <span
                      className="shrink-0 text-[12.5px] font-medium tracking-[0.06em]"
                      style={{ color: S5_GOLD }}
                    >
                      ✓ Account details added
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={applyAccountDetails}
                      className="shrink-0 rounded-[10px] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
                      style={{
                        background:
                          "linear-gradient(180deg, #EBD08A 0%, #D3B063 48%, #B58F42 100%)",
                        color: "#1B1408",
                        boxShadow: "0 12px 26px -16px rgba(201,164,92,0.7), inset 0 1px 0 rgba(255,255,255,0.45)",
                        transition: "all 250ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      Use my account details
                    </button>
                  )
                ) : (
                  <Link
                    to="/account"
                    className="shrink-0 rounded-[10px] px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-[250ms] hover:-translate-y-[2px]"
                    style={{ border: `1px solid rgba(201,164,92,0.5)`, color: S5_GOLD_LIGHT }}
                  >
                    Complete profile
                  </Link>
                )}
              </div>
            )}

            {/* Fields grid: 20px column gap / 16px row gap */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2" style={{ columnGap: 20, rowGap: 16 }}>
              <div>
                <S5FieldLabel>First Name</S5FieldLabel>
                <S5Input value={firstName} onChange={setFirstName} placeholder="Enter first name" />
              </div>
              <div>
                <S5FieldLabel>Last Name</S5FieldLabel>
                <S5Input value={lastName} onChange={setLastName} placeholder="Enter last name" />
              </div>

              <div>
                <S5FieldLabel>Email</S5FieldLabel>
                <S5Input value={email} onChange={setEmail} placeholder="Enter email address" type="email" />
              </div>
              <div>
                <S5FieldLabel>Phone</S5FieldLabel>
                <div
                  className="flex h-[50px] items-stretch overflow-hidden rounded-[12px]"
                  style={s5FieldStyle(false)}
                >
                  <div
                    className="relative flex items-center gap-2 pl-5 pr-3"
                    style={{ borderRight: `1px solid ${S5_BORDER}` }}
                  >
                    <span className="text-[17px] leading-none">{dial.flag}</span>
                    <span className="text-[13.5px] font-medium tracking-[0.04em]" style={{ color: "#F5F1E6" }}>
                      {dial.dial}
                    </span>
                    <ChevronDown size={14} style={{ color: S5_GOLD }} />
                    <select
                      value={dialCode}
                      onChange={(e) => setDialCode(e.target.value)}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      aria-label="Country code"
                    >
                      {PHONE_COUNTRIES.map((p) => (
                        <option key={p.code} value={p.dial} style={{ color: "#000" }}>
                          {p.flag} {p.name} ({p.dial})
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter number"
                    className="s5-input flex-1 bg-transparent px-5 text-[14.5px] outline-none"
                    style={{ color: "#F5F1E6" }}
                  />
                </div>
              </div>

              <div>
                <S5FieldLabel optional>Organisation / Group Name</S5FieldLabel>
                <S5Input
                  value={organisation}
                  onChange={setOrganisation}
                  placeholder="Enter organisation or group name"
                />
              </div>
              <div>
                <S5FieldLabel optional>Country (Optional)</S5FieldLabel>
                <div className="relative h-[50px] rounded-[12px]" style={s5FieldStyle(false)}>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="h-full w-full cursor-pointer appearance-none bg-transparent px-5 pr-12 text-[14.5px] outline-none"
                    style={{ color: country ? "#F5F1E6" : S5_PLACEHOLDER }}
                  >
                    <option value="" style={{ color: "#000" }}>
                      Select country
                    </option>
                    {S5_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} style={{ color: "#000" }}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2"
                    style={{ color: S5_GOLD }}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <S5FieldLabel optional>Additional Comments</S5FieldLabel>
                <textarea
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  onFocus={() => setCommentsFocused(true)}
                  onBlur={() => setCommentsFocused(false)}
                  placeholder="Let us know anything we should know…"
                  rows={4}
                  className="s5-input w-full resize-y rounded-[12px] px-5 py-3 text-[14.5px] leading-relaxed outline-none"
                  style={{ ...s5FieldStyle(commentsFocused), height: 120, minHeight: 120 }}
                />
              </div>
            </div>

            {session && !profileComplete && (
              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={saveToProfile}
                  onChange={(e) => setSaveToProfile(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A45C]"
                />
                <span className="text-[13px]" style={{ color: "rgba(240,235,224,0.65)" }}>
                  Save these details to my HotelGroupBook profile
                </span>
              </label>
            )}

            {/* Footer row: back / reassurance / continue */}
            <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex shrink-0 items-center gap-2.5 text-[14.5px] transition-all duration-[250ms] hover:opacity-80"
                style={{ color: S5_GOLD }}
              >
                <ArrowLeft size={16} strokeWidth={2} />
                Back
              </button>

              <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center">
                <div className="flex items-center gap-2 text-[13px]">
                  <ShieldCheck size={15} strokeWidth={1.8} style={{ color: S5_GOLD }} />
                  <span style={{ color: S5_GOLD }}>Your request is free and non-binding.</span>
                </div>
                <div className="text-[12px]" style={{ color: "rgba(240,235,224,0.42)" }}>
                  We find the best hotel options so you can choose what suits your group.
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue}
                className="inline-flex shrink-0 items-center gap-3 rounded-[14px] px-8 py-[15px] text-[12.5px] font-semibold uppercase tracking-[0.18em] transition-all duration-[250ms] hover:-translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
                style={{
                  background: "linear-gradient(180deg, #EBD08A 0%, #D3B063 48%, #B58F42 100%)",
                  color: "#1B1408",
                  boxShadow:
                    "0 22px 48px -20px rgba(201,164,92,0.75), inset 0 1px 0 rgba(255,255,255,0.45)",
                }}
              >
                Continue to review
                <ArrowRight size={17} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </LeisureStepShell>
  );
}
