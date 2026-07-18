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

const TRUST = [
  { Icon: ShieldCheck, label: "No commitment" },
  { Icon: Clock, label: "Fast and free" },
  { Icon: Headphones, label: "Expert support" },
  { Icon: Lock, label: "Secure & trusted" },
];

function GoldLineWithDiamond({
  className,
  lineWidth = "w-[260px] sm:w-[300px] lg:w-[330px]",
}: {
  className?: string;
  lineWidth?: string;
}) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className={cn("h-[2px] bg-[#FFC400]", lineWidth)} />
      <div className="ml-5 h-[10px] w-[10px] rotate-45 bg-[#FFC400]" />
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
        <header className="flex items-start justify-between pt-[2px] lg:pt-[10px] px-5 sm:px-8 lg:px-[50px] xl:px-[60px]">
          <div>
            <h1
              className="font-normal leading-none text-[#F7F7F5] text-3xl sm:text-4xl lg:text-[42px]"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              HotelGroupBook
            </h1>
            <div className="mt-2 h-px w-full bg-white/70" />
            <p className="mt-2 text-[#E8E8E4] text-sm sm:text-base lg:text-[16px] font-light">
              Group hotel bookings made simple
            </p>
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          <nav className="hidden lg:flex items-center gap-10 pt-[2px]">
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
          <GoldLineWithDiamond lineWidth="w-[110px] sm:w-[115px] lg:w-[125px]" />

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

          <GoldLineWithDiamond className="mt-4" lineWidth="w-[190px] sm:w-[200px] lg:w-[210px]" />

          <p className="mt-[39px] text-white text-xl sm:text-2xl lg:text-[28px] leading-[1.25] font-normal font-sans">
            The easiest way to request
            <br />
            hotel offers for groups.
          </p>

          {/* CTA BUTTONS */}
          <div className="mt-10 flex flex-nowrap items-center gap-4">
            <CTAButton icon={<Users size={26} strokeWidth={1.9} />} label="Book Leisure" variant="light" />
            <CTAButton icon={<Briefcase size={26} strokeWidth={1.9} />} label="Book M&E" variant="dark" />
            <CTAButton
              icon={<CalendarDays size={26} strokeWidth={1.9} />}
              label={
                <>
                  Manage My
                  <br />
                  Bookings
                </>
              }
              variant="dark"
            />
          </div>

          {/* TRUST ROW */}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            {TRUST.map(({ Icon, label }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="text-[#F5AE00]" size={22} strokeWidth={2} />
                <span className="text-[#F7F7F5] text-[16px] lg:text-[17px]">{label}</span>
              </div>
            ))}
          </div>

          {/* BUILT BY */}
          <div className="mt-5 flex items-start gap-3">
            <UsersRound className="text-[#F5AE00] shrink-0 mt-0.5" size={26} strokeWidth={2} />
            <p className="text-[#F7F7F5] text-[15px] lg:text-[16px] leading-snug">
              Built by group booking professionals
              <br className="hidden sm:block" />
              with experience from 10,000+ groups.
            </p>
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
  width,
}: {
  icon: React.ReactNode;
  label: string;
  variant: "light" | "dark";
  width: number;
}) {
  const light = variant === "light";
  return (
    <button
      style={{ width, height: 64 }}
      className={cn(
        "group flex items-center justify-between rounded-[13px] pl-6 pr-[22px] border transition-all duration-200 ease-out hover:translate-y-[-2px] w-full sm:w-auto",
        light
          ? "bg-white border-white text-[#071A2B] shadow-[0_8px_24px_rgba(0,0,0,0.16),0_0_18px_rgba(255,196,0,0.06)] hover:bg-[#FAFAFA] hover:shadow-[0_12px_30px_rgba(0,0,0,0.2),0_0_22px_rgba(255,196,0,0.12)]"
          : "bg-[#0F2A47] border-[rgba(255,255,255,0.18)] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-[#143557] hover:border-white/25 hover:shadow-[0_12px_30px_rgba(0,0,0,0.24),0_0_22px_rgba(255,196,0,0.12),inset_0_1px_0_rgba(255,255,255,0.08)]"
      )}
    >
      <span className="flex items-center" style={{ gap: 18 }}>
        <span className="text-[#FFC400] flex items-center shrink-0">{icon}</span>
        <span className={cn("text-[17px] font-semibold leading-none whitespace-nowrap", light ? "text-[#071A2B]" : "text-white")}>
          {label}
        </span>
      </span>
      <ArrowRight
        className="text-[#FFC400] transition-transform group-hover:translate-x-1 shrink-0"
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
            <div className="flex items-center gap-2">
              <Mountain className="text-[#F5AE00]" size={26} strokeWidth={1.75} />
              <span
                className="text-white text-2xl"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                HotelGroupBook
              </span>
            </div>
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
