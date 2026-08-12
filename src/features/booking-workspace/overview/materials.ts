/* ── Booking folder materials ────────────────────────────────
   A rigid grey presentation folder with real edge thickness,
   carrying raised ivory cards and one inset business card.
   Tokens only — no layout. */

export const FOLDER_TOP = "#D1D4D4";
export const FOLDER_TOP_SURFACE =
  "linear-gradient(180deg, #D7DADA 0%, #D1D4D4 55%, #CBCFD0 100%)";
/** warm beige/cream variant of the plate surface — Documents workspace only */
export const FOLDER_TOP_SURFACE_WARM =
  "linear-gradient(180deg, #F6F2EB 0%, #F2EEE7 55%, #EDE8DF 100%)";
/** exposed side / bottom face of the folder — darker than the top */
export const FOLDER_EDGE = "#BBC1C4";
export const FOLDER_EDGE_DEEP = "#AEB4B8";
export const FOLDER_RIM = "rgba(255,255,255,0.75)";
/** hard line where the top surface breaks into the side face */
export const FOLDER_BREAK = "rgba(0,0,0,0.08)";
/** tight contact shadow + wider ambient — no generic halo */
export const FOLDER_CONTACT = "0 6px 12px rgba(12,22,30,0.16)";
/** perceived thickness of the folder material */
export const FOLDER_DEPTH = 9;

export const IVORY = "#F5F3EE";
export const IVORY_BORDER = "1px solid rgba(255,255,255,0.70)";
/** raised 2–3px: top rim, bottom edge, tight contact + soft ambient */
export const IVORY_SHADOW = [
  "inset 0 1px 0 rgba(255,255,255,0.85)",
  "inset 0 -1px 0 rgba(31,44,56,0.10)",
  "0 1px 1px rgba(15,25,35,0.12)",
  "0 4px 8px -2px rgba(15,25,35,0.22)",
].join(", ");

/** precision-cut recess the booking-details card is inserted into */
export const SLOT_BG = "linear-gradient(180deg, #C7CCCE 0%, #CDD1D2 100%)";
export const SLOT_SHADOW = [
  "inset 1px 1px 2px rgba(0,0,0,0.08)",
  "inset 0 2px 4px rgba(24,30,36,0.14)",
  "inset 0 -1px 0 rgba(255,255,255,0.55)",
].join(", ");
/** the seated card sits slightly below the folder plane */
export const SLOT_CARD_SHADOW = [
  "inset 0 1px 0 rgba(255,255,255,0.85)",
  "0 1px 2px rgba(24,30,36,0.16)",
].join(", ");
export const SLOT_GROOVE = 6;

export const INK = "#1B2530";
export const INK_2 = "#5F6B75";
export const INK_3 = "rgba(27,37,48,0.46)";
export const HAIR = "rgba(27,37,48,0.10)";

export const GOLD = "#B0700F";
export const GOLD_2 = "#C38A20";
export const AMBER = "#B4720E";
export const AMBER_DEEP = "#9A6109";
export const SAND = "#EDE4D6";
export const GREEN = "#2E6B45";

export const TAB_INACTIVE = "#152938";
export const PAGE_UNDER = "#12222E";
