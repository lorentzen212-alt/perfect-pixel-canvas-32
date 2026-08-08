import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { roomingQueryOptions } from "./rooming-list.$bookingId";
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  Bed,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardList,
  Copy,
  CreditCard,
  Download,
  FileSpreadsheet,
  FileText,
  Home,
  Info,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Star,
  StickyNote,
  Trash2,
  Upload,
  UserCheck,
  Users,
  UtensilsCrossed,
  ConciergeBell,
  X,
} from "lucide-react";
import { BookingWorkspaceHeader, type WorkspaceTab } from "@/components/BookingWorkspaceHeader";
import { BookingDocumentsView } from "@/components/BookingDocuments";
import { BookingMessagesView } from "@/components/BookingMessages";
import { BookingNotesView } from "@/components/BookingNotes";
import { PAL, SERIF, TopBar } from "@/components/DashboardChrome";
import { GlobalSidebar } from "@/components/GlobalSidebar";
import { roomingProgress, type Booking } from "@/lib/bookings";
import { distributionFor, statsOf } from "@/lib/rooming";
import { useAuth } from "@/lib/auth";
import { fetchBooking, fetchRoomDistribution } from "@/lib/bookingsApi";
import { loadRoomingListFromDb } from "@/lib/roomingApi";

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

type PanelKey = "stay" | "rooms" | "dining" | "services" | "requests" | null;

export type RoomLineUI = { type: string; note: string; qty: number; perRoom: number };

/** Baseline (currently booked) room distribution — the "Current" column on Changes. */
const BASE_ROOMS: RoomLineUI[] = [
  { type: "Twin Rooms", note: "Two separate beds", qty: 17, perRoom: 2 },
  { type: "Single Rooms", note: "One guest", qty: 8, perRoom: 1 },
  { type: "Triple Rooms", note: "Three guests", qty: 7, perRoom: 3 },
];


/* ───────────────────────── primitives ───────────────────────── */

/* metallic gold ramp – used sparingly for decorative accents */
const GOLD_HI = "#F3D987";
const GOLD_MET = "#D4AF37";
const GOLD_MET_MID = "#C5962D";
const GOLD_MET_LOW = "#A97816";
const GOLD_CALM = "#CBAE6B";

/* shared navy material — matches the Rooming List Workspace anodized panels */
const NAVY_TEXTURE =
  "radial-gradient(1100px 420px at 18% -10%, rgba(255,255,255,0.045), transparent 62%), radial-gradient(700px 360px at 88% 108%, rgba(120,160,195,0.05), transparent 60%)";
const NAVY_PANEL = `${NAVY_TEXTURE}, linear-gradient(180deg, #24445E 0%, #203D55 55%, #1C374D 100%)`;
const NAVY_INNER =
  "inset 0 1px 0 rgba(255,255,255,0.03), inset 0 -1px 0 rgba(0,0,0,0.12), inset 0 8px 22px -18px rgba(0,0,0,0.35), 0 0 0 1px rgba(8,18,28,0.25)";
const NAVY_BORDER = "rgba(255,255,255,0.06)";

function GoldAction({
  label,
  onClick,
  bright,
}: {
  label: string;
  onClick?: () => void;
  bright?: boolean;
}) {
  const [self, setSelf] = useState(false);
  const lit = Boolean(bright) || self;
  return (
    <span className="inline-grid">
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => setSelf(true)}
        onMouseLeave={() => setSelf(false)}
        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium"
        style={{
          color: lit ? GOLD_SOFT : GOLD_CALM,
          opacity: lit ? 1 : 0.86,
          transition: "color 180ms ease-out, opacity 180ms ease-out",
        }}
      >
        {label}
        <span
          aria-hidden
          className="text-[13px] leading-none"
          style={{
            transform: lit ? "translateX(3px)" : "none",
            transition: "transform 180ms ease-out",
          }}
        >
          →
        </span>
      </button>
      <span
        aria-hidden
        className="mt-[3px] h-px origin-left rounded-full"
        style={{
          width: 26,
          background: `linear-gradient(90deg, ${GOLD_MET_LOW}, ${GOLD_HI}, ${GOLD_MET_MID})`,
          transform: lit ? "scaleX(1)" : "scaleX(0)",
          opacity: lit ? 0.75 : 0,
          transition: "transform 260ms ease-out, opacity 200ms ease-out",
        }}
      />
    </span>
  );
}







function Ring({ value, size = 78 }: { value: number; size?: number }) {
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  const gid = `ringGold-${size}`;
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ height: size, width: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" style={{ height: size, width: size }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={GOLD_HI} />
            <stop offset="45%" stopColor={GOLD_MET} />
            <stop offset="75%" stopColor={GOLD_MET_MID} />
            <stop offset="100%" stopColor={GOLD_MET_LOW} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="3" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${gid})`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * c} ${c}`}
        />
      </svg>
      <span
        className="absolute text-[15px] font-medium tracking-[0.01em]"
        style={{ color: TEXT }}
      >
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
        background: NAVY_PANEL,
        border: `1px solid ${NAVY_BORDER}`,
        boxShadow: `${NAVY_INNER}, 0 14px 34px -26px rgba(9,20,29,0.45)`,
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
      style={{ border: `1px solid ${NAVY_BORDER}`, background: `${NAVY_TEXTURE}, linear-gradient(180deg, #264B66 0%, #203D55 100%)` }}
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
  background: `${NAVY_TEXTURE}, linear-gradient(180deg, #264B66 0%, #203D55 100%)`,
  border: `1px solid ${NAVY_BORDER}`,
  color: TEXT,
};

/* ───────────────────────── page ───────────────────────── */

function BookingWorkspace() {
  const { bookingId } = Route.useParams();
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !session) {
      navigate({ to: "/auth", search: { next: `/bookings/${bookingId}` }, replace: true });
    }
  }, [authLoading, session, bookingId, navigate]);

  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => fetchBooking(bookingId),
    enabled: Boolean(session),
  });

  /* warm the rooming list route + its data so navigating there feels instant */
  const queryClient = useQueryClient();
  const router = useRouter();
  useEffect(() => {
    if (!booking) return;
    void router.preloadRoute({ to: "/rooming/$bookingId", params: { bookingId } });
    void queryClient
      .prefetchQuery(roomingQueryOptions(bookingId, booking.rooms))
      .catch(() => {});
  }, [booking, bookingId, queryClient, router]);


  if (isLoading || authLoading || !session) {
    return (
      <div className="grid min-h-screen place-items-center" style={{ backgroundColor: PAL.BG, color: PAL.MUTED }}>
        <p className="text-[13.5px]">Loading booking…</p>
      </div>
    );
  }
  if (!booking) throw notFound();
  return <Workspace booking={booking} />;
}

