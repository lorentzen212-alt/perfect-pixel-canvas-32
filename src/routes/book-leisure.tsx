import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, MapPin, Building2, User, Calendar, Lock, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/book-leisure")({
  component: BookLeisure,
  head: () => ({
    meta: [
      { title: "Book Leisure — HotelGroupBook" },
      { name: "description", content: "Request group hotel offers for leisure travel." },
    ],
  }),
});

const SERIF = '"Cormorant Garamond", Georgia, serif';
const GOLD = "#F2C14E";
const NAVY_BG = "#071321";
const CARD_BG = "#0B1B2C";
const DARK_BUTTON = "#0A1728";

type StepId = 1 | 2 | 3;

const STEPS: { id: StepId; title: string; sub: string; Icon: typeof MapPin }[] = [
  { id: 1, title: "Your Trip", sub: "Where and when", Icon: MapPin },
  { id: 2, title: "Requests", sub: "What you need", Icon: Building2 },
  { id: 3, title: "Your Details", sub: "Who to contact", Icon: User },
];

function BookLeisure() {
  const [step, setStep] = useState<StepId>(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  const goTo = (next: StepId) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: NAVY_BG, fontFamily: '"Inter", system-ui, sans-serif' }}
    >
      {/* Gold particle edges */}
      <GoldParticles />

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col px-4 py-8 lg:px-10 lg:py-12">
        <div
          className="relative flex flex-1 overflow-hidden rounded-[28px] border"
          style={{
            borderColor: "rgba(242, 193, 78, 0.22)",
            backgroundColor: "rgba(7, 19, 33, 0.6)",
            boxShadow: "0 40px 120px -30px rgba(0,0,0,0.7)",
          }}
        >
          {/* Sidebar */}
          <aside
            className="hidden lg:flex w-[300px] flex-col px-8 py-10"
            style={{ backgroundColor: "rgba(6, 15, 27, 0.55)" }}
          >
            <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm text-white/85 hover:text-white transition">
              <ArrowLeft size={16} /> Back
            </Link>
            <SidebarSteps activeStep={step} />
          </aside>

          {/* Right content */}
          <section className="flex-1 min-w-0 px-6 py-8 lg:px-14 lg:py-12">
            <div className="flex items-start justify-between gap-6">
              <div>
                <Link
                  to="/"
                  className="lg:hidden inline-flex items-center gap-2 text-sm text-white/85 hover:text-white transition mb-4"
                >
                  <ArrowLeft size={16} /> Back
                </Link>
                <h1
                  className="text-white text-4xl lg:text-[52px] leading-[1.05] font-medium"
                  style={{ fontFamily: SERIF }}
                >
                  Book Leisure
                </h1>
                <p className="mt-3 text-[15px] text-white/70 max-w-xl">
                  Tell us about your group and we'll find the best hotel offers for you.
                </p>
              </div>
              <TopProgress activeStep={step} />
            </div>

            {/* White card */}
            <div
              className="relative mt-10 rounded-[22px] bg-[#F7F5F1] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div
                key={step}
                className="p-6 lg:p-10"
                style={{
                  animation: `slide-${direction === 1 ? "in-right" : "in-left"} 350ms ease-out`,
                }}
              >
                {step === 1 && <StepOne onContinue={() => goTo(2)} />}
                {step === 2 && <StepTwo onBack={() => goTo(1)} onContinue={() => goTo(3)} />}
                {step === 3 && <StepThree onBack={() => goTo(2)} />}
              </div>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          0% { opacity: 0; transform: translateX(-40px); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </main>
  );
}

