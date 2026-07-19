import { createFileRoute, Link } from "@tanstack/react-router";
import type React from "react";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Menu,
  X,
  ShieldCheck,
  Clock,
  Headphones,
  Lock,
  Calendar as CalendarIcon,
  Phone,
  Mail,
  ArrowRight,
  ChevronDown,
  Users,
  Search,
  Building2,
  Waves,
  Plane,
  Palmtree,
  Landmark,
  Gem,
  Ban,
  Globe,
  Star,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/hotelgroupbook-logo.png.asset.json";
import heroImg from "@/assets/me-hero.jpg";
import osloImg from "@/assets/destinations/oslo.jpg";
import bergenImg from "@/assets/destinations/bergen.jpg";
import tromsoImg from "@/assets/destinations/tromso.jpg";
import stavangerImg from "@/assets/destinations/stavanger.jpg";
import trondheimImg from "@/assets/destinations/trondheim.jpg";
import bodoImg from "@/assets/destinations/bodo.jpg";
import lofotenImg from "@/assets/destinations/lofoten.jpg";
import stockholmImg from "@/assets/destinations/stockholm.jpg";
import gothenburgImg from "@/assets/destinations/gothenburg.jpg";
import malmoImg from "@/assets/destinations/malmo.jpg";
import uppsalaImg from "@/assets/destinations/uppsala.jpg";
import kirunaImg from "@/assets/destinations/kiruna.jpg";
import visbyImg from "@/assets/destinations/visby.jpg";
import areImg from "@/assets/destinations/are.jpg";
import copenhagenImg from "@/assets/destinations/copenhagen.jpg";
import aarhusImg from "@/assets/destinations/aarhus.jpg";
import odenseImg from "@/assets/destinations/odense.jpg";
import aalborgImg from "@/assets/destinations/aalborg.jpg";
import roskildeImg from "@/assets/destinations/roskilde.jpg";
import skagenImg from "@/assets/destinations/skagen.jpg";
import billundImg from "@/assets/destinations/billund.jpg";
import helsinkiImg from "@/assets/destinations/helsinki.jpg";
import tampereImg from "@/assets/destinations/tampere.jpg";
import turkuImg from "@/assets/destinations/turku.jpg";
import rovaniemiImg from "@/assets/destinations/rovaniemi.jpg";
import ouluImg from "@/assets/destinations/oulu.jpg";
import porvooImg from "@/assets/destinations/porvoo.jpg";
import leviImg from "@/assets/destinations/levi.jpg";


export const Route = createFileRoute("/book-meetings-events")({
  component: BookMeetingsEvents,
  head: () => ({
    meta: [
      { title: "Book Meetings & Events — HotelGroupBook" },
      {
        name: "description",
        content:
          "Request offers for meetings, conferences and events. Our M&E specialists find the best hotels and handle all communication for you.",
      },
      { property: "og:title", content: "Book Meetings & Events — HotelGroupBook" },
      {
        property: "og:description",
        content: "Premium group hotel booking for meetings, conferences and events.",
      },
    ],
  }),
});

const SERIF = '"Cormorant Garamond", Georgia, serif';
const GOLD = "#F5C25A";
const NAVY = "#0A1B2C";
const NAVY_DEEP = "#04111A";

