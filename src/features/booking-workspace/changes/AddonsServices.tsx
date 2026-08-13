import * as React from "react";
import {
  ArrowRight,
  BedDouble,
  Calendar,
  ChevronDown,
  Clock,
  ConciergeBell,
  Gift,
  Lock,
  Plus,
  Users,
  UsersRound,
  Utensils,
  X,
} from "lucide-react";

/* ── local light palette — mirrors ChangesFolder ── */
const WHITE = "#FFFFFF";
const INK = "#1B2530";
const INK_SOFT = "rgba(27,37,48,0.62)";
const INK_FAINT = "rgba(27,37,48,0.45)";
const HAIR = "rgba(27,37,48,0.10)";
const HAIR_SOFT = "rgba(27,37,48,0.07)";
const BRONZE = "#C0801E";
const BRONZE_DEEP = "#A96C12";
const GOLD_HI = "#CC8C1E";
/* the primary action inside the configurator reads as a flat orange face,
   which keeps it distinct from the gradient submit button in the bottom bar */
const ORANGE = "#C7740F";
const GREEN = "#3F7A55";
const CARD_SHADOW = "0 1px 2px rgba(24,30,36,0.04)";
const PANEL_SHADOW = "0 1px 2px rgba(24,30,36,0.04), 0 12px 28px -22px rgba(24,30,36,0.35)";

/* ── service catalogue ── */

type FieldKey = "date" | "time" | "guests" | "rooms" | "type" | "dietary";

type Service = {
  key: string;
  title: string;
  blurb: string;
  icon: React.ReactNode;
  fields: FieldKey[];
  typeLabel?: string;
  typeOptions?: string[];
};

const SERVICES: Service[] = [
  {
    key: "dinner",
    title: "Dinner / Group meal",
    blurb: "3-course dinner or buffet for your group.",
    icon: <Utensils size={19} strokeWidth={1.7} />,
    fields: ["date", "time", "guests", "type", "dietary"],
    typeLabel: "Type",
    typeOptions: ["3-course dinner", "2-course dinner", "Buffet", "Set menu", "Canapés"],
  },
  {
    key: "meeting",
    title: "Meeting room",
    blurb: "Reserve a meeting room for your group.",
    icon: <UsersRound size={19} strokeWidth={1.7} />,
    fields: ["date", "time", "guests", "type"],
    typeLabel: "Layout",
    typeOptions: ["Boardroom", "U-shape", "Theatre", "Classroom", "Cabaret"],
  },
  {
    key: "early-checkin",
    title: "Early check-in",
    blurb: "Request early access to rooms.",
    icon: <Clock size={19} strokeWidth={1.7} />,
    fields: ["date", "time", "rooms"],
  },
  {
    key: "late-checkout",
    title: "Late check-out",
    blurb: "Extend check-out time on departure day.",
    icon: <Clock size={19} strokeWidth={1.7} />,
    fields: ["date", "time", "rooms"],
  },
  {
    key: "porter",
    title: "Porter service",
    blurb: "Assistance with luggage on arrival/departure.",
    icon: <ConciergeBell size={19} strokeWidth={1.7} />,
    fields: ["date", "time"],
  },
  {
    key: "amenity",
    title: "Welcome amenity",
    blurb: "Welcome gift or amenity in the rooms.",
    icon: <Gift size={19} strokeWidth={1.7} />,
    fields: ["date", "rooms", "type"],
    typeLabel: "Amenity",
    typeOptions: ["Fruit basket", "Wine", "Chocolates", "Flowers", "Local treats"],
  },
  {
    key: "extra-beds",
    title: "Extra beds / Cots",
    blurb: "Extra beds or cots for your stay.",
    icon: <BedDouble size={19} strokeWidth={1.7} />,
    fields: ["rooms", "type"],
    typeLabel: "Bed type",
    typeOptions: ["Extra bed", "Cot / crib", "Sofa bed"],
  },
];

