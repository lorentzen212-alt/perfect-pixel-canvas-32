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
import { Card, Eyebrow, Medallion, Plate } from "../overview/primitives";
import { GOLD, INK, INK_2 } from "../overview/materials";

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


/* ── shared outlined action ───────────────────────────────────── */
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
      className={`inline-flex items-center justify-center gap-2 rounded-[5px] px-4 py-[8px] text-[12.5px] font-semibold transition-colors hover:bg-[rgba(176,112,15,0.06)] ${className}`}
      style={{ color: "#A97824", border: "1px solid rgba(169,120,36,0.70)", background: "transparent" }}
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
        background: "#FFFFFF",
        border: "1px solid rgba(125,125,115,0.14)",
        boxShadow: "0 1px 2px rgba(25,35,40,0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
        color: INK,
      }}
    >
      {children}
    </span>
  );
}

/* ── filled gold action (same size/shape as OutlineButton) ────── */
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
        background:
          "linear-gradient(135deg, #B8860B 0%, #DAA520 28%, #E2C868 50%, #DAA520 68%, #8B6914 100%)",
        color: "#1A0F00",
        boxShadow: "0 1px 3px rgba(139,105,20,0.22)",
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
        background: "linear-gradient(180deg, #FBF3E1 0%, #F5E9CE 100%)",
        border: "1px solid rgba(169,120,36,0.32)",
        boxShadow: "0 1px 2px rgba(25,35,40,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
        color: "#A97824",
      }}
    >
      {children}
    </span>
  );
}

const CELL_LABEL: React.CSSProperties = {
  color: "rgba(27,37,48,0.46)",
  letterSpacing: "0.14em",
};

/* ── 1 · status strip ─────────────────────────────────────────── */
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

  const divider = "1px solid rgba(27,37,48,0.12)";

  return (
    <Card
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1.6fr_1fr_1fr]"
      style={{ borderRadius: CARD_RADIUS }}
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
              style={{ background: "#C79A2E" }}
            />
            <span className="truncate text-[14.5px] font-semibold" style={{ color: INK }}>
              {data.status}
            </span>
          </span>
          <span className="block truncate text-[11.5px]" style={{ color: INK_2 }}>
            Updated {data.lastUpdated}
          </span>
        </span>
      </div>

      {/* 2 · progress */}
      <div className="px-5 py-[16px]" style={{ borderLeft: divider }}>
        <span className="block truncate text-[17.5px] font-semibold" style={{ color: INK }}>
          {data.guestsAdded} of {data.guestsTotal} guests added
        </span>
        <span className="mt-2 flex items-center gap-2.5">
          <span
            className="h-[7px] flex-1 overflow-hidden rounded-full"
            style={{ background: "rgba(27,37,48,0.10)" }}
          >
            <span
              className="block h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: "linear-gradient(90deg, #C79A2E 0%, #E0BE63 100%)",
              }}
            />
          </span>
          <span className="shrink-0 text-[11.5px] tabular-nums" style={{ color: INK_2 }}>
            {pct}%
          </span>
        </span>
        <span className="mt-1.5 block truncate text-[11.5px]" style={{ color: INK_2 }}>
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
          <span className="block truncate text-[14.5px] font-semibold" style={{ color: INK }}>
            {data.deadline}
          </span>
          <span className="block truncate text-[11.5px]" style={{ color: INK_2 }}>
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
          <span className="block truncate text-[14.5px] font-semibold" style={{ color: INK }}>
            Version {data.version}
          </span>
          <button
            type="button"
            onClick={onHistory}
            className="inline-flex items-center gap-1.5 text-[11.5px] font-medium transition-opacity hover:opacity-70"
            style={{ color: GOLD }}
          >
            View history
            <ArrowRight size={12} />
          </button>
        </span>
      </div>
    </Card>
  );
}

