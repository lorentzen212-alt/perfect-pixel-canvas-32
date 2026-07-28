import { useEffect, useRef, useState } from "react";
import videoAsset from "@/assets/homepage-bg.mp4.asset.json";
import posterAsset from "@/assets/homepage-bg-poster.jpg.asset.json";

/**
 * Full-bleed homepage background video.
 * - Sits behind all content, never affects layout, never captures pointer events.
 * - Falls back to a still poster on reduced motion, very small screens, or load failure.
 */
export function HomeBackgroundVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallScreen = window.matchMedia("(max-width: 640px)");

    const sync = () => setUseVideo(!reduced.matches && !smallScreen.matches);
    sync();

    reduced.addEventListener("change", sync);
    smallScreen.addEventListener("change", sync);
    return () => {
      reduced.removeEventListener("change", sync);
      smallScreen.removeEventListener("change", sync);
    };
  }, []);

  // Pause when scrolled out of view
  useEffect(() => {
    if (!useVideo) return;
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [useVideo]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{
        backgroundImage: `url(${posterAsset.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#0A0B0D",
      }}
    >
      {useVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterAsset.url}
          onError={() => setUseVideo(false)}
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{
            objectFit: "cover",
            objectPosition: "center center",
            filter: "brightness(1.18) contrast(1.02)",
          }}
        >
          <source src={videoAsset.url} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
