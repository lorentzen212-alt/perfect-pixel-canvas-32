# Redesign the Group Planner panel

Only the right-side Group Planner aside changes. The left Group Plan column, journey ribbon, itinerary timeline, page background, navigation and column widths stay exactly as they are.

## The panel becomes a light cream card

- Background `#F6F2EC`, radius 20px, 28px top/bottom and 24px left/right padding. Keeps its current `m-4` gutter and ~36% width.
- Text primary `#0B1624`, muted `#767168`, gold accent `#C9A85F`, hairlines `#E7E1D7`.
- Header: small uppercase gold "YOUR PERSONAL PLAN" (12px, 1.5px tracking), serif "Group Planner" (28px), subtitle "Plan your free time." (15px, muted), then a 1px `#E7E1D7` divider with 18px margins.

## Sections

1. **NEXT GROUP ACTIVITY** — gold section label, then one white card (`#FFFFFF`, 1px `#E7E1D7`, radius 12, 18px padding): time range 22px/700, title "Meeting — Fjord Hall" 16px/600, location line 13px muted, and a 36px `#F1ECE4` circle with an outline calendar icon on the right. Populated from the next booking in the current day's stream (falls back to a calm "Nothing scheduled" state).
2. **MY PLANS** — vertical 1px `#E7E1D7` line with 8px gold dots. Each row: 48px time column (14px/600), title 15px/600, subtitle 13px muted, three-dot menu on the right keeping today's Edit/Delete actions. 1px `#EFE9E0` divider between rows.
3. **Add personal plan** — full-width 48px navy button (`#0B1624`, white text, gold "+" icon, radius 12) opening the existing plan editor.
4. **AFTER <time>** — free-time card (white, 1px `#E7E1D7`, radius 12): 36px `#F1ECE4` circle with moon icon, "Your evening is free" 15px/600, and a gold "+ Add something" link that opens the editor pre-filled with that start time. The label and copy come from the computed free-time window, so open-ended and mid-day cases still read correctly.
5. **Footer note** — clock icon plus "All times are local time at the destination." in muted grey.

## Existing behaviour that is kept

- Day navigation (previous/next day, "View day") moves into the header row beside the divider, restyled for the light surface.
- Unscheduled items keep their collapsible section, placed under "My plans" in the same light styling.
- The three quick-action buttons and the separate "Reminder" button are folded into the single "Add personal plan" button plus the editor's own type selector, matching the reference. The reminder type stays available inside the editor.
- Free-time computation, the day stream, seeding, saving, editing and deleting are untouched.

## Technical notes

- All edits stay in the `<aside>` and its planner-only helpers in `src/features/booking-workspace/group-plan/GroupPlan.tsx` (`StatusCard`, `TimelineRow`, `PlanMedallion`, `QuickAction`, `PlannerSection`, `Pill`, `Menu` usage inside the aside).
- A small light-surface token block is added next to the existing dark tokens so the planner can use cream values without touching the shared dark palette used by the left column.
- The plan editor popover is restyled to sit on the light panel; its fields and logic stay as they are.
- Verified at 1440 / 1217 / 1024 / 768 with screenshots before finishing.
