import { BrandLogo } from "@/components/BrandLogo";
import { SERIF } from "@/components/DashboardChrome";
import { Hair } from "@/features/booking-workspace/overview/primitives";
import { HAIR, INK, INK_2, INK_3 } from "@/features/booking-workspace/overview/materials";
import type { BookingDoc } from "@/components/BookingDocuments";
import { formatSize } from "@/components/BookingDocuments";
import { formatRange, type Booking } from "@/lib/bookings";

export function GenericPaper({ booking, doc }: { booking: Booking; doc: BookingDoc }) {
  return (
    <div className="px-8 py-9 sm:px-12 sm:py-12">
      <div className="flex items-start justify-between gap-6">
        <BrandLogo variant="full" size="sm" tone="light" />
        <span className="text-right text-[11px]" style={{ color: INK_3 }}>
          {booking.reference}
        </span>
      </div>

      <Hair className="mt-7" />

      <div className="mt-9">
        <span className="block text-[9.5px] uppercase tracking-[0.18em]" style={{ color: INK_3 }}>
          {doc.kind}
        </span>
        <h4
          className="mt-2 text-[25px] leading-[1.15]"
          style={{ color: INK, fontFamily: SERIF, fontWeight: 500 }}
        >
          {doc.name}
        </h4>
        <p className="mt-1.5 text-[12.5px]" style={{ color: INK_2 }}>
          {booking.name} · {formatRange(booking.startDate, booking.endDate)}
        </p>
      </div>

      <div
        className="mt-9 grid gap-y-4 px-6 py-5"
        style={{ border: `1px solid ${HAIR}`, borderRadius: 4, background: "#FCFBF9" }}
      >
        {[
          ["Uploaded by", doc.uploadedBy],
          ["Date", doc.uploadedLabel],
          ["Category", doc.category],
          ["Version", doc.version],
          ["File size", formatSize(doc.size)],
        ].map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-6">
            <span className="text-[11.5px]" style={{ color: INK_3 }}>
              {k}
            </span>
            <span className="text-[12.5px]" style={{ color: INK }}>
              {v}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-8 text-[11.5px] leading-relaxed" style={{ color: INK_3 }}>
        A preview of this document is not available here. Download it to read the full contents.
      </p>
    </div>
  );
}
