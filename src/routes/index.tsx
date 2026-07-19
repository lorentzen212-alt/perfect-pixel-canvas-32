import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Users,
  Briefcase,
  CalendarDays,
  ShieldCheck,
  Clock,
  Headphones,
  Lock,
  UsersRound,
  Menu,
  X,
  FileText,
  Building2,
  CheckCircle2,
  MapPin,
  Gem,
  Linkedin,
  Facebook,
  Instagram,
  Mountain,
} from "lucide-react";
import heroAsset from "@/assets/hero-bg.png.asset.json";
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

const NAV_LINKS = [
  { label: "About Us", href: "#about" },
  { label: "How It works", href: "#how" },
  { label: "Become a Partner", href: "#partner" },
  { label: "Support", href: "#support" },
];

// Premium duotone gold icons — custom-drawn, uniform 1.1 stroke, subtle inner shading
const GOLD = "#E6C56A";
const GOLD_SOFT = "rgba(212,175,55,0.18)";
const GOLD_HAIR = "rgba(230,197,106,0.55)";
const STROKE = 1.1;

type IconProps = { size?: number; className?: string };

const svgBase = {
  fill: "none" as const,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function ShieldCheckIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" className={className} aria-hidden="true" {...svgBase}>
      <path d="M14 3 5 5.6v7.1c0 5.05 3.65 9.4 9 10.9 5.35-1.5 9-5.85 9-10.9V5.6L14 3Z" fill={GOLD_SOFT} stroke={GOLD} strokeWidth={STROKE} />
      <path d="M8 6.9 14 5.3l6 1.6v5.8c0 4-2.55 7.35-6 8.7-3.45-1.35-6-4.7-6-8.7V6.9Z" stroke={GOLD_HAIR} strokeWidth="0.7" />
      <path d="m10.2 13.9 2.7 2.7 5.1-5.3" stroke={GOLD} strokeWidth={STROKE} />
    </svg>
  );
}

function ClockIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" className={className} aria-hidden="true" {...svgBase}>
      <circle cx="14" cy="14" r="10.5" fill={GOLD_SOFT} stroke={GOLD} strokeWidth={STROKE} />
      <circle cx="14" cy="14" r="7.8" stroke={GOLD_HAIR} strokeWidth="0.7" />
      {/* hour ticks */}
      <path d="M14 5.2v1.4M14 21.4v1.4M5.2 14h1.4M21.4 14h1.4" stroke={GOLD} strokeWidth="0.9" />
      {/* hands */}
      <path d="M14 8.4V14l3.6 2.2" stroke={GOLD} strokeWidth={STROKE} />
      <circle cx="14" cy="14" r="0.9" fill={GOLD} />
    </svg>
  );
}

function HeadsetIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" className={className} aria-hidden="true" {...svgBase}>
      {/* headband */}
      <path d="M5 15.4v-1.6a9 9 0 0 1 18 0v1.6" stroke={GOLD} strokeWidth={STROKE} />
      {/* ear cups */}
      <path d="M4.4 15.6c0-.95.75-1.7 1.7-1.7h1.7v6.3H6.1a1.7 1.7 0 0 1-1.7-1.7v-2.9Z" fill={GOLD_SOFT} stroke={GOLD} strokeWidth={STROKE} />
      <path d="M23.6 15.6c0-.95-.75-1.7-1.7-1.7h-1.7v6.3h1.7a1.7 1.7 0 0 0 1.7-1.7v-2.9Z" fill={GOLD_SOFT} stroke={GOLD} strokeWidth={STROKE} />
      {/* subtle grille lines */}
      <path d="M6 15.8v3.4M20.3 15.8v3.4" stroke={GOLD_HAIR} strokeWidth="0.7" />
      {/* mic boom + mouthpiece */}
      <path d="M20.3 20.2v.9a2.8 2.8 0 0 1-2.8 2.8h-2.7" stroke={GOLD} strokeWidth={STROKE} />
      <circle cx="14" cy="23.9" r="1" fill={GOLD_SOFT} stroke={GOLD} strokeWidth={STROKE} />
    </svg>
  );
}

function PadlockIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" className={className} aria-hidden="true" {...svgBase}>
      {/* shackle */}
      <path d="M8.6 12.4V9.1a5.4 5.4 0 0 1 10.8 0v3.3" stroke={GOLD} strokeWidth={STROKE} />
      {/* body */}
      <rect x="5.8" y="12.4" width="16.4" height="12" rx="2.2" fill={GOLD_SOFT} stroke={GOLD} strokeWidth={STROKE} />
      {/* inner hair line */}
      <rect x="7.6" y="14" width="12.8" height="8.8" rx="1.4" stroke={GOLD_HAIR} strokeWidth="0.7" />
      {/* keyhole */}
      <circle cx="14" cy="17.4" r="1.25" stroke={GOLD} strokeWidth={STROKE} />
      <path d="M14 18.5v2.6" stroke={GOLD} strokeWidth={STROKE} />
    </svg>
  );
}

function GroupIcon({ size = 26, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" className={className} aria-hidden="true" {...svgBase}>
      {/* left figure */}
      <circle cx="8.4" cy="10" r="2.4" fill={GOLD_SOFT} stroke={GOLD} strokeWidth={STROKE} />
      <path d="M3.4 19.4c0-2.5 2.25-4.5 5-4.5s5 2 5 4.5" stroke={GOLD} strokeWidth={STROKE} />
      {/* right figure */}
      <circle cx="18.6" cy="10" r="2.4" fill={GOLD_SOFT} stroke={GOLD} strokeWidth={STROKE} />
      <path d="M14.6 19.4c0-2.5 2.25-4.5 5-4.5s5 2 5 4.5" stroke={GOLD} strokeWidth={STROKE} />
      {/* subtle horizon */}
      <path d="M3 22.8c3.3 1.4 7 2.1 11 2.1s7.7-.7 11-2.1" stroke={GOLD_HAIR} strokeWidth="0.7" />
    </svg>
  );
}

