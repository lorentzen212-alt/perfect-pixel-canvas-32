import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Gift,
  Grid2X2,
  Headphones,
  HelpCircle,
  LayoutList,
  MapPin,
  Menu,
  Moon,
  MoreVertical,
  Plus,
  Search,
  X,
} from "lucide-react";
import logo from "@/assets/hotelgroupbook-logo.png.asset.json";
import {
  BOOKINGS,
  STATUS_META,
  TONE_COLOR,
  filterBookings,
  formatDay,
  formatRange,
  roomingProgress,
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
const BG = "#1E2C36";
const BG_ALT = "#22303A";
const SIDEBAR = "#0B1D29";
const SIDEBAR_ALT = "#0E2331";
const TOPBAR = "#0C1E2A";
const CARD = "#2B3A45";
const CARD_BORDER = "rgba(154,176,192,0.13)";
const CARD_SHADOW = "0 1px 2px rgba(0,0,0,0.18), 0 8px 20px -14px rgba(0,0,0,0.45)";
const ACTION_PANEL = "#31404B";
const ATTENTION = "#2F3E49";
const SURFACE = "#2E3D47";
const BORDER = "rgba(255,255,255,0.075)";
const TEXT = "#F2F1EC";
const TEXT_2 = "#BFC7CD";
const MUTED = "#929DA5";
const GOLD = "#C7A34A";
const GOLD_MID = "#B99135";
const GOLD_DEEP = "rgba(199,163,74,0.55)";
const GOLD_SOFT = "#D0B05A";


const SERIF = '"Cormorant Garamond", Georgia, serif';

/* ── small building blocks ───────────────────────────── */

function Divider({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      style={{ width: 1, background: BORDER, alignSelf: "stretch" }}
      aria-hidden
    />
  );
}

function StatCard({
  value,
  label,
  icon,
  tone,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <div
      className="flex min-w-0 items-center gap-2.5 rounded-lg px-3.5 py-2.5"
      style={{ backgroundColor: CARD, border: `1px solid ${CARD_BORDER}` }}
    >
      <span
        className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full"
        style={{ backgroundColor: `${tone}12`, color: tone, border: `1px solid ${tone}26` }}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[18px] font-medium leading-none" style={{ color: TEXT }}>
          {value}
        </span>
        <span className="mt-1 block truncate text-[11.5px]" style={{ color: MUTED }}>
          {label}
        </span>
      </span>
    </div>
  );

}

function StatusChip({ type }: { type: Booking["type"] }) {
  const isLeisure = type === "leisure";
  return (
    <span
      className="inline-flex items-center rounded px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.14em]"
      style={{
        color: isLeisure ? GOLD : "#9FB6C8",
        backgroundColor: isLeisure ? "rgba(199,163,74,0.12)" : "rgba(143,167,188,0.14)",
        border: `1px solid ${isLeisure ? "rgba(199,163,74,0.32)" : "rgba(143,167,188,0.30)"}`,
      }}
    >
      {isLeisure ? "Leisure" : "M&E"}
    </span>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid h-[64px] w-[64px] shrink-0 place-items-center">
      <svg viewBox="0 0 64 64" className="h-[64px] w-[64px] -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={GOLD}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * c} ${c}`}
        />
      </svg>
      <span className="absolute text-[13.5px] font-medium" style={{ color: TEXT }}>
        {value}%
      </span>
    </div>
  );
}

function GoldButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-[6px] px-3.5 py-[7px] text-[12.5px] font-medium transition-colors hover:bg-[rgba(199,163,74,0.10)]"
      style={{
        color: GOLD_SOFT,
        backgroundColor: "transparent",
        border: `1px solid ${GOLD_DEEP}`,
      }}
    >
      {label}
      <span aria-hidden>→</span>
    </button>
  );
}

function QuietButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 whitespace-nowrap rounded-[6px] px-3.5 py-[7px] text-[12.5px] font-medium transition-colors hover:bg-white/5"
      style={{ color: TEXT_2, backgroundColor: "transparent", border: `1px solid rgba(255,255,255,0.14)` }}
    >
      {label}
      <span aria-hidden>→</span>
    </button>
  );
}


