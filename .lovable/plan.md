# Lighten the backing plate + strengthen card float on /manage-bookings

Make the dark, gold-edged booking cards visibly "float" over a light, warm stone
plate — the contrast from the reference — instead of sitting on a dark surface.
Only `src/routes/manage-bookings.tsx` and `src/styles.css` are touched.

## Current state (verified)

- Backing plate: `<section>` at `src/routes/manage-bookings.tsx:1372-1381`
  - `backgroundColor: "#C6C5C0"`, `backgroundImage` = radial + `linear-gradient(180deg, #CAC9C4 0%, #C3C2BD 42%, #BABCBC 100%)`
  - `boxShadow: inset 0 1px 0 rgba(255,255,255,0.50), inset 0 -1px 0 rgba(0,0,0,0.10), 0 26px 60px -28px rgba(6,10,15,0.62)` (outer drop present)
  - `border: 1px solid rgba(255,255,255,0.34)`
- Card wrapper: `.hgb-card-recess` at `src/styles.css:940-963`
  - inset bevels (lines 951-959), a top lip `0 1px 0 rgba(255,255,255,0.045)` (line 959), and the prior floating drop shadows `0 4px 10px rgba(20,24,30,0.30)` + `0 14px 26px -10px rgba(20,24,30,0.38)` (lines 961-962)

## Changes

### 1. Lighten the backing plate (`src/routes/manage-bookings.tsx:1374-1381`)
Replace the `style` object on the `<section>` so:
- `backgroundColor` → `#d3d5d5` (gradient fallback)
- `backgroundImage` → `linear-gradient(180deg, #e3e2dd 0%, #dcdbd6 42%, #d3d5d5 100%)` (same 180deg direction, lighter + warmer)
- `boxShadow` → `inset 0 1px 0 rgba(255, 255, 255, 0.62), inset 0 -1px 0 rgba(0, 0, 0, 0.06)` (the two insets from the spec; drop the outer drop shadow so the plate reads as a flat light stone surface)
- Keep `border: 1px solid rgba(255,255,255,0.34)` unchanged

### 2. Strengthen the card float (`src/styles.css:960-962`)
Keep every inset bevel and the top lip (lines 951-959). Replace the two existing
floating drop-shadow lines (961-962) with the stronger spec values:
```css
  0 4px 10px rgba(20, 24, 30, 0.35),
  0 16px 30px -10px rgba(20, 24, 30, 0.45);
```
(Replacing, not stacking, the prior 0.30/0.38 lines avoids redundant double
drop shadows; all bevels and the top lip are preserved exactly.)

## Protected (do not change)
- Hero image, "Welcome, [name]" heading, KPI/stat cards
- Card colors, content, sizing, layout, gold insert
- Tabs, search/filter row behavior, routing, data, auth

## Validation
After the change, inspect the live `<section>` and `.hgb-card-recess`:
- Plate computed background is the light warm stone gradient (#e3e2dd → #d3d5d5)
- Each card shows a soft diffuse downward drop shadow (0.35 / 0.45) against the light plate
- Dark gold-edged cards visibly "float" ~4px above the light stone — the reference contrast
- No hero, heading, KPI, card color/content, or routing changes
