# My Bookings — hero/header fix only

Only the hero image, its height/crop, and the fade into the dashboard background change. Sidebar, KPI card design, filters, booking workspace, typography and functionality stay untouched.

## The crop problem

The source photo is portrait (1024x1536). In a full-width hero, `object-fit: cover` scales it up to ~1580px wide, so only about 18% of the image height is ever visible — no crop position can show the receptionist's head, the desk, the lamp, the vase and the mountain/lake at the same time. Zooming out inside a full-bleed cover layout is mathematically impossible.

So the hero becomes **one cinematic composition** — not two columns — which is what unlocks the requested zoom-out:

```text
+--------------------------------------------------------------+
| navy |<-- 180-300px soft blend -->|   photograph (~70-75%)    |
|                                                               |
|  DASHBOARD              mountain / lake emerging from navy    |
|  My Bookings                 lamp + vase                      |
|  Stay on top of...                receptionist + full desk    |
+--------------------------------------------------------------+
        bottom-only gradient dissolving into #06141F
```

The photograph spans roughly the right 70–75% of the hero width and still dominates it, but at a reduced scale so ~40% of the original frame is visible instead of ~18%: full head with breathing room above it, upper body, most of the desk, lamp, vase, window, mountain and lake — none of these sacrificed for size. Only the far-left 25–30% is deep navy for the headline; the mountain/lake reaches into that zone through a very wide horizontal blend (180–300px depending on viewport) that runs navy → semi-transparent navy → transparent, so there is no vertical seam anywhere.

## Changes

1. **Height** — `clamp(380px, 41vh, 420px)` on desktop, held at the low end for a compact, premium feel; shorter on mobile. Hero, all 4 KPI tiles, filters and the top of the first booking card fit on a normal desktop screen without scrolling.
2. **Image** — real `<img>` inside an `overflow: hidden` container, `object-fit: cover`, `object-position` tuned per breakpoint. Scale is reduced so the vertical composition survives; the receptionist stays fully visible from wide desktop down to tablet, and on mobile the image narrows to the desk/window band.
3. **No darkening of the source image** — every full-image overlay, tint, filter and vignette is removed. Blue-grey mountains, lake detail, warm lamp and desk light, natural skin tone and stone/wood texture all stay intact. Only the left blend and the bottom fade darken edges.
4. **Bottom gradient** — a ~180px bottom-only overlay: transparent → `0.08` 20% → `0.28` 45% → `0.62` 70% → `0.90` 90% → solid `#06141F` at 100%. Starts almost invisibly, no dark band, no hard edge.
5. **Background colour** — the page/dashboard background moves from `#05101A` to exactly `#06141F`, matching the gradient endpoint so there is no visible boundary.
6. **KPI row** — same card design, pulled further into the transition (around `-45px` to `-55px`, fine-tuned visually) so it feels integrated with the hero, while staying clear of the receptionist and desk.
7. **Headline block** — same text and typography, kept in the left navy/blended zone at roughly 64–72px from the content edge, vertically centred around 48–55% of the hero. Never over the desk or receptionist.


## Technical notes

- File touched: `src/routes/manage-bookings.tsx` only (hero container, image element, gradient layers, page background token, KPI row offset).
- The hero image is an absolutely positioned visual layer, not a cover background: `position: absolute; right: <tuned>; top: 50%; transform: translateY(-50%); height: ~280% of the hero; width: auto; max-width: none`. Aspect ratio is preserved, the image may extend past the right edge, and its rendered scale is controlled explicitly. Height and right offset are tuned per breakpoint (smaller scale on tablet/mobile so the receptionist is never cropped).
- Vertical centring at that scale lands the visible band on roughly 40–73% of the source frame: mountain base, lake, window frame, lamp, vase, full head with space above it, face and upper torso, laptop, and a substantial run of the reception desk — all visible at once on desktop, with comfortable breathing room between the receptionist and the right edge.
- Navy space on the left is intentional and is not removed by scaling the image up.
- Hero image asset stays `manage-hero-concierge.png`; no new assets.

