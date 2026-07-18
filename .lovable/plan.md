## Goal
Move the entire left content column (logo, tagline, headline, gold divider, description, CTA buttons, trust icons, and "Built by" line) so it starts ~50–60 px from the left browser edge, instead of being centered inside a max-width container.

## Current state
`src/routes/index.tsx` wraps the header and hero in a centered container:
```tsx
<div className="relative z-10 mx-auto w-full max-w-[1470px] px-5 sm:px-8 lg:px-[54px]">
```
This centers the whole page and leaves large side margins on wide screens. The hero section also has `max-w-[720px]`.

## Changes
1. Remove the centered `mx-auto max-w-[1470px]` wrapper so the left column can sit at a fixed distance from the left edge.
2. Apply a consistent left padding of `50px` (`lg:pl-[60px]`) to:
   - The header’s left block (logo + tagline)
   - The hero content section
3. Keep the header’s right-side navigation and Login button aligned to the right edge with matching right padding (`pr-[50px] lg:pr-[60px]`).
4. Keep the hero section’s `max-w-[720px]` so text line breaks stay the same, but align it to the left (no auto margins).
5. Leave all typography, colors, element spacing, background image, and background positioning untouched.

## Files to edit
- `src/routes/index.tsx`

## Verification
- Build the project and check the preview at desktop width (≥1280 px) to confirm the left column starts ~50–60 px from the left edge.
- Confirm the right-side nav stays at the right edge.
- Confirm no changes to fonts, colors, button spacing, or background.