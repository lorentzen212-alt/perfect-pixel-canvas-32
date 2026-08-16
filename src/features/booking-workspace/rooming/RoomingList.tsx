import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bed,
  CalendarClock,
  ChevronDown,
  ClipboardList,
  Eye,
  History,
  Info,
  LifeBuoy,
  Layers,
  MoreVertical,
  Plus,
  Upload,
  Users,
} from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";

export interface RoomingTypeRow {
  label: string;
  rooms: number;
  guests: number;
}

export interface RoomingVersionRow {
  id: string;
  /** short badge label, e.g. "V2" */
  short: string;
  /** display name, e.g. "Version 2" or "Original version" */
  name: string;
  /** e.g. "Updated 4 Aug 2026 at 14:20" */
  timestamp: string;
  guests: number;
  guestsTotal: number;
  rooms: number;
  current?: boolean;
  restorable?: boolean;
}

export interface RoomingSummaryData {
  status: string;
  lastUpdated: string;
  deadline: string;
  deadlineNote: string;
  guestsAdded: number;
  guestsTotal: number;
  roomsAssigned: number;
  version: number;
  rows: RoomingTypeRow[];
  versions?: RoomingVersionRow[];
}

/* ── LOCAL dark-surface tokens (this tab only) ─────────────────── */
/** matches the app sidebar / header navy */
const PAGE_NAVY = "#1B2632";
const NAVY_DEEP = "#0D1B2A"; // left hero panel
const SLATE = "#1E2D3D"; // right tool panel
const CARD_RIGHT = "#2A3B4E"; // cards inside right panel
const ROW_LEFT = "#16273A"; // rows inside left panel
const FRAME_EDGE = "rgba(199,160,74,0.28)";
const HAIRLINE = "rgba(233,239,245,0.10)";
const HAIRLINE_SOFT = "rgba(233,239,245,0.07)";
const T1 = "#F2F5F8";
const T2 = "rgba(233,239,245,0.72)";
const T3 = "rgba(233,239,245,0.52)";
const GOLD_ACCENT = "#E0BE63";

/* ── shared outlined action (white/grey, not gold) ─────────────── */
function OutlineButton({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-[8px] text-[12.5px] font-semibold transition-colors hover:bg-[rgba(255,255,255,0.07)] ${className}`}
      style={{ color: T1, border: "1px solid rgba(233,239,245,0.26)", background: "transparent" }}
    >
      {children}
    </button>
  );
}

/* shared square-ish card radius override for the Rooming tab */
const CARD_RADIUS = 6;

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[6px]"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(233,239,245,0.14)",
        color: T2,
      }}
    >
      {children}
    </span>
  );
}

/* ── filled gold action (same size/shape as OutlineButton) ────── */
const GOLD_FILL =
  "linear-gradient(135deg, #B8860B 0%, #DAA520 28%, #E2C868 50%, #DAA520 68%, #8B6914 100%)";

function GoldFillButton({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-[8px] text-[12.5px] font-semibold ${className}`}
      style={{
        background: GOLD_FILL,
        color: "#1A0F00",
        boxShadow: "0 1px 3px rgba(0,0,0,0.28)",
      }}
    >
      {children}
    </button>
  );
}

function GoldIconTile({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-[6px]"
      style={{
        background: "rgba(224,190,99,0.12)",
        border: "1px solid rgba(224,190,99,0.30)",
        color: GOLD_ACCENT,
      }}
    >
      {children}
    </span>
  );
}

/* dark medallion for action rows / help card */
function DarkMedallion({ children, size = 38 }: { children: React.ReactNode; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        height: size,
        width: size,
        background: "rgba(224,190,99,0.10)",
        border: "1px solid rgba(224,190,99,0.24)",
        color: GOLD_ACCENT,
      }}
    >
      {children}
    </span>
  );
}

const CELL_LABEL: React.CSSProperties = {
  color: T3,
  letterSpacing: "0.14em",
};

const SECTION_LABEL: React.CSSProperties = {
  color: T3,
  letterSpacing: "0.14em",
};

