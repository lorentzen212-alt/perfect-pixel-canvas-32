import { HERO } from "@/features/leisure/data";
import { GOLD, GOLD_SOFT, NAVY_DEEP, SERIF } from "@/features/leisure/tokens";
import { Check, CheckCircle2, Copy, Loader2 } from "lucide-react";

export function ConfirmationScreen({
  requestId,
  copied,
  onCopy,
  onGoToRequests,
  onHome,
}: {
  requestId: string;
  copied: boolean;
  onCopy: () => void;
  onGoToRequests: () => void;
  onHome: () => void;
}) {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: NAVY_DEEP, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <img
        src={HERO.confirm}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,20,34,0.55) 0%, rgba(6,20,34,0.80) 60%, rgba(6,20,34,0.95) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[720px] flex-col items-center justify-center px-6 py-16 text-center text-white">
        <div
          className="grid h-16 w-16 place-items-center rounded-full"
          style={{
            backgroundColor: "rgba(201,162,74,0.15)",
            border: `1px solid ${GOLD}`,
          }}
        >
          <Check size={28} strokeWidth={2.4} style={{ color: GOLD_SOFT }} />
        </div>
        <h1
          className="mt-8 text-[44px] sm:text-[54px] leading-[1.05] font-medium"
          style={{ fontFamily: SERIF }}
        >
          Your journey<br />starts here.
        </h1>
        <p className="mt-5 max-w-[460px] text-[15.5px] leading-relaxed text-white/85">
          We're now finding the best hotel offers for your group. You'll receive tailored proposals shortly.
        </p>

        <div
          className="mt-10 w-full max-w-[440px] rounded-[18px] p-6 text-left"
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
            border: `1px solid rgba(201,162,74,0.30)`,
          }}
        >
          <div className="flex items-center justify-between text-[13px] text-white/70">
            <span>Request ID</span>
            <button
              onClick={onCopy}
              className="inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="mt-1 text-[20px] font-medium" style={{ color: GOLD_SOFT, fontFamily: SERIF }}>
            {requestId}
          </div>
          <div className="my-4 h-px" style={{ backgroundColor: "rgba(255,255,255,0.10)" }} />
          <div className="flex items-center justify-between text-[13px] text-white/70">
            <span>Status</span>
            <span className="inline-flex items-center gap-2 text-white">
              <Loader2 size={14} className="animate-spin" style={{ color: GOLD_SOFT }} />
              Finding matching hotels
            </span>
          </div>
        </div>

        <div className="mt-8 flex w-full max-w-[440px] flex-col gap-3">
          <button
            onClick={onGoToRequests}
            className="rounded-[12px] px-6 py-3.5 text-[14px] font-semibold transition-transform hover:-translate-y-[1px]"
            style={{
              background: `linear-gradient(135deg, ${GOLD_SOFT} 0%, ${GOLD} 100%)`,
              color: NAVY_DEEP,
              boxShadow: "0 14px 34px -12px rgba(201,162,74,0.45)",
            }}
          >
            Go to My Requests
          </button>
          <button
            onClick={onHome}
            className="rounded-[12px] px-6 py-3.5 text-[14px] font-medium text-white transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.20)" }}
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </main>
  );
}
