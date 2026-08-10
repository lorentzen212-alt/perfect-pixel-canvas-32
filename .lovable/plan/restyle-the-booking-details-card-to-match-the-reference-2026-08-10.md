# Restyle the Booking Details card to match the reference

Only the "Booking Details" card in the Overview changes. What happens next, Booking Extras, Current Action, the summary strip and the folder plate stay exactly as they are.

## What changes

1. **Icon tiles** — the small beige chips become clean white rounded tiles (about 40px, 11px radius) with a soft outward drop shadow and a very light hairline edge, icon stroke in the existing champagne bronze. This is the most visible difference from the reference.
2. **Card surface** — remove the inner inset frame line so the card reads as one calm ivory surface, keeping the current ivory background, border and outer shadow.
3. **Row rhythm** — slightly taller rows with the hairline divider running from the label column to the right edge (not under the icon tile), matching the reference where dividers start after the icons.
4. **Labels and values** — labels stay uppercase muted grey; values stay dark navy at the current size. Label column widens a little so the value column starts on a consistent axis.
5. **Header and footer** — "BOOKING DETAILS" eyebrow left, "AWAITING HOTEL CONFIRMATION" pill right, both unchanged in style. Footer stays a centered warm-accent "Show more details" link.

## Height note

Bigger icon tiles and taller rows make the card grow by roughly 40–60px. Since Booking Details and Booking Extras share the right column against the timeline on the left, the row height will grow with it. If that pushes the page past one screen, the row padding is dialled back a touch to keep the Overview on a single laptop screen.

## Color lock

No new colors. Ivory surface, dark navy values, muted grey labels, champagne only in the icon strokes, pill and footer link.

## Technical notes

All edits are inside the `DetailsCard` component in `src/features/booking-workspace/overview/Overview.tsx`: remove the `inset-[9px]` frame span, resize the icon chip to a white tile with drop shadow, change the grid columns and row padding, and move the divider borders off the icon column. No prop or data changes, no other files touched.
