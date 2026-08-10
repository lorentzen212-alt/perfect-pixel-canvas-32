# Fix exact height matching in Booking Overview

The current two-column grid uses `items-start`, and the timeline card uses `self-start`, so its bottom edge cannot align with the combined Booking Details + Need Help column.

## Changes

All changes stay inside `src/features/booking-workspace/overview/Overview.tsx`:

1. Change the two-column grid to `items-stretch`, preserving the existing 54/46 column proportions and 16px gap above the summary strip.
2. Make `NextSteps` a full-height flex-column card by replacing `self-start` with `h-full`.
3. Keep every timeline row and step gap unchanged; apply `mt-auto` to the “View full timeline” footer so spare height is placed between the timeline and footer, with the existing compact card bottom padding.
4. Compress Booking Details by roughly 8–10% through smaller vertical container/row/footer padding only.
5. Compress Need Help by roughly 10–15% through smaller vertical padding and button spacing only.
6. Keep the timeline’s shared raised `Card` material unchanged: no inner frame, no new outline, and no fixed heights.

No changes to content, widths, colors, icons, active-state styling, Current Action, summary strip, navigation, tabs, or page background.

## Verification

Check the live Booking Overview at the current laptop viewport and confirm:

- the left card and Need Help end on the exact same horizontal line;
- the summary strip remains 12–16px below both columns;
- timeline rows retain their current compact heights;
- no empty gray gap remains below the timeline card.
