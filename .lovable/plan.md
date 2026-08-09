# One shared HotelGroupBook logo, taken from the Manage sidebar

The Manage Your Bookings sidebar renders the brand mark inline in `src/components/GlobalSidebar.tsx` (lines 173-217): an "HGB" rounded badge plus the wordmark "Hotel" + gold-gradient "Group" + "Book", with a collapsed state that shows only the badge. That exact markup becomes the single source of truth.

Everywhere else the site currently uses a different mark: an old PNG asset (`hotelgroupbook-logo.png`), a separate badge+text block, or plain gold text.

## What will be done

1. **Extract, don't redesign** — move the sidebar's existing logo markup verbatim into `src/components/BrandLogo.tsx`, then have the sidebar render `<BrandLogo />`. Sidebar output stays pixel-identical, including the collapsed badge-only behaviour and existing sizes.

2. **Component API** (layout-only knobs, no new visual designs):
   - `variant`: `full` (badge + wordmark) or `badge` (collapsed).
   - `size`: `sm` / `md` / `lg` — badge box and wordmark scale together, `md` matching the sidebar exactly.
   - `tone`: `dark` (white wordmark, for navy/dark surfaces — the sidebar default) or `light` (ink wordmark for ivory/white surfaces). The badge and gold "Group" gradient are unchanged in both.
   - Optional `className`; it does not wrap its own link, so each page keeps its existing `Link to="/"`.

3. **Replace the other logos** with `<BrandLogo />` inside the existing link/wrapper elements, keeping current positions and heights:
   - `src/routes/index.tsx` — hero header (large, dark tone) and footer (dark tone).
   - `src/components/BookingHeader.tsx` — booking step header (dark tone), dropping the `brightness(0) invert(1)` PNG hack.
   - `src/routes/book-meetings-events.tsx` — top bar.
   - `src/routes/book-leisure.tsx` — top slim bar (light tone, ivory background).
   - `src/components/DashboardChrome.tsx` — both sidebar variants (dark and light navy).
   - `src/routes/auth.tsx` and `src/routes/reset-password.tsx` — replace the plain gold "HotelGroupBook" text link with the small logo.

4. **Clean up** — remove now-unused `hotelgroupbook-logo.png` imports from the files above. The asset file itself stays on disk (harmless), but nothing renders it any more.

## Not touched

Sidebar design, navigation, layouts, heroes, backgrounds, booking/dashboard cards, buttons, and all typography and spacing outside the logo element itself.

## Verification

Screenshot the Manage sidebar (expanded and collapsed) before/after to confirm it is unchanged, then check the homepage, booking flows, workspace and auth pages all render the same mark.
