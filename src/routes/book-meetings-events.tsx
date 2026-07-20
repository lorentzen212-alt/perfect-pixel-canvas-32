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
  Building2,
  Waves,
  Plane,
  Palmtree,
  Landmark,
  Globe,
  Check,
  Minus,
  Plus,
  Pencil,
  Trash2,
  Coffee,
  BedDouble,
  Bed,
  User,
  UsersRound,
  Sparkles,

} from "lucide-react";
import { cn } from "@/lib/utils";
import { TrustShield, TrustClock, TrustHeadset, TrustLock } from "@/components/TrustIcons";
import { StepThreeMeetingSpaces } from "@/components/StepThreeMeetingSpaces";
import logoAsset from "@/assets/hotelgroupbook-logo.png.asset.json";
import heroAsset from "@/assets/me-hero-conference.png.asset.json";
const heroImg = heroAsset.url;
import loungeImg from "@/assets/luxury-lounge.jpg";
import helpCardBgAsset from "@/assets/need-help-bg.png.asset.json";
const helpCardBg = helpCardBgAsset.url;
void loungeImg;

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
const SANS = '"Inter", ui-sans-serif, system-ui, sans-serif';
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
  { Icon: TrustShield, label: "No commitment" },
  { Icon: TrustClock, label: "Fast and free" },
  { Icon: TrustHeadset, label: "Expert support" },
  { Icon: TrustLock, label: "Secure & trusted" },
];