const DIETARY_OPTIONS = [
  "None",
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Lactose-free",
  "Halal",
  "Kosher",
  "Allergies — see notes",
];

const TIME_OPTIONS = (() => {
  const out: string[] = [];
  for (let h = 6; h <= 23; h += 1) {
    out.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 23) out.push(`${String(h).padStart(2, "0")}:30`);
  }
  return out;
})();

/* ── request draft ── */

type Draft = {
  date: string;
  time: string;
  guests: number;
  rooms: number;
  type: string;
  dietary: string;
  notes: string;
};

type Request = Draft & { key: string };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDay(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

function addDays(iso: string, days: number) {
  const t = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(t)) return iso;
  return new Date(t + days * 86400000).toISOString().slice(0, 10);
}

function serviceFor(key: string) {
  return SERVICES.find((s) => s.key === key);
}

/** the one-line recap under a request title, e.g.
 *  "16 Sep 2026, 19:00 • 63 guests • 3-course dinner" */
function recap(req: Request) {
  const svc = serviceFor(req.key);
  if (!svc) return "";
  const head = [
    svc.fields.includes("date") && req.date ? formatDay(req.date) : "",
    svc.fields.includes("time") ? req.time : "",
  ]
    .filter(Boolean)
    .join(", ");
  const parts = [head];
  if (svc.fields.includes("guests")) parts.push(`${req.guests} guests`);
  if (svc.fields.includes("rooms")) parts.push(`${req.rooms} rooms`);
  if (svc.fields.includes("type") && req.type) parts.push(req.type);
  return parts.filter(Boolean).join("  •  ");
}

/* ── form primitives ── */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-[12.5px]" style={{ color: INK_SOFT }}>
      {children}
    </span>
  );
}

const shellStyle: React.CSSProperties = {
  background: WHITE,
  border: `1px solid ${HAIR}`,
};

function Shell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`flex h-[46px] items-center gap-2 rounded-[10px] px-3.5 ${className}`}
      style={shellStyle}
    >
      {children}
    </span>
  );
}

function DateField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
    <Shell>
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
          className="flex-1 text-left text-[13.5px]"
          style={{ color: value ? INK : INK_FAINT }}
        >
          {value ? formatDay(value) : "dd.mm.yyyy"}
        </button>
      )}
      <button
        type="button"
        onClick={open}
        aria-label="Open date picker"
        className="shrink-0 transition-opacity hover:opacity-70"
        style={{ color: INK_FAINT }}
      >
        <Calendar size={16} strokeWidth={1.7} />
      </button>
    </Shell>
  );
}

function SelectField({
  value,
  onChange,
  options,
  placeholder,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  label: string;
}) {
  return (
    <span className="relative block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="h-[46px] w-full appearance-none rounded-[10px] px-3.5 pr-10 text-[13.5px] outline-none"
        style={{ ...shellStyle, color: value ? INK : INK_FAINT }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
        style={{ color: INK_FAINT }}
      />
    </span>
  );
}

function CountField({
  value,
  onChange,
  unit,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  unit: string;
  label: string;
}) {
  return (
    <Shell>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        aria-label={label}
        className="-mr-1 bg-transparent text-[13.5px] tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        /* sized to the digits so the value and its unit read as one phrase */
        style={{ color: INK, width: `${String(value).length + 0.5}ch` }}
      />
      <span className="text-[13.5px]" style={{ color: INK }}>
        {unit}
      </span>
    </Shell>
  );
}

/* ── left column ── */

function ServiceRow({ service, onConfigure }: { service: Service; onConfigure: () => void }) {
  return (
    <li className="flex items-center gap-4 px-5 py-[18px]">
      <span className="shrink-0" style={{ color: INK }}>
        {service.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14.5px] font-semibold" style={{ color: INK }}>
          {service.title}
        </span>
        <span className="block truncate text-[12.5px]" style={{ color: INK_SOFT }}>
          {service.blurb}
        </span>
      </span>
      <button
        type="button"
        onClick={onConfigure}
        className="inline-flex h-[38px] shrink-0 items-center gap-2 rounded-[9px] px-4 text-[13px] font-semibold transition-colors hover:bg-[rgba(192,128,30,0.06)]"
        style={{ border: `1px solid ${BRONZE}`, color: BRONZE_DEEP, background: WHITE }}
      >
        Configure <ArrowRight size={14} />
      </button>
    </li>
  );
}

/* ── right column ── */

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[10.5px] font-semibold uppercase"
      style={{ color: INK_FAINT, letterSpacing: "0.16em" }}
    >
      {children}
    </span>
  );
}

