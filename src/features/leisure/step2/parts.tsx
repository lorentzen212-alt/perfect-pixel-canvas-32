import { GUESTS_PER_ROOM } from "@/features/leisure/stay";
import { ACCESSIBLE_CATEGORY_LABEL, ROOM_CATEGORY_OPTIONS, STEP2_ROOMS } from "@/features/leisure/step2/data";
import { S2_FIELD, S2_GOLD_SOFT, SERIF } from "@/features/leisure/tokens";
import { format } from "date-fns";
import { Accessibility, BedDouble, CalendarDays, Check, ChevronDown, Minus, Plus, User as UserIcon, Users } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/* Thin champagne rule with a small centred diamond. */
export function S2DiamondRule({ width = 120, refined = false }: { width?: number; refined?: boolean }) {
  return (
    <div
      className="flex items-center"
      style={{
        width,
        marginTop: refined ? 40 : undefined,
        marginBottom: refined ? 40 : undefined,
      }}
    >
      <span className="h-px flex-1" style={{ background: refined ? "rgba(217,191,130,0.38)" : "rgba(217,191,130,0.55)" }} />
      <span
        className="mx-2 block"
        style={{
          width: refined ? 3.5 : 5,
          height: refined ? 3.5 : 5,
          transform: "rotate(45deg)",
          border: refined ? "1px solid rgba(231,211,164,0.7)" : "1px solid rgba(231,211,164,0.9)",
        }}
      />
      <span className="h-px flex-1" style={{ background: refined ? "rgba(217,191,130,0.38)" : "rgba(217,191,130,0.55)" }} />
    </div>
  );
}

export function S2LuxeStat({
  icon,
  value,
  label,
  first = false,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  first?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-[3px] px-[16px]"
      style={{ borderLeft: first ? undefined : "1px solid rgba(199,171,119,0.15)" }}
    >
      <span aria-hidden className="leading-none" style={{ color: "#D4B683" }}>
        {icon}
      </span>
      <span
        className="text-[19px] leading-none"
        style={{
          color: "#F4EFE6",
          fontWeight: 400,
          fontFamily: '"Playfair Display", "Cormorant Garamond", serif',
        }}
      >
        {value}
      </span>
      <span className="text-[10.5px] leading-none" style={{ color: "#C7AB77", letterSpacing: "0.08em" }}>
        {label}
      </span>
    </div>


  );
}

export function S2StayDivider() {

  return (
    <span
      aria-hidden
      className="mx-[8px] hidden sm:block"
      style={{ width: 1, height: 20, backgroundColor: "rgba(255,255,255,0.10)" }}
    />
  );
}

export function S2StayInfo({
  icon,
  text,
  onClick,
  tone = "primary",
}: {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  tone?: "primary" | "remove";
}) {
  const isRemove = tone === "remove";
  const content = (
    <>
      <span
        className="s2-stay-info-icon transition-colors duration-200"
        style={{ color: isRemove ? "rgba(232,228,220,0.75)" : "#E8E4DC", opacity: 1 }}
      >
        {icon}
      </span>
      <span
        className="s2-stay-info-text transition-colors duration-200"
        style={{
          color: isRemove ? "rgba(232,228,220,0.75)" : "#E8E4DC",
          fontWeight: 500,
        }}
      >
        {text}
      </span>
    </>
  );
  const cls =
    "s2-stay-info group flex min-w-0 flex-1 basis-0 items-center justify-center gap-2.5 whitespace-nowrap py-1 text-[14.5px]";

  if (isRemove) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cls}
        onMouseEnter={(e) => {
          e.currentTarget.querySelectorAll<HTMLElement>(".s2-stay-info-icon, .s2-stay-info-text").forEach((el) => {
            el.style.color = "#B99A60";
          });
        }}
        onMouseLeave={(e) => {
          e.currentTarget.querySelectorAll<HTMLElement>(".s2-stay-info-icon, .s2-stay-info-text").forEach((el) => {
            el.style.color = "rgba(232,228,220,0.75)";
          });
        }}
      >
        {content}
      </button>
    );
  }

  return onClick ? (
    <button type="button" onClick={onClick} className={cls}>
      {content}
    </button>
  ) : (
    <span className={cls}>{content}</span>
  );
}

export function S2Metric({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[14px]" style={{ color: "rgba(245,241,230,0.85)" }}>
      <span style={{ color: S2_GOLD_SOFT }}>{icon}</span>
      {text}
    </div>
  );
}

