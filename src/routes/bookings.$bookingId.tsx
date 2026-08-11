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
  Building2,
  Mail,
  Phone,

  X,
} from "lucide-react";
import { BookingWorkspaceHeader, type WorkspaceTab } from "@/components/BookingWorkspaceHeader";
import { BookingDocumentsView } from "@/components/BookingDocuments";
import { BookingMessagesView } from "@/components/BookingMessages";
import { BookingNotesView } from "@/components/BookingNotes";
import { PAL, SERIF, TopBar } from "@/components/DashboardChrome";
import {
  RaisedCard,
  InsetCard,
  SummaryStrip,
  NextTimeline,
  FolderAction,
  FolderSection,
  CardTitle,
  CardEyebrow as FolderEyebrow,
  FOLDER_SURFACE,
  INK as F_INK,
  INK_SOFT as F_INK_SOFT,
  INK_FAINT as F_INK_FAINT,
  HAIR as F_HAIR,
  GOLD_MET as F_GOLD,
  GOLD_DEEP_MET as F_GOLD_DEEP,
} from "@/features/booking-workspace/folder";
import { OverviewFolder } from "@/features/booking-workspace/overview/Overview";
import { RoomingFolder } from "@/features/booking-workspace/rooming/RoomingList";
import {
  FOLDER_TOP_SURFACE,
  PAGE_UNDER,
  INK as C_INK,
  INK_2 as C_INK_2,
  INK_3 as C_INK_3,
  HAIR as C_HAIR,
  IVORY as C_IVORY,
  GOLD as C_GOLD,
  GREEN as C_GREEN,
} from "@/features/booking-workspace/overview/materials";
import {
  Card,
  Medallion,
  Eyebrow,
  GoldLink,
  SectionRule,
  SolidButton,
} from "@/features/booking-workspace/overview/primitives";
import { GlobalSidebar } from "@/components/GlobalSidebar";

import { roomingProgress, type Booking } from "@/lib/bookings";
import {
  activeAllocations,
  capacityOf,
  distributionFor,
  isNamed,
  statsOf,
  type RoomingList,
  type RoomType,
} from "@/lib/rooming";
import { useAuth } from "@/lib/auth";
import { fetchBooking, fetchRoomDistribution } from "@/lib/bookingsApi";
import { loadRoomingListFromDb } from "@/lib/roomingApi";

