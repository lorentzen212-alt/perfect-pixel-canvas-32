import * as React from "react";
import { ArrowRight } from "lucide-react";
import {
  AMBER,
  AMBER_DEEP,
  FOLDER_RIM,
  FOLDER_TOP_SURFACE,
  GOLD,
  HAIR,
  INK,
  INK_3,
  IVORY,
  IVORY_BORDER,
  IVORY_SHADOW,
  SAND,
  SLOT_BG,
  SLOT_CARD_SHADOW,
  SLOT_GROOVE,
  SLOT_SHADOW,
} from "./materials";

/* ── the folder itself: a rigid object with visible thickness ── */
export function Plate({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex flex-col"
      style={{
        background: `linear-gradient(180deg, ${FOLDER_EDGE} 0%, ${FOLDER_EDGE_DEEP} 100%)`,
        borderRadius: 16,
        padding: `0 5px ${FOLDER_DEPTH}px`,
        boxShadow: FOLDER_CONTACT,
      }}
    >
      <div
        className="flex flex-col"
        style={{
          background: FOLDER_TOP_SURFACE,
          borderRadius: "12px 12px 13px 13px",
          boxShadow: `inset 0 1px 0 ${FOLDER_RIM}, inset 0 -1px 0 ${FOLDER_BREAK}, inset 1px 0 0 rgba(255,255,255,0.45), inset -1px 0 0 rgba(38,44,50,0.06)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── ivory card resting 2–3px above the folder ── */
export function Card({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        background: IVORY,
        border: IVORY_BORDER,
        borderRadius: 12,
        boxShadow: IVORY_SHADOW,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── recessed socket cut into the folder ── */
export function Slot({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: SLOT_BG,
        borderRadius: 14,
        boxShadow: SLOT_SHADOW,
        padding: SLOT_GROOVE,
      }}
    >
      <div
        style={{
          background: IVORY,
          borderRadius: 9,
          boxShadow: SLOT_CARD_SHADOW,
          border: "1px solid rgba(38,44,50,0.06)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── soft sand medallion ── */
export function Medallion({
  children,
  size = 48,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        height: size,
        width: size,
        background: SAND,
        color: "#8A6A3A",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85), 0 1px 1px rgba(24,30,36,0.06)",
      }}
    >
      {children}
    </span>
  );
}

/* ── shine gold action — polished champagne/metallic gold ── */
export function ShineGoldButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shine-gold-cta inline-flex items-center justify-center gap-2 rounded-full px-6 py-[10px] text-[14px] font-medium ${className}`}
      style={{
        background:
          "linear-gradient(135deg, #B8860B 0%, #DAA520 28%, #F0D878 50%, #DAA520 68%, #8B6914 100%)",
        color: "#1A0F00",
        boxShadow: "0 2px 8px rgba(139,105,20,0.30)",
      }}
    >
      {children}
    </button>
  );
}

/* ── solid amber action ── */
export function SolidButton({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 px-5 py-[11px] text-[13px] font-semibold transition-transform hover:-translate-y-[1px] ${className}`}
      style={{
        background: `linear-gradient(180deg, ${AMBER} 0%, ${AMBER_DEEP} 100%)`,
        color: "#FFF9EE",
        borderRadius: 6,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.28), 0 1px 2px rgba(24,30,36,0.28), 0 4px 10px rgba(24,30,36,0.16)",
      }}
    >
      {children}
    </button>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-[10px] font-semibold uppercase"
      style={{ color: INK_3, letterSpacing: "0.18em" }}
    >
      {children}
    </span>
  );
}

export function Hair({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`block h-px ${className}`} style={{ background: HAIR }} />;
}

export function GoldLink({
  label,
  onClick,
  className = "",
}: {
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70 ${className}`}
      style={{ color: GOLD }}
    >
      {label}
      <ArrowRight size={13} />
    </button>
  );
}

export function SectionRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <span
        className="text-[10px] font-semibold uppercase"
        style={{ color: "rgba(24,35,44,0.45)", letterSpacing: "0.2em" }}
      >
        {label}
      </span>
      <span
        aria-hidden
        className="h-px flex-1"
        style={{ background: "linear-gradient(90deg, rgba(24,35,44,0.16), rgba(24,35,44,0.03))" }}
      />
    </div>
  );
}

export function SubCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[12.5px] font-semibold" style={{ color: INK }}>
          {title}
        </span>
        {action}
      </div>
      {children}
    </Card>
  );
}
