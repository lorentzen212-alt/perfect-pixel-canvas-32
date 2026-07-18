import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Users,
  Briefcase,
  ClipboardList,
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
  Timer,
  Send,
  Facebook,
  Instagram,
  Linkedin,
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
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5">
            <CTAButton icon={<Users size={22} strokeWidth={2} />} label="Book Leisure" variant="light" />
            <CTAButton icon={<Briefcase size={22} strokeWidth={2} />} label="Book M&E" variant="dark" />
            <CTAButton icon={<ClipboardList size={22} strokeWidth={2} />} label="Manage My Bookings" variant="dark" />
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
    <PopularDestinations />
    <WhyChoose />
    <FinalCTA />
    <SiteFooter />
    </>
  );
}

const SERIF = '"Cormorant Garamond", Georgia, serif';

function SectionHeading({ title, subtitle, dark = false }: { title: string; subtitle: string; dark?: boolean }) {
  return (
    <div className="text-center">
      <h3
        className={cn("text-3xl sm:text-4xl lg:text-[44px] font-medium leading-tight", dark ? "text-white" : "text-[#04111A]")}
        style={{ fontFamily: SERIF }}
      >
        {title}
      </h3>
      <div className="mx-auto mt-3 flex items-center justify-center gap-2">
        <div className="h-[2px] w-16 bg-[#FFC400]" />
        <div className="h-[8px] w-[8px] rotate-45 bg-[#FFC400]" />
        <div className="h-[2px] w-16 bg-[#FFC400]" />
      </div>
      <p className={cn("mt-4 text-base sm:text-lg", dark ? "text-white/75" : "text-[#4a5764]")}>{subtitle}</p>
    </div>
  );
}

