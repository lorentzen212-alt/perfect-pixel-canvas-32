import { createFileRoute, Link } from "@tanstack/react-router";

import {
  ArrowRight,
  Users,
  Briefcase,
  ShieldCheck,
  Clock,
  Headphones,
  Lock,
  FileText,
  Building2,
  CheckCircle2,
  MapPin,
  Gem,
  Linkedin,
  Facebook,
  Instagram,
} from "lucide-react";
import {
  ShieldCheckPremium,
  ClockPremium,
  HeadsetPremium,
  LockPremium,
  GroupPremium,
} from "@/components/PremiumIcons";
import heroAsset from "@/assets/hero-bg.png.asset.json";
import { HomeBackgroundVideo } from "@/components/HomeBackgroundVideo";
import cardLeisureAsset from "@/assets/card-leisure-new.png.asset.json";
import cardMeAsset from "@/assets/card-me-new.png.asset.json";
import cardManageAsset from "@/assets/card-manage-new.png.asset.json";
import logoAsset from "@/assets/hotelgroupbook-logo.png.asset.json";

import lofotenImg from "@/assets/dest-lofoten.jpg";
import tromsoImg from "@/assets/dest-tromso.jpg";
import bergenImg from "@/assets/dest-bergen.jpg";
import geirangerImg from "@/assets/dest-geiranger.jpg";
import stockholmImg from "@/assets/dest-stockholm.jpg";
import copenhagenImg from "@/assets/dest-copenhagen.jpg";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { property: "og:image", content: heroAsset.url },
      { name: "twitter:image", content: heroAsset.url },
    ],
  }),
});

import { SiteMenu, type SiteMenuItem } from "@/components/SiteMenu";

const MENU_ITEMS: SiteMenuItem[] = [
  { label: "Book Leisure", to: "/book-leisure" },
  { label: "Book Meetings & Events", to: "/book-meetings-events" },
  { label: "Manage Bookings", to: "/manage-bookings" },
  { label: "About Us", href: "#about" },
  { label: "How It Works", href: "#how" },
  { label: "Become a Partner", href: "#partner" },
  { label: "Support", href: "#support" },
  { label: "Contact", href: "#contact" },
];


const TRUST = [
  { Icon: ShieldCheckPremium, label: "No commitment", size: 37 },
  { Icon: ClockPremium, label: "Fast and free", size: 37 },
  { Icon: HeadsetPremium, label: "Expert support", size: 41 },
  { Icon: LockPremium, label: "Secure & trusted", size: 37 },
];

function GoldLineWithDiamond({
  className,
  lineWidth = "w-[260px] sm:w-[300px] lg:w-[330px]",
  lineThickness = "h-[2px]",
  diamondSize = "h-[5px] w-[5px]",
}: {
  className?: string;
  lineWidth?: string;
  lineThickness?: string;
  diamondSize?: string;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn("bg-[#C3B8A4]", lineThickness, lineWidth)} />
      <div className={cn("ml-0.5 rotate-45 bg-[#C3B8A4]", diamondSize)} />
    </div>
  );
}


