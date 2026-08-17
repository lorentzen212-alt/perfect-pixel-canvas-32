# Metallic gold timeline accents on Group Plan

Upgrade the timeline date numbers, dots, connecting line, and time labels on the Group Plan tab to a brushed metallic champagne gold while leaving everything else unchanged.

## What changes

File: `src/features/booking-workspace/group-plan/GroupPlan.tsx` only.

### 1. New metallic gold constants
Add constants near the top of the file for the requested gradients and shadow values:

- `GOLD_TEXT_GRADIENT` = `linear-gradient(180deg, #C9A84C 0%, #E8D5A3 100%)`
- `GOLD_TIME_GRADIENT` = `linear-gradient(180deg, #D4B76A 0%, #C9A84C 100%)`
- `GOLD_STUD_BG` = `radial-gradient(circle at 30% 30%, #E8D5A3 0%, #C9A84C 100%)`
- `GOLD_STUD_BORDER` = `#B8954A`
- `GOLD_STUD_SHADOW` = `0 0 6px rgba(201, 168, 76, 0.4), inset 0 1px 1px rgba(255,255,255,0.3)`
- `GOLD_STUD_SHADOW_ACTIVE` = `0 0 12px rgba(201, 168, 76, 0.6), inset 0 1px 1px rgba(255,255,255,0.3)`
- `GOLD_LINE_GRADIENT` = `linear-gradient(180deg, rgba(201,168,76,0.4) 0%, rgba(201,168,76,0.1) 100%)`

### 2. Timeline date numbers
Target the large day number rendered in the left day column (e.g. "22", "23", "24"). Replace the flat `color: GOLD` with the metallic text gradient and a subtle text shadow:

```css
background: linear-gradient(180deg, #C9A84C 0%, #E8D5A3 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
text-shadow: 0 1px 2px rgba(0,0,0,0.3);
```

Keep the serif font and existing size/leading exactly as they are.

### 3. Timeline dots
Target the small circular node inside each timeline row. Replace the flat `background: GOLD` with the metallic stud effect and a 2px darker gold edge.

- Add a `selected` or `open` prop so the active dot can receive the stronger glow.
- Use the stud gradient, border, and shadow.
- For the active dot (row is open/selected), use the larger `0 0 12px` glow.

### 4. Timeline vertical connecting line
Target the continuous `1px` spine behind the timeline rows. Replace the flat `GOLD_LINE` with the subtle top-to-bottom gold gradient, and increase the width to `1.5px`.

### 5. Time labels
Target the time column in each row (e.g. "09:00", "11:00"). Apply the smaller metallic text gradient using the same `background-clip: text` technique, slightly less prominent than the dates.

## What does NOT change

- The dusty blue `#385870` main panel background stays untouched.
- Calendar view day numbers, calendar dots, "YOUR BOOKING" eyebrow, "Timeline" toggle, planner buttons, pills, and other gold accents remain as they are.
- Layout, spacing, typography, and functional behavior are unchanged.

## Verification

- Open the Group Plan tab in the preview on the booking route.
- Confirm the timeline dates, dots, connecting line, and time labels all show a warm metallic champagne gold.
- Run `tsgo` typecheck before finishing.
