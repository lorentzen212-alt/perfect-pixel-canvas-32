# Redesign of the expanded activity info box (Group Plan)

Visual-only refinement of the expanded activity details panel in the Group Plan timeline. Functionality, content and data stay exactly as they are.

## Look and feel

- Panel background changes to #363B4E (the chosen colour), border 1px rgba(255,255,255,0.08), radius 14px, padding 20px 24px, very subtle shadow.
- Text system: off-white #F2F4F7 for primary, light grey #B6BDC8 for secondary, gold #E8C96A for icons, labels and accents.
- More breathing room: ~20px between sections, delicate hairlines instead of heavy blocks.

## Sections

1. Top row — up to 4 compact key cards in one row (stack 2-per-row on tablet, 1 on mobile): background rgba(255,255,255,0.04), border 1px rgba(255,255,255,0.10), radius 12px, padding 14px 16px, min-height 64px. Gold 16px icon top-left, gold uppercase 12px label with 0.05em tracking, off-white 16px semibold value, light-grey 12px subtext.
2. Services / preparations row — horizontal row of small gold check icons with 14px off-white text, 1px rgba(255,255,255,0.08) dividers between items, 10px vertical padding.
3. Notes — gold "NOTES" title, 12px uppercase; note text off-white 15px with normal line-height; pencil edit button top-right of the notes area as a gold-outlined circle (1px rgba(255,255,255,0.10), 16px icon).
4. Bottom meta row — left: "Added by …", date in light grey and "Edit" in gold. Right: "Request a change" as transparent button with 1px #E8C96A border, gold text, 10px 18px padding, radius 8px; then "View full details →" as a plain gold link.

## Also applies to the list rows

- Slightly airier rows: 16-18px vertical padding, thin 1px rgba(255,255,255,0.06) divider between rows, hover background rgba(255,255,255,0.02).
- Circular gold-on-white/grey-ring activity icons keep their current style and stay consistently sized and aligned.
- "BOOKING" pill keeps identical style and size across all rows.

## Mobile

Key cards stack, panel padding drops to 16px, values scale to 15px and subtext to 11px.

## Technical notes

All changes are contained in `src/features/booking-workspace/group-plan/GroupPlan.tsx` — the `Tile`, `CheckRow`, `Expanded` and `Row` components plus a few local colour constants. No data, props or handlers change.
