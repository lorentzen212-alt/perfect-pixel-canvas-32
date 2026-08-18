import { supabase } from "@/integrations/supabase/client";
import type { Booking, BookingAction, BookingStatus, BookingType } from "@/lib/bookings";

/* ── destination imagery ─────────────────────────────────────── */

const IMAGE_MODULES = import.meta.glob<{ default: { url: string } }>(
  "../assets/leisure/*.asset.json",
  { eager: true },
);

const IMAGE_BY_KEY: Record<string, string> = Object.fromEntries(
  Object.entries(IMAGE_MODULES).map(([path, mod]) => {
    const key = path.split("/").pop()!.replace(".jpg.asset.json", "");
    return [key, mod.default.url];
  }),
);

const FALLBACK_IMAGE = IMAGE_BY_KEY.oslo ?? Object.values(IMAGE_BY_KEY)[0] ?? "";

const NORMALISE: Record<string, string> = {
  "ålesund": "alesund",
  "bodø": "bodo",
  "tromsø": "tromso",
  "malmö": "malmo",
  "gothenburg": "gothenburg",
  "göteborg": "gothenburg",
  "åre": "are",
  "københavn": "copenhagen",
};

export function imageKeyFor(city?: string | null) {
  const raw = (city ?? "").trim().toLowerCase();
  if (!raw) return "";
  const first = raw.split(",")[0].trim();
  const key = NORMALISE[first] ?? first.replace(/\s+/g, "-");
  return IMAGE_BY_KEY[key] ? key : "";
}

export function imageUrlFor(key?: string | null) {
  return (key && IMAGE_BY_KEY[key]) || FALLBACK_IMAGE;
}

/* ── status → workspace action ───────────────────────────────── */

function actionFor(status: BookingStatus): BookingAction {
  switch (status) {
    case "rooming_list_required":
    case "confirmed":
      return { kind: "rooming_list", title: "Rooming list", buttonLabel: "Continue Rooming List" };
    case "offers_ready":
      return {
        kind: "review_offers",
        title: "Hotel offers ready",
        lines: ["Review and choose your", "preferred option."],
        buttonLabel: "Review Offers",
      };
    case "completed":
      return {
        kind: "completed",
        title: "Stay completed",
        lines: ["Thank you for traveling", "with us!"],
        buttonLabel: "View Details",
      };
    default:
      return {
        kind: "on_track",
        title: "Everything is on track",
        lines: ["We are currently sourcing", "the best options for you."],
        buttonLabel: "View Booking",
      };
  }
}

/* ── row → UI booking ────────────────────────────────────────── */

type BookingRow = {
  id: string;
  reference: string;
  booking_type: BookingType;
  status: string;
  status_note: string | null;
  name: string;
  destination: string;
  hotel_name: string | null;
  hotel_reference: string | null;
  hotel_reference_source: string | null;
  start_date: string | null;
  end_date: string | null;
  nights: number;
  rooms: number | null;
  guests: number | null;
  delegates: number | null;
  meeting_spaces: number | null;
  image_key: string | null;
  city: string | null;
  request: unknown;
  free_cancellation_until: string | null;
};

export function toBooking(row: BookingRow): Booking {
  const status = row.status as BookingStatus;
  return {
    id: row.id,
    reference: row.reference,
    type: row.booking_type,
    name: row.name,
    destination: row.destination,
    hotel: row.hotel_name ?? undefined,
    hotelReference: row.hotel_reference ?? undefined,
    hotelReferenceSource: (row.hotel_reference_source as "auto" | "manual" | null) ?? undefined,
    startDate: row.start_date ?? "",
    endDate: row.end_date ?? "",
    nights: row.nights,
    rooms: row.rooms ?? undefined,
    guests: row.guests ?? undefined,
    delegates: row.delegates ?? undefined,
    meetingSpaces: row.meeting_spaces ?? undefined,
    status,
    statusNote: row.status_note ?? undefined,
    freeCancellationUntil: row.free_cancellation_until ?? undefined,
    image: imageUrlFor(row.image_key ?? imageKeyFor(row.city)),
    action: actionFor(status),
  };
}

