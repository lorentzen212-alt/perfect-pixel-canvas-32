# Left metallic gold insert — diagnosis and structural rebuild

## What I checked

I read the `BookingCard` component in `src/routes/manage-bookings.tsx` (lines 369–675), the card CSS in `src/styles.css` (`.hgb-booking-card`, `.hgb-gold-metal`), and inspected the live rendered card in your preview.

## 1. How the card is structured today

```text
<article class="hgb-booking-card ...">   <- grid, overflow:hidden, radius 12, pl-40 pr-26 py-26
   <span goldInsert />                   <- absolute inset-y-0 left-0 w-14
   <div media />                          <- image frame (grid col 1)
   <div info />                           <- text column (grid col 2)
</article>
```

The whole card is one `<article>`; the gold insert is an absolutely positioned `<span>` inside it, and the left padding (`pl-[40px]`) is what keeps content off the strip.

## 2. Which element paints the card background

The `<article>` itself, via the inline `shell` object: `linear-gradient(180deg,#131C27,#111923,#0F1620)`, `1px solid rgba(255,255,255,0.055)` border, radius 12. No inner wrapper paints a background — media and info are transparent.

## 3. Is an inner wrapper covering the left edge?

No. Live measurement: card starts at x=303, insert at x=304 with width 14 and height 442 of the card's 444 — it is rendering, full height, unobstructed, and nothing overlaps it. Media column starts at x=344.

## 4. Overflow / z-index / radius / masking

- `overflow:hidden` on the article is fine and actually gives the strip the card's corner radius.
- No stacking conflict: the insert is the first child, siblings are non-positioned or `position:relative` without z-index, so nothing paints over it.
- The only geometric issue: the insert is inside the border box, so the card's 1px light border draws a pale hairline down the left, and the strip sits 1px in from the true card edge instead of being flush.

## Root cause

The strip is not clipped or hidden — it is rendering, but it does not read as a solid metallic champagne insert because of how it is painted:

- The base gradient tops out at `#C4A254` and is dark at both edges (`#4A3A17` / `#3E3013`), so on a near-black card it reads as a dim sliver, not metal.
- Three stacked overlays subtract further light: a repeating grain at 0.5 opacity, a top/bottom luminance falloff up to 32% black, and a 2px reflection too narrow to register at 14px.
- 14px inside a 12px-radius, 1px-bordered box means the top and bottom ~12px are clipped away by the corner curve, so the strip visibly tapers.
- The material is defined inline inside the render body, so every iteration rewrites component JSX instead of one token.

So: it is a material/geometry problem, not a visibility bug. A width bump alone would not fix it.

## 5. Cleanest long-term architecture

Make the strip a structural, tokenised layer of the card rather than an ad-hoc decorative span:

1. **Single CSS component class** `.hgb-card-insert` in `src/styles.css`, with the metal defined in CSS custom properties (`--insert-w`, `--insert-base`, `--insert-peak`, `--insert-shadow`). The gradient, brushed grain and reflection become `::before` / `::after` on that one class — no inline style objects in the component.
2. **Insert lives on the card's own padding box, flush to the edge**: keep `overflow:hidden` + radius on the `<article>`, position the insert at `inset: 0 auto 0 0` with a negative 1px inset so it sits under the card border rather than behind a lighter hairline. Suppress `border-left` on the article so the strip is the left edge.
3. **Content offset driven by the same token**: `padding-left: calc(var(--insert-w) + 26px)`, so widening the metal never desynchronises the layout. Same class and token used by both the full and `compact` variants — today they duplicate padding values.
4. **Material rebuild** so it reads as brushed anodized gold: 16px wide, gradient anchored on saturated champagne (roughly `#6B4E17 → #B08F3E → #E2C57C → #A8853A → #5C4212`) with the peak slightly left of centre, one continuous 3px satin reflection at ~36%, grain reduced to ~0.22 opacity, and the vertical falloff removed so it stays consistent top to bottom. A hard `inset -1px 0 2px rgba(0,0,0,0.55)` on the right side gives the machined seam where metal meets card.
5. **No glow, no bloom, no border-gradient, no overlay veil** — the insert is opaque and sits in the card's own box.

## Files to change

- `src/styles.css` — add `.hgb-card-insert` (+ tokens, `::before` grain, `::after` reflection) near the existing `.hgb-booking-card` block.
- `src/routes/manage-bookings.tsx` — replace the inline `goldInsert` JSX with `<span aria-hidden className="hgb-card-insert" />`, drop `border-left` from `shell`, and switch both card variants' left padding to the token-based calc.

Nothing else on the card (image frame, chips, reference panel, timeline, footer button) changes.

## Confirmed implementation spec (approved details)

- `.hgb-booking-card` gets `--insert-w: 16px`, `padding-left: calc(var(--insert-w) + 26px)`, and a transparent left border (no pale hairline).
- `.hgb-card-insert`: `position:absolute; inset:-1px auto -1px -1px;` fully opaque, gradient
  `#6B4E17 → #B08F3E → #E2C57C → #F1D996 (peak slightly left of centre) → #A8853A → #5C4212`,
  plus `inset -1px 0 2px rgba(0,0,0,0.55)` machined seam on the right edge.
- `::before` = horizontal brushed grain at 0.2 opacity. `::after` = one continuous 3px satin reflection at 36%.
- No top/bottom darkening, no glow, no bloom, no veil, no border gradient.
- Both the full and compact card variants render `<span aria-hidden className="hgb-card-insert" />` and drop their hardcoded left padding, so the token drives both.
- Verified afterwards in the live preview: full-height metal, flush to the true card edges, no pale 1px border, no taper beyond the natural corner radius.

Nothing else on the card changes.
