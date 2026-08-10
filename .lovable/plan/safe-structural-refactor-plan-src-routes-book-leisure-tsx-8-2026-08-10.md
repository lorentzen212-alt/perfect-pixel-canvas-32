# Safe structural refactor plan — src/routes/book-leisure.tsx (8,543 lines)

Same philosophy as the manage-bookings refactor: literal code transplant only. No JSX, className, style, token, copy, state, data or routing changes.

## 1. Proposed file structure

```text
src/features/leisure/
  tokens.ts                 shared + per-step design constants
  data.ts                   countries, cities, rooms, extras, experiences, destinations, images
  types.ts                  CountryCode, StepKey, LeisureStay, Destination, ExpItem, ExtraGroup,
                            ConciergeOption/Category, Step3Context, Step4Exp
  stay.ts                   stay helpers (nights, totals, formatting, empty drafts)
  legacy/                   the pre-redesign flow pieces still referenced by BookLeisure
    LegacySteps.tsx         HeroPanel, ChapterTrack, StepDestination, StepAccommodation,
                            StepExtras, StepExperiences, StepContact, StepReview, ReviewCard, Row
    ConfirmationScreen.tsx
    primitives.tsx          Label, Field, Counter, Toggle, PrimaryButton
  shell/
    LeisureStepShell.tsx    shell + DarkCheckbox, RoomCounter
  step1/
    Step1Screen.tsx         LeisureStep1Screen
    CountrySelector.tsx, DestinationCarousel.tsx, SearchSection.tsx
  step2/
    Step2Screen.tsx         LeisureStep2Screen
    cards.tsx               S2CompletedStayCard, S2AddStayCard, S2StayCard
    parts.tsx               S2DiamondRule, S2LuxeStat, S2StayDivider, S2StayInfo, S2Metric,
                            S2DateField, S2RoomCard, S2CategorySelect, S2Counter, MoonIcon, roomIcon
    AccommodationSummary.tsx
    scroll.ts               smoothScrollToElement
  step3/
    Step3Screen.tsx         LeisureStep3Screen
    SmartConfigPanel.tsx    SmartConfigPanel + SCField, SCInput, SCTextarea, SCRadioRow, SC_* consts
    concierge.ts            CONCIERGE_CATEGORIES, TRANSPORT/PORTER/SMART sets, CITY_AIRPORT,
                            nearestAirportFor, contextArrivalISO, contextDepartureISO
  step4/
    Step4Screen.tsx         LeisureStep4Screen + STEP4_CATEGORIES, STEP4_EXPERIENCES, S4_HERO
  step5/
    Step5Screen.tsx         LeisureStep5Screen
    fields.tsx              S5FieldLabel, S5Input, S5Decoration, s5FieldStyle, S5_* consts,
                            PHONE_COUNTRIES, S5_COUNTRIES
  step6/
    Step6Screen.tsx         LeisureStep6Screen
    parts.tsx               S6LuxCard, S6Panel, S6Bullet, S6ReviewRow, S6_* consts,
                            CITY_HERO_MAP, ROOM_TITLE
src/routes/book-leisure.tsx  route definition + BookLeisure orchestrator only
```

## 2. What moves (by current line region)

