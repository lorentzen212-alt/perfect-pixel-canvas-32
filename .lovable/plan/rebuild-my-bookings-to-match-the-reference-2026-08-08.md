# Rebuild "My Bookings" to match the reference

Align the My Bookings page and the left sidebar with the uploaded reference image and spec. Nothing else in the app changes — Rooming List, Documents, Messages, Booking Workspace, auth and data loading stay exactly as they are.

## What differs today (checked against the live page)

- The sidebar renders a bright blue glow instead of the deep navy panel, and **Dashboard** is highlighted as active instead of **My Bookings**.
- The booking list opens in the stacked/grid layout, so cards are narrow, titles truncate ("Bergen G…") and the timeline is cramped. The reference shows one wide horizontal card per row.
- The toolbar is missing the **Country** filter shown in the reference.
- Card typography and spacing are tighter than the reference (title, meta chips, reference panel, footer).

## What changes for you

1. **Sidebar** — deep navy with the warm glow only in the lower-right corner, gold left marker on the active item, and **My Bookings** active on this page. Same items and order, same collapse behaviour, same logo.
2. **Hero header** — unchanged: "My Bookings" serif headline, subtext, notification bell, avatar with name/role.
3. **Stat tiles** — Awaiting response / Proposal ready / Confirmed / Total bookings, with the gold-outlined "action" tile when proposals are ready. Keeps live counts.
4. **Tabs + toolbar** — Active / Cancelled / All Bookings pills, search field, then Status, **Country** (new), Arrival dropdowns, grid/list toggle and reset-filters button, all as ivory-and-gold pills on the stone panel.
5. **Booking cards** — default to the wide row layout from the reference: image well on the left inside the gold metallic insert, category tag + status on top, full untruncated title, meta chips, two-column reference panel, progress timeline, status note and the gold "View status" button. Grid view stays available via the toggle.
6. Right-hand column (Recent activity, Upcoming deadlines) and the cancel-booking flow stay as they are.

## Technical details

- Only `src/routes/manage-bookings.tsx`, `src/components/GlobalSidebar.tsx` and additive rules in `src/styles.css` are touched.
- Keep the project's existing data path: TanStack Router `Link`, `fetchBookings` / `cancelBooking` from `src/lib/bookingsApi.ts`, live counts and filters. No sample data, no new routes.
- Reuse the token values from the spec verbatim (`--hgb-*` variables, `.hgb-card-recess`, `.hgb-stone-surface`, `.hgb-gold-sheen`, `.hgb-champagne-metal`, rail transitions); add `.hgb-stone-surface` if absent rather than re-styling existing classes.
- Sidebar background switches to the spec's layered radial/linear gradient stack; `active` is passed as `"My Bookings"` from this route.
- Default list `view` state becomes `"list"`; card internals get the spec's sizing (image well ~230px, serif title, 8px reference panel, gold-bordered View status button).
- Country filter derives its options from the destinations present in the loaded bookings.
- Fonts: Cormorant Garamond for headings, Inter for body — already loaded in the root route, no new font links.

No database, RLS or routing changes.
