import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isProfileComplete, useAuth } from "@/lib/auth";
import { readPendingRequest, clearPendingRequest } from "@/lib/pendingRequest";
import { fetchBookings, createBooking, cancelBooking } from "@/lib/bookingsApi";
import { toast } from "sonner";
import pageTextureAsset from "@/assets/limestone-texture.jpg.asset.json";
import lobbyHeroAsset from "@/assets/manage-hero-fjord-reception.png.asset.json";


import {
  Bell,
  BedDouble,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  Copy,

  Hourglass,

  LifeBuoy,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Moon,
  MoreVertical,
  Plus,
  Grid2X2,
  LayoutList,
  Search,
  Settings,
  SlidersHorizontal,
  Briefcase,
  BellRing,
  User,
  Users,
  X,
  ArrowRight,
  ArrowLeft,
  FileSignature,
  Building2,
  FileText,
  Send,
  BadgeCheck,
} from "lucide-react";
import logo from "@/assets/hotelgroupbook-logo.png.asset.json";
import sidebarAtmos from "@/assets/sidebar-navy-glow.png.asset.json";
import cardStone from "@/assets/card-stone-surface.png.asset.json";
import statStone from "@/assets/stat-card-stone.png.asset.json";

import bellAsset from "@/assets/status-proposal-bell.jpg.asset.json";
import signingAsset from "@/assets/status-awaiting-signing.png.asset.json";
import keyAsset from "@/assets/status-confirmed-key.png.asset.json";
import mountains from "@/assets/dashboard-mountains.jpg";

import cardStoneTexture from "@/assets/card-stone-texture.png.asset.json";
import workspaceStone from "@/assets/workspace-burnt-timber.jpg.asset.json";



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
      { title: "Dashboard — HotelGroupBook" },
      {
        name: "description",
        content:
          "Manage every group stay and event in one calm dashboard: statuses, offers, rooming lists and documents.",
      },
      { property: "og:title", content: "Dashboard — HotelGroupBook" },
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
const SIDEBAR = "#46525E";

/* base colour under the texture + very soft top/bottom lighting */
const SIDEBAR_LAYERS = [
  // soft atmospheric glow emerging from the lower-right corner
  "radial-gradient(120% 70% at 108% 92%, rgba(150,178,205,0.30) 0%, rgba(126,155,182,0.16) 26%, rgba(90,116,142,0.06) 52%, rgba(27,38,50,0) 78%)",
  // secondary, wider ambient bounce so the glow fades naturally
  "radial-gradient(150% 95% at 96% 78%, rgba(120,150,178,0.12) 0%, rgba(27,38,50,0) 70%)",
  // darker top-left behind the logo
  "radial-gradient(110% 80% at 0% 0%, rgba(9,16,24,0.55) 0%, rgba(9,16,24,0.22) 38%, rgba(9,16,24,0) 72%)",
  // gentle vertical light transition
  "linear-gradient(170deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0) 42%, rgba(0,0,0,0.05) 100%)",
  // deep navy base
  "linear-gradient(180deg, #1B2632 0%, #1D2937 46%, #202D3B 100%)",
].join(", ");



const SIDE_TEXT = "rgba(255,255,255,0.90)";
const SIDE_TEXT_2 = "rgba(255,255,255,0.90)";
const SIDE_MUTED = "rgba(255,255,255,0.90)";
const SIDE_LINE = "rgba(255,255,255,0.06)";

const GOLD_DEEP = "#A9853A";
const PAGE = "#646D75";
const CARD = "#31414F";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const CARD_SHADOW =
  "0 2px 6px rgba(0,0,0,0.10), 0 12px 28px rgba(0,0,0,0.16), 0 32px 64px rgba(0,0,0,0.20)";
const PANEL = "#2F3842";
const HAIRLINE = "rgba(255,255,255,0.08)";
const TEXT = "#F1EFE9";
const TEXT_2 = "#B6C3CE";
const MUTED = "#7F8F9C";
const GOLD = "#E3A23C";
const GOLD_SOFT = "#F2C46A";
const PEARL = "#F4F1EA";
const RULE = "rgba(190,205,215,0.20)";
/* deeper, richer premium royal blue (awaiting) — no cyan */
const BLUE = "#4881D5";
/* polished brass — deeper, richer premium gold without glossy near-white peaks */
const GOLD_BRUSHED =
  "linear-gradient(90deg, #6A4C10 0%, #8B6716 22%, #A87F1E 42%, #B98D24 52%, #A2791C 66%, #7E5C13 84%, #5E430B 100%)";
/* brushed champagne metal — richer, less orange, more depth */
const GOLD_BRUSHED_H =
  "linear-gradient(140deg, #B88E43 0%, #C8A55A 18%, #E2C984 38%, #EBD7A2 50%, #E2C984 62%, #C8A55A 82%, #B88E43 100%)";
const GREEN = "#6DBB83";
const RED = "#C96A6A";
/* calm champagne used for labels, icons, hairlines and small accents */
const CHAMPAGNE = "#EEBE44";
const CHAMPAGNE_LINE = "rgba(238,190,68,0.35)";
const IVORY = "#ECE7DF";

const SERIF = '"Cormorant Garamond", "EB Garamond", Georgia, serif';
const SANS = 'Inter, "Helvetica Neue", Arial, sans-serif';

/* ── status grouping (visual layer over existing statuses) ── */

type Group = "all" | "proposal" | "awaiting" | "confirmed" | "attention" | "cancelled";

/** Country segment of a booking destination, e.g. "Bergen, Norway" → "Norway". */
function countryOf(b: Booking): string {
  const parts = (b.destination ?? "").split(",");
  return (parts.length > 1 ? parts[parts.length - 1] : "").trim();
}

