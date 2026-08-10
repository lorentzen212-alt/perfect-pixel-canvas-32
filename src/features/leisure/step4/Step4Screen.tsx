import s4AuroraHeroImg from "@/assets/s4-aurora-hero.png.asset.json";
import { LeisureStepShell } from "@/features/leisure/shell/LeisureStepShell";
import { S1_GOLD_SOFT, SERIF } from "@/features/leisure/tokens";
import { type Step4Exp, type StepKey } from "@/features/leisure/types";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, CalendarDays, Check, Info, Plus, ShieldCheck, Sparkles, X } from "lucide-react";
import { useRef, useState } from "react";

export const S4_HERO = s4AuroraHeroImg.url;

export const STEP4_CATEGORIES = [
  "All",
  "Nature & Adventure",
  "Winter",
  "Culture & Sightseeing",
  "Food & Drink",
  "Group Activities",
];

export const STEP4_EXPERIENCES: Step4Exp[] = [
  {
    label: "Northern Lights",
    category: "Winter",
    img: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Fjord Cruise",
    category: "Nature & Adventure",
    img: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Hiking Adventure",
    category: "Nature & Adventure",
    img: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Ski Experience",
    category: "Winter",
    img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "City Walking Tour",
    category: "Culture & Sightseeing",
    img: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Local Food Experience",
    category: "Food & Drink",
    img: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Whale Safari",
    category: "Nature & Adventure",
    img: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Brewery Tour",
    category: "Food & Drink",
    img: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&w=900&q=80",
  },
];

