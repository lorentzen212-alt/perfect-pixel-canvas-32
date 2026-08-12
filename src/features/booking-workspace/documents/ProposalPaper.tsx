import { BrandLogo } from "@/components/BrandLogo";
import { SERIF } from "@/components/DashboardChrome";
import { Eyebrow, Hair } from "@/features/booking-workspace/overview/primitives";
import { GOLD, HAIR, INK, INK_2, INK_3 } from "@/features/booking-workspace/overview/materials";
import { formatDay, formatRange, type Booking } from "@/lib/bookings";
import { dinnerSubtotal, formatMoney, type Proposal } from "@/lib/proposals";

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="min-w-0">
      <span className="block text-[9.5px] uppercase tracking-[0.18em]" style={{ color: INK_3 }}>
        {k}
      </span>
      <span className="mt-[3px] block truncate text-[13px]" style={{ color: INK }}>
        {v}
      </span>
    </div>
  );
}

function Line({ label, sub, value }: { label: string; sub?: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-[11px]">
      <span className="min-w-0">
        <span className="block text-[13px]" style={{ color: INK }}>
          {label}
        </span>
        {sub && (
          <span className="mt-[2px] block text-[11.5px]" style={{ color: INK_3 }}>
            {sub}
          </span>
        )}
      </span>
      <span className="shrink-0 text-[13px] tabular-nums" style={{ color: INK_2 }}>
        {value}
      </span>
    </div>
  );
}

export function ProposalPaper({ booking, proposal }: { booking: Booking; proposal: Proposal }) {
  const nights = booking.nights;
  const rooms = booking.rooms ?? 0;

  return (
    <div className="px-8 py-9 sm:px-12 sm:py-12">
      <div className="flex items-start justify-between gap-6">
        <BrandLogo variant="full" size="sm" tone="light" />
        <span className="text-right text-[11px]" style={{ color: INK_3 }}>
          {booking.reference}
          <br />
          Valid until {formatDay(proposal.validUntil)}
        </span>
      </div>

      <Hair className="mt-7" />

      <div className="mt-8 grid gap-8 sm:grid-cols-[minmax(0,1fr)_206px]">
        <div className="min-w-0">
          <Eyebrow>Proposal {proposal.number}</Eyebrow>
          <h4
            className="mt-2 text-[27px] leading-[1.15]"
            style={{ color: INK, fontFamily: SERIF, fontWeight: 500 }}
          >
            {booking.name}
          </h4>
          <p className="mt-1.5 text-[12.5px]" style={{ color: INK_2 }}>
            {proposal.hotelName} · {booking.destination}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5">
            <Fact k="Stay period" v={formatRange(booking.startDate, booking.endDate)} />
            <Fact k="Nights" v={`${nights}`} />
            <Fact k="Rooms" v={`${rooms}`} />
            <Fact k="Guests" v={`${booking.guests ?? 0}`} />
            <Fact k="Check-in" v={formatDay(booking.startDate)} />
            <Fact k="Check-out" v={formatDay(booking.endDate)} />
          </div>
        </div>

        <div className="hidden sm:block">
          <img
            src={booking.image}
            alt={`${proposal.hotelName}, ${booking.destination}`}
            loading="lazy"
            className="h-[196px] w-full object-cover"
            style={{ borderRadius: 4, border: `1px solid ${HAIR}` }}
          />
        </div>
      </div>

      {/* ── offer summary ── */}
      <div
        className="mt-10 px-6 py-5"
        style={{ border: `1px solid ${HAIR}`, borderRadius: 4, background: "#FCFBF9" }}
      >
        <Eyebrow>Offer summary</Eyebrow>
        <div className="mt-2">
          <Line
            label="Accommodation"
            sub={`${rooms} rooms × ${nights} nights`}
            value={formatMoney(proposal.currency, proposal.roomSubtotal)}
          />
          <Hair />
          <Line
            label="Breakfast"
            sub={proposal.breakfastIncluded ? "Included for all guests" : "Not included"}
            value={proposal.breakfastIncluded ? "Included" : "—"}
          />
          <Hair />
          <Line
            label="Dinner"
            sub={`${proposal.dinnerQty} guests × ${formatMoney(
              proposal.currency,
              proposal.dinnerUnitPrice,
            )}`}
            value={formatMoney(proposal.currency, dinnerSubtotal(proposal))}
          />
        </div>

        <span
          aria-hidden
          className="mt-3 block h-px"
          style={{ background: "rgba(27,37,48,0.20)" }}
        />

        <div className="mt-4 flex items-end justify-between gap-6">
          <span className="text-[12.5px]" style={{ color: INK_2 }}>
            Total offer (incl. VAT)
          </span>
          <span
            className="text-[26px] leading-none tabular-nums"
            style={{ color: INK, fontFamily: SERIF, fontWeight: 500 }}
          >
            {formatMoney(proposal.currency, proposal.totalInclVat)}
          </span>
        </div>
      </div>

      <p className="mt-6 text-[11px]" style={{ color: INK_3 }}>
        Issued {formatDay(proposal.issueDate)} by {proposal.hotelName}.
        <span style={{ color: GOLD }}> </span>
        Rates are quoted in {proposal.currency} and include VAT.
      </p>
    </div>
  );
}
