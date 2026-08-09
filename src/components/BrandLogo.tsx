import * as React from "react";

/**
 * The single source of truth for the HotelGroupBook brand mark.
 * Extracted verbatim from the Manage Your Bookings sidebar.
 */

const GOLD_TEXT =
  "linear-gradient(180deg, #8B621C 0%, #C38B2B 28%, #F0C467 52%, #D49328 76%, #8B5B16 100%)";

export type BrandLogoVariant = "full" | "badge";
export type BrandLogoSize = "sm" | "md" | "lg";
export type BrandLogoTone = "dark" | "light";

const SIZES: Record<
  BrandLogoSize,
  { badge: number; badgeRadius: number; badgeText: number; word: number; gap: number }
> = {
  sm: { badge: 28, badgeRadius: 9, badgeText: 9.5, word: 14.5, gap: 8 },
  md: { badge: 32, badgeRadius: 10, badgeText: 10.5, word: 16.5, gap: 10 },
  lg: { badge: 40, badgeRadius: 13, badgeText: 13, word: 21, gap: 12 },
};

/** Collapsed badge sizing used by the Manage sidebar (h-9 w-9, rounded-[12px]). */
const COLLAPSED = { badge: 36, badgeRadius: 12, badgeText: 12.5 };

export function BrandLogo({
  variant = "full",
  size = "md",
  tone = "dark",
  className,
}: {
  variant?: BrandLogoVariant;
  size?: BrandLogoSize;
  tone?: BrandLogoTone;
  className?: string;
}) {
  const s = SIZES[size];
  const inkColor = tone === "light" ? "#12222F" : "#FFFFFF";
  const badgeColor = "#FFFFFF";
  // Crisp cool-white / silver-white outline — clearly defines the navy plate over photography.
  const badgeBorder = "1px solid rgba(245,248,250,0.72)";
  // Solid premium navy brand plate — opaque so photography does not show through.
  const badgeBg = "#142433";
  // Restrained dimensional treatment: faint inner top highlight + ultra-subtle outer definition.
  const badgeBoxShadow =
    "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 0.5px rgba(255,255,255,0.06)";

  if (variant === "badge") {
    const b = size === "md" ? COLLAPSED : { badge: s.badge, badgeRadius: s.badgeRadius, badgeText: s.badgeText };
    return (
      <span
        className={`grid place-items-center font-semibold tracking-[0.06em] ${className ?? ""}`}
        style={{
          height: b.badge,
          width: b.badge,
          borderRadius: b.badgeRadius,
          fontSize: b.badgeText,
          color: badgeColor,
          border: badgeBorder,
          background: badgeBg,
          boxShadow: badgeBoxShadow,
        }}
      >
        HGB
      </span>
    );
  }

  return (
    <span className={`flex items-center ${className ?? ""}`} style={{ gap: s.gap }}>
      <span
        className="grid shrink-0 place-items-center font-semibold tracking-[0.06em]"
        style={{
          height: s.badge,
          width: s.badge,
          borderRadius: s.badgeRadius,
          fontSize: s.badgeText,
          color: badgeColor,
          border: badgeBorder,
          background: badgeBg,
          boxShadow: badgeBoxShadow,
        }}
      >
        HGB
      </span>
      <span
        className="whitespace-nowrap font-semibold tracking-[-0.01em]"
        style={{ color: inkColor, fontSize: s.word }}
      >
        Hotel
        <span
          style={{
            backgroundImage: GOLD_TEXT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Group
        </span>
        Book
      </span>
    </span>
  );
}
