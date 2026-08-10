# Refine the Booking Details card interior

Only the inside of the existing "Booking details" card changes. Card size, position, padding, border, radius, shadow, inner frame, the top status badge placement, and the "Show more details" placement all stay exactly as they are. No information is added or removed.

## What changes

**Icons** — each row icon becomes a small ivory plaque: background #F7F3EA, 1px #DDD2BE border, 7px radius, 27px square, centered icon in restrained champagne #A97824 with thin strokes, plus a subtle inset highlight and 1px contact shadow.

**Labels** — HOTEL, DESTINATION, CONTACT, EMAIL, PHONE, HOTEL REFERENCE, PAYMENT TERMS switch from gold to cool grey #59636A at weight 600, same size, still uppercase.

**Values** — primary values render in dark ink #17232C at the current size; secondary lines such as "Group Sales Manager" use #8A9195.

**Alignment** — one shared grid per row: fixed icon column, 10px gap, fixed label column (~150px), value filling the rest. Icons, labels and values each line up on a single vertical axis, all vertically centred inside the current row height.

**Separators** — hairlines become rgba(80,90,95,0.14) and start after the icon column, giving a ledger feel. The current alternating row tint is removed so the rows read as one stationery block; spacing between rows stays identical.

**Payment pill** — "Deposit pending" keeps its size, restyled to #F5EBD8 background, #A97824 text and icon, 1px rgba(169,120,36,0.12) border.

**Show more details** — colour set to #A97824, same size and position.

## Height guarantee

Row padding, font sizes and the 27px icon plaque match the current row box (28px icon + 3.5px padding), so total card height is unchanged. After the edit the card is measured in the live preview against the current height and adjusted if it drifts by even a pixel.

## Technical notes

Single file: `src/features/booking-workspace/overview/Overview.tsx`, `DetailsCard` only. The row grid becomes `grid-cols-[28px_150px_minmax(0,1fr)]` with the label and value as separate cells, the icon moved out of the `<dt>` into its own cell, and the row separator applied to the label+value cells rather than the full-width row.
