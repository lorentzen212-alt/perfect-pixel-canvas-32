/**
 * Rooming List domain model.
 *
 * Concepts are kept deliberately separate so that a future "Quick Entry"
 * view, an Excel/CSV import mapper and the guided workspace can all edit the
 * exact same records:
 *
 *   BOOKING → ROOM ALLOCATION → GUEST
 *                            → ROOM REQUEST      (belongs to an allocation)
 *   GUEST   → GUEST REQUIREMENT (dietary / allergy / special request)
 *   BOOKING → GROUP REQUEST     (applies to the whole rooming list)
 *   BOOKING → ROOMING LIST SUBMISSION
 *
 * A ROOM ALLOCATION is *not* a physical hotel room. It is only a position in
 * the customer's confirmed room distribution. Hotel room numbers are assigned
 * by the hotel later and are never invented here.
 */

export type RoomType = "single" | "double" | "twin" | "triple" | "family";

export const ROOM_TYPES: { value: RoomType; label: string; capacity: number; bed: string }[] = [
  { value: "single", label: "Single", capacity: 1, bed: "One bed" },
  { value: "double", label: "Double", capacity: 2, bed: "One double bed" },
  { value: "twin", label: "Twin", capacity: 2, bed: "Two separate beds" },
  { value: "triple", label: "Triple", capacity: 3, bed: "Three beds" },
];

export function capacityOf(type: RoomType, override?: number) {
  if (override && override > 0) return override;
  return ROOM_TYPES.find((r) => r.value === type)?.capacity ?? 1;
}

export function labelOf(type: RoomType) {
  return ROOM_TYPES.find((r) => r.value === type)?.label ?? "Room";
}

export const NATIONALITIES = [
  { code: "NO", label: "Norway", flag: "🇳🇴" },
  { code: "SE", label: "Sweden", flag: "🇸🇪" },
  { code: "DK", label: "Denmark", flag: "🇩🇰" },
  { code: "FI", label: "Finland", flag: "🇫🇮" },
  { code: "DE", label: "Germany", flag: "🇩🇪" },
  { code: "NL", label: "Netherlands", flag: "🇳🇱" },
  { code: "GB", label: "United Kingdom", flag: "🇬🇧" },
  { code: "US", label: "United States", flag: "🇺🇸" },
];

export function flagOf(label?: string) {
  return NATIONALITIES.find((n) => n.label === label)?.flag ?? "";
}

/** Guest requirement tags. Allergies carry slightly stronger priority. */
export const DIETARY_TAGS = ["Vegetarian", "Vegan", "Gluten free", "Lactose free", "Pescatarian"];
export const ALLERGY_TAGS = ["Nut allergy", "Shellfish allergy", "Egg allergy", "Other allergy"];

export function isAllergy(tag: string) {
  return /allerg/i.test(tag);
}

export const ROOM_REQUEST_OPTIONS = [
  "High floor",
  "Quiet room",
  "Same floor",
  "Near elevator",
  "Away from elevator",
  "Connecting rooms",
  "Accessible room",
];

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  nationality?: string;
  email?: string;
  phone?: string;
  /** dietary preferences + allergies, stored as tags (never one notes blob) */
  requirements: string[];
  specialRequests?: string;
}

export interface Allocation {
  id: string;
  /** sequential list position — NOT a hotel room number */
  index: number;
  type: RoomType;
  /** optional occupancy override for dynamic room types (e.g. family) */
  occupancy?: number;
  guests: Guest[];
  requests: string[];
}

export interface RoomingList {
  bookingId: string;
  allocations: Allocation[];
  /** guests captured before a room allocation is known — safely stored */
  unassigned: Guest[];
  groupRequests: string[];
  submittedAt: string | null;
  savedAt: string | null;
  /** pending change proposals for a submitted (locked) list */
  changeLog: { id: string; allocation: number; removed: string[]; added: string[] }[];
}

export type Distribution = Partial<Record<RoomType, number>>;

/** Room distribution already confirmed on the booking. */
export const BOOKING_DISTRIBUTION: Record<string, Distribution> = {
  "1": { single: 8, double: 8, twin: 12, triple: 2 },
};

export function distributionFor(bookingId: string, rooms = 12): Distribution {
  return (
    BOOKING_DISTRIBUTION[bookingId] ?? {
      single: Math.round(rooms * 0.25),
      double: Math.round(rooms * 0.3),
      twin: Math.round(rooms * 0.35),
      triple: Math.max(1, Math.round(rooms * 0.1)),
    }
  );
}

const uid = () => Math.random().toString(36).slice(2, 10);