const NAV_LINKS = [
  { label: "Home", to: "/" as const },
  { label: "About us", href: "/#about" },
  { label: "How it works", href: "/#how" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Contact", href: "/#contact" },
];

const TRUST = [
  { Icon: ShieldCheck, label: "No commitment" },
  { Icon: Clock, label: "Fast and free" },
  { Icon: Headphones, label: "Expert support" },
  { Icon: Lock, label: "Secure & trusted" },
];

const STEPS = [
  "Event Details",
  "Location",
  "Accommodation",
  "Meeting Spaces",
  "Catering",
  "Extras",
  "Review & Submit",
];

type FormState = {
  eventName: string;
  company: string;
  contactPerson: string;
  email: string;
  phone: string;
  countryCode: string;
};

function BookMeetingsEvents() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    eventName: "",
    company: "",
    contactPerson: "",
    email: "",
    phone: "",
    countryCode: "+47",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const go = (n: number) => {
    setDirection(n > step ? "forward" : "back");
    setStep(n);
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.eventName.trim()) e.eventName = "Required";
    if (!form.company.trim()) e.company = "Required";
    if (!form.contactPerson.trim()) e.contactPerson = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Invalid email";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step < STEPS.length) go(step + 1);
  };

  return (
    <main
      className="relative min-h-screen w-full"
      style={{ backgroundColor: "#F7F7F5" }}
    >
      {/* HERO */}
      <section
        className="relative w-full"
        style={{
          backgroundColor: NAVY_DEEP,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Left dark gradient for text legibility */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(4,17,26,0.92) 0%, rgba(4,17,26,0.78) 35%, rgba(4,17,26,0.35) 60%, rgba(4,17,26,0.05) 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/60 to-transparent" />

        <div className="relative z-20">
          {/* HEADER */}
          <header className="flex h-[88px] items-center justify-between px-5 sm:px-8 lg:px-[50px] xl:px-[60px]">
            <Link to="/" aria-label="HotelGroupBook" className="flex items-center">
              <img
                src={logoAsset.url}
                alt="HotelGroupBook"
                className="h-[46px] sm:h-[56px] lg:h-[68px] w-auto"
              />
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

            <nav className="hidden lg:flex items-center gap-9">
              {NAV_LINKS.map((l) =>
                "to" in l ? (
                  <Link
                    key={l.label}
                    to={l.to}
                    className="text-white text-[17px] transition-colors hover:text-[#F5C25A]"
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    className="text-white text-[17px] transition-colors hover:text-[#F5C25A]"
                  >
                    {l.label}
                  </a>
                ),
              )}
              <Link
                to="/manage-bookings"
                className="inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-[16px] transition-colors"
                style={{ borderColor: GOLD, color: GOLD }}
              >
                <CalendarIcon size={17} strokeWidth={1.8} />
                Manage Bookings
              </Link>
            </nav>
          </header>

          {mobileOpen && (
            <nav className="lg:hidden mx-5 sm:mx-8 flex flex-col gap-3 rounded-xl bg-[rgba(2,18,29,0.92)] p-4">
              {NAV_LINKS.map((l) =>
                "to" in l ? (
                  <Link key={l.label} to={l.to} className="text-white text-base">
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={l.href} className="text-white text-base">
                    {l.label}
                  </a>
                ),
              )}
              <Link
                to="/manage-bookings"
                className="mt-1 rounded-md border px-4 py-2 text-white self-start"
                style={{ borderColor: GOLD }}
              >
                Manage Bookings
              </Link>
            </nav>
          )}

          {/* HERO CONTENT */}
          <div className="px-5 sm:px-8 lg:px-[50px] xl:px-[60px] pt-8 pb-14 lg:pt-12 lg:pb-20">
            <div className="max-w-[720px]">
              <h1
                className="text-white text-5xl sm:text-6xl lg:text-[72px] leading-[1.03] font-medium"
                style={{ fontFamily: SERIF }}
              >
                Book Meetings &amp; Events
              </h1>
              <p className="mt-6 text-white/90 text-lg lg:text-[19px] leading-[1.55] max-w-[560px]">
                Request offers for meetings, conferences and events.
                <br />
                Our M&amp;E specialists will find the best hotels
                <br className="hidden sm:block" />
                and handle all communication for you.
              </p>

              {/* Trust row */}
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
                {TRUST.map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border"
                      style={{ borderColor: "rgba(245,194,90,0.55)" }}
                    >
                      <Icon size={16} strokeWidth={1.8} style={{ color: GOLD }} />
                    </span>
                    <span className="text-white text-[15px]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div
            className="relative px-5 sm:px-8 lg:px-[50px] xl:px-[60px] pb-10"
          >
            <StepProgress step={step} onGo={go} />
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="px-5 sm:px-8 lg:px-[50px] xl:px-[60px] py-10 lg:py-14">
        <div className="mx-auto max-w-[1400px]">
          <div
            className="overflow-hidden rounded-[20px]"
            style={{
              backgroundColor: "#FCFCFC",
              backgroundImage:
                "linear-gradient(180deg, #FFFFFF 0%, #FCFCFC 60%, #FAFAF8 100%)",
              boxShadow:
                "0 40px 80px -50px rgba(10,27,44,0.18), 0 12px 32px -20px rgba(10,27,44,0.08), 0 2px 4px -2px rgba(10,27,44,0.04)",
              border: "1px solid #ECECEC",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
              <div className="p-6 sm:p-10 lg:p-12">
                <div
                  key={step}
                  className={
                    direction === "forward"
                      ? "animate-slide-in-right"
                      : "animate-slide-in-left"
                  }
                >
                  {step === 1 && (
                    <StepOne form={form} setForm={setForm} errors={errors} onNext={handleNext} />
                  )}
                  {step === 2 && (
                    <StepTwoLocation
                      onBack={() => go(1)}
                      onNext={handleNext}
                    />
                  )}
                  {step > 2 && (
                    <StepPlaceholder
                      step={step}
                      title={STEPS[step - 1]}
                      onBack={() => go(step - 1)}
                      onNext={handleNext}
                      isLast={step === STEPS.length}
                    />
                  )}

                </div>
              </div>

              {/* Help card */}
              <div
                className="p-8 lg:p-10 lg:pl-8"
                style={{
                  backgroundColor: "transparent",
                  borderLeft: "1px solid #F1F1EE",
                }}
              >
                <div
                  className="rounded-[16px] p-6"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #EFEFEC",
                    boxShadow:
                      "0 12px 30px -20px rgba(10,27,44,0.10), 0 2px 6px -2px rgba(10,27,44,0.04)",
                  }}
                >
                  <HelpCard />
                </div>
              </div>
            </div>
          </div>


          {/* Credibility */}
          <div
            className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start md:items-center px-8 md:px-12 py-8 md:py-10 rounded-[20px]"
            style={{
              backgroundColor: "#FCFCFC",
              backgroundImage:
                "linear-gradient(180deg, #FFFFFF 0%, #FAFAF8 100%)",
              border: "1px solid #EFEFEC",
              boxShadow:
                "0 20px 50px -30px rgba(10,27,44,0.10), 0 2px 6px -2px rgba(10,27,44,0.03)",
            }}
          >
            <div className="flex items-start gap-4">
              <span
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "#FAF3E1" }}
              >
                <Users size={22} strokeWidth={1.75} style={{ color: "#B88A2E" }} />
              </span>
              <p className="text-[#1F2A36] text-[17px] leading-relaxed">
                <span className="font-semibold" style={{ fontFamily: SERIF }}>
                  Built by group booking professionals
                </span>
                <br />
                with experience from{" "}
                <span className="font-semibold" style={{ color: "#B88A2E" }}>
                  10,000+ groups.
                </span>
              </p>
            </div>
            <div className="md:pl-10 md:border-l" style={{ borderColor: "#F1F1EE" }}>
              <p className="text-[#3B4A56] text-[16px] leading-relaxed">
                We know group travel – and we make
                <br />
                hotel bookings for groups simple.
              </p>
            </div>
          </div>

        </div>
      </section>

      <style>{`
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-in-left { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in-right { animation: slide-in-right 300ms ease-out; }
        .animate-slide-in-left { animation: slide-in-left 300ms ease-out; }
      `}</style>
    </main>
  );
}

