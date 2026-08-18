import * as React from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock,
  Info,
  Leaf,
  MessageSquare,
  ShieldCheck,
  Star,
  User,
  Utensils,
  X,
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

export type TimeMode = "exact" | "mixed" | "unknown";

const MODE_LABEL: Record<TimeMode, string> = {
  exact: "Exact time",
  mixed: "Mixed times",
  unknown: "Not known yet",
};

export type MealLine = { label: string; value: string };
export type RequestSection = "meals" | "services";

export type ContactState = {
  role: string;
  name: string;
  phone: string;
  secondary?: { name: string; phone: string } | null;
};

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
  action,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-[1px] shrink-0" style={{ color: INK }}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold" style={{ color: INK }}>
          {title}
        </span>
        {subtitle && (
          <span className="mt-1 block text-[12.5px]" style={{ color: INK_SOFT }}>
            {subtitle}
          </span>
        )}
      </span>
      {action && <span className="shrink-0">{action}</span>}
    </div>
  );
}

/** quiet text-only action used in card headers and card footers */
function TextAction({
  label,
  onClick,
  arrow,
  className = "",
}: {
  label: string;
  onClick?: () => void;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-[13px] font-medium transition-opacity hover:opacity-70 ${className}`}
      style={{ color: BRONZE_DEEP }}
    >
      {label}
      {arrow && <ArrowRight size={13} />}
    </button>
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
    <span className="flex min-w-0 flex-1 items-center gap-2.5">
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
      className="relative flex shrink-0 items-center gap-2.5 pl-3"
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
        className="pointer-events-none absolute right-0"
        style={{ color: INK_FAINT }}
      />
    </span>
  );
}

/** borderless caption-level status dropdown */
function GhostModeSelect({
  value,
  onChange,
  label,
}: {
  value: TimeMode;
  onChange: (v: TimeMode) => void;
  label: string;
}) {
  return (
    <span className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as TimeMode)}
        aria-label={label}
        className="appearance-none bg-transparent pr-4 text-[12.5px] outline-none"
        style={{ color: INK_SOFT }}
      >
        <option value="exact">{MODE_LABEL.exact}</option>
        <option value="mixed">{MODE_LABEL.mixed}</option>
        <option value="unknown">{MODE_LABEL.unknown}</option>
      </select>
      <ChevronDown
        size={12}
        aria-hidden
        className="pointer-events-none absolute right-0"
        style={{ color: INK_FAINT }}
      />
    </span>
  );
}

type SideState = {
  date: string;
  time: string;
  mode: TimeMode;
  times: string[];
};

function TimeSide({
  label,
  state,
  onState,
}: {
  label: "Arrival" | "Departure";
  state: SideState;
  onState: (next: SideState) => void;
}) {
  const [adding, setAdding] = React.useState(false);
  const lower = label.toLowerCase();

  return (
    <div className="min-w-0 flex-1">
      <span
        className="block text-[12.5px] uppercase tracking-[0.08em]"
        style={{ color: INK_SOFT }}
      >
        {label}
      </span>

      <div className="mt-2 rounded-[10px] px-3 py-2.5" style={{ border: `1px solid ${HAIR}` }}>
        <div className="flex min-h-[26px] items-center gap-3">
          <DateValue value={state.date} onChange={(date) => onState({ ...state, date })} />

          {state.mode === "exact" && (
            <TimeValue
              value={state.time}
              onChange={(time) => onState({ ...state, time })}
              label={`${label} time`}
            />
          )}

          {state.mode === "mixed" && (
            <span
              className="flex shrink-0 items-center gap-2 pl-3 text-[12.5px]"
              style={{ borderLeft: `1px solid ${HAIR}`, color: INK_SOFT }}
            >
              Multiple {lower} times
            </span>
          )}

          {state.mode === "unknown" && (
            <span
              className="flex shrink-0 items-center pl-3 text-[12.5px]"
              style={{ borderLeft: `1px solid ${HAIR}`, color: INK_FAINT }}
            >
              {label} time not confirmed yet
            </span>
          )}
        </div>

        {state.mode === "mixed" && (
          <div className="mt-2">
            {state.times.length > 0 && (
              <ul className="mb-1 flex flex-wrap gap-x-4 gap-y-1">
                {state.times.map((t) => (
                  <li
                    key={t}
                    className="inline-flex items-center gap-1.5 text-[12.5px] tabular-nums"
                    style={{ color: INK }}
                  >
                    {t}
                    <button
                      type="button"
                      aria-label={`Remove ${lower} time ${t}`}
                      onClick={() =>
                        onState({ ...state, times: state.times.filter((x) => x !== t) })
                      }
                      className="transition-opacity hover:opacity-70"
                      style={{ color: INK_FAINT }}
                    >
                      <X size={11} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {adding ? (
              <span className="relative inline-flex items-center">
                <select
                  autoFocus
                  defaultValue=""
                  aria-label={`Add ${lower} time`}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v && !state.times.includes(v)) {
                      onState({ ...state, times: [...state.times, v].sort() });
                    }
                    setAdding(false);
                  }}
                  onBlur={() => setAdding(false)}
                  className="appearance-none bg-transparent pr-4 text-[12.5px] tabular-nums outline-none"
                  style={{ color: INK }}
                >
                  <option value="" disabled>
                    Select time
                  </option>
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={12}
                  aria-hidden
                  className="pointer-events-none absolute right-0"
                  style={{ color: INK_FAINT }}
                />
              </span>
            ) : (
              <TextAction label="+ Add times" onClick={() => setAdding(true)} />
            )}
          </div>
        )}

        <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${HAIR_SOFT}` }}>
          <GhostModeSelect
            value={state.mode}
            onChange={(mode) => onState({ ...state, mode })}
            label={`${label} time type`}
          />
        </div>
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

