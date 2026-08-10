# Refine the "What happens next" timeline

Update only the timeline component inside the Booking Overview. Card size, radius, shadow, layout, text content and all other components stay exactly as they are.

## Icons

- All markers become 28px circles (currently 26px), so every step sits on one axis.
- Completed: deep green fill #2E7D55, white 2px check, subtle shadow `0 1px 2px rgba(0,0,0,0.08)`.
- Current step: gold gradient `linear-gradient(135deg, #B8860B, #DAA520)`, white number, same subtle shadow.
- Upcoming: fill #F7F7F7, 1px border #DADDE0, number in #6B7177.
- Connector line width goes to 2px and is recentered on the new 28px circles.

## Text colors

- Step titles: #17232C, weight 600.
- Descriptions: #6B7177.
- Right-hand dates: #8A9195.
- "View full timeline" link: #A97824.

## Active row (Rooming list)

- Background #F7F1E5, 1px border #E2CFB1.
- Add a 4px left accent stripe in #D4AF37 on the row highlight.
- Due pill: transparent background, 1px border #D4AF37, text #A97824.

## Spacing and position

- Move the whole timeline block 20px up (reduce its top margin).
- Row vertical padding 10px top/bottom, icon-to-text gap 14px.
- Add 20px more space between the last step (Arrival) and "View full timeline", absorbed from the redistributed row spacing so total card height stays the same.
- Keep all text and date alignment identical.

## Technical notes

All changes are contained in the `NextSteps` component in `src/features/booking-workspace/overview/Overview.tsx`: circle style objects, connector `left`/`width`/`height`, the active-row overlay, the `ol` gap and top margin, `li` padding, and the footer button padding. Card height is verified afterwards with a live measurement so it matches the current value.
