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
} from "lucide-react";
import heroAsset from "@/assets/hero-bg.png.asset.json";
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
  { label: "How it works", href: "#how" },
  { label: "Inspiration", href: "#inspiration" },
  { label: "Properties", href: "#properties" },
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
        <header className="flex items-start justify-between pt-8 lg:pt-10 px-5 sm:px-8 lg:px-[50px] xl:px-[60px]">
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

          <nav className="hidden lg:flex items-center gap-10 pt-3">
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
        <section className="ml-5 sm:ml-8 lg:ml-[50px] xl:ml-[60px] pt-[38px] sm:pt-[62px] lg:pt-[92px] pb-16 lg:pb-24 max-w-[720px]">
          <GoldLineWithDiamond />

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

          <GoldLineWithDiamond className="mt-4" />

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
