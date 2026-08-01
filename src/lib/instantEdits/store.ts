/**
 * Instant Edits store — lightweight on-the-fly text & style editing.
 * Persists per-route edits in localStorage. Independent from Design Mode.
 */

export type InstantEdit = {
  /** replacement text content (only for text-only elements) */
  text?: string;
  fontSize?: number;
  fontWeight?: string;
  letterSpacing?: number;
  lineHeight?: number;
  align?: string;
  color?: string;
  background?: string;
  padding?: number;
  radius?: number;
  /** raw tailwind class string appended to the element */
  classes?: string;
};

export type InstantDoc = Record<string, InstantEdit>;

const KEY_PREFIX = "hgb:instant-edits:v1:";
const ENABLED_KEY = "hgb:instant-edits:enabled";

export const emptyInstantDoc = (): InstantDoc => ({});

export function loadInstantDoc(route: string): InstantDoc {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY_PREFIX + route);
    return raw ? (JSON.parse(raw) as InstantDoc) : {};
  } catch {
    return {};
  }
}

export function saveInstantDoc(route: string, doc: InstantDoc) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY_PREFIX + route, JSON.stringify(doc));
  } catch {
    /* quota — ignore */
  }
}

export function isInstantEnabled() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(ENABLED_KEY) === "1";
}

export function setInstantEnabled(on: boolean) {
  if (typeof window === "undefined") return;
  if (on) window.localStorage.setItem(ENABLED_KEY, "1");
  else window.localStorage.removeItem(ENABLED_KEY);
}

/** Stable-ish DOM path (child indexes from <body>). */
export function instantPathOf(el: Element): string {
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

export function instantElementAt(path: string): HTMLElement | null {
  if (!path || typeof document === "undefined") return null;
  let cur: Element | null = document.body;
  for (const seg of path.split(".")) {
    const i = Number(seg);
    if (!cur || !cur.children[i]) return null;
    cur = cur.children[i];
  }
  return (cur as HTMLElement) ?? null;
}

/** True when the element renders only text (safe to edit its content). */
export function isTextOnly(el: HTMLElement) {
  if (!el.childNodes.length) return false;
  return Array.from(el.childNodes).every((n) => n.nodeType === Node.TEXT_NODE);
}

/** Apply one edit to a live element. */
export function applyInstantEdit(el: HTMLElement, e: InstantEdit) {
  const prevClasses = el.dataset["ieClasses"];
  if (prevClasses) {
    prevClasses.split(/\s+/).filter(Boolean).forEach((c) => el.classList.remove(c));
    delete el.dataset["ieClasses"];
  }

  if (typeof e.text === "string" && isTextOnly(el)) el.textContent = e.text;

  el.style.fontSize = e.fontSize ? `${e.fontSize}px` : "";
  el.style.fontWeight = e.fontWeight ?? "";
  el.style.letterSpacing = e.letterSpacing != null ? `${e.letterSpacing}px` : "";
  el.style.lineHeight = e.lineHeight != null ? String(e.lineHeight) : "";
  el.style.textAlign = e.align ?? "";
  el.style.color = e.color ?? "";
  el.style.background = e.background ?? "";
  el.style.padding = e.padding != null ? `${e.padding}px` : "";
  el.style.borderRadius = e.radius != null ? `${e.radius}px` : "";

  if (e.classes?.trim()) {
    const list = e.classes.trim().split(/\s+/).filter(Boolean);
    list.forEach((c) => el.classList.add(c));
    el.dataset["ieClasses"] = list.join(" ");
  }
}

export function clearInstantEdit(el: HTMLElement) {
  applyInstantEdit(el, {});
}

/** Whether the Instant Edits launcher may appear at all. */
export function instantEditsAllowed() {
  if (typeof window === "undefined") return false;
  if (import.meta.env.DEV) return true;
  if (new URLSearchParams(window.location.search).has("edit")) {
    window.localStorage.setItem("hgb:instant-edits:allowed", "1");
    return true;
  }
  return window.localStorage.getItem("hgb:instant-edits:allowed") === "1";
}