function groupOf(b: Booking): Exclude<Group, "all"> {
  const s = b.status;
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
  proposal: CHAMPAGNE,
  awaiting: "#5A88E8",
  confirmed: GREEN,
  attention: "#C9A177",
  cancelled: RED,
};

/* primary action follows the real booking status and keeps its destination */
function primaryAction(b: Booking) {
  /* cancelled bookings keep read-only access only */
  if (b.status === "cancelled")
    return { label: "View booking", to: "/bookings/$bookingId" as const };
  switch (b.action.kind) {
    case "rooming_list":
      return { label: "Complete Rooming List", to: "/rooming/$bookingId" as const };
    case "review_offers":
      return { label: "View proposal", to: "/bookings/$bookingId" as const };
    case "on_track":
      return { label: "View status", to: "/bookings/$bookingId" as const };
    default:
      return { label: "View booking", to: "/bookings/$bookingId" as const };
  }
}

const TRACK_STEPS = [
  { key: "sent", label: "Request Sent", icon: Send },
  { key: "waiting", label: "Waiting for Hotel", icon: Building2 },
  { key: "proposal", label: "Proposal Ready", icon: FileText },
  { key: "confirmed", label: "Confirmed", icon: BadgeCheck },
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
  const cancelled = booking.status === "cancelled";
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
      {/* base rail */}
      <div
        className="absolute left-[12.5%] right-[12.5%] top-[13px] sm:top-[14px]"
        style={{ height: "1px", backgroundColor: "rgba(138,158,180,0.18)" }}
        aria-hidden
      />
      {/* completed rail (muted gold), segment-precise */}
      {active > 0 && (
        <div
          className="absolute left-[12.5%] top-[13px] sm:top-[14px]"
          style={{
            height: "1px",
            width: `${(active / 3) * 75}%`,
            background:
              "linear-gradient(90deg, rgba(198,178,126,0.42) 0%, rgba(210,190,138,0.55) 60%, rgba(216,197,142,0.68) 100%)",
          }}
          aria-hidden
        />
      )}
      {TRACK_STEPS.map((s, i) => {
        const done = i < active;
        const current = i === active;
        const Icon = done ? Check : s.icon;
        return (
          <div key={s.key} className="relative flex flex-col items-center gap-[5px]">
            <span
              className="relative grid h-[24px] w-[24px] place-items-center rounded-full sm:h-[27px] sm:w-[27px]"
              style={{
                background: current
                  ? "radial-gradient(80% 80% at 50% 28%, rgba(245,220,158,0.15) 0%, rgba(13,20,32,0.97) 100%)"
                  : "linear-gradient(180deg, rgba(20,28,40,0.96) 0%, rgba(13,20,32,0.96) 100%)",
                border: `1px solid ${
                  current
                    ? "rgba(226,206,150,0.92)"
                    : done
                      ? "rgba(198,178,126,0.45)"
                      : "rgba(138,158,180,0.30)"
                }`,
                color: current ? CHAMPAGNE : done ? "rgba(206,186,134,0.88)" : "#8FA0B3",
                boxShadow: current
                  ? "0 0 7px rgba(216,197,142,0.22), inset 0 1px 0 rgba(255,246,220,0.13), inset 0 -2px 5px rgba(0,0,0,0.42)"
                  : "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -2px 5px rgba(0,0,0,0.35)",
              }}
            >
              <Icon size={13} strokeWidth={1.6} />
            </span>
            <span
              className={`text-center text-[10.5px] font-light leading-[1.25] tracking-[0.01em] sm:text-[11.5px]${
                current ? " hgb-champagne-metal" : ""
              }`}
              style={current ? undefined : { color: done ? "rgba(203,186,146,0.82)" : "#8FA0B3" }}
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
      className="inline-flex items-center rounded-[8px] px-[13px] py-[6px] text-[12px] font-semibold uppercase tracking-[0.14em]"
      style={{
        color: "#EEBE44",
        border: `1px solid ${CHAMPAGNE_LINE}`,
        background: "linear-gradient(140deg, rgba(184,142,67,0.20) 0%, rgba(216,197,142,0.16) 38%, rgba(235,215,162,0.13) 52%, rgba(184,142,67,0.18) 100%)",
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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const queryClient = useQueryClient();
  const cancelled = booking.status === "cancelled";
  const completed = booking.status === "completed";

  const items = cancelled
    ? [
        { label: "Booking details", to: "/bookings/$bookingId" as const },
        { label: "Documents & contract", to: "/bookings/$bookingId" as const },
      ]
    : [
        { label: "Booking details", to: "/bookings/$bookingId" as const },
        { label: "Edit booking", to: "/bookings/$bookingId" as const },
        { label: "Request change", to: "/bookings/$bookingId" as const },
        { label: "Rooming list", to: "/rooming/$bookingId" as const },
        { label: "Documents & contract", to: "/bookings/$bookingId" as const },
      ];

  const showCancel = !cancelled && !completed;

  async function runCancel() {
    if (pending) return;
    setPending(true);
    try {
      await cancelBooking(booking.id);
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setConfirmOpen(false);
      toast("Booking cancelled and moved to Cancelled Bookings.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel booking");
    } finally {
      setPending(false);
    }
  }

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
                style={{ color: TEXT_2 }}
              >
                {it.label}
              </Link>
            ))}
            {showCancel && (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  setConfirmOpen(true);
                }}
                className="block w-full px-4 py-2.5 text-left text-[13px] hover:bg-white/5"
                style={{ color: RED }}
              >
                Cancel booking
              </button>
            )}
          </div>
        </>
      )}

      {confirmOpen && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          style={{ background: "rgba(6,10,14,0.62)", backdropFilter: "blur(3px)" }}
          role="dialog"
          aria-modal="true"
          aria-label="Cancel booking"
        >
          <div
            className="w-full max-w-[420px] rounded-[14px] p-6"
            style={{
              backgroundColor: "#101A24",
              border: `1px solid ${HAIRLINE}`,
              boxShadow: "0 40px 80px -30px rgba(0,0,0,0.8)",
            }}
          >
            <h2 className="text-[19px]" style={{ color: "#ECE7DF" }}>
              Cancel booking?
            </h2>
            <p className="mt-3 text-[14px]" style={{ color: TEXT_2 }}>
              {booking.name}
            </p>
            <p className="text-[12.5px]" style={{ color: MUTED }}>
              {booking.reference}
            </p>
            <p className="mt-4 text-[13px] leading-relaxed" style={{ color: TEXT_2 }}>
              This booking will be moved to Cancelled Bookings. Its history and documents will be
              preserved.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-[8px] px-4 py-2 text-[13px] hover:bg-white/5"
                style={{ color: TEXT_2, border: `1px solid ${HAIRLINE}` }}
              >
                Keep booking
              </button>
              <button
                type="button"
                onClick={() => void runCancel()}
                disabled={pending}
                className="rounded-[8px] px-4 py-2 text-[13px] disabled:opacity-60"
                style={{ color: RED, border: `1px solid ${RED}55`, background: "rgba(180,99,106,0.10)" }}
              >
                {pending ? "Cancelling…" : "Cancel booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── booking card ────────────────────────────────────── */

function BookingCard({ booking, compact }: { booking: Booking; compact?: boolean }) {
  const g = groupOf(booking);
  const tone = GROUP_COLOR[g];
  const action = primaryAction(booking);

  const metas = (
    booking.type === "me"
      ? [
          { icon: <MapPin size={13} strokeWidth={1.6} />, text: booking.destination },
          {
            icon: <CalendarDays size={13} strokeWidth={1.6} />,
            text: formatRange(booking.startDate, booking.endDate),
          },
          { icon: <Moon size={13} strokeWidth={1.6} />, text: `${booking.nights} nights` },
          {
            icon: <BedDouble size={13} strokeWidth={1.6} />,
            text: `${booking.meetingSpaces ?? 0} meeting spaces`,
          },
          { icon: <Users size={13} strokeWidth={1.6} />, text: `${booking.delegates ?? 0} delegates` },
        ]
      : [
          { icon: <MapPin size={13} strokeWidth={1.6} />, text: booking.destination },
          {
            icon: <CalendarDays size={13} strokeWidth={1.6} />,
            text: formatRange(booking.startDate, booking.endDate),
          },
          { icon: <Moon size={13} strokeWidth={1.6} />, text: `${booking.nights} nights` },
          { icon: <BedDouble size={13} strokeWidth={1.6} />, text: `${booking.rooms ?? 0} rooms` },
          { icon: <Users size={13} strokeWidth={1.6} />, text: `${booking.guests ?? 0} guests` },
        ]
  );

  const info = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="block" style={{ position: "relative", top: -5 }}>
            <TypeChip type={booking.type} />
          </span>
          <Link
            to="/bookings/$bookingId"
            params={{ bookingId: booking.id }}
            className="mt-[5px] block transition-opacity hover:opacity-85"
            style={{ position: "relative", top: -3, marginBottom: -2 }}
          >
            <h3
              className="text-[28px] leading-[1.05] tracking-[0.002em]"
              style={{ color: PEARL, fontFamily: SERIF, fontWeight: 500 }}
            >
              {booking.name}
            </h3>


          </Link>
        </div>
        <div className="flex shrink-0 items-start gap-2">
          <span
            className="mt-1.5 hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] sm:inline-flex"
            style={{ color: tone }}
          >
            <span
              className="inline-block h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: tone, boxShadow: `0 0 0 3px ${tone}1F, 0 0 5px ${tone}80` }}
            />
            {GROUP_LABEL[g]}
          </span>

          <RowMenu booking={booking} />
        </div>
      </div>

      {/* metadata chips */}
      <div className="mt-[6px] flex flex-wrap items-center gap-[6px]">
        {metas.map((m, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-[7px] whitespace-nowrap rounded-[5px] px-[12px] py-[3px] text-[12px] font-light"

            style={{
              color: "#E6EDF3",
              border: "1px solid rgba(255,255,255,0.055)",
              background: "linear-gradient(180deg, #1C2632 0%, #161E29 100%)",
              /* subtle raised effect — soft top highlight + bottom drop shadow, ~1px lifted */
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.085), 0 1px 1px rgba(0,0,0,0.34), 0 2px 4px rgba(0,0,0,0.22)",
            }}
          >
            <span className="shrink-0" style={{ color: CHAMPAGNE }}>
              {m.icon}
            </span>
            {m.text}
          </span>
        ))}
      </div>



      {/* reference panel */}
      <div
        className="mt-[9px] grid grid-cols-1 overflow-hidden rounded-[8px] sm:grid-cols-2"
        style={{
          border: "1px solid rgba(255,255,255,0.055)",
          background: "linear-gradient(180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.09) 100%)",
          /* shallow imprint: soft top wall + faint bottom rim light */
          boxShadow:
            "inset 0 2px 4px rgba(0,0,0,0.22), inset 0 -1px 0 rgba(255,255,255,0.035), 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="px-[14px] py-[5px]">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: CHAMPAGNE }}
          >
            Your reference
          </p>
          <span className="mt-[2px] flex items-center gap-2">
            <span className="text-[14px] leading-none" style={{ color: IVORY, fontWeight: 400 }}>
              {booking.reference}
            </span>
            <button
              type="button"
              aria-label={`Copy reference ${booking.reference}`}
              onClick={() => {
                void navigator.clipboard
                  ?.writeText(booking.reference)
                  .then(() => toast("Reference copied"))
                  .catch(() => toast.error("Could not copy reference"));
              }}
              className="grid h-[20px] w-[20px] shrink-0 place-items-center rounded-[5px] transition-colors hover:bg-white/10"
              style={{ color: "#93A5B2" }}
            >
              <Copy size={12} strokeWidth={1.8} />
            </button>
          </span>

        </div>
        <div
          className="px-[14px] py-[5px]"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}
        >

          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: CHAMPAGNE }}
          >
            Hotel reference
          </p>
          <p
            className="mt-[2px] text-[14px] leading-none"
            style={{ color: booking.hotelReference ? IVORY : "#93A5B2", fontWeight: 400 }}
          >
            {booking.hotelReference ?? "Pending"}
          </p>
        </div>
      </div>


      {/* progress track */}
      <div className="mt-[9px]">
        <Timeline booking={booking} />
      </div>

      {/* footer */}
      <div
        className="mt-[8px] flex flex-nowrap items-center justify-between gap-4 pt-[7px]"
        style={{ borderTop: "1px solid rgba(255,255,255,0.038)" }}

      >

        <p
          className="min-w-0 flex-1 truncate text-[13px] font-light"
          style={{ color: "#AFC0CD" }}
        >
          {booking.statusNote ?? ""}
        </p>
        <Link
          to={action.to}
          params={{ bookingId: booking.id }}
          className="hgb-view-btn hgb-gold-sheen group/btn relative inline-flex shrink-0 items-center gap-4 overflow-hidden whitespace-nowrap rounded-[8px] px-[20px] py-[9px] text-[15px]"
          style={{
            marginTop: 12,
            color: "#E4D3A2",
            border: "1.5px solid transparent",
            background: `linear-gradient(180deg, #1A2330 0%, #131C27 100%) padding-box, ${GOLD_BRUSHED_H} border-box`,
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.45), 0 0 12px rgba(216,197,142,0.14), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <span className="hgb-champagne-metal">{action.label}</span>
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover/btn:translate-x-[3px]"
            style={{ color: CHAMPAGNE }}
          />
        </Link>

      </div>
    </>
  );

  /* brushed champagne metal strip, flush along the card's left edge */
  const goldStrip = (
    <span
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-0 top-0 z-[2]"
      style={{ width: 17, background: GOLD_BRUSHED_H }}
    />
  );

  const shell = {
    backgroundImage: [
      /* quiet architectural light so the coated navy reads dimensional, not flat */
      "radial-gradient(120% 110% at 10% 0%, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 32%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.14) 100%)",
      /* readability veil above the material */
      "linear-gradient(180deg, rgba(6,20,31,0.62) 0%, rgba(6,20,31,0.72) 100%)",
      /* embedded stone material */
      `url(${cardStone.url})`,
      "linear-gradient(158deg, #17222E 0%, #141E29 52%, #111A24 100%)",
    ].join(", "),
    backgroundSize: "auto, auto, cover, auto",
    backgroundPosition: "center, center, center, center",
    backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat",
    border: "1px solid rgba(255,255,255,0.055)",
    borderLeft: "none",
    borderRadius: 12,
    boxShadow:
      "0 10px 24px rgba(12,16,22,0.34), 0 2px 4px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.055), inset 0 -8px 20px rgba(0,0,0,0.42)",
  } as const;









  const media = (
    <div
      className={
        compact
          ? "relative overflow-hidden"
          : "relative rounded-[16px] p-[8px] sm:h-full sm:self-stretch"
      }
      style={
        compact
          ? undefined
          : {
              /* pulled closer to the machined gold edge without moving any other content */
              marginLeft: -10,
              /* top edge stays fixed; bottom extends ~6px downward only */
              marginTop: -8,
              marginBottom: -14,
              background: "linear-gradient(180deg, #18212C 0%, #131B25 100%)",
              border: "1px solid rgba(255,255,255,0.055)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -4px 12px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.35)",
            }
      }
    >
      <div
        className={
          compact
            ? "relative overflow-hidden"
            : "relative h-full overflow-hidden rounded-[8px]"
        }
        style={
          compact
            ? undefined
            : {
                border: "1px solid rgba(0,0,0,0.55)",
                boxShadow:
                  "inset 0 2px 8px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04)",
              }
        }
      >
        <img
          src={booking.image}
          alt={`${booking.destination} — ${booking.name}`}
          loading="lazy"
          className={
            compact
              ? "h-[88px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              : "h-[124px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] sm:h-full"
          }
          style={{ filter: "saturate(0.95) contrast(1.06) brightness(0.84)", objectPosition: compact ? undefined : "center calc(50% + 1px)" }}
        />
        <span
          aria-hidden
          className="absolute inset-0"
          style={{
            background: compact
              ? "linear-gradient(180deg, rgba(8,15,23,0) 40%, rgba(14,23,33,0.7) 100%)"
              : "radial-gradient(120% 100% at 50% 50%, rgba(10,17,25,0) 62%, rgba(10,17,25,0.30) 100%)",
          }}
        />
      </div>
    </div>


  );

  if (compact) {
    return (
      <article className="hgb-booking-card group relative overflow-hidden py-[25px] pr-[24px] transition-all duration-300" style={shell}>
        {goldStrip}
        <div>{media}</div>
        <div className="py-3 pr-3">{info}</div>
      </article>
    );
  }

  return (
    <article
      className="hgb-booking-card group relative grid grid-cols-1 items-stretch gap-[14px] overflow-hidden py-[25px] pr-[24px] transition-all duration-300 sm:grid-cols-[278px_minmax(0,1fr)] lg:grid-cols-[294px_minmax(0,1fr)]"
      style={shell}
    >
      {goldStrip}
      {media}
      <div className="min-w-0">{info}</div>
    </article>
  );




}




