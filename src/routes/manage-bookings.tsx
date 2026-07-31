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
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileText,
  Gift,
  Grid2X2,
  Headphones,
  HelpCircle,
  LayoutList,
  Mail,
  MapPin,
  Menu,
  Moon,
  MoreVertical,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import logo from "@/assets/hotelgroupbook-logo.png.asset.json";
import mountains from "@/assets/dashboard-mountains.jpg";

import {
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

const BORDER = "rgba(255,255,255,0.075)";
const TEXT = "#F2F1EC";
const TEXT_2 = "#BFC7CD";
const MUTED = "#929DA5";
const GOLD = "#C7A34A";
const GOLD_MID = "#B99135";
const GOLD_DEEP = "rgba(199,163,74,0.55)";
const GOLD_SOFT = "#D0B05A";


const SERIF = '"Cormorant Garamond", "EB Garamond", Georgia, serif';
const SANS = 'Inter, "Helvetica Neue", Arial, sans-serif';


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
      className="inline-flex items-center rounded-[4px] px-[7px] py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.15em]"
      style={{
        color: isLeisure ? "#BE9C4E" : "#9FB6C8",
        background: isLeisure
          ? "linear-gradient(180deg, rgba(199,163,74,0.13) 0%, rgba(16,26,36,0.35) 100%)"
          : "rgba(143,167,188,0.12)",
        border: `1px solid ${isLeisure ? "rgba(199,163,74,0.30)" : "rgba(143,167,188,0.26)"}`,
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

/* ── booking card (Reference 2) ──────────────────────── */

const TRACK_STEPS = [
  { key: "received", label: "Request\nreceived", icon: Mail },
  { key: "sourcing", label: "Hotels\nsourcing", icon: Search },
  { key: "offers", label: "Offers\nready", icon: ClipboardList },
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

function MetaItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-[9px] whitespace-nowrap text-[14px] font-light"
      style={{ color: "#C6D0D8" }}
    >
      <span className="shrink-0" style={{ color: "#BE9C4E" }}>
        {icon}
      </span>
      {children}
    </span>
  );
}

const RULE = "rgba(190,205,215,0.18)";
const RULE_SOFT = "rgba(190,205,215,0.12)";

function MetaSep() {
  return (
    <span
      className="hidden h-[13px] w-px shrink-0 sm:block"
      style={{ backgroundColor: "rgba(190,205,215,0.20)" }}
      aria-hidden
    />
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  const meta = STATUS_META[booking.status];
  const active = trackIndex(booking.status);
  const message =
    booking.statusNote ??
    booking.action.lines?.[0] ??
    booking.action.title ??
    meta.label;

  return (
    <article
      className="group/card relative grid grid-cols-1 gap-4 rounded-[20px] p-4 sm:px-7 sm:py-4 md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:gap-8"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 0%, #3A4A58 0%, #33424F 46%, #2C3B48 78%, #27343F 100%)",
        border: "1px solid rgba(174,196,212,0.15)",
        boxShadow: [
          "0 2px 4px -1px rgba(6,12,20,0.45)",
          "0 10px 20px -10px rgba(6,12,20,0.55)",
          "0 34px 60px -32px rgba(8,16,28,0.72)",
          "inset 0 1px 0 rgba(214,232,246,0.07)",
          "inset 0 0 60px 12px rgba(12,20,30,0.22)",
        ].join(", "),
      }}
    >
      <div
        className="relative overflow-hidden rounded-[14px]"
        style={{
          boxShadow:
            "0 10px 22px -14px rgba(6,12,20,0.85), inset 0 0 0 1px rgba(220,236,248,0.10)",
        }}
      >
        <img
          src={booking.image}
          alt={`${booking.destination} — ${booking.name}`}
          loading="lazy"
          className="h-[150px] w-full object-cover md:h-full md:min-h-0"
          style={{ filter: "saturate(1.04) contrast(1.08) brightness(0.93)" }}
        />
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(115% 85% at 50% 42%, rgba(0,0,0,0) 52%, rgba(10,18,28,0.42) 100%), linear-gradient(180deg, rgba(24,38,56,0.18) 0%, rgba(0,0,0,0) 38%, rgba(16,26,38,0.30) 100%)",
          }}
          aria-hidden
        />
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-3">
          <StatusChip type={booking.type} />
          <button
            type="button"
            aria-label={`More actions for ${booking.name}`}
            className="grid h-7 w-7 place-items-center rounded-full transition-colors hover:bg-[rgba(214,232,246,0.08)] hover:text-[#DCE5EC]"
            style={{ color: "#8C99A3" }}
          >
            <MoreVertical size={18} />
          </button>
        </div>

        <Link
          to="/bookings/$bookingId"
          params={{ bookingId: booking.id }}
          className="mt-1 block truncate transition-opacity hover:opacity-85"
        >
          <h3
            className="truncate text-[27px] leading-[1.05] sm:text-[33px]"
            style={{ color: "#F4F1EA", fontFamily: SERIF, fontWeight: 400, letterSpacing: "0.002em" }}
          >
            {booking.name}
          </h3>
        </Link>

        <div className="mt-2 h-px w-full" style={{ backgroundColor: RULE }} />

        <div className="flex flex-nowrap items-center gap-x-3 overflow-hidden py-[7px] lg:gap-x-5">
          <MetaItem icon={<MapPin size={16} strokeWidth={1.6} />}>{booking.destination}</MetaItem>
          <MetaSep />
          <MetaItem icon={<CalendarDays size={16} strokeWidth={1.6} />}>
            {formatRange(booking.startDate, booking.endDate)}
          </MetaItem>
          <MetaSep />
          <MetaItem icon={<Moon size={16} strokeWidth={1.6} />}>{booking.nights} nights</MetaItem>
          <MetaSep />
          {booking.type === "me" ? (
            <>
              <MetaItem icon={<BedDouble size={16} strokeWidth={1.6} />}>
                {booking.meetingSpaces ?? 0} meeting spaces
              </MetaItem>
              <MetaSep />
              <MetaItem icon={<Users size={16} strokeWidth={1.6} />}>{booking.delegates ?? 0} delegates</MetaItem>
            </>
          ) : (
            <>
              <MetaItem icon={<BedDouble size={16} strokeWidth={1.6} />}>{booking.rooms ?? 0} rooms</MetaItem>
              <MetaSep />
              <MetaItem icon={<Users size={16} strokeWidth={1.6} />}>{booking.guests ?? 0} guests</MetaItem>
            </>
          )}
        </div>

        <div className="h-px w-full" style={{ backgroundColor: RULE }} />

        {/* reference panel */}
        <div
          className="mt-2.5 grid grid-cols-1 rounded-[13px] sm:grid-cols-2"
          style={{
            background: "linear-gradient(180deg, rgba(16,26,36,0.42) 0%, rgba(16,26,36,0.28) 100%)",
            border: "1px solid rgba(174,196,212,0.13)",
            boxShadow:
              "inset 0 2px 6px rgba(6,12,20,0.42), inset 0 -1px 0 rgba(214,232,246,0.045)",
          }}
        >
          <div className="px-6 py-[9px]">
            <p
              className="text-[10.5px] font-medium uppercase tracking-[0.12em]"
              style={{ color: "#BE9C4E" }}
            >
              Your reference
            </p>
            <p
              className="mt-[3px] text-[16.5px] leading-[1.15]"
              style={{ color: "#EFEDE7", fontWeight: 500, letterSpacing: "0.01em" }}
            >
              {booking.reference}
            </p>
          </div>
          <div
            className="px-6 py-[9px] sm:border-l"
            style={{ borderColor: "rgba(190,205,215,0.20)" }}
          >
            <p
              className="text-[10.5px] font-medium uppercase tracking-[0.12em]"
              style={{ color: "#BE9C4E" }}
            >
              Hotel reference
            </p>
            <p
              className="mt-[3px] text-[16.5px] leading-[1.15]"
              style={{
                color: booking.hotelReference ? "#EFEDE7" : "#A3B2BE",
                fontWeight: 500,
                letterSpacing: "0.01em",
              }}
            >
              {booking.hotelReference ?? "Pending"}
            </p>
          </div>
        </div>

        {/* progress tracker */}
        <div className="relative mt-3 grid grid-cols-4 gap-2">
          <div
            className="absolute left-[12.5%] right-[12.5%] top-[20px] h-px"
            style={{ backgroundColor: "rgba(190,205,215,0.17)" }}
            aria-hidden
          />
          <div
            className="absolute left-[12.5%] top-[20px] h-px"
            style={{
              width: `${(active / 3) * 75}%`,
              background:
                "linear-gradient(90deg, rgba(199,163,74,0.75) 0%, rgba(199,163,74,0.35) 100%)",
            }}
            aria-hidden
          />
          {TRACK_STEPS.map((s, i) => {
            const done = i <= active;
            const current = i === active;
            return (
              <div key={s.key} className="relative flex flex-col items-center gap-[5px]">
                <span
                  className="relative grid h-[40px] w-[40px] place-items-center rounded-full"
                  style={{
                    background: current
                      ? "linear-gradient(180deg, rgba(199,163,74,0.16) 0%, rgba(199,163,74,0.06) 100%)"
                      : "linear-gradient(180deg, rgba(20,31,42,0.75) 0%, rgba(26,38,49,0.62) 100%)",
                    border: `1px solid ${done ? "rgba(199,163,74,0.52)" : "rgba(190,205,215,0.22)"}`,
                    color: done ? "#C9A659" : "#A9B7C2",
                    boxShadow: current
                      ? "0 0 18px 2px rgba(199,163,74,0.20), inset 0 1px 0 rgba(255,235,190,0.14)"
                      : "inset 0 1px 0 rgba(214,232,246,0.05)",
                  }}
                >
                  <s.icon size={17} strokeWidth={1.5} />
                </span>
                <span
                  className="whitespace-pre-line text-center text-[11.5px] leading-[1.18]"
                  style={{ color: current ? "#C4A257" : "#A7B4BE" }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-[11px] h-px w-full" style={{ backgroundColor: RULE_SOFT }} />

        <div className="mt-[9px] flex flex-nowrap items-center justify-between gap-4">
          <p
            className="min-w-0 max-w-[520px] truncate text-[13.5px] font-light"
            style={{ color: "#B4C1CB" }}
          >
            {message}
          </p>
          <Link
            to="/bookings/$bookingId"
            params={{ bookingId: booking.id }}
            className="group/btn inline-flex shrink-0 items-center gap-3 rounded-[12px] px-7 py-2 text-[14.5px] transition-all duration-200 hover:-translate-y-px hover:border-[rgba(212,178,92,0.75)] hover:bg-[rgba(199,163,74,0.09)]"
            style={{
              color: "#CDAE5E",
              border: "1px solid rgba(199,163,74,0.45)",
              background: "rgba(14,23,33,0.35)",
            }}
          >
            View booking
            <span
              aria-hidden
              className="inline-block transition-transform duration-200 group-hover/btn:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}



/* ── sidebar ─────────────────────────────────────────── */

function SidebarAccount() {
  const { profile, session, signOut } = useAuth();
  const name =
    `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() ||
    session?.user.email ||
    "Your account";
  const initials =
    ((profile?.first_name?.[0] ?? name[0] ?? "") + (profile?.last_name?.[0] ?? "")).toUpperCase();

  return (
    <div className="mt-5 flex items-center gap-3 pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold"
        style={{ backgroundColor: "rgba(199,163,74,0.16)", color: GOLD }}
      >
        {initials || "—"}
      </span>
      <span className="min-w-0 flex-1">
        <Link to="/account" className="block truncate text-[13px]" style={{ color: TEXT }}>
          {name}
        </Link>
        <span className="block truncate text-[11.5px]" style={{ color: MUTED }}>
          {session?.user.email ?? ""}
        </span>
      </span>
      <button
        type="button"
        onClick={() => void signOut()}
        className="text-[11.5px] underline-offset-4 hover:underline"
        style={{ color: MUTED }}
      >
        Sign out
      </button>
    </div>
  );
}

function AccountMenu({
  initials,
  displayName,
  email,
  onSignOut,
  compact,
}: {
  initials: string;
  displayName: string;
  email: string;
  onSignOut: () => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-2"
      >
        <span
          className={
            compact
              ? "grid h-11 w-11 shrink-0 place-items-center rounded-full text-[14px] font-medium"
              : "grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11.5px] font-semibold"
          }
          style={
            compact
              ? {
                  backgroundColor: "rgba(12,30,42,0.45)",
                  border: `1px solid ${GOLD_DEEP}`,
                  color: GOLD,
                }
              : { backgroundColor: "rgba(199,163,74,0.16)", color: GOLD }
          }
        >
          {initials || "—"}
        </span>
        {!compact && (
          <>
            <span className="hidden min-w-0 text-left sm:block">
              <span className="block truncate text-[13px]" style={{ color: TEXT }}>
                {displayName}
              </span>
              {email && displayName !== email && (
                <span className="block truncate text-[11px]" style={{ color: MUTED }}>
                  {email}
                </span>
              )}
            </span>
            <ChevronDown size={15} style={{ color: MUTED }} />
          </>
        )}
      </button>


      {open && (
        <>
          <button
            type="button"
            aria-label="Close account menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl py-1.5"
            style={{
              backgroundColor: CARD,
              border: `1px solid ${BORDER}`,
              boxShadow: "0 24px 50px -24px rgba(0,0,0,0.6)",
            }}
          >
            <div className="px-4 py-2">
              <p className="truncate text-[12.5px]" style={{ color: TEXT }}>
                {displayName}
              </p>
              <p className="truncate text-[11.5px]" style={{ color: MUTED }}>
                {email}
              </p>
            </div>
            <div style={{ borderTop: `1px solid ${BORDER}` }} />
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-[13px] hover:bg-white/5"
              style={{ color: TEXT }}
            >
              My Profile
            </Link>
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-[13px] hover:bg-white/5"
              style={{ color: TEXT }}
            >
              Account Details
            </Link>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="block w-full px-4 py-2.5 text-left text-[13px] hover:bg-white/5"
              style={{ color: MUTED }}
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}




const NAV = [
  { label: "Overview", icon: CalendarCheck },
  { label: "Bookings", icon: CalendarDays },
  { label: "Rooming List", icon: ClipboardList },
  { label: "Documents", icon: FileText },
  { label: "Support", icon: HelpCircle },
];

function SidebarContent({ active, roomingBookingId }: { active: string; roomingBookingId?: string }) {
  return (
    <div
      className="flex h-full flex-col px-5 py-6"
      style={{
        background: "#212F39",
        boxShadow: "inset -1px 0 0 rgba(255,255,255,0.04)",
      }}
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
          const isRooming = item.label === "Rooming List" && !!roomingBookingId;
          const Comp: any = isRooming ? Link : "button";
          const extra = isRooming
            ? { to: "/rooming-list/$bookingId", params: { bookingId: roomingBookingId } }
            : { type: "button" as const };
          return (
            <Comp
              key={item.label}
              {...extra}
              className="relative flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] transition-colors"
              style={{
                background: isActive
                  ? "linear-gradient(180deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)"
                  : "transparent",
                border: `1px solid ${isActive ? "rgba(190,205,215,0.10)" : "transparent"}`,
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
            </Comp>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <div
          className="rounded-[12px] px-4 py-4"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(190,205,215,0.09)",
          }}
        >
          <div className="flex items-start gap-3">
            <Headphones size={17} className="mt-0.5 shrink-0" style={{ color: GOLD_MID }} />
            <div className="min-w-0 text-[12.5px]" style={{ color: TEXT_2 }}>
              <p style={{ color: TEXT }}>Need help?</p>
              <p className="mt-1">+47 000 00 000</p>
              <p className="truncate">help@hotelgroupbook.com</p>
            </div>
          </div>
        </div>

        <SidebarAccount />

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

  const results = useMemo(
    () => filterBookings(bookings, { query, status, date: dateFilter }),
    [bookings, query, status, dateFilter],
  );

  const now = new Date();
  const needsAttention = bookings.filter(
    (b) => b.status === "rooming_list_required" || b.status === "offers_ready",
  );
  const roomingTarget =
    bookings.find((b) => b.status === "rooming_list_required")?.id ?? bookings[0]?.id;
  const offersReady = bookings.filter((b) => b.status === "offers_ready");
  const upcoming = bookings.filter(
    (b) => b.startDate && new Date(b.startDate) >= now && b.status !== "completed",
  );

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim() || profile.email
    : (session?.user.email ?? "");
  const initials =
    (profile?.first_name?.[0] ?? displayName[0] ?? "").toUpperCase() +
    (profile?.last_name?.[0] ?? "").toUpperCase();


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
        <SidebarContent active="Overview" roomingBookingId={roomingTarget} />
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
            <SidebarContent active="Overview" roomingBookingId={roomingTarget} />
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
          className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:hidden"
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

            <AccountMenu
              initials={initials}
              displayName={displayName}
              email={session?.user.email ?? ""}
              onSignOut={() => void signOut()}
            />

          </div>
        </header>

        <main
          className="relative min-h-[calc(100vh-64px)] overflow-hidden px-4 pb-6 pt-8 sm:px-6 lg:px-10 lg:pt-10"
          style={{ backgroundColor: BG_ALT }}
        >
          {/* atmospheric mountain backdrop — fades into the page */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[560px]" aria-hidden>
            <img
              src={mountains}
              alt=""
              className="h-full w-full object-cover"
              style={{ filter: "saturate(0.8) brightness(0.7)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, rgba(30,44,54,0.55) 0%, rgba(30,44,54,0.72) 42%, rgba(34,48,58,0.94) 78%, ${BG_ALT} 100%)`,
              }}
            />
          </div>

          {/* heading + top-right actions */}
          <section className="relative">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="min-w-0">
                <h1
                  className="text-[42px] leading-[1.05] sm:text-[52px]"
                  style={{
                    color: TEXT,
                    fontFamily: SERIF,
                    fontWeight: 400,
                    letterSpacing: "-0.015em",
                  }}
                >
                  My Bookings
                </h1>
                <p className="mt-3 text-[18px]" style={{ color: TEXT_2 }}>
                  All your group stays and events in one place.
                </p>
              </div>

              <div className="hidden shrink-0 items-center gap-5 lg:flex">
                <button
                  type="button"
                  className="inline-flex items-center gap-2.5 rounded-[11px] px-5 py-3 text-[15px]"
                  style={{
                    backgroundColor: "rgba(12,30,42,0.45)",
                    border: `1px solid ${GOLD_DEEP}`,
                    color: GOLD,
                  }}
                >
                  <Plus size={17} />
                  New Booking
                </button>

                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative grid h-10 w-10 place-items-center rounded-md"
                  style={{ color: "#EADFC6" }}
                >
                  <Bell size={20} />
                  <span
                    className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10.5px] font-semibold"
                    style={{ backgroundColor: GOLD, color: "#1B2A33" }}
                  >
                    2
                  </span>
                </button>

                <AccountMenu
                  initials={initials}
                  displayName={displayName}
                  email={session?.user.email ?? ""}
                  onSignOut={() => void signOut()}
                  compact
                />
              </div>
            </div>

            {/* open statistics — no container */}
            <div className="mt-12 grid grid-cols-2 gap-y-8 sm:grid-cols-4">
              {[
                { value: bookings.length, label: "Total Bookings" },
                { value: needsAttention.length, label: "Needs Attention" },
                { value: offersReady.length, label: "Offers Ready" },
                { value: upcoming.length, label: "Upcoming Stays" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="min-w-0 px-2 text-center sm:px-6"
                  style={
                    i === 0
                      ? undefined
                      : {
                          borderLeft: "1px solid rgba(199,163,74,0.30)",
                        }
                  }
                >
                  <p
                    className="text-[38px] leading-none"
                    style={{
                      color: TEXT,
                      fontFamily: SANS,
                      fontWeight: 300,
                      letterSpacing: "0em",
                      fontVariantNumeric: "lining-nums",
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    className="mt-3 text-[14px]"
                    style={{ color: TEXT_2, fontFamily: SANS, fontWeight: 400, letterSpacing: "0.01em" }}
                  >
                    {s.label}
                  </p>

                </div>
              ))}
            </div>

            {/* long metallic gold divider — centre-lit reflective gradient */}
            <div
              className="mt-10 h-px w-full"
              aria-hidden
              style={{
                background:
                  "linear-gradient(90deg, rgba(120,90,24,0.35) 0%, rgba(164,126,35,0.55) 32%, rgba(201,168,74,0.75) 44%, rgba(241,215,122,1) 50%, rgba(201,168,74,0.75) 56%, rgba(164,126,35,0.55) 68%, rgba(120,90,24,0.35) 100%)",
              }}
            />

          </section>


          {!isProfileComplete(profile) && (
            <section
              className="relative mt-6 flex flex-col gap-3 rounded-xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              style={{
                backgroundColor: CARD,
                border: `1px solid ${GOLD_DEEP}`,
                boxShadow: CARD_SHADOW,
              }}
            >
              <div className="min-w-0">
                <p className="text-[14px] font-medium" style={{ color: TEXT }}>
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


          {/* controls */}
          <section className="relative mt-8 grid grid-cols-1 gap-3.5 md:grid-cols-[minmax(0,1.55fr)_minmax(0,0.78fr)_minmax(0,0.78fr)_auto]">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                style={{ color: GOLD }}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bookings..."
                aria-label="Search bookings by name, ID, destination or hotel"
                className="w-full rounded-[13px] py-[14px] pl-12 pr-4 text-[15px] outline-none placeholder:text-[#8C9AA5]"
                style={{
                  backgroundColor: "rgba(18,32,42,0.55)",
                  border: "1px solid rgba(126,152,174,0.20)",
                  color: TEXT,
                }}
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
            <div className="flex items-center gap-2.5 justify-self-start md:justify-self-end">
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
                    className="grid h-[50px] w-[56px] place-items-center rounded-[13px] transition-colors"
                    style={{
                      background: on
                        ? "linear-gradient(180deg, rgba(120,90,30,0.30) 0%, rgba(150,113,36,0.22) 100%)"
                        : "rgba(18,32,42,0.55)",
                      border: `1px solid ${on ? "rgba(199,163,74,0.55)" : "rgba(126,152,174,0.20)"}`,
                      color: on ? GOLD_SOFT : "#A9B6C0",
                      boxShadow: on ? "0 10px 26px -14px rgba(199,163,74,0.75)" : "none",
                    }}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          </section>


          {/* needs your attention */}
          {needsAttention.length > 0 && (
            <section
              className="relative mt-8 rounded-[10px] p-4 sm:px-5 sm:py-4"
              style={{
                backgroundColor: ATTENTION,
                border: `1px solid ${CARD_BORDER}`,
                borderLeft: `2px solid ${GOLD_MID}`,
                boxShadow: CARD_SHADOW,
              }}
            >
              <h2 className="text-[14px] font-medium" style={{ color: TEXT }}>
                Needs Your Attention
              </h2>
              <div className="mt-3.5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {needsAttention.slice(0, 2).map((b, i) => {
                  const isOffers = b.status === "offers_ready";
                  return (
                    <div
                      key={b.id}
                      className={
                        i === 0
                          ? "flex flex-wrap items-center gap-4 lg:flex-nowrap"
                          : "flex flex-wrap items-center gap-4 lg:flex-nowrap lg:border-l lg:pl-6"
                      }
                      style={i === 0 ? undefined : { borderColor: BORDER }}
                    >
                      <span
                        className="grid h-11 w-11 shrink-0 place-items-center rounded-full"
                        style={{
                          backgroundColor: "rgba(199,163,74,0.12)",
                          color: GOLD,
                          border: "1px solid rgba(199,163,74,0.28)",
                        }}
                      >
                        {isOffers ? <Gift size={20} /> : <Bell size={20} />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[12px]" style={{ color: MUTED }}>
                          {b.reference}
                        </p>
                        <p className="text-[16px]" style={{ color: TEXT, fontFamily: SERIF }}>
                          {b.name}
                        </p>
                      </div>
                      <Divider className="hidden lg:block" />
                      <div className="min-w-0 lg:pl-1">
                        <p className="text-[12.5px]" style={{ color: TEXT }}>
                          {isOffers ? b.action.title : "Rooming list"}
                        </p>
                        {!isOffers && b.rooming && (
                          <p className="mt-1 text-[12.5px]" style={{ color: TEXT_2 }}>
                            {b.rooming.complete} / {b.rooming.total} guests complete
                          </p>
                        )}
                        {!isOffers && b.rooming?.due && (
                          <p className="text-[12.5px]" style={{ color: MUTED }}>
                            Due {formatDay(b.rooming.due)}
                          </p>
                        )}
                      </div>
                      <Link
                        to={isOffers ? "/bookings/$bookingId" : "/rooming-list/$bookingId"}
                        params={{ bookingId: b.id }}
                        className="ml-auto inline-flex items-center gap-2 text-[12.5px] font-medium underline-offset-4 transition-colors hover:underline"
                        style={{ color: GOLD_SOFT }}
                      >
                        {isOffers ? "Review offers" : "Continue"} <span aria-hidden>→</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* bookings */}
          <section
            className={
              view === "list"
                ? "relative mt-6 space-y-5"
                : "relative mt-6 grid grid-cols-1 gap-5 xl:grid-cols-2"
            }
          >
            {results.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
            {results.length === 0 && (
              <p className="py-10 text-center text-[13.5px]" style={{ color: MUTED }}>
                {isLoading
                  ? "Loading your bookings…"
                  : bookings.length === 0
                    ? "You have no bookings yet. Start a new request to see it here."
                    : "No bookings match your filters."}
              </p>
            )}
          </section>

          {/* footer */}
          <footer className="relative mt-5 grid grid-cols-1 items-center gap-3 pb-4 sm:grid-cols-2">
            <p className="text-[12.5px]" style={{ color: MUTED }}>
              Can&rsquo;t find a booking?{" "}
              <button type="button" className="inline-flex items-center gap-1.5" style={{ color: GOLD }}>
                Contact us <span aria-hidden>→</span>
              </button>
            </p>
            <div className="flex items-center gap-3 sm:justify-end">
              <span className="text-[12.5px]" style={{ color: MUTED }}>
                Showing {results.length} of {bookings.length}
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
