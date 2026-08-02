import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isProfileComplete, useAuth } from "@/lib/auth";
import { readPendingRequest, clearPendingRequest } from "@/lib/pendingRequest";
import { fetchBookings, createBooking } from "@/lib/bookingsApi";
import {
  Bell,
  BedDouble,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  FileText,
  Grid2X2,
  Hourglass,
  LayoutList,
  LifeBuoy,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Moon,
  MoreVertical,
  Plus,
  Search,
  Settings,
  User,
  Users,
  X,
  ArrowRight,
  FileSignature,
} from "lucide-react";
import logo from "@/assets/hotelgroupbook-logo.png.asset.json";
import bellAsset from "@/assets/status-proposal-bell.jpg.asset.json";
import mountains from "@/assets/dashboard-mountains.jpg";

import {
  STATUS_META,
  filterBookings,
  formatRange,
  type Booking,
  type BookingStatus,
  type DateFilter,
} from "@/lib/bookings";

export const Route = createFileRoute("/manage-bookings")({
  component: ManageBookings,
  head: () => ({
    meta: [
      { title: "My Bookings — HotelGroupBook Dashboard" },
      {
        name: "description",
        content:
          "Manage every group stay and event in one calm dashboard: statuses, offers, rooming lists and documents.",
      },
      { property: "og:title", content: "My Bookings — HotelGroupBook Dashboard" },
      {
        property: "og:description",
        content:
          "Manage every group stay and event in one calm dashboard: statuses, offers, rooming lists and documents.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

/* ── palette ─────────────────────────────────────────── */
const SIDEBAR = "#060C12";
const PAGE = "#080F17";
const PANEL = "rgba(16,26,37,0.72)";
const HAIRLINE = "rgba(140,166,190,0.14)";
const TEXT = "#F1EFE9";
const TEXT_2 = "#B6C3CE";
const MUTED = "#7F8F9C";
const GOLD = "#C9A24B";
const GOLD_SOFT = "#E0BE6B";
const BLUE = "#4F86C6";
const GREEN = "#5E9C6A";
const RED = "#B4636A";

const SERIF = '"Cormorant Garamond", "EB Garamond", Georgia, serif';
const SANS = 'Inter, "Helvetica Neue", Arial, sans-serif';

/* ── status grouping (visual layer over existing statuses) ── */

type Group = "all" | "proposal" | "awaiting" | "confirmed" | "attention" | "cancelled";

function groupOf(b: Booking): Exclude<Group, "all"> {
  const s = b.status as string;
  if (s === "cancelled") return "cancelled";
  if (b.status === "rooming_list_required") return "attention";
  if (
    b.status === "offers_ready" ||
    b.status === "offer_selected" ||
    b.status === "contract_ready"
  )
    return "proposal";
  if (b.status === "request_submitted" || b.status === "hotel_sourcing") return "awaiting";
  return "confirmed";
}

const GROUP_LABEL: Record<Exclude<Group, "all">, string> = {
  proposal: "Proposal Ready",
  awaiting: "Awaiting Response",
  confirmed: "Confirmed",
  attention: "Needs Attention",
  cancelled: "Cancelled",
};

const GROUP_COLOR: Record<Exclude<Group, "all">, string> = {
  proposal: GOLD,
  awaiting: BLUE,
  confirmed: GREEN,
  attention: "#D69A4E",
  cancelled: RED,
};

/* primary action follows the real booking status and keeps its destination */
function primaryAction(b: Booking) {
  switch (b.action.kind) {
    case "rooming_list":
      return { label: "Complete Rooming List", to: "/rooming-list/$bookingId" as const };
    case "review_offers":
      return { label: "View proposal", to: "/bookings/$bookingId" as const };
    case "on_track":
      return { label: "View status", to: "/bookings/$bookingId" as const };
    default:
      return { label: "View booking", to: "/bookings/$bookingId" as const };
  }
}

const TRACK_STEPS = [
  { key: "received", label: "Request\nreceived", icon: Mail },
  { key: "sourcing", label: "Hotels\nsourcing", icon: Search },
  { key: "proposal", label: "Proposal\nready", icon: ClipboardList },
  { key: "confirmed", label: "Confirmed", icon: Check },
] as const;

function trackIndex(status: BookingStatus) {
  switch (status) {
    case "request_submitted":
      return 0;
    case "hotel_sourcing":
      return 1;
    case "offers_ready":
    case "offer_selected":
    case "contract_ready":
      return 2;
    default:
      return 3;
  }
}

/* ── small pieces ────────────────────────────────────── */

function Timeline({ booking }: { booking: Booking }) {
  const cancelled = (booking.status as string) === "cancelled";
  const active = trackIndex(booking.status);
  const tone = GROUP_COLOR[groupOf(booking)];

  if (cancelled) {
    return (
      <div
        className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-[12px]"
        style={{ border: `1px solid ${RED}44`, color: RED, background: "rgba(180,99,106,0.07)" }}
      >
        <X size={14} /> Booking cancelled — history preserved
      </div>
    );
  }

  return (
    <div className="relative grid grid-cols-4 gap-1">
      <div
        className="absolute left-[12.5%] right-[12.5%] top-[13px] h-px"
        style={{ backgroundColor: "rgba(140,166,190,0.20)" }}
        aria-hidden
      />
      <div
        className="absolute left-[12.5%] top-[13px] h-px"
        style={{ width: `${(active / 3) * 75}%`, background: tone, opacity: 0.7 }}
        aria-hidden
      />
      {TRACK_STEPS.map((s, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <div key={s.key} className="relative flex flex-col items-center gap-[6px]">
            <span
              className="grid h-[27px] w-[27px] place-items-center rounded-full"
              style={{
                background: done
                  ? tone
                  : current
                    ? "rgba(201,162,75,0.10)"
                    : "rgba(12,20,29,0.85)",
                border: `1px solid ${done || current ? tone : "rgba(140,166,190,0.26)"}`,
                color: done ? "#0A121A" : current ? tone : "#7C8B98",
              }}
            >
              <s.icon size={13} strokeWidth={1.8} />
            </span>
            <span
              className="whitespace-pre-line text-center text-[10.5px] leading-[1.2]"
              style={{ color: done || current ? tone : "#71818E" }}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TypeChip({ type }: { type: Booking["type"] }) {
  return (
    <span
      className="inline-flex items-center rounded-[4px] px-[7px] py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.18em]"
      style={{
        color: GOLD_SOFT,
        border: `1px solid ${GOLD}44`,
        background: "rgba(201,162,75,0.07)",
      }}
    >
      {type === "leisure" ? "Leisure" : "M&E"}
    </span>
  );
}

function MetaItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-[7px] whitespace-nowrap text-[12.5px]"
      style={{ color: TEXT_2 }}
    >
      <span className="shrink-0" style={{ color: MUTED }}>
        {icon}
      </span>
      {children}
    </span>
  );
}

function RowMenu({ booking }: { booking: Booking }) {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "Booking details", to: "/bookings/$bookingId" as const },
    { label: "Edit booking", to: "/bookings/$bookingId" as const },
    { label: "Request change", to: "/bookings/$bookingId" as const },
    { label: "Rooming list", to: "/rooming-list/$bookingId" as const },
    { label: "Documents & contract", to: "/bookings/$bookingId" as const },
    { label: "Cancel booking", to: "/bookings/$bookingId" as const },
  ];
  return (
    <div className="relative">
      <button
        type="button"
        aria-label={`More actions for ${booking.name}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white/5"
        style={{ color: MUTED }}
      >
        <MoreVertical size={17} />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-[12px] py-1.5"
            style={{
              backgroundColor: "#101A24",
              border: `1px solid ${HAIRLINE}`,
              boxShadow: "0 24px 50px -24px rgba(0,0,0,0.75)",
            }}
          >
            {items.map((it) => (
              <Link
                key={it.label}
                to={it.to}
                params={{ bookingId: booking.id }}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-[13px] hover:bg-white/5"
                style={{ color: it.label.startsWith("Cancel") ? RED : TEXT_2 }}
              >
                {it.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── booking card ────────────────────────────────────── */

function BookingCard({ booking, compact }: { booking: Booking; compact?: boolean }) {
  const g = groupOf(booking);
  const tone = GROUP_COLOR[g];
  const action = primaryAction(booking);

  const info = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <TypeChip type={booking.type} />
          <Link
            to="/bookings/$bookingId"
            params={{ bookingId: booking.id }}
            className="mt-1.5 block truncate transition-opacity hover:opacity-85"
          >
            <h3
              className="truncate text-[25px] leading-[1.1]"
              style={{ color: TEXT, fontFamily: SERIF, fontWeight: 400 }}
            >
              {booking.name}
            </h3>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] sm:inline"
            style={{ color: tone }}
          >
            {GROUP_LABEL[g]}
          </span>
          <Link
            to={action.to}
            params={{ bookingId: booking.id }}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-[10px] px-4 py-2 text-[12.5px] transition-colors hover:bg-white/5"
            style={{ color: TEXT, border: `1px solid ${HAIRLINE}` }}
          >
            {action.label}
            <ArrowRight size={14} style={{ color: tone }} />
          </Link>
          <RowMenu booking={booking} />
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <MetaItem icon={<MapPin size={14} strokeWidth={1.6} />}>{booking.destination}</MetaItem>
        <MetaItem icon={<CalendarDays size={14} strokeWidth={1.6} />}>
          {formatRange(booking.startDate, booking.endDate)}
        </MetaItem>
        <MetaItem icon={<Moon size={14} strokeWidth={1.6} />}>{booking.nights} nights</MetaItem>
        {booking.type === "me" ? (
          <>
            <MetaItem icon={<BedDouble size={14} strokeWidth={1.6} />}>
              {booking.meetingSpaces ?? 0} meeting spaces
            </MetaItem>
            <MetaItem icon={<Users size={14} strokeWidth={1.6} />}>
              {booking.delegates ?? 0} delegates
            </MetaItem>
          </>
        ) : (
          <>
            <MetaItem icon={<BedDouble size={14} strokeWidth={1.6} />}>
              {booking.rooms ?? 0} rooms
            </MetaItem>
            <MetaItem icon={<Users size={14} strokeWidth={1.6} />}>
              {booking.guests ?? 0} guests
            </MetaItem>
          </>
        )}
      </div>

      <div
        className={
          compact
            ? "mt-4 grid grid-cols-2 gap-4"
            : "mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p
              className="text-[9.5px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: GOLD }}
            >
              Your reference
            </p>
            <p className="mt-1 text-[13.5px]" style={{ color: TEXT_2 }}>
              {booking.reference}
            </p>
          </div>
          <div>
            <p
              className="text-[9.5px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: MUTED }}
            >
              Hotel reference
            </p>
            <p className="mt-1 text-[13.5px]" style={{ color: booking.hotelReference ? TEXT_2 : MUTED }}>
              {booking.hotelReference ?? "—"}
            </p>
          </div>
        </div>
        <div className={compact ? "col-span-2" : ""}>
          <Timeline booking={booking} />
        </div>
      </div>

      {booking.statusNote && (
        <p className="mt-3 truncate text-[12.5px]" style={{ color: MUTED }}>
          {booking.statusNote}
        </p>
      )}
    </>
  );

  if (compact) {
    return (
      <article
        className="overflow-hidden rounded-[16px]"
        style={{ background: PANEL, border: `1px solid ${HAIRLINE}` }}
      >
        <img
          src={booking.image}
          alt={`${booking.destination} — ${booking.name}`}
          loading="lazy"
          className="h-[150px] w-full object-cover"
          style={{ filter: "saturate(0.95) brightness(0.82)" }}
        />
        <div className="p-5">{info}</div>
      </article>
    );
  }

  return (
    <article
      className="grid grid-cols-1 overflow-hidden rounded-[16px] sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)]"
      style={{
        background: PANEL,
        border: `1px solid ${HAIRLINE}`,
        boxShadow: "0 20px 40px -32px rgba(0,0,0,0.85)",
      }}
    >
      <img
        src={booking.image}
        alt={`${booking.destination} — ${booking.name}`}
        loading="lazy"
        className="h-[150px] w-full object-cover sm:h-full"
        style={{ filter: "saturate(0.95) brightness(0.82)" }}
      />
      <div className="min-w-0 p-5 sm:p-6">{info}</div>
    </article>
  );
}

/* ── status cards ────────────────────────────────────── */

function StatusCard({
  label,
  count,
  description,
  tone,
  overlay,
  image,
  icon,
  active,
  onClick,
}: {
  label: string;
  count: number;
  description: string;
  tone: string;
  overlay: string;
  image: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="relative flex h-[210px] flex-col overflow-hidden rounded-[15px] p-5 text-left transition-transform hover:-translate-y-px"
      style={{
        border: `1px solid ${active ? tone : `${tone}55`}`,
        boxShadow: active ? `0 0 0 1px ${tone}55` : "0 18px 36px -30px rgba(0,0,0,0.9)",
      }}
    >
      <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ filter: "saturate(0.85) brightness(0.62)" }} />
      <span
        className="absolute inset-0"
        aria-hidden
        style={{ background: overlay }}
      />

      <span
        className="relative grid h-11 w-11 place-items-center rounded-full"
        style={{ border: `1px solid ${tone}`, color: tone }}
      >
        {icon}
      </span>
      <span
        className="relative mt-4 block text-[11px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: tone }}
      >
        {label}
      </span>
      <span
        className="relative mt-1 block text-[44px] leading-none"
        style={{ color: TEXT, fontFamily: SERIF }}
      >
        {count}
      </span>
      <span className="relative mt-auto flex items-center justify-between">
        <span className="text-[13px]" style={{ color: TEXT_2 }}>
          {description}
        </span>
        <span
          className="grid h-9 w-9 place-items-center rounded-full"
          style={{ border: `1px solid ${tone}`, color: tone }}
        >
          <ArrowRight size={16} />
        </span>
      </span>
    </button>
  );
}

/* ── sidebar ─────────────────────────────────────────── */

const PRIMARY_NAV = [
  { label: "Overview", icon: CalendarCheck },
  { label: "My Bookings", icon: CalendarDays },
  { label: "Rooming Lists", icon: ClipboardList },
  { label: "Documents", icon: FileText },
  { label: "Messages", icon: MessageSquare },
];

const SECONDARY_NAV = [
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
  { label: "Support", icon: LifeBuoy },
];

function Sidebar({
  active,
  roomingBookingId,
  displayName,
  initials,
  email,
  onSignOut,
}: {
  active: string;
  roomingBookingId?: string;
  displayName: string;
  initials: string;
  email: string;
  onSignOut: () => void;
}) {
  const row =
    "relative flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[13.5px] transition-colors";

  const renderItem = (
    item: { label: string; icon: typeof User },
    opts: { to?: "/rooming-list/$bookingId" | "/account"; params?: { bookingId: string } },
  ) => {
    const isActive = item.label === active;
    const style = {
      background: isActive ? "rgba(255,255,255,0.055)" : "transparent",
      color: isActive ? TEXT : TEXT_2,
    };
    const inner = (
      <>
        {isActive && (
          <span
            className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full"
            style={{ backgroundColor: GOLD }}
          />
        )}
        <item.icon size={17} style={{ color: isActive ? GOLD : MUTED }} />
        {item.label}
      </>
    );
    if (opts.to === "/rooming-list/$bookingId" && opts.params) {
      return (
        <Link key={item.label} to={opts.to} params={opts.params} className={row} style={style}>
          {inner}
        </Link>
      );
    }
    if (opts.to === "/account") {
      return (
        <Link key={item.label} to="/account" className={row} style={style}>
          {inner}
        </Link>
      );
    }
    return (
      <button key={item.label} type="button" className={row} style={style}>
        {inner}
      </button>
    );
  };

  return (
    <div className="flex h-full flex-col px-4 py-7" style={{ background: SIDEBAR }}>
      <Link to="/" className="block px-2 py-2">
        <img src={logo.url} alt="HotelGroupBook" className="h-12 w-auto object-contain object-left" />
      </Link>

      <nav className="mt-10 space-y-1">
        {PRIMARY_NAV.map((item) =>
          renderItem(
            item,
            item.label === "Rooming Lists" && roomingBookingId
              ? { to: "/rooming-list/$bookingId", params: { bookingId: roomingBookingId } }
              : {},
          ),
        )}
      </nav>

      <div className="mt-auto space-y-1 pt-10">
        {SECONDARY_NAV.map((item) =>
          renderItem(item, item.label === "Profile" ? { to: "/account" } : {}),
        )}
      </div>

      <div
        className="mt-6 flex items-center gap-3 pt-5"
        style={{ borderTop: `1px solid rgba(255,255,255,0.07)` }}
      >
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold"
          style={{ backgroundColor: "rgba(201,162,75,0.16)", color: GOLD }}
        >
          {initials || "—"}
        </span>
        <span className="min-w-0 flex-1">
          <Link to="/account" className="block truncate text-[12.5px]" style={{ color: TEXT }}>
            {displayName || email}
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="mt-0.5 inline-flex items-center gap-1.5 text-[11.5px]"
            style={{ color: GOLD }}
          >
            <LogOut size={12} /> Log out
          </button>
        </span>
      </div>
    </div>
  );
}

/* ── select ──────────────────────────────────────────── */

function Select<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full appearance-none rounded-[11px] px-4 py-[11px] pr-9 text-[13.5px] outline-none"
        style={{ backgroundColor: "rgba(14,23,33,0.8)", border: `1px solid ${HAIRLINE}`, color: TEXT_2 }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ backgroundColor: "#101A24" }}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        style={{ color: MUTED }}
      />
    </div>
  );
}

/* ── page ────────────────────────────────────────────── */

type DateChoice = "all" | "upcoming" | "this_month" | "next_90" | "past";

function ManageBookings() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<Group>("all");
  const [dateChoice, setDateChoice] = useState<DateChoice>("all");
  const [view, setView] = useState<"grid" | "list">("list");
  const [navOpen, setNavOpen] = useState(false);

  const navigate = useNavigate();
  const { session, loading: authLoading, profile, signOut } = useAuth();

  useEffect(() => {
    if (!authLoading && !session) {
      navigate({ to: "/auth", search: { next: "/manage-bookings" }, replace: true });
    }
  }, [authLoading, session, navigate]);

  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    enabled: Boolean(session),
  });

  /* a request built before signing in is submitted automatically on arrival */
  const pendingHandled = useRef(false);
  useEffect(() => {
    if (!session || pendingHandled.current) return;
    const pending = readPendingRequest();
    if (!pending) return;
    pendingHandled.current = true;
    void createBooking(session.user.id, pending)
      .then(() => {
        clearPendingRequest();
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
      })
      .catch((err) => console.error("[pending request]", err));
  }, [session, queryClient]);

  const results = useMemo(() => {
    const dateFilter: DateFilter =
      dateChoice === "this_month" ? "all" : (dateChoice as DateFilter);
    let list = filterBookings(bookings, { query, status: "all", date: dateFilter });
    if (dateChoice === "this_month") {
      const now = new Date();
      list = list.filter((b) => {
        const d = new Date(b.startDate);
        return (
          !Number.isNaN(d.getTime()) &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    }
    if (group !== "all") list = list.filter((b) => groupOf(b) === group);
    return list;
  }, [bookings, query, group, dateChoice]);

  const counts = useMemo(() => {
    const c = { proposal: 0, awaiting: 0, confirmed: 0, attention: 0, cancelled: 0 };
    for (const b of bookings) c[groupOf(b)] += 1;
    return c;
  }, [bookings]);

  const roomingTarget =
    bookings.find((b) => b.status === "rooming_list_required")?.id ?? bookings[0]?.id;

  const activity = useMemo(
    () =>
      bookings
        .filter((b) => b.statusNote || b.status)
        .slice(0, 2)
        .map((b) => ({
          id: b.id,
          title: b.statusNote ?? STATUS_META[b.status]?.label ?? "Booking update",
          sub: b.name,
          tone: GROUP_COLOR[groupOf(b)],
        })),
    [bookings],
  );

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim() || profile.email
    : (session?.user.email ?? "");
  const firstName = profile?.first_name?.trim() || displayName.split("@")[0] || "back";
  const initials =
    (profile?.first_name?.[0] ?? displayName[0] ?? "").toUpperCase() +
    (profile?.last_name?.[0] ?? "").toUpperCase();

  const heroImage = bookings[0]?.image ?? mountains;

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE, fontFamily: SANS }}>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[236px] lg:block">
        <Sidebar
          active="My Bookings"
          roomingBookingId={roomingTarget}
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
            className="absolute inset-0 bg-black/70"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[268px]">
            <Sidebar
              active="My Bookings"
              roomingBookingId={roomingTarget}
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

      <div className="lg:pl-[236px]">
        <main className="relative min-h-screen" style={{ backgroundColor: PAGE }}>
          {/* cinematic hero backdrop */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px]" aria-hidden>
            <img
              src={mountains}
              alt=""
              className="h-full w-full object-cover"
              style={{ filter: "saturate(0.7) brightness(0.45)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, rgba(6,12,18,0.55) 0%, rgba(7,14,21,0.78) 45%, ${PAGE} 100%)`,
              }}
            />
          </div>

          <div className="relative px-4 pb-14 pt-6 sm:px-6 lg:px-10">
            {/* mobile bar */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setNavOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-md"
                style={{ color: TEXT_2, border: `1px solid ${HAIRLINE}` }}
              >
                <Menu size={18} />
              </button>
              <img src={logo.url} alt="HotelGroupBook" className="h-7 w-auto" />
            </div>

            {/* greeting */}
            <header className="flex flex-wrap items-start justify-between gap-5">
              <div className="min-w-0">
                <p
                  className="text-[11px] font-semibold uppercase tracking-[0.28em]"
                  style={{ color: TEXT_2 }}
                >
                  Dark Luxe
                </p>
                <h1
                  className="mt-3 text-[42px] leading-[1.02] sm:text-[54px]"
                  style={{ color: TEXT, fontFamily: SERIF, fontWeight: 400 }}
                >
                  Welcome {firstName}
                </h1>
                <p className="mt-2 text-[15px]" style={{ color: TEXT_2 }}>
                  Here&rsquo;s what&rsquo;s happening with your group stays.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <Link
                  to="/book-leisure"
                  className="inline-flex items-center gap-2 rounded-[11px] px-4 py-2.5 text-[13.5px]"
                  style={{
                    backgroundColor: "rgba(12,22,32,0.6)",
                    border: `1px solid ${GOLD}77`,
                    color: GOLD_SOFT,
                  }}
                >
                  <Plus size={16} /> New booking
                </Link>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="grid h-10 w-10 place-items-center rounded-full"
                  style={{ border: `1px solid ${HAIRLINE}`, color: TEXT_2 }}
                >
                  <Bell size={17} />
                </button>
                <Link
                  to="/account"
                  aria-label="Your account"
                  className="grid h-10 w-10 place-items-center rounded-full text-[12px] font-semibold"
                  style={{ border: `1px solid ${HAIRLINE}`, color: GOLD }}
                >
                  {initials || "—"}
                </Link>
              </div>
            </header>

            {/* status cards + activity */}
            <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.95fr)]">
              <StatusCard
                label="Proposal ready"
                count={counts.proposal}
                description="Proposal ready"
                tone={GOLD}
                overlay="linear-gradient(135deg, rgba(120, 72, 20, 0.75) 0%, rgba(40, 28, 18, 0.85) 100%)"
                image={bellAsset.url}
                icon={<FileSignature size={19} />}
                active={group === "proposal"}
                onClick={() => setGroup(group === "proposal" ? "all" : "proposal")}
              />
              <StatusCard
                label="Awaiting response"
                count={counts.awaiting}
                description="Hotels preparing"
                tone={BLUE}
                overlay="linear-gradient(135deg, rgba(30, 64, 120, 0.75) 0%, rgba(18, 24, 40, 0.85) 100%)"
                image={bookings.find((b) => groupOf(b) === "awaiting")?.image ?? heroImage}
                icon={<Hourglass size={19} />}
                active={group === "awaiting"}
                onClick={() => setGroup(group === "awaiting" ? "all" : "awaiting")}
              />
              <StatusCard
                label="Confirmed"
                count={counts.confirmed}
                description="Confirmed booking"
                tone={GREEN}
                overlay="linear-gradient(135deg, rgba(30, 90, 60, 0.75) 0%, rgba(18, 32, 24, 0.85) 100%)"
                image={bookings.find((b) => groupOf(b) === "confirmed")?.image ?? heroImage}
                icon={<Check size={19} />}
                active={group === "confirmed"}
                onClick={() => setGroup(group === "confirmed" ? "all" : "confirmed")}
              />

              <div
                className="flex h-[210px] flex-col rounded-[15px] p-5"
                style={{ background: PANEL, border: `1px solid ${HAIRLINE}` }}
              >
                <p
                  className="text-[10.5px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: TEXT_2 }}
                >
                  Since your last visit
                </p>
                <div className="mt-3 min-h-0 flex-1 space-y-2.5 overflow-hidden">
                  {activity.length === 0 && (
                    <p className="text-[12.5px]" style={{ color: MUTED }}>
                      No recent updates yet.
                    </p>
                  )}
                  {activity.map((a) => (
                    <Link
                      key={a.id}
                      to="/bookings/$bookingId"
                      params={{ bookingId: a.id }}
                      className="flex items-center gap-3"
                    >
                      <span
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
                        style={{ border: `1px solid ${a.tone}66`, color: a.tone }}
                      >
                        <FileText size={14} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[12.5px]" style={{ color: TEXT }}>
                          {a.title}
                        </span>
                        <span className="block truncate text-[11.5px]" style={{ color: MUTED }}>
                          {a.sub}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setGroup("all")}
                  className="mt-3 flex items-center justify-between pt-3 text-[12.5px]"
                  style={{ borderTop: `1px solid ${HAIRLINE}`, color: TEXT }}
                >
                  View all activity <ArrowRight size={15} style={{ color: GOLD }} />
                </button>
              </div>
            </section>

            {!isProfileComplete(profile) && (
              <section
                className="mt-6 flex flex-col gap-3 rounded-[14px] px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                style={{ background: PANEL, border: `1px solid ${GOLD}55` }}
              >
                <div className="min-w-0">
                  <p className="text-[14px]" style={{ color: TEXT }}>
                    Complete your profile
                  </p>
                  <p className="mt-0.5 text-[12.5px]" style={{ color: MUTED }}>
                    Add your contact details once and reuse them for future bookings.
                  </p>
                </div>
                <Link
                  to="/account"
                  className="shrink-0 rounded-lg px-4 py-2 text-center text-[12px] font-semibold uppercase tracking-[0.14em]"
                  style={{
                    background: "linear-gradient(180deg, #D9BC72 0%, #C7A34A 55%, #A9853A 100%)",
                    color: "#20180A",
                  }}
                >
                  Complete profile
                </Link>
              </section>
            )}

            {/* toolbar */}
            <section className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.7fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_auto]">
              <div className="relative">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: GOLD }}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search bookings..."
                  aria-label="Search bookings by name, destination, hotel or reference"
                  className="w-full rounded-[11px] py-[11px] pl-11 pr-4 text-[14px] outline-none placeholder:text-[#7C8B98]"
                  style={{
                    backgroundColor: "rgba(14,23,33,0.8)",
                    border: `1px solid ${HAIRLINE}`,
                    color: TEXT,
                  }}
                />
              </div>
              <Select
                label="Status filter"
                value={group}
                onChange={setGroup}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "proposal", label: "Proposal Ready" },
                  { value: "awaiting", label: "Awaiting Response" },
                  { value: "confirmed", label: "Confirmed" },
                  { value: "attention", label: "Needs Attention" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
              />
              <Select
                label="Date filter"
                value={dateChoice}
                onChange={setDateChoice}
                options={[
                  { value: "all", label: "All Dates" },
                  { value: "upcoming", label: "Upcoming" },
                  { value: "this_month", label: "This Month" },
                  { value: "next_90", label: "Next 3 Months" },
                  { value: "past", label: "Past Stays" },
                ]}
              />
              <div className="flex items-center gap-2 justify-self-start md:justify-self-end">
                {(
                  [
                    { key: "grid" as const, icon: Grid2X2, label: "Grid view" },
                    { key: "list" as const, icon: LayoutList, label: "List view" },
                  ]
                ).map(({ key, icon: Icon, label }) => {
                  const on = view === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-label={label}
                      aria-pressed={on}
                      onClick={() => setView(key)}
                      className="grid h-[44px] w-[48px] place-items-center rounded-[11px] transition-colors"
                      style={{
                        background: on ? "rgba(201,162,75,0.12)" : "rgba(14,23,33,0.8)",
                        border: `1px solid ${on ? `${GOLD}99` : HAIRLINE}`,
                        color: on ? GOLD_SOFT : "#8A98A4",
                        boxShadow: on ? "0 8px 20px -16px rgba(201,162,75,0.9)" : "none",
                      }}
                    >
                      <Icon size={18} />
                    </button>
                  );
                })}
              </div>
            </section>

            {/* bookings */}
            <section
              className={
                view === "list" ? "mt-5 space-y-4" : "mt-5 grid grid-cols-1 gap-4 xl:grid-cols-2"
              }
            >
              {results.map((b) => (
                <BookingCard key={b.id} booking={b} compact={view === "grid"} />
              ))}
              {results.length === 0 && (
                <p className="py-12 text-center text-[13.5px]" style={{ color: MUTED }}>
                  {isLoading
                    ? "Loading your bookings…"
                    : bookings.length === 0
                      ? "You have no bookings yet. Start a new request to see it here."
                      : "No bookings match your filters."}
                </p>
              )}
            </section>

            <footer className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12.5px]" style={{ color: MUTED }}>
                Can&rsquo;t find a booking?{" "}
                <Link to="/account" style={{ color: GOLD }}>
                  Contact us →
                </Link>
              </p>
              <span className="text-[12.5px]" style={{ color: MUTED }}>
                Showing {results.length} of {bookings.length}
              </span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