function HowItWorks() {
  const steps = [
    { n: 1, Icon: FileText, title: "Submit Your Request", body: "Tell us where, when and how many guests you're planning for." },
    { n: 2, Icon: Building2, title: "Receive Hotel Offers", body: "We send your request to multiple hotels that compete to offer their best rates." },
    { n: 3, Icon: CheckCircle2, title: "Book With Confidence", body: "Compare offers, choose the best option and confirm in one place." },
  ];
  return (
    <section className="bg-[#F7F5F2] py-20 lg:py-24 px-5 sm:px-8 lg:px-[60px]">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="How It Works" subtitle="Simple. Fast. Built for groups." />
        <div className="relative mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {steps.map(({ n, Icon, title, body }, i) => (
            <div key={n} className="relative flex flex-col items-center text-center px-4">
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-[36px] left-[calc(50%+56px)] right-[calc(-50%+56px)] border-t-2 border-dotted border-[#FFC400]/60"
                  aria-hidden
                />
              )}
              <div className="relative">
                <span className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#FFC400] bg-white text-[11px] font-semibold text-[#04111A]">
                  {n}
                </span>
                <div className="grid h-[72px] w-[72px] place-items-center rounded-full bg-[#04111A]">
                  <Icon className="text-[#FFC400]" size={30} strokeWidth={1.75} />
                </div>
              </div>
              <h4 className="mt-5 text-lg font-semibold text-[#04111A]">{title}</h4>
              <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-[#4a5764]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const DESTINATIONS = [
  { name: "Lofoten", country: "Norway", img: lofotenImg },
  { name: "Tromsø", country: "Norway", img: tromsoImg },
  { name: "Bergen", country: "Norway", img: bergenImg },
  { name: "Geiranger", country: "Norway", img: geirangerImg },
  { name: "Stockholm", country: "Sweden", img: stockholmImg },
  { name: "Copenhagen", country: "Denmark", img: copenhagenImg },
];

function PopularDestinations() {
  return (
    <section className="bg-[#04111A] py-20 lg:py-24 px-5 sm:px-8 lg:px-[60px]">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Popular Group Destinations" subtitle="Explore handpicked destinations perfect for your next group trip." dark />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DESTINATIONS.map((d) => (
            <a key={d.name} href="#" className="group relative overflow-hidden rounded-xl aspect-[3/4] block ring-1 ring-white/5 transition-transform hover:-translate-y-1">
              <img src={d.img} alt={`${d.name}, ${d.country}`} width={800} height={600} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="flex items-start gap-1.5">
                  <MapPin className="text-[#FFC400] mt-[2px] shrink-0" size={14} strokeWidth={2.25} />
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wide text-white/70">{d.country}</p>
                    <p className="text-white text-base font-semibold leading-tight truncate">{d.name}</p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <a href="#" className="inline-flex items-center gap-2 rounded-md border border-[#F5AE00] px-6 py-3 text-white text-[15px] transition-colors hover:bg-[#F5AE00]/10">
            View All Destinations
            <ArrowRight size={18} className="text-[#F5AE00]" />
          </a>
        </div>
      </div>
    </section>
  );
}

function WhyChoose() {
  const items = [
    { Icon: Gem, title: "Best Rates", body: "Hotels compete for your group and offer their best possible rates." },
    { Icon: Timer, title: "Save Time", body: "One request instead of dozens of emails." },
    { Icon: Users, title: "Expert Support", body: "Personal service from experienced group booking professionals." },
    { Icon: ShieldCheck, title: "Secure & Trusted", body: "Your data is safe with us. No commitment." },
  ];
  return (
    <section className="bg-[#F7F5F2] py-20 lg:py-24 px-5 sm:px-8 lg:px-[60px]">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title="Why Choose HotelGroupBook?" subtitle="The smarter way to manage group hotel bookings." />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-xl bg-white p-6 text-center shadow-[0_2px_10px_rgba(4,17,26,0.05)] ring-1 ring-black/[0.04]">
              <div className="mx-auto grid h-14 w-14 place-items-center">
                <Icon className="text-[#F5AE00]" size={36} strokeWidth={1.75} />
              </div>
              <h4 className="mt-3 text-lg font-semibold text-[#04111A]">{title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#4a5764]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-[#04111A] px-5 sm:px-8 lg:px-[60px] py-16 lg:py-20">
      <div className="mx-auto max-w-6xl rounded-2xl bg-gradient-to-br from-[#0a1a28] to-[#04111A] ring-1 ring-white/10 p-8 lg:p-12 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10">
        <div className="flex-1">
          <h3 className="text-white text-3xl lg:text-[38px] font-medium leading-tight" style={{ fontFamily: SERIF }}>
            Ready to Receive Hotel Offers for Your Group?
          </h3>
          <p className="mt-3 text-white/75 text-base lg:text-lg">Start your request today. It's free and without obligation.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button className="group inline-flex items-center justify-center gap-2 rounded-md bg-[#F5AE00] px-6 py-3.5 text-[#04111A] text-[15px] font-semibold transition-colors hover:brightness-95">
            Start a Leisure Request
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button className="group inline-flex items-center justify-center gap-2 rounded-md border border-white/40 bg-transparent px-6 py-3.5 text-white text-[15px] font-semibold transition-colors hover:bg-white/5">
            Request M&amp;E
            <ArrowRight size={18} className="text-[#F5AE00] transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const cols: { title: string; links: string[] }[] = [
    { title: "Company", links: ["About Us", "Become a Partner", "How It Works", "Contact"] },
    { title: "Destinations", links: ["Norway", "Sweden", "Denmark", "All Destinations"] },
    { title: "Support", links: ["Help Center", "FAQ", "Terms of Use", "Privacy Policy"] },
  ];
  return (
    <footer className="bg-[#02090f] text-white/80 px-5 sm:px-8 lg:px-[60px] pt-16 pb-8">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-2">
          <p className="text-white text-2xl" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>HotelGroupBook</p>
          <p className="mt-2 text-sm text-white/60">Group hotel bookings made simple.</p>
          <div className="mt-5 flex gap-3">
            {[Linkedin, Facebook, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors" aria-label="Social link">
                <Icon size={16} className="text-white/80" />
              </a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h5 className="text-white text-sm font-semibold tracking-wide">{c.title}</h5>
            <ul className="mt-4 space-y-2 text-sm">
              {c.links.map((l) => (
                <li key={l}><a href="#" className="text-white/65 hover:text-[#F5AE00] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h5 className="text-white text-sm font-semibold tracking-wide">Newsletter</h5>
          <p className="mt-4 text-sm text-white/65">Get tips and news for group travel straight to your inbox.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex overflow-hidden rounded-md bg-white/5 ring-1 ring-white/10 focus-within:ring-white/25">
            <input type="email" required placeholder="Your email" className="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none" />
            <button type="submit" className="grid place-items-center bg-[#F5AE00] px-3.5 text-[#04111A] hover:brightness-95 transition-[filter]" aria-label="Subscribe">
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-6xl mt-12 pt-6 border-t border-white/10 text-xs text-white/50 flex flex-wrap justify-between gap-3">
        <p>© {new Date().getFullYear()} HotelGroupBook. All rights reserved.</p>
        <p>Made for group travel professionals.</p>
      </div>
    </footer>
  );
}

function CTAButton({
  icon,
  label,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  variant: "light" | "dark";
}) {
  const light = variant === "light";
  return (
    <button
      className={`group flex items-center justify-between rounded-[10px] h-[62px] px-5 border transition-all ${
        light
          ? "bg-[#F7F5F2] border-[#F7F5F2] hover:brightness-95"
          : "bg-[#182632] border-[#3A4753] hover:bg-[#1f2f3d]"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className={light ? "text-[#F5AE00]" : "text-[#F5AE00]"}>{icon}</span>
        <span
          className={`text-[17px] font-semibold ${light ? "text-black" : "text-[#F7F7F5]"}`}
        >
          {label}
        </span>
      </span>
      <ArrowRight
        className="text-[#F5AE00] transition-transform group-hover:translate-x-1"
        size={22}
        strokeWidth={2.25}
      />
    </button>
  );
}
