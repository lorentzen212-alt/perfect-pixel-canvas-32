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
import { Card } from "../overview/primitives";
import { INK, INK_2 } from "../overview/materials";


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

/* ── palette ──────────────────────────────────────────────────── */
const NAVY = "#1B2F44";
const NAVY_HOVER = "#243B54";
const INK_NAVY = "#0D1C2B";
const GOLD_ICON = "#E8C96A";
const SURFACE = "#F7F5F1";
const CARD_SURFACE = "#FBFAF7";
const HAIRLINE = "1px solid rgba(50,60,65,0.10)";
const SOFT_SHADOW = "0 1px 2px rgba(13,28,43,0.05)";

const SOFT_CARD: React.CSSProperties = {
  borderRadius: 8,
  background: SURFACE,
  border: HAIRLINE,
  boxShadow: "0 1px 2px rgba(15,25,35,0.05), 0 4px 10px -6px rgba(15,25,35,0.10)",
};

const EYEBROW_STYLE: React.CSSProperties = {
  color: "rgba(13,28,43,0.55)",
  letterSpacing: "0.14em",
};

/* ── navy icon tile ───────────────────────────────────────────── */
function NavyTile({
  children,
  size = 42,
  radius = 11,
  background,
}: {
  children: React.ReactNode;
  size?: number;
  radius?: number;
  background?: string;
}) {
  return (
    <span
      className="grid shrink-0 place-items-center"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: background ?? NAVY,
        color: GOLD_ICON,
      }}
    >
      {children}
    </span>
  );
}

/* ── primary navy button ──────────────────────────────────────── */
function NavyButton({
  children,
  className = "",
  onClick,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`inline-flex items-center justify-center gap-2 px-4 text-[12.5px] font-semibold transition-colors ${className}`}
      style={{
        height: 42,
        borderRadius: 10,
        background: hover ? NAVY_HOVER : NAVY,
        color: "#FFFFFF",
        ...style,
      }}
    >
      {children}
    </button>
  );
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
      className={`inline-flex items-center justify-center gap-2 rounded-[10px] px-4 py-[8px] text-[12.5px] font-semibold transition-colors hover:bg-[rgba(13,28,43,0.05)] ${className}`}
      style={{ color: INK_NAVY, border: "1px solid rgba(50,60,65,0.18)", background: "transparent" }}
    >
      {children}
    </button>
  );
}


function IconTile({ children }: { children: React.ReactNode }) {
  return <NavyTile size={34} radius={9}>{children}</NavyTile>;
}

function GoldIconTile({ children }: { children: React.ReactNode }) {
  return <NavyTile size={34} radius={9}>{children}</NavyTile>;
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
      style={SOFT_CARD}
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
              style={{ background: NAVY }}
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
                background: NAVY,
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
            style={{ color: "rgba(13,28,43,0.72)" }}
          >
            View history
            <ArrowRight size={12} />
          </button>
        </span>
      </div>
    </Card>
  );
}

/* ── summary card (rooms / guests) ────────────────────────────── */
function SummaryCard({
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
      className="flex items-center gap-3 p-[13px]"
      style={{
        background: CARD_SURFACE,
        border: HAIRLINE,
        borderRadius: 6,
        boxShadow: SOFT_SHADOW,
      }}
    >
      <NavyTile size={42} radius={9}>
        <span style={{ color: "#FFFFFF", display: "flex" }}>{icon}</span>
      </NavyTile>
      <span className="min-w-0">
        <span
          className="block leading-none tabular-nums"
          style={{ color: INK_NAVY, fontSize: 33, fontWeight: 700 }}
        >
          {value}
        </span>
        <span
          className="mt-[3px] block text-[9.5px] font-semibold uppercase"
          style={{ color: "rgba(13,28,43,0.48)", letterSpacing: "0.16em" }}
        >
          {label}
        </span>
      </span>
    </div>
  );
}

/* ── room-type row ────────────────────────────────────────────── */
const ROW_GRID = "1fr 1px 72px 1px 72px";

const OTHER_TYPES = ["Junior Suite", "Suite", "Accessible rooms", "Apartment"];

function PeopleIcon({ count, size }: { count: number; size: number }) {
  const w = 20 + (count - 1) * 12;
  return (
    <svg
      viewBox={`0 0 ${w} 24`}
      height={size}
      width={(size * w) / 24}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => (
        <g key={i} transform={`translate(${i * 12}, 0)`}>
          <circle cx="10" cy="8" r="3.4" />
          <path d="M3.8 20.4c0-3.4 2.8-6.2 6.2-6.2s6.2 2.8 6.2 6.2" />
        </g>
      ))}
    </svg>
  );
}

function peopleCountFor(label: string) {
  const l = label.toLowerCase();
  if (l.includes("single")) return 1;
  if (l.includes("double")) return 2;
  if (l.includes("twin")) return 2;
  if (l.includes("triple")) return 3;
  if (l.includes("family")) return 4;
  if (l.includes("other")) return 1;
  return 2;
}

function peopleIconSize(count: number) {
  if (count >= 4) return 14;
  if (count === 3) return 16;
  return 18;
}

