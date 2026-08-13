# Sloped right edge on the "Your documents" tab

## What's wrong now

The tab button paints its own full-width rectangle background. The 30px curved ramp layer is drawn on top of that same rectangle, so it never shows: the right edge of both tabs — and most visibly the inactive "Your documents" tab — still ends in a straight vertical cut instead of the soft angled folder edge in the reference.

## The fix

Rework the tab background so the shape is real, not painted over:

- The button itself becomes transparent (no background, no border radius). It keeps its height, padding, label, badge, hover, click and accessibility roles.
- Two background layers are drawn behind the label:
  1. A flat panel from the left edge to `width - 30px`, with the rounded top-left corner.
  2. A fixed 30px ramp at the right edge, clipped with the same S-curve as now, sloping from the flat top down and outward to the bottom.
- Both layers use the same colour, so active (card cream), inactive (darker beige) and hover states stay exactly as they are today.

Result: the "Your documents" tab gets the soft angled trailing edge on its right side, matching the reference crop, and the active tab keeps its seamless flow into the card.

## Technical detail

All changes stay in the `Tab` component in `src/components/BookingDocuments.tsx`. The layers are absolutely positioned spans with an explicit background colour (no `inherit`, since the button no longer paints one), placed under the label with `z-index`. The active tab's drop-shadow filter stays on the button so it still traces the combined silhouette. Nothing else on the Documents page is touched.
