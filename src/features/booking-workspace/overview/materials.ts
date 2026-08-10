/* ── Booking folder materials ────────────────────────────────
   A rigid grey presentation folder with real edge thickness,
   carrying raised ivory cards and one inset business card.
   Tokens only — no layout. */

export const FOLDER_TOP = "#E4E3DF";
export const FOLDER_TOP_SURFACE =
  "linear-gradient(180deg, #E9E8E4 0%, #E4E3DF 52%, #DEDDD8 100%)";
/** exposed side / bottom face of the folder — darker than the top */
export const FOLDER_EDGE = "#CBC9C3";
export const FOLDER_EDGE_DEEP = "#B9B7B1";
export const FOLDER_RIM = "rgba(255,255,255,0.85)";
/** hard line where the top surface breaks into the side face */
export const FOLDER_BREAK = "rgba(38,44,50,0.16)";
/** tight contact shadow + wider ambient — no generic halo */
export const FOLDER_CONTACT =
  "0 2px 3px rgba(10,18,26,0.30), 0 10px 22px rgba(10,18,26,0.24), 0 30px 60px rgba(10,18,26,0.20)";
/** perceived thickness of the folder material */
export const FOLDER_DEPTH = 6;

export const IVORY = "#F8F7F4";
export const IVORY_BORDER = "1px solid rgba(255,255,255,0.9)";
/** raised 2–3px: top rim, bottom edge, tight contact + soft ambient */
export const IVORY_SHADOW = [
  "inset 0 1px 0 rgba(255,255,255,0.95)",
  "inset 0 -1px 0 rgba(38,44,50,0.07)",
  "0 1px 0 rgba(255,255,255,0.55)",
  "0 2px 2px rgba(20,28,36,0.13)",
  "0 6px 14px rgba(20,28,36,0.10)",
].join(", ");

/** precision-cut recess the booking-details card is inserted into */
export const SLOT_BG = "linear-gradient(180deg, #D3D1CB 0%, #DAD8D3 100%)";
export const SLOT_SHADOW = [
  "inset 0 3px 5px rgba(24,30,36,0.22)",
  "inset 0 1px 0 rgba(24,30,36,0.14)",
  "inset 0 -1px 0 rgba(255,255,255,0.70)",
  "0 1px 0 rgba(255,255,255,0.55)",
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
