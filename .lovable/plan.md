# Prompt for Base44 — Recreation of HotelGroupBook

Kopier teksten under ( mellom strekene ) og lim inn i Base44.

---

## Prompt

Build a fully responsive, production-ready web application called **HotelGroupBook** — a luxury group-hotel booking platform for the Nordic travel market. The app handles group leisure bookings, meetings & events bookings, and a full booking-management dashboard. Tech stack: React (TypeScript), Supabase (auth + database with Row-Level Security), Tailwind CSS v4. Use TanStack Router for routing and TanStack Query for data fetching.

### Design system

**Theme:** Dark, cinematic, premium — inspired by Scandinavian luxury hospitality.
**Background:** Deep navy-black `#0D1720` / `#031622` / `#04111A`.
**Primary accent:** Champagne gold `#F5AE00` (icons, highlights), deep gold `#C5A24B` / `#C7A34A` (borders, UI accents).
**Surface tones:** Soft white `#E8E8E4`, warm ivory `#F5F1EB` / `#F8F4ED` for light sections.
**Fonts:** Playfair Display / Cormorant Garamond (serif headings), Inter (body text). Load via Google Fonts `<link>` in the document head.
**Card materials:** Anodized-aluminium navy panels (Scandinavian blue matte gradient `#24445E → #1C374D`), machined/recessed cards with beveled edges, metallic gold edge strips, fractal noise stone textures.
**Motion:** Cinematic fade-ins, crossfade hero images on hover, shimmer animations on toggles, route transitions.

### Pages & routes

#### 1. Homepage (`/`)
- Full-screen background video (cinematic Nordic scenery) with a dark vignette overlay; falls back to a still poster on small screens or reduced-motion.
- Top navigation bar with logo (HotelGroupBook) and menu links: Book Leisure, Book Meetings & Events, Manage Bookings, About Us, How It Works, Become a Partner, Support, Contact.
- Centered hero with a serif headline; thin gold lines (`#FFC400`) with small diamond shapes above and below the heading. The phrase "made simple" in italic.
- Three overlapping category cards (Leisure, Meetings & Events, Manage) that overlap the hero by ~38%. Each card: dark glass-like background, image, title bottom-left, CTA button bottom-right with a metallic gold border.
  - "Book Leisure" card is clickable → navigates to `/book-leisure`.
  - "Book M&E" card is clickable → navigates to `/book-meetings-events`.
  - "Manage" card is clickable → navigates to `/manage-bookings`.
- **HOW IT WORKS** section (light background, 3–4 steps with custom gold-gradient SVG icons).
- **POPULAR GROUP DESTINATIONS** — navy grid with 6 Nordic destination cards (Lofoten, Tromsø, Bergen, Geiranger, Stockholm, Copenhagen) using real photos.
- **WHY CHOOSE** section (light) with 4 trust badges (No commitment, Fast & free, Expert support, Secure & trusted).
- **FINAL CTA** (navy) with a gold-bordered button.
- **FOOTER** (navy) with logo, social icons (LinkedIn, Facebook, Instagram), and navigation columns.

#### 2. Book Leisure wizard (`/book-leisure`)
A multi-step cinematic booking journey (6 steps). Gold step-progress indicator. Draft auto-saves to Supabase; show emerald-green "✓ Saved" badges instead of "Draft" labels. A "Concierge Mode" toggle with shimmer animation. Right-side summary panel showing "Your itinerary" that updates live.

- **Step 1 — Destination & Dates:** Hero image, destination search/autocomplete, date range picker (check-in auto-sets check-out to next day and closes calendar), number of rooms and guests.
- **Step 2 — Accommodation:** 3-column editorial layout. Room-type cards on Soft Stone (`#F8F5F0`) background with 1px champagne dividers. Each card shows room image, type (Single, Double, Twin, Triple, Family, Accessible), quantity steppers, occupancy, meal plan selector. Minimal gold disclaimer text. Tightened vertical spacing.
- **Step 3 — Dining:** Meal plans, special dietary requirements (vegetarian, vegan, halal, kosher, gluten-free, nut-free, etc.) with toggle chips, half-board / full-board options.
- **Step 4 — Experiences:** Horizontal editorial experience cards with a hero image that crossfades on hover. Featured experience card with spotlight gradient and small badge. Right summary panel "Your itinerary".
- **Step 5 — Guest Details:** Simplified country selector (optional). Contact name, email, phone. Black & gold hero image.
- **Step 6 — Review:** Soft Ivory (`#F5F1EB`) background. Deep navy summary panel with gold monogram. Full itinerary recap. Submit button — requires authentication (if not logged in, redirect to `/auth?next=/book-leisure` and save pending request). On submit, create a booking in Supabase with a generated reference like `HGB-2026-00100`.

#### 3. Book Meetings & Events wizard (`/book-meetings-events`)
Similar multi-step wizard for M&E bookings: Step 1 (Event details — delegates, dates, city), Step 2 (Meeting spaces — theater, classroom, U-shape, banquet, cocktail layouts with capacity), Step 3 (Accommodation — rooms for delegates), Step 4 (Catering — coffee breaks, lunches, dinners, gala), Step 5 (AV & equipment), Step 6 (Review & submit). Same auth-at-submit pattern and draft persistence as Leisure.