export function LeisureStep4Screen({
  category,
  setCategory,
  selected,
  onToggle,
  letUsRecommend,
  setLetUsRecommend,
  preferredDate,
  setPreferredDate,
  dateFlexible,
  setDateFlexible,
  additionalRequests,
  setAdditionalRequests,
  onNext,
  onBack,
  onStepGo,
}: {
  category: string;
  setCategory: (c: string) => void;
  selected: Set<string>;
  onToggle: (label: string) => void;
  letUsRecommend: boolean;
  setLetUsRecommend: (v: boolean) => void;
  preferredDate: Date | undefined;
  setPreferredDate: (d: Date | undefined) => void;
  dateFlexible: boolean;
  setDateFlexible: (v: boolean) => void;
  additionalRequests: string;
  setAdditionalRequests: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  onStepGo: (s: StepKey) => void;
}) {
  const filtered = STEP4_EXPERIENCES.filter(
    (e) => category === "All" || e.category === category,
  );
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [hoveredExp, setHoveredExp] = useState<Step4Exp | null>(null);

  const handleToggleExp = (label: string) => {
    if (!selected.has(label) && letUsRecommend) setLetUsRecommend(false);
    onToggle(label);
  };

  const S4_INK = "#12212E";
  const S4_MUTED = "rgba(18,33,46,0.60)";
  const S4_HAIR = "rgba(201,164,92,0.28)";
  const S4_GOLD = "#C9A45C";
  const S4_GOLD_LT = "#E3CB94";

  const summaryLines = (
    <div className="space-y-6">
      <div>
        <div
          className="text-[19px] font-medium text-white"
          style={{ fontFamily: SERIF }}
        >
          Selected Experiences
        </div>
        <div
          className="mt-3 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(232,199,117,0.55), rgba(232,199,117,0.12) 70%, transparent)",
          }}
        />
      </div>

      {selected.size === 0 ? (
        <div
          key={letUsRecommend ? "concierge" : "empty"}
          className="s4-sum-state flex min-h-[168px] flex-col items-center justify-center rounded-[16px] px-5 py-7 text-center"
          style={{
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(232,199,117,0.22)",
          }}
        >
          <Sparkles
            size={20}
            strokeWidth={1.6}
            className={letUsRecommend ? "s4-sum-sparkle" : undefined}
            style={{ color: S1_GOLD_SOFT, margin: "0 auto" }}
          />
          <div
            className="mt-3 text-[15px] text-white"
            style={{ fontFamily: SERIF }}
          >
            {letUsRecommend ? "Concierge Curation" : "Your itinerary"}
          </div>
          {!letUsRecommend && (
            <div
              className="mt-1.5 text-[12px] uppercase tracking-[0.16em]"
              style={{ color: "rgba(232,199,117,0.72)" }}
            >
              0 experiences selected
            </div>
          )}
          <div
            className="mt-2.5 text-[12px] leading-[1.6]"
            style={{ color: "rgba(245,241,230,0.55)" }}
          >
            {letUsRecommend
              ? "Our specialists will hand-pick the perfect experiences for your group."
              : "Choose experiences to personalise your group’s stay."}
          </div>
        </div>

      ) : (
        <div className="flex flex-col gap-2.5">
          {Array.from(selected).map((label) => {
            const exp = STEP4_EXPERIENCES.find((x) => x.label === label);
            return (
              <div
                key={label}
                className="s4-sum-row flex items-center gap-3 rounded-[14px] p-2.5 pr-3"
                style={{
                  background: "rgba(212,166,74,0.08)",
                  border: "1px solid rgba(232,199,117,0.26)",
                }}
              >
                {exp && (
                  <img
                    src={exp.img}
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-[10px] object-cover"
                    style={{ border: "1px solid rgba(232,199,117,0.30)" }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div
                    className="line-clamp-2 text-[13.5px] leading-[1.3] text-white"
                    style={{ fontFamily: SERIF }}
                  >
                    {label}
                  </div>
                  <div
                    className="mt-[3px] text-[10.5px] uppercase tracking-[0.14em]"
                    style={{ color: "rgba(232,199,117,0.66)" }}
                  >
                    {exp?.category ?? "Experience"} · ×1
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${label}`}
                  onClick={() => onToggle(label)}
                  className="s4-sum-remove grid h-7 w-7 shrink-0 place-items-center rounded-full"
                  style={{
                    border: "1px solid rgba(232,199,117,0.30)",
                    color: "rgba(245,241,230,0.6)",
                  }}
                >
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            );
          })}
        </div>

      )}

      {(preferredDate || dateFlexible || additionalRequests.trim().length > 0) && (
        <div
          className="space-y-4 pt-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}
        >
          {preferredDate && (
            <div className="flex items-start gap-3">
              <CalendarDays
                size={15}
                strokeWidth={1.8}
                style={{ color: S1_GOLD_SOFT, marginTop: 2 }}
              />
              <div>
                <div
                  className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "rgba(245,241,230,0.5)" }}
                >
                  Preferred date
                </div>
                <div className="mt-1 text-[13.5px] text-white">
                  {format(preferredDate, "PPP")}
                </div>
              </div>
            </div>
          )}
          {dateFlexible && (
            <div className="flex items-start gap-3">
              <Sparkles
                size={15}
                strokeWidth={1.8}
                style={{ color: S1_GOLD_SOFT, marginTop: 2 }}
              />
              <div>
                <div
                  className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "rgba(245,241,230,0.5)" }}
                >
                  Flexibility
                </div>
                <div className="mt-1 text-[13.5px] text-white">
                  Open to alternative dates
                </div>
              </div>
            </div>
          )}
          {additionalRequests.trim().length > 0 && (
            <div className="flex items-start gap-3">
              <Info
                size={15}
                strokeWidth={1.8}
                style={{ color: S1_GOLD_SOFT, marginTop: 2 }}
              />
              <div className="min-w-0">
                <div
                  className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "rgba(245,241,230,0.5)" }}
                >
                  Concierge notes
                </div>
                <div
                  className="mt-1 line-clamp-3 text-[13.5px] text-white"
                  style={{ lineHeight: 1.5 }}
                >
                  {additionalRequests.trim()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const recommended = STEP4_EXPERIENCES.find((e) => e.label === "Northern Lights")!;
  const recommendedActive = selected.has(recommended.label);

  const goldRule = (
    <div
      className="h-px w-full"
      style={{
        background:
          "linear-gradient(90deg, rgba(232,199,117,0.62), rgba(232,199,117,0.16) 62%, transparent)",
      }}
    />
  );

  return (
    <LeisureStepShell
      activeStep={4}
      onStepGo={onStepGo}
      hero={S4_HERO}
      chapter="CHAPTER IV"
      headline={null}
      subtext={null}
      hideHero
      wide
      ultraWide
    >
      <div
        className="relative grid grid-cols-1 items-stretch overflow-hidden rounded-[26px] lg:grid-cols-[24.9fr_54.6fr_20.5fr]"
        style={{
          background: "#F7F3EA",
          border: "1px solid rgba(201,164,92,0.30)",
          boxShadow:
            "0 60px 120px -55px rgba(6,16,26,0.72), 0 18px 44px -34px rgba(6,16,26,0.45)",
        }}
      >
        {/* ---------- HERO + CENTER + SUMMARY: one premium composition ---------- */}

          {/* ---------- LEFT HERO ---------- */}
          <aside className="relative order-2 min-h-[380px] overflow-hidden lg:order-none lg:overflow-visible">
            <img
              src={S4_HERO}
              alt="Northern lights over a fjord terrace with fire pit"
              className="absolute top-0 left-0 h-full w-full object-cover lg:w-[calc(100%+80px)]"
            />
            {hoveredExp && hoveredExp.label !== "Northern Lights" && (
              <img
                key={hoveredExp.label}
                src={hoveredExp.img}
                alt=""
                aria-hidden
                className="s4-hero-swap absolute top-0 left-0 h-full w-full object-cover lg:w-[calc(100%+80px)]"
              />
            )}
            {/* subtle navy readability veil (~22%) */}
            <div
              className="absolute top-0 left-0 h-full w-full lg:w-[calc(100%+80px)]"
              style={{ background: "rgba(8,19,31,0.22)" }}
            />
            <div
              className="absolute bottom-0 left-0 h-[52%] w-full lg:w-[calc(100%+80px)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(8,19,31,0) 0%, rgba(8,19,31,0.18) 55%, rgba(8,19,31,0.42) 100%)",
              }}
            />
            <div className="relative z-10 flex h-full flex-col justify-end p-9 lg:p-11">
              <div
                className="text-[11px] font-medium uppercase tracking-[0.30em]"
                style={{ color: S4_GOLD_LT, textShadow: "0 1px 8px rgba(4,12,20,0.7)" }}
              >
                Step 4 of 6
              </div>
              <h1
                className="mt-4 text-[40px] leading-[1.04] text-white lg:text-[46px]"
                style={{
                  fontFamily: SERIF,
                  fontWeight: 500,
                  textShadow: "0 2px 18px rgba(4,12,20,0.6)",
                }}
              >
                Experiences
              </h1>
              <div className="mt-5 flex items-center gap-2.5">
                <span
                  className="h-px w-[70px]"
                  style={{ background: `linear-gradient(90deg, ${S4_GOLD_LT}, transparent)` }}
                />
                <span
                  className="block h-[6px] w-[6px] rotate-45"
                  style={{ background: `linear-gradient(135deg, ${S4_GOLD_LT}, ${S4_GOLD})` }}
                />
              </div>
              <p
                className="mt-5 max-w-[300px] text-[15px] leading-[1.7]"
                style={{ color: "rgba(255,255,255,0.9)", textShadow: "0 1px 10px rgba(4,12,20,0.6)" }}
              >
                Create unforgettable moments for your group.
              </p>
            </div>
          </aside>


        {/* ---------- CENTER ---------- */}
        <section
          className="relative z-[2] order-1 min-w-0 px-7 py-9 sm:px-10 sm:py-10 lg:order-none lg:px-[54px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(247,243,234,0) 0%, rgba(245,241,231,0.12) 70px, rgba(243,239,227,0.5) 150px, rgba(243,239,227,0.86) 230px, rgba(243,239,227,0) 320px), radial-gradient(120% 80% at 50% 0%, #FBF8F1 0%, #F5F1E7 60%, #EFEADE 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
            color: S4_INK,
          }}
        >


          <header className="text-center">
            <h2
              className="text-[32px] leading-[1.1] sm:text-[38px]"
              style={{ fontFamily: SERIF, color: S4_INK, fontWeight: 500 }}
            >
              Add experiences for your group
            </h2>
            <p className="mx-auto mt-2.5 max-w-[520px] text-[14px]" style={{ color: S4_MUTED }}>
              Make your stay truly memorable with unique activities and experiences.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <span
                className="h-px w-[100px]"
                style={{ background: `linear-gradient(90deg, transparent, ${S4_GOLD})` }}
              />
              <span
                className="block h-[7px] w-[7px] rotate-45"
                style={{ background: `linear-gradient(135deg, ${S4_GOLD_LT}, ${S4_GOLD})` }}
              />
              <span
                className="h-px w-[100px]"
                style={{ background: `linear-gradient(90deg, ${S4_GOLD}, transparent)` }}
              />
            </div>
          </header>

          {/* Category filters */}
          <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-3">
            {STEP4_CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className="s4-filter inline-flex items-center gap-2 rounded-[999px] px-[23px] py-[10.5px] text-[12.5px] font-medium"
                  style={{
                    background: active
                      ? "linear-gradient(180deg, #142536 0%, #08131F 100%)"
                      : "#F7F3EA",
                    color: active ? "#E7D3A7" : S4_INK,
                    border: `1px solid ${active ? "rgba(232,199,117,0.55)" : "rgba(201,164,92,0.22)"}`,
                    boxShadow: active
                      ? "inset 0 1px 0 rgba(255,255,255,0.07), 0 0 0 3px rgba(201,164,92,0.10), 0 10px 24px -18px rgba(8,19,31,0.7)"
                      : "0 4px 12px -10px rgba(8,19,31,0.30)",
                    letterSpacing: "0.015em",
                  }}

                >
                  <Sparkles
                    size={12.5}
                    strokeWidth={2}
                    style={{ color: active ? S4_GOLD_LT : "rgba(201,164,92,0.85)" }}
                  />
                  {c === "All" ? "All Experiences" : c}
                </button>
              );
            })}
          </div>

          {/* Experience grid — two rows tall, scrolls beyond */}
          <div className="relative mt-7">
            <div
              className="s4-scroll grid grid-cols-1 items-stretch gap-x-5 gap-y-7 overflow-y-auto pb-6 pr-1 sm:grid-cols-2 xl:grid-cols-3"
              style={{ maxHeight: 470 }}
            >
            {filtered.map((e) => {
              const active = selected.has(e.label);
              const featured = e.label === "Northern Lights";
              return (
                <button
                  key={e.label}
                  type="button"
                  onClick={() => handleToggleExp(e.label)}
                  onMouseEnter={() => setHoveredExp(e)}
                  onMouseLeave={() =>
                    setHoveredExp((cur) => (cur?.label === e.label ? null : cur))
                  }
                  className={`s4-card group relative flex cursor-pointer flex-col overflow-hidden rounded-[22px] text-left ${active ? "s4-selected" : ""} ${featured ? "s4-featured" : ""}`}
                  style={{
                    background: featured
                      ? "linear-gradient(180deg, #FBF9F5 0%, #F7F4EE 55%, #F3EFE7 100%)"
                      : "linear-gradient(180deg, #F8F5EF 0%, #F5F1EB 55%, #F1ECE3 100%)",
                    border: `1px solid ${active ? S4_GOLD : "rgba(214,196,163,0.55)"}`,
                    boxShadow: active
                      ? "0 14px 32px -20px rgba(201,164,92,0.45), 0 3px 10px -6px rgba(18,33,46,0.10)"
                      : "0 12px 28px -20px rgba(18,33,46,0.20), 0 2px 8px -6px rgba(18,33,46,0.08)",
                  }}
                >
                  <div
                    className="s4-card-media relative w-full overflow-hidden"
                    style={{ height: 172, borderRadius: "21px 21px 0 0" }}
                  >
                    <img
                      src={e.img}
                      alt={e.label}
                      className="s4-card-img h-full w-full object-cover"
                    />
                    {featured && (
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(70% 55% at 50% 22%, rgba(255,240,210,0.20) 0%, rgba(255,240,210,0.07) 45%, transparent 75%)",
                        }}
                      />
                    )}
                    <div
                      className="s4-card-overlay pointer-events-none absolute inset-x-0 bottom-0"
                      style={{
                        height: "38%",
                        background:
                          "linear-gradient(180deg, rgba(8,19,31,0) 0%, rgba(8,19,31,0.30) 100%)",
                      }}
                    />
                    {featured && (
                      <span
                        className="absolute left-4 top-4 rounded-full px-[7px] py-[2px] text-[7px] font-normal uppercase tracking-[0.22em]"
                        style={{
                          background: "rgba(10,20,32,0.34)",
                          border: "1px solid rgba(226,203,148,0.28)",
                          color: "rgba(236,220,186,0.88)",
                          backdropFilter: "blur(5px)",
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>

                  <div
                    className="flex flex-1 items-center justify-between gap-5 px-[24px]"
                    style={{
                      paddingTop: featured ? 13 : 22,
                      paddingBottom: featured ? 20 : 20,
                    }}
                  >

                    <div className="min-w-0">
                      <div
                        className="s4-card-title"
                        style={{
                          fontFamily: SERIF,
                          fontSize: 20.5,
                          fontWeight: 500,
                          lineHeight: 1.2,
                          letterSpacing: "0.005em",
                          color: "#1F2328",
                        }}
                      >
                        {e.label}
                      </div>
                      <div
                        className="s4-card-cat mt-[9px] text-[11px] uppercase leading-[1.4]"
                        style={{
                          color: "rgba(45,48,52,0.52)",
                          letterSpacing: "0.14em",
                        }}
                      >
                        {e.category}
                      </div>
                    </div>
                    <span
                      className={`s4-plus ${active ? "s4-plus-active" : ""} grid h-10 w-10 shrink-0 place-items-center rounded-full`}
                      style={{
                        background: active
                          ? `linear-gradient(135deg, ${S4_GOLD_LT} 0%, ${S4_GOLD} 70%)`
                          : "linear-gradient(180deg, #FCFAF6 0%, #F5F1EB 100%)",
                        border: `1px solid ${active ? S4_GOLD : "rgba(197,162,75,0.50)"}`,
                        color: active ? "#FFFFFF" : S4_GOLD,
                        boxShadow: "0 2px 8px -4px rgba(18,33,46,0.12)",
                      }}
                    >
                      {active ? (
                        <Check size={14} strokeWidth={2.6} />
                      ) : (
                        <Plus size={15} strokeWidth={1.6} />
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
            </div>
            {/* elegant catalogue fade instead of a scrollbar */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[68px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(243,238,228,0) 0%, rgba(243,238,228,0.72) 55%, #F1ECE0 100%)",
              }}
            />
          </div>


          {/* Special Requests */}
          <div
            className="mt-7 rounded-[18px] p-6"
            style={{
              background: "rgba(255,255,255,0.66)",
              border: `1px solid ${S4_HAIR}`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <h3
              className="text-[20px]"
              style={{ fontFamily: SERIF, color: S4_INK, fontWeight: 500 }}
            >
              Special Requests or Questions?
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: S4_MUTED }}>
              Have any requests, accessibility needs or questions? Let us know and we&apos;ll do
              our best to arrange everything for your group.
            </p>
            <textarea
              value={additionalRequests}
              onChange={(ev) => setAdditionalRequests(ev.target.value)}
              placeholder="Tell us anything you'd like us to know..."
              className="s5-input mt-4 w-full resize-none rounded-[14px] px-4 py-3.5 text-[14px] outline-none transition-all duration-200 focus:border-[#C9A45C] focus:ring-4 focus:ring-[rgba(201,164,92,0.12)]"
              style={{
                background: "#FFFDF8",
                color: S4_INK,
                border: `1px solid ${S4_HAIR}`,
                height: 120,
              }}
            />

            {/* Preferred date + flexibility + concierge (functionality preserved) */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => dateInputRef.current?.showPicker?.()}
                className="inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 text-left text-[13px] font-medium transition-all hover:-translate-y-[1px]"
                style={{
                  background: "#FFFDF8",
                  border: `1px solid ${S4_HAIR}`,
                  color: preferredDate ? S4_INK : S4_MUTED,
                }}
              >
                <CalendarDays size={15} style={{ color: S4_GOLD }} />
                {preferredDate ? format(preferredDate, "PPP") : "Preferred date"}
              </button>
              <input
                ref={dateInputRef}
                type="date"
                className="sr-only"
                value={preferredDate ? format(preferredDate, "yyyy-MM-dd") : ""}
                onChange={(ev) => {
                  const v = ev.target.value;
                  setPreferredDate(v ? new Date(v) : undefined);
                }}
              />
              <label
                className="inline-flex cursor-pointer items-center gap-2 text-[13px]"
                style={{ color: S4_INK }}
              >
                <span
                  className="grid h-[18px] w-[18px] place-items-center rounded-[5px] transition-colors"
                  style={{
                    backgroundColor: dateFlexible ? S4_GOLD : "#FFFDF8",
                    border: `1.5px solid ${dateFlexible ? S4_GOLD : "rgba(18,33,46,0.25)"}`,
                  }}
                >
                  {dateFlexible && <Check size={11} strokeWidth={3} style={{ color: "#FFF" }} />}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={dateFlexible}
                  onChange={(ev) => setDateFlexible(ev.target.checked)}
                />
                Flexible with dates
              </label>
              <button
                type="button"
                onClick={() => setLetUsRecommend(!letUsRecommend)}
                className="s4-surprise ml-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-300 hover:-translate-y-[1px]"
                style={{
                  background: letUsRecommend
                    ? `linear-gradient(135deg, ${S4_GOLD_LT} 0%, ${S4_GOLD} 70%)`
                    : "transparent",
                  color: letUsRecommend ? "#12212E" : "#A8823C",
                  border: `1px solid ${letUsRecommend ? S4_GOLD : "rgba(201,164,92,0.5)"}`,
                }}
              >
                {letUsRecommend ? "We'll surprise you" : "Surprise me"}
                <ArrowRight size={15} strokeWidth={2} className="s4-surprise-icon" />
              </button>
            </div>
          </div>

          {/* Bottom nav */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2.5 rounded-[14px] px-8 py-[14px] text-[13px] font-medium uppercase tracking-[0.14em] transition-all hover:-translate-y-[1px]"
              style={{
                background: "rgba(255,255,255,0.78)",
                color: S4_INK,
                border: `1px solid ${S4_HAIR}`,
              }}
            >
              <ArrowLeft size={16} strokeWidth={2} style={{ color: S4_GOLD }} />
              Back
            </button>
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2.5 rounded-[14px] px-10 py-[14px] text-[13px] font-medium uppercase tracking-[0.14em] transition-all hover:-translate-y-[1px]"
              style={{
                background: "linear-gradient(180deg, #16293C 0%, #0B1826 100%)",
                color: "#F6EFDF",
                border: "1px solid rgba(232,199,117,0.4)",
                boxShadow: "0 22px 44px -22px rgba(8,19,31,0.8)",
              }}
            >
              Next
              <ArrowRight size={17} strokeWidth={2} style={{ color: S4_GOLD_LT }} />
            </button>
          </div>
        </section>

        {/* ---------- RIGHT SUMMARY: right column of the same container ---------- */}
        <div className="order-3 min-w-0 lg:order-none">
          <aside
            className="flex h-full flex-col px-[38px] pb-[44px] pt-[40px] sm:px-[42px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(16,32,50,0.98) 0%, rgba(8,19,31,0.98) 100%)",
              borderLeft: "1px solid rgba(226,203,148,0.20)",
            }}
          >

            <div className="text-[19px] font-medium text-white" style={{ fontFamily: SERIF }}>
              Your Request
            </div>
            <div className="mt-3">{goldRule}</div>

            <div className="mt-5 flex items-center gap-3">
              <ShieldCheck size={15} strokeWidth={1.8} style={{ color: S1_GOLD_SOFT }} />
              <span className="text-[13px]" style={{ color: "rgba(245,241,230,0.8)" }}>
                Free &amp; non-binding request
              </span>
            </div>

            <div className="mt-8">{summaryLines}</div>

            <div className="mt-9">
              <div className="text-[16px] text-white" style={{ fontFamily: SERIF }}>
                Recommended for your group
              </div>
              <div className="mt-3">{goldRule}</div>
              <button
                type="button"
                onClick={() => handleToggleExp(recommended.label)}
                className="mt-4 flex w-full items-center gap-3.5 rounded-[16px] px-4 py-3.5 text-left transition-all hover:-translate-y-[1px]"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  border: `1px solid ${recommendedActive ? "rgba(226,203,148,0.55)" : "rgba(226,203,148,0.20)"}`,
                }}
              >
                <img
                  src={recommended.img}
                  alt={recommended.label}
                  className="h-[52px] w-[52px] flex-shrink-0 rounded-[10px] object-cover"
                />
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] text-white">{recommended.label}</div>
                  <div
                    className="mt-1 text-[11.5px] italic leading-[1.45]"
                    style={{ color: "rgba(245,241,230,0.6)" }}
                  >
                    An unforgettable once-in-a-lifetime experience
                  </div>
                </div>
              </button>
            </div>
          </aside>
        </div>

      </div>
    </LeisureStepShell>
  );
}
