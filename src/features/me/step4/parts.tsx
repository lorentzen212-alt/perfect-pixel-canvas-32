import type { CateringDef, CateringId } from "@/features/me/step4/data";
import { GOLD } from "@/features/me/tokens";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* Premium square checkbox used inside Catering panel */
export function SquareCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <span
        onClick={onChange}
        className="inline-flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[3px] transition-all"
        style={{
          background: checked ? "#0A1B2C" : "#FFFFFF",
          border: checked ? "1px solid #0A1B2C" : "1.25px solid #C9C3B0",
          boxShadow: checked
            ? "0 2px 5px -2px rgba(10,27,44,0.4)"
            : "inset 0 1px 0 rgba(255,255,255,0.6)",
        }}
      >
        {checked && <Check size={11} strokeWidth={3.2} style={{ color: GOLD }} />}
      </span>
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-[13px] text-[#0A1B2C]">{label}</span>
    </label>
  );
}

export function CateringCarousel({
  defs,
  selected,
  onToggle,
}: {
  defs: CateringDef[];
  selected: Record<CateringId, boolean>;
  onToggle: (id: CateringId) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const dragRef = useRef<{ down: boolean; startX: number; startScroll: number; moved: boolean }>({
    down: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  const updateEdges = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateEdges();
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => updateEdges();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  // Scroll selected card into view if off-screen
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const lastSelected = defs.find((d) => selected[d.id] && !!selected[d.id]);
    if (!lastSelected) return;
    const target = el.querySelector<HTMLElement>(`[data-cid="${lastSelected.id}"]`);
    if (!target) return;
    const eLeft = target.offsetLeft;
    const eRight = eLeft + target.offsetWidth;
    if (eLeft < el.scrollLeft || eRight > el.scrollLeft + el.clientWidth) {
      target.scrollIntoView({ block: "nearest", inline: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const scrollByCards = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-cid]");
    const cardW = card ? card.offsetWidth + 16 : 220;
    el.scrollBy({ left: dir * cardW * 2.5 });
  };

  return (
    <div className="relative mt-8">
      {/* Left arrow */}
      {canPrev && (
        <button
          type="button"
          aria-label="Previous catering options"
          onClick={() => scrollByCards(-1)}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:brightness-105"
          style={{
            background: "rgba(252,250,243,0.96)",
            border: "1px solid #E3D2A1",
            boxShadow: "0 6px 16px -8px rgba(10,27,44,0.25)",
          }}
        >
          <ChevronLeft size={18} style={{ color: "#B88A2E" }} />
        </button>
      )}
      {/* Right arrow */}
      {canNext && (
        <button
          type="button"
          aria-label="Next catering options"
          onClick={() => scrollByCards(1)}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:brightness-105"
          style={{
            background: "rgba(252,250,243,0.96)",
            border: "1px solid #E3D2A1",
            boxShadow: "0 6px 16px -8px rgba(10,27,44,0.25)",
          }}
        >
          <ChevronRight size={18} style={{ color: "#B88A2E" }} />
        </button>
      )}

      {/* Left fade */}
      {canPrev && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-10 z-10"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0))",
          }}
        />
      )}
      {/* Right fade */}
      {canNext && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-10 z-10"
          style={{
            background:
              "linear-gradient(to left, rgba(255,255,255,0.9), rgba(255,255,255,0))",
          }}
        />
      )}

      <div
        ref={scrollerRef}
        className="catering-scroller flex gap-4 overflow-x-auto overflow-y-hidden pb-2 -mx-1 px-1 select-none"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "thin",
          scrollbarColor: "#E3D2A1 transparent",
          WebkitOverflowScrolling: "touch",
          scrollPaddingLeft: "4px",
          scrollPaddingRight: "4px",
        }}
        onMouseDown={(e) => {
          const el = scrollerRef.current;
          if (!el) return;
          dragRef.current = {
            down: true,
            startX: e.pageX,
            startScroll: el.scrollLeft,
            moved: false,
          };
        }}
        onMouseMove={(e) => {
          const d = dragRef.current;
          if (!d.down) return;
          const el = scrollerRef.current;
          if (!el) return;
          const dx = e.pageX - d.startX;
          if (Math.abs(dx) > 4) d.moved = true;
          el.scrollLeft = d.startScroll - dx;
        }}
        onMouseUp={() => {
          dragRef.current.down = false;
        }}
        onMouseLeave={() => {
          dragRef.current.down = false;
        }}
        onWheel={(e) => {
          const el = scrollerRef.current;
          if (!el) return;
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            el.scrollLeft += e.deltaY;
          }
        }}
      >
        {defs.map((def) => {
          const isOn = !!selected[def.id];
          const Icon = def.icon;
          return (
            <button
              key={def.id}
              data-cid={def.id}
              type="button"
              onClick={() => {
                if (dragRef.current.moved) {
                  dragRef.current.moved = false;
                  return;
                }
                onToggle(def.id);
              }}
              aria-pressed={isOn}
              className="group relative overflow-hidden rounded-[12px] text-left transition-all shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                width: "clamp(150px, 14vw, 180px)",
                scrollSnapAlign: "start",
                background: "#FCFAF3",
                border: isOn ? "1.5px solid #C79A32" : "1px solid #ECE6D6",
                boxShadow: isOn
                  ? "0 10px 24px -14px rgba(184,138,46,0.45), 0 2px 6px -2px rgba(10,27,44,0.06)"
                  : "0 6px 18px -14px rgba(10,27,44,0.10)",
              }}
            >
              <div
                className="w-full overflow-hidden"
                style={{ aspectRatio: "4 / 3" }}
                aria-hidden
              >
                <img
                  src={def.image}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover object-center pointer-events-none"
                />
              </div>
              <div className="p-2.5 pt-2 flex flex-col items-center gap-1">
                <Icon size={18} strokeWidth={1.6} style={{ color: "#B88A2E" }} />
                <span className="text-[12.5px] font-medium text-[#0A1B2C] text-center leading-tight">
                  {def.label}
                </span>
              </div>
              {isOn && (
                <span
                  className="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full"
                  style={{
                    background:
                      "linear-gradient(180deg,#F7D97A 0%, #D4AF37 55%, #B88917 100%)",
                    boxShadow: "0 2px 6px -2px rgba(184,138,46,0.55)",
                  }}
                >
                  <Check size={12} strokeWidth={3} style={{ color: "#0A1B2C" }} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
