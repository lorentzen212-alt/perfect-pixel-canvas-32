# Booking Overview — match the reference exactly

Goal: make the Overview tab of a booking (My Bookings → booking workspace) look 100% like the uploaded reference. Data, routes and all other tabs stay untouched.

## What changes

### 1. Hero header
- Top-left: gold "← Back to My Bookings" link replaces the current breadcrumb line.
- Title stays large serif; under it a single meta row with icons: destination, stay dates, rooms, guests, and "Ref HGB-…" (replaces the "Manage every detail…" subtitle).
- Green rectangular CONFIRMED status badge under the meta row.
- Top-right: "Download summary" button (outlined, download icon), bell with unread dot, avatar + user name.
- Slightly darker, higher-contrast image overlay so the white title reads as in the reference.

### 2. Tabs
- Active Overview tab is a light tab attached to the folder below (no gap, same surface), other tabs stay dark navy with light labels.
- Tab row sits on the hero image with the active tab merging into the plate.

### 3. Folder plate
- Rounded top corners, plate begins at the sidebar edge and runs to the right edge.
- Same physical thickness treatment already implemented, tuned to the reference's softer, flatter look.

### 4. Cards inside the folder
- Warm grey-ivory card surface, flat with only a soft shadow, ~10px radius, matching the reference tone rather than bright white.
- Current Action band: circular beige medallion, small caps eyebrow, serif headline, description, amber "Create rooming list" button on the right.

### 5. What happens next (left column)
- Continuous vertical connector line through all steps.
- Step 1 green filled circle with check; current step gold filled circle with its number; later steps outlined circles with numbers.
- Each row: bold title + grey sub-line on the left, date or gold "Due …" on the right, with an optional second right-hand line (e.g. "(14 days before arrival)").
- Column height driven by content — no large empty area above "View full timeline".

### 6. Booking details (right column)
- Rows: Hotel (with 5 gold stars next to the hotel name), Contact (name + role), Email, Phone, Hotel reference, Payment terms.
- Thin hairline dividers, icon column on the left, centred gold "Show more details ↓".
- Sits in its recessed slot as today.

### 7. Need help card
- Compact card under the details: eyebrow, one line of copy, full-width gold-outlined "Message HotelGroupBook →" button.

### 8. Summary strip
- One strip with 4 cells divided by hairlines: 63 Guests, 32 Rooms, 14 – 18 Sep 2026 Stay dates, 3 Documents uploaded.
- Beige medallion icon, large serif value, grey label, gold "View details →".

## Technical notes
- Header work in `src/components/BookingWorkspaceHeader.tsx` (new meta row, status badge, download action) with the extra data passed from `src/routes/bookings.$bookingId.tsx`.
- Overview composition and card internals in `src/features/booking-workspace/overview/Overview.tsx`; surface tones, shadows and radii in `materials.ts`; timeline connector, medallions and buttons in `primitives.tsx`.
- Phone number and hotel star rating are added as optional fields on the existing detail-row data; missing values fall back to the current placeholders.
- Verified at 1440 / 1024 / 768 / 390 with screenshots before finishing.
