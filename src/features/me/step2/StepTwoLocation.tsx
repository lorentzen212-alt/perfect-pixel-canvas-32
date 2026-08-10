import { ContinueButton } from "@/features/me/common/buttons";
import { GoldStarDivider } from "@/features/me/common/dividers";
import { BudgetPreference } from "@/features/me/step2/BudgetPreference";
import type { CountryCode, Destination, SearchableDestination } from "@/features/me/step2/destinations";
import { ALL_SEARCHABLE_DESTINATIONS, COUNTRIES, DESTINATIONS_BY_COUNTRY } from "@/features/me/step2/destinations";
import { SANS, SERIF } from "@/features/me/tokens";
import { setMeSection } from "@/lib/meDraftStore";
import { cn } from "@/lib/utils";
import { Check, Globe, Mail, Pencil, Phone, Sparkles } from "lucide-react";
import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export function StepTwoLocation({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("NO");
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [budget, setBudget] = useState<"economy" | "mid" | "premium" | "luxury" | null>(null);
  const [preferredVenue, setPreferredVenue] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [highlightedSearchIndex, setHighlightedSearchIndex] = useState(0);

  // Commit location selection into shared draft.
  useEffect(() => {
    const country = COUNTRIES.find((c) => c.code === selectedCountry);
    const dest = selectedDestination
      ? DESTINATIONS_BY_COUNTRY[selectedCountry].find((d) => d.id === selectedDestination) ??
        ALL_SEARCHABLE_DESTINATIONS.find((d) => d.id === selectedDestination)
      : null;
    setMeSection("location", {
      countryCode: selectedCountry,
      countryName: country?.name,
      destinationId: selectedDestination ?? undefined,
      destinationName: dest?.name,
      isAnywhere: (dest as { anywhere?: boolean } | undefined)?.anywhere ?? false,
      preferredVenue: preferredVenue.trim() || undefined,
      budget: budget,
    });
  }, [selectedCountry, selectedDestination, budget, preferredVenue]);

  const searchRef = useRef<HTMLDivElement>(null);

  const currentCountry = COUNTRIES.find((c) => c.code === selectedCountry) ?? COUNTRIES[0];
  const destinations = DESTINATIONS_BY_COUNTRY[selectedCountry];

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_SEARCHABLE_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.countryName.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [searchQuery]);

  // Close search dropdown on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    setHighlightedSearchIndex(0);
  }, [searchQuery]);

  function changeCountry(code: CountryCode) {
    setSelectedCountry(code);
    setSelectedDestination(null);
    setSearchQuery("");
    setIsSearchDropdownOpen(false);
  }

  function pickDestinationCard(d: Destination) {
    setSelectedDestination(d.id);
    setSearchQuery(d.name);
    setIsSearchDropdownOpen(false);
  }

  function pickSearchResult(r: SearchableDestination) {
    setSelectedCountry(r.country);
    setSelectedDestination(r.id);
    setSearchQuery(r.name);
    setIsSearchDropdownOpen(false);
  }

  function onSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isSearchDropdownOpen || searchResults.length === 0) {
      if (e.key === "ArrowDown" && searchResults.length > 0) {
        setIsSearchDropdownOpen(true);
      }
      if (e.key === "Escape") setIsSearchDropdownOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedSearchIndex((i) => (i + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedSearchIndex(
        (i) => (i - 1 + searchResults.length) % searchResults.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = searchResults[highlightedSearchIndex];
      if (r) pickSearchResult(r);
    } else if (e.key === "Escape") {
      setIsSearchDropdownOpen(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
      {/* MAIN BOOKING CARD */}
      <div
        className="relative overflow-hidden rounded-[26px] p-6 sm:p-10 lg:p-14"
        style={{
          background: "#FCFBF8",
          border: "1px solid #ECE6D6",
          boxShadow:
            "inset 0 1px 0 rgba(255,251,240,0.7), 0 1px 0 rgba(90,72,44,0.05), 0 20px 44px -34px rgba(60,48,28,0.14)",
        }}
      >
        {/* Title */}
        <h2
          className="text-[42px] sm:text-[50px] leading-[1.05]"
          style={{ fontFamily: SERIF, fontWeight: 400, color: "#1F1F1F", letterSpacing: "-0.015em", fontVariantNumeric: "lining-nums", fontFeatureSettings: '"lnum" 1' }}
        >
          Step{" "}
          <span style={{ fontFamily: '"EB Garamond", "Cormorant Garamond", Georgia, "Times New Roman", serif', fontWeight: 500, fontSize: "0.93em", display: "inline-block" }}>
            1
          </span>
          {" "}– Location
        </h2>


        <p className="mt-3 text-[15px] text-[#4A5866]">
          Where would you like to host your event?
        </p>
        <div className="mt-6 h-px w-full" style={{ background: "#ECE6D6" }} />

        {/* Country pills */}
        <div className="mt-8 flex flex-wrap gap-3">
          {COUNTRIES.map((c) => {
            const active = c.code === selectedCountry;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => changeCountry(c.code)}
                aria-pressed={active}
                className={cn(
                  "country-pill group inline-flex items-center gap-3 rounded-full pl-4 pr-6 h-[48px] text-[15px] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B15A]/30",
                  active ? "country-pill--active" : "",
                )}
                style={{
                  background: "#FAF8F4",
                  border: active ? "1.5px solid transparent" : "1px solid #ECE6D6",
                  color: active ? "#7A5A1E" : "#4A5866",
                  fontWeight: active ? 600 : 500,
                  ...(active
                    ? {
                        backgroundImage:
                          "linear-gradient(#FFFFFF,#FFFFFF), linear-gradient(180deg,#F5E4A6 0%, #D6B15A 45%, #C79A32 75%, #A87516 100%)",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                        boxShadow:
                          "0 2px 6px -2px rgba(168,117,22,0.18), inset 0 1px 0 rgba(245,228,166,0.35)",
                      }
                    : {
                        boxShadow: "0 4px 14px -12px rgba(10,27,44,0.14)",
                      }),
                }}
              >
                <span
                  className="inline-flex h-6 w-9 items-center justify-center overflow-hidden rounded-[3px] shrink-0"
                >
                  <c.Flag />
                </span>
                {c.name}
              </button>

            );
          })}
        </div>

        {/* Curated destinations */}
        <div className="mt-10 flex items-center gap-3">
          <Sparkles size={18} className="text-[#D4AF37]" strokeWidth={1.6} />
          <h3
            className="text-[#0A1B2C] text-[18px]"
            style={{ fontFamily: SANS, fontWeight: 600 }}
          >
            Curated destinations in {currentCountry.name}
          </h3>
        </div>

        {/* Destination grid: 4 per row × 2 rows */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {destinations.map((d) => {
            const selected = selectedDestination === d.id;
            if (d.anywhere) {
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => pickDestinationCard(d)}
                  aria-pressed={selected}
                  className={cn(
                    "destination-card group relative overflow-hidden rounded-[16px] aspect-[4/3] flex flex-col items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B15A]/35",
                    selected && "destination-card--selected",
                  )}
                  style={{
                    background:
                      "linear-gradient(180deg,#0F2233 0%, #0A1B2C 100%) padding-box, linear-gradient(180deg,#F5E4A6 0%, #D6B15A 45%, #C79A32 75%, #A87516 100%) border-box",
                    border: "1.5px solid transparent",
                    boxShadow: "0 6px 18px -12px rgba(10,27,44,0.35), inset 0 1px 0 rgba(245,228,166,0.18)",
                  }}
                >
                  <Globe size={30} strokeWidth={1.4} className="text-[#F0D78C]" />
                  <span
                    className="text-white text-[16px] text-center leading-tight"
                    style={{ fontFamily: SANS, fontWeight: 500 }}
                  >
                    Anywhere
                    <br />
                    <span className="text-[#F0D78C]">in {currentCountry.name}</span>
                  </span>
                  {selected && (
                    <span
                      className="absolute top-3 right-3 inline-flex h-6 w-6 items-center justify-center rounded-full"
                      style={{ backgroundColor: "#D4AF37" }}
                    >
                      <Check size={13} strokeWidth={3} className="text-[#0A1B2C]" />
                    </span>
                  )}
                </button>
              );
            }
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => pickDestinationCard(d)}
                aria-pressed={selected}
                className={cn(
                  "destination-card group relative overflow-hidden rounded-[16px] aspect-[4/3] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B15A]/35",
                  selected && "destination-card--selected",
                )}
                style={{
                  background:
                    "#0A1B2C padding-box, linear-gradient(180deg,#F5E4A6 0%, #D6B15A 45%, #C79A32 75%, #A87516 100%) border-box",
                  border: "1.5px solid transparent",
                  boxShadow: "0 8px 22px -14px rgba(10,27,44,0.4), inset 0 1px 0 rgba(245,228,166,0.15)",
                }}
              >

                <img
                  src={d.image}
                  alt={d.name}
                  loading="lazy"
                  width={600}
                  height={450}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(4,17,26,0) 45%, rgba(4,17,26,0.55) 78%, rgba(4,17,26,0.9) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-4 pb-3">
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(240,215,140,0.55)",
                    }}
                  >
                    <d.Icon size={14} strokeWidth={1.6} className="text-[#F0D78C]" />
                  </span>
                  <span
                    className="text-white text-[17px] tracking-[-0.005em]"
                    style={{ fontFamily: SANS, fontWeight: 500 }}
                  >
                    {d.name}
                  </span>
                </div>
                {selected && (
                  <span
                    className="absolute top-3 right-3 inline-flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#D4AF37" }}
                  >
                    <Check size={13} strokeWidth={3} className="text-[#0A1B2C]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search field */}
        <div className="mt-10">
          <p className="text-[15px] mb-2" style={{ fontWeight: 600, color: "#1A2233" }}>Or search for any destination</p>
          <div ref={searchRef} className="relative">
            <div
              className="flex items-center gap-3 rounded-[16px] px-5 h-[56px]"
              style={{
                background: "#FAF8F4",
                border: "1px solid #ECE6D6",
                boxShadow: "0 4px 14px -10px rgba(10,27,44,0.10)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B88A2E"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchDropdownOpen(true);
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setIsSearchDropdownOpen(true);
                }}
                onKeyDown={onSearchKey}
                placeholder="Type city, region or venue"
                autoComplete="off"
                aria-label="Destination"
                className="w-full bg-transparent text-[15px] outline-none border-none placeholder:text-[#6B778C]"
                style={{ color: "#0F1B2D" }}
              />
            </div>

            {isSearchDropdownOpen && searchResults.length > 0 && (
              <ul
                role="listbox"
                className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-[280px] overflow-auto rounded-[16px] border bg-white py-1"
                style={{
                  borderColor: "#ECE6D6",
                  boxShadow: "0 24px 50px -18px rgba(10,27,44,0.22)",
                }}
              >
                {searchResults.map((r, idx) => {
                  const highlighted = idx === highlightedSearchIndex;
                  return (
                    <li key={`${r.country}-${r.id}`}>
                      <button
                        type="button"
                        onMouseEnter={() => setHighlightedSearchIndex(idx)}
                        onClick={(e) => {
                          e.preventDefault();
                          pickSearchResult(r);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between gap-3 px-5 py-2.5 text-left text-[15px] text-[#0A1B2C] transition-colors",
                          highlighted ? "bg-[#FBF6EA]" : "hover:bg-[#F8F4E8]",
                        )}
                      >
                        <span className="truncate">{r.name}</span>
                        <span className="text-[13px] text-[#7C8794] shrink-0">
                          {r.countryName}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Preferred venue field */}
        <div
          className="mt-4 flex items-center gap-4 rounded-[16px] px-5 py-3"
          style={{
            background: "#FAF8F4",
            border: "1px solid #ECE6D6",
            boxShadow: "0 4px 14px -10px rgba(10,27,44,0.10)",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B88A2E"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
            <path d="M14 3v5h5" />
            <path d="M8 13h6M8 17h4" />
          </svg>
          <div className="flex flex-1 flex-col min-w-0">
            <label
              htmlFor="preferred-venue"
              className="text-[14.5px]"
            >
              <span style={{ fontWeight: 650, color: "#2A3441" }}>Preferred venue</span>{" "}
              <span className="font-normal" style={{ color: "#6B778C" }}>(optional)</span>
            </label>
            <input
              id="preferred-venue"
              type="text"
              value={preferredVenue}
              onChange={(e) => setPreferredVenue(e.target.value)}
              placeholder="Specific hotel, venue or any special request…"
              className="w-full bg-transparent text-[14px] outline-none border-none mt-0.5 placeholder:text-[#6B778C]"
              style={{ color: "#0F1B2D" }}
            />
          </div>
          <button
            type="button"
            aria-label="Edit preferred venue"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[#F7F3EA] shrink-0"
          >
            <Pencil size={16} className="text-[#B88A2E]" strokeWidth={1.8} />
          </button>
        </div>


        {/* Budget preference */}
        <BudgetPreference value={budget} onChange={setBudget} />

        {/* Continue to Accommodation */}
        <div className="mt-8">
          <GoldStarDivider />
          <div className="mt-6 flex justify-end">
            <ContinueButton
              onClick={() => {
                if (selectedDestination) onNext();
              }}
              label="Continue to Accommodation"
              disabled={!selectedDestination}
            />
          </div>
        </div>

        {/* Hidden back nav — progress bar handles previous-step navigation */}
        <div className="sr-only" aria-hidden="true">
          <button type="button" onClick={onBack}>Back</button>
        </div>
      </div>

      {/* NEED HELP CARD */}
      <aside
        className="relative overflow-hidden rounded-[26px]"
        style={{
          backgroundColor: "#FAF8F4",
          boxShadow:
            "0 40px 80px -50px rgba(10,27,44,0.18), 0 12px 32px -20px rgba(10,27,44,0.08)",
          minHeight: 480,
        }}
      >
        {/* Reference illustration: warm off-white bg + gold lines + lounge — used as full card background */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${helpCardBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="relative pt-9 lg:pt-10 px-8 lg:px-9 pb-4">

          <h3
            className="text-[#0A1B2C] text-[28px] leading-tight"
            style={{ fontFamily: SERIF, fontWeight: 500 }}
          >
            Need help?
          </h3>
          <p className="mt-3 text-[#4A5866] text-[15px] leading-relaxed">
            Our M&amp;E specialists are
            <br />
            ready to assist you.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            <a
              href="tel:+4721002100"
              className="flex items-center gap-3 text-[#2A2A2A] text-[15px] hover:text-[#B88A2E] transition-colors"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                style={{
                  background:
                    "linear-gradient(180deg,#F5E4A6 0%, #D6B15A 50%, #C79A32 100%)",
                  boxShadow:
                    "0 4px 10px -6px rgba(168,117,22,0.45), inset 0 1px 0 rgba(255,245,210,0.7), inset 0 -1px 0 rgba(120,80,20,0.35)",
                }}
              >
                <Phone size={16} strokeWidth={2} className="text-white" />
              </span>
              +47 21 00 21 00
            </a>
            <a
              href="mailto:meetings@hotelgroupbook.com"
              className="flex items-center gap-3 text-[#2A2A2A] text-[15px] hover:text-[#B88A2E] transition-colors whitespace-nowrap"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                style={{
                  background:
                    "linear-gradient(180deg,#F5E4A6 0%, #D6B15A 50%, #C79A32 100%)",
                  boxShadow:
                    "0 4px 10px -6px rgba(168,117,22,0.45), inset 0 1px 0 rgba(255,245,210,0.7), inset 0 -1px 0 rgba(120,80,20,0.35)",
                }}
              >
                <Mail size={16} strokeWidth={2} className="text-white" />
              </span>
              meetings@hotelgroupbook.com
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
