# My Bookings — hero/header fix only

Only the hero image, its height/crop, and the fade into the dashboard background change. Sidebar, KPI card design, filters, booking workspace, typography and functionality stay untouched.

## The crop problem

The source photo is portrait (1024x1536). In a full-width hero, `object-fit: cover` scales it up to ~1580px wide, so only about 18% of the image height is ever visible — no crop position can show the receptionist's head, the desk, the lamp, the vase and the mountain/lake at the same time. Zooming out inside a full-bleed cover layout is mathematically impossible.

So the hero becomes a **composed panel** instead of a full-bleed cover image, which is what unlocks the requested zoom-out:

```text
+--------------------------------------------------------------+
|                                    |  photo (right-anchored)  |
|  DASHBOARD                         |  mountain / lake         |
|  My Bookings                       |  lamp + vase             |
|  Stay on top of every group...     |  receptionist + desk     |
|            #06141F canvas  <-- soft horizontal blend -->      |
+--------------------------------------------------------------+
        bottom-only gradient dissolving into #06141F
```

The image occupies roughly the right 55–62% of the hero at a much smaller scale, so ~40% of the original frame is visible instead of ~18%: full head with breathing room above it, upper body, most of the desk, lamp, vase, window, mountain and lake. The left side is the exact dashboard colour, so the photo reads as part of the page rather than a rectangle on top of it, and the headline sits on clean navy on the left — never over the desk.

## Changes

1. **Height** — `clamp(380px, 43vh, 460px)` on desktop, shorter on mobile. Hero, all 4 KPI tiles, filters and the top of the first booking card fit on a normal desktop screen without scrolling.
2. **Image** — real `<img>` inside an `overflow: hidden` container, `object-fit: cover`, `object-position` tuned per breakpoint. Width is capped so the vertical composition survives; the receptionist stays fully visible from wide desktop down to tablet, and on mobile the image narrows to the desk/window band.
3. **No global darkening** — every full-image overlay, tint, filter and vignette is removed. Original brightness and colour are preserved. Only a soft horizontal blend on the image's left edge merges it into the navy canvas, at most the strength you specified.
4. **Bottom gradient** — a 150px bottom-only overlay: transparent → `rgba(6,20,31,0.15)` 25% → `0.50` 55% → `0.82` 78% → solid `#06141F` at 100%. No hard horizontal edge anywhere.
5. **Background colour** — the page/dashboard background moves from `#05101A` to exactly `#06141F`, matching the gradient endpoint so there is no visible boundary.
6. **KPI row** — same card design, pulled up so it floats in the faded transition zone (around `-35px`, fine-tuned visually), clear of the receptionist and desk.
7. **Headline block** — same text and size, nudged up to sit comfortably on the left navy/lake area after the height reduction.

## Technical notes

- File touched: `src/routes/manage-bookings.tsx` only (hero container, image element, gradient layers, page background token, KPI row offset).
- Responsive `object-position` handled with breakpoint classes rather than one fixed value.
- Hero image asset stays `manage-hero-concierge.png`; no new assets.
