import { GoldStarDivider } from "@/features/me/common/dividers";
import { SERIF } from "@/features/me/tokens";
import React from "react";

export type BudgetTier = "economy" | "mid" | "premium" | "luxury";

export function BudgetPreference({
  value,
  onChange,
}: {
  value: BudgetTier | null;
  onChange: (v: BudgetTier | null) => void;
}) {
  const GOLD_GRAD = "linear-gradient(135deg, #F7E3A8 0%, #E8C46A 45%, #B88A2E 100%)";

  const EconomyIcon = ({ active }: { active: boolean }) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="econG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7E3A8" />
          <stop offset="50%" stopColor="#E8C46A" />
          <stop offset="100%" stopColor="#B88A2E" />
        </linearGradient>
      </defs>
      <g stroke="url(#econG)" strokeWidth={active ? 1.7 : 1.5} strokeLinejoin="round" strokeLinecap="round" fill="none">
        <rect x="4" y="10" width="9" height="18" rx="1" />
        <rect x="13" y="6" width="10" height="22" rx="1" />
        <rect x="23" y="13" width="6" height="15" rx="1" />
        <path d="M16 10h4M16 14h4M16 18h4M16 22h4M7 15h3M7 19h3M7 23h3M25 17h2M25 21h2" strokeWidth="1.1" />
      </g>
    </svg>
  );

  const MidIcon = ({ active }: { active: boolean }) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="midG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7E3A8" />
          <stop offset="50%" stopColor="#E8C46A" />
          <stop offset="100%" stopColor="#B88A2E" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="11" stroke="url(#midG)" strokeWidth={active ? 1.7 : 1.5} fill="none" />
      <path
        d="M16 10.5l1.5 3.2 3.5.5-2.5 2.4.6 3.5L16 18.5l-3.1 1.6.6-3.5-2.5-2.4 3.5-.5z"
        fill="url(#midG)"
      />
    </svg>
  );

  const PremiumIcon = ({ active }: { active: boolean }) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="premG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7E3A8" />
          <stop offset="50%" stopColor="#E8C46A" />
          <stop offset="100%" stopColor="#B88A2E" />
        </linearGradient>
      </defs>
      <path
        d="M16 4.5l3.4 7 7.6 1.1-5.5 5.4 1.3 7.6L16 22l-6.8 3.6 1.3-7.6L5 12.6l7.6-1.1z"
        stroke="url(#premG)"
        strokeWidth={active ? 1.7 : 1.5}
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );

  const LuxuryIcon = ({ active }: { active: boolean }) => (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="luxG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7E3A8" />
          <stop offset="50%" stopColor="#E8C46A" />
          <stop offset="100%" stopColor="#B88A2E" />
        </linearGradient>
      </defs>
      <g stroke="url(#luxG)" strokeWidth={active ? 1.7 : 1.5} strokeLinejoin="round" strokeLinecap="round" fill="none">
        <path d="M6 12l4-6h12l4 6-10 15z" />
        <path d="M6 12h20M10 6l6 6 6-6M12 12l4 15M20 12l-4 15" strokeWidth="1.1" />
      </g>
    </svg>
  );

  const tiers: {
    id: BudgetTier;
    label: string;
    desc: string;
    Icon: (p: { active: boolean }) => React.ReactElement;
  }[] = [
    { id: "economy", label: "Economy", desc: "Smart value", Icon: EconomyIcon },
    { id: "mid", label: "Mid-range", desc: "Balanced comfort", Icon: MidIcon },
    { id: "premium", label: "Premium", desc: "Elevated stay", Icon: PremiumIcon },
    { id: "luxury", label: "Luxury", desc: "Signature luxury", Icon: LuxuryIcon },
  ];

  return (
    <section className="mt-8">
      <GoldStarDivider />
      <div className="mt-6">
        <h3
          className="text-[22px] leading-tight"
          style={{ fontFamily: SERIF, fontWeight: 700, color: "#0F1B2D" }}
        >
          Budget Preference{" "}
          <span className="text-[15px]" style={{ fontFamily: "inherit", fontWeight: 400, color: "#6B778C" }}>
            (Optional)
          </span>
        </h3>
        <p className="mt-0.5 text-[14px]" style={{ fontWeight: 500, color: "#334155" }}>
          Help us tailor the best options for your event.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiers.map((t) => {
          const selected = value === t.id;
          const Icon = t.Icon;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(selected ? null : t.id)}
              aria-pressed={selected}
              className="group relative flex flex-col items-center justify-center rounded-[14px] px-3 py-3 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E8C46A]/60"
              style={{
                minHeight: 118,
                background: selected
                  ? "linear-gradient(160deg, #142743 0%, #0F1B2D 55%, #0A1524 100%)"
                  : "#FFFDF8",
                border: selected
                  ? "1px solid rgba(212,175,55,0.85)"
                  : "1px solid rgba(60,72,90,0.10)",
                boxShadow: selected
                  ? "0 0 0 1px rgba(212,175,55,0.35), 0 10px 26px -10px rgba(212,175,55,0.55), 0 4px 14px -6px rgba(10,20,36,0.35), inset 0 1px 0 rgba(255,220,140,0.12)"
                  : "inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 3px rgba(20,30,45,0.04), 0 1px 2px rgba(20,30,45,0.03)",
              }}
            >
              {selected && (
                <span
                  aria-hidden="true"
                  className="absolute right-2 top-2 inline-flex h-[18px] w-[18px] items-center justify-center rounded-full"
                  style={{
                    background: "linear-gradient(160deg, #F7E3A8 0%, #E8C46A 55%, #B88A2E 100%)",
                    boxShadow: "0 2px 6px -2px rgba(184,138,46,0.55)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.2l2.3 2.3L9.5 3.8" stroke="#0F1B2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              <Icon active={selected} />
              <span
                className="mt-2 text-[13.5px]"
                style={{
                  fontFamily: SERIF,
                  fontWeight: selected ? 600 : 550,
                  letterSpacing: "0.005em",
                  color: selected ? "#F7E3A8" : "#0A1B2C",
                }}
              >
                {t.label}
              </span>
              <span
                className="mt-0.5 text-[10.5px] font-normal tracking-[0.01em]"
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  color: selected ? "rgba(255,255,255,0.72)" : "#8A8578",
                }}
              >
                {t.desc}
              </span>
            </button>
          );
        })}
      </div>

      {value && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[10.5px] font-medium text-[#B88A2E]/75 underline underline-offset-2 hover:text-[#8E6A20]"
          >
            Clear selection
          </button>
        </div>
      )}
    </section>
  );
}
