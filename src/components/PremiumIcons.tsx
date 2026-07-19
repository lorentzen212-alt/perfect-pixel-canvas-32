import { cn } from "@/lib/utils";

/**
 * Premium black-and-gold SVG icons.
 * Satin gold finish over dark charcoal fill with subtle inner shadow.
 */

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

const CHARCOAL_FILL = "#1A1A1A";
const GOLD_LIGHT = "#D4AF37";
const GOLD_SHADOW = "#B8932F";

function Base({
  size = 22,
  className,
  children,
}: {
  size?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      className={cn(className)}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function GoldGradient({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor={GOLD_LIGHT} />
      <stop offset="55%" stopColor="#C9A43B" />
      <stop offset="100%" stopColor={GOLD_SHADOW} />
    </linearGradient>
  );
}

function InnerShadow({ id }: { id: string }) {
  return (
    <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
      <feOffset in="SourceAlpha" dx="1" dy="1" result="offset" />
      <feGaussianBlur in="offset" stdDeviation="1.5" result="blurred" />
      <feComposite in="SourceAlpha" in2="blurred" operator="out" result="shadow" />
      <feFlood floodColor="#000000" floodOpacity="0.32" result="color" />
      <feComposite in="color" in2="shadow" operator="in" result="innerShadow" />
      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="innerShadow" />
      </feMerge>
    </filter>
  );
}

export function ShieldCheckPremium({ size, className }: IconProps) {
  return (
    <Base size={size} className={className}>
      <defs>
        <GoldGradient id="shieldGoldStroke" />
        <InnerShadow id="shieldInnerShadow" />
      </defs>
      <g filter="url(#shieldInnerShadow)" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M64 18 L92 30 V54 C92 76 80 93 64 103 C48 93 36 76 36 54 V30 Z"
          fill={CHARCOAL_FILL}
          stroke="url(#shieldGoldStroke)"
          strokeWidth="3.5"
        />
        <path
          d="M50 58 L59 67 L79 47"
          fill="none"
          stroke="url(#shieldGoldStroke)"
          strokeWidth="4.5"
        />
      </g>
    </Base>
  );
}

export function ClockPremium({ size, className }: IconProps) {
  return (
    <Base size={size} className={className}>
      <defs>
        <GoldGradient id="clockGoldStroke" />
        <InnerShadow id="clockInnerShadow" />
      </defs>
      <g filter="url(#clockInnerShadow)" strokeLinecap="round" strokeLinejoin="round">
        <circle
          cx="64"
          cy="64"
          r="42"
          fill={CHARCOAL_FILL}
          stroke="url(#clockGoldStroke)"
          strokeWidth="3.5"
        />
        <circle
          cx="64"
          cy="64"
          r="34"
          fill="none"
          stroke="#8C7328"
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />
        <path d="M64 40 V64 L80 74" fill="none" stroke="url(#clockGoldStroke)" strokeWidth="4.5" />
      </g>
    </Base>
  );
}

export function HeadsetPremium({ size, className }: IconProps) {
  return (
    <Base size={size} className={className}>
      <defs>
        <GoldGradient id="headsetGoldStroke" />
        <InnerShadow id="headsetInnerShadow" />
      </defs>
      <g filter="url(#headsetInnerShadow)" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M33 64 V56 C33 39 47 26 64 26 C81 26 95 39 95 56 V64"
          fill="none"
          stroke="url(#headsetGoldStroke)"
          strokeWidth="3.5"
        />
        <rect
          x="26"
          y="56"
          width="14"
          height="28"
          rx="6"
          fill={CHARCOAL_FILL}
          stroke="url(#headsetGoldStroke)"
          strokeWidth="3"
        />
        <rect
          x="88"
          y="56"
          width="14"
          height="28"
          rx="6"
          fill={CHARCOAL_FILL}
          stroke="url(#headsetGoldStroke)"
          strokeWidth="3"
        />
        <path
          d="M95 80 C95 92 86 97 76 97 H70"
          fill="none"
          stroke="url(#headsetGoldStroke)"
          strokeWidth="3.5"
        />
        <rect
          x="62"
          y="92"
          width="16"
          height="9"
          rx="4"
          fill={CHARCOAL_FILL}
          stroke="url(#headsetGoldStroke)"
          strokeWidth="2.5"
        />
      </g>
    </Base>
  );
}

export function LockPremium({ size, className }: IconProps) {
  return (
    <Base size={size} className={className}>
      <defs>
        <GoldGradient id="lockGoldStroke" />
        <InnerShadow id="lockInnerShadow" />
      </defs>
      <g filter="url(#lockInnerShadow)" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M45 52 V42 C45 31 53 22 64 22 C75 22 83 31 83 42 V52"
          fill="none"
          stroke="url(#lockGoldStroke)"
          strokeWidth="3.5"
        />
        <rect
          x="33"
          y="50"
          width="62"
          height="50"
          rx="7"
          fill={CHARCOAL_FILL}
          stroke="url(#lockGoldStroke)"
          strokeWidth="3.5"
        />
        <circle cx="64" cy="72" r="5" fill="url(#lockGoldStroke)" />
        <path d="M64 77 V86" stroke="url(#lockGoldStroke)" strokeWidth="3.5" />
      </g>
    </Base>
  );
}

export function GroupPremium({ size, className }: IconProps) {
  return (
    <Base size={size} className={className}>
      <defs>
        <GoldGradient id="groupGoldStroke" />
        <InnerShadow id="groupInnerShadow" />
      </defs>
      <g filter="url(#groupInnerShadow)" strokeLinecap="round" strokeLinejoin="round">
        <circle
          cx="48"
          cy="42"
          r="13"
          fill={CHARCOAL_FILL}
          stroke="url(#groupGoldStroke)"
          strokeWidth="3"
        />
        <circle
          cx="82"
          cy="45"
          r="11"
          fill={CHARCOAL_FILL}
          stroke="url(#groupGoldStroke)"
          strokeWidth="3"
        />
        <path
          d="M25 94 C25 75 35 65 48 65 C61 65 71 75 71 94 Z"
          fill={CHARCOAL_FILL}
          stroke="url(#groupGoldStroke)"
          strokeWidth="3"
        />
        <path
          d="M66 94 C66 79 74 70 85 70 C96 70 104 79 104 94 Z"
          fill={CHARCOAL_FILL}
          stroke="url(#groupGoldStroke)"
          strokeWidth="3"
        />
      </g>
    </Base>
  );
}
