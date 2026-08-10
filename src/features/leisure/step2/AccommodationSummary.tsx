import { ROOM_LABELS, STEP2_ROOMS_ORDER } from "@/features/leisure/stay";
import { S2_GOLD_SOFT, S2_HAIR_GOLD, S2_SUMMARY_BG, SERIF } from "@/features/leisure/tokens";
import { type LeisureStay } from "@/features/leisure/types";
import { ArrowRight } from "lucide-react";

export function AccommodationSummary({
  stays,
  totalStays,
  totalRooms,
  totalGuests,
  nextEnabled,
  onContinue,
  lastAddedId,
  removingIds,
}: {
  stays: LeisureStay[];
  totalStays: number;
  totalRooms: number;
  totalGuests: number;
  nextEnabled: boolean;
  onContinue: () => void;
  lastAddedId?: string | null;
  removingIds?: Set<string>;
}) {
  const distribution = STEP2_ROOMS_ORDER.map((k) => ({
    key: k,
    label: ROOM_LABELS[k],
    count: stays.reduce((sum, s) => sum + (s.rooms[k] ?? 0), 0),
  }));

  const isEmpty = totalRooms === 0 && totalGuests === 0 && totalStays === 0;

  const divider = (
    <div
      className="my-6 h-px w-full"
      style={{ background: "linear-gradient(90deg, rgba(217,191,130,0.30), rgba(217,191,130,0.05))" }}
    />
  );


  return (
    <aside
      className="flex flex-col px-6 py-8 lg:py-9"
      style={{
        backgroundColor: S2_SUMMARY_BG,
        backgroundImage: "linear-gradient(180deg, #142E48 0%, #10263D 100%)",
        borderLeft: `1px solid ${S2_HAIR_GOLD}`,
        boxShadow: "inset 1px 0 0 rgba(201,164,92,0.18)",
      }}
    >
      <div
        className="text-[26px] font-normal leading-[1.1]"
        style={{ fontFamily: SERIF, color: "#FFFDF8" }}
      >
        Accommodation
      </div>
      <div
        className="mt-2.5 text-[10px] font-medium uppercase tracking-[0.26em]"
        style={{ color: S2_GOLD_SOFT }}
      >
        Live Summary
      </div>

      {/* Key metrics */}
      <div className="mt-7 grid grid-cols-3">
        {[
          { label: "Rooms", value: totalRooms },
          { label: "Guests", value: totalGuests },
          { label: "Stays", value: totalStays },
        ].map((row, i) => (
          <div
            key={row.label}
            className="flex flex-col items-center px-1 text-center"
            style={
              i > 0
                ? { borderLeft: "1px solid rgba(255,255,255,0.10)" }
                : undefined
            }
          >
            <span
              className="text-[34px] leading-none tabular-nums font-light"
              style={{ fontFamily: SERIF, color: "#FFFDF8" }}
            >
              {row.value}
            </span>
            <span
              className="mt-3 text-[9.5px] font-medium uppercase tracking-[0.20em]"
              style={{ color: "rgba(246,242,234,0.55)" }}
            >
              {row.label}
            </span>
          </div>
        ))}
      </div>

      {divider}

      <div
        className="text-[10.5px] font-medium uppercase tracking-[0.24em]"
        style={{ color: S2_GOLD_SOFT }}
      >
        Room Distribution
      </div>

      <ul className="mt-4">
        {distribution.map((r, i) => (
          <li
            key={r.key}
            className="flex items-baseline justify-between gap-3 py-3"
            style={i > 0 ? { borderTop: "1px solid rgba(255,255,255,0.07)" } : undefined}
          >
            <span
              className="truncate text-[13.5px] font-light"
              style={{ color: r.count > 0 ? "rgba(246,242,234,0.92)" : "rgba(246,242,234,0.55)" }}
            >
              {r.label}
            </span>
            <span
              className="text-[13.5px] tabular-nums font-light"
              style={{ color: r.count > 0 ? S2_GOLD_SOFT : "rgba(246,242,234,0.45)" }}
            >
              {r.count}
            </span>
          </li>
        ))}
      </ul>


      {isEmpty && (
        <p
          className="mt-6 text-[12.5px] font-light leading-relaxed"
          style={{ color: "rgba(246,242,234,0.50)" }}
        >
          No stays added yet.
          <br />
          Choose your dates and rooms to begin.
        </p>
      )}


      <button
        type="button"
        onClick={onContinue}
        disabled={!nextEnabled}
        className="mt-auto flex w-full items-center justify-center gap-2.5 text-[11.5px] font-medium uppercase tracking-[0.18em] transition-transform duration-300 hover:-translate-y-[1px]"
        style={{
          marginTop: 32,
          borderRadius: 4,
          paddingTop: 15,
          paddingBottom: 15,
          backgroundColor: "transparent",
          border: `1px solid ${nextEnabled ? "rgba(217,191,130,0.55)" : "rgba(217,191,130,0.22)"}`,
          color: nextEnabled ? S2_GOLD_SOFT : "rgba(231,211,164,0.40)",
          opacity: nextEnabled ? 1 : 0.7,
          cursor: nextEnabled ? "pointer" : "not-allowed",
        }}
      >
        Continue
        <ArrowRight size={15} strokeWidth={1.7} />
      </button>
    </aside>
  );
}
