import * as React from "react";
import { ArrowRight } from "lucide-react";
import {
  FOLDER_CONTACT,
  FOLDER_DEPTH,
  FOLDER_EDGE,
  FOLDER_EDGE_DEEP,
  FOLDER_RIM,
  FOLDER_TOP_SURFACE,
  GOLD,
  HAIR,
  INK,
  INK_3,
  IVORY,
  IVORY_BORDER,
  IVORY_SHADOW,
  SLOT_BG,
  SLOT_SHADOW,
} from "./materials";

/* ── the folder itself: a rigid object with visible thickness ── */
export function Plate({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative"
      style={{
        background: `linear-gradient(180deg, ${FOLDER_EDGE} 0%, ${FOLDER_EDGE_DEEP} 100%)`,
        borderRadius: "14px 14px 16px 16px",
        padding: `0 3px ${FOLDER_DEPTH}px`,
        boxShadow: FOLDER_CONTACT,
      }}
    >
      <div
        style={{
          background: FOLDER_TOP_SURFACE,
          borderRadius: "12px 12px 14px 14px",
          boxShadow: `inset 0 1px 0 ${FOLDER_RIM}, inset 0 -1px 0 rgba(255,255,255,0.30)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── ivory card resting on the folder (2–3px lift) ── */
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
        borderRadius: 10,
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
        borderRadius: 12,
        boxShadow: SLOT_SHADOW,
        padding: 7,
      }}
    >
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-[10px] font-semibold uppercase"
      style={{ color: INK_3, letterSpacing: "0.2em" }}
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
