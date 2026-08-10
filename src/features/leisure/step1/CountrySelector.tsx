import { COUNTRIES } from "@/features/leisure/data";
import { S1_GOLD, S1_GOLD_SOFT } from "@/features/leisure/tokens";
import { type CountryCode } from "@/features/leisure/types";

export function CountrySelector({
  country,
  onChange,
}: {
  country: CountryCode;
  onChange: (c: CountryCode) => void;
}) {
  const flagUrl = (code: CountryCode) =>
    `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  return (
    <div className="mx-auto mt-5 flex max-w-[1100px] items-center justify-center gap-0 px-6">
      {COUNTRIES.map((c, i) => {
        const active = c.code === country;
        return (
          <div key={c.code} className="flex items-center">
            {i > 0 && (
              <span
                className="mx-6 h-5 w-px lg:mx-10"
                style={{ background: "rgba(245,241,230,0.25)" }}
              />
            )}
            <button
              type="button"
              onClick={() => onChange(c.code)}
              className="group flex flex-col items-center gap-2 transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={flagUrl(c.code)}
                  alt={c.name}
                  className="h-5 w-7 rounded-sm object-cover"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
                />
                <span
                  className="text-[15px] tracking-[0.16em] transition-colors"
                  style={{
                    color: active ? S1_GOLD : "rgba(245,241,230,0.72)",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {c.name.toUpperCase()}
                </span>
              </div>
              <div
                className="h-[1.5px] w-full transition-all duration-300"
                style={{
                  background: active
                    ? `linear-gradient(90deg, ${S1_GOLD_SOFT}, ${S1_GOLD}, ${S1_GOLD_SOFT})`
                    : "transparent",
                  opacity: active ? 1 : 0,
                }}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
