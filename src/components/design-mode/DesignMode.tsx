import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  History,
  type DesignDoc,
  type Override,
  type Snapshot,
  clone,
  designModeAllowed,
  diffSummary,
  elementAtPath,
  emptyDoc,
  isEnabledPersisted,
  isPrecisionPersisted,
  loadDoc,
  loadSnapshots,
  makeSnapshot,
  pathOf,
  saveDoc,
  saveSnapshots,
  setEnabledPersisted,
  setPrecisionPersisted,
  snap,
} from "@/lib/designMode/store";

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const GOLD = "#D4A64A";
const GOLD_SOFT = "rgba(212,166,74,0.85)";

const SELECTABLE = new Set([
  "SECTION",
  "HEADER",
  "FOOTER",
  "NAV",
  "ASIDE",
  "ARTICLE",
  "MAIN",
  "DIV",
  "UL",
  "OL",
  "LI",
  "FORM",
  "FIGURE",
  "IMG",
  "BUTTON",
  "A",
  "P",
  "H1",
  "H2",
  "H3",
  "H4",
  "SPAN",
]);

function isUi(el: Element | null) {
  return !!el?.closest("[data-dm-ui]");
}

function pickTarget(el: Element | null): HTMLElement | null {
  let cur: HTMLElement | null = el as HTMLElement | null;
  while (cur && cur !== document.body) {
    if (SELECTABLE.has(cur.tagName)) {
      const r = cur.getBoundingClientRect();
      if (r.width >= 8 && r.height >= 8) return cur;
    }
    cur = cur.parentElement;
  }
  return null;
}

function candidateRects(exclude: HTMLElement | null) {
  const out: { el: HTMLElement; r: DOMRect }[] = [];
  document
    .querySelectorAll<HTMLElement>("section,header,footer,nav,aside,article,div,li")
    .forEach((el) => {
      if (el === exclude || isUi(el)) return;
      if (exclude && (el.contains(exclude) || exclude.contains(el))) return;
      const r = el.getBoundingClientRect();
      if (r.width < 32 || r.height < 24) return;
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      out.push({ el, r });
    });
  return out.slice(0, 400);
}

function marqueeTargets(box: { l: number; t: number; r: number; b: number }) {
  const hits: string[] = [];
  document
    .querySelectorAll<HTMLElement>("section,header,footer,nav,aside,article,div,li,img,button,a,p,h1,h2,h3,h4")
    .forEach((el) => {
      if (isUi(el)) return;
      const r = el.getBoundingClientRect();
      if (r.width < 12 || r.height < 12) return;
      if (r.left >= box.l && r.top >= box.t && r.right <= box.r && r.bottom <= box.b) {
        // only keep outermost matches
        hits.push(pathOf(el));
      }
    });
  return hits.filter((p) => !hits.some((q) => q !== p && p.startsWith(q + "."))).slice(0, 40);
}

type Guide = { x?: number; y?: number };
type DistLabel = { x: number; y: number; text: string };

/* ------------------------------------------------------------------ */
/* component                                                           */
/* ------------------------------------------------------------------ */

