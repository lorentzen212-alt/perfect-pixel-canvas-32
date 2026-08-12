import type { BookingDoc } from "@/components/BookingDocuments";
import { BOOKINGS, type Booking } from "@/lib/bookings";

export type ProposalStatus = "awaiting_decision" | "accepted" | "declined";

export interface Proposal {
  id: string;
  number: string; // "#01"
  bookingId: string;
  hotelName: string;
  issueDate: string; // ISO
  validUntil: string; // ISO
  currency: string; // "NOK"
  roomSubtotal: number;
  breakfastIncluded: boolean;
  dinnerQty: number;
  dinnerUnitPrice: number;
  totalInclVat: number;
  status: ProposalStatus;
}

export const PROPOSALS: Proposal[] = [
  {
    id: "prop-5-01",
    number: "#01",
    bookingId: "5",
    hotelName: "Radisson Blu Bergen",
    issueDate: "2026-08-11",
    validUntil: "2026-08-25",
    currency: "NOK",
    roomSubtotal: 192000,
    breakfastIncluded: true,
    dinnerQty: 63,
    dinnerUnitPrice: 550,
    totalInclVat: 226650,
    status: "awaiting_decision",
  },
];

/** Commercial defaults used to derive a proposal for bookings with no seeded record. */
export const ROOM_NIGHT_RATE = 1500;
export const DINNER_PRICE = 550;

function derivedProposal(booking: Booking): Proposal {
  const rooms = booking.rooms ?? 0;
  const guests = booking.guests ?? 0;
  const roomSubtotal = rooms * booking.nights * ROOM_NIGHT_RATE;
  const dinner = guests * DINNER_PRICE;
  return {
    id: `prop-${booking.id}-derived`,
    number: "#01",
    bookingId: booking.id,
    hotelName: booking.hotel ?? "the hotel",
    issueDate: "2026-08-11",
    validUntil: "2026-08-25",
    currency: "NOK",
    roomSubtotal,
    breakfastIncluded: true,
    dinnerQty: guests,
    dinnerUnitPrice: DINNER_PRICE,
    totalInclVat: roomSubtotal + dinner,
    status: "awaiting_decision",
  };
}

/**
 * The seeded record wins when it exists; otherwise a proposal is derived from
 * the booking's own rooms / nights / guests so every booking's proposal
 * document renders real numbers.
 */
export function proposalForBooking(booking: Booking | string): Proposal | undefined {
  const b = typeof booking === "string" ? BOOKINGS.find((x) => x.id === booking) : booking;
  if (!b) return undefined;
  return PROPOSALS.find((p) => p.bookingId === b.id) ?? derivedProposal(b);
}

/** Derived — never stored, so it cannot drift from the guest count. */
export function dinnerSubtotal(p: Proposal): number {
  return p.dinnerQty * p.dinnerUnitPrice;
}

export function formatMoney(currency: string, amount: number): string {
  return `${currency} ${Math.round(amount).toLocaleString("en-US")}`;
}

/**
 * Links a document row to a proposal without adding fields to `BookingDoc`
 * or editing `seedDocuments` (both locked). Archived proposals and non-proposal
 * categories fall through to the generic reader.
 */
export function proposalForDocument(
  doc: BookingDoc | undefined,
  booking: Booking | string,
): Proposal | undefined {
  if (!doc || doc.category !== "Proposals" || doc.archived) return undefined;
  return proposalForBooking(booking);
}
