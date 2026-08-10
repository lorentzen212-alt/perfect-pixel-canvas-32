import { ALL_DESTINATIONS } from "@/features/leisure/step1/data";
import { S1_GOLD, S1_GOLD_SOFT, S1_NAVY, S1_NAVY_SOFT } from "@/features/leisure/tokens";
import { type Destination } from "@/features/leisure/types";
import { ArrowRight, MapPin, Pencil, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

export function SearchSection({
  query,
  onQueryChange,
  onPickSuggestion,
  preferredHotel,
  onPreferredHotelChange,
  canContinue,
  onNext,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  onPickSuggestion: (d: Destination) => void;
  preferredHotel: string;
  onPreferredHotelChange: (v: string) => void;
  canContinue: boolean;
  onNext: () => void;
}) {
  const [open, setOpen] = useState(false);
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.countryName.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [query]);

  return (
    <div className="mx-auto mt-12 w-full max-w-[1240px] px-6 lg:px-10">
      <div className="flex items-center justify-center gap-4">
        <span
          aria-hidden
          className="h-px w-28 sm:w-36"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,166,74,0) 0%, rgba(212,166,74,0.45) 30%, rgba(212,166,74,0.75) 100%)",
          }}
        />
        <div
          className="text-[13px] tracking-[0.34em]"
          style={{ color: S1_GOLD }}
        >
          OR
        </div>
        <span
          aria-hidden
          className="h-px w-28 sm:w-36"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,166,74,0.75) 0%, rgba(212,166,74,0.45) 70%, rgba(212,166,74,0) 100%)",
          }}
        />
      </div>


      {/* Search field with autocomplete */}
      <div className="relative mt-4">
        <div
          className="flex items-center gap-3 rounded-[14px] px-5 py-4"
          style={{
            backgroundColor: S1_NAVY_SOFT,
            border: `1px solid rgba(212,166,74,0.28)`,
          }}
        >
          <Search size={18} style={{ color: S1_GOLD }} strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            placeholder="Type city, region or venue"
            className="w-full bg-transparent text-[14.5px] outline-none placeholder:text-[rgba(245,241,230,0.5)]"
            style={{ color: "#F5F1E6" }}
          />
        </div>

        {open && suggestions.length > 0 && (
          <ul
            className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[14px]"
            style={{
              backgroundColor: S1_NAVY_SOFT,
              border: `1px solid rgba(212,166,74,0.28)`,
              boxShadow: "0 22px 44px -18px rgba(0,0,0,0.7)",
            }}
          >
            {suggestions.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onPickSuggestion(d);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <MapPin size={15} style={{ color: S1_GOLD }} />
                  <span className="text-[14px]" style={{ color: "#F5F1E6" }}>
                    {d.name}
                  </span>
                  <span
                    className="ml-auto text-[11px] tracking-[0.2em]"
                    style={{ color: "rgba(245,241,230,0.55)" }}
                  >
                    {d.countryName.toUpperCase()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Preferred hotel */}
      <div
        className="mt-4 rounded-[14px] px-5 py-4"
        style={{
          backgroundColor: S1_NAVY_SOFT,
          border: `1px solid rgba(212,166,74,0.28)`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="text-[14.5px] font-semibold" style={{ color: "#F5F1E6" }}>
              Preferred hotel or special requests{" "}
              <span style={{ color: "rgba(245,241,230,0.6)", fontWeight: 400 }}>
                (optional)
              </span>
            </div>
            <textarea
              value={preferredHotel}
              onChange={(e) => onPreferredHotelChange(e.target.value)}
              placeholder="Tell us if you have a preferred hotel or anything important we should know…"
              rows={1}
              className="mt-1.5 w-full resize-none bg-transparent text-[13.5px] outline-none placeholder:text-[rgba(245,241,230,0.5)]"
              style={{ color: "rgba(245,241,230,0.9)" }}
            />
          </div>
          <Pencil size={16} style={{ color: S1_GOLD, flexShrink: 0, marginTop: 4 }} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-3 flex flex-col-reverse items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2 text-[13.5px]">
          <ShieldCheck size={16} strokeWidth={2} style={{ color: S1_GOLD }} />
          <span style={{ color: S1_GOLD }}>
            Your request is free and non-binding
          </span>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="inline-flex items-center gap-3 rounded-[14px] px-10 py-4 text-[15px] font-semibold transition-all hover:-translate-y-[1px]"
          style={{
            background: `linear-gradient(135deg, ${S1_GOLD_SOFT} 0%, ${S1_GOLD} 100%)`,
            color: S1_NAVY,
            boxShadow:
              "0 18px 40px -16px rgba(212,166,74,0.55), inset 0 1px 0 rgba(255,255,255,0.4)",
            opacity: canContinue ? 1 : 0.55,
            cursor: canContinue ? "pointer" : "not-allowed",
            minWidth: 200,
          }}
        >
          Next step
          <ArrowRight size={17} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}