/* ── stat tiles ──────────────────────────────────────── */

function StatTile({
  label,
  count,
  icon,
  active,
  action,
  footer,
  accent,
  bgPos,
  onClick,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  active: boolean;
  action?: boolean;
  footer?: string;
  accent: string;
  bgPos: string;
  onClick: () => void;
}) {
  const linkColor =
    footer === "Review proposals"
      ? "#EAB43C"
      : footer === "Review now"
        ? "rgba(210,217,223,0.78)"
        : "#66B8F2";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="hgb-stat-tile relative flex w-full flex-col justify-between overflow-hidden rounded-[14px] text-left transition-all duration-200 hover:-translate-y-[2px]"
      style={{
        background:
          "linear-gradient(145deg, #132231 0%, #0E1B27 55%, #091520 100%)",
        border: "1px solid rgba(150,170,185,0.32)",
        boxShadow:
          "0 8px 20px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.035)",
        paddingLeft: 30,
        paddingRight: 28,
        paddingTop: 6,
        paddingBottom: 2,
      }}
    >
      {action && (
        <span
          className="absolute inline-flex items-center gap-1 rounded-full px-[9px] py-[2.5px] text-[9.5px] font-medium uppercase tracking-[0.16em]"
          style={{
            top: 13,
            right: 14,
            color: accent,
            border: `1px solid ${accent}66`,
            background: "rgba(6,20,31,0.55)",
          }}
        >
          Action needed
        </span>
      )}
      <span className="flex items-center" style={{ gap: 18 }}>
        <span className="flex shrink-0 items-center justify-center" style={{ color: accent, width: 30, height: 30 }}>
          {icon}
        </span>
        <span className="flex min-w-0 flex-col items-start">
          <span
            className="status-number block text-[32px]"
            style={{
              color: "rgba(250,248,243,0.97)",
              fontFamily: SERIF,
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              margin: 0,
              padding: 0,
            }}
          >
            {count}
          </span>
          <span
            className="status-label block truncate text-[14px] font-medium"
            style={{
              color: "rgba(239,243,246,0.92)",
              lineHeight: 1.2,
              marginTop: 8,
            }}
          >
            {label}
          </span>
        </span>
      </span>
      <span
        className="hgb-stat-link flex items-center text-[13.5px] font-medium"
        style={{
          gap: 7,
          marginTop: 9,
          paddingTop: 8,
          borderTop: "1px solid rgba(255,255,255,0.10)",
          color: linkColor,
        }}
      >
        {footer ?? "View bookings"} <ArrowRight size={13} />
      </span>
    </button>
  );
}




