# Match the Documents folder tabs to the reference image

The user has now confirmed the true reference: the two tabs should look like the uploaded screenshot (image 163). The two changes are:

1. Make the **right edge of the "Your documents" tab** a soft, fixed-width S-curve / angled folder edge, just like the reference — it must not end as a straight vertical line.
2. Reduce the **top-left corner radius of the active "Booking documents" tab** to match the reference: still rounded, but not as large as the current implementation.

Only the `Tab` component in `src/components/BookingDocuments.tsx` changes. Nothing else on the Documents page is touched.

## What differs today

Current implementation: the active tab has a fairly large top-left corner radius, and the right edge of the inactive tab is mostly a straight vertical cut because the 30px ramp is painted on top of the same background rectangle.

Reference image: the active tab has a gentler rounded top-left; the inactive tab has a clear, soft S-curve trailing edge that flares out to the bottom.

## What will be done

- Build the tab shape from two real layers instead of one rectangle plus an overlay, so the S-curve is visible on the right edge of both tabs.
  - Main panel: a flat rectangle from the left edge to `width - 30px` with the rounded top-left corner.
  - Trailing ramp: a fixed 30px layer at the right, clipped to the S-curve, sloping from the flat top down and outward to the bottom.
  - Both layers use the same background colour for the active/inactive/hover states.
- Reduce the active tab's top-left `borderRadius` to match the reference's gentler curve.
- Keep the active tab lifted in front via a drop-shadow filter, keep the bottom edge seamless with the card below, and preserve all existing colours, typography, badge styling, height, hover, click behaviour, and accessibility roles.

## Technical detail

All edits stay inside the `Tab` component in `src/components/BookingDocuments.tsx`. The button element becomes transparent (no own background), and the two background spans are placed absolutely behind the label. The S-curve continues to use `clipPath: path(...)` with fixed-pixel cubic geometry. The active tab's drop-shadow filter is applied to the button so it traces the combined silhouette. No changes to `TabLabel`, the list card, rows, reader pane, or layout.