export function S2DateField({
  label,
  value,
  editable,
  min,
  onChange,
}: {
  label: string;
  value: string;
  editable?: boolean;
  min?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span
        className="text-[11.5px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: "rgba(245,241,230,0.5)" }}
      >
        {label}
      </span>
      <div
        className="mt-2.5 flex h-[58px] items-center gap-3.5 px-5 transition-colors duration-200"
        style={{
          borderRadius: 14,
          backgroundColor: S2_FIELD,
          border: `1px solid ${value ? "rgba(217,191,130,0.32)" : "rgba(255,255,255,0.08)"}`,
        }}
      >
        <CalendarDays size={18} strokeWidth={1.9} style={{ color: S2_GOLD_SOFT }} />
        {editable ? (
          <input
            type="date"
            value={value}
            min={min}
            onChange={(e) => onChange?.(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none [color-scheme:dark]"
          />
        ) : (
          <span className="truncate text-[15px] text-white">{value ? format(new Date(value), "d MMMM yyyy") : "—"}</span>
        )}
      </div>
    </label>
  );
}

/* ---- Step 2 luxury room card ---- */
export function S2RoomCard({
  roomKey,
  value,
  onChange,
  category,
  onCategoryChange,
}: {
  roomKey: string;
  value: number;
  onChange: (v: number) => void;
  category?: string;
  onCategoryChange?: (v: string) => void;
}) {
  const meta = STEP2_ROOMS.find((r) => r.key === roomKey)!;
  const active = value > 0;
  const categoryOptions = ROOM_CATEGORY_OPTIONS[roomKey];
  const capacity =
    roomKey === "family"
      ? "2–4 Guests"
      : roomKey === "accessible"
        ? "1–2 Guests"
        : `${GUESTS_PER_ROOM[roomKey] ?? 1} ${(GUESTS_PER_ROOM[roomKey] ?? 1) === 1 ? "Guest" : "Guests"}`;
  const showInfo = roomKey === "family" || roomKey === "accessible";

  return (
    <div
      className="group s2-room-card flex h-full flex-col overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-out"
      data-active={active ? "true" : "false"}
      style={{
        borderRadius: 20,
        backgroundColor: "#F8F5F0",
        padding: 0,
        border: `1px solid ${active ? "rgba(198,169,103,0.5)" : "rgba(205,173,96,0.18)"}`,
        boxShadow:
          "0 2px 4px rgba(8,19,31,0.03), 0 18px 34px -12px rgba(8,19,31,0.16)",
      }}
    >
      {/* 1 — full-bleed image */}
      <img
        src={meta.img}
        alt={meta.title}
        style={{
          display: "block",
          width: "100%",
          height: 190,
          objectFit: "cover",
          objectPosition: "center",
          margin: 0,
          padding: 0,
          borderTopLeftRadius: 19,
          borderTopRightRadius: 19,
        }}
      />

      {/* metallic champagne divider between image and content */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, rgba(205,173,96,0.10) 0%, rgba(214,187,124,0.55) 50%, rgba(205,173,96,0.10) 100%)",
        }}
      />

      {/* 2 — name + guest count + learn more */}
      <div
        className="flex flex-1 flex-col"
        style={{
          padding: "22px 22px 16px",
          backgroundImage:
            "linear-gradient(180deg, rgba(240,232,219,0.55) 0%, rgba(248,245,240,0) 90px)",
        }}
      >

        <div className="flex items-start justify-between gap-2">
          <div
            className="truncate text-[18px] leading-[1.15]"
            style={{ fontFamily: SERIF, fontWeight: 500, color: "#182333" }}
          >
            {meta.title}
          </div>
          {showInfo && (
            <span
              title={meta.desc}
              aria-label={meta.desc}
              className="mt-[2px] grid h-[20px] w-[20px] shrink-0 place-items-center rounded-full text-[12px] font-normal transition-colors duration-200"
              style={{ border: "1px solid rgba(198,169,103,0.75)", color: "#B39254", fontFamily: SERIF }}
            >
              i
            </span>
          )}
        </div>
        <div className="mt-[6px] flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-[8px] text-[15px] font-medium leading-none"
            style={{ color: "#7D8188" }}
          >
            <span style={{ color: "#C0A062", display: "inline-flex" }}>{roomIcon(roomKey)}</span>
            {capacity}
          </div>
          {!showInfo && (
            <span
              title={meta.desc}
              className="flex shrink-0 cursor-default items-center gap-[5px] text-[14px] font-medium leading-none transition-opacity duration-200 hover:opacity-75"
              style={{ color: "#8B6A2F" }}
            >
              Learn more
              <ChevronDown
                size={14}
                strokeWidth={1.9}
                style={{ transform: "rotate(-90deg)", color: "#8B6A2F" }}
              />
            </span>
          )}
        </div>

        {/* hairline divider */}
        <div
          className="h-px"
          style={{ backgroundColor: "#ECE5DB", marginTop: 12, marginBottom: 10 }}
        />

        {/* 3 — control row */}
        <div className="mt-auto flex w-full items-center gap-[10px]">
          <S2Counter light value={value} onChange={onChange} label={meta.title} />
          {categoryOptions ? (
            <div className="min-w-0 flex-1">
              <S2CategorySelect
                light
                value={category ?? categoryOptions[0]}
                options={categoryOptions}
                label={`${meta.title} category`}
                onChange={(v) => onCategoryChange?.(v)}
              />
            </div>
          ) : (
            <div
              className="flex h-[42px] min-w-0 flex-1 items-center justify-between gap-1 overflow-hidden text-[15px] font-medium"
              style={{
                borderRadius: 12,
                padding: "0 18px",
                color: "#FFFFFF",
                backgroundColor: "#0F2946",
              }}
              title={ACCESSIBLE_CATEGORY_LABEL}
            >
              <span className="truncate">{ACCESSIBLE_CATEGORY_LABEL}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Step 2 premium custom category dropdown (portal / floating) ---- */
export let s2OpenDropdownId = 0;

export function S2CategorySelect({
  value,
  options,
  onChange,
  label,
  light = false,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  label: string;
  light?: boolean;
}) {
  const idRef = useRef(++s2OpenDropdownId);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [rect, setRect] = useState<{ left: number; top: number; width: number; up: boolean }>({
    left: 0,
    top: 0,
    width: 0,
    up: false,
  });
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useMemo(() => [...options], [options]);
  const ROW_H = 46;
  const GAP = 12;
  const PAD = 8;
  const menuHeight = items.length * ROW_H + (items.length - 1) * GAP + PAD * 2 + 2;

  const measure = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const up = spaceBelow < menuHeight + 16 && r.top > spaceBelow;
    setRect({
      left: r.left,
      top: up ? r.top - 8 - menuHeight : r.bottom + 8,
      width: r.width,
      up,
    });
  }, [menuHeight]);

  const close = React.useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 180);
  }, []);

  useEffect(() => {
    if (!open) return;
    measure();
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onOther = (e: Event) => {
      if ((e as CustomEvent).detail !== idRef.current) close();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("s2-dropdown-open", onOther as EventListener);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("s2-dropdown-open", onOther as EventListener);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, measure, close]);

  const toggle = () => {
    if (open) close();
    else {
      setActiveIdx(Math.max(0, items.indexOf(value)));
      measure();
      window.dispatchEvent(new CustomEvent("s2-dropdown-open", { detail: idRef.current }));
      setOpen(true);
    }
  };
  const onKeyDown = (e: React.KeyboardEvent) => {

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) {
        onChange(items[activeIdx] ?? "");
        close();
      } else toggle();
      return;
    }
    if (e.key === "Escape") {
      if (open) close();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        toggle();
        return;
      }
      setActiveIdx((i) => {
        const n = items.length;
        return e.key === "ArrowDown" ? (i + 1) % n : (i - 1 + n) % n;
      });
    }
  };

  const menu = (
    <div
      ref={menuRef}
      role="listbox"
      aria-label={label}
      className={closing ? "s2-menu-out" : "s2-menu-in"}
      style={{
        position: "fixed",
        left: rect.left,
        top: rect.top,
        width: rect.width,
        zIndex: 9999,
        maxHeight: "min(60vh, " + (menuHeight + 2) + "px)",
        overflowY: "auto",
        borderRadius: 16,
        padding: PAD,
        display: "flex",
        flexDirection: "column",
        gap: GAP,
        backgroundColor: "rgba(19,31,42,0.985)",
        border: "1px solid rgba(217,191,130,0.20)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 28px -18px rgba(4,10,16,0.75), 0 34px 70px -30px rgba(4,10,16,0.9)",
        transformOrigin: rect.up ? "bottom center" : "top center",
      }}
    >
      {items.map((o, i) => {
        const selected = (value || "") === o;
        const highlighted = i === activeIdx;
        return (
          <div
            key={o || "__none"}
            role="option"
            aria-selected={selected}
            onMouseEnter={() => setActiveIdx(i)}
            onClick={() => {
              onChange(o);
              close();
            }}
            className="flex cursor-pointer select-none items-center justify-between gap-3 px-3 text-[13.5px]"
            style={{
              height: ROW_H,
              flex: "0 0 auto",
              borderRadius: 12,
              color: selected ? S2_GOLD_SOFT : "rgba(255,255,255,0.92)",
              backgroundColor: selected
                ? "rgba(217,191,130,0.12)"
                : highlighted
                  ? "rgba(255,255,255,0.06)"
                  : "transparent",
              transition: "background-color 180ms ease-out, color 180ms ease-out",
            }}
          >
            <span className="truncate">{o || "Select category"}</span>
            {selected && <Check size={14} strokeWidth={2.4} style={{ color: S2_GOLD_SOFT }} />}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={light ? "relative" : "relative mt-[1px]"}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className={
            light
              ? "flex h-[42px] w-full min-w-0 cursor-pointer select-none items-center justify-between gap-1 whitespace-nowrap text-left text-[15px] font-medium outline-none transition-colors duration-200"
              : "flex w-full cursor-pointer select-none items-center justify-between gap-2 bg-transparent pr-0 text-left text-[14px] font-normal text-white outline-none"
        }
        style={
          light
            ? {
                borderRadius: 12,
                padding: "0 18px",
                color: "#FFFFFF",
                backgroundColor: "#0F2946",
              }
            : undefined
        }

      >
        <span
          className="truncate"
          style={{
            color: light
              ? value
                ? "#FFFFFF"
                : "rgba(255,255,255,0.7)"
              : value
                ? "#FFFFFF"
                : "rgba(245,241,230,0.75)",
          }}
        >
          {value || "Select category"}
        </span>
        <ChevronDown
          size={light ? 16 : 16}
          strokeWidth={2}
          style={{
            color: light ? "#C9A76A" : "rgba(245,241,230,0.55)",
            flexShrink: 0,
            transform: open && !closing ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 180ms cubic-bezier(0.22,0.61,0.36,1)",
          }}
        />
      </button>
      {mounted && open && createPortal(menu, document.body)}
    </div>
  );
}

export function roomIcon(key: string) {
  const p = { size: 15, strokeWidth: 1.7 } as const;
  switch (key) {
    case "single":
      return <UserIcon {...p} />;
    case "double":
      return <BedDouble {...p} />;
    case "accessible":
      return <Accessibility {...p} />;
    default:
      return <Users {...p} />;
  }
}

export function S2Counter({
  value,
  onChange,
  label,
  light = false,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  light?: boolean;
}) {
  const [text, setText] = useState(String(value));
  React.useEffect(() => setText(String(value)), [value]);

  const commit = (raw: string) => {
    const cleaned = raw.replace(/[^\d]/g, "");
    const n = cleaned === "" ? 0 : Math.max(0, parseInt(cleaned, 10) || 0);
    onChange(n);
    setText(String(n));
  };

  const btn = (dir: "dec" | "inc") => (
    <button
      type="button"
      aria-label={`${dir === "dec" ? "Decrease" : "Increase"} ${label}`}
      disabled={dir === "dec" && value === 0}
      onClick={() => onChange(dir === "dec" ? Math.max(0, value - 1) : value + 1)}
      className={`grid shrink-0 place-items-center outline-none transition-all duration-200 active:scale-95 disabled:opacity-30 ${light ? "h-[24px] w-[24px] hover:bg-[rgba(201,167,106,0.14)]" : "h-[30px] w-[30px] hover:bg-white/[0.07]"}`}
      style={{ borderRadius: 999, color: light ? "#C9A76A" : "rgba(217,191,130,0.9)" }}
    >
      {dir === "dec" ? (
        <Minus size={light ? 15 : 16} strokeWidth={1.8} />
      ) : (
        <Plus size={light ? 15 : 16} strokeWidth={1.8} />
      )}
    </button>
  );


  return (
    <div
      className={`flex items-center justify-between ${light ? "h-[42px] shrink-0 px-2" : "h-[35px] px-1.5 transition-colors duration-200"}`}
      style={{
        borderRadius: light ? 12 : 999,
        width: light ? 104 : undefined,
        backgroundColor: light ? "#FFFFFF" : "rgba(20,33,45,0.72)",
        border: light ? "1px solid #E4DDD2" : "1px solid rgba(214,226,236,0.10)",
      }}
    >

      {btn("dec")}
      <input
        type="text"
        inputMode="numeric"
        aria-label={`${label} quantity`}
        value={text}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d]/g, "");
          setText(v);
          if (v !== "") onChange(Math.max(0, parseInt(v, 10) || 0));
        }}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).blur();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            onChange(value + 1);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            onChange(Math.max(0, value - 1));
          }
        }}
        className={`no-spin w-full min-w-0 bg-transparent text-center outline-none ${light ? "text-[15px] font-normal" : "text-[18px] font-medium text-white"}`}
        style={{ fontFamily: light ? "Inter, sans-serif" : SERIF, color: light ? "#1B3A52" : undefined }}
      />
      {btn("inc")}
    </div>
  );
}

export function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
