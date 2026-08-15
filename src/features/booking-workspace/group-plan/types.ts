/* ── Group Plan data model ───────────────────────────────────
   One chronological plan built from two sources:
     · "booking"  — derived from the confirmed booking (read-only)
     · "myplan"   — created by the user (editable)                */

export type PlanKind = "booking" | "myplan";

export type PlanItemType =
  | "transport"
  | "checkin"
  | "checkout"
  | "breakfast"
  | "lunch"
  | "dinner"
  | "meeting"
  | "activity"
  | "meeting-point"
  | "free-time"
  | "reminder";

export type TileIcon =
  | "dining"
  | "guests"
  | "dietary"
  | "extras"
  | "room"
  | "setup"
  | "equipment"
  | "clock"
  | "bus"
  | "pin"
  | "bed"
  | "luggage";

export interface PlanTile {
  label: string;
  value: string;
  sub?: string;
  icon: TileIcon;
}

export interface DietaryRow {
  name: string;
  room: string;
  restriction: string;
  needsAttention?: boolean;
}

export interface CountRow {
  label: string;
  count: string;
}

export interface PlanNote {
  text: string;
  author: string;
  date: string;
}

export interface PlanItem {
  id: string;
  kind: PlanKind;
  type: PlanItemType;
  /** ISO yyyy-mm-dd — null means the item is unscheduled */
  date: string | null;
  /** HH:mm — null means "no time set" */
  time: string | null;
  title: string;
  secondary?: string;
  /** collapsed-row summary line, e.g. "Hotel Restaurant · Chef's Choice · Dietary 3" */
  summary?: string;
  location?: string;
  /** compact tiles at the top of the expanded area */
  tiles?: PlanTile[];
  dietary?: DietaryRow[];
  included?: string[];
  extras?: CountRow[];
  /** label/value pairs rendered as a fact list (transport, meetings, check-in …) */
  facts?: { label: string; value: string }[];
  specialArrangement?: string;
  note?: PlanNote | null;
  /** only set when something genuinely needs action */
  attention?: string;
  menuHref?: string;
}
