# Cancel booking — make it a real action

Turn the "Cancel booking" menu item into a working cancellation, with a confirmation step, instant dashboard refresh, and no visual redesign.

## What changes for you

- Clicking "Cancel booking" opens a small confirmation dialog instead of jumping to another page.
- Confirming marks that booking as Cancelled in the database and keeps you on My Bookings, with a "Booking cancelled" message.
- The card immediately switches to the existing Cancelled treatment; its timeline is replaced with "Booking cancelled — history preserved".
- Cancelled cards keep View booking and documents/history, and drop active actions (Complete Rooming List, Request change, Edit booking).
- "Cancel booking" no longer appears for completed or already-cancelled bookings.
- Cancelled bookings stay reachable through the existing Cancelled filter and are excluded from active/awaiting/proposal/confirmed counts.
- All rooms, guests, rooming lists, documents and history are preserved — nothing is deleted.

## Technical details

1. `src/lib/bookings.ts`
   - Add `"cancelled"` to the `BookingStatus` union and a `STATUS_META.cancelled` entry (`label: "Cancelled"`, existing muted tone).
   - Remove status string casts that only existed because `"cancelled"` was missing from the type.

2. `src/lib/bookingsApi.ts`
   - Add `cancelBooking(bookingId: string)`: `update` on `bookings` setting `status: "cancelled"`, `cancelled_at: new Date().toISOString()`, `status_note: "Cancelled by customer"`, filtered by `id`. RLS already scopes the update to the owner. Throws on error. No deletes, no other tables touched.

3. `src/routes/manage-bookings.tsx`
   - `RowMenu`: drop the `Cancel booking` `Link` entry; render it as a button that opens a confirm dialog, and omit it entirely when status is `completed` or `cancelled`.
   - Dialog: title "Cancel booking?", booking name + reference, copy "This booking will be moved to Cancelled Bookings. Its history and documents will be preserved.", buttons "Keep booking" / "Cancel booking". Confirm button disabled while pending to block duplicate submits.
   - On success: close dialog, `queryClient.invalidateQueries` for the bookings query, toast "Booking cancelled". No navigation.
   - Cancelled cards: timeline replaced by "Booking cancelled — history preserved"; `primaryAction` suppressed for cancelled bookings.
   - Mount `<Toaster />` from `@/components/ui/sonner` once in `src/routes/__root.tsx` so the toast renders.

No migration, no RLS changes, no styling changes.
