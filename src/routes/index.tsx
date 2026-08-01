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
      {/* Homepage background — supplied video, rendered unfiltered at native colors */}
      <HomeBackgroundVideo />







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
        <section className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-6 pt-0 pb-0 text-center lg:min-h-[calc(100vh-88px)] flex flex-col justify-center -translate-y-[35px]">
          {/* Eyebrow */}
          <div className="flex items-center justify-center">
            <span
              className="text-[11.25px] tracking-[0.4em] uppercase"
              style={{
                color: "#E5A93C",
                fontWeight: 600,
                WebkitFontSmoothing: "antialiased",
                textRendering: "optimizeLegibility",
              }}
            >
              The Experience
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mx-auto max-w-[980px] font-light text-white leading-[1.16] text-[40px] sm:text-[54px] lg:text-[clamp(42px,3.6vh_+_1.5vw,62px)]"
            style={{
              marginTop: "clamp(14px, 1.8vh, 18px)",
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              letterSpacing: "0.012em",
              fontWeight: 300,
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              textRendering: "optimizeLegibility",
              fontKerning: "normal",
              fontVariantLigatures: "common-ligatures",
            }}
          >
            <span className="block">Three ways to</span>
            <span className="block">
              <em className="italic" style={{ color: "#E2921F", fontWeight: 400 }}>
                exceptional
              </em>{" "}
              group stays
            </span>
          </h1>

          {/* Gold divider */}
          <div
            className="flex items-center justify-center"
            style={{ marginTop: "clamp(10px, 1.4vh, 14px)" }}
          >
            <div
              className="h-px w-[110px] lg:w-[130px]"
              style={{
                background:
                  "linear-gradient(to right, rgba(214,172,106,0) 0%, rgba(224,183,112,0.75) 45%, rgba(232,190,120,0.98) 100%)",
              }}
            />
            <div
              className="mx-[14px] h-[7px] w-[7px] rotate-45"
              style={{ background: "#E2B473" }}
            />
            <div
              className="h-px w-[110px] lg:w-[130px]"
              style={{
                background:
                  "linear-gradient(to left, rgba(214,172,106,0) 0%, rgba(224,183,112,0.75) 45%, rgba(232,190,120,0.98) 100%)",
              }}
            />
          </div>

          <p
            className="text-white/80 text-[15px] lg:text-[16px] font-light tracking-[0.02em]"
            style={{ marginTop: "clamp(8px, 1.1vh, 10px)" }}
          >
            One request. Everything handled.
          </p>




          {/* EXPERIENCE CARDS */}
          <div className="relative" style={{ marginTop: "clamp(14px, 1.9vh, 18px)" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-[44px]">

              <ExperienceCard
                to="/book-leisure"
                image={cardLeisureAsset.url}
                imagePosition="center 35%"
                label="LEISURE"
                tagline="Group Hotel Booking"
                ctaText="Explore"
              />
              <ExperienceCard
                to="/book-meetings-events"
                image={cardMeAsset.url}
                imagePosition="center center"
                label="M & E"
                tagline="Professional Event Planning"
                ctaText="Plan event"
              />
              <ExperienceCard
                to="/manage-bookings"
                image={cardManageAsset.url}
                imagePosition="center center"
                label="MANAGE"
                tagline="Manage Your Bookings"
                ctaText="Open dashboard"
              />
            </div>
          </div>



          {/* TRUST BAR */}
          <section style={{ marginTop: "clamp(26px, 3.6vh, 35px)", paddingBottom: "clamp(28px, 5vh, 56px)" }}>

            <div
              className="mx-auto flex w-fit max-w-full flex-wrap items-center justify-center gap-x-[52px] gap-y-2 rounded-[5px] px-[44px] py-[10px]"
              style={{
                backgroundColor: 'rgba(9,18,28,0.22)',
                borderTop: '1px solid rgba(222,205,164,0.22)',
                borderBottom: '1px solid rgba(222,205,164,0.22)',
                backdropFilter: 'blur(3px)',
              }}
            >

              {['One Request', 'One Team', 'One Contact', 'Total Simplicity'].map((item, i) => (
                <div key={item} className="flex items-center gap-x-[52px]">
                  {i > 0 && (
                    <span
                      className="inline-flex items-center justify-center text-[13px] leading-none"
                      style={{ color: '#E9A63C', transform: 'translateY(-0.5px)' }}
                      aria-hidden
                    >
                      &#10022;
                    </span>
                  )}

                  <span
                    className="whitespace-nowrap text-[14px] leading-none tracking-[0.045em]"
                    style={{
                      color: 'rgba(248,246,242,0.97)',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

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
  label,
  tagline,
  ctaText,
}: {
  to: string;
  image: string;
  imagePosition?: string;
  imageFilter?: string;
  overlay?: string;
  bottomGradient?: boolean;
  borderGradient?: string;
  disableCoolGrey?: boolean;
  label: string;
  tagline: React.ReactNode;
  ctaText: string;
  intensity?: number;
}) {
  const baseShadow =
    "0 18px 40px rgba(4, 10, 15, 0.16), 0 2px 8px rgba(4, 10, 15, 0.10)";
  const hoverShadow =
    "0 24px 52px rgba(4, 10, 15, 0.22), 0 3px 10px rgba(4, 10, 15, 0.12)";
  const ease = "400ms cubic-bezier(0.22, 1, 0.36, 1)";

  return (
    <Link
      to={to}
      className="group/card relative block overflow-hidden"
      style={{
        borderRadius: "3px",
        border: "1px solid rgba(222, 205, 164, 0.38)",
        boxShadow: baseShadow,
        transition: `transform ${ease}, box-shadow ${ease}, border-color ${ease}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = hoverShadow;
        e.currentTarget.style.borderColor = "rgba(230, 210, 165, 0.52)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = baseShadow;
        e.currentTarget.style.borderColor = "rgba(222, 205, 164, 0.38)";
      }}
    >
      {/* Image panel — near-square vertical proportion */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "1 / 1.12" }}
      >
        <img
          src={image}
          alt=""
          style={{
            objectPosition: imagePosition,
            transition: `transform ${ease}`,
          }}
          className="absolute inset-0 h-full w-full object-cover group-hover/card:scale-[1.015]"
        />

        {/* Subtle bottom readability gradient only */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,9,12,0) 48%, rgba(5,9,12,0.22) 70%, rgba(5,9,12,0.72) 100%)",
          }}
        />

        {/* Editorial text block */}
        <div
          className="absolute inset-x-0 bottom-0 z-20 text-left"
          style={{ paddingLeft: 28, paddingRight: 28, paddingBottom: 26 }}
        >
          <p
            className="uppercase"
            style={{
              color: "#FFFFFF",
              fontSize: "18px",
              fontWeight: 500,
              letterSpacing: "0.28em",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </p>
          <p
            style={{
              marginTop: "6px",
              color: "rgba(255,255,255,0.76)",
              fontSize: "13.5px",
              fontWeight: 400,
              lineHeight: 1.45,
            }}
          >
            {tagline}
          </p>
          <span
            className="flex items-center"
            style={{
              marginTop: "22px",
              color: "#FFFFFF",
              fontSize: "13.5px",
              fontWeight: 500,
              whiteSpace: "nowrap",
            }}
          >
            {ctaText}
            <span className="ml-[10px] inline-block transition-transform duration-[400ms] ease-out group-hover/card:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
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
