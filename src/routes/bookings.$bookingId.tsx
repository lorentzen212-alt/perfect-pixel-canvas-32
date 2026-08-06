import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { roomingQueryOptions } from "./rooming-list.$bookingId";
import {
  ArrowLeft,
  Bed,
  Building2,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Download,
  FileText,

  MapPin,
  MessageSquare,
  MoreHorizontal,
  
  Plus,
  Star,
  Trash2,
  UtensilsCrossed,
  ConciergeBell,
  Users,
  X,
  CalendarDays,
} from "lucide-react";
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

const TABS = ["Booking Overview", "Rooming List", "Documents", "Activity"];

type PanelKey = "stay" | "rooms" | "dining" | "services" | "requests" | null;

/* ───────────────────────── primitives ───────────────────────── */

/* metallic gold ramp – used sparingly for decorative accents */
const GOLD_HI = "#F3D987";
const GOLD_MET = "#D4AF37";
const GOLD_MET_MID = "#C5962D";
const GOLD_MET_LOW = "#A97816";
const GOLD_CALM = "#CBAE6B";

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

function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative grid h-[32px] w-[32px] shrink-0 place-items-center">
      <span
        aria-hidden
        className="absolute -inset-2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(243,217,135,0.05), rgba(243,217,135,0) 70%)",
        }}
      />
      <span
        className="relative grid h-full w-full place-items-center rounded-full"
        style={{
          backgroundColor: "rgba(12,30,42,0.5)",
          border: `1px solid rgba(212,175,55,0.26)`,
          color: GOLD_MET,
        }}
      >
        {children}
      </span>
    </span>
  );
}


