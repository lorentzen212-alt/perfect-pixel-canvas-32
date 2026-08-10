import * as React from "react";
import { SERIF } from "@/components/DashboardChrome";

/* ── "Booking folder" materials ──────────────────────────────
   folder  = cool blue-grey stone plate
   raised  = warm ivory card lifted 2–3px off the stone
   inset   = ivory card pressed into a groove in the stone     */

export const FOLDER_STONE = "#CED2D3";
export const FOLDER_SURFACE =
  "linear-gradient(180deg, #D6D9DA 0%, #CED2D3 44%, #C5CACC 100%)";

export const IVORY = "#F6F4EF";
export const IVORY_SURFACE =
  "linear-gradient(180deg, #FAF8F4 0%, #F6F4EF 55%, #F1EEE7 100%)";
export const IVORY_EDGE = "rgba(31,44,56,0.16)";
export const RAISED_SHADOW =
  "inset 0 1px 0 rgba(255,255,255,0.78), inset 0 -1px 0 rgba(31,44,56,0.06), 0 1px 1px rgba(15,25,35,0.09), 0 3px 6px -2px rgba(15,25,35,0.18)";
export const INSET_SHADOW =
  "inset 1px 1px 2px rgba(20,30,35,0.10), inset -1px -1px 1px rgba(255,255,255,0.65), inset 0 0 0 1px rgba(31,44,56,0.10)";
export const GROOVE_SHADOW =
  "inset 0 1px 2px rgba(20,30,35,0.22), inset 0 -1px 0 rgba(255,255,255,0.5)";

export const INK = "#16242F";
export const INK_SOFT = "rgba(22,36,47,0.68)";
export const INK_FAINT = "rgba(22,36,47,0.48)";
export const HAIR = "rgba(22,36,47,0.12)";

export const GOLD_HI = "#F3D987";
export const GOLD_MET = "#C0932F";
export const GOLD_DEEP_MET = "#A5761A";
export const GREEN_DONE = "#4E7A5C";

/* ── raised ivory card ─────────────────────────────────────── */
export function RaisedCard({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section
      className={`rounded-[14px] ${className}`}
      style={{
        background: IVORY_SURFACE,
        border: `1px solid ${IVORY_EDGE}`,
        boxShadow: RAISED_SHADOW,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

/* ── ivory card pressed into the stone (premium business card) ── */
export function InsetCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className="rounded-[16px] p-[7px]"
      style={{ background: "rgba(28,42,54,0.07)", boxShadow: GROOVE_SHADOW }}
    >
      <section
        className={`rounded-[11px] ${className}`}
        style={{
          background: "linear-gradient(180deg, #F3F0EA 0%, #F7F5F0 100%)",
          boxShadow: INSET_SHADOW,
        }}
      >
        {children}
      </section>
    </div>
  );
}

export function CardEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
      style={{ color: INK_FAINT }}
    >
      {children}
    </p>
  );
}

export function CardTitle({
  children,
  size = 20,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <h3
      className="leading-tight"
      style={{ color: INK, fontFamily: SERIF, fontWeight: 500, fontSize: size }}
    >
      {children}
    </h3>
  );
}

/* ── quiet gold text action ────────────────────────────────── */
export function FolderAction({
  label,
  onClick,
  className = "",
  arrow = "→",
}: {
  label: string;
  onClick?: () => void;
  className?: string;
  arrow?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-opacity hover:opacity-75 ${className}`}
      style={{ color: GOLD_DEEP_MET }}
    >
      {label}
      <span aria-hidden className="text-[13px] leading-none">
        {arrow}
      </span>
    </button>
  );
}

/* ── vertical "what happens next" timeline ─────────────────── */
export type NextStep = {
  label: string;
  sub: string;
  state: "done" | "active" | "todo";
};

export function NextTimeline({ steps }: { steps: NextStep[] }) {
  return (
    <ol className="mt-5">
      {steps.map((s, i) => (
        <li key={s.label} className="relative flex gap-4 pb-5 last:pb-0">
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="absolute left-[13px] top-[27px] w-px"
              style={{
                bottom: 2,
                background:
                  s.state === "done"
                    ? "rgba(78,122,92,0.45)"
                    : s.state === "active"
                      ? `linear-gradient(180deg, ${GOLD_MET}, rgba(22,36,47,0.14))`
                      : "rgba(22,36,47,0.14)",
              }}
            />
          )}
          <span
            className="relative z-[1] mt-[1px] grid h-[27px] w-[27px] shrink-0 place-items-center rounded-full text-[11.5px] font-semibold"
            style={
              s.state === "done"
                ? { backgroundColor: GREEN_DONE, color: "#EFF6F1" }
                : s.state === "active"
                  ? {
                      background: `linear-gradient(180deg, ${GOLD_HI}, ${GOLD_MET})`,
                      color: "#2A1F06",
                      boxShadow: "0 0 0 4px rgba(192,147,47,0.16)",
                    }
                  : {
                      background: IVORY,
                      color: INK_FAINT,
                      boxShadow: "inset 0 0 0 1px rgba(192,147,47,0.45)",
                    }
            }
          >
            {s.state === "done" ? "✓" : i + 1}
          </span>
          <span className="min-w-0 pt-[3px]">
            <span
              className="block truncate text-[13.5px]"
              style={{ color: INK, fontWeight: s.state === "active" ? 600 : 500 }}
            >
              {s.label}
            </span>
            <span
              className="mt-[2px] block truncate text-[12px]"
              style={{ color: s.state === "active" ? GOLD_DEEP_MET : INK_SOFT }}
            >
              {s.sub}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/* ── closing four-cell summary strip ───────────────────────── */
export type SummaryCell = {
  icon: React.ReactNode;
  lead: string;
  label: string;
  onAction?: () => void;
  actionLabel?: string;
};

export function SummaryStrip({ cells }: { cells: SummaryCell[] }) {
  return (
    <RaisedCard>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {cells.map((c, i) => (
          <div
            key={c.label}
            className="flex items-center gap-3.5 px-5 py-[17px]"
            style={{
              borderLeft: i % 4 !== 0 ? `1px solid ${HAIR}` : undefined,
              borderTop: i > 0 ? `1px solid ${HAIR}` : undefined,
            }}
          >
            <span
              className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-full"
              style={{ boxShadow: "inset 0 0 0 1px rgba(192,147,47,0.42)", color: GOLD_MET }}
            >
              {c.icon}
            </span>
            <span className="min-w-0">
              <span
                className="block truncate text-[15.5px] leading-tight"
                style={{ color: INK, fontFamily: SERIF, fontWeight: 500 }}
              >
                {c.lead}
              </span>
              <span
                className="mt-[2px] block truncate text-[10.5px] uppercase tracking-[0.16em]"
                style={{ color: INK_FAINT }}
              >
                {c.label}
              </span>
              {c.onAction && (
                <FolderAction
                  label={c.actionLabel ?? "View details"}
                  onClick={c.onAction}
                  className="mt-[3px]"
                />
              )}
            </span>
          </div>
        ))}
      </div>
    </RaisedCard>
  );
}

/* ── compact secondary section inside the same folder ──────── */
export function FolderSection({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <RaisedCard className={`p-5 ${className}`}>
      <div className="flex items-baseline justify-between gap-4">
        <CardTitle size={16}>{title}</CardTitle>
        {action}
      </div>
      {children}
    </RaisedCard>
  );
}