const TRUST = [
  { Icon: ShieldCheckIcon, label: "No commitment" },
  { Icon: ClockIcon, label: "Fast and free" },
  { Icon: HeadsetIcon, label: "Expert support" },
  { Icon: PadlockIcon, label: "Secure & trusted" },
  { Icon: GroupIcon, label: (<>Built by group booking<br className="hidden sm:block" /> professionals</>) },
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
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
    <main
      className="relative min-h-screen w-full overflow-hidden bg-[#04111A]"
      style={{
        backgroundImage: `url(${heroAsset.url})`,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />

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




          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <nav className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-white text-[18px] font-normal transition-colors hover:text-[#F5AE00]"
              >
                {l.label}
              </a>
            ))}
            <button className="rounded-md border border-[#F5AE00] px-7 py-2.5 text-[#F7F7F5] text-[18px] transition-colors hover:bg-[#F5AE00]/10">
              Login
            </button>
          </nav>
        </header>


        {mobileOpen && (
          <nav className="lg:hidden mt-4 mx-5 sm:mx-8 lg:mx-[50px] xl:mx-[60px] flex flex-col gap-3 rounded-xl bg-[rgba(2,18,29,0.9)] p-4">
            {NAV_LINKS.map((l) => (
              <a key={l.label} href={l.href} className="text-white text-base">
                {l.label}
              </a>
            ))}
            <button className="mt-1 rounded-md border border-[#F5AE00] px-5 py-2 text-white self-start">
              Login
            </button>
          </nav>
        )}

        {/* HERO CONTENT */}
        <section className="ml-5 sm:ml-8 lg:ml-[50px] xl:ml-[60px] mt-[25px] pt-[38px] sm:pt-[62px] lg:pt-[92px] pb-16 lg:pb-24 max-w-[720px]">
          <GoldLineWithDiamond lineWidth="w-[100px] sm:w-[110px] lg:w-[120px]" lineThickness="h-[2px]" diamondSize="h-[5px] w-[5px]" />

          <h2
            className="mt-4 font-medium text-white leading-[1.02] text-5xl sm:text-6xl lg:text-[86px]"
            style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
          >
            Group hotel
            <br />
            bookings
            <br />
            <span className="italic">made simple</span>
          </h2>

          <GoldLineWithDiamond className="mt-4" lineWidth="w-[190px] sm:w-[200px] lg:w-[210px]" lineThickness="h-[2px]" diamondSize="h-[5px] w-[5px]" />

          <p className="mt-[39px] text-white text-xl sm:text-2xl lg:text-[28px] leading-[1.25] font-normal font-sans">
            The easiest way to request
            <br />
            hotel offers for groups.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-10 flex flex-nowrap items-center gap-4" style={{ gap: 16 }}>
            <CTAButton icon={<Users size={26} strokeWidth={1.9} />} label="Book Leisure" variant="light" />
            <CTAButton icon={<Briefcase size={26} strokeWidth={1.9} />} label="Book M&E" variant="deep" />
            <CTAButton
              icon={<CalendarDays size={26} strokeWidth={1.9} />}
              label={
                <>
                  Manage My
                  <br />
                  Bookings
                </>
              }
              variant="deep"
            />
          </div>

          {/* TRUST ROW — luxury feature strip */}
          <div className="mt-12 flex flex-wrap items-center gap-x-12 lg:gap-x-14 gap-y-5">
            {TRUST.map(({ Icon, label }, i) => (
              <div key={i} className="flex items-center" style={{ gap: 12 }}>
                <span
                  className="relative inline-flex shrink-0 items-center justify-center"
                  style={{
                    filter: "drop-shadow(0 0 6px rgba(212,175,55,0.28)) drop-shadow(0 1px 0 rgba(0,0,0,0.35))",
                  }}
                >
                  <Icon size={26} />
                </span>
                <span className="text-[#DED8C9]/85 text-[15px] lg:text-[16px] leading-snug tracking-[0.01em]">
                  {label}
                </span>
              </div>
            ))}
          </div>
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

function CTAButton({
  icon,
  label,
  variant,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  variant: "light" | "dark" | "deep";
}) {
  const light = variant === "light";
  const deep = variant === "deep";
  return (
    <button
      style={{ flex: "0 0 268px", height: 64, borderRadius: 6 }}
      className={cn(
        "group flex items-center justify-between pl-6 pr-[22px] border transition-all duration-200 ease-out hover:translate-y-[-2px]",
        light
          ? "bg-white border-white text-[#071A2B] shadow-[0_8px_24px_rgba(0,0,0,0.16)] hover:bg-[#FFFEFC] hover:border-[#FFFEFC] hover:shadow-[0_14px_34px_rgba(0,0,0,0.18),0_0_28px_rgba(255,196,0,0.18),0_0_56px_rgba(255,196,0,0.08)]"
          : deep
            ? "bg-[#0A1426] border-[rgba(255,255,255,0.16)] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-[#0F1E33] hover:border-white/25 hover:shadow-[0_12px_30px_rgba(0,0,0,0.24),0_0_22px_rgba(255,196,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
            : "bg-[#0D1F33] border-[rgba(255,255,255,0.16)] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-[#122840] hover:border-white/25 hover:shadow-[0_12px_30px_rgba(0,0,0,0.24),0_0_22px_rgba(255,196,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
      )}
    >
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