const STEPS = [
  "Location",
  "Accommodation",
  "Meeting Spaces",
  "Catering",
  "Extras",
  "Event Details",
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
    if (step === 6 && !validateStep1()) return;
    if (step < STEPS.length) go(step + 1);
  };


  return (
    <main
      className="relative min-h-screen w-full"
      style={{ backgroundColor: "#F7F7F5" }}
    >
      {/* HERO */}
      <section
        className="relative w-full min-h-[650px] lg:h-[650px]"
        style={{
          backgroundColor: NAVY_DEEP,
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* TOP: soft dark gradient only behind the navigation */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[110px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,20,35,0.38) 0%, rgba(10,20,35,0.16) 55%, rgba(10,20,35,0) 100%)",
          }}
        />
        {/* LEFT: soft white/champagne wash behind headline */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[60%]"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,250,240,0.74) 0%, rgba(255,250,240,0.42) 35%, rgba(255,250,240,0.14) 70%, rgba(255,250,240,0) 100%)",
          }}
        />
        {/* BOTTOM: darker gradient behind progress navigation */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[200px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,14,26,0) 0%, rgba(6,14,26,0.38) 45%, rgba(6,14,26,0.82) 100%)",
          }}
        />
        {/* BOTTOM-RIGHT: slightly darker corner vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse at 100% 100%, rgba(6,14,26,0.35) 0%, rgba(6,14,26,0) 45%)",
          }}
        />


        <div className="relative z-20 flex flex-col lg:h-[650px] min-h-[650px]">

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
              className="lg:hidden text-[#0A1B2C] p-2"
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
                    className="text-[17px] font-medium transition-colors hover:text-[#F2D477]"
                    style={{ color: "#F5F5F0", textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    className="text-[17px] font-medium transition-colors hover:text-[#F2D477]"
                    style={{ color: "#F5F5F0", textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
                  >
                    {l.label}
                  </a>
                ),
              )}
              <Link
                to="/manage-bookings"
                className="inline-flex items-center gap-[13px] rounded-[8px] px-[18px] h-[51px] text-[16px] font-medium transition-all duration-200 ease-out hover:-translate-y-[2px] hover:brightness-[1.08] active:translate-y-0 active:brightness-95"
                style={{
                  color: "#E8C46A",
                  background:
                    "linear-gradient(135deg, #1A1A1A 0%, #0E0E10 55%, #050505 100%)",
                  border: "1px solid",
                  borderImage:
                    "linear-gradient(135deg, #F2D477 0%, #D4AF37 45%, #8F6818 100%) 1",
                  borderImageSlice: 1,
                  boxShadow:
                    "inset 0 1px 0 rgba(242,212,119,0.28), inset 0 -1px 0 rgba(143,104,24,0.35), 0 4px 14px rgba(0,0,0,0.35), 0 0 18px rgba(212,175,55,0.14)",
                }}
              >
                <CalendarIcon size={19} strokeWidth={2} style={{ color: "#E8C46A" }} />
                Manage Bookings
              </Link>
            </nav>

          </header>

          {mobileOpen && (
            <nav className="lg:hidden mx-5 sm:mx-8 flex flex-col gap-3 rounded-xl bg-[rgba(255,255,255,0.92)] p-4">
              {NAV_LINKS.map((l) =>
                "to" in l ? (
                  <Link key={l.label} to={l.to} className="text-[#0A1B2C] text-base">
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={l.href} className="text-[#0A1B2C] text-base">
                    {l.label}
                  </a>
                ),
              )}
              <Link
                to="/manage-bookings"
                className="mt-1 rounded-md border px-4 py-2 text-[#0A1B2C] self-start"
                style={{ borderColor: GOLD }}
              >
                Manage Bookings
              </Link>
            </nav>
          )}

          {/* HERO CONTENT */}
          <div className="flex-1 px-5 sm:px-8 lg:px-[50px] xl:px-[60px] pt-4 lg:pt-6">
            <div className="max-w-[720px]">
              <h1
                className="text-[#0A1B2C] text-5xl sm:text-6xl lg:text-[80px] leading-[1.0] tracking-tight"
                style={{ fontFamily: SERIF, fontWeight: 300 }}
              >
                Extraordinary
                <br />
                Meetings.
              </h1>

              <p className="mt-6 text-[#26364A] text-lg lg:text-[18px] leading-[1.55] max-w-[560px]">
                Request offers for meetings, conferences and events.
                <br />
                Our M&amp;E specialists will find the best hotels
                <br className="hidden sm:block" />
                and handle all communication for you.
              </p>

              {/* Trust row */}
              <div className="mt-7 flex flex-nowrap items-center gap-x-[52px] whitespace-nowrap">
                {TRUST.map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-[30px]">
                    <Icon size={44} />
                    <span className="text-[#0A1B2C] text-[15px] font-medium leading-none">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* PROGRESS BAR */}
          <div
            className="relative px-5 sm:px-8 lg:px-[50px] xl:px-[60px] pb-7 pt-4 mt-auto"
          >
            <StepProgress step={step} onGo={go} />
          </div>


        </div>
      </section>

      {/* FORM SECTION */}
      <section className="px-5 sm:px-8 lg:px-[50px] xl:px-[60px] py-10 lg:py-14">
        <div className="mx-auto max-w-[1400px]">
          {step === 2 ? (
            <StepThreeAccommodation
              onBack={() => go(1)}
              onNext={handleNext}
              direction={direction}
            />
          ) : step === 3 ? (
            <StepThreeMeetingSpaces
              onBack={() => go(2)}
              onNext={handleNext}
              direction={direction}
            />
          ) : step === 1 ? (
            <StepTwoLocation onBack={() => go(1)} onNext={handleNext} />
          ) : (
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
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(392px,420px)]">
                <div className="p-6 sm:p-10 lg:p-12">
                  <div
                    key={step}
                    className={
                      direction === "forward"
                        ? "animate-slide-in-right"
                        : "animate-slide-in-left"
                    }
                  >
                    {step === 6 && (
                      <StepOne form={form} setForm={setForm} errors={errors} onNext={handleNext} />
                    )}
                    {(step === 4 || step === 5 || step === 7) && (
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
                    className="rounded-[16px] p-6 w-full lg:w-[320px] lg:min-w-[320px]"
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
          )}

          {/* Credibility */}
          {step !== 2 && step !== 3 && (
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
          )}

        </div>
      </section>


      <style>{`
        @keyframes slide-in-right { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slide-in-left { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in-right { animation: slide-in-right 300ms ease-out; }
        .animate-slide-in-left { animation: slide-in-left 300ms ease-out; }

        /* Luxury metallic gold border for destination cards */
        .destination-card {
          border: 1.5px solid transparent;
          background-clip: padding-box;
          box-shadow:
            0 0 0 1px rgba(199, 154, 50, 0.18),
            0 0 2px rgba(199, 154, 50, 0.28),
            0 10px 26px -18px rgba(10,27,44,0.30);
          transition: transform 220ms ease, box-shadow 220ms ease, filter 220ms ease;
          position: relative;
        }
        /* Subtle inner edge darkening so the metallic border reads on bright images */
        .destination-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          z-index: 2;
          box-shadow: inset 0 0 0 1px rgba(10, 20, 34, 0.14), inset 0 0 6px rgba(10, 20, 34, 0.18);
        }
        .destination-card::before {
          content: "";
          position: absolute;
          inset: -1.5px;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(135deg, #F1DFA0 0%, #E4C77A 25%, #C79A32 55%, #A87516 100%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          pointer-events: none;
          transition: filter 220ms ease, opacity 220ms ease;
          z-index: 3;
        }
        .destination-card:hover {
          transform: scale(1.02);
          box-shadow:
            0 0 0 1px rgba(199, 154, 50, 0.22),
            0 0 2px rgba(199, 154, 50, 0.32),
            0 14px 30px -16px rgba(10,27,44,0.34);
        }
        .destination-card:hover::before {
          filter: brightness(1.1);
        }
        .destination-card--selected::before {
          filter: brightness(1.12);
        }
        .destination-card--selected {
          box-shadow:
            0 0 0 1px rgba(199, 154, 50, 0.28),
            0 0 2px rgba(199, 154, 50, 0.38),
            0 16px 32px -18px rgba(10,27,44,0.38);
        }


        /* Metallic country pill hover */
        .country-pill { transition: transform 220ms ease, box-shadow 220ms ease, filter 220ms ease, border-color 220ms ease; }
        .country-pill--active:hover { filter: brightness(1.06); box-shadow: 0 6px 14px -6px rgba(168,117,22,0.28), inset 0 1px 0 rgba(245,228,166,0.45); }

        /* Active step: tiny drifting sparkles + slow shimmer sweep on the circle */
        @keyframes step-spark-drift {
          0%   { opacity: 0; transform: translate(0, 0) scale(0.4); }
          25%  { opacity: 1; }
          75%  { opacity: 1; }
          100% { opacity: 0; transform: translate(var(--dx,2px), var(--dy,-2px)) scale(1); }
        }
        @keyframes step-shimmer-sweep {
          0%   { transform: translateX(-140%) rotate(20deg); opacity: 0; }
          10%  { opacity: 0.85; }
          50%  { opacity: 0.85; }
          90%  { opacity: 0; }
          100% { transform: translateX(160%) rotate(20deg); opacity: 0; }
        }
        @keyframes step-breathe {
          0%, 100% { opacity: 0.5; transform: scale(0.98); }
          50%      { opacity: 0.9; transform: scale(1.04); }
        }




        .meal-card {
          background: linear-gradient(145deg, #FFFFFF 0%, #FCFBF7 55%, #F5F2EA 100%);
          border: 1px solid rgba(201, 156, 45, 0.28);
          box-shadow: 0 8px 22px rgba(8, 20, 36, 0.11), inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 3px rgba(12, 26, 42, 0.06);
          transition: all 180ms ease;
        }
        .meal-card:hover {
          transform: translateY(-1px);
          border-color: rgba(201, 156, 45, 0.60);
          box-shadow: 0 10px 26px rgba(8, 20, 36, 0.14), 0 0 14px rgba(201, 156, 45, 0.16), inset 0 1px 0 rgba(255, 255, 255, 1);
        }
        .meal-card-selected {
          border-color: rgba(201, 156, 45, 0.55);
          box-shadow: 0 8px 22px rgba(8, 20, 36, 0.11), 0 0 18px rgba(201, 156, 45, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.95), inset 0 -1px 3px rgba(12, 26, 42, 0.06);
        }

        .qty-btn {
          color: #B88917;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 6px;
          transition: all 150ms ease;
        }
        .qty-btn:hover {
          color: #B88917;
          background: rgba(212, 175, 55, 0.08);
          border-color: rgba(184, 137, 23, 0.30);
        }
        .qty-btn:active {
          background: linear-gradient(145deg, #F4D878 0%, #D7AD39 48%, #B8871E 100%);
          color: #071A2D;
          border-color: rgba(179, 132, 25, 0.75);
          box-shadow: 0 2px 8px rgba(185, 137, 30, 0.24), inset 0 1px 0 rgba(255, 245, 191, 0.75);
        }
        .qty-btn:focus-visible {
          outline: 2px solid rgba(215, 173, 57, 0.30);
          outline-offset: 2px;
        }

        .complete-stay-btn {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          color: #1C1C1C;
          background-image:
            linear-gradient(180deg, #FFFFFF 0%, #FAF7F0 55%, #F1EADB 100%);
          border: 1px solid #D4AF37;
          border-radius: 16px;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.9),
            inset 0 -1px 0 rgba(212, 175, 55, 0.20),
            0 10px 26px -12px rgba(0, 0, 0, 0.18),
            0 3px 8px -3px rgba(0, 0, 0, 0.08);
          cursor: pointer;
          transition: transform 250ms ease-out, box-shadow 250ms ease-out, filter 250ms ease-out, background-image 250ms ease-out, color 250ms ease-out, border-color 250ms ease-out;
        }
        .complete-stay-plus {
          color: #D4AF37;
          transition: color 250ms ease-out, transform 250ms ease-out;
          position: relative;
          z-index: 2;
        }
        .complete-stay-btn > span,
        .complete-stay-btn > svg {
          position: relative;
          z-index: 2;
        }
        /* Light sweep */
        .complete-stay-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -40%;
          width: 40%;
          height: 100%;
          background: linear-gradient(
            100deg,
            transparent 0%,
            rgba(255, 220, 130, 0) 20%,
            rgba(255, 224, 150, 0.55) 50%,
            rgba(255, 220, 130, 0) 80%,
            transparent 100%
          );
          filter: blur(2px);
          opacity: 0;
          pointer-events: none;
          z-index: 1;
        }
        /* Sparkles overlay */
        .complete-stay-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          background-image:
            radial-gradient(1.5px 1.5px at 18% 55%, rgba(255, 232, 160, 0.95), transparent 60%),
            radial-gradient(1px 1px at 32% 40%, rgba(255, 240, 190, 0.9), transparent 60%),
            radial-gradient(2px 2px at 60% 68%, rgba(255, 220, 130, 0.85), transparent 60%),
            radial-gradient(1.2px 1.2px at 75% 45%, rgba(255, 240, 190, 0.9), transparent 60%),
            radial-gradient(1.6px 1.6px at 88% 60%, rgba(255, 224, 150, 0.9), transparent 60%),
            radial-gradient(1px 1px at 45% 30%, rgba(255, 250, 210, 0.9), transparent 60%);
          transition: opacity 250ms ease-out;
          z-index: 1;
        }
        .complete-stay-btn:hover {
          transform: scale(1.02);
          filter: brightness(1.04);
          color: #FFFFFF;
          background-image:
            linear-gradient(180deg,
              rgba(46, 142, 92, 0.92) 0%,
              rgba(33, 107, 67, 0.92) 50%,
              rgba(20, 78, 49, 0.92) 100%);
          border-color: #D4AF37;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -10px 20px -10px rgba(0, 0, 0, 0.45),
            0 0 12px rgba(46, 142, 92, 0.35),
            0 0 26px rgba(46, 142, 92, 0.18),
            0 14px 32px -12px rgba(0, 0, 0, 0.28);
        }
        .complete-stay-btn:hover::before {
          animation: completeStaySweep 1200ms ease-out forwards;
          opacity: 1;
        }
        .complete-stay-btn:hover::after {
          animation: completeStaySparkle 1400ms ease-out forwards;
        }
        .complete-stay-btn:active {
          transform: scale(0.99);
          filter: brightness(0.94);
          color: #FFFFFF;
          background-image:
            linear-gradient(180deg,
              rgba(33, 107, 67, 0.95) 0%,
              rgba(20, 78, 49, 0.95) 50%,
              rgba(14, 58, 36, 0.95) 100%);
          border-color: #C9A34A;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.10),
            inset 0 -8px 16px -10px rgba(0, 0, 0, 0.50),
            0 0 8px rgba(46, 142, 92, 0.22),
            0 0 16px rgba(46, 142, 92, 0.10),
            0 8px 18px rgba(0, 0, 0, 0.22);
        }
        @keyframes completeStaySweep {
          0%   { left: -40%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { left: 110%; opacity: 0; }
        }
        @keyframes completeStaySparkle {
          0%   { opacity: 0; transform: translateX(-10px); }
          40%  { opacity: 1; }
          100% { opacity: 0; transform: translateX(10px); }
        }
        .add-stay-btn {
          background: linear-gradient(180deg, #143253 0%, #0F2743 55%, #08182B 100%);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            inset 0 -1px 0 rgba(0,0,0,0.5),
            0 14px 32px -14px rgba(10,27,44,0.7),
            0 2px 6px -2px rgba(10,27,44,0.35);
          transition: transform 220ms ease-out, box-shadow 220ms ease-out, filter 220ms ease-out;
          cursor: pointer;
        }
        .add-stay-btn:hover {
          transform: scale(1.015);
          filter: brightness(1.1);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.18),
            0 0 16px rgba(37, 99, 235, 0.30),
            0 0 34px rgba(37, 99, 235, 0.18),
            0 14px 28px rgba(0, 0, 0, 0.28);
        }
        .add-stay-btn:active {
          transform: scale(0.99);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.14),
            0 0 10px rgba(37, 99, 235, 0.22),
            0 0 20px rgba(37, 99, 235, 0.12),
            0 8px 18px rgba(0, 0, 0, 0.25);
        }

      `}</style>
    </main>
  );
}