function CardMenu({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);
  return (
    <span className="relative">
      <button
        type="button"
        aria-label="More actions"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="grid h-[24px] w-[24px] place-items-center rounded-[6px]"
        style={{
          color: MUTED,
          opacity: visible || open ? 1 : 0,
          pointerEvents: visible || open ? "auto" : "none",
          transition: "opacity 200ms ease-out, color 200ms ease-out",
        }}
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <span
          className="absolute right-0 top-[26px] z-20 grid w-[150px] overflow-hidden rounded-[8px] py-1"
          style={{
            backgroundColor: "#26333E",
            border: `1px solid rgba(199,163,74,0.22)`,
            boxShadow: "0 14px 30px -18px rgba(0,0,0,0.8)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {["View details", "Request change", "View history"].map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setOpen(false)}
              className="px-3 py-[7px] text-left text-[12.5px] transition-colors hover:bg-white/5"
              style={{ color: TEXT_2 }}
            >
              {l}
            </button>
          ))}
        </span>
      )}
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
      className="flex h-full flex-col rounded-[11px] px-4 py-3.5"
      style={{
        minHeight: 148,
        background: `linear-gradient(180deg, rgba(255,255,255,0.028), rgba(0,0,0,0.03)), ${CARD}`,
        border: `1px solid ${
          hover && interactive ? "rgba(212,175,55,0.22)" : "rgba(255,255,255,0.08)"
        }`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.035), ${CARD_SHADOW}`,
        transition:
          "border-color 200ms ease, background-color 200ms ease, opacity 200ms ease",
        cursor: interactive ? "pointer" : "default",
        opacity: dimmed ? 0.55 : 1,
      }}
    >
      <div className="flex items-center gap-3">
        <IconBubble>{icon}</IconBubble>
        <h3
          className="text-[11.5px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: TEXT_2 }}
        >
          {title}
        </h3>

        <span className="ml-auto flex items-center gap-2">
          {badge && (
            <span
              className="rounded-[5px] px-2 py-[2px] text-[10.5px]"
              style={{ backgroundColor: "rgba(141,168,138,0.14)", color: GREEN }}
            >
              {badge}
            </span>
          )}
          <CardMenu visible={hover} />
        </span>
      </div>
      <div
        className="mt-2.5 min-h-0 flex-1 overflow-hidden text-[12.5px] leading-[1.5]"
        style={{ color: "rgba(146,157,165,0.86)" }}
      >
        {children}
      </div>
      {action && (
        <div className="mt-3">
          <GoldAction label={action} bright={hover} />
        </div>
      )}
    </article>
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
    void router.preloadRoute({ to: "/rooming-list/$bookingId", params: { bookingId } });
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
  const [tab, setTab] = useState("Booking Overview");
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
        </>
      )}

      {panel === "services" && (
        <>
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

  const arrivalDays = Math.max(
    0,
    Math.ceil((new Date(stay.arrival).getTime() - Date.now()) / 86400000),
  );

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
      lead: `${fmtDate(stay.arrival, { day: "numeric", month: "long" })} – ${fmtDate(stay.departure, { day: "numeric", month: "long", year: "numeric" })}`,
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

  const metaLine = [
    `${dateShort(stay.arrival)} – ${dateShort(stay.departure)}`,
    nightsLabel,
    `${totalRooms} rooms`,
    `${totalGuests} guests`,
    confirmed ? "Deposit paid" : "Awaiting deposit",
    `${services.length} services`,
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

        {/* ══ 1 · cinematic masthead — full bleed, no card ══ */}
        <header className="relative isolate overflow-hidden">
          <img
            src={booking.image}
            alt={`${booking.destination} landscape`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "saturate(0.92) contrast(1.06)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(9,20,29,0.55) 0%, rgba(9,20,29,0.60) 40%, rgba(34,48,58,0.96) 92%, #22303A 100%)",
            }}
          />
          <div className="relative mx-auto w-full max-w-[1240px] px-5 pb-9 pt-16 sm:px-9 sm:pt-24">
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="h-[6px] w-[6px] rounded-full"
                style={{
                  backgroundColor: confirmed ? GREEN : GOLD_SOFT,
                  boxShadow: `0 0 12px ${confirmed ? "rgba(141,168,138,0.9)" : "rgba(208,176,90,0.9)"}`,
                }}
              />
              <span
                className="text-[10.5px] font-medium uppercase tracking-[0.3em]"
                style={{ color: confirmed ? GREEN : GOLD_SOFT }}
              >
                {confirmed ? "Confirmed" : "In progress"}
              </span>
              <span className="text-[10.5px] uppercase tracking-[0.3em]" style={{ color: "rgba(198,209,218,0.5)" }}>
                ·
              </span>
              <span
                className="text-[10.5px] uppercase tracking-[0.3em]"
                style={{ color: "rgba(198,209,218,0.62)" }}
              >
                {booking.type === "leisure" ? "Leisure" : "Meetings & Events"}
              </span>
            </div>

            <h1
              className="mt-4 max-w-[15ch] text-[46px] leading-[0.98] sm:text-[68px]"
              style={{ color: "#F7F4ED", fontFamily: SERIF, fontWeight: 300 }}
            >
              {booking.name}
            </h1>

            <p
              className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px]"
              style={{ color: "rgba(216,226,233,0.72)" }}
            >
              {metaLine.map((m, i) => (
                <span key={m + i} className="flex items-center gap-3">
                  {i > 0 && (
                    <span aria-hidden style={{ color: "rgba(216,226,233,0.28)" }}>
                      /
                    </span>
                  )}
                  {m}
                </span>
              ))}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3">
              <span className="text-[11.5px]" style={{ color: "rgba(198,209,218,0.55)" }}>
                Hotel ref{" "}
                <span style={{ color: "#E9E5DA", letterSpacing: "0.04em" }}>{hotelRef || "—"}</span>
              </span>
              <span className="inline-flex items-center gap-2 text-[11.5px]" style={{ color: "rgba(198,209,218,0.55)" }}>
                Booking ref{" "}
                <span style={{ color: "#E9E5DA", letterSpacing: "0.04em" }}>{booking.reference}</span>
                <button
                  type="button"
                  aria-label="Copy booking reference"
                  onClick={() => {
                    navigator.clipboard?.writeText(booking.reference);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  className="transition-opacity hover:opacity-80"
                  style={{ color: copied ? GREEN : GOLD_SOFT }}
                >
                  {copied ? <Check size={13} /> : <Copy size={12} />}
                </button>
              </span>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1240px] px-5 pb-20 sm:px-9">
          {/* ══ tabs — quiet segmented rail ══ */}
          <nav
            className="flex items-center gap-1 overflow-x-auto rounded-full p-1"
            style={{
              width: "fit-content",
              maxWidth: "100%",
              backgroundColor: "rgba(11,25,35,0.55)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {TABS.map((t) => {
              const active = t === tab;
              const cls =
                "whitespace-nowrap rounded-full px-4 py-[7px] text-[12.5px] transition-all duration-200";
              const st: React.CSSProperties = active
                ? { color: "#1E1706", background: `linear-gradient(180deg, ${GOLD_HI}, ${GOLD_MET_MID})`, fontWeight: 600 }
                : { color: MUTED };
              if (t === "Rooming List") {
                return (
                  <Link
                    key={t}
                    to="/rooming-list/$bookingId"
                    params={{ bookingId: booking.id }}
                    className={cls}
                    style={st}
                  >
                    {t}
                  </Link>
                );
              }
              return (
                <button key={t} type="button" onClick={() => setTab(t)} className={cls} style={st}>
                  {t}
                </button>
              );
            })}
          </nav>

          {tab !== "Booking Overview" ? (
            <section className="mt-14 py-16 text-center">
              <h3 className="text-[26px]" style={{ color: TEXT, fontFamily: SERIF }}>
                {tab}
              </h3>
              <p className="mt-2 text-[13px]" style={{ color: MUTED }}>
                {tab} for {booking.reference} will appear here.
              </p>
            </section>
          ) : (
            <>
              {/* ══ 2 · focus band — the one thing that matters now ══ */}
              <section
                className="mt-10 grid gap-10 border-y py-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16"
                style={{ borderColor: "rgba(255,255,255,0.07)" }}
              >
                <div className="min-w-0">
                  <p
                    className="text-[10px] font-semibold uppercase tracking-[0.32em]"
                    style={{ color: GOLD_SOFT }}
                  >
                    Needs your attention
                  </p>
                  <h2
                    className="mt-4 text-[32px] leading-[1.12] sm:text-[40px]"
                    style={{ color: "#F5F2EA", fontFamily: SERIF, fontWeight: 300 }}
                  >
                    Your rooming list is{" "}
                    <span style={{ color: GOLD_HI }}>{progress}% complete</span>
                    <span style={{ color: MUTED }}> — </span>
                    <span className="whitespace-nowrap">6 days remaining</span>
                  </h2>
                  <p className="mt-4 text-[13.5px]" style={{ color: TEXT_2 }}>
                    {roomingStats
                      ? `${roomingStats.filled} of ${roomingStats.total} guest names submitted`
                      : rooming
                        ? `${rooming.complete} of ${rooming.total} guest names submitted`
                        : "Guest names not yet submitted"}
                    . The hotel needs the full list before final confirmation.
                  </p>

                  <div
                    className="mt-7 h-[3px] w-full max-w-[520px] overflow-hidden rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.09)" }}
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

                  <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <Link
                      to="/rooming-list/$bookingId"
                      params={{ bookingId: booking.id }}
                      className="inline-flex items-center gap-2.5 rounded-full px-8 py-[14px] text-[14px] font-semibold transition-transform hover:-translate-y-[1px]"
                      style={{
                        background: `linear-gradient(180deg, ${GOLD_HI}, ${GOLD_MET_MID})`,
                        color: "#231B06",
                        boxShadow: "0 18px 40px -20px rgba(212,175,55,0.9)",
                      }}
                    >
                      Continue rooming list
                      <span aria-hidden>→</span>
                    </Link>
                    <GoldAction label="Request a change" onClick={() => setPanel("stay")} />
                  </div>
                </div>

                <div className="flex items-center gap-10 lg:flex-col lg:items-end lg:gap-8">
                  <div className="text-right">
                    <p
                      className="text-[56px] leading-none sm:text-[72px]"
                      style={{ color: "#F3F0E8", fontFamily: SERIF, fontWeight: 300 }}
                    >
                      {arrivalDays}
                    </p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.3em]" style={{ color: MUTED }}>
                      Days to arrival
                    </p>
                  </div>
                  <Ring value={progress} size={104} />
                </div>
              </section>

              {/* ══ 3 · workspace ledger + rail ══ */}
              <div className="mt-14 grid gap-14 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-20">
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-6">
                    <h2 className="text-[24px]" style={{ color: TEXT, fontFamily: SERIF, fontWeight: 300 }}>
                      The stay
                    </h2>
                    <span className="text-[11.5px]" style={{ color: MUTED }}>
                      {booking.hotel ?? "Hotel to be assigned"}
                    </span>
                  </div>

                  <ul className="mt-6">
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
                          {open && <div className="pb-7">{editor}</div>}
                        </li>
                      );
                    })}
                  </ul>

                  {/* ══ 4 · recent activity — quiet ledger ══ */}
                  <div className="mt-16">
                    <div className="flex items-baseline justify-between gap-6">
                      <h2 className="text-[24px]" style={{ color: TEXT, fontFamily: SERIF, fontWeight: 300 }}>
                        Activity
                      </h2>
                      <GoldAction label="View all" onClick={() => setTab("Activity")} />
                    </div>
                    <ul className="mt-5">
                      {[
                        { icon: <Check size={13} />, tone: GREEN, t: "Hotel approved changes", when: "Today, 09:15" },
                        { icon: <FileText size={13} />, tone: GOLD_SOFT, t: "Contract uploaded", when: "Yesterday, 14:22" },
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
                          <span className="shrink-0" style={{ color: a.tone }}>
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
                  </div>
                </div>

                {/* ══ 5 · vertical journey rail ══ */}
                <aside className="min-w-0 self-start xl:sticky xl:top-[84px]">
                  <h2
                    className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                    style={{ color: MUTED }}
                  >
                    Booking journey
                  </h2>

                  <ol className="mt-6">
                    {journey.map((m, i) => (
                      <li key={m.label} className="relative flex gap-4 pb-7 last:pb-0">
                        {i < journey.length - 1 && (
                          <span
                            aria-hidden
                            className="absolute left-[9px] top-[20px] w-px"
                            style={{
                              bottom: 2,
                              background:
                                m.state === "done"
                                  ? "rgba(141,168,138,0.4)"
                                  : "rgba(255,255,255,0.09)",
                            }}
                          />
                        )}
                        <span
                          className="relative mt-[3px] grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full"
                          style={
                            m.state === "done"
                              ? { border: `1px solid rgba(141,168,138,0.55)`, color: GREEN }
                              : m.state === "active"
                                ? {
                                    background: `linear-gradient(180deg, ${GOLD_HI}, ${GOLD_MET_MID})`,
                                    boxShadow: "0 0 0 4px rgba(212,175,55,0.12)",
                                  }
                                : { border: "1px solid rgba(255,255,255,0.16)" }
                          }
                        >
                          {m.state === "done" && <Check size={11} />}
                        </span>
                        <span className="min-w-0">
                          <span
                            className="block text-[13px]"
                            style={{
                              color: m.state === "active" ? "#F3EFE6" : m.state === "done" ? TEXT_2 : MUTED,
                              fontWeight: m.state === "active" ? 500 : 400,
                            }}
                          >
                            {m.label}
                          </span>
                          <span
                            className="mt-0.5 block text-[11.5px]"
                            style={{ color: m.state === "active" ? GOLD_SOFT : MUTED }}
                          >
                            {m.sub}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div
                    className="mt-9 pt-8"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: MUTED }}>
                      Deadlines
                    </h2>
                    <ul className="mt-4">
                      {[
                        { d: "04", m: "Sep", t: "Rooming list", s: "Due in 6 days", go: "Rooming List" },
                        { d: "08", m: "Sep", t: "Final guest details", s: "Due in 10 days", go: "Activity" },
                      ].map((it, i) => (
                        <li key={it.t}>
                          <button
                            type="button"
                            onClick={() =>
                              it.go === "Rooming List"
                                ? navigate({ to: "/rooming-list/$bookingId", params: { bookingId: booking.id } })
                                : setTab(it.go)
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
                  </div>

                  <div className="mt-9 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                    <h2 className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: MUTED }}>
                      Documents
                    </h2>
                    <div className="mt-4 grid gap-3">
                      <button
                        type="button"
                        className="inline-flex items-center justify-between gap-3 text-left text-[12.5px] transition-opacity hover:opacity-80"
                        style={{ color: TEXT_2 }}
                      >
                        Booking contract
                        <Download size={13} style={{ color: GOLD_SOFT }} />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center justify-between gap-3 text-left text-[12.5px] transition-opacity hover:opacity-80"
                        style={{ color: TEXT_2 }}
                      >
                        Stay summary
                        <Download size={13} style={{ color: GOLD_SOFT }} />
                      </button>
                    </div>
                    <div className="mt-6">
                      <GoldAction label="Contact your coordinator" />
                    </div>
                  </div>
                </aside>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
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
      className="grid w-full grid-cols-[132px_minmax(0,1fr)_auto] items-baseline gap-6 py-7 text-left"
      style={{ opacity: dimmed ? 0.4 : 1, transition: "opacity 220ms ease" }}
    >
      <span className="flex items-center gap-2.5" style={{ color: open || hover ? GOLD_SOFT : MUTED, transition: "color 200ms ease" }}>
        <span className="shrink-0">{icon}</span>
        <span className="truncate text-[10.5px] font-semibold uppercase tracking-[0.2em]">{label}</span>
      </span>
      <span className="min-w-0">
        <span
          className="block text-[19px] leading-tight"
          style={{ color: "#F3F1EB", fontFamily: SERIF, fontWeight: 300 }}
        >
          {lead}
        </span>
        <span className="mt-1.5 block truncate text-[12.5px]" style={{ color: "rgba(146,157,165,0.9)" }}>
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

/* ───────────────────────── workspace primitives ───────────────────────── */

function Fact({
  icon,
  value,
  label,
  divider,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  divider?: boolean;
  tone?: string;
}) {
  return (
    <div
      className="flex items-center gap-3.5 px-1 xl:px-5"
      style={divider ? { borderLeft: "1px solid rgba(255,255,255,0.06)" } : undefined}
    >
      <span className="shrink-0" style={{ color: GOLD_MET }}>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[14px] font-medium" style={{ color: tone ?? "#F1EFE9" }}>
          {value}
        </span>
        <span className="mt-0.5 block truncate text-[11.5px]" style={{ color: MUTED }}>
          {label}
        </span>
      </span>
    </div>
  );
}

function Module({
  icon,
  title,
  lead,
  children,
  action,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  lead: string;
  children?: React.ReactNode;
  action: string;
  onAction: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onAction}
      className="flex min-h-[176px] cursor-pointer flex-col rounded-[14px] px-6 py-6"
      style={{
        backgroundColor: hover ? "rgba(255,255,255,0.028)" : "transparent",
        transition: "background-color 200ms ease",
      }}
    >
      <div className="flex items-center gap-2.5">
        <span style={{ color: GOLD_MET }}>{icon}</span>
        <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.22em]" style={{ color: TEXT_2 }}>
          {title}
        </h3>
      </div>
      <p className="mt-3.5 text-[17px] leading-tight" style={{ color: "#F3F1EB", fontFamily: SERIF }}>
        {lead}
      </p>
      <div className="mt-2 flex-1 text-[12.5px] leading-[1.6]" style={{ color: "rgba(146,157,165,0.88)" }}>
        {children}
      </div>
      <div className="mt-4">
        <GoldAction label={action} bright={hover} />
      </div>
    </article>
  );
}

function RailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-[16px] px-5 py-5"
      style={{
        background: `linear-gradient(180deg, rgba(255,255,255,0.026), rgba(0,0,0,0.03)), ${CARD}`,
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: CARD_SHADOW,
      }}
    >
      <h3 className="text-[10.5px] font-semibold uppercase tracking-[0.22em]" style={{ color: TEXT_2 }}>
        {title}
      </h3>
      <div className="mt-3.5">{children}</div>
    </section>
  );
}
