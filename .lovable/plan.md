# Visual move & resize inside the existing Edit mode

Extend the existing Edit button (Instant Edits) with a Figma-style layout layer: select one element, drag it, resize it from 8 handles, position it precisely, then press Done. No page redesign, no changes to colors, typography, components or layout except the element the user explicitly moves or resizes.

## How it will work

1. Clicking the existing Edit button enters edit mode exactly as today. A new "Layout" toggle in the Edit toolbar switches from text/style editing to move & resize.
2. Hovering shows a faint outline; clicking selects one element only. The selection gets a thin 1px champagne-gold outline drawn in an overlay layer (never on the element itself, so nothing about the design changes).
3. Eight resize handles appear on the selection: 4 corners, 4 edges. Dragging a handle resizes only that element. Dragging inside the outline moves only that element.
4. A small floating toolbar appears next to the selection with: Move / Resize mode, Width px, Height px, X, Y, Disable snapping, Undo, Redo, Reset, Done.
5. Width/Height/X/Y are numeric inputs showing live pixel values and accepting typed values.
6. Keyboard: Arrow = 1px, Shift+Arrow = 10px, ESC clears selection, click on empty area deselects, Done exits edit mode and removes every outline, handle and guide.
7. While dragging, subtle temporary guide lines appear for page center, container boundaries, and nearby element edges and centers. Snapping is gentle (6px threshold) and can be turned off from the toolbar.
8. Undo/Redo apply only to layout changes made in this session and only to edited elements.

## Isolation rules (the key requirement)

- Movement is applied as a `transform: translate(x, y)` on the selected element only. Transforms do not affect siblings, so nothing around the element reflows or shifts.
- Resizing sets explicit `width` / `height` on that one element. When the element sits in a grid or flex row, it also gets a `flex: 0 0 auto` style so siblings keep their own sizes instead of redistributing.
- Nothing is written to the parent container. If an element is dragged far outside its parent's bounds (where a real fix would need parent layout changes), a small inline warning appears in the toolbar: the move is still applied visually, but the user is told the parent layout would need to change to make it permanent.
- Overrides are stored per element path, merged into the existing saved-edits document, so unrelated elements and the rest of the page are untouched. Responsive classes stay in place; overrides only add the specific properties changed.

## Technical notes

- New file `src/lib/instantEdits/layout.ts`: layout override type (`x`, `y`, `w`, `h`), apply/clear functions, snapping and guide computation, and a small undo/redo stack.
- New file `src/components/instant-edits/LayoutEditor.tsx`: overlay rendering (outline, 8 handles, guide lines) and the floating toolbar, portalled to `document.body` with `data-ie-ui` so the existing picker ignores it.
- `src/components/instant-edits/InstantEdits.tsx`: add the Layout toggle and mount `LayoutEditor` for the current selection; reuse the existing `instantPathOf` / `instantElementAt` path system and the existing selection state.
- `src/lib/instantEdits/store.ts`: extend `InstantEdit` with the optional layout fields and apply them in `applyInstantEdit` so saved layout survives reload; existing edits stay valid.
- Persistence uses the current mechanism: local storage per route immediately, and the existing admin "publish" path saves to the backend, unchanged.
- Existing Design Mode is left untouched.

## Not changed

Page content, routing, functionality, colors, typography, spacing, shadows, borders, components, and the appearance of the site once Done is pressed.
