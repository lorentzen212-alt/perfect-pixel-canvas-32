# Match the inside of "What happens next" to the reference

Only the interior of the timeline card changes. Card size, position, material, the header label and the surrounding layout stay exactly as they are.

## Differences to fix

1. **Active step is oversized.** The gold circle (31px) is bigger than the completed circles (28px), which pushes "Rooming list" and its description a few pixels to the right so the labels no longer line up in one column. In the reference every circle is the same diameter and all six titles start on the same vertical line.
2. **Circles are slightly too large relative to the text.** Reference circles are a bit smaller compared to the title size; they should read as neat markers, not heavy dots.
3. **Active row highlight** should be a soft, full-bleed rounded band across the card interior with a touch more vertical padding, matching the reference's calmer band (same gold tint, same left accent).
4. **Arrival's trailing "—"** is currently rendered inside a pill/circle. In the reference it is plain muted text with no border.
5. **Row rhythm and footer gap**: keep the even step distribution, but recheck it after the circle change so center-to-center spacing and the distance from Arrival down to "View full timeline" match the reference proportions.

## Technical notes

All edits inside `NextSteps` in `src/features/booking-workspace/overview/Overview.tsx`:

- Unify circle geometry: 26px for every state (done, active, upcoming); keep the distinct fills, border and shadows. Adjust the connector's `left` offset to stay centered on the new diameter.
- Remove the active row's extra `minHeight` bump so all rows share one height; the highlight band alone marks the active step.
- Active highlight: same tint/border/left accent, slightly larger inset so it reads as a full-width band with even padding.
- Upcoming steps whose `sub` is a dash (`—`) render as plain muted text instead of the outlined pill.
- After the change, measure the rendered card in the live booking view and fine-tune only the single row `gap` and footer `pt` so the card's outer height stays identical to today.

No other component, file or card is touched.
