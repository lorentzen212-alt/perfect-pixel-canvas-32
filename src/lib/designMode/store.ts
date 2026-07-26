/**
 * Design Mode store — internal editing tool only.
 * Persists per-element style overrides, structural ops, and snapshots in localStorage.
 * Nothing is written to the "live" doc until the user presses Save Changes.
 */

export type Override = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  padding?: string;
  margin?: string;
  radius?: string;
  gap?: string;
  align?: string;
  justify?: string;
  dir?: string;
  display?: string;
  maxW?: string;
  opacity?: number;
  shadow?: string;
  border?: string;
  bg?: string;
  image?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  letterSpacing?: string;
  lineHeight?: string;
  textAlign?: string;
  hidden?: boolean;
  z?: number;
  name?: string;
  locked?: boolean;
};

export type Op =
  | { type: "duplicate"; path: string }
  | { type: "delete"; path: string }
  | { type: "wrap"; path: string }
  | { type: "ungroup"; path: string };

export type DesignDoc = {
  overrides: Record<string, Override>;
  ops: Op[];
};

export type Snapshot = {
  id: string;
  name: string;
  ts: number;
  doc: DesignDoc;
};

export const emptyDoc = (): DesignDoc => ({ overrides: {}, ops: [] });

const KEY_PREFIX = "hgb:design-mode:v1:";
const SNAP_PREFIX = "hgb:design-mode:snapshots:v1:";
const ENABLED_KEY = "hgb:design-mode:enabled";
const PRECISION_KEY = "hgb:design-mode:precision";

const docKey = (route: string) => KEY_PREFIX + route;
const snapKey = (route: string) => SNAP_PREFIX + route;

export function loadDoc(route: string): DesignDoc {
  if (typeof window === "undefined") return emptyDoc();
  try {
    const raw = window.localStorage.getItem(docKey(route));
    if (!raw) return emptyDoc();
    const parsed = JSON.parse(raw) as DesignDoc;
    return { overrides: parsed.overrides ?? {}, ops: parsed.ops ?? [] };
  } catch {
    return emptyDoc();
  }
}

export function saveDoc(route: string, doc: DesignDoc) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(docKey(route), JSON.stringify(doc));
  } catch {
    /* quota — ignore */
  }
}

/* ---------------- snapshots ---------------- */

export function loadSnapshots(route: string): Snapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(snapKey(route));
    return raw ? (JSON.parse(raw) as Snapshot[]) : [];
  } catch {
    return [];
  }
}

export function saveSnapshots(route: string, list: Snapshot[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(snapKey(route), JSON.stringify(list.slice(-30)));
  } catch {
    /* ignore */
  }
}

export function makeSnapshot(name: string, doc: DesignDoc): Snapshot {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    ts: Date.now(),
    doc: clone(doc),
  };
}

/* ---------------- flags ---------------- */

export function isEnabledPersisted() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ENABLED_KEY) === "1";
}

export function setEnabledPersisted(on: boolean) {
  if (typeof window === "undefined") return;
  if (on) window.localStorage.setItem(ENABLED_KEY, "1");
  else window.localStorage.removeItem(ENABLED_KEY);
}

export function isPrecisionPersisted() {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(PRECISION_KEY) !== "0";
}

export function setPrecisionPersisted(on: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRECISION_KEY, on ? "1" : "0");
}

/** Whether the floating toggle is allowed to appear at all. */
export function designModeAllowed() {
  if (typeof window === "undefined") return false;
  if (import.meta.env.DEV) return true;
  if (new URLSearchParams(window.location.search).has("design")) {
    window.localStorage.setItem("hgb:design-mode:allowed", "1");
    return true;
  }
  return window.localStorage.getItem("hgb:design-mode:allowed") === "1";
}

/* ---------------- element paths ---------------- */

export function pathOf(el: Element): string {
  const parts: number[] = [];
  let cur: Element | null = el;
  while (cur && cur !== document.body) {
    const parent: Element | null = cur.parentElement;
    if (!parent) break;
    parts.unshift(Array.prototype.indexOf.call(parent.children, cur));
    cur = parent;
  }
  return parts.join(".");
}

export function elementAtPath(path: string): HTMLElement | null {
  if (!path) return null;
  let cur: Element | null = document.body;
  for (const seg of path.split(".")) {
    const i = Number(seg);
    if (!cur || !cur.children[i]) return null;
    cur = cur.children[i];
  }
  return (cur as HTMLElement) ?? null;
}

/* ---------------- change summary ---------------- */

const LABELS: Record<keyof Override, string> = {
  x: "X offset",
  y: "Y offset",
  w: "Width",
  h: "Height",
  padding: "Padding",
  margin: "Margin",
  radius: "Radius",
  gap: "Gap",
  align: "Align",
  justify: "Justify",
  dir: "Direction",
  display: "Display",
  maxW: "Max width",
  opacity: "Opacity",
  shadow: "Shadow",
  border: "Border",
  bg: "Background",
  image: "Image",
  color: "Text colour",
  fontSize: "Font size",
  fontWeight: "Font weight",
  fontFamily: "Font family",
  letterSpacing: "Letter spacing",
  lineHeight: "Line height",
  textAlign: "Text align",
  hidden: "Visibility",
  z: "Layer order",
  name: "Name",
  locked: "Lock",
};

export function diffSummary(a: DesignDoc, b: DesignDoc): string[] {
  const out: string[] = [];
  const paths = new Set([...Object.keys(a.overrides), ...Object.keys(b.overrides)]);
  paths.forEach((p) => {
    const before = a.overrides[p] ?? {};
    const after = b.overrides[p] ?? {};
    (Object.keys({ ...before, ...after }) as (keyof Override)[]).forEach((k) => {
      if (String(before[k] ?? "") === String(after[k] ?? "")) return;
      out.push(`${shortName(p)} · ${LABELS[k] ?? k}: ${fmt(before[k])} → ${fmt(after[k])}`);
    });
  });
  if (a.ops.length !== b.ops.length) out.push(`Structure: ${b.ops.length - a.ops.length} operation(s)`);
  return out;
}

const fmt = (v: unknown) => (v === undefined || v === "" ? "auto" : String(v));
const shortName = (p: string) => `#${p.split(".").slice(-3).join(".")}`;

/* ---------------- history ---------------- */

export class History {
  private stack: DesignDoc[];
  private index = 0;

  constructor(initial: DesignDoc) {
    this.stack = [clone(initial)];
  }

  current(): DesignDoc {
    return this.stack[this.index];
  }

  push(doc: DesignDoc) {
    this.stack = this.stack.slice(0, this.index + 1);
    this.stack.push(clone(doc));
    if (this.stack.length > 200) this.stack.shift();
    this.index = this.stack.length - 1;
  }

  reset(doc: DesignDoc) {
    this.stack = [clone(doc)];
    this.index = 0;
  }

  canUndo() {
    return this.index > 0;
  }

  canRedo() {
    return this.index < this.stack.length - 1;
  }

  undo(): DesignDoc | null {
    if (this.index === 0) return null;
    this.index -= 1;
    return this.current();
  }

  redo(): DesignDoc | null {
    if (this.index >= this.stack.length - 1) return null;
    this.index += 1;
    return this.current();
  }
}

export function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export const SNAP = 8;
export const snap = (v: number) => Math.round(v / SNAP) * SNAP;
