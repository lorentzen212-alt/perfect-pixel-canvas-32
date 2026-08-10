import * as React from "react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bed,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Download,
  MapPin,
  Users,
  ClipboardList,
  Copy,
  FileText,
  Home,
  MessageSquare,
  Pencil,
  StickyNote,
} from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";

/* ── one persistent Booking Workspace header (hero + title + tabs) ──
   Rendered identically on every workspace tab so the surrounding
   interface never moves; only the content below the tabs changes. */

export const WORKSPACE_TABS = [
  "Overview",
  "Rooming List",
  "Changes",
  "Documents",
  "Messages",
  "Notes",
] as const;

export type WorkspaceTab = (typeof WORKSPACE_TABS)[number];

const TAB_ICON: Record<WorkspaceTab, React.ReactNode> = {
  Overview: <Home size={14} />,
  "Rooming List": <ClipboardList size={14} />,
  Changes: <Pencil size={14} />,
  Documents: <FileText size={14} />,
  Messages: <MessageSquare size={14} />,
  Notes: <StickyNote size={14} />,
};

const HERO_TEXT = "rgba(226,233,239,0.88)";
const HERO_MUTED = "rgba(214,224,232,0.62)";
const GOLD_MET_MID = "#C5962D";
const GOLD_SOFT = "#D9BE74";
const GREEN = "#7FBE96";
const TAB_INK = "#16293A";

export function BookingWorkspaceHeader({
  bookingId,
  bookingName,
  image,
  destination,
  reference,
  initials,
  subtitle = "Manage every detail of this group booking in one workspace",
  stayDates,
  roomsLabel,
  guestsLabel,
  statusLabel = "Confirmed",
  statusTone = "#1E5B39",
  active,
  onSelect,
  surface,
}: {
  bookingId: string;
  bookingName: string;
  image: string;
  destination: string;
  reference: string;
  initials: string;
  subtitle?: string;
  stayDates?: string;
  roomsLabel?: string;
  guestsLabel?: string;
  statusLabel?: string;
  statusTone?: string;
  active: WorkspaceTab;
  onSelect?: (tab: WorkspaceTab) => void;
  /** surface the active tab must merge into (folder plate below) */
  surface?: string;
}) {
  const [copied, setCopied] = useState(false);


  return (
    <header className="relative isolate">
      <img
        src={image}
        alt={`${destination} landscape`}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "saturate(0.85) contrast(1.05)" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(9,20,29,0.78) 0%, rgba(9,20,29,0.66) 45%, rgba(12,26,37,0.92) 100%)",
        }}
      />

      <div className="relative px-5 pt-8 sm:px-9 sm:pt-9">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <Link
              to="/manage-bookings"
              className="inline-flex items-center gap-2 text-[13px] font-medium transition-opacity hover:opacity-80"
              style={{ color: GOLD_SOFT }}
            >
              <ArrowLeft size={15} />
              Back to My Bookings
            </Link>
            <h1
              className="mt-3 truncate text-[32px] leading-[1.08] sm:text-[38px]"
              style={{ color: "#F7F4ED", fontFamily: SERIF, fontWeight: 400 }}
            >
              {bookingName}
            </h1>

            <div
              className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]"
              style={{ color: HERO_TEXT }}
            >
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} style={{ color: HERO_MUTED }} />
                {destination}
              </span>
              {stayDates && (
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={14} style={{ color: HERO_MUTED }} />
                  {stayDates}
                </span>
              )}
              {roomsLabel && (
                <span className="inline-flex items-center gap-2">
                  <Bed size={14} style={{ color: HERO_MUTED }} />
                  {roomsLabel}
                </span>
              )}
              {guestsLabel && (
                <span className="inline-flex items-center gap-2">
                  <Users size={14} style={{ color: HERO_MUTED }} />
                  {guestsLabel}
                </span>
              )}
              <span style={{ color: HERO_TEXT }}>Ref {reference}</span>
            </div>

            <span
              className="mt-4 inline-flex items-center rounded-[4px] px-3 py-[6px] text-[11.5px] font-semibold uppercase"
              style={{
                background: statusTone,
                color: "#EAF6EE",
                letterSpacing: "0.09em",
              }}
            >
              {statusLabel}
            </span>
          </div>

          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(reference);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="inline-flex items-center gap-2 rounded-[7px] px-4 py-[9px] text-[12.5px] font-medium transition-opacity hover:opacity-85"
              style={{
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(10,22,31,0.45)",
                color: copied ? GREEN : "#F1EDE2",
              }}
            >
              {copied ? <Check size={14} /> : <Download size={14} />}
              {copied ? "Reference copied" : "Download summary"}
            </button>
            <span className="relative grid h-[34px] w-[34px] place-items-center" style={{ color: "rgba(226,233,239,0.8)" }}>
              <Bell size={17} />
            </span>
            <span
              className="grid h-[34px] w-[34px] place-items-center rounded-full text-[11.5px] font-semibold"
              style={{
                border: `1px solid ${GOLD_MET_MID}`,
                background: "rgba(10,22,31,0.4)",
                color: GOLD_SOFT,
              }}
            >
              {initials || "—"}
            </span>
          </div>
        </div>



        <nav className="mt-9 flex items-end gap-[6px] overflow-x-auto">
          {WORKSPACE_TABS.map((t) => {
            const isActive = t === active;
            const cls =
              "hgb-ws-tab relative whitespace-nowrap rounded-t-[13px] px-5 pb-[13px] pt-[11px] text-[13px] transition-colors duration-200 flex items-center gap-2.5";
            const st: React.CSSProperties = isActive
              ? {
                  background: surface ?? "linear-gradient(180deg, #FFFDF8 0%, #F7F3EC 100%)",
                  color: TAB_INK,
                  fontWeight: 600,
                  marginBottom: -1,
                  paddingBottom: 14,
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.7), 0 -6px 18px -12px rgba(20,32,42,0.45)",
                }
              : {
                  backgroundColor: "rgba(12,26,36,0.62)",
                  color: "rgba(226,233,239,0.74)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderBottom: "none",
                  boxShadow:
                    "inset 0 2px 3px -1px rgba(0,0,0,0.45), inset 0 -1px 0 rgba(255,255,255,0.05)",
                };
            const inner = (
              <>
                <span style={{ color: isActive ? GOLD_MET_MID : "rgba(226,233,239,0.62)" }}>
                  {TAB_ICON[t]}
                </span>
                {t}
              </>
            );

            if (isActive) {
              return (
                <span key={t} className={cls} style={st}>
                  {inner}
                </span>
              );
            }
            if (t === "Rooming List") {
              return (
                <Link
                  key={t}
                  to="/rooming/$bookingId"
                  params={{ bookingId }}
                  className={cls}
                  style={st}
                >
                  {inner}
                </Link>
              );
            }
            if (onSelect) {
              return (
                <button key={t} type="button" onClick={() => onSelect(t)} className={cls} style={st}>
                  {inner}
                </button>
              );
            }
            return (
              <Link
                key={t}
                to="/bookings/$bookingId"
                params={{ bookingId }}
                className={cls}
                style={st}
              >
                {inner}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
