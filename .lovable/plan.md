# Stretch "What happens next" to match the right column

Right now the timeline card stops early, leaving an empty gap above the summary strip (image 2). It should end at the same line as the "Need help" card below "Booking details".

## Changes (all in `src/features/booking-workspace/overview/Overview.tsx`)

1. Grid row: change `items-start` to `items-stretch` on the two-column grid so both columns share the same height.
2. `NextSteps` card: remove `self-start` and add `h-full` so the card fills the row height.
3. Keep the timeline steps at their current compact heights, and push the "View full timeline" link to the bottom of the card (`mt-auto` with a small top spacing) so the extra height is absorbed as breathing room under the last step instead of stretching each row.

No other cards, colors, or spacing change.
