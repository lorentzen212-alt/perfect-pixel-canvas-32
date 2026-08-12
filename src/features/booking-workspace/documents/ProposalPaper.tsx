import { BrandLogo } from "@/components/BrandLogo";
import { INK, INK_2, INK_3, GOLD } from "@/features/booking-workspace/overview/materials";
import type { Booking } from "@/lib/bookings";
import { dinnerSubtotal, formatMoney, resolveNights, type Proposal } from "@/lib/proposals";
import { formatLongDay, formatLongRange, formatShortDay } from "./dates";
import roomImage from "@/assets/rooms/room-double.jpg";

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline" style={{ minHeight: 22 }}>
      <span className="shrink-0 text-[11px]" style={{ width: 112, color: INK_3 }}>
        {k}
      </span>
      <span className="min-w-0 text-[12.5px] font-semibold" style={{ color: INK }}>
        {v}
      </span>
    </div>
  );
}

function Line({ label, detail, value }: { label: string; detail?: string; value: string }) {
  return (
    <div className="flex items-baseline gap-4 py-[6px]">
      <span className="shrink-0 text-[12px]" style={{ color: INK }}>
        {label}
      </span>
      <span className="min-w-0 flex-1 truncate text-[12px]" style={{ color: INK_3 }}>
        {detail ?? ""}
      </span>
      <span className="shrink-0 text-[12px] tabular-nums" style={{ color: INK_2 }}>
        {value}
      </span>
    </div>
  );
}

export function ProposalPaper({
  booking,
  proposal,
  isCurrent = false,
}: {
  booking: Booking;
  proposal: Proposal;
  isCurrent?: boolean;
}) {
  const nights = resolveNights(booking);
  const rooms = booking.rooms ?? 0;

  return (
    <div className="px-8 py-9 sm:px-12 sm:py-12">
      {/* ── header strip ── */}
      <div className="flex items-start justify-between gap-6">
        <BrandLogo variant="full" size="sm" tone="light" />
        <span className="text-right">
          <span className="block text-[11px] font-semibold" style={{ color: INK }}>
            Proposal {proposal.number}
          </span>
          <span className="mt-[2px] block text-[10px]" style={{ color: INK_3 }}>
            {formatShortDay(proposal.issueDate)}
          </span>
          {isCurrent && (
            <span
              className="mt-2 inline-block rounded-full px-2 py-[3px] text-[9px] uppercase tracking-[0.16em]"
              style={{ background: "#E8F1E7", color: "#4A7A56" }}
            >
              Current
            </span>
          )}
        </span>
      </div>

      {/* ── title block ── */}
      <div className="mt-7">
        <h4 className="text-[27px] font-semibold leading-[1.15]" style={{ color: INK }}>
          Proposal
        </h4>
        <p className="mt-1.5 text-[15px] font-semibold" style={{ color: INK }}>
          {booking.name}
        </p>
      </div>

      {/* ── facts + image ── */}
      <div className="mt-7 flex items-start justify-between gap-8">
        <div className="min-w-0" style={{ width: "55%" }}>
          <Fact k="Stay period" v={formatLongRange(booking.startDate, booking.endDate)} />
          <Fact k="Rooms" v={`${rooms} rooms`} />
          <Fact k="Guests" v={`${booking.guests ?? 0} guests`} />
          <Fact k="Check-in" v={formatLongDay(booking.startDate)} />
          <Fact k="Check-out" v={formatLongDay(booking.endDate)} />
        </div>

        <img
          src={roomImage}
          alt={`${proposal.hotelName} — guest room`}
          loading="lazy"
          className="hidden shrink-0 object-cover sm:block"
          style={{ width: 190, height: 110, borderRadius: 8 }}
        />
      </div>

      {/* ── offer summary ── */}
      <div className="mt-5" style={{ background: "#F6F5F2", borderRadius: 12, padding: 20 }}>
        <div className="flex items-start gap-0">
          <span
            className="shrink-0 pt-[7px] text-[9px] uppercase tracking-[0.16em]"
            style={{ width: 110, color: GOLD }}
          >
            Offer summary
          </span>

          <div className="min-w-0 flex-1">
            <Line
              label={`${rooms} rooms × ${nights} nights`}
              value={formatMoney(proposal.currency, proposal.roomSubtotal)}
            />
            <Line
              label={proposal.breakfastIncluded ? "Breakfast included" : "Breakfast"}
              value={proposal.breakfastIncluded ? "Included" : "—"}
            />
            <Line
              label="Dinner (3-course)"
              detail={`${proposal.dinnerQty} guests × ${formatMoney(
                proposal.currency,
                proposal.dinnerUnitPrice,
              )}`}
              value={formatMoney(proposal.currency, dinnerSubtotal(proposal))}
            />

            <span
              aria-hidden
              className="mt-3 block h-px"
              style={{ background: "rgba(27,37,48,0.14)" }}
            />

            <div className="mt-3.5 flex items-baseline justify-between gap-6">
              <span className="text-[12.5px] font-semibold" style={{ color: INK }}>
                Total offer (incl. VAT)
              </span>
              <span className="text-[19px] font-bold tabular-nums" style={{ color: INK }}>
                {formatMoney(proposal.currency, proposal.totalInclVat)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
