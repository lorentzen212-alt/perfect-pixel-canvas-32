import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoonIcon, S2LuxeStat, S2StayDivider, S2StayInfo } from "@/features/leisure/step2/parts";
import { IVORY, SERIF } from "@/features/leisure/tokens";
import { format } from "date-fns";
import { ArrowRight, BedDouble, CalendarDays, Moon, Pencil, Plus, Trash2, UserRound, Users, X } from "lucide-react";
import React, { useMemo, useState } from "react";

export function S2CompletedStayCard({
  index,
  arrival,
  departure,
  nights,
  rooms,
  guests,
  onEdit,
  onRemove,
  confirming = false,
  onConfirmRemove,
  onCancelRemove,
  animClass = "",
  highlight = false,
}: {
  index: number;
  arrival: string;
  departure: string;
  nights: number;
  rooms: number;
  guests: number;
  onEdit: () => void;
  onRemove: () => void;
  confirming?: boolean;
  onConfirmRemove?: () => void;
  onCancelRemove?: () => void;
  animClass?: string;
  highlight?: boolean;
}) {
  const fmtLong = (iso: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return { date: "—", day: "" };
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return { date: format(d, "dd MMMM yyyy"), day: format(d, "EEEE").toUpperCase() };
  };
  const roman = (n: number) =>
    ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n] ?? String(n);
  const inn = fmtLong(arrival);
  const out = fmtLong(departure);

  const GOLD_STRIP =
    "linear-gradient(180deg, #6E5527 0%, #C9A65C 12%, #F3DCA4 32%, #D8B872 52%, #9C7B36 78%, #E2C98F 100%)";
  const GOLD_TEXT = "#E3C68C";
  const IVORY = "#F7F1E3";

  const stat = (icon: React.ReactNode, value: number, label: string) => (
    <div className="flex flex-1 items-center justify-center gap-2">
      <span style={{ color: GOLD_TEXT }}>{icon}</span>
      <span className="leading-none">
        <span className="block text-[18px] font-medium leading-none" style={{ fontFamily: SERIF, color: IVORY }}>
          {value}
        </span>
        <span className="mt-1 block text-[11px]" style={{ color: "rgba(240,245,251,0.55)" }}>
          {label}
        </span>
      </span>
    </div>
  );

  return (
    <div
      className={`${animClass} ${highlight ? "s2-stay-justadded" : ""} relative flex h-full flex-col overflow-hidden`}
      style={{
        borderRadius: 20,
        maxWidth: 520,
        backgroundImage: "linear-gradient(165deg, #16293D 0%, #0F1F30 100%)",
        border: `1px solid ${highlight ? "rgba(233,208,150,0.85)" : "rgba(217,191,130,0.34)"}`,
        padding: "18px 22px 16px 26px",
        transition: "border-color 600ms ease, box-shadow 600ms ease, transform 600ms ease",
        boxShadow: highlight
          ? "inset 0 1px 0 rgba(255,255,255,0.09), 0 0 0 1px rgba(233,208,150,0.22), 0 34px 70px -30px rgba(3,8,14,0.85), 0 0 28px -8px rgba(217,191,130,0.35)"
          : "inset 0 1px 0 rgba(255,255,255,0.06), 0 26px 54px -28px rgba(3,8,14,0.8), 0 8px 20px -14px rgba(0,0,0,0.5)",
      }}
    >
      {highlight && (
        <div
          className="s2-added-note absolute right-5 top-[46px] flex items-center gap-[6px] text-[11.5px]"
          style={{ color: "rgba(150,205,165,0.95)" }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Stay added successfully
        </div>
      )}
      {/* metallic gold left strip */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full"
        style={{ width: 6, backgroundImage: GOLD_STRIP, boxShadow: "1px 0 6px -2px rgba(217,191,130,0.45)" }}
      />

      {/* top row */}
      <div className="flex items-start justify-between gap-3">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.28em]"
          style={{ color: GOLD_TEXT }}
        >
          Stay {roman(index)}
        </span>
        <span
          className="flex items-center gap-[5px] rounded-full px-3 py-[3px] text-[11px] font-semibold"
          style={{
            backgroundImage: "linear-gradient(180deg, #5FA56D 0%, #4E9460 48%, #3F7E53 100%)",
            color: "#FFFFFF",
            border: "1px solid rgba(63,126,83,0.6)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.32), inset 0 -1px 2px rgba(34,74,48,0.4), 0 2px 8px -4px rgba(0,0,0,0.45)",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ color: "#FFFFFF" }} aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Saved
        </span>
      </div>

      {/* dates */}
      <div className="mt-4 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[17px] font-medium leading-tight" style={{ fontFamily: SERIF, color: IVORY }}>
            {inn.date}
          </div>
          <div className="mt-1 text-[10.5px] uppercase tracking-[0.16em]" style={{ color: GOLD_TEXT }}>
            {inn.day}
          </div>
        </div>
        <ArrowRight size={20} strokeWidth={1.4} style={{ color: GOLD_TEXT, flexShrink: 0 }} />
        <div className="min-w-0 flex-1 text-right">
          <div className="truncate text-[17px] font-medium leading-tight" style={{ fontFamily: SERIF, color: IVORY }}>
            {out.date}
          </div>
          <div className="mt-1 text-[10.5px] uppercase tracking-[0.16em]" style={{ color: GOLD_TEXT }}>
            {out.day}
          </div>
        </div>
      </div>

      <div className="mt-3.5 h-px w-full" style={{ background: "rgba(217,191,130,0.28)" }} />

      {/* stats */}
      <div className="mt-3 flex items-center">
        {stat(<BedDouble size={17} strokeWidth={1.6} />, rooms, rooms === 1 ? "Room" : "Rooms")}
        <span className="h-7 w-px" style={{ background: "rgba(217,191,130,0.2)" }} />
        {stat(<Users size={17} strokeWidth={1.6} />, guests, guests === 1 ? "Guest" : "Guests")}
        <span className="h-7 w-px" style={{ background: "rgba(217,191,130,0.2)" }} />
        {stat(<Moon size={17} strokeWidth={1.6} />, nights, nights === 1 ? "Night" : "Nights")}
      </div>

      {/* actions */}
      <div className="mt-auto pt-3.5">
        {confirming ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[13px]" style={{ color: "rgba(245,241,230,0.7)" }}>
              Remove this stay?
            </span>
            <button
              type="button"
              onClick={onConfirmRemove}
              className="bg-transparent p-0 text-[13px] font-semibold"
              style={{ color: "rgba(238,170,150,0.95)", border: "none" }}
            >
              Yes, remove
            </button>
            <button
              type="button"
              onClick={onCancelRemove}
              className="bg-transparent p-0 text-[13px]"
              style={{ color: "rgba(245,241,230,0.6)", border: "none" }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex flex-1 items-center justify-center gap-2 bg-transparent text-[13.5px] font-medium transition-colors duration-200"
              style={{
                color: GOLD_TEXT,
                border: "1px solid rgba(217,191,130,0.45)",
                borderRadius: 12,
                padding: "9px 14px",
              }}
            >
              <Pencil size={15} strokeWidth={1.7} />
              Continue editing
            </button>
            <span className="h-6 w-px" style={{ background: "rgba(217,191,130,0.18)" }} />
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-2 bg-transparent p-0 text-[13px]"
              style={{ color: "rgba(245,241,230,0.6)", border: "none" }}
            >
              <Trash2 size={14} strokeWidth={1.6} />
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function S2AddStayCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="s2-addstay group flex h-full flex-col items-center justify-center gap-3 transition-all duration-300 ease-out hover:-translate-y-[2px]"
      style={{
        borderRadius: 18,
        minHeight: 196,
        padding: "20px 24px",
        backgroundColor: "rgba(255,255,255,0.035)",
        border: "1px dashed rgba(224,201,143,0.68)",
        color: "#EBD7A4",
        cursor: "pointer",
      }}
    >
      <span
        className="s2-addstay-icon grid h-[51px] w-[51px] place-items-center transition-all duration-300 ease-out group-hover:scale-[1.06]"
        style={{
          borderRadius: 999,
          border: "1px solid rgba(228,203,140,0.55)",
          backgroundColor: "rgba(12,23,33,0.55)",
        }}
      >
        <Plus size={23} strokeWidth={1.7} className="transition-transform duration-300 ease-out group-hover:rotate-90" />
      </span>
      <span className="text-[15px] font-medium">Add another stay</span>
      <span className="text-[12.5px] font-light" style={{ color: "rgba(240,236,226,0.55)" }}>
        Create another hotel stay
      </span>
    </button>
  );
}

export function S2StayCard({

  title,
  arrival,
  departure,
  nights,
  rooms,
  guests,
  editable = false,
  compact = false,
  onArrival,
  onDeparture,
  onAddAnother,
  onEdit,
  onRemove,
  confirming = false,
  onConfirmRemove,
  onCancelRemove,
  animClass = "",
}: {
  title: string;
  arrival: string;
  departure: string;
  nights: number;
  rooms: number;
  guests: number;
  editable?: boolean;
  compact?: boolean;

  onArrival?: (v: string) => void;
  onDeparture?: (v: string) => void;
  onAddAnother: () => void;
  onEdit?: () => void;
  onRemove: () => void;
  confirming?: boolean;
  onConfirmRemove?: () => void;
  onCancelRemove?: () => void;
  animClass?: string;
}) {
  const toDate = (iso: string): Date | undefined => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return undefined;
    const y = Number(m[1]);
    if (y < 1900 || y > 2999) return undefined;
    const d = new Date(y, Number(m[2]) - 1, Number(m[3]));
    return isNaN(d.getTime()) ? undefined : d;
  };
  const toISO = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const today = React.useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const [arrivalOpen, setArrivalOpen] = React.useState(false);
  const [departureOpen, setDepartureOpen] = React.useState(false);

  const DateCol = ({
    label,
    value,
    onChange,
    minDate,
    align,
    placeholder,
    open,
    setOpen,
    onPicked,
  }: {
    label: string;
    value: string;
    onChange?: (v: string) => void;
    minDate?: Date;
    align: "left" | "right";
    placeholder: string;
    open: boolean;
    setOpen: (v: boolean) => void;
    onPicked?: () => void;
  }) => {
    const selected = toDate(value);
    const interactive = editable && !!onChange;


    const dateValue = selected ? (
      compact ? (
        <span
          className="whitespace-nowrap text-[21px] leading-none"
          style={{
            color: "#F4EFE6",
            fontWeight: 500,
            fontFamily: '"Inter Display", "Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
            letterSpacing: "0.01em",
          }}
        >
          {format(selected, "dd MMMM yyyy")}
        </span>
      ) : (

        <span
          className="whitespace-nowrap leading-none text-[17.5px]"
          style={{
            marginLeft: align === "left" ? 3 : undefined,
            marginRight: align === "right" ? 3 : undefined,
            display: "inline-flex",
            alignItems: "baseline",
            gap: 5,
          }}
        >
          <span
            style={{
              color: "#E8E4DC",
              fontWeight: 600,
              textShadow: "0 1px 1px rgba(0,0,0,.15)",
            }}
          >
            {format(selected, "d")}
          </span>
          <span
            style={{
              color: "#E8E4DC",
              fontWeight: 400,
              letterSpacing: "0.01em",
            }}
          >
            {format(selected, "MMM yyyy")}
          </span>
        </span>
      )
    ) : (
      <span
        className={`whitespace-nowrap leading-none font-medium ${compact ? "text-[15px]" : "text-[15px]"}`}
        style={{
          color: "#8FA0B0",
          marginLeft: !compact && align === "left" ? 3 : undefined,
          marginRight: !compact && align === "right" ? 3 : undefined,
        }}
      >
        {placeholder}
      </span>
    );

    const icon = compact ? null : (
      <span aria-hidden className="shrink-0 leading-none" style={{ color: "#E8E4DC" }}>
        <CalendarDays size={16} strokeWidth={1.5} />
      </span>
    );

    const alignCls = compact
      ? "items-start text-left"
      : align === "right"
        ? "items-end text-right"
        : "items-start text-left";

    const field = (
      <div className={`flex min-w-0 flex-col ${compact ? "gap-[5px]" : "gap-[6px]"} ${alignCls}`}>
        <span
          className={`whitespace-nowrap font-medium uppercase leading-none ${compact ? "text-[11px]" : "text-[9.5px]"}`}
          style={{ color: compact ? "#C7AB77" : "#B99A60", letterSpacing: compact ? "0.25em" : "0.18em" }}
        >
          {compact ? (label === "Arrival" ? "Check-in" : "Check-out") : label}
        </span>
        <div className="flex items-center gap-[3px]">
          {!compact && align === "right" ? (
            <>
              {dateValue}
              {icon}
            </>
          ) : (
            <>
              {icon}
              {dateValue}
            </>
          )}
        </div>
        {selected ? (
          compact ? (
            <span
              className="whitespace-nowrap leading-none text-[9px] uppercase"
              style={{
                marginTop: 3,
                color: "rgba(199,171,119,0.72)",
                fontWeight: 500,
                letterSpacing: "0.24em",
              }}
            >
              {format(selected, "EEEE")}
            </span>
          ) : (
            <span
              className="whitespace-nowrap leading-none text-[12px]"
              style={{
                color: "#84909D",
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}
            >
              {format(selected, "EEEE")}
            </span>
          )
        ) : null}
        {compact && selected ? (
          <span aria-hidden className="mt-[4px] flex items-center gap-[5px]">
            <span
              style={{
                display: "block",
                width: 51,
                height: 1,
                backgroundColor: "rgba(199,171,119,0.42)",
              }}
            />
            <span
              style={{
                display: "block",
                width: 4,
                height: 4,
                transform: "rotate(45deg)",
                border: "1px solid rgba(199,171,119,0.55)",
              }}
            />
          </span>
        ) : null}
      </div>


    );

    const trigger = (
      <button
        type="button"
        disabled={!interactive}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${label} date`}
        className={`s2-date-field flex w-full min-w-0 items-center rounded-[12px] bg-transparent text-left transition-colors duration-200 disabled:cursor-default ${compact ? "px-0 py-0" : "px-2 py-[9px]"}`}
        style={{ border: "1px solid transparent", cursor: interactive ? "pointer" : "default", justifyContent: !compact && align === "right" ? "flex-end" : "flex-start" }}
      >
        {field}
      </button>
    );


    if (!interactive) return <div className="min-w-0">{trigger}</div>;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align={align === "right" ? "end" : "start"}
          sideOffset={10}
          className="pointer-events-auto z-[120] w-auto border p-0"
          style={{
            backgroundColor: "#1B2C3C",
            borderColor: "rgba(217,191,130,0.28)",
            boxShadow: "0 30px 70px -30px rgba(4,10,16,0.85)",
          }}
        >
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected ?? minDate ?? today}
            disabled={{ before: minDate ?? today }}
            onSelect={(d: Date | undefined) => {
              // Re-clicking the already selected day yields undefined —
              // keep the value and simply dismiss the calendar.
              if (d) onChange?.(toISO(d));
              setOpen(false);
              onPicked?.();
            }}

            initialFocus
            className="pointer-events-auto p-3 text-[#F2EDE3]"
          />
        </PopoverContent>
      </Popover>
    );
  };





  const dateTimeline = (
    <div
      className="grid items-center px-[22px] py-[10px]"
      style={{
        width: compact ? "100%" : "92%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: compact ? 0 : 24,
        gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)",
        borderRadius: compact ? 0 : 15,
        backgroundImage: compact
          ? "none"
          : "linear-gradient(180deg, #2E4759 0%, #294152 52%, #253C4D 100%)",
        border: compact ? "none" : "1.5px solid rgba(217,191,130,0.42)",
        boxShadow: compact
          ? "none"
          : "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.22), 0 0 0 4px rgba(217,191,130,0.05), 0 0 34px -6px rgba(217,191,130,0.08), 0 22px 50px -34px rgba(6,13,20,0.85)",
      }}
    >
      <DateCol
        label="Arrival"
        value={arrival}
        onChange={onArrival}
        align="left"
        placeholder="Select arrival date"
        open={arrivalOpen}
        setOpen={setArrivalOpen}
      />
      <ArrowRight
        size={34}
        strokeWidth={1.1}
        className="mx-3 shrink-0 self-center"
        style={{ color: "#B99A60" }}
      />
      <DateCol
        label="Departure"
        value={departure}
        onChange={onDeparture}
        open={departureOpen}
        setOpen={setDepartureOpen}
        minDate={(() => {
          const a = toDate(arrival);
          if (!a) return undefined;
          const n = new Date(a);
          n.setDate(n.getDate() + 1);
          return n;
        })()}
        align="right"
        placeholder="Select departure date"

      />
    </div>
  );

  if (compact)
    return (
      <div
        className={animClass}
        style={{
          borderRadius: 14,
          backgroundImage:
            "linear-gradient(180deg, #1C3653 0%, #152C45 100%)",
          border: "1px solid rgba(178,150,96,0.32)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 0 0 1px rgba(190,162,108,0.05), inset 0 0 70px -24px rgba(0,0,0,0.28), 0 24px 60px -42px rgba(6,16,27,0.72), 0 12px 32px -22px rgba(0,0,0,0.42)",
          overflow: "hidden",
        }}
      >
        {/* Upper zone — dates + statistics */}
        <div className="flex flex-col gap-2 px-[20px] py-[9px] sm:px-6 lg:flex-row lg:items-center lg:gap-5">
          {/* Circular calendar mark — opens the check-in picker */}

          <button
            type="button"
            aria-label="Open check-in date picker"
            disabled={!(editable && !!onArrival)}
            onClick={() => setArrivalOpen(true)}
            className="grid h-[40px] w-[40px] shrink-0 place-items-center transition-colors duration-200 disabled:cursor-default"
            style={{
              borderRadius: 999,
              border: "1px solid rgba(196,168,114,0.58)",
              color: "#D4B683",
              backgroundColor: "transparent",
              cursor: editable && onArrival ? "pointer" : "default",
              boxShadow:
                "0 0 18px -7px rgba(196,168,114,0.5), inset 0 0 14px -9px rgba(196,168,114,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              if (editable && onArrival) e.currentTarget.style.backgroundColor = "rgba(196,168,114,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <CalendarDays size={21} strokeWidth={1.2} />
          </button>


          {/* Dates */}
          <div className="flex min-w-0 flex-1 items-center gap-5 sm:gap-7">
            <div className="min-w-0 flex-1">
              <DateCol
                label="Arrival"
                value={arrival}
                onChange={onArrival}
                align="left"
                placeholder="Select date"
                open={arrivalOpen}
                setOpen={setArrivalOpen}
              />
            </div>
            <ArrowRight
              size={24}
              strokeWidth={1}
              className="shrink-0"
              style={{ color: "#D4B683" }}
            />

            <div className="min-w-0 flex-1">
              <DateCol
                label="Departure"
                value={departure}
                onChange={onDeparture}
                open={departureOpen}
                setOpen={setDepartureOpen}
                minDate={(() => {
                  const a = toDate(arrival);
                  if (!a) return undefined;
                  const n = new Date(a);
                  n.setDate(n.getDate() + 1);
                  return n;
                })()}

                align="left"
                placeholder="Select date"
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="flex shrink-0 items-stretch">
            <S2LuxeStat
              icon={<MoonIcon />}
              value={nights}
              label={nights === 1 ? "Night" : "Nights"}
              first
            />
            <S2LuxeStat
              icon={<BedDouble size={15} strokeWidth={1.3} />}
              value={rooms}
              label={rooms === 1 ? "Room" : "Rooms"}
            />
            <S2LuxeStat
              icon={<UserRound size={15} strokeWidth={1.3} />}
              value={guests}
              label={guests === 1 ? "Guest" : "Guests"}
            />
          </div>
        </div>


        {/* Lower zone — actions */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-[18px] py-[5px]"
          style={{ borderTop: "1px solid rgba(217,191,130,0.10)" }}

        >
          {confirming ? (
            <>
              <span className="text-[14px]" style={{ color: "rgba(216,226,236,0.65)" }}>
                Remove this stay?
              </span>
              <button
                type="button"
                onClick={onConfirmRemove}
                className="s2-luxe-action inline-flex items-center gap-2 bg-transparent p-0 text-[15px]"
                style={{ color: "#FFFFFF", fontWeight: 400, border: "none" }}
              >
                <Trash2 size={17} strokeWidth={1.4} style={{ color: "#D9BF82" }} />
                Yes, remove
              </button>
              <span aria-hidden style={{ width: 1, height: 18, backgroundColor: "rgba(217,191,130,0.28)" }} />
              <button
                type="button"
                onClick={onCancelRemove}
                className="s2-luxe-action inline-flex items-center gap-2 bg-transparent p-0 text-[15px]"
                style={{ color: "rgba(216,226,236,0.7)", fontWeight: 400, border: "none" }}
              >
                <X size={17} strokeWidth={1.4} style={{ color: "#D9BF82" }} />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onEdit ?? onAddAnother}
                className="s2-luxe-action inline-flex items-center gap-2.5 bg-transparent p-0 text-[15px] transition-opacity duration-200 hover:opacity-75"
                style={{ color: "#FFFFFF", fontWeight: 400, border: "none" }}
              >
                Edit stay
                <Pencil size={17} strokeWidth={1.4} style={{ color: "#D9BF82" }} />
              </button>
              <span aria-hidden style={{ width: 1, height: 18, backgroundColor: "rgba(217,191,130,0.28)" }} />
              <button
                type="button"
                onClick={onRemove}
                className="s2-luxe-action inline-flex items-center gap-2.5 bg-transparent p-0 text-[15px] transition-opacity duration-200 hover:opacity-75"
                style={{ color: "#FFFFFF", fontWeight: 400, border: "none" }}
              >
                Remove stay
                <Trash2 size={17} strokeWidth={1.4} style={{ color: "#D9BF82" }} />
              </button>
            </>
          )}
        </div>
      </div>
    );



  return (
    <div
      className={animClass}
      style={{
        height: "auto",
        minHeight: 0,
        borderRadius: 22,
        backgroundImage: "linear-gradient(165deg, #293E4F 0%, #263B4C 52%, #223648 100%)",
        border: "1px solid rgba(217,191,130,0.18)",
        padding: "30px 36px 22px",
        boxShadow:
          "inset 0 1.5px 0 rgba(255,255,255,0.08), 0 6px 18px -6px rgba(6,13,20,0.55), 0 40px 90px -60px rgba(6,13,20,0.95)",
        display: "flex",
        flexDirection: "column",
      }}

    >

      {/* SECTION 1 — header */}
      <div className="flex items-baseline justify-between gap-4">
        <h3
          className="text-[32px] leading-none"
          style={{ fontFamily: SERIF, color: "#E8E4DC", fontWeight: 600 }}
        >
          {title}
        </h3>
        <button
          type="button"
          onClick={onAddAnother}
          className="inline-flex items-baseline gap-2 bg-transparent p-0 text-[14px] font-extralight leading-none transition-opacity duration-200 hover:opacity-100"
          style={{ color: "#B99A60", border: "none" }}
        >
          <Plus size={15} strokeWidth={1.3} className="translate-y-[2px]" />
          Add another stay
        </button>
      </div>

      {/* SECTION 2 — unified date timeline */}
      {dateTimeline}



      {/* SECTION 3 — bottom action zone */}
      <div
        className="mt-auto flex items-center justify-between px-3 py-[3px]"
        style={{
          borderRadius: 12,
          backgroundColor: "rgba(12,22,32,0.16)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          transform: "translateY(16px)",
        }}
      >
        {confirming ? (
          <>
            <span
              className="flex min-w-0 flex-1 basis-0 items-center justify-center gap-2.5 whitespace-nowrap py-1 text-[14.5px]"
              style={{ color: "#84909D", fontWeight: 400 }}
            >
              Remove this stay?
            </span>
            <S2StayDivider />
            <S2StayInfo
              icon={<Trash2 size={18} strokeWidth={1.6} />}
              text="Confirm"
              onClick={onConfirmRemove}
            />
            <S2StayDivider />
            <S2StayInfo icon={<X size={18} strokeWidth={1.6} />} text="Cancel" onClick={onCancelRemove} />
          </>
        ) : (
          <>
            <S2StayInfo icon={<MoonIcon />} text={`${nights} ${nights === 1 ? "Night" : "Nights"}`} />
            <S2StayDivider />
            <S2StayInfo icon={<BedDouble size={19} strokeWidth={1.6} />} text={`${rooms} ${rooms === 1 ? "Room" : "Rooms"}`} />
            <S2StayDivider />
            <S2StayInfo icon={<UserRound size={19} strokeWidth={1.6} />} text={`${guests} ${guests === 1 ? "Guest" : "Guests"}`} />
            {onEdit && (
              <>
                <S2StayDivider />
                <S2StayInfo icon={<Pencil size={18} strokeWidth={1.6} />} text="Edit" onClick={onEdit} />
              </>
            )}
            <S2StayDivider />
            <S2StayInfo tone="remove" icon={<Trash2 size={18} strokeWidth={1.6} />} text="Remove" onClick={onRemove} />
          </>
        )}
      </div>


    </div>
  );
}
