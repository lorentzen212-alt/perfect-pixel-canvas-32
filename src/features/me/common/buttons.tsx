import { GOLD } from "@/features/me/tokens";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function NextButton({ onClick, label, disabled = false }: { onClick: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-md text-[16px] font-semibold text-[#0A1B2C] transition-all duration-200",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:brightness-105",
      )}
      style={{
        height: 52,
        minWidth: 220,
        background: `linear-gradient(180deg, #F7D07A 0%, ${GOLD} 55%, #C89A3A 100%)`,
        boxShadow: disabled
          ? "none"
          : "0 18px 40px -18px rgba(200,154,58,0.55), 0 4px 10px -4px rgba(200,154,58,0.35), inset 0 1px 0 rgba(255,255,255,0.5)",
        border: "1px solid rgba(184,138,46,0.45)",
      }}
    >
      {label}
      <ArrowRight size={18} strokeWidth={2.2} />
    </button>
  );
}

export function ContinueButton({ onClick, label, disabled = false }: { onClick: () => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md text-[16px] font-bold text-[#1A1A1A] transition-all duration-200",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:brightness-105",
      )}
      style={{
        height: 54,
        minWidth: 207,
        padding: "0 28px",
        background: `
          linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 20%),
          linear-gradient(180deg, #FFF1B8 0%, #F7D976 10%, #E6B840 32%, #C89726 58%, #9C6F16 88%, #7A5410 100%)
        `,
        boxShadow: disabled
          ? "none"
          : "0 34px 60px -18px rgba(120,80,20,0.75), 0 16px 28px -10px rgba(120,80,20,0.55), 0 4px 8px -2px rgba(90,60,10,0.45), inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -2px 0 rgba(80,55,15,0.38), inset 0 0 0 1px rgba(255,235,170,0.35)",
        border: "1px solid #8F6314",
        WebkitFontSmoothing: "antialiased",
        textShadow: "0 1px 0 rgba(255,255,255,0.55)",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "110px 110px",
          mixBlendMode: "overlay",
        }}
      />
      <span aria-hidden="true" className="pointer-events-none absolute left-3 right-3 top-0 h-[2px] rounded-full" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0) 100%)" }} />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 h-[1px] bg-[#6A4A18] opacity-35" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[45%]"
        style={{
          background:
            "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 50%, rgba(255,255,255,0) 100%)",
          transform: "translateX(-30%) skewX(-18deg)",
          opacity: 0.35,
        }}
      />
      <span className="relative z-10 tracking-[-0.01em]">{label}</span>
      <ArrowRight size={18} strokeWidth={2} className="relative z-10" />
    </button>
  );
}

/* --------- Step 5 – Extras --------- */
