

export type RoomMix = { sgl: number; dbl: number; twn: number; trp: number; ste: number };

export type MealPlan = "room" | "breakfast";

export type Stay = {
  id: string;
  checkIn: string;
  checkOut: string;
  rooms: RoomMix;
  mealPlan: MealPlan;
};

export const emptyRooms = (): RoomMix => ({ sgl: 0, dbl: 0, twn: 0, trp: 0, ste: 0 });

export function fmtDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function roomsSummary(r: RoomMix) {
  const parts: string[] = [];
  if (r.sgl) parts.push(`${r.sgl} SGL`);
  if (r.dbl) parts.push(`${r.dbl} DBL`);
  if (r.twn) parts.push(`${r.twn} TWN`);
  if (r.trp) parts.push(`${r.trp} TRP`);
  if (r.ste) parts.push(`${r.ste} STE`);
  return parts.join(", ");
}

export function roomsTotal(r: RoomMix) {
  return r.sgl + r.dbl + r.twn + r.trp + r.ste;
}

export function guestsCapacity(r: RoomMix) {
  return r.sgl * 1 + r.dbl * 2 + r.twn * 2 + r.trp * 3 + r.ste * 2;
}
