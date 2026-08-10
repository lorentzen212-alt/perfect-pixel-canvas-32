# Match the Booking Overview folder to the reference

Rebuild the presentation of the Overview folder so it reads exactly like the reference image: a light grey folder plate carrying three white information cards, with generous, calm spacing.

## What changes

### Folder plate
- Lighter, near-neutral grey surface with a soft outer edge and no visible blue tint.
- Larger inner padding and rounded corners so cards float clearly on the plate.
- Active tab keeps merging into the plate top (unchanged behaviour).

### Current action band
- Circular medallion becomes a soft beige/sand filled disc with a subtle icon (guests/people), no gold ring.
- Serif headline "Add rooming list" stays; the line beneath becomes a plain descriptive sentence ("Add guest names and room assignments so the hotel can prepare for your stay.") instead of the counter/percentage/deadline line.
- CTA becomes a solid amber rectangle with 6px corners and light text, right-aligned and vertically centred, replacing the pill gradient.

### What happens next (left card, ~54% width)
- Each step gets a numbered circle: completed = filled green with a check, current = filled gold with its number, upcoming = outlined with a grey number.
- Two-line step content: bold title plus a grey supporting line underneath.
- Right column shows the date or due label; the current step's label is gold.
- Vertical connector runs between circles through the full list.
- "View full timeline →" sits at the bottom-left with clear breathing room.

### Booking details (right card, ~46% width)
- Removed from the recessed slot; becomes a plain white card matching the left one in height.
- Rows get a leading outline icon (hotel, contact, email, phone, reference, payment), a sentence-case grey label, and a dark value on the right side of the row.
- Hotel row supports a gold star rating; contact row supports a secondary line (role).
- "Show more details ↓" centred in gold at the card foot.

### Need help card (new)
- Small white card under Booking details: "NEED HELP?" eyebrow, one-line question, and a full-width gold-outlined "Message HotelGroupBook →" button.

### Summary strip
- Four cells, each with a beige circular icon medallion, a large serif value, a small grey label, and a gold "View details →" link beneath.
- Hairline dividers between cells; taller cells matching the reference proportions.

### Kept as-is
- The "More booking information" section below the strip (rooming list progress, documents, activity, notes, deadlines) stays, since it sits outside the reference crop.
- All existing links, data sources and actions keep working; only presentation changes.

## Technical notes
- `src/features/booking-workspace/overview/materials.ts`: retune plate/edge/ivory tokens to the lighter neutral palette, add sand medallion and amber button tokens.
- `src/features/booking-workspace/overview/primitives.tsx`: soften `Plate`, adjust `Card`, add `Medallion` and `SolidButton`; `Slot` no longer used by details.
- `src/features/booking-workspace/overview/Overview.tsx`: rework `CurrentAction`, `NextSteps` (numbered two-line steps), `DetailsCard` (icon rows + rating + secondary line), new `NeedHelp`, and `SummaryStrip` (medallion + serif value + link).
- `src/routes/bookings.$bookingId.tsx`: extend the data passed in — step sub-labels and dates, detail rows with icon/label/value/secondary, and per-cell summary actions — using existing ledger/journey data.
- Verify against the reference with a Playwright capture at 1280px and a mobile width.
