import { LuxIconBadge } from "@/features/me/step3/icons";
import { SERIF } from "@/features/me/tokens";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronDown, Minus, Plus } from "lucide-react";
import React from "react";

export function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[#0A1B2C] text-[13.5px] font-semibold">{label}</span>
      <div
        className="group mt-2 flex items-center gap-2 rounded-[10px] px-3 h-[46px] transition-all focus-within:border-[#D4AF37] focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.14)]"
        style={{
          backgroundColor: "#FAF8F4",
          border: "1px solid #E6E2D5",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
        }}
      >
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[14px] text-[#0A1B2C]"
        />
        <CalendarIcon size={16} style={{ color: "#B88917" }} />
      </div>
    </label>
  );
}

export function Counter({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[#0A1B2C] text-[13px] font-medium mb-2 flex items-center gap-2">
        {icon ? <LuxIconBadge size={28}>{icon}</LuxIconBadge> : null}
        <span>{label}</span>
      </div>
      <div
        className="flex items-center justify-between rounded-[10px] h-[46px] px-1.5"
        style={{
          backgroundColor: "#FAF8F4",
          border: "1px solid #E6E2D5",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
        }}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[#0F1115]"
          style={{ color: "#B88917" }}
          aria-label={`Decrease ${label}`}
        >
          <Minus size={15} />
        </button>
        <span className="text-[#0A1B2C] text-[15px] font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[#0F1115] hover:text-[#EBCB6A]"
          style={{ color: "#B88917" }}
          aria-label={`Increase ${label}`}
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

export const ROOM_CATEGORY_OPTIONS = [
  "Standard",
  "Superior",
  "Premium",
  "Junior Suite",
  "Suite",
] as const;

export function RoomRow({
  icon,
  image,
  label,
  value,
  onChange,
  category,
  onCategoryChange,
}: {
  icon?: React.ReactNode;
  image?: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  category: string;
  onCategoryChange: (c: string) => void;
}) {
  return (
    <div
      className="rounded-[16px] px-4 sm:px-5 py-4 sm:py-4"
      style={{
        backgroundColor: "#FAF8F4",
        border: "1px solid #ECE7DC",
        boxShadow:
          "0 6px 20px -14px rgba(10,27,44,0.20), 0 1px 2px rgba(10,27,44,0.03)",
      }}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 sm:gap-6">
        {image ? (
          <div
            className="overflow-hidden shrink-0"
            style={{
              width: 112,
              height: 50,
              borderRadius: 10,
              border: "1px solid #D4AF37",
              boxShadow:
                "0 4px 10px -6px rgba(10,27,44,0.25), 0 1px 2px rgba(10,27,44,0.06), inset 0 0 0 1px rgba(255,255,255,0.35)",
            }}
          >
            <img
              src={image}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          <LuxIconBadge size={44} finish="engraved">{icon}</LuxIconBadge>
        )}
        <div className="min-w-0 text-[#0A1B2C] text-[15px] sm:text-[16px] font-medium truncate">
          {label}
        </div>
        <div
          className="col-span-3 sm:col-span-1 flex items-center justify-between sm:justify-center rounded-[10px] h-[44px] sm:w-[132px] px-1.5"
          style={{
            backgroundColor: "#FAF8F4",
            border: "1px solid #E6E2D5",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
          }}
        >
          <button
            type="button"
            onClick={() => onChange(Math.max(0, value - 1))}
            className="qty-btn inline-flex h-8 w-8 items-center justify-center"
            aria-label={`Decrease ${label}`}
          >
            <Minus size={15} />
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              const n = raw === "" ? 0 : Math.max(0, Math.min(parseInt(raw, 10), 999));
              onChange(n);
            }}
            onBlur={(e) => {
              if (e.target.value === "") onChange(0);
            }}
            className="w-8 bg-transparent text-center text-[#0A1B2C] text-[15px] font-semibold tabular-nums outline-none"
            aria-label={`${label} quantity`}
          />
          <button
            type="button"
            onClick={() => onChange(value + 1)}
            className="qty-btn inline-flex h-8 w-8 items-center justify-center"
            aria-label={`Increase ${label}`}
          >
            <Plus size={15} />
          </button>
        </div>
        <div className="col-span-3 sm:col-span-1 relative sm:w-[180px]">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full appearance-none rounded-[10px] h-[44px] pl-3 pr-9 text-[14px] text-[#0A1B2C] outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.14)]"
            style={{
              backgroundColor: "#FAF8F4",
              border: "1px solid #E6E2D5",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
            }}
            aria-label={`Preferred category for ${label}`}
          >
            {ROOM_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "#B88917" }}
          />
        </div>
      </div>
    </div>
  );
}

export function MealOption({
  icon,
  image,
  label,
  selected,
  onClick,
}: {
  icon?: React.ReactNode;
  image?: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "meal-card flex items-center justify-between rounded-[14px] px-4 h-[56px] text-left",
        selected && "meal-card-selected"
      )}
    >
      <span className="flex items-center gap-3">
        {image ? (
          <span
            className="overflow-hidden shrink-0 block"
            style={{
              width: 54,
              height: 40,
              borderRadius: 8,
              border: "1px solid #D4AF37",
              boxShadow:
                "0 3px 8px -5px rgba(10,27,44,0.25), 0 1px 2px rgba(10,27,44,0.06), inset 0 0 0 1px rgba(255,255,255,0.35)",
            }}
          >
            <img src={image} alt="" loading="lazy" className="w-full h-full object-cover" draggable={false} />
          </span>
        ) : (
          <LuxIconBadge size={36} finish="engraved">{icon}</LuxIconBadge>
        )}
        <span className="text-[#0A1B2C] text-[14.5px] font-medium">{label}</span>
      </span>
      <span
        className="relative inline-flex h-5 w-5 items-center justify-center rounded-full"
        style={{
          background: selected
            ? "conic-gradient(from 210deg, #F3DFA2, #C9A24A, #8A6318, #E8CE86, #F3DFA2)"
            : "#FFFFFF",
          padding: selected ? "2px" : "1px",
          boxShadow: selected
            ? "0 0 0 1px rgba(212,175,55,0.22), 0 1px 2px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.55)"
            : "inset 0 0 0 1.5px #CFC4B4, 0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <span
          className="flex h-full w-full items-center justify-center rounded-full"
          style={{ background: "#FAF8F4" }}
        >
          {selected && (
            <span
              className="h-2 w-2 rounded-full"
              style={{
                background: "radial-gradient(circle at 30% 30%, #FBEAB0 0%, #D4AF37 55%, #9A6E14 100%)",
                boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.7), 0 0 3px rgba(212,175,55,0.5)",
              }}
            />
          )}
        </span>
      </span>
    </button>
  );
}

export function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <LuxIconBadge size={32} tone="onDark">
          {icon}
        </LuxIconBadge>
        <span className="text-white/85 text-[14px]">{label}</span>
      </div>
      <span
        className="text-white text-[16px] font-semibold tabular-nums"
        style={{ fontFamily: SERIF }}
      >
        {value}
      </span>
    </div>
  );
}
