import { cn } from "@/lib/utils";

/**
 * Refined trust-row icons: thin metallic champagne-gold circular border,
 * dark navy symbol inside. Slight 3D feel via subtle inner shadow and
 * upper-left highlight. Used in the M&E hero benefit row.
 */

type IconProps = {
  size?: number;
  className?: string;
};

const NAVY = "#0F1B2D";
const GOLD_HI = "#F2D477";
const GOLD_MAIN = "#D4AF37";
const GOLD_LOW = "#8F6818";

function Frame({
  size = 44,
  className,
  children,
  id,
}: {
  size?: number;
  className?: string;
  children: React.ReactNode;
  id: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={cn(className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={GOLD_HI} />
          <stop offset="50%" stopColor={GOLD_MAIN} />
          <stop offset="100%" stopColor={GOLD_LOW} />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-inner`} cx="0.5" cy="0.42" r="0.55">
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.06" />
        </radialGradient>
      </defs>
      {/* outer ring */}
      <circle cx="24" cy="24" r="22" fill="#FFFFFF" fillOpacity="0.02" />
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="none"
        stroke={`url(#${id}-ring)`}
        strokeWidth="1.4"
      />
      {/* inner shadow */}
      <circle cx="24" cy="24" r="21.3" fill={`url(#${id}-inner)`} />
      {/* upper sheen */}
      <path
        d="M8 20 A16 16 0 0 1 40 20"
        stroke={`url(#${id}-sheen)`}
        strokeWidth="1"
        fill="none"
      />
      <g stroke={NAVY} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {children}
      </g>
    </svg>
  );
}

export function TrustShield({ size, className }: IconProps) {
  return (
    <Frame size={size} className={className} id="ts">
      <path d="M24 13 L33 16.5 V24 C33 29.5 29 33.5 24 35.5 C19 33.5 15 29.5 15 24 V16.5 Z" />
      <path d="M19.5 24 L23 27.5 L29 20.5" />
    </Frame>
  );
}

export function TrustClock({ size, className }: IconProps) {
  return (
    <Frame size={size} className={className} id="tc">
      <circle cx="24" cy="24" r="9" />
      <path d="M24 18.5 V24 L28 26.5" />
    </Frame>
  );
}

export function TrustHeadset({ size, className }: IconProps) {
  return (
    <Frame size={size} className={className} id="th">
      <path d="M15 25.5 V23 C15 18.5 19 15 24 15 C29 15 33 18.5 33 23 V25.5" />
      <rect x="14" y="25" width="4" height="7" rx="1.4" />
      <rect x="30" y="25" width="4" height="7" rx="1.4" />
      <path d="M33 31.5 C33 34 31 35 29 35 H26.5" />
    </Frame>
  );
}

export function TrustLock({ size, className }: IconProps) {
  return (
    <Frame size={size} className={className} id="tl">
      <path d="M19 22 V19.5 C19 16.5 21.2 14.5 24 14.5 C26.8 14.5 29 16.5 29 19.5 V22" />
      <rect x="16.5" y="22" width="15" height="12" rx="1.6" />
      <path d="M24 26.5 V29.5" />
    </Frame>
  );
}
