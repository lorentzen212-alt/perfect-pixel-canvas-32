import { STEPS } from "@/features/me/data";
import { GOLD, NAVY_DEEP } from "@/features/me/tokens";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function StepProgress({ step, onGo }: { step: number; onGo: (n: number) => void }) {
  const total = STEPS.length;
  const progressPercentage = ((step - 1) / (total - 1)) * 100;
  const [pulseKey, setPulseKey] = useState(step);
  const prevStep = useRef(step);
  useEffect(() => {
    if (prevStep.current !== step) {
      const t = window.setTimeout(() => setPulseKey(step), 500);
      prevStep.current = step;
      return () => window.clearTimeout(t);
    }
  }, [step]);

  // Track spans from center of first circle to center of last circle.
  // Each button is flex-1 (equal width = 100%/total), so first/last centers
  // sit at 100%/(2*total) from each edge.
  const edgeInset = `${100 / (total * 2)}%`;

  return (
    <div className="relative">
      <div className="relative flex items-start justify-between gap-2">
        {/* Continuous progress track behind circles */}
        <div
          className="pointer-events-none absolute"
          style={{ top: 18, left: edgeInset, right: edgeInset, zIndex: 0 }}
        >
          {/* Inactive base line: solid up to step 6, dashed from step 6 -> step 7 */}
          <div className="relative h-px w-full">
            <div
              className="absolute left-0 top-0 h-px"
              style={{
                width: `${((total - 2) / (total - 1)) * 100}%`,
                backgroundColor: "rgba(245,194,90,0.28)",
              }}
            />
            <div
              className="absolute top-0 h-px"
              style={{
                left: `${((total - 2) / (total - 1)) * 100}%`,
                right: 0,
                backgroundImage:
                  "linear-gradient(90deg, rgba(255,255,255,0.35) 50%, transparent 50%)",
                backgroundSize: "6px 1px",
                backgroundRepeat: "repeat-x",
              }}
            />
          </div>
          {/* Gold overlay — polished metallic line with subtle reflections */}
          <div
            className="absolute left-0 top-0"
            style={{
              width: `${progressPercentage}%`,
              height: 1,
              background:
                "linear-gradient(90deg, #C79A32 0%, #E4C15E 22%, #F5E4A6 42%, #FFF3C8 50%, #F5E4A6 58%, #E4C15E 78%, #C79A32 100%)",
              boxShadow:
                "0 0 6px rgba(245,228,166,0.55), 0 0 14px rgba(214,177,90,0.28), 0 0 22px rgba(214,177,90,0.14)",
              transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 1,
            }}
          />
          {/* progress line intentionally static — no sparkles */}
        </div>

        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const completed = n < step;
          const isLast = n === total;
          const clickable = !isLast && !active;
          const pulse = active && pulseKey === step;

          const bg = active
            ? "linear-gradient(180deg, #F7CF63 0%, #E4B52F 52%, #D9A520 100%)"
            : completed
              ? NAVY_DEEP
              : "transparent";
          const borderColor = active
            ? "rgba(255,223,130,0.95)"
            : isLast
              ? "rgba(255,255,255,0.28)"
              : GOLD;
          const numberColor = active
            ? "#FFFFFF"
            : completed
              ? GOLD
              : isLast
                ? "rgba(255,255,255,0.4)"
                : GOLD;

          return (
            <button
              key={label}
              type="button"
              onClick={() => (clickable ? onGo(n) : undefined)}
              disabled={!clickable}
              aria-current={active ? "step" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-2 flex-1 min-w-0",
                clickable ? "cursor-pointer" : "cursor-default",
              )}
              style={{ zIndex: 2 }}
            >
              {active && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{
                    top: 6,
                    width: 48,
                    height: 48,
                    borderRadius: "9999px",
                    background:
                      "radial-gradient(circle, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0.10) 45%, transparent 75%)",
                    animation: "step-breathe 4600ms ease-in-out infinite",
                    zIndex: 0,
                  }}
                />
              )}
              {active && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{
                    top: 0,
                    width: 36,
                    height: 36,
                    zIndex: 3,
                  }}
                >
                  {[
                    { x: 35, y: 16, size: 2,   delay: 0,    dur: 2600, dx: 2,  dy: -1 },
                    { x: 26, y: 32, size: 2.5, delay: 700,  dur: 3000, dx: 2,  dy: 2  },
                    { x: 3,  y: 28, size: 2,   delay: 1400, dur: 2700, dx: -2, dy: 2  },
                    { x: -2, y: 11, size: 2.5, delay: 2100, dur: 3200, dx: -2, dy: -1 },
                    { x: 10, y: -2, size: 2,   delay: 2800, dur: 2500, dx: 1,  dy: -2 },
                    { x: 29, y: 1,  size: 1.8, delay: 3500, dur: 2900, dx: 2,  dy: -2 },
                  ].map((s, si) => (
                    <span
                      key={si}
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: s.x,
                        top: s.y,
                        width: s.size,
                        height: s.size,
                        borderRadius: "9999px",
                        background:
                          "radial-gradient(circle, #FFF3C8 0%, rgba(245,228,166,0.95) 45%, rgba(245,228,166,0) 75%)",
                        boxShadow: "0 0 4px rgba(255,243,200,0.85)",
                        animation: `step-spark-drift ${s.dur}ms ease-in-out ${s.delay}ms infinite`,
                        ["--dx" as never]: `${s.dx}px`,
                        ["--dy" as never]: `${s.dy}px`,
                        pointerEvents: "none",
                      }}
                    />
                  ))}
                </span>
              )}
              <span
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold overflow-hidden"
                style={{
                  background: bg,
                  color: numberColor,
                  border: `1px solid ${borderColor}`,
                  boxShadow: active
                    ? "0 0 6px rgba(214,177,90,0.35), inset 0 1px 0 rgba(255,236,183,0.55), inset 0 -1px 0 rgba(120,80,20,0.35)"
                    : completed
                      ? "0 2px 6px rgba(0,0,0,0.25)"
                      : "none",
                  transition:
                    "background 250ms cubic-bezier(0.4,0,0.2,1), box-shadow 250ms cubic-bezier(0.4,0,0.2,1), border-color 250ms",
                  animation: pulse ? "step-pulse 260ms cubic-bezier(0.4,0,0.2,1) 1" : undefined,
                  zIndex: 1,
                }}
              >
                {/* shimmer sweep removed per spec — only sparkles animate */}


                <span style={{ position: "relative", zIndex: 2 }}>
                  {completed ? <Check size={16} strokeWidth={2.5} style={{ color: GOLD }} /> : n}
                </span>
              </span>

              <span
                className="text-[13px] lg:text-[14px] font-medium text-center whitespace-nowrap transition-colors duration-[250ms]"
                style={{
                  color: active ? GOLD : isLast ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.85)",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
