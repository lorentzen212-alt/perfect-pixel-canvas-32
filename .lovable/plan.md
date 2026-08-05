# Refine left image section proportions

Geometry-only pass on the booking card's left area. No redesign, no material, shadow or background changes.

## Changes

1. **Metallic strip moves inward** — inset changes from flush (`-1px`) to `3px` from the card's left edge, so it reads as embedded in the card rather than glued to the outer edge.
2. **Strip shortened vertically** — top and bottom inset become `3px` each (was `-1px`), so it stops short of the card's rounded corners and respects the radius. Small radius (2px) on the strip ends keeps it continuous but softly terminated.
3. **Image module shifts right by ~5px** — the card's left padding token grows accordingly, creating breathing room between strip and image frame without changing image size or card layout.
4. **Everything else untouched** — gradients, specular line, grain pass, inset image shadow, card background and all other spacing stay byte-identical.

## Technical detail

In `src/styles.css`:

- `.hgb-booking-card`: `padding-left: calc(var(--insert-w) + 34px)` (was `+ 26px`) — 3px strip offset + ~5px extra breathing room.
- `.hgb-card-insert`: `inset: 3px auto 3px 3px;` (was `-1px auto -1px -1px`), plus `border-radius: 2px`.

No changes in `src/routes/manage-bookings.tsx`.

## Verification

Screenshot the card at `/manage-bookings` and compare strip offset, strip end positions against the card radius, and the gap to the image frame with the reference.
