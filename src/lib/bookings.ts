import osloImg from "@/assets/leisure/oslo.jpg.asset.json";
import copenhagenImg from "@/assets/leisure/copenhagen.jpg.asset.json";
import stockholmImg from "@/assets/leisure/stockholm.jpg.asset.json";
import bergenImg from "@/assets/leisure/bergen.jpg.asset.json";

export type BookingStatus =
  | "request_submitted"
  | "hotel_sourcing"
  | "offers_ready"
  | "offer_selected"
  | "contract_ready"
  | "confirmed"
  | "rooming_list_required"
  | "upcoming"
  | "completed"
  | "cancelled";

export type StatusTone = "gold" | "sage" | "steel" | "muted";

export interface StatusMeta {
  label: string;
  tone: StatusTone;
}

export const STATUS_META: Record<BookingStatus, StatusMeta> = {
  request_submitted: { label: "Request Submitted", tone: "steel" },
  hotel_sourcing: { label: "Hotel Sourcing", tone: "steel" },
  offers_ready: { label: "Offers Ready", tone: "gold" },
  offer_selected: { label: "Offer Selected", tone: "gold" },
  contract_ready: { label: "Contract Ready", tone: "gold" },
  confirmed: { label: "Confirmed", tone: "sage" },
  rooming_list_required: { label: "Rooming List Required", tone: "gold" },
  upcoming: { label: "Upcoming", tone: "steel" },
  completed: { label: "Completed", tone: "sage" },
  cancelled: { label: "Cancelled", tone: "muted" },
};

export const TONE_COLOR: Record<StatusTone, string> = {
  gold: "#C7A34A",
  sage: "#8DA88A",
  steel: "#8AA3B8",
  muted: "#929DA5",
};


export type BookingType = "leisure" | "me";

export type ActionKind =
  | "rooming_list"
  | "review_offers"
  | "on_track"
  | "completed"
  | "generic";

export interface BookingAction {
  kind: ActionKind;
  title: string;
  /** Optional supporting lines shown under the title. */
  lines?: string[];
  buttonLabel: string;
  /** Route to open later — detail pages plug in here. */
  to?: string;
}

export interface Booking {
  id: string;
  reference: string;
  type: BookingType;
  name: string;
  destination: string;
  hotel?: string;
  /** Auto-assigned or manually entered hotel confirmation reference. */
  hotelReference?: string;
  hotelReferenceSource?: "auto" | "manual";
  startDate: string; // ISO
  endDate: string; // ISO
  nights: number;
  rooms?: number;
  guests?: number;
  delegates?: number;
  meetingSpaces?: number;
  status: BookingStatus;
  statusNote?: string;
  image: string;
  /** Rooming list progress — dynamic. */
  rooming?: { complete: number; total: number; due: string };
  action: BookingAction;
}

export function formatRange(startISO: string, endISO: string) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "Dates pending";
  const d = (x: Date) => String(x.getDate()).padStart(2, "0");
  const m = (x: Date) => x.toLocaleString("en-GB", { month: "short" });
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  return sameMonth
    ? `${d(s)} – ${d(e)} ${m(e)} ${e.getFullYear()}`
    : `${d(s)} ${m(s)} – ${d(e)} ${m(e)} ${e.getFullYear()}`;
}

export function formatDay(iso: string) {
  const x = new Date(iso);
  return `${String(x.getDate()).padStart(2, "0")} ${x.toLocaleString("en-GB", {
    month: "short",
  })} ${x.getFullYear()}`;
}

export function roomingProgress(b: Booking) {
  if (!b.rooming || b.rooming.total === 0) return 0;
  return Math.round((b.rooming.complete / b.rooming.total) * 100);
}

export const BOOKINGS: Booking[] = [
  {
    id: "1",
    reference: "HGB-2026-00124",
    type: "leisure",
    name: "Oslo Group Stay",
    destination: "Oslo, Norway",
    hotel: "Radisson Blu Plaza Hotel",
    hotelReference: "ABC12345",
    hotelReferenceSource: "auto",
    startDate: "2026-09-14",
    endDate: "2026-09-17",
    nights: 3,
    rooms: 32,
    guests: 58,
    status: "confirmed",
    image: osloImg.url,
    rooming: { complete: 42, total: 58, due: "2026-09-04" },
    action: {
      kind: "rooming_list",
      title: "Rooming list",
      buttonLabel: "Continue Rooming List",
    },
  },
  {
    id: "2",
    reference: "HGB-2026-00138",
    type: "me",
    name: "Nordic Leadership Meeting",
    destination: "Copenhagen, Denmark",
    startDate: "2026-10-06",
    endDate: "2026-10-08",
    nights: 2,
    delegates: 70,
    meetingSpaces: 3,
    status: "hotel_sourcing",
    statusNote: "No hotel selected yet",
    image: copenhagenImg.url,
    action: {
      kind: "on_track",
      title: "Everything is on track",
      lines: ["We are currently sourcing", "the best options for you."],
      buttonLabel: "View Booking",
    },
  },
  {
    id: "3",
    reference: "HGB-2026-00136",
    type: "leisure",
    name: "Stockholm City Break",
    destination: "Stockholm, Sweden",
    startDate: "2026-09-22",
    endDate: "2026-09-25",
    nights: 3,
    rooms: 24,
    guests: 43,
    status: "offers_ready",
    statusNote: "3 offers received",
    image: stockholmImg.url,
    action: {
      kind: "review_offers",
      title: "3 hotel offers ready",
      lines: ["Review and choose your", "preferred option."],
      buttonLabel: "Review Offers",
    },
  },
  {
    id: "4",
    reference: "HGB-2026-00098",
    type: "leisure",
    name: "Bergen Summer Escape",
    destination: "Bergen, Norway",
    startDate: "2026-07-03",
    endDate: "2026-07-06",
    nights: 3,
    rooms: 16,
    guests: 28,
    status: "completed",
    statusNote: "Stayed 03 Jul 2026",
    image: bergenImg.url,
    action: {
      kind: "completed",
      title: "Stay completed",
      lines: ["Thank you for traveling", "with us!"],
      buttonLabel: "View Details",
    },
  },
];

export type DateFilter = "all" | "upcoming" | "past" | "next_90";

export function filterBookings(
  bookings: Booking[],
  opts: { query: string; status: BookingStatus | "all"; date: DateFilter },
) {
  const q = opts.query.trim().toLowerCase();
  const now = new Date();
  return bookings.filter((b) => {
    if (q) {
      const hay = [b.name, b.reference, b.destination, b.hotel ?? "", b.hotelReference ?? ""]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (opts.status !== "all" && b.status !== opts.status) return false;
    const start = new Date(b.startDate);
    if (opts.date === "upcoming" && start < now) return false;
    if (opts.date === "past" && start >= now) return false;
    if (opts.date === "next_90") {
      const limit = new Date(now.getTime() + 90 * 86400000);
      if (start < now || start > limit) return false;
    }
    return true;
  });
}
