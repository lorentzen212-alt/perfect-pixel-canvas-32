# Fix: Render Solid Grey Backing Plate Behind Booking Cards

## Goal
Make the booking-list wrapper in `src/routes/manage-bookings.tsx` render a solid, opaque grey background (`#3F464E`) reliably in the live DOM.

## Current state (verified by DOM inspection)
- Wrapper element: `<section>` with class `rounded-[18px] p-[22px] relative overflow-hidden isolate`
- Computed `background-color`: `rgba(0, 0, 0, 0)` (transparent)
- Source contains `backgroundColor: "#3F464E"`, but it is not reaching the rendered element

## Steps
1. Open `src/routes/manage-bookings.tsx`.
2. Locate the booking-list `<section>` wrapper.
3. Remove any conditional, spread, or overridden style object that drops the background.
4. Apply the background directly and reliably using either:
   - Static Tailwind class: `bg-[#3F464E]`
   - Or explicit inline `style={{ backgroundColor: "#3F464E", ... }}`
5. Ensure no later `style` spread, `className` logic, or `bg-transparent` overrides it.
6. Preserve all existing borders, shadows, radius, padding, layout, and protected elements.

## Protected elements (do not modify)
- Booking cards, stone texture, metallic gold strips
- Tabs, search bar, right-hand cards
- Layout, spacing, content, routing, functionality

## Validation
After the change, inspect the live rendered `<section>` and confirm:
- Computed `background-color` is `rgb(63, 70, 78)` / `#3F464E`
- Grey plate is visible behind tabs and between booking cards
- No other component has changed
