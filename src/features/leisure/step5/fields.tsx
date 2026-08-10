import s5BlackGoldHero from "@/assets/s5-black-gold-hero.png.asset.json";
import { S5_BORDER, S5_FIELD, S5_GOLD } from "@/features/leisure/tokens";
import React, { useState } from "react";

export const S5_HERO =
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80";

export const S5_PANEL_IMAGE = s5BlackGoldHero.url;

export const PHONE_COUNTRIES: { code: string; dial: string; flag: string; name: string }[] = [
  { code: "NO", dial: "+47", flag: "🇳🇴", name: "Norway" },
  { code: "SE", dial: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "DK", dial: "+45", flag: "🇩🇰", name: "Denmark" },
  { code: "FI", dial: "+358", flag: "🇫🇮", name: "Finland" },
  { code: "IS", dial: "+354", flag: "🇮🇸", name: "Iceland" },
  { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "DE", dial: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "NL", dial: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "FR", dial: "+33", flag: "🇫🇷", name: "France" },
  { code: "ES", dial: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "IT", dial: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "US", dial: "+1", flag: "🇺🇸", name: "United States" },
];

export const S5_COUNTRIES: { code: string; name: string }[] = [
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "CA", name: "Canada" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IS", name: "Iceland" },
  { code: "IE", name: "Ireland" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "Other", name: "Other" },
];

export function S5FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label
      className="mb-1.5 block text-[10.5px] font-medium uppercase tracking-[0.22em]"
      style={{ color: "rgba(245,241,230,0.72)" }}
    >
      {children}
      {optional && (
        <span className="ml-2 text-[10px] font-normal tracking-[0.18em]" style={{ color: "rgba(245,241,230,0.34)" }}>
          (OPTIONAL)
        </span>
      )}
    </label>
  );
}

export const s5FieldStyle = (focused: boolean): React.CSSProperties => ({
  backgroundColor: S5_FIELD,
  color: "#F5F1E6",
  border: `1px solid ${focused ? "rgba(201,164,92,0.75)" : S5_BORDER}`,
  boxShadow: focused
    ? "0 0 0 3px rgba(201,164,92,0.12), 0 12px 30px -22px rgba(201,164,92,0.6)"
    : "inset 0 1px 0 rgba(255,255,255,0.02)",
  transition: "all 250ms ease",
});

export function S5Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      className="s5-input h-[50px] w-full rounded-[12px] px-5 text-[14.5px] outline-none"
      style={s5FieldStyle(focused)}
    />
  );
}

/* Decorative flowing champagne lines + geometric mark for the left panel */
export function S5Decoration() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 select-none" aria-hidden>
      <svg
        viewBox="0 0 420 300"
        className="block h-[240px] w-full"
        preserveAspectRatio="none"
        fill="none"
        style={{ opacity: 0.55 }}
      >
        <g stroke={S5_GOLD} strokeWidth="0.6" opacity="0.55">
          {Array.from({ length: 16 }).map((_, i) => (
            <path
              key={i}
              d={`M -40 ${300 - i * 6} C 90 ${250 - i * 11}, 170 ${300 - i * 15}, 300 ${170 - i * 4} S 420 ${250 - i * 6}, 470 ${300 - i * 3}`}
              opacity={0.18 + i * 0.035}
            />
          ))}
        </g>
      </svg>
      <div className="absolute left-2 top-0 -translate-y-[85%]">
        <svg width="92" height="92" viewBox="0 0 100 100" fill="none" style={{ opacity: 0.6 }}>
          <g stroke={S5_GOLD} strokeWidth="0.8">
            <circle cx="50" cy="50" r="26" />
            <rect x="26" y="26" width="48" height="48" transform="rotate(45 50 50)" />
            <rect x="30" y="30" width="40" height="40" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              return (
                <line
                  key={i}
                  x1={50 + Math.cos(a) * 6}
                  y1={50 + Math.sin(a) * 6}
                  x2={50 + Math.cos(a) * 22}
                  y2={50 + Math.sin(a) * 22}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