/* ── contact inputs ── */

const ROLES = ["Tour leader", "Group leader", "Teacher", "Coordinator", "Driver", "Other"];

const fieldStyle: React.CSSProperties = {
  border: `1px solid ${HAIR}`,
  background: WHITE,
  color: INK,
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[12.5px]" style={{ color: INK_SOFT }}>
        {label}
      </span>
      {children}
    </label>
  );
}

/* ── the tab body ── */

export function FinalDetails({
  stayStart,
  stayEnd,
  contactRole,
  contactName,
  contactPhone,
  meals = [],
  allergyCount = 3,
  onOpenDietary,
  onRequestChange,
  onContactChange,
  onComplete,
}: {
  stayStart: string;
  stayEnd: string;
  contactRole: string;
  contactName: string;
  contactPhone: string;
  meals?: MealLine[];
  allergyCount?: number;
  onOpenDietary: () => void;
  onRequestChange?: (section: RequestSection) => void;
  onContactChange?: (next: ContactState) => void;
  onComplete?: () => void;
}) {
  const [arrival, setArrival] = React.useState<SideState>({
    date: stayStart,
    time: "12:00",
    mode: "exact",
    times: [],
  });
  const [departure, setDeparture] = React.useState<SideState>({
    date: stayEnd,
    time: "11:00",
    mode: "exact",
    times: [],
  });
  const timesRef = React.useRef<HTMLDivElement>(null);

  const seededRole = React.useMemo(() => {
    const match = ROLES.find((r) => r.toLowerCase() === contactRole.toLowerCase());
    return match ?? ROLES[0];
  }, [contactRole]);

  const [contact, setContactState] = React.useState<ContactState>({
    role: seededRole,
    name: contactName,
    phone: contactPhone,
    secondary: null,
  });

  const setContact = (next: ContactState) => {
    setContactState(next);
    onContactChange?.(next);
  };

  const [note, setNote] = React.useState("");

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

        {/* ── primary inputs ── */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2" style={{ scrollMarginTop: 24 }}>
            <div ref={timesRef}>
              <CardHead
                icon={<CalendarDays size={19} strokeWidth={1.7} />}
                title="Arrival & Departure"
                subtitle="Let us know your expected arrival and departure"
              />
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <TimeSide label="Arrival" state={arrival} onState={setArrival} />
                <TimeSide label="Departure" state={departure} onState={setDeparture} />
              </div>
              <p
                className="mt-3 flex items-start gap-2 text-[12.5px]"
                style={{ color: INK_SOFT }}
              >
                <Info size={13} strokeWidth={1.7} className="mt-[2px] shrink-0" />
                Select &apos;Mixed times&apos; if your group arrives or departs at different times.
              </p>
            </div>
          </Card>

          <Card>
            <CardHead
              icon={<User size={19} strokeWidth={1.7} />}
              title="On-site contact"
              subtitle="Who can the hotel contact during the stay?"
            />
            <div className="mt-4 flex flex-col gap-3">
              <Field label="Role">
                <div className="relative mt-1">
                  <select
                    value={contact.role}
                    onChange={(e) => setContact({ ...contact, role: e.target.value })}
                    aria-label="On-site contact role"
                    className="h-[40px] w-full appearance-none rounded-[9px] px-3 pr-8 text-[13.5px] outline-none"
                    style={fieldStyle}
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    aria-hidden
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: INK_FAINT }}
                  />
                </div>
              </Field>

              <Field label="Name">
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  aria-label="On-site contact name"
                  className="mt-1 h-[40px] w-full rounded-[9px] px-3 text-[13.5px] outline-none"
                  style={fieldStyle}
                />
              </Field>

              <Field label="Mobile number">
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  aria-label="On-site contact mobile number"
                  className="mt-1 h-[40px] w-full rounded-[9px] px-3 text-[13.5px] outline-none"
                  style={fieldStyle}
                />
              </Field>

              {contact.secondary ? (
                <>
                  <Field label="Secondary name">
                    <input
                      type="text"
                      value={contact.secondary.name}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          secondary: { name: e.target.value, phone: contact.secondary?.phone ?? "" },
                        })
                      }
                      aria-label="Secondary contact name"
                      className="mt-1 h-[40px] w-full rounded-[9px] px-3 text-[13.5px] outline-none"
                      style={fieldStyle}
                    />
                  </Field>
                  <Field label="Secondary mobile number">
                    <input
                      type="tel"
                      value={contact.secondary.phone}
                      onChange={(e) =>
                        setContact({
                          ...contact,
                          secondary: { name: contact.secondary?.name ?? "", phone: e.target.value },
                        })
                      }
                      aria-label="Secondary contact mobile number"
                      className="mt-1 h-[40px] w-full rounded-[9px] px-3 text-[13.5px] outline-none"
                      style={fieldStyle}
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={() => setContact({ ...contact, secondary: null })}
                    className="self-start text-[12.5px] transition-opacity hover:opacity-70"
                    style={{ color: INK_FAINT }}
                  >
                    Remove secondary contact
                  </button>
                </>
              ) : (
                <TextAction
                  label="+ Add secondary contact"
                  className="self-start"
                  onClick={() => setContact({ ...contact, secondary: { name: "", phone: "" } })}
                />
              )}
            </div>
          </Card>
        </div>

        {/* ── review cards ── */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Card>
            <CardHead
              icon={<Utensils size={19} strokeWidth={1.7} />}
              title="Meals"
              action={
                <TextAction
                  label="Request change"
                  arrow
                  onClick={() => onRequestChange?.("meals")}
                />
              }
            />
            <div className="mt-3">
              {meals.length === 0 ? (
                <p className="text-[13px]" style={{ color: INK_FAINT }}>
                  No group meals booked
                </p>
              ) : (
                meals.map((m) => <Row key={m.label} label={m.label} value={m.value} />)
              )}
            </div>
          </Card>

          <Card>
            <CardHead
              icon={<Star size={19} strokeWidth={1.7} />}
              title="Special arrangements"
              action={
                <TextAction
                  label="Request change"
                  arrow
                  onClick={() => onRequestChange?.("services")}
                />
              }
            />
            <div className="mt-3">
              <Row label="Coach parking" value="Confirmed" tone="green" />
              <Row label="Extra luggage room" value="Confirmed" tone="green" />
            </div>
          </Card>

          <Card>
            <CardHead
              icon={<Leaf size={19} strokeWidth={1.7} />}
              title="Allergies & dietary"
              action={<TextAction label="+ Add more" onClick={onOpenDietary} />}
            />
            <button
              type="button"
              onClick={onOpenDietary}
              className="mt-4 flex w-full flex-col items-center gap-2 rounded-[10px] py-3 text-center transition-colors hover:bg-[rgba(27,37,48,0.02)]"
            >
              <span
                className="grid h-[38px] w-[38px] place-items-center rounded-full"
                style={{ background: BANNER, color: BRONZE_DEEP }}
              >
                <Leaf size={18} strokeWidth={1.7} />
              </span>
              <span className="text-[14px] font-semibold" style={{ color: INK }}>
                {allergyCount} allergies added
              </span>
              <span className="text-[12.5px]" style={{ color: INK_SOFT }}>
                We&apos;ll make sure the hotel is informed.
              </span>
            </button>
          </Card>
        </div>

        {/* ── optional note ── */}
        <Card>
          <div className="flex items-center gap-2.5">
            <MessageSquare size={17} strokeWidth={1.7} style={{ color: INK }} />
            <span className="text-[15px] font-semibold" style={{ color: INK }}>
              Final note to hotel
            </span>
            <span
              className="text-[11px] uppercase tracking-[0.1em]"
              style={{ color: INK_FAINT }}
            >
              Optional
            </span>
          </div>
          <p className="mt-1 text-[12.5px]" style={{ color: INK_SOFT }}>
            Anything else the hotel should know before arrival?
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 500))}
            maxLength={500}
            aria-label="Final note to hotel"
            placeholder="Add an important note for the hotel..."
            className="mt-3 h-[76px] w-full resize-none rounded-[10px] px-3 py-2.5 text-[13.5px] outline-none"
            style={fieldStyle}
          />
          <p className="mt-1 text-right text-[12px] tabular-nums" style={{ color: INK_FAINT }}>
            {note.length} / 500
          </p>
        </Card>

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
            Your information is securely shared with the hotel.
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
              Everything ready?
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: INK_SOFT }}>
              Review your arrival information and final details before confirming.
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
            Confirm final details <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </Plate>
  );
}
