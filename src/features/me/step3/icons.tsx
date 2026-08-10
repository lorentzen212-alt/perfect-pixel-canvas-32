import React from "react";

export function PremiumRoomIconDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFE7A8" />
        <stop offset="45%" stopColor="#F2C14E" />
        <stop offset="100%" stopColor="#B87912" />
      </linearGradient>
      <linearGradient id={`${id}-hi`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
        <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
      <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="0.35" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

export function SingleRoomIcon({ size = 22 }: { size?: number }) {
  const id = "sglp";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden
      strokeLinecap="round" strokeLinejoin="round">
      <PremiumRoomIconDefs id={id} />
      <g stroke={`url(#${id}-stroke)`} strokeWidth={1.6} filter={`url(#${id}-glow)`}>
        <circle cx="12" cy="8.2" r="3.4" />
        <path d="M5.2 19.2c0-3.5 3-6 6.8-6s6.8 2.5 6.8 6" />
      </g>
      <g stroke={`url(#${id}-hi)`} strokeWidth={0.6} fill="none">
        <path d="M9.6 6.4c.7-.9 1.6-1.3 2.6-1.3" />
        <path d="M7.4 17.6c.9-1.8 2.6-2.8 4.6-2.9" />
      </g>
    </svg>
  );
}

export function DoubleRoomIcon({ size = 22 }: { size?: number }) {
  const id = "dblp";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden
      strokeLinecap="round" strokeLinejoin="round">
      <PremiumRoomIconDefs id={id} />
      <g stroke={`url(#${id}-stroke)`} strokeWidth={1.55} filter={`url(#${id}-glow)`}>
        <circle cx="8.4" cy="8.4" r="3.1" />
        <circle cx="15.6" cy="8.4" r="3.1" />
        <path d="M2.6 19.2c0-3.2 2.6-5.6 5.8-5.6s5.8 2.4 5.8 5.6" />
        <path d="M9.8 19.2c0-3.2 2.6-5.6 5.8-5.6s5.8 2.4 5.8 5.6" />
      </g>
      <g stroke={`url(#${id}-hi)`} strokeWidth={0.6} fill="none">
        <path d="M6.4 6.7c.5-.7 1.2-1.1 2-1.2" />
        <path d="M13.6 6.7c.5-.7 1.2-1.1 2-1.2" />
      </g>
    </svg>
  );
}

export function TripleRoomIcon({ size = 22 }: { size?: number }) {
  const id = "trpp";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden
      strokeLinecap="round" strokeLinejoin="round">
      <PremiumRoomIconDefs id={id} />
      <g stroke={`url(#${id}-stroke)`} strokeWidth={1.5} filter={`url(#${id}-glow)`}>
        <circle cx="12" cy="7.6" r="2.7" />
        <circle cx="5.4" cy="9" r="2.4" />
        <circle cx="18.6" cy="9" r="2.4" />
        <path d="M6.4 19.2c0-3 2.5-5.2 5.6-5.2s5.6 2.2 5.6 5.2" />
        <path d="M1.6 19.2c0-2.4 1.8-4.2 4-4.4" />
        <path d="M22.4 19.2c0-2.4-1.8-4.2-4-4.4" />
      </g>
      <g stroke={`url(#${id}-hi)`} strokeWidth={0.55} fill="none">
        <path d="M10.3 6.3c.4-.6 1-1 1.7-1" />
      </g>
    </svg>
  );
}