/* ── 1 · status strip (integrated navy header) ─────────────────── */
function StatusStrip({
  data,
  onHistory,
}: {
  data: RoomingSummaryData;
  onHistory?: () => void;
}) {
  const pct =
    data.guestsTotal > 0
      ? Math.min(100, Math.round((data.guestsAdded / data.guestsTotal) * 100))
      : 0;

  const divider = `1px solid ${HAIRLINE}`;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1.6fr_1fr_1fr]"
      style={{
        background: NAVY_DEEP,
        border: `1px solid ${FRAME_EDGE}`,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {/* 1 · status */}
      <div className="flex items-center gap-3.5 px-5 py-[16px]">
        <GoldIconTile>
          <ClipboardList size={17} />
        </GoldIconTile>
        <span className="min-w-0">
          <span className="block truncate text-[10px] font-semibold uppercase" style={CELL_LABEL}>
            Rooming list status
          </span>
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-[7px] w-[7px] shrink-0 rounded-full"
              style={{ background: GOLD_ACCENT }}
            />
            <span className="truncate text-[14.5px] font-semibold" style={{ color: T1 }}>
              {data.status}
            </span>
          </span>
          <span className="block truncate text-[11.5px]" style={{ color: T2 }}>
            Updated {data.lastUpdated}
          </span>
        </span>
      </div>

      {/* 2 · progress */}
      <div className="px-5 py-[16px]" style={{ borderLeft: divider }}>
        <span className="block truncate text-[17.5px] font-semibold" style={{ color: T1 }}>
          {data.guestsAdded} of {data.guestsTotal} guests added
        </span>
        <span className="mt-2 flex items-center gap-2.5">
          <span
            className="h-[7px] flex-1 overflow-hidden rounded-full"
            style={{ background: "rgba(255,255,255,0.10)" }}
          >
            <span
              className="block h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #C79A2E 0%, #E0BE63 100%)",
              }}
            />
          </span>
          <span
            className="shrink-0 text-[11.5px] font-semibold tabular-nums"
            style={{ color: GOLD_ACCENT }}
          >
            {pct}%
          </span>
        </span>
        <span className="mt-1.5 block truncate text-[11.5px]" style={{ color: T2 }}>
          {data.roomsAssigned} rooms assigned
        </span>
      </div>

      {/* 3 · deadline */}
      <div className="flex items-center gap-3.5 px-5 py-[16px]" style={{ borderLeft: divider }}>
        <IconTile>
          <CalendarClock size={17} />
        </IconTile>
        <span className="min-w-0">
          <span className="block truncate text-[10px] font-semibold uppercase" style={CELL_LABEL}>
            Deadline
          </span>
          <span className="block truncate text-[14.5px] font-semibold" style={{ color: T1 }}>
            {data.deadline}
          </span>
          <span className="block truncate text-[11.5px]" style={{ color: T2 }}>
            {data.deadlineNote.replace(/[()]/g, "")}
          </span>
        </span>
      </div>

      {/* 4 · version */}
      <div className="flex items-center gap-3.5 px-5 py-[16px]" style={{ borderLeft: divider }}>
        <IconTile>
          <History size={17} />
        </IconTile>
        <span className="min-w-0">
          <span className="block truncate text-[10px] font-semibold uppercase" style={CELL_LABEL}>
            Version
          </span>
          <span
            className="block truncate text-[14.5px] font-semibold"
            style={{ color: GOLD_ACCENT }}
          >
            Version {data.version}
          </span>
          <button
            type="button"
            onClick={onHistory}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-medium transition-opacity hover:opacity-70"
            style={{ color: T2 }}
          >
            View history
            <ArrowRight size={12} />
          </button>
        </span>
      </div>
    </div>
  );
}

/* ── total medallion ──────────────────────────────────────────── */
function TotalMedallion({ children, size = 40 }: { children: React.ReactNode; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        height: size,
        width: size,
        background: "rgba(224,190,99,0.10)",
        border: "1px solid rgba(224,190,99,0.24)",
        color: GOLD_ACCENT,
      }}
    >
      {children}
    </span>
  );
}

