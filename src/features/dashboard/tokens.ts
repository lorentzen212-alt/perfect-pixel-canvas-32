/* ── palette ─────────────────────────────────────────── */
export const SIDEBAR = "#46525E";

/* base colour under the texture + very soft top/bottom lighting */
export const SIDEBAR_LAYERS = [
  // soft atmospheric glow emerging from the lower-right corner
  "radial-gradient(120% 70% at 108% 92%, rgba(150,178,205,0.30) 0%, rgba(126,155,182,0.16) 26%, rgba(90,116,142,0.06) 52%, rgba(27,38,50,0) 78%)",
  // secondary, wider ambient bounce so the glow fades naturally
  "radial-gradient(150% 95% at 96% 78%, rgba(120,150,178,0.12) 0%, rgba(27,38,50,0) 70%)",
  // darker top-left behind the logo
  "radial-gradient(110% 80% at 0% 0%, rgba(9,16,24,0.55) 0%, rgba(9,16,24,0.22) 38%, rgba(9,16,24,0) 72%)",
  // gentle vertical light transition
  "linear-gradient(170deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0) 42%, rgba(0,0,0,0.05) 100%)",
  // deep navy base
  "linear-gradient(180deg, #1B2632 0%, #1D2937 46%, #202D3B 100%)",
].join(", ");



export const SIDE_TEXT = "rgba(255,255,255,0.90)";
export const SIDE_TEXT_2 = "rgba(255,255,255,0.90)";
export const SIDE_MUTED = "rgba(255,255,255,0.90)";
export const SIDE_LINE = "rgba(255,255,255,0.06)";

export const GOLD_DEEP = "#A9853A";
export const PAGE = "#646D75";
export const CARD = "#31414F";
export const CARD_BORDER = "rgba(255,255,255,0.06)";
export const CARD_SHADOW =
  "0 2px 6px rgba(0,0,0,0.10), 0 12px 28px rgba(0,0,0,0.16), 0 32px 64px rgba(0,0,0,0.20)";
export const PANEL = "#2F3842";
export const HAIRLINE = "rgba(255,255,255,0.08)";
export const TEXT = "#F1EFE9";
export const TEXT_2 = "#B6C3CE";
export const MUTED = "#7F8F9C";
export const GOLD = "#E3A23C";
export const GOLD_SOFT = "#F2C46A";
export const PEARL = "#F4F1EA";
export const RULE = "rgba(190,205,215,0.20)";
/* deeper, richer premium royal blue (awaiting) — no cyan */
export const BLUE = "#4881D5";
/* polished brass — deeper, richer premium gold without glossy near-white peaks */
export const GOLD_BRUSHED =
  "linear-gradient(90deg, #6A4C10 0%, #8B6716 22%, #A87F1E 42%, #B98D24 52%, #A2791C 66%, #7E5C13 84%, #5E430B 100%)";
/* brushed champagne metal — richer, less orange, more depth */
export const GOLD_BRUSHED_H =
  "linear-gradient(140deg, #B88E43 0%, #C8A55A 18%, #E2C984 38%, #EBD7A2 50%, #E2C984 62%, #C8A55A 82%, #B88E43 100%)";
export const GREEN = "#6DBB83";
export const RED = "#C96A6A";
/* calm champagne used for labels, icons, hairlines and small accents */
export const CHAMPAGNE = "#EEBE44";
export const CHAMPAGNE_LINE = "rgba(238,190,68,0.35)";
export const IVORY = "#ECE7DF";

export const SERIF = '"Cormorant Garamond", "EB Garamond", Georgia, serif';
export const SANS = 'Inter, "Helvetica Neue", Arial, sans-serif';
