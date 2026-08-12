import { createFileRoute } from "@tanstack/react-router";
import { BookingDocumentsView } from "@/components/BookingDocuments";
import { BOOKINGS } from "@/lib/bookings";

export const Route = createFileRoute("/docmock")({
  component: () => (
    <div className="flex min-h-screen flex-col bg-[#12222E]">
      <BookingDocumentsView booking={BOOKINGS[4]} />
    </div>
  ),
});
