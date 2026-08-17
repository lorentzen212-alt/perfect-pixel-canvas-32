# Redesign the Group Planner panel (dark, simplified)

Only the right-side Group Planner aside changes. The left Group Plan column, journey ribbon, itinerary, page background, navigation, column widths and all booking/plan data logic stay exactly as they are.

## Panel

- Background becomes `#0B1E32`, keeping the current rounded corners, width and `m-4` gutter.
- Palette: secondary surface `#13283C`, champagne gold `#C9A85F`, primary text `#F5F1E9`, muted `#9AA6B2`, borders a low-opacity light slate.
- Only three primary levels: Next group activity, My plans, Available time. Everything else is removed or folded in.

## Header

Gold uppercase "YOUR PERSONAL PLAN", ivory serif "Group Planner", muted subtitle "Plan your free time." — no card around it, generous spacing, then a hairline divider.

## 1. Next group activity

Gold section label, then one `#13283C` card (1px subtle border, 12px radius, compact but generous padding):

- Large time range showing start and end whenever available ("09:00 – 11:00"), falling back to the start time alone.
- Activity title, then a small muted detail line (location / setup).
- Small champagne-gold calendar icon on the right.

Sourced from the next upcoming booking in the current day's stream; a calm muted line replaces the card when nothing is scheduled.

## 2. My plans

Clean rows directly on the panel — no cards. A very thin vertical line with small gold dots, a fixed time column, ivory title, muted sub-line, and the existing three-dot Edit/Delete menu. Optional hairline dividers between rows only.

Unscheduled personal items keep their existing collapsible list, restyled as the same plain rows.

## 3. Add personal plan

One full-width primary button directly under My plans: `#13283C` surface, thin gold border, gold "+" icon, light text, 46–48px tall, 10–12px radius. Opens the existing editor unchanged.

## 4. Available time

Shown only when there is a meaningful gap:

- Trailing open-ended window → "AFTER 15:30" label with one very subtle dark navy card: small moon icon, "Your evening is free", gold "Add something".
- Gap between two group activities → "FREE 11:30 – 13:00", "1h 30m available", gold "Add plan".
- No meaningful gap → nothing is rendered.

Visually secondary to the two sections above.

## Removed

The three statistic cards (Next booking / Free until / My plans), the separate Reminder button, the three quick-action buttons, and the duplicated full-day itinerary stream inside the planner. Reminder and activity types remain selectable inside the plan editor, so no capability is lost.

## Technical notes

- All edits stay inside the `<aside>` and its planner-only helpers in `src/features/booking-workspace/group-plan/GroupPlan.tsx` (`StatusCard`, `TimelineRow`, `PlanMedallion`, `QuickAction`, `Pill`); unused helpers are deleted.
- A small planner-scoped token block is added next to the existing dark tokens; the shared palette used by the left column is untouched.
- Free-time and day-stream computation is reused as-is; the panel just renders less of it — the next booking, the user's own plans, and at most one free-time card.
- Day navigation (prev/next day, "View day") stays, reduced to a quiet row beside the section labels.
- Verified at 1440 / 1217 / 1024 / 768 with screenshots before finishing.