/* --------- Step Progress --------- */

function StepProgress({ step, onGo }: { step: number; onGo: (n: number) => void }) {
  const total = STEPS.length;
  const progressPercentage = ((step - 1) / (total - 1)) * 100;
  const [pulseKey, setPulseKey] = useState(step);
  const prevStep = useRef(step);
  useEffect(() => {
    if (prevStep.current !== step) {
      const t = window.setTimeout(() => setPulseKey(step), 500);
      prevStep.current = step;
      return () => window.clearTimeout(t);
    }
  }, [step]);

  // Track spans from center of first circle to center of last circle.
  // Each button is flex-1 (equal width = 100%/total), so first/last centers
  // sit at 100%/(2*total) from each edge.
  const edgeInset = `${100 / (total * 2)}%`;

  return (
    <div className="relative">
      <div className="relative flex items-start justify-between gap-2">
        {/* Continuous progress track behind circles */}
        <div
          className="pointer-events-none absolute"
          style={{ top: 18, left: edgeInset, right: edgeInset, zIndex: 0 }}
        >
          {/* Inactive base line: solid up to step 6, dashed from step 6 -> step 7 */}
          <div className="relative h-px w-full">
            <div
              className="absolute left-0 top-0 h-px"
              style={{
                width: `${((total - 2) / (total - 1)) * 100}%`,
                backgroundColor: "rgba(245,194,90,0.28)",
              }}
            />
            <div
              className="absolute top-0 h-px"
              style={{
                left: `${((total - 2) / (total - 1)) * 100}%`,
                right: 0,
                backgroundImage:
                  "linear-gradient(90deg, rgba(255,255,255,0.35) 50%, transparent 50%)",
                backgroundSize: "6px 1px",
                backgroundRepeat: "repeat-x",
              }}
            />
          </div>
          {/* Gold overlay — polished metallic line with subtle reflections */}
          <div
            className="absolute left-0 top-0"
            style={{
              width: `${progressPercentage}%`,
              height: 1,
              background:
                "linear-gradient(90deg, #C79A32 0%, #E4C15E 22%, #F5E4A6 42%, #FFF3C8 50%, #F5E4A6 58%, #E4C15E 78%, #C79A32 100%)",
              boxShadow:
                "0 0 6px rgba(245,228,166,0.55), 0 0 14px rgba(214,177,90,0.28), 0 0 22px rgba(214,177,90,0.14)",
              transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 1,
            }}
          />
          {/* progress line intentionally static — no sparkles */}
        </div>

        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const completed = n < step;
          const isLast = n === total;
          const clickable = !isLast && !active;
          const pulse = active && pulseKey === step;

          const bg = active
            ? "linear-gradient(180deg, #F7CF63 0%, #E4B52F 52%, #D9A520 100%)"
            : completed
              ? NAVY_DEEP
              : "transparent";
          const borderColor = active
            ? "rgba(255,223,130,0.95)"
            : isLast
              ? "rgba(255,255,255,0.28)"
              : GOLD;
          const numberColor = active
            ? "#FFFFFF"
            : completed
              ? GOLD
              : isLast
                ? "rgba(255,255,255,0.4)"
                : GOLD;

          return (
            <button
              key={label}
              type="button"
              onClick={() => (clickable ? onGo(n) : undefined)}
              disabled={!clickable}
              aria-current={active ? "step" : undefined}
              className={cn(
                "relative flex flex-col items-center gap-2 flex-1 min-w-0",
                clickable ? "cursor-pointer" : "cursor-default",
              )}
              style={{ zIndex: 2 }}
            >
              {active && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{
                    top: 6,
                    width: 48,
                    height: 48,
                    borderRadius: "9999px",
                    background:
                      "radial-gradient(circle, rgba(212,175,55,0.28) 0%, rgba(212,175,55,0.10) 45%, transparent 75%)",
                    animation: "step-breathe 4600ms ease-in-out infinite",
                    zIndex: 0,
                  }}
                />
              )}
              {active && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{
                    top: 0,
                    width: 36,
                    height: 36,
                    zIndex: 3,
                  }}
                >
                  {[
                    { x: 35, y: 16, size: 2,   delay: 0,    dur: 2600, dx: 2,  dy: -1 },
                    { x: 26, y: 32, size: 2.5, delay: 700,  dur: 3000, dx: 2,  dy: 2  },
                    { x: 3,  y: 28, size: 2,   delay: 1400, dur: 2700, dx: -2, dy: 2  },
                    { x: -2, y: 11, size: 2.5, delay: 2100, dur: 3200, dx: -2, dy: -1 },
                    { x: 10, y: -2, size: 2,   delay: 2800, dur: 2500, dx: 1,  dy: -2 },
                    { x: 29, y: 1,  size: 1.8, delay: 3500, dur: 2900, dx: 2,  dy: -2 },
                  ].map((s, si) => (
                    <span
                      key={si}
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: s.x,
                        top: s.y,
                        width: s.size,
                        height: s.size,
                        borderRadius: "9999px",
                        background:
                          "radial-gradient(circle, #FFF3C8 0%, rgba(245,228,166,0.95) 45%, rgba(245,228,166,0) 75%)",
                        boxShadow: "0 0 4px rgba(255,243,200,0.85)",
                        animation: `step-spark-drift ${s.dur}ms ease-in-out ${s.delay}ms infinite`,
                        ["--dx" as never]: `${s.dx}px`,
                        ["--dy" as never]: `${s.dy}px`,
                        pointerEvents: "none",
                      }}
                    />
                  ))}
                </span>
              )}
              <span
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold overflow-hidden"
                style={{
                  background: bg,
                  color: numberColor,
                  border: `1px solid ${borderColor}`,
                  boxShadow: active
                    ? "0 0 6px rgba(214,177,90,0.35), inset 0 1px 0 rgba(255,236,183,0.55), inset 0 -1px 0 rgba(120,80,20,0.35)"
                    : completed
                      ? "0 2px 6px rgba(0,0,0,0.25)"
                      : "none",
                  transition:
                    "background 250ms cubic-bezier(0.4,0,0.2,1), box-shadow 250ms cubic-bezier(0.4,0,0.2,1), border-color 250ms",
                  animation: pulse ? "step-pulse 260ms cubic-bezier(0.4,0,0.2,1) 1" : undefined,
                  zIndex: 1,
                }}
              >
                {/* shimmer sweep removed per spec — only sparkles animate */}


                <span style={{ position: "relative", zIndex: 2 }}>
                  {completed ? <Check size={16} strokeWidth={2.5} style={{ color: GOLD }} /> : n}
                </span>
              </span>

              <span
                className="text-[13px] lg:text-[14px] font-medium text-center whitespace-nowrap transition-colors duration-[250ms]"
                style={{
                  color: active ? GOLD : isLast ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.85)",
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
    <div>
      <h3
        className="text-[#0A1B2C] text-[26px] leading-tight"
        style={{ fontFamily: SERIF }}
      >
        Need help?
      </h3>
      <p className="mt-3 text-[#4A5866] text-[15px] leading-relaxed">
        Our M&amp;E specialists are ready
        <br />
        to assist you.
      </p>
      <div className="mt-6 flex flex-col gap-4">
        <a
          href="tel:+4721002100"
          className="flex items-center gap-3 text-[#0A1B2C] text-[15px] hover:text-[#B88A2E] transition-colors"
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
            style={{ borderColor: "rgba(184,138,46,0.4)" }}
          >
            <Phone size={16} strokeWidth={1.8} style={{ color: "#B88A2E" }} />
          </span>
          +47 21 00 21 00
        </a>
        <a
          href="mailto:meetings@hotelgroupbook.com"
          className="flex items-center gap-3 text-[#0A1B2C] text-[15px] hover:text-[#B88A2E] transition-colors whitespace-nowrap"
        >
          <span
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
            style={{ borderColor: "rgba(184,138,46,0.4)" }}
          >
            <Mail size={16} strokeWidth={1.8} style={{ color: "#B88A2E" }} />
          </span>
          meetings@hotelgroupbook.com
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


function StepTwoLocation({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("NO");
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [highlightedSearchIndex, setHighlightedSearchIndex] = useState(0);

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

  // Close search dropdown on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
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
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
      {/* MAIN BOOKING CARD */}
      <div
        className="relative overflow-hidden rounded-[26px] p-6 sm:p-10 lg:p-14"
        style={{
          background: "#FCFBF8",
          border: "1px solid #ECE6D6",
          boxShadow:
            "0 40px 80px -50px rgba(10,27,44,0.18), 0 12px 32px -20px rgba(10,27,44,0.08), 0 2px 4px -2px rgba(10,27,44,0.04)",
        }}
      >
        {/* Title */}
        <h2
          className="text-[42px] sm:text-[50px] leading-[1.05]"
          style={{ fontFamily: SERIF, fontWeight: 400, color: "#1F1F1F", letterSpacing: "-0.015em", fontVariantNumeric: "lining-nums", fontFeatureSettings: '"lnum" 1' }}
        >
          Step{" "}
          <span style={{ fontFamily: '"EB Garamond", "Cormorant Garamond", Georgia, "Times New Roman", serif', fontWeight: 500, fontSize: "0.93em", display: "inline-block" }}>
            1
          </span>
          {" "}– Location
        </h2>


        <p className="mt-3 text-[15px] text-[#4A5866]">
          Where would you like to host your event?
        </p>
        <div className="mt-6 h-px w-full" style={{ background: "#ECE6D6" }} />

        {/* Country pills */}
        <div className="mt-8 flex flex-wrap gap-3">
          {COUNTRIES.map((c) => {
            const active = c.code === selectedCountry;
            return (
              <button
                key={c.code}
                type="button"
                onClick={() => changeCountry(c.code)}
                aria-pressed={active}
                className={cn(
                  "country-pill group inline-flex items-center gap-3 rounded-full pl-4 pr-6 h-[48px] text-[15px] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B15A]/30",
                  active ? "country-pill--active -translate-y-[1px]" : "hover:-translate-y-[1px]",
                )}
                style={{
                  background: "#FFFFFF",
                  border: active ? "1.5px solid transparent" : "1px solid #ECE6D6",
                  color: active ? "#7A5A1E" : "#4A5866",
                  fontWeight: active ? 600 : 500,
                  ...(active
                    ? {
                        backgroundImage:
                          "linear-gradient(#FFFFFF,#FFFFFF), linear-gradient(180deg,#F5E4A6 0%, #D6B15A 45%, #C79A32 75%, #A87516 100%)",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                        boxShadow:
                          "0 2px 6px -2px rgba(168,117,22,0.18), inset 0 1px 0 rgba(245,228,166,0.35)",
                      }
                    : {
                        boxShadow: "0 4px 14px -12px rgba(10,27,44,0.14)",
                      }),
                }}
              >
                <span
                  className="inline-flex h-6 w-9 items-center justify-center overflow-hidden rounded-[3px] shrink-0"
                >
                  <c.Flag />
                </span>
                {c.name}
              </button>

            );
          })}
        </div>

        {/* Curated destinations */}
        <div className="mt-10 flex items-center gap-3">
          <Sparkles size={18} className="text-[#D4AF37]" strokeWidth={1.6} />
          <h3
            className="text-[#0A1B2C] text-[18px]"
            style={{ fontFamily: SANS, fontWeight: 600 }}
          >
            Curated destinations in {currentCountry.name}
          </h3>
        </div>

        {/* Destination grid: 4 per row × 2 rows */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {destinations.map((d) => {
            const selected = selectedDestination === d.id;
            if (d.anywhere) {
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => pickDestinationCard(d)}
                  aria-pressed={selected}
                  className={cn(
                    "destination-card group relative overflow-hidden rounded-[16px] aspect-[4/3] flex flex-col items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B15A]/35",
                    selected && "destination-card--selected",
                  )}
                  style={{
                    background:
                      "linear-gradient(180deg,#0F2233 0%, #0A1B2C 100%) padding-box, linear-gradient(180deg,#F5E4A6 0%, #D6B15A 45%, #C79A32 75%, #A87516 100%) border-box",
                    border: "1.5px solid transparent",
                    boxShadow: "0 6px 18px -12px rgba(10,27,44,0.35), inset 0 1px 0 rgba(245,228,166,0.18)",
                  }}
                >
                  <Globe size={30} strokeWidth={1.4} className="text-[#F0D78C]" />
                  <span
                    className="text-white text-[16px] text-center leading-tight"
                    style={{ fontFamily: SANS, fontWeight: 500 }}
                  >
                    Anywhere
                    <br />
                    <span className="text-[#F0D78C]">in {currentCountry.name}</span>
                  </span>
                </button>
              );
            }
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => pickDestinationCard(d)}
                aria-pressed={selected}
                className={cn(
                  "destination-card group relative overflow-hidden rounded-[16px] aspect-[4/3] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B15A]/35",
                  selected && "destination-card--selected",
                )}
                style={{
                  background:
                    "#0A1B2C padding-box, linear-gradient(180deg,#F5E4A6 0%, #D6B15A 45%, #C79A32 75%, #A87516 100%) border-box",
                  border: "1.5px solid transparent",
                  boxShadow: "0 8px 22px -14px rgba(10,27,44,0.4), inset 0 1px 0 rgba(245,228,166,0.15)",
                }}
              >

                <img
                  src={d.image}
                  alt={d.name}
                  loading="lazy"
                  width={600}
                  height={450}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(4,17,26,0) 45%, rgba(4,17,26,0.55) 78%, rgba(4,17,26,0.9) 100%)",
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-4 pb-3">
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(240,215,140,0.55)",
                    }}
                  >
                    <d.Icon size={14} strokeWidth={1.6} className="text-[#F0D78C]" />
                  </span>
                  <span
                    className="text-white text-[17px] tracking-[-0.005em]"
                    style={{ fontFamily: SANS, fontWeight: 500 }}
                  >
                    {d.name}
                  </span>
                </div>
                {selected && (
                  <span
                    className="absolute top-3 right-3 inline-flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#D4AF37" }}
                  >
                    <Check size={13} strokeWidth={3} className="text-[#0A1B2C]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search field */}
        <div className="mt-10">
          <p className="text-[14px] text-[#4A5866] mb-2">Or search for any destination</p>
          <div ref={searchRef} className="relative">
            <div
              className="flex items-center gap-3 rounded-[16px] px-5 h-[56px]"
              style={{
                background: "#FFFFFF",
                border: "1px solid #ECE6D6",
                boxShadow: "0 4px 14px -10px rgba(10,27,44,0.10)",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#B88A2E"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
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
                aria-label="Destination"
                className="w-full bg-transparent text-[15px] text-[#0A1B2C] placeholder:text-[#9BA3AE] outline-none border-none"
              />
            </div>

            {isSearchDropdownOpen && searchResults.length > 0 && (
              <ul
                role="listbox"
                className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-[280px] overflow-auto rounded-[16px] border bg-white py-1"
                style={{
                  borderColor: "#ECE6D6",
                  boxShadow: "0 24px 50px -18px rgba(10,27,44,0.22)",
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
                          "w-full flex items-center justify-between gap-3 px-5 py-2.5 text-left text-[15px] text-[#0A1B2C] transition-colors",
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

        {/* Preferred venue field */}
        <div
          className="mt-4 flex items-center gap-4 rounded-[16px] px-5 py-3"
          style={{
            background: "#FFFFFF",
            border: "1px solid #ECE6D6",
            boxShadow: "0 4px 14px -10px rgba(10,27,44,0.10)",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B88A2E"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
            <path d="M14 3v5h5" />
            <path d="M8 13h6M8 17h4" />
          </svg>
          <div className="flex flex-1 flex-col min-w-0">
            <label
              htmlFor="preferred-venue"
              className="text-[14px] text-[#0A1B2C]"
            >
              <span style={{ fontWeight: 600 }}>Preferred venue</span>{" "}
              <span className="text-[#9BA3AE] font-normal">(optional)</span>
            </label>
            <input
              id="preferred-venue"
              type="text"
              placeholder="Specific hotel, venue or any special request…"
              className="w-full bg-transparent text-[13.5px] text-[#4A5866] placeholder:text-[#9BA3AE] outline-none border-none mt-0.5"
            />
          </div>
          <button
            type="button"
            aria-label="Edit preferred venue"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-105 shrink-0"
          >
            <Pencil size={16} className="text-[#B88A2E]" strokeWidth={1.8} />
          </button>
        </div>

        {/* Hidden navigation — Step 2 uses progress bar for navigation to match reference */}
        <div className="sr-only" aria-hidden="true">
          <button type="button" onClick={onBack}>Back</button>
          <button type="button" onClick={onNext}>Next Step</button>
        </div>
      </div>

      {/* NEED HELP CARD */}
      <aside
        className="relative overflow-hidden rounded-[26px]"
        style={{
          backgroundColor: "#FFFFFF",
          boxShadow:
            "0 40px 80px -50px rgba(10,27,44,0.18), 0 12px 32px -20px rgba(10,27,44,0.08)",
          minHeight: 480,
        }}
      >
        {/* Reference illustration: warm off-white bg + gold lines + lounge — used as full card background */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${helpCardBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="relative pt-9 lg:pt-10 px-8 lg:px-9 pb-4">

          <h3
            className="text-[#0A1B2C] text-[28px] leading-tight"
            style={{ fontFamily: SERIF, fontWeight: 500 }}
          >
            Need help?
          </h3>
          <p className="mt-3 text-[#4A5866] text-[15px] leading-relaxed">
            Our M&amp;E specialists are
            <br />
            ready to assist you.
          </p>

          <div className="mt-8 flex flex-col gap-5">
            <a
              href="tel:+4721002100"
              className="flex items-center gap-3 text-[#2A2A2A] text-[15px] hover:text-[#B88A2E] transition-colors"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                style={{
                  background:
                    "linear-gradient(180deg,#F5E4A6 0%, #D6B15A 50%, #C79A32 100%)",
                  boxShadow:
                    "0 4px 10px -6px rgba(168,117,22,0.45), inset 0 1px 0 rgba(255,245,210,0.7), inset 0 -1px 0 rgba(120,80,20,0.35)",
                }}
              >
                <Phone size={16} strokeWidth={2} className="text-white" />
              </span>
              +47 21 00 21 00
            </a>
            <a
              href="mailto:meetings@hotelgroupbook.com"
              className="flex items-center gap-3 text-[#2A2A2A] text-[15px] hover:text-[#B88A2E] transition-colors whitespace-nowrap"
            >
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full shrink-0"
                style={{
                  background:
                    "linear-gradient(180deg,#F5E4A6 0%, #D6B15A 50%, #C79A32 100%)",
                  boxShadow:
                    "0 4px 10px -6px rgba(168,117,22,0.45), inset 0 1px 0 rgba(255,245,210,0.7), inset 0 -1px 0 rgba(120,80,20,0.35)",
                }}
              >
                <Mail size={16} strokeWidth={2} className="text-white" />
              </span>
              meetings@hotelgroupbook.com
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}



/* --------- Step 3: Accommodation --------- */

type RoomMix = { sgl: number; dbl: number; twn: number; trp: number; ste: number };
type MealPlan = "room" | "breakfast";
type Stay = {
  id: string;
  checkIn: string;
  checkOut: string;
  rooms: RoomMix;
  mealPlan: MealPlan;
};

const emptyRooms = (): RoomMix => ({ sgl: 0, dbl: 0, twn: 0, trp: 0, ste: 0 });

function fmtDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function roomsSummary(r: RoomMix) {
  const parts: string[] = [];
  if (r.sgl) parts.push(`${r.sgl} SGL`);
  if (r.dbl) parts.push(`${r.dbl} DBL`);
  if (r.twn) parts.push(`${r.twn} TWN`);
  if (r.trp) parts.push(`${r.trp} TRP`);
  if (r.ste) parts.push(`${r.ste} STE`);
  return parts.join(", ");
}

function roomsTotal(r: RoomMix) {
  return r.sgl + r.dbl + r.twn + r.trp + r.ste;
}
function guestsCapacity(r: RoomMix) {
  return r.sgl * 1 + r.dbl * 2 + r.twn * 2 + r.trp * 3 + r.ste * 2;
}

function StepThreeAccommodation({
  onBack,
  onNext,
  direction,
}: {
  onBack: () => void;
  onNext: () => void;
  direction: "forward" | "back";
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState<RoomMix>(emptyRooms());
  const [roomCategory, setRoomCategory] = useState<
    Record<"sgl" | "dbl" | "twn" | "trp", string>
  >({ sgl: "Standard", dbl: "Standard", twn: "Standard", trp: "Standard" });
  const [mealPlan, setMealPlan] = useState<MealPlan>("breakfast");
  const [stays, setStays] = useState<Stay[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [special, setSpecial] = useState("");

  const totalRooms = stays.reduce((n, s) => n + roomsTotal(s.rooms), 0);
  const totalGuests = stays.reduce((n, s) => n + guestsCapacity(s.rooms), 0);
  const primaryMeal = stays[0]?.mealPlan ?? mealPlan;

  const clearDraft = () => {
    setCheckIn("");
    setCheckOut("");
    setRooms(emptyRooms());
    setMealPlan("breakfast");
    setEditingId(null);
  };

  const addStay = () => {
    if (!checkIn || !checkOut) return;
    const stay: Stay = {
      id: editingId ?? crypto.randomUUID(),
      checkIn,
      checkOut,
      rooms,
      mealPlan,
    };
    setStays((prev) =>
      editingId ? prev.map((s) => (s.id === editingId ? stay : s)) : [...prev, stay],
    );
    clearDraft();
  };

  const editStay = (id: string) => {
    const s = stays.find((x) => x.id === id);
    if (!s) return;
    setEditingId(id);
    setCheckIn(s.checkIn);
    setCheckOut(s.checkOut);
    setRooms(s.rooms);
    setMealPlan(s.mealPlan);
  };

  const removeStay = (id: string) => {
    setStays((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) clearDraft();
  };

  return (
    <div
      className={
        direction === "forward" ? "animate-slide-in-right" : "animate-slide-in-left"
      }
    >
      <div className="mb-6">
        <h2
          className="text-[#0A1B2C] text-3xl lg:text-[38px] leading-tight"
          style={{ fontFamily: SERIF }}
        >
          Step&nbsp; – Accommodation
        </h2>
        <div className="mt-3 h-[2px] w-16" style={{ background: "linear-gradient(90deg,#F7D97A,#B88917)" }} />
        <p className="mt-4 text-[#4A5866] text-[15px] max-w-xl leading-relaxed">
          Add the room mix for each stay period. You can add multiple stay periods if
          guests are arriving or departing on different dates.
        </p>
      </div>

      <div
        className="overflow-hidden rounded-[20px]"
        style={{
          backgroundColor: "#FCFCFC",
          backgroundImage: "linear-gradient(180deg,#FFFFFF 0%,#FAFAF8 100%)",
          boxShadow:
            "0 40px 80px -50px rgba(10,27,44,0.18), 0 12px 32px -20px rgba(10,27,44,0.08), 0 2px 4px -2px rgba(10,27,44,0.04)",
          border: "1px solid #ECECEC",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
          {/* LEFT COLUMN */}
          <div className="p-6 sm:p-9 lg:p-11 lg:pr-9">
            {/* Accommodation Period card */}
            <div
              className="rounded-[16px] p-6 lg:p-7"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #EEEBE3",
                boxShadow: "0 6px 18px -10px rgba(10,27,44,0.08)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LuxIconBadge size={44}>
                    <CalendarIcon size={21} strokeWidth={1.8} />
                  </LuxIconBadge>
                  <div>
                  <h3
                    className="text-[#1A1F24] text-[20px] leading-tight tracking-[0.04em]"
                    style={{ fontFamily: SANS, fontWeight: 600 }}
                  >
                    Accommodation Period{" "}
                    <span className="text-[#8A94A0] text-[15px] font-normal tracking-normal">
                      ({editingId ? "Editing" : "Draft"})
                    </span>
                  </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearDraft}
                  className="inline-flex items-center gap-2 rounded-md border px-3 h-9 text-[13px] text-[#4A5866] bg-white hover:bg-[#FBF7EA] transition-colors"
                  style={{ borderColor: "#E3DFD3", boxShadow: "0 1px 2px rgba(10,27,44,0.04)" }}
                >
                  <Trash2 size={14} style={{ color: "#B88917" }} />
                  Clear
                </button>
              </div>

              {/* Dates */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-4">
                <DateField label="Check-in" value={checkIn} onChange={setCheckIn} />
                <div className="hidden sm:flex items-center justify-center pb-3">
                  <ArrowRight size={18} className="text-[#4A5866]" />
                </div>
                <DateField label="Check-out" value={checkOut} onChange={setCheckOut} />
              </div>

              {/* Room Categories — stacked full-width rows */}
              <div className="mt-8">
                <div className="mb-4 sm:hidden">
                  <h4
                    className="text-[#1F2937] text-[15px]"
                    style={{ fontFamily: SANS, fontWeight: 600 }}
                  >
                    Room Categories
                  </h4>
                </div>
                <div
                  className="mb-3 hidden sm:grid items-baseline gap-6 pb-2 border-b px-5"
                  style={{ gridTemplateColumns: "44px minmax(0,1fr) 132px 180px", borderColor: "#ECE7DC" }}
                >
                  <div aria-hidden />
                  <h4
                    className="text-[#1F2937] text-[16.5px] ml-[-82px]"
                    style={{ fontFamily: SANS, fontWeight: 600, letterSpacing: "0.02em" }}
                  >
                    Room Categories
                  </h4>
                  <span
                    className="text-[11px] tracking-[0.05em] text-[#1F2937] uppercase text-center"
                    style={{ fontFamily: SANS, fontWeight: 600 }}
                  >
                    Guests
                  </span>
                  <span
                    className="text-[11px] tracking-[0.05em] text-[#1F2937] uppercase text-center"
                    style={{ fontFamily: SANS, fontWeight: 600 }}
                  >
                    Preferred Room Category
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <RoomRow
                    icon={<User size={21} strokeWidth={1.7} />}
                    label="Single Room"
                    value={rooms.sgl}
                    onChange={(v) => setRooms({ ...rooms, sgl: v })}
                    category={roomCategory.sgl}
                    onCategoryChange={(c) => setRoomCategory({ ...roomCategory, sgl: c })}
                  />
                  <RoomRow
                    icon={<Users size={21} strokeWidth={1.7} />}
                    label="Double Room"
                    value={rooms.dbl}
                    onChange={(v) => setRooms({ ...rooms, dbl: v })}
                    category={roomCategory.dbl}
                    onCategoryChange={(c) => setRoomCategory({ ...roomCategory, dbl: c })}
                  />
                  <RoomRow
                    icon={<TwinBedsIcon size={23} />}
                    label="Twin Room"
                    value={rooms.twn}
                    onChange={(v) => setRooms({ ...rooms, twn: v })}
                    category={roomCategory.twn}
                    onCategoryChange={(c) => setRoomCategory({ ...roomCategory, twn: c })}
                  />
                  <RoomRow
                    icon={<UsersRound size={21} strokeWidth={1.7} />}
                    label="Triple Room"
                    value={rooms.trp}
                    onChange={(v) => setRooms({ ...rooms, trp: v })}
                    category={roomCategory.trp}
                    onCategoryChange={(c) => setRoomCategory({ ...roomCategory, trp: c })}
                  />
                </div>
              </div>


              {/* Meal Plan */}
              <div className="mt-8 border-t pt-6" style={{ borderColor: "#EEEBE3" }}>
                <h4
                  className="text-[#0A1B2C] text-[17px] mb-4 pl-[3px]"
                  style={{ fontFamily: SERIF, fontWeight: 600, letterSpacing: "0.2px" }}
                >
                  Meal Plan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MealOption
                    icon={<BedDouble size={19} />}
                    label="Room Only"
                    selected={mealPlan === "room"}
                    onClick={() => setMealPlan("room")}
                  />
                  <MealOption
                    icon={<Coffee size={19} />}
                    label="Breakfast Included"
                    selected={mealPlan === "breakfast"}
                    onClick={() => setMealPlan("breakfast")}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={clearDraft}
                  className="inline-flex items-center justify-center rounded-md border px-6 h-[46px] text-[14px] font-medium text-[#0A1B2C] bg-white hover:bg-[#F5EFE1]"
                  style={{ borderColor: "#D9D3C4" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addStay}
                  disabled={!checkIn || !checkOut}
                  className="group inline-flex items-center justify-center gap-2 rounded-md px-6 h-[46px] text-[14px] font-semibold text-white disabled:opacity-50 transition-transform active:translate-y-px"
                  style={{
                    background:
                      "linear-gradient(180deg,#153353 0%,#0C2440 55%,#081A30 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.4), 0 12px 28px -14px rgba(10,27,44,0.7), 0 2px 6px -2px rgba(10,27,44,0.35)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {editingId ? "Save changes" : "Add this stay"}
                  <ArrowRight size={16} style={{ color: "#F2C860" }} className="transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* Complete stay and continue (outlined gold) */}
            <button
              type="button"
              onClick={onNext}
              className="complete-stay-btn mt-5 w-full inline-flex items-center justify-center gap-2 h-[52px] text-[15px] font-semibold"
            >
              <Plus size={18} className="complete-stay-plus" />
              Complete stay and continue
            </button>

            {/* Added Stays */}
            {stays.length > 0 && (
              <div className="mt-9">
                <h4 className="text-[#0A1B2C] text-[15px] font-semibold mb-4">Added Stays</h4>
                <div className="flex flex-col gap-3">
                  {stays.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-4 rounded-[12px] px-4 py-3"
                      style={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #EEEBE3",
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <LuxIconBadge size={36} tone="onDark">
                          <CalendarIcon size={16} strokeWidth={1.8} />
                        </LuxIconBadge>
                        <div className="min-w-0">
                          <div className="text-[#0A1B2C] text-[14px] font-semibold truncate">
                            {fmtDate(s.checkIn)} – {fmtDate(s.checkOut)}
                          </div>
                          <div className="text-[#4A5866] text-[13px] truncate">
                            {roomsSummary(s.rooms) || "No rooms"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => editStay(s.id)}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[13px] text-[#0A1B2C] hover:bg-[#F5EFE1]"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStay(s.id)}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[13px] text-[#B45B4A] hover:bg-[#FBECEA]"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add another stay */}
            <button
              type="button"
              onClick={clearDraft}
              className="add-stay-btn mt-5 w-full inline-flex items-center justify-center gap-2 rounded-[12px] h-[54px] text-[15px] font-semibold text-white"
            >
              <Plus size={18} style={{ color: "#F2C860" }} />
              Add another stay
            </button>


            {/* Special Requests */}
            <div className="mt-9">
              <label className="block">
                <span className="text-[#0A1B2C] text-[15px] font-semibold">
                  Special Requests <span className="font-normal text-[#8A94A0]">(Optional)</span>
                </span>
                <span className="mt-1 block text-[#4A5866] text-[13px]">
                  Tell us about any specific requirements.
                </span>
                <textarea
                  value={special}
                  onChange={(e) => setSpecial(e.target.value)}
                  rows={3}
                  placeholder="E.g. early check-in, late check-out, welcome gift, specific floor, etc."
                  className="mt-3 w-full rounded-[10px] px-4 py-3 text-[14px] text-[#0A1B2C] placeholder:text-[#9BA4AE] outline-none transition-all focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.14)]"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E6E2D5",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
                  }}
                />
              </label>
            </div>

            {/* Back */}
            <div className="mt-10 flex">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center justify-center gap-2 rounded-md border px-6 h-[46px] text-[14px] font-medium text-[#0A1B2C] bg-white hover:bg-[#F5EFE1]"
                style={{ borderColor: "#D9D3C4" }}
              >
                Back
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR - premium navy */}
          <aside
            className="relative p-7 lg:p-8 text-white"
            style={{
              background:
                "linear-gradient(180deg,#0B1E31 0%, #081827 55%, #050F1B 100%)",
              boxShadow: "inset 1px 0 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* subtle vertical divider gradient */}
            <div
              className="pointer-events-none absolute left-0 top-6 bottom-6 w-px"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(212,175,55,0.35), transparent)",
              }}
            />

            {/* Summary */}
            <h3
              className="text-white text-[24px] leading-tight"
              style={{ fontFamily: SERIF }}
            >
              Summary
            </h3>
            <div
              className="mt-3 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg,#F7D97A 0%,#D4AF37 60%,rgba(212,175,55,0) 100%)",
              }}
            />

            <div className="mt-6 flex flex-col gap-4">
              <SummaryRow icon={<Users size={16} />} label="Total Guests" value={totalGuests} />
              <SummaryRow icon={<CalendarIcon size={16} />} label="Stay Periods" value={stays.length} />
              <SummaryRow icon={<BedDouble size={16} />} label="Total Rooms Requested" value={totalRooms} />
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <LuxIconBadge size={36} tone="onDark">
                  <Coffee size={16} />
                </LuxIconBadge>
                <div>
                  <div className="text-white/70 text-[13px]">Meal Plan</div>
                  <div className="text-white text-[15px] font-medium">
                    {primaryMeal === "breakfast" ? "Breakfast Included" : "Room Only"}
                  </div>
                </div>
              </div>
            </div>

            {/* Need help card */}
            <div
              className="mt-7 rounded-[14px] p-5"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(212,175,55,0.22)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <h4 className="text-white text-[20px]" style={{ fontFamily: SERIF }}>
                Need help?
              </h4>
              <div
                className="mt-2 h-[2px] w-10"
                style={{ background: "linear-gradient(90deg,#F7D97A,rgba(247,217,122,0))" }}
              />
              <p className="mt-3 text-white/75 text-[13.5px] leading-relaxed">
                Our M&amp;E specialists are ready to assist you.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="tel:+4721002100"
                  className="flex items-center gap-3 text-white/90 text-[13.5px] hover:text-[#F7D97A] transition-colors"
                >
                  <LuxIconBadge size={32} tone="onDark">
                    <Phone size={14} />
                  </LuxIconBadge>
                  +47 21 00 21 00
                </a>
                <a
                  href="mailto:meetings@hotelgroupbook.com"
                  className="flex items-center gap-3 text-white/90 text-[13.5px] hover:text-[#F7D97A] transition-colors whitespace-nowrap"
                >
                  <LuxIconBadge size={32} tone="onDark">
                    <Mail size={14} />
                  </LuxIconBadge>
                  meetings@hotelgroupbook.com
                </a>
              </div>
            </div>

            {/* Trust box */}
            <div
              className="mt-5 rounded-[14px] p-5 text-center"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(212,175,55,0.22)",
              }}
            >
              <div className="mx-auto flex items-center justify-center">
                <LuxIconBadge size={44} tone="onDark">
                  <Users size={20} />
                </LuxIconBadge>
              </div>
              <p
                className="mt-3 text-white text-[15px] leading-snug"
                style={{ fontFamily: SERIF }}
              >
                Built by group booking
                <br />
                professionals
              </p>
              <p className="mt-2 text-white/70 text-[12.5px] leading-relaxed">
                with experience from{" "}
                <span className="text-[#F7D97A] font-semibold">10,000+ groups.</span>
              </p>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[#0A1B2C] text-[13.5px] font-semibold">{label}</span>
      <div
        className="group mt-2 flex items-center gap-2 rounded-[10px] px-3 h-[46px] transition-all focus-within:border-[#D4AF37] focus-within:shadow-[0_0_0_3px_rgba(212,175,55,0.14)]"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E6E2D5",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
        }}
      >
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[14px] text-[#0A1B2C]"
        />
        <CalendarIcon size={16} style={{ color: "#B88917" }} />
      </div>
    </label>
  );
}

function Counter({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[#0A1B2C] text-[13px] font-medium mb-2 flex items-center gap-2">
        {icon ? <LuxIconBadge size={28}>{icon}</LuxIconBadge> : null}
        <span>{label}</span>
      </div>
      <div
        className="flex items-center justify-between rounded-[10px] h-[46px] px-1.5"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E6E2D5",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
        }}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[#0F1115]"
          style={{ color: "#B88917" }}
          aria-label={`Decrease ${label}`}
        >
          <Minus size={15} />
        </button>
        <span className="text-[#0A1B2C] text-[15px] font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-[#0F1115] hover:text-[#EBCB6A]"
          style={{ color: "#B88917" }}
          aria-label={`Increase ${label}`}
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

const ROOM_CATEGORY_OPTIONS = [
  "Standard",
  "Superior",
  "Premium",
  "Junior Suite",
  "Suite",
] as const;

function RoomRow({
  icon,
  label,
  value,
  onChange,
  category,
  onCategoryChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (v: number) => void;
  category: string;
  onCategoryChange: (c: string) => void;
}) {
  return (
    <div
      className="rounded-[16px] px-4 sm:px-5 py-4 sm:py-4"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #ECE7DC",
        boxShadow:
          "0 6px 20px -14px rgba(10,27,44,0.20), 0 1px 2px rgba(10,27,44,0.03)",
      }}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3 sm:gap-6">
        <LuxIconBadge size={44}>{icon}</LuxIconBadge>
        <div className="min-w-0 text-[#0A1B2C] text-[15px] sm:text-[16px] font-medium truncate">
          {label}
        </div>
        <div
          className="col-span-3 sm:col-span-1 flex items-center justify-between sm:justify-center rounded-[10px] h-[44px] sm:w-[132px] px-1.5"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E6E2D5",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
          }}
        >
          <button
            type="button"
            onClick={() => onChange(Math.max(0, value - 1))}
            className="qty-btn inline-flex h-8 w-8 items-center justify-center"
            aria-label={`Decrease ${label}`}
          >
            <Minus size={15} />
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              const n = raw === "" ? 0 : Math.max(0, Math.min(parseInt(raw, 10), 999));
              onChange(n);
            }}
            onBlur={(e) => {
              if (e.target.value === "") onChange(0);
            }}
            className="w-8 bg-transparent text-center text-[#0A1B2C] text-[15px] font-semibold tabular-nums outline-none"
            aria-label={`${label} quantity`}
          />
          <button
            type="button"
            onClick={() => onChange(value + 1)}
            className="qty-btn inline-flex h-8 w-8 items-center justify-center"
            aria-label={`Increase ${label}`}
          >
            <Plus size={15} />
          </button>
        </div>
        <div className="col-span-3 sm:col-span-1 relative sm:w-[180px]">
          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full appearance-none rounded-[10px] h-[44px] pl-3 pr-9 text-[14px] text-[#0A1B2C] outline-none focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.14)]"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E6E2D5",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
            }}
            aria-label={`Preferred category for ${label}`}
          >
            {ROOM_CATEGORY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "#B88917" }}
          />
        </div>
      </div>
    </div>
  );
}

function TwinBedsIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* left bed */}
      <rect x="2" y="10" width="8.5" height="6" rx="1.2" />
      <path d="M2 13.2h8.5" />
      <rect x="3" y="8.5" width="2.2" height="1.5" rx="0.4" />
      {/* right bed */}
      <rect x="13.5" y="10" width="8.5" height="6" rx="1.2" />
      <path d="M13.5 13.2H22" />
      <rect x="14.5" y="8.5" width="2.2" height="1.5" rx="0.4" />
      {/* floor */}
      <path d="M2 17.5h20" />
    </svg>
  );
}


function MealOption({
  icon,
  label,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "meal-card flex items-center justify-between rounded-[14px] px-4 h-[56px] text-left",
        selected && "meal-card-selected"
      )}
    >
      <span className="flex items-center gap-3">
        <LuxIconBadge size={36}>{icon}</LuxIconBadge>
        <span className="text-[#0A1B2C] text-[14.5px] font-medium">{label}</span>
      </span>
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-full"
        style={{
          border: `2px solid ${selected ? "#D4AF37" : "#D9D3C4"}`,
          background: selected
            ? "linear-gradient(180deg,#F7E7A6,#D4AF37 60%,#A97816)"
            : "transparent",
          boxShadow: selected ? "0 0 0 3px rgba(212,175,55,0.15)" : undefined,
        }}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
    </button>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <LuxIconBadge size={32} tone="onDark">
          {icon}
        </LuxIconBadge>
        <span className="text-white/85 text-[14px]">{label}</span>
      </div>
      <span
        className="text-white text-[16px] font-semibold tabular-nums"
        style={{ fontFamily: SERIF }}
      >
        {value}
      </span>
    </div>
  );
}

function GoldDivider() {
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

/**
 * LuxIconBadge — premium matte-black container with champagne-gold icon.
 * Preserves size prop; icon inherits color via currentColor from the gradient
 * stroke supplied here.
 */
function LuxIconBadge({
  children,
  size = 40,
  tone = "onLight",
}: {
  children: React.ReactNode;
  size?: number;
  tone?: "onLight" | "onDark";
}) {
  const radius = size >= 40 ? 12 : Math.max(6, Math.round(size * 0.28));
  const shadow =
    tone === "onDark"
      ? "0 8px 20px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)"
      : "0 6px 18px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.35)";
  const bg =
    tone === "onDark"
      ? "linear-gradient(180deg,#1A1D24 0%, #101319 55%, #0B0D12 100%)"
      : "linear-gradient(180deg,#262626 0%, #111111 100%)";
  const borderColor =
    tone === "onDark" ? "rgba(212,175,55,0.22)" : "rgba(212,175,55,0.28)";
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: bg,
        border: `1px solid ${borderColor}`,
        boxShadow: shadow,
        color: "#E6C25A",
      }}
    >
      {/* soft inner highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: radius,
          background:
            "radial-gradient(120% 60% at 50% 0%, rgba(247,231,166,0.16) 0%, rgba(247,231,166,0) 55%)",
        }}
      />
      <span
        className="relative"
        style={{
          color: "#EBCB6A",
          filter:
            "drop-shadow(0 1px 0 rgba(255,255,255,0.10)) drop-shadow(0 1px 1px rgba(0,0,0,0.35))",
        }}
      >
        {children}
      </span>
    </span>
  );
}