/* ── total medallion (light rounded, gold icon) ───────────────── */
function TotalMedallion({ children, size = 40 }: { children: React.ReactNode; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full"
      style={{
        height: size,
        width: size,
        background: "linear-gradient(180deg, #FAF8F3 0%, #F2EEE6 100%)",
        border: "1px solid rgba(169,120,36,0.22)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(24,30,36,0.05)",
        color: "#A97824",
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
        background: "#FBFAF7",
        border: "1px solid rgba(50,60,65,0.10)",
        borderRadius: CARD_RADIUS,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      <TotalMedallion>{icon}</TotalMedallion>
      <span className="min-w-0">
        <span
          className="block leading-none tabular-nums"
          style={{ color: "#1B2530", fontSize: 34, fontWeight: 700, fontFamily: SERIF }}
        >
          {value}
        </span>
        <span
          className="mt-1 block text-[9.5px] font-semibold uppercase"
          style={{ color: "rgba(27,37,48,0.46)", letterSpacing: "0.16em" }}
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
    <Card className="flex flex-col px-5 pb-4 pt-[15px] sm:px-6" style={{ borderRadius: CARD_RADIUS }}>
      <span
        className="text-[11.5px] font-semibold uppercase"
        style={{ color: "#A98232", letterSpacing: "0.14em" }}
      >
        Rooming list preview
      </span>

      <ul className="mt-2">
        {rows.map((r, i) => (
          <li
            key={r.label}
            className="grid items-center gap-2 px-2 py-[13px]"
            style={{
              gridTemplateColumns: "48fr 22fr 22fr 16px",
              background: i % 2 === 1 ? "#FAF8F5" : undefined,
              borderBottom: "1px solid rgba(50,60,65,0.10)",
            }}
          >
            <span className="min-w-0 truncate text-[15.5px] font-medium" style={{ color: INK }}>
              {r.label}
            </span>
            <span
              className="text-[12.5px] tabular-nums"
              style={{ color: INK_2, textAlign: "left" }}
            >
              {r.rooms} rooms
            </span>
            <span
              className="text-[12.5px] tabular-nums"
              style={{ color: INK_2, textAlign: "left" }}
            >
              {r.guests} guests
            </span>
            <ChevronDown size={15} style={{ color: "rgba(27,37,48,0.35)", justifySelf: "end" }} />
          </li>
        ))}
      </ul>

      {/* totals section */}
      <div className="mt-[12px] grid grid-cols-2 gap-[10px]">
        <TotalTile icon={<Bed size={20} strokeWidth={1.5} />} value={totalRooms} label="Total rooms" />
        <TotalTile icon={<Users size={20} strokeWidth={1.5} />} value={totalGuests} label="Total guests" />
      </div>

      <Link
        to="/rooming/$bookingId"
        params={{ bookingId }}
        className="mt-[12px] block"
      >
        <OutlineButton className="w-full !py-[12px]">
          View full rooming list
          <ArrowRight size={13} />
        </OutlineButton>
      </Link>
    </Card>
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
      style={{ color: "#A97824" }}
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
      className="inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-[5px] text-[11.5px] font-semibold transition-colors hover:bg-[rgba(176,112,15,0.06)]"
      style={{ color: "#A97824", border: "1px solid rgba(169,120,36,0.55)", background: "transparent" }}
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
        background: v.current ? "#FBF5E9" : "#FFFFFF",
        border: v.current ? "1px solid rgba(169,120,36,0.45)" : "1px solid rgba(50,60,65,0.12)",
        overflow: "hidden",
      }}
    >
      {v.current ? (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0"
          style={{ width: 4, background: "linear-gradient(180deg, #C79A2E 0%, #A97824 100%)" }}
        />
      ) : null}

      <span
        className="grid h-[34px] w-[34px] shrink-0 place-items-center text-[12px] font-bold tabular-nums"
        style={{
          borderRadius: CARD_RADIUS,
          background: v.current ? "linear-gradient(180deg, #FBF3E1 0%, #F3E6C9 100%)" : "#FBFAF7",
          border: v.current ? "1px solid rgba(169,120,36,0.35)" : "1px solid rgba(50,60,65,0.12)",
          color: v.current ? "#A97824" : INK_2,
        }}
      >
        {v.short}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[13.5px] font-semibold" style={{ color: INK }}>
            {v.name}
          </span>
          {v.current ? (
            <span
              className="shrink-0 rounded-[4px] px-1.5 py-[1px] text-[9px] font-bold uppercase"
              style={{
                letterSpacing: "0.12em",
                color: "#8C6115",
                background: "rgba(199,154,46,0.18)",
                border: "1px solid rgba(169,120,36,0.35)",
              }}
            >
              Current
            </span>
          ) : null}
        </span>
        <span className="mt-[2px] block truncate text-[11.5px]" style={{ color: INK_2 }}>
          {v.timestamp}
        </span>
        <span className="mt-[3px] flex items-center gap-2 text-[11.5px]" style={{ color: "rgba(27,37,48,0.55)" }}>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Users size={12} strokeWidth={1.6} />
            {v.guests} / {v.guestsTotal} guests
          </span>
          <span aria-hidden className="h-[3px] w-[3px] rounded-full" style={{ background: "rgba(27,37,48,0.32)" }} />
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
            style={{ color: "#A97824", border: "1px solid rgba(169,120,36,0.55)" }}
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
          className="grid h-[26px] w-[22px] place-items-center rounded-[4px] transition-colors hover:bg-[rgba(27,37,48,0.06)]"
          style={{ color: "rgba(27,37,48,0.45)" }}
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
    <div className="mt-[22px] pt-[18px]" style={{ borderTop: "1px solid rgba(50,60,65,0.14)" }}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className="text-[11.5px] font-semibold uppercase"
          style={{ color: "#A98232", letterSpacing: "0.14em" }}
        >
          Versions
        </span>
        <span className="flex items-center gap-2.5">
          <TextLink onClick={onNewVersion}>
            <Plus size={12} />
            Create new version
          </TextLink>
          <span aria-hidden className="h-[13px] w-px" style={{ background: "rgba(27,37,48,0.18)" }} />
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

      <p className="mt-[10px] flex items-center gap-1.5 text-[11px]" style={{ color: "rgba(27,37,48,0.50)" }}>
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
    <Card className="flex h-full flex-col px-5 pb-4 pt-[15px] sm:px-6" style={{ borderRadius: CARD_RADIUS }}>
      <span
        className="text-[11.5px] font-semibold uppercase"
        style={{ color: "#A98232", letterSpacing: "0.14em" }}
      >
        Rooming list actions
      </span>

      <ul className="mt-2 flex flex-1 flex-col justify-around">
        {rows.map((r, i) => (
          <li
            key={r.title}
            className="flex items-center gap-3.5 py-[18px]"
            style={{ borderTop: i === 0 ? undefined : "1px solid rgba(50,60,65,0.10)" }}
          >
            <Medallion size={38}>{r.icon}</Medallion>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold leading-snug" style={{ color: INK }}>
                {r.title}
              </span>
              <span className="mt-[2px] block text-[12.5px] leading-snug" style={{ color: INK_2 }}>
                {r.desc}
              </span>
            </span>
            {r.link ? (
              <Link to="/rooming/$bookingId" params={{ bookingId }} className="shrink-0">
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
    </Card>
  );
}

/* ── 4 · need help ────────────────────────────────────────────── */
function NeedHelp({ onMessage }: { onMessage?: () => void }) {
  return (
    <Card className="flex flex-col gap-3 px-5 py-[13px] sm:flex-row sm:items-center sm:gap-5 sm:px-6" style={{ borderRadius: CARD_RADIUS }}>
      <Medallion size={40}>
        <LifeBuoy size={20} strokeWidth={1.5} />
      </Medallion>
      <div className="min-w-0 flex-1">
        <Eyebrow>Need help?</Eyebrow>
        <p className="mt-1 text-[13px]" style={{ color: INK_2 }}>
          Questions or changes to your booking?
        </p>
      </div>
      <OutlineButton className="shrink-0" onClick={onMessage}>
        Message HotelGroupBook
        <ArrowRight size={13} />
      </OutlineButton>
    </Card>
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
    <Plate>
      <div className="flex flex-1 flex-col space-y-[13px] px-5 pb-[18px] pt-[18px] sm:px-7">
        <StatusStrip data={data} onHistory={onHistory} />
        <div className="grid items-start gap-[10px] lg:grid-cols-[54fr_46fr]">
          <Preview rows={data.rows} bookingId={bookingId} />
          <Actions
            bookingId={bookingId}
            versions={data.versions ?? []}
            onNewVersion={onNewVersion}
            onUpload={onUpload}
            onHistory={onHistory}
          />
        </div>
        <NeedHelp onMessage={onMessage} />
      </div>

    </Plate>
  );
}
