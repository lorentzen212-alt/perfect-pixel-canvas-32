import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Building2,
  User,
  Calendar,
  ChevronDown,
  Lock,
} from "lucide-react";

export const Route = createFileRoute("/book-leisure")({
  component: BookLeisure,
  head: () => ({
    meta: [
      { title: "Book Leisure — HotelGroupBook" },
      {
        name: "description",
        content:
          "Tell us about your group and we'll find the best hotel offers for you.",
      },
    ],
  }),
});

const SERIF = '"Cormorant Garamond", Georgia, serif';
const GOLD = "#F5C25A";
const GOLD_SOFT = "#E9B96A";
const NAVY_BG = "#071321";
const PANEL = "#0B1B2C";
const PANEL_ACTIVE = "#122844";
const BORDER = "rgba(245, 194, 90, 0.25)";
const BORDER_SOFT = "rgba(245, 194, 90, 0.15)";

type StepKey = 1 | 2 | 3;

const STEPS = [
  { n: 1 as StepKey, title: "Your Trip", sub: "Where and when", Icon: MapPin },
  { n: 2 as StepKey, title: "Requests", sub: "What you need", Icon: Building2 },
  { n: 3 as StepKey, title: "Your Details", sub: "Who to contact", Icon: User },
];

function BookLeisure() {
  const [step, setStep] = useState<StepKey>(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const go = (next: StepKey) => {
    setDirection(next > step ? "forward" : "back");
    setStep(next);
  };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: NAVY_BG }}
    >
      <GoldParticles />

      <div className="relative mx-auto max-w-[1500px] px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <div
          className="relative overflow-hidden rounded-[28px] border"
          style={{
            borderColor: BORDER_SOFT,
            backgroundColor: "rgba(7, 19, 33, 0.6)",
            boxShadow:
              "0 40px 120px -40px rgba(0,0,0,0.7), inset 0 1px 0 rgba(245,194,90,0.05)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
            <Sidebar step={step} onGo={go} />
            <div className="relative p-6 sm:p-10 lg:p-14">
              <TopBar step={step} onBack={() => step > 1 && go((step - 1) as StepKey)} />

              <header className="mt-8 lg:mt-6">
                <h1
                  className="text-white text-4xl sm:text-5xl lg:text-[56px] leading-[1.05] font-medium tracking-tight"
                  style={{ fontFamily: SERIF }}
                >
                  Book Leisure
                </h1>
                <p className="mt-3 text-[15px] text-[#C8CFD6]">
                  Tell us about your group and we'll find the best hotel offers for you.
                </p>
              </header>

              <div className="relative mt-8">
                <div
                  key={step}
                  className={
                    direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left"
                  }
                >
                  <FormCard step={step} onContinue={() => step < 3 && go((step + 1) as StepKey)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 350ms ease-out; }
        .animate-slide-in-left { animation: slide-in-left 350ms ease-out; }
      `}</style>
    </main>
  );
}

/* ---------- Sidebar ---------- */

function Sidebar({ step, onGo }: { step: StepKey; onGo: (s: StepKey) => void }) {
  return (
    <aside
      className="relative border-b lg:border-b-0 lg:border-r p-6 lg:p-8"
      style={{ borderColor: BORDER_SOFT, backgroundColor: "rgba(4, 12, 22, 0.5)" }}
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
        style={{ color: GOLD }}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back
      </Link>

      <div className="relative mt-10">
        {/* Dotted vertical gold line — positioned at circle center (x = 20px) */}
        <div
          className="absolute left-[20px] top-[40px] bottom-[40px] w-px -translate-x-1/2"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${GOLD_SOFT} 50%, transparent 50%)`,
            backgroundSize: "1px 6px",
            backgroundRepeat: "repeat-y",
            opacity: 0.5,
          }}
          aria-hidden="true"
        />

        <div className="flex flex-col gap-6">
          {STEPS.map(({ n, title, sub, Icon }) => {
            const active = step === n;
            const done = step > n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onGo(n)}
                className="relative flex items-start gap-4 text-left group"
              >
                {/* Circle — 40px, centered on x=20 */}
                <span
                  className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold transition-all"
                  style={{
                    backgroundColor: active ? GOLD : "transparent",
                    color: active ? "#0A1626" : GOLD,
                    border: `1.5px solid ${GOLD}`,
                    boxShadow: active
                      ? "0 0 0 4px rgba(245,194,90,0.12), 0 6px 20px -8px rgba(245,194,90,0.5)"
                      : "none",
                  }}
                >
                  {n}
                </span>

                <div
                  className={`flex-1 min-w-0 rounded-2xl px-4 py-3 -my-1 transition-all ${
                    active ? "border" : ""
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: PANEL_ACTIVE,
                          borderColor: BORDER,
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                        }
                      : {}
                  }
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} strokeWidth={1.6} className="shrink-0" style={{ color: GOLD }} />
                  </div>
                  <div
                    className="mt-1 text-[17px] font-medium"
                    style={{ color: active ? GOLD : done ? "#E8E8E4" : "#E8E8E4", fontFamily: SERIF }}
                  >
                    {title}
                  </div>
                  <div className="text-[13px]" style={{ color: "#8B96A3" }}>
                    {sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

/* ---------- Top progress ---------- */

function TopBar({ step, onBack }: { step: StepKey; onBack: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-80"
        style={{ color: GOLD, opacity: step === 1 ? 0.5 : 1 }}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back
      </button>

      <div className="flex items-center gap-2 sm:gap-3">
        {[1, 2, 3].map((n, i) => (
          <div key={n} className="flex items-center gap-2 sm:gap-3">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold transition-all"
              style={{
                backgroundColor: step === n ? GOLD : "transparent",
                color: step === n ? "#0A1626" : step > n ? GOLD : "#8B96A3",
                border: `1.5px solid ${step >= n ? GOLD : "rgba(245,194,90,0.35)"}`,
              }}
            >
              {n}
            </span>
            {i < 2 && (
              <span
                className="h-px w-8 sm:w-10"
                style={{ backgroundColor: step > n ? GOLD : "rgba(245,194,90,0.35)" }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Form Card ---------- */

function FormCard({ step, onContinue }: { step: StepKey; onContinue: () => void }) {
  return (
    <div
      className="rounded-[28px] p-6 sm:p-10 lg:p-12"
      style={{
        backgroundColor: "#F5F1EA",
        boxShadow:
          "0 30px 80px -30px rgba(0,0,0,0.55), 0 8px 30px -12px rgba(0,0,0,0.35)",
      }}
    >
      {step === 1 && <StepTrip />}
      {step === 2 && <StepRequests />}
      {step === 3 && <StepDetails />}

      <div className="mt-10">
        <ContinueButton onClick={onContinue} label={step === 3 ? "Submit Request" : "Continue"} />
        <div className="mt-5 flex items-center justify-center gap-2 text-[13px]" style={{ color: "#5B6472" }}>
          <Lock size={14} strokeWidth={1.8} />
          <span>It's free and without obligation.</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- Steps ---------- */

function StepTrip() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
      <Column title="Where are you going?">
        <Field label="Country">
          <SelectBox>
            <span className="flex items-center gap-2">
              <FlagNO />
              <span className="text-[15px] text-[#0A1626]">Norway</span>
            </span>
          </SelectBox>
        </Field>
        <Field label="City">
          <SelectBox>
            <span className="text-[15px] text-[#0A1626]">Bergen</span>
          </SelectBox>
        </Field>
      </Column>

      <Column title="When are you arriving?">
        <Field label="Arrival Date">
          <SelectBox icon={<Calendar size={18} strokeWidth={1.6} className="text-[#0A1626]" />}>
            <span className="text-[15px] text-[#0A1626]">15 May 2025</span>
          </SelectBox>
        </Field>
        <Field label="Departure Date">
          <SelectBox icon={<Calendar size={18} strokeWidth={1.6} className="text-[#0A1626]" />}>
            <span className="text-[15px] text-[#0A1626]">18 May 2025</span>
          </SelectBox>
        </Field>
      </Column>

      <Column title="How many are you?">
        <Field label="Number of Guests">
          <SelectBox>
            <span className="text-[15px] text-[#0A1626]">25</span>
          </SelectBox>
        </Field>
        <Field label="Number of Rooms">
          <SelectBox>
            <span className="text-[15px] text-[#0A1626]">12</span>
          </SelectBox>
        </Field>
      </Column>
    </div>
  );
}

function StepRequests() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Column title="What do you need?">
        <Field label="Room Type">
          <SelectBox><span className="text-[15px] text-[#0A1626]">Double Rooms</span></SelectBox>
        </Field>
        <Field label="Board">
          <SelectBox><span className="text-[15px] text-[#0A1626]">Breakfast included</span></SelectBox>
        </Field>
      </Column>
      <Column title="Additional requests">
        <Field label="Notes">
          <textarea
            className="w-full rounded-2xl bg-white px-4 py-3 text-[15px] text-[#0A1626] outline-none"
            style={{ border: "1px solid #E4DED2", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
            rows={4}
            placeholder="Tell us more about your group…"
          />
        </Field>
      </Column>
    </div>
  );
}

function StepDetails() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Column title="Your Details">
        <Field label="Full Name">
          <InputBox placeholder="Ola Nordmann" />
        </Field>
        <Field label="Email">
          <InputBox placeholder="you@example.com" type="email" />
        </Field>
      </Column>
      <Column title="Company">
        <Field label="Company Name">
          <InputBox placeholder="Optional" />
        </Field>
        <Field label="Phone">
          <InputBox placeholder="+47 000 00 000" type="tel" />
        </Field>
      </Column>
    </div>
  );
}

/* ---------- Primitives ---------- */

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5">
      <h3 className="text-[17px] font-semibold text-[#0A1626]">{title}</h3>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[13px] font-medium text-[#5B6472]">{label}</span>
      {children}
    </label>
  );
}

function SelectBox({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div
      className="flex h-[52px] w-full items-center justify-between rounded-2xl bg-white px-4 cursor-pointer transition-shadow hover:shadow-md"
      style={{ border: "1px solid #E4DED2", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
    >
      <span className="flex items-center gap-2 min-w-0">{children}</span>
      <span className="flex items-center gap-2 shrink-0">
        {icon}
        <ChevronDown size={18} strokeWidth={1.6} className="text-[#5B6472]" />
      </span>
    </div>
  );
}

function InputBox({
  placeholder,
  type = "text",
}: {
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="h-[52px] w-full rounded-2xl bg-white px-4 text-[15px] text-[#0A1626] outline-none placeholder:text-[#9AA3AF]"
      style={{ border: "1px solid #E4DED2", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
    />
  );
}

function FlagNO() {
  return (
    <span
      className="inline-flex h-5 w-7 shrink-0 overflow-hidden rounded-[3px]"
      aria-label="Norway"
      style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06)" }}
    >
      <svg viewBox="0 0 28 20" width="28" height="20" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="20" fill="#BA0C2F" />
        <rect x="8" width="4" height="20" fill="#FFFFFF" />
        <rect y="8" width="28" height="4" fill="#FFFFFF" />
        <rect x="9" width="2" height="20" fill="#00205B" />
        <rect y="9" width="28" height="2" fill="#00205B" />
      </svg>
    </span>
  );
}

/* ---------- Continue Button ---------- */

function ContinueButton({
  onClick,
  label = "Continue",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="continue-btn group relative flex h-[66px] w-full items-center justify-center gap-5 rounded-[18px] px-8 text-[17px] font-semibold transition-all duration-200 ease-out"
      style={{
        backgroundColor: "#081828",
        color: GOLD,
        border: `1px solid ${GOLD}`,
        boxShadow:
          "0 12px 40px -12px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,194,90,0.12), 0 0 24px -8px rgba(245,194,90,0.35)",
      }}
    >
      <span>{label}</span>
      <ArrowRight
        size={22}
        strokeWidth={1.8}
        className="transition-transform duration-200 ease-out group-hover:translate-x-1"
      />
      <style>{`
        .continue-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 18px 50px -14px rgba(0,0,0,0.6),
            0 0 0 1px rgba(245,194,90,0.22),
            0 0 36px -6px rgba(245,194,90,0.55);
          background-color: #0A1E32;
        }
      `}</style>
    </button>
  );
}

/* ---------- Background particles ---------- */

function GoldParticles() {
  // Deterministic sparse particles around edges only
  const particles = [
    { top: "4%", left: "3%", size: 2, opacity: 0.35 },
    { top: "8%", left: "9%", size: 1, opacity: 0.25 },
    { top: "18%", left: "2%", size: 1.5, opacity: 0.3 },
    { top: "32%", left: "5%", size: 1, opacity: 0.2 },
    { top: "48%", left: "1.5%", size: 2, opacity: 0.35 },
    { top: "64%", left: "4%", size: 1, opacity: 0.25 },
    { top: "80%", left: "7%", size: 1.5, opacity: 0.3 },
    { top: "92%", left: "3%", size: 1, opacity: 0.2 },
    { top: "6%", right: "4%", size: 1.5, opacity: 0.3 },
    { top: "14%", right: "1.5%", size: 1, opacity: 0.25 },
    { top: "28%", right: "6%", size: 2, opacity: 0.35 },
    { top: "44%", right: "2%", size: 1, opacity: 0.2 },
    { top: "60%", right: "5%", size: 1.5, opacity: 0.3 },
    { top: "76%", right: "2.5%", size: 1, opacity: 0.25 },
    { top: "88%", right: "6%", size: 2, opacity: 0.35 },
    { top: "2%", left: "38%", size: 1, opacity: 0.2 },
    { top: "3%", left: "62%", size: 1.5, opacity: 0.25 },
    { top: "96%", left: "42%", size: 1, opacity: 0.2 },
    { top: "97%", left: "68%", size: 1.5, opacity: 0.25 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: p.left as string | undefined,
            right: (p as { right?: string }).right,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: GOLD,
            opacity: p.opacity,
            boxShadow: `0 0 6px rgba(245,194,90,${p.opacity * 0.8})`,
          }}
        />
      ))}
    </div>
  );
}
