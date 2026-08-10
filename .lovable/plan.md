# Overview: full presentation rebuild

The Overview tab gets a brand-new component tree with its own layout primitives. No old Overview card, wrapper, grid or spacing survives. Data, queries, mutations, handlers, panels and every other tab stay exactly as they are.

## What is preserved

`fetchBooking`, `roomingStats` (live rooming progress), `journey`, `ledger`, `rooms`/`dining`/`services`/`requests` state, `panel` / `editor` edit-panel plumbing, all `Link`/`navigate` targets (`/rooming/$bookingId`, Messages/Documents tabs), auth redirect, and the Rooming List / Changes / Documents / Messages / Notes branches. Only the JSX under the `Overview` branch is thrown away.

## New file: `src/features/booking-workspace/overview/`

The current `folder.tsx` primitives are replaced by a new, self-contained set — the old ones no longer dictate geometry.

- `materials.ts` — tokens only: ivory `#F5F3EE`, folder `#C9CED0`/`#CDD1D2`, ink `#18232C`, secondary `#637079`, gold `#B77B13`/`#C38A20`, inactive tab `#152938`, sidebar `#1B2D3D`, plus the exact raised shadow stack (`0 2px 3px rgba(16,26,34,0.12), 0 7px 14px rgba(16,26,34,0.035), inset 0 1px 0 rgba(255,255,255,0.85)`, 1px `rgba(255,255,255,0.70)` border) — never exceeded.
- `Plate.tsx` — the folder object: 16px radius, 1px light upper rim, darker side/bottom rim, 3–5px apparent thickness, tight underneath shadow, 24–28px internal padding. Smooth material, no texture/noise.
- `CurrentAction.tsx` — 115–130px desktop, single horizontal row: 44px medallion / eyebrow + title + one supporting line / gold `Create rooming list →` on the right. The wide progress bar is deleted; progress appears only as one tiny line, e.g. `6% completed · 4 of 67 names`, from live `roomingStats`.
- `NextSteps.tsx` — dense vertical timeline, 340–390px, height driven by content. Each row: 22px status circle, title, one supporting line, right-aligned date/deadline. Built from the existing journey data, not from the old Booking Journey markup.
- `DetailsCard.tsx` — the business card: an outer slot (5–7px inset ring, slightly darker than the folder, subtle inner shadow) holding an ivory card sitting 1–2px below the folder plane. 26–30px padding, comfortable label/value rows, no condensed type, labels quiet. `Show more details ↓` reveals the remaining ledger rows with their existing edit-panel callbacks.
- `HelpCard.tsx` — 85–100px, secondary, `Message HotelGroupBook →` switching to the Messages tab.
- `SummaryStrip.tsx` — one full-width ivory strip, 95–110px, four equal cells with thin vertical separators: guests, rooms, stay dates, documents. Icon medallion, large editorial value, small label, small gold action wired to the existing panels/tabs.
- `Sections.tsx` — compact ivory sections for the secondary block.

## Composition (mandatory)

```text
HERO
FOLDER TABS
┌ FOLDER ────────────────────────────────────┐
│ [ CURRENT ACTION — full width, compact ]   │
│ [ WHAT HAPPENS NEXT 62% ][ DETAILS 38%  ]  │
│                          [ NEED HELP    ]  │
│ [ BOOKING SUMMARY STRIP — full width ]     │
│ MORE BOOKING INFORMATION                   │
└────────────────────────────────────────────┘
```

Tablet: two columns collapse to one, details/help move under the timeline, strip becomes 2×2. Mobile: single column throughout.

`MORE BOOKING INFORMATION` continues down the same folder as compact ivory sections — rooms, dining, services, special requests, rooming list progress, recent activity, latest documents, notes, deadlines — reusing their current data and edit panels but none of the old dark widget shells.

## Hero and tabs (`BookingWorkspaceHeader.tsx`)

- Hero content, tabs included, targets 230–260px. Existing image kept, controlled dark navy overlay, more prominent booking title, then meta row (location · dates · rooms · guests · reference) and the status badge.
- Active Overview tab uses the folder material itself — no bottom border, no shadow between tab and folder, with a small shoulder where the tab meets the plate, so the folder reads as one object without any text.
- Inactive tabs: `#152938`, slightly thicker, subtly recessed with restrained borders and small inset shadows — not navigation pills.

## Sidebar

Colour only: surface to the `#1B2D3D` blue-grey. Same width, items, order, labels.

## Content rules

No invented data. Missing dates render `Dates to confirm`, unassigned hotel renders `Hotel to be assigned`, payment shows its actual state.

## Verification

Playwright pass at 1440 / 1024 / 768 / 390: confirm hero + tabs + Current Action + What Happens Next + Booking Details all fit the 1440 viewport without large blank areas, measure the target heights, then click every tab, action link and edit panel to confirm nothing broke.
