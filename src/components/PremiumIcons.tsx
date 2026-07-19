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
      <stop offset="0%" stopColor="#D4AF37" />
      <stop offset="100%" stopColor="#C89B3C" />
    </linearGradient>
  );
}

function InnerShadow({ id }: { id: string }) {
  return (
    <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
      <feOffset in="SourceAlpha" dx="1.5" dy="1.5" result="offset" />
      <feGaussianBlur in="offset" stdDeviation="2" result="blurred" />
      <feComposite in="SourceAlpha" in2="blurred" operator="out" result="shadow" />
      <feFlood floodColor="#000000" floodOpacity="0.35" result="color" />
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
          d="M64 15 L96 28 V55 C96 79 82 97 64 107 C46 97 32 79 32 55 V28 Z"
          fill={CHARCOAL_FILL}
          stroke="url(#shieldGoldStroke)"
          strokeWidth="5"
        />
        <path
          d="M49 60 L59 70 L80 47"
          fill="none"
          stroke="url(#shieldGoldStroke)"
          strokeWidth="6"
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
          strokeWidth="5"
        />
        <circle
          cx="64"
          cy="64"
          r="34"
          fill="none"
          stroke="#7A5B1C"
          strokeOpacity="0.45"
          strokeWidth="1.5"
        />
        <path d="M64 38 V64 L82 75" fill="none" stroke="url(#clockGoldStroke)" strokeWidth="6" />
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
          d="M31 65 V56 C31 37 46 23 64 23 C82 23 97 37 97 56 V66"
          fill="none"
          stroke="url(#headsetGoldStroke)"
          strokeWidth="5"
        />
        <rect
          x="24"
          y="57"
          width="14"
          height="30"
          rx="6"
          fill={CHARCOAL_FILL}
          stroke="url(#headsetGoldStroke)"
          strokeWidth="4"
        />
        <rect
          x="90"
          y="57"
          width="14"
          height="30"
          rx="6"
          fill={CHARCOAL_FILL}
          stroke="url(#headsetGoldStroke)"
          strokeWidth="4"
        />
        <path
          d="M97 83 C97 96 87 101 76 101 H69"
          fill="none"
          stroke="url(#headsetGoldStroke)"
          strokeWidth="5"
        />
        <rect
          x="60"
          y="96"
          width="18"
          height="10"
          rx="5"
          fill={CHARCOAL_FILL}
          stroke="url(#headsetGoldStroke)"
          strokeWidth="3"
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
          d="M43 53 V42 C43 29 52 20 64 20 C76 20 85 29 85 42 V53"
          fill="none"
          stroke="url(#lockGoldStroke)"
          strokeWidth="5"
        />
        <rect
          x="31"
          y="51"
          width="66"
          height="52"
          rx="8"
          fill={CHARCOAL_FILL}
          stroke="url(#lockGoldStroke)"
          strokeWidth="5"
        />
        <circle cx="64" cy="75" r="6" fill="url(#lockGoldStroke)" />
        <path d="M64 81 V90" stroke="url(#lockGoldStroke)" strokeWidth="5" />
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
          cy="43"
          r="14"
          fill={CHARCOAL_FILL}
          stroke="url(#groupGoldStroke)"
          strokeWidth="4"
        />
        <circle
          cx="82"
          cy="46"
          r="12"
          fill={CHARCOAL_FILL}
          stroke="url(#groupGoldStroke)"
          strokeWidth="4"
        />
        <path
          d="M22 97 C22 75 33 64 48 64 C63 64 74 75 74 97 Z"
          fill={CHARCOAL_FILL}
          stroke="url(#groupGoldStroke)"
          strokeWidth="4"
        />
        <path
          d="M66 97 C66 80 74 70 86 70 C98 70 106 80 106 97 Z"
          fill={CHARCOAL_FILL}
          stroke="url(#groupGoldStroke)"
          strokeWidth="4"
        />
      </g>
    </Base>
  );
}
