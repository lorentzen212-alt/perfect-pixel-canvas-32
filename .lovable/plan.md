# Final spacing refinement for the "What happens next" timeline

Only the internal vertical rhythm of the timeline card changes. Card height, width, column layout, content, fonts, circle sizes, colors and the active-row styling stay exactly as they are.

## What changes

1. The timeline list is the flexible area of the card (`flex flex-col flex-1 min-h-0`); no auto spacer pushes the link to the bottom edge.
2. Steps spread slightly more, to roughly 54-56px center-to-center on a typical laptop viewport, using one consistent gap between rows. Rows themselves stay compact — no large per-row flex growth.
3. The active Rooming List row keeps its exact current visual height, border and padding; no stretching.
4. Arrival lands clearly lower than today while staying visually part of the timeline, with no extra empty block between Rooming List and Final confirmation.
5. "View full timeline" sits ~34-38px below Arrival, with ~22-24px card bottom padding.
6. The connector stays perfectly centered behind the circles and continuous across the new gaps: green through completed and current, light gray after.

## Technical notes

In `src/features/booking-workspace/overview/Overview.tsx`, `NextSteps` only:

- `<ol>`: `mt-4 flex min-h-0 flex-1 flex-col gap-[10px]`, rows keep compact `minHeight` (active unchanged, others ~44px) so 54-56px center-to-center comes from the gap, not taller rows.
- Connector height becomes `calc(100% + 10px)` so it bridges the gap unbroken; left offset, width and color logic unchanged.
- Footer button: no `mt-auto`, fixed `pt` in the 34-38px range; card padding `pb-6`, top padding unchanged.
- Measure the rendered card in the live booking view and fine-tune the single gap value so the card's outer height and both column bottom edges stay identical.

No other file or card is touched.
