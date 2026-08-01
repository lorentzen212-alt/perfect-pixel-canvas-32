import videoAsset from "@/assets/hero-glitter.mp4.asset.json";
import posterAsset from "@/assets/hero-glitter-poster.jpg.asset.json";

const OVERLAY =
  "linear-gradient(180deg, rgba(8,18,30,0.22) 0%, rgba(8,18,30,0.10) 40%, rgba(8,18,30,0.18) 70%, rgba(8,18,30,0.28) 100%)";

/**
 * Full-bleed homepage background video.
 * - Sits behind all content, never affects layout, never captures pointer events.
 * - Autoplays muted, loops, plays inline, no controls, poster shows the first frame instantly.
 */
export function HomeBackgroundVideo() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ backgroundColor: "#08121E" }}
    >
      <video
        className="absolute inset-0 h-full w-full"
        src={videoAsset.url}
        poster={posterAsset.url}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
        style={{
          objectFit: "cover",
          objectPosition: "center center",
          filter: "none",
          opacity: 1,
        }}
      />
      <div className="absolute inset-0" style={{ backgroundImage: OVERLAY }} />
    </div>
  );
}
