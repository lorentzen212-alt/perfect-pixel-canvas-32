import { format } from "date-fns";

export const GUESTS_PER_ROOM: Record<string, number> = {
  single: 1,
  double: 2,
  twin: 2,
  triple: 3,
  family: 4,
  accessible: 1,
};

export const ROOM_LABELS: Record<string, string> = {
  single: "Single Rooms",
  double: "Double Rooms",
  twin: "Twin Rooms",
  triple: "Triple Rooms",
  family: "Family Rooms",
  accessible: "Accessible Rooms",
};

export const STEP2_ROOMS_ORDER: string[] = [
  "single",
  "double",
  "twin",
  "triple",
  "family",
  "accessible",
];

export const emptyDraftRooms = (): Record<string, number> => ({
  single: 0,
  double: 0,
  twin: 0,
  triple: 0,
  family: 0,
  accessible: 0,
});

export function stayNights(a: string, d: string): number {
  if (!a || !d) return 0;
  const ad = new Date(a);
  const dd = new Date(d);
  const diff = Math.round((dd.getTime() - ad.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}
export function stayRoomsTotal(r: Record<string, number>): number {
  return Object.values(r).reduce((a, b) => a + b, 0);
}
export function stayGuestsTotal(r: Record<string, number>): number {
  return Object.entries(r).reduce(
    (a, [k, v]) => a + v * (GUESTS_PER_ROOM[k] ?? 1),
    0,
  );
}
export function fmtStayRange(a: string, d: string): string {
  if (!a || !d) return "";
  const ad = new Date(a);
  const dd = new Date(d);
  const sameMonth = ad.getMonth() === dd.getMonth() && ad.getFullYear() === dd.getFullYear();
  if (sameMonth) {
    return `${format(ad, "d")} – ${format(dd, "d MMMM yyyy")}`;
  }
  return `${format(ad, "d MMM")} – ${format(dd, "d MMM yyyy")}`;
}
