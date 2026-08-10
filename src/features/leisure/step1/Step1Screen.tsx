import { BookingHeader } from "@/components/BookingHeader";
import { CountrySelector } from "@/features/leisure/step1/CountrySelector";
import { DestinationCarousel } from "@/features/leisure/step1/DestinationCarousel";
import { SearchSection } from "@/features/leisure/step1/SearchSection";
import { DESTINATIONS } from "@/features/leisure/step1/data";
import { S1_BG, S1_GOLD, SERIF } from "@/features/leisure/tokens";
import { type CountryCode, type Destination, type StepKey } from "@/features/leisure/types";
import { useMemo } from "react";

export function LeisureStep1Screen({
  country,
  setCountry,
  city,
  setCity,
  customDestination,
  setCustomDestination,
  preferredHotel,
  setPreferredHotel,
  canContinue,
  onNext,
  onStepGo,
}: {
  country: CountryCode;
  setCountry: (c: CountryCode) => void;
  city: string;
  setCity: (c: string) => void;
  customDestination: string;
  setCustomDestination: (v: string) => void;
  preferredHotel: string;
  setPreferredHotel: (v: string) => void;
  canContinue: boolean;
  onNext: () => void;
  onStepGo: (s: StepKey) => void;
}) {
  const destinations = DESTINATIONS[country];

  // Derived shared selection id — the same value whether picked via card or autocomplete.
  const selectedId = useMemo(() => {
    if (customDestination.trim()) return null;
    const match = destinations.find((d) => d.name === city);
    return match?.id ?? null;
  }, [customDestination, city, destinations]);

  const handleSelect = (d: Destination) => {
    if (d.country !== country) setCountry(d.country);
    setCity(d.name);
    setCustomDestination("");
  };

  return (
    <main
      className="min-h-screen w-full"
      style={{
        backgroundColor: S1_BG,
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#F5F1E6",
      }}
    >
      <BookingHeader background="transparent" currentStep={1} onStepGo={onStepGo} hideCurrentFlow="leisure" />

      {/* Title */}
      <div className="mx-auto max-w-[1600px] px-6 pt-6 text-center lg:px-10 lg:pt-10">
        <h1
          className="text-[44px] leading-none tracking-[0.02em] sm:text-[64px] lg:text-[86px]"
          style={{
            fontFamily: SERIF,
            color: "#FBF6E8",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          BOOK LEISURE
        </h1>
        <div className="mt-5 flex flex-col items-center">
          <div className="text-[13px] tracking-[0.34em]" style={{ color: S1_GOLD }}>
            CHOOSE YOUR DESTINATION
          </div>
          <div
            className="mt-2 h-px w-24"
            style={{ background: S1_GOLD, opacity: 0.75 }}
          />
        </div>
      </div>

      <CountrySelector country={country} onChange={setCountry} />

      <DestinationCarousel
        destinations={destinations}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      <SearchSection
        query={customDestination}
        onQueryChange={setCustomDestination}
        onPickSuggestion={handleSelect}
        preferredHotel={preferredHotel}
        onPreferredHotelChange={setPreferredHotel}
        canContinue={canContinue}
        onNext={onNext}
      />

      <div className="h-16 lg:h-24" />
    </main>
  );
}
