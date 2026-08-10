import { NextButton } from "@/features/me/common/buttons";
import { GOLD, SERIF } from "@/features/me/tokens";

export function StepPlaceholder({
  step,
  title,
  onBack,
  onNext,
  isLast,
}: {
  step: number;
  title: string;
  onBack: () => void;
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <div>
      <h2
        className="text-[#0A1B2C] text-3xl lg:text-[34px] leading-tight"
        style={{ fontFamily: SERIF }}
      >
        Step {step} – {title}
      </h2>
      <div className="mt-2 h-[2px] w-16" style={{ backgroundColor: GOLD }} />
      <p className="mt-6 text-[#4A5866] text-[15px] max-w-lg leading-relaxed">
        Your {title.toLowerCase()} details will be captured here. Continue to the
        next step to complete your Meetings &amp; Events request.
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-md border px-6 h-[48px] text-[15px] font-medium text-[#0A1B2C] bg-white hover:bg-[#F5EFE1] transition-colors"
          style={{ borderColor: "#D9D3C4" }}
        >
          Back
        </button>
        {!isLast ? (
          <NextButton onClick={onNext} label="Next Step" />
        ) : (
          <NextButton onClick={onNext} label="Submit Request" />
        )}
      </div>
    </div>
  );
}

/* --------- Help Card --------- */
