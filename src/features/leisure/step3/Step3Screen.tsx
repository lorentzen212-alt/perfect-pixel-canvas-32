import { BookingHeader } from "@/components/BookingHeader";
import { SmartConfigPanel } from "@/features/leisure/step3/SmartConfigPanel";
import { CONCIERGE_CATEGORIES, SMART_SERVICES } from "@/features/leisure/step3/concierge";
import { S3_BORDER, S3_BORDER_STRONG, S3_GOLD, S3_GOLD_GRADIENT, S3_GOLD_SOFT, S3_GRAPHITE, S3_GRAPHITE_SOFT, S3_PANEL, S3_PANEL_SOFT, S3_TEXT, S3_TEXT_FAINT, S3_TEXT_MUTED, SERIF } from "@/features/leisure/tokens";
import { type ConciergeCategory, type Step3Context, type StepKey } from "@/features/leisure/types";
import { ArrowLeft, ArrowRight, Check, Headphones, Lock, Pencil } from "lucide-react";
import { useState } from "react";

export function LeisureStep3Screen({
  selected,
  onToggle,
  comments,
  setComments,
  recommend: _recommend,
  setRecommend: _setRecommend,
  onNext,
  onBack,
  onStepGo,
  context,
}: {
  selected: Set<string>;
  onToggle: (label: string) => void;
  comments: string;
  setComments: (v: string) => void;
  recommend: boolean;
  setRecommend: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  onStepGo: (s: StepKey) => void;
  context: Step3Context;
}) {
  const [expanded, setExpanded] = useState<string>("arrival");
  const active = CONCIERGE_CATEGORIES.find((c) => c.key === expanded) ?? CONCIERGE_CATEGORIES[0];
  const [serviceConfig, setServiceConfig] = useState<Record<string, Record<string, string>>>({});
  const updateConfig = (label: string, patch: Record<string, string>) =>
    setServiceConfig((prev) => ({ ...prev, [label]: { ...(prev[label] ?? {}), ...patch } }));
  const activeSmartSelections = active.options.filter(
    (o) => selected.has(o.label) && SMART_SERVICES.has(o.label),
  );

  const countFor = (cat: ConciergeCategory) =>
    cat.options.filter(
      (o) => selected.has(o.label) && !o.label.toLowerCase().startsWith("no "),
    ).length;

  return (
    <main
      className="min-h-screen w-full"
      style={{
        background: `radial-gradient(1200px 800px at 50% -10%, ${S3_GRAPHITE_SOFT} 0%, ${S3_GRAPHITE} 45%, #171C22 100%)`,
        fontFamily: "Inter, system-ui, sans-serif",
        color: S3_TEXT,
      }}
    >
      <BookingHeader
        background="transparent"
        currentStep={3}
        onStepGo={(s) => onStepGo(s as StepKey)}
        hideCurrentFlow="leisure"
      />


      <div className="mx-auto w-full max-w-[1360px] px-6 pb-6 pt-8 sm:px-10 lg:px-14 lg:pt-10">
        {/* Header row */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <div
              className="text-[11px] font-medium tracking-[0.34em]"
              style={{ color: S3_GOLD }}
            >
              STEP 3
            </div>
            <h1
              className="mt-4 text-[40px] leading-[1.05] font-medium sm:text-[52px]"
              style={{ fontFamily: SERIF, color: S3_TEXT }}
            >
              Extras
            </h1>
            <p
              className="mt-4 max-w-[560px] text-[15.5px] leading-relaxed"
              style={{ color: S3_TEXT_MUTED }}
            >
              Handpicked services to complete your group experience.
            </p>
          </div>

          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-[13px] font-medium transition-colors"
            style={{
              background: "transparent",
              border: `1px solid ${S3_BORDER_STRONG}`,
              color: S3_TEXT,
            }}
          >
            <Headphones size={15} strokeWidth={1.8} style={{ color: S3_GOLD }} />
            Need Help?
          </button>
        </div>

        {/* Category cards */}
        <div className="mt-14 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-6 lg:gap-2.5">
          {CONCIERGE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = countFor(cat);
            const isSelected = count > 0;
            const isOpen = expanded === cat.key;
            const isElevated = isOpen || isSelected;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setExpanded(cat.key)}
                className="group relative flex flex-col overflow-hidden rounded-[14px] text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px]"
                style={{
                  background: S3_PANEL,
                  border: `1px solid ${isOpen ? S3_GOLD : isSelected ? "rgba(201,164,106,0.65)" : "rgba(255,255,255,0.08)"}`,
                  transform: isOpen ? "translateY(-7px)" : undefined,
                  boxShadow: isOpen
                    ? "0 30px 60px -28px rgba(201,164,106,0.42), 0 18px 38px -22px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(201,164,106,0.18)"
                    : isSelected
                    ? "0 22px 46px -30px rgba(201,164,106,0.35), 0 14px 30px -22px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "0 14px 32px -24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <div className="relative h-[210px] w-full overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
                    style={{
                      filter: isElevated
                        ? "brightness(0.82) contrast(1.05) saturate(0.92) sepia(0.06)"
                        : "brightness(0.72) contrast(1.05) saturate(0.88) sepia(0.06)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(120% 90% at 50% 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%), linear-gradient(180deg, rgba(23,28,34,0) 45%, rgba(23,28,34,0.95) 100%)",
                    }}
                  />
                  {isOpen && (
                    <div
                      className="pointer-events-none absolute inset-x-6 -bottom-8 h-10 rounded-full"
                      style={{
                        background:
                          "radial-gradient(60% 100% at 50% 0%, rgba(201,164,106,0.35) 0%, rgba(201,164,106,0) 70%)",
                        filter: "blur(6px)",
                      }}
                    />
                  )}
                  {isSelected && (
                    <span
                      className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full"
                      style={{
                        background: S3_GOLD_GRADIENT,
                        boxShadow: "0 6px 18px -8px rgba(201,164,106,0.7)",
                      }}
                    >
                      <Check size={12} strokeWidth={3} style={{ color: "#1A1207" }} />
                    </span>
                  )}
                  <div
                    className="absolute left-1/2 bottom-4 grid h-[46px] w-[46px] -translate-x-1/2 place-items-center rounded-full transition-all duration-500"
                    style={{
                      background: "rgba(23,28,34,0.55)",
                      border: `1px solid ${S3_GOLD}`,
                      backdropFilter: "blur(6px)",
                      boxShadow: isOpen
                        ? "0 8px 24px -10px rgba(201,164,106,0.55), inset 0 0 0 1px rgba(255,255,255,0.05)"
                        : "0 6px 18px -12px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.6} style={{ color: S3_GOLD_SOFT }} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-center px-3 pb-4 pt-4 text-center">
                  <div
                    className="text-[13px] font-medium tracking-[0.22em] transition-colors duration-300"
                    style={{ color: isOpen ? "#F6EFDF" : S3_TEXT }}
                  >
                    {cat.title.toUpperCase()}
                  </div>
                  <p
                    className="mt-2 text-[11.5px] leading-[1.45]"
                    style={{ color: S3_TEXT_MUTED }}
                  >
                    {cat.description}
                  </p>
                  <div
                    className="mt-3 text-[10.5px] font-medium tracking-[0.14em]"
                    style={{
                      color: isSelected ? S3_GOLD_SOFT : S3_TEXT_FAINT,
                    }}
                  >
                    {isSelected
                      ? `${count} service${count === 1 ? "" : "s"} selected`
                      : "No services selected"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>



        {/* Configuration area */}
        <section
          className="relative mt-10 overflow-hidden rounded-[18px] p-7 sm:p-8"
          style={{
            background: S3_PANEL_SOFT,
            border: `1px solid ${S3_BORDER}`,
            boxShadow:
              "0 30px 80px -50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* nearly invisible champagne glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 80% at 12% 0%, rgba(201,164,106,0.055) 0%, rgba(201,164,106,0) 60%)",
            }}
          />
          <div className="relative flex items-start gap-4">
            <div
              className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full"
              style={{
                background: S3_PANEL,
                border: `1px solid ${S3_GOLD}`,
                boxShadow: "0 6px 18px -10px rgba(201,164,106,0.45), inset 0 0 0 1px rgba(255,255,255,0.04)",
              }}
            >
              <active.icon size={18} strokeWidth={1.6} style={{ color: S3_GOLD_SOFT }} />
            </div>
            <div className="pt-1">
              <div
                className="text-[15px] font-medium tracking-[0.22em]"
                style={{ color: S3_TEXT }}
              >
                {active.configTitle.toUpperCase()}
              </div>
              <div className="mt-1.5 text-[12.5px]" style={{ color: S3_TEXT_MUTED }}>
                {active.configPrompt}
              </div>
            </div>
          </div>

          {/* metallic gold divider */}
          <div
            aria-hidden
            className="relative mt-6 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(201,164,106,0) 0%, rgba(201,164,106,0.45) 20%, rgba(225,192,137,0.55) 50%, rgba(201,164,106,0.45) 80%, rgba(201,164,106,0) 100%)",
            }}
          />

          <div
            className="relative mt-6 grid gap-2.5"
            style={{
              gridTemplateColumns: `repeat(${active.options.length}, minmax(0, 1fr))`,
            }}
          >
            {active.options.map((opt) => {
              const OptIcon = opt.icon;
              const isOn = selected.has(opt.label);
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onToggle(opt.label)}
                  className="group/opt relative flex h-[104px] flex-col items-center justify-center overflow-hidden rounded-[12px] px-2.5 text-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px]"
                  style={{
                    background: isOn
                      ? "linear-gradient(180deg, rgba(201,164,106,0.12) 0%, rgba(201,164,106,0.05) 100%)"
                      : "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.012) 100%)",
                    border: `1px solid ${isOn ? S3_GOLD : "rgba(255,255,255,0.09)"}`,
                    backdropFilter: "blur(6px)",
                    boxShadow: isOn
                      ? "0 14px 32px -18px rgba(201,164,106,0.55), 0 0 0 1px rgba(201,164,106,0.22), inset 0 1px 0 rgba(255,255,255,0.06)"
                      : "0 6px 18px -14px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0) 100%)",
                    }}
                  />
                  {isOn && (
                    <span
                      className="absolute right-1.5 top-1.5 grid h-[18px] w-[18px] place-items-center rounded-full"
                      style={{ background: S3_GOLD_GRADIENT }}
                    >
                      <Check size={10} strokeWidth={3} style={{ color: "#1A1207" }} />
                    </span>
                  )}
                  <OptIcon
                    size={22}
                    strokeWidth={1.5}
                    style={{
                      color: isOn ? S3_GOLD_SOFT : "rgba(237,231,218,0.72)",
                      transition: "color 300ms",
                    }}
                  />

                  <div
                    className="mt-2.5 text-[11.5px] leading-[1.25]"
                    style={{ color: S3_TEXT }}
                  >
                    {opt.displayLabel ?? opt.label}
                  </div>
                </button>
              );
            })}
          </div>

          {activeSmartSelections.length > 0 && (
            <div className="relative mt-5 space-y-3">
              {activeSmartSelections.map((opt) => (
                <SmartConfigPanel
                  key={opt.label}
                  label={opt.label}
                  displayLabel={opt.displayLabel}
                  cfg={serviceConfig[opt.label] ?? {}}
                  onChange={(patch) => updateConfig(opt.label, patch)}
                  context={context}
                />

              ))}
            </div>
          )}
        </section>




        {/* Additional requests */}
        <section
          className="mt-6 rounded-[18px] px-6 py-5 sm:px-7 sm:py-6"
          style={{
            background: S3_PANEL_SOFT,
            border: `1px solid ${S3_BORDER}`,
            boxShadow:
              "0 30px 80px -50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start">
            <div className="flex items-start gap-4">
              <div
                className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full"
                style={{
                  background: S3_PANEL,
                  border: `1px solid ${S3_GOLD}`,
                }}
              >
                <Pencil size={16} strokeWidth={1.6} style={{ color: S3_GOLD_SOFT }} />
              </div>
              <div className="pt-0.5">
                <div
                  className="text-[13px] font-medium tracking-[0.2em]"
                  style={{ color: S3_TEXT }}
                >
                  ANYTHING ELSE OUR CONCIERGE<br />TEAM SHOULD PREPARE?
                </div>
                <div className="mt-1.5 text-[11.5px]" style={{ color: S3_TEXT_MUTED }}>
                  Share any requirements that are not covered above.
                </div>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Write your request here…"
                rows={3}
                className="w-full resize-none rounded-[12px] px-5 py-4 pr-12 text-[13.5px] outline-none transition-colors"
                style={{
                  background: "transparent",
                  border: `1px solid ${S3_BORDER_STRONG}`,
                  color: S3_TEXT,
                }}
              />
              <Pencil
                size={15}
                strokeWidth={1.6}
                className="pointer-events-none absolute right-4 top-4"
                style={{ color: S3_GOLD_SOFT }}
              />
            </div>
          </div>
        </section>

        {/* Subtle divider */}
        <div
          aria-hidden
          className="mt-4 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0) 100%)",
          }}
        />

        {/* Bottom actions */}
        <div className="mt-3 flex flex-col-reverse items-stretch justify-between gap-6 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full px-8 text-[14px] font-medium transition-colors hover:bg-white/5"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#FFFFFF",
            }}
          >
            <ArrowLeft size={16} strokeWidth={2} style={{ color: "#FFFFFF" }} />
            Back
          </button>


          <div className="flex flex-col items-end gap-[9px]">
            <button
              type="button"
              onClick={onNext}
              className="inline-flex h-[52px] items-center justify-center gap-3 rounded-[26px] px-12 text-[14px] font-semibold tracking-[0.1em] transition-all hover:-translate-y-[1px]"
              style={{
                background:
                  "linear-gradient(180deg, #F0D28A 0%, #D9B36A 45%, #B8894A 100%)",
                color: "#1C1C1C",
                boxShadow:
                  "0 14px 30px -12px rgba(0,0,0,0.55), 0 4px 12px -4px rgba(184,137,74,0.5), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -2px 6px rgba(90,60,20,0.35)",
              }}
            >
              SAVE & CONTINUE
              <ArrowRight size={18} strokeWidth={2.2} />
            </button>
            <div
              className="inline-flex items-center gap-1.5 text-[12px]"
              style={{ color: S3_TEXT_FAINT }}
            >
              <Lock size={11} strokeWidth={2} />
              Your selections are saved automatically.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
