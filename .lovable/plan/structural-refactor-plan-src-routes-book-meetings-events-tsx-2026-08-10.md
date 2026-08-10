# Structural refactor plan — src/routes/book-meetings-events.tsx

Same philosophy as manage-bookings and book-leisure: move top-level declarations into feature modules, change nothing else. No JSX, className, style, CSS, copy, data-flow, state, routing, behaviour, or performance changes. No cleanup beyond what the move mechanically requires.

Current file: **7,324 lines**, one route + 60 top-level declarations.

## 1. Proposed file structure

```text
src/features/me/
  tokens.ts                     SERIF, SANS, GOLD, NAVY, NAVY_DEEP
  types.ts                      FormState
  data.ts                       NAV_LINKS, TRUST, STEPS, DRAFT_KEY
  shell/
    VellumSwitcher.tsx          VellumSwitcher + VellumVariantOpt
    StepProgress.tsx            StepProgress
    HelpCard.tsx                HelpCard
  common/
    buttons.tsx                 NextButton, ContinueButton
    dividers.tsx                GoldStarDivider, PremiumDivider, GoldDivider
  step1/                        (Event details form — renders at step 6)
    StepOne.tsx                 StepOne
    AccountPrefillPanel.tsx     AccountPrefillPanel
    Field.tsx                   Field
  step2/                        (Location)
    data.ts                     Destination, CountryCode, COUNTRIES,
                                DESTINATIONS_BY_COUNTRY, SearchableDestination,
                                ALL_SEARCHABLE_DESTINATIONS, BudgetTier
    flags.tsx                   FlagNO, FlagSE, FlagDK, FlagFI
    BudgetPreference.tsx        BudgetPreference
    StepTwoLocation.tsx         StepTwoLocation
  step3/                        (Accommodation)
    types.ts                    RoomMix, MealPlan, Stay
    stay.ts                     emptyRooms, fmtDate, roomsSummary,
                                roomsTotal, guestsCapacity
    icons.tsx                   AccommodationIcon, PremiumRoomIconDefs,
                                SingleRoomIcon, DoubleRoomIcon,
                                TripleRoomIcon, TwinBedsIcon, LuxIconBadge
    parts.tsx                   DateField, Counter, RoomRow, MealOption,
                                SummaryRow, ROOM_CATEGORY_OPTIONS
    StepThreeAccommodation.tsx  StepThreeAccommodation
  step4/                        (Catering)
    data.ts                     CateringId, CateringDef, CATERING_DEFS,
                                HOTEL_LOCATIONS, CateringServing,
                                MeetingRoomLite, DIETARY_OPTIONS, DRINK_OPTIONS
    parts.tsx                   CateringCarousel, SquareCheckbox
    StepFourCatering.tsx        StepFourCatering
  step5/                        (Extras)
    data.ts                     ExtraId, ExtraDef, EXTRAS_DEFS,
                                ExtraConfigs, DEFAULT_CONFIGS, summaryFor
    parts.tsx                   RadioOption, CheckOption, FieldLabel,
                                inputStyle, NumberStepper, DoneButton
    configs.tsx                 ConfigAirportTransfer, ConfigCoachParking,
                                ConfigRegistration, ConfigPackage,
                                ConfigPorter, ConfigCloakroom, ConfigWelcome
    cards.tsx                   ExtraCard, ExtraAccordion
    StepFiveExtras.tsx          StepFiveExtras
  step7/                        (Review & submit)
    StepSevenReview.tsx         StepSevenReview
  legacy/
    StepPlaceholder.tsx         StepPlaceholder (currently unreferenced; kept
                                verbatim, not deleted — deletion is cleanup)
```

Step 3 in the UI (Meeting Spaces) already lives in `src/components/StepThreeMeetingSpaces.tsx` and is untouched.

## 2. Exact declarations that move

Every top-level declaration in the file except those listed in section 3. Grouped as in the tree above: 5 token constants, 4 data constants, 1 form type, 3 shell components, 3 divider/button modules, and the six step families (types, data, helpers, sub-components, screen component) totalling roughly 60 declarations.