export default function DesignMode() {
  const routePath = useRouterState({ select: (s) => s.location.pathname });
  const [allowed, setAllowed] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [precision, setPrecision] = useState(true);

  const [doc, setDoc] = useState<DesignDoc>(emptyDoc());
  const [baseline, setBaseline] = useState<DesignDoc>(emptyDoc());
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [showSnapshots, setShowSnapshots] = useState(false);

  const [selection, setSelection] = useState<string[]>([]);
  const [hover, setHover] = useState<string | null>(null);
  const [, forceTick] = useState(0);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [dists, setDists] = useState<DistLabel[]>([]);
  const [menu, setMenu] = useState<{ x: number; y: number; path: string } | null>(null);
  const [marquee, setMarquee] = useState<{ l: number; t: number; r: number; b: number } | null>(null);
  const [comparing, setComparing] = useState(false);
  const [summary, setSummary] = useState<string[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const historyRef = useRef<History | null>(null);
  const appliedRef = useRef<Set<HTMLElement>>(new Set());
  const opsAppliedRef = useRef(false);

  const rerender = useCallback(() => forceTick((t) => t + 1), []);
  const selected = selection[0] ?? null;

  const flash = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  }, []);

  /* ---- boot ---- */
  useEffect(() => {
    setAllowed(designModeAllowed());
    setEnabled(isEnabledPersisted());
    setPrecision(isPrecisionPersisted());
  }, []);

  useEffect(() => {
    const loaded = loadDoc(routePath);
    historyRef.current = new History(loaded);
    opsAppliedRef.current = false;
    setDoc(loaded);
    setBaseline(clone(loaded));
    setSnapshots(loadSnapshots(routePath));
    setSelection([]);
  }, [routePath]);

  /* ---- working copy snapshot when Design Mode starts ---- */
  const startSession = useCallback(() => {
    const live = loadDoc(routePath);
    setBaseline(clone(live));
    setDoc(live);
    historyRef.current = new History(live);
    const list = [...loadSnapshots(routePath).filter((s) => s.name !== "Working Copy"), makeSnapshot("Working Copy", live)];
    saveSnapshots(routePath, list);
    setSnapshots(list);
  }, [routePath]);

  /* ---- edit (temporary, records history) ---- */
  const commit = useCallback((next: DesignDoc) => {
    historyRef.current?.push(next);
    setDoc(next);
  }, []);

  const patchMany = useCallback(
    (paths: string[], p: Override) => {
      const overrides = { ...doc.overrides };
      let changed = false;
      paths.forEach((path) => {
        if (overrides[path]?.locked && p.locked === undefined) return;
        overrides[path] = { ...(overrides[path] ?? {}), ...p };
        changed = true;
      });
      if (!changed) {
        flash("Element is locked — unlock it first.");
        return;
      }
      commit({ ops: doc.ops, overrides });
    },
    [doc, commit, flash],
  );

  const patch = useCallback((path: string, p: Override) => patchMany([path], p), [patchMany]);

  /* ---- structural ops replay (persisted) ---- */
  useEffect(() => {
    if (opsAppliedRef.current) return;
    if (!doc.ops.length) {
      opsAppliedRef.current = true;
      return;
    }
    const t = window.setTimeout(() => {
      doc.ops.forEach((op) => applyOp(op));
      opsAppliedRef.current = true;
      rerender();
    }, 250);
    return () => window.clearTimeout(t);
  }, [doc.ops, rerender]);

  /* ---- apply overrides to the DOM ---- */
  const activeDoc = comparing ? baseline : doc;

  const applyOverrides = useCallback(() => {
    appliedRef.current.forEach((el) => {
      [
        "transform",
        "width",
        "height",
        "padding",
        "margin",
        "border-radius",
        "gap",
        "align-items",
        "justify-content",
        "flex-direction",
        "max-width",
        "opacity",
        "box-shadow",
        "display",
        "z-index",
        "border",
        "background",
        "background-image",
        "color",
        "font-size",
        "font-weight",
        "font-family",
        "letter-spacing",
        "line-height",
        "text-align",
      ].forEach((p) => el.style.removeProperty(p));
    });
    appliedRef.current.clear();

    Object.entries(activeDoc.overrides).forEach(([path, o]) => {
      const el = elementAtPath(path);
      if (!el) return;
      appliedRef.current.add(el);
      if (o.x || o.y) el.style.transform = `translate(${o.x ?? 0}px, ${o.y ?? 0}px)`;
      if (o.w != null) el.style.width = `${o.w}px`;
      if (o.h != null) el.style.height = `${o.h}px`;
      if (o.padding) el.style.padding = o.padding;
      if (o.margin) el.style.margin = o.margin;
      if (o.radius) el.style.borderRadius = o.radius;
      if (o.gap) el.style.gap = o.gap;
      if (o.align) el.style.alignItems = o.align;
      if (o.justify) el.style.justifyContent = o.justify;
      if (o.dir) el.style.flexDirection = o.dir;
      if (o.display) el.style.display = o.display;
      if (o.maxW) el.style.maxWidth = o.maxW;
      if (o.opacity != null) el.style.opacity = String(o.opacity);
      if (o.shadow) el.style.boxShadow = o.shadow;
      if (o.border) el.style.border = o.border;
      if (o.bg) el.style.background = o.bg;
      if (o.image) {
        if (el.tagName === "IMG") (el as HTMLImageElement).src = o.image;
        else el.style.backgroundImage = `url(${o.image})`;
      }
      if (o.color) el.style.color = o.color;
      if (o.fontSize) el.style.fontSize = o.fontSize;
      if (o.fontWeight) el.style.fontWeight = o.fontWeight;
      if (o.fontFamily) el.style.fontFamily = o.fontFamily;
      if (o.letterSpacing) el.style.letterSpacing = o.letterSpacing;
      if (o.lineHeight) el.style.lineHeight = o.lineHeight;
      if (o.textAlign) el.style.textAlign = o.textAlign;
      if (o.z != null) el.style.zIndex = String(o.z);
      if (o.hidden) el.style.display = "none";
    });
  }, [activeDoc.overrides]);

  useEffect(() => {
    applyOverrides();
    const t = window.setTimeout(applyOverrides, 300);
    return () => window.clearTimeout(t);
  }, [applyOverrides, routePath]);

  /* ---- undo / redo ---- */
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelection([]);
        setMenu(null);
        return;
      }
      const z = e.key.toLowerCase() === "z";
      if (!(e.ctrlKey || e.metaKey) || !z) return;
      e.preventDefault();
      const h = historyRef.current;
      if (!h) return;
      const next = e.shiftKey ? h.redo() : h.undo();
      if (!next) return;
      setDoc(clone(next));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);

  /* ---- pointer interactions ---- */
  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      if (isUi(e.target as Element)) return;
      const t = pickTarget(e.target as Element);
      setHover(t ? pathOf(t) : null);
    };

    const onDown = (e: MouseEvent) => {
      if (e.button !== 0 || isUi(e.target as Element)) return;
      const t = pickTarget(e.target as Element);
      const additive = e.shiftKey || e.metaKey || e.ctrlKey;

      if (!t) {
        // marquee drag selection on empty space
        e.preventDefault();
        const ox = e.clientX;
        const oy = e.clientY;
        if (!additive) setSelection([]);
        const move = (ev: MouseEvent) => {
          setMarquee({
            l: Math.min(ox, ev.clientX),
            t: Math.min(oy, ev.clientY),
            r: Math.max(ox, ev.clientX),
            b: Math.max(oy, ev.clientY),
          });
        };
        const up = (ev: MouseEvent) => {
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mouseup", up);
          const box = {
            l: Math.min(ox, ev.clientX),
            t: Math.min(oy, ev.clientY),
            r: Math.max(ox, ev.clientX),
            b: Math.max(oy, ev.clientY),
          };
          setMarquee(null);
          if (box.r - box.l > 12 && box.b - box.t > 12) {
            const hits = marqueeTargets(box);
            setSelection((prev) => (additive ? Array.from(new Set([...prev, ...hits])) : hits));
          }
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        return;
      }

      const path = pathOf(t);
      setMenu(null);

      if (additive) {
        e.preventDefault();
        setSelection((prev) => (prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]));
        return;
      }

      setSelection([path]);
      const ov = doc.overrides[path] ?? {};
      if (ov.locked) return;

      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const baseX = ov.x ?? 0;
      const baseY = ov.y ?? 0;
      const others = candidateRects(t);
      const startRect = t.getBoundingClientRect();
      let moved = false;
      let last = { x: baseX, y: baseY };

      const move = (ev: MouseEvent) => {
        moved = true;
        const raw = { x: baseX + ev.clientX - startX, y: baseY + ev.clientY - startY };
        let dx = precision ? Math.round(raw.x) : snap(raw.x);
        let dy = precision ? Math.round(raw.y) : snap(raw.y);
        const rect = {
          left: startRect.left + (dx - baseX),
          top: startRect.top + (dy - baseY),
          width: startRect.width,
          height: startRect.height,
        };
        const g: Guide[] = [];
        const d: DistLabel[] = [];
        const edgesX = [rect.left, rect.left + rect.width / 2, rect.left + rect.width];
        const edgesY = [rect.top, rect.top + rect.height / 2, rect.top + rect.height];

        if (!precision) {
          others.forEach(({ r }) => {
            [r.left, r.left + r.width / 2, r.right].forEach((ox) => {
              edgesX.forEach((ex, i) => {
                if (Math.abs(ex - ox) <= 6) {
                  g.push({ x: ox });
                  dx += ox - ex;
                  edgesX[i] = ox;
                }
              });
            });
            [r.top, r.top + r.height / 2, r.bottom].forEach((oy) => {
              edgesY.forEach((ey, i) => {
                if (Math.abs(ey - oy) <= 6) {
                  g.push({ y: oy });
                  dy += oy - ey;
                  edgesY[i] = oy;
                }
              });
            });
          });
        }

        let bestV: { gap: number; y: number } | null = null;
        let bestH: { gap: number; x: number } | null = null;
        others.forEach(({ r }) => {
          const vGap = rect.top - r.bottom;
          if (vGap >= 0 && vGap < 220 && (!bestV || vGap < bestV.gap)) bestV = { gap: vGap, y: r.bottom };
          const hGap = rect.left - r.right;
          if (hGap >= 0 && hGap < 220 && (!bestH || hGap < bestH.gap)) bestH = { gap: hGap, x: r.right };
        });
        if (bestV)
          d.push({
            x: rect.left + rect.width / 2,
            y: (bestV as { gap: number; y: number }).y + (bestV as { gap: number; y: number }).gap / 2,
            text: `${Math.round((bestV as { gap: number }).gap)}px`,
          });
        if (bestH)
          d.push({
            x: (bestH as { gap: number; x: number }).x + (bestH as { gap: number; x: number }).gap / 2,
            y: rect.top + rect.height / 2,
            text: `${Math.round((bestH as { gap: number }).gap)}px`,
          });

        setGuides(g.slice(0, 8));
        setDists(d);
        last = { x: dx, y: dy };
        t.style.transform = `translate(${dx}px, ${dy}px)`;
      };

      const up = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
        setGuides([]);
        setDists([]);
        if (moved) patch(path, { x: last.x, y: last.y });
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    };

    const onContext = (e: MouseEvent) => {
      if (isUi(e.target as Element)) return;
      const t = pickTarget(e.target as Element);
      if (!t) return;
      e.preventDefault();
      const path = pathOf(t);
      setSelection((prev) => (prev.includes(path) ? prev : [path]));
      setMenu({ x: e.clientX, y: e.clientY, path });
    };

    const onClickCapture = (e: MouseEvent) => {
      if (isUi(e.target as Element)) return;
      e.preventDefault();
      e.stopPropagation();
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown, true);
    document.addEventListener("contextmenu", onContext);
    document.addEventListener("click", onClickCapture, true);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown, true);
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("click", onClickCapture, true);
      setHover(null);
    };
  }, [enabled, doc.overrides, patch, precision]);

  /* ---- resize ---- */
  const startResize = (corner: "nw" | "ne" | "sw" | "se") => (e: React.MouseEvent) => {
    if (!selected) return;
    const el = elementAtPath(selected);
    if (!el) return;
    if (doc.overrides[selected]?.locked) {
      flash("Element is locked — unlock it first.");
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const r = el.getBoundingClientRect();
    const ov = doc.overrides[selected] ?? {};
    const sx = e.clientX;
    const sy = e.clientY;
    const fit = (v: number) => (precision ? Math.round(v) : snap(v));
    let w = r.width;
    let h = r.height;
    let x = ov.x ?? 0;
    let y = ov.y ?? 0;

    const move = (ev: MouseEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (corner.includes("e")) w = Math.max(16, fit(r.width + dx));
      if (corner.includes("s")) h = Math.max(12, fit(r.height + dy));
      if (corner.includes("w")) {
        w = Math.max(16, fit(r.width - dx));
        x = fit((ov.x ?? 0) + dx);
      }
      if (corner.includes("n")) {
        h = Math.max(12, fit(r.height - dy));
        y = fit((ov.y ?? 0) + dy);
      }
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.transform = `translate(${x}px, ${y}px)`;
      rerender();
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      patch(selected, { w: Math.round(w), h: Math.round(h), x, y });
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  /* ---- structural ops ---- */
  const applyOp = (op: { type: string; path: string }) => {
    const el = elementAtPath(op.path);
    if (!el) return;
    if (op.type === "duplicate") {
      const copy = el.cloneNode(true) as HTMLElement;
      el.parentElement?.insertBefore(copy, el.nextSibling);
    } else if (op.type === "delete") {
      el.remove();
    } else if (op.type === "wrap") {
      const wrapper = document.createElement("div");
      wrapper.setAttribute("data-dm-wrapper", "");
      el.parentElement?.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    } else if (op.type === "ungroup") {
      const parent = el.parentElement;
      if (!parent) return;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      el.remove();
    }
  };

  const runOp = (op: { type: "duplicate" | "delete" | "wrap" | "ungroup"; path: string }) => {
    if (doc.overrides[op.path]?.locked) {
      flash("Element is locked — unlock it first.");
      return;
    }
    applyOp(op);
    commit({ overrides: doc.overrides, ops: [...doc.ops, op] });
    setMenu(null);
    setSelection([]);
  };

  /* ---- session actions ---- */
  const dirty = useMemo(() => JSON.stringify(doc) !== JSON.stringify(baseline), [doc, baseline]);
  const changeList = useMemo(() => diffSummary(baseline, doc), [baseline, doc]);

  const doSave = () => {
    saveDoc(routePath, doc);
    setBaseline(clone(doc));
    historyRef.current?.reset(doc);
    setSummary(null);
    flash(`Saved — ${changeList.length} change(s) applied to the live page.`);
  };

  const doDiscard = () => {
    const restored = clone(baseline);
    setDoc(restored);
    historyRef.current?.reset(restored);
    saveDoc(routePath, restored);
    setSelection([]);
    setSummary(null);
    if (doc.ops.length !== restored.ops.length) window.location.reload();
    else flash("All session changes discarded.");
  };

  const addSnapshot = () => {
    const name = window.prompt("Snapshot name", `${routePath === "/" ? "Homepage" : routePath.replace("/", "")} v${snapshots.length + 1}`);
    if (!name) return;
    const list = [...snapshots, makeSnapshot(name, doc)];
    saveSnapshots(routePath, list);
    setSnapshots(list);
    flash(`Snapshot "${name}" created.`);
  };

  const restoreSnapshot = (s: Snapshot) => {
    const restored = clone(s.doc);
    setDoc(restored);
    historyRef.current?.push(restored);
    setSelection([]);
    flash(`Restored "${s.name}" (not saved yet).`);
  };

  const toggleEnabled = () => {
    const next = !enabled;
    setEnabled(next);
    setEnabledPersisted(next);
    if (next) startSession();
    else {
      setSelection([]);
      setMenu(null);
      setShowSnapshots(false);
    }
  };

  /* ---- derived rects ---- */
  const selEls = selection.map((p) => elementAtPath(p)).filter(Boolean) as HTMLElement[];
  const selRects = selEls.map((el) => el.getBoundingClientRect());
  const selRect = selRects[0];
  const hovEl = hover && !selection.includes(hover) ? elementAtPath(hover) : null;
  const hovRect = hovEl?.getBoundingClientRect();
  const selOv: Override = (selected && doc.overrides[selected]) || {};

  const groupRect = useMemo(() => {
    if (selRects.length < 2) return null;
    const l = Math.min(...selRects.map((r) => r.left));
    const t = Math.min(...selRects.map((r) => r.top));
    const r = Math.max(...selRects.map((x) => x.right));
    const b = Math.max(...selRects.map((x) => x.bottom));
    return { left: l, top: t, width: r - l, height: b - t };
  }, [selRects]);

  const label = useMemo(() => {
    if (selection.length > 1) return `${selection.length} elements`;
    const el = selEls[0];
    if (!el) return "";
    return (
      selOv.name ||
      `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""}`
    );
  }, [selEls, selOv.name, selection.length]);

  if (!allowed) return null;

  return (
    <div data-dm-ui="">
      {/* floating toggle */}
      <button
        type="button"
        onClick={toggleEnabled}
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 2147483000,
          padding: "9px 14px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.04em",
          fontFamily: "Inter, system-ui, sans-serif",
          color: enabled ? "#0B1622" : "#F5F1E6",
          background: enabled ? "linear-gradient(135deg,#F1D08A,#C79A32)" : "rgba(11,22,34,0.92)",
          border: "1px solid rgba(212,166,74,0.45)",
          boxShadow: "0 12px 30px -12px rgba(0,0,0,0.65)",
          cursor: "pointer",
        }}
      >
        {enabled ? "Design Mode · ON" : "Design Mode"}
      </button>

      {!enabled ? null : (
        <>
          {/* top toolbar */}
          <div
            data-dm-ui=""
            style={{
              position: "fixed",
              left: "50%",
              top: 14,
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 9px",
              borderRadius: 12,
              background: "rgba(10,20,30,0.96)",
              border: "1px solid rgba(212,166,74,0.35)",
              boxShadow: "0 24px 60px -26px rgba(0,0,0,0.9)",
              zIndex: 2147483060,
              fontFamily: "Inter, system-ui, sans-serif",
              color: "#F5F1E6",
              fontSize: 11.5,
            }}
          >
            <span style={{ letterSpacing: "0.08em", fontWeight: 700, color: GOLD, paddingRight: 4 }}>DESIGN</span>
            <ToolBtn onClick={() => historyRef.current && applyHistory(historyRef.current.undo(), setDoc)}>↶ Undo</ToolBtn>
            <ToolBtn onClick={() => historyRef.current && applyHistory(historyRef.current.redo(), setDoc)}>↷ Redo</ToolBtn>
            <Divider />
            <ToolBtn
              active={comparing}
              onMouseDown={() => setComparing(true)}
              onMouseUp={() => setComparing(false)}
              onMouseLeave={() => setComparing(false)}
            >
              ◐ Compare
            </ToolBtn>
            <ToolBtn active={!!summary} onClick={() => setSummary(summary ? null : changeList)}>
              ⌘ Preview
            </ToolBtn>
            <Divider />
            <ToolBtn active={precision} onClick={() => { const n = !precision; setPrecision(n); setPrecisionPersisted(n); }}>
              ⊹ Pixel Precision {precision ? "ON" : "OFF"}
            </ToolBtn>
            <Divider />
            <ToolBtn onClick={() => setShowSnapshots((s) => !s)} active={showSnapshots}>
              ⧉ Snapshots ({snapshots.length})
            </ToolBtn>
            <ToolBtn onClick={doDiscard}>Discard</ToolBtn>
            <ToolBtn primary disabled={!dirty} onClick={doSave}>
              Save Changes{dirty ? ` (${changeList.length})` : ""}
            </ToolBtn>
          </div>

          {/* snapshots panel */}
          {showSnapshots && (
            <div data-dm-ui="" style={panel({ left: 16, top: 70, width: 260 })}>
              <PanelTitle>VERSION HISTORY</PanelTitle>
              <button type="button" onClick={addSnapshot} style={{ ...btn, width: "100%", marginBottom: 8 }}>
                + Create snapshot
              </button>
              {snapshots.length === 0 && <div style={{ opacity: 0.6 }}>No snapshots yet.</div>}
              {[...snapshots].reverse().map((s) => (
                <div key={s.id} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                    <div style={{ opacity: 0.55, fontSize: 10 }}>{new Date(s.ts).toLocaleString()}</div>
                  </div>
                  <button type="button" style={btn} onClick={() => restoreSnapshot(s)}>
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* change summary / preview */}
          {summary && (
            <div data-dm-ui="" style={panel({ left: 16, bottom: 16, width: 320, maxHeight: "46vh" })}>
              <PanelTitle>CHANGE SUMMARY</PanelTitle>
              {summary.length === 0 && <div style={{ opacity: 0.6 }}>No changes in this session.</div>}
              {summary.map((line, i) => (
                <div key={i} style={{ marginBottom: 4 }}>
                  <span style={{ color: GOLD }}>✓</span> {line}
                </div>
              ))}
              <div style={{ opacity: 0.55, fontSize: 10, margin: "8px 0" }}>No other elements modified.</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" style={{ ...btn, flex: 1, background: "linear-gradient(135deg,#F1D08A,#C79A32)", color: "#0B1622", fontWeight: 700 }} onClick={doSave}>
                  Apply
                </button>
                <button type="button" style={{ ...btn, flex: 1 }} onClick={doDiscard}>
                  Discard
                </button>
                <button
                  type="button"
                  style={{ ...btn, flex: 1 }}
                  onMouseDown={() => setComparing(true)}
                  onMouseUp={() => setComparing(false)}
                  onMouseLeave={() => setComparing(false)}
                >
                  Compare
                </button>
              </div>
            </div>
          )}

          {/* toast */}
          {toast && (
            <div
              data-dm-ui=""
              style={{
                position: "fixed",
                left: "50%",
                bottom: 24,
                transform: "translateX(-50%)",
                background: "rgba(10,20,30,0.96)",
                border: `1px solid ${GOLD_SOFT}`,
                color: "#F5F1E6",
                padding: "8px 14px",
                borderRadius: 10,
                fontSize: 12,
                fontFamily: "Inter, system-ui, sans-serif",
                zIndex: 2147483200,
              }}
            >
              {toast}
            </div>
          )}

          {/* hover outline */}
          {hovRect && (
            <div
              style={{
                position: "fixed",
                left: hovRect.left,
                top: hovRect.top,
                width: hovRect.width,
                height: hovRect.height,
                border: "1px dashed rgba(212,166,74,0.5)",
                pointerEvents: "none",
                zIndex: 2147482000,
              }}
            />
          )}

          {/* marquee */}
          {marquee && (
            <div
              style={{
                position: "fixed",
                left: marquee.l,
                top: marquee.t,
                width: marquee.r - marquee.l,
                height: marquee.b - marquee.t,
                border: `1px solid ${GOLD}`,
                background: "rgba(212,166,74,0.10)",
                pointerEvents: "none",
                zIndex: 2147482400,
              }}
            />
          )}

          {/* group bounds */}
          {groupRect && (
            <div
              style={{
                position: "fixed",
                ...groupRect,
                border: `1px dashed ${GOLD}`,
                pointerEvents: "none",
                zIndex: 2147482050,
              }}
            />
          )}

          {/* selection outlines */}
          {selRects.map((r, i) => (
            <div
              key={selection[i]}
              style={{
                position: "fixed",
                left: r.left,
                top: r.top,
                width: r.width,
                height: r.height,
                border: `1.5px solid ${GOLD}`,
                boxShadow: "0 0 0 1px rgba(212,166,74,0.25)",
                pointerEvents: "none",
                zIndex: 2147482100,
              }}
            >
              {i === 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -22,
                    left: 0,
                    background: GOLD,
                    color: "#0B1622",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 6px",
                    borderRadius: 4,
                    fontFamily: "Inter, system-ui, sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  {doc.overrides[selection[i]]?.locked ? "🔒 " : ""}
                  {label} · {Math.round(r.width)}×{Math.round(r.height)}
                </span>
              )}
              {i === 0 &&
                selection.length === 1 &&
                (["nw", "ne", "sw", "se"] as const).map((c) => (
                  <div
                    key={c}
                    onMouseDown={startResize(c)}
                    data-dm-ui=""
                    style={{
                      position: "absolute",
                      width: 10,
                      height: 10,
                      background: "#fff",
                      border: `1.5px solid ${GOLD}`,
                      borderRadius: 2,
                      pointerEvents: "auto",
                      cursor: `${c}-resize`,
                      left: c.includes("w") ? -5 : undefined,
                      right: c.includes("e") ? -5 : undefined,
                      top: c.includes("n") ? -5 : undefined,
                      bottom: c.includes("s") ? -5 : undefined,
                    }}
                  />
                ))}
            </div>
          ))}

          {/* spacing indicators for the primary selection */}
          {selRect && selection.length === 1 && (
            <>
              <SpaceTag x={selRect.left + selRect.width / 2} y={selRect.top - 8} text={`↑ ${Math.round(selRect.top)}`} />
              <SpaceTag x={selRect.left - 22} y={selRect.top + selRect.height / 2} text={`${Math.round(selRect.left)}`} />
            </>
          )}

          {/* alignment guides */}
          {guides.map((g, i) => (
            <div
              key={i}
              style={{
                position: "fixed",
                background: GOLD,
                pointerEvents: "none",
                zIndex: 2147482200,
                left: g.x != null ? g.x : 0,
                top: g.y != null ? g.y : 0,
                width: g.x != null ? 1 : "100vw",
                height: g.y != null ? 1 : "100vh",
              }}
            />
          ))}

          {/* distance labels */}
          {dists.map((d, i) => (
            <div
              key={i}
              style={{
                position: "fixed",
                left: d.x,
                top: d.y,
                transform: "translate(-50%,-50%)",
                background: GOLD,
                color: "#0B1622",
                fontSize: 10,
                fontWeight: 700,
                padding: "1px 5px",
                borderRadius: 3,
                pointerEvents: "none",
                zIndex: 2147482300,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              {d.text}
            </div>
          ))}

          {/* context menu */}
          {menu && (
            <div
              data-dm-ui=""
              style={{
                position: "fixed",
                left: Math.min(menu.x, window.innerWidth - 200),
                top: Math.min(menu.y, window.innerHeight - 340),
                width: 190,
                background: "#12202E",
                border: "1px solid rgba(212,166,74,0.28)",
                borderRadius: 10,
                padding: 6,
                zIndex: 2147483100,
                boxShadow: "0 24px 60px -24px rgba(0,0,0,0.8)",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
              onMouseLeave={() => setMenu(null)}
            >
              {[
                { label: "Duplicate", run: () => runOp({ type: "duplicate", path: menu.path }) },
                { label: "Delete", run: () => runOp({ type: "delete", path: menu.path }) },
                { label: "Bring forward", run: () => patch(menu.path, { z: (doc.overrides[menu.path]?.z ?? 0) + 1 }) },
                { label: "Send backward", run: () => patch(menu.path, { z: (doc.overrides[menu.path]?.z ?? 0) - 1 }) },
                {
                  label: doc.overrides[menu.path]?.locked ? "🔓 Unlock element" : "🔒 Lock element",
                  run: () => patch(menu.path, { locked: !doc.overrides[menu.path]?.locked }),
                },
                { label: "Hide", run: () => patch(menu.path, { hidden: true }) },
                {
                  label: "Rename",
                  run: () => {
                    const name = window.prompt("Name", doc.overrides[menu.path]?.name ?? "");
                    if (name != null) patch(menu.path, { name });
                  },
                },
                { label: "Wrap in container", run: () => runOp({ type: "wrap", path: menu.path }) },
                { label: "Ungroup", run: () => runOp({ type: "ungroup", path: menu.path }) },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.run();
                    setMenu(null);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "7px 9px",
                    fontSize: 12,
                    color: "#F5F1E6",
                    background: "transparent",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(212,166,74,0.16)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* inspector */}
          {selected && (
            <Inspector
              count={selection.length}
              ov={selOv}
              rect={selRect}
              name={label}
              onChange={(p) => patchMany(selection, p)}
              onReset={() => {
                const next = { ...doc.overrides };
                selection.forEach((p) => delete next[p]);
                commit({ overrides: next, ops: doc.ops });
              }}
              onClose={() => setSelection([])}
            />
          )}
        </>
      )}
    </div>
  );
}

function applyHistory(next: DesignDoc | null, setDoc: (d: DesignDoc) => void) {
  if (next) setDoc(clone(next));
}

/* ------------------------------------------------------------------ */
/* small UI atoms                                                      */
/* ------------------------------------------------------------------ */

function ToolBtn({
  children,
  active,
  primary,
  disabled,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean; primary?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      {...rest}
      style={{
        padding: "5px 9px",
        borderRadius: 7,
        fontSize: 11,
        fontWeight: primary ? 700 : 500,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        color: primary ? "#0B1622" : "#F5F1E6",
        background: primary
          ? "linear-gradient(135deg,#F1D08A,#C79A32)"
          : active
            ? "rgba(212,166,74,0.22)"
            : "rgba(245,241,230,0.07)",
        border: `1px solid ${active || primary ? "rgba(212,166,74,0.5)" : "rgba(245,241,230,0.14)"}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

const Divider = () => <span style={{ width: 1, height: 18, background: "rgba(245,241,230,0.16)" }} />;

function SpaceTag({ x, y, text }: { x: number; y: number; text: string }) {
  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        transform: "translate(-50%,-50%)",
        background: "rgba(212,166,74,0.9)",
        color: "#0B1622",
        fontSize: 9,
        fontWeight: 700,
        padding: "1px 4px",
        borderRadius: 3,
        pointerEvents: "none",
        zIndex: 2147482350,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {text}
    </div>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: GOLD, marginBottom: 8 }}>{children}</div>;
}

const panel = (pos: React.CSSProperties): React.CSSProperties => ({
  position: "fixed",
  background: "#0F1C29",
  border: "1px solid rgba(212,166,74,0.28)",
  borderRadius: 12,
  padding: 12,
  zIndex: 2147483050,
  color: "#F5F1E6",
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 11.5,
  overflowY: "auto",
  boxShadow: "0 30px 70px -28px rgba(0,0,0,0.85)",
  ...pos,
});

/* ------------------------------------------------------------------ */
/* inspector panel                                                     */
/* ------------------------------------------------------------------ */

const SHADOWS: Record<string, string> = {
  none: "none",
  soft: "0 10px 30px -18px rgba(0,0,0,0.5)",
  medium: "0 18px 44px -20px rgba(0,0,0,0.6)",
  strong: "0 30px 70px -24px rgba(0,0,0,0.75)",
};

function Inspector({
  count,
  ov,
  rect,
  name,
  onChange,
  onReset,
  onClose,
}: {
  count: number;
  ov: Override;
  rect?: DOMRect;
  name: string;
  onChange: (p: Override) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div data-dm-ui="" style={panel({ right: 16, top: 70, width: 258, maxHeight: "calc(100vh - 110px)" })}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <strong style={{ fontSize: 12, letterSpacing: "0.06em", color: GOLD }}>INSPECTOR</strong>
        <button type="button" onClick={onClose} style={btn}>
          ✕
        </button>
      </div>

      <div style={{ opacity: 0.7, marginBottom: 10, wordBreak: "break-all" }}>
        {ov.locked ? "🔒 " : ""}
        {count > 1 ? `${count} elements selected` : name}
        {rect && count === 1 ? ` · ${Math.round(rect.width)} × ${Math.round(rect.height)}` : ""}
      </div>

      <Group>POSITION & SIZE</Group>
      <Row label="X">
        <input type="number" value={ov.x ?? 0} onChange={(e) => onChange({ x: Number(e.target.value) })} style={input} />
      </Row>
      <Row label="Y">
        <input type="number" value={ov.y ?? 0} onChange={(e) => onChange({ y: Number(e.target.value) })} style={input} />
      </Row>
      <Row label="Width">
        <input
          type="number"
          value={ov.w ?? (rect ? Math.round(rect.width) : 0)}
          onChange={(e) => onChange({ w: Number(e.target.value) })}
          style={input}
        />
      </Row>
      <Row label="Height">
        <input
          type="number"
          value={ov.h ?? (rect ? Math.round(rect.height) : 0)}
          onChange={(e) => onChange({ h: Number(e.target.value) })}
          style={input}
        />
      </Row>
      <Row label="Max-width">
        <input value={ov.maxW ?? ""} placeholder="1200px" onChange={(e) => onChange({ maxW: e.target.value })} style={input} />
      </Row>

      <Group>SPACING</Group>
      <Row label="Padding">
        <input value={ov.padding ?? ""} placeholder="16px" onChange={(e) => onChange({ padding: e.target.value })} style={input} />
      </Row>
      <Row label="Margin">
        <input value={ov.margin ?? ""} placeholder="0 auto" onChange={(e) => onChange({ margin: e.target.value })} style={input} />
      </Row>
      <Row label="Gap">
        <input value={ov.gap ?? ""} placeholder="16px" onChange={(e) => onChange({ gap: e.target.value })} style={input} />
      </Row>

      <Group>LAYOUT</Group>
      <Row label="Display">
        <select value={ov.display ?? ""} onChange={(e) => onChange({ display: e.target.value })} style={input}>
          <option value="">auto</option>
          <option value="block">block</option>
          <option value="flex">flex</option>
          <option value="grid">grid</option>
          <option value="inline-flex">inline-flex</option>
        </select>
      </Row>
      <Row label="Direction">
        <select value={ov.dir ?? ""} onChange={(e) => onChange({ dir: e.target.value })} style={input}>
          <option value="">auto</option>
          <option value="row">row</option>
          <option value="row-reverse">row-reverse</option>
          <option value="column">column</option>
          <option value="column-reverse">column-reverse</option>
        </select>
      </Row>
      <Row label="Align">
        <select value={ov.align ?? ""} onChange={(e) => onChange({ align: e.target.value })} style={input}>
          <option value="">auto</option>
          <option value="flex-start">start</option>
          <option value="center">center</option>
          <option value="flex-end">end</option>
          <option value="stretch">stretch</option>
        </select>
      </Row>
      <Row label="Justify">
        <select value={ov.justify ?? ""} onChange={(e) => onChange({ justify: e.target.value })} style={input}>
          <option value="">auto</option>
          <option value="flex-start">start</option>
          <option value="center">center</option>
          <option value="flex-end">end</option>
          <option value="space-between">between</option>
          <option value="space-around">around</option>
        </select>
      </Row>

      <Group>APPEARANCE</Group>
      <Row label="Radius">
        <input value={ov.radius ?? ""} placeholder="12px" onChange={(e) => onChange({ radius: e.target.value })} style={input} />
      </Row>
      <Row label="Border">
        <input value={ov.border ?? ""} placeholder="1px solid #D4A64A" onChange={(e) => onChange({ border: e.target.value })} style={input} />
      </Row>
      <Row label="Background">
        <input value={ov.bg ?? ""} placeholder="#0B1624" onChange={(e) => onChange({ bg: e.target.value })} style={input} />
      </Row>
      <Row label="Image URL">
        <input value={ov.image ?? ""} placeholder="/img.jpg" onChange={(e) => onChange({ image: e.target.value })} style={input} />
      </Row>
      <Row label="Shadow">
        <select
          value={Object.keys(SHADOWS).find((k) => SHADOWS[k] === ov.shadow) ?? ""}
          onChange={(e) => onChange({ shadow: SHADOWS[e.target.value] ?? "" })}
          style={input}
        >
          <option value="">auto</option>
          {Object.keys(SHADOWS).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </Row>
      <Row label="Opacity">
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={ov.opacity ?? 1}
          onChange={(e) => onChange({ opacity: Number(e.target.value) })}
          style={{ width: 118 }}
        />
      </Row>

      <Group>TYPOGRAPHY</Group>
      <Row label="Colour">
        <input value={ov.color ?? ""} placeholder="#F5F1E6" onChange={(e) => onChange({ color: e.target.value })} style={input} />
      </Row>
      <Row label="Font size">
        <input value={ov.fontSize ?? ""} placeholder="16px" onChange={(e) => onChange({ fontSize: e.target.value })} style={input} />
      </Row>
      <Row label="Weight">
        <input value={ov.fontWeight ?? ""} placeholder="600" onChange={(e) => onChange({ fontWeight: e.target.value })} style={input} />
      </Row>
      <Row label="Family">
        <input value={ov.fontFamily ?? ""} placeholder="Inter" onChange={(e) => onChange({ fontFamily: e.target.value })} style={input} />
      </Row>
      <Row label="Tracking">
        <input value={ov.letterSpacing ?? ""} placeholder="0.02em" onChange={(e) => onChange({ letterSpacing: e.target.value })} style={input} />
      </Row>
      <Row label="Line height">
        <input value={ov.lineHeight ?? ""} placeholder="1.4" onChange={(e) => onChange({ lineHeight: e.target.value })} style={input} />
      </Row>
      <Row label="Text align">
        <select value={ov.textAlign ?? ""} onChange={(e) => onChange({ textAlign: e.target.value })} style={input}>
          <option value="">auto</option>
          <option value="left">left</option>
          <option value="center">center</option>
          <option value="right">right</option>
          <option value="justify">justify</option>
        </select>
      </Row>

      <Group>LAYER</Group>
      <Row label="Z-index">
        <input type="number" value={ov.z ?? 0} onChange={(e) => onChange({ z: Number(e.target.value) })} style={input} />
      </Row>
      <Row label="Visible">
        <input type="checkbox" checked={!ov.hidden} onChange={(e) => onChange({ hidden: !e.target.checked })} />
      </Row>
      <Row label="Locked">
        <input type="checkbox" checked={!!ov.locked} onChange={(e) => onChange({ locked: e.target.checked })} />
      </Row>

      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        <button type="button" onClick={onReset} style={{ ...btn, flex: 1 }}>
          Reset selection
        </button>
      </div>
      <div style={{ marginTop: 8, opacity: 0.5, fontSize: 10 }}>
        Shift/Cmd+Click to multi-select · drag empty space to marquee · Ctrl+Z undo · Ctrl+Shift+Z redo · Esc deselect
      </div>
    </div>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, letterSpacing: "0.1em", opacity: 0.55, margin: "12px 0 6px" }}>{children}</div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
      <span style={{ opacity: 0.7 }}>{label}</span>
      {children}
    </div>
  );
}

const input: React.CSSProperties = {
  width: 118,
  background: "#0B1622",
  border: "1px solid rgba(245,241,230,0.16)",
  borderRadius: 6,
  color: "#F5F1E6",
  padding: "4px 6px",
  fontSize: 11.5,
  outline: "none",
};

const btn: React.CSSProperties = {
  background: "rgba(245,241,230,0.08)",
  border: "1px solid rgba(245,241,230,0.16)",
  borderRadius: 6,
  color: "#F5F1E6",
  padding: "5px 8px",
  fontSize: 11,
  cursor: "pointer",
};