export const Route = createFileRoute("/bookings/$bookingId")({
  component: BookingWorkspace,
  validateSearch: (search: Record<string, unknown>): { tab?: WorkspaceTab } => ({
    tab: typeof search.tab === "string" ? (search.tab as WorkspaceTab) : undefined,
  }),
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

const LOCAL_PAL = {
  BG_ALT: "#F6F4EB",
  CARD: "#15202B",
  CARD_BORDER: "rgba(154,176,192,0.13)",
  CARD_SHADOW: "0 1px 2px rgba(0,0,0,0.18), 0 8px 20px -14px rgba(0,0,0,0.45)",
  ACTION_PANEL: "#1B2836",
  BORDER: "#2A3A4A",
  TEXT: "#F8FAFC",
  TEXT_2: "#BFC7CD",
  MUTED: "#94A3B8",
  GOLD: "#C5A059",
  GOLD_DEEP: "rgba(199,163,74,0.55)",
  GOLD_SOFT: "#D0B05A",
  GREEN: "#8DA88A",
} as const;

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
} = LOCAL_PAL;

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
const NAVY_PANEL = `${NAVY_TEXTURE}, linear-gradient(180deg, #1B2836 0%, #17222E 55%, #131C26 100%)`;
const NAVY_INNER =
  "inset 0 1px 0 rgba(255,255,255,0.03), inset 0 -1px 0 rgba(0,0,0,0.12), inset 0 8px 22px -18px rgba(0,0,0,0.35), 0 0 0 1px rgba(8,18,28,0.25)";
const NAVY_BORDER = "#2A3A4A";

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
      style={{ border: `1px solid ${NAVY_BORDER}`, background: `${NAVY_TEXTURE}, linear-gradient(180deg, #1E2B38 0%, #17222D 100%)` }}
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
  background: `${NAVY_TEXTURE}, linear-gradient(180deg, #1E2B38 0%, #17222D 100%)`,
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
    void router.preloadRoute({ to: "/bookings/$bookingId", params: { bookingId }, search: { tab: "Rooming List" } });
    void queryClient
      .prefetchQuery(roomingQueryOptions(bookingId, booking.rooms))
      .catch(() => {});
  }, [booking, bookingId, queryClient, router]);


  if (isLoading || authLoading || !session) {
    return (
      <div className="grid min-h-screen place-items-center" style={{ backgroundColor: PAL.BG, color: MUTED }}>
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
  const { tab: tabParam } = Route.useSearch();
  const [tab, setTab] = useState<WorkspaceTab>(tabParam ?? "Overview");
  /* rooming progress is derived from the live rooming list, never hardcoded */
  const [roomingStats, setRoomingStats] = useState<{ filled: number; total: number; percent: number } | null>(null);
  const [roomingList, setRoomingList] = useState<RoomingList | null>(null);
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
      setRoomingList(list);
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
  /* Booking details inset card — "Show more details" disclosure */
  const [detailsOpen, setDetailsOpen] = useState(false);

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

  /* rooming list tab data — derived from the live list where available */
  const roomingData = useMemo(() => {
    const ORDER: { key: RoomType[]; label: string }[] = [
      { key: ["twin"], label: "Twin rooms" },
      { key: ["double"], label: "Double rooms" },
      { key: ["single"], label: "Single rooms" },
      { key: ["triple"], label: "Triple rooms" },
      { key: ["family"], label: "Family / Accessible" },
    ];
    const allocs = roomingList ? activeAllocations(roomingList) : [];
    const rows = ORDER.map((o) => {
      const list = allocs.filter((a) => o.key.includes(a.type));
      return {
        label: o.label,
        rooms: list.length,
        guests: list.reduce((s, a) => s + capacityOf(a.type, a.occupancy), 0),
      };
    });
    const guestsAdded =
      roomingStats?.filled ?? allocs.reduce((s, a) => s + a.guests.filter(isNamed).length, 0);
    const guestsTotal = roomingStats?.total ?? totalGuests;
    const arrivalMs = new Date(stay.arrival).getTime();
    let derivedDeadline: string | null = null;
    try {
      if (Number.isFinite(arrivalMs)) {
        derivedDeadline = new Date(arrivalMs - 30 * 86400000).toISOString().slice(0, 10);
      }
    } catch {
      derivedDeadline = null;
    }
    const deadlineIso = rooming?.due ?? derivedDeadline;
    const deadlineMs = deadlineIso ? new Date(deadlineIso).getTime() : NaN;
    const savedAt = roomingList?.savedAt ?? roomingList?.submittedAt ?? null;
    const savedMs = savedAt ? new Date(savedAt).getTime() : NaN;
    const versionNo = (roomingList?.changeLog?.length ?? 0) + 1;
    const stamp = Number.isFinite(savedMs)
      ? `Updated ${fmtDate(savedAt as string, { day: "numeric", month: "short", year: "numeric" })} at ${new Date(
          savedMs,
        ).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`
      : "Not yet saved";
    /* only the live version exists in the data model today — historical
       records can be appended to this array once versioning is stored. */
    const versions = [
      {
        id: `v${versionNo}`,
        short: `V${versionNo}`,
        name: versionNo > 1 ? `Version ${versionNo}` : "Original version",
        timestamp: stamp,
        guests: guestsAdded,
        guestsTotal,
        rooms: allocs.length || totalRooms,
        current: true,
      },
    ];
    return {
      status: guestsAdded >= guestsTotal && guestsTotal > 0 ? "Complete" : "In progress",
      lastUpdated:
        savedAt && Number.isFinite(new Date(savedAt).getTime()) ? dateShort(savedAt) : "Not yet saved",
      deadline: Number.isFinite(deadlineMs)
        ? fmtDate(deadlineIso as string, { day: "numeric", month: "short", year: "numeric" })
        : "To be confirmed",
      deadlineNote: "(30 days before arrival)",
      guestsAdded,
      guestsTotal,
      roomsAssigned: allocs.length || totalRooms,
      version: versionNo,
      versions,

      rows: rows.filter((r) => r.rooms > 0).length ? rows : rows,
    };
  }, [roomingList, roomingStats, rooming, stay.arrival, totalGuests, totalRooms]);
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
                style={{ background: `${NAVY_TEXTURE}, linear-gradient(180deg, #1E2B38 0%, #17222D 100%)`, border: `1px solid ${NAVY_BORDER}` }}
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
                    background: on ? "rgba(199,163,74,0.08)" : `${NAVY_TEXTURE}, linear-gradient(180deg, #1E2B38 0%, #17222D 100%)`,
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
                style={{ background: `${NAVY_TEXTURE}, linear-gradient(180deg, #1E2B38 0%, #17222D 100%)`, border: `1px solid ${NAVY_BORDER}` }}
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
    { label: "Request sent", desc: "Sent to the hotel", sub: "28 Jul", state: "done" as const },
    { label: "Hotel confirmed", desc: "Confirmed by the hotel", sub: "29 Jul", state: "done" as const },
    { label: "Deposit received", desc: "Payment registered", sub: "29 Jul", state: "done" as const },
    {
      label: "Rooming list",
      desc: "Add guest names and room assignments",
      sub: "Due in 6 days",
      state: "active" as const,
    },
    {
      label: "Final confirmation",
      desc: "Confirm arrival details and special requests",
      sub: "Due in 10 days",
      state: "todo" as const,
    },
    {
      label: "Arrival",
      desc: `Check-in from ${dateShort(stay.arrival)}`,
      sub: dateShort(stay.arrival),
      state: "todo" as const,
    },
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

  const isFolder = tab === "Overview" || tab === "Rooming List";

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: isFolder ? PAGE_UNDER : BG_ALT }}
    >
      <style>{`@keyframes hgbPanelIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}`}</style>

      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-[240px] lg:block"
        style={isFolder ? { boxShadow: "16px 0 28px -16px rgba(6,12,20,0.18)" } : undefined}
      >
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

      <div className="flex flex-1 flex-col lg:pl-[240px]">
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
          stayDates={`${dateShort(stay.arrival)} – ${fmtDate(stay.departure, { day: "numeric", month: "short", year: "numeric" })}`}
          roomsLabel={`${totalRooms} rooms`}
          guestsLabel={`${totalGuests} guests`}
          statusLabel={confirmed ? "Confirmed" : "Pending"}
          statusTone={confirmed ? "#1E5B39" : "#7A5A12"}
          active={tab as WorkspaceTab}
          onSelect={(t) => setTab(t)}
          surface={isFolder ? FOLDER_TOP_SURFACE : undefined}
        />


        {/* ══ 2 · workspace plate — physical folder on Overview, ivory elsewhere ══ */}
        <div
          className={
            isFolder
              ? "relative flex flex-1 flex-col px-0 pb-0 pt-0"
              : "relative min-h-[80vh] rounded-tl-[22px] px-5 pb-14 pt-0 sm:px-9"
          }
          style={
            isFolder
              ? { backgroundColor: PAGE_UNDER }
              : { backgroundColor: PLATE }
          }
        >
          {/* ══ 3 · information strip (secondary tabs keep the original strip) ══ */}
          {isFolder ? null : (

            <div className="flex flex-wrap items-center gap-y-5 py-6">
              {strip.map((s, i) => (
                <div
                  key={s.lead + i}
                  className="flex min-w-[190px] flex-1 items-center gap-3 px-4 first:pl-0"
                  style={i > 0 ? { borderLeft: "1px solid rgba(21,32,43,0.13)" } : undefined}
                >
                  <span className="shrink-0" style={{ color: GOLD_MET_MID }}>
                    {s.icon}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold" style={{ color: "#15202B" }}>
                      {s.lead}
                    </span>
                    <span className="block truncate text-[12px]" style={{ color: "rgba(21,32,43,0.6)" }}>
                      {s.sub}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          )}


          <div key={tab} className={`hgb-ws-panel${isFolder ? " flex flex-1 flex-col" : ""}`}>
          {tab === "Rooming List" ? (
            <RoomingFolder
              bookingId={booking.id}
              data={roomingData}
              onHistory={() => setTab("Changes")}
              onNewVersion={() => navigate({ to: "/rooming-list/$bookingId", params: { bookingId: booking.id } })}
              onUpload={() => setTab("Documents")}
              onMessage={() => setTab("Messages")}
            />
          ) : tab === "Changes" ? (
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
            <OverviewFolder
              bookingId={booking.id}
              journey={journey}
              onViewTimeline={() => setTab("Changes")}
              onMessage={() => setTab("Messages")}
              detailsStatus={{
                label: confirmed ? "Confirmed" : "Awaiting hotel confirmation",
                tone: confirmed ? "confirmed" : "pending",
              }}
              detailRows={[
                {
                  k: "Hotel",
                  icon: <Building2 size={18} strokeWidth={1.6} />,
                  v: booking.hotel ?? "Hotel to be assigned",
                  stars: booking.hotel ? 5 : undefined,
                },
                { k: "Destination", icon: <MapPin size={18} strokeWidth={1.6} />, v: booking.destination },
                {
                  k: "Contact",
                  icon: <UserCheck size={18} strokeWidth={1.6} />,
                  v: displayName || "—",
                  v2: "Group Sales Manager",
                },
                { k: "Email", icon: <Mail size={18} strokeWidth={1.6} />, v: session?.user.email ?? "—" },
                { k: "Phone", icon: <Phone size={18} strokeWidth={1.6} />, v: "+47 55 33 44 55" },
                { k: "Hotel reference", icon: <FileText size={18} strokeWidth={1.6} />, v: hotelRef || booking.reference },
                {
                  k: "Payment terms",
                  icon: <CreditCard size={18} strokeWidth={1.6} />,
                  v: confirmed ? "Deposit paid" : "Deposit pending",
                },
              ]}

              detailsFooter={
                <FolderAction
                  label={detailsOpen ? "Hide details" : "Show more details"}
                  arrow={detailsOpen ? "↑" : "↓"}
                  onClick={() => setDetailsOpen((v) => !v)}
                />
              }
              detailsExtra={
                detailsOpen ? (
                  <ul className="mt-1">
                    {ledger.map((row) => {
                      const open = panel === row.key;
                      return (
                        <li key={row.key} style={{ borderTop: `1px solid ${F_HAIR}` }}>
                          <LedgerRow
                            icon={row.icon}
                            label={row.label}
                            lead={row.lead}
                            detail={row.detail}
                            action={row.action}
                            open={open}
                            dimmed={panel !== null && !open}
                            onOpen={() => setPanel(open ? null : row.key)}
                            onIvory
                          />
                          {open && <div className="pb-4">{editor}</div>}
                        </li>
                      );
                    })}
                  </ul>
                ) : null
              }
              summary={[
                {
                  icon: <Users size={17} />,
                  lead: `${totalGuests}`,
                  label: "Guests",
                  onAction: () => setPanel("rooms"),
                },
                {
                  icon: <Bed size={17} />,
                  lead: `${totalRooms}`,
                  label: "Rooms",
                  onAction: () => setPanel("rooms"),
                },
                {
                  icon: <CalendarDays size={17} />,
                  lead: `${dateShort(stay.arrival)} – ${dateShort(stay.departure)}`,
                  label: "Stay dates",
                  onAction: () => setPanel("stay"),
                },
                {
                  icon: <FileText size={17} />,
                  lead: "3",
                  label: "Documents uploaded",
                  actionLabel: "View documents",
                  onAction: () => setTab("Documents"),
                },
              ]}
            />

          )}

          </div>

        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── workspace primitives ───────────────────────── */

const PLATE = "#F6F4EB";
const CARD_BG = "#15202B";
const CARD_BORDER_SOFT = "#2A3A4A";
const INK = NAVY_PANEL;
const INK_2 = `${NAVY_TEXTURE}, linear-gradient(180deg, #223040 0%, #1E2A38 55%, #1A2530 100%)`;


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
        background: `${NAVY_TEXTURE}, ${CARD_BG}`,
        border: `1px solid ${CARD_BORDER_SOFT}`,
        boxShadow: `${NAVY_INNER}, 0 14px 34px -26px rgba(9,20,29,0.45)`,
      }}
    >
      <div className="flex items-baseline justify-between gap-5">
        <h3 className="text-[16px]" style={{ color: "#F3F1EB", fontFamily: SERIF, fontWeight: 500 }}>
          {title}
        </h3>
        {action ?? (right ? <span className="truncate text-[11.5px]" style={{ color: MUTED }}>{right}</span> : null)}
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
  onIvory,
}: {
  icon: React.ReactNode;
  label: string;
  lead: string;
  detail: string;
  action: string;
  open: boolean;
  dimmed: boolean;
  onOpen: () => void;
  /** ivory variant used inside the booking folder */
  onIvory?: boolean;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`grid w-full grid-cols-[110px_minmax(0,1fr)_auto] items-center gap-4 text-left ${onIvory ? "py-3" : "py-4"}`}
      style={{ opacity: dimmed ? 0.45 : 1, transition: "opacity 220ms ease" }}
    >
      <span
        className="flex items-center gap-2.5"
        style={{
          color: onIvory
            ? open || hover
              ? F_GOLD_DEEP
              : F_INK_FAINT
            : open || hover
              ? GOLD_SOFT
              : MUTED,
          transition: "color 200ms ease",
        }}
      >
        <span className="shrink-0">{icon}</span>
        <span className="truncate text-[10.5px] font-semibold uppercase tracking-[0.18em]">{label}</span>
      </span>
      <span className="min-w-0">
        <span
          className="block truncate text-[13.5px]"
          style={{ color: onIvory ? F_INK : "#F3F1EB" }}
        >
          {lead}
        </span>
        <span
          className="mt-0.5 block truncate text-[12px]"
          style={{ color: onIvory ? F_INK_SOFT : "rgba(146,157,165,0.9)" }}
        >
          {detail}
        </span>
      </span>

      <span
        className="shrink-0 text-[12px]"
        style={{
          color: onIvory ? F_GOLD_DEEP : open ? GOLD_SOFT : GOLD_CALM,
          opacity: open || hover ? 1 : onIvory ? 0.6 : 0.35,
          transition: "opacity 200ms ease, color 200ms ease",
        }}
      >
        {open ? "Close" : action} <span aria-hidden>{open ? "×" : "→"}</span>
      </span>
    </button>
  );
}





