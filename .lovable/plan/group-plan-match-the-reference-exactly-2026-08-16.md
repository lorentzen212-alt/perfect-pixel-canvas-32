# Group Plan — match the reference exactly

Goal: the Group Plan tab renders pixel-faithful to the two uploaded reference images (light ivory itinerary panel on the left, cool blue-grey planner panel on the right).

## Step 1 — Establish what you actually see

The current code already declares the light theme (left panel `#FDFBF7`, right panel `#F8F9FB`, ivory plate `#FAF6F0`, white toggle, white MY PLAN pills). A previous pass confirmed by screenshot that it renders light in a clean build. So before restyling anything, I will render the tab in a headless browser at the reference width and screenshot it.

- If it renders light: the deviations are only detail-level, and I fix exactly those (Step 2).
- If it renders dark: that is a genuine override; I trace what paints the surface and fix it at the source, then continue with Step 2.

## Step 2 — Detail pass against the reference

Compare the screenshot side by side with the reference and correct every visible difference, likely candidates being:

- Day column: large gold serif day number, `AUG · FRI` caption weight and spacing, alignment of the gold spine and hollow node rings with each row's title line.
- Rows: time column width, gold outline icon size, navy semibold title over grey subtitle, pill column and `⋯` at a fixed right edge, hairline rule between rows only.
- Pills: equal 104px width, BOOKING solid navy, MY PLAN white with gold border and gold text.
- Header: gold `YOUR BOOKING` eyebrow, 40px serif title, `Display as` label plus white segmented toggle with the gold-tinted active segment.
- Footer: full-width white `+ Add time or activity` button, 62px tall, then the legend row.
- Right panel: `+ Add to plan` (navy) and `Reminder` (white) at 2:1, section headers with gold circular count badges, unscheduled rows with 46px `#E9EDF3` icon tiles, my-plan rows with time/date block plus vertical hairline, gold `View all my plan items →`, and the cream `#FBF3E4` TIP card.
- Panel geometry: 22px radius, 1px `rgba(11,25,44,0.10)` border, ~64/36 split, no dark chrome behind or around them.

## Step 3 — Verify and clean up

Re-screenshot after the fixes to confirm the match, then remove any temporary preview route used for rendering.

## Technical notes

- Styling changes stay in `src/features/booking-workspace/group-plan/GroupPlan.tsx`; only if the dark surface turns out to come from the surrounding chrome would `src/routes/bookings.$bookingId.tsx` be touched.
- No behaviour changes: timeline/calendar toggle, add/edit/delete of plan items, and the request-change flow keep working as they do now.
- Any temporary route added for rendering is unauthenticated, uses mock data only, and is deleted before finishing.
