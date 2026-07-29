import { Link } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  CalendarDays,
  ChevronDown,
  FileText,
  Headphones,
  HelpCircle,
  Menu,
  Plus,
} from "lucide-react";
import logo from "@/assets/hotelgroupbook-logo.png.asset.json";

/* Shared HotelGroupBook dashboard palette (matches /manage-bookings) */
export const PAL = {
  BG: "#1E2C36",
  BG_ALT: "#22303A",
  SIDEBAR: "#0B1D29",
  SIDEBAR_ALT: "#0E2331",
  TOPBAR: "#0C1E2A",
  CARD: "#2B3A45",
  CARD_BORDER: "rgba(154,176,192,0.13)",
  CARD_SHADOW: "0 1px 2px rgba(0,0,0,0.18), 0 8px 20px -14px rgba(0,0,0,0.45)",
  ACTION_PANEL: "#31404B",
  BORDER: "rgba(255,255,255,0.075)",
  TEXT: "#F2F1EC",
  TEXT_2: "#BFC7CD",
  MUTED: "#929DA5",
  GOLD: "#C7A34A",
  GOLD_MID: "#B99135",
  GOLD_DEEP: "rgba(199,163,74,0.55)",
  GOLD_SOFT: "#D0B05A",
  GREEN: "#8DA88A",
} as const;

export const SERIF = '"Cormorant Garamond", Georgia, serif';

const NAV = [
  { label: "Overview", icon: CalendarCheck },
  { label: "Bookings", icon: CalendarDays },
  { label: "Documents", icon: FileText },
  { label: "Support", icon: HelpCircle },
];

export function SidebarContent({ active }: { active: string }) {
  const { SIDEBAR, SIDEBAR_ALT, GOLD_MID, TEXT, TEXT_2, MUTED, GOLD, BORDER } = PAL;
  return (
    <div
      className="flex h-full flex-col px-5 py-6"
      style={{ background: `linear-gradient(180deg, ${SIDEBAR} 0%, ${SIDEBAR_ALT} 100%)` }}
    >
      <Link to="/" className="block">
        <img src={logo.url} alt="HotelGroupBook" className="h-11 w-auto object-contain object-left" />
      </Link>

      <p
        className="mt-9 text-[10.5px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: GOLD_MID }}
      >
        Manage my bookings
      </p>

      <nav className="mt-4 space-y-1">
        {NAV.map((item) => {
          const isActive = item.label === active;
          return (
            <Link
              key={item.label}
              to="/manage-bookings"
              className="relative flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[14px] transition-colors"
              style={{
                backgroundColor: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                color: isActive ? TEXT : TEXT_2,
              }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full"
                  style={{ backgroundColor: GOLD }}
                />
              )}
              <item.icon size={17} style={{ color: isActive ? GOLD : MUTED }} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8">
        <div className="pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="flex items-start gap-3">
            <Headphones size={17} className="mt-0.5 shrink-0" style={{ color: GOLD_MID }} />
            <div className="min-w-0 text-[12.5px]" style={{ color: TEXT_2 }}>
              <p style={{ color: TEXT }}>Need help?</p>
              <p className="mt-1">+47 000 00 000</p>
              <p className="truncate">help@hotelgroupbook.com</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 pt-5" style={{ borderTop: `1px solid ${BORDER}` }}>
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold"
            style={{ backgroundColor: "rgba(199,163,74,0.16)", color: GOLD }}
          >
            EH
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px]" style={{ color: TEXT }}>
              Emma Hansen
            </span>
            <span className="block truncate text-[11.5px]" style={{ color: MUTED }}>
              Nordic Events AS
            </span>
          </span>
          <ChevronDown size={15} style={{ color: MUTED }} />
        </div>
      </div>
    </div>
  );
}

export function TopBar({
  left,
  onOpenNav,
}: {
  left?: React.ReactNode;
  onOpenNav?: () => void;
}) {
  const { TOPBAR, BORDER, TEXT, TEXT_2, MUTED, GOLD, GOLD_DEEP } = PAL;
  return (
    <header
      className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8"
      style={{ backgroundColor: TOPBAR, borderBottom: `1px solid ${BORDER}` }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onOpenNav}
          className="grid h-9 w-9 place-items-center rounded-md lg:hidden"
          style={{ color: TEXT_2, border: `1px solid ${BORDER}` }}
        >
          <Menu size={18} />
        </button>
        {left}
      </div>

      <div className="flex shrink-0 items-center gap-3 sm:gap-5">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium sm:px-4"
          style={{
            backgroundColor: "rgba(255,255,255,0.03)",
            border: `1px solid ${GOLD_DEEP}`,
            color: GOLD,
          }}
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Booking</span>
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-md"
          style={{ color: TEXT_2 }}
        >
          <Bell size={18} />
          <span
            className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-semibold"
            style={{ backgroundColor: GOLD, color: "#1B2A33" }}
          >
            2
          </span>
        </button>

        <button type="button" className="flex items-center gap-2">
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11.5px] font-semibold"
            style={{ backgroundColor: "rgba(199,163,74,0.16)", color: GOLD }}
          >
            EH
          </span>
          <span className="hidden text-[13px] sm:inline" style={{ color: TEXT }}>
            Emma Hansen
          </span>
          <ChevronDown size={15} style={{ color: MUTED }} />
        </button>
      </div>
    </header>
  );
}