function ConfigurePanel({
  service,
  draft,
  onDraft,
  onAdd,
  onClose,
}: {
  service: Service;
  draft: Draft;
  onDraft: (patch: Partial<Draft>) => void;
  onAdd: () => void;
  onClose: () => void;
}) {
  const set =
    <K extends keyof Draft>(k: K) =>
    (v: Draft[K]) =>
      onDraft({ [k]: v } as Partial<Draft>);

  return (
    <div
      className="rounded-[14px] p-5 sm:p-6"
      style={{ background: WHITE, border: `1px solid ${HAIR}`, boxShadow: PANEL_SHADOW }}
    >
      <div className="flex items-start">
        <PanelTitle>Configure service</PanelTitle>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close configurator"
          className="-mr-1 -mt-1 ml-auto shrink-0 transition-opacity hover:opacity-70"
          style={{ color: INK_FAINT }}
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="shrink-0" style={{ color: GREEN }}>
          {service.icon}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-semibold" style={{ color: INK }}>
            {service.title}
          </span>
          <span className="block truncate text-[12.5px]" style={{ color: INK_SOFT }}>
            {service.blurb}
          </span>
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {service.fields.includes("date") && (
          <label className="block">
            <FieldLabel>Date</FieldLabel>
            <DateField value={draft.date} onChange={set("date")} />
          </label>
        )}
        {service.fields.includes("time") && (
          <label className="block">
            <FieldLabel>Preferred time</FieldLabel>
            <SelectField
              label="Preferred time"
              value={draft.time}
              onChange={set("time")}
              options={TIME_OPTIONS}
            />
          </label>
        )}
        {service.fields.includes("guests") && (
          <label className="block sm:col-span-2">
            <FieldLabel>Number of guests</FieldLabel>
            <CountField
              label="Number of guests"
              value={draft.guests}
              onChange={set("guests")}
              unit="guests"
            />
          </label>
        )}
        {service.fields.includes("rooms") && (
          <label className="block sm:col-span-2">
            <FieldLabel>Number of rooms</FieldLabel>
            <CountField
              label="Number of rooms"
              value={draft.rooms}
              onChange={set("rooms")}
              unit="rooms"
            />
          </label>
        )}
        {service.fields.includes("type") && (
          <label className="block">
            <FieldLabel>{service.typeLabel ?? "Type"}</FieldLabel>
            <SelectField
              label={service.typeLabel ?? "Type"}
              value={draft.type}
              onChange={set("type")}
              options={service.typeOptions ?? []}
            />
          </label>
        )}
        {service.fields.includes("dietary") && (
          <label className="block">
            <FieldLabel>Dietary requirements</FieldLabel>
            <SelectField
              label="Dietary requirements"
              value={draft.dietary}
              onChange={set("dietary")}
              options={DIETARY_OPTIONS}
              placeholder="Select or write"
            />
          </label>
        )}
      </div>

      <label className="mt-4 block">
        <FieldLabel>Notes / Special requests (optional)</FieldLabel>
        <span className="block rounded-[10px] p-3.5" style={shellStyle}>
          <textarea
            rows={2}
            maxLength={500}
            value={draft.notes}
            onChange={(e) => onDraft({ notes: e.target.value })}
            placeholder="Add any details or requests for the hotel…"
            className="w-full resize-none bg-transparent text-[13.5px] outline-none placeholder:text-[rgba(27,37,48,0.45)]"
            style={{ color: INK }}
          />
          <span className="mt-1 block text-right text-[11.5px]" style={{ color: INK_FAINT }}>
            {draft.notes.length}/500
          </span>
        </span>
      </label>

      <button
        type="button"
        onClick={onAdd}
        className="mt-5 inline-flex h-[46px] w-full items-center justify-center rounded-[9px] text-[14px] font-semibold transition-opacity hover:opacity-90"
        style={{ background: ORANGE, color: WHITE }}
      >
        Add to booking request
      </button>
    </div>
  );
}

