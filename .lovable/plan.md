# Codebase & Architecture Review — HotelGroupBook

Analysis only. No files were changed. Everything below was verified by reading
and searching the codebase today.

## Size snapshot (lines, excluding generated files)

```text
src/routes/book-leisure.tsx              8543
src/routes/book-meetings-events.tsx      7324
src/routes/rooming-list.$bookingId.tsx   4359   <- not reachable from the app
src/routes/bookings.$bookingId.tsx       1986
src/routes/manage-bookings.tsx           1818
src/components/StepThreeMeetingSpaces.tsx 1706
src/components/BookingNotes.tsx          1069
src/routes/index.tsx                     1058
src/styles.css                           1054
```

Total app code is ~43.8k lines, and 42% of it sits in three files.

---

## Findings

### 1. `src/routes/rooming-list.$bookingId.tsx` — dead route, 4,359 lines
- **Problem:** No `to="/rooming-list/..."` link, navigate call or href exists
  anywhere outside the file itself; the only references are in the generated
  route tree. The live Rooming List everything links to is
  `src/routes/rooming.$bookingId.tsx` (865 lines).
- **Why:** 10% of the codebase is compiled, typechecked and maintained for a
  page users cannot reach. It also confuses future work ("which rooming list?").
- **Recommendation:** Confirm with you that the page is obsolete, then delete
  the file (the route tree regenerates itself).
- **Risk:** Low. **UI impact:** None on any reachable screen — the URL would
  stop resolving if you ever open it directly.

### 2. `src/routes/book-leisure.tsx` — 8,543 lines, ~160 top-level declarations
- **Problem:** One file holds all leisure steps, every step's sub-components,
  the shared shell, constants, and 82 hook call sites.
- **Why:** Editing one step forces reasoning about all of them; automatic route
  code-splitting cannot help because everything is in the route module.
- **Recommendation:** Move each step into `src/features/leisure/steps/StepN*.tsx`
  and shared bits (`LeisureStepShell`, constants, types) into
  `src/features/leisure/`, with pure copy-paste moves — no JSX edits.
- **Risk:** Medium (volume, not difficulty). **UI impact:** None if moves are
  literal; risk comes only from missed imports, which typecheck catches.

### 3. `src/routes/book-meetings-events.tsx` — 7,324 lines
- **Problem:** Same shape as #2, plus 11 direct `localStorage` call sites inline
  in the component instead of going through a draft store like
  `src/lib/meDraftStore.ts`.
- **Why:** Draft persistence logic is scattered, so a key rename or schema change
  has to be found in 11 places.
- **Recommendation:** Split by step as in #2, and funnel all draft reads/writes
  through `meDraftStore.ts`.
- **Risk:** Medium. **UI impact:** None visually; draft behaviour must be
  retested (save, reload, resume).

### 4. Duplication between the two booking flows
- **Problem:** `book-leisure.tsx` and `book-meetings-events.tsx` each define
  their own `COUNTRIES`, `Counter`, `Field`, `GOLD`, `NAVY`, `NAVY_DEEP`,
  `SERIF`, `ROOM_CATEGORY_OPTIONS`.
- **Why:** Two copies drift. A country added in one flow silently missing in the
  other is exactly the class of bug this creates.
- **Recommendation:** Extract to `src/features/booking/shared/` — but only after
  diffing each pair, since the copies may already have drifted; keep both
  variants if their rendering differs.
- **Risk:** Medium. **UI impact:** Possible if the copies differ today — diff
  first, consolidate second.

### 5. Design tokens live as raw hex strings
- **Problem:** Hex literals repeat heavily outside `components/ui`: `#0A1B2C`
  106×, `#B88A2E` 49×, `#FAF8F4` 42×, `#D4AF37` 26×, `#FFC400` 23×, plus a long
  tail of near-identical golds (`#C5A059`, `#C79A32`, `#C5A24B`, `#C5962D`,
  `#B88917`) that are probably meant to be the same colour.
- **Why:** No single place to adjust the palette, and the near-duplicate golds
  are already an inconsistency.
- **Recommendation:** Introduce tokens in `src/styles.css` / a `theme.ts` and
  migrate file by file, mapping each literal 1:1 to a token with the *identical*
  value. Do not merge near-duplicate golds until you decide which is canonical.
- **Risk:** Low if 1:1; High the moment values are "harmonised".
  **UI impact:** None for 1:1 mapping.

### 6. `src/routes/manage-bookings.tsx` — 1,818 lines, 43 components inline
- **Problem:** `StatTile`, `BookingCard`, `FilterSelect`, the listbox popovers,
  gold gradient constants and the page shell all live in the route file, with 32
  hook call sites.
- **Why:** This is the page you iterate on most; every micro-adjustment means
  scrolling a 1.8k-line file, and `BookingCard` is reusable elsewhere.
- **Recommendation:** Extract `BookingCard`, `StatTile`, `FilterSelect`/listbox
  and the gold constants into `src/features/dashboard/`. Literal moves only.
- **Risk:** Low. **UI impact:** None if props are passed unchanged.

### 7. Components with too many responsibilities
- `src/components/StepThreeMeetingSpaces.tsx` (1,706) — space browsing, filters,
  selection state and layout in one unit; also writes `localStorage` directly.
- `src/components/BookingNotes.tsx` (1,069), `BookingDocuments.tsx` (810),
  `BookingMessages.tsx` (734) — each mixes data fetching, filtering/search state
  and full presentation.
