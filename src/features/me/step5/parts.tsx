import { GOLD } from "@/features/me/tokens";
import { Check } from "lucide-react";
import React from "react";

/* Premium radio option pill (ivory card style) */
export function RadioOption({
  label,
  selected,
  onClick,
  badge,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[10px] px-5 py-2.5 text-left transition-all"
      style={{
        background: selected ? "linear-gradient(180deg, #FFFDF3 0%, #FBF3DC 100%)" : "#FFFFFF",
        border: selected ? "1px solid #C79A32" : "1px solid #E4DDC8",
        boxShadow: selected ? "inset 0 1px 0 rgba(255,255,255,0.7), 0 2px 6px -3px rgba(184,138,46,0.25)" : "none",
      }}
    >
      <span
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
        style={{
          background: "#FAF8F4",
          border: "1.5px solid #2B2B2B",
        }}
      >
        {selected && (
          <span
            className="block rounded-full"
            style={{ width: 7, height: 7, background: "#2B2B2B" }}
          />
        )}
      </span>
      <span className="text-[13px] text-[#0A1B2C] flex-1 whitespace-nowrap">{label}</span>
      {badge && (
        <span
          className="text-[8.5px] font-semibold uppercase tracking-wide px-1.5 py-[1px] rounded-full whitespace-nowrap"
          style={{ color: "#8A6416", background: "#FBF0CE", border: "1px solid #E9D89A" }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

export function CheckOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-[10px] px-5 py-2.5 text-left transition-all"
      style={{
        background: selected ? "linear-gradient(180deg, #FFFDF3 0%, #FBF3DC 100%)" : "#FFFFFF",
        border: selected ? "1px solid #C79A32" : "1px solid #E4DDC8",
      }}
    >
      <span
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px]"
        style={{
          background: selected ? GOLD : "#FFFFFF",
          border: selected ? "1px solid #B88917" : "1.5px solid #D9D2BE",
        }}
      >
        {selected && <Check size={11} strokeWidth={3.5} style={{ color: "#FFFFFF" }} />}
      </span>
      <span className="text-[13px] text-[#0A1B2C] flex-1 whitespace-nowrap">{label}</span>
    </button>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[12px] font-semibold text-[#0A1B2C] mb-2 tracking-wide">
      {children}
    </label>
  );
}

export const inputStyle: React.CSSProperties = {
  background: "#FAF8F4",
  border: "1px solid #E8E0D3",
  color: "#0A1B2C",
};

export function NumberStepper({ value, onChange, min = 0 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div
      className="inline-flex items-center rounded-[10px] overflow-hidden"
      style={{ background: "#FAF8F4", border: "1px solid #E8E0D3" }}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="h-9 w-9 grid place-items-center text-[#B88A2E] hover:bg-[#FBF3DC] transition-colors"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
        className="h-9 w-14 text-center text-[13.5px] text-[#0A1B2C] outline-none"
        style={{ background: "transparent" }}
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="h-9 w-9 grid place-items-center text-[#B88A2E] hover:bg-[#FBF3DC] transition-colors"
      >
        +
      </button>
    </div>
  );
}

export function DoneButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[10px] text-[13.5px] font-semibold text-[#0A1B2C] transition-all duration-200 hover:brightness-105"
      style={{
        height: 42,
        background: `linear-gradient(180deg, #FFFDF6 0%, #FBF3DC 100%)`,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 6px 14px -10px rgba(184,138,46,0.35)",
        border: "1px solid #C79A32",
      }}
    >
      Done
      <Check size={15} strokeWidth={2.6} style={{ color: "#B88A2E" }} />
    </button>
  );
}
