import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  Home as HomeIcon,
  CalendarDays,
  Briefcase,
  Info,
  Mail,
} from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { useAuth } from "@/lib/auth";

const NAVY = "#08131F";
const GOLD = "#D4A64A";
const GOLD_SOFT = "#E8C775";
const IVORY = "#F5F1E6";

export type BookingStepKey = 1 | 2 | 3 | 4 | 5 | 6;

const STEP_LABELS = [
  "Destination",
  "Accommodation",
  "Extras",
  "Experiences",
  "Contact",
  "Review",
];

interface BookingHeaderProps {
  currentStep: BookingStepKey;
  onStepGo?: (s: BookingStepKey) => void;
  hideCurrentFlow?: "leisure" | "me" | "manage";
  /** Slightly tighter vertical padding (used by compact step layouts). */
  compact?: boolean;
  /** Override the header surface so it can blend into the page beneath it. */
  background?: string;
}

export function BookingHeader({
  currentStep,
  onStepGo,
  hideCurrentFlow = "leisure",
  compact = false,
  background,
}: BookingHeaderProps) {

  const [menuOpen, setMenuOpen] = useState(false);
  // One global session — the same provider Manage My Bookings reads from.
  const { isAuthenticated, user, profile, signOut } = useAuth();
  const accountLabel =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    profile?.email ||
    user?.email ||
    "My account";
  const accountInitials =
    accountLabel
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "MA";

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const navItems = [
    { label: "Home", to: "/", icon: HomeIcon, key: "home" },
    {
      label: "Book Leisure",
      to: "/book-leisure",
      icon: Briefcase,
      key: "leisure",
    },
    {
      label: "Book Meetings & Events",
      to: "/book-meetings-events",
      icon: CalendarDays,
      key: "me",
    },
    {
      label: "Manage Bookings",
      to: "/manage-bookings",
      icon: Briefcase,
      key: "manage",
    },
    { label: "About", to: "/", icon: Info, key: "about" },
    { label: "Contact", to: "/", icon: Mail, key: "contact" },
  ].filter((i) => i.key !== hideCurrentFlow);

  return (
    <>
      <header className="w-full" style={{ background: background ?? NAVY }}>
        <div
          className={`relative mx-auto flex max-w-[1600px] items-center px-6 lg:px-10 ${
            compact ? "py-[19px] lg:py-[22px]" : "py-6 lg:py-7"
          }`}
        >
          {/* Logo (left) */}
          <Link to="/" className="flex shrink-0 items-center" aria-label="HotelGroupBook home">
            <BrandLogo size="md" tone="dark" />
          </Link>


          {/* Stepper (absolutely centred so logo/menu width can't push it) */}
          <ol className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-x-3 md:flex lg:gap-x-5">
            {([1, 2, 3, 4, 5, 6] as BookingStepKey[]).map((n, i) => {
              const active = n === currentStep;
              return (
                <li key={n} className="pointer-events-auto flex items-center gap-3 lg:gap-5">
                  <button
                    type="button"
                    onClick={() => onStepGo?.(n)}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full text-[13px] font-semibold transition-all"
                      style={{
                        background: active
                          ? `linear-gradient(135deg, ${GOLD_SOFT}, ${GOLD})`
                          : "transparent",
                        color: active ? NAVY : "rgba(245,241,230,0.75)",
                        border: `1px solid ${active ? GOLD : "rgba(245,241,230,0.35)"}`,
                        boxShadow: active
                          ? "0 6px 18px -8px rgba(212,166,74,0.55)"
                          : "none",
                      }}
                    >
                      {n}
                    </span>
                    <span
                      className="text-[11px] tracking-wide"
                      style={{
                        color: active ? GOLD : "rgba(245,241,230,0.7)",
                        fontWeight: active ? 600 : 500,
                      }}
                    >
                      {STEP_LABELS[i]}
                    </span>
                  </button>
                  {i < 5 && (
                    <span
                      className="mt-[-14px] h-px w-6 lg:w-10"
                      style={{ backgroundColor: "rgba(245,241,230,0.22)" }}
                    />
                  )}
                </li>
              );
            })}
          </ol>

          {/* Account state (global auth) — compact so it never crowds the stepper */}
          <div className="ml-auto flex shrink-0 items-center">
            {isAuthenticated ? (
              <Link
                to="/account"
                title={accountLabel}
                aria-label={`Account: ${accountLabel}`}
                className="grid h-9 w-9 place-items-center rounded-full text-[11.5px] font-semibold tracking-[0.04em] transition-colors hover:bg-white/10"
                style={{ color: GOLD_SOFT, border: `1px solid ${GOLD}66`, background: "rgba(255,255,255,0.04)" }}
              >
                {accountInitials}
              </Link>
            ) : (
              <Link
                to="/auth"
                className="hidden rounded-full px-3 py-1.5 text-[12px] transition-colors hover:bg-white/5 sm:inline-block"
                style={{ color: GOLD_SOFT, border: `1px solid ${GOLD}55` }}
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Menu (right) */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="ml-3 flex shrink-0 items-center gap-3 rounded-md px-2 py-1 transition-colors hover:bg-white/5"
          >
            <span className="flex flex-col items-center justify-center gap-[5px]">
              <span className="h-px w-6" style={{ background: GOLD }} />
              <span className="h-px w-6" style={{ background: GOLD }} />
              <span className="h-px w-6" style={{ background: GOLD }} />
            </span>
            <span
              className="hidden text-[13px] tracking-[0.18em] sm:inline"
              style={{ color: IVORY }}
            >
              Menu
            </span>
          </button>
        </div>

        {/* Mobile stepper: compact horizontal scroll */}
        <div className="md:hidden">
          <ol
            className="mx-auto flex max-w-full items-center gap-x-3 overflow-x-auto px-6 pb-4"
            style={{ scrollbarWidth: "none" }}
          >
            {([1, 2, 3, 4, 5, 6] as BookingStepKey[]).map((n, i) => {
              const active = n === currentStep;
              return (
                <li key={n} className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onStepGo?.(n)}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold"
                      style={{
                        background: active
                          ? `linear-gradient(135deg, ${GOLD_SOFT}, ${GOLD})`
                          : "transparent",
                        color: active ? NAVY : "rgba(245,241,230,0.75)",
                        border: `1px solid ${active ? GOLD : "rgba(245,241,230,0.35)"}`,
                      }}
                    >
                      {n}
                    </span>
                    <span
                      className="whitespace-nowrap text-[10.5px] tracking-wide"
                      style={{
                        color: active ? GOLD : "rgba(245,241,230,0.7)",
                        fontWeight: active ? 600 : 500,
                      }}
                    >
                      {STEP_LABELS[i]}
                    </span>
                  </button>
                  {i < 5 && (
                    <span
                      className="h-px w-4"
                      style={{ backgroundColor: "rgba(245,241,230,0.22)" }}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      {/* Overlay + side panel */}
      <div
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[90] transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: "rgba(4,10,18,0.55)" }}
        onClick={() => setMenuOpen(false)}
      />
      <aside
        role="dialog"
        aria-label="Site menu"
        aria-hidden={!menuOpen}
        className={`fixed right-0 top-0 z-[100] flex h-full w-[86vw] max-w-[380px] flex-col transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: `linear-gradient(180deg, #0B1826 0%, ${NAVY} 100%)`,
          borderLeft: `1px solid ${GOLD}55`,
          boxShadow: "-24px 0 60px -20px rgba(0,0,0,0.55)",
        }}
      >
        <div className="flex items-center justify-between px-7 pt-8">
          <span
            className="text-[12px] tracking-[0.32em]"
            style={{ color: GOLD, fontWeight: 600 }}
          >
            MENU
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-white/5"
            style={{ color: GOLD, border: `1px solid ${GOLD}55` }}
          >
            <X size={16} />
          </button>
        </div>
        <div
          className="mx-7 mt-5 h-px"
          style={{ background: `linear-gradient(90deg, ${GOLD}00, ${GOLD}88, ${GOLD}00)` }}
        />
        <nav className="mt-4 flex flex-col px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center gap-4 rounded-lg px-4 py-3.5 transition-all hover:translate-x-1"
                style={{ color: IVORY }}
              >
                <Icon size={18} style={{ color: GOLD }} />
                <span
                  className="text-[15px] tracking-[0.02em] transition-colors group-hover:text-[color:var(--gold)]"
                  style={{ ["--gold" as never]: GOLD_SOFT }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div
          className="mx-7 mt-6 h-px"
          style={{ background: `linear-gradient(90deg, ${GOLD}00, ${GOLD}55, ${GOLD}00)` }}
        />
        <div className="mt-6 px-7">
          {isAuthenticated ? (
            <>
              <p className="text-[11px] tracking-[0.2em]" style={{ color: "rgba(245,241,230,0.45)" }}>
                SIGNED IN
              </p>
              <p className="mt-1 truncate text-[13.5px]" style={{ color: IVORY }}>
                {accountLabel}
              </p>
              <div className="mt-3 flex items-center gap-4">
                <Link
                  to="/account"
                  onClick={() => setMenuOpen(false)}
                  className="text-[13px] underline"
                  style={{ color: GOLD_SOFT }}
                >
                  My account
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    setMenuOpen(false);
                    await signOut();
                  }}
                  className="text-[13px] underline"
                  style={{ color: "rgba(245,241,230,0.65)" }}
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMenuOpen(false)}
              className="text-[13px] underline"
              style={{ color: GOLD_SOFT }}
            >
              Sign in / Create account
            </Link>
          )}
        </div>
        <div className="mt-auto px-7 pb-8 pt-6">
          <p className="text-[11.5px] tracking-[0.14em]" style={{ color: "rgba(245,241,230,0.55)" }}>
            HOTELGROUPBOOK · SCANDINAVIA
          </p>
        </div>
      </aside>
    </>
  );
}