function Home() {


  return (
    <>
    <main className="relative min-h-screen w-full overflow-hidden bg-[#0A0B0D]">
      {/* Homepage background — supplied video (poster fallback) + subtle overlay */}
      <HomeBackgroundVideo />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(8, 15, 25, 0.48) 0%, rgba(14, 25, 39, 0.32) 48%, rgba(7, 14, 23, 0.58) 100%)",
        }}
      />






      <div className="relative z-20 w-full">
        {/* HEADER */}
        <header className="flex h-[88px] items-center justify-between px-5 sm:px-8 lg:px-[50px] xl:px-[60px]">

          <a href="/" aria-label="HotelGroupBook" className="logo-hover-wrap relative flex items-center">
            <span className="logo-mist" aria-hidden="true" />
            <img
              src={logoAsset.url}
              alt="HotelGroupBook"
              className="relative h-[46px] sm:h-[56px] lg:h-[68px] w-auto"
            />
          </a>

          <SiteMenu items={MENU_ITEMS} variant="outline" />
        </header>


        {/* CENTERED HERO CONTENT */}
        <section className="mx-auto max-w-[1300px] px-5 sm:px-8 lg:px-6 pt-0 lg:pt-0 pb-10 lg:pb-12 text-center lg:min-h-[calc(100vh-88px+110px)] flex flex-col justify-start lg:-mt-[75px]">
          {/* Eyebrow */}
          <div className="flex items-center justify-center -mt-1">
            <span className="text-[10.5px] tracking-[0.44em] uppercase font-light text-[#C8942E]">
              The Experience
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mx-auto mt-3 lg:mt-4 max-w-[980px] font-light text-white leading-[1.18] tracking-[0.005em] text-[40px] sm:text-[54px] lg:text-[62px]"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            <span className="block">Three ways to</span>
            <span className="block">
              <em className="italic font-light">exceptional</em> group stays
            </span>
          </h1>

          {/* Gold divider */}
          <div className="mt-7 lg:mt-9 flex items-center justify-center">
            <div className="h-px w-[110px] lg:w-[130px] bg-gradient-to-r from-transparent to-[#E0A33A]" />
            <div className="mx-[16px] h-[7px] w-[7px] rotate-45 bg-[#E8A93B]" />
            <div className="h-px w-[110px] lg:w-[130px] bg-gradient-to-l from-transparent to-[#E0A33A]" />
          </div>

          <p className="mt-[14px] lg:mt-[16px] text-white/80 text-[15px] lg:text-[16px] font-light tracking-[0.02em]">
            One request. Everything handled.
          </p>



          {/* EXPERIENCE CARDS */}
          <div className="relative mt-12 lg:mt-16">
            {/* Stage spotlight behind all three cards */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-[12%] -top-[18%] -bottom-[22%] -z-10"
              style={{
                background:
                  "radial-gradient(60% 55% at 50% 45%, rgba(255,246,226,0.09) 0%, rgba(255,244,220,0.05) 38%, rgba(255,240,215,0.02) 62%, rgba(0,0,0,0) 82%)",
                filter: "blur(6px)",
              }}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-[44px]">
              <ExperienceCard
                to="/book-leisure"
                image={cardLeisureAsset.url}
                imagePosition="center 35%"
                label="L E I S U R E"
                tagline="Group Hotel Booking"
                ctaText="Explore"
                intensity={1.8}
              />
              <ExperienceCard
                to="/book-meetings-events"
                image={cardMeAsset.url}
                imagePosition="center center"
                label="M & E"
                tagline="Professional Event Planning"
                ctaText="Plan event"
                intensity={2}
              />
              <ExperienceCard
                to="/manage-bookings"
                image={cardManageAsset.url}
                imagePosition="center center"
                label="M A N A G E"
                tagline="Manage Your Bookings"
                ctaText="Open dashboard"
                intensity={1.8}
              />
            </div>
          </div>


          {/* EDITORIAL DIVIDER SECTION */}
          <section className="mt-[60px] pb-[80px] text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-[70px] sm:w-[110px] lg:w-[150px] bg-gradient-to-r from-transparent via-[#C9A65E]/80 to-transparent" />
              <h2 className="text-[12px] sm:text-[13px] font-medium uppercase tracking-[0.28em] text-[#D4AF37]">
                Built for modern group travel
              </h2>
              <div className="h-px w-[70px] sm:w-[110px] lg:w-[150px] bg-gradient-to-r from-transparent via-[#C9A65E]/80 to-transparent" />
            </div>
            <p className="mx-auto mt-5 max-w-[420px] text-[17px] font-light leading-[1.7] text-[#E8E4DD]">
              Designed to simplify every step,
              <br />
              from enquiry to arrival.
            </p>
          </section>
        </section>
      </div>
    </main>
    <HowItWorks />
    <Destinations />
    <WhyChoose />
    <FinalCTA />
    <SiteFooter />
    </>
  );
}

