/**
 * Metallic colour helper for Instant Edits.
 * Turns a flat hex colour into a soft, multi-band polished-metal gradient.
 */

type RGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h.padEnd(6, "0").slice(0, 6);
  return {
    r: parseInt(full.slice(0, 2), 16) || 0,
    g: parseInt(full.slice(2, 4), 16) || 0,
    b: parseInt(full.slice(4, 6), 16) || 0,
  };
}

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

/** amount > 0 lightens toward white, < 0 darkens toward black. */
function shade({ r, g, b }: RGB, amount: number): string {
  const t = amount >= 0 ? 255 : 0;
  const p = Math.abs(amount);
  return `rgb(${clamp(r + (t - r) * p)}, ${clamp(g + (t - g) * p)}, ${clamp(b + (t - b) * p)})`;
}

/**
 * Build a polished-metal gradient from a base colour.
 * @param hex       base colour, e.g. "#c9a227"
 * @param strength  0..100 — reflection intensity
 * @param angle     0..360 — light direction in degrees
 */
export function metallicGradient(hex: string, strength = 60, angle = 155): string {
  const base = hexToRgb(hex || "#c9a227");
  const s = Math.max(0, Math.min(100, strength)) / 100;

  const deep = shade(base, -0.42 * s);
  const dark = shade(base, -0.24 * s);
  const mid = shade(base, -0.04 * s);
  const light = shade(base, 0.3 * s);
  const peak = shade(base, 0.52 * s);
  const second = shade(base, 0.18 * s);

  return `linear-gradient(${angle}deg,
    ${deep} 0%,
    ${dark} 10%,
    ${mid} 24%,
    ${light} 38%,
    ${peak} 50%,
    ${light} 62%,
    ${mid} 72%,
    ${second} 82%,
    ${dark} 92%,
    ${deep} 100%)`.replace(/\s+/g, " ");
}
