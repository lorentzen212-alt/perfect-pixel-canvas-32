# Safe structural refactor — `src/routes/manage-bookings.tsx`

Pure code movement. No JSX, class, style, value, label, data, or routing change.
The file is 1,818 lines with 43 top-level declarations; this splits out the
self-contained pieces and leaves the page component itself untouched.

## 1. Proposed file structure

```text
src/features/dashboard/
  tokens.ts                 design constants for this page
  bookingMeta.ts            status/group helpers used by the cards
  BookingCard.tsx           BookingCard + Timeline + TypeChip + MetaItem + RowMenu
  StatTile.tsx              StatTile
  FilterSelect.tsx          FilterSelect + STATUS_DOTS
src/routes/manage-bookings.tsx   page component, loaders, layout, hero, sidebar
```

## 2. What moves out of `manage-bookings.tsx`

**`tokens.ts`** — the colour/typography constants declared at lines 98-152:
`SIDEBAR`, `SIDEBAR_LAYERS`, `SIDE_TEXT`, `SIDE_TEXT_2`, `SIDE_MUTED`,
`SIDE_LINE`, `GOLD_DEEP`, `PAGE`, `CARD`, `CARD_BORDER`, `CARD_SHADOW`, `PANEL`,
`HAIRLINE`, `TEXT`, `TEXT_2`, `MUTED`, `GOLD`, `GOLD_SOFT`, `PEARL`, `RULE`,
`BLUE`, `GOLD_BRUSHED`, `GOLD_BRUSHED_H`, `GREEN`, `RED`, `CHAMPAGNE`,
`CHAMPAGNE_LINE`, `IVORY`, `SERIF`, `SANS`. Values copied byte-for-byte.

**`bookingMeta.ts`** — `Group` type, `countryOf`, `groupOf`, `GROUP_LABEL`,
`GROUP_COLOR`, `primaryAction`, `TRACK_STEPS`, `trackIndex`, `DateChoice` type
(lines 156-232, 1139).

**`BookingCard.tsx`** — `Timeline` (235), `TypeChip` (314), `MetaItem` (330),
`RowMenu` (344), `BookingCard` (499). These four helpers are used only by the
card, so they travel with it; only `BookingCard` is exported.

**`StatTile.tsx`** — `StatTile` (832) with its exact current prop type,
including the props it currently accepts but does not read (`action`, `footer`,
`bgPos`) — kept so the four call sites at 1522-1553 stay unchanged.

**`FilterSelect.tsx`** — `FilterSelect` (965) and `STATUS_DOTS` (957).

## 3. What stays

The route definition, `ManageBookings` (1141) and all page markup — hero,
welcome block, status card row, ivory panel, tabs, toolbar, results list,
right column — stay exactly where they are, with their current classes and
inline styles.

`Select` (913) also stays in place: it has no call site in this file, and
removing it would be deletion, which you excluded. It stays untouched.

## 4. Code that must be modified rather than moved

Four mechanical adjustments, nothing else:

1. **Imports.** Each new file gets its own imports (React, lucide icons,
   TanStack `Link`/`useNavigate`/query hooks, `sonner`, `@/lib/bookings`,
   `@/lib/bookingsApi`, the asset JSON files the moved code references).
   `manage-bookings.tsx` gets import lines for the extracted modules and loses
   the icon/asset imports no longer used there.
2. **Export keywords.** `BookingCard`, `StatTile`, `FilterSelect` and the moved
   constants/helpers get `export`; the card's private helpers do not.
3. **`RowMenu` keeps its own hooks.** It already owns its `useState`,
   `useQueryClient`, `cancelBooking` call and toast — it moves as-is with no
   prop changes and no lifting of state.
4. **`FilterSelect` generic signature** (`<T extends string>`) is preserved
   verbatim so the three call sites keep their inferred types.

No prop is added, removed, renamed or reordered. No default values change.

## 5. How the rendered UI is guaranteed identical

- Every moved block is transplanted as a literal region — same JSX tree, same
  `className` strings, same `style` objects, same conditionals, same
  `aria-*` attributes.
- The token files re-export the same string literals, so every consumer
  resolves to the identical value; nothing is renamed or "harmonised".
- Call sites in `ManageBookings` are not edited at all — same components, same
  props, same order, same wrappers.
- No CSS file is touched, so `.hgb-stat-tile`, `.hgb-card-recess`,
  `.hgb-booking-card`, `.hgb-stone-surface` and every hover/transition rule
  behave as before.
- Behaviour paths (cancel dialog, query invalidation, toast, filter state,
  grid/list toggle) move intact rather than being reimplemented.

## 6. Verification after the refactor

1. Typecheck passes with no new errors.
2. Screenshot `/manage-bookings` at 1281px before and after and compare —
   hero, welcome block, the four status cards, ivory panel, tabs, toolbar and
   the booking cards must match.
3. Measure rendered geometry in the live preview before/after: status card
   height, ivory panel top edge, booking card height (currently 304px) and
   total content height — all must be unchanged.
4. Also check the 2×2 breakpoint below `xl` so responsive behaviour is intact.
5. Exercise interactions: tab switching, search, the three filter dropdowns,
   grid/list toggle, the row menu, and the cancel-booking confirm dialog
   (including the toast and list refresh).
6. Console clean — no new warnings or errors.

If any measurement differs, the offending extraction is reverted rather than
adjusted to match.