function ExperienceCard({
  to,
  image,
  imagePosition = "center center",
  imageFilter = "brightness(1.06) contrast(1.07) saturate(0.86) hue-rotate(-6deg) sepia(0.05)",
  overlay = "from-transparent via-transparent via-[84%] to-black/18",
  label,
  tagline,
  ctaText,
  intensity = 1,
}: {
  to: string;
  image: string;
  imagePosition?: string;
  imageFilter?: string;
  overlay?: string;
  label: string;
  tagline: React.ReactNode;
  ctaText: string;
  intensity?: number;
}) {
  const cardShadow = "0 28px 70px rgba(0, 0, 0, 0.42)";
  const k = Math.min(intensity, 2.2);
  const clamp = (v: number) => Math.min(v, 1);


  return (
    <div
      className="relative"
      style={{ isolation: "isolate", overflow: "visible" }}
    >
      {/* Extremely soft radial glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-[14%] -inset-y-[10%] -z-10"
        style={{
          background:
            "radial-gradient(52% 48% at 50% 50%, rgba(255,247,230,0.07) 0%, rgba(255,244,222,0.035) 45%, rgba(0,0,0,0) 78%)",
          filter: "blur(18px)",
        }}
      />

      {/* Inner warm haze — pulled in tight, no side spill */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: "50%",
          bottom: "-2px",
          transform: "translateX(-50%)",
          width: "86%",
          height: "10px",
          borderRadius: "45%",
          background:
            `radial-gradient(ellipse at center, rgba(255, 254, 250, ${clamp(0.92 * k)}) 0%, rgba(255, 245, 220, ${clamp(0.68 * k)}) 45%, rgba(250, 220, 160, ${clamp(0.3 * k)}) 72%, transparent 92%)`,
          filter: "blur(4px)",
          opacity: 1,
          zIndex: 0,
        }}
      />
      {/* Bright warm-white bloom pressed to card base */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: "50%",
          bottom: "0px",
          transform: "translateX(-50%)",
          width: "88%",
          height: "6px",
          borderRadius: "45%",
          background:
            `radial-gradient(ellipse at center, rgba(255, 254, 248, ${clamp(1 * k)}) 0%, rgba(255, 248, 225, ${clamp(0.96 * k)}) 40%, rgba(255, 235, 190, ${clamp(0.58 * k)}) 72%, transparent 92%)`,
          filter: "blur(2px)",
          opacity: 1,
          zIndex: 1,
        }}
      />
      {/* Strong white light bar along bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: "50%",
          bottom: "0px",
          transform: "translateX(-50%)",
          width: "90%",
          height: "3px",
          borderRadius: "6px",
          background:
            `linear-gradient(to right, transparent 0%, rgba(255, 255, 252, ${clamp(1 * k)}) 12%, rgba(255, 254, 245, ${clamp(1 * k)}) 50%, rgba(255, 255, 252, ${clamp(1 * k)}) 88%, transparent 100%)`,
          filter: "blur(0.6px)",
          opacity: 1,
          zIndex: 1,
        }}
      />
      {/* Hot white contact streak — the light source itself */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: "50%",
          bottom: "1px",
          transform: "translateX(-50%)",
          width: "92%",
          height: "1.5px",
          borderRadius: "2px",
          background:
            `linear-gradient(to right, transparent 0%, rgba(255, 255, 255, ${clamp(1 * k)}) 10%, rgba(255, 255, 255, ${clamp(1 * k)}) 50%, rgba(255, 255, 255, ${clamp(1 * k)}) 90%, transparent 100%)`,
          filter: "blur(0.2px)",
          zIndex: 2,
        }}
      />





      <Link
        to={to}
        className="group/card relative block overflow-hidden rounded-[22px] bg-[#0E1013] group"
        style={{
          position: "relative",
          zIndex: 2,
          border: "1px solid rgba(214, 183, 124, 0.34)",
          boxShadow: cardShadow,
          transition:
            "transform 300ms cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 300ms cubic-bezier(0.22, 0.61, 0.36, 1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.boxShadow = "0 36px 84px rgba(0, 0, 0, 0.48)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = cardShadow;
        }}
      >
        {/* Brushed champagne-gold ring */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[22px] opacity-90 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            padding: "1px",
            background:
              "linear-gradient(145deg, rgba(246,231,196,0.60) 0%, rgba(198,166,108,0.26) 22%, rgba(232,212,167,0.46) 44%, rgba(150,120,72,0.20) 66%, rgba(240,224,183,0.52) 100%)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        {/* Soft gold reflection on border during hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[22px] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          style={{
            padding: "1px",
            background:
              "linear-gradient(145deg, rgba(255,250,235,0.55) 0%, rgba(232,212,167,0.22) 30%, rgba(150,120,72,0.08) 55%, rgba(246,231,196,0.42) 100%)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        {/* Full-height background image */}
        <div className="relative aspect-[12/13] overflow-hidden">
          <img
            src={image}
            alt=""
            style={{ objectPosition: imagePosition, filter: imageFilter }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Unified cinematic grade: cool grey cast + champagne highlights */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-soft-light"
            style={{
              background:
                "linear-gradient(180deg, rgba(150,168,186,0.30) 0%, rgba(120,136,154,0.18) 48%, rgba(38,44,52,0.34) 100%)",
            }}
          />
          {/* Champagne highlight tint */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 22%, rgba(226,206,166,0.16) 0%, rgba(226,206,166,0) 62%)",
            }}
          />
          {/* Lifted charcoal blacks + subtle cinematic haze */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(216,224,232,0.045) 0%, rgba(30,36,44,0.06) 100%)",
            }}
          />

          {/* Cinematic gradient: lighter top, progressively darker bottom */}
          <div className={cn("absolute inset-0 bg-gradient-to-b", overlay)} />
          {/* Subtle bottom gradient purely for text legibility */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to top, rgba(4,8,13,0.68) 0%, rgba(4,8,13,0.25) 28%, transparent 52%)",
            }}
          />

          {/* Content overlay — quiet editorial typography block */}
          <div className="absolute inset-0 z-20">
            <div
              className="absolute text-left"
              style={{ left: "34px", bottom: "82px" }}
            >
              <p
                className="uppercase"
                style={{
                  color: "#FFFFFF",
                  fontSize: "18px",
                  fontWeight: 600,
                  letterSpacing: "0.28em",
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  marginTop: "7px",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "15px",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  whiteSpace: "nowrap",
                }}
              >
                {tagline}
              </p>
            </div>
            <span
              className="absolute flex items-center opacity-[0.9] transition-opacity duration-[250ms] ease-out group-hover/card:opacity-100"
              style={{
                left: "34px",
                bottom: "32px",
                color: "#FFFFFF",
                fontSize: "15px",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              {ctaText}
              <span className="ml-[10px] inline-block transition-transform duration-[250ms] ease-out group-hover/card:translate-x-1">
                →
              </span>
            </span>
          </div>



        </div>
      </Link>
    </div>
  );
}





