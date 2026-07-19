import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, User, Building2, FileText, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/book-leisure")({
  component: BookLeisure,
  head: () => ({
    meta: [
      { title: "Book Leisure — How it works | HotelGroupBook" },
      { name: "description", content: "How group leisure booking works with HotelGroupBook. One request. Multiple hotels. The best offers." },
    ],
  }),
});

const SERIF = '"Cormorant Garamond", Georgia, serif';
const GOLD = "#F5AE00";
const GOLD_SOFT = "#C9A24A";

const STEPS = [
  { Icon: User, title: "You send one request", desc: "Tell us about your group needs and preferences." },
  { Icon: Building2, title: "We contact hotels", desc: "We reach out to multiple hotels on your behalf." },
  { Icon: FileText, title: "You compare offers", desc: "Receive and review the best offers for your group." },
  { Icon: ShieldCheck, title: "You confirm booking", desc: "We finalize the details and secure your booking." },
];

function BookLeisure() {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden px-4 py-16 sm:py-24"
      style={{ backgroundColor: "#050505" }}
    >
      {/* Subtle texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />
      {/* Edge vignette + gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      {/* Floating gold particles */}
      <Particles />

      <div className="relative mx-auto flex w-full max-w-[640px] flex-col items-center">
        <div
          className="relative w-full rounded-[28px] px-6 py-14 sm:px-14 sm:py-16"
          style={{
            backgroundColor: "#0A0A0A",
            border: `1px solid ${GOLD_SOFT}`,
            boxShadow:
              "0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(245,174,0,0.08), inset 0 0 40px rgba(0,0,0,0.6)",
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "4px 4px",
          }}
        >
          {/* Corner sparkle */}
          <span
            aria-hidden
            className="absolute -top-[3px] left-8 h-[6px] w-[6px] rounded-full"
            style={{ background: GOLD, boxShadow: `0 0 12px ${GOLD}` }}
          />
          <span
            aria-hidden
            className="absolute -bottom-[3px] right-10 h-[6px] w-[6px] rounded-full"
            style={{ background: GOLD, boxShadow: `0 0 12px ${GOLD}` }}
          />

          <h1
            className="text-center text-5xl sm:text-6xl font-medium text-white tracking-tight"
            style={{ fontFamily: SERIF }}
          >
            How it works
          </h1>

          {/* Divider with diamond */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <span
              className="h-[1px] w-16"
              style={{ background: `linear-gradient(90deg, transparent, ${GOLD_SOFT}, transparent)` }}
            />
            <span
              className="inline-block h-[6px] w-[6px] rotate-45"
              style={{ background: GOLD }}
            />
            <span
              className="h-[1px] w-16"
              style={{ background: `linear-gradient(90deg, transparent, ${GOLD_SOFT}, transparent)` }}
            />
          </div>

          {/* Steps */}
          <ol className="mt-12 space-y-10">
            {STEPS.map(({ Icon, title, desc }, i) => (
              <li key={title} className="relative flex items-start gap-5 sm:gap-7">
                <div className="relative flex flex-col items-center">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                    style={{
                      border: `1px solid ${GOLD_SOFT}`,
                      background: "rgba(255,255,255,0.02)",
                    }}
                  >
                    <Icon size={24} color={GOLD} strokeWidth={1.5} />
                  </div>
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className="mt-2 h-10 w-[1px]"
                      style={{
                        backgroundImage: `linear-gradient(to bottom, ${GOLD_SOFT} 40%, transparent 0)`,
                        backgroundSize: "1px 6px",
                        backgroundRepeat: "repeat-y",
                      }}
                    />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-[#B8B8B8]">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          {/* CTA */}
          <Link
            to="/book-leisure/request"
            className="group mt-12 flex w-full items-center justify-center gap-3 rounded-[10px] py-4 text-base font-medium transition-all duration-[250ms] ease-out"
            style={{
              backgroundColor: "#0A0A0A",
              border: `1px solid ${GOLD_SOFT}`,
              color: GOLD,
              boxShadow: "0 0 20px rgba(245,174,0,0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = GOLD;
              e.currentTarget.style.boxShadow = "0 0 30px rgba(245,174,0,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = GOLD_SOFT;
              e.currentTarget.style.boxShadow = "0 0 20px rgba(245,174,0,0.08)";
            }}
          >
            <span>Start Your Request</span>
            <ArrowRight size={18} className="transition-transform duration-[250ms] group-hover:translate-x-1" />
          </Link>
        </div>

        <Link
          to="/"
          className="mt-8 text-xs uppercase tracking-[0.3em] text-[#6a6a6a] transition-colors hover:text-[#C9A24A]"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}

function Particles() {
  const dots = Array.from({ length: 24 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {dots.map((_, i) => {
        const left = (i * 37) % 100;
        const top = (i * 53) % 100;
        const size = 1 + ((i * 7) % 3);
        const delay = (i % 8) * 0.6;
        const dur = 8 + (i % 5) * 2;
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              background: "#F5AE00",
              opacity: 0.35,
              filter: "blur(0.5px)",
              boxShadow: "0 0 6px rgba(245,174,0,0.5)",
              animation: `bl-float ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes bl-float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.15; }
          50% { transform: translateY(-14px) translateX(6px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
