# KPI cards mounted into a dark stone wall

Rebuild only the hero → KPI → workspace transition on `/manage-bookings`. Everything else (sidebar, hero image, profile area, booking cards, filters, data) stays untouched.

## Current state (verified)

- Hero is an absolutely positioned image layer (`src/routes/manage-bookings.tsx:1207-1241`) with a 150px bottom fade into `#263440`.
- KPI row is a plain grid `<section className="mt-[8px] grid grid-cols-2 ... xl:grid-cols-4">` (line 1335) holding four `StatTile` buttons (line 813). Nothing behind them — they float on the page background.
- `StatTile` uses a translucent navy gradient with `backdropFilter: blur(14px)` and a large soft drop shadow — the "floating glass" look.
- Light workspace is the `.hgb-stone-surface` section at line 1411, starting `mt-[18px]` below the KPI row. No gold rails/shelves exist under the cards today, so nothing to remove there.

## Changes

### 1. New stone-wall layer (`src/routes/manage-bookings.tsx`)

Replace the bare KPI grid with a dedicated section:

```text
<KpiStoneWall>            dark graphite wall, ~132px desktop, full content width
  <div class="kpi-slots"> 4-col grid, same inner width/padding as the workspace
    <KpiSlot>             position: relative
      <div class="kpi-slot-recess" />   deep cutout behind the card's lower part
      <StatTile />                       existing card, z-index above the recess
```

- Wall background: `linear-gradient(180deg,#2A2F33 0%,#252A2E 45%,#202428 100%)` plus a very low-opacity existing stone texture overlay for mineral variation.
- Wall sits immediately under the hero (slight overlap with the hero fade), spans the main content width, has `overflow: visible` so cards rise above it, and a bottom shadow `0 10px 20px rgba(0,0,0,0.16)` so it reads as in front of the light workspace.
- Cards are pulled up with a negative top offset so ~65-70% of each card is above the wall surface and ~30-35% descends into its slot.

### 2. Slots (`src/styles.css`)

New classes `.hgb-kpi-wall`, `.hgb-kpi-slot`, `.hgb-kpi-recess`:

- Recess: absolute, inset `-10px` left/right, `bottom: 0`, height 38px, radius `12px 12px 8px 8px`, dark gradient `#17191B → #0B0D0F`, inset shadows `inset 0 6px 12px rgba(0,0,0,0.75)` + faint bottom lip.
- `::after` on the recess: 2px champagne inner rim (the gradient from the brief, opacity 0.7) — a reflection inside the cut, not a rail.
- Layering: recess `z-index: 1`, card `z-index: 3`, no clipping — cards stay fully clickable.

### 3. KPI card material (`StatTile`)

Keep content, icons, counts, labels, footers, "Action needed" treatment and click handlers exactly as-is. Only the surface changes so the card reads as dense stone-inserted hardware:

- background → `linear-gradient(155deg,#263545 0%,#1D2A38 48%,#15212D 100%)`
- drop the `backdropFilter` blur and the large glow shadow; keep a tight contact shadow
- border → `1px solid rgba(194,154,72,0.70)` for the active/action state, muted champagne otherwise

### 4. Light workspace

Stays where it is structurally but now begins below the wall with almost no gap, keeping its warm ivory `.hgb-stone-surface` material and 28-40px top padding before the tabs. Tabs, search, filters, view toggles and booking cards are unchanged.

### 5. Responsive

Desktop 4 slots in one row; tablet 2 columns; mobile stacked — the wall grows in height naturally, no horizontal overflow, cards not scaled down.

## Files touched

- `src/routes/manage-bookings.tsx` — new `KpiStoneWall` / `KpiSlot` wrappers around the existing `StatTile`s, plus the `StatTile` surface tweak
- `src/styles.css` — `.hgb-kpi-wall`, `.hgb-kpi-slot`, `.hgb-kpi-recess` and its metallic rim

## Validation

Render the page and compare against the reference: visible dark graphite band under the hero, four clearly darker cutouts, cards inserted ~a third of their height with the top rising above the wall, light ivory workspace starting below the wall, no gold rails or floating cards.
