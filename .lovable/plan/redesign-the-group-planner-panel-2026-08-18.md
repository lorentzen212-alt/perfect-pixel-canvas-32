# Redesign the Group Planner panel

Only the right-side Group Planner aside changes. The left Group Plan column, the journey ribbon, the itinerary timeline, page background, navigation, booking data and all saving/editing/deleting logic stay exactly as they are.

## The panel becomes a warm cream companion

The dark Group Plan on the left is "the group"; the cream planner on the right is "you".

- Surface `#F7F4EE`, subtle inner surface `#FBF9F5`, radius 20px, 24–28px horizontal padding, generous vertical rhythm. Current width and `m-4` gutter are kept.
- Text: primary `#0B1E32`, secondary `#6F7780`, gold `#C9A85F`, borders `#E5DED3`. No pure white, no gradients, no glassmorphism, no heavy shadows.
- Content stays compact at the top of the panel — no stretching to fill height.

## Structure, top to bottom

1. **Header (no card)** — gold uppercase eyebrow "YOUR PERSONAL PLAN", serif "Group Planner", muted "Plan your free time.", then a thin `#E5DED3` divider. A small "SAT 22 AUG" date indicator with tiny chevrons for previous/next day sits quietly next to the header — no navigation bar, no prominent "View day".
2. **NEXT GROUP ACTIVITY** — gold section label plus one card (`#FCFAF7`, 1px `#E5DED3`, radius 12–14, very subtle shadow): start–end time as the strongest element, activity title, muted location/setup line, small outline calendar icon on the right. End time is derived from the existing assumed-duration table already used for free-time logic, and the range collapses to a single start time when no duration applies.
3. **Optional free-time line** — one small clock line ("1h 30m free before this") only when a meaningful gap exists before the next activity; otherwise hidden entirely.
4. **MY PLANS** — personal plans only, as rows on the panel, never cards: 48px time column, thin vertical hairline with 8px gold dots, title, muted location, three-dot menu keeping today's Edit/Delete. Group bookings are not repeated here.
5. **Add personal plan** — one full-width 46–48px navy `#0B1E32` button, white label, gold plus icon, radius 10–12, opening the existing editor. The separate Reminder button and the three quick-action buttons are removed; those types remain selectable inside the editor.
6. **AVAILABLE TIME** — a single most-relevant window only: label "AVAILABLE AFTER 15:30" or "AVAILABLE 11:30 – 13:00", then one minimal light card with a moon/clock icon, a short line ("Your evening is free" / "1h 30m free") and a gold "Add something" link that pre-fills the editor with that start time. Hidden when there is no meaningful window.
7. **UNSCHEDULED** — compact collapsible row at the very bottom ("UNSCHEDULED 2 ˅"), expanding to the existing circle-toggle rows with their menus.

## Spacing

Header → next activity 28–32px, next activity → My plans 28–32px, between plans 16–20px, My plans → button 20–24px, button → available time 28px, available time → unscheduled 28–32px.

## Technical notes

- All edits stay inside the `<aside>` in `src/features/booking-workspace/group-plan/GroupPlan.tsx` and the helpers used only by it (`StatusCard`, `TimelineRow`, `QuickAction`, `PlanMedallion` planner usages, `PlannerSection`, `Pill`). Helpers no longer used by the planner are removed only if the left column does not use them.
- A light-surface token block is added next to the existing dark tokens so the planner can use cream values without touching the shared dark palette.
- `buildDayStream`, `ASSUMED_MIN`, `BUFFER_MIN`, `MIN_FREE_MIN`, `DAY_END_MIN`, seeding, `save`/`remove`/`openEditor` are reused unchanged; the panel just selects the next booking and the single most relevant free window from the existing stream.
- The plan editor popover is restyled for the light surface; its fields and logic are unchanged.
- Verified at 1512 / 1280 / 1024 / 768 with screenshots before finishing.
