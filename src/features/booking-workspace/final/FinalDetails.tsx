import * as React from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  ChevronDown,
  Clock,
  Leaf,
  ShieldCheck,
  Star,
  User,
  Utensils,
} from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";
import { Plate } from "@/features/booking-workspace/overview/primitives";

/* ── local light palette — mirrors the other workspace folders ── */
const WHITE = "#FFFFFF";
const INK = "#1B2530";
const INK_SOFT = "rgba(27,37,48,0.62)";
const INK_FAINT = "rgba(27,37,48,0.45)";
const HAIR = "rgba(27,37,48,0.10)";
const HAIR_SOFT = "rgba(27,37,48,0.07)";
const BRONZE = "#C0801E";
const BRONZE_DEEP = "#A96C12";
const GOLD_HI = "#CC8C1E";
const GREEN_TX = "#3F7A55";
const BANNER = "#F5EFE5";
const CARD_SHADOW = "0 1px 2px rgba(24,30,36,0.04)";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** 24-hour options so the field reads "12:00" regardless of browser locale */
const TIME_OPTIONS = (() => {
  const out: string[] = [];
  for (let h = 0; h < 24; h += 1) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
})();

/* ── shared card shell ── */

function Card({
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
      className={`rounded-[14px] p-5 ${className}`}
      style={{ background: WHITE, border: `1px solid ${HAIR}`, boxShadow: CARD_SHADOW, ...style }}
    >
      {children}
    </div>
  );
}

function CardHead({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-[1px] shrink-0" style={{ color: INK }}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold" style={{ color: INK }}>
          {title}
        </span>
        {subtitle && (
          <span className="mt-1 block text-[12.5px]" style={{ color: INK_SOFT }}>
            {subtitle}
          </span>
        )}
      </span>
    </div>
  );
}

/* ── the 80% ring ── */

