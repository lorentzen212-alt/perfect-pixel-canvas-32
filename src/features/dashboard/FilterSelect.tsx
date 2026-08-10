import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export const STATUS_DOTS: Record<string, string> = {
  awaiting: "#7C93A6",
  proposal: "#C5A24B",
  confirmed: "#6FA98A",
  attention: "#E0A45C",
  cancelled: "#9AA0A6",
};

export function FilterSelect<T extends string>({
  value,
  onChange,
  options,
  label,
  menuWidth,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
  menuWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const current = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    setActive(selectedIndex);
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const commit = (i: number) => {
    const o = options[i];
    if (o) onChange(o.value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(active);
    }
  };

  return (
    <div
      ref={wrapRef}
      className="group relative flex min-w-0 flex-1 items-center rounded-[11px] md:w-[168px] md:flex-none"
      style={{ background: "rgba(255,255,255,0.42)", border: "1px solid rgba(110,106,96,0.20)" }}
    >
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="w-full cursor-pointer appearance-none truncate bg-transparent py-[12px] pl-4 pr-10 text-left text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-[rgba(197,162,75,0.55)] rounded-[11px]"
        style={{ color: "#3B3B34", letterSpacing: "0.005em" }}
      >
        {current?.label ?? label}
      </button>
      <ChevronDown
        size={17}
        strokeWidth={1.8}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        style={{
          color: "#6B6858",
          transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
          transition: "transform 160ms ease",
        }}
      />

      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className="absolute left-0 top-full z-50 outline-none"
          style={{
            marginTop: 6,
            minWidth: "100%",
            width: menuWidth ? `${menuWidth}px` : undefined,
            background: "#F3F2EE",
            border: "1px solid rgba(15,22,32,0.10)",
            borderRadius: 10,
            boxShadow: "0 12px 30px rgba(6,20,31,0.16), 0 2px 8px rgba(6,20,31,0.08)",
            padding: 6,
          }}
        >
          {options.map((o, i) => {
            const isSel = o.value === value;
            const isActive = i === active;
            const dot = STATUS_DOTS[o.value as string];
            return (
              <div
                key={o.value}
                role="option"
                aria-selected={isSel}
                onMouseEnter={() => setActive(i)}
                onClick={() => commit(i)}
                className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-[14px]"
                style={{
                  height: 38,
                  padding: "0 12px",
                  borderRadius: 7,
                  color: isSel ? "#1E2A35" : "#35404A",
                  fontWeight: isSel ? 500 : 400,
                  background: isSel
                    ? "#E3E6E7"
                    : isActive
                      ? "rgba(23,57,87,0.06)"
                      : "transparent",
                }}
              >
                {dot && (
                  <span
                    aria-hidden
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: dot,
                      opacity: 0.75,
                      flexShrink: 0,
                    }}
                  />
                )}
                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                {isSel && <Check size={14} strokeWidth={2.2} style={{ color: "#C5A24B" }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
