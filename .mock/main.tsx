import React from "react";
import { createRoot } from "react-dom/client";
import { ProposalPaper } from "@/features/booking-workspace/documents/ProposalPaper";
import { PROPOSALS } from "@/lib/proposals";
import type { Booking } from "@/lib/bookings";

const booking: Booking = {
  id: "5",
  reference: "HGB-2026-00151",
  type: "leisure",
  name: "Bergen Group Stay",
  destination: "Bergen, Norway",
  hotel: "Radisson Blu Bergen",
  startDate: "2026-09-14",
  endDate: "2026-09-18",
  nights: 4,
  rooms: 32,
  guests: 63,
  status: "offers_ready",
  statusNote: "Proposal awaiting your decision",
  image: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  action: {
    kind: "review_offers",
    title: "Hotel proposal ready",
    lines: ["Review the proposal and", "accept or decline."],
    buttonLabel: "Review Offers",
  },
};

function App() {
  return (
    <div style={{ padding: "40px 0", background: "#AEB4B8", minHeight: "100vh" }}>
      <div style={{ width: "66%", margin: "0 auto", maxWidth: 1100 }}>
        <ProposalPaper booking={booking} proposal={PROPOSALS[0]} isCurrent />
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