- **Recommendation:** Split each into a container (state/data) plus presentational
  subcomponents. **Risk:** Medium. **UI impact:** None if markup is moved as-is.

### 8. Data access is not layered consistently
- **Problem:** `src/lib/bookingsApi.ts` and `roomingApi.ts` exist, yet `supabase`
  is called directly from `routes/auth.tsx` (4), `reset-password.tsx` (3),
  `book-leisure.tsx`, `book-meetings-events.tsx`, `__root.tsx` and
  `components/instant-edits/InstantEdits.tsx`.
- **Why:** Error handling, retries and query invalidation get reimplemented
  ad hoc; a table or column rename means hunting through UI files.
- **Recommendation:** Keep auth calls where they are (they're intentionally
  close to the auth UI), but move booking/site-edit table access behind the
  existing `lib/*Api.ts` modules.
- **Risk:** Low–Medium. **UI impact:** None if signatures are preserved.

### 9. State management is mixed but mostly fine
- TanStack Query is used on the dashboard, workspace and rooming routes (7–8 call
  sites each); the booking wizards instead use large local `useState` trees plus
  `localStorage` (82 and 76 hook call sites).
- **Recommendation:** Don't unify this now. The wizards are inherently local
  state; the useful step is consolidating each wizard's state into one reducer
  per flow, later. **Risk:** High if attempted. **UI impact:** High risk of
  behaviour change — leave for last, or skip.

### 10. Performance / re-renders
- **Observation:** The wizard routes hold all step state at the top of a
  multi-thousand-line component, so any keystroke re-renders every step's
  subtree. The extraction work in #2/#3 is the prerequisite for fixing this
  (memoised step components), not a separate task.
- **Recommendation:** Re-measure after splitting; only add `memo`/`useCallback`
  where a profile shows a real cost.
- **Risk:** Low. **UI impact:** None.

### 11. Unused CSS in `src/styles.css`
Verified as referenced nowhere else in `src/`:
`.hgb-brass-bar`, `.hgb-field`, `.hgb-gold-metal`, `.hgb-rail-toggle`,
`.hgb-scope-tab--idle`, `.s2-btn`, `.s2-date-input`, `.s2-metal`, `.s2-notes`,
`.s2-sum-row`, `.s4-selected-glow`, `.s4-shimmer`, `.s6-lux`, `.stone-inset`,
`.stone-toolbar`.
- **Caveat:** a few could be applied via dynamically built class strings, so each
  should be grepped as a bare substring before deletion.
- **Risk:** Low. **UI impact:** None if the grep check passes.

### 12. Leftover assets from previous design iterations
63 registered assets are imported nowhere, including twelve `step7-hero-bg-v*`
variants, six `manage-hero-*` variants, `card-*-new`/`card-*.jpg` pairs,
`workspace-*-stone` textures and `hotelgroupbook-logo.svg`.
- **Recommendation:** Delete the `.asset.json` entries in one batch after you
  confirm none are wanted for future use.
- **Risk:** Low. **UI impact:** None.

### 13. Folder structure has outgrown itself
- **Problem:** `src/components/` is a flat bag mixing global chrome
  (`GlobalSidebar`, `BrandLogo`), feature UI (`Booking*`,
  `StepThreeMeetingSpaces`), tooling (`design-mode`, `instant-edits`) and
  shadcn `ui/`.
- **Recommendation:** Move to `src/features/<domain>/` (leisure, meetings,
  dashboard, workspace, rooming) with `src/components/` reserved for genuinely
  shared UI. Do this incrementally, as the natural destination for the splits
  above — not as a standalone move.
- **Risk:** Low per move. **UI impact:** None.

### 14. Tight coupling worth noting
`DashboardChrome.tsx`, `GlobalSidebar.tsx` and `BookingWorkspaceHeader.tsx` each
hard-code navigation targets and active-item strings. Recommendation: a single
`navItems` config consumed by all three. **Risk:** Low. **UI impact:** None if
labels/order are copied exactly (this area has already caused rename bugs).

---

## Recommended order

### PHASE 1 — Safe cleanup (lowest risk, no UI impact)
1. Confirm and delete the orphan `rooming-list.$bookingId.tsx` route (#1).
2. Delete the 63 unused asset entries (#12).
3. Remove the 15 unused CSS classes after a bare-substring grep (#11).

### PHASE 2 — Component splitting (literal moves only)
4. `manage-bookings.tsx` → extract `BookingCard`, `StatTile`, `FilterSelect`,
   gold constants (#6).
5. Split `book-leisure.tsx` by step (#2).
6. Split `book-meetings-events.tsx` by step, and route drafts through
   `meDraftStore` (#3).
7. Split `StepThreeMeetingSpaces`, `BookingNotes`, `BookingDocuments`,
   `BookingMessages` into container + presentation (#7).

### PHASE 3 — Shared / reusable architecture
8. Diff, then consolidate the duplicated wizard primitives (#4).
9. Design tokens, strict 1:1 mapping (#5).
10. Shared `navItems` config for the three nav surfaces (#14).
11. Move remaining table access behind `lib/*Api.ts` (#8).

### PHASE 4 — Larger architectural improvements
12. Settle `src/features/<domain>/` as the structure (#13).
13. Re-measure render cost and memoise only where measured (#10).
14. Optional, highest risk: per-wizard reducer for state (#9).

Each phase is independently shippable; after every step the check is the same —
typecheck passes and the affected page renders identically.
