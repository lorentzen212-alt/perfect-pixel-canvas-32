import { cn } from "@/lib/utils";

/**
 * Premium duotone metallic-gold icons.
 * Outline stroke in warm gold (#F5AE00) with subtle inner gold fill (~14% opacity)
 * to match the reference's refined luxury look.
 */

type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

const STROKE = "#F5AE00";
const FILL = "rgba(245, 174, 0, 0.14)";

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
      viewBox="0 0 24 24"
      fill="none"
      className={cn(className)}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function ShieldCheckPremium({ size, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <Base size={size} className={className}>
      <path
        d="M12 2.75 4.5 5.25v6.1c0 4.6 3.2 8.4 7.5 9.9 4.3-1.5 7.5-5.3 7.5-9.9v-6.1L12 2.75Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="m8.5 12.2 2.4 2.4 4.6-4.9"
        stroke={STROKE}
        strokeWidth={strokeWidth + 0.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Base>
  );
}

export function ClockPremium({ size, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <Base size={size} className={className}>
      <circle cx="12" cy="12" r="9" fill={FILL} stroke={STROKE} strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="6.2" fill="none" stroke={STROKE} strokeWidth={0.7} opacity="0.55" />
      <path
        d="M12 7.5V12l3.1 1.9"
        stroke={STROKE}
        strokeWidth={strokeWidth + 0.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="12" cy="12" r="0.9" fill={STROKE} />
    </Base>
  );
}

export function HeadsetPremium({ size, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <Base size={size} className={className}>
      {/* headband */}
      <path
        d="M4 13v-1a8 8 0 0 1 16 0v1"
        stroke={STROKE}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      {/* left cup */}
      <path
        d="M4 13h3v6H5.5A1.5 1.5 0 0 1 4 17.5V13Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* right cup */}
      <path
        d="M20 13h-3v6h1.5A1.5 1.5 0 0 0 20 17.5V13Z"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* mic boom */}
      <path
        d="M17 19v.6a1.9 1.9 0 0 1-1.9 1.9H13"
        stroke={STROKE}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="12" cy="21.5" r="0.9" fill={STROKE} />
    </Base>
  );
}

export function LockPremium({ size, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <Base size={size} className={className}>
      <path
        d="M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5"
        stroke={STROKE}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      <rect
        x="4.75"
        y="10.5"
        width="14.5"
        height="10"
        rx="2.2"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={strokeWidth}
      />
      <path
        d="M12 14v3.2"
        stroke={STROKE}
        strokeWidth={strokeWidth + 0.3}
        strokeLinecap="round"
      />
      <circle cx="12" cy="14" r="1.15" fill={STROKE} />
    </Base>
  );
}

export function GroupPremium({ size, className, strokeWidth = 1.6 }: IconProps) {
  return (
    <Base size={size} className={className}>
      {/* back person */}
      <circle cx="16.5" cy="8.5" r="2.6" fill={FILL} stroke={STROKE} strokeWidth={strokeWidth} />
      <path
        d="M12.5 18.5c.4-2.6 2.3-4.2 4.5-4.2 2.4 0 4.3 1.8 4.6 4.2"
        stroke={STROKE}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      {/* front person */}
      <circle cx="9" cy="9.5" r="3" fill={FILL} stroke={STROKE} strokeWidth={strokeWidth} />
      <path
        d="M3 19.5c.4-2.9 2.7-4.8 6-4.8s5.6 1.9 6 4.8"
        fill={FILL}
        stroke={STROKE}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Base>
  );
}
