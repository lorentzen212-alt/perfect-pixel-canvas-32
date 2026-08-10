import { FALLBACK_IMG } from "@/features/leisure/step1/data";
import { S1_GOLD, S1_GOLD_SOFT, SERIF } from "@/features/leisure/tokens";
import { type Destination } from "@/features/leisure/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export function DestinationCarousel({
  destinations,
  selectedId,
  onSelect,
}: {
  destinations: Destination[];
  selectedId: string | null;
  onSelect: (d: Destination) => void;
}) {
  const PAGE_SIZE = 4;
  const pageCount = Math.max(1, Math.ceil(destinations.length / PAGE_SIZE));
  const [page, setPage] = useState(0);

  // Reset to first page whenever the destination list changes (i.e. country change).
  useEffect(() => {
    setPage(0);
  }, [destinations]);

  const safePage = Math.min(page, pageCount - 1);
  const visible = destinations.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <div className="mx-auto mt-9 w-full max-w-[1420px] px-4 lg:px-10">
      <div className="relative">
        <button
          type="button"
          onClick={() => setPage((p) => (p - 1 + pageCount) % pageCount)}
          aria-label="Previous"
          className="absolute left-1 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full transition-all hover:scale-110 lg:-left-3"
          style={{ color: S1_GOLD }}
        >
          <ChevronLeft size={38} strokeWidth={1.6} />
        </button>

        <div className="grid grid-cols-2 gap-4 px-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6 lg:px-12">
          {Array.from({ length: PAGE_SIZE }).map((_, idx) => {
            const d = visible[idx];
            if (!d) return <div key={`empty-${idx}`} aria-hidden />;
            const active = d.id === selectedId;
            return (
              <button
                key={d.id}
                onClick={() => onSelect(d)}
                className="group relative flex aspect-[10/14.2] flex-col overflow-hidden rounded-[18px] text-left transition-all duration-300 hover:-translate-y-[4px]"
                style={{
                  border: `1px solid ${active ? S1_GOLD : "rgba(212,166,74,0.10)"}`,
                  boxShadow: active
                    ? "0 32px 64px -26px rgba(0,0,0,0.48), 0 14px 30px -16px rgba(212,166,74,0.28), 0 0 0 1px rgba(212,166,74,0.35) inset"
                    : "0 28px 58px -26px rgba(0,0,0,0.42), 0 12px 28px -16px rgba(0,0,0,0.24)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,166,74,0.55)";
                  e.currentTarget.style.boxShadow =
                    "0 34px 68px -26px rgba(0,0,0,0.46), 0 0 0 1px rgba(212,166,74,0.40) inset, 0 18px 38px -18px rgba(212,166,74,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = active
                    ? S1_GOLD
                    : "rgba(212,166,74,0.10)";
                  e.currentTarget.style.boxShadow = active
                    ? "0 32px 64px -26px rgba(0,0,0,0.48), 0 14px 30px -16px rgba(212,166,74,0.28), 0 0 0 1px rgba(212,166,74,0.35) inset"
                    : "0 28px 58px -26px rgba(0,0,0,0.42), 0 12px 28px -16px rgba(0,0,0,0.24)";
                }}
              >
                <img
                  src={d.image}
                  alt={d.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.05]"
                  style={{ filter: "contrast(1.02) saturate(1.08) brightness(0.985)" }}
                  onError={(e) => {
                    // eslint-disable-next-line no-console
                    console.warn(`[destinations] Image failed for "${d.name}" — swapping to fallback.`);
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                  }}
                />
                {/* Subtle top light sheen */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
                  }}
                />
                {/* Premium vignette for depth and colour grading */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.18) 88%, rgba(0,0,0,0.28) 100%)",
                  }}
                />
                {/* Bottom dark overlay — almost invisible, gradually deepens */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(8,19,31,0) 48%, rgba(8,19,31,0.14) 72%, rgba(6,14,22,0.38) 90%, rgba(4,10,16,0.62) 100%)",
                  }}
                />
                <div className="relative z-10 mt-auto px-5 pb-5">
                  <div
                    className="text-[24px] leading-tight tracking-[0.02em]"
                    style={{ fontFamily: SERIF, fontWeight: 500, color: "#FBF7EE" }}
                  >
                    {d.name.toUpperCase()}
                  </div>
                  <div
                    className="mt-1 text-[11px] tracking-[0.32em]"
                    style={{ color: S1_GOLD }}
                  >
                    {d.countryName.toUpperCase()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setPage((p) => (p + 1) % pageCount)}
          aria-label="Next"
          className="absolute right-1 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full transition-all hover:scale-110 lg:-right-3"
          style={{ color: S1_GOLD }}
        >
          <ChevronRight size={38} strokeWidth={1.6} />
        </button>

      </div>

      <div className="mt-7 flex items-center justify-center gap-2.5">
        {Array.from({ length: pageCount }).map((_, i) => {
          const active = i === safePage;
          return (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
              className="h-[3px] rounded-full transition-all duration-300"
              style={{
                width: active ? 28 : 18,
                background: active
                  ? `linear-gradient(90deg, ${S1_GOLD_SOFT}, ${S1_GOLD})`
                  : "rgba(245,241,230,0.25)",
                boxShadow: active ? "0 0 10px rgba(212,166,74,0.45)" : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
