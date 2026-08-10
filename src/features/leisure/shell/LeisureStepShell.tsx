import { BookingHeader } from "@/components/BookingHeader";
import { S1_BORDER_SOFT, S1_GOLD, S1_GOLD_SOFT, S1_NAVY, SERIF } from "@/features/leisure/tokens";
import { type StepKey } from "@/features/leisure/types";
import { Check, Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

export function LeisureStepShell({
  activeStep,
  onStepGo,
  children,
  hero,
  chapter,
  headline,
  subtext,
  rightSidebar,
  enhancedHero = false,
  pageBg,
  heroOverlay,
  hideHero = false,
  wide = false,
  ultraWide = false,
}: {
  activeStep: StepKey;
  onStepGo: (s: StepKey) => void;
  children: React.ReactNode;
  hero: string;
  chapter: string;
  headline: React.ReactNode;
  subtext: React.ReactNode;
  rightSidebar?: React.ReactNode;
  enhancedHero?: boolean;
  pageBg?: string;
  heroOverlay?: React.ReactNode;
  hideHero?: boolean;
  wide?: boolean;
  ultraWide?: boolean;


}) {
  const gridCols = hideHero
    ? "lg:grid-cols-1"
    : rightSidebar
    ? "lg:grid-cols-[minmax(220px,0.68fr)_minmax(640px,2.10fr)_minmax(290px,0.92fr)]"
    : "lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)]";

  return (
    <main
      className="min-h-screen w-full"
      style={{
        background: pageBg ?? S1_NAVY,
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#F5F1E6",
      }}
    >
      <BookingHeader
        background="transparent"
        currentStep={activeStep}
        onStepGo={(s) => onStepGo(s as StepKey)}
        hideCurrentFlow="leisure"
      />


      <div className={`mx-auto grid ${hideHero ? (ultraWide ? "max-w-[1780px] py-8 lg:py-10" : wide ? "max-w-[1500px] py-8 lg:py-10" : "max-w-[1240px] py-4 lg:py-5") : "max-w-[1680px] py-10 lg:py-14"} grid-cols-1 gap-6 px-6 ${gridCols} lg:gap-7 lg:px-8`}>

        {!hideHero && (
        <aside
          className="relative overflow-hidden rounded-[24px] min-h-[520px] lg:min-h-[820px] order-3 lg:order-none"

          style={{
            border: `1px solid ${S1_BORDER_SOFT}`,
            boxShadow: "0 40px 80px -40px rgba(0,0,0,0.6)",
          }}
        >
          <img src={hero} alt="" className={`absolute inset-0 h-full w-full object-cover ${enhancedHero ? "s4-hero-img" : ""}`} />
          {enhancedHero && (
            <>
              <div className="pointer-events-none absolute inset-0 s4-hero-vignette" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[160px] s4-hero-edgefade" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] s4-hero-baselift" />
            </>
          )}
          <div
            className="absolute inset-0"
            style={{
              background: enhancedHero
                ? "linear-gradient(180deg, rgba(8,19,31,0.18) 0%, rgba(8,19,31,0.28) 55%, rgba(8,19,31,0.62) 100%)"
                : "linear-gradient(180deg, rgba(8,19,31,0.35) 0%, rgba(8,19,31,0.48) 55%, rgba(8,19,31,0.86) 100%)",
            }}
          />

          {heroOverlay ? (
            <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-end p-8 sm:p-10 lg:min-h-[820px] lg:p-12">
              {heroOverlay}
            </div>
          ) : (
          <div className="relative z-10 h-full min-h-[520px] p-8 sm:p-10 lg:min-h-[820px] lg:p-12">
            <div className="flex h-full flex-col justify-between lg:ml-[15px] lg:mt-[10px]">

              <div>
                <div className="text-[11px] font-medium tracking-[0.32em]" style={{ color: S1_GOLD_SOFT }}>
                  {chapter}
                </div>
                <h1
                  className="mt-6 text-[42px] sm:text-[52px] lg:text-[60px] leading-[1.02] font-medium text-white"
                  style={{ fontFamily: SERIF }}
                >
                  {headline}
                </h1>
                <div
                  className="mt-6 h-[2px] w-[64px] rounded-full"
                  style={{ background: `linear-gradient(90deg, ${S1_GOLD}, ${S1_GOLD_SOFT})` }}
                />
                <p className="mt-6 max-w-[360px] text-[15.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.82)" }}>
                  {subtext}
                </p>
              </div>

              {enhancedHero ? (
                <div
                  className="mt-8 rounded-[16px] px-5 py-4 sm:px-6"
                  style={{
                    background: "linear-gradient(180deg, rgba(18,34,52,0.46) 0%, rgba(8,19,31,0.56) 100%)",
                    backdropFilter: "blur(10px) saturate(120%)",
                    borderTop: `1px solid rgba(232,199,117,0.55)`,
                    borderLeft: "1px solid rgba(255,255,255,0.08)",
                    borderRight: "1px solid rgba(255,255,255,0.08)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)",
                  }}
                >
                  <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
                    {["One request.", "Multiple offers.", "The perfect trip."].map((t, i) => (
                      <div key={t} className="flex items-center gap-4">
                        {i > 0 && (
                          <span
                            className="hidden h-[5px] w-[5px] flex-shrink-0 rounded-full sm:block"
                            style={{
                              background: `linear-gradient(135deg, ${S1_GOLD_SOFT}, ${S1_GOLD})`,
                            }}
                          />
                        )}
                        <span className="whitespace-nowrap text-[13px] leading-none text-white/95 lg:text-[13.5px]">{t}</span>
                      </div>
                    ))}
                  </div>

                </div>
              ) : (
                <ul className="space-y-3.5 pt-8">
                  {["One request.", "Multiple offers.", "The perfect trip."].map((t) => (
                    <li key={t} className="flex items-center gap-3 text-[15px] text-white/95">
                      <span
                        className="grid h-6 w-6 place-items-center rounded-full"
                        style={{
                          backgroundColor: "rgba(212,166,74,0.14)",
                          border: `1px solid ${S1_GOLD}`,
                        }}
                      >
                        <Check size={12} strokeWidth={2.6} style={{ color: S1_GOLD_SOFT }} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              )}

            </div>
          </div>
          )}
        </aside>
        )}


        <div className="order-1 lg:order-none min-w-0">{children}</div>

        {rightSidebar && (
          <div className="order-2 lg:order-none min-w-0 lg:sticky lg:top-6 lg:self-start">{rightSidebar}</div>
        )}


      </div>
    </main>
  );
}

export function DarkCheckbox({
  label,
  checked,
  onChange,
  align = "left",
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  align?: "left" | "center";
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-3 text-[13px] transition-colors"
      style={{ color: "#F5F1E6", textAlign: align, lineHeight: 1.35 }}
    >
      <span
        className="grid h-6 w-6 place-items-center rounded-lg transition-all duration-200 ease-out group-hover:scale-[1.06]"
        style={{
          background: checked
            ? `linear-gradient(135deg, ${S1_GOLD_SOFT} 0%, ${S1_GOLD} 55%, #B88C2F 100%)`
            : S1_NAVY,
          border: `1px solid ${checked ? S1_GOLD : "rgba(245,241,230,0.22)"}`,
          boxShadow: checked
            ? "inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 16px -8px rgba(212,166,74,0.55)"
            : "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {checked && <Check size={14} strokeWidth={2.8} style={{ color: S1_NAVY }} />}
      </span>
      {label}
    </button>
  );
}

export function RoomCounter({
  value,
  onChange,
  onClickStop,
  ariaLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  onClickStop?: (e: React.MouseEvent) => void;
  ariaLabel?: string;
}) {
  const disabled = value === 0;
  const [text, setText] = useState<string>(String(value));
  React.useEffect(() => {
    setText(String(value));
  }, [value]);

  const commit = (raw: string) => {
    const cleaned = raw.replace(/[^\d]/g, "");
    if (cleaned === "") {
      onChange(0);
      setText("0");
      return;
    }
    const n = Math.max(0, parseInt(cleaned, 10) || 0);
    onChange(n);
    setText(String(n));
  };

  return (
    <div
      className="flex items-center justify-end shrink-0"
      style={{ gap: 4, paddingRight: 2 }}
      onClick={onClickStop}
    >
      <button
        type="button"
        aria-label={ariaLabel ? `Decrease ${ariaLabel}` : "Decrease"}
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={disabled}
        className="grid h-[26.5px] w-[26.5px] shrink-0 place-items-center rounded-full transition-all duration-200 hover:bg-white/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold-soft)]"
        style={{ color: S1_GOLD_SOFT, opacity: disabled ? 0.35 : 1, ["--gold-soft" as never]: S1_GOLD_SOFT }}
      >
        <Minus size={13} strokeWidth={2.2} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={ariaLabel ? `${ariaLabel} quantity` : "Quantity"}
        value={text}
        onClick={(e) => {
          e.stopPropagation();
          (e.currentTarget as HTMLInputElement).select();
        }}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d]/g, "");
          setText(v);
          if (v !== "") onChange(Math.max(0, parseInt(v, 10) || 0));
        }}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).blur();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            onChange(value + 1);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            onChange(Math.max(0, value - 1));
          }
        }}
        className="no-spin h-[30.5px] w-[34.5px] rounded-[9px] text-center text-[14px] font-medium text-white outline-none transition-all duration-200 focus:border-[color:var(--gold)]"
        style={{
          fontFamily: SERIF,
          backgroundColor: "rgba(6,16,26,0.85)",
          border: "1px solid rgba(212,166,74,0.32)",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.35)",
          ["--gold" as never]: S1_GOLD,
        }}
      />
      <button
        type="button"
        aria-label={ariaLabel ? `Increase ${ariaLabel}` : "Increase"}
        onClick={() => onChange(value + 1)}
        className="grid h-[26.5px] w-[26.5px] shrink-0 place-items-center rounded-full transition-all duration-200 hover:bg-white/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold-soft)]"
        style={{ color: S1_GOLD_SOFT, opacity: 0.9, ["--gold-soft" as never]: S1_GOLD_SOFT }}
      >
        <Plus size={13} strokeWidth={2.2} />
      </button>
    </div>
  );
}
