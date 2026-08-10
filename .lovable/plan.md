# Booking Overview — "The Booking Folder" redesign

Transform only the Bergen Group Stay → Overview tab from a dark widget dashboard into a premium physical booking folder. All data, actions, routes and other tabs (Rooming List, Changes, Documents, Messages, Notes) keep working exactly as they do today.

## Material layers

```text
┌─ sidebar (blue-grey navy #1B2D3D) ─┬──────────────────────────────┐
│                                    │  HERO  Bergen photo + navy   │
│                                    ├──[Overview]─inactive tabs────┤
│                                    │  FOLDER  cool stone #CED2D3  │
│                                    │   ┌ ivory card (raised) ┐    │
│                                    │   └─────────────────────┘    │
└────────────────────────────────────┴──────────────────────────────┘
```

- Folder: cool stone grey, 16px outer radius, 1px rim, top edge highlight, very soft outer shadow, visible edge thickness. It replaces the current flat ivory plate and is the only container — no white box inside it.
- Type A raised card (ivory #F6F4EF): 1px edge, `inset 0 1px 0 rgba(255,255,255,0.65)`, `0 2px 4px rgba(15,25,35,0.10)`.
- Type B inset card (Booking Details only): 1px grey outline plus `inset 1px 1px 2px rgba(20,30,35,0.09), inset -1px -1px 1px rgba(255,255,255,0.6)`, sitting in a thin groove cut into the folder.

## Layout inside the folder

1. **Current action** — one wide ivory raised card: "CURRENT ACTION / Add rooming list / Add guest names and room assignments…" with the existing rooming medallion icon and the existing link to `/rooming/$bookingId` as `Create rooming list →`. Progress percentage from the live rooming stats stays, shown as a quiet line under the text.
2. **Two columns** (~61% / ~39%, stacking on tablet and mobile):
   - Left — **WHAT HAPPENS NEXT**: the current horizontal `Booking journey` becomes a vertical timeline built from the same journey data (confirmed / rooming list / payment / final details / stay dates) with thin champagne connecting lines, muted green for done, metallic amber for current, ivory + gold ring for future, and `View full timeline →` at the bottom.
   - Right — **BOOKING DETAILS** as the inset card: hotel, contact, email, phone, hotel reference, payment terms, drawn from the existing booking record; where a field is unassigned it keeps today's real text (e.g. "Hotel to be assigned"). `Show more details ↓` expands the remaining ledger rows, which keep their existing edit-panel behaviour.
   - Right, below — **NEED HELP?** raised card with `Message HotelGroupBook →` wired to the existing Messages tab.
3. **Booking summary strip** — one horizontal ivory raised strip split into four equal cells with thin vertical dividers: guests, rooms, stay dates, documents uploaded, each with a medallion icon and a `View details →` link to the existing panel/tab. This replaces the current KPI strip that sits above the tabs today.
4. **More booking information** — everything currently below (rooms, dining, services, special requests, rooming list progress, recent activity, latest documents, notes, deadlines) moves underneath the primary section as compact ivory sections under a "More booking information" disclosure. No functionality or editor panel is removed; only their position and skin change.

## Hero and tabs

- Hero gets more vertical breathing room, a softer navy photographic overlay (image stays readable, not crushed), left block = back link, serif "Bergen Group Stay", meta row (destination, dates, rooms, guests, ref) and the CONFIRMED badge; right block = Download summary, notifications, profile.
- Active Overview tab becomes an ivory folder tab that merges seamlessly into the folder below (shared surface, no seam, 10–12px top radius, small shoulder). Inactive tabs stay dark blue-grey and read as 1–2px recessed.

## Sidebar

Colour only: shift the near-black navy to a softer blue-grey navy (#1B2D3D family, near-flat tonal shift), active item as a soft slate raised surface with a thin metallic gold indicator. Width, order, links and branding unchanged.

## Typography and gold

Serif reserved for the booking name and selected editorial numbers/dates. Everything else uses the existing sans stack. Gold only on the primary action, the current timeline step, tiny separators and small icons.

## Technical notes

- Edits confined to `src/routes/bookings.$bookingId.tsx` (Overview branch and its local palette/primitives), `src/components/BookingWorkspaceHeader.tsx` (hero + folder tab shape), and the sidebar colour tokens used by `src/components/GlobalSidebar.tsx`. Other tabs render through the same header, so their surrounding chrome updates consistently while their content is untouched.
- New Overview sub-components (raised card, inset card, vertical timeline, summary strip) extracted into a `src/features/booking-workspace/` folder to keep the route file from growing, following the refactor pattern already used elsewhere.
- No schema, query, mutation or route changes; no mock data introduced.
- Verification: Playwright pass over the Overview tab at 1440 / 1024 / 768 / 390 plus a click-through of every tab, action link and edit panel to confirm nothing broke.