function Workspace({ booking }: { booking: Booking }) {
  const navigate = useNavigate();
  const { session, profile, signOut } = useAuth();
  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim() || profile.email
    : (session?.user.email ?? "");
  const initials =
    (profile?.first_name?.[0] ?? displayName[0] ?? "").toUpperCase() +
    (profile?.last_name?.[0] ?? "").toUpperCase();
  const [navOpen, setNavOpen] = useState(false);
  const [tab, setTab] = useState<WorkspaceTab>("Overview");
  /* rooming progress is derived from the live rooming list, never hardcoded */
  const [roomingStats, setRoomingStats] = useState<{ filled: number; total: number; percent: number } | null>(null);
  useEffect(() => {
    let active = true;
    (async () => {
      const dist = await fetchRoomDistribution(booking.id);
      const list = await loadRoomingListFromDb(
        booking.id,
        Object.keys(dist).length ? (dist as never) : distributionFor(booking.id, booking.rooms ?? 12),
      );
      if (!active) return;
      const s = statsOf(list);
      setRoomingStats({ filled: s.filled, total: s.totalSlots, percent: s.percent });
    })().catch(() => {});
    return () => {
      active = false;
    };
  }, [booking.id, booking.rooms]);

  const progress = roomingStats?.percent ?? roomingProgress(booking);
  const rooming = booking.rooming;
  const confirmed = booking.status === "confirmed" || booking.status === "upcoming";

  const [panel, setPanel] = useState<PanelKey>(null);
  const [savedPanel, setSavedPanel] = useState<PanelKey>(null);

  /* top-card editable state */
  const [hotelRef] = useState(booking.hotelReference ?? "");

  const [copied, setCopied] = useState(false);

  /* domain state (kept live across panels) */
  const [rooms, setRooms] = useState<RoomLineUI[]>(BASE_ROOMS);

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

  const panelTitles: Record<string, string> = {
    stay: "Stay dates",
    rooms: "Room distribution",
    dining: "Dining arrangements",
    services: "Services",
    requests: "Special requests",
  };

  const fmtDate = (d: string, opts: Intl.DateTimeFormatOptions) => {
    const t = new Date(d);
    return Number.isNaN(t.getTime()) ? "—" : t.toLocaleDateString("en-GB", opts);
  };
  const dateShort = (d: string) => fmtDate(d, { day: "numeric", month: "short" });
  const nightsLabel = Number.isFinite(nights) && nights > 0 ? `${nights} nights` : "Dates to confirm";

  const editor = panel && (
    <PanelShell
      title={panelTitles[panel]}
      saved={savedPanel === panel}
      dirty={Boolean(dirty[panel])}
      onCancel={() => closePanel(panel)}
      onSave={() => savePanel(panel)}
      saveLabel={
        panel === "stay" && stayMajor
          ? "Request change"
          : panel === "rooms" && confirmed && roomsMajor
            ? "Request change"
            : "Save changes"
      }
    >
      {panel === "stay" && (
        <>
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
        </>
      )}

      {panel === "rooms" && (
        <>
          <ul className="space-y-2.5">
            {rooms.map((r, i) => (
              <li
                key={r.type}
                className="flex items-center justify-between gap-4 rounded-[9px] px-3.5 py-2.5"
                style={{ background: `${NAVY_TEXTURE}, linear-gradient(180deg, #264B66 0%, #203D55 100%)`, border: `1px solid ${NAVY_BORDER}` }}
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
        </>
      )}

      {panel === "dining" && (
        <>
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
                    border: `1px solid ${on ? "rgba(199,163,74,0.4)" : NAVY_BORDER}`,
                    background: on ? "rgba(199,163,74,0.08)" : `${NAVY_TEXTURE}, linear-gradient(180deg, #264B66 0%, #203D55 100%)`,
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
        </>
      )}

      {panel === "services" && (
        <>
          <ul className="space-y-2.5">
            {services.map((s, i) => (
              <li
                key={`${s.name}-${i}`}
                className="flex items-center gap-3 rounded-[9px] px-3.5 py-2.5"
                style={{ background: `${NAVY_TEXTURE}, linear-gradient(180deg, #264B66 0%, #203D55 100%)`, border: `1px solid ${NAVY_BORDER}` }}
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
        </>
      )}

      {panel === "requests" && (
        <>
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
            <Plus size={14} /> Add request
          </button>
        </>
      )}
    </PanelShell>
  );

  const arrivalMs = new Date(stay.arrival).getTime();
  const arrivalDays = Number.isNaN(arrivalMs)
    ? null
    : Math.max(0, Math.ceil((arrivalMs - Date.now()) / 86400000));

  const ledger: {
    key: Exclude<PanelKey, null>;
    icon: React.ReactNode;
    label: string;
    lead: string;
    detail: string;
    action: string;
  }[] = [
    {
      key: "stay",
      icon: <MapPin size={15} />,
      label: "Stay",
      lead: Number.isNaN(new Date(stay.arrival).getTime())
        ? "Dates to confirm"
        : `${fmtDate(stay.arrival, { day: "numeric", month: "long" })} – ${fmtDate(stay.departure, { day: "numeric", month: "long", year: "numeric" })}`,
      detail: `${stay.location} · ${nightsLabel}`,
      action: "Adjust",
    },
    {
      key: "rooms",
      icon: <Bed size={15} />,
      label: "Rooms",
      lead: `${totalRooms} rooms · ${totalGuests} guests`,
      detail: rooms.map((r) => `${r.qty} × ${r.type}`).join("  ·  "),
      action: "Manage",
    },
    {
      key: "dining",
      icon: <UtensilsCrossed size={15} />,
      label: "Dining",
      lead: dining.breakfast ? "Breakfast included" : "Room only",
      detail: dining.groupDinner
        ? `Group dinner · ${fmtDate(dining.date, { day: "numeric", month: "long" })} · ${dining.time} · ${dining.guests} guests`
        : "No group dinner planned",
      action: "Manage",
    },
    {
      key: "services",
      icon: <ConciergeBell size={15} />,
      label: "Services",
      lead: services.length ? `${services.length} arranged` : "None yet",
      detail: services.map((s) => s.name).join("  ·  ") || "Add porter service, transfers, amenities",
      action: "Manage",
    },
    {
      key: "requests",
      icon: <Star size={15} />,
      label: "Special requests",
      lead: requests.length ? `${requests.length} noted` : "None yet",
      detail: requests.filter(Boolean).join("  ·  ") || "Tell the hotel anything that matters",
      action: "Update",
    },
  ];

  const journey = [
    { label: "Request sent", sub: "28 Jul", state: "done" as const },
    { label: "Hotel confirmed", sub: "29 Jul", state: "done" as const },
    { label: "Deposit received", sub: "29 Jul", state: "done" as const },
    { label: "Rooming list", sub: "Due in 6 days", state: "active" as const },
    { label: "Final confirmation", sub: "Due in 10 days", state: "todo" as const },
    { label: "Arrival", sub: dateShort(stay.arrival), state: "todo" as const },
  ];

  const strip: { icon: React.ReactNode; lead: string; sub: string }[] = [
    {
      icon: <CalendarDays size={17} />,
      lead: `${dateShort(stay.arrival)} – ${fmtDate(stay.departure, { day: "numeric", month: "short", year: "numeric" })}`,
      sub: nightsLabel,
    },
    { icon: <Bed size={17} />, lead: `${totalRooms} rooms`, sub: `${totalGuests} guests` },
    {
      icon: <CreditCard size={17} />,
      lead: confirmed ? "Deposit paid" : "Deposit pending",
      sub: "Payment status",
    },
    { icon: <Star size={17} />, lead: `${services.length} services`, sub: "Added" },
    {
      icon: <UserCheck size={17} />,
      lead: confirmed ? "Confirmed" : "In progress",
      sub: "Booking status",
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG_ALT }}>
      <style>{`@keyframes hgbPanelIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}`}</style>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] lg:block">
        <GlobalSidebar
          active="My Bookings"
          roomingBookingId={booking.id}
          displayName={displayName}
          initials={initials}
          email={session?.user.email ?? ""}
          onSignOut={() => void signOut()}
        />
      </aside>

      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[268px]">
            <GlobalSidebar
              active="My Bookings"
              roomingBookingId={booking.id}
              displayName={displayName}
              initials={initials}
              email={session?.user.email ?? ""}
              onSignOut={() => void signOut()}
            />
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

      <div className="lg:pl-[240px]">
        <TopBar
          onOpenNav={() => setNavOpen(true)}
          left={
            <Link
              to="/manage-bookings"
              className="inline-flex items-center gap-2 text-[13px] transition-opacity hover:opacity-80"
              style={{ color: TEXT_2 }}
            >
              <ArrowLeft size={15} />
              Back to Dashboard
            </Link>
          }
        />

        {/* ══ 1 · persistent workspace header (hero + folder tabs) ══ */}
        <BookingWorkspaceHeader
          bookingId={booking.id}
          bookingName={booking.name}
          image={booking.image}
          destination={booking.destination}
          reference={booking.reference}
          initials={initials}
          active={tab as WorkspaceTab}
          onSelect={(t) => setTab(t)}
        />


        {/* ══ 2 · large light workspace plate ══ */}
        <div
          className="relative min-h-[80vh] rounded-tl-[22px] px-5 pb-14 pt-0 sm:px-9"
          style={{ backgroundColor: PLATE }}
        >
          {/* ══ 3 · information strip ══ */}
          <div className="flex flex-wrap items-center gap-y-5 py-6">
            {strip.map((s, i) => (
              <div
                key={s.lead + i}
                className="flex min-w-[190px] flex-1 items-center gap-3 px-4 first:pl-0"
                style={i > 0 ? { borderLeft: "1px solid rgba(255,255,255,0.13)" } : undefined}
              >
                <span className="shrink-0" style={{ color: GOLD_MET_MID }}>
                  {s.icon}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-semibold" style={{ color: "#FFFFFF" }}>
                    {s.lead}
                  </span>
                  <span className="block truncate text-[12px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                    {s.sub}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div key={tab} className="hgb-ws-panel">
          {tab === "Changes" ? (
            <ChangesView
              rooms={rooms}
              baseRooms={BASE_ROOMS}
              onRoomsChange={(next) => {
                setRooms(next);
                markDirty("rooms");
              }}
              panel={panel}
              onPanel={(k) => setPanel((cur) => (cur === k ? null : k))}
              editor={editor}
            />
          ) : tab === "Documents" ? (
            <BookingDocumentsView reference={booking.reference} />
          ) : tab === "Messages" ? (
            <BookingMessagesView
              bookingId={booking.id}
              reference={booking.reference}
              bookingName={booking.name}
              stayDates={`${dateShort(stay.arrival)} – ${fmtDate(stay.departure, { day: "numeric", month: "short", year: "numeric" })}`}
            />
          ) : tab === "Notes" ? (
            <BookingNotesView reference={booking.reference} bookingName={booking.name} />
          ) : tab !== "Overview" ? (
            <section
              className="rounded-[16px] px-8 py-16 text-center"
              style={{ background: INK, border: `1px solid ${NAVY_BORDER}` }}
            >
              <h3 className="text-[24px]" style={{ color: TEXT, fontFamily: SERIF }}>
                {tab}
              </h3>
              <p className="mt-2 text-[13px]" style={{ color: MUTED }}>
                {tab} for {booking.reference} will appear here.
              </p>
            </section>


          ) : (
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_378px]">
              {/* ── left column ── */}
              <div className="min-w-0 space-y-4">
                {/* Booking journey */}
                <InkCard title="Booking journey">
                  <ol className="mt-6 flex items-start justify-between gap-1">
                    {journey.map((m, i) => (
                      <li key={m.label} className="relative flex min-w-0 flex-1 flex-col items-center text-center">
                        {i < journey.length - 1 && (
                          <span
                            aria-hidden
                            className="absolute top-[15px] h-px"
                            style={{
                              left: "calc(50% + 20px)",
                              right: "calc(-50% + 20px)",
                              background:
                                m.state === "done"
                                  ? "rgba(141,168,138,0.5)"
                                  : m.state === "active"
                                    ? `linear-gradient(90deg, ${GOLD_MET_MID}, rgba(255,255,255,0.1))`
                                    : "rgba(255,255,255,0.1)",
                            }}
                          />
                        )}
                        <span
                          className="relative grid h-[31px] w-[31px] shrink-0 place-items-center rounded-full text-[12px] font-semibold"
                          style={
                            m.state === "done"
                              ? { backgroundColor: "#2E7D52", color: "#EAF6EE" }
                              : m.state === "active"
                                ? {
                                    background: `linear-gradient(180deg, ${GOLD_HI}, ${GOLD_MET_MID})`,
                                    color: "#241B06",
                                    boxShadow: "0 0 0 4px rgba(212,175,55,0.14)",
                                  }
                                : { border: "1px solid rgba(255,255,255,0.22)", color: "rgba(226,233,239,0.72)" }
                          }
                        >
                          {m.state === "done" ? <Check size={14} /> : i + 1}
                        </span>
                        <span
                          className="mt-3 block max-w-full truncate px-1 text-[12px]"
                          style={{
                            color: m.state === "active" ? "#F3EFE6" : "rgba(226,233,239,0.82)",
                            fontWeight: m.state === "active" ? 600 : 400,
                          }}
                        >
                          {m.label}
                        </span>
                        <span
                          className="mt-1 block max-w-full truncate px-1 text-[11px]"
                          style={{ color: m.state === "active" ? GOLD_SOFT : "rgba(146,157,165,0.9)" }}
                        >
                          {m.sub}
                        </span>
                      </li>
                    ))}
                  </ol>
                </InkCard>

                {/* Current action */}
                <InkCard title="Current action">
                  <div
                    className="mt-4 flex flex-col gap-6 rounded-[14px] p-5 sm:flex-row sm:items-center"
                    style={{ background: INK_2, border: `1px solid ${NAVY_BORDER}` }}
                  >
                    <span
                      className="grid h-[104px] w-[104px] shrink-0 place-items-center rounded-full"
                      style={{ border: `1px solid rgba(212,175,55,0.35)`, color: GOLD_MET }}
                    >
                      <ClipboardList size={40} strokeWidth={1.3} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h4
                        className="text-[19px] leading-tight"
                        style={{ color: "#F3F1EB", fontFamily: SERIF, fontWeight: 500 }}
                      >
                        Rooming list
                      </h4>
                      <p className="mt-1 text-[12.5px]" style={{ color: TEXT_2 }}>
                        Name submission deadline
                      </p>
                      <p className="mt-1 text-[17px] font-semibold" style={{ color: GOLD_HI }}>
                        6 days remaining
                      </p>

                      <div className="mt-4 flex items-center gap-5">
                        <div
                          className="h-[6px] min-w-0 flex-1 overflow-hidden rounded-full"
                          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                        >
                          <span
                            className="block h-full rounded-full"
                            style={{
                              width: `${progress}%`,
                              background: `linear-gradient(90deg, ${GOLD_MET_LOW}, ${GOLD_HI} 60%, ${GOLD_MET_MID})`,
                              transition: "width 600ms cubic-bezier(0.22,1,0.36,1)",
                            }}
                          />
                        </div>
                        <Link
                          to="/rooming/$bookingId"
                          params={{ bookingId: booking.id }}
                          className="inline-flex shrink-0 items-center gap-2.5 rounded-full px-6 py-[11px] text-[13.5px] font-semibold transition-transform hover:-translate-y-[1px]"
                          style={{
                            background: `linear-gradient(180deg, ${GOLD_HI}, ${GOLD_MET_MID})`,
                            color: "#241B06",
                          }}
                        >
                          Continue
                          <ArrowRight size={15} />
                        </Link>
                      </div>
                      <p className="mt-2.5 text-[12px]" style={{ color: TEXT_2 }}>
                        {progress}% completed
                        {roomingStats
                          ? ` · ${roomingStats.filled} of ${roomingStats.total} names`
                          : rooming
                            ? ` · ${rooming.complete} of ${rooming.total} names`
                            : ""}
                      </p>
                    </div>
                  </div>
                </InkCard>

                {/* Booking details ledger — existing editors */}
                <InkCard title="Booking details" right={booking.hotel ?? "Hotel to be assigned"}>
                  <ul className="mt-2">
                    {ledger.map((row, i) => {
                      const open = panel === row.key;
                      return (
                        <li
                          key={row.key}
                          style={i > 0 ? { borderTop: "1px solid rgba(255,255,255,0.06)" } : undefined}
                        >
                          <LedgerRow
                            icon={row.icon}
                            label={row.label}
                            lead={row.lead}
                            detail={row.detail}
                            action={row.action}
                            open={open}
                            dimmed={panel !== null && !open}
                            onOpen={() => setPanel(open ? null : row.key)}
                          />
                          {open && <div className="pb-5">{editor}</div>}
                        </li>
                      );
                    })}
                  </ul>
                </InkCard>

                {/* Recent activity */}
                <InkCard
                  title="Recent activity"
                  action={<GoldAction label="View all" onClick={() => setTab("Notes")} />}
                >
                  <ul className="mt-3">
                    {[
                      { icon: <Check size={13} />, tone: GREEN, t: "Hotel approved changes", when: "Today, 09:15" },
                      { icon: <Upload size={13} />, tone: "#7FA7D4", t: "Contract uploaded", when: "Yesterday, 14:22" },
                      {
                        icon: <Download size={13} />,
                        tone: GOLD_SOFT,
                        t: "Rooming list template downloaded",
                        when: "2 Aug, 11:03",
                      },
                      {
                        icon: <MessageSquare size={13} />,
                        tone: TEXT_2,
                        t: "Message from the hotel coordinator",
                        when: "1 Aug, 16:40",
                      },
                    ].map((a, i) => (
                      <li
                        key={a.t}
                        className="flex items-center gap-4 py-3.5"
                        style={i > 0 ? { borderTop: "1px solid rgba(255,255,255,0.05)" } : undefined}
                      >
                        <span
                          className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full"
                          style={{ border: `1px solid ${a.tone}55`, color: a.tone }}
                        >
                          {a.icon}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[13px]" style={{ color: TEXT_2 }}>
                          {a.t}
                        </span>
                        <span className="shrink-0 text-[11.5px]" style={{ color: MUTED }}>
                          {a.when}
                        </span>
                      </li>
                    ))}
                  </ul>
                </InkCard>
              </div>

              {/* ── right column ── */}
              <aside className="min-w-0 space-y-4">
                {/* Rooming list progress */}
                <InkCard title="Rooming list progress">
                  <div className="mt-5 flex items-center gap-6">
                    <Ring value={progress} size={116} />
                    <ul className="min-w-0 flex-1 space-y-3">
                      {[
                        { n: roomingStats?.filled ?? rooming?.complete ?? 0, l: "Completed" },
                        {
                          n: Math.max(
                            0,
                            (roomingStats?.total ?? rooming?.total ?? 0) -
                              (roomingStats?.filled ?? rooming?.complete ?? 0),
                          ),
                          l: "Pending",
                        },
                        { n: 0, l: "Missing" },
                      ].map((x) => (
                        <li key={x.l} className="flex items-center gap-4 text-[13px]">
                          <span className="w-[26px] shrink-0 text-right" style={{ color: TEXT }}>
                            {x.n}
                          </span>
                          <span style={{ color: TEXT_2 }}>{x.l}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    to="/rooming/$bookingId"
                    params={{ bookingId: booking.id }}
                    className="mt-5 flex items-center justify-between gap-3 rounded-[11px] px-4 py-[12px] text-[13.5px] font-medium"
                    style={{
                      border: `1px solid rgba(212,175,55,0.4)`,
                      backgroundColor: "rgba(212,175,55,0.08)",
                      color: GOLD_HI,
                    }}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <Users size={15} />
                      Open rooming list
                    </span>
                    <ArrowRight size={15} />
                  </Link>
                </InkCard>

                {/* Latest documents */}
                <InkCard
                  title="Latest documents"
                  action={<GoldAction label="View all" onClick={() => setTab("Documents")} />}
                >
                  <ul className="mt-3 space-y-2">
                    {[
                      { n: "Contract.pdf", d: "Uploaded yesterday", i: <FileText size={15} />, c: "#D08A7A" },
                      { n: "RoomingList_v2.xlsx", d: "2 Aug 2026", i: <FileSpreadsheet size={15} />, c: "#7FB48F" },
                      { n: "Invoice.pdf", d: "28 Jul 2026", i: <FileText size={15} />, c: "#D08A7A" },
                    ].map((d) => (
                      <li
                        key={d.n}
                        className="flex items-center gap-3 rounded-[11px] px-3.5 py-3"
                        style={{ background: INK_2, border: `1px solid ${NAVY_BORDER}` }}
                      >
                        <span className="shrink-0" style={{ color: d.c }}>
                          {d.i}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px]" style={{ color: TEXT }}>
                            {d.n}
                          </span>
                          <span className="block truncate text-[11.5px]" style={{ color: MUTED }}>
                            {d.d}
                          </span>
                        </span>
                        <button
                          type="button"
                          aria-label={`Download ${d.n}`}
                          className="shrink-0 transition-opacity hover:opacity-80"
                          style={{ color: TEXT_2 }}
                        >
                          <Download size={15} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </InkCard>

                {/* Notes */}
                <InkCard title="Notes" action={<GoldAction label="View all" onClick={() => setTab("Notes")} />}>
                  <div
                    className="mt-3 flex items-start gap-3 rounded-[11px] px-3.5 py-3"
                    style={{ background: INK_2, border: `1px solid ${NAVY_BORDER}` }}
                  >
                    <span className="mt-[2px] shrink-0" style={{ color: GOLD_SOFT }}>
                      <StickyNote size={15} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px]" style={{ color: TEXT }}>
                        Hotel promises
                      </span>
                      <span className="mt-0.5 block text-[12px]" style={{ color: TEXT_2 }}>
                        Early check-in for VIP guests
                      </span>
                      <span className="mt-1 block text-[11.5px]" style={{ color: MUTED }}>
                        2 Aug 2026
                      </span>
                    </span>
                  </div>
                </InkCard>

                {/* Deadlines */}
                <InkCard title="Deadlines">
                  <ul className="mt-2">
                    {[
                      { d: "04", m: "Sep", t: "Rooming list", s: "Due in 6 days", go: "Rooming List" },
                      { d: "08", m: "Sep", t: "Final guest details", s: "Due in 10 days", go: "Changes" },
                    ].map((it, i) => (
                      <li key={it.t}>
                        <button
                          type="button"
                          onClick={() =>
                            it.go === "Rooming List"
                              ? navigate({ to: "/rooming/$bookingId", params: { bookingId: booking.id } })
                              : setTab(it.go as WorkspaceTab)
                          }
                          className="flex w-full items-center gap-3.5 py-3 text-left transition-opacity hover:opacity-90"
                          style={i > 0 ? { borderTop: "1px solid rgba(255,255,255,0.06)" } : undefined}
                        >
                          <span className="grid w-[30px] shrink-0 text-center">
                            <span className="text-[15px] leading-none" style={{ color: TEXT }}>
                              {it.d}
                            </span>
                            <span className="mt-1 text-[9px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                              {it.m}
                            </span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12.5px]" style={{ color: TEXT }}>
                              {it.t}
                            </span>
                            <span className="block truncate text-[11px]" style={{ color: GOLD_SOFT }}>
                              {it.s}
                            </span>
                          </span>
                          <ChevronRight size={15} style={{ color: MUTED }} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex items-center gap-2 text-[11.5px]" style={{ color: MUTED }}>
                    <Info size={13} />
                    Arrival in {arrivalDays ?? "—"} days
                  </div>
                </InkCard>
              </aside>
            </div>
          )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── workspace primitives ───────────────────────── */

const PLATE = "#F5F1EB";
const CARD_BG = "#1A2332";
const CARD_BORDER_SOFT = "rgba(255,255,255,0.08)";
const INK = NAVY_PANEL;
const INK_2 = `${NAVY_TEXTURE}, linear-gradient(180deg, #2A4B64 0%, #26455C 55%, #223F54 100%)`;


function InkCard({
  title,
  right,
  action,
  children,
}: {
  title: string;
  right?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-[16px] p-5 sm:p-6"
      style={{
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER_SOFT}`,
        boxShadow: "0 14px 34px -26px rgba(0,0,0,0.55)",
      }}
    >
      <div className="flex items-baseline justify-between gap-5">
        <h3 className="text-[16px]" style={{ color: "#F3F1EB", fontFamily: SERIF, fontWeight: 500 }}>
          {title}
        </h3>
        {action ?? (right ? <span className="truncate text-[11.5px]" style={{ color: PAL.MUTED }}>{right}</span> : null)}
      </div>
      {children}
    </section>
  );
}

function LedgerRow({
  icon,
  label,
  lead,
  detail,
  action,
  open,
  dimmed,
  onOpen,
}: {
  icon: React.ReactNode;
  label: string;
  lead: string;
  detail: string;
  action: string;
  open: boolean;
  dimmed: boolean;
  onOpen: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="grid w-full grid-cols-[120px_minmax(0,1fr)_auto] items-center gap-5 py-4 text-left"
      style={{ opacity: dimmed ? 0.45 : 1, transition: "opacity 220ms ease" }}
    >
      <span
        className="flex items-center gap-2.5"
        style={{ color: open || hover ? GOLD_SOFT : MUTED, transition: "color 200ms ease" }}
      >
        <span className="shrink-0">{icon}</span>
        <span className="truncate text-[10.5px] font-semibold uppercase tracking-[0.18em]">{label}</span>
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13.5px]" style={{ color: "#F3F1EB" }}>
          {lead}
        </span>
        <span className="mt-0.5 block truncate text-[12px]" style={{ color: "rgba(146,157,165,0.9)" }}>
          {detail}
        </span>
      </span>
      <span
        className="shrink-0 text-[12px]"
        style={{
          color: open ? GOLD_SOFT : GOLD_CALM,
          opacity: open || hover ? 1 : 0.35,
          transition: "opacity 200ms ease, color 200ms ease",
        }}
      >
        {open ? "Close" : action} <span aria-hidden>{open ? "×" : "→"}</span>
      </span>
    </button>
  );
}





/* ───────────────────────── Changes workspace ───────────────────────── */

const STATUS_TONE = {
  submitted: { line: "#6FA8DC", bg: "linear-gradient(180deg, #27506F 0%, #22445F 100%)" },
  review: { line: "#E0B75C", bg: "linear-gradient(180deg, #5B4A21 0%, #4C3D19 100%)" },
  approved: { line: "#7FBE96", bg: "linear-gradient(180deg, #23503C 0%, #1D4433 100%)" },
  declined: { line: "#D98A8A", bg: "linear-gradient(180deg, #59292C 0%, #4B2225 100%)" },
  expired: { line: "rgba(200,211,220,0.72)", bg: INK_2 },
} as const;

const QUICK_ACTIONS: {
  key: Exclude<PanelKey, null>;
  label: string;
  sub: string;
  icon: React.ReactNode;
}[] = [
  { key: "stay", label: "Stay", sub: "Change dates", icon: <CalendarDays size={17} /> },
  { key: "rooms", label: "Rooms", sub: "Add or remove", icon: <Bed size={17} /> },
  { key: "rooms", label: "Guests", sub: "Update details", icon: <Users size={17} /> },
  { key: "dining", label: "Dining", sub: "Meals & preferences", icon: <UtensilsCrossed size={17} /> },
  { key: "services", label: "Services", sub: "Add or adjust", icon: <ConciergeBell size={17} /> },
  { key: "requests", label: "Rooming List", sub: "Update guests", icon: <ClipboardList size={17} /> },
  { key: "requests", label: "Special Requests", sub: "Other requests", icon: <Star size={17} /> },
];

const RECENT_REQUESTS = [
  {
    title: "Extra twin rooms",
    category: "Rooms",
    status: "In review" as const,
    tone: "review" as const,
    submitted: "Yesterday, 14:22",
    updated: "Today",
    icon: <Bed size={15} />,
  },
  {
    title: "Breakfast for all guests",
    category: "Dining",
    status: "Approved" as const,
    tone: "approved" as const,
    submitted: "Today, 09:15",
    updated: "Today, 09:15",
    icon: <UtensilsCrossed size={15} />,
  },
  {
    title: "Airport transfer added",
    category: "Services",
    status: "Declined" as const,
    tone: "declined" as const,
    submitted: "Yesterday, 10:30",
    updated: "Yesterday, 16:40",
    icon: <ConciergeBell size={15} />,
  },
];

function ChangesView({
  rooms,
  baseRooms,
  onRoomsChange,
  panel,
  onPanel,
  editor,
}: {
  rooms: RoomLineUI[];
  baseRooms: RoomLineUI[];
  onRoomsChange: (next: RoomLineUI[]) => void;
  panel: PanelKey;
  onPanel: (k: Exclude<PanelKey, null>) => void;
  editor: React.ReactNode;
}) {
  const [comment, setComment] = useState("");

  const lines = rooms.map((r, i) => {
    const base = baseRooms[i]?.qty ?? r.qty;
    const diff = r.qty - base;
    return { ...r, base, diff, index: i };
  });

  const changed = lines.filter((l) => l.diff !== 0);
  const currentRooms = lines.reduce((s, l) => s + l.base, 0);
  const afterRooms = lines.reduce((s, l) => s + l.qty, 0);
  const currentGuests = lines.reduce((s, l) => s + l.base * l.perRoom, 0);
  const afterGuests = lines.reduce((s, l) => s + l.qty * l.perRoom, 0);

  const tracker = [
    { n: 1, title: "Submitted", sub: "Waiting for hotel", tone: "submitted" as const, icon: <Upload size={16} /> },
    { n: changed.length, title: "In Review", sub: "Hotel is reviewing", tone: "review" as const, icon: <Info size={16} /> },
    { n: RECENT_REQUESTS.filter((r) => r.tone === "approved").length, title: "Approved", sub: "Changes confirmed", tone: "approved" as const, icon: <Check size={16} /> },
    { n: RECENT_REQUESTS.filter((r) => r.tone === "declined").length, title: "Declined", sub: "View response", tone: "declined" as const, icon: <X size={16} /> },
    { n: 0, title: "Expired", sub: "Request expired", tone: "expired" as const, icon: <MoreHorizontal size={16} /> },
  ];

  const statusFor = (diff: number) =>
    diff === 0
      ? { label: "Approved", color: "#7FBE96" }
      : { label: "In review", color: "#E0B75C" };

  return (
    <div className="space-y-4">
      {/* ── Request status tracker ── */}
      <section
        className="rounded-[16px] p-5 sm:p-6"
        style={{
          background: INK,
          border: `1px solid ${NAVY_BORDER}`,
          boxShadow: `${NAVY_INNER}, 0 14px 34px -26px rgba(9,20,29,0.45)`,
        }}
      >
        <h3 className="text-[16px]" style={{ color: "#F3F1EB", fontFamily: SERIF, fontWeight: 500 }}>
          Request Status Tracker
        </h3>
        <p className="mt-1 text-[12.5px]" style={{ color: MUTED }}>
          Track the status of your change requests.
        </p>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-stretch">
          {tracker.map((t, i) => (
            <div key={t.title} className="flex min-w-0 flex-1 items-center gap-3">
              <div
                className="min-w-0 flex-1 rounded-[12px] px-4 py-3.5"
                style={{
                  background: STATUS_TONE[t.tone].bg,
                  border: `1px solid ${NAVY_BORDER}`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-[26px] leading-none"
                    style={{ color: "#F3F1EB", fontFamily: SERIF, fontWeight: 500 }}
                  >
                    {t.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium" style={{ color: "#F3F1EB" }}>
                      {t.title}
                    </span>
                    <span className="block truncate text-[11.5px]" style={{ color: STATUS_TONE[t.tone].line }}>
                      {t.sub}
                    </span>
                  </span>
                  <span className="shrink-0" style={{ color: STATUS_TONE[t.tone].line }}>
                    {t.icon}
                  </span>
                </div>
              </div>
              {i < tracker.length - 1 && (
                <span
                  aria-hidden
                  className="hidden h-px w-4 shrink-0 lg:block"
                  style={{ background: "rgba(255,255,255,0.14)" }}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick actions ── */}
      <section
        className="rounded-[16px] p-5 sm:p-6"
        style={{
          background: INK,
          border: `1px solid ${NAVY_BORDER}`,
          boxShadow: `${NAVY_INNER}, 0 14px 34px -26px rgba(9,20,29,0.45)`,
        }}
      >
        <h3 className="text-[13px]" style={{ color: "#F3F1EB" }}>
          Quick actions — What would you like to change?
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {QUICK_ACTIONS.map((a) => {
            const open = panel === a.key;
            return (
              <button
                key={a.label}
                type="button"
                onClick={() => onPanel(a.key)}
                className="flex items-center gap-3 rounded-[12px] px-3.5 py-3 text-left transition-all duration-200"
                style={{
                  background: INK_2,
                  border: `1px solid ${open ? "rgba(199,163,74,0.55)" : NAVY_BORDER}`,
                  boxShadow: open ? "inset 0 0 0 1px rgba(199,163,74,0.18)" : "none",
                }}
              >
                <span className="shrink-0" style={{ color: open ? GOLD_SOFT : "rgba(226,233,239,0.7)" }}>
                  {a.icon}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12.5px] font-medium" style={{ color: "#F3F1EB" }}>
                    {a.label}
                  </span>
                  <span className="block truncate text-[11px]" style={{ color: MUTED }}>
                    {a.sub}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ── revealed existing editor ── */}
      {editor}

      {/* ── room change request + summary ── */}
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_378px]">
        <section
          className="min-w-0 rounded-[16px] p-5 sm:p-6"
          style={{
            background: INK,
            border: `1px solid ${NAVY_BORDER}`,
            boxShadow: `${NAVY_INNER}, 0 14px 34px -26px rgba(9,20,29,0.45)`,
          }}
        >
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h3 className="text-[16px]" style={{ color: "#F3F1EB", fontFamily: SERIF, fontWeight: 500 }}>
                Rooms — Change request
              </h3>
              <p className="mt-1 text-[12.5px]" style={{ color: MUTED }}>
                Review and adjust the room quantities.
              </p>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">
              <thead>
                <tr>
                  {["Room type", "Current booking", "Requested", "Change", "Status"].map((h) => (
                    <th
                      key={h}
                      className="pb-3 text-left text-[10.5px] font-semibold uppercase tracking-[0.16em]"
                      style={{ color: MUTED, borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => {
                  const st = statusFor(l.diff);
                  return (
                    <tr key={l.type} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                      <td className="py-3 text-[13px]" style={{ color: "#F3F1EB" }}>
                        {l.type}
                      </td>
                      <td className="py-3 text-[13px]" style={{ color: TEXT_2 }}>
                        {l.base}
                      </td>
                      <td className="py-3">
                        <Stepper
                          value={l.qty}
                          onChange={(n) =>
                            onRoomsChange(rooms.map((x, j) => (j === l.index ? { ...x, qty: n } : x)))
                          }
                        />
                      </td>
                      <td
                        className="py-3 text-[13px]"
                        style={{ color: l.diff === 0 ? TEXT_2 : l.diff > 0 ? "#7FBE96" : "#D98A8A" }}
                      >
                        {l.diff > 0 ? `+${l.diff}` : l.diff}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-2 text-[12.5px]" style={{ color: st.color }}>
                          <span
                            aria-hidden
                            className="inline-block h-[7px] w-[7px] rounded-full"
                            style={{ background: st.color }}
                          />
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div
            className="mt-5 grid grid-cols-2 gap-4 rounded-[12px] px-4 py-4 sm:grid-cols-5"
            style={{ background: INK_2, border: `1px solid ${NAVY_BORDER}` }}
          >
            {[
              { label: "Total rooms", value: `${currentRooms}`, sub: "Current" },
              { label: "Total rooms", value: `${afterRooms}`, sub: "After change" },
              { label: "Total guests", value: `${currentGuests}`, sub: "Current" },
              { label: "Total guests", value: `${afterGuests}`, sub: "After change" },
              {
                label: "Change",
                value: `${afterGuests - currentGuests > 0 ? "+" : ""}${afterGuests - currentGuests}`,
                sub: "Guests",
                gold: true,
              },
            ].map((m, i) => (
              <div key={i} className="min-w-0">
                <p className="truncate text-[11px]" style={{ color: MUTED }}>
                  {m.label}
                </p>
                <p
                  className="mt-1 text-[22px] leading-none"
                  style={{ color: m.gold ? GOLD_SOFT : "#F3F1EB", fontFamily: SERIF, fontWeight: 500 }}
                >
                  {m.value}
                </p>
                <p className="mt-1 truncate text-[11px]" style={{ color: MUTED }}>
                  {m.sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── sticky change summary ── */}
        <aside className="min-w-0">
          <section
            className="sticky top-6 rounded-[16px] p-5 sm:p-6"
            style={{
              background: INK,
              border: `1px solid ${NAVY_BORDER}`,
              boxShadow: `${NAVY_INNER}, 0 14px 34px -26px rgba(9,20,29,0.45)`,
            }}
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[16px]" style={{ color: "#F3F1EB", fontFamily: SERIF, fontWeight: 500 }}>
                Change summary
              </h3>
              <span className="text-[11.5px]" style={{ color: GOLD_SOFT }}>
                {changed.length} {changed.length === 1 ? "change" : "changes"}
              </span>
            </div>

            <ul className="mt-4 space-y-2">
              {changed.length === 0 && (
                <li className="text-[12.5px]" style={{ color: MUTED }}>
                  No changes yet — adjust the room quantities to build a request.
                </li>
              )}
              {changed.map((l) => (
                <li
                  key={l.type}
                  className="flex items-center gap-3 rounded-[11px] px-3.5 py-3"
                  style={{ background: INK_2, border: `1px solid ${NAVY_BORDER}` }}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px]" style={{ color: "#F3F1EB" }}>
                      {l.type}
                    </span>
                    <span className="block truncate text-[11.5px]" style={{ color: MUTED }}>
                      {l.diff > 0 ? `+${l.diff}` : l.diff} rooms
                    </span>
                  </span>
                  <span className="shrink-0 text-[12.5px]" style={{ color: TEXT_2 }}>
                    {l.base} <ArrowRight size={11} className="inline" /> {l.qty}
                  </span>
                  <span className="shrink-0 text-[11.5px]" style={{ color: "#E0B75C" }}>
                    In review
                  </span>
                </li>
              ))}
            </ul>

            <label className="mt-4 block">
              <span className="block text-[11.5px]" style={{ color: MUTED }}>
                Add a comment (optional)
              </span>
              <textarea
                rows={3}
                value={comment}
                maxLength={250}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add reason for your changes…"
                className="mt-1.5 w-full resize-none rounded-[10px] px-3 py-2.5 text-[13px] outline-none"
                style={inputStyle}
              />
              <span className="mt-1 block text-right text-[11px]" style={{ color: MUTED }}>
                {comment.length}/250
              </span>
            </label>

            <button
              type="button"
              disabled={changed.length === 0}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-[10px] px-4 py-3 text-[13px] font-semibold transition-opacity"
              style={{
                background: `linear-gradient(180deg, ${GOLD_HI} 0%, ${GOLD_MET} 45%, ${GOLD_MET_LOW} 100%)`,
                color: "#22303C",
                opacity: changed.length === 0 ? 0.45 : 1,
                cursor: changed.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              <Upload size={15} /> Submit request
            </button>
            <button
              type="button"
              className="mt-2.5 w-full rounded-[10px] px-4 py-2.5 text-[13px] transition-opacity hover:opacity-85"
              style={{ color: "#F3F1EB", border: `1px solid ${NAVY_BORDER}`, background: INK_2 }}
            >
              Save as draft
            </button>

            <div
              className="mt-4 flex items-start gap-2.5 rounded-[11px] px-3.5 py-3 text-[11.5px]"
              style={{ background: INK_2, border: `1px solid ${NAVY_BORDER}`, color: TEXT_2 }}
            >
              <Info size={14} className="mt-[1px] shrink-0" style={{ color: GOLD_SOFT }} />
              <span>
                Your request will be reviewed by the hotel.
                <br />
                We will notify you when a decision has been made.
              </span>
            </div>
          </section>
        </aside>
      </div>

      {/* ── recent change requests ── */}
      <section
        className="rounded-[16px] p-5 sm:p-6"
        style={{
          background: INK,
          border: `1px solid ${NAVY_BORDER}`,
          boxShadow: `${NAVY_INNER}, 0 14px 34px -26px rgba(9,20,29,0.45)`,
        }}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-[16px]" style={{ color: "#F3F1EB", fontFamily: SERIF, fontWeight: 500 }}>
            Recent change requests
          </h3>
          <span className="text-[12px]" style={{ color: GOLD_SOFT }}>
            View all →
          </span>
        </div>
        <ul className="mt-3">
          {RECENT_REQUESTS.map((r, i) => (
            <li
              key={r.title}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3 sm:grid-cols-[minmax(0,1.6fr)_110px_110px_150px_130px_auto]"
              style={i > 0 ? { borderTop: "1px solid rgba(255,255,255,0.06)" } : undefined}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="shrink-0" style={{ color: GOLD_SOFT }}>
                  {r.icon}
                </span>
                <span className="truncate text-[13px]" style={{ color: "#F3F1EB" }}>
                  {r.title}
                </span>
              </span>
              <span className="hidden truncate text-[12px] sm:block" style={{ color: MUTED }}>
                {r.category}
              </span>
              <span className="hidden truncate text-[12px] sm:block" style={{ color: STATUS_TONE[r.tone].line }}>
                {r.status}
              </span>
              <span className="hidden truncate text-[12px] sm:block" style={{ color: MUTED }}>
                {r.submitted}
              </span>
              <span className="hidden truncate text-[12px] sm:block" style={{ color: MUTED }}>
                {r.updated}
              </span>
              <ChevronRight size={15} style={{ color: MUTED }} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
