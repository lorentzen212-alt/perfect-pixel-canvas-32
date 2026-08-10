# Rebalance the "What happens next" timeline spacing

Only the internal vertical rhythm of the timeline card changes. Card height, width, column layout, content, colors, icons and behaviour stay exactly as they are.

## What changes

1. The timeline list becomes the flexible part of the card instead of the link at the bottom. The list takes the leftover height, and the six steps share that height evenly, so the space is distributed between steps rather than collected in one dead block.
2. Step center-to-center distance grows from ~43-46px to ~52-58px, driven by the available height rather than fixed values. Minimum heights stay as safety floors (46px normal, 50px active) so the card never breaks on short viewports.
3. "View full timeline" loses its large auto spacer. It sits ~32-42px under the Arrival step and ~22-26px above the card's bottom edge, visually connected to the timeline.
4. Header spacing stays as-is (~20-24px from top, ~20-24px to first step).
5. The connector line stays continuous, centered through the circles, behind them, green through the active step and gray after — because rows remain contiguous (they grow, no gaps are inserted), the existing full-height connector keeps working with no position change.
6. The active Rooming List highlight keeps its exact look and stays ~48-52px tall; its inset padding is tuned so the taller neighbouring rows do not overlap it.

## Technical notes

In `src/features/booking-workspace/overview/Overview.tsx`, `NextSteps`:

- `<ol>` gets `flex min-h-0 flex-1 flex-col` (keeps `mt-4`).
- Each `<li>` gets `flex-1` with `minHeight: active ? 50 : 46`, so leftover height distributes across rows instead of pooling at the bottom. Active row gets a small `flex-grow` cap so it stays in the 48-52px band while other rows absorb the extra space.
- The active highlight `inset-y` is adjusted slightly so the pill stays snug at the taller row height.
- The "View full timeline" button drops `mt-auto` and uses a fixed `pt` in the 32-42px range (`pt-9`); card bottom padding is set to ~24px (`pb-6`) while the top padding stays unchanged.

No other file is touched. Verification: load a booking overview at a typical laptop viewport and confirm the card height and both column bottom edges are unchanged, with no empty rectangle in the lower half.
