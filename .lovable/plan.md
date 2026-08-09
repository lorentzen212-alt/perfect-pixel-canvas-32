# Overlap the light booking panel behind the status cards

Recover ~32px of page height by letting the ivory booking panel start behind the
bottom of the four dark status cards. No component is resized or moved.

## Current state (verified in `src/routes/manage-bookings.tsx`)

- Status cards row: `<section className="mt-[1px] grid grid-cols-2 items-stretch gap-3 xl:grid-cols-4">` (line 1553) — no z-index today.
- A conditional "Complete your profile" strip (line 1603) can sit between the cards and the panel.
- Wrapper `div.mt-[10px]` (line 1631) then the panel `<section className="hgb-stone-surface relative isolate mt-[10px] ... pt-[16px] ... sm:pt-[19px] ...">` (line 1637).

## Changes

1. Status card row (line 1553): add `relative z-[2]` so the cards render above the panel. Nothing else on that row changes.

2. Panel section (line 1637): keep `relative isolate`, add `z-[1]`, and at the desktop breakpoint where all four cards are in one row (`xl:`) apply:
   - `xl:-mt-[32px]` (replaces the effective gap; the negative margin lives on the panel/section relationship, not on the cards)
   - `xl:pt-[48px]` on top of the current `sm:pt-[19px]` so the tabs keep their exact clearance below the overlapping cards (19 + 32 ≈ 51 → 48px keeps the visual gap identical after the ~3px the current 10px wrapper gap contributes)
   - below `xl`, no negative margin and no extra padding — the cards wrap into 2×2 there, so the layout stays as it is today.

3. Contact shadow: not part of the first pass. Build the overlap first, then inspect the cards against the ivory panel. Only if they need more separation, append (never replace, never make it noticeably stronger) `0 8px 14px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.08)` to the existing card shadow.

4. When the "Complete your profile" strip is visible, it sits between the two sections and would collide with the overlap — the overlap classes go on the same element as that strip's sibling wrapper only when the strip is absent, so the negative margin is applied to the `div` at line 1631 conditionally (`!isProfileComplete(profile) ? "" : "xl:-mt-[32px]"`) and the panel padding follows the same condition.

## Not touched

Hero, Welcome block and gold line, sidebar, profile/bell, status card sizes/content/typography, tabs, search, filters, booking card and its image, gold edge, progress tracker, panel width/radius/material/side padding, data, routing.

## Validation

In the live preview at 1216px wide: measure the panel's top edge vs the cards' bottom edge (expect ~30–35px of overlap), confirm the tabs' distance to the cards is unchanged, confirm the cards paint above the ivory surface, and confirm total document height dropped by ~32px.
