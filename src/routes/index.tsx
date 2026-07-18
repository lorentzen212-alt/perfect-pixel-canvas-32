import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase,
  CalendarDays,
  ClipboardList,
  ArrowRight,
  ChevronDown,
  User,
  Building2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X,
} from "lucide-react";
import heroAsset from "@/assets/hero-bg.png.asset.json";

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
  { label: "How it works", href: "#how-it-works" },
  { label: "About us", href: "#about" },
  { label: "Destinations", href: "#destinations" },
  { label: "Contact", href: "#contact" },
];

const STEPS = [
  {
    Icon: User,
    title: "You send one request",
    body: ["Tell us about your group needs", "and preferences."],
  },
  {
    Icon: Building2,
    title: "We contact hotels",
    body: ["We reach out to multiple hotels", "on your behalf."],
  },
  {
    Icon: FileText,
    title: "You compare offers",
    body: ["Receive and review the best", "offers for your group."],
  },
  {
    Icon: ShieldCheck,
    title: "You confirm booking",
    body: ["We finalize the details and", "secure your booking."],
  },
];

function Home() {
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("EN");
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
      <div className="pointer-events-none absolute inset-0 bg-black/15" aria-hidden="true" />

      <div className="relative z-10 mx-auto w-full max-w-[1470px] px-5 sm:px-8 lg:px-[34px]">
        {/* HEADER */}
        <header className="flex flex-col gap-6 pt-6 lg:pt-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start justify-between lg:block">
            <div>
              <h1
                className="font-bold leading-none text-[#F7F7F5] text-4xl sm:text-5xl lg:text-[62px]"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                <span className="inline-block border-b-2 border-[#F7F7F5] pb-2">
                  HotelGroupBook
                </span>
              </h1>
              <p className="mt-3 text-[#E8E8E4] text-base sm:text-lg lg:text-[25px] font-light">
                Group hotel bookings made simple.
              </p>
            </div>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          <nav
            className={`${
              mobileOpen ? "flex" : "hidden"
            } flex-col gap-4 lg:flex lg:flex-row lg:items-center lg:gap-10 lg:pt-4 lg:flex-1 lg:justify-center`}
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-white text-base lg:text-[21px] font-normal transition-colors hover:text-[#F5AE00]"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div
            className={`${
              mobileOpen ? "flex" : "hidden"
            } lg:flex items-center gap-3 lg:pt-2`}
          >
            <button className="flex items-center gap-2 rounded-xl border border-[#F5AE00] bg-[rgba(2,18,29,0.6)] px-5 h-[54px] transition-all hover:bg-[rgba(2,18,29,0.8)] hover:brightness-110">
              <User className="text-[#F5AE00]" size={20} strokeWidth={1.75} />
              <span className="text-[#F5AE00] text-[17px] font-medium">Login</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-white/70 bg-[rgba(2,18,29,0.6)] px-4 h-[54px] transition-all hover:bg-[rgba(2,18,29,0.8)]"
              >
                <span className="text-white text-[17px] font-medium">{lang}</span>
                <ChevronDown className="text-white" size={18} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-28 rounded-lg border border-white/20 bg-[rgba(4,17,26,0.95)] backdrop-blur py-1 z-20">
                  {["EN", "DE", "FR", "ES"].map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setLang(code);
                        setLangOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-white text-sm hover:bg-white/10"
                    >
                      {code}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN */}
        <div className="grid gap-10 pt-10 lg:grid-cols-[1fr_380px] lg:gap-8 lg:pt-[110px]">
          <div className="max-w-[720px]">
            <h2
              className="font-bold text-[#F7F7F5] leading-[1.18] text-4xl sm:text-5xl lg:text-[73px]"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              The easiest way
              <br />
              to request hotel offers
              <br />
              <span className="text-[#F5AE00]">for groups.</span>
            </h2>

            <p className="mt-[22px] text-[#F7F7F5] text-lg sm:text-xl lg:text-[27px] leading-[1.35] font-light">
              One request. Multiple hotels.
              <br />
              The best choice for your group.
            </p>

            <div className="mt-8 flex flex-col gap-5" style={{ maxWidth: 740 }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ActionCard icon={<Briefcase size={26} strokeWidth={1.75} />} label="Book Leisure" variant="gold" />
                <ActionCard icon={<CalendarDays size={26} strokeWidth={1.75} />} label="Book M&E" variant="white" />
              </div>
              <ActionCard icon={<ClipboardList size={26} strokeWidth={1.75} />} label="Manage Bookings" variant="white" tall />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[#F7F7F5]">
              {["Multiple hotel offers", "Expert handled", "Clear contracts"].map((label, i) => (
                <div key={label} className="flex items-center gap-6">
                  {i > 0 && <span className="hidden sm:block h-5 w-px bg-white/30" />}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="text-[#F5AE00]" size={22} strokeWidth={1.75} />
                    <span className="text-[15px] lg:text-[19px]">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <aside
            id="how-it-works"
            className="relative w-full lg:w-[380px] lg:justify-self-end rounded-[35px] border border-[#F5AE00]/80 bg-[rgba(2,18,29,0.82)] backdrop-blur-md p-7"
          >
            <h3
              className="text-center text-[#F7F7F5] text-3xl lg:text-[40px] font-semibold"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              How it works
            </h3>
            <div className="mx-auto mt-2 h-[2px] w-14 bg-[#F5AE00]" />

            <ol className="relative mt-8 flex flex-col gap-7">
              <span
                aria-hidden="true"
                className="absolute left-[27px] top-[54px] bottom-[54px] w-px border-l-2 border-dotted border-[#F5AE00]/70"
              />
              {STEPS.map(({ Icon, title, body }) => (
                <li key={title} className="relative flex gap-4">
                  <span className="relative z-10 flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-[#F5AE00] bg-[rgba(2,18,29,0.9)]">
                    <Icon className="text-[#F5AE00]" size={24} strokeWidth={1.75} />
                  </span>
                  <div className="pt-1">
                    <h4 className="text-[#F7F7F5] font-bold text-[19px] leading-tight">{title}</h4>
                    <p className="mt-1 text-[#E8E8E4] text-[16px] leading-[1.4]">
                      {body[0]}
                      <br />
                      {body[1]}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <div className="h-16 lg:h-24" />
      </div>
    </main>
  );
}

function ActionCard({
  icon,
  label,
  variant,
  tall,
}: {
  icon: React.ReactNode;
  label: string;
  variant: "gold" | "white";
  tall?: boolean;
}) {
  const gold = variant === "gold";
  return (
    <button
      className={`group flex items-center justify-between rounded-[12px] border bg-[rgba(2,18,29,0.55)] backdrop-blur-sm px-6 transition-all hover:bg-[rgba(2,18,29,0.75)] ${
        gold ? "border-[#F5AE00]" : "border-white/60 hover:border-white"
      }`}
      style={{ height: tall ? 106 : 100 }}
    >
      <span className="flex items-center gap-4">
        <span className={gold ? "text-[#F5AE00]" : "text-[#F7F7F5]"}>{icon}</span>
        <span className={`text-[19px] lg:text-[21px] font-medium ${gold ? "text-[#F5AE00]" : "text-[#F7F7F5]"}`}>
          {label}
        </span>
      </span>
      <ArrowRight
        className={`transition-transform group-hover:translate-x-1 ${gold ? "text-[#F5AE00]" : "text-[#F7F7F5]"}`}
        size={24}
      />
    </button>
  );
}
