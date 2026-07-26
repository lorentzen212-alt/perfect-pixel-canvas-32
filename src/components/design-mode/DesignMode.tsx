import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  History,
  clone,
  diffSummary,
  makeSnapshot,
  type DesignDoc,
  type Override,
  type Snapshot,
  designModeAllowed,
  elementAtPath,
  emptyDoc,
  isEnabledPersisted,
  isPrecisionPersisted,
  loadDoc,
  loadSnapshots,
  pathOf,
  saveDoc,
  saveSnapshots,
  setEnabledPersisted,
  setPrecisionPersisted,
  snap,
} from "@/lib/designMode/store";

/* ------------------------------------------------------------------ */
/* tokens                                                              */
/* ------------------------------------------------------------------ */

const GOLD = "#D4A64A";
const GOLD_SOFT = "rgba(212,166,74,0.55)";
const PANEL = "#0F1C29";
const PANEL_DEEP = "#0B1622";
const IVORY = "#F5F1E6";
const FONT = "Inter, system-ui, sans-serif";
const Z = 2147482000;

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

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
  "H1",
  "H2",
  "H3",
  "H4",
  "P",
  "SPAN",
  "BUTTON",
  "A",
]);

function isUi(el: Element | null) {
  return !!el?.closest("[data-dm-ui]");
}

function pickTarget(el: Element | null): HTMLElement | null {
  let cur: HTMLElement | null = el as HTMLElement | null;
  while (cur && cur !== document.body) {
    if (SELECTABLE.has(cur.tagName)) {
      const r = cur.getBoundingClientRect();
      if (r.width >= 12 && r.height >= 10) return cur;
    }
    cur = cur.parentElement;
  }
  return null;
}

function candidateRects(exclude: HTMLElement[]) {
  const out: { el: HTMLElement; r: DOMRect }[] = [];
  document
    .querySelectorAll<HTMLElement>("section,header,footer,nav,aside,article,div,li,img,h1,h2,h3,p")
    .forEach((el) => {
      if (isUi(el)) return;
      if (exclude.some((x) => x === el || el.contains(x) || x.contains(el))) return;
      const r = el.getBoundingClientRect();
      if (r.width < 24 || r.height < 16) return;
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      out.push({ el, r });
    });
  return out.slice(0, 400);
}

type Guide = { x?: number; y?: number };
type DistLabel = { x: number; y: number; text: string };
type Marquee = { x1: number; y1: number; x2: number; y2: number };

const STYLE_PROPS = [
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
  "background",
  "border",
  "color",
  "font-size",
  "font-weight",
  "letter-spacing",
  "line-height",
  "text-align",
];

/* ------------------------------------------------------------------ */
/* component                                                           */
/* ------------------------------------------------------------------ */