/* ───────────────────────── Changes workspace ───────────────────────── */

/* ink-side equivalents of STATUS_TONE, for the ivory surfaces */
const STATUS_INK = {
  submitted: "#2E5F86",
  review: "#8A6412",
  approved: "#2E6B45",
  declined: "#8C3B3B",
  expired: C_INK_2,
} as const;

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

type ChangeMode = "rooms" | "addons" | "other";

const CHANGE_MODES: { key: ChangeMode; label: string }[] = [
  { key: "rooms", label: "Rooms & dates" },
  { key: "addons", label: "Add-ons & services" },
  { key: "other", label: "Other request" },
];

/* the mode a given panel key belongs to */
const MODE_OF_PANEL: Record<Exclude<PanelKey, null>, ChangeMode> = {
  stay: "rooms",
  rooms: "rooms",
  dining: "addons",
  services: "addons",
  requests: "other",
};

/* ── small ivory primitives, local to the Changes tab ── */

const INSET_BG = "#FFFDF8";
const INSET_BORDER = "1px solid rgba(27,37,48,0.16)";

function ModeTile({
  icon,
  label,
  on,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  on: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-[7px] px-3.5 py-[9px] text-[12.5px] font-medium transition-all duration-200 sm:flex-none"
      style={{
        background: INSET_BG,
        border: on ? `1px solid ${C_GOLD_2}` : INSET_BORDER,
        color: on ? C_GOLD : C_INK_2,
      }}
    >
      <span className="shrink-0" style={{ color: on ? C_GOLD : C_INK_3 }}>
        {icon}
      </span>
      {label}
    </button>
  );
}

function IvoryStepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div
      className="inline-flex items-center overflow-hidden rounded-[7px]"
      style={{ border: INSET_BORDER, background: INSET_BG }}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        className="grid h-[26px] w-[26px] place-items-center text-[14px] transition-opacity hover:opacity-70"
        style={{ color: C_INK_2, borderRight: `1px solid ${C_HAIR}` }}
        aria-label="Decrease"
      >
        −
      </button>
      <input
        type="number"
        value={value}
        min={0}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-[38px] bg-transparent text-center text-[13px] font-medium outline-none"
        style={{ color: C_INK }}
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="grid h-[26px] w-[26px] place-items-center text-[14px] transition-opacity hover:opacity-70"
        style={{ color: C_INK_2, borderLeft: `1px solid ${C_HAIR}` }}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

function Radio({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 text-[13px]" style={{ color: C_INK }}>
      <span
        className="grid h-[15px] w-[15px] place-items-center rounded-full"
        style={{ border: `1px solid ${checked ? C_GOLD_2 : "rgba(27,37,48,0.26)"}`, background: INSET_BG }}
      >
        {checked && <span className="block h-[7px] w-[7px] rounded-full" style={{ background: C_GOLD }} />}
      </span>
      {label}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1 block text-[11px]" style={{ color: C_INK_2 }}>
      {children}
    </span>
  );
}

const inputStyle: React.CSSProperties = {
  background: INSET_BG,
  border: INSET_BORDER,
  color: C_INK,
};