| Region | Contents | New home |
|---|---|---|
| 116–176 | SERIF, IVORY, NAVY, GOLD… HERO, ROOM_IMG, EXP_IMG | tokens.ts / data.ts |
| 182–263 | CountryCode, COUNTRIES, CITIES, ROOMS, EXTRAS, EXPERIENCES, EXP_CATEGORIES | types.ts + data.ts |
| 269–308 | StepKey, STEP_META | types.ts + data.ts |
| 885–1620 | HeroPanel, ChapterTrack, Step* legacy screens, ReviewCard, Row | legacy/LegacySteps.tsx |
| 1626–1731 | ConfirmationScreen | legacy/ConfirmationScreen.tsx |
| 1737–1884 | Label, Field, Counter, Toggle, PrimaryButton | legacy/primitives.tsx |
| 1890–2028 | S1_* consts, all `@/assets/leisure/*` imports, DEST_IMG, ANYWHERE_IMG, NORWAY_TILES, COUNTRY_FLAG_EMOJI, Destination, makeDest, DESTINATIONS, ALL_DESTINATIONS | step1 tokens/data |
| 2034–2525 | CountrySelector, DestinationCarousel, SearchSection, LeisureStep1Screen | step1/* |
| 2532–2567 | S2_HERO, STEP2_ROOMS, ROOM_CATEGORY_OPTIONS, defaultDraftCategories | step2 data |
| 2570–2880 | LeisureStepShell, DarkCheckbox, RoomCounter | shell/LeisureStepShell.tsx |
| 2886–2987 | LeisureStay, GUESTS_PER_ROOM, ROOM_LABELS, STEP2_ROOMS_ORDER, emptyDraftRooms, stayNights, stayRoomsTotal, stayGuestsTotal, fmtStayRange, S2_* consts, DRAFT_REMOVE_ID | types.ts + stay.ts + tokens.ts |
| 2989–5342 | LeisureStep2Screen and all S2* sub-components, smoothScrollToElement, AccommodationSummary | step2/* |
| 5351–5951 | S3_* consts, concierge data/types/helpers, SC* primitives, SmartConfigPanel | step3/* |
| 5953–6408 | LeisureStep3Screen | step3/Step3Screen.tsx |
| 6410–7202 | S4_HERO, STEP4_CATEGORIES, Step4Exp, STEP4_EXPERIENCES, LeisureStep4Screen | step4/* |
| 7204–7773 | S5_* consts/data, S5 field primitives, LeisureStep5Screen | step5/* |
| 7775–8543 | S6_* consts/images, S6LuxCard, S6Panel, S6Bullet, LeisureStep6Screen, S6ReviewRow | step6/* |

## 3. What stays in book-leisure.tsx

- `export const Route = createFileRoute("/book-leisure")` with its existing `head()` block.
- `function BookLeisure()` in full: every `useState`, the `today`/`rooms` memos, `roomCount`, `toggleExtra`, `toggleExp`, `canContinue`, `go`, `buildRequestInput`, `handleSubmit`, the confirmation early-return, and the step-1..6 render branches with identical props.
- Imports of the extracted modules.

## 4. Code that must be mechanically modified (not just moved)

1. `export` keywords added to every moved declaration consumed elsewhere; purely local helpers stay unexported inside their new file.
2. Asset and lucide-icon imports get duplicated into the files that use them; unused ones drop out of the route file. No asset paths change.
3. Import statements currently sitting mid-file (lines 1900–1926) move to the top of their new module — allowed, hoisting-equivalent.
4. `let s2OpenDropdownId = 0` (module-level mutable) must live in the same module as `S2CategorySelect`, or in a tiny shared module if two files need it — it must remain a single shared instance.
5. Cross-step shared items (`CountryCode`, `StepKey`, `CITIES`, `COUNTRIES`, `LeisureStay`, `LeisureStepShell`) become imports in several files.
6. Name collisions to keep isolated: `Label`, `Field`, `Row`, `Counter` (legacy) vs. shadcn/step-local equivalents — legacy versions stay in `legacy/primitives.tsx` and are only imported by legacy files.

## 5. Risk per extraction

| Extraction | Risk | Notes |
|---|---|---|
| types.ts / tokens.ts / data.ts | Low | pure values and types |
| stay.ts, scroll.ts, concierge.ts helpers | Low | pure functions |
| legacy/* | Low | isolated branch, no shared state |
| step1/* | Low–Medium | many asset imports to relocate |
| shell/LeisureStepShell | Medium | consumed by steps 4/5/6; must keep identical children/prop contract |
| step2/* | Medium–High | largest cluster, module-level `s2OpenDropdownId`, portals, refs, scroll behaviour |
| step3/* | Medium | SmartConfigPanel closures over Step3Context |
| step4/*, step5/*, step6/* | Medium | large but self-contained screens |

## 6. Dependencies

```text
types.ts, tokens.ts  ->  everything
data.ts              ->  step1, step6, BookLeisure
stay.ts              ->  step2, step3, step6
shell/               ->  step4, step5, step6 (and any step using it)
step1..step6         ->  BookLeisure (route file, last)
legacy/*             ->  BookLeisure only
```

## 7. Recommended extraction order

1. types.ts, tokens.ts, data.ts, stay.ts, scroll.ts (leaf values/helpers)
2. legacy/primitives.tsx, legacy/ConfirmationScreen.tsx, legacy/LegacySteps.tsx
3. shell/LeisureStepShell.tsx
4. step1/*
5. step3/* (concierge + SmartConfigPanel first, then Step3Screen)
6. step4/*, step5/*, step6/*
7. step2/* last (highest risk, verified in isolation)
8. Final pass on book-leisure.tsx: delete moved blocks, wire imports

Each numbered step is a verify-then-continue checkpoint, not one big change.

## 8. Verification plan (same rigor as manage-bookings)

Before starting: Playwright baseline for steps 1–6 — full screenshots at 1440, 1280, 768, 390 px, plus measured geometry (hero heights, shell width, card heights, gold strip, summary panel) and a console log capture.

After each checkpoint:
- `tsgo` typecheck, zero errors.
- Re-screenshot the affected step(s) at the same breakpoints and diff against baseline (expect pixel-identical).
- Re-measure the recorded geometry values.

After the final checkpoint, a full interaction pass:
- Step 1: country switch resets city, carousel scroll, search, continue gating.
- Step 2: add stay, date pickers (check-in auto-sets check-out and closes), category dropdown (only one open at a time), counters, save/edit/remove stay, summary totals.
- Step 3: category toggles, smart-config panel fields, comments, recommend toggle.
- Step 4: category filter, card hover crossfade, select/deselect, date + flexible toggle.
- Step 5: validation gating, phone country picker, optional country.
- Step 6: edit links jump to the right step, submit path (unauthenticated -> pending request, authenticated -> booking created + confirmation screen).
- Chapter track navigation between steps and browser back behaviour.
- Console clean in every run.

## 9. Estimated result

`src/routes/book-leisure.tsx`: roughly **600–650 lines** (route + head, BookLeisure orchestrator, imports) — down from 8,543. Largest new file: `step2/Step2Screen.tsx` at ~650 lines; the step2 folder totals ~2,350 lines across five files.

Nothing is deleted, no CSS class, asset, token or label is touched.
