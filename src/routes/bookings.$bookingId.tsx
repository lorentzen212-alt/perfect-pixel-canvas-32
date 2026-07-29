import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bed,
  Building2,
  Check,
  ChevronRight,
  Clock,
  Copy,
  MapPin,
  MessageSquare,
  Pencil,
  Plus,
  Star,
  Trash2,
  UtensilsCrossed,
  ConciergeBell,
  Users,
  X,
  CalendarDays,
} from "lucide-react";
import { PAL, SERIF, SidebarContent, TopBar } from "@/components/DashboardChrome";
import { BOOKINGS, roomingProgress, type Booking } from "@/lib/bookings";

export const Route = createFileRoute("/bookings/$bookingId")({
  component: BookingWorkspace,
  head: () => ({
    meta: [
      { title: "Booking Workspace — HotelGroupBook" },
      {
        name: "description",
        content:
          "Manage a single group booking: stay details, hotel, rooms, dining, services and rooming list progress.",
      },
      { property: "og:title", content: "Booking Workspace — HotelGroupBook" },
      {
        property: "og:description",
        content: "Everything for one group stay in a single calm workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const {
  BG_ALT,
  CARD,
  CARD_BORDER,
  CARD_SHADOW,
  ACTION_PANEL,
  BORDER,
  TEXT,
  TEXT_2,
  MUTED,
  GOLD,
  GOLD_DEEP,
  GOLD_SOFT,
  GREEN,
} = PAL;

const TABS = ["Overview", "Rooming List", "Documents", "Activity"];

type PanelKey = "stay" | "rooms" | "dining" | "services" | "requests" | null;

/* ───────────────────────── primitives ───────────────────────── */

function GoldAction({
  label,
  onClick,
  bright,
}: {
  label: string;
  onClick?: () => void;
  bright?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-all duration-200"
      style={{ color: bright ? GOLD : GOLD_SOFT, opacity: bright ? 1 : 0.88 }}
    >
      {label}
      <span aria-hidden className="text-[13px] leading-none">
        →
      </span>
    </button>
  );
}

function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full"
      style={{
        backgroundColor: "rgba(12,30,42,0.55)",
        border: `1px solid rgba(199,163,74,0.22)`,
        color: GOLD,
      }}
    >
      {children}
    </span>
  );
}

function OverviewCard({
  icon,
  title,
  badge,
  children,
  action,
  onAction,
  dimmed,
}: {
  icon: React.ReactNode;
  title: string;
  badge?: string;
  children: React.ReactNode;
  action?: string;
  onAction?: () => void;
  dimmed?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const interactive = Boolean(onAction);
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onAction}
      className="flex min-h-[152px] flex-col rounded-[13px] px-4 py-3"
      style={{
        backgroundColor: hover && interactive ? "#30404C" : CARD,
        border: `1px solid ${hover && interactive ? "rgba(199,163,74,0.42)" : CARD_BORDER}`,
        boxShadow:
          hover && interactive
            ? `${CARD_SHADOW}, 0 0 0 1px rgba(199,163,74,0.06), 0 10px 26px -18px rgba(199,163,74,0.45)`
            : CARD_SHADOW,
        transform: hover && interactive ? "translateY(-2px)" : "none",
        transition: "transform 200ms ease-out, background-color 200ms ease-out, border-color 200ms ease-out, box-shadow 200ms ease-out, opacity 200ms ease-out",
        cursor: interactive ? "pointer" : "default",
        opacity: dimmed ? 0.55 : 1,
      }}
    >
      <div className="flex items-center gap-3">
        <IconBubble>{icon}</IconBubble>
        <h3 className="text-[12.5px] font-semibold uppercase tracking-[0.16em]" style={{ color: TEXT }}>
          {title}
        </h3>
        {badge && (
          <span
            className="ml-auto rounded-[5px] px-2 py-[2px] text-[10.5px]"
            style={{ backgroundColor: "rgba(141,168,138,0.14)", color: GREEN }}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="mt-2.5 flex-1 text-[13px]" style={{ color: TEXT_2 }}>
        {children}
      </div>
      {action && (
        <div className="mt-2">
          <GoldAction label={action} bright={hover} />
        </div>
      )}
    </article>
  );
}

function Ring({ value, size = 78 }: { value: number; size?: number }) {
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ height: size, width: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" style={{ height: size, width: size }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={GOLD}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * c} ${c}`}
        />
      </svg>
      <span className="absolute text-[15px] font-medium" style={{ color: TEXT }}>
        {value}%
      </span>
    </div>
  );
}

function PanelShell({
  title,
  saved,
  dirty,
  onCancel,
  onSave,
  saveLabel,
  children,
}: {
  title: string;
  saved: boolean;
  dirty: boolean;
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-[13px] p-5"
      style={{
        backgroundColor: "#30404C",
        border: `1px solid rgba(199,163,74,0.34)`,
        boxShadow: `${CARD_SHADOW}, 0 14px 34px -24px rgba(199,163,74,0.5)`,
        animation: "hgbPanelIn 200ms ease-out",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-[12.5px] font-semibold uppercase tracking-[0.16em]" style={{ color: TEXT }}>
          {title}
        </h3>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: GREEN }}>
            <Check size={13} /> Changes saved
          </span>
        )}
      </div>

      <div className="mt-4">{children}</div>

      <div
        className="mt-4 flex items-center justify-end gap-5 pt-3.5"
        style={{ borderTop: `1px solid ${BORDER}` }}
      >
        <button
          type="button"
          onClick={onCancel}
          className="text-[12.5px] transition-opacity hover:opacity-80"
          style={{ color: MUTED }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty}
          className="inline-flex items-center gap-2 rounded-[6px] px-4 py-[8px] text-[12.5px] font-medium transition-all duration-200"
          style={{
            color: dirty ? GOLD : MUTED,
            border: `1px solid ${dirty ? GOLD_DEEP : BORDER}`,
            backgroundColor: dirty ? "rgba(199,163,74,0.08)" : "transparent",
            cursor: dirty ? "pointer" : "not-allowed",
          }}
        >
          {saveLabel}
          <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}

function Stepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const [flash, setFlash] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 600);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div
      className="inline-flex items-center rounded-[8px]"
      style={{ border: `1px solid ${BORDER}`, backgroundColor: "rgba(12,30,42,0.4)" }}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="grid h-[32px] w-[32px] place-items-center text-[15px] transition-colors hover:text-[color:var(--g)]"
        style={{ color: MUTED, ["--g" as string]: GOLD }}
        aria-label="Decrease"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        min={0}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-[46px] bg-transparent text-center text-[13.5px] outline-none"
        style={{
          color: flash ? GOLD : TEXT,
          transition: "color 500ms ease-out",
          textShadow: flash ? "0 0 10px rgba(199,163,74,0.45)" : "none",
        }}
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="grid h-[32px] w-[32px] place-items-center text-[15px] transition-colors"
        style={{ color: MUTED }}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
        {label}
      </span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  backgroundColor: "rgba(12,30,42,0.45)",
  border: `1px solid ${BORDER}`,
  color: TEXT,
};

