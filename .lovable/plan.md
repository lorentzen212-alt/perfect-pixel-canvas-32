# Booking Extras card + taller summary strip

## 1. Replace "Need help?" with "Booking Extras"
- Remove the `NeedHelp` card from the right column of the Overview and add a `BookingExtras` card in the exact same slot, same width and card material.
- Header row: gold uppercase eyebrow "BOOKING EXTRAS" on the left, compact gold status pill "2 INCLUDED" on the right.
- Body: 3 equal horizontal items, each with a beige medallion icon, name, and status line:
  - Breakfast / "Included" (green)
  - Dinner / "Not added" (grey)
  - Coach parking / "Confirmed" (green)
- Hairline divider, then a centred gold link "View booking extras →".
- Icons: coffee cup, cutlery, bus (lucide `Coffee`, `Utensils`, `Bus`).

## 2. Summary strip 40px taller
- Add 20px top and 20px bottom padding to the strip cells only. No change to content, icons, typography, colors, or horizontal distribution.

## 3. Remove empty space below the strip
- Drop the folder's tall bottom padding to ~12–16px so the light grey workspace ends just under the strip, and stop forcing the plate to stretch to the viewport bottom so no empty grey area remains.

## Technical notes
- All card work in `src/features/booking-workspace/overview/Overview.tsx` (new `BookingExtras` component replacing `NeedHelp`, padding change in `SummaryStrip`, `pb-10` → `pb-3.5` in `OverviewFolder`).
- Height behaviour: remove `h-full` stretching on `Plate` / `OverviewFolder` in `primitives.tsx` + `Overview.tsx` so the plate is content-sized.
- Extras values are static presentation content for now; wiring to real data is not part of this change.
- No changes to card widths, fonts, colors, other cards, tabs, or navigation.
