import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  BedDouble,
  CalendarDays,
  Check,
  Copy,
  MapPin,
  Moon,
  MoreVertical,
  Users,
  X,
  ArrowRight,
} from "lucide-react";

import { cancelBooking } from "@/lib/bookingsApi";
import { formatRange, type Booking } from "@/lib/bookings";
import cardStone from "@/assets/card-stone-surface.png.asset.json";

import {
  CHAMPAGNE,
  CHAMPAGNE_LINE,
  GOLD_BRUSHED_H,
  HAIRLINE,
  IVORY,
  MUTED,
  PEARL,
  RED,
  SERIF,
  TEXT_2,
} from "./tokens";
import { GROUP_COLOR, GROUP_LABEL, groupOf, primaryAction, TRACK_STEPS, trackIndex } from "./bookingMeta";

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


export function MetaItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
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
        { label: "Rooming list", to: "/bookings/$bookingId" as const },
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

export function BookingCard({ booking, compact }: { booking: Booking; compact?: boolean }) {
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
            className="mt-[7px] block transition-opacity hover:opacity-85"
            style={{ position: "relative", top: -3, marginBottom: 0 }}
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
        <div className="px-[14px] py-[3px]">
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
          className="px-[14px] py-[3px]"
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
        className="mt-[9px] flex flex-nowrap items-center justify-between gap-4 pt-[8px]"
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
            marginTop: 2,
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
              marginBottom: -10,
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
      <article className="hgb-booking-card group relative overflow-hidden py-[13px] pr-[24px] transition-all duration-300" style={shell}>
        {goldStrip}
        <div>{media}</div>
        <div className="py-3 pr-3">{info}</div>
      </article>
    );
  }

  return (
    <article
      className="hgb-booking-card group relative grid grid-cols-1 items-stretch gap-[14px] overflow-hidden py-[15px] pr-[24px] transition-all duration-300 sm:grid-cols-[278px_minmax(0,1fr)] lg:grid-cols-[294px_minmax(0,1fr)]"
      style={shell}
    >
      {goldStrip}
      {media}
      <div className="min-w-0">{info}</div>
    </article>
  );




}
