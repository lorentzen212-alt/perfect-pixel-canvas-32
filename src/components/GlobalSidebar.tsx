import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  FileText,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";

const SIDE_TEXT = "rgba(255,255,255,0.90)";
const SIDE_LINE = "rgba(255,255,255,0.06)";
const GOLD_DEEP = "#A9853A";

/* ── sidebar ─────────────────────────────────────────── */

const PRIMARY_NAV = [
  { label: "Dashboard", icon: CalendarCheck },
  { label: "My Bookings", icon: CalendarDays },
  { label: "Rooming Lists", icon: ClipboardList },
  { label: "Documents", icon: FileText },
  { label: "Messages", icon: MessageSquare },
];

const SECONDARY_NAV = [
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
  { label: "Support", icon: LifeBuoy },
];

export const RAIL_EASE = "cubic-bezier(0.4, 0.0, 0.2, 1)";
export const RAIL_MS = 400;

export function GlobalSidebar({
  active,
  roomingBookingId,
  displayName,
  initials,
  email,
  onSignOut,
  collapsed = false,
  showLabels = true,
  onToggle,
}: {
  active: string;
  roomingBookingId?: string;
  displayName: string;
  initials: string;
  email: string;
  onSignOut: () => void;
  collapsed?: boolean;
  showLabels?: boolean;
  onToggle?: () => void;
}) {
  const GOLD_LINE = "linear-gradient(180deg, #D8BE72 0%, #C7A24B 50%, #A97E2E 100%)";

  const renderItem = (
    item: { label: string; icon: typeof User },
    opts: { to?: "/rooming/$bookingId" | "/account"; params?: { bookingId: string } },
  ) => {
    const isActive = item.label === active;
    const style: React.CSSProperties = {
      background: isActive ? "rgba(255,255,255,0.16)" : "transparent",
      color: "rgba(255,255,255,0.90)",
      fontWeight: isActive ? 600 : 400,
      boxShadow: isActive ? "0 8px 18px rgba(0,0,0,0.12)" : "none",
      border: `1px solid ${isActive ? "rgba(255,255,255,0.12)" : "transparent"}`,
      borderRadius: 14,
      padding: collapsed ? "9px 0" : isActive ? "8px 16px" : "9px 16px",
      justifyContent: collapsed ? "center" : "flex-start",
      transition: `padding ${RAIL_MS}ms ${RAIL_EASE}, background-color 220ms ease, box-shadow 220ms ease, transform 220ms ease, color 220ms ease`,
    };

    const row = `hgb-side-item hgb-rail-item group relative flex w-full items-center rounded-[14px] text-left text-[13.5px] ${
      collapsed ? "gap-0" : "gap-3"
    }`;
    const inner = (
      <>
        {isActive && !collapsed && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-[6px] top-[9px] bottom-[9px] w-[2px] rounded-full"
            style={{ background: GOLD_LINE }}
          />
        )}
        {isActive && collapsed && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-[7px] top-[10px] bottom-[10px] w-[2px] rounded-full"
            style={{ background: GOLD_LINE }}
          />
        )}
        <item.icon
          size={17}
          strokeWidth={1.6}
          className="shrink-0"
          style={{ color: "rgba(255,255,255,0.90)" }}
        />


        <span
          className="hgb-rail-label truncate"
          style={{
            opacity: showLabels ? 1 : 0,
            width: showLabels ? "auto" : 0,
            transition: `opacity ${showLabels ? 220 : 150}ms ease`,
            overflow: "hidden",
          }}
        >
          {item.label}
        </span>
        {collapsed && (
          <span className="hgb-rail-tip pointer-events-none" role="tooltip">
            {item.label}
          </span>
        )}
      </>
    );
    if (opts.to === "/rooming/$bookingId" && opts.params) {
      return (
        <Link key={item.label} to={opts.to} params={opts.params} className={row} style={style} title="">
          {inner}
        </Link>
      );
    }
    if (opts.to === "/account") {
      return (
        <Link key={item.label} to="/account" className={row} style={style}>
          {inner}
        </Link>
      );
    }
    return (
      <button key={item.label} type="button" className={row} style={style}>
        {inner}
      </button>
    );
  };

  return (
    <div
      className={`relative flex h-full flex-col py-7 ${collapsed ? "px-[13px]" : "px-4"}`}
      style={{
        backgroundColor: "#1B2632",
        backgroundImage: [
          "radial-gradient(120% 70% at 108% 92%, rgba(150,178,205,0.30) 0%, rgba(126,155,182,0.16) 26%, rgba(90,116,142,0.06) 52%, rgba(27,38,50,0) 78%)",
          "radial-gradient(150% 95% at 96% 78%, rgba(120,150,178,0.12) 0%, rgba(27,38,50,0) 70%)",
          "radial-gradient(110% 80% at 0% 0%, rgba(9,16,24,0.55) 0%, rgba(9,16,24,0.22) 38%, rgba(9,16,24,0) 72%)",
          "linear-gradient(170deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0) 42%, rgba(0,0,0,0.05) 100%)",
          "linear-gradient(180deg, #1B2632 0%, #1D2937 46%, #202D3B 100%)",
        ].join(", "),
        borderRight: "none",
        boxShadow:
          "inset -1px 0 0 rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.06), 1px 0 30px -16px rgba(6,12,20,0.40)",
        transition: `padding ${RAIL_MS}ms ${RAIL_EASE}`,
      }}
    >








      <div className={`flex items-center ${collapsed ? "flex-col gap-3" : "justify-between gap-2 px-3"}`}>
        <Link to="/" className="block min-w-0 py-2" aria-label="HotelGroupBook">
          {collapsed ? (
            <span
              className="grid h-9 w-9 place-items-center rounded-[12px] text-[12.5px] font-semibold tracking-[0.06em]"
              style={{
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.08)",
              }}
            >
              HGB
            </span>
          ) : (
            <span className="flex items-center gap-2.5">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] text-[10.5px] font-semibold tracking-[0.06em]"
                style={{
                  color: "#FFFFFF",
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                HGB
              </span>
              <span
                className="whitespace-nowrap text-[16.5px] font-semibold tracking-[-0.01em]"
                style={{ color: "#FFFFFF" }}
              >
                Hotel
                <span
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg, #8B621C 0%, #C38B2B 28%, #F0C467 52%, #D49328 76%, #8B5B16 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Group
                </span>
                Book
              </span>
            </span>
          )}
        </Link>



      </div>

      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          className="hgb-edge-tab"
        >
          <span className="hgb-edge-tab-label">{collapsed ? "Open" : "Close"}</span>
          {collapsed ? (
            <ArrowRight size={15} strokeWidth={1.8} style={{ color: "#F5F7F8" }} />
          ) : (
            <ArrowLeft size={15} strokeWidth={1.8} style={{ color: "#F5F7F8" }} />
          )}
        </button>
      )}


      <nav className="mt-10 space-y-1.5">
        {PRIMARY_NAV.map((item) =>
          renderItem(
            item,
            item.label === "Rooming Lists" && roomingBookingId
              ? { to: "/rooming/$bookingId", params: { bookingId: roomingBookingId } }
              : {},
          ),
        )}
      </nav>

      <div className="mt-auto space-y-1.5 pt-10">
        {SECONDARY_NAV.map((item) =>
          renderItem(item, item.label === "Profile" ? { to: "/account" } : {}),
        )}
      </div>

      <div
        className={`mt-6 flex items-center gap-3 pt-5 ${collapsed ? "justify-center" : ""}`}
        style={{ borderTop: `1px solid ${SIDE_LINE}` }}
      >
        <span
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] font-semibold"
          style={{ backgroundColor: "rgba(169,133,58,0.14)", color: GOLD_DEEP }}
        >
          {initials || "—"}
        </span>
        {!collapsed && (
          <span
            className="min-w-0 flex-1"
            style={{ opacity: showLabels ? 1 : 0, transition: "opacity 200ms ease" }}
          >
            <Link to="/account" className="block truncate text-[12.5px]" style={{ color: SIDE_TEXT }}>
              {displayName || email}
            </Link>
            <button
              type="button"
              onClick={onSignOut}
              className="mt-0.5 inline-flex items-center gap-1.5 text-[11.5px]"
              style={{ color: GOLD_DEEP }}
            >
              <LogOut size={12} /> Log out
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

