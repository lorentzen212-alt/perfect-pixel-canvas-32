# Match the inside of "What happens next" to the reference

Only the interior of the timeline card changes. Card size, width, material, shadow, header position, colors, typography, the right column and the summary strip stay exactly as they are.

## What changes

1. **Unified circle geometry** — all six markers become the same ~26px diameter (completed, active, upcoming). Fills, borders and shadows keep their distinct states; only the geometry is identical. All six titles then begin on the exact same vertical line.
2. **Connector recentred** — the vertical line's left offset is recalculated for the new diameter so it sits perfectly centred behind all six markers, unbroken across the gaps, green through completed/current and light gray after.
3. **Active Rooming List row** — keeps the soft full-width champagne band, but the vertical gold left stripe is removed. Band: `background: rgba(184,134,32,0.045)`, `border: 1px solid rgba(184,134,32,0.26)`, radius 8-10px, no left border. The active state reads from the gold circle, the pale band, the subtle outline and the "Due in 6 days" pill.
4. **Arrival dash** — the trailing `—` renders as plain muted text, with no circle, pill or bordered container.
5. **Consistent row rhythm** — the active row no longer gets a taller `minHeight`; every row shares the same compact height. The highlight band may sit slightly proud of the row, but the rhythm stays even.
6. **Footer stays anchored** — "View full timeline →" remains near the bottom of the card, roughly where it is today. The Arrival-to-footer distance is not aggressively reduced; the timeline just uses the vertical space more evenly, with no dead block and no footer drifting up into the timeline.
7. **Row spacing** — after the circle normalization, only the row gap is fine-tuned, targeting roughly 54-56px center-to-center between markers on a typical laptop viewport, with the outer card height unchanged.

## Technical notes

All edits inside `NextSteps` in `src/features/booking-workspace/overview/Overview.tsx`:

- Circle style objects: `height: 26, width: 26` for all three states; keep per-state background, border, text color, font size and shadow.
- Connector: `left` offset updated to centre on a 26px marker; height keeps bridging the row gap (`calc(100% + gap)`).
- Active band span: drop the `inset 2px 0 0` left-accent shadow, apply the specified background/border/radius.
- Row `minHeight`: one shared compact value for all rows.
- Upcoming steps whose `sub` is `—` render as plain muted text rather than the outlined pill.
- Verify in the live booking view that the card's outer height and both column bottom edges are byte-identical to today; adjust only the single gap value and footer `pt` if needed.

No other component, file or card is touched.