#### 4. Authentication (`/auth`)
- Modes: Sign in, Sign up, Magic link, Password reset.
- Dark navy theme (`#132B44`) with gold (`#C5A24B`) accents.
- Fields with uppercase labels, gold focus borders.
- On success, redirect to `next` param (defaults to `/manage-bookings`).
- Support `?mode=signup` and `?next=/path` search params.
- Password reset page at `/reset-password`.

#### 5. Account / Profile (`/account`)
- User profile form: first name, last name, email (read-only), company name, phone, country.
- Navy card background (`#1B3550`), gold-bordered fields.
- Save updates Supabase `profiles` table.

#### 6. Manage Bookings dashboard (`/manage-bookings`)
- Atmospheric mountain backdrop hero with background video.
- Two-column layout: collapsible left sidebar + main content.
- **Sidebar** (GlobalSidebar): Logo, primary nav (Dashboard, My Bookings, Rooming Lists, Documents, Messages), secondary nav (Profile, Settings, Support), user info with sign-out. Navy gradient background with glow texture.
- **Main area:** Booking list on a solid graphite-grey backing plate (`#3F464E`). Cards are "machined" 3–4px into the plate with precise bevels (no floating shadows). A metallic gold strip stays flush inside each recessed card pocket.
- Each booking card: reference (`HGB-2026-00100`), booking type (Leisure / M&E), destination, dates, status badge, room/guest counts. Click → navigates to `/bookings/$bookingId`.
- Status filters (All, Request submitted, Proposal received, Awaiting signing, Confirmed, Cancelled). Active list excludes cancelled bookings.
- Booking cancellation with confirmation dialog.
- Requires authentication (redirect to `/auth` if not signed in).

#### 7. Booking Workspace (`/bookings/$bookingId`)
- Shared `BookingWorkspaceHeader` with a cinematic masthead (hero image, booking reference, breadcrumbs), and folder-style tab navigation.
- **Tabs:** Booking Overview, Changes, Documents, Messages, Notes, Rooming List.
- **Booking Overview:** Stay details, hotel info, room distribution, dining summary, services. Navy panels in anodized-aluminium material.
- **Changes:** 5-state status tracker (Request → Proposal → Negotiation → Confirmed → Completed), quick-action cards, historical change request ledger with comparison table.
- **Documents:** Dark navy library panel, searchable document table, category cards, document distribution donut chart, upload zone.
- **Messages:** Three-column chat — dark navy conversation list with filters, active chat feed (gold bubbles for user, navy for hotel), right column with contact/booking details. PDF attachment support.
- **Notes:** Knowledge hub — searchable/filterable note ledger (List or Compact views), category badges, priority indicators, pinning, slide-over edit panel. Right column: category donut chart, pinned notes, recent activity timeline.
- **Rooming List** tab → links to `/roomings/$bookingId`.

#### 8. Rooming List Workspace (`/rooming/$bookingId`)
- Palette: 80% warm ivory (`#F8F4ED`), 20% dark navy.
- Three-column layout for rooming modules.
- KPI bands and section headers in navy.
- Room allocation grid: assign guests to rooms, room types, occupancy, special requests.
- Upgrade Mode toggle: request room upgrades with draft syncing.
- Rooming progress indicator (unassigned / assigned / complete).
- Guest management: name, nationality, email, phone, special requests.

#### 9. Rooming List (legacy) (`/rooming-list/$bookingId`)
- Paper-sheet background with metallic binder-clip styling.
- Same rooming functionality in a lighter visual style.

### Backend (Supabase)

**Tables with Row-Level Security:**
- `user_roles` (enum: admin, staff, customer) — security definer `has_role()` function.
- `profiles` (user_id, first_name, last_name, email, company_name, phone, country).
- `bookings` (id, user_id, reference `HGB-YYYY-NNNNN`, booking_type enum, status, name, destination, dates, rooms, guests, delegates, contact JSONB, request JSONB, cancelled_at, timestamps).
- `booking_rooms` (room types, quantities, occupancy, meal plans, check-in/out).
- `booking_allocations` (guest-to-room allocations, upgrade requests).
- `booking_guests` (guest details, nationality, requirements).
- `site_edits` (for the Instant Edits feature — key/value CSS overrides).

**Policies:** Users manage their own bookings/rooms/guests/allocations. Staff/admin can read all. Admins can update all. Use `owns_booking()` and `can_read_booking()` security-definer helper functions.

**Auth flow:** Email + password, magic link, password reset. No anonymous sign-ups. Google OAuth configured. On booking submit, if not authenticated → save pending request to localStorage, redirect to auth, restore after login.

### Extra features

- **Instant Edits:** A floating button that opens a panel for on-the-fly CSS styling (colors, spacing, fonts). Changes persist to Supabase `site_edits` table and apply site-wide via a `SiteEditsApplier` component.
- **Design Mode:** A hidden visual editing mode (toggled via keyboard shortcut) that lets you select, drag, resize, and reposition individual elements — similar to Figma/Webflow element editing. ESC cancels selection. "Done" exits the mode.
- **Liquid cursor hover:** A subtle cursor-following hover effect on interactive elements.
- Fully responsive (mobile, tablet, desktop). Background video disabled on small screens with poster fallback.

### SEO
Each route has unique `<title>`, meta description, og:title, og:description, og:type, and twitter:card. Single H1 per page. Semantic HTML. Lazy-loaded images.

---
