# Cancel booking — investigation & fix plan

## Root cause

"Cancel booking" is not an action at all — it is a plain navigation link. In the card's
row menu, every menu entry (including Cancel) is rendered as a `<Link>` to the booking
detail route, so clicking it only navigates. Nothing is written to the database, no
confirmation is shown, and no error appears because no request is ever made.

- File/function: `src/routes/manage-bookings.tsx` → `RowMenu` (menu items list around
  line 322-371). Item: `{ label: "Cancel booking", to: "/bookings/$bookingId" }`.
- No cancellation function exists anywhere: there is no `cancelBooking` in
  `src/lib/bookingsApi.ts` or elsewhere. The only "cancel" logic in the app is for
  rooming-list room allocations (`src/routes/rooming-list.$bookingId.tsx`), which is
  unrelated.
- Not an RLS problem: owners already have full write access to their own bookings
  ("Users manage own bookings"), so an update would succeed once implemented.

## Database facts

- Table: `bookings`
- Status field: `status` (free text, default `request_submitted`, no check constraint)
- Extra field already present and unused: `cancelled_at` (timestamptz, nullable)
- Required status value: `cancelled` (lowercase) — this is exactly what the dashboard
  already expects: `groupOf()` maps `status === "cancelled"` to the Cancelled group, the
  timeline renders "Booking cancelled — history preserved", the filter dropdown has a
  Cancelled option, and the group counter has a `cancelled` bucket.
- Note: `BookingStatus` in `src/lib/bookings.ts` does not yet include `"cancelled"`;
  the dashboard works around this with `booking.status as string` casts.

## Intended behaviour elsewhere

The UI is already built for cancelled bookings — it just never receives one:
- Cancelled bookings stay in the list, shown with a red "Cancelled" group tone.
- The timeline is replaced by "Booking cancelled — history preserved".
- Counting per group already excludes them from Confirmed/Awaiting/etc. because
  `groupOf()` returns `cancelled` first.
- Filtering by "Cancelled" in the status dropdown reveals them.

## Recommended implementation

1. Add `"cancelled"` to the `BookingStatus` union and to `STATUS_META` (label
   "Cancelled", muted tone) in `src/lib/bookings.ts`, removing the `as string` casts.
2. Add `cancelBooking(bookingId)` to `src/lib/bookingsApi.ts`: update `bookings`
   set `status = 'cancelled'`, `cancelled_at = now()`, `status_note = 'Cancelled by
   customer'` for that id; throw on error. Records, rooms, guests, rooming list and
   documents are untouched — history preserved.
3. In `RowMenu`, split the menu items into links plus one button for Cancel. Clicking
   it opens a small confirmation dialog (booking name + reference, "Keep booking" /
   "Cancel booking"). On confirm: call `cancelBooking`, show a toast, and refresh the
   dashboard data so the card immediately switches to the cancelled treatment.
4. Hide/disable Cancel for bookings already cancelled or completed.
5. Suppress the primary action button (e.g. "Complete Rooming List") on cancelled
   cards and keep only "View booking".
6. Exclude cancelled bookings from the active/upcoming stat tiles at the top, while
   keeping them visible under the Cancelled filter.

No database migration is required — the status column is free text and `cancelled_at`
already exists.