/** Allocations are generated from the booking's confirmed distribution. */
export function generateAllocations(dist: Distribution): Allocation[] {
  const order: RoomType[] = ["double", "twin", "single", "triple", "family"];
  const out: Allocation[] = [];
  let i = 0;
  for (const type of order) {
    for (let n = 0; n < (dist[type] ?? 0); n++) {
      i += 1;
      out.push({ id: uid(), index: i, type, guests: [], requests: [] });
    }
  }
  return out;
}

const SEED_NAMES: [string, string, string][] = [
  ["Irene", "Hansen Gorman", "Norway"],
  ["Steinar", "Johannessen", "Norway"],
  ["Michael", "Hahn", "Germany"],
  ["John Willy", "Bøe", "Norway"],
  ["Anna", "Berg", "Norway"],
  ["Emma", "Hansen", "Norway"],
  ["Lars", "Nygård", "Norway"],
  ["Sofia", "Lindqvist", "Sweden"],
  ["Mette", "Sørensen", "Denmark"],
  ["Jonas", "Ahlberg", "Sweden"],
  ["Kari", "Solberg", "Norway"],
  ["Petter", "Riis", "Norway"],
  ["Helena", "Virtanen", "Finland"],
  ["Ole", "Kristiansen", "Norway"],
  ["Ingrid", "Vollan", "Norway"],
  ["Tomas", "Ek", "Sweden"],
  ["Nina", "Dahl", "Norway"],
  ["Erik", "Moland", "Norway"],
  ["Camilla", "Frost", "Denmark"],
  ["Henrik", "Aas", "Norway"],
  ["Sara", "Nyborg", "Norway"],
  ["Fredrik", "Lunde", "Norway"],
  ["Line", "Haugen", "Norway"],
  ["Markus", "Storm", "Sweden"],
  ["Julie", "Vik", "Norway"],
  ["Anders", "Bakke", "Norway"],
  ["Thea", "Rønning", "Norway"],
  ["Gustav", "Palm", "Sweden"],
  ["Maja", "Holt", "Norway"],
  ["Simen", "Fjeld", "Norway"],
  ["Elise", "Nordby", "Norway"],
  ["Daniel", "Roos", "Netherlands"],
  ["Vera", "Lind", "Sweden"],
  ["Bjørn", "Tveit", "Norway"],
  ["Hanna", "Myhre", "Norway"],
  ["Oscar", "Berglund", "Sweden"],
  ["Silje", "Wold", "Norway"],
  ["Mads", "Ohlsen", "Denmark"],
];

/** Demo seeding so the workspace shows a realistic part-completed list. */
export function seedGuests(allocations: Allocation[], count: number): Allocation[] {
  let n = 0;
  const next = allocations.map((a) => ({ ...a, guests: [...a.guests], requests: [...a.requests] }));
  for (const a of next) {
    const cap = capacityOf(a.type, a.occupancy);
    for (let s = 0; s < cap; s++) {
      if (n >= count || n >= SEED_NAMES.length) break;
      const [firstName, lastName, nationality] = SEED_NAMES[n];
      a.guests.push({ id: uid(), firstName, lastName, nationality, requirements: [] });
      n += 1;
    }
    if (n >= count) break;
  }
  next[0].requests = ["High floor"];
  if (next[1]) next[1].requests = ["Quiet room"];
  if (next[3]) next[3].requests = ["Same floor"];
  if (next[0]?.guests[0]) {
    next[0].guests[0].requirements = ["Vegetarian", "Lactose free", "Nut allergy"];
    next[0].guests[0].email = "irene.hansen@email.com";
    next[0].guests[0].phone = "+47 123 45 678";
    next[0].guests[0].specialRequests = "High floor, quiet room if possible.";
  }
  return next;
}

const SEED_UNASSIGNED: [string, string, string][] = [
  ["Anna", "Smith", "United Kingdom"],
  ["John", "Smith", "United Kingdom"],
  ["Peter", "Hansen", "Denmark"],
  ["Marie", "Olsen", "Norway"],
];

export function createRoomingList(bookingId: string, dist: Distribution): RoomingList {
  const allocations = seedGuests(generateAllocations(dist), 38);
  const unassigned = SEED_UNASSIGNED.map(([firstName, lastName, nationality]) =>
    newGuest({ firstName, lastName, nationality }),
  );
  return {
    bookingId,
    allocations,
    unassigned,
    groupRequests: [],
    submittedAt: null,
    savedAt: null,
    changeLog: [],
  };
}

/* ── derived values (never hardcode progress) ─────────────────── */

export interface RoomingStats {
  totalSlots: number;
  filled: number;
  missing: number;
  percent: number;
  completeAllocations: number;
  incompleteAllocations: number;
  totalAllocations: number;
  byType: { type: RoomType; label: string; count: number }[];
}

export function allocationStatus(a: Allocation): "empty" | "attention" | "complete" {
  const cap = capacityOf(a.type, a.occupancy);
  const named = a.guests.filter(isNamed).length;
  if (named === 0) return "empty";
  return named >= cap ? "complete" : "attention";
}

