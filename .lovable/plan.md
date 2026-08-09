# Overlap the light booking panel behind the status cards

Recover ~20–25px of REAL page height by letting the ivory booking panel start
behind the bottom of the four dark status cards. No component is resized.
The panel's own content (tabs, search, first booking card) moves up too — the
overlap is not cancelled out by extra padding.

## Current state (verified in `src/routes/manage-bookings.tsx`)

- Status cards row: `<section className="mt-[1px] grid grid-cols-2 items-stretch gap-3 xl:grid-cols-4">` (line 1553) — no z-index today.
- A conditional "Complete your profile" strip (line 1603) can sit between the cards and the panel.
- Wrapper `div.mt-[10px]` (line 1631) then the panel `<section className="hgb-stone-surface relative isolate mt-[10px] ... pt-[16px] ... sm:pt-[19px] ...">` (line 1637).

## Changes

1. Status card row (line 1553): add `relative z-[2]` so the cards render above the panel. Nothing else on that row changes.

2. Overlap — exactly one source. The negative margin goes on the wrapper `div` at line 1631 only (it is also where the profile-strip condition is easiest to manage): `xl:-mt-[22px]`, which overrides its base `mt-[10px]` at `xl` and up. The panel `<section>` keeps its own `mt-[10px]` untouched and does NOT get a negative margin.

   Margin math: today the panel top sits at wrapper `+10` + panel `+10` = `+20px`. With the wrapper at `-22` it becomes `-22 + 10 = -12px` — a real upward shift of exactly 32px. (Using `-32px` on the wrapper would move it 42px, too much.)

3. Panel section (line 1637): keep `relative isolate` and its `mt-[10px]`, add `z-[1]`, and bump top padding only slightly — from `sm:pt-[19px]` to `xl:pt-[28px]` (+9px), not 48px. Net effect: 32px pulled up minus ~9px padding ≈ 23px of real recovered height for tabs/search/booking content. Side/bottom padding and radius unchanged.

4. Below `xl`: no negative margin, no extra padding — the cards wrap to 2×2 there, so the layout stays exactly as today.

5. Profile strip: when "Complete your profile" is visible, no overlap at all — the `xl:-mt-[22px]` and `xl:pt-[28px]` classes are applied conditionally on the same `isProfileComplete(profile)` check, so the strip never collides with the panel.

6. Contact shadow: not part of the first pass. Build the overlap first, then inspect. Only if the cards need more separation from the ivory panel, append (never replace, never noticeably stronger) `0 8px 14px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.08)`.

## Not touched

Hero, Welcome block and gold line, sidebar, profile/bell, status card sizes/content/typography, tabs, search, filters, booking card and its image, gold edge, progress tracker, panel width/radius/material/side padding, data, routing.

## Validation

Measured with real rendered Y positions in the live preview at 1216px wide, before vs after:

1. Status cards: identical position and size.
2. Ivory panel top edge: ~30–32px higher than before.
3. Tabs: allowed to move up; must stay clearly separated from the overlapping cards (no visual collision with Active / Cancelled / All Bookings).
4. Search/filter row: moves up naturally with the tabs.
5. First booking card: starts ~20–25px higher than before.
6. Total document/content height: actually decreased by ~20–25px. If it did not, the padding compensation is too large — reduce it rather than claiming the saving.
