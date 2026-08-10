import { SERIF } from "@/features/me/tokens";

export function GoldStarDivider() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(90deg, rgba(200,160,80,0) 0%, rgba(200,160,80,0.55) 50%, rgba(200,160,80,0) 100%)",
        }}
      />
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M6 0.5l1.3 3.2 3.2 1.3-3.2 1.3L6 9.5 4.7 6.3 1.5 5l3.2-1.3z"
          fill="#D4AF37"
        />
      </svg>
      <span
        className="h-px flex-1"
        style={{
          background:
            "linear-gradient(90deg, rgba(200,160,80,0) 0%, rgba(200,160,80,0.55) 50%, rgba(200,160,80,0) 100%)",
        }}
      />
    </div>
  );
}

export function PremiumDivider() {
  return (
    <div className="pt-4 lg:pt-10 pb-6 lg:pb-8">
      <div className="relative flex items-center justify-center">
        <div
          className="absolute inset-x-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(199,154,50,0.22) 12%, rgba(199,154,50,0.85) 50%, rgba(199,154,50,0.22) 88%, transparent 100%)",
          }}
        />
        <div
          className="relative z-10 flex h-5 w-5 items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #F7E9B8 0%, #E4C77A 45%, #C79A32 100%)",
            transform: "rotate(45deg)",
            boxShadow:
              "0 0 0 4px #F7F7F5, 0 0 10px rgba(199,154,50,0.35)",
          }}
        >
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "#F7F7F5" }}
          />
        </div>
      </div>
      <p
        className="mt-5 text-center text-[17px] lg:text-[18px] italic tracking-[0.01em]"
        style={{ fontFamily: SERIF, color: "#2A2A2A" }}
      >
        Professional planning. Premium results.
      </p>
    </div>
  );
}



/* --------- Step 3: Accommodation --------- */

export function GoldDivider() {
  return (
    <div
      className="my-6 h-px w-full"
      style={{
        background:
          "linear-gradient(90deg, rgba(212,175,55,0) 0%, rgba(212,175,55,0.55) 50%, rgba(212,175,55,0) 100%)",
      }}
    />
  );
}
