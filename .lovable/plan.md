# Redesign the "What happens next" card

Only the timeline card in the Booking Overview changes. Current action, Booking details, Booking extras, the summary strip, navigation, sidebar, page background and all column widths stay exactly as they are.

## What the card becomes

1. Keep the small uppercase champagne "WHAT HAPPENS NEXT" heading.
2. Add a compact free-cancellation banner directly under the heading: shield-check icon, "FREE CANCELLATION" eyebrow, "Free cancellation until <deadline>", and remaining time on the right. Full card width, 48–52px tall, 8–10px radius, pale green tint, 1px muted green border, no shadow or gradient.
3. Below it, the six-step timeline in this exact order: Request sent, Booking confirmed, Deposit received, Rooming list, Final details, Arrival. "Hotel confirmed" is renamed to "Booking confirmed" and "Final confirmation" to "Final details".
4. Completed steps: green check circle, green connector, navy title, muted description, muted right-aligned date.
5. Rooming list (current): pale champagne row, thin gold outline, narrow gold left accent, filled gold circle with "4", gold-outline "Due in 6 days" pill.
6. Final details: neutral light-grey circle "5", neutral connector, subtle grey outline pill — no gold.
7. Arrival: outlined circle "6", navy title, muted "Check-in from …", small neutral date pill. The vertical line stops at this step.
8. One continuous 1–1.5px line centred through the circles: muted green through the completed section, very light grey afterwards.
9. "View full timeline →" stays a bottom-left gold text link, left-aligned with the banner and the timeline.
10. Card stays as compact as the reference; only minor internal spacing changes.

## Cancellation logic (dynamic)

The booking record has no cancellation field today, so the deadline is derived in one place from the booking's own data — 18:00 local, 7 days before arrival — and passed into the card as a single optional value. The card itself never hard-codes a date.

State handling, computed from now vs. that deadline:

- more than 48h left → green styling, "X days remaining"
- less than 48h → champagne/amber styling, "X hours remaining"
- same day → "Free cancellation ends today at 18:00"
- passed → muted grey, "Free cancellation period ended <date, time>"
- no deadline available → banner is not rendered at all

Free cancellation appears only here — nothing is added to Current action, Booking details, Payment terms or any other card.

## Technical notes

- `NextSteps` in `src/features/booking-workspace/overview/Overview.tsx` gets an optional `cancellation` prop (`{ deadline: string }` ISO) plus a small internal helper that formats the deadline and picks the green/amber/grey token set. `OverviewFolder` forwards the prop.
- `src/routes/bookings.$bookingId.tsx`: rename the two journey labels and pass the derived cancellation deadline (from `stay.arrival`) into `OverviewFolder`. Journey states, due labels and arrival date keep coming from booking state, so the highlighted step still moves automatically.
- Timeline markup keeps the existing single-connector approach with row-gap tuning; circles keep one uniform diameter so all titles sit on one axis.

No other file is touched.