/* ── total tile ───────────────────────────────────────────────── */
function TotalTile({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-[12px]"
      style={{
        background: ROW_LEFT,
        border: `1px solid ${HAIRLINE_SOFT}`,
        borderRadius: CARD_RADIUS,
      }}
    >
      <TotalMedallion>{icon}</TotalMedallion>
      <span className="min-w-0">
        <span
          className="block leading-none tabular-nums"
          style={{ color: T1, fontSize: 34, fontWeight: 700, fontFamily: SERIF }}
        >
          {value}
        </span>
        <span
          className="mt-1 block text-[9.5px] font-semibold uppercase"
          style={{ color: T3, letterSpacing: "0.16em" }}
        >
          {label}
        </span>
      </span>
    </div>
  );
}

/* ── 3a · preview ─────────────────────────────────────────────── */
function Preview({ rows, bookingId }: { rows: RoomingTypeRow[]; bookingId: string }) {
  const totalRooms = rows.reduce((s, r) => s + r.rooms, 0);
  const totalGuests = rows.reduce((s, r) => s + r.guests, 0);

  return (
    <div
      className="flex flex-col px-5 pb-5 pt-[17px] sm:px-7"
      style={{ background: NAVY_DEEP }}
    >
      <span className="text-[11.5px] font-semibold uppercase" style={SECTION_LABEL}>
        Rooming list preview
      </span>

      <ul className="mt-2.5">
        {rows.map((r, i) => (
          <li
            key={r.label}
            className="grid items-center gap-2 px-2 py-[15px]"
            style={{
              gridTemplateColumns: "48fr 22fr 22fr 16px",
              background: i % 2 === 1 ? ROW_LEFT : undefined,
              borderBottom: `1px solid ${HAIRLINE_SOFT}`,
              lineHeight: 1.55,
            }}
          >
            <span className="min-w-0 truncate text-[16px] font-medium" style={{ color: T1 }}>
              {r.label}
            </span>
            <span className="text-[13.5px] tabular-nums" style={{ color: T2, textAlign: "left" }}>
              {r.rooms} rooms
            </span>
            <span className="text-[13.5px] tabular-nums" style={{ color: T2, textAlign: "left" }}>
              {r.guests} guests
            </span>
            <ChevronDown size={15} style={{ color: T3, justifySelf: "end" }} />
          </li>
        ))}
      </ul>

      {/* totals section */}
      <div className="mt-[14px] grid grid-cols-2 gap-[10px]">
        <TotalTile icon={<Bed size={20} strokeWidth={1.5} />} value={totalRooms} label="Total rooms" />
        <TotalTile icon={<Users size={20} strokeWidth={1.5} />} value={totalGuests} label="Total guests" />
      </div>

      <Link
        to="/bookings/$bookingId"
        search={{ tab: "Rooming List" }}
        params={{ bookingId }}
        className="mt-[14px] block"
      >
        <OutlineButton className="w-full !py-[12px]">
          View full rooming list
          <ArrowRight size={13} />
        </OutlineButton>
      </Link>
    </div>
  );
}

/* ── 3b-2 · versions ──────────────────────────────────────────── */
function TextLink({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-[11.5px] font-semibold transition-opacity hover:opacity-70"
      style={{ color: T2 }}
    >
      {children}
    </button>
  );
}

function SmallOutline({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-[5px] text-[11.5px] font-semibold transition-colors hover:bg-[rgba(255,255,255,0.07)]"
      style={{ color: T1, border: "1px solid rgba(233,239,245,0.24)", background: "transparent" }}
    >
      {children}
    </button>
  );
}

