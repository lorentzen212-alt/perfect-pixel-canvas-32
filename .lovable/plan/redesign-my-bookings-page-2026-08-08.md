# Redesign: My Bookings page

Rebuild the visuals of the existing `/manage-bookings` page to match the reference image. Same route, same data, same actions — only the presentation layer changes.

## Layout, top to bottom

```text
[ sidebar ]  [ cinematic lobby hero  ~320px ]
             [ 4 status cards overlapping hero bottom ]
             [ stone workspace plate
                 tabs (Active / Cancelled / All)   List | Map | view
                 search + Status / Country / Arrival / Clear
                 booking cards, stacked
             ]
```

## What changes

**Hero** — existing warm lobby image, ~300–340px, `object-fit: cover`, left-to-right navy gradient so only the left side darkens. Eyebrow `DASHBOARD`, serif `My Bookings`, subline "Stay on top of every group, every stay." Existing bell, avatar, name, role and dropdown stay, restyled compact on the right.

**Status cards** — four cards pulled up so they straddle the hero's lower edge: Awaiting response, Proposal ready (gold border + "Action needed" pill, the visual lead), Confirmed, Total bookings. Counts stay derived from the live booking list, never hardcoded. Each gets a quiet footer link (View bookings →, etc.) wired to the matching tab/filter.

**Stone workspace** — one large light mineral plate (#D9D7D2 base, faint CSS tonal variation, 1px light border, soft large shadow, 16–18px radius) that all tabs, filters and booking cards sit inside.

**Tabs & filters** — compact pills with real counts; active tab dark navy with a thin champagne border. Search takes ~half the row with a ⌘K hint; Status / Country / Arrival selects, filter icon and Clear on the right in warm ivory, dark charcoal text, slightly inset.

**Booking cards** — long horizontal navy panels (~165–185px, 14–16px radius, 12–14px gaps):
- built-in metallic gold insert on the left edge, 8–12px, stopping before the corners
- destination image ~240×145, 8–10px radius, thin gunmetal border, inset feel
- LEISURE / MICE pill, serif booking name, one metadata row (flag + city, dates, nights, rooms, guests)
- YOUR REFERENCE + code with copy button, then the short activity line
- top-right status pill (muted blue / emerald / champagne) and the existing three-dot menu
- HOTEL REFERENCE block (hotel name or "Pending")
- thin four-node progress tracker: Request received → Hotels sourcing → Proposal ready → Confirmed
- `View status →` button, navy with thin gold border and gold text

**Sidebar** — restyled to the reference: deep navy tonal background, ivory active pill with navy text and a small gold accent for My Bookings, thin-line icons, subtle Nordic mountain tone toward the bottom, Log out pinned at the base.

**Motion** — hover `translateY(-2px)` on booking and status cards, border/lightness transitions only, 180–250ms.

**Responsive** — tablet: narrower sidebar, status cards 2×2. Mobile: sidebar drawer, status cards 2×2, booking card stacks vertically, filters collapse, shorter hero.

## Technical notes

- All work stays in `src/routes/manage-bookings.tsx` plus its sidebar styling. No new routes, no other page touched.
- Preserved as-is: auth redirect, `useQuery`/`fetchBookings`, pending-request → `createBooking` handoff, `cancelBooking`, `filterBookings`, country/group helpers, row menu, and every `Link`/`navigate` target (booking workspace, rooming, account, auth).
- The shared `GlobalSidebar` is used by other booking pages, so its nav items keep their current labels and order; only the visual treatment on this page is adjusted, with no item added or removed.
- Colors, typography (Cormorant Garamond headings / Inter UI) and gold gradients come from the spec's token list, applied through the page's existing constant block.
- After building, the rendered page is compared side by side against the reference and spacing/sizing/alignment gaps are corrected.
