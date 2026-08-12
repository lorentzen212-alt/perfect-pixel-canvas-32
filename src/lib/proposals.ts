import type { BookingDoc } from "@/components/BookingDocuments";

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

export function proposalForBooking(bookingId: string): Proposal | undefined {
  return PROPOSALS.find((p) => p.bookingId === bookingId);
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
 * or editing `seedDocuments` (both locked). Bookings with no proposal fall
 * through to the generic reader.
 */
export function proposalForDocument(
  doc: BookingDoc | undefined,
  bookingId: string,
): Proposal | undefined {
  if (!doc || doc.category !== "Proposals" || doc.archived) return undefined;
  return proposalForBooking(bookingId);
}
