import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  History,
  type DesignDoc,
  type Override,
  designModeAllowed,
  elementAtPath,
  emptyDoc,
  isEnabledPersisted,
  loadDoc,
  pathOf,
  saveDoc,
  setEnabledPersisted,
  snap,
} from "@/lib/designMode/store";

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
]);

function isUi(el: Element | null) {
  return !!el?.closest("[data-dm-ui]");
}

function pickTarget(el: Element | null): HTMLElement | null {
  let cur: HTMLElement | null = el as HTMLElement | null;
  while (cur && cur !== document.body) {
    if (SELECTABLE.has(cur.tagName)) {
      const r = cur.getBoundingClientRect();
      if (r.width >= 24 && r.height >= 16) return cur;
    }
    cur = cur.parentElement;
  }
  return null;
}

function candidateRects(exclude: HTMLElement | null) {
  const out: { el: HTMLElement; r: DOMRect }[] = [];
  document.querySelectorAll<HTMLElement>("section,header,footer,nav,aside,article,div,li").forEach((el) => {
    if (el === exclude || isUi(el)) return;
    if (exclude && (el.contains(exclude) || exclude.contains(el))) return;
    const r = el.getBoundingClientRect();
    if (r.width < 32 || r.height < 24) return;
    if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
    out.push({ el, r });
  });
  return out.slice(0, 400);
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
  const [doc, setDoc] = useState<DesignDoc>(emptyDoc());
  const [selected, setSelected] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [, forceTick] = useState(0);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [dists, setDists] = useState<DistLabel[]>([]);
  const [menu, setMenu] = useState<{ x: number; y: number; path: string } | null>(null);

  const historyRef = useRef<History | null>(null);
  const appliedRef = useRef<Set<HTMLElement>>(new Set());
  const opsAppliedRef = useRef(false);

  const rerender = useCallback(() => forceTick((t) => t + 1), []);

  /* ---- boot ---- */
  useEffect(() => {
    setAllowed(designModeAllowed());
    setEnabled(isEnabledPersisted());
  }, []);

  useEffect(() => {
    const loaded = loadDoc(routePath);
    historyRef.current = new History(loaded);
    opsAppliedRef.current = false;
    setDoc(loaded);
    setSelected(null);
  }, [routePath]);

  /* ---- commit helper (records history) ---- */
  const commit = useCallback(
    (next: DesignDoc) => {
      historyRef.current?.push(next);
      setDoc(next);
      saveDoc(routePath, next);
    },
    [routePath],
  );

  const patch = useCallback(
    (path: string, p: Override) => {
      const next: DesignDoc = {
        ops: doc.ops,
        overrides: { ...doc.overrides, [path]: { ...(doc.overrides[path] ?? {}), ...p } },
      };
      commit(next);
    },
    [doc, commit],
  );

  /* ---- structural ops replay (persisted) ---- */
  useEffect(() => {
    if (!enabled) return;
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
  }, [enabled, doc.ops, rerender]);

  /* ---- apply overrides to the DOM ---- */
  const applyOverrides = useCallback(() => {
    appliedRef.current.forEach((el) => {
      el.style.removeProperty("transform");
      el.style.removeProperty("width");
      el.style.removeProperty("height");
      el.style.removeProperty("padding");
      el.style.removeProperty("margin");
      el.style.removeProperty("border-radius");
      el.style.removeProperty("gap");
      el.style.removeProperty("align-items");
      el.style.removeProperty("justify-content");
      el.style.removeProperty("flex-direction");
      el.style.removeProperty("max-width");
      el.style.removeProperty("opacity");
      el.style.removeProperty("box-shadow");
      el.style.removeProperty("display");
      el.style.removeProperty("z-index");
    });
    appliedRef.current.clear();

    // Design Mode is a hidden authoring tool: never let saved overrides leak
    // into the live app, where displaced/resized nodes can swallow clicks.
    if (!enabled) return;

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
      if (o.hidden) el.style.display = "none";
    });
  }, [doc.overrides, enabled]);

  useEffect(() => {
    applyOverrides();
    const t = window.setTimeout(applyOverrides, 300);
    return () => window.clearTimeout(t);
  }, [applyOverrides, routePath]);

  /* ---- undo / redo ---- */
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const z = e.key.toLowerCase() === "z";
      if (!(e.ctrlKey || e.metaKey) || !z) return;
      e.preventDefault();
      const h = historyRef.current;
      if (!h) return;
      const next = e.shiftKey ? h.redo() : h.undo();
      if (!next) return;
      const structural = JSON.stringify(next.ops) !== JSON.stringify(doc.ops);
      setDoc(next);
      saveDoc(routePath, next);
      if (structural) window.location.reload();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, doc.ops, routePath]);

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
      if (!t) {
        setSelected(null);
        return;
      }
      const path = pathOf(t);
      setSelected(path);
      setMenu(null);
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
        let dx = snap(baseX + ev.clientX - startX);
        let dy = snap(baseY + ev.clientY - startY);
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

        // nearest neighbour distances (vertical + horizontal)
        let bestV: { gap: number; y: number } | null = null;
        let bestH: { gap: number; x: number } | null = null;
        others.forEach(({ r }) => {
          const vGap = rect.top - r.bottom;
          if (vGap >= 0 && vGap < 220 && (!bestV || vGap < bestV.gap)) bestV = { gap: vGap, y: r.bottom };
          const hGap = rect.left - r.right;
          if (hGap >= 0 && hGap < 220 && (!bestH || hGap < bestH.gap)) bestH = { gap: hGap, x: r.right };
        });
        if (bestV) d.push({ x: rect.left + rect.width / 2, y: (bestV as any).y + (bestV as any).gap / 2, text: `${Math.round((bestV as any).gap)}px` });
        if (bestH) d.push({ x: (bestH as any).x + (bestH as any).gap / 2, y: rect.top + rect.height / 2, text: `${Math.round((bestH as any).gap)}px` });

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
      setSelected(path);
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
  }, [enabled, doc.overrides, patch]);

  /* ---- resize ---- */
  const startResize = (corner: "nw" | "ne" | "sw" | "se") => (e: React.MouseEvent) => {
    if (!selected) return;
    const el = elementAtPath(selected);
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    const r = el.getBoundingClientRect();
    const ov = doc.overrides[selected] ?? {};
    const sx = e.clientX;
    const sy = e.clientY;
    let w = r.width;
    let h = r.height;
    let x = ov.x ?? 0;
    let y = ov.y ?? 0;

    const move = (ev: MouseEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (corner.includes("e")) w = Math.max(24, snap(r.width + dx));
      if (corner.includes("s")) h = Math.max(16, snap(r.height + dy));
      if (corner.includes("w")) {
        w = Math.max(24, snap(r.width - dx));
        x = snap((ov.x ?? 0) + dx);
      }
      if (corner.includes("n")) {
        h = Math.max(16, snap(r.height - dy));
        y = snap((ov.y ?? 0) + dy);
      }
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      el.style.transform = `translate(${x}px, ${y}px)`;
      rerender();
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      patch(selected, { w, h, x, y });
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  /* ---- structural ops ---- */
  const applyOp = (op: { type: string; path: string }) => {
    const el = elementAtPath(op.path);
    if (!el) return;
    if (op.type === "duplicate") {
      const clone = el.cloneNode(true) as HTMLElement;
      el.parentElement?.insertBefore(clone, el.nextSibling);
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
    applyOp(op);
    commit({ overrides: doc.overrides, ops: [...doc.ops, op] });
    setMenu(null);
    setSelected(null);
  };

  /* ---- derived rects ---- */
  const selEl = selected ? elementAtPath(selected) : null;
  const hovEl = hover && hover !== selected ? elementAtPath(hover) : null;
  const selRect = selEl?.getBoundingClientRect();
  const hovRect = hovEl?.getBoundingClientRect();
  const selOv: Override = (selected && doc.overrides[selected]) || {};

  const label = useMemo(() => {
    if (!selEl) return "";
    return selOv.name || `${selEl.tagName.toLowerCase()}${selEl.className ? "." + String(selEl.className).split(" ")[0] : ""}`;
  }, [selEl, selOv.name]);

  if (!allowed) return null;

  return (
    <div data-dm-ui="">
      {/* floating toggle */}
      <button
        type="button"
        onClick={() => {
          const next = !enabled;
          setEnabled(next);
          setEnabledPersisted(next);
          if (!next) {
            setSelected(null);
            setMenu(null);
          }
        }}
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
          background: enabled
            ? "linear-gradient(135deg,#F1D08A,#C79A32)"
            : "rgba(11,22,34,0.92)",
          border: "1px solid rgba(212,166,74,0.45)",
          boxShadow: "0 12px 30px -12px rgba(0,0,0,0.65)",
          cursor: "pointer",
        }}
      >
        {enabled ? "Design Mode · ON" : "Design Mode"}
      </button>

      {!enabled ? null : (
        <>
          {/* hover outline */}
          {hovRect && (
            <div
              style={{
                position: "fixed",
                left: hovRect.left,
                top: hovRect.top,
                width: hovRect.width,
                height: hovRect.height,
                border: "1px solid rgba(120,190,255,0.9)",
                pointerEvents: "none",
                zIndex: 2147482000,
              }}
            />
          )}

          {/* selection + handles */}
          {selRect && (
            <div
              style={{
                position: "fixed",
                left: selRect.left,
                top: selRect.top,
                width: selRect.width,
                height: selRect.height,
                border: "1.5px solid #4C9BFF",
                pointerEvents: "none",
                zIndex: 2147482100,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: -22,
                  left: 0,
                  background: "#4C9BFF",
                  color: "#fff",
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontFamily: "Inter, system-ui, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {label} · {Math.round(selRect.width)}×{Math.round(selRect.height)}
              </span>
              {(["nw", "ne", "sw", "se"] as const).map((c) => (
                <div
                  key={c}
                  onMouseDown={startResize(c)}
                  data-dm-ui=""
                  style={{
                    position: "absolute",
                    width: 10,
                    height: 10,
                    background: "#fff",
                    border: "1.5px solid #4C9BFF",
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

          {/* alignment guides */}
          {guides.map((g, i) => (
            <div
              key={i}
              style={{
                position: "fixed",
                background: "#FF3D71",
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
                background: "#FF3D71",
                color: "#fff",
                fontSize: 10,
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
              style={{
                position: "fixed",
                left: Math.min(menu.x, window.innerWidth - 200),
                top: Math.min(menu.y, window.innerHeight - 320),
                width: 186,
                background: "#12202E",
                border: "1px solid rgba(245,241,230,0.14)",
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
                {
                  label: "Bring forward",
                  run: () => patch(menu.path, { z: ((doc.overrides[menu.path]?.z ?? 0) + 1) }),
                },
                {
                  label: "Send backward",
                  run: () => patch(menu.path, { z: ((doc.overrides[menu.path]?.z ?? 0) - 1) }),
                },
                {
                  label: doc.overrides[menu.path]?.locked ? "Unlock position" : "Lock position",
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
              path={selected}
              ov={selOv}
              rect={selRect}
              onChange={(p) => patch(selected, p)}
              onReset={() => {
                const next = { ...doc.overrides };
                delete next[selected];
                commit({ overrides: next, ops: doc.ops });
              }}
              onClose={() => setSelected(null)}
            />
          )}
        </>
      )}
    </div>
  );
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
  path,
  ov,
  rect,
  onChange,
  onReset,
  onClose,
}: {
  path: string;
  ov: Override;
  rect?: DOMRect;
  onChange: (p: Override) => void;
  onReset: () => void;
  onClose: () => void;
}) {
  return (
    <div
      data-dm-ui=""
      style={{
        position: "fixed",
        right: 16,
        top: 16,
        width: 246,
        maxHeight: "calc(100vh - 110px)",
        overflowY: "auto",
        background: "#0F1C29",
        border: "1px solid rgba(245,241,230,0.14)",
        borderRadius: 12,
        padding: 12,
        zIndex: 2147483050,
        color: "#F5F1E6",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 11.5,
        boxShadow: "0 30px 70px -28px rgba(0,0,0,0.85)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <strong style={{ fontSize: 12, letterSpacing: "0.06em" }}>INSPECTOR</strong>
        <button type="button" onClick={onClose} style={btn}>
          ✕
        </button>
      </div>

      <div style={{ opacity: 0.65, marginBottom: 10, wordBreak: "break-all" }}>
        {ov.name ? `${ov.name} · ` : ""}
        {rect ? `${Math.round(rect.width)} × ${Math.round(rect.height)}` : path}
      </div>

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
      <Row label="Radius">
        <input value={ov.radius ?? ""} placeholder="12px" onChange={(e) => onChange({ radius: e.target.value })} style={input} />
      </Row>
      <Row label="Gap">
        <input value={ov.gap ?? ""} placeholder="16px" onChange={(e) => onChange({ gap: e.target.value })} style={input} />
      </Row>
      <Row label="Max-width">
        <input value={ov.maxW ?? ""} placeholder="1200px" onChange={(e) => onChange({ maxW: e.target.value })} style={input} />
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

      <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
        <button type="button" onClick={onReset} style={{ ...btn, flex: 1 }}>
          Reset element
        </button>
        {ov.hidden && (
          <button type="button" onClick={() => onChange({ hidden: false })} style={{ ...btn, flex: 1 }}>
            Show
          </button>
        )}
      </div>
      <div style={{ marginTop: 8, opacity: 0.5, fontSize: 10 }}>
        Drag to move (8px grid) · Ctrl+Z undo · Ctrl+Shift+Z redo
      </div>
    </div>
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
