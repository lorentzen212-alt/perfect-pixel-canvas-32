import React from "react";
import { createRoot } from "react-dom/client";
import { BookingDocumentsView } from "@/components/BookingDocuments";
import { BOOKINGS } from "@/lib/bookings";
createRoot(document.getElementById("root")!).render(
  <div style={{ display: "flex", minHeight: "100vh", flexDirection: "column", background: "#12222E" }}>
    <BookingDocumentsView booking={BOOKINGS[4]} />
  </div>,
);
