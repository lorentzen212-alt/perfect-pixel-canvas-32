# Step 2 – Location (M&E)

Implement a real `StepTwoLocation` component in `src/routes/book-meetings-events.tsx` matching the reference. Steps 1 and 3–7 unchanged.

## Scope

Only `src/routes/book-meetings-events.tsx` is modified. No new routes, no changes to Leisure flow, homepage, hero, progress bar, credibility bar, or footer benefits.

## Routing inside the page

In the step-body slot (currently lines ~282–293):

- `step === 1` → existing `StepOne`
- `step === 2` → new `StepTwoLocation`
- `step >= 3` → existing `StepPlaceholder`

## New `StepTwoLocation` component

Layout: single premium white panel (`bg-rgba(255,255,255,0.72)`, `1px solid #E7EAF0`, radius 10px) inside the existing main card.

Content:

1. Header row (2 columns on desktop, stacks on mobile):
   - Left: "Step 2 – Location" (Cormorant Garamond) + "Where would you like to host your event?" subtitle
   - Right: "Select country" label + country dropdown (Norway default, Norwegian flag, chevron)

2. "Popular destinations in {country}" grid:
   - Desktop 4 cols / tablet 2 cols / mobile 1 col
   - 8 cards in this order: Oslo, Bergen, Tromsø, Stavanger, Trondheim, Bodø, Lofoten, Anywhere in Norway
   - Cards 1–7: image bg + bottom navy gradient + white icon + white name
   - Card 8 ("Anywhere in Norway"): solid navy + white globe icon
   - Selected: 2px gold border (#F5AE00) + soft shadow. Hover: subtle scale + elevation.

3. Lower two-column area (desktop `1fr 320px`, stacks on mobile):
   - Left column:
     - "Or search for any destination" label + search input with left search icon, placeholder "Type city, region or venue"
     - "Hotel category" row: ★★★ / ★★★★ / ★★★★★ / No preference (single-select, gold border when selected; "No preference" always uses gold outline + gold ban icon)
     - "Hotel style" row: City hotel, Waterfront, Airport, Resort, Historic hotel, Boutique, No preferences (7 tiles with lucide icons; selected tile = navy gradient bg + white text + gold icon)
   - Right column: existing `HelpCard` reused inside a small white sub-card matching current styling

4. Footer row inside the panel:
   - Back button (white, grey border, navy text) → `go(1)`
   - `NextButton` (existing gold component) → `handleNext()` which advances to step 3

## State (inside `StepTwoLocation`)

Local `useState` for: `country` (default `"NO"`), `destination` (string | null), `searchQuery` (string), `category` (`"3"|"4"|"5"|"none"` | null), `style` (string | null). No form submission wiring yet.

## Data structures

```ts
const COUNTRIES = [{ code: "NO", name: "Norway", flag: <FlagNO/> }]; // extendable
const DESTINATIONS_BY_COUNTRY: Record<string, {name:string; image:string; icon:LucideIcon}[]> = { NO: [...] };
const HOTEL_STYLES = [
  { id: "city", label: "City hotel", icon: Building2 },
  { id: "waterfront", label: "Waterfront", icon: Waves },
  { id: "airport", label: "Airport", icon: Plane },
  { id: "resort", label: "Resort", icon: Palmtree },
  { id: "historic", label: "Historic hotel", icon: Landmark },
  { id: "boutique", label: "Boutique", icon: Gem },
  { id: "none", label: "No preferences", icon: Ban },
];
```

## Destination images

Generate 7 destination images via `imagegen--generate_image` (fast tier, ~800×600 jpg) into `src/assets/destinations/`:

```text
oslo.jpg, bergen.jpg, tromso.jpg, stavanger.jpg,
trondheim.jpg, bodo.jpg, lofoten.jpg
```

Import each as an ES6 asset and reference via `image`. "Anywhere in Norway" uses no image (navy tile + `Globe` icon).

## Icons (lucide-react)

`ChevronDown`, `Search`, `Building2`, `Waves`, `Plane`, `Palmtree`, `Landmark`, `Gem`, `Ban`, `Globe`, `Star` (for category rows).

## Styling rules

- Card: `#FCFCFB`, `1px solid rgba(15,35,60,0.08)`, radius 20, `0 22px 70px rgba(4,25,48,0.14)`.
- Inputs / option buttons: white, `1px solid #DFE4EB`, navy text, hover slightly darker border, selected `border-[#F5AE00]`, `focus-visible:ring-2 ring-[#F5AE00]/40`, no default blue ring.
- Selected hotel-style tile: `linear-gradient(180deg,#16385A,#0F2A47)`, white text, gold icon, soft shadow.
- Everything accessible: real `<button>` elements, `aria-pressed`, visible focus.

## Responsive

- Destinations: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Lower area: single column below `lg`, `1fr 320px` at `lg+`
- Hotel style row: horizontal scroll disabled; wraps via `grid-cols-2 sm:grid-cols-3 lg:grid-cols-7`

## Verification

After implementation, curl `http://localhost:8080/book-meetings-events`, then advance to step 2 in a Playwright script and screenshot the panel to confirm layout matches the reference.
