/**
 * Design Mode store — internal editing tool only.
 * Persists per-element style overrides + structural ops in localStorage.
 */

export type Override = {
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  /** original layout footprint, kept so resizing never reflows siblings */
  baseW?: number;
  baseH?: number;
  padding?: string;
  margin?: string;
  radius?: string;
  gap?: string;
  align?: string;
  justify?: string;
  dir?: string;
  maxW?: string;
  opacity?: number;
  shadow?: string;
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

export const emptyDoc = (): DesignDoc => ({ overrides: {}, ops: [] });

const KEY_PREFIX = "hgb:design-mode:v1:";
const ENABLED_KEY = "hgb:design-mode:enabled";

const docKey = (route: string) => KEY_PREFIX + route;

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

export function isEnabledPersisted() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ENABLED_KEY) === "1";
}

export function setEnabledPersisted(on: boolean) {
  if (typeof window === "undefined") return;
  if (on) window.localStorage.setItem(ENABLED_KEY, "1");
  else window.localStorage.removeItem(ENABLED_KEY);
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
    if (this.stack.length > 100) this.stack.shift();
    this.index = this.stack.length - 1;
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

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

export const SNAP = 8;
export const snap = (v: number) => Math.round(v / SNAP) * SNAP;
