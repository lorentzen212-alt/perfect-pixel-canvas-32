# Booking card: gold strip as element + machined recess frame

Restores the gold strip as a real element (140deg brushed champagne), returns the card to the recessed plate frame, and aligns paddings/shadows with your spec. Only the booking card on My Bookings changes.

## What changes

1. **Gold gradient constant** — `GOLD_BRUSHED_H` in `src/routes/manage-bookings.tsx` already holds exactly the 140deg 7-stop gradient you specified. No change needed.

2. **Gold strip becomes an element again.** Today `goldStrip = null` and the gold is painted as the third background layer of the card shell. Replace it with:
   ```
   <span aria-hidden className="pointer-events-none absolute left-0 top-0 bottom-0 z-[2]"
         style={{ width: 17, background: GOLD_BRUSHED_H }} />
   ```
   rendered as the first child of both card variants (full and compact).

3. **Card shell (`shell`) simplified** to your spec: two background layers only (radial light + `linear-gradient(158deg,#17222E,#141E29,#111A24)`), no `backgroundPosition`/`backgroundSize` juggling, `border: 1px solid rgba(255,255,255,0.055)`, `borderLeft: "none"`, radius 12, and the deeper box-shadow set (drop + inset top light + inset bottom shade).

4. **Article classes** get `py-[22px] pr-[24px]` (the full variant keeps its grid/gap and responsive columns; only the padding values change).

5. **Recess wrapper** — each `<BookingCard>` in the results list is wrapped in `<div className="hgb-card-recess">`, which is currently defined in CSS but not used anywhere.

6. **CSS (`src/styles.css`)**
   - `.hgb-booking-card`: keep `--insert-w: 17px` and `padding-left: calc(var(--insert-w) + 33px)`; transition becomes `transform .3s ease, box-shadow .3s ease`.
   - `.hgb-booking-card:hover`: only the two-layer box-shadow (drop the `translateY(-2px)` lift), per your spec.
   - `.hgb-card-recess`: keep as specified and **remove the two floating drop-shadow layers** added earlier (`0 4px 10px …`, `0 16px 30px -10px …`) so it matches your shadow list exactly.
   - `.hgb-card-recess::before` (extra radial darkening) is removed — not in your spec.
   - `.hgb-card-insert` with its `::before`/`::after` layers no longer exists in the stylesheet, so nothing to delete there.

## Files

- `src/routes/manage-bookings.tsx` — gold strip span, shell object, article padding classes, recess wrapper in the list.
- `src/styles.css` — `.hgb-booking-card`, `:hover`, `.hgb-card-recess`, remove `::before`.

Nothing else on the card (media frame, chips, reference panel, timeline, footer button) changes.
