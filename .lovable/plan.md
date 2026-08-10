# Rebuild the Booking Overview as a physical folder

Match the reference layout and information architecture, but with real material depth. The current flat treatment is discarded, not preserved. Physical hierarchy must read even with all text removed: dark hero → thick grey folder → raised ivory cards → one inset business card.

## Material depth (primary goal)

### The folder — a rigid object
- 5-7px of visible material thickness on the side and bottom faces, darker than the top surface.
- Light rim highlight along the top edge, darker line where the top surface meets the side face.
- Rounded physical corners (top and bottom radii differ slightly so the edge reads as a real bevel).
- Tight, short contact shadow directly beneath the object, plus a wider soft ambient shadow — no generic drop shadow halo.
- The active Overview tab shares the folder's top-surface colour and rim so it reads as part of the same moulded object.

### Raised ivory cards (Current Action, What Happens Next, Need Help, Summary Strip)
- Sit 2-3px above the folder surface: a thin lighter top rim, a faint darker bottom edge, and a tight contact shadow with a soft secondary shadow.
- Refined visible edge thickness — premium mounted stationery, not flat divs, and not neumorphic puffiness.

### Booking Details — the one inset element
- Seated inside a precisely cut recess: a 5-7px groove visible on all sides, slightly darker than the folder surface.
- Groove carries an inner shadow at the top and a light catch at the bottom, so the card reads as sitting below the folder plane.
- The ivory card itself stays flat and slightly recessed, like a business card slotted into die-cut board.

## Layout and content

### Folder plate
- Neutral grey top surface (no blue cast), generous inner padding so cards float clearly.


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