export function TwinBedsIcon({ size = 22 }: { size?: number }) {
  const id = "twinp";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden
      strokeLinecap="round" strokeLinejoin="round">
      <PremiumRoomIconDefs id={id} />
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF4D1" />
          <stop offset="32%" stopColor="#F2C14E" />
          <stop offset="70%" stopColor="#D4A03A" />
          <stop offset="100%" stopColor="#A67416" />
        </linearGradient>
        <linearGradient id={`${id}-dark`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8B43F" />
          <stop offset="100%" stopColor="#7A4E08" />
        </linearGradient>
        <linearGradient id={`${id}-hi2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g filter={`url(#${id}-glow)`}>
        {/* left bed */}
        <g>
          <rect x="2.5" y="5.2" width="7" height="6" rx="1.8"
            fill={`url(#${id}-fill)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.45} />
          <rect x="4" y="8.5" width="4" height="2.2" rx="0.6"
            fill={`url(#${id}-fill)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.4} />
          <rect x="2.7" y="10.8" width="6.8" height="5.6" rx="0.55"
            fill={`url(#${id}-fill)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.45} />
          <rect x="2.9" y="16.3" width="0.9" height="1.3" rx="0.25"
            fill={`url(#${id}-dark)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.35} />
          <rect x="8.1" y="16.3" width="0.9" height="1.3" rx="0.25"
            fill={`url(#${id}-dark)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.35} />
          <path d="M3.1 12H9.1" stroke="#8F5E0A" strokeWidth={0.35} strokeOpacity={0.55} strokeLinecap="round" />
          <path d="M2.7 11.1Q6 10.2 9.5 11.1" stroke={`url(#${id}-hi2)`} strokeWidth={0.55} fill="none" />
          <path d="M4.1 8.9Q6 8.5 7.9 8.9" stroke={`url(#${id}-hi2)`} strokeWidth={0.5} fill="none" />
          <path d="M2.8 6Q6 5.3 9.2 6" stroke={`url(#${id}-hi2)`} strokeWidth={0.5} fill="none" />
        </g>
        {/* right bed */}
        <g>
          <rect x="13.1" y="5.2" width="7" height="6" rx="1.8"
            fill={`url(#${id}-fill)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.45} />
          <rect x="14.6" y="8.5" width="4" height="2.2" rx="0.6"
            fill={`url(#${id}-fill)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.4} />
          <rect x="13.3" y="10.8" width="6.8" height="5.6" rx="0.55"
            fill={`url(#${id}-fill)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.45} />
          <rect x="13.5" y="16.3" width="0.9" height="1.3" rx="0.25"
            fill={`url(#${id}-dark)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.35} />
          <rect x="18.7" y="16.3" width="0.9" height="1.3" rx="0.25"
            fill={`url(#${id}-dark)`} stroke={`url(#${id}-stroke)`} strokeWidth={0.35} />
          <path d="M13.7 12H19.7" stroke="#8F5E0A" strokeWidth={0.35} strokeOpacity={0.55} strokeLinecap="round" />
          <path d="M13.3 11.1Q16.6 10.2 20.1 11.1" stroke={`url(#${id}-hi2)`} strokeWidth={0.55} fill="none" />
          <path d="M14.7 8.9Q16.6 8.5 18.5 8.9" stroke={`url(#${id}-hi2)`} strokeWidth={0.5} fill="none" />
          <path d="M13.4 6Q16.6 5.3 19.8 6" stroke={`url(#${id}-hi2)`} strokeWidth={0.5} fill="none" />
        </g>
      </g>
    </svg>
  );
}

export function AccommodationIcon() {
  return (
    <svg
      aria-hidden
      width={44}
      height={44}
      viewBox="0 0 44 44"
      style={{
        flexShrink: 0,
        display: "block",
        filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.35)) drop-shadow(0 2px 3px rgba(0,0,0,0.28))",
      }}
    >
      <defs>
        {/* Navy body — layered gradient */}
        <linearGradient id="acmBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2735" />
          <stop offset="45%" stopColor="#0E1620" />
          <stop offset="100%" stopColor="#070C13" />
        </linearGradient>
        {/* Inner glossy sheen */}
        <linearGradient id="acmSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        {/* Champagne gold border — beveled */}
        <linearGradient id="acmFrame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F9E4A2" />
          <stop offset="18%" stopColor="#E9C879" />
          <stop offset="42%" stopColor="#C89A3E" />
          <stop offset="58%" stopColor="#F4D98A" />
          <stop offset="82%" stopColor="#B0821E" />
          <stop offset="100%" stopColor="#F7DE96" />
        </linearGradient>
        {/* Bright calendar gold */}
        <linearGradient id="acmCal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBE9AE" />
          <stop offset="42%" stopColor="#E9C46A" />
          <stop offset="100%" stopColor="#9E7422" />
        </linearGradient>
        {/* Header bar gold */}
        <linearGradient id="acmHeader" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8D98A" />
          <stop offset="100%" stopColor="#B78624" />
        </linearGradient>
        {/* Radial highlight on top-left */}
        <radialGradient id="acmGlow" cx="30%" cy="22%" r="55%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        {/* Sparkle gradient */}
        <radialGradient id="acmSpark" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF6D2" />
          <stop offset="45%" stopColor="#F5D682" />
          <stop offset="100%" stopColor="#C89A3E" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Outer frame */}
      <rect x="0.5" y="0.5" width="43" height="43" rx="11" fill="url(#acmFrame)" />
      {/* Navy body inset */}
      <rect x="2" y="2" width="40" height="40" rx="9.5" fill="url(#acmBody)" />
      {/* Glossy top sheen */}
      <rect x="2" y="2" width="40" height="20" rx="9.5" fill="url(#acmSheen)" />
      {/* Corner glow */}
      <rect x="2" y="2" width="40" height="40" rx="9.5" fill="url(#acmGlow)" />
      {/* Inner hairline */}
      <rect
        x="2.75"
        y="2.75"
        width="38.5"
        height="38.5"
        rx="8.75"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.06"
      />

      {/* Calendar — centered around (22,23) */}
      <g transform="translate(11 10)">
        {/* body */}
        <rect
          x="0.9"
          y="3.4"
          width="20.2"
          height="18.2"
          rx="2.6"
          fill="none"
          stroke="url(#acmCal)"
          strokeWidth="1.7"
        />
        {/* header strip */}
        <path
          d="M0.9 8 h20.2 v-1.6 a2.6 2.6 0 0 0 -2.6 -2.6 h-15 a2.6 2.6 0 0 0 -2.6 2.6 z"
          fill="url(#acmHeader)"
        />
        {/* rings */}
        <rect x="5.4" y="0.6" width="1.9" height="4.4" rx="0.95" fill="url(#acmCal)" />
        <rect x="14.7" y="0.6" width="1.9" height="4.4" rx="0.95" fill="url(#acmCal)" />
        {/* ring highlights */}
        <rect x="5.8" y="0.9" width="0.5" height="3.6" rx="0.25" fill="#FFF3C8" opacity="0.75" />
        <rect x="15.1" y="0.9" width="0.5" height="3.6" rx="0.25" fill="#FFF3C8" opacity="0.75" />
        {/* date squares — 4 cols x 3 rows */}
        {[0, 1, 2, 3].map((c) =>
          [0, 1, 2].map((r) => {
            const isToday = c === 1 && r === 1;
            return (
              <rect
                key={`${c}-${r}`}
                x={2.7 + c * 4.2}
                y={10.4 + r * 3.4}
                width="2.6"
                height="2.4"
                rx="0.55"
                fill="url(#acmCal)"
                opacity={isToday ? 1 : 0.82}
              />
            );
          })
        )}
      </g>

      {/* Sparkle — bottom right */}
      <g transform="translate(31 30)">
        <circle r="4.2" fill="url(#acmSpark)" />
        <path
          d="M0 -4.2 L0.7 -0.7 L4.2 0 L0.7 0.7 L0 4.2 L-0.7 0.7 L-4.2 0 L-0.7 -0.7 Z"
          fill="url(#acmCal)"
        />
        <circle r="0.55" fill="#FFF6D2" />
      </g>
    </svg>
  );
}

/**
 * LuxIconBadge — premium matte-black container with champagne-gold icon.
 * Preserves size prop; icon inherits color via currentColor from the gradient
 * stroke supplied here.
 */
export function LuxIconBadge({
  children,
  size = 40,
  tone = "onLight",
  finish = "standard",
}: {
  children: React.ReactNode;
  size?: number;
  tone?: "onLight" | "onDark";
  finish?: "standard" | "engraved";
}) {
  const radius = size >= 40 ? 10 : Math.max(5, Math.round(size * 0.224));

  if (finish === "engraved") {
    const shadow =
      tone === "onDark"
        ? "0 8px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.45)"
        : "0 6px 18px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.40)";
    const bg = tone === "onDark" ? "#111317" : "#18181A";
    return (
      <span
        className="relative inline-flex shrink-0 items-center justify-center"
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          background: bg,
          boxShadow: shadow,
          color: "#E6C25A",
        }}
      >
        {/* uniform 1.5px champagne-gold frame */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: radius,
            padding: 1.5,
            background: "#D9B65A",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        <span
          className="relative"
          style={{
            color: "#EBCB6A",
            filter:
              "drop-shadow(0 1px 0 rgba(255,255,255,0.10)) drop-shadow(0 1px 1px rgba(0,0,0,0.35))",
          }}
        >
          {children}
        </span>
      </span>
    );
  }

  const shadow =
    tone === "onDark"
      ? "0 8px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)"
      : "0 6px 18px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.35)";
  const bg =
    tone === "onDark"
      ? "linear-gradient(180deg,#1A1D24 0%, #101319 55%, #0B0D12 100%)"
      : "linear-gradient(180deg,#262626 0%, #111111 100%)";
  const borderColor =
    tone === "onDark" ? "rgba(212,175,55,0.22)" : "rgba(212,175,55,0.28)";
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        border: `1px solid ${borderColor}`,
        boxShadow: shadow,
        color: "#E6C25A",
      }}
    >
      {/* soft inner highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: radius,
          background:
            "radial-gradient(120% 60% at 50% 0%, rgba(247,231,166,0.16) 0%, rgba(247,231,166,0) 55%)",
        }}
      />
      <span
        className="relative"
        style={{
          color: "#EBCB6A",
          filter:
            "drop-shadow(0 1px 0 rgba(255,255,255,0.10)) drop-shadow(0 1px 1px rgba(0,0,0,0.35))",
        }}
      >
        {children}
      </span>
    </span>
  );
}

/* ============================================================
   Step 4 – Catering
   ============================================================ */
