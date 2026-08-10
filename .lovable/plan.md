# Refine the Booking Details card

Changes are limited to the `DetailsCard` component in the Booking Overview. Card position, content, labels, wording, functionality, surrounding cards and page layout stay as they are.

## Row structure and separators

- Restructure each row so it is one grid unit: `34px` icon / `146px` label / `1fr` value, with 12px after the icon and 16px between label and value.
- Replace today's split `border-top` on the label and value cells with a single continuous `1px solid rgba(50,60,65,0.10)` line that starts just after the icon column and runs to the right card edge.
- Row height ~38–40px, with icon, label and value vertically centered; values keep one shared left axis.

## Size lock

The outer card keeps its exact current width and height. The larger 33px icon tiles are absorbed by tightening row padding and internal vertical spacing — header, footer and total footprint do not grow by a single pixel. If the numbers conflict, row padding is reduced rather than the card being allowed to expand.

## Icons

- Icon tiles grow from 27px to 33px, radius 8px.
- Tile: background `#FBFAF6`, border `1px solid rgba(150,135,105,0.18)`, shadow `0 2px 4px rgba(30,40,45,0.07), inset 0 1px 0 rgba(255,255,255,0.95)`.
- Icon glyph 17px, color `#B18428`, thin stroke.

## Row tones

- Subtle alternating backgrounds: odd rows transparent, even rows `rgba(90,95,90,0.022)`, bleeding to the card's inner padding edges so the tint reads as a full row.

## Typography

- Labels return to refined champagne gold `#A98232`, 10.5px, weight 600, letter-spacing 0.06em, uppercase.
- Values `#10253A`, 13.5px, weight 500.
- Secondary line ("Group Sales Manager") 10.5px, `#8A949B`.

## Frame, header, pills, footer

- Outer frame: `1px solid rgba(90,100,105,0.30)`, radius 13, shadow `0 2px 3px rgba(25,35,40,0.08), 0 7px 14px rgba(25,35,40,0.10), inset 0 1px 0 rgba(255,255,255,0.90)` — raised, not inset. The existing inner rectangular frame overlay is removed and replaced by a single soft `inset 0 0 0 1px rgba(255,255,255,0.55)` edge.
- Header keeps its size and gold accent; slightly more space between it and the first row.
- Status pill and Deposit Pending pill keep their wording and compact size, retoned to the same `#A98232`/`#B18428` gold family, with the payment pill vertically centered against the taller icon row.
- "Show more details" stays centered in `#A98232` at 10.5px, with ~16px above and ~14px below and no separator-driven empty footer.

## Technical notes

All edits live in `DetailsCard` in `src/features/booking-workspace/overview/Overview.tsx`. Row separators move to a `border-bottom` on a wrapper spanning the label+value columns so the line is continuous. Total card height is checked with a live capture afterwards; the taller rows are offset by tighter row padding so the card grows only marginally.