function VersionRow({ v }: { v: RoomingVersionRow }) {
  return (
    <li
      className="relative flex items-center gap-3 py-[11px] pl-[14px] pr-[10px]"
      style={{
        borderRadius: CARD_RADIUS,
        background: CARD_RIGHT,
        border: v.current
          ? "1px solid rgba(224,190,99,0.38)"
          : `1px solid ${HAIRLINE_SOFT}`,
        overflow: "hidden",
      }}
    >
      {v.current ? (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0"
          style={{ width: 4, background: "linear-gradient(180deg, #E0BE63 0%, #C79A2E 100%)" }}
        />
      ) : null}

      <span
        className="grid h-[34px] w-[34px] shrink-0 place-items-center text-[12px] font-bold tabular-nums"
        style={{
          borderRadius: CARD_RADIUS,
          background: v.current ? "rgba(224,190,99,0.14)" : "rgba(255,255,255,0.05)",
          border: v.current ? "1px solid rgba(224,190,99,0.32)" : `1px solid ${HAIRLINE}`,
          color: v.current ? GOLD_ACCENT : T2,
        }}
      >
        {v.short}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[13.5px] font-semibold" style={{ color: T1 }}>
            {v.name}
          </span>
          {v.current ? (
            <span
              className="shrink-0 rounded-[4px] px-1.5 py-[1px] text-[9px] font-bold uppercase"
              style={{
                letterSpacing: "0.12em",
                color: GOLD_ACCENT,
                background: "rgba(224,190,99,0.14)",
                border: "1px solid rgba(224,190,99,0.32)",
              }}
            >
              Current
            </span>
          ) : null}
        </span>
        <span className="mt-[2px] block truncate text-[11.5px]" style={{ color: T2 }}>
          {v.timestamp}
        </span>
        <span className="mt-[3px] flex items-center gap-2 text-[11.5px]" style={{ color: T3 }}>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Users size={12} strokeWidth={1.6} />
            {v.guests} / {v.guestsTotal} guests
          </span>
          <span aria-hidden className="h-[3px] w-[3px] rounded-full" style={{ background: T3 }} />
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Bed size={12} strokeWidth={1.6} />
            {v.rooms} rooms
          </span>
        </span>
      </span>

      <span className="flex shrink-0 items-center gap-1.5">
        {v.current ? (
          <span
            className="inline-flex items-center rounded-full px-3 py-[5px] text-[11.5px] font-semibold"
            style={{ color: GOLD_ACCENT, border: "1px solid rgba(224,190,99,0.42)" }}
          >
            Current
          </span>
        ) : (
          <>
            <SmallOutline>
              <Eye size={12} />
              View
            </SmallOutline>
            {v.restorable ? (
              <SmallOutline>
                <History size={12} />
                Restore
              </SmallOutline>
            ) : null}
          </>
        )}
        <button
          type="button"
          aria-label="Version options"
          className="grid h-[26px] w-[22px] place-items-center rounded-[4px] transition-colors hover:bg-[rgba(255,255,255,0.08)]"
          style={{ color: T3 }}
        >
          <MoreVertical size={15} />
        </button>
      </span>
    </li>
  );
}

function Versions({
  versions,
  onNewVersion,
  onHistory,
}: {
  versions: RoomingVersionRow[];
  onNewVersion?: () => void;
  onHistory?: () => void;
}) {
  if (!versions.length) return null;
  return (
    <div className="mt-[20px] pt-[16px]" style={{ borderTop: `1px solid ${HAIRLINE}` }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11.5px] font-semibold uppercase" style={SECTION_LABEL}>
          Versions
        </span>
        <span className="flex items-center gap-2.5">
          <TextLink onClick={onNewVersion}>
            <Plus size={12} />
            Create new version
          </TextLink>
          <span aria-hidden className="h-[13px] w-px" style={{ background: HAIRLINE }} />
          <TextLink onClick={onHistory}>
            View all history
            <ArrowRight size={12} />
          </TextLink>
        </span>
      </div>

      <ul className="mt-[10px] flex flex-col gap-[8px]">
        {versions.map((v) => (
          <VersionRow key={v.id} v={v} />
        ))}
      </ul>

      <p className="mt-[10px] flex items-center gap-1.5 text-[11px]" style={{ color: T3 }}>
        <Info size={12} />
        Restoring a version will create a new version based on it.
      </p>
    </div>
  );
}

