# Group Plan structural refinement

Refine `src/features/booking-workspace/group-plan/GroupPlan.tsx` without changing any colors. Keep the approved palette exactly: Midnight `#0D1C2B`, Navy `#13283C`, Slate `#243746`, Warm Ivory `#F5F1E9`, Champagne Gold `#C9A85F`, Secondary Text `#9AA6B2`, Borders `#2A3B52`.

## Verified current state

The file already uses the final palette:
- `PAGE = #F5F1E9`, `CARD = #13283C`, `SURFACE_SOFT = #243746`, `EDGE = #2A3B52`, `TEXT_2 = #9AA6B2`, `MUTED = #9AA6B2`, `GOLD = #C9A85F`.
- Timeline rows already have no permanent background and use `hover:bg-[rgba(255,255,255,0.03)]`.
- Expanded detail area stays on `#13283C` and `Tile` cards inside use `#243746` with `#2A3B52` borders.

## Changes to make

### 1. Increase planner section breathing room
- In `PlannerSection`, raise top margin from `mt-7` to `mt-8` (or equivalent) so the hairline-divided sections feel less crowded.
- Keep the existing `paddingTop: 20` and `borderTop: 1px solid #2A3B52`.

### 2. Slim the Tip box
- Reduce vertical padding from `py-3` to `py-2.5` (or `py-[10px]`) so the tip reads as a compact band, not a large block.
- Keep its gold-tinted border and background (`rgba(201,168,95,0.08)` border and background) unchanged.
- Keep the outer `paddingTop: 20` / `borderTop: 1px solid #2A3B52` wrapper that separates Tip from My plan.

### 3. Confirm booking pills are subtle labels
- `Pill` "booking" branch must remain: `background: transparent`, `border: 1px solid #2A3B52`, `color: #9AA6B2`.
- Verify no dusty-blue or software-blue tints remain in secondary text, metadata, timestamps, or helper text.

### 4. Confirm "Add to plan" button is outline-only
- Keep `background: transparent`, `border: 1px solid #C9A85F`, `color: #C9A85F` for both text and `Plus` icon.
- Keep hover `background: rgba(201,168,95,0.08)`.

### 5. Verify planner panel structure
- Unscheduled items: transparent background, `1px solid #2A3B52` border, `rounded-[10px]`, internal padding `py-[14px] px-3`.
- My plan items: `1px solid #2A3B52` top border between rows instead of `HAIR_SOFT`.
- Ensure a small gap exists between consecutive Unscheduled cards (`space-y-2` or equivalent).

### 6. Final audit
- Search the file for any remaining `#BFD3E8`, `rgba(107,155,207,…)`, or other non-palette blue tints.
- Confirm the only blue-ish element is the Calendar-view timeline dot (`#6B9BCF`).
- Run a TypeScript typecheck before finishing.

## Files
- `src/features/booking-workspace/group-plan/GroupPlan.tsx` (single file change).

## Deliverable
A Group Plan page that keeps the exact same colors but feels more structured, layered, and premium — the two large navy panels are broken up by hairline dividers, discrete card edges, and consistent muted secondary text.