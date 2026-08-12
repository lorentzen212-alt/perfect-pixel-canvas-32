# Changes tab — light workspace redesign

Rebuild only the content area below the workspace tab row when "Changes" is active. Sidebar, hero banner, top bar and the main tab row stay untouched.

## What it will look like

A warm ivory workspace (#FAF7F5) that fills the folder plate, matching the reference:

- **Sub-tab row** across the top: "Rooms & dates" (active, gold underline), "Add-ons & services", "Other request", each with a small icon; "View change history" with a clock icon aligned far right.
- **Left column** — the change form:
  - "APPLY CHANGES TO": two radio options, "Original stay" (selected, bronze ring/dot) and "Specific dates", plus an optional date input (dd.mm.yyyy) with a calendar icon.
  - "ROOM CHANGES": clean table with header columns CURRENT / REQUESTED / CHANGE. Rows: Twin rooms (2 single beds), Double rooms (1 double bed), Single rooms (1 single bed), Triple rooms (3 single beds), Family / Accessible (Accessible rooms). Each row has a bronze bed/person icon, the current count, a minus/number/plus counter, and a pill badge — green for positive, soft red for negative, neutral grey for 0.
  - Two large summary stat cards under the table: Rooms `18 → 19` and Guests `63 → 64`, each with a round bronze-tinted icon chip and a green delta pill.
  - "OTHER CHANGES (OPTIONAL)": bordered textarea, placeholder "Add a note for the hotel…", with a 0/1000 counter bottom-right.
- **Right column** — white rounded "CHANGE SUMMARY" card:
  - Icon + label + value rows separated by hairlines: Stay dates, Rooms, Guests, Reference, Payment terms.
  - Cream info box: "We'll review your request and respond as soon as possible."
  - Solid gold/bronze full-width button "Submit change request →", with a lock icon line "Your request is sent securely" under it.
  - Footer: "Need help with your changes? Message HotelGroupBook →".

Responsive: the two columns stack under ~1100px; the room table collapses gracefully (counter and badge wrap under the room name on narrow screens).

## Technical notes

- New file `src/features/booking-workspace/changes/ChangesFolder.tsx` holding the whole light workspace, plus small local primitives (SubTab, RoomRow, Counter, DeltaBadge, StatCard, SummaryRow). The old dark `ChangesView` in `src/routes/bookings.$bookingId.tsx` is removed along with its now-unused constants (`STATUS_TONE`, `QUICK_ACTIONS`, `RECENT_REQUESTS`, tracker markup).
- Wrapped in the existing `<Plate tone="warm">` / folder primitives from `src/features/booking-workspace/overview/primitives.tsx` so it connects seamlessly with the active tab, with an inner ivory (#FAF7F5) surface.
- Room data: `BASE_ROOMS` in the route is extended to the five reference types (Twin 17, Double 8, Single 6, Triple 1, Family/Accessible 0) with per-room capacity so Rooms/Guests totals compute to the shown numbers. Existing wiring stays intact: `rooms`, `onRoomsChange`, and `markDirty("rooms")` continue to drive state, so edits still mark the booking dirty and save as before.
- Summary values (stay dates, reference, payment terms) come from the booking already loaded in the route and are passed in as props rather than hardcoded.
- Sub-tabs "Add-ons & services" and "Other request" render as selectable tabs; the two non-room panels get simple placeholder content in this pass unless you want them built out too.
- "View change history", "Submit change request" and "Message HotelGroupBook" reuse the current handlers (history panel / submit / switch to Messages tab).