import { GlobalSidebar as Sidebar, RAIL_MS, RAIL_EASE } from "@/components/GlobalSidebar";


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
    <div
      className="group relative flex-1 rounded-[11px]"
      style={{
        background: "rgba(216,222,228,0.90)",
        border: "1px solid rgba(255,255,255,0.16)",
      }}
    >
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full cursor-pointer appearance-none bg-transparent py-[10px] pl-4 pr-10 text-left text-[13.5px] outline-none"
        style={{ color: "#242A31", letterSpacing: "0.005em" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ backgroundColor: "#FBF9F4", color: "#2C3038" }}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={17}
        strokeWidth={1.8}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        style={{ color: "#4A525B" }}
      />

    </div>
  );

}

const STATUS_DOTS: Record<string, string> = {
  awaiting: "#7C93A6",
  proposal: "#C5A24B",
  confirmed: "#6FA98A",
  attention: "#E0A45C",
  cancelled: "#9AA0A6",
};

function FilterSelect<T extends string>({
  value,
  onChange,
  options,
  label,
  menuWidth,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
  menuWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const current = options[selectedIndex];

  useEffect(() => {
    if (!open) return;
    setActive(selectedIndex);
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open]);

  const commit = (i: number) => {
    const o = options[i];
    if (o) onChange(o.value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit(active);
    }
  };

  return (
    <div
      ref={wrapRef}
      className="group relative flex min-w-0 flex-1 items-center rounded-[11px] md:w-[168px] md:flex-none"
      style={{ background: "rgba(255,255,255,0.42)", border: "1px solid rgba(110,106,96,0.20)" }}
    >
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="w-full cursor-pointer appearance-none truncate bg-transparent py-[12px] pl-4 pr-10 text-left text-[14px] outline-none focus-visible:ring-2 focus-visible:ring-[rgba(197,162,75,0.55)] rounded-[11px]"
        style={{ color: "#3B3B34", letterSpacing: "0.005em" }}
      >
        {current?.label ?? label}
      </button>
      <ChevronDown
        size={17}
        strokeWidth={1.8}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        style={{
          color: "#6B6858",
          transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
          transition: "transform 160ms ease",
        }}
      />

      {open && (
        <div
          ref={listRef}
          role="listbox"
          aria-label={label}
          tabIndex={-1}
          onKeyDown={onKeyDown}
          className="absolute left-0 top-full z-50 outline-none"
          style={{
            marginTop: 6,
            minWidth: "100%",
            width: menuWidth ? `${menuWidth}px` : undefined,
            background: "#F3F2EE",
            border: "1px solid rgba(15,22,32,0.10)",
            borderRadius: 10,
            boxShadow: "0 12px 30px rgba(6,20,31,0.16), 0 2px 8px rgba(6,20,31,0.08)",
            padding: 6,
          }}
        >
          {options.map((o, i) => {
            const isSel = o.value === value;
            const isActive = i === active;
            const dot = STATUS_DOTS[o.value as string];
            return (
              <div
                key={o.value}
                role="option"
                aria-selected={isSel}
                onMouseEnter={() => setActive(i)}
                onClick={() => commit(i)}
                className="flex cursor-pointer items-center gap-2 whitespace-nowrap text-[14px]"
                style={{
                  height: 38,
                  padding: "0 12px",
                  borderRadius: 7,
                  color: isSel ? "#1E2A35" : "#35404A",
                  fontWeight: isSel ? 500 : 400,
                  background: isSel
                    ? "#E3E6E7"
                    : isActive
                      ? "rgba(23,57,87,0.06)"
                      : "transparent",
                }}
              >
                {dot && (
                  <span
                    aria-hidden
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: dot,
                      opacity: 0.75,
                      flexShrink: 0,
                    }}
                  />
                )}
                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                {isSel && <Check size={14} strokeWidth={2.2} style={{ color: "#C5A24B" }} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}





/* ── page ────────────────────────────────────────────── */

type DateChoice = "all" | "upcoming" | "this_month" | "next_90" | "past";

function ManageBookings() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<Group>("all");
  const [country, setCountry] = useState<string>("all");
  const [dateChoice, setDateChoice] = useState<DateChoice>("all");
  const [view, setView] = useState<"grid" | "list">("list");
  const [scope, setScope] = useState<"active" | "cancelled" | "all">("active");
  const [navOpen, setNavOpen] = useState(false);

  /* ⌘K / Ctrl+K focuses the workspace search */
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);


  /* luxury rail: labels fade out before the width animates, and fade in after it opens */
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [railLabels, setRailLabels] = useState(true);
  const railTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => railTimers.current.forEach(clearTimeout), []);
  const toggleRail = () => {
    railTimers.current.forEach(clearTimeout);
    railTimers.current = [];
    if (railCollapsed) {
      setRailCollapsed(false);
      railTimers.current.push(setTimeout(() => setRailLabels(true), 240));
    } else {
      setRailLabels(false);
      railTimers.current.push(setTimeout(() => setRailCollapsed(true), 160));
    }
  };



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
    if (scope === "active") list = list.filter((b) => b.status !== "cancelled");
    if (scope === "cancelled") list = list.filter((b) => b.status === "cancelled");
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
    if (country !== "all") list = list.filter((b) => countryOf(b) === country);
    return list;
  }, [bookings, query, group, country, dateChoice, scope]);

  const countryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const b of bookings) {
      const c = countryOf(b);
      if (c) set.add(c);
    }
    return [
      { value: "all", label: "Country" },
      ...[...set].sort().map((c) => ({ value: c, label: c })),
    ];
  }, [bookings]);

  const counts = useMemo(() => {
    const c = { proposal: 0, awaiting: 0, confirmed: 0, attention: 0, cancelled: 0 };
    for (const b of bookings) c[groupOf(b)] += 1;
    return c;
  }, [bookings]);

  // bookings where the user must act (review a proposal, supply a rooming list, etc.)
  const needsAttention = counts.proposal + counts.attention;

  const scopeCounts = useMemo(() => {
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    return { active: bookings.length - cancelled, cancelled, all: bookings.length };
  }, [bookings]);

  const roomingTarget =
    bookings.find((b) => b.status === "rooming_list_required")?.id ?? bookings[0]?.id;




  /* upcoming stays within the next 7 days + the nearest deadlines */
  const upcoming = useMemo(() => {
    const now = Date.now();
    return bookings
      .filter((b) => b.status !== "cancelled")
      .map((b) => ({ b, t: new Date(b.startDate).getTime() }))
      .filter((x) => !Number.isNaN(x.t) && x.t >= now)
      .sort((a, z) => a.t - z.t);
  }, [bookings]);

  const next7 = useMemo(() => {
    const now = Date.now();
    const week = now + 7 * 864e5;
    return upcoming.filter((x) => x.t <= week).length;
  }, [upcoming]);




  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim() || profile.email
    : (session?.user.email ?? "");
  const firstName = profile?.first_name?.trim() || displayName.split("@")[0] || "back";
  const initials =
    (profile?.first_name?.[0] ?? displayName[0] ?? "").toUpperCase() +
    (profile?.last_name?.[0] ?? "").toUpperCase();

  const notificationCount = counts.proposal + counts.attention;
  const heroImage = bookings[0]?.image ?? mountains;
  const railWidth = railCollapsed ? 76 : 240;


  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#05101A",
        backgroundImage: "none",
        fontFamily: SANS,
      }}
    >
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden lg:block"
        style={{
          width: railWidth,
          transition: `width ${RAIL_MS}ms ${RAIL_EASE}`,
        }}
      >
        <Sidebar
          active="Dashboard"
          roomingBookingId={roomingTarget}
          displayName={displayName}
          initials={initials}
          email={session?.user.email ?? ""}
          onSignOut={() => void signOut()}
          collapsed={railCollapsed}
          showLabels={railLabels}
          onToggle={toggleRail}
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
              active="Dashboard"
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
              style={{ color: SIDE_TEXT_2 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="hgb-rail-shift" style={{ ["--rail-w" as string]: `${railWidth}px` }}>
        <main
          className="relative min-h-screen lg:pt-10"
          style={{
            backgroundColor: "#05101A",
            backgroundImage:
              "linear-gradient(180deg, #05101A 0px, #05101A 160px, #05101A 100%)",
          }}

        >
          {/* lobby hero — wide landscape photograph fading into the dashboard */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[300px] sm:h-[380px] lg:h-[440px] overflow-hidden"
          >
            <img
              src={lobbyHeroAsset.url}
              alt=""
              className="h-full w-full object-cover object-[58%_35%] sm:object-[54%_35%] lg:object-[center_35%]"
              style={{ filter: "brightness(1.09) contrast(0.94) saturate(0.96)" }}
            />
            {/* shadow lift — softens the deepest blacks without washing out */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, rgba(148,166,184,0.07) 0%, rgba(148,166,184,0.05) 100%)",
                mixBlendMode: "screen",
              }}
            />

            {/* subtle localized readability veil behind the left headline only */}
            <div
              className="absolute inset-y-0 left-0 w-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(5,16,26,0.14) 0%, rgba(5,16,26,0.05) 30%, rgba(5,16,26,0) 55%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(5,16,26,0) 0%, rgba(5,16,26,0.35) 55%, rgba(5,16,26,0.75) 85%, rgba(5,16,26,1) 100%)",
              }}
            />
          </div>







          <div className="relative mx-auto w-full max-w-[1580px] px-4 pb-10 pt-5 sm:px-6 lg:px-8 xl:px-10">

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

            {/* hero header */}
            <header className="mt-[150px] flex items-start justify-between gap-6 sm:mt-[210px] lg:mt-[225px]">
              <div
                className="relative min-w-0"
                style={{ position: "relative", top: -20, left: 0, textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{
                    left: -40,
                    right: -80,
                    top: -34,
                    bottom: -26,
                    background:
                      "linear-gradient(90deg, rgba(6,20,31,0.60) 0%, rgba(6,20,31,0.30) 45%, rgba(6,20,31,0) 100%)",
                    filter: "blur(6px)",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute"
                  style={{ left: 0, top: -16, width: 64, height: 2, background: "#C5A24B" }}
                />


                <h1
                  className="relative text-[34px] leading-[1.1] sm:text-[45px]"
                  style={{ color: "#FFFFFF", fontFamily: SERIF, fontWeight: 400 }}
                >
                  Welcome, {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
                </h1>
                <p className="relative mt-1.5 text-[16px]" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Your groups, stays and next steps — all in one place.
                </p>
              </div>




              <div className="absolute right-4 top-6 z-10 hidden shrink-0 items-center gap-5 sm:right-6 lg:right-8 lg:-top-4 lg:flex xl:right-10">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/5"
                  style={{ color: "#E5E9EE" }}
                >
                  <Bell size={20} strokeWidth={1.7} />
                  {notificationCount > 0 && (
                    <span
                      className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-[4px] text-[10.5px] font-semibold"
                      style={{ backgroundColor: GOLD, color: "#20180A" }}
                    >
                      {notificationCount}
                    </span>
                  )}
                </button>

                <Link to="/account" className="flex items-center gap-3">
                  <span
                    className="grid h-11 w-11 place-items-center overflow-hidden rounded-full text-[13px] font-semibold tracking-[0.06em]"
                    style={{
                      border: "1px solid rgba(226,190,110,0.45)",
                      color: GOLD_SOFT,
                      backgroundColor: "rgba(10,18,27,0.45)",
                    }}
                  >
                    {initials || "—"}
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block truncate text-[15px]" style={{ color: "#F1EFE9" }}>
                      {displayName || "Your account"}
                    </span>
                    <span className="block truncate text-[12.5px]" style={{ color: "#A9B7C3" }}>
                      Group Coordinator
                    </span>
                  </span>
                  <ChevronDown size={18} style={{ color: "#A9B7C3" }} />
                </Link>
              </div>

              <div className="flex items-center gap-3 lg:hidden">
                <Link
                  to="/book-leisure"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px]"
                  style={{ border: `1px solid ${GOLD}88`, color: GOLD_SOFT }}
                >
                  <Plus size={15} /> New
                </Link>
              </div>
            </header>


            {/* stat tiles */}
            <section className="mt-[1px] grid grid-cols-2 items-stretch gap-3 xl:grid-cols-4">
              <StatTile
                label="Awaiting response"
                count={counts.awaiting}
                icon={<Hourglass size={30} strokeWidth={1.4} />}
                active={group === "awaiting"}
                accent="#58AFFF"
                bgPos="15% center"
                footer="View bookings"
                onClick={() => setGroup(group === "awaiting" ? "all" : "awaiting")}
              />
              <StatTile
                label="Proposal ready"
                count={counts.proposal}
                icon={<FileSignature size={30} strokeWidth={1.4} />}
                action={counts.proposal > 0}
                active={group === "proposal"}
                accent="#F2B632"
                bgPos="40% center"
                footer="Review proposals"
                onClick={() => setGroup(group === "proposal" ? "all" : "proposal")}
              />
              <StatTile
                label="Confirmed"
                count={counts.confirmed}
                icon={<Check size={30} strokeWidth={1.4} />}
                active={group === "confirmed"}
                accent="#7DD59B"
                bgPos="65% center"
                footer="View bookings"
                onClick={() => setGroup(group === "confirmed" ? "all" : "confirmed")}
              />
              <StatTile
                label="Needs attention"
                count={needsAttention}
                icon={<BellRing size={30} strokeWidth={1.4} />}
                active={group === "attention"}
                action={needsAttention > 0}
                accent={needsAttention > 0 ? "#B8C1CA" : "#8C9AA6"}
                bgPos="85% center"
                footer="Review now"
                onClick={() => setGroup(group === "attention" ? "all" : "attention")}
              />

            </section>





            {!isProfileComplete(profile) && (
              <section
                className="mt-4 flex flex-col gap-3 rounded-[14px] px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
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


            {/* booking list — full width */}
            <div className="mt-[10px]">
            <div className="min-w-0">


            {/* bookings — premium stone workspace panel */}
            <section
              className="hgb-stone-surface relative isolate mt-[18px] overflow-hidden rounded-[22px] p-[22px] sm:p-[26px]"
              style={{
                border: "1px solid rgba(120,116,104,0.22)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.62), inset 0 -1px 0 rgba(0,0,0,0.06), 0 26px 60px -28px rgba(6,10,15,0.62)",
              }}
            >
              {/* Rad 1 — Active / Cancelled / All */}
              <div className="mb-[14px] flex flex-wrap items-center gap-2">
                {(
                  [
                    { key: "active" as const, label: "Active Bookings", n: scopeCounts.active },
                    { key: "cancelled" as const, label: "Cancelled Bookings", n: scopeCounts.cancelled },
                    { key: "all" as const, label: "All Bookings", n: scopeCounts.all },
                  ]
                ).map(({ key, label, n }) => {
                  const on = scope === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setScope(key)}
                      className="hgb-scope-tab rounded-[10px] px-[15px] py-[8px] text-[13px] font-medium transition-all duration-200"
                      style={
                        on
                          ? {
                              backgroundColor: "#2A3442",
                              border: "1px solid rgba(255,255,255,0.10)",
                              color: "#F2F3F3",
                              boxShadow:
                                "inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 5px rgba(6,20,31,0.10)",
                            }
                          : {
                              backgroundColor: "#EEEDE9",
                              border: "1px solid rgba(15,22,32,0.09)",
                              color: "#59616A",
                            }
                      }
                    >
                      {label} {n}
                    </button>
                  );
                })}
              </div>

              {/* Rad 2 — søk, filtre, visningsvalg */}
              <div className="mb-[18px] flex flex-col gap-3 md:flex-row md:items-center">
                <div
                  className="relative flex min-w-0 flex-1 items-center rounded-[11px]"
                  style={{
                    background: "rgba(255,255,255,0.52)",
                    border: "1px solid rgba(110,106,96,0.20)",
                  }}
                >
                  <Search
                    size={17}
                    strokeWidth={1.9}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "#7B786C" }}
                  />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search bookings..."
                    aria-label="Search bookings by name, destination, hotel or reference"
                    className="w-full bg-transparent py-[11px] pl-[44px] pr-4 text-[14px] outline-none"
                    style={{ color: "#2E3138" }}
                  />
                </div>

                <FilterSelect
                  label="Status filter"
                  menuWidth={196}

                  value={group}
                  onChange={setGroup}
                  options={[
                    { value: "all", label: "Status" },
                    { value: "awaiting", label: "Awaiting Response" },
                    { value: "proposal", label: "Proposal Ready" },
                    { value: "confirmed", label: "Confirmed" },
                    { value: "attention", label: "Needs Attention" },
                    { value: "cancelled", label: "Cancelled" },
                  ]}
                />
                <FilterSelect
                  label="Country filter"
                  value={country}
                  onChange={setCountry}
                  options={countryOptions}
                />
                <FilterSelect
                  label="Arrival filter"
                  value={dateChoice}
                  onChange={setDateChoice}
                  options={[
                    { value: "all", label: "Arrival" },
                    { value: "upcoming", label: "Upcoming" },
                    { value: "this_month", label: "This Month" },
                    { value: "next_90", label: "Next 3 Months" },
                    { value: "past", label: "Past Stays" },
                  ]}
                />

                <div className="flex min-w-0 items-center gap-2.5">
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
                        className="grid h-[42px] w-[44px] shrink-0 place-items-center rounded-[11px] transition-all duration-200"
                        style={
                          on
                            ? {
                                background: "rgba(255,255,255,0.72)",
                                border: "1px solid rgba(184,142,67,0.7)",
                                color: "#8A6A24",
                              }
                            : {
                                background: "rgba(255,255,255,0.42)",
                                border: "1px solid rgba(110,106,96,0.20)",
                                color: "#6B6858",
                              }
                        }
                      >
                        <Icon size={17} strokeWidth={1.9} />
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    aria-label="More filters"
                    onClick={() => {
                      setQuery("");
                      setGroup("all");
                      setCountry("all");
                      setDateChoice("all");
                    }}
                    className="grid h-[42px] w-[44px] shrink-0 place-items-center rounded-[11px]"
                    style={{
                      background: "rgba(255,255,255,0.42)",
                      border: "1px solid rgba(110,106,96,0.20)",
                      color: "#6B6858",
                    }}
                  >
                    <SlidersHorizontal size={17} strokeWidth={1.9} />
                  </button>
                </div>
              </div>



              <div
                className={
                  view === "list" ? "space-y-[14px]" : "grid grid-cols-1 gap-[14px] xl:grid-cols-2"
                }
              >

                {results.map((b) => (
                  <div key={b.id} className="hgb-card-recess">
                    <BookingCard booking={b} compact={view === "grid"} />
                  </div>

                ))}
                {results.length === 0 && (
                  <p className="py-12 text-center text-[13.5px]" style={{ color: "#C3C8CD" }}>
                    {isLoading
                      ? "Loading your bookings…"
                      : bookings.length === 0
                        ? "You have no bookings yet. Start a new request to see it here."
                        : "No bookings match your filters."}
                  </p>
                )}
              </div>

              <footer className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[12.5px]" style={{ color: "#C3C8CD" }}>
                  Can&rsquo;t find a booking?{" "}
                  <Link to="/account" style={{ color: "#E3C583" }}>
                    Contact us →
                  </Link>
                </p>
                <span className="text-[12.5px]" style={{ color: "#C3C8CD" }}>
                  Showing {results.length} of {bookings.length}
                </span>

              </footer>
            </section>
            </div>

            {/* right sidebar column removed — booking list spans full width */}

            </div>




          </div>
        </main>
      </div>
    </div>
  );
}
