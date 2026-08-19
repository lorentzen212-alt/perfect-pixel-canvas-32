import * as React from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Leaf,
  MessageSquare,
  ShieldCheck,
  Star,
  User,
  Utensils,
  X,
} from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";
import { Card, Plate } from "@/features/booking-workspace/overview/primitives";
import {
  GOLD,
  GREEN,
  HAIR,
  INK,
  INK_2,
  INK_3,
  IVORY,
} from "@/features/booking-workspace/overview/materials";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ── local constants materials.ts has no equivalent for ── */
const GOLD_HI = "#CC8C1E";
const GOLD_DEEP = "#A96C12";
const CHEVRON = "rgba(27,37,48,0.55)";
/** ivory-compatible field surface — never pure white */
const FIELD_BG = "rgba(255,255,255,0.55)";

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
  unknown: "Approximate time",
  mixed: "Mixed times",
};

const MODES: TimeMode[] = ["exact", "unknown", "mixed"];

export type MealLine = { label: string; value: string };
export type RequestSection = "meals" | "services";

export type ContactState = {
  role: string;
  name: string;
  phone: string;
  secondary?: { name: string; phone: string } | null;
};

/* ── shared bits ── */

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
    <div className="flex items-start gap-2.5">
      <span className="mt-[1px] shrink-0" style={{ color: INK }}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold" style={{ color: INK }}>
          {title}
        </span>
        {subtitle && (
          <span className="mt-1 block text-[12.5px]" style={{ color: INK_2 }}>
            {subtitle}
          </span>
        )}
      </span>
    </div>
  );
}

/** quiet text-only action */
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
      className={`inline-flex items-center gap-1 text-[12.5px] font-medium transition-opacity hover:opacity-70 ${className}`}
      style={{ color: GOLD }}
    >
      {label}
      {arrow && <ArrowRight size={13} />}
    </button>
  );
}

/** footer row pinned to the bottom of the three symmetrical cards */
function CardFooter({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <div className="mt-auto pt-3">
      <span aria-hidden className="mb-2 block h-px" style={{ background: HAIR }} />
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between gap-3 text-left transition-opacity hover:opacity-70"
      >
        <span className="text-[12.5px]" style={{ color: INK_2 }}>
          {label}
        </span>
        <ChevronRight size={15} strokeWidth={1.8} style={{ color: CHEVRON }} />
      </button>
    </div>
  );
}

/* ── the progress ring ── */

