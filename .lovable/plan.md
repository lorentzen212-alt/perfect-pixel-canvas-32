# Replace the My Bookings hero image

Swap the portrait concierge photo for the new wide landscape reception image, position it naturally, and tune only the hero transition. Nothing else on the page changes.

## What changes

1. **New hero image** — the uploaded wide image is registered as a CDN asset and becomes the single hero image. The old portrait asset import is removed from this page; no layering, no split, no blurred duplicate.
2. **Natural framing** — `object-cover` at `center center` on desktop, no scale transform. Slight responsive shifts only: mobile/tablet nudge toward the left–center so mountain, lake and the receptionist all stay readable.
3. **Hero heights unchanged** — 300 / 350 / 390px.
4. **Headline block moves up ~40px on desktop** as one unit (lg top margin ~205px → ~165px); mobile/sm keep their current spacing.
5. **KPI row moves up ~45px** as one unit (top margin 46px → 0/negative offset so the cards overlap the lower hero). Card size, gaps, colors and content untouched.
6. **Bottom fade** — 125px gradient into `#06141F`, using the exact stop values from your spec so the fade is imperceptible and only turns solid at the very bottom; the receptionist's head, face and upper body stay clear while the desk base melts into the background.
7. **Optional left readability veil** — a narrow left-to-transparent gradient (max 0.28 alpha, gone by 55% width) behind the headline only. No full-hero overlay, no filters, no tint, no vignette — the image keeps its original colors.
8. **Layer order** — image → bottom gradient → headline → profile controls → KPI cards, so nothing above the gradient gets dimmed.

## Technical notes

- Asset created with `lovable-assets create` from the upload, imported as `manage-hero-reception-wide.png.asset.json` in `src/routes/manage-bookings.tsx`.
- Only three regions of `src/routes/manage-bookings.tsx` are edited: the hero `<div>` (~lines 1179–1196), the `<header>` margin (~line 1220), and the stat-tile `<section>` margin (~line 1295).
- Page background stays `#06141F` at the hero transition.
- Verified visually at desktop width after the change.
