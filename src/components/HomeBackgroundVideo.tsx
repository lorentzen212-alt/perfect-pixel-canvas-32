import { useEffect, useRef, useState } from "react";
import fjordAsset from "@/assets/fjord-hero.png.asset.json";

const OVERLAY =
  "linear-gradient(180deg, rgba(7,16,28,0.32) 0%, rgba(7,16,28,0.18) 35%, rgba(7,16,28,0.22) 65%, rgba(7,16,28,0.36) 100%)";

/**
 * Full-bleed homepage background image (Scandinavian fjord).
 * - Sits behind all content, never affects layout, never captures pointer events.
 * - Fixed attachment + very slow parallax on desktop; static on touch/mobile.
 */
export function HomeBackgroundVideo() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setDesktop(mq.matches && !reduced.matches);
    sync();
    mq.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!desktop) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = layerRef.current;
        if (!el) return;
        el.style.transform = `translate3d(0, ${window.scrollY * 0.12}px, 0) scale(1.06)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [desktop]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: "#0A0B0D" }}
    >
      <div
        ref={layerRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: `url(${fjordAsset.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: desktop ? "fixed" : "scroll",
          transform: desktop ? "scale(1.06)" : undefined,
          imageRendering: "auto",
          backfaceVisibility: "hidden",
        }}
      />
      <div className="absolute inset-0" style={{ backgroundImage: OVERLAY }} />
    </div>
  );
}