Asset imports move with their only consumer:
- `extras/*.jpg` (7) → `step5/data.ts`
- `rooms/*.jpg` (7) → `step3/` (icons/parts as used)
- `destinations/*.jpg` (28) → `step2/data.ts`
- `catering/*.jpg` (9) → `step4/data.ts`
- `heroAsset`, `helpCardBgAsset`, `loungeImg` (+ its `void loungeImg`) stay with their consumers: hero in the route, help-card background in `shell/HelpCard.tsx`.

## 3. What stays in book-meetings-events.tsx

- `Route = createFileRoute("/book-meetings-events")` with its `head()` block, unchanged.
- The whole `BookMeetingsEvents()` function (currently lines 195–1164), byte-identical: all `useState`/`useEffect` hooks, the vellum variant state and its two localStorage effects, draft restore/persist, the `setMeSection("eventDetails", …)` effect, `go`, `validateStep1`, `handleNext`, the `paperGrain`/`plasterTexture` strings, the inline background-recipe IIFE, and the entire returned JSX (hero, header, nav, progress, step switch, footer).
- Its imports, reduced to what the remaining code references plus the new `@/features/me/**` imports.

The main component's JSX is **not** split. Its header, hero and footer subtrees close over local state (`mobileOpen`, `step`, `vellum`, `accountLabel`, `direction`), so lifting them into new components would mean writing new props interfaces — that is a rewrite, not an extraction, and it is excluded.

## 4. Mechanical changes required

For each moved declaration, exactly four operations:
1. Cut the declaration verbatim into its new file.
2. Add `export` to it.
3. Add, at the top of the new file, the imports it needs (React, lucide icons, assets, `cn`, `@/lib/*`, sibling feature modules) — copied from the route's existing import list, no substitutions.
4. Add the matching named import back in every file that references it.

Local shadowing is preserved as-is: `StepSevenReview` defines its own `GOLD`/`NAVY`, and `BookMeetingsEvents` defines a local `VellumVariant` type. Neither is unified with `tokens.ts`.

No signature changes, no prop renames, no default-value changes, no converting function declarations to arrows, no reordering of JSX attributes.

## 5. Risk level per extraction

| Extraction | Risk | Note |
| --- | --- | --- |
| tokens.ts, types.ts, data.ts | Very low | Plain constants |
| step2/data.ts, step4/data.ts, step5/data.ts | Very low | Constants + asset imports |
| step3/stay.ts, step3/types.ts | Very low | Pure functions |
| dividers, flags, room icons | Very low | Stateless SVG |
| buttons, HelpCard, Field | Low | Stateless, props-only |
| step5 parts / configs / cards | Low | Controlled props only |
| step3 parts, step4 parts | Low–medium | `DateField`, `CateringCarousel` hold local state and refs; contained |
| StepProgress, VellumSwitcher | Medium | Rendered directly by the route; verify props wiring |
| StepOne + AccountPrefillPanel | Medium | Reads auth/profile, writes parent `form` state |
| StepTwoLocation, StepFourCatering | Medium | ~540 and ~875 lines with `setMeSection` writes |
| StepThreeAccommodation | High | ~555 lines, largest local state surface |
| StepSevenReview | High | ~1,050 lines; auth, Supabase, `createBooking`, navigation |

## 6. Dependency map

```text
tokens.ts ─────────────► every step module + route
types.ts (FormState) ──► step1/StepOne, route
data.ts ───────────────► route (NAV_LINKS, TRUST, STEPS, DRAFT_KEY)

route ──► shell/VellumSwitcher, shell/StepProgress, shell/HelpCard,
          step1/StepOne, step2/StepTwoLocation,
          step3/StepThreeAccommodation, step4/StepFourCatering,
          step5/StepFiveExtras, step7/StepSevenReview,
          components/StepThreeMeetingSpaces (existing, unchanged)

step1/StepOne ──► AccountPrefillPanel, Field, common/buttons
step2/StepTwoLocation ──► step2/data, step2/flags, BudgetPreference,
                          common/dividers (GoldStarDivider),
                          common/buttons (ContinueButton)
step3/StepThreeAccommodation ──► step3/{types,stay,icons,parts}
step4/StepFourCatering ──► step4/{data,parts}
step5/StepFiveExtras ──► step5/{data,parts,configs,cards}, shell/HelpCard
step7/StepSevenReview ──► lib only (useMeDraft, auth, bookingsApi,
                          pendingRequest, supabase) + tokens
```

