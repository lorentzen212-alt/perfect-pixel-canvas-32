# Unify Group Plan gold accents

Standardize all gold-colored elements on the Group Plan page to one tone so the date numbers, timeline spine/dots, "Your booking" label, and "Timeline" active state all match.

## What changes

File: `src/features/booking-workspace/group-plan/GroupPlan.tsx` only.

1. Use `#D8B85D` (`GOLD`) as the single gold accent for:
   - `Eyebrow` component (currently `GOLD_DEEP` / `#E8CC7A`)
   - Large timeline day numbers (already `GOLD` — no change)
   - Calendar day-tile numbers (currently `GOLD_DEEP`)
   - Timeline circular dots (already `GOLD` — no change)
   - Timeline vertical spine (currently translucent `GOLD_LINE`; change to solid `GOLD` at low opacity or full `GOLD` depending on visual weight)
   - Active "Timeline" toggle text and icon (currently `GOLD_DEEP`)
   - Calendar dot for my-plan items (currently `GOLD` — no change)

2. Keep `GOLD_DEEP` (`#E8CC7A`) reserved for hover states and the "Add to plan" / "Add time or activity" buttons so the lighter tone remains as an interaction highlight, not a static label color.

3. No layout, typography, spacing, or functional changes.

## Verification

- Run typecheck (`tsgo` or `bunx tsc --noEmit`).
- Open the Group Plan tab and confirm the date numbers, vertical line, dots, "Your booking" eyebrow, and active "Timeline" toggle are all the same gold tone.