const SELECT =
  "id, reference, booking_type, status, status_note, name, destination, hotel_name, hotel_reference, hotel_reference_source, start_date, end_date, nights, rooms, guests, delegates, meeting_spaces, image_key, city, request, free_cancellation_until";

export async function fetchBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as BookingRow[]).map(toBooking);
}

export async function fetchBooking(idOrReference: string): Promise<Booking | null> {
  const isUuid = /^[0-9a-f-]{36}$/i.test(idOrReference);
  const { data, error } = await supabase
    .from("bookings")
    .select(SELECT)
    .eq(isUuid ? "id" : "reference", idOrReference)
    .maybeSingle();
  if (error) throw error;
  return data ? toBooking(data as unknown as BookingRow) : null;
}

/* ── creating a booking from a request flow ──────────────────── */

export interface RoomLine {
  room_type: string;
  room_category?: string;
  quantity: number;
  meal_plan?: string | null;
  check_in?: string | null;
  check_out?: string | null;
}

export interface NewBookingInput {
  bookingType: BookingType;
  name: string;
  destination: string;
  country?: string | null;
  city?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  nights?: number;
  rooms?: number | null;
  guests?: number | null;
  delegates?: number | null;
  meetingSpaces?: number | null;
  contact: Record<string, unknown>;
  request: Record<string, unknown>;
  roomLines?: RoomLine[];
}

export function nightsBetween(start?: string | null, end?: string | null) {
  if (!start || !end) return 0;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.max(0, Math.round(ms / 86400000));
}

/** Persists a submitted request as a real booking owned by the signed-in user. */
export async function createBooking(
  userId: string,
  input: NewBookingInput,
): Promise<{ id: string; reference: string }> {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: userId,
      booking_type: input.bookingType,
      status: "request_submitted",
      status_note: "Request received — sourcing hotels",
      name: input.name,
      destination: input.destination,
      country: input.country ?? null,
      city: input.city ?? null,
      start_date: input.startDate ?? null,
      end_date: input.endDate ?? null,
      nights: input.nights ?? nightsBetween(input.startDate, input.endDate),
      rooms: input.rooms ?? null,
      guests: input.guests ?? null,
      delegates: input.delegates ?? null,
      meeting_spaces: input.meetingSpaces ?? null,
      image_key: imageKeyFor(input.city ?? input.destination) || null,
      contact: input.contact as never,
      request: input.request as never,
    })
    .select("id, reference")
    .single();
  if (error) throw error;

  const lines = (input.roomLines ?? []).filter((l) => l.quantity > 0);
  if (lines.length) {
    const { error: roomError } = await supabase.from("booking_rooms").insert(
      lines.map((l) => ({
        booking_id: data.id,
        room_type: l.room_type,
        room_category: l.room_category ?? "standard",
        quantity: l.quantity,
        meal_plan: l.meal_plan ?? null,
        check_in: l.check_in ?? null,
        check_out: l.check_out ?? null,
      })),
    );
    if (roomError) console.error("[booking_rooms]", roomError.message);
  }

  return data as { id: string; reference: string };
}

/** Confirmed room distribution for a booking, used to build the rooming list. */
export async function fetchRoomDistribution(bookingId: string) {
  const { data, error } = await supabase
    .from("booking_rooms")
    .select("room_type, quantity")
    .eq("booking_id", bookingId);
  if (error) throw error;
  const dist: Record<string, number> = {};
  for (const row of data ?? []) {
    dist[row.room_type] = (dist[row.room_type] ?? 0) + (row.quantity ?? 0);
  }
  return dist;
}

/**
 * Cancel a booking. Keeps the record and every related row (rooms, guests,
 * rooming lists, documents, history) — only the booking status changes.
 * RLS scopes the update to bookings owned by the signed-in user.
 */
export async function cancelBooking(bookingId: string): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      status_note: "Cancelled by customer",
    })
    .eq("id", bookingId);
  if (error) throw new Error(`Could not cancel booking: ${error.message}`);
}