function ProgressRing({ value }: { value: number }) {
  const size = 72;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span
      className="relative grid shrink-0 place-items-center"
      style={{ height: size, width: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(27,37,48,0.09)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={BRONZE}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(c * value) / 100} ${c}`}
        />
      </svg>
      <span className="absolute text-[15px] font-semibold tabular-nums" style={{ color: INK }}>
        {value}%
      </span>
    </span>
  );
}

/* ── arrival / departure fields ── */

function DateValue({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = React.useState(false);
  const ref = React.useRef<HTMLInputElement>(null);

  const open = () => {
    setEditing(true);
    requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.showPicker?.();
    });
  };

  return (
    <span className="flex min-w-0 flex-1 items-center gap-2.5 px-3">
      <CalendarDays size={15} strokeWidth={1.7} className="shrink-0" style={{ color: INK_FAINT }} />
      {editing ? (
        <input
          ref={ref}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          aria-label="Date"
          className="w-full bg-transparent text-[13.5px] outline-none [&::-webkit-calendar-picker-indicator]:hidden"
          style={{ color: INK }}
        />
      ) : (
        <button
          type="button"
          onClick={open}
          className="min-w-0 flex-1 truncate text-left text-[13.5px] font-medium"
          style={{ color: value ? INK : INK_FAINT }}
        >
          {value ? formatDay(value) : "Add date"}
        </button>
      )}
    </span>
  );
}

function TimeValue({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <span
      className="relative flex shrink-0 items-center gap-2.5 px-3"
      style={{ borderLeft: `1px solid ${HAIR}` }}
    >
      <Clock size={15} strokeWidth={1.7} className="shrink-0" style={{ color: INK_FAINT }} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="appearance-none bg-transparent pr-4 text-[13.5px] font-medium tabular-nums outline-none"
        style={{ color: value ? INK : INK_FAINT }}
      >
        <option value="" disabled>
          --:--
        </option>
        {TIME_OPTIONS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        aria-hidden
        className="pointer-events-none absolute right-2"
        style={{ color: INK_FAINT }}
      />
    </span>
  );
}

function TimeField({
  label,
  date,
  time,
  onDate,
  onTime,
}: {
  label: string;
  date: string;
  time: string;
  onDate: (v: string) => void;
  onTime: (v: string) => void;
}) {
  return (
    <div className="min-w-0 flex-1 rounded-[12px] p-3" style={{ border: `1px solid ${HAIR}` }}>
      <span className="block text-[12.5px]" style={{ color: INK_SOFT }}>
        {label}
      </span>
      <div
        className="mt-2.5 flex h-[38px] items-center rounded-[9px]"
        style={{ border: `1px solid ${HAIR}`, background: WHITE }}
      >
        <DateValue value={date} onChange={onDate} />
        <TimeValue value={time} onChange={onTime} label={`${label} time`} />
      </div>
    </div>
  );
}

/* ── simple label / value row ── */

function Row({ label, value, tone }: { label: string; value: string; tone?: "green" }) {
  return (
    <div className="flex items-center justify-between gap-4 py-[7px]">
      <span className="min-w-0 truncate text-[13.5px]" style={{ color: INK }}>
        {label}
      </span>
      <span
        className="shrink-0 text-[13.5px] font-medium tabular-nums"
        style={{ color: tone === "green" ? GREEN_TX : INK }}
      >
        {value}
      </span>
    </div>
  );
}

/* ── the tab body ── */

export function FinalDetails({
  stayStart,
  stayEnd,
  contactRole,
  contactName,
  contactPhone,
  onOpenDietary,
  onComplete,
}: {
  stayStart: string;
  stayEnd: string;
  contactRole: string;
  contactName: string;
  contactPhone: string;
  onOpenDietary: () => void;
  onComplete?: () => void;
}) {
  const [arrival, setArrival] = React.useState({ date: stayStart, time: "12:00" });
  const [departure, setDeparture] = React.useState({ date: stayEnd, time: "11:00" });
  const timesRef = React.useRef<HTMLDivElement>(null);

  return (
    <Plate tone="warm">
      <div className="flex flex-1 flex-col gap-5 px-5 pb-12 pt-6 sm:px-8">
        {/* ── progress banner ── */}
        <Card className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <ProgressRing value={80} />
          <div className="min-w-0 flex-1">
            <h2 className="text-[22px]" style={{ color: INK, fontFamily: SERIF, fontWeight: 600 }}>
              Final details
            </h2>
            <p className="mt-0.5 text-[13px]" style={{ color: INK_SOFT }}>
              A few last details before arrival
            </p>
          </div>
          <span className="text-[13px]" style={{ color: INK_SOFT }}>
            2 items need your attention
          </span>
          <button
            type="button"
            onClick={() =>
              timesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
            }
            className="inline-flex h-[44px] shrink-0 items-center rounded-[10px] px-5 text-[13.5px] font-semibold transition-colors hover:bg-[rgba(27,37,48,0.03)]"
            style={{ background: WHITE, border: `1px solid ${HAIR}`, color: INK }}
          >
            View missing items
          </button>
        </Card>

        {/* ── detail cards ── */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Card className="md:col-span-2" style={{ scrollMarginTop: 24 }}>
            <div ref={timesRef}>
              <CardHead
                icon={<CalendarDays size={19} strokeWidth={1.7} />}
                title="Arrival & Departure"
                subtitle="Please add your expected times"
              />
              <div className="mt-4 flex flex-wrap gap-4">
                <TimeField
                  label="Arrival time"
                  date={arrival.date}
                  time={arrival.time}
                  onDate={(date) => setArrival((a) => ({ ...a, date }))}
                  onTime={(time) => setArrival((a) => ({ ...a, time }))}
                />
                <TimeField
                  label="Departure time"
                  date={departure.date}
                  time={departure.time}
                  onDate={(date) => setDeparture((d) => ({ ...d, date }))}
                  onTime={(time) => setDeparture((d) => ({ ...d, time }))}
                />
              </div>
            </div>
          </Card>

          <Card>
            <CardHead icon={<User size={19} strokeWidth={1.7} />} title="Group contact" />
            <div className="mt-4">
              <p className="text-[12.5px]" style={{ color: INK_SOFT }}>
                {contactRole}
              </p>
              <p className="mt-1 text-[15px] font-semibold" style={{ color: INK }}>
                {contactName}
              </p>
              <p className="mt-1.5 text-[13.5px]" style={{ color: INK_SOFT }}>
                {contactPhone}
              </p>
            </div>
          </Card>

          <Card>
            <CardHead icon={<Utensils size={19} strokeWidth={1.7} />} title="Meals" />
            <div className="mt-3">
              <Row label="Breakfast" value="07:00 – 10:00" />
              <Row label="Dinner" value="18:30" />
            </div>
          </Card>

          <Card>
            <CardHead icon={<Star size={19} strokeWidth={1.7} />} title="Special arrangements" />
            <div className="mt-3">
              <Row label="Coach parking" value="Confirmed" tone="green" />
              <Row label="Extra luggage room" value="Confirmed" tone="green" />
            </div>
          </Card>

          <Card className="p-0">
            <button
              type="button"
              onClick={onOpenDietary}
              className="flex w-full items-center gap-3 rounded-[14px] p-5 text-left transition-colors hover:bg-[rgba(27,37,48,0.02)]"
            >
              <span className="min-w-0 flex-1">
                <CardHead
                  icon={<Leaf size={19} strokeWidth={1.7} />}
                  title="Allergies & dietary"
                  subtitle="3 notes"
                />
              </span>
              <ChevronRight size={18} className="shrink-0" style={{ color: INK_FAINT }} />
            </button>
          </Card>
        </div>

        {/* ── footer action banner ── */}
        <div
          className="flex flex-wrap items-center gap-x-6 gap-y-5 rounded-[14px] px-6 py-5"
          style={{ background: BANNER, border: `1px solid ${HAIR_SOFT}` }}
        >
          <ShieldCheck size={22} strokeWidth={1.6} className="shrink-0" style={{ color: INK }} />
          <p
            className="min-w-[260px] flex-1 text-[13px] leading-relaxed"
            style={{ color: INK_SOFT }}
          >
            All information is securely shared with the hotel through HotelGroupBook.
            <br className="hidden sm:block" /> You will receive an update as soon as we have a
            response.
          </p>

          <span
            aria-hidden
            className="hidden h-[52px] w-px shrink-0 lg:block"
            style={{ background: HAIR }}
          />

          <div className="min-w-[220px] max-w-[240px]">
            <p className="text-[13px] font-semibold" style={{ color: INK }}>
              All details ready?
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: INK_SOFT }}>
              Review the information above before completing your final details.
            </p>
          </div>

          <button
            type="button"
            onClick={onComplete}
            className="inline-flex h-[48px] shrink-0 items-center justify-center gap-2.5 rounded-[10px] px-6 text-[14.5px] font-semibold transition-opacity hover:opacity-90"
            style={{
              background: `linear-gradient(180deg, ${GOLD_HI} 0%, ${BRONZE_DEEP} 100%)`,
              color: WHITE,
              boxShadow: "0 8px 18px -12px rgba(169,108,18,0.9)",
            }}
          >
            Complete final details <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </Plate>
  );
}
