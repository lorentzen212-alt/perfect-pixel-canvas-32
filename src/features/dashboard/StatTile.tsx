import { SERIF } from "./tokens";

/* ── stat tiles ──────────────────────────────────────── */

export function StatTile({
  label,
  count,
  icon,
  active,
  accent,
  onClick,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  active: boolean;
  action?: boolean;
  footer?: string;
  accent: string;
  bgPos?: string;
  onClick: () => void;
}) {

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="hgb-stat-tile relative flex w-full flex-col justify-center overflow-hidden rounded-[14px] text-left transition-all duration-200 hover:-translate-y-[2px]"
      style={{
        background: "#28353F",
        backgroundImage: "none",
        border: "1px solid rgba(150,170,185,0.32)",
        boxShadow:
          "0 8px 20px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.035)",
        paddingLeft: 30,
        paddingRight: 28,
        paddingTop: 18,
        paddingBottom: 18,
      }}
    >
      <span className="flex items-center" style={{ gap: 18 }}>
        <span className="flex shrink-0 items-center justify-center" style={{ color: accent, width: 30, height: 30 }}>
          {icon}
        </span>
        <span className="flex min-w-0 flex-col items-start">
          <span
            className="status-number block text-[32px]"
            style={{
              color: "rgba(250,248,243,0.97)",
              fontFamily: SERIF,
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              margin: 0,
              padding: 0,
            }}
          >
            {count}
          </span>
          <span
            className="status-label block truncate text-[14px] font-medium"
            style={{
              color: "rgba(239,243,246,0.92)",
              lineHeight: 1.2,
              marginTop: 4,
            }}
          >
            {label}
          </span>
        </span>
      </span>
    </button>
  );
}