function OutlineGold({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-[6px] px-3.5 py-[7px] text-[12.5px] font-medium transition-opacity hover:opacity-80 ${className}`}
      style={{ background: INSET_BG, border: `1px solid ${C_GOLD_2}`, color: C_GOLD }}
    >
      {children}
    </button>
  );
}

type ServiceDef = { key: string; name: string; detail: string; icon: React.ReactNode };

const SERVICES: ServiceDef[] = [
  { key: "dinner", name: "Dinner / Group meal", detail: "Set menu, buffet or à la carte for the group", icon: <UtensilsCrossed size={16} /> },
  { key: "meeting", name: "Meeting room", detail: "Room hire, seating layout and AV equipment", icon: <Building2 size={16} /> },
  { key: "early", name: "Early check-in", detail: "Access to rooms before standard check-in time", icon: <Clock size={16} /> },
  { key: "late", name: "Late check-out", detail: "Keep the rooms later on departure day", icon: <LogOut size={16} /> },
  { key: "porter", name: "Porter service", detail: "Luggage handling on arrival and departure", icon: <Luggage size={16} /> },
  { key: "welcome", name: "Welcome amenity", detail: "In-room treats or a welcome reception", icon: <Gift size={16} /> },
  { key: "beds", name: "Extra beds / Cots", detail: "Additional beds or cots in selected rooms", icon: <Bed size={16} /> },
];

/* the panel key each service row keeps reachable */
const SERVICE_PANEL: Record<string, Exclude<PanelKey, null>> = {
  dinner: "dining",
  meeting: "services",
  early: "services",
  late: "services",
  porter: "services",
  welcome: "dining",
  beds: "services",
};

function ChangesView({
  rooms,
  baseRooms,
  onRoomsChange,
  panel,
  onPanel,
  editor,
  stayDates,
  totalRooms,
  totalGuests,
  reference,
  paymentTerms,
  onMessage,
}: {
  rooms: RoomLineUI[];
  baseRooms: RoomLineUI[];
  onRoomsChange: (next: RoomLineUI[]) => void;
  panel: PanelKey;
  onPanel: (k: Exclude<PanelKey, null>) => void;
  editor: React.ReactNode;
  stayDates: string;
  totalRooms: number;
  totalGuests: number;
  reference: string;
  paymentTerms: string;
  onMessage?: () => void;
}) {
  const [comment, setComment] = useState("");
  const [mode, setMode] = useState<ChangeMode>("rooms");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [scope, setScope] = useState<"original" | "specific">("original");
  const [scopeDate, setScopeDate] = useState("");
  const [service, setService] = useState<ServiceDef | null>(null);
  const [svcNotes, setSvcNotes] = useState("");
  const [otherText, setOtherText] = useState("");
  const [otherCategory, setOtherCategory] = useState("General");

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

  const openService = (s: ServiceDef) => {
    setService(s);
    setMode("addons");
    onPanel(SERVICE_PANEL[s.key]);
  };

  const summaryRows = [
    { icon: <CalendarDays size={14} />, k: "Stay dates", v: stayDates },
    { icon: <Bed size={14} />, k: "Rooms", v: `${totalRooms} rooms` },
    { icon: <Users size={14} />, k: "Guests", v: `${totalGuests} guests` },
    { icon: <FileText size={14} />, k: "Reference", v: reference },
    { icon: <CreditCard size={14} />, k: "Payment terms", v: paymentTerms },
  ];

  const SummaryCard = (
    <Card className="sticky top-6 px-5 py-4 sm:px-6">
      <Eyebrow>Change summary</Eyebrow>
      <ul className="mt-2.5">
        {summaryRows.map((r, i) => (
          <li
            key={r.k}
            className="flex items-center gap-3 py-[9px]"
            style={i > 0 ? { borderTop: `1px solid ${C_HAIR}` } : undefined}
          >
            <span className="shrink-0" style={{ color: C_GOLD_2 }}>
              {r.icon}
            </span>
            <span className="min-w-0 flex-1 truncate text-[12.5px]" style={{ color: C_INK_2 }}>
              {r.k}
            </span>
            <span className="shrink-0 text-[13px] font-medium" style={{ color: C_INK }}>
              {r.v}
            </span>
          </li>
        ))}
      </ul>

      <div
        className="mt-3 flex items-start gap-2.5 rounded-[8px] px-3.5 py-2.5 text-[11.5px]"
        style={{ background: "rgba(237,228,214,0.45)", border: `1px solid ${C_HAIR}`, color: C_INK_2 }}
      >
        <Info size={14} className="mt-[1px] shrink-0" style={{ color: C_GOLD }} />
        <span>We&rsquo;ll review your request and respond as soon as possible.</span>
      </div>

      <div
        className="mt-3"
        style={changed.length === 0 ? { opacity: 0.45, pointerEvents: "none" as const } : undefined}
      >
        <SolidButton className="w-full">
          Submit change request <ArrowRight size={14} />
        </SolidButton>
      </div>
      <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px]" style={{ color: C_INK_3 }}>
        <Lock size={11} /> Your request is sent securely
      </p>
    </Card>
  );

  return (
    <div className="space-y-3 pb-8">
      {/* ── intro + mode selector ── */}
      <Card className="px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-3.5">
            <Medallion size={42}>
              <SlidersHorizontal size={18} />
            </Medallion>
            <div className="min-w-0">
              <h3 className="text-[23px] leading-tight" style={{ color: C_INK, fontFamily: SERIF, fontWeight: 500 }}>
                Make changes to your booking
              </h3>
              <p className="mt-0.5 max-w-[440px] text-[12.5px]" style={{ color: C_INK_2 }}>
                Request changes to dates, rooms or add services. We&rsquo;ll review and respond as soon as possible.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-2 lg:items-end">
            <div className="flex items-center gap-2">
              <ModeTile icon={<Bed size={14} />} label="Rooms & dates" on={mode === "rooms"} onClick={() => setMode("rooms")} />
              <ModeTile icon={<ConciergeBell size={14} />} label="Add-ons & services" on={mode === "addons"} onClick={() => setMode("addons")} />
              <ModeTile icon={<MessageSquare size={14} />} label="Other request" on={mode === "other"} onClick={() => setMode("other")} />
            </div>
            <button
              type="button"
              onClick={() => setHistoryOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 self-end text-[12px] font-medium transition-opacity hover:opacity-70"
              style={{ color: C_GOLD }}
            >
              <History size={13} />
              {historyOpen ? "Hide change history" : "View change history"}
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </Card>

      {/* ── change history (tracker + recent requests), hidden by default ── */}
      {historyOpen && (
        <Card className="px-5 py-4 sm:px-6">
          <Eyebrow>Request status tracker</Eyebrow>
          <div className="mt-3 grid gap-2 sm:grid-cols-3 xl:grid-cols-5">
            {tracker.map((t) => (
              <div
                key={t.title}
                className="flex min-w-0 items-center gap-3 rounded-[8px] px-3.5 py-2.5"
                style={{ background: INSET_BG, border: `1px solid ${C_HAIR}` }}
              >
                <span className="text-[22px] leading-none" style={{ color: C_INK, fontFamily: SERIF, fontWeight: 500 }}>
                  {t.n}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-medium" style={{ color: C_INK }}>
                    {t.title}
                  </span>
                  <span className="block truncate text-[11.5px]" style={{ color: STATUS_INK[t.tone] }}>
                    {t.sub}
                  </span>
                </span>
                <span className="shrink-0" style={{ color: STATUS_INK[t.tone] }}>
                  {t.icon}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <SectionRule label="Recent change requests" />
            <ul className="mt-1">
              {RECENT_REQUESTS.map((r, i) => (
                <li
                  key={r.title}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-2.5 sm:grid-cols-[minmax(0,1.6fr)_110px_110px_150px_130px_auto]"
                  style={i > 0 ? { borderTop: `1px solid ${C_HAIR}` } : undefined}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="shrink-0" style={{ color: C_GOLD }}>
                      {r.icon}
                    </span>
                    <span className="truncate text-[13px]" style={{ color: C_INK }}>
                      {r.title}
                    </span>
                  </span>
                  <span className="hidden truncate text-[12px] sm:block" style={{ color: C_INK_2 }}>
                    {r.category}
                  </span>
                  <span className="hidden truncate text-[12px] font-medium sm:block" style={{ color: STATUS_INK[r.tone] }}>
                    {r.status}
                  </span>
                  <span className="hidden truncate text-[12px] sm:block" style={{ color: C_INK_2 }}>
                    {r.submitted}
                  </span>
                  <span className="hidden truncate text-[12px] sm:block" style={{ color: C_INK_2 }}>
                    {r.updated}
                  </span>
                  <ChevronRight size={15} style={{ color: C_INK_3 }} />
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {/* ── workspace + summary ── */}
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 space-y-3">
          {mode === "rooms" && (
            <Card className="px-5 py-4 sm:px-6">
              <Eyebrow>What would you like to change?</Eyebrow>

              {/* 1 · apply changes to */}
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <FieldLabel>Apply changes to</FieldLabel>
                  <div className="flex items-center gap-5">
                    <Radio checked={scope === "original"} label="Original stay" onClick={() => setScope("original")} />
                    <Radio checked={scope === "specific"} label="Specific dates" onClick={() => setScope("specific")} />
                  </div>
                </div>
                <div style={{ opacity: scope === "specific" ? 1 : 0.5 }}>
                  <FieldLabel>Select dates (optional)</FieldLabel>
                  <div className="relative">
                    <input
                      type="date"
                      value={scopeDate}
                      disabled={scope !== "specific"}
                      onChange={(e) => setScopeDate(e.target.value)}
                      className="w-full rounded-[7px] px-3 py-[7px] pr-8 text-[12.5px] outline-none sm:w-[190px]"
                      style={inputStyle}
                    />
                    <CalendarDays
                      size={14}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                      style={{ color: C_INK_3 }}
                    />
                  </div>
                </div>
              </div>

              {panel === "stay" && <div className="mt-3">{editor}</div>}

              {/* 2 · room changes */}
              <div className="mt-4">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[13.5px] font-medium" style={{ color: C_INK }}>
                      Room changes
                    </p>
                    <p className="text-[11.5px]" style={{ color: C_INK_2 }}>
                      Adjust the number of rooms
                    </p>
                  </div>
                  <div className="hidden shrink-0 items-center gap-3 sm:flex">
                    <span className="w-[62px] text-right text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: C_INK_3 }}>
                      Current
                    </span>
                    <span className="w-[104px] text-right text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: C_INK_3 }}>
                      Requested
                    </span>
                  </div>
                </div>

                <ul className="mt-1.5">
                  {lines.map((l, i) => (
                    <li
                      key={l.type}
                      className="flex items-center gap-3 py-[9px]"
                      style={i > 0 ? { borderTop: `1px solid ${C_HAIR}` } : undefined}
                    >
                      <span className="min-w-0 flex-1 truncate text-[13.5px]" style={{ color: C_INK }}>
                        {l.type}
                      </span>
                      <span className="w-[62px] shrink-0 text-right text-[13px]" style={{ color: C_INK_2 }}>
                        {l.base}
                      </span>
                      <span className="flex w-[104px] shrink-0 justify-end">
                        <IvoryStepper
                          value={l.qty}
                          onChange={(n) => onRoomsChange(rooms.map((x, j) => (j === l.index ? { ...x, qty: n } : x)))}
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {panel === "rooms" && <div className="mt-3">{editor}</div>}

              {/* 3 · totals */}
              <div
                className="mt-3 grid grid-cols-2 rounded-[8px]"
                style={{ background: "rgba(27,37,48,0.035)", border: `1px solid ${C_HAIR}` }}
              >
                {[
                  { icon: <Bed size={13} />, label: "Total rooms", from: currentRooms, to: afterRooms },
                  { icon: <Users size={13} />, label: "Total guests", from: currentGuests, to: afterGuests },
                ].map((m, i) => (
                  <div key={m.label} className="min-w-0 px-4 py-3" style={i === 1 ? { borderLeft: `1px solid ${C_HAIR}` } : undefined}>
                    <p className="flex items-center gap-1.5 truncate text-[11px]" style={{ color: C_INK_3 }}>
                      <span style={{ color: C_GOLD_2 }}>{m.icon}</span>
                      {m.label}
                    </p>
                    <p className="mt-1 flex items-baseline gap-2 text-[18px] leading-none" style={{ color: C_INK, fontFamily: SERIF, fontWeight: 500 }}>
                      {m.from}
                      <ArrowRight size={12} style={{ color: C_INK_3 }} />
                      <span style={{ color: m.to === m.from ? C_INK : C_GOLD }}>{m.to}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* 4 · other changes */}
              <div className="mt-4">
                <p className="text-[13.5px] font-medium" style={{ color: C_INK }}>
                  Other changes
                </p>
                <p className="text-[11.5px]" style={{ color: C_INK_2 }}>
                  Add any other details or requests
                </p>
                <textarea
                  rows={3}
                  value={comment}
                  maxLength={1000}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Type your message here…"
                  className="mt-1.5 w-full resize-none rounded-[8px] px-3 py-2.5 text-[13px] outline-none"
                  style={inputStyle}
                />
                <span className="mt-1 block text-right text-[11px]" style={{ color: C_INK_3 }}>
                  {comment.length}/1000
                </span>
              </div>
            </Card>
          )}

          {mode === "addons" && (
            <Card className="px-5 py-4 sm:px-6">
              <Eyebrow>Add-ons &amp; services</Eyebrow>
              <p className="mt-1 text-[12px]" style={{ color: C_INK_2 }}>
                Choose the services you need and add them to your request.
              </p>
              <ul className="mt-2">
                {SERVICES.map((s, i) => (
                  <li
                    key={s.key}
                    className="flex items-center gap-3.5 py-[10px]"
                    style={i > 0 ? { borderTop: `1px solid ${C_HAIR}` } : undefined}
                  >
                    <span className="shrink-0" style={{ color: C_GOLD_2 }}>
                      {s.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium" style={{ color: C_INK }}>
                        {s.name}
                      </span>
                      <span className="block truncate text-[11.5px]" style={{ color: C_INK_2 }}>
                        {s.detail}
                      </span>
                    </span>
                    <OutlineGold onClick={() => openService(s)}>Configure</OutlineGold>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setMode("other")}
                className="mt-3 flex w-full items-center gap-3 rounded-[8px] px-3.5 py-2.5 text-left"
                style={{ border: `1px dashed rgba(27,37,48,0.22)`, background: INSET_BG }}
              >
                <Plus size={15} style={{ color: C_GOLD }} />
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium" style={{ color: C_INK }}>
                    Add a custom request
                  </span>
                  <span className="block text-[11.5px]" style={{ color: C_INK_2 }}>
                    Can&rsquo;t find what you need? Tell us in your own words.
                  </span>
                </span>
              </button>
            </Card>
          )}

          {mode === "other" && (
            <Card className="px-5 py-4 sm:px-6">
              <Eyebrow>Other request</Eyebrow>
              <p className="mt-1 text-[12px]" style={{ color: C_INK_2 }}>
                Tell us what you would like to change.
              </p>

              <label className="mt-3 block">
                <FieldLabel>Category (optional)</FieldLabel>
                <select
                  value={otherCategory}
                  onChange={(e) => setOtherCategory(e.target.value)}
                  className="w-full rounded-[7px] px-3 py-[8px] text-[12.5px] outline-none sm:w-[240px]"
                  style={inputStyle}
                >
                  {["General", "Rooming list", "Special requests", "Billing", "Dates"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label className="mt-3 block">
                <FieldLabel>Your request</FieldLabel>
                <textarea
                  rows={5}
                  value={otherText}
                  maxLength={1000}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Type your message here…"
                  className="w-full resize-none rounded-[8px] px-3 py-2.5 text-[13px] outline-none"
                  style={inputStyle}
                />
                <span className="mt-1 block text-right text-[11px]" style={{ color: C_INK_3 }}>
                  {otherText.length}/1000
                </span>
              </label>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <GoldLink label="Rooming list &amp; special requests" onClick={() => onPanel("requests")} />
              </div>
              {panel === "requests" && <div className="mt-3">{editor}</div>}

              <div className="mt-3">
                <SolidButton className="w-full">
                  Add to change request <ArrowRight size={14} />
                </SolidButton>
              </div>
            </Card>
          )}
        </div>

        {/* ── right column ── */}
        <aside className="min-w-0 space-y-3">
          {mode === "addons" ? (
            <>
              <Card className="px-5 py-4 sm:px-6">
                <div className="flex items-start justify-between gap-3">
                  <Eyebrow>Configure service</Eyebrow>
                  <button
                    type="button"
                    onClick={() => setService(null)}
                    className="shrink-0 transition-opacity hover:opacity-70"
                    style={{ color: C_INK_3 }}
                    aria-label="Close"
                  >
                    <X size={15} />
                  </button>
                </div>

                {service ? (
                  <>
                    <div className="mt-2.5 flex items-center gap-3">
                      <span className="shrink-0" style={{ color: C_GOLD_2 }}>
                        {service.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-medium" style={{ color: C_INK }}>
                          {service.name}
                        </span>
                        <span className="block truncate text-[11.5px]" style={{ color: C_INK_2 }}>
                          {service.detail}
                        </span>
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2.5">
                      <label className="block">
                        <FieldLabel>Date</FieldLabel>
                        <input type="date" className="w-full rounded-[7px] px-2.5 py-[7px] text-[12.5px] outline-none" style={inputStyle} />
                      </label>
                      <label className="block">
                        <FieldLabel>Preferred time</FieldLabel>
                        <input type="time" className="w-full rounded-[7px] px-2.5 py-[7px] text-[12.5px] outline-none" style={inputStyle} />
                      </label>
                      <label className="col-span-2 block">
                        <FieldLabel>Number of guests</FieldLabel>
                        <input type="number" min={0} placeholder="0" className="w-full rounded-[7px] px-2.5 py-[7px] text-[12.5px] outline-none" style={inputStyle} />
                      </label>
                      <label className="block">
                        <FieldLabel>Type</FieldLabel>
                        <input placeholder="e.g. 3-course dinner" className="w-full rounded-[7px] px-2.5 py-[7px] text-[12.5px] outline-none" style={inputStyle} />
                      </label>
                      <label className="block">
                        <FieldLabel>Dietary requirements</FieldLabel>
                        <input placeholder="e.g. 4 vegetarian" className="w-full rounded-[7px] px-2.5 py-[7px] text-[12.5px] outline-none" style={inputStyle} />
                      </label>
                    </div>

                    <label className="mt-2.5 block">
                      <FieldLabel>Notes / Special requests (optional)</FieldLabel>
                      <textarea
                        rows={3}
                        value={svcNotes}
                        maxLength={500}
                        onChange={(e) => setSvcNotes(e.target.value)}
                        placeholder="Type your message here…"
                        className="w-full resize-none rounded-[8px] px-3 py-2.5 text-[12.5px] outline-none"
                        style={inputStyle}
                      />
                      <span className="mt-1 block text-right text-[11px]" style={{ color: C_INK_3 }}>
                        {svcNotes.length}/500
                      </span>
                    </label>

                    {panel && (panel === "dining" || panel === "services") && <div className="mt-2">{editor}</div>}

                    <div className="mt-3">
                      <SolidButton className="w-full">
                        Add to booking request <ArrowRight size={14} />
                      </SolidButton>
                    </div>
                  </>
                ) : (
                  <p className="mt-2 text-[12.5px]" style={{ color: C_INK_3 }}>
                    Select a service on the left to configure it.
                  </p>
                )}
              </Card>

              <Card className="px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <Eyebrow>Your request so far</Eyebrow>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-[3px] text-[11px] font-medium"
                    style={{ background: INSET_BG, border: `1px solid ${C_HAIR}`, color: C_INK_2 }}
                  >
                    {changed.length} {changed.length === 1 ? "change" : "changes"}
                  </span>
                </div>
                <ul className="mt-2">
                  {changed.length === 0 && (
                    <li className="text-[12.5px]" style={{ color: C_INK_3 }}>
                      Nothing added yet.
                    </li>
                  )}
                  {changed.map((l, i) => (
                    <li
                      key={l.type}
                      className="flex items-center gap-3 py-[9px]"
                      style={i > 0 ? { borderTop: `1px solid ${C_HAIR}` } : undefined}
                    >
                      <span className="shrink-0" style={{ color: C_GOLD_2 }}>
                        <Bed size={14} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium" style={{ color: C_INK }}>
                          {l.type}
                        </span>
                        <span className="block truncate text-[11.5px]" style={{ color: C_INK_2 }}>
                          {l.base} → {l.qty} rooms · {l.diff > 0 ? `+${l.diff}` : l.diff}
                        </span>
                      </span>
                      <span className="flex shrink-0 items-center gap-2.5 text-[11.5px] font-medium" style={{ color: C_GOLD }}>
                        <button type="button" onClick={() => setMode("rooms")} className="transition-opacity hover:opacity-70">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onRoomsChange(rooms.map((x, j) => (j === l.index ? { ...x, qty: l.base } : x)))}
                          className="transition-opacity hover:opacity-70"
                        >
                          Remove
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setService(null)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-[8px] px-3.5 py-2.5 text-[12.5px] font-medium"
                  style={{ border: `1px dashed rgba(27,37,48,0.22)`, background: INSET_BG, color: C_GOLD }}
                >
                  <Plus size={14} /> Add another service or change
                </button>
              </Card>
            </>
          ) : (
            SummaryCard
          )}
        </aside>
      </div>

      {/* ── need help ── */}
      <Card className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Medallion size={34}>
            <MessageSquare size={15} />
          </Medallion>
          <div className="min-w-0">
            <Eyebrow>Need help?</Eyebrow>
            <p className="text-[12.5px]" style={{ color: C_INK_2 }}>
              Questions or changes to your booking?
            </p>
          </div>
        </div>
        <OutlineGold className="shrink-0" onClick={onMessage}>
          Message HotelGroupBook <ArrowRight size={13} />
        </OutlineGold>
      </Card>
    </div>
  );
}