function CTAButton({
  icon,
  label,
  variant,
  to,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  variant: "light" | "dark" | "deep";
  to?: string;
}) {
  const light = variant === "light";
  const deep = variant === "deep";
  const className = cn(
    "group flex items-center justify-between pl-6 pr-[22px] border transition-all duration-200 ease-out hover:translate-y-[-2px]",
    to && "cursor-pointer",
    light
      ? "bg-white border-white text-[#071A2B] shadow-[0_8px_24px_rgba(0,0,0,0.16)] hover:bg-[#FFFEFC] hover:border-[#FFFEFC] hover:shadow-[0_14px_34px_rgba(0,0,0,0.18),0_0_28px_rgba(255,196,0,0.18),0_0_56px_rgba(255,196,0,0.08)]"
      : deep
        ? "bg-[#0A1426] border-[rgba(255,255,255,0.16)] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-[#0F1E33] hover:border-white/25 hover:shadow-[0_12px_30px_rgba(0,0,0,0.24),0_0_22px_rgba(255,196,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
        : "bg-[#0D1F33] border-[rgba(255,255,255,0.16)] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-[#122840] hover:border-white/25 hover:shadow-[0_12px_30px_rgba(0,0,0,0.24),0_0_22px_rgba(255,196,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
  );
  const style = { flex: "0 0 268px", height: 64, borderRadius: 6 } as const;
  const inner = (
    <>
      <span className="flex items-center" style={{ gap: 18 }}>
        <span className={cn("flex items-center shrink-0 transition-all duration-200 ease-out", light ? "text-[#FFC400] group-hover:text-[#FFD966] group-hover:drop-shadow-[0_0_6px_rgba(255,196,0,0.55)]" : "text-[#FFC400]")}>
          {icon}
        </span>
        <span className={cn("text-[17px] font-semibold leading-none", light ? "text-[#071A2B]" : "text-white")}>
          {label}
        </span>
      </span>
      <ArrowRight
        className={cn(
          "transition-transform duration-200 ease-out group-hover:translate-x-1 shrink-0",
          light ? "text-[#FFC400] group-hover:text-[#FFD966] group-hover:drop-shadow-[0_0_6px_rgba(255,196,0,0.55)]" : "text-[#FFC400]"
        )}
        size={24}
        strokeWidth={1.9}
      />
    </>
  );
  if (to) {
    return (
      <Link to={to} style={style} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <button style={style} className={className}>
      {inner}
    </button>
  );
}


/* --------------------------- HOW IT WORKS --------------------------- */

const STEPS = [
  {
    Icon: FileText,
    title: "Submit Your Request",
    desc: "Tell us where, when and how many guests you're planning for.",
  },
  {
    Icon: Building2,
    title: "Receive Hotel Offers",
    desc: "We send your request to multiple hotels that compete to offer their best rates.",
  },
  {
    Icon: CheckCircle2,
    title: "Book With Confidence",
    desc: "Compare offers, choose the best option and confirm in one place.",
  },
];

function SectionEyebrowDivider() {
  return (
    <div className="mx-auto mt-3 flex items-center justify-center">
      <div className="h-[2px] w-16 bg-[#FFC400]" />
      <div className="ml-3 h-[8px] w-[8px] rotate-45 bg-[#FFC400]" />
      <div className="ml-3 h-[2px] w-16 bg-[#FFC400]" />
    </div>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="bg-[#F5F3EE] py-20 lg:py-24 px-5 sm:px-8 lg:px-[60px]">
      <div className="mx-auto max-w-6xl text-center">
        <h2
          className="text-[#04111A] text-3xl sm:text-4xl lg:text-[44px] font-normal"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          How It Works
        </h2>
        <SectionEyebrowDivider />
        <p className="mt-5 text-[#3B4A56] text-base lg:text-lg">
          Simple. Fast. Built for groups.
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-6 relative">
          {STEPS.map(({ Icon, title, desc }, i) => (
            <div key={title} className="flex flex-col items-center px-4 relative">
              <div className="relative">
                <span className="absolute -top-2 -right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[#FFC400] bg-[#F5F3EE] text-[#FFC400] text-sm font-semibold">
                  {i + 1}
                </span>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#04111A] shadow-sm">
                  <Icon className="text-[#FFC400]" size={34} strokeWidth={1.75} />
                </div>
              </div>
              <h3 className="mt-6 text-[#04111A] text-xl font-semibold">{title}</h3>
              <p className="mt-3 max-w-xs text-[#3B4A56] text-[15px] leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- DESTINATIONS --------------------------- */

const DESTINATIONS = [
  { name: "Lofoten", country: "Norway", img: lofotenImg },
  { name: "Tromsø", country: "Norway", img: tromsoImg },
  { name: "Bergen", country: "Norway", img: bergenImg },
  { name: "Geiranger", country: "Norway", img: geirangerImg },
  { name: "Stockholm", country: "Sweden", img: stockholmImg },
  { name: "Copenhagen", country: "Denmark", img: copenhagenImg },
];

function Destinations() {
  return (
    <section className="bg-[#04111A] py-20 lg:py-24 px-5 sm:px-8 lg:px-[60px]">
      <div className="mx-auto max-w-7xl text-center">
        <h2
          className="text-white text-3xl sm:text-4xl lg:text-[44px] font-normal"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          Popular Group Destinations
        </h2>
        <SectionEyebrowDivider />
        <p className="mt-5 text-[#C8CFD6] text-base lg:text-lg">
          Explore handpicked destinations perfect for your next group trip.
        </p>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-5">
          {DESTINATIONS.map((d) => (
            <a
              key={d.name}
              href="#"
              className="group relative block overflow-hidden rounded-xl aspect-[4/5] border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FFC400]/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
            >
              <img
                src={d.img}
                alt={`${d.name}, ${d.country}`}
                width={800}
                height={1000}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                <p className="text-[11px] uppercase tracking-wider text-[#C8CFD6]">
                  {d.country}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <MapPin className="text-[#FFC400]" size={14} strokeWidth={2.25} />
                  <p className="text-white text-base font-semibold">{d.name}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-md border border-[#FFC400] px-7 py-3 text-white text-[15px] transition-colors hover:bg-[#FFC400]/10"
          >
            View All Destinations
            <ArrowRight size={18} className="text-[#FFC400]" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- WHY CHOOSE --------------------------- */

const REASONS = [
  {
    Icon: Gem,
    title: "Best Rates",
    desc: "Hotels compete for your group and offer their best possible rates.",
  },
  {
    Icon: Clock,
    title: "Save Time",
    desc: "One request instead of dozens of emails.",
  },
  {
    Icon: Headphones,
    title: "Expert Support",
    desc: "Personal service from experienced group booking professionals.",
  },
  {
    Icon: ShieldCheck,
    title: "Secure & Trusted",
    desc: "Your data is safe with us. No commitment.",
  },
];

function WhyChoose() {
  return (
    <section className="bg-[#F5F3EE] py-20 lg:py-24 px-5 sm:px-8 lg:px-[60px]">
      <div className="mx-auto max-w-6xl text-center">
        <h2
          className="text-[#04111A] text-3xl sm:text-4xl lg:text-[44px] font-normal"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          Why Choose HotelGroupBook?
        </h2>
        <SectionEyebrowDivider />
        <p className="mt-5 text-[#3B4A56] text-base lg:text-lg">
          The smarter way to manage group hotel bookings.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REASONS.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl bg-white p-7 text-left shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(4,17,26,0.05)] transition-transform hover:-translate-y-1"
            >
              <Icon className="text-[#F5AE00]" size={30} strokeWidth={1.75} />
              <h3 className="mt-4 text-[#04111A] text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-[#3B4A56] text-[14.5px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- FINAL CTA --------------------------- */

function FinalCTA() {
  return (
    <section className="bg-[#04111A] py-20 lg:py-24 px-5 sm:px-8 lg:px-[60px]">
      <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-gradient-to-br from-[#0B2238] to-[#04111A] px-8 py-12 lg:px-14 lg:py-14 text-center shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <h2
          className="text-white text-3xl sm:text-4xl lg:text-[40px] font-normal leading-tight"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          Ready to Receive Hotel Offers <span className="italic">for Your Group?</span>
        </h2>
        <p className="mt-4 text-[#C8CFD6] text-base lg:text-lg">
          Start your request today. It&apos;s free and without obligation.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#F5AE00] px-7 py-3.5 text-[#04111A] text-[15px] font-semibold transition-all hover:-translate-y-0.5 hover:bg-[#FFC400] hover:shadow-[0_10px_30px_rgba(255,196,0,0.25)]"
          >
            Start a Leisure Request
            <ArrowRight size={18} />
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/30 px-7 py-3.5 text-white text-[15px] font-semibold transition-colors hover:bg-white/10 hover:border-[#FFC400]/60"
          >
            Request M&amp;E
            <ArrowRight size={18} className="text-[#FFC400]" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- FOOTER --------------------------- */

const FOOTER_COLS = [
  {
    heading: "Company",
    links: ["About Us", "Become a Partner", "How It Works", "Contact"],
  },
  {
    heading: "Destinations",
    links: ["Norway", "Sweden", "Denmark", "All Destinations"],
  },
  {
    heading: "Support",
    links: ["Help Center", "FAQ", "Terms of Use", "Privacy Policy"],
  },
];

function SiteFooter() {
  return (
    <footer className="bg-[#02101A] border-t border-white/5 px-5 sm:px-8 lg:px-[60px] pt-16 pb-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <a href="/" aria-label="HotelGroupBook" className="inline-flex items-center">
              <img src={logoAsset.url} alt="HotelGroupBook" className="h-10 w-auto" />
            </a>

            <p className="mt-3 text-[#8A96A2] text-sm">
              Group hotel bookings made simple.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[Linkedin, Facebook, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-[#FFC400] hover:text-[#FFC400]"
                  aria-label="social"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-white text-sm font-semibold tracking-wide">
                {col.heading}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[#8A96A2] text-sm transition-colors hover:text-[#FFC400]"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-white text-sm font-semibold tracking-wide">Newsletter</h4>
            <p className="mt-4 text-[#8A96A2] text-sm">
              Get tips and news for group travel straight to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-4 flex items-center gap-2"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-md border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-[#6B7683] outline-none focus:border-[#FFC400]/60"
              />
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-[#F5AE00] text-[#04111A] transition-colors hover:bg-[#FFC400]"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/5 pt-6">
          <p className="text-[#6B7683] text-xs">
            © {new Date().getFullYear()} HotelGroupBook. All rights reserved.
          </p>
          <p className="text-[#6B7683] text-xs">Built for group booking professionals.</p>
        </div>
      </div>
    </footer>
  );
}