export default function DesignMode() {
  const routePath = useRouterState({ select: (s) => s.location.pathname });

  const [allowed, setAllowed] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [precision, setPrecision] = useState(true);

  /** persisted, source of truth for the live page */
  const [liveDoc, setLiveDoc] = useState<DesignDoc>(emptyDoc());
  /** in-memory working copy (only while Design Mode is on) */
  const [working, setWorking] = useState<DesignDoc | null>(null);
  /** preview patch awaiting Apply / Discard */
  const [pending, setPending] = useState<{ doc: DesignDoc; summary: string[] } | null>(null);
  const [compare, setCompare] = useState(false);

  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [showSnapshots, setShowSnapshots] = useState(false);
  const [summary, setSummary] = useState<string[]>([]);

  const [selected, setSelected] = useState<string[]>([]);
  const [hover, setHover] = useState<string | null>(null);
  const [, forceTick] = useState(0);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [dists, setDists] = useState<DistLabel[]>([]);
  const [marquee, setMarquee] = useState<Marquee | null>(null);
  const [menu, setMenu] = useState<{ x: number; y: number; path: string } | null>(null);

  const historyRef = useRef<History | null>(null);
  const appliedRef = useRef<Set<HTMLElement>>(new Set());
  const textRef = useRef<Map<HTMLElement, string>>(new Map());
  const opsAppliedRef = useRef(false);

  const rerender = useCallback(() => forceTick((t) => t + 1), []);
  const grid = useCallback((v: number) => (precision ? Math.round(v) : snap(v)), [precision]);

  /** the doc currently rendered */
  const doc = useMemo(() => {
    if (!enabled) return liveDoc;
    if (pending && !compare) return pending.doc;
    return working ?? liveDoc;
  }, [enabled, liveDoc, working, pending, compare]);

  /* ---- boot ---- */
  useEffect(() => {
    setAllowed(designModeAllowed());
    setPrecision(isPrecisionPersisted());
    if (isEnabledPersisted()) setEnabled(true);
  }, []);

  useEffect(() => {
    const loaded = loadDoc(routePath);
    historyRef.current = new History(loaded);
    opsAppliedRef.current = false;
    setLiveDoc(loaded);
    setWorking(null);
    setPending(null);
    setSelected([]);
    setSnapshots(loadSnapshots(routePath));
  }, [routePath]);

  /* ---- start / stop a session ---- */
  const startSession = useCallback(() => {
    const copy = clone(liveDoc);
    historyRef.current = new History(copy);
    setWorking(copy);
    setPending(null);
    setSummary([]);
    const list = [...loadSnapshots(routePath), makeSnapshot("Working Copy", copy)];
    saveSnapshots(routePath, list);
    setSnapshots(list);
  }, [liveDoc, routePath]);

  useEffect(() => {
    if (enabled && !working) startSession();
  }, [enabled, working, startSession]);

  /* ---- commit into the working copy (never the live page) ---- */
  const commit = useCallback(
    (next: DesignDoc) => {
      const before = working ?? liveDoc;
      setSummary(diffSummary(before, next));
      historyRef.current?.push(next);
      setWorking(next);
      setPending(null);
    },
    [working, liveDoc],
  );

  const patchMany = useCallback(
    (paths: string[], p: Override) => {
      const base = working ?? liveDoc;
      const overrides = { ...base.overrides };
      paths.forEach((path) => {
        if (overrides[path]?.locked && p.locked === undefined) return;
        overrides[path] = { ...(overrides[path] ?? {}), ...p };
      });
      commit({ ops: base.ops, overrides });
    },
    [working, liveDoc, commit],
  );

  const patch = useCallback((path: string, p: Override) => patchMany([path], p), [patchMany]);

  /* ---- structural ops replay ---- */
  const applyOp = useCallback((op: { type: string; path: string }) => {
    const el = elementAtPath(op.path);
    if (!el) return;
    if (op.type === "duplicate") {
      const c = el.cloneNode(true) as HTMLElement;
      el.parentElement?.insertBefore(c, el.nextSibling);
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
  }, []);

  useEffect(() => {
    if (opsAppliedRef.current) return;
    if (!liveDoc.ops.length) {
      opsAppliedRef.current = true;
      return;
    }
    const t = window.setTimeout(() => {
      liveDoc.ops.forEach((op) => applyOp(op));
      opsAppliedRef.current = true;
      rerender();
    }, 250);
    return () => window.clearTimeout(t);
  }, [liveDoc.ops, applyOp, rerender]);

  /* ---- apply overrides to the DOM ---- */
  const applyOverrides = useCallback(() => {
    appliedRef.current.forEach((el) => {
      STYLE_PROPS.forEach((p) => el.style.removeProperty(p));
    });
    appliedRef.current.clear();
    textRef.current.forEach((original, el) => {
      if (el.isConnected) el.textContent = original;
    });
    textRef.current.clear();

    Object.entries(doc.overrides).forEach(([path, o]) => {
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
      if (o.maxW) el.style.maxWidth = o.maxW;
      if (o.opacity != null) el.style.opacity = String(o.opacity);
      if (o.shadow) el.style.boxShadow = o.shadow;
      if (o.z != null) el.style.zIndex = String(o.z);
      if (o.bg) el.style.background = o.bg;
      if (o.border) el.style.border = o.border;
      if (o.color) el.style.color = o.color;
      if (o.fontSize) el.style.fontSize = o.fontSize;
      if (o.fontWeight) el.style.fontWeight = o.fontWeight;
      if (o.letterSpacing) el.style.letterSpacing = o.letterSpacing;
      if (o.lineHeight) el.style.lineHeight = o.lineHeight;
      if (o.textAlign) el.style.textAlign = o.textAlign;
      if (o.hidden) el.style.display = "none";
      if (o.src && el.tagName === "IMG") (el as HTMLImageElement).src = o.src;
      if (o.text != null) {
        if (!textRef.current.has(el)) textRef.current.set(el, el.textContent ?? "");
        el.textContent = o.text;
      }
    });
  }, [doc]);

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
        setSelected([]);
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
      setPending(null);
      setWorking(clone(next));
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
        // marquee / drag selection
        if (!additive) setSelected([]);
        const x1 = e.clientX;
        const y1 = e.clientY;
        const move = (ev: MouseEvent) => setMarquee({ x1, y1, x2: ev.clientX, y2: ev.clientY });
        const up = (ev: MouseEvent) => {
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mouseup", up);
          setMarquee(null);
          const box = {
            left: Math.min(x1, ev.clientX),
            top: Math.min(y1, ev.clientY),
            right: Math.max(x1, ev.clientX),
            bottom: Math.max(y1, ev.clientY),
          };
          if (box.right - box.left < 8 || box.bottom - box.top < 8) return;
          const hits: string[] = [];
          candidateRects([]).forEach(({ el, r }) => {
            if (r.left >= box.left && r.top >= box.top && r.right <= box.right && r.bottom <= box.bottom) {
              if (!hits.some((p) => elementAtPath(p)?.contains(el))) hits.push(pathOf(el));
            }
          });
          setSelected((prev) => (additive ? Array.from(new Set([...prev, ...hits])) : hits.slice(0, 40)));
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", up);
        return;
      }

      const path = pathOf(t);
      setMenu(null);

      let nextSel: string[];
      if (additive) {
        nextSel = selected.includes(path) ? selected.filter((p) => p !== path) : [...selected, path];
        setSelected(nextSel);
        return;
      }
      nextSel = selected.includes(path) ? selected : [path];
      setSelected(nextSel);

      const base = working ?? liveDoc;
      const movable = nextSel.filter((p) => !base.overrides[p]?.locked);
      if (!movable.length) return;

      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const items = movable
        .map((p) => {
          const el = elementAtPath(p);
          if (!el) return null;
          const ov = base.overrides[p] ?? {};
          return { p, el, baseX: ov.x ?? 0, baseY: ov.y ?? 0, rect: el.getBoundingClientRect() };
        })
        .filter(Boolean) as { p: string; el: HTMLElement; baseX: number; baseY: number; rect: DOMRect }[];

      const others = candidateRects(items.map((i) => i.el));
      const anchor = items[0];
      let moved = false;
      const last: Record<string, { x: number; y: number }> = {};

      const move = (ev: MouseEvent) => {
        moved = true;
        let dx = grid(ev.clientX - startX);
        let dy = grid(ev.clientY - startY);

        const rect = {
          left: anchor.rect.left + dx,
          top: anchor.rect.top + dy,
          width: anchor.rect.width,
          height: anchor.rect.height,
        };
        const g: Guide[] = [];
        const d: DistLabel[] = [];
        const edgesX = [rect.left, rect.left + rect.width / 2, rect.left + rect.width];
        const edgesY = [rect.top, rect.top + rect.height / 2, rect.top + rect.height];

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

        let bestV: { gap: number; y: number } | null = null;
        let bestH: { gap: number; x: number } | null = null;
        others.forEach(({ r }) => {
          const vGap = rect.top - r.bottom;
          if (vGap >= 0 && vGap < 220 && (!bestV || vGap < bestV.gap)) bestV = { gap: vGap, y: r.bottom };
          const hGap = rect.left - r.right;
          if (hGap >= 0 && hGap < 220 && (!bestH || hGap < bestH.gap)) bestH = { gap: hGap, x: r.right };
        });
        if (bestV) {
          const v = bestV as { gap: number; y: number };
          d.push({ x: rect.left + rect.width / 2, y: v.y + v.gap / 2, text: `${Math.round(v.gap)}px` });
        }
        if (bestH) {
          const h = bestH as { gap: number; x: number };
          d.push({ x: h.x + h.gap / 2, y: rect.top + rect.height / 2, text: `${Math.round(h.gap)}px` });
        }

        setGuides(g.slice(0, 8));
        setDists(d);

        items.forEach((it) => {
          const x = it.baseX + dx;
          const y = it.baseY + dy;
          last[it.p] = { x, y };
          it.el.style.transform = `translate(${x}px, ${y}px)`;
        });
      };

      const up = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
        setGuides([]);
        setDists([]);
        if (!moved) return;
        const src = working ?? liveDoc;
        const overrides = { ...src.overrides };
        Object.entries(last).forEach(([p, v]) => {
          overrides[p] = { ...(overrides[p] ?? {}), x: v.x, y: v.y };
        });
        commit({ ops: src.ops, overrides });
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
      setSelected((prev) => (prev.includes(path) ? prev : [path]));
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
  }, [enabled, selected, working, liveDoc, commit, grid]);

  /* ---- resize ---- */
  const primary = selected[0] ?? null;
  const startResize = (corner: "nw" | "ne" | "sw" | "se") => (e: React.MouseEvent) => {
    if (!primary) return;
    const el = elementAtPath(primary);
    if (!el) return;
    const base = working ?? liveDoc;
    if (base.overrides[primary]?.locked) return;
    e.preventDefault();
    e.stopPropagation();
    const r = el.getBoundingClientRect();
    const ov = base.overrides[primary] ?? {};
    const sx = e.clientX;
    const sy = e.clientY;
    let w = r.width;
    let h = r.height;
    let x = ov.x ?? 0;
    let y = ov.y ?? 0;

    const move = (ev: MouseEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (corner.includes("e")) w = Math.max(16, grid(r.width + dx));
      if (corner.includes("s")) h = Math.max(12, grid(r.height + dy));
      if (corner.includes("w")) {
        w = Math.max(16, grid(r.width - dx));
        x = grid((ov.x ?? 0) + dx);
      }
      if (corner.includes("n")) {
        h = Math.max(12, grid(r.height - dy));
        y = grid((ov.y ?? 0) + dy);
      }
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.transform = `translate(${x}px, ${y}px)`;
      rerender();
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      patch(primary, { w: Math.round(w), h: Math.round(h), x, y });
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const runOp = (op: { type: "duplicate" | "delete" | "wrap" | "ungroup"; path: string }) => {
    const base = working ?? liveDoc;
    applyOp(op);
    commit({ overrides: base.overrides, ops: [...base.ops, op] });
    setMenu(null);
    setSelected([]);
  };

  /* ---- AI edit (selection-scoped, preview first) ---- */
  const aiEdit = () => {
    if (!selected.length) return;
    const q = window.prompt(
      "Describe the change for the selected element(s) only:\ne.g. \"width +48\", \"radius 20px\", \"shadow soft\", \"opacity 0.8\", \"padding 24px\"",
    );
    if (!q) return;
    const base = working ?? liveDoc;
    const overrides = { ...base.overrides };
    const text = q.toLowerCase();
    const num = (re: RegExp) => {
      const m = text.match(re);
      return m ? parseFloat(m[1]) : null;
    };

    selected.forEach((p) => {
      if (overrides[p]?.locked) return;
      const el = elementAtPath(p);
      const rect = el?.getBoundingClientRect();
      const cur = { ...(overrides[p] ?? {}) };

      const wDelta = num(/width\s*([+-]\s*\d+(?:\.\d+)?)/);
      if (wDelta != null && rect) cur.w = Math.round((cur.w ?? rect.width) + wDelta);
      const wAbs = num(/width\s*(?:to\s*)?(\d+(?:\.\d+)?)\s*px/);
      if (wAbs != null && wDelta == null) cur.w = Math.round(wAbs);

      const hDelta = num(/height\s*([+-]\s*\d+(?:\.\d+)?)/);
      if (hDelta != null && rect) cur.h = Math.round((cur.h ?? rect.height) + hDelta);
      const hAbs = num(/height\s*(?:to\s*)?(\d+(?:\.\d+)?)\s*px/);
      if (hAbs != null && hDelta == null) cur.h = Math.round(hAbs);

      const radius = num(/radius\s*(?:to\s*)?(\d+(?:\.\d+)?)/);
      if (radius != null) cur.radius = `${radius}px`;
      const padding = num(/padding\s*(?:to\s*)?(\d+(?:\.\d+)?)/);
      if (padding != null) cur.padding = `${padding}px`;
      const gap = num(/gap\s*(?:to\s*)?(\d+(?:\.\d+)?)/);
      if (gap != null) cur.gap = `${gap}px`;
      const opacity = num(/opacity\s*(?:to\s*)?(0?\.\d+|1|0)/);
      if (opacity != null) cur.opacity = opacity;
      const fs = num(/(?:font|text)\s*size\s*(?:to\s*)?(\d+(?:\.\d+)?)/);
      if (fs != null) cur.fontSize = `${fs}px`;

      if (/shadow\s*(none|off)/.test(text)) cur.shadow = "none";
      else if (/shadow\s*(soft|reduce|less)/.test(text)) cur.shadow = SHADOWS.soft;
      else if (/shadow\s*(medium)/.test(text)) cur.shadow = SHADOWS.medium;
      else if (/shadow\s*(strong|more)/.test(text)) cur.shadow = SHADOWS.strong;

      const hex = text.match(/#([0-9a-f]{3,8})/);
      if (hex) {
        if (/text|color|colour/.test(text) && !/background|bg/.test(text)) cur.color = `#${hex[1]}`;
        else cur.bg = `#${hex[1]}`;
      }
      overrides[p] = cur;
    });

    const next: DesignDoc = { ops: base.ops, overrides };
    const s = diffSummary(base, next);
    setPending({ doc: next, summary: s.length ? s : ["No matching property found in that instruction"] });
    setCompare(false);
  };

  /* ---- save / discard ---- */
  const saveChanges = () => {
    const next = working ?? liveDoc;
    saveDoc(routePath, next);
    setLiveDoc(clone(next));
    setSummary(["Working copy saved to the live page"]);
  };

  const discardChanges = () => {
    const structural = JSON.stringify((working ?? liveDoc).ops) !== JSON.stringify(liveDoc.ops);
    setPending(null);
    setWorking(clone(liveDoc));
    historyRef.current = new History(liveDoc);
    setSelected([]);
    setSummary([]);
    if (structural) window.location.reload();
  };

  const restoreSnapshot = (s: Snapshot) => {
    const structural = JSON.stringify(s.doc.ops) !== JSON.stringify((working ?? liveDoc).ops);
    setPending(null);
    setWorking(clone(s.doc));
    historyRef.current?.push(clone(s.doc));
    setSummary([`Restored snapshot “${s.name}”`]);
    setShowSnapshots(false);
    if (structural) window.setTimeout(() => window.location.reload(), 50);
  };

  const addSnapshot = () => {
    const name = window.prompt("Snapshot name", `${routePath === "/" ? "Homepage" : routePath.replace("/", "")} v${snapshots.length + 1}`);
    if (!name) return;
    const list = [...snapshots, makeSnapshot(name, working ?? liveDoc)];
    saveSnapshots(routePath, list);
    setSnapshots(list);
  };

  /* ---- derived rects ---- */
  const selEls = selected.map((p) => elementAtPath(p)).filter(Boolean) as HTMLElement[];
  const selRects = selEls.map((el) => el.getBoundingClientRect());
  const primaryRect = selRects[0];
  const primaryOv: Override = (primary && doc.overrides[primary]) || {};
  const hovEl = hover && !selected.includes(hover) ? elementAtPath(hover) : null;
  const hovRect = hovEl?.getBoundingClientRect();

  const label = useMemo(() => {
    const el = selEls[0];
    if (!el) return "";
    if (selected.length > 1) return `${selected.length} elements selected`;
    return (
      primaryOv.name ||
      `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : ""}`
    );
  }, [selEls, selected.length, primaryOv.name]);

  const dirty = !!working && JSON.stringify(working) !== JSON.stringify(liveDoc);

  if (!allowed) return null;

  return (
    <div data-dm-ui="">
      {/* floating toggle */}
      <button
        type="button"
        onClick={() => {
          const next = !enabled;
          if (!next && dirty && !window.confirm("Leave Design Mode? Unsaved working-copy changes will be discarded.")) return;
          if (!next) {
            setWorking(null);
            setPending(null);
            setSelected([]);
            setMenu(null);
          }
          setEnabled(next);
          setEnabledPersisted(next);
        }}
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: Z + 1000,
          padding: "9px 14px",
          borderRadius: 999,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.04em",
          fontFamily: FONT,
          color: enabled ? "#0B1622" : IVORY,
          background: enabled ? "linear-gradient(135deg,#F1D08A,#C79A32)" : "rgba(11,22,34,0.92)",
          border: `1px solid ${GOLD_SOFT}`,
          boxShadow: "0 12px 30px -12px rgba(0,0,0,0.65)",
          cursor: "pointer",
        }}
      >
        {enabled ? "Design Mode · ON" : "Design Mode"}
      </button>

      {!enabled ? null : (
        <>
          {/* top session bar */}
          <div
            data-dm-ui=""
            style={{
              position: "fixed",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 999,
              background: "rgba(11,22,34,0.94)",
              border: `1px solid ${GOLD_SOFT}`,
              boxShadow: "0 24px 60px -30px rgba(0,0,0,0.9)",
              zIndex: Z + 900,
              fontFamily: FONT,
              color: IVORY,
              fontSize: 11.5,
              backdropFilter: "blur(8px)",
            }}
          >
            <span style={{ letterSpacing: "0.1em", opacity: 0.75, paddingLeft: 4 }}>WORKING COPY</span>
            <Dot />
            <button type="button" style={btn} onClick={() => historyRef.current && applyHistory(historyRef.current.undo(), setWorking, setPending)}>
              ↶ Undo
            </button>
            <button type="button" style={btn} onClick={() => historyRef.current && applyHistory(historyRef.current.redo(), setWorking, setPending)}>
              ↷ Redo
            </button>
            <Dot />
            <button
              type="button"
              style={{ ...btn, background: precision ? "rgba(212,166,74,0.22)" : btn.background, borderColor: precision ? GOLD_SOFT : undefined }}
              onClick={() => {
                const n = !precision;
                setPrecision(n);
                setPrecisionPersisted(n);
              }}
              title="Pixel Precision — exact values, no snapping or layout optimisation"
            >
              {precision ? "◎ Pixel Precision" : "◌ 8px Grid"}
            </button>
            <button type="button" style={btn} onClick={() => setShowSnapshots((s) => !s)}>
              ⌛ Versions ({snapshots.length})
            </button>
            <Dot />
            <button type="button" style={btn} onClick={discardChanges}>
              Discard
            </button>
            <button
              type="button"
              onClick={saveChanges}
              style={{
                ...btn,
                color: "#0B1622",
                fontWeight: 700,
                background: dirty ? "linear-gradient(135deg,#F1D08A,#C79A32)" : "rgba(212,166,74,0.35)",
                border: "1px solid rgba(212,166,74,0.7)",
              }}
            >
              Save Changes
            </button>
          </div>

          {/* version history */}
          {showSnapshots && (
            <div
              data-dm-ui=""
              style={{
                position: "fixed",
                top: 60,
                left: "50%",
                transform: "translateX(-50%)",
                width: 320,
                maxHeight: 320,
                overflowY: "auto",
                background: PANEL,
                border: "1px solid rgba(245,241,230,0.14)",
                borderRadius: 12,
                padding: 10,
                zIndex: Z + 950,
                color: IVORY,
                fontFamily: FONT,
                fontSize: 11.5,
                boxShadow: "0 30px 70px -28px rgba(0,0,0,0.85)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <strong style={{ letterSpacing: "0.08em" }}>VERSION HISTORY</strong>
                <button type="button" style={btn} onClick={addSnapshot}>
                  + Snapshot
                </button>
              </div>
              {snapshots.length === 0 && <div style={{ opacity: 0.6 }}>No snapshots yet.</div>}
              {[...snapshots].reverse().map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 4px",
                    borderTop: "1px solid rgba(245,241,230,0.08)",
                  }}
                >
                  <span>
                    {s.name}
                    <span style={{ opacity: 0.45 }}> · {new Date(s.at).toLocaleTimeString()}</span>
                  </span>
                  <button type="button" style={btn} onClick={() => restoreSnapshot(s)}>
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* hover outline */}
          {hovRect && (
            <Outline rect={hovRect} color="rgba(212,166,74,0.45)" />
          )}

          {/* secondary selections */}
          {selRects.slice(1).map((r, i) => (
            <Outline key={i} rect={r} color={GOLD_SOFT} />
          ))}

          {/* primary selection + handles */}
          {primaryRect && (
            <div
              style={{
                position: "fixed",
                left: primaryRect.left,
                top: primaryRect.top,
                width: primaryRect.width,
                height: primaryRect.height,
                border: `1.5px solid ${GOLD}`,
                pointerEvents: "none",
                zIndex: Z + 120,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: -22,
                  left: 0,
                  background: GOLD,
                  color: "#0B1622",
                  fontSize: 10,
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontFamily: FONT,
                  whiteSpace: "nowrap",
                }}
              >
                {primaryOv.locked ? "🔒 " : ""}
                {label} · {Math.round(primaryRect.width)}×{Math.round(primaryRect.height)}
              </span>
              {!primaryOv.locked &&
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
          )}

          {/* floating toolbar */}
          {primaryRect && (
            <div
              data-dm-ui=""
              style={{
                position: "fixed",
                left: Math.max(8, Math.min(primaryRect.left, window.innerWidth - 470)),
                top: primaryRect.bottom + 10 > window.innerHeight - 50 ? primaryRect.top - 46 : primaryRect.bottom + 10,
                display: "flex",
                gap: 4,
                padding: 5,
                borderRadius: 10,
                background: "rgba(11,22,34,0.96)",
                border: `1px solid ${GOLD_SOFT}`,
                boxShadow: "0 22px 50px -26px rgba(0,0,0,0.9)",
                zIndex: Z + 400,
                fontFamily: FONT,
              }}
            >
              {[
                { l: "↔ Move", run: () => window.alert("Drag the element on the canvas to move it.") },
                { l: "⤢ Resize", run: () => window.alert("Drag any corner handle to resize.") },
                { l: "Style", run: () => setInspectorTab("style") },
                { l: "Spacing", run: () => setInspectorTab("spacing") },
                {
                  l: "Image",
                  run: () => {
                    const url = window.prompt("Image URL");
                    if (url) patchMany(selected, { src: url });
                  },
                },
                {
                  l: "Text",
                  run: () => {
                    const el = selEls[0];
                    const t = window.prompt("Text", primaryOv.text ?? el?.textContent ?? "");
                    if (t != null && primary) patch(primary, { text: t });
                  },
                },
                { l: "Duplicate", run: () => primary && runOp({ type: "duplicate", path: primary }) },
                { l: "Delete", run: () => primary && runOp({ type: "delete", path: primary }) },
                { l: "✦ AI Edit", run: aiEdit },
              ].map((a) => (
                <button key={a.l} type="button" style={{ ...btn, whiteSpace: "nowrap" }} onClick={a.run}>
                  {a.l}
                </button>
              ))}
            </div>
          )}

          {/* marquee */}
          {marquee && (
            <div
              style={{
                position: "fixed",
                left: Math.min(marquee.x1, marquee.x2),
                top: Math.min(marquee.y1, marquee.y2),
                width: Math.abs(marquee.x2 - marquee.x1),
                height: Math.abs(marquee.y2 - marquee.y1),
                border: `1px solid ${GOLD}`,
                background: "rgba(212,166,74,0.10)",
                pointerEvents: "none",
                zIndex: Z + 150,
              }}
            />
          )}

          {/* alignment guides */}
          {guides.map((g, i) => (
            <div
              key={i}
              style={{
                position: "fixed",
                background: "#FF3D71",
                pointerEvents: "none",
                zIndex: Z + 200,
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
                background: "#FF3D71",
                color: "#fff",
                fontSize: 10,
                padding: "1px 5px",
                borderRadius: 3,
                pointerEvents: "none",
                zIndex: Z + 300,
                fontFamily: FONT,
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
                left: Math.min(menu.x, window.innerWidth - 210),
                top: Math.min(menu.y, window.innerHeight - 340),
                width: 196,
                background: "#12202E",
                border: "1px solid rgba(245,241,230,0.14)",
                borderRadius: 10,
                padding: 6,
                zIndex: Z + 1100,
                boxShadow: "0 24px 60px -24px rgba(0,0,0,0.8)",
                fontFamily: FONT,
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
                    color: IVORY,
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

          {/* preview bar for pending AI change */}
          {pending && (
            <div
              data-dm-ui=""
              style={{
                position: "fixed",
                bottom: 18,
                left: "50%",
                transform: "translateX(-50%)",
                width: 420,
                background: PANEL,
                border: `1px solid ${GOLD_SOFT}`,
                borderRadius: 12,
                padding: 12,
                zIndex: Z + 1000,
                color: IVORY,
                fontFamily: FONT,
                fontSize: 11.5,
                boxShadow: "0 30px 70px -28px rgba(0,0,0,0.9)",
              }}
            >
              <strong style={{ letterSpacing: "0.08em" }}>PREVIEW · {compare ? "BEFORE" : "AFTER"}</strong>
              <ul style={{ margin: "8px 0", paddingLeft: 16, lineHeight: 1.6 }}>
                {pending.summary.map((s, i) => (
                  <li key={i}>✓ {s}</li>
                ))}
              </ul>
              <div style={{ opacity: 0.55, marginBottom: 8 }}>
                Scope: {selected.length} selected element{selected.length === 1 ? "" : "s"} · no other components modified.
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  style={{ ...btn, flex: 1, background: "linear-gradient(135deg,#F1D08A,#C79A32)", color: "#0B1622", fontWeight: 700 }}
                  onClick={() => {
                    commit(pending.doc);
                    setCompare(false);
                  }}
                >
                  Apply
                </button>
                <button
                  type="button"
                  style={{ ...btn, flex: 1 }}
                  onClick={() => {
                    setPending(null);
                    setCompare(false);
                  }}
                >
                  Discard
                </button>
                <button
                  type="button"
                  style={{ ...btn, flex: 1 }}
                  onMouseDown={() => setCompare(true)}
                  onMouseUp={() => setCompare(false)}
                  onMouseLeave={() => setCompare(false)}
                >
                  Hold to Compare
                </button>
              </div>
            </div>
          )}

          {/* change summary */}
          {!pending && summary.length > 0 && (
            <div
              data-dm-ui=""
              style={{
                position: "fixed",
                left: 16,
                bottom: 16,
                maxWidth: 300,
                background: "rgba(11,22,34,0.94)",
                border: "1px solid rgba(245,241,230,0.14)",
                borderRadius: 10,
                padding: "10px 12px",
                zIndex: Z + 800,
                color: IVORY,
                fontFamily: FONT,
                fontSize: 11,
                lineHeight: 1.6,
              }}
            >
              <strong style={{ letterSpacing: "0.08em", fontSize: 10, opacity: 0.7 }}>CHANGE SUMMARY</strong>
              {summary.map((s, i) => (
                <div key={i}>✓ {s}</div>
              ))}
              <div style={{ opacity: 0.5, marginTop: 4 }}>No other components modified.</div>
            </div>
          )}

          {/* inspector */}
          {primary && (
            <Inspector
              count={selected.length}

              count={selected.length}
              ov={primaryOv}
              rect={primaryRect}
              onChange={(p) => patchMany(selected, p)}
              onReset={() => {
                const base = working ?? liveDoc;
                const overrides = { ...base.overrides };
                selected.forEach((p) => delete overrides[p]);
                commit({ overrides, ops: base.ops });
              }}
              onClose={() => setSelected([])}
            />
          )}
        </>
      )}
    </div>
  );

  function setInspectorTab(t: InspectorTab) {
    setTab(t);
  }
}

function applyHistory(
  next: DesignDoc | null,
  setWorking: (d: DesignDoc) => void,
  setPending: (p: null) => void,
) {
  if (!next) return;
  setPending(null);
  setWorking(clone(next));
}

/* tab state lives outside the render body via a tiny module store */
type InspectorTab = "style" | "spacing" | "layout" | "text";
let tabListeners: ((t: InspectorTab) => void)[] = [];
let currentTab: InspectorTab = "style";
function setTab(t: InspectorTab) {
  currentTab = t;
  tabListeners.forEach((l) => l(t));
}
function useTab(): [InspectorTab, (t: InspectorTab) => void] {
  const [t, set] = useState<InspectorTab>(currentTab);
  useEffect(() => {
    tabListeners.push(set);
    return () => {
      tabListeners = tabListeners.filter((l) => l !== set);
    };
  }, []);
  return [t, setTab];
}

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
  onChange,
  onReset,
  onClose,
}: {
  tab: InspectorTab;
  setTab: (t: InspectorTab) => void;
  count: number;
  ov: Override;
  rect?: DOMRect;
  onChange: (p: Override) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  const [tab, set] = useTab();

  return (
    <div
      data-dm-ui=""
      style={{
        position: "fixed",
        right: 16,
        top: 70,
        width: 262,
        maxHeight: "calc(100vh - 150px)",
        overflowY: "auto",
        background: PANEL,
        border: "1px solid rgba(245,241,230,0.14)",
        borderRadius: 12,
        padding: 12,
        zIndex: Z + 700,
        color: IVORY,
        fontFamily: FONT,
        fontSize: 11.5,
        boxShadow: "0 30px 70px -28px rgba(0,0,0,0.85)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <strong style={{ fontSize: 12, letterSpacing: "0.06em" }}>INSPECTOR</strong>
        <button type="button" onClick={onClose} style={btn}>
          ✕
        </button>
      </div>

      <div style={{ opacity: 0.65, marginBottom: 10 }}>
        {count > 1 ? `${count} elements` : ov.name ? ov.name : "Element"}
        {rect ? ` · ${Math.round(rect.width)} × ${Math.round(rect.height)}` : ""}
        {ov.locked ? " · 🔒 locked" : ""}
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
        {(["style", "spacing", "layout", "text"] as InspectorTab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => set(t)}
            style={{
              ...btn,
              flex: 1,
              padding: "4px 0",
              textTransform: "capitalize",
              background: tab === t ? "rgba(212,166,74,0.24)" : btn.background,
              borderColor: tab === t ? GOLD_SOFT : undefined,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "style" && (
        <>
          <Row label="Background">
            <input value={ov.bg ?? ""} placeholder="#0B1624" onChange={(e) => onChange({ bg: e.target.value })} style={input} />
          </Row>
          <Row label="Border">
            <input value={ov.border ?? ""} placeholder="1px solid #D4A64A" onChange={(e) => onChange({ border: e.target.value })} style={input} />
          </Row>
          <Row label="Radius">
            <input value={ov.radius ?? ""} placeholder="24px" onChange={(e) => onChange({ radius: e.target.value })} style={input} />
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
              style={{ width: 124 }}
            />
          </Row>
          <Row label="Image URL">
            <input value={ov.src ?? ""} placeholder="https://…" onChange={(e) => onChange({ src: e.target.value })} style={input} />
          </Row>
          <Row label="Visibility">
            <select value={ov.hidden ? "hidden" : "visible"} onChange={(e) => onChange({ hidden: e.target.value === "hidden" })} style={input}>
              <option value="visible">visible</option>
              <option value="hidden">hidden</option>
            </select>
          </Row>
          <Row label="Layer order">
            <input type="number" value={ov.z ?? 0} onChange={(e) => onChange({ z: Number(e.target.value) })} style={input} />
          </Row>
          <Row label="Lock">
            <button type="button" style={btn} onClick={() => onChange({ locked: !ov.locked })}>
              {ov.locked ? "🔒 Locked" : "🔓 Unlocked"}
            </button>
          </Row>
        </>
      )}

      {tab === "spacing" && (
        <>
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
          <Row label="Padding">
            <input value={ov.padding ?? ""} placeholder="16px" onChange={(e) => onChange({ padding: e.target.value })} style={input} />
          </Row>
          <Row label="Margin">
            <input value={ov.margin ?? ""} placeholder="0 auto" onChange={(e) => onChange({ margin: e.target.value })} style={input} />
          </Row>
          <Row label="Gap">
            <input value={ov.gap ?? ""} placeholder="16px" onChange={(e) => onChange({ gap: e.target.value })} style={input} />
          </Row>
          <Row label="Max-width">
            <input value={ov.maxW ?? ""} placeholder="1200px" onChange={(e) => onChange({ maxW: e.target.value })} style={input} />
          </Row>
        </>
      )}

      {tab === "layout" && (
        <>
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
        </>
      )}

      {tab === "text" && (
        <>
          <Row label="Text">
            <input value={ov.text ?? ""} placeholder="content" onChange={(e) => onChange({ text: e.target.value })} style={input} />
          </Row>
          <Row label="Colour">
            <input value={ov.color ?? ""} placeholder="#F5F1E6" onChange={(e) => onChange({ color: e.target.value })} style={input} />
          </Row>
          <Row label="Size">
            <input value={ov.fontSize ?? ""} placeholder="18px" onChange={(e) => onChange({ fontSize: e.target.value })} style={input} />
          </Row>
          <Row label="Weight">
            <input value={ov.fontWeight ?? ""} placeholder="600" onChange={(e) => onChange({ fontWeight: e.target.value })} style={input} />
          </Row>
          <Row label="Tracking">
            <input value={ov.letterSpacing ?? ""} placeholder="0.08em" onChange={(e) => onChange({ letterSpacing: e.target.value })} style={input} />
          </Row>
          <Row label="Leading">
            <input value={ov.lineHeight ?? ""} placeholder="1.5" onChange={(e) => onChange({ lineHeight: e.target.value })} style={input} />
          </Row>
          <Row label="Text align">
            <select value={ov.textAlign ?? ""} onChange={(e) => onChange({ textAlign: e.target.value })} style={input}>
              <option value="">auto</option>
              <option value="left">left</option>
              <option value="center">center</option>
              <option value="right">right</option>
            </select>
          </Row>
        </>
      )}

      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        <button type="button" onClick={onReset} style={{ ...btn, flex: 1 }}>
          Reset selection
        </button>
      </div>
      <div style={{ marginTop: 8, opacity: 0.5, fontSize: 10, lineHeight: 1.5 }}>
        Drag to move · Shift/⌘ click for multi-select · drag empty space to marquee · Ctrl+Z undo · Ctrl+Shift+Z redo. Edits stay in the working copy until you press Save Changes.
      </div>
    </div>
  );
}

function Outline({ rect, color }: { rect: DOMRect; color: string }) {
  return (
    <div
      style={{
        position: "fixed",
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        border: `1px solid ${color}`,
        pointerEvents: "none",
        zIndex: Z + 100,
      }}
    />
  );
}

function Dot() {
  return <span style={{ opacity: 0.25 }}>|</span>;
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
  width: 124,
  background: PANEL_DEEP,
  border: "1px solid rgba(245,241,230,0.16)",
  borderRadius: 6,
  color: IVORY,
  padding: "4px 6px",
  fontSize: 11.5,
  outline: "none",
};

const btn: React.CSSProperties = {
  background: "rgba(245,241,230,0.08)",
  border: "1px solid rgba(245,241,230,0.16)",
  borderRadius: 6,
  color: IVORY,
  padding: "5px 8px",
  fontSize: 11,
  cursor: "pointer",
};
