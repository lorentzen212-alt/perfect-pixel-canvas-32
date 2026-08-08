import * as React from "react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Check,
  ChevronRight,
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

export function BookingWorkspaceHeader({
  bookingId,
  bookingName,
  image,
  destination,
  reference,
  initials,
  subtitle = "Manage every detail of this group booking in one workspace",
  active,
  onSelect,
}: {
  bookingId: string;
  bookingName: string;
  image: string;
  destination: string;
  reference: string;
  initials: string;
  subtitle?: string;
  active: WorkspaceTab;
  onSelect?: (tab: WorkspaceTab) => void;
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

      <div className="relative px-5 pt-7 sm:px-9">
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[12.5px]" style={{ color: HERO_MUTED }}>
              <Link to="/manage-bookings" className="transition-opacity hover:opacity-80">
                Booking workspace
              </Link>
              <ChevronRight size={13} />
              <span style={{ color: HERO_TEXT }}>{bookingName}</span>
            </p>
            <h1
              className="mt-1 truncate text-[30px] leading-[1.1] sm:text-[34px]"
              style={{ color: "#F7F4ED", fontFamily: SERIF, fontWeight: 400 }}
            >
              {bookingName}
            </h1>
            <p className="mt-1 text-[13px]" style={{ color: HERO_MUTED }}>
              {subtitle}
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-3 sm:flex">
            <span className="text-[11.5px]" style={{ color: HERO_MUTED }}>
              Ref <span style={{ color: "#F1EDE2", letterSpacing: "0.04em" }}>{reference}</span>
            </span>
            <button
              type="button"
              aria-label="Copy booking reference"
              onClick={() => {
                navigator.clipboard?.writeText(reference);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="grid h-[34px] w-[34px] place-items-center rounded-full"
              style={{
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(10,22,31,0.4)",
                color: copied ? GREEN : GOLD_SOFT,
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={13} />}
            </button>
            <span
              className="grid h-[34px] w-[34px] place-items-center rounded-full text-[11.5px] font-semibold"
              style={{
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(10,22,31,0.4)",
                color: "#F1EDE2",
              }}
            >
              {initials || "—"}
            </span>
          </div>
        </div>

        <nav className="mt-6 flex items-end gap-[6px] overflow-x-auto">
          {WORKSPACE_TABS.map((t) => {
            const isActive = t === active;
            const cls =
              "hgb-ws-tab relative whitespace-nowrap rounded-t-[13px] px-5 pb-[13px] pt-[11px] text-[13px] transition-colors duration-200 flex items-center gap-2.5" +
              (isActive ? "" : " hgb-ws-tab--inactive");
            const st: React.CSSProperties = isActive
              ? {
                  background: "#FFFFFF",
                  color: "#173957",
                  fontWeight: 600,
                  boxShadow: "0 -6px 18px -12px rgba(0,0,0,0.45)",
                }
              : {
                  backgroundColor: "#0F1620",
                  color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderBottom: "none",
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