/* ───────────────────────── page ───────────────────────── */

function BookingWorkspace() {
  const { bookingId } = Route.useParams();
  const booking = BOOKINGS.find((b) => b.id === bookingId || b.reference === bookingId);
  if (!booking) throw notFound();
  return <Workspace booking={booking} />;
}

function Workspace({ booking }: { booking: Booking }) {
  const [navOpen, setNavOpen] = useState(false);
  const [tab, setTab] = useState("Overview");
  const progress = roomingProgress(booking) || 72;
  const rooming = booking.rooming;
  const confirmed = booking.status === "confirmed" || booking.status === "upcoming";

  const [panel, setPanel] = useState<PanelKey>(null);
  const [savedPanel, setSavedPanel] = useState<PanelKey>(null);

  /* top-card editable state */
  const [hotelRef, setHotelRef] = useState(booking.hotelReference ?? "");
  const [refDraft, setRefDraft] = useState(hotelRef);
  const [editingRef, setEditingRef] = useState(false);
  const [copied, setCopied] = useState(false);

  /* domain state (kept live across panels) */
  const [rooms, setRooms] = useState([
    { type: "Twin Rooms", note: "Two separate beds", qty: 17, perRoom: 2 },
    { type: "Single Rooms", note: "One guest", qty: 8, perRoom: 1 },
    { type: "Triple Rooms", note: "Three guests", qty: 7, perRoom: 3 },
  ]);
  const [stay, setStay] = useState({
    arrival: booking.startDate.slice(0, 10),
    departure: booking.endDate.slice(0, 10),
    location: booking.destination,
  });
  const [dining, setDining] = useState({
    breakfast: true,
    groupDinner: true,
    date: "2026-09-14",
    time: "19:30",
    guests: booking.guests ?? 58,
    details: "Three-course set menu, two vegetarian options.",
  });
  const [services, setServices] = useState([
    { name: "Porter Service In", detail: "14 Sep • 15:00" },
    { name: "VIP Welcome Amenity", detail: "8 rooms" },
    { name: "Airport Transfer", detail: "2 coaches" },
    { name: "Late Checkout", detail: "10 rooms" },
  ]);
  const [requests, setRequests] = useState([
    "Early breakfast requested on departure day.",
  ]);

  const totalRooms = rooms.reduce((s, r) => s + r.qty, 0);
  const totalGuests = rooms.reduce((s, r) => s + r.qty * r.perRoom, 0);
  const nights = useMemo(() => {
    const a = new Date(stay.arrival).getTime();
    const d = new Date(stay.departure).getTime();
    return Math.max(0, Math.round((d - a) / 86400000));
  }, [stay]);

  /* dirty tracking */
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const markDirty = (k: string) => setDirty((p) => ({ ...p, [k]: true }));

  const closePanel = (k: PanelKey) => {
    setPanel(null);
    setDirty((p) => ({ ...p, [k as string]: false }));
  };

  const savePanel = (k: PanelKey) => {
    setSavedPanel(k);
    setDirty((p) => ({ ...p, [k as string]: false }));
    setTimeout(() => {
      setSavedPanel(null);
      setPanel((cur) => (cur === k ? null : cur));
    }, 1500);
  };

  const roomsMajor = Math.abs(totalRooms - (booking.rooms ?? totalRooms)) > 3;
  const stayMajor =
    confirmed && (stay.arrival !== booking.startDate.slice(0, 10) || stay.departure !== booking.endDate.slice(0, 10));

  const dim = (key: PanelKey) => panel !== null && panel !== key;

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG_ALT }}>
      <style>{`@keyframes hgbPanelIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}`}</style>

      <aside className="fixed inset-y-0 left-0 hidden w-[244px] lg:block">
        <SidebarContent active="Overview" />
      </aside>

      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[268px]">
            <SidebarContent active="Overview" />
            <button
              aria-label="Close navigation"
              onClick={() => setNavOpen(false)}
              className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-md"
              style={{ color: TEXT_2 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pl-[244px]">
        <TopBar
          onOpenNav={() => setNavOpen(true)}
          left={
            <Link
              to="/manage-bookings"
              className="inline-flex items-center gap-2 text-[13.5px] font-medium transition-opacity hover:opacity-80"
              style={{ color: GOLD_SOFT }}
            >
              <ArrowLeft size={16} />
              Back to My Bookings
            </Link>
          }
        />

        <main className="px-4 py-3 sm:px-6 lg:px-8" style={{ backgroundColor: BG_ALT }}>
          {/* ── hero ─────────────────────────────── */}
          <section
            className="relative overflow-hidden rounded-[13px]"
            style={{ border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
          >
            <img
              src={booking.image}
              alt={`${booking.destination} skyline`}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "saturate(0.95) brightness(0.95)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(23,42,56,0.94) 0%, rgba(23,42,56,0.86) 42%, rgba(26,45,60,0.62) 70%, rgba(26,45,60,0.74) 100%)",
              }}
            />
            <div className="relative px-5 py-3.5">
              <span
                className="inline-flex items-center rounded px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.18em]"
                style={{
                  color: GOLD,
                  backgroundColor: "rgba(199,163,74,0.12)",
                  border: `1px solid rgba(199,163,74,0.34)`,
                }}
              >
                {booking.type === "leisure" ? "Leisure" : "M&E"}
              </span>
              <h1 className="mt-1.5 text-[28px] leading-[1.05]" style={{ color: TEXT, fontFamily: SERIF }}>
                {booking.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-[13px]" style={{ color: TEXT_2 }}>
                {booking.hotel && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin size={14} style={{ color: GOLD_SOFT }} />
                    {booking.hotel}
                  </span>
                )}
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} style={{ color: GOLD_SOFT }} />
                  {new Date(stay.arrival).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} –{" "}
                  {new Date(stay.departure).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock size={14} style={{ color: GOLD_SOFT }} />
                  {nights} nights
                </span>
                <span className="inline-flex items-center gap-2">
                  <Bed size={14} style={{ color: GOLD_SOFT }} />
                  {totalRooms} rooms
                </span>
                <span className="inline-flex items-center gap-2">
                  <Users size={14} style={{ color: GOLD_SOFT }} />
                  {totalGuests} guests
                </span>
              </div>
            </div>
          </section>

          {/* ── next action + info cards ─────────── */}
          <section
            className="mt-3 rounded-[13px] px-4 py-3"
            style={{
              backgroundColor: ACTION_PANEL,
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: CARD_SHADOW,
            }}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Ring value={progress} size={64} />
              <div className="min-w-0 flex-1 sm:pl-2">
                <h2 className="text-[20px] font-medium" style={{ color: TEXT }}>
                  Complete your Rooming List
                </h2>
                <p className="mt-1 text-[12.5px]" style={{ color: MUTED }}>
                  {rooming ? `${rooming.complete} / ${rooming.total} guests complete` : "42 / 58 guests complete"}
                  {"  •  Due 04 September 2026"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTab("Rooming List")}
                className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[6px] px-5 py-[8px] text-[13px] font-medium transition-colors hover:bg-[rgba(199,163,74,0.10)]"
                style={{ color: GOLD_SOFT, border: `1px solid ${GOLD_DEEP}` }}
              >
                Continue Rooming List
                <span aria-hidden>→</span>
              </button>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {/* hotel reference */}
              <div
                className="flex min-h-[60px] flex-col justify-center rounded-[10px] px-3.5 py-2"
                style={{ backgroundColor: "rgba(12,30,42,0.42)", border: `1px solid ${BORDER}` }}
              >
                <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                  Hotel Reference
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-3">
                  {editingRef ? (
                    <input
                      autoFocus
                      value={refDraft}
                      onChange={(e) => setRefDraft(e.target.value)}
                      className="min-w-0 flex-1 rounded-[6px] px-2 py-1 text-[14px] outline-none"
                      style={inputStyle}
                    />
                  ) : (
                    <span className="truncate text-[15px]" style={{ color: hotelRef ? TEXT : MUTED }}>
                      {hotelRef || "Not yet assigned"}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (editingRef) setHotelRef(refDraft.trim());
                      else setRefDraft(hotelRef);
                      setEditingRef(!editingRef);
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 text-[12px] transition-opacity hover:opacity-80"
                    style={{ color: GOLD_SOFT }}
                  >
                    {editingRef ? "Save" : "Edit"}
                    {editingRef ? <Check size={13} /> : <Pencil size={12} />}
                  </button>
                </div>
              </div>

              {/* booking id */}
              <div
                className="flex min-h-[60px] flex-col justify-center rounded-[10px] px-3.5 py-2"
                style={{ backgroundColor: "rgba(12,30,42,0.42)", border: `1px solid ${BORDER}` }}
              >
                <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                  Booking ID
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-3">
                  <span className="truncate text-[15px]" style={{ color: TEXT }}>
                    {booking.reference}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(booking.reference);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 text-[12px] transition-opacity hover:opacity-80"
                    style={{ color: copied ? GREEN : GOLD_SOFT }}
                  >
                    {copied ? "Copied" : "Copy"}
                    {copied ? <Check size={13} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              {/* status */}
              <div
                className="flex min-h-[60px] flex-col justify-center rounded-[10px] px-3.5 py-2"
                style={{ backgroundColor: "rgba(12,30,42,0.42)", border: `1px solid ${BORDER}` }}
              >
                <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                  Status
                </p>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 text-[15px]" style={{ color: GREEN }}>
                    Confirmed
                    <Check size={14} />
                  </span>
                  <span className="text-[12px]" style={{ color: MUTED }}>
                    on 21 Jul 2026
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ── tabs ─────────────────────────────── */}
          <nav
            className="mt-3 flex items-center gap-7 overflow-x-auto"
            style={{ borderBottom: `1px solid ${BORDER}` }}
          >
            {TABS.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className="relative whitespace-nowrap pb-2 pt-0.5 text-[13.5px] transition-colors"
                  style={{ color: active ? TEXT : MUTED }}
                >
                  {t}
                  {active && (
                    <span
                      className="absolute inset-x-0 -bottom-px h-[2px] rounded-full"
                      style={{ background: `linear-gradient(90deg, ${GOLD_SOFT}, ${GOLD})` }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── content ──────────────────────────── */}
          {tab !== "Overview" ? (
            <section
              className="mt-4 rounded-[13px] p-8 text-center"
              style={{ backgroundColor: CARD, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
            >
              <h3 className="text-[17px]" style={{ color: TEXT, fontFamily: SERIF }}>
                {tab}
              </h3>
              <p className="mt-1.5 text-[13px]" style={{ color: MUTED }}>
                {tab} for {booking.reference} will appear here.
              </p>
            </section>
          ) : (
            <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_340px]">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {/* STAY */}
                {panel === "stay" ? (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <PanelShell
                      title="Adjust stay"
                      saved={savedPanel === "stay"}
                      dirty={Boolean(dirty.stay)}
                      onCancel={() => closePanel("stay")}
                      onSave={() => savePanel("stay")}
                      saveLabel={stayMajor ? "Request change" : "Save changes"}
                    >
                      <div className="grid gap-4 sm:grid-cols-3">
                        <Field label="Arrival">
                          <input
                            type="date"
                            value={stay.arrival}
                            onChange={(e) => {
                              setStay({ ...stay, arrival: e.target.value });
                              markDirty("stay");
                            }}
                            className="w-full rounded-[8px] px-3 py-2 text-[13.5px] outline-none"
                            style={inputStyle}
                          />
                        </Field>
                        <Field label="Departure">
                          <input
                            type="date"
                            value={stay.departure}
                            onChange={(e) => {
                              setStay({ ...stay, departure: e.target.value });
                              markDirty("stay");
                            }}
                            className="w-full rounded-[8px] px-3 py-2 text-[13.5px] outline-none"
                            style={inputStyle}
                          />
                        </Field>
                        <Field label="Location">
                          <input
                            value={stay.location}
                            onChange={(e) => {
                              setStay({ ...stay, location: e.target.value });
                              markDirty("stay");
                            }}
                            className="w-full rounded-[8px] px-3 py-2 text-[13.5px] outline-none"
                            style={inputStyle}
                          />
                        </Field>
                      </div>
                      <p className="mt-3 text-[12.5px]" style={{ color: TEXT_2 }}>
                        <span style={{ color: GOLD_SOFT }}>{nights}</span> nights
                        {stayMajor && (
                          <span style={{ color: MUTED }}>
                            {"  •  "}Date changes on a confirmed booking are handled as a change request.
                          </span>
                        )}
                      </p>
                    </PanelShell>
                  </div>
                ) : (
                  <OverviewCard
                    icon={<MapPin size={16} />}
                    title="Stay"
                    action="Adjust stay"
                    onAction={() => setPanel("stay")}
                    dimmed={dim("stay")}
                  >
                    <p style={{ color: TEXT }}>{stay.location}</p>
                    <p className="mt-1.5">
                      {new Date(stay.arrival).toLocaleDateString("en-GB", { day: "numeric", month: "long" })} –{" "}
                      {new Date(stay.departure).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-1">{nights} nights</p>
                  </OverviewCard>
                )}

                {/* HOTEL */}
                <OverviewCard
                  icon={<Building2 size={16} />}
                  title="Hotel"
                  action={confirmed ? "Hotel details" : "Change hotel"}
                  onAction={() => {}}
                  dimmed={dim("hotel" as PanelKey)}
                >
                  <p style={{ color: TEXT }}>{booking.hotel}</p>
                  <p className="mt-1.5">4-star hotel</p>
                  <p className="mt-3 pt-3 text-[12px]" style={{ borderTop: `1px solid ${BORDER}`, color: MUTED }}>
                    Hotel Reference
                  </p>
                  <p className="mt-0.5">{hotelRef || "—"}</p>
                </OverviewCard>

                {/* ROOMS */}
                {panel === "rooms" ? (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <PanelShell
                      title="Room distribution"
                      saved={savedPanel === "rooms"}
                      dirty={Boolean(dirty.rooms)}
                      onCancel={() => closePanel("rooms")}
                      onSave={() => savePanel("rooms")}
                      saveLabel={confirmed && roomsMajor ? "Request change" : "Save changes"}
                    >
                      <ul className="space-y-2.5">
                        {rooms.map((r, i) => (
                          <li
                            key={r.type}
                            className="flex items-center justify-between gap-4 rounded-[9px] px-3.5 py-2.5"
                            style={{ backgroundColor: "rgba(12,30,42,0.34)", border: `1px solid ${BORDER}` }}
                          >
                            <div className="min-w-0">
                              <p className="text-[13.5px]" style={{ color: TEXT }}>
                                {r.type}
                              </p>
                              <p className="text-[12px]" style={{ color: MUTED }}>
                                {r.note}
                              </p>
                            </div>
                            <Stepper
                              value={r.qty}
                              onChange={(n) => {
                                setRooms(rooms.map((x, j) => (j === i ? { ...x, qty: n } : x)));
                                markDirty("rooms");
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                      <div
                        className="mt-3.5 flex items-center justify-between pt-3 text-[13px]"
                        style={{ borderTop: `1px solid ${BORDER}`, color: TEXT }}
                      >
                        <span>{totalRooms} rooms</span>
                        <span>{totalGuests} guests</span>
                      </div>
                    </PanelShell>
                  </div>
                ) : (
                  <OverviewCard
                    icon={<Bed size={16} />}
                    title="Rooms"
                    badge={confirmed ? "Confirmed" : undefined}
                    action="Manage rooms"
                    onAction={() => setPanel("rooms")}
                    dimmed={dim("rooms")}
                  >
                    {rooms.map((r) => (
                      <p key={r.type} className="mt-1 first:mt-0">
                        {r.qty} {r.type}
                      </p>
                    ))}
                    <p
                      className="mt-3 pt-3 text-[12.5px]"
                      style={{ borderTop: `1px solid ${BORDER}`, color: TEXT }}
                    >
                      {totalRooms} rooms  •  {totalGuests} guests
                    </p>
                  </OverviewCard>
                )}

                {/* DINING */}
                {panel === "dining" ? (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <PanelShell
                      title="Dining arrangements"
                      saved={savedPanel === "dining"}
                      dirty={Boolean(dirty.dining)}
                      onCancel={() => closePanel("dining")}
                      onSave={() => savePanel("dining")}
                      saveLabel="Save changes"
                    >
                      <div className="flex flex-wrap gap-2.5">
                        {(
                          [
                            ["breakfast", "Breakfast included"],
                            ["groupDinner", "Group dinner"],
                          ] as const
                        ).map(([key, label]) => {
                          const on = dining[key];
                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                setDining({ ...dining, [key]: !on });
                                markDirty("dining");
                              }}
                              className="inline-flex items-center gap-2 rounded-[8px] px-3 py-2 text-[12.5px] transition-all duration-200"
                              style={{
                                color: on ? TEXT : MUTED,
                                border: `1px solid ${on ? "rgba(199,163,74,0.4)" : BORDER}`,
                                backgroundColor: on ? "rgba(199,163,74,0.08)" : "rgba(12,30,42,0.34)",
                              }}
                            >
                              {on && <Check size={13} style={{ color: GOLD }} />}
                              {label}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-3">
                        <Field label="Dinner date">
                          <input
                            type="date"
                            value={dining.date}
                            onChange={(e) => {
                              setDining({ ...dining, date: e.target.value });
                              markDirty("dining");
                            }}
                            className="w-full rounded-[8px] px-3 py-2 text-[13.5px] outline-none"
                            style={inputStyle}
                          />
                        </Field>
                        <Field label="Time">
                          <input
                            type="time"
                            value={dining.time}
                            onChange={(e) => {
                              setDining({ ...dining, time: e.target.value });
                              markDirty("dining");
                            }}
                            className="w-full rounded-[8px] px-3 py-2 text-[13.5px] outline-none"
                            style={inputStyle}
                          />
                        </Field>
                        <Field label="Guests">
                          <input
                            type="number"
                            value={dining.guests}
                            onChange={(e) => {
                              setDining({ ...dining, guests: Math.max(0, Number(e.target.value) || 0) });
                              markDirty("dining");
                            }}
                            className="w-full rounded-[8px] px-3 py-2 text-[13.5px] outline-none"
                            style={inputStyle}
                          />
                        </Field>
                      </div>
                      <div className="mt-4">
                        <Field label="Meal arrangement">
                          <textarea
                            rows={2}
                            value={dining.details}
                            onChange={(e) => {
                              setDining({ ...dining, details: e.target.value });
                              markDirty("dining");
                            }}
                            className="w-full resize-none rounded-[8px] px-3 py-2 text-[13.5px] outline-none"
                            style={inputStyle}
                          />
                        </Field>
                      </div>
                    </PanelShell>
                  </div>
                ) : (
                  <OverviewCard
                    icon={<UtensilsCrossed size={16} />}
                    title="Dining"
                    action="Manage dining"
                    onAction={() => setPanel("dining")}
                    dimmed={dim("dining")}
                  >
                    <p style={{ color: TEXT }}>
                      {dining.breakfast ? "Breakfast included" : "No breakfast"}
                    </p>
                    {dining.groupDinner && (
                      <>
                        <p className="mt-3.5 text-[11.5px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                          Group dinner
                        </p>
                        <p className="mt-1">
                          {new Date(dining.date).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}
                          {"  •  "}
                          {dining.guests} guests
                        </p>
                      </>
                    )}
                  </OverviewCard>
                )}

                {/* SERVICES */}
                {panel === "services" ? (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <PanelShell
                      title="Services"
                      saved={savedPanel === "services"}
                      dirty={Boolean(dirty.services)}
                      onCancel={() => closePanel("services")}
                      onSave={() => savePanel("services")}
                      saveLabel="Save changes"
                    >
                      <ul className="space-y-2.5">
                        {services.map((s, i) => (
                          <li
                            key={`${s.name}-${i}`}
                            className="flex items-center gap-3 rounded-[9px] px-3.5 py-2.5"
                            style={{ backgroundColor: "rgba(12,30,42,0.34)", border: `1px solid ${BORDER}` }}
                          >
                            <input
                              value={s.name}
                              onChange={(e) => {
                                setServices(services.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)));
                                markDirty("services");
                              }}
                              className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none"
                              style={{ color: TEXT }}
                            />
                            <input
                              value={s.detail}
                              onChange={(e) => {
                                setServices(services.map((x, j) => (j === i ? { ...x, detail: e.target.value } : x)));
                                markDirty("services");
                              }}
                              className="w-[150px] shrink-0 bg-transparent text-right text-[12.5px] outline-none"
                              style={{ color: MUTED }}
                            />
                            <button
                              type="button"
                              aria-label={`Remove ${s.name}`}
                              onClick={() => {
                                setServices(services.filter((_, j) => j !== i));
                                markDirty("services");
                              }}
                              className="shrink-0 transition-opacity hover:opacity-80"
                              style={{ color: MUTED }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => {
                          setServices([...services, { name: "New service", detail: "" }]);
                          markDirty("services");
                        }}
                        className="mt-3 inline-flex items-center gap-2 text-[12.5px]"
                        style={{ color: GOLD_SOFT }}
                      >
                        <Plus size={14} /> Add service
                      </button>
                    </PanelShell>
                  </div>
                ) : (
                  <OverviewCard
                    icon={<ConciergeBell size={16} />}
                    title="Services"
                    action="Manage services"
                    onAction={() => setPanel("services")}
                    dimmed={dim("services")}
                  >
                    {services.slice(0, 2).map((s) => (
                      <p key={s.name} className="mt-1 first:mt-0" style={{ color: TEXT }}>
                        {s.name}
                      </p>
                    ))}
                    {services.length > 2 && (
                      <p className="mt-3 text-[12.5px]" style={{ color: MUTED }}>
                        + {services.length - 2} more services
                      </p>
                    )}
                  </OverviewCard>
                )}

                {/* SPECIAL REQUESTS */}
                {panel === "requests" ? (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <PanelShell
                      title="Special requests"
                      saved={savedPanel === "requests"}
                      dirty={Boolean(dirty.requests)}
                      onCancel={() => closePanel("requests")}
                      onSave={() => savePanel("requests")}
                      saveLabel="Save changes"
                    >
                      <ul className="space-y-2.5">
                        {requests.map((r, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <textarea
                              rows={2}
                              value={r}
                              onChange={(e) => {
                                setRequests(requests.map((x, j) => (j === i ? e.target.value : x)));
                                markDirty("requests");
                              }}
                              className="min-w-0 flex-1 resize-none rounded-[8px] px-3 py-2 text-[13.5px] outline-none"
                              style={inputStyle}
                            />
                            <button
                              type="button"
                              aria-label="Remove request"
                              onClick={() => {
                                setRequests(requests.filter((_, j) => j !== i));
                                markDirty("requests");
                              }}
                              className="mt-2 shrink-0 transition-opacity hover:opacity-80"
                              style={{ color: MUTED }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => {
                          setRequests([...requests, ""]);
                          markDirty("requests");
                        }}
                        className="mt-3 inline-flex items-center gap-2 text-[12.5px]"
                        style={{ color: GOLD_SOFT }}
                      >
                        <Plus size={14} /> Add another request
                      </button>
                    </PanelShell>
                  </div>
                ) : (
                  <OverviewCard
                    icon={<Star size={16} />}
                    title="Special Requests"
                    action="Update requests"
                    onAction={() => setPanel("requests")}
                    dimmed={dim("requests")}
                  >
                    {requests.length ? (
                      requests.map((r, i) => (
                        <p key={i} className="mt-1.5 first:mt-0" style={{ color: TEXT }}>
                          {r}
                        </p>
                      ))
                    ) : (
                      <p style={{ color: MUTED }}>No special requests yet.</p>
                    )}
                  </OverviewCard>
                )}
              </div>

              {/* ── right rail ─────────────────────── */}
              <aside className="grid content-start gap-4">
                <section
                  className="rounded-[13px] p-4"
                  style={{
                    backgroundColor: ACTION_PANEL,
                    border: `1px solid rgba(199,163,74,0.18)`,
                    boxShadow: CARD_SHADOW,
                  }}
                >
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: TEXT }}>
                    Preparing your stay
                  </h3>
                  <div className="mt-3 flex items-center gap-3.5">
                    <Ring value={progress} size={58} />
                    <div
                      className="h-[5px] flex-1 overflow-hidden rounded-full"
                      style={{ backgroundColor: "rgba(255,255,255,0.09)" }}
                    >
                      <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: GOLD }} />
                    </div>
                  </div>
                  <ul className="mt-3.5 space-y-2.5 text-[13px]">
                    {["Hotel confirmed", "Contract signed"].map((l) => (
                      <li key={l} className="flex items-center justify-between">
                        <span style={{ color: TEXT_2 }}>{l}</span>
                        <span
                          className="grid h-[18px] w-[18px] place-items-center rounded-full"
                          style={{ backgroundColor: "rgba(141,168,138,0.18)", color: GREEN }}
                        >
                          <Check size={12} />
                        </span>
                      </li>
                    ))}
                    <li className="flex items-center justify-between">
                      <span style={{ color: TEXT_2 }}>Rooming List</span>
                      <span style={{ color: GOLD_SOFT }}>
                        {rooming ? `${rooming.complete} / ${rooming.total}` : "42 / 58"}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span style={{ color: TEXT_2 }}>Final details</span>
                      <span style={{ color: MUTED }}>—</span>
                    </li>
                  </ul>
                </section>

                <section
                  className="rounded-[13px] p-4"
                  style={{ backgroundColor: CARD, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
                >
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: TEXT }}>
                    Upcoming
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {[
                      { d: "04", m: "Sep", t: "Rooming List", s: "Due in 6 days" },
                      { d: "08", m: "Sep", t: "Final guest details", s: "Due in 10 days" },
                    ].map((it) => (
                      <li
                        key={it.t}
                        className="flex items-center gap-3 rounded-[8px] px-2.5 py-2"
                        style={{ backgroundColor: "rgba(12,30,42,0.35)" }}
                      >
                        <span className="grid w-[34px] shrink-0 text-center">
                          <span className="text-[15px] font-medium leading-none" style={{ color: TEXT }}>
                            {it.d}
                          </span>
                          <span className="mt-0.5 text-[9.5px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                            {it.m}
                          </span>
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px]" style={{ color: TEXT }}>
                            {it.t}
                          </span>
                          <span className="block truncate text-[11.5px]" style={{ color: MUTED }}>
                            {it.s}
                          </span>
                        </span>
                        <ChevronRight size={16} style={{ color: MUTED }} />
                      </li>
                    ))}
                  </ul>
                </section>

                <section
                  className="rounded-[13px] p-4"
                  style={{ backgroundColor: CARD, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
                >
                  <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: TEXT }}>
                    Need help?
                  </h3>
                  <p className="mt-1.5 text-[12.5px]" style={{ color: TEXT_2 }}>
                    Our team is here for you.
                  </p>
                  <div className="mt-2.5">
                    <GoldAction label="Contact Support" />
                  </div>
                </section>
              </aside>
            </div>
          )}

          {/* ── bottom change request ────────────── */}
          {tab === "Overview" && (
            <section
              className="mt-4 flex flex-col gap-3 rounded-[13px] px-4 py-3.5 sm:flex-row sm:items-center"
              style={{ backgroundColor: "rgba(12,30,42,0.28)", border: `1px solid ${BORDER}` }}
            >
              <span
                className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full"
                style={{ border: `1px solid rgba(199,163,74,0.22)`, color: GOLD_SOFT }}
              >
                <MessageSquare size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px]" style={{ color: TEXT }}>
                  Need to make a big change?
                </p>
                <p className="mt-0.5 text-[12.5px]" style={{ color: MUTED }}>
                  If you need to change dates, hotel or group size significantly, please send us a request.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-2 rounded-[6px] px-4 py-[9px] text-[12.5px] font-medium transition-colors hover:bg-[rgba(199,163,74,0.10)]"
                style={{ color: GOLD_SOFT, border: `1px solid ${GOLD_DEEP}` }}
              >
                Request a change
                <span aria-hidden>→</span>
              </button>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
