# Rebalance the "What happens next" timeline spacing

Only the internal vertical rhythm of the timeline card changes. Card height, width, column layout, content, colors, icons and behaviour stay exactly as they are.

## What changes

1. The timeline list becomes the flexible area of the card (`flex flex-col flex-1 min-h-0`) instead of pushing the link down with an auto spacer.
2. Extra height shows up as an even gap between steps, not as taller rows. Rows keep their current compact minimum heights; a single consistent gap is applied between them so center-to-center lands around 52-56px on a typical laptop viewport.
3. The active Rooming List row stays exactly as it looks today: same highlight box, border, circle size, no stretching, no extra padding.
4. "View full timeline" loses `mt-auto`. It sits ~32-38px below Arrival with ~22-24px bottom padding, so it feels attached to the timeline rather than to the card edge.
5. Header spacing is untouched.
6. The connector stays continuous, centered through the circles, behind them, green through the active step and gray after.

## Technical notes

In `src/features/booking-workspace/overview/Overview.tsx`, `NextSteps` only:

- `<ol>`: `mt-4 flex min-h-0 flex-1 flex-col gap-2` — a fixed gap distributes the breathing room evenly; no per-row `flex-1`, no growth cap.
- Rows keep `minHeight: active ? 46 : 44` so the visual row box does not grow; the gap supplies the extra rhythm.
- Connector: its height becomes `calc(100% + 8px)` to bridge the new fixed gap, keeping the line unbroken; horizontal position, width and colors unchanged.
- Footer button: drop `mt-auto`, use `pt-8`; card padding becomes `pt-4 pb-6` (top unchanged).
- Gap value is tuned once against the live card so the last step lands with the target breathing room and the card height stays identical.

No other file or card is touched. Verification: open a booking overview at a typical laptop viewport, confirm the card height and both column bottom edges are unchanged, the connector is unbroken, and there is no empty block in the lower half.
