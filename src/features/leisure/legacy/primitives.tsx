import { GOLD, GOLD_SOFT, HAIR, INK, MUTED, NAVY_DEEP, SERIF } from "@/features/leisure/tokens";
import { cn } from "@/lib/utils";
import { Check, Loader2, Minus, Plus } from "lucide-react";
import React from "react";

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: NAVY_DEEP }}>
      {children}
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <Label>
        {label}
        {optional && <span style={{ color: MUTED, fontWeight: 400 }}> (optional)</span>}
      </Label>
      <div
        className="mt-3 rounded-[14px] bg-white px-4 py-3.5"
        style={{ border: `1px solid ${HAIR}` }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9CA3AF]"
        />
      </div>
    </div>
  );
}

export function Counter({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="grid h-8 w-8 place-items-center rounded-full transition-colors"
        style={{
          border: `1px solid ${HAIR}`,
          color: value === 0 ? "#C9CFD6" : NAVY_DEEP,
          backgroundColor: "#FFF",
        }}
        disabled={value === 0}
      >
        <Minus size={14} strokeWidth={2.2} />
      </button>
      <span
        className="min-w-[28px] text-center text-[16px] font-semibold"
        style={{ color: NAVY_DEEP, fontFamily: SERIF }}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="grid h-8 w-8 place-items-center rounded-full transition-colors"
        style={{
          border: `1px solid ${GOLD}`,
          color: NAVY_DEEP,
          backgroundColor: "rgba(201,162,74,0.12)",
        }}
      >
        <Plus size={14} strokeWidth={2.2} />
      </button>
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all"
      style={{
        backgroundColor: checked ? "rgba(201,162,74,0.14)" : "#FFF",
        color: checked ? NAVY_DEEP : INK,
        border: `1px solid ${checked ? GOLD : HAIR}`,
      }}
    >
      <span
        className="grid h-4 w-4 place-items-center rounded-full"
        style={{
          backgroundColor: checked ? GOLD : "transparent",
          border: `1.5px solid ${checked ? GOLD : HAIR}`,
        }}
      >
        {checked && <Check size={10} strokeWidth={3} style={{ color: NAVY_DEEP }} />}
      </span>
      {label}
    </button>
  );
}

export function PrimaryButton({
  onClick,
  label,
  loading,
  disabled,
  trailing,
}: {
  onClick: () => void;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-[12px] px-7 py-3.5 text-[14px] font-semibold tracking-wide transition-all",
        (disabled || loading) && "opacity-60 cursor-not-allowed",
      )}
      style={{
        background: `linear-gradient(135deg, ${GOLD_SOFT} 0%, ${GOLD} 100%)`,
        color: NAVY_DEEP,
        boxShadow: "0 14px 34px -14px rgba(201,162,74,0.55), inset 0 1px 0 rgba(255,255,255,0.35)",
      }}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {label}
      {trailing}
    </button>
  );
}