No cycles. `shell/HelpCard` is the only module with two consumers (route and step5).

## 7. Recommended checkpoint order

Each checkpoint ends with `tsgo` clean and the app rendering.

1. `tokens.ts`, `types.ts`, `data.ts`
2. `common/dividers.tsx`, `common/buttons.tsx`, `shell/HelpCard.tsx`
3. `step5/*` (most self-contained large step)
4. `step4/*`
5. `step2/*`
6. `step3/*`
7. `step1/*`
8. `shell/VellumSwitcher.tsx`, `shell/StepProgress.tsx`, `legacy/StepPlaceholder.tsx`
9. `step7/StepSevenReview.tsx` (highest risk, done last against a stable base)
10. Prune now-unused imports from the route only

## 8. Verification plan

Same rigor as book-leisure.

**Baseline first, before any edit:** a Playwright script walks all 7 steps at 1440 / 1280 / 768 / 390 px and, per step+width, records a screenshot plus a geometry JSON (bounding boxes of every element, heading text, element-type counts) into `/tmp/browser/me/baseline/`. Also captured with the extras/catering/accommodation panels expanded, since much of the surface is behind accordions.

**After the refactor:** re-run into `/tmp/browser/me/after/`, then:
- geometry JSON must be diff-empty across all 28 captures;
- screenshots diffed pixel-wise; only sub-pixel antialiasing on borders is acceptable, anything else is investigated;
- console and pageerror listeners must record zero errors or warnings on every run.

**Interaction pass** (1440 px): country switch and destination search on Location; budget selection; add/edit a stay, date field auto-behaviour, room counters and meal plan on Accommodation; catering item select, servings, dietary and drink options; extras select, accordion configure, Done; Event Details validation (empty submit shows the required errors, valid input advances); Review renders each populated section and the Edit links jump to the right step. Draft persistence checked by reloading mid-flow and confirming step and form restore.

**Static checks:** `tsgo` clean; a grep confirming no moved identifier is still declared in the route; a diff-based check that every moved declaration's body is byte-identical to the original.

**Not run:** any change to `StepThreeMeetingSpaces.tsx`, `meDraftStore`, `bookingsApi`, or CSS.

## 9. Estimated final line count

`src/routes/book-meetings-events.tsx`: **~1,050 lines** (from 7,324).

Breakdown: ~35 lines of imports, ~20 lines of route/head, ~970 lines of the untouched `BookMeetingsEvents` function, ~25 lines of spacing. Largest new file: `step7/StepSevenReview.tsx` at ~1,050 lines.

The route stays larger than book-leisure's 757 because the main component's own JSX is intentionally left whole.

## 10. Highest-risk areas and why

1. **StepSevenReview (~1,050 lines)** — the only place that submits. It touches auth, `upsertProfile`, `createBooking`, `savePendingRequest`/`clearPendingRequest`, Supabase and navigation, and it shadows `GOLD`/`NAVY` locally. If the shadowed constants are accidentally replaced by the shared tokens the whole review panel shifts colour. It also has the most branches driven by draft contents, so screenshot coverage alone under-tests it — the interaction pass matters most here.
2. **StepThreeAccommodation (~555 lines)** — biggest local state surface (stay list, room mix, dates, meal plan) with `setMeSection` writes on change, and it depends on four sibling modules at once. Highest chance of a missed import or a helper landing in the wrong file.
3. **StepFourCatering (~875 lines)** — long, with a stateful carousel and many option arrays; easy to split at the wrong boundary between screen and data.
4. **StepProgress and VellumSwitcher** — small but rendered directly by the route and controlling what the user sees at all; a wiring slip is immediately visible on every step.
5. **The 51 asset imports** — moving them to consumer modules is the least interesting and most error-prone part: one image assigned to the wrong module produces a silently broken card rather than a type error, which is why the screenshot diff must cover expanded accordions.
