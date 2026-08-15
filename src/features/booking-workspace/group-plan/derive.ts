import type { Note } from "@/components/BookingNotes";
import { activeAllocations, isAllergy, type RoomingList } from "@/lib/rooming";
import type { DietaryRow, PlanItem } from "./types";

/* ── helpers ─────────────────────────────────────────────── */

export function dayList(startISO: string, endISO: string): string[] {
  const a = new Date(startISO);
  const b = new Date(endISO);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return [];
  const out: string[] = [];
  for (let t = a.getTime(); t <= b.getTime(); t += 86400000) {
    out.push(new Date(t).toISOString().slice(0, 10));
  }
  return out;
}

export function dietaryFromRooming(list: RoomingList | null): DietaryRow[] {
  if (!list) return [];
  const rows: DietaryRow[] = [];
  for (const a of activeAllocations(list)) {
    for (const g of a.guests) {
      for (const tag of g.requirements ?? []) {
        rows.push({
          name: `${g.firstName} ${g.lastName}`.trim() || "Guest",
          room: `Room ${a.index}`,
          restriction: tag,
          needsAttention: isAllergy(tag),
        });
      }
    }
  }
  return rows;
}

function noteFor(notes: Note[], match: (n: Note) => boolean, fmt: (iso: number) => string) {
  const n = notes.filter(match).sort((x, y) => y.updatedAt - x.updatedAt)[0];
  if (!n) return null;
  return { text: n.body || n.preview, author: n.author, date: fmt(n.updatedAt) };
}

export interface DeriveInput {
  arrival: string;
  departure: string;
  hotel?: string;
  destination: string;
  totalRooms: number;
  totalGuests: number;
  breakfastIncluded: boolean;
  groupDinner: { date: string; time: string; guests: number; details?: string } | null;
  services: { name: string; detail: string }[];
  meeting: { room: string; setup: string; participants: number; date: string; time: string } | null;
  dietary: DietaryRow[];
  notes: Note[];
  formatNoteDate: (ms: number) => string;
}

