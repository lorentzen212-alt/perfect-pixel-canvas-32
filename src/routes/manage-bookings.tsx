import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays } from "lucide-react";

export const Route = createFileRoute("/manage-bookings")({
  component: ManageBookings,
  head: () => ({
    meta: [
      { title: "Manage Bookings — HotelGroupBook" },
      {
        name: "description",
        content: "Manage your group hotel booking requests in one place.",
      },
    ],
  }),
});

const SERIF = '"Cormorant Garamond", Georgia, serif';

function ManageBookings() {
  return (
    <main className="min-h-screen bg-[#04111A] px-5 sm:px-8 lg:px-[60px] py-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-white/85 hover:text-[#F5C25A] text-[15px]"
      >
        <ArrowLeft size={16} /> Back to home
      </Link>

      <div className="mx-auto mt-12 max-w-3xl text-center">
        <span
          className="inline-flex h-14 w-14 items-center justify-center rounded-full border"
          style={{ borderColor: "rgba(245,194,90,0.55)" }}
        >
          <CalendarDays size={24} className="text-[#F5C25A]" />
        </span>
        <h1
          className="mt-6 text-white text-4xl sm:text-5xl lg:text-[54px] font-medium"
          style={{ fontFamily: SERIF }}
        >
          Manage Bookings
        </h1>
        <div className="mx-auto mt-4 h-[2px] w-20 bg-[#F5C25A]" />
        <p className="mt-6 text-white/80 text-[17px] leading-relaxed">
          Your booking requests will appear here. Once you submit a request,
          you'll be able to review its status, view offers from hotels, and
          confirm your booking – all in one place.
        </p>
      </div>
    </main>
  );
}
