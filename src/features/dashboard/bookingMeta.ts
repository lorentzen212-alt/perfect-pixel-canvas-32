import { Send, Building2, FileText, BadgeCheck } from "lucide-react";

import type { Booking, BookingStatus } from "@/lib/bookings";

import { CHAMPAGNE, GREEN, RED } from "./tokens";

/* ── status grouping (visual layer over existing statuses) ── */

export type Group = "all" | "proposal" | "awaiting" | "confirmed" | "attention" | "cancelled";

/** Country segment of a booking destination, e.g. "Bergen, Norway" → "Norway". */
export function countryOf(b: Booking): string {
  const parts = (b.destination ?? "").split(",");
  return (parts.length > 1 ? parts[parts.length - 1] : "").trim();
}

export function groupOf(b: Booking): Exclude<Group, "all"> {
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

export const GROUP_LABEL: Record<Exclude<Group, "all">, string> = {
  proposal: "Proposal Ready",
  awaiting: "Awaiting Response",
  confirmed: "Confirmed",
  attention: "Needs Attention",
  cancelled: "Cancelled",
};

export const GROUP_COLOR: Record<Exclude<Group, "all">, string> = {
  proposal: CHAMPAGNE,
  awaiting: "#5A88E8",
  confirmed: GREEN,
  attention: "#C9A177",
  cancelled: RED,
};

/* primary action follows the real booking status and keeps its destination */
export function primaryAction(b: Booking) {
  /* cancelled bookings keep read-only access only */
  if (b.status === "cancelled")
    return { label: "View booking", to: "/bookings/$bookingId" as const };
  switch (b.action.kind) {
    case "rooming_list":
      return { label: "Complete Rooming List", to: "/bookings/$bookingId" as const };
    case "review_offers":
      return { label: "View proposal", to: "/bookings/$bookingId" as const };
    case "on_track":
      return { label: "View status", to: "/bookings/$bookingId" as const };
    default:
      return { label: "View booking", to: "/bookings/$bookingId" as const };
  }
}

export const TRACK_STEPS = [
  { key: "sent", label: "Request Sent", icon: Send },
  { key: "waiting", label: "Waiting for Hotel", icon: Building2 },
  { key: "proposal", label: "Proposal Ready", icon: FileText },
  { key: "confirmed", label: "Confirmed", icon: BadgeCheck },
] as const;

export function trackIndex(status: BookingStatus) {
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

export type DateChoice = "all" | "upcoming" | "this_month" | "next_90" | "past";