/* --------- Step Progress --------- */

function StepProgress({ step, onGo }: { step: number; onGo: (n: number) => void }) {
  const total = STEPS.length;
  // Circle centers are at (2k-1)/(2*total) of the container width (each button = flex-1).
  const centerOffset = `calc(100% / ${2 * total})`;
  const goldWidth = `calc((100% / ${total}) * ${step - 1})`;
  // Active circle is 40px; inactive/completed 36px. Line sits at y=20 (active center).
  const ROW_H = 40;
  const LINE_TOP = ROW_H / 2; // 20

  return (
    <div className="relative">
      <div className="relative flex items-start justify-between gap-2">
        {/* Grey base line spanning first→last circle center */}
        <div
          aria-hidden
          className="pointer-events-none absolute h-px"
          style={{
            top: LINE_TOP,
            left: centerOffset,
            right: centerOffset,
            backgroundColor: "rgba(255,255,255,0.18)",
          }}
        />
        {/* Gold progress line from first circle center to active circle center */}
        <div
          aria-hidden
          className="pointer-events-none absolute h-px transition-[width] duration-300 ease-out"
          style={{
            top: LINE_TOP,
            left: centerOffset,
            width: goldWidth,
            background: `linear-gradient(90deg, ${GOLD} 0%, #FFD97A 100%)`,
            boxShadow: `0 0 12px rgba(245,194,90,0.55)`,
          }}
        />

        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const completed = n < step;
          const size = active ? 40 : 36;
          return (
            <button
              key={label}
              type="button"
              onClick={() => (completed ? onGo(n) : undefined)}
              className="relative z-10 flex flex-col items-center gap-2 flex-1 min-w-0"
              style={{ cursor: completed ? "pointer" : "default" }}
            >
              {/* Fixed-height slot centers every circle on the same y */}
              <span
                className="flex items-center justify-center"
                style={{ height: ROW_H }}
              >
                <span
                  className="flex items-center justify-center rounded-full text-[13px] font-semibold transition-all duration-300 ease-out"
                  style={{
                    width: size,
                    height: size,
                    background: active
                      ? "radial-gradient(circle at 30% 30%, #FFE29A 0%, #F5C24E 45%, #C89A3A 100%)"
                      : completed
                        ? "linear-gradient(180deg, #0F2A47 0%, #0A1B2C 100%)"
                        : "rgba(4,17,26,0.85)",
                    color: active ? "#FFFFFF" : "#FFFFFF",
                    border: active
                      ? "1px solid rgba(255,215,140,0.9)"
                      : completed
                        ? `1px solid ${GOLD}`
                        : "1px solid rgba(255,255,255,0.55)",
                    boxShadow: active
                      ? "0 0 0 6px rgba(245,194,90,0.10), 0 0 22px rgba(245,194,90,0.55), 0 6px 14px -4px rgba(200,154,58,0.55), inset 0 1px 0 rgba(255,255,255,0.55)"
                      : completed
                        ? "0 6px 14px -8px rgba(10,27,44,0.55), inset 0 1px 0 rgba(255,255,255,0.06)"
                        : "none",
                  }}
                >
                  {completed ? (
                    <Check
                      size={16}
                      strokeWidth={2.6}
                      style={{ color: GOLD }}
                      className="animate-scale-in"
                    />
                  ) : (
                    <span
                      className="transition-opacity duration-300"
                      style={{
                        textShadow: active
                          ? "0 1px 2px rgba(120,80,10,0.35)"
                          : undefined,
                      }}
                    >
                      {n}
                    </span>
                  )}
                </span>
              </span>
              <span
                className="text-[13px] lg:text-[14px] font-medium text-center whitespace-nowrap transition-colors duration-300"
                style={{
                  color: active
                    ? GOLD
                    : completed
                      ? "rgba(255,255,255,0.95)"
                      : "rgba(255,255,255,0.75)",
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


/* --------- Step 1 --------- */

function StepOne({
  form,
  setForm,
  errors,
  onNext,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, string>;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="flex items-start gap-5">
        <span
          className="hidden sm:inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "#F5EFE1" }}
        >
          <CalendarIcon size={24} strokeWidth={1.75} style={{ color: "#B88A2E" }} />
        </span>
        <div>
          <h2
            className="text-[#0A1B2C] text-3xl lg:text-[34px] leading-tight"
            style={{ fontFamily: SERIF }}
          >
            Step 1 – Event Details
          </h2>
          <div className="mt-2 h-[2px] w-16" style={{ backgroundColor: GOLD }} />
          <p className="mt-4 text-[#4A5866] text-[15px] max-w-xs leading-relaxed">
            Please provide basic information
            <br />
            about your event.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        <Field
          label="Event name"
          required
          value={form.eventName}
          onChange={(v) => setForm((s) => ({ ...s, eventName: v }))}
          placeholder="Enter event name"
          error={errors.eventName}
        />
        <Field
          label="Company / Organization"
          required
          value={form.company}
          onChange={(v) => setForm((s) => ({ ...s, company: v }))}
          placeholder="Enter company / organization"
          error={errors.company}
        />
        <Field
          label="Contact person"
          required
          value={form.contactPerson}
          onChange={(v) => setForm((s) => ({ ...s, contactPerson: v }))}
          placeholder="Enter contact person"
          error={errors.contactPerson}
        />
        <Field
          label="Email"
          required
          type="email"
          value={form.email}
          onChange={(v) => setForm((s) => ({ ...s, email: v }))}
          placeholder="Enter email address"
          error={errors.email}
        />
        <div>
          <label className="block text-[14px] font-semibold text-[#0A1B2C]">
            Phone <span style={{ color: "#D64545" }}>*</span>
          </label>
          <div className="mt-2 flex gap-2">
            <div
              className="flex items-center gap-2 rounded-md border px-3 h-[46px] bg-white"
              style={{ borderColor: errors.phone ? "#D64545" : "#D9D3C4" }}
            >
              <FlagNO />
              <span className="text-[15px] text-[#0A1B2C]">{form.countryCode}</span>
              <ChevronDown size={16} className="text-[#4A5866]" />
            </div>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))}
              placeholder="123 45 678"
              className="flex-1 rounded-md border px-4 h-[46px] text-[15px] text-[#0A1B2C] outline-none focus:border-[#B88A2E] bg-white"
              style={{ borderColor: errors.phone ? "#D64545" : "#D9D3C4" }}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-[12px]" style={{ color: "#D64545" }}>
              {errors.phone}
            </p>
          )}
        </div>

        <div className="flex items-end justify-end">
          <NextButton onClick={onNext} label="Next Step" />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[14px] font-semibold text-[#0A1B2C]">
        {label} {required && <span style={{ color: "#D64545" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border px-4 h-[46px] text-[15px] text-[#0A1B2C] outline-none focus:border-[#B88A2E] bg-white transition-colors"
        style={{ borderColor: error ? "#D64545" : "#D9D3C4" }}
      />
      {error && (
        <p className="mt-1 text-[12px]" style={{ color: "#D64545" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function NextButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group inline-flex items-center justify-center gap-2 rounded-md text-[16px] font-semibold text-[#0A1B2C] transition-all duration-200 hover:brightness-105 hover:-translate-y-[1px]"
      style={{
        height: 52,
        minWidth: 220,
        background: `linear-gradient(180deg, #F7D07A 0%, ${GOLD} 55%, #C89A3A 100%)`,
        boxShadow:
          "0 18px 40px -18px rgba(200,154,58,0.55), 0 4px 10px -4px rgba(200,154,58,0.35), inset 0 1px 0 rgba(255,255,255,0.5)",
        border: "1px solid rgba(184,138,46,0.45)",
      }}
    >
      {label}
      <ArrowRight size={18} strokeWidth={2.2} className="transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

/* --------- Placeholder for later steps --------- */

function StepPlaceholder({
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

function HelpCard() {
  return (
    <div className="min-w-0">
      <h3
        className="text-[#0A1B2C] text-[26px] leading-tight"
        style={{ fontFamily: SERIF }}
      >
        Need help?
      </h3>
      <p className="mt-3 text-[#4A5866] text-[15px] leading-relaxed">
        Our M&amp;E specialists are ready to assist you.
      </p>
      <div className="mt-6 flex flex-col gap-4">
        <a
          href="tel:+4721002100"
          className="flex items-center gap-3 min-w-0 text-[#0A1B2C] text-[15px] hover:text-[#B88A2E] transition-colors"
        >
          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
            style={{ borderColor: "rgba(184,138,46,0.4)" }}
          >
            <Phone size={16} strokeWidth={1.8} style={{ color: "#B88A2E" }} />
          </span>
          <span className="min-w-0 break-all">+47 21 00 21 00</span>
        </a>
        <a
          href="mailto:meetings@hotelgroupbook.com"
          className="flex items-center gap-3 min-w-0 text-[#0A1B2C] text-[15px] hover:text-[#B88A2E] transition-colors"
        >
          <span
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
            style={{ borderColor: "rgba(184,138,46,0.4)" }}
          >
            <Mail size={16} strokeWidth={1.8} style={{ color: "#B88A2E" }} />
          </span>
          <span className="min-w-0 break-all">meetings@hotelgroupbook.com</span>
        </a>
      </div>
    </div>
  );
}


function FlagNO() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <rect width="20" height="14" fill="#BA0C2F" />
      <rect x="6" width="2" height="14" fill="#FFF" />
      <rect y="6" width="20" height="2" fill="#FFF" />
      <rect x="6.5" width="1" height="14" fill="#00205B" />
      <rect y="6.5" width="20" height="1" fill="#00205B" />
    </svg>
  );
}

function FlagSE() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <rect width="20" height="14" fill="#005293" />
      <rect x="6" width="2" height="14" fill="#FECB00" />
      <rect y="6" width="20" height="2" fill="#FECB00" />
    </svg>
  );
}

function FlagDK() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <rect width="20" height="14" fill="#C8102E" />
      <rect x="6" width="2" height="14" fill="#FFF" />
      <rect y="6" width="20" height="2" fill="#FFF" />
    </svg>
  );
}

function FlagFI() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <rect width="20" height="14" fill="#FFF" />
      <rect x="6" width="2" height="14" fill="#003580" />
      <rect y="6" width="20" height="2" fill="#003580" />
    </svg>
  );
}

/* --------- Step 2: Location --------- */

type Destination = {
  id: string;
  name: string;
  image?: string;
  Icon: typeof Building2;
  anywhere?: boolean;
};

type CountryCode = "NO" | "SE" | "DK" | "FI";

const COUNTRIES: { code: CountryCode; name: string; Flag: () => React.ReactElement }[] = [
  { code: "NO", name: "Norway", Flag: FlagNO },
  { code: "SE", name: "Sweden", Flag: FlagSE },
  { code: "DK", name: "Denmark", Flag: FlagDK },
  { code: "FI", name: "Finland", Flag: FlagFI },
];

const DESTINATIONS_BY_COUNTRY: Record<CountryCode, Destination[]> = {
  NO: [
    { id: "oslo", name: "Oslo", image: osloImg, Icon: Building2 },
    { id: "bergen", name: "Bergen", image: bergenImg, Icon: Landmark },
    { id: "tromso", name: "Tromsø", image: tromsoImg, Icon: Plane },
    { id: "stavanger", name: "Stavanger", image: stavangerImg, Icon: Building2 },
    { id: "trondheim", name: "Trondheim", image: trondheimImg, Icon: Landmark },
    { id: "bodo", name: "Bodø", image: bodoImg, Icon: Building2 },
    { id: "lofoten", name: "Lofoten", image: lofotenImg, Icon: Waves },
    { id: "anywhere-NO", name: "Anywhere in Norway", Icon: Globe, anywhere: true },
  ],
  SE: [
    { id: "stockholm", name: "Stockholm", image: stockholmImg, Icon: Building2 },
    { id: "gothenburg", name: "Gothenburg", image: gothenburgImg, Icon: Waves },
    { id: "malmo", name: "Malmö", image: malmoImg, Icon: Building2 },
    { id: "uppsala", name: "Uppsala", image: uppsalaImg, Icon: Landmark },
    { id: "kiruna", name: "Kiruna", image: kirunaImg, Icon: Plane },
    { id: "visby", name: "Visby", image: visbyImg, Icon: Landmark },
    { id: "are", name: "Åre", image: areImg, Icon: Palmtree },
    { id: "anywhere-SE", name: "Anywhere in Sweden", Icon: Globe, anywhere: true },
  ],
  DK: [
    { id: "copenhagen", name: "Copenhagen", image: copenhagenImg, Icon: Building2 },
    { id: "aarhus", name: "Aarhus", image: aarhusImg, Icon: Waves },
    { id: "odense", name: "Odense", image: odenseImg, Icon: Landmark },
    { id: "aalborg", name: "Aalborg", image: aalborgImg, Icon: Building2 },
    { id: "roskilde", name: "Roskilde", image: roskildeImg, Icon: Landmark },
    { id: "skagen", name: "Skagen", image: skagenImg, Icon: Waves },
    { id: "billund", name: "Billund", image: billundImg, Icon: Plane },
    { id: "anywhere-DK", name: "Anywhere in Denmark", Icon: Globe, anywhere: true },
  ],
  FI: [
    { id: "helsinki", name: "Helsinki", image: helsinkiImg, Icon: Building2 },
    { id: "tampere", name: "Tampere", image: tampereImg, Icon: Landmark },
    { id: "turku", name: "Turku", image: turkuImg, Icon: Waves },
    { id: "rovaniemi", name: "Rovaniemi", image: rovaniemiImg, Icon: Plane },
    { id: "oulu", name: "Oulu", image: ouluImg, Icon: Building2 },
    { id: "porvoo", name: "Porvoo", image: porvooImg, Icon: Landmark },
    { id: "levi", name: "Levi", image: leviImg, Icon: Palmtree },
    { id: "anywhere-FI", name: "Anywhere in Finland", Icon: Globe, anywhere: true },
  ],
};

type SearchableDestination = {
  id: string;
  name: string;
  country: CountryCode;
  countryName: string;
};

const ALL_SEARCHABLE_DESTINATIONS: SearchableDestination[] = (Object.keys(
  DESTINATIONS_BY_COUNTRY,
) as CountryCode[]).flatMap((code) => {
  const country = COUNTRIES.find((c) => c.code === code)!;
  return DESTINATIONS_BY_COUNTRY[code]
    .filter((d) => !d.anywhere)
    .map((d) => ({
      id: d.id,
      name: d.name,
      country: code,
      countryName: country.name,
    }));
});

const HOTEL_CATEGORIES = [
  { id: "3", label: "★★★" },
  { id: "4", label: "★★★★" },
  { id: "5", label: "★★★★★" },
  { id: "none", label: "No preference" },
];

const HOTEL_STYLES = [
  { id: "city", label: "City hotel", Icon: Building2 },
  { id: "waterfront", label: "Waterfront", Icon: Waves },
  { id: "airport", label: "Airport", Icon: Plane },
  { id: "resort", label: "Resort", Icon: Palmtree },
  { id: "historic", label: "Historic hotel", Icon: Landmark },
  { id: "boutique", label: "Boutique", Icon: Gem },
  { id: "none", label: "No preferences", Icon: Ban },
];

function StepTwoLocation({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("NO");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [highlightedSearchIndex, setHighlightedSearchIndex] = useState(0);
  const [selectedHotelCategory, setSelectedHotelCategory] = useState<string | null>(null);
  const [selectedHotelStyle, setSelectedHotelStyle] = useState<string | null>(null);

  const countryRef = useRef<HTMLDivElement>(null);
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

  // Close dropdowns on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
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
    setIsCountryDropdownOpen(false);
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
    <div>
      {/* Header row */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-start">
        <div>
          <h2
            className="text-[#0A1B2C] text-3xl lg:text-[34px] leading-tight"
            style={{ fontFamily: SERIF }}
          >
            Step 2 – Location
          </h2>
          <p className="mt-3 text-[#4A5866] text-[15px] leading-relaxed">
            Where would you like to host your event?
          </p>
        </div>

        {/* Country selector */}
        <div className="w-full lg:min-w-[280px]" ref={countryRef}>
          <label className="block text-[14px] font-semibold text-[#0A1B2C]">
            Select country
          </label>
          <div className="relative mt-2">
            <button
              type="button"
              onClick={() => setIsCountryDropdownOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={isCountryDropdownOpen}
              className="w-full flex items-center justify-between rounded-md border bg-white px-4 h-[46px] text-[15px] text-[#0A1B2C] outline-none transition-all duration-200 hover:border-[#B9C2CE] hover:shadow-sm focus-visible:ring-2 focus-visible:ring-[#F5AE00]/40 focus-visible:border-[#F5AE00]"
              style={{ borderColor: "#DFE4EB" }}
            >
              <span className="flex items-center gap-3">
                <currentCountry.Flag />
                {currentCountry.name}
              </span>
              <ChevronDown
                size={18}
                className={cn(
                  "text-[#4A5866] transition-transform duration-200",
                  isCountryDropdownOpen && "rotate-180",
                )}
              />
            </button>
            {isCountryDropdownOpen && (
              <ul
                role="listbox"
                className="absolute z-30 mt-2 w-full rounded-md border bg-white py-1 shadow-lg"
                style={{
                  borderColor: "#DFE4EB",
                  boxShadow: "0 12px 30px -12px rgba(10,27,44,0.18)",
                }}
              >
                {COUNTRIES.map((c) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      onClick={() => changeCountry(c.code)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-2 text-left text-[15px] text-[#0A1B2C] transition-colors hover:bg-[#F5EFE1]",
                        c.code === selectedCountry && "bg-[#FBF6EA]",
                      )}
                    >
                      <c.Flag />
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Popular destinations panel */}
      <div
        className="mt-6 rounded-[10px] p-5 lg:p-6"
        style={{
          backgroundColor: "rgba(255,255,255,0.72)",
          border: "1px solid #E7EAF0",
        }}
      >
        <h3 className="text-[14px] font-semibold text-[#0A1B2C]">
          Popular destinations in {currentCountry.name}
        </h3>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {destinations.map((d) => {
            const selected = selectedDestination === d.id;
            const isAnywhere = d.anywhere === true;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => pickDestinationCard(d)}
                aria-pressed={selected}
                className={cn(
                  "group relative overflow-hidden rounded-[10px] aspect-[4/3] text-left transition-all duration-[220ms] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5AE00]/60",
                  selected ? "-translate-y-[3px]" : "hover:-translate-y-[3px]",
                )}
                style={{
                  border: selected
                    ? "2px solid #F5AE00"
                    : "1px solid rgba(15,35,60,0.08)",
                  boxShadow: selected
                    ? "0 18px 40px -20px rgba(200,154,58,0.55), 0 6px 14px -6px rgba(10,27,44,0.15)"
                    : "0 8px 22px -14px rgba(10,27,44,0.25)",
                }}
              >
                {isAnywhere ? (
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                    style={{
                      background:
                        "linear-gradient(180deg, #16385A 0%, #0F2A47 100%)",
                    }}
                  >
                    <d.Icon size={32} strokeWidth={1.6} className="text-white" />
                    <span className="text-white text-[16px] font-medium px-3 text-center">
                      {d.name}
                    </span>
                  </div>
                ) : (
                  <>
                    <img
                      src={d.image}
                      alt={d.name}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[220ms] group-hover:scale-[1.03]"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(4,17,26,0) 40%, rgba(4,17,26,0.72) 100%)",
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
                      <d.Icon size={20} strokeWidth={1.6} className="text-white shrink-0" />
                      <span className="text-white text-[16px] font-medium truncate">
                        {d.name}
                      </span>
                    </div>
                    {selected && (
                      <span
                        className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full"
                        style={{ backgroundColor: "#F5AE00" }}
                      >
                        <Check size={14} strokeWidth={3} className="text-[#0A1B2C]" />
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Lower two-column */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 lg:gap-10">
          <div>
            {/* Search field */}
            <div ref={searchRef}>
              <label className="block text-[14px] font-semibold text-[#0A1B2C]">
                Or search for any destination
              </label>
              <div className="relative mt-2">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4A5866]"
                />
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
                  aria-autocomplete="list"
                  aria-expanded={isSearchDropdownOpen && searchResults.length > 0}
                  className="w-full rounded-md border bg-white pl-11 pr-4 h-[46px] text-[15px] text-[#0A1B2C] placeholder:text-[#8892A0] outline-none transition-colors focus:border-[#F5AE00] focus-visible:ring-2 focus-visible:ring-[#F5AE00]/40"
                  style={{ borderColor: "#DFE4EB" }}
                />

                {isSearchDropdownOpen && searchResults.length > 0 && (
                  <ul
                    role="listbox"
                    className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-[280px] overflow-auto rounded-md border bg-white py-1"
                    style={{
                      borderColor: "#DFE4EB",
                      boxShadow: "0 18px 40px -14px rgba(10,27,44,0.22)",
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
                              "w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-[15px] text-[#0A1B2C] transition-colors",
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

            {/* Hotel category */}
            <div className="mt-6">
              <label className="block text-[14px] font-semibold text-[#0A1B2C]">
                Hotel category
              </label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {HOTEL_CATEGORIES.map((c) => {
                  const selected = selectedHotelCategory === c.id;
                  const isNone = c.id === "none";
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedHotelCategory(c.id)}
                      aria-pressed={selected}
                      className="inline-flex items-center justify-center gap-2 rounded-md h-[46px] text-[15px] bg-white transition-all duration-200 hover:-translate-y-[2px] hover:shadow-sm hover:border-[#B9C2CE] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5AE00]/40"
                      style={{
                        border:
                          selected || isNone
                            ? "1.5px solid #F5AE00"
                            : "1px solid #DFE4EB",
                        color: "#0A1B2C",
                        boxShadow: selected
                          ? "0 8px 20px -14px rgba(200,154,58,0.5)"
                          : undefined,
                      }}
                    >
                      {isNone && (
                        <Ban size={16} strokeWidth={1.8} style={{ color: "#F5AE00" }} />
                      )}
                      <span className={cn(!isNone && "tracking-[0.15em]")}>
                        {c.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hotel style */}
            <div className="mt-6">
              <label className="block text-[14px] font-semibold text-[#0A1B2C]">
                Hotel style
              </label>
              <div className="mt-2 flex flex-wrap gap-3">
                {HOTEL_STYLES.map((s) => {
                  const selected = selectedHotelStyle === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedHotelStyle(s.id)}
                      aria-pressed={selected}
                      className="group flex flex-1 basis-[104px] flex-col items-center justify-center gap-2 rounded-md min-h-[86px] px-3 py-2 transition-all duration-200 hover:-translate-y-[2px] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5AE00]/40"
                      style={{
                        minWidth: 104,
                        background: selected
                          ? "linear-gradient(180deg, #16385A 0%, #0F2A47 100%)"
                          : "#FFFFFF",
                        border: selected
                          ? "1px solid rgba(255,255,255,0.16)"
                          : "1px solid #DFE4EB",
                        boxShadow: selected
                          ? "0 14px 30px -18px rgba(10,27,44,0.55), inset 0 1px 0 rgba(255,255,255,0.06)"
                          : undefined,
                        color: selected ? "#FFFFFF" : "#0A1B2C",
                      }}
                      onMouseEnter={(e) => {
                        if (!selected) {
                          e.currentTarget.style.borderColor = "#E9C77A";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!selected) {
                          e.currentTarget.style.borderColor = "#DFE4EB";
                        }
                      }}
                    >
                      <s.Icon
                        size={22}
                        strokeWidth={1.6}
                        className="transition-transform duration-200 group-hover:scale-[1.04]"
                        style={{ color: selected ? GOLD : "#0A1B2C" }}
                      />
                      <span className="text-[12.5px] text-center leading-[1.25] break-words">
                        {s.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Inline HelpCard (right column on desktop, stacks on mobile) */}
          <div
            className="rounded-[12px] p-5 self-start"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #EFEFEC",
              boxShadow:
                "0 10px 26px -18px rgba(10,27,44,0.14), 0 2px 6px -2px rgba(10,27,44,0.04)",
            }}
          >
            <HelpCard />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-md border px-6 h-[48px] text-[15px] font-medium text-[#0A1B2C] bg-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-[#F5EFE1] hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5AE00]/40"
          style={{ borderColor: "#DFE4EB" }}
        >
          Back
        </button>
        <NextButton onClick={onNext} label="Next Step" />
      </div>
    </div>
  );
}


