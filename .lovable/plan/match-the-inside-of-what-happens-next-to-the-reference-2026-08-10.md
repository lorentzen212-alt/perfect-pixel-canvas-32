# Match the inside of "What happens next" to the reference

Only the interior of the timeline card changes. Card height, width, material, shadow, header position, colors, typography, the right column and the summary strip stay exactly as they are.

## What changes

1. **One circle size for every state.** Completed, active and upcoming markers all become ~26px with identical geometry; only fill, border and content differ. This puts all six titles on the exact same vertical line.
2. **Connector recentered.** The line's left offset is recalculated for the new diameter so it sits perfectly behind all six markers, green through completed and current, light gray after.
3. **Active Rooming List row**: keeps the soft full-width champagne band, but the vertical gold stripe on the left is removed. Band is `rgba(184,134,32,0.045)` with a `1px solid rgba(184,134,32,0.26)` outline and 8–10px radius, no inset left border. Active state is carried by the gold circle, the band, the outline and the "Due in 6 days" pill.
4. **Arrival's "—"** renders as plain muted text — no circle, pill or border around it.
5. **Consistent row rhythm.** No extra `min-height` on the active row; the highlight band may read slightly larger visually, but rows share one height.
6. **Footer stays anchored.** "View full timeline →" keeps its current position near the bottom of the card; the Arrival-to-footer distance is not aggressively reduced. Extra breathing room goes into the row rhythm, not into pulling the footer up.
7. **Row gap fine-tuned only**, targeting roughly 54–56px center-to-center between markers on a typical laptop viewport, with the card's outer height unchanged.

## Technical notes

All edits live in `NextSteps` in `src/features/booking-workspace/overview/Overview.tsx`:

- Circle style objects: `height: 26, width: 26` for all three states; keep green fill + check, gold fill + number, and the light fill with gray border + number.
- Connector: `left` becomes the new circle center (~13px + row padding) and `height` stays `calc(100% + gap)` so it bridges each gap unbroken.
- Active band: drop `boxShadow: inset 2px 0 0 …`, apply the specified background/border/radius, keep the horizontal bleed.
- Trailing value: when `sub` is `—` (or the step is neither done nor active with a dash), render a plain `<span>` with the muted text color instead of the outlined pill.
- Rows: single `minHeight` for all `li` items; distribute space through the list `gap` only.
- After the edit, measure the rendered card live and adjust only the gap so center-to-center lands in 54–56px and the card's total height matches today's value exactly.

No other file or component is touched.
