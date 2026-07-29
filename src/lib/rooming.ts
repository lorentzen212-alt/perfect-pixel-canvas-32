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

/* ── room categories (upgrade hierarchy) ─────────────────────── */

export type RoomCategory = "standard" | "superior" | "premium" | "junior_suite" | "suite";

/** Hierarchy configured for the booking/hotel — index = rank (low → high). */
export const ROOM_CATEGORIES: { value: RoomCategory; label: string }[] = [
  { value: "standard", label: "Standard" },
  { value: "superior", label: "Superior" },
  { value: "premium", label: "Premium" },
  { value: "junior_suite", label: "Junior Suite" },
  { value: "suite", label: "Suite" },
];

export function categoryRank(c: RoomCategory) {
  return ROOM_CATEGORIES.findIndex((x) => x.value === c);
}

export function categoryLabel(c: RoomCategory) {
  return ROOM_CATEGORIES.find((x) => x.value === c)?.label ?? "Standard";
}

export type UpgradePreference = "if_available" | "price";
export type UpgradeStatus = "requested" | "price_offered" | "approved" | "declined";

export const UPGRADE_STATUS_META: Record<UpgradeStatus, { label: string; color: string; bg: string; border: string }> = {
  requested: {
    label: "Requested",
    color: "#C5A24B",
    bg: "rgba(197,162,75,0.12)",
    border: "rgba(197,162,75,0.30)",
  },
  price_offered: {
    label: "Price offered",
    color: "#9FBBD6",
    bg: "rgba(120,158,196,0.14)",
    border: "rgba(140,175,208,0.32)",
  },
  approved: {
    label: "Approved",
    color: "#8FC79A",
    bg: "rgba(116,182,128,0.12)",
    border: "rgba(116,182,128,0.30)",
  },
  declined: {
    label: "Declined",
    color: "#C79A9A",
    bg: "rgba(190,140,140,0.12)",
    border: "rgba(190,140,140,0.28)",
  },
};

export interface UpgradeRequest {
  id: string;
  /** requested higher category — never mutates bookedRoomCategory */
  category: RoomCategory;
  preference: UpgradePreference;
  note?: string;
  status: UpgradeStatus;
  requestedAt: string;
  /** set once the approved upgrade has been formally applied to the booking */
  appliedAt?: string | null;
}

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
  /** current (working) room type */
  type: RoomType;
  /** the confirmed/booked room type — never changed by the user */
  bookedRoomType: RoomType;
  /** the confirmed/booked room category */
  bookedRoomCategory: RoomCategory;
  /** request only — does NOT change bookedRoomCategory */
  upgradeRequest?: UpgradeRequest | null;
  /** optional occupancy override for dynamic room types (e.g. family) */
  occupancy?: number;
  guests: Guest[];
  requests: string[];
}

/** true when the working room type no longer matches the confirmed booking */
export function hasRoomTypeChange(a: Allocation) {
  return a.type !== a.bookedRoomType;
}

/** Valid upgrade categories for a single allocation (strictly higher only). */
export function upgradeOptionsFor(a: Allocation): RoomCategory[] {
  const rank = categoryRank(a.bookedRoomCategory);
  return ROOM_CATEGORIES.filter((c) => categoryRank(c.value) > rank).map((c) => c.value);
}

export function canUpgrade(a: Allocation) {
  return upgradeOptionsFor(a).length > 0;
}

/** Categories valid for EVERY allocation in the selection. */
export function commonUpgradeOptions(list: Allocation[]): RoomCategory[] {
  if (list.length === 0) return [];
  return ROOM_CATEGORIES.map((c) => c.value).filter((c) =>
    list.every((a) => upgradeOptionsFor(a).includes(c)),
  );
}

/** Allocations in the selection for which the given category is NOT a valid upgrade. */
export function invalidForCategory(list: Allocation[], category: RoomCategory) {
  return list.filter((a) => !upgradeOptionsFor(a).includes(category));
}

export function newUpgradeRequest(
  category: RoomCategory,
  preference: UpgradePreference,
  note?: string,
): UpgradeRequest {
  return {
    id: uid(),
    category,
    preference,
    note: note?.trim() ? note.trim() : undefined,
    status: "requested",
    requestedAt: new Date().toISOString(),
    appliedAt: null,
  };
}

/* ── guest requirement helpers ────────────────────────────────── */

export function guestRequirementSummary(g: Guest) {
  const tags = g.requirements ?? [];
  const allergies = tags.filter(isAllergy);
  const dietary = tags.filter((t) => !isAllergy(t));
  return {
    tags,
    allergies,
    dietary,
    hasAny: tags.length > 0,
    hasAllergy: allergies.length > 0,
  };
}

export function allocationHasRequirements(a: Allocation) {
  return a.guests.some((g) => (g.requirements?.length ?? 0) > 0);
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