function SidebarSteps({ activeStep }: { activeStep: StepId }) {
  return (
    <ol className="relative flex flex-col gap-2">
      {STEPS.map((s, i) => {
        const isActive = s.id === activeStep;
        const isDone = s.id < activeStep;
        return (
          <li key={s.id} className="relative">
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className="absolute left-[22px] top-[52px] h-[70px] w-px"
                style={{
                  backgroundImage: `linear-gradient(to bottom, ${GOLD} 50%, transparent 50%)`,
                  backgroundSize: "1px 6px",
                  backgroundRepeat: "repeat-y",
                  opacity: isDone || isActive ? 0.7 : 0.25,
                }}
              />
            )}
            <div
              className={`flex items-center gap-4 rounded-2xl px-4 py-4 transition ${
                isActive ? "" : ""
              }`}
              style={{
                backgroundColor: isActive ? "rgba(242, 193, 78, 0.06)" : "transparent",
                border: isActive ? `1px solid rgba(242,193,78,0.25)` : "1px solid transparent",
              }}
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-medium"
                style={{
                  backgroundColor: isActive ? GOLD : "transparent",
                  color: isActive ? "#0A1728" : "rgba(255,255,255,0.6)",
                  border: isActive ? "none" : "1.5px solid rgba(255,255,255,0.25)",
                }}
              >
                {s.id}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <s.Icon size={16} style={{ color: isActive ? GOLD : "rgba(255,255,255,0.55)" }} />
                  <span
                    className="text-[15px] font-medium"
                    style={{ color: isActive ? GOLD : "rgba(255,255,255,0.85)" }}
                  >
                    {s.title}
                  </span>
                </div>
                <div className="mt-0.5 text-[12.5px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {s.sub}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function TopProgress({ activeStep }: { activeStep: StepId }) {
  return (
    <div className="hidden md:flex items-center gap-2 shrink-0">
      {[1, 2, 3].map((n, i) => {
        const active = n === activeStep;
        const done = n < activeStep;
        return (
          <div key={n} className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-medium transition"
              style={{
                backgroundColor: active ? GOLD : "transparent",
                color: active ? "#0A1728" : done ? GOLD : "rgba(255,255,255,0.6)",
                border: active ? "none" : `1.5px solid ${done ? GOLD : "rgba(255,255,255,0.28)"}`,
              }}
            >
              {n}
            </div>
            {i < 2 && (
              <span
                className="h-px w-8"
                style={{ backgroundColor: done ? GOLD : "rgba(255,255,255,0.22)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Form UI ---------- */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-[13px] font-medium text-[#1a1a1a]/70 mb-2">{children}</label>;
}

function SelectInput({
  value,
  onChange,
  children,
  leftIcon,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">{leftIcon}</div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-xl border border-black/10 bg-white ${
          leftIcon ? "pl-10" : "pl-4"
        } pr-10 py-3.5 text-[15px] text-[#0A1728] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F2C14E]/60`}
      >
        {children}
      </select>
      <ChevronDown
        size={18}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black/50"
      />
    </div>
  );
}

function DateInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-black/10 bg-white pl-4 pr-10 py-3.5 text-[15px] text-[#0A1728] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F2C14E]/60"
      />
      <Calendar size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: GOLD }} />
    </div>
  );
}

function ColumnHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[19px] font-semibold text-[#0A1728] mb-5" style={{ fontFamily: '"Inter", system-ui' }}>
      {children}
    </h3>
  );
}

function ContinueButton({ onClick, label = "Continue" }: { onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      className="group relative mt-8 w-full rounded-xl py-5 text-[16px] font-medium transition-all duration-200 ease-out hover:-translate-y-[2px]"
      style={{
        backgroundColor: DARK_BUTTON,
        color: GOLD,
        border: "1px solid rgba(242,193,78,0.35)",
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.4)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(242,193,78,0.35), 0 0 0 1px rgba(242,193,78,0.45)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(0,0,0,0.4)";
      }}
    >
      <span className="inline-flex items-center gap-3">
        {label}
        <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </button>
  );
}

function BottomNote() {
  return (
    <div className="mt-5 flex items-center justify-center gap-2 text-[13px] text-[#0A1728]/70">
      <Lock size={14} />
      <span>It's free and without obligation.</span>
    </div>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-4 inline-flex items-center gap-2 text-sm text-[#0A1728]/70 hover:text-[#0A1728] transition"
    >
      <ArrowLeft size={16} /> Back
    </button>
  );
}

/* ---------- Steps ---------- */

function StepOne({ onContinue }: { onContinue: () => void }) {
  const [country, setCountry] = useState("Norway");
  const [city, setCity] = useState("Bergen");
  const [arrival, setArrival] = useState("2025-05-15");
  const [departure, setDeparture] = useState("2025-05-18");
  const [guests, setGuests] = useState("25");
  const [rooms, setRooms] = useState("12");

  return (
    <div>
      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <ColumnHeader>Where are you going?</ColumnHeader>
          <div className="space-y-5">
            <div>
              <FieldLabel>Country</FieldLabel>
              <SelectInput value={country} onChange={setCountry}>
                <option>Norway</option>
                <option>Sweden</option>
                <option>Denmark</option>
                <option>Finland</option>
                <option>Iceland</option>
              </SelectInput>
            </div>
            <div>
              <FieldLabel>City</FieldLabel>
              <SelectInput value={city} onChange={setCity}>
                <option>Bergen</option>
                <option>Oslo</option>
                <option>Trondheim</option>
                <option>Stavanger</option>
                <option>Tromsø</option>
              </SelectInput>
            </div>
          </div>
        </div>

        <div>
          <ColumnHeader>When are you arriving?</ColumnHeader>
          <div className="space-y-5">
            <div>
              <FieldLabel>Arrival Date</FieldLabel>
              <DateInput value={arrival} onChange={setArrival} />
            </div>
            <div>
              <FieldLabel>Departure Date</FieldLabel>
              <DateInput value={departure} onChange={setDeparture} />
            </div>
          </div>
        </div>

        <div>
          <ColumnHeader>How many are you?</ColumnHeader>
          <div className="space-y-5">
            <div>
              <FieldLabel>Number of Guests</FieldLabel>
              <SelectInput value={guests} onChange={setGuests}>
                {[10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Number of Rooms</FieldLabel>
              <SelectInput value={rooms} onChange={setRooms}>
                {[5, 8, 10, 12, 15, 20, 25, 30, 40, 50, 75, 100].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </SelectInput>
            </div>
          </div>
        </div>
      </div>

      <ContinueButton onClick={onContinue} />
      <BottomNote />
    </div>
  );
}

function StepTwo({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  const [notes, setNotes] = useState("");
  const [meals, setMeals] = useState("Breakfast");
  const [rating, setRating] = useState("4 stars");

  return (
    <div>
      <BackLink onClick={onBack} />
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <ColumnHeader>What do you need?</ColumnHeader>
          <div className="space-y-5">
            <div>
              <FieldLabel>Preferred Hotel Rating</FieldLabel>
              <SelectInput value={rating} onChange={setRating}>
                <option>3 stars</option>
                <option>4 stars</option>
                <option>5 stars</option>
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Meals Included</FieldLabel>
              <SelectInput value={meals} onChange={setMeals}>
                <option>Room only</option>
                <option>Breakfast</option>
                <option>Half board</option>
                <option>Full board</option>
              </SelectInput>
            </div>
          </div>
        </div>
        <div>
          <ColumnHeader>Special requests</ColumnHeader>
          <FieldLabel>Anything else we should know?</FieldLabel>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
            placeholder="Accessibility needs, room preferences, transportation, etc."
            className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] text-[#0A1728] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F2C14E]/60"
          />
        </div>
      </div>

      <ContinueButton onClick={onContinue} />
      <BottomNote />
    </div>
  );
}

function StepThree({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="py-10 text-center">
        <h3 className="text-3xl text-[#0A1728]" style={{ fontFamily: SERIF }}>
          Thank you!
        </h3>
        <p className="mt-3 text-[#0A1728]/70">
          We've received your request and will get back to you shortly with the best hotel offers.
        </p>
      </div>
    );
  }

  return (
    <div>
      <BackLink onClick={onBack} />
      <ColumnHeader>Who should we contact?</ColumnHeader>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <FieldLabel>Full Name</FieldLabel>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-[15px] text-[#0A1728] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F2C14E]/60"
          />
        </div>
        <div>
          <FieldLabel>Company (optional)</FieldLabel>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-[15px] text-[#0A1728] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F2C14E]/60"
          />
        </div>
        <div>
          <FieldLabel>Email</FieldLabel>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-[15px] text-[#0A1728] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F2C14E]/60"
          />
        </div>
        <div>
          <FieldLabel>Phone</FieldLabel>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-[15px] text-[#0A1728] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F2C14E]/60"
          />
        </div>
      </div>

      <ContinueButton onClick={() => setSubmitted(true)} label="Submit Request" />
      <BottomNote />
    </div>
  );
}

/* ---------- Decorative gold particles on edges ---------- */

function GoldParticles() {
  const dots = Array.from({ length: 60 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((_, i) => {
        const onLeft = i % 2 === 0;
        const x = onLeft ? Math.random() * 6 : 94 + Math.random() * 6;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 0.5;
        const opacity = Math.random() * 0.5 + 0.15;
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: GOLD,
              opacity,
              boxShadow: `0 0 ${size * 3}px rgba(242,193,78,${opacity})`,
            }}
          />
        );
      })}
    </div>
  );
}