function EmptyConfigurePanel() {
  return (
    <div
      className="rounded-[14px] px-8 py-14 text-center"
      style={{ background: WHITE, border: `1px solid ${HAIR}`, boxShadow: PANEL_SHADOW }}
    >
      <span
        className="mx-auto grid h-[52px] w-[52px] place-items-center rounded-full"
        style={{ background: "rgba(192,128,30,0.10)", color: BRONZE }}
      >
        <ConciergeBell size={22} strokeWidth={1.7} />
      </span>
      <h3 className="mt-4 text-[16px] font-semibold" style={{ color: INK }}>
        Configure a service
      </h3>
      <p className="mx-auto mt-2 max-w-[320px] text-[13px]" style={{ color: INK_SOFT }}>
        Pick a service on the left to set the details and add it to your change request.
      </p>
    </div>
  );
}

function RequestSoFar({
  requests,
  onEdit,
  onRemove,
  onAddAnother,
}: {
  requests: Request[];
  onEdit: (key: string) => void;
  onRemove: (key: string) => void;
  onAddAnother: () => void;
}) {
  return (
    <div
      className="mt-6 rounded-[14px] p-5 sm:p-6"
      style={{ background: WHITE, border: `1px solid ${HAIR}`, boxShadow: PANEL_SHADOW }}
    >
      <div className="flex items-center gap-3">
        <PanelTitle>Your request so far</PanelTitle>
        <span
          className="ml-auto inline-flex h-[24px] shrink-0 items-center rounded-full px-3 text-[11.5px] font-medium"
          style={{ background: "rgba(27,37,48,0.05)", color: INK_SOFT }}
        >
          {requests.length} {requests.length === 1 ? "change" : "changes"}
        </span>
      </div>

      {requests.length === 0 ? (
        <p className="mt-4 text-[13px]" style={{ color: INK_SOFT }}>
          Nothing added yet — configure a service to build your request.
        </p>
      ) : (
        <ul className="mt-4">
          {requests.map((req, i) => {
            const svc = serviceFor(req.key);
            if (!svc) return null;
            return (
              <li
                key={req.key}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5"
                style={i > 0 ? { borderTop: `1px solid ${HAIR_SOFT}` } : undefined}
              >
                <span className="shrink-0" style={{ color: GREEN }}>
                  {svc.icon}
                </span>
                <span className="min-w-[180px] flex-1">
                  <span className="block text-[14px] font-semibold" style={{ color: INK }}>
                    {svc.title}
                  </span>
                  <span className="mt-0.5 block text-[12.5px]" style={{ color: INK_SOFT }}>
                    {recap(req)}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-4 text-[13px] font-medium">
                  <button
                    type="button"
                    onClick={() => onEdit(req.key)}
                    className="underline underline-offset-4 transition-opacity hover:opacity-70"
                    style={{ color: BRONZE_DEEP }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(req.key)}
                    className="underline underline-offset-4 transition-opacity hover:opacity-70"
                    style={{ color: BRONZE_DEEP }}
                  >
                    Remove
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={onAddAnother}
        className="mt-4 flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[11px] text-[13.5px] font-medium transition-colors hover:bg-[rgba(27,37,48,0.02)]"
        style={{ border: `1px dashed ${HAIR}`, color: INK_SOFT }}
      >
        <Plus size={17} strokeWidth={1.7} />
        Add another service or change
      </button>
    </div>
  );
}

/* ── the sticky footer that submits every change on the Changes tab ── */

function SubmitBar({
  currentRooms,
  afterRooms,
  currentGuests,
  afterGuests,
  changeCount,
  onSubmit,
}: {
  currentRooms: number;
  afterRooms: number;
  currentGuests: number;
  afterGuests: number;
  changeCount: number;
  onSubmit?: () => void;
}) {
  const stat = (icon: React.ReactNode, label: string, from: number, to: number, unit: string) => (
    <span className="flex items-center gap-3">
      <span
        className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-full"
        style={{ background: "rgba(192,128,30,0.10)", color: BRONZE }}
      >
        {icon}
      </span>
      <span>
        <span className="block text-[11.5px]" style={{ color: INK_SOFT }}>
          {label}
        </span>
        <span
          className="flex items-center gap-1.5 text-[15px] font-semibold tabular-nums"
          style={{ color: INK }}
        >
          {from}
          <ArrowRight size={13} style={{ color: INK_FAINT }} />
          {to}
          <span className="text-[12px] font-normal" style={{ color: INK_SOFT }}>
            {unit}
          </span>
        </span>
      </span>
    </span>
  );

  return (
    <div
      className="sticky bottom-0 z-10 -mx-5 mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 px-5 py-4 sm:-mx-8 sm:px-8"
      style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        borderTop: `1px solid ${HAIR}`,
        boxShadow: "0 -8px 24px -20px rgba(24,30,36,0.5)",
      }}
    >
      {stat(<BedDouble size={18} strokeWidth={1.7} />, "Rooms", currentRooms, afterRooms, "rooms")}
      {stat(<Users size={18} strokeWidth={1.7} />, "Guests", currentGuests, afterGuests, "guests")}

      <span className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="flex items-center gap-2 text-[12px]" style={{ color: INK_FAINT }}>
          <Lock size={13} />
          Your request is sent securely
        </span>
        <button
          type="button"
          onClick={onSubmit}
          disabled={changeCount === 0}
          className="inline-flex h-[48px] items-center justify-center gap-2.5 rounded-[10px] px-6 text-[14.5px] font-semibold transition-opacity"
          style={{
            background: `linear-gradient(180deg, ${GOLD_HI} 0%, ${BRONZE_DEEP} 100%)`,
            color: WHITE,
            opacity: changeCount === 0 ? 0.5 : 1,
            cursor: changeCount === 0 ? "not-allowed" : "pointer",
            boxShadow: "0 8px 18px -12px rgba(169,108,18,0.9)",
          }}
        >
          Submit change request <ArrowRight size={16} />
        </button>
      </span>
    </div>
  );
}

/* ── the tab body ── */

export function AddonsServices({
  stayStart,
  guests,
  currentRooms,
  afterRooms,
  currentGuests,
  afterGuests,
  roomsChanged,
  onSubmit,
  onCustomRequest,
}: {
  stayStart: string;
  guests: number;
  currentRooms: number;
  afterRooms: number;
  currentGuests: number;
  afterGuests: number;
  roomsChanged: boolean;
  onSubmit?: () => void;
  onCustomRequest: () => void;
}) {
  /* demo seed so the panel opens on a representative request, the way the
     workspace looks once a group meal has already been asked for */
  const seedDate = addDays(stayStart, 2);
  const [requests, setRequests] = React.useState<Request[]>([
    {
      key: "dinner",
      date: seedDate,
      time: "19:00",
      guests,
      rooms: 0,
      type: "3-course dinner",
      dietary: "",
      notes: "",
    },
  ]);

  const [openKey, setOpenKey] = React.useState<string | null>("dinner");
  const [draft, setDraft] = React.useState<Draft>({
    date: seedDate,
    time: "19:00",
    guests,
    rooms: currentRooms,
    type: "3-course dinner",
    dietary: "",
    notes: "",
  });

  const listRef = React.useRef<HTMLDivElement>(null);
  const service = openKey ? serviceFor(openKey) : undefined;

  const configure = (key: string) => {
    const existing = requests.find((r) => r.key === key);
    const svc = serviceFor(key);
    setOpenKey(key);
    setDraft(
      existing ?? {
        date: seedDate,
        time: "19:00",
        guests,
        rooms: currentRooms,
        type: svc?.typeOptions?.[0] ?? "",
        dietary: "",
        notes: "",
      },
    );
  };

  const commit = () => {
    if (!openKey) return;
    setRequests((prev) => {
      const next = { ...draft, key: openKey };
      return prev.some((r) => r.key === openKey)
        ? prev.map((r) => (r.key === openKey ? next : r))
        : [...prev, next];
    });
    setOpenKey(null);
  };

  const remove = (key: string) => {
    setRequests((prev) => prev.filter((r) => r.key !== key));
    if (openKey === key) setOpenKey(null);
  };

  const changeCount = requests.length + (roomsChanged ? 1 : 0);

  return (
    <div className="flex flex-1 flex-col px-5 pt-7 sm:px-8">
      <div className="grid flex-1 grid-cols-1 gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        {/* ─ left — the catalogue ─ */}
        <div className="min-w-0" ref={listRef}>
          <PanelTitle>Add-ons &amp; services</PanelTitle>
          <p className="mt-1.5 text-[13px]" style={{ color: INK_SOFT }}>
            Add or remove services for your stay.
          </p>

          <ul
            className="mt-4 overflow-hidden rounded-[14px] [&>li+li]:border-t [&>li+li]:border-[rgba(27,37,48,0.07)]"
            style={{ background: WHITE, border: `1px solid ${HAIR}`, boxShadow: CARD_SHADOW }}
          >
            {SERVICES.map((s) => (
              <ServiceRow key={s.key} service={s} onConfigure={() => configure(s.key)} />
            ))}
          </ul>

          <button
            type="button"
            onClick={onCustomRequest}
            className="mt-4 flex w-full items-center gap-4 rounded-[14px] px-5 py-[18px] text-left transition-colors hover:bg-[rgba(27,37,48,0.02)]"
            style={{ border: `1px dashed ${HAIR}` }}
          >
            <Plus size={19} strokeWidth={1.7} style={{ color: INK }} className="shrink-0" />
            <span className="min-w-0">
              <span className="block text-[14.5px] font-semibold" style={{ color: INK }}>
                Add a custom request
              </span>
              <span className="block text-[12.5px]" style={{ color: INK_SOFT }}>
                Can&rsquo;t find what you need? Tell us in your own words.
              </span>
            </span>
          </button>
        </div>

        {/* ─ right — configurator + running request ─ */}
        <div className="min-w-0">
          {service ? (
            <ConfigurePanel
              service={service}
              draft={draft}
              onDraft={(patch) => setDraft((d) => ({ ...d, ...patch }))}
              onAdd={commit}
              onClose={() => setOpenKey(null)}
            />
          ) : (
            <EmptyConfigurePanel />
          )}

          <RequestSoFar
            requests={requests}
            onEdit={configure}
            onRemove={remove}
            onAddAnother={() =>
              listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          />
        </div>
      </div>

      <SubmitBar
        currentRooms={currentRooms}
        afterRooms={afterRooms}
        currentGuests={currentGuests}
        afterGuests={afterGuests}
        changeCount={changeCount}
        onSubmit={onSubmit}
      />
    </div>
  );
}
