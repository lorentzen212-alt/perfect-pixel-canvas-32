# Folder tabs on the Documents page — match reference exactly

Only the two tabs ("Booking documents" / "Your documents") on the Documents page change. Nothing else on the page is touched.

## What differs today vs. the reference

Current (image 1): the tabs are near-rectangular. The active tab has an almost square top-left corner and a short straight ramp on the right, so the two tabs read as flat beige blocks in a strip.

Reference (image 2): each tab is a true folder tab — a generous rounded top-left corner, a flat top across the label and count badge, and a soft S-curved trailing edge that flares outward and flows down into the card. The active tab sits clearly in front, in the light card colour, fused seamlessly into the card below with a soft shadow lifting it off the strip; the inactive tab tucks behind it in a slightly darker beige with the same silhouette.

## What will be done

- Increase the top-left corner radius on both tabs to the softer reference curve.
- Replace the straight right ramp with a fixed-pixel S-curve (concave at the top, convex at the bottom) so the trailing edge flares out into the strip, identical on both tabs regardless of their width.
- Keep the flat-top area wide enough that the label and count badge are never clipped; keep the extra right padding, and the extra left padding on the tucked-behind tab.
- Add a soft shadow on the active tab's outer silhouette so it visibly sits in front of the inactive one, while its bottom edge stays seamless with the card (no seam line).
- Keep the darker beige strip behind the tabs and the existing colours, typography, badge styling, height, hover behaviour, click behaviour, and accessibility roles unchanged.

## Technical detail

All edits stay inside the `Tab` component in `src/components/BookingDocuments.tsx`. The trailing edge continues to be an absolutely positioned fixed-width layer clipped with `clipPath: path(...)` in user-space pixels; the path changes from a single quadratic to a cubic S-curve, and the same path is reused for the shadow silhouette. No changes to `TabLabel`, the list card, rows, reader pane, or layout.
