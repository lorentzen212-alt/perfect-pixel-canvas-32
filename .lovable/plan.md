# Fix the homepage hero video flash

Technical rendering fix only. No design, layout, typography, overlay or crop changes.

## Root cause (verified)

In `src/routes/index.tsx` the hero `<video>` (lines 110-122) has
`poster={homeHeroAsset.url}` — that is the old still `homepage-hero-bg.png`.
The browser paints the poster instantly (it is a large 1.1 MB PNG), then swaps
to the video once decoding starts. That swap is the visible flash, and it is
also why an "old hero image" appears underneath. The section height itself is
already fixed (`h-screen` / `lg:h-[calc(100vh-300px)]`, `overflow-hidden`), so
no layout shift comes from the container — but the poster's own paint plus the
video's first frame can read as a momentary stretch.

## The fix

In `src/routes/index.tsx`, hero section only:

1. Remove `poster={homeHeroAsset.url}` from the hero video, and drop the now
   unused `homeHeroAsset` import. No other use of that asset on this page.
2. Give the hero section an explicit dark base colour matching the video's
   darkest treatment (`#0A0B0D`, already the `main` background) so the space
   behind the video is navy/near-black from the first paint — never an image.
3. Keep `position: relative` + `overflow: hidden` on the section and
   `absolute inset-0 h-full w-full object-cover` on the video (already the
   case), so the video can never show intrinsic dimensions.
4. Add a ready-state reveal: video starts at `opacity: 0`, flips to `1` on the
   `loadeddata`/`canplay` event, with a `200ms ease` opacity transition. Local
   component state in the hero; no restructuring of the route.
5. Keep `autoPlay muted loop playsInline` and `preload="auto"` — above-the-fold,
   not lazy loaded.

Stacking stays exactly as today: dark base → video → the two existing gradient
overlays → header and hero content. No layer is added between them.

## Route remounting

The hero lives in the `/` route component, so navigating into `/` mounts a new
`<video>` — unavoidable without moving it into the root layout, which would be
a structural change. With the poster removed and the opacity reveal in place,
the intermediate state is the flat dark base instead of the old image, so the
navigation flash disappears without restructuring.

## Verification

- Playwright: navigate `/book-leisure` → `/` and capture frames during the
  transition; confirm no image frame, no white flash.
- Measure the hero section height on first paint and after the video is ready;
  values must be identical.
- Screenshot `/` at desktop width after the video settles and compare against
  the current render — must be pixel-identical.
- Console clean.
