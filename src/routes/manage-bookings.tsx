import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isProfileComplete, useAuth } from "@/lib/auth";
import { readPendingRequest, clearPendingRequest } from "@/lib/pendingRequest";
import { fetchBookings, createBooking, cancelBooking } from "@/lib/bookingsApi";
import { toast } from "sonner";



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
  ArrowLeft,
  FileSignature,
} from "lucide-react";
import logo from "@/assets/hotelgroupbook-logo.png.asset.json";
import sidebarAtmos from "@/assets/sidebar-navy-glow.png.asset.json";
import contentArc from "@/assets/content-slate-glow.png.asset.json";
import bellAsset from "@/assets/status-proposal-bell.jpg.asset.json";
import signingAsset from "@/assets/status-awaiting-signing.png.asset.json";
import keyAsset from "@/assets/status-confirmed-key.png.asset.json";
import mountains from "@/assets/dashboard-mountains.jpg";
import lobbyHeroAsset from "@/assets/manage-hero-lobby.png.asset.json";
import heroVideoAsset from "@/assets/manage-hero-v3.mp4.asset.json";
import goldEdgeAsset from "@/assets/gold-edge-crisp.png.asset.json";
import cardStoneTexture from "@/assets/card-stone-texture.png.asset.json";


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
      <div
        className="absolute left-[12.5%] right-[12.5%] top-[16px]"
        style={{ height: "0.5px", backgroundColor: "rgba(255,255,255,0.054)" }}
        aria-hidden
      />
      <div
        className="absolute left-[12.5%] top-[16px]"
        style={{
          height: "0.5px",
          width: `${(active / 3) * 75}%`,
          background: `linear-gradient(90deg, rgba(216,197,142,0.16) 0%, rgba(216,197,142,0.62) 35%, rgba(226,201,132,0.80) 70%, rgba(235,215,162,0.88) 100%)`,
        }}
        aria-hidden
      />
      {TRACK_STEPS.map((s, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <div key={s.key} className="relative flex flex-col items-center gap-[7px]">
            <span
              className="relative grid h-[32px] w-[32px] place-items-center rounded-full"
              style={{
                background: current
                  ? "radial-gradient(80% 80% at 50% 28%, rgba(245,220,158,0.17) 0%, rgba(13,20,32,0.96) 100%)"
                  : "linear-gradient(180deg, rgba(20,28,40,0.96) 0%, rgba(13,20,32,0.96) 100%)",
                border: `1px solid ${
                  current
                    ? "rgba(216,197,142,0.85)"
                    : done
                      ? "rgba(236,231,221,0.30)"
                      : "rgba(168,182,199,0.28)"
                }`,
                color: current ? CHAMPAGNE : done ? IVORY : "#A9B7C6",
                boxShadow: current
                  ? "0 0 6px rgba(216,197,142,0.26), inset 0 1px 0 rgba(255,246,220,0.14), inset 0 -2px 5px rgba(0,0,0,0.42)"
                  : "inset 0 1px 0 rgba(255,255,255,0.045), inset 0 -2px 5px rgba(0,0,0,0.35)",
              }}
            >
              <s.icon size={14} strokeWidth={1.65} />
            </span>
            <span
              className={`whitespace-pre-line text-center text-[12px] font-light leading-[1.25] tracking-[0.01em]${
                current ? " hgb-champagne-metal" : ""
              }`}
              style={current ? undefined : { color: done ? IVORY : "#A9B7C6" }}
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
        { label: "Rooming list", to: "/rooming-list/$bookingId" as const },
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
          { icon: <MapPin size={16} strokeWidth={1.6} />, text: booking.destination },
          {
            icon: <CalendarDays size={16} strokeWidth={1.6} />,
            text: formatRange(booking.startDate, booking.endDate),
          },
          { icon: <Moon size={16} strokeWidth={1.6} />, text: `${booking.nights} nights` },
          {
            icon: <BedDouble size={16} strokeWidth={1.6} />,
            text: `${booking.meetingSpaces ?? 0} meeting spaces`,
          },
          { icon: <Users size={16} strokeWidth={1.6} />, text: `${booking.delegates ?? 0} delegates` },
        ]
      : [
          { icon: <MapPin size={16} strokeWidth={1.6} />, text: booking.destination },
          {
            icon: <CalendarDays size={16} strokeWidth={1.6} />,
            text: formatRange(booking.startDate, booking.endDate),
          },
          { icon: <Moon size={16} strokeWidth={1.6} />, text: `${booking.nights} nights` },
          { icon: <BedDouble size={16} strokeWidth={1.6} />, text: `${booking.rooms ?? 0} rooms` },
          { icon: <Users size={16} strokeWidth={1.6} />, text: `${booking.guests ?? 0} guests` },
        ]
  );

  const info = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <TypeChip type={booking.type} />
          <Link
            to="/bookings/$bookingId"
            params={{ bookingId: booking.id }}
            className="mt-[7px] block truncate transition-opacity hover:opacity-85"
          >
            <h3
              className="truncate text-[28px] leading-[1.05] tracking-[0.002em]"
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
      <div className="mt-[9px] flex flex-wrap items-center gap-[7px]">
        {metas.map((m, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-[9px] whitespace-nowrap rounded-[5px] px-[12px] py-[5px] text-[13px] font-light"
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
        className="mt-[8px] grid grid-cols-1 overflow-hidden rounded-[8px] sm:grid-cols-2"
        style={{
          border: "1px solid rgba(255,255,255,0.055)",
          background: "linear-gradient(180deg, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.09) 100%)",
          /* shallow imprint: soft top wall + faint bottom rim light */
          boxShadow:
            "inset 0 2px 4px rgba(0,0,0,0.22), inset 0 -1px 0 rgba(255,255,255,0.035), 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div className="px-[20px] py-[8px]">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: CHAMPAGNE }}
          >
            Your reference
          </p>
          <p className="mt-[3px] text-[17px] leading-none" style={{ color: IVORY, fontWeight: 400 }}>
            {booking.reference}
          </p>
        </div>
        <div
          className="px-[20px] py-[8px]"
          style={{ borderLeft: "1px solid rgba(255,255,255,0.07)" }}
        >

          <p
            className="text-[11px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: CHAMPAGNE }}
          >
            Hotel reference
          </p>
          <p
            className="mt-[3px] text-[17px] leading-none"
            style={{ color: booking.hotelReference ? IVORY : "#93A5B2", fontWeight: 400 }}
          >
            {booking.hotelReference ?? "Pending"}
          </p>
        </div>
      </div>


      {/* progress track */}
      <div className="mt-[10px]">
        <Timeline booking={booking} />
      </div>

      {/* footer */}
      <div
        className="mt-[9px] flex flex-nowrap items-center justify-between gap-4 pt-[8px]"
        style={{ borderTop: "1px solid rgba(255,255,255,0.038)" }}

      >

        <p
          className="min-w-0 flex-1 truncate text-[14px] font-light"
          style={{ color: "#AFC0CD" }}
        >
          {booking.statusNote ?? ""}
        </p>
        <Link
          to={action.to}
          params={{ bookingId: booking.id }}
          className="hgb-view-btn hgb-gold-sheen group/btn relative inline-flex shrink-0 items-center gap-4 overflow-hidden whitespace-nowrap rounded-[8px] px-[20px] py-[9px] text-[15px]"
          style={{
            color: "#E4D3A2",
            marginRight: 0,
            border: "1.5px solid transparent",
            background:
              `linear-gradient(180deg, #1A2330 0%, #131C27 100%) padding-box, ${GOLD_BRUSHED_H} border-box`,
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

  const shell = {
    /* the gold edge is part of the card's own shell: a solid-metal left band
       painted in the card background itself, clipped by the card radius */
    backgroundImage: [
      /* the reference metal, resampled crisp and denoised so the broad diagonal
         reflections stay clean and machined at this narrow width */
      `url(${goldEdgeAsset.url})`,
      /* gentle cross-section shading so the band reads as solid metal, not paint */
      "linear-gradient(90deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.03) 14%, rgba(255,255,255,0.07) 40%, rgba(255,255,255,0.05) 66%, rgba(0,0,0,0.06) 88%, rgba(0,0,0,0.28) 100%)",

      /* soft dark slate tint above the stone so the UI stays clean and readable */
      "linear-gradient(180deg, rgba(46,53,62,0.34) 0%, rgba(41,47,56,0.42) 100%)",
      /* architectural stone / micro-cement texture — starts after the gold edge */
      `url("${cardStoneTexture.url}")`,
      "radial-gradient(120% 110% at 8% 0%, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.025) 34%, rgba(0,0,0,0.00) 62%, rgba(0,0,0,0.10) 100%)",
      "linear-gradient(152deg, #434A55 0%, #3B424C 46%, #333A44 78%, #2E353E 100%)",
    ].join(", "),
    backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat, no-repeat",
    backgroundPosition:
      "left top, left top, var(--insert-w) top, var(--insert-w) top, left top, left top",
    backgroundSize:
      "var(--insert-w) 100%, var(--insert-w) 100%, calc(100% - var(--insert-w)) 100%, cover, 100% 100%, 100% 100%",
    backgroundBlendMode: "normal, soft-light, normal, soft-light, normal, normal",




    border: "1px solid rgba(255,255,255,0.055)",
    borderLeft: "none",
    borderRadius: 12,
    /* precision-machined surface — subtle highlights + deep base shadow */
    boxShadow:
      "0 12px 32px rgba(0,0,0,0.48), 0 1px 0 rgba(255,255,255,0.035), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -6px 16px rgba(0,0,0,0.50)",
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
              : "h-[112px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] sm:h-full"
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
      <article className="hgb-booking-card group relative overflow-hidden transition-all duration-300 hover:-translate-y-[2px]" style={shell}>
        <div>{media}</div>
        <div className="py-3 pr-3">{info}</div>
      </article>
    );
  }

  return (
    <article
      className="hgb-booking-card group relative grid grid-cols-1 items-stretch gap-[18px] overflow-hidden py-[16px] pr-[18px] transition-all duration-300 hover:-translate-y-[2px] sm:grid-cols-[minmax(0,22.8%)_minmax(0,1fr)]"

      style={shell}
    >
      {media}
      <div className="min-w-0">{info}</div>
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
  stone,
  icon,
  active,
  onClick,
}: {
  label: string;
  count: number;
  description: string;
  tone: string;
  overlay: string;
  image?: string;
  stone?: boolean;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative flex h-[224px] flex-col overflow-hidden rounded-[14px] p-[20px] text-left transition-transform hover:-translate-y-px${stone ? " stone-surface" : ""}`}
      style={{
        background: image || stone ? undefined : PANEL,
        border: `1px solid ${active ? tone : `${tone}55`}`,
        boxShadow: active
          ? `0 0 0 1px ${tone}55, 0 22px 60px rgba(0,0,0,0.26)`
          : "0 22px 60px rgba(0,0,0,0.26)",
      }}
    >
      {image && <img src={image} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" style={{ filter: "saturate(0.86) brightness(0.90) contrast(1.04)" }} />}

      <span
        className="absolute inset-0"
        aria-hidden
        style={{ background: overlay }}
      />
      {/* glass reflection across the top */}
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-2/5"
        aria-hidden
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.035) 46%, rgba(255,255,255,0) 100%)",
        }}
      />
      {/* faint inner highlight */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[14px]"
        aria-hidden
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14), inset 0 0 0 1px rgba(255,255,255,0.04)" }}
      />


      <span
        className="relative grid h-10 w-10 place-items-center rounded-full"
        style={{ border: `1px solid ${tone}`, color: tone }}
      >
        {icon}
      </span>
      <span
        className="relative mt-3 block text-[11px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: tone }}
      >
        {label}
      </span>
      <span
        className="relative mt-1 block text-[40px] leading-none"
        style={{ color: TEXT, fontFamily: SERIF }}
      >
        {count}
      </span>
      <span className="relative mt-auto flex items-center justify-between">
        <span className="text-[13px]" style={{ color: TEXT_2 }}>
          {description}
        </span>
        <span
          className="grid h-8 w-8 place-items-center rounded-full"
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
  { label: "Dashboard", icon: CalendarCheck },
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

const RAIL_EASE = "cubic-bezier(0.4, 0.0, 0.2, 1)";
const RAIL_MS = 400;

function Sidebar({
  active,
  roomingBookingId,
  displayName,
  initials,
  email,
  onSignOut,
  collapsed = false,
  showLabels = true,
  onToggle,
}: {
  active: string;
  roomingBookingId?: string;
  displayName: string;
  initials: string;
  email: string;
  onSignOut: () => void;
  collapsed?: boolean;
  showLabels?: boolean;
  onToggle?: () => void;
}) {
  const GOLD_LINE = "linear-gradient(180deg, #D8BE72 0%, #C7A24B 50%, #A97E2E 100%)";

  const renderItem = (
    item: { label: string; icon: typeof User },
    opts: { to?: "/rooming-list/$bookingId" | "/account"; params?: { bookingId: string } },
  ) => {
    const isActive = item.label === active;
    const style: React.CSSProperties = {
      background: isActive ? "rgba(255,255,255,0.16)" : "transparent",
      color: "rgba(255,255,255,0.90)",
      fontWeight: isActive ? 600 : 400,
      boxShadow: isActive ? "0 8px 18px rgba(0,0,0,0.12)" : "none",
      border: `1px solid ${isActive ? "rgba(255,255,255,0.12)" : "transparent"}`,
      backdropFilter: isActive ? "blur(8px)" : undefined,
      WebkitBackdropFilter: isActive ? "blur(8px)" : undefined,
      borderRadius: 14,
      padding: collapsed ? "9px 0" : isActive ? "8px 16px" : "9px 16px",
      justifyContent: collapsed ? "center" : "flex-start",
      transition: `padding ${RAIL_MS}ms ${RAIL_EASE}, background-color 220ms ease, box-shadow 220ms ease, transform 220ms ease, color 220ms ease`,
    };

    const row = `hgb-side-item hgb-rail-item group relative flex w-full items-center rounded-[14px] text-left text-[13.5px] ${
      collapsed ? "gap-0" : "gap-3"
    }`;
    const inner = (
      <>
        {isActive && !collapsed && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-[6px] top-[9px] bottom-[9px] w-[2px] rounded-full"
            style={{ background: "#C9B489" }}
          />
        )}
        {isActive && collapsed && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-[7px] top-[10px] bottom-[10px] w-[2px] rounded-full"
            style={{ background: "#C9B489" }}
          />
        )}
        <item.icon
          size={17}
          strokeWidth={1.8}
          className="shrink-0"
          style={{ color: "rgba(255,255,255,0.90)" }}
        />

        <span
          className="hgb-rail-label truncate"
          style={{
            opacity: showLabels ? 1 : 0,
            width: showLabels ? "auto" : 0,
            transition: `opacity ${showLabels ? 220 : 150}ms ease`,
            overflow: "hidden",
          }}
        >
          {item.label}
        </span>
        {collapsed && (
          <span className="hgb-rail-tip pointer-events-none" role="tooltip">
            {item.label}
          </span>
        )}
      </>
    );
    if (opts.to === "/rooming-list/$bookingId" && opts.params) {
      return (
        <Link key={item.label} to={opts.to} params={opts.params} className={row} style={style} title="">
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
    <div
      className={`relative flex h-full flex-col py-7 ${collapsed ? "px-[13px]" : "px-4"}`}
      style={{
        backgroundColor: "transparent",
        backgroundImage: `url("${sidebarAtmos.url}")`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        borderRight: "none",
        boxShadow:
          "inset -1px 0 0 rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.08), 1px 0 30px -16px rgba(20,28,36,0.28)",
        transition: `padding ${RAIL_MS}ms ${RAIL_EASE}`,
      }}
    >







      <div className={`flex items-center ${collapsed ? "flex-col gap-3" : "justify-between gap-2 px-3"}`}>
        <Link to="/" className="block min-w-0 py-2" aria-label="HotelGroupBook">
          {collapsed ? (
            <span
              className="grid h-9 w-9 place-items-center rounded-[12px] text-[12.5px] font-semibold tracking-[0.06em]"
              style={{
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.08)",
              }}
            >
              HGB
            </span>
          ) : (
            <img
              src={logo.url}
              alt="HotelGroupBook"
              className="h-11 w-auto object-contain object-left"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          )}
        </Link>


        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            className="hgb-rail-toggle grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full"
          >
            {collapsed ? (
              <ArrowRight size={15} strokeWidth={1.8} />
            ) : (
              <ArrowLeft size={15} strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>

      <nav className="mt-10 space-y-1.5">
        {PRIMARY_NAV.map((item) =>
          renderItem(
            item,
            item.label === "Rooming Lists" && roomingBookingId
              ? { to: "/rooming-list/$bookingId", params: { bookingId: roomingBookingId } }
              : {},
          ),
        )}
      </nav>

      <div className="mt-auto space-y-1.5 pt-10">
        {SECONDARY_NAV.map((item) =>
          renderItem(item, item.label === "Profile" ? { to: "/account" } : {}),
        )}
      </div>

      <div
        className={`mt-6 flex items-center gap-3 pt-5 ${collapsed ? "justify-center" : ""}`}
        style={{ borderTop: `1px solid ${SIDE_LINE}` }}
      >
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold"
          style={{ backgroundColor: "rgba(169,133,58,0.14)", color: GOLD_DEEP }}
        >
          {initials || "—"}
        </span>
        {!collapsed && (
          <span
            className="min-w-0 flex-1"
            style={{ opacity: showLabels ? 1 : 0, transition: "opacity 200ms ease" }}
          >
            <Link to="/account" className="block truncate text-[12.5px]" style={{ color: SIDE_TEXT }}>
              {displayName || email}
            </Link>
            <button
              type="button"
              onClick={onSignOut}
              className="mt-0.5 inline-flex items-center gap-1.5 text-[11.5px]"
              style={{ color: GOLD_DEEP }}
            >
              <LogOut size={12} /> Log out
            </button>
          </span>
        )}
      </div>
    </div>
  );
}



/* ── select ──────────────────────────────────────────── */

function GoldDivider() {
  return (
    <div
      aria-hidden
      className="hidden shrink-0 self-stretch md:block"
      style={{
        width: 1,
        margin: "10px 0",
        background:
          "linear-gradient(180deg, rgba(214,182,124,0) 0%, rgba(214,182,124,0.42) 30%, rgba(233,209,158,0.55) 50%, rgba(169,133,58,0.40) 72%, rgba(169,133,58,0) 100%)",
      }}
    />
  );
}


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
      className="group relative flex-1 rounded-[10px] transition-colors duration-200 hover:bg-[rgba(255,255,255,0.025)]"
    >
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full cursor-pointer appearance-none bg-transparent py-[11px] pl-5 pr-10 text-left text-[14.5px] outline-none"
        style={{ color: "rgba(255,255,255,0.92)", letterSpacing: "0.005em" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ backgroundColor: "#12151A" }}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={17}
        strokeWidth={1.8}
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
        style={{ color: "rgba(255,255,255,0.62)" }}
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
  const [scope, setScope] = useState<"active" | "cancelled" | "all">("active");
  const [navOpen, setNavOpen] = useState(false);

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
    return list;
  }, [bookings, query, group, dateChoice, scope]);

  const counts = useMemo(() => {
    const c = { proposal: 0, awaiting: 0, confirmed: 0, attention: 0, cancelled: 0 };
    for (const b of bookings) c[groupOf(b)] += 1;
    return c;
  }, [bookings]);

  const scopeCounts = useMemo(() => {
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    return { active: bookings.length - cancelled, cancelled, all: bookings.length };
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

  const deadlines = useMemo(
    () =>
      upcoming.slice(0, 3).map(({ b, t }) => {
        const d = new Date(t);
        return {
          id: b.id,
          day: String(d.getDate()).padStart(2, "0"),
          month: d.toLocaleString("en-GB", { month: "short" }).toUpperCase(),
          title: STATUS_META[b.status]?.label ?? "Upcoming stay",
          sub: b.name,
          remaining: `${Math.max(0, Math.ceil((t - Date.now()) / 864e5))} days remaining`,
        };
      }),
    [upcoming],
  );

  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim() || profile.email
    : (session?.user.email ?? "");
  const firstName = profile?.first_name?.trim() || displayName.split("@")[0] || "back";
  const initials =
    (profile?.first_name?.[0] ?? displayName[0] ?? "").toUpperCase() +
    (profile?.last_name?.[0] ?? "").toUpperCase();

  const heroImage = bookings[0]?.image ?? mountains;
  const railWidth = railCollapsed ? 76 : 240;


  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: PAGE,
        backgroundImage:
          "linear-gradient(180deg, #6A737B 0%, #646D75 35%, #5F6870 100%)",
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
          active="My Bookings"
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
              style={{ color: SIDE_TEXT_2 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="hgb-rail-shift" style={{ ["--rail-w" as string]: `${railWidth}px` }}>
        <main
          className="relative min-h-screen"
          style={{
            backgroundColor: "transparent",
            backgroundImage:
              "radial-gradient(120% 70% at 50% 34%, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 42%, rgba(255,255,255,0) 72%)",
          }}
        >
          {/* layered atmospheric surface — angular light composition */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden"
            style={{
              top: 300,
              backgroundColor: "#0C121A",
              backgroundImage: `url("${contentArc.url}")`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* soft readability veil */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,15,22,0.18) 0%, rgba(10,15,22,0.10) 40%, rgba(10,15,22,0.26) 100%)",
              }}
            />
            {/* quiet vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(118% 90% at 56% 36%, rgba(0,0,0,0) 52%, rgba(4,7,11,0.16) 82%, rgba(4,7,11,0.30) 100%)",
              }}
            />
          </div>







          {/* cinematic hero backdrop */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[358px]"
            aria-hidden
            style={{
              maskImage:
                "linear-gradient(180deg, #000 0%, #000 calc(100% - 60px), rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(180deg, #000 0%, #000 calc(100% - 60px), rgba(0,0,0,0) 100%)",
            }}
          >
            <video
              src={heroVideoAsset.url}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={lobbyHeroAsset.url}
              className="h-full w-full object-cover"
              style={{ objectPosition: "center center" }}
            />
            <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.12)" }} />
          </div>




          <div className="relative px-4 pb-10 pt-5 sm:px-6 lg:px-10">
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

            {/* top action bar */}
            <div className="mb-5 hidden items-center justify-end gap-3 lg:flex">
              <Link
                to="/book-leisure"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] transition-colors hover:bg-white/5"
                style={{
                  backgroundColor: "rgba(10,18,27,0.45)",
                  border: `1px solid ${GOLD}88`,
                  color: GOLD_SOFT,
                  backdropFilter: "blur(6px)",
                }}
              >
                <Plus size={15} /> New booking
              </Link>
              <button
                type="button"
                aria-label="Notifications"
                className="relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/5"
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  color: TEXT_2,
                  backgroundColor: "rgba(10,18,27,0.4)",
                }}
              >
                <Bell size={16} />
                <span
                  className="absolute right-[9px] top-[9px] h-[6px] w-[6px] rounded-full"
                  style={{ backgroundColor: "#C6584F" }}
                />
              </button>
              <Link
                to="/account"
                aria-label="Your account"
                className="grid h-10 w-10 place-items-center rounded-full text-[11.5px] font-semibold tracking-[0.06em]"
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  color: GOLD_SOFT,
                  backgroundColor: "rgba(10,18,27,0.4)",
                }}
              >
                {initials || "—"}
              </Link>
            </div>

            {/* greeting */}
            <header className="mt-[26px] max-w-[720px]">
              <div className="flex items-end gap-5">
                <h1
                  className="text-[38px] leading-[1.02] sm:text-[50px]"
                  style={{ color: TEXT, fontFamily: SERIF, fontWeight: 400 }}
                >
                  Welcome {firstName}
                </h1>
                <span
                  className="mb-3 hidden h-px flex-1 sm:block"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(201,162,75,0.55) 0%, rgba(201,162,75,0.06) 100%)",
                  }}
                  aria-hidden
                />
              </div>
              <p className="mt-2 text-[14px]" style={{ color: TEXT_2 }}>
                Here&rsquo;s what&rsquo;s happening with your group stays.
              </p>

              <div className="mt-5 flex items-center gap-3 lg:hidden">
                <Link
                  to="/book-leisure"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px]"
                  style={{ border: `1px solid ${GOLD}88`, color: GOLD_SOFT }}
                >
                  <Plus size={15} /> New booking
                </Link>
              </div>
            </header>


            {/* status cards */}
            <section className="mt-[38px] grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">


              <StatusCard
                label="Proposal ready"
                count={counts.proposal}
                description="Proposal ready"
                tone={GOLD}
                overlay="linear-gradient(90deg, rgba(20,14,8,0.15) 0%, rgba(120,72,20,0.09) 45%, rgba(0,0,0,0.03) 100%)"
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
                overlay="linear-gradient(90deg, rgba(8,12,24,0.15) 0%, rgba(30,64,120,0.09) 45%, rgba(0,0,0,0.03) 100%)"
                image={signingAsset.url}
                icon={<Hourglass size={19} />}
                active={group === "awaiting"}
                onClick={() => setGroup(group === "awaiting" ? "all" : "awaiting")}
              />
              <StatusCard
                label="Confirmed"
                count={counts.confirmed}
                description="Confirmed booking"
                tone={GREEN}
                overlay="linear-gradient(90deg, rgba(8,18,14,0.15) 0%, rgba(30,90,60,0.09) 45%, rgba(0,0,0,0.03) 100%)"
                image={keyAsset.url}
                icon={<Check size={19} />}
                active={group === "confirmed"}
                onClick={() => setGroup(group === "confirmed" ? "all" : "confirmed")}
              />
              <StatusCard
                label="Next 7 days"
                count={next7}
                description={next7 === 1 ? "Stay starting soon" : "Stays starting soon"}
                tone={GOLD_SOFT}
                overlay="linear-gradient(90deg, rgba(10,14,18,0.35) 0%, rgba(18,26,34,0.28) 45%, rgba(0,0,0,0.18) 100%)"
                stone
                icon={<CalendarDays size={19} />}
                active={dateChoice === "upcoming"}
                onClick={() => setDateChoice(dateChoice === "upcoming" ? "all" : "upcoming")}
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

            {/* toolbar — independent control bar, no surrounding container */}
            <div
              className="stone-toolbar mt-[8px] flex flex-col gap-1 rounded-[16px] md:flex-row md:items-stretch md:gap-0"

              style={{
                border: "1px solid rgba(168,184,200,0.13)",
                boxShadow:
                  "0 18px 44px -30px rgba(0,0,0,0.75), 0 1px 0 rgba(255,255,255,0.045) inset, 0 -1px 0 rgba(0,0,0,0.35) inset",
              }}
            >
              {/* search */}
              <div className="stone-inset relative flex min-w-0 flex-1 items-center rounded-[14px]">
                <Search
                  size={19}
                  strokeWidth={2}
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2"
                  style={{ color: "#DCBE84", filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.45))" }}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search bookings..."
                  aria-label="Search bookings by name, destination, hotel or reference"
                  className="w-full bg-transparent py-[14px] pl-[52px] pr-4 text-[14.5px] outline-none placeholder:text-[rgba(255,255,255,0.55)]"
                  style={{ color: "rgba(255,255,255,0.92)" }}
                />
              </div>


                <GoldDivider />

                <div className="stone-inset flex min-w-0 items-center rounded-[14px] md:w-[280px]">
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
                </div>

                <GoldDivider />

                <div className="stone-inset flex min-w-0 items-center rounded-[14px] md:w-[280px]">
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
                </div>

                <GoldDivider />

              {/* view toggles */}
              <div className="flex items-center gap-2 px-3 py-2">
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
                      className="grid h-[42px] w-[50px] place-items-center rounded-[11px] transition-all duration-200"
                      style={
                        on
                          ? {
                              background:
                                "linear-gradient(180deg, rgba(220,190,132,0.10) 0%, rgba(169,133,58,0.05) 100%)",
                              border: "1px solid rgba(220,190,132,0.55)",
                              color: "#E4CB98",
                              boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset",
                            }
                          : {
                              background: "rgba(255,255,255,0.02)",
                              border: "1px solid rgba(255,255,255,0.05)",
                              color: "rgba(255,255,255,0.72)",
                            }
                      }
                    >
                      <Icon size={19} strokeWidth={1.9} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* booking list + right sidebar */}
            <div className="mt-[18px] grid grid-cols-1 items-start gap-[18px] xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="min-w-0">

            {/* bookings — premium workspace panel */}
            <section
              className="rounded-[18px] p-[22px]"

              style={{
                background:
                  "linear-gradient(180deg, #1B222A 0%, #151B22 55%, #121820 100%)",
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow:
                  "0 1px 0 rgba(255,255,255,0.035) inset, 0 -1px 0 rgba(0,0,0,0.35) inset, 0 24px 60px -45px rgba(0,0,0,0.7)",
              }}
            >
              {/* booking list view selector */}
              <div className="mb-[16px] flex flex-wrap items-center gap-2">
                {(
                  [
                    { key: "active" as const, label: "Active Bookings", n: scopeCounts.active },
                    {
                      key: "cancelled" as const,
                      label: "Cancelled Bookings",
                      n: scopeCounts.cancelled,
                    },
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
                      className="rounded-[11px] px-[14px] py-[8px] text-[12.5px] font-medium transition-all duration-200"
                      style={
                        on
                          ? {
                              background:
                                "linear-gradient(180deg, rgba(220,190,132,0.10) 0%, rgba(169,133,58,0.05) 100%)",
                              border: "1px solid rgba(220,190,132,0.55)",
                              color: "#E4CB98",
                              boxShadow: "0 1px 0 rgba(255,255,255,0.07) inset",
                            }
                          : {
                              background: "rgba(255,255,255,0.02)",
                              border: "1px solid rgba(255,255,255,0.05)",
                              color: "rgba(255,255,255,0.72)",
                            }
                      }
                    >
                      {label} ({n})
                    </button>
                  );
                })}
              </div>

              <div
                className={
                  view === "list" ? "space-y-4" : "grid grid-cols-1 gap-4 xl:grid-cols-2"
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
              </div>

              <footer className="mt-5 flex flex-wrap items-center justify-between gap-3">
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
            </section>
            </div>

            {/* right sidebar column */}
            <aside className="flex min-w-0 flex-col gap-[18px]">


              {/* Recent activity */}
              <div
                className="stone-surface flex flex-col rounded-[14px] p-[20px]"
                style={{
                  border: `1px solid ${CARD_BORDER}`,
                  boxShadow: CARD_SHADOW,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p
                    className="text-[10.5px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: TEXT_2 }}
                  >
                    Recent activity
                  </p>
                  <button
                    type="button"
                    onClick={() => setGroup("all")}
                    className="shrink-0 text-[11.5px]"
                    style={{ color: GOLD }}
                  >
                    View all
                  </button>
                </div>
                <span
                  aria-hidden
                  className="mt-2.5 block h-px w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(201,162,75,0.55) 0%, rgba(224,190,107,0.28) 45%, rgba(201,162,75,0.04) 100%)",
                  }}
                />

                <div className="mt-3 min-h-0 flex-1 overflow-hidden">
                  {activity.length === 0 && (
                    <p className="text-[12.5px]" style={{ color: MUTED }}>
                      No recent updates yet.
                    </p>
                  )}
                  {activity.map((a, i) => (
                    <Link
                      key={a.id}
                      to="/bookings/$bookingId"
                      params={{ bookingId: a.id }}
                      className="flex items-center gap-3 py-[7px]"
                      style={
                        i > 0
                          ? { borderTop: "1px solid rgba(255,255,255,0.045)" }
                          : undefined
                      }
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
                        <span
                          className="block truncate text-[11.5px]"
                          style={{ color: MUTED, opacity: 0.78 }}
                        >
                          {a.sub}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Upcoming deadlines */}
              <div
                className="stone-surface flex flex-col rounded-[14px] p-[20px]"
                style={{
                  border: `1px solid ${CARD_BORDER}`,
                  boxShadow: CARD_SHADOW,
                }}
              >
                <div className="flex items-center justify-between gap-3">
                  <p
                    className="text-[10.5px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: TEXT_2 }}
                  >
                    Upcoming deadlines
                  </p>
                  <button
                    type="button"
                    onClick={() => setDateChoice("upcoming")}
                    className="shrink-0 text-[11.5px]"
                    style={{ color: GOLD }}
                  >
                    View all
                  </button>
                </div>

                <span
                  aria-hidden
                  className="mt-2.5 block h-px w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(201,162,75,0.55) 0%, rgba(224,190,107,0.28) 45%, rgba(201,162,75,0.04) 100%)",
                  }}
                />
                <div className="mt-3 min-h-0 flex-1">
                  {deadlines.length === 0 && (
                    <p className="text-[12.5px]" style={{ color: MUTED }}>
                      No upcoming deadlines.
                    </p>
                  )}
                  {deadlines.map((d, i) => (
                    <Link
                      key={d.id}
                      to="/bookings/$bookingId"
                      params={{ bookingId: d.id }}
                      className="flex items-center gap-3 py-[7px]"
                      style={
                        i > 0
                          ? { borderTop: "1px solid rgba(255,255,255,0.045)" }
                          : undefined
                      }
                    >
                      <span
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] text-center leading-[1.05]"
                        style={{
                          border: `1px solid ${CARD_BORDER}`,
                          background: "rgba(255,255,255,0.03)",
                        }}
                      >
                        <span className="block">
                          <span className="block text-[11.5px]" style={{ color: TEXT }}>
                            {d.day}
                          </span>
                          <span
                            className="block text-[8px] tracking-[0.12em]"
                            style={{ color: MUTED }}
                          >
                            {d.month}
                          </span>
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[12.5px]" style={{ color: TEXT }}>
                          {d.title}
                        </span>
                        <span
                          className="block truncate text-[11.5px]"
                          style={{ color: MUTED, opacity: 0.78 }}
                        >
                          {d.sub}
                        </span>
                      </span>
                      <span
                        className="shrink-0 text-[11.5px]"
                        style={{ color: GOLD_SOFT }}
                      >
                        {d.remaining}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
            </div>




          </div>
        </main>
      </div>
    </div>
  );
}