/* ── 3b · actions ─────────────────────────────────────────────── */
function Actions({
  bookingId,
  versions,
  onNewVersion,
  onUpload,
  onHistory,
}: {
  bookingId: string;
  versions: RoomingVersionRow[];
  onNewVersion?: () => void;
  onUpload?: () => void;
  onHistory?: () => void;
}) {
  const rows = [
    {
      icon: <ClipboardList size={20} strokeWidth={1.5} />,
      title: "Continue editing",
      desc: "Add more guests or adjust room assignments.",
      label: "Continue",
      link: true,
    },
    {
      icon: <Layers size={20} strokeWidth={1.5} />,
      title: "Create new version",
      desc: "Save a new version of the rooming list.",
      label: "Create new version",
      onClick: onNewVersion,
    },
    {
      icon: <Upload size={20} strokeWidth={1.5} />,
      title: "Upload rooming list",
      desc: "Upload a file (Excel or PDF) and we'll help you.",
      label: "Upload file",
      onClick: onUpload,
    },
  ];

  return (
    <div
      className="flex h-full flex-col px-5 pb-4 pt-[17px] sm:px-6"
      style={{ background: SLATE }}
    >
      <span className="text-[11.5px] font-semibold uppercase" style={SECTION_LABEL}>
        Rooming list actions
      </span>

      <ul className="mt-2 flex flex-1 flex-col justify-around">
        {rows.map((r, i) => (
          <li
            key={r.title}
            className="flex items-center gap-3.5 py-[15px]"
            style={{ borderTop: i === 0 ? undefined : `1px solid ${HAIRLINE_SOFT}` }}
          >
            <DarkMedallion size={38}>{r.icon}</DarkMedallion>
            <span className="min-w-0 flex-1">
              <span
                className="block text-[13.5px] font-semibold"
                style={{ color: T1, lineHeight: 1.3 }}
              >
                {r.title}
              </span>
              <span
                className="mt-[2px] block text-[12px]"
                style={{ color: T2, lineHeight: 1.35 }}
              >
                {r.desc}
              </span>
            </span>
            {r.link ? (
              <Link
                to="/bookings/$bookingId"
                search={{ tab: "Rooming List" }}
                params={{ bookingId }}
                className="shrink-0"
              >
                <GoldFillButton className="w-[176px]">
                  {r.label}
                  <ArrowRight size={13} />
                </GoldFillButton>
              </Link>
            ) : (
              <GoldFillButton className="w-[176px] shrink-0" onClick={r.onClick}>
                {r.label}
                <ArrowRight size={13} />
              </GoldFillButton>
            )}
          </li>
        ))}
      </ul>

      <Versions versions={versions} onNewVersion={onNewVersion} onHistory={onHistory} />
    </div>
  );
}

/* ── 4 · need help ────────────────────────────────────────────── */
function NeedHelp({ onMessage }: { onMessage?: () => void }) {
  return (
    <div
      className="flex flex-col gap-3 px-5 py-[13px] sm:flex-row sm:items-center sm:gap-5 sm:px-6"
      style={{
        background: SLATE,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 14,
      }}
    >
      <DarkMedallion size={40}>
        <LifeBuoy size={20} strokeWidth={1.5} />
      </DarkMedallion>
      <div className="min-w-0 flex-1">
        <span
          className="block text-[10px] font-semibold uppercase"
          style={{ color: T3, letterSpacing: "0.18em" }}
        >
          Need help?
        </span>
        <p className="mt-1 text-[13px]" style={{ color: T2 }}>
          Questions or changes to your booking?
        </p>
      </div>
      <OutlineButton className="shrink-0" onClick={onMessage}>
        Message HotelGroupBook
        <ArrowRight size={13} />
      </OutlineButton>
    </div>
  );
}

/* ── composition ──────────────────────────────────────────────── */
export function RoomingFolder({
  bookingId,
  data,
  onHistory,
  onNewVersion,
  onUpload,
  onMessage,
}: {
  bookingId: string;
  data: RoomingSummaryData;
  onHistory?: () => void;
  onNewVersion?: () => void;
  onUpload?: () => void;
  onMessage?: () => void;
}) {
  return (
    <div
      className="relative flex flex-1 flex-col"
      style={{ background: PAGE_NAVY, borderRadius: "16px 16px 0 0" }}
    >
      <div className="flex flex-1 flex-col space-y-[13px] px-5 pb-[18px] pt-[18px] sm:px-7">
        <StatusStrip data={data} onHistory={onHistory} />
        <div
          style={{
            border: `1px solid ${FRAME_EDGE}`,
            borderRadius: 14,
            overflow: "hidden",
            background: HAIRLINE_SOFT,
          }}
        >
          <div className="grid items-stretch gap-[7px] lg:grid-cols-[54fr_46fr]">
            <Preview rows={data.rows} bookingId={bookingId} />
            <Actions
              bookingId={bookingId}
              versions={data.versions ?? []}
              onNewVersion={onNewVersion}
              onUpload={onUpload}
              onHistory={onHistory}
            />
          </div>
        </div>
        <NeedHelp onMessage={onMessage} />
      </div>
    </div>
  );
}