function NumberCell({ value, label, muted }: { value: number; label: string; muted?: boolean }) {
  return (
    <span className="flex flex-col items-center justify-center">
      <span
        className="tabular-nums leading-none"
        style={{
          fontSize: 23,
          fontWeight: 650,
          color: muted ? "rgba(13,28,43,0.38)" : INK_NAVY,
        }}
      >
        {value}
      </span>
      <span
        className="mt-[3px] text-[11px] leading-none"
        style={{ color: muted ? "rgba(13,28,43,0.38)" : "rgba(13,28,43,0.50)" }}
      >
        {label}
      </span>
    </span>
  );
}

const ROW_STYLE = (muted?: boolean): React.CSSProperties => ({
  gridTemplateColumns: ROW_GRID,
  minHeight: 60,
  padding: "10px 18px",
  background: muted ? "#FAFAF9" : CARD_SURFACE,
  border: HAIRLINE,
  borderRadius: 5,
  boxShadow: muted ? "none" : SOFT_SHADOW,
});

function TypeRow({
  label,
  rooms,
  guests,
  muted,
}: {
  label: string;
  rooms: number;
  guests: number;
  muted?: boolean;
}) {
  const count = peopleCountFor(label);
  return (
    <li className="grid items-center gap-3" style={ROW_STYLE(muted)}>
      <span className="flex min-w-0 items-center gap-3">
        <NavyTile size={38} radius={9} background={muted ? "#C9CDD2" : undefined}>
          <span style={{ color: "#FFFFFF", display: "flex" }}>
            <PeopleIcon count={count} size={peopleIconSize(count)} />
          </span>
        </NavyTile>
        <span
          className="min-w-0 truncate text-[15px] font-semibold"
          style={{ color: muted ? "rgba(13,28,43,0.42)" : INK_NAVY }}
        >
          {label}
        </span>
      </span>

      <span aria-hidden style={{ width: 1, height: 30, background: "rgba(13,28,43,0.10)" }} />
      <NumberCell value={rooms} label="rooms" muted={muted} />
      <span aria-hidden style={{ width: 1, height: 30, background: "rgba(13,28,43,0.10)" }} />
      <NumberCell value={guests} label="guests" muted={muted} />
    </li>
  );
}