export function isNamed(g: Guest) {
  return Boolean(g.firstName?.trim() || g.lastName?.trim());
}

export function guestName(g: Guest) {
  return `${g.firstName ?? ""} ${g.lastName ?? ""}`.trim();
}

export function statsOf(list: RoomingList): RoomingStats {
  let totalSlots = 0;
  let filled = 0;
  let complete = 0;
  const typeCounts = new Map<RoomType, number>();
  for (const a of list.allocations) {
    const cap = capacityOf(a.type, a.occupancy);
    totalSlots += cap;
    filled += Math.min(cap, a.guests.filter(isNamed).length);
    if (allocationStatus(a) === "complete") complete += 1;
    typeCounts.set(a.type, (typeCounts.get(a.type) ?? 0) + 1);
  }
  const missing = Math.max(0, totalSlots - filled);
  return {
    totalSlots,
    filled,
    missing,
    percent: totalSlots ? Math.round((filled / totalSlots) * 100) : 0,
    completeAllocations: complete,
    incompleteAllocations: list.allocations.length - complete,
    totalAllocations: list.allocations.length,
    byType: ROOM_TYPES.filter((t) => typeCounts.get(t.value)).map((t) => ({
      type: t.value,
      label: t.label,
      count: typeCounts.get(t.value) ?? 0,
    })),
  };
}

/* ── persistence ──────────────────────────────────────────────── */

export const storageKey = (bookingId: string) => `hgb:rooming-v1:${bookingId}`;

export function loadRoomingList(bookingId: string, dist: Distribution): RoomingList {
  if (typeof window === "undefined") return createRoomingList(bookingId, dist);
  try {
    const raw = window.localStorage.getItem(storageKey(bookingId));
    if (raw) {
      const parsed = JSON.parse(raw) as RoomingList;
      if (parsed?.allocations?.length) return { ...parsed, unassigned: parsed.unassigned ?? [] };
    }
  } catch {
    /* ignore corrupt drafts */
  }
  return createRoomingList(bookingId, dist);
}

export function saveRoomingList(list: RoomingList) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(list.bookingId), JSON.stringify(list));
  } catch {
    /* quota — ignore */
  }
}

export function newGuest(partial: Partial<Guest> = {}): Guest {
  return { id: uid(), firstName: "", lastName: "", requirements: [], ...partial };
}

export function newId() {
  return uid();
}

/* ── validation ───────────────────────────────────────────────── */

export type IssueKind =
  | "missing-guest"
  | "incomplete-room"
  | "unassigned-guest"
  | "missing-info"
  | "dietary-clarification";

export interface RoomingIssue {
  id: string;
  kind: IssueKind;
  /** allocation id when the issue belongs to a room */
  allocationId?: string;
  /** guest id when the issue belongs to a guest */
  guestId?: string;
  title: string;
  detail: string;
}

export function roomingIssues(list: RoomingList): RoomingIssue[] {
  const out: RoomingIssue[] = [];

  for (const a of list.allocations) {
    const cap = capacityOf(a.type, a.occupancy);
    const named = a.guests.filter(isNamed).length;
    const label = `${labelOf(a.type)} ${String(a.index).padStart(2, "0")}`;

    if (named === 0) {
      out.push({
        id: `${a.id}-empty`,
        kind: "missing-guest",
        allocationId: a.id,
        title: label,
        detail: cap > 1 ? "No guests assigned to this room" : "No guest assigned to this room",
      });
    } else if (named < cap) {
      out.push({
        id: `${a.id}-partial`,
        kind: "incomplete-room",
        allocationId: a.id,
        title: label,
        detail: `Incomplete occupancy — ${cap - named} of ${cap} places still open`,
      });
    }

    for (const g of a.guests) {
      if (isNamed(g) && (!g.firstName?.trim() || !g.lastName?.trim())) {
        out.push({
          id: `${g.id}-name`,
          kind: "missing-info",
          allocationId: a.id,
          guestId: g.id,
          title: guestName(g) || "Unnamed guest",
          detail: "Missing required guest information (first and last name)",
        });
      }
      if (g.requirements.some((r) => /other allergy/i.test(r)) && !g.specialRequests?.trim()) {
        out.push({
          id: `${g.id}-diet`,
          kind: "dietary-clarification",
          allocationId: a.id,
          guestId: g.id,
          title: guestName(g) || "Guest",
          detail: "Allergy information needs clarification",
        });
      }
    }
  }

  for (const g of list.unassigned) {
    out.push({
      id: `${g.id}-unassigned`,
      kind: "unassigned-guest",
      guestId: g.id,
      title: guestName(g) || "Unnamed guest",
      detail: "Guest is not yet assigned to a room",
    });
  }

  return out;
}
