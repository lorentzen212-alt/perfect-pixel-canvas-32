import { supabase } from "@/integrations/supabase/client";
import {
  generateAllocations,
  type Allocation,
  type Distribution,
  type Guest,
  type RoomCategory,
  type RoomingList,
  type RoomType,
  type UpgradeRequest,
} from "@/lib/rooming";

/**
 * The rooming list is stored relationally:
 *   booking_allocations  → one row per numbered room position
 *   booking_guests       → one row per guest (allocation_id = null → unassigned)
 *   booking_rooming_lists→ group requests + saved/submitted timestamps
 *
 * The client keeps its own stable ids (client_id) so the UI never has to
 * re-key its state after a save.
 */

type GuestRow = {
  id: string;
  client_id: string;
  allocation_id: string | null;
  position: number;
  first_name: string;
  last_name: string;
  nationality: string | null;
  email: string | null;
  phone: string | null;
  requirements: string[] | null;
  special_requests: string | null;
};

type AllocationRow = {
  id: string;
  client_id: string;
  allocation_index: number;
  status: string;
  room_type: string;
  booked_room_type: string;
  booked_room_category: string;
  occupancy: number | null;
  requests: string[] | null;
  upgrade_request: unknown;
};

function toGuest(row: GuestRow): Guest {
  return {
    id: row.client_id,
    firstName: row.first_name ?? "",
    lastName: row.last_name ?? "",
    nationality: row.nationality ?? undefined,
    email: row.email ?? undefined,
    phone: row.phone ?? undefined,
    requirements: row.requirements ?? [],
    specialRequests: row.special_requests ?? undefined,
  };
}

export async function loadRoomingListFromDb(
  bookingId: string,
  dist: Distribution,
): Promise<RoomingList> {
  const [{ data: allocRows }, { data: guestRows }, { data: meta }] = await Promise.all([
    supabase
      .from("booking_allocations")
      .select(
        "id, client_id, allocation_index, status, room_type, booked_room_type, booked_room_category, occupancy, requests, upgrade_request",
      )
      .eq("booking_id", bookingId)
      .order("allocation_index", { ascending: true }),
    supabase
      .from("booking_guests")
      .select(
        "id, client_id, allocation_id, position, first_name, last_name, nationality, email, phone, requirements, special_requests",
      )
      .eq("booking_id", bookingId)
      .order("position", { ascending: true }),
    supabase
      .from("booking_rooming_lists")
      .select("group_requests, change_log, saved_at, submitted_at")
      .eq("booking_id", bookingId)
      .maybeSingle(),
  ]);

  const guests = (guestRows ?? []) as GuestRow[];
  const byAllocation = new Map<string, Guest[]>();
  const unassigned: Guest[] = [];
  for (const row of guests) {
    if (row.allocation_id) {
      const list = byAllocation.get(row.allocation_id) ?? [];
      list.push(toGuest(row));
      byAllocation.set(row.allocation_id, list);
    } else {
      unassigned.push(toGuest(row));
    }
  }

  const rows = (allocRows ?? []) as AllocationRow[];
  const allocations: Allocation[] = rows.length
    ? rows.map((row) => ({
        id: row.client_id,
        index: row.allocation_index,
        status: row.status === "cancelled" ? "cancelled" : "active",
        type: row.room_type as RoomType,
        bookedRoomType: row.booked_room_type as RoomType,
        bookedRoomCategory: row.booked_room_category as RoomCategory,
        occupancy: row.occupancy ?? undefined,
        upgradeRequest: (row.upgrade_request as UpgradeRequest | null) ?? null,
        guests: byAllocation.get(row.id) ?? [],
        requests: row.requests ?? [],
      }))
    : generateAllocations(dist);

  return {
    bookingId,
    allocations,
    unassigned,
    groupRequests: meta?.group_requests ?? [],
    submittedAt: meta?.submitted_at ?? null,
    savedAt: meta?.saved_at ?? null,
    changeLog: (meta?.change_log as RoomingList["changeLog"]) ?? [],
  };
}

/** Full replace — the client owns the whole document while editing. */
export async function saveRoomingListToDb(list: RoomingList) {
  const bookingId = list.bookingId;

  await supabase.from("booking_guests").delete().eq("booking_id", bookingId);
  await supabase.from("booking_allocations").delete().eq("booking_id", bookingId);

  const { data: inserted, error } = await supabase
    .from("booking_allocations")
    .insert(
      list.allocations.map((a) => ({
        booking_id: bookingId,
        client_id: a.id,
        allocation_index: a.index,
        status: a.status ?? "active",
        room_type: a.type,
        booked_room_type: a.bookedRoomType,
        booked_room_category: a.bookedRoomCategory,
        occupancy: a.occupancy ?? null,
        requests: a.requests ?? [],
        upgrade_request: (a.upgradeRequest ?? null) as never,
      })),
    )
    .select("id, client_id");
  if (error) throw error;

  const idByClientId = new Map((inserted ?? []).map((r) => [r.client_id, r.id]));

  const guestRows = [
    ...list.allocations.flatMap((a) =>
      a.guests.map((g, i) => ({ guest: g, allocationId: idByClientId.get(a.id) ?? null, position: i })),
    ),
    ...list.unassigned.map((g, i) => ({ guest: g, allocationId: null, position: i })),
  ];

  if (guestRows.length) {
    const { error: guestError } = await supabase.from("booking_guests").insert(
      guestRows.map(({ guest, allocationId, position }) => ({
        booking_id: bookingId,
        allocation_id: allocationId,
        client_id: guest.id,
        position,
        first_name: guest.firstName ?? "",
        last_name: guest.lastName ?? "",
        nationality: guest.nationality ?? null,
        email: guest.email ?? null,
        phone: guest.phone ?? null,
        requirements: guest.requirements ?? [],
        special_requests: guest.specialRequests ?? null,
      })),
    );
    if (guestError) throw guestError;
  }

  const { error: metaError } = await supabase.from("booking_rooming_lists").upsert(
    {
      booking_id: bookingId,
      group_requests: list.groupRequests ?? [],
      change_log: (list.changeLog ?? []) as never,
      saved_at: new Date().toISOString(),
      submitted_at: list.submittedAt,
    },
    { onConflict: "booking_id" },
  );
  if (metaError) throw metaError;
}