function ProgressRing({ value }: { value: number }) {
  const size = 64;
  const stroke = 5;
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
          stroke={GOLD}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(c * value) / 100} ${c}`}
        />
      </svg>
      <span className="absolute text-[14px] font-semibold tabular-nums" style={{ color: INK }}>
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
      <CalendarDays size={15} strokeWidth={1.7} className="shrink-0" style={{ color: INK_3 }} />
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
          style={{ color: value ? INK : INK_3 }}
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
    <span className="flex shrink-0 items-center gap-2.5">
      <Clock size={15} strokeWidth={1.7} className="shrink-0" style={{ color: INK_3 }} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="appearance-none bg-transparent text-[13.5px] font-medium tabular-nums outline-none"
        style={{ color: value ? INK : INK_3 }}
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
    </span>
  );
}

/** time-type popover, triggered by the chevron at the end of the control */
function ModeMenu({
  side,
  value,
  onChange,
}: {
  side: "Arrival" | "Departure";
  value: TimeMode;
  onChange: (v: TimeMode) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`${side} time type`}
          className="grid h-[26px] w-[22px] shrink-0 place-items-center rounded-[6px] outline-none transition-colors hover:bg-[rgba(27,37,48,0.05)]"
        >
          <ChevronDown size={15} strokeWidth={1.8} style={{ color: CHEVRON }} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="min-w-[190px] rounded-[10px] p-1"
        style={{
          background: IVORY,
          border: `1px solid ${HAIR}`,
          boxShadow: "0 6px 16px -10px rgba(15,25,35,0.28)",
        }}
      >
        {MODES.map((m) => (
          <DropdownMenuItem
            key={m}
            onSelect={() => onChange(m)}
            className="flex h-[35px] items-center gap-2 rounded-[8px] px-2.5 text-[12.5px] focus:bg-[rgba(27,37,48,0.04)]"
            style={{ color: INK }}
          >
            <span className="flex-1 truncate">{MODE_LABEL[m]}</span>
            {value === m && <Check size={13} strokeWidth={2} style={{ color: GOLD }} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
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
      <span className="block text-[11px] uppercase tracking-[0.12em]" style={{ color: INK_3 }}>
        {label}
      </span>

      <div
        className="mt-1.5 flex h-[46px] items-center gap-3 rounded-[10px] px-3"
        style={{ border: `1px solid ${HAIR}`, background: FIELD_BG }}
      >
        <DateValue value={state.date} onChange={(date) => onState({ ...state, date })} />

        <span aria-hidden className="h-[20px] w-px shrink-0" style={{ background: HAIR }} />

        {state.mode === "exact" && (
          <TimeValue
            value={state.time}
            onChange={(time) => onState({ ...state, time })}
            label={`${label} time`}
          />
        )}

        {state.mode === "mixed" && (
          <span className="shrink-0 text-[12.5px]" style={{ color: INK_2 }}>
            Multiple {lower} times
          </span>
        )}

        {state.mode === "unknown" && (
          <span className="shrink-0 text-[12.5px]" style={{ color: INK_3 }}>
            Time not confirmed
          </span>
        )}

        <ModeMenu side={label} value={state.mode} onChange={(mode) => onState({ ...state, mode })} />
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
                    onClick={() => onState({ ...state, times: state.times.filter((x) => x !== t) })}
                    className="transition-opacity hover:opacity-70"
                    style={{ color: INK_3 }}
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
                style={{ color: INK_3 }}
              />
            </span>
          ) : (
            <TextAction label="+ Add times" onClick={() => setAdding(true)} />
          )}
        </div>
      )}
    </div>
  );
}

/* ── simple label / value row ── */

function Row({ label, value, tone }: { label: string; value: string; tone?: "green" }) {
  return (
    <div className="flex items-center justify-between gap-4 py-[5px]">
      <span className="min-w-0 truncate text-[13px]" style={{ color: INK }}>
        {label}
      </span>
      <span
        className="shrink-0 text-[13px] font-medium tabular-nums"
        style={{ color: tone === "green" ? GREEN : INK }}
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
  background: FIELD_BG,
  color: INK,
};

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
  const [noteOpen, setNoteOpen] = React.useState(false);
  const noteExpanded = noteOpen || note.length > 0;

  return (
    <Plate>
      <div className="flex flex-1 flex-col gap-4 px-5 pb-12 pt-6 sm:px-8">
        {/* ── ROW 1 · progress ── */}
        <Card className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3.5">
          <ProgressRing value={80} />
          <div className="min-w-0 flex-1">
            <h2 className="text-[21px]" style={{ color: INK, fontFamily: SERIF, fontWeight: 600 }}>
              Final details
            </h2>
            <p className="mt-0.5 text-[13px]" style={{ color: INK_2 }}>
              A few last details before arrival
            </p>
          </div>
          <span className="text-[13px]" style={{ color: INK_2 }}>
            2 items need your attention
          </span>
          <button
            type="button"
            onClick={() => timesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="inline-flex h-[38px] shrink-0 items-center rounded-full px-5 text-[13px] font-medium transition-colors hover:bg-[rgba(27,37,48,0.04)]"
            style={{ border: `1px solid ${HAIR}`, color: INK }}
          >
            View missing items
          </button>
        </Card>

        {/* ── ROW 2 · arrival & departure + group contact ── */}
        <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[1.6fr_1fr] lg:items-stretch">
          <Card className="flex flex-col p-5" style={{ scrollMarginTop: 24 }}>
            <div ref={timesRef}>
              <CardHead
                icon={<CalendarDays size={19} strokeWidth={1.7} />}
                title="Arrival & Departure"
                subtitle="Please add your expected times"
              />
              <div className="mt-3.5 flex flex-col gap-4 sm:flex-row">
                <TimeSide label="Arrival" state={arrival} onState={setArrival} />
                <TimeSide label="Departure" state={departure} onState={setDeparture} />
              </div>
            </div>
          </Card>

          <Card className="flex flex-col p-5">
            <CardHead
              icon={<User size={19} strokeWidth={1.7} />}
              title="Group contact"
              subtitle="Who can we contact during the stay?"
            />
            <div className="mt-3.5 flex flex-wrap gap-2">
              <div className="relative min-w-[130px] flex-1">
                <select
                  value={contact.role}
                  onChange={(e) => setContact({ ...contact, role: e.target.value })}
                  aria-label="Group contact role"
                  className="h-[42px] w-full appearance-none rounded-[9px] px-3 pr-8 text-[13px] outline-none"
                  style={fieldStyle}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: CHEVRON }}
                />
              </div>

              <input
                type="text"
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                aria-label="Group contact name"
                placeholder="Name"
                className="h-[42px] min-w-[120px] flex-1 rounded-[9px] px-3 text-[13px] outline-none"
                style={fieldStyle}
              />

              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                aria-label="Group contact mobile number"
                placeholder="Mobile number"
                className="h-[42px] min-w-[140px] flex-1 rounded-[9px] px-3 text-[13px] outline-none"
                style={fieldStyle}
              />
            </div>

            {contact.secondary ? (
              <>
                <div className="mt-2 flex flex-wrap gap-2">
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
                    placeholder="Secondary name"
                    className="h-[42px] min-w-[120px] flex-1 rounded-[9px] px-3 text-[13px] outline-none"
                    style={fieldStyle}
                  />
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
                    placeholder="Secondary mobile number"
                    className="h-[42px] min-w-[140px] flex-1 rounded-[9px] px-3 text-[13px] outline-none"
                    style={fieldStyle}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setContact({ ...contact, secondary: null })}
                  className="mt-2 self-start text-[12.5px] transition-opacity hover:opacity-70"
                  style={{ color: INK_3 }}
                >
                  Remove secondary contact
                </button>
              </>
            ) : (
              <TextAction
                label="+ Add secondary contact"
                className="mt-2 self-start"
                onClick={() => setContact({ ...contact, secondary: { name: "", phone: "" } })}
              />
            )}
          </Card>
        </div>

        {/* ── ROW 3 · three symmetrical cards ── */}
        <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-3">
          <Card className="flex h-full flex-col p-5">
            <CardHead icon={<Utensils size={18} strokeWidth={1.7} />} title="Meals" />
            <div className="mt-2.5">
              {meals.length === 0 ? (
                <p className="text-[13px]" style={{ color: INK_3 }}>
                  No group meals booked
                </p>
              ) : (
                meals.slice(0, 2).map((m) => <Row key={m.label} label={m.label} value={m.value} />)
              )}
            </div>
            <CardFooter
              label={`${meals.length} details`}
              onClick={() => onRequestChange?.("meals")}
            />
          </Card>

          <Card className="flex h-full flex-col p-5">
            <CardHead icon={<Star size={18} strokeWidth={1.7} />} title="Special arrangements" />
            <div className="mt-2.5">
              <Row label="Coach parking" value="Confirmed" tone="green" />
              <Row label="Extra luggage room" value="Confirmed" tone="green" />
            </div>
            <CardFooter label="2 arrangements" onClick={() => onRequestChange?.("services")} />
          </Card>

          <Card className="flex h-full flex-col p-5">
            <CardHead icon={<Leaf size={18} strokeWidth={1.7} />} title="Allergies & dietary" />
            <div className="mt-2.5">
              <p className="text-[13px]" style={{ color: INK_2 }}>
                {allergyCount} notes
              </p>
            </div>
            <CardFooter label="View & edit" onClick={onOpenDietary} />
          </Card>
        </div>

        {/* ── ROW 4 · final note ── */}
        <Card className="p-4">
          {noteExpanded ? (
            <>
              <div className="flex items-center gap-2.5">
                <MessageSquare size={17} strokeWidth={1.7} style={{ color: INK }} />
                <span className="text-[14.5px] font-semibold" style={{ color: INK }}>
                  Final note to hotel
                </span>
                <button
                  type="button"
                  onClick={() => setNoteOpen(false)}
                  className="ml-auto text-[12.5px] font-medium transition-opacity hover:opacity-70"
                  style={{ color: GOLD }}
                >
                  Done
                </button>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 500))}
                maxLength={500}
                aria-label="Final note to hotel"
                placeholder="Add an important note for the hotel..."
                className="mt-2 h-[60px] w-full resize-none rounded-[10px] px-3 py-2.5 text-[13.5px] outline-none"
                style={fieldStyle}
              />
              <p className="mt-1 text-right text-[12px] tabular-nums" style={{ color: INK_3 }}>
                {note.length} / 500
              </p>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setNoteOpen(true)}
              className="flex w-full items-center gap-3 text-left transition-opacity hover:opacity-80"
            >
              <MessageSquare size={17} strokeWidth={1.7} className="shrink-0" style={{ color: INK }} />
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold" style={{ color: INK }}>
                  Final note to hotel
                  <span
                    className="ml-2 text-[10px] uppercase tracking-[0.12em]"
                    style={{ color: INK_3 }}
                  >
                    Optional
                  </span>
                </span>
                <span className="mt-0.5 block text-[12.5px]" style={{ color: INK_2 }}>
                  Anything else the hotel should know?
                </span>
              </span>
              <span
                className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-medium"
                style={{ color: GOLD }}
              >
                Add note
                <ChevronRight size={14} />
              </span>
            </button>
          )}
        </Card>

        {/* ── ROW 5 · confirmation ── */}
        <Card className="flex flex-wrap items-center gap-x-6 gap-y-4 px-5 py-3.5">
          <ShieldCheck size={22} strokeWidth={1.6} className="shrink-0" style={{ color: INK }} />
          <p className="min-w-[240px] flex-1 text-[13px] leading-relaxed" style={{ color: INK_2 }}>
            All information is securely shared with the hotel.
            <br className="hidden sm:block" /> You will receive an update as soon as we have a
            response.
          </p>

          <span
            aria-hidden
            className="hidden h-[48px] w-px shrink-0 lg:block"
            style={{ background: HAIR }}
          />

          <div className="min-w-[210px] max-w-[240px]">
            <p className="text-[13px] font-semibold" style={{ color: INK }}>
              All details ready?
            </p>
            <p className="mt-1 text-[12.5px] leading-relaxed" style={{ color: INK_2 }}>
              Review the information above before confirming your final details.
            </p>
          </div>

          <button
            type="button"
            onClick={onComplete}
            className="inline-flex h-[46px] shrink-0 items-center justify-center gap-2.5 rounded-[10px] px-6 text-[14px] font-semibold transition-opacity hover:opacity-90"
            style={{
              background: `linear-gradient(180deg, ${GOLD_HI} 0%, ${GOLD_DEEP} 100%)`,
              color: "#FFF9EE",
              boxShadow: "0 8px 18px -12px rgba(169,108,18,0.9)",
            }}
          >
            Confirm final details <ArrowRight size={16} />
          </button>
        </Card>
      </div>
    </Plate>
  );
}
