import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Global overlay primitive.
 *
 * Small selection menus across the app should render through this component:
 * it portals into <body>, so it can never be clipped by a parent with
 * overflow:hidden, never pushes sibling content down, always sits above the
 * interface, flips/shifts to stay inside the viewport and closes on outside
 * click or Escape.
 */
export function FloatingPopover({
  anchorRef,
  open,
  onClose,
  width = 300,
  align = "auto",
  offset = 8,
  children,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  width?: number;
  /** "auto" prefers left-aligned but flips inward when close to a screen edge */
  align?: "auto" | "start" | "end";
  offset?: number;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; maxHeight: number } | null>(null);

  useLayoutEffect(() => {
    if (!open) return;

    const place = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const r = anchor.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 10;
      const w = Math.min(width, vw - margin * 2);

      // horizontal: prefer start alignment, flip inward (right-aligned) near the right edge
      let left = align === "end" ? r.right - w : r.left;
      if (align === "auto" && r.left + w > vw - margin) left = r.right - w;
      left = Math.min(Math.max(margin, left), vw - w - margin);

      // vertical: prefer below, flip above when there is more room there
      const panelH = panelRef.current?.offsetHeight ?? 320;
      const below = vh - r.bottom - margin;
      const above = r.top - margin;
      let top: number;
      let maxHeight: number;
      if (below >= Math.min(panelH + offset, 240) || below >= above) {
        top = r.bottom + offset;
        maxHeight = below - offset;
      } else {
        maxHeight = above - offset;
        top = Math.max(margin, r.top - offset - Math.min(panelH, maxHeight));
      }

      setPos({ top, left, maxHeight: Math.max(160, maxHeight) });
    };

    place();
    const raf = requestAnimationFrame(place);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, anchorRef, width, align, offset]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (anchorRef.current?.contains(t)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      className="fixed z-[9999] overflow-y-auto rounded-[10px]"
      style={{
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        width: Math.min(width, typeof window !== "undefined" ? window.innerWidth - 20 : width),
        maxHeight: pos?.maxHeight ?? 320,
        visibility: pos ? "visible" : "hidden",
        backgroundColor: "#22507C",
        border: "1px solid rgba(197,162,75,0.28)",
        boxShadow: "0 18px 44px rgba(8,20,34,0.42)",
        animation: "hgbFade 150ms ease-out",
      }}
    >
      {children}
    </div>,
    document.body,
  );
}
