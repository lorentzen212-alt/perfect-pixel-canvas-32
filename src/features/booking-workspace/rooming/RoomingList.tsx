import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  ChevronRight,
  ClipboardList,
  History,
  LifeBuoy,
  Layers,
  Upload,
  Users,
} from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";
import { Card, Eyebrow, Medallion, Plate, ShineGoldButton } from "../overview/primitives";
import { GOLD, INK, INK_2 } from "../overview/materials";

export interface RoomingTypeRow {
  label: string;
  rooms: number;
  guests: number;
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

/* ── 1 · header action ────────────────────────────────────────── */
function HeaderAction({ bookingId }: { bookingId: string }) {
  return (
    <Card className="flex flex-col gap-3 px-5 py-[11px] sm:flex-row sm:items-center sm:gap-5 sm:px-6">
      <Medallion size={48}>
        <ClipboardList size={24} strokeWidth={1.5} />
      </Medallion>

      <div className="min-w-0 flex-1">
        <Eyebrow>Rooming list</Eyebrow>
        <p
          className="mt-0.5 text-[18px] leading-tight"
          style={{ color: INK, fontFamily: SERIF, fontWeight: 500 }}
        >
          Rooming list
        </p>
        <p className="mt-1.5 text-[12.5px]" style={{ color: INK_2 }}>
          Add guest names and room assignments. You can update and re-submit anytime before the
          deadline.
        </p>
      </div>

      <Link to="/rooming/$bookingId" params={{ bookingId }} className="shrink-0 self-start sm:self-auto">
        <ShineGoldButton>
          Continue rooming list
          <ArrowRight size={14} />
        </ShineGoldButton>
      </Link>
    </Card>
  );
}

/* ── 2 · status strip ─────────────────────────────────────────── */
function StatusStrip({
  data,
  onHistory,
}: {
  data: RoomingSummaryData;
  onHistory?: () => void;
}) {
  const cells: { icon: React.ReactNode; label: string; value: string; sub: React.ReactNode }[] = [
    {
      icon: <ClipboardList size={17} />,
      label: "Rooming list status",
      value: data.status,
      sub: `Last updated: ${data.lastUpdated}`,
    },
    {
      icon: <CalendarClock size={17} />,
      label: "Deadline",
      value: data.deadline,
      sub: data.deadlineNote,
    },
    {
      icon: <Users size={17} />,
      label: "Rooming list summary",
      value: `${data.guestsAdded} / ${data.guestsTotal} guests added`,
      sub: `${data.roomsAssigned} rooms assigned`,
    },
    {
      icon: <History size={17} />,
      label: "Version",
      value: `Version ${data.version}`,
      sub: (
        <button
          type="button"
          onClick={onHistory}
          className="inline-flex items-center gap-1.5 text-[11.5px] font-medium transition-opacity hover:opacity-70"
          style={{ color: GOLD }}
        >
          View history
          <ArrowRight size={12} />
        </button>
      ),
    },
  ];

  return (
    <Card className="grid grid-cols-2 sm:grid-cols-4">
      {cells.map((c, i) => (
        <div
          key={c.label}
          className="flex items-center gap-3.5 px-5 py-[9px]"
          style={{ borderLeft: i === 0 ? undefined : "1px solid rgba(27,37,48,0.12)" }}
        >
          <IconTile>{c.icon}</IconTile>
          <span className="min-w-0">
            <span
              className="block truncate text-[10px] font-semibold uppercase"
              style={{ color: "rgba(27,37,48,0.46)", letterSpacing: "0.14em" }}
            >
              {c.label}
            </span>
            <span className="block truncate text-[14.5px] font-semibold" style={{ color: INK }}>
              {c.value}
            </span>
            <span className="block truncate text-[11.5px]" style={{ color: INK_2 }}>
              {c.sub}
            </span>
          </span>
        </div>
      ))}
    </Card>
  );
}

/* ── 3a · preview ─────────────────────────────────────────────── */
function Preview({ rows, bookingId }: { rows: RoomingTypeRow[]; bookingId: string }) {
  return (
    <Card className="flex h-full flex-col px-5 pb-3 pt-[13px] sm:px-6">
      <span
        className="text-[11.5px] font-semibold uppercase"
        style={{ color: "#A98232", letterSpacing: "0.14em" }}
      >
        Rooming list preview
      </span>

      <ul className="mt-2 flex-1">
        {rows.map((r, i) => (
          <li
            key={r.label}
            className="flex items-center gap-3 px-2 py-[9px]"
            style={{
              background: i % 2 === 1 ? "#FAF8F5" : undefined,
              borderBottom: i < rows.length - 1 ? "1px solid rgba(50,60,65,0.10)" : undefined,
            }}
          >
            <span className="min-w-0 flex-1 truncate text-[14px] font-medium" style={{ color: INK }}>
              {r.label}
            </span>
            <span className="shrink-0 text-[12.5px]" style={{ color: INK_2 }}>
              {r.rooms} rooms
            </span>
            <span
              className="shrink-0 text-[12.5px] tabular-nums"
              style={{ color: INK_2, minWidth: 66, textAlign: "right" }}
            >
              {r.guests} guests
            </span>
            <ChevronRight size={15} style={{ color: "rgba(27,37,48,0.35)" }} />
          </li>
        ))}
      </ul>

      <Link
        to="/rooming/$bookingId"
        params={{ bookingId }}
        className="mt-[10px] block"
      >
        <OutlineButton className="w-full">
          View full rooming list
          <ArrowRight size={13} />
        </OutlineButton>
      </Link>
    </Card>
  );
}

/* ── 3b · actions ─────────────────────────────────────────────── */
function Actions({
  bookingId,
  onNewVersion,
  onUpload,
}: {
  bookingId: string;
  onNewVersion?: () => void;
  onUpload?: () => void;
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
    <Card className="flex h-full flex-col px-5 pb-3 pt-[13px] sm:px-6">
      <span
        className="text-[11.5px] font-semibold uppercase"
        style={{ color: "#A98232", letterSpacing: "0.14em" }}
      >
        Rooming list actions
      </span>

      <ul className="mt-2 flex flex-1 flex-col">
        {rows.map((r, i) => (
          <li
            key={r.title}
            className="flex flex-1 items-center gap-3.5 py-[10px]"
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
                <OutlineButton>
                  {r.label}
                  <ArrowRight size={13} />
                </OutlineButton>
              </Link>
            ) : (
              <OutlineButton className="shrink-0" onClick={r.onClick}>
                {r.label}
                <ArrowRight size={13} />
              </OutlineButton>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ── 4 · need help ────────────────────────────────────────────── */
function NeedHelp({ onMessage }: { onMessage?: () => void }) {
  return (
    <Card className="flex flex-col gap-3 px-5 py-[11px] sm:flex-row sm:items-center sm:gap-5 sm:px-6">
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
      <div className="flex flex-1 flex-col space-y-[12px] px-5 pb-[6px] pt-4 sm:px-7">
        <HeaderAction bookingId={bookingId} />
        <StatusStrip data={data} onHistory={onHistory} />
        <div className="grid items-stretch gap-[9px] lg:grid-cols-[54fr_46fr]">
          <Preview rows={data.rows} bookingId={bookingId} />
          <Actions bookingId={bookingId} onNewVersion={onNewVersion} onUpload={onUpload} />
        </div>
        <NeedHelp onMessage={onMessage} />
      </div>
    </Plate>
  );
}
