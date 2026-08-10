# Booking Extras card + tighter Overview vertical rhythm

## 1. Replace "Need help?" with "Booking Extras"
Same slot, same width, same ivory card material as the rest of the Overview. Compact.

- Header row: "BOOKING EXTRAS" uppercase eyebrow (existing section-label accent) left, small "2 INCLUDED" pill top-right.
- Three horizontally distributed items with thin vertical separators between them:
  - Breakfast — "Included" (existing refined green)
  - Dinner — "Not added" (muted grey)
  - Coach parking — "Confirmed" (existing refined green)
- Each item: soft ivory/off-white rounded icon tile with muted champagne-bronze icon stroke (coffee cup, cutlery, bus), item name below in dark navy, status line under the name.
- Thin hairline divider, then centred "View booking extras →" link in the existing warm secondary-link accent.

## 2. Summary strip +40px
Add 20px top and 20px bottom padding to the strip cells only. Icons, typography, and the four-column distribution stay exactly as they are.

## 3. No dead space below the strip
The folder ends roughly 12–16px below the summary strip instead of stretching to the viewport bottom.

## 4. Column alignment
The left "What happens next" card keeps stretching so its bottom edge lines up with the bottom of Booking Extras on the right, before the summary strip begins.

## Color lock
Nothing outside the new card changes colour. Inside the card: ivory + dark navy + muted grey, with champagne only as a small accent — no gold body text, no gold item backgrounds, no bright yellow.

## Technical notes
- `src/features/booking-workspace/overview/Overview.tsx`: new `BookingExtras` component replacing `NeedHelp`, driven by a typed `extras` prop (item label, status text, status tone, icon) with demo values passed from `src/routes/bookings.$bookingId.tsx`, so real booking data can be swapped in later without a visual change.
- Summary strip padding change inside `SummaryStrip`; folder bottom padding `pb-10` → ~`pb-3.5` in `OverviewFolder`.
- Remove the `h-full` stretch on `Plate` (`primitives.tsx`) and the folder wrapper so the plate is content-sized; keep the two-column `items-stretch` grid so the left card still matches the right column height.
- No changes to Current Action, What happens next content, Booking Details, sidebar, tabs, or typography.