function ActionIcon({ booking }: { booking: Booking }) {
  const kind = booking.action.kind;
  const map = {
    rooming_list: { icon: <CalendarCheck size={20} />, tone: "#8FA98A" },
    review_offers: { icon: <Gift size={20} />, tone: GOLD },
    on_track: { icon: <Search size={20} />, tone: "#8FA7BC" },
    completed: { icon: <Check size={20} />, tone: "#A9B4BB" },
    generic: { icon: <CalendarDays size={20} />, tone: MUTED },
  } as const;
  const { icon, tone } = map[kind] ?? map.generic;
  return (
    <span
      className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full"
      style={{ backgroundColor: `${tone}12`, color: tone, border: `1px solid ${tone}2B` }}
    >

      {icon}
    </span>
  );
}

/* ── booking card ────────────────────────────────────── */

function BookingCard({ booking }: { booking: Booking }) {
  const meta = STATUS_META[booking.status];
  const statusColor = TONE_COLOR[meta.tone];
  const progress = roomingProgress(booking);

  return (
    <article
      className="grid grid-cols-1 gap-4 rounded-[10px] p-2.5 md:grid-cols-[184px_minmax(0,1.32fr)_minmax(0,0.78fr)_minmax(0,1.2fr)_auto] md:items-center md:gap-0"
      style={{
        backgroundColor: CARD,
        border: `1px solid ${CARD_BORDER}`,
        boxShadow: CARD_SHADOW,
      }}
    >
      <img
        src={booking.image}
        alt={`${booking.destination} — ${booking.name}`}
        loading="lazy"
        className="h-[124px] w-full rounded-[8px] object-cover md:h-[110px]"
        style={{ filter: "saturate(0.94) contrast(1.02)" }}
      />



      {/* 2. booking information */}
      <div className="min-w-0 md:px-5">
        <StatusChip type={booking.type} />
        <h3
          className="mt-2 truncate text-[19px] font-medium"
          style={{ color: TEXT, fontFamily: SERIF }}
        >
          {booking.name}
        </h3>
        <div
          className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px]"
          style={{ color: TEXT_2 }}
        >
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} style={{ color: MUTED }} /> {booking.destination}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={13} style={{ color: MUTED }} />{" "}
            {formatRange(booking.startDate, booking.endDate)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Moon size={13} style={{ color: MUTED }} /> {booking.nights} nights
          </span>
        </div>
        {booking.hotel && (
          <p className="mt-2 text-[12.5px]" style={{ color: TEXT_2 }}>
            {booking.hotel}
          </p>
        )}
        <p className="mt-1 text-[12.5px]" style={{ color: MUTED }}>
          {booking.type === "me"
            ? `${booking.delegates} delegates  •  ${booking.meetingSpaces} meeting spaces`
            : `${booking.rooms} rooms  •  ${booking.guests} guests`}
        </p>
      </div>

      {/* 3. booking id + status */}
      <div className="min-w-0 md:border-l md:px-5" style={{ borderColor: BORDER }}>
        <p className="text-[12.5px]" style={{ color: TEXT }}>
          {booking.reference}
        </p>
        <p className="mt-1.5 text-[12.5px] font-medium" style={{ color: statusColor }}>
          {meta.label}
        </p>
        {booking.hotelReference ? (
          <>
            <p className="mt-3 text-[12px]" style={{ color: MUTED }}>
              Hotel reference
            </p>
            <p className="mt-0.5 text-[12.5px]" style={{ color: TEXT_2 }}>
              {booking.hotelReference}
            </p>
          </>
        ) : (
          booking.statusNote && (
            <p className="mt-3 text-[12.5px]" style={{ color: MUTED }}>
              {booking.statusNote}
            </p>
          )
        )}
      </div>

      {/* 4. action panel */}
      <div
        className="flex min-w-0 items-center gap-4 rounded-[8px] p-3 md:border-l md:bg-transparent md:px-5"
        style={{ borderColor: BORDER, backgroundColor: `${SURFACE}80` }}
      >

        {booking.rooming ? <ProgressRing value={progress} /> : <ActionIcon booking={booking} />}
        <div className="min-w-0">
          <p
            className="text-[13px] font-medium"
            style={{ color: booking.action.kind === "review_offers" ? GOLD : TEXT }}
          >
            {booking.action.title}
          </p>
          {booking.rooming ? (
            <>
              <p className="mt-1 text-[12px]" style={{ color: TEXT_2 }}>
                {booking.rooming.complete} / {booking.rooming.total} guests complete
              </p>
              <p className="text-[12px]" style={{ color: MUTED }}>
                Due {formatDay(booking.rooming.due)}
              </p>
            </>
          ) : (
            booking.action.lines?.map((l) => (
              <p key={l} className="text-[12px] leading-snug" style={{ color: TEXT_2 }}>
                {l}
              </p>
            ))
          )}
          <div className="mt-2.5">
            {booking.action.kind === "rooming_list" || booking.action.kind === "review_offers" ? (
              <GoldButton label={booking.action.buttonLabel} />
            ) : (
              <QuietButton label={booking.action.buttonLabel} />
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label={`More actions for ${booking.name}`}
        className="hidden h-9 w-9 place-items-center rounded-md transition-colors hover:bg-white/5 md:grid md:mr-1"
        style={{ color: MUTED }}
      >
        <MoreVertical size={18} />
      </button>
    </article>
  );
}

/* ── sidebar ─────────────────────────────────────────── */

const NAV = [
  { label: "Overview", icon: CalendarCheck },
  { label: "Bookings", icon: CalendarDays },
  { label: "Documents", icon: FileText },
  { label: "Support", icon: HelpCircle },
];

function SidebarContent({ active }: { active: string }) {
  return (
    <div
      className="flex h-full flex-col px-5 py-6"
      style={{ background: `linear-gradient(180deg, ${SIDEBAR} 0%, ${SIDEBAR_ALT} 100%)` }}
    >
      <Link to="/" className="block">
        <img
          src={logo.url}
          alt="HotelGroupBook"
          className="h-11 w-auto object-contain object-left"
        />
      </Link>

      <p
        className="mt-9 text-[10.5px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: GOLD_MID }}
      >
        Manage my bookings
      </p>

      <nav className="mt-4 space-y-1">
        {NAV.map((item) => {
          const isActive = item.label === active;
          return (
            <button
              key={item.label}
              type="button"
              className="relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[14px] transition-colors"
              style={{
                backgroundColor: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                color: isActive ? TEXT : TEXT_2,
              }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full"
                  style={{ backgroundColor: GOLD }}
                />
              )}
              <item.icon size={17} style={{ color: isActive ? GOLD : MUTED }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <div className="pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="flex items-start gap-3">
            <Headphones size={17} className="mt-0.5 shrink-0" style={{ color: GOLD_MID }} />
            <div className="min-w-0 text-[12.5px]" style={{ color: TEXT_2 }}>
              <p style={{ color: TEXT }}>Need help?</p>
              <p className="mt-1">+47 000 00 000</p>
              <p className="truncate">help@hotelgroupbook.com</p>
            </div>
          </div>
        </div>

        <div
          className="mt-5 flex items-center gap-3 pt-5"
          style={{ borderTop: `1px solid ${BORDER}` }}
        >
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold"
            style={{ backgroundColor: "rgba(199,163,74,0.16)", color: GOLD }}
          >
            EH
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px]" style={{ color: TEXT }}>
              Emma Hansen
            </span>
            <span className="block truncate text-[11.5px]" style={{ color: MUTED }}>
              Nordic Events AS
            </span>
          </span>
          <ChevronDown size={15} style={{ color: MUTED }} />
        </div>
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
        className="w-full appearance-none rounded-[8px] px-4 py-[9px] pr-9 text-[13.5px] outline-none"
        style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, color: TEXT_2 }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ backgroundColor: CARD }}>
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

function ManageBookings() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [view, setView] = useState<"grid" | "list">("list");
  const [navOpen, setNavOpen] = useState(false);

  const results = useMemo(
    () => filterBookings(BOOKINGS, { query, status, date: dateFilter }),
    [query, status, dateFilter],
  );

  const statusOptions = useMemo(
    () => [
      { value: "all" as const, label: "All Status" },
      ...(Object.keys(STATUS_META) as BookingStatus[]).map((k) => ({
        value: k,
        label: STATUS_META[k].label,
      })),
    ],
    [],
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG }}>
      {/* sidebar — desktop */}
      <aside className="fixed inset-y-0 left-0 hidden w-[244px] lg:block">
        <SidebarContent active="Overview" />
      </aside>

      {/* sidebar — mobile drawer */}
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
        {/* top bar */}
        <header
          className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8"
          style={{ backgroundColor: TOPBAR, borderBottom: `1px solid ${BORDER}` }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="Open navigation"
              onClick={() => setNavOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-md lg:hidden"
              style={{ color: TEXT_2, border: `1px solid ${BORDER}` }}
            >
              <Menu size={18} />
            </button>
            <img src={logo.url} alt="HotelGroupBook" className="h-7 w-auto lg:hidden" />
          </div>

          <div className="flex shrink-0 items-center gap-3 sm:gap-5">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium sm:px-4"
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: `1px solid ${GOLD_DEEP}`,
                color: GOLD,
              }}
            >
              <Plus size={15} />
              <span className="hidden sm:inline">New Booking</span>
            </button>

            <button
              type="button"
              aria-label="Notifications"
              className="relative grid h-9 w-9 place-items-center rounded-md"
              style={{ color: TEXT_2 }}
            >
              <Bell size={18} />
              <span
                className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-semibold"
                style={{ backgroundColor: GOLD, color: "#1B2A33" }}
              >
                2
              </span>
            </button>

            <button type="button" className="flex items-center gap-2">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11.5px] font-semibold"
                style={{ backgroundColor: "rgba(199,163,74,0.16)", color: GOLD }}
              >
                EH
              </span>
              <span className="hidden text-[13px] sm:inline" style={{ color: TEXT }}>
                Emma Hansen
              </span>
              <ChevronDown size={15} style={{ color: MUTED }} />
            </button>
          </div>
        </header>

        <main
          className="min-h-[calc(100vh-64px)] px-4 py-6 sm:px-6 lg:px-8"
          style={{ backgroundColor: BG_ALT }}
        >
          {/* heading + stats */}
          <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)] xl:items-center">
            <div className="min-w-0">
              <h1 className="text-[36px] leading-none" style={{ color: TEXT, fontFamily: SERIF }}>
                My Bookings
              </h1>
              <p className="mt-2 text-[13.5px]" style={{ color: MUTED }}>
                All your group stays and events in one place.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard value="7" label="Total Bookings" icon={<CalendarDays size={18} />} tone={GOLD} />
              <StatCard value="2" label="Needs Attention" icon={<Bell size={18} />} tone="#C7A34A" />
              <StatCard value="3" label="Offers Ready" icon={<Gift size={18} />} tone="#8FA98A" />
              <StatCard value="4" label="Upcoming Stays" icon={<CalendarCheck size={18} />} tone="#8FA7BC" />
            </div>
          </section>

          {/* controls */}
          <section className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_auto]">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: MUTED }}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bookings..."
                aria-label="Search bookings by name, ID, destination or hotel"
                className="w-full rounded-[8px] py-[9px] pl-11 pr-4 text-[13.5px] outline-none placeholder:text-[#98A3AA]"
                style={{ backgroundColor: CARD, border: `1px solid ${BORDER}`, color: TEXT }}
              />
            </div>
            <Select label="Status filter" value={status} onChange={setStatus} options={statusOptions} />
            <Select
              label="Date filter"
              value={dateFilter}
              onChange={setDateFilter}
              options={[
                { value: "all", label: "All Dates" },
                { value: "upcoming", label: "Upcoming" },
                { value: "next_90", label: "Next 90 days" },
                { value: "past", label: "Past stays" },
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
                    className="grid h-[38px] w-[42px] place-items-center rounded-[8px]"
                    style={{
                      backgroundColor: on ? "rgba(199,163,74,0.10)" : CARD,
                      border: `1px solid ${on ? "rgba(199,163,74,0.55)" : BORDER}`,
                      color: on ? GOLD : MUTED,
                    }}
                  >
                    <Icon size={18} />
                  </button>
                );
              })}
            </div>
          </section>

          {/* needs your attention */}
          <section
            className="mt-5 rounded-[10px] p-4 sm:px-5 sm:py-4"
            style={{
              backgroundColor: CARD,
              border: `1px solid ${BORDER}`,
              borderLeft: `2px solid ${GOLD_MID}`,
            }}
          >
            <h2 className="text-[14px] font-medium" style={{ color: TEXT }}>
              Needs Your Attention
            </h2>
            <div className="mt-3.5 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="flex flex-wrap items-center gap-4 lg:flex-nowrap">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                  style={{
                    backgroundColor: "rgba(199,163,74,0.12)",
                    color: GOLD,
                    border: "1px solid rgba(199,163,74,0.28)",
                  }}
                >

                  <Bell size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px]" style={{ color: MUTED }}>
                    HGB-2026-00124
                  </p>
                  <p className="text-[16px]" style={{ color: TEXT, fontFamily: SERIF }}>
                    Oslo Group Stay
                  </p>
                </div>
                <Divider className="hidden lg:block" />
                <div className="min-w-0 lg:pl-1">
                  <p className="text-[12.5px]" style={{ color: TEXT }}>
                    Rooming list
                  </p>
                  <p className="mt-1 text-[12.5px]" style={{ color: TEXT_2 }}>
                    42 / 58 guests complete
                  </p>
                  <p className="text-[12.5px]" style={{ color: MUTED }}>
                    Due 04 Sep 2026
                  </p>
                </div>
                <button
                  type="button"
                  className="ml-auto inline-flex items-center gap-2 text-[12.5px]"
                  style={{ color: GOLD }}
                >
                  Continue <span aria-hidden>→</span>
                </button>
              </div>

              <div
                className="flex flex-wrap items-center gap-4 lg:flex-nowrap lg:border-l lg:pl-6"
                style={{ borderColor: BORDER }}
              >
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                  style={{
                    backgroundColor: "rgba(199,163,74,0.12)",
                    color: GOLD,
                    border: "1px solid rgba(199,163,74,0.28)",
                  }}
                >

                  <Gift size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px]" style={{ color: MUTED }}>
                    HGB-2026-00136
                  </p>
                  <p className="text-[16px]" style={{ color: TEXT, fontFamily: SERIF }}>
                    Stockholm City Break
                  </p>
                </div>
                <Divider className="hidden lg:block" />
                <div className="min-w-0 lg:pl-1">
                  <p className="text-[12.5px]" style={{ color: TEXT }}>
                    3 hotel offers ready
                  </p>
                  <button
                    type="button"
                    className="mt-1 inline-flex items-center gap-2 text-[12.5px]"
                    style={{ color: GOLD }}
                  >
                    Review offers <span aria-hidden>→</span>
                  </button>
                </div>
                <button
                  type="button"
                  aria-label="More actions"
                  className="ml-auto grid h-9 w-9 place-items-center rounded-md"
                  style={{ color: MUTED }}
                >
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </section>

          {/* bookings */}
          <section
            className={
              view === "list"
                ? "mt-4 space-y-3"
                : "mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2"
            }
          >
            {results.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
            {results.length === 0 && (
              <p className="py-10 text-center text-[13.5px]" style={{ color: MUTED }}>
                No bookings match your filters.
              </p>
            )}
          </section>

          {/* footer */}
          <footer className="mt-5 grid grid-cols-1 items-center gap-3 pb-4 sm:grid-cols-2">
            <p className="text-[12.5px]" style={{ color: MUTED }}>
              Can&rsquo;t find a booking?{" "}
              <button type="button" className="inline-flex items-center gap-1.5" style={{ color: GOLD }}>
                Contact us <span aria-hidden>→</span>
              </button>
            </p>
            <div className="flex items-center gap-3 sm:justify-end">
              <span className="text-[12.5px]" style={{ color: MUTED }}>
                Showing 1 – {results.length} of 7
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { key: "prev", node: <ChevronLeft size={16} /> },
                  { key: "1", node: "1" },
                  { key: "2", node: "2" },
                  { key: "next", node: <ChevronRight size={16} /> },
                ].map((p) => {
                  const active = p.key === "1";
                  return (
                    <button
                      key={p.key}
                      type="button"
                      className="grid h-8 min-w-8 place-items-center rounded-md px-2 text-[12.5px]"
                      style={{
                        backgroundColor: active ? "rgba(199,163,74,0.10)" : "transparent",
                        border: `1px solid ${active ? "rgba(199,163,74,0.5)" : BORDER}`,
                        color: active ? GOLD : TEXT_2,
                      }}
                    >
                      {p.node}
                    </button>
                  );
                })}
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