function OtherTypesRow() {
  const [open, setOpen] = React.useState(false);
  return (
    <li
      style={{
        background: "#FAFAF9",
        border: HAIRLINE,
        borderRadius: 5,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="grid w-full items-center gap-3 text-left"
        style={{
          gridTemplateColumns: ROW_GRID,
          minHeight: 60,
          padding: "10px 18px",
          background: "transparent",
          border: "none",
          borderRadius: 5,
        }}
      >
        <span className="flex min-w-0 items-center gap-3">
          <NavyTile size={38} radius={9} background="#C9CDD2">
            <span style={{ color: "#FFFFFF", display: "flex" }}>
              <PeopleIcon count={1} size={18} />
            </span>
          </NavyTile>
          <span className="flex min-w-0 items-center gap-1.5">
            <span
              className="min-w-0 truncate text-[15px] font-semibold"
              style={{ color: "rgba(13,28,43,0.42)" }}
            >
              Other room types (0)
            </span>
            <ChevronDown
              size={15}
              style={{
                color: "rgba(13,28,43,0.42)",
                transition: "transform 160ms ease",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </span>
        </span>

        <span aria-hidden style={{ width: 1, height: 30, background: "rgba(13,28,43,0.10)" }} />
        <NumberCell value={0} label="rooms" muted />
        <span aria-hidden style={{ width: 1, height: 30, background: "rgba(13,28,43,0.10)" }} />
        <NumberCell value={0} label="guests" muted />
      </button>

      {open && (
        <ul style={{ padding: "0 18px 8px 18px" }}>
          {OTHER_TYPES.map((t, i) => (
            <li
              key={t}
              className="grid items-center gap-3"
              style={{
                gridTemplateColumns: ROW_GRID,
                height: 30,
                borderTop: i === 0 ? "none" : "1px solid rgba(13,28,43,0.07)",
              }}
            >
              <span
                className="truncate text-[12.5px]"
                style={{ color: "rgba(13,28,43,0.55)", paddingLeft: 50 }}
              >
                {t}
              </span>
              <span aria-hidden />
              <span
                className="text-center text-[13px] tabular-nums"
                style={{ color: "rgba(13,28,43,0.45)" }}
              >
                0
              </span>
              <span aria-hidden />
              <span
                className="text-center text-[13px] tabular-nums"
                style={{ color: "rgba(13,28,43,0.45)" }}
              >
                0
              </span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/* ── 3a · rooming overview ────────────────────────────────────── */
function Preview({ rows, bookingId }: { rows: RoomingTypeRow[]; bookingId: string }) {
  const totalRooms = rows.reduce((s, r) => s + r.rooms, 0);
  const totalGuests = rows.reduce((s, r) => s + r.guests, 0);

  return (
    <Card className="flex flex-col px-5 pb-3.5 pt-[14px] sm:px-6" style={SOFT_CARD}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11.5px] font-semibold uppercase" style={EYEBROW_STYLE}>
          Rooming overview
        </span>
        <span
          className="shrink-0 rounded-full px-2.5 py-[3px] text-[10.5px] font-medium"
          style={{
            color: "rgba(13,28,43,0.62)",
            background: "rgba(13,28,43,0.05)",
            border: "1px solid rgba(50,60,65,0.10)",
          }}
        >
          Current
        </span>
      </div>

      <div className="mt-[8px] grid grid-cols-2 gap-[4px]">
        <SummaryCard
          icon={<Bed size={19} strokeWidth={1.6} />}
          value={totalRooms}
          label="Total rooms"
        />
        <SummaryCard
          icon={<Users size={19} strokeWidth={1.6} />}
          value={totalGuests}
          label="Total guests"
        />
      </div>

      <ul className="mt-[8px] flex flex-col gap-[3px]">
        {rows.map((r) => (
          <TypeRow key={r.label} label={r.label} rooms={r.rooms} guests={r.guests} />
        ))}
        <OtherTypesRow />
      </ul>

      <Link
        to="/bookings/$bookingId"
        search={{ tab: "Rooming List" }}
        params={{ bookingId }}
        className="mt-[8px] block"
      >
        <NavyButton className="w-full text-[14px]" style={{ height: 50, borderRadius: 5 }}>
          View full rooming list
          <ArrowRight size={15} />
        </NavyButton>
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
      style={{ color: "rgba(13,28,43,0.72)" }}
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
      className="inline-flex items-center gap-1.5 rounded-[5px] px-2.5 py-[5px] text-[11.5px] font-semibold transition-colors hover:bg-[rgba(13,28,43,0.05)]"
      style={{ color: "rgba(13,28,43,0.72)", border: "1px solid rgba(50,60,65,0.14)", background: "transparent" }}

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
        borderRadius: 13,
        background: v.current ? "#FBFAF7" : "#FFFFFF",
        border: v.current ? "1px solid rgba(13,28,43,0.22)" : "1px solid rgba(50,60,65,0.10)",
        overflow: "hidden",
      }}
    >
      {v.current ? (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0"
          style={{ width: 3, background: NAVY }}
        />
      ) : null}

      <span
        className="grid h-[34px] w-[34px] shrink-0 place-items-center text-[12px] font-bold tabular-nums"
        style={{
          borderRadius: 11,
          background: v.current ? NAVY : "#FBFAF7",
          border: v.current ? `1px solid ${NAVY}` : "1px solid rgba(50,60,65,0.12)",
          color: v.current ? GOLD_ICON : INK_2,
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
                color: INK_NAVY,
                background: "rgba(13,28,43,0.06)",
                border: "1px solid rgba(50,60,65,0.12)",
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
            style={{ color: INK_NAVY, border: "1px solid rgba(50,60,65,0.16)", background: "rgba(13,28,43,0.04)" }}
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
          style={EYEBROW_STYLE}

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
    <Card className="flex h-full flex-col px-5 pb-4 pt-[15px] sm:px-6" style={SOFT_CARD}>
      <span
        className="text-[11.5px] font-semibold uppercase"
        style={EYEBROW_STYLE}
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
            <NavyTile size={38} radius={11}>
              <span style={{ color: GOLD_ICON }}>{r.icon}</span>
            </NavyTile>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold leading-snug" style={{ color: INK }}>
                {r.title}
              </span>
              <span className="mt-[2px] block text-[12.5px] leading-snug" style={{ color: INK_2 }}>
                {r.desc}
              </span>
            </span>
            {r.link ? (
              <Link to="/bookings/$bookingId"
              search={{ tab: "Rooming List" }} params={{ bookingId }} className="shrink-0">
                <NavyButton className="w-[176px] py-[9px]">
                  {r.label}
                  <ArrowRight size={13} />
                </NavyButton>
              </Link>
            ) : (
              <NavyButton className="w-[176px] shrink-0 py-[9px]" onClick={r.onClick}>
                {r.label}
                <ArrowRight size={13} />
              </NavyButton>
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
    <Card className="flex flex-col gap-3 px-5 py-[13px] sm:flex-row sm:items-center sm:gap-5 sm:px-6" style={SOFT_CARD}>
      <NavyTile size={40} radius={12}>
        <LifeBuoy size={20} strokeWidth={1.5} style={{ color: GOLD_ICON }} />
      </NavyTile>
      <div className="min-w-0 flex-1">
        <span className="text-[11.5px] font-semibold uppercase" style={EYEBROW_STYLE}>
          Need help?
        </span>
        <p className="mt-1 text-[13px]" style={{ color: INK_2 }}>
          Questions or changes to your booking?
        </p>
      </div>
      <NavyButton className="shrink-0 px-4 py-[9px]" onClick={onMessage}>
        Message HotelGroupBook
        <ArrowRight size={13} />
      </NavyButton>
    </Card>

  );
}

/* ── local navy plate (Rooming List only) ─────────────────────── */
function NavyPlate({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex flex-1 flex-col"
      style={{
        background: "#253B50",
        borderRadius: "16px 16px 0 0",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {children}
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
    <NavyPlate>
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
    </NavyPlate>
  );
}
