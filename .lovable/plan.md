# Left metallic insert — measured comparison against the reference

Both surfaces were sampled pixel by pixel: the live card was captured from `/manage-bookings` (`.hgb-card-insert`, bounding box x=303, w=16, h=444) and the reference image was measured at the same relative positions. Everything below is measured, not estimated.

## Measured numbers

| Property | Reference (scaled to card width) | Current implementation |
|---|---|---|
| Strip width | 28 px of a 1609 px-wide card ≈ **20 px** on our 1158 px card | 16 px |
| Left edge | 1–2 px bright rim `(153,133,102) → (235,197,128)` right at the card edge | dark `#6B4E17`, no rim |
| Body / plateau | flat, deeply saturated amber, roughly `(115,79,33)` → `(131,89,38)` across ~80% of the width | light, desaturated ramp climbing to `(235,219,177)` |
| Specular | one hard 3 px line at ~**88% of the width** (near the right edge): `(242,201,109) → (253,246,177) → (255,238,151)` | soft 3 px line at 36% (left of centre), only `rgba(255,245,218,0.55)` over an already light base |
| Right edge | drops from 140 to 37 in a single pixel — hard machined seam | soft 1 px inset shadow |
| Vertical shading | strong: cream at the top ~5%, bright sheen band at 25–40% height `(236,187,87)`, darkening through `(101,67,25)` at 60%, `(70,44,15)` at 78%, lifting slightly at the base | **none** — every scanline is byte-identical |
| Corner behaviour | strip narrows into the card radius at top and bottom (identical to ours) | same |

## Why it still looks different

1. **Too narrow.** 16 px vs an effective 20 px. At 16 px there is no room for the reference's three distinct zones (rim / plateau / specular), so they blend into one soft ramp.
2. **Wrong luminance distribution across the width.** The reference is *dark and saturated across most of its width* with light concentrated in two thin places (left rim, right specular). Ours puts the brightest value in a wide band at 36–44%, so it reads as a painted yellow ribbon rather than a curved metal surface catching one light source.
3. **The specular is on the wrong side and too weak.** In the reference the hot line sits at ~88% width — the metal's crown is near the card, so the surface reads as a convex bevel rolling away toward the outside. Ours sits at 36% and is a 0.55-alpha wash over an already bright base, so there is no specular *event*, only a slightly lighter stripe.
4. **No vertical dimension at all.** This is the biggest single difference. The reference has a full-height lighting story: cream top, bright sheen at the upper third, deep shadow around 60–78%, slight bounce at the base. Our gradient is purely horizontal, so the strip is literally the same pixel row repeated 444 times — flat, printed, dead.
5. **Saturation and dynamic range.** Reference plateau channels are `115/79/33` (very saturated brown-gold) against a 255 highlight — a ~3× dynamic range inside 20 px. Our plateau `184/156/86` to `222/201/144` is desaturated and already close to the highlight, so contrast is compressed and the metal loses its "polish".
6. **Edge treatment.** The reference has a crisp 1 px light rim on the outside and a single-pixel cliff into the card interior. Ours fades to `#5C4212` softly on both sides, so it looks embedded in felt rather than machined into an aluminium body.
7. **Grain is doing the wrong job.** Our `::before` is a 1 px repeating light/dark band at 0.2 opacity running horizontally; on a light base it mostly adds noise. The reference has no visible banding — its texture comes purely from the lighting gradient.

## Architecture verdict

The current architecture does **not** prevent an identical result. Geometry, placement, full-height coverage, corner clipping and the token-driven padding are all already correct and match the reference. The mismatch is entirely in the *material* — that is, in how many layers the strip paints and in which direction each one runs. One extra painting layer is required (a vertical lighting pass), which the existing `.hgb-card-insert` + `::before` + `::after` structure can hold without touching the card.

## Proposed change (material only)

- `--insert-w: 20px`, so the three zones fit; the card's left padding follows automatically from the existing token.
- **Base (element background)** — horizontal gradient with the crown near the right:
  `#3A2A0C 0% → #8A6524 6% → #6E4E1C 18% → #7A5722 55% → #9C7128 78% → #D8AE55 88% → #FFF3C6 91% → #C79B42 94% → #2A1E08 100%`
  1 px outer rim via `inset 1px 0 0 rgba(255,232,180,0.75)`, hard seam via `inset -1px 0 0 rgba(0,0,0,0.85)`.
- **`::before` becomes the vertical lighting pass** (replacing the grain): `linear-gradient(180deg, rgba(255,244,214,0.55) 0%, rgba(255,232,175,0.30) 6%, rgba(255,214,120,0.22) 30%, rgba(0,0,0,0) 46%, rgba(0,0,0,0.32) 62%, rgba(0,0,0,0.46) 78%, rgba(0,0,0,0.18) 100%)` with `mix-blend-mode: overlay` so it modulates rather than tints.
- **`::after` keeps the single continuous reflection** but moves to `left: 88%`, width 2 px, `rgba(255,250,225,0.9)`, so it is a real specular line rather than a wash.
- Grain, if kept at all, drops to 0.08 opacity inside the base layer — the reference shows no banding.

Nothing else on the booking card changes: no layout, no padding beyond the token, no glow, no bloom, no border gradient.

## Acceptance rule

The reference image is the source of truth. Where a measured value conflicts with how the reference *looks*, the visual match wins. After implementing, the rendered strip is captured again and compared against the reference; the material (and only the material) is iterated until the two are visually indistinguishable.