/** Build the read-only BOOKING half of the Group Plan from real booking data. */
export function deriveBookingItems(input: DeriveInput): PlanItem[] {
  const {
    arrival,
    departure,
    hotel,
    destination,
    totalRooms,
    totalGuests,
    breakfastIncluded,
    groupDinner,
    services,
    meeting,
    dietary,
    notes,
    formatNoteDate,
  } = input;

  const items: PlanItem[] = [];
  const days = dayList(arrival, departure);
  if (days.length === 0) return items;

  const transfer = services.find((s) => /transfer|coach|bus/i.test(s.name));
  const coaches = transfer ? Number(transfer.detail.match(/\d+/)?.[0] ?? 1) : 0;
  const porter = services.find((s) => /porter|luggage/i.test(s.name));
  const lateCheckout = services.find((s) => /late checkout|late check-out/i.test(s.name));
  const otherExtras = services.filter(
    (s) => s !== transfer && s !== porter && s !== lateCheckout,
  );

  const attention = dietary.filter((d) => d.needsAttention).length;

  /* — arrival transfer — */
  if (transfer) {
    items.push({
      id: "b-transfer-in",
      kind: "booking",
      type: "transport",
      date: arrival,
      time: "11:00",
      title: "Airport transfer to the hotel",
      secondary: `${transfer.detail} · ${destination}`,
      summary: `${destination} airport · ${totalGuests} passengers`,
      location: destination,
      tiles: [
        { label: "Pickup", value: `${destination} Airport`, icon: "pin" },
        { label: "Passengers", value: `${totalGuests} guests`, icon: "guests" },
        { label: "Vehicle", value: "Coach", sub: `${coaches || 1} vehicle${coaches > 1 ? "s" : ""}`, icon: "bus" },
        { label: "Pickup time", value: "11:00", icon: "clock" },
      ],
      facts: [
        { label: "Destination", value: hotel ?? "Hotel" },
        { label: "Meeting point", value: "Arrivals hall, exit B" },
        { label: "Driver contact", value: "Shared 24h before arrival" },
      ],
      note: noteFor(notes, (n) => n.category === "Transport", formatNoteDate),
    });
  }

  /* — check-in — */
  items.push({
    id: "b-checkin",
    kind: "booking",
    type: "checkin",
    date: arrival,
    time: "15:00",
    title: "Check-in",
    secondary: hotel ?? "Hotel to be assigned",
    summary: `${totalRooms} rooms · ${totalGuests} guests`,
    location: hotel,
    tiles: [
      { label: "Check-in time", value: "15:00", icon: "clock" },
      { label: "Rooms", value: `${totalRooms} rooms`, icon: "bed" },
      { label: "Guests", value: `${totalGuests} guests`, icon: "guests" },
      ...(porter ? ([{ label: "Luggage", value: "Porter service", sub: porter.detail, icon: "luggage" } as const]) : []),
    ],
    facts: [
      { label: "Early arrival", value: "Luggage stored from 10:00" },
      { label: "Room distribution", value: `${totalRooms} rooms across the group` },
    ],
    note: noteFor(
      notes,
      (n) => n.category === "Accommodation" || n.category === "Guest information",
      formatNoteDate,
    ),
  });

  /* — breakfast on every morning after arrival — */
  if (breakfastIncluded) {
    days.slice(1).forEach((d, i) => {
      items.push({
        id: `b-breakfast-${d}`,
        kind: "booking",
        type: "breakfast",
        date: d,
        time: "07:00",
        title: "Breakfast",
        secondary: "Included in the room rate",
        summary: `Hotel Restaurant · 07:00–10:00 · ${totalGuests} guests`,
        location: hotel,
        tiles: [
          { label: "Dining arrangement", value: "Buffet", sub: "Served 07:00–10:00", icon: "dining" },
          { label: "Guests", value: `${totalGuests} guests`, icon: "guests" },
          ...(dietary.length
            ? ([{ label: "Dietary requirements", value: `${dietary.length} special requests`, icon: "dietary" } as const])
            : []),
        ],
        included: ["Breakfast buffet", "Coffee & tea"],
        dietary: i === 0 ? dietary.slice(0, 4) : undefined,
      });
    });
  }

  /* — group dinner — */
  if (groupDinner) {
    items.push({
      id: "b-dinner",
      kind: "booking",
      type: "dinner",
      date: groupDinner.date,
      time: groupDinner.time,
      title: "Group dinner",
      secondary: hotel ? `${hotel} · Hotel Restaurant` : "Hotel Restaurant",
      summary: `Hotel Restaurant · Chef's Choice${dietary.length ? ` · Dietary ${dietary.length}` : ""}`,
      location: hotel,
      tiles: [
        { label: "Dining arrangement", value: "Chef's Choice", sub: "3-course dinner", icon: "dining" },
        { label: "Guests", value: `${groupDinner.guests} guests`, icon: "guests" },
        ...(dietary.length
          ? ([{ label: "Dietary requirements", value: `${dietary.length} special requests`, icon: "dietary" } as const])
          : []),
        ...(otherExtras.length
          ? ([{ label: "Extras", value: `${otherExtras.length} additions`, icon: "extras" } as const])
          : []),
      ],
      dietary: dietary.slice(0, 5),
      included: ["3-course dinner", "Coffee & tea"],
      extras: otherExtras.map((s) => ({ label: s.name, count: s.detail })),
      facts: [
        { label: "Table arrangement", value: "Long tables, group seating" },
        { label: "Menu", value: "Menu selected by the hotel's chef." },
      ],
      specialArrangement: groupDinner.details,
      attention: attention ? `${attention} dietary requirement${attention > 1 ? "s" : ""} needs attention` : undefined,
      note: noteFor(notes, (n) => n.category === "Dietary", formatNoteDate),
    });
  }

  /* — meeting / event — */
  if (meeting) {
    items.push({
      id: "b-meeting",
      kind: "booking",
      type: "meeting",
      date: meeting.date,
      time: meeting.time,
      title: `Meeting — ${meeting.room}`,
      secondary: `${meeting.setup} · ${meeting.participants} participants`,
      summary: `${meeting.room} · ${meeting.setup}`,
      location: meeting.room,
      tiles: [
        { label: "Meeting room", value: meeting.room, icon: "room" },
        { label: "Setup", value: meeting.setup, sub: `${meeting.participants} participants`, icon: "setup" },
        { label: "Start", value: meeting.time, icon: "clock" },
        { label: "Equipment", value: "Projector & flipchart", icon: "equipment" },
      ],
      included: ["Projector", "Flipchart", "Still & sparkling water"],
      facts: [{ label: "Catering", value: "Coffee break at 10:30" }],
      note: noteFor(notes, (n) => n.category === "Meetings & Events", formatNoteDate),
    });
  }

  /* — check-out — */
  items.push({
    id: "b-checkout",
    kind: "booking",
    type: "checkout",
    date: departure,
    time: "11:00",
    title: "Check-out",
    secondary: hotel ?? "Hotel",
    summary: `${totalRooms} rooms${lateCheckout ? " · Late check-out arranged" : ""}`,
    location: hotel,
    tiles: [
      { label: "Check-out time", value: "11:00", icon: "clock" },
      { label: "Rooms", value: `${totalRooms} rooms`, icon: "bed" },
      { label: "Guests", value: `${totalGuests} guests`, icon: "guests" },
      ...(lateCheckout
        ? ([{ label: "Late check-out", value: lateCheckout.detail, icon: "clock" } as const])
        : []),
    ],
    facts: [{ label: "Luggage handling", value: "Storage available in the lobby until departure" }],
  });

  /* — departure coach — */
  if (transfer) {
    items.push({
      id: "b-transfer-out",
      kind: "booking",
      type: "transport",
      date: departure,
      time: "12:30",
      title: "Coach departure",
      secondary: `${transfer.detail} · to the airport`,
      summary: `${totalGuests} passengers`,
      tiles: [
        { label: "Pickup", value: hotel ?? "Hotel entrance", icon: "pin" },
        { label: "Passengers", value: `${totalGuests} guests`, icon: "guests" },
        { label: "Vehicle", value: "Coach", sub: `${coaches || 1} vehicle${coaches > 1 ? "s" : ""}`, icon: "bus" },
        { label: "Pickup time", value: "12:30", icon: "clock" },
      ],
      facts: [{ label: "Meeting point", value: "Hotel main entrance, 12:15" }],
    });
  }

  return items.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
}
