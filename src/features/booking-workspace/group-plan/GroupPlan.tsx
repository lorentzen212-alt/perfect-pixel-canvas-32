import * as React from "react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Bookmark,
  Bus,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ConciergeBell,
  FileText,
  Clock,
  Coffee,
  Gift,
  LayoutGrid,
  Lightbulb,
  Luggage,
  MapPin,
  MonitorPlay,
  MoreHorizontal,
  Pencil,
  Plane,
  Plus,
  Presentation,
  KeyRound,
  Star,
  Moon,
  Trash2,
  Users,
  Utensils,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";
import type { PlanItem, PlanItemType, PlanTile, TileIcon } from "./types";

/* ── material — Nordic fjord / Scandinavian hospitality ──────
   Dusty fjord blue surfaces, deep slate planner, muted gold.  */
const PAGE = "#F5F1E9";
const CARD = "#385870";
const PANEL = "#263A4B";
const SURFACE_SOFT = "#304B5F";

const TEXT = "#F5F2EC";
const TIME = "#D6DEE4";
const TEXT_2 = "#B5C1C9";
const MUTED = "#879BAA";

const EDGE = "rgba(13,28,43,0.28)";
const HAIR = "rgba(255,255,255,0.10)";
const HAIR_SOFT = "rgba(255,255,255,0.08)";

const GOLD = "#D8B85D";
const GOLD_DEEP = "#E8CC7A";
const GOLD_LINE = "rgba(216,184,93,0.55)";
const GOLD_TINT = "rgba(216,184,93,0.12)";
const GREEN = "#A9CDAA";

/* ── Group Planner (dark, simplified) ── */
const PLANNER_BG = "#0B1E32";
const PLANNER_SURFACE = "#13283C";
const PLANNER_LINE = "rgba(255,255,255,0.09)";
const PLANNER_TEXT = "#EDF1F4";
const PLANNER_MUTED = "#8FA3B3";
const PLANNER_GOLD = "#D8B85D";

function PlannerLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-7 text-[10px] font-semibold uppercase tracking-[0.15em]"
      style={{ color: PLANNER_GOLD }}
    >
      {children}
    </div>
  );
}

/* expanded activity info panel */
const INFO_BG = "#363B4E";
const INFO_BORDER = "rgba(255,255,255,0.08)";
const INFO_CARD_BG = "rgba(255,255,255,0.04)";
const INFO_CARD_BORDER = "rgba(255,255,255,0.10)";
const INFO_TEXT = "#F2F4F7";
const INFO_TEXT_2 = "#B6BDC8";
const INFO_GOLD = "#E8C96A";

/* premium metallic champagne-gold text — inside the glyphs only */
const GOLD_TEXT_GRADIENT =
  "linear-gradient(105deg, #A87928 0%, #C99C3F 22%, #E8C96A 42%, #F2DC8B 54%, #D2A84C 70%, #B88630 86%, #E4C66D 100%)";

const GOLD_SOFT = "#D8B85D";
const GOLD_STUD_BG = "#D8B85D";
const GOLD_STUD_SHADOW =
  "0 0 0 1px rgba(240,216,138,0.25), 0 0 5px rgba(224,191,117,0.22)";
const GOLD_STUD_SHADOW_ACTIVE =
  "0 0 0 1px rgba(240,216,138,0.30), 0 0 6px rgba(224,191,117,0.28)";
const GOLD_LINE_GRADIENT = "rgba(201,168,95,0.70)";
const GOLD_PATH = "#C9A85F";
const GOLD_PATH_OPACITY = 0.7;

const DATE_SERIF = '"DM Serif Display", serif';
const TIME_TEXT = "#DCE4E8";
const DAY_META = "#B7CAD5";
const INACTIVE_TEXT = "#9FB1BC";
const CALENDAR_ICON_INACTIVE = "#879CA8";
const ACTIVE_TEXT = "#E5C76F";




const TYPE_ICON: Record<PlanItemType, React.ReactNode> = {
  transport: <Bus size={16} strokeWidth={1.5} />,
  checkin: <KeyRound size={16} strokeWidth={1.5} />,
  checkout: <Luggage size={16} strokeWidth={1.5} />,
  breakfast: <Coffee size={16} strokeWidth={1.5} />,
  lunch: <Coffee size={16} strokeWidth={1.5} />,
  dinner: <ConciergeBell size={16} strokeWidth={1.5} />,
  meeting: <Presentation size={16} strokeWidth={1.5} />,
  activity: <MapPin size={16} strokeWidth={1.5} />,
  "meeting-point": <Users size={16} strokeWidth={1.5} />,
  "free-time": <Star size={16} strokeWidth={1.5} />,
  reminder: <Bell size={16} strokeWidth={1.5} />,
};

const ICON_CIRCLE_BORDER = "rgba(225, 229, 230, 0.38)";
const ICON_CIRCLE_BG = "rgba(8, 24, 38, 0.10)";
const ICON_GOLD = "#E8C96A";
const ICON_GOLD_HOVER = "#F2DC8B";

function ActivityIcon({ type }: { type: PlanItemType }) {
  return (
    <span
      className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-[rgba(225,229,230,0.38)] bg-[rgba(8,24,38,0.10)] transition-colors group-hover:border-[rgba(232,201,106,0.65)]"
      aria-hidden
    >
      <span className="text-[#E8C96A] transition-colors group-hover:text-[#F2DC8B]">
        {TYPE_ICON[type]}
      </span>
    </span>
  );
}

const TILE_ICON: Record<TileIcon, React.ReactNode> = {
  dining: <UtensilsCrossed size={14} strokeWidth={1.4} />,
  guests: <Users size={14} strokeWidth={1.4} />,
  dietary: <UtensilsCrossed size={14} strokeWidth={1.4} />,
  extras: <Gift size={14} strokeWidth={1.4} />,
  room: <Presentation size={14} strokeWidth={1.4} />,
  setup: <LayoutGrid size={14} strokeWidth={1.4} />,
  equipment: <MonitorPlay size={14} strokeWidth={1.4} />,
  clock: <Clock size={14} strokeWidth={1.4} />,
  bus: <Bus size={14} strokeWidth={1.4} />,
  pin: <MapPin size={14} strokeWidth={1.4} />,
  bed: <KeyRound size={14} strokeWidth={1.4} />,
  luggage: <Luggage size={14} strokeWidth={1.4} />,
};

const TYPE_ICON_SM: Record<PlanItemType, React.ReactNode> = {
  transport: <Bus size={16} strokeWidth={1.3} />,
  checkin: <KeyRound size={16} strokeWidth={1.3} />,
  checkout: <Luggage size={16} strokeWidth={1.3} />,
  breakfast: <Coffee size={16} strokeWidth={1.3} />,
  lunch: <Coffee size={16} strokeWidth={1.3} />,
  dinner: <Utensils size={16} strokeWidth={1.3} />,
  meeting: <Presentation size={16} strokeWidth={1.3} />,
  activity: <Plane size={16} strokeWidth={1.3} />,
  "meeting-point": <Users size={16} strokeWidth={1.3} />,
  "free-time": <Star size={16} strokeWidth={1.3} />,
  reminder: <Bell size={16} strokeWidth={1.3} />,
};

/* assumed durations so we can detect genuinely free time —
   PlanItem has a start time only, no end time. */
const ASSUMED_MIN: Record<PlanItemType, number> = {
  transport: 90,
  checkin: 30,
  checkout: 30,
  breakfast: 180,
  lunch: 90,
  dinner: 120,
  meeting: 120,
  activity: 90,
  "meeting-point": 30,
  "free-time": 0,
  reminder: 0,
};

/** Slack left before the next commitment. */
const BUFFER_MIN = 15;
/** Windows shorter than this are noise. */
const MIN_FREE_MIN = 60;
/** Nothing open-ended is proposed past this hour. */
const DAY_END_MIN = 21 * 60;

/** Short nouns for the narrow status card. */
const SHORT_LABEL: Partial<Record<PlanItemType, string>> = {
  transport: "Transfer",
  checkin: "Check-in",
  checkout: "Check-out",
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  meeting: "Meeting",
};

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
const fmtDur = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h && m ? `${h}h ${m}m` : h ? `${h}h` : `${m}m`;
};

/** One entry in the panel's chronological day stream. */
type DayEntry =
  | { kind: "item"; key: string; at: number; item: PlanItem }
  | {
      kind: "free";
      key: string;
      at: number;
      start: number;
      end: number | null;
      minutes: number | null;
    };

function buildDayStream(items: PlanItem[], openEndedTail: boolean): DayEntry[] {
  const timed = items
    .filter((i) => i.time)
    .sort((a, b) => (a.time as string).localeCompare(b.time as string));

  const out: DayEntry[] = [];
  let cursor: number | null = null;

  for (const it of timed) {
    const start = toMin(it.time as string);
    if (cursor !== null) {
      const gapStart = cursor;
      const gapEnd = start - BUFFER_MIN;
      if (gapEnd - gapStart >= MIN_FREE_MIN) {
        out.push({
          kind: "free",
          key: `free-${gapStart}`,
          at: gapStart,
          start: gapStart,
          end: gapEnd,
          minutes: gapEnd - gapStart,
        });
      }
    }
    out.push({ kind: "item", key: it.id, at: start, item: it });
    cursor = Math.max(cursor ?? 0, start + ASSUMED_MIN[it.type]);
  }

  if (openEndedTail && cursor !== null && DAY_END_MIN - cursor >= MIN_FREE_MIN) {
    out.push({
      kind: "free",
      key: "free-tail",
      at: cursor,
      start: cursor,
      end: null,
      minutes: null,
    });
  }

  for (const it of items.filter((i) => !i.time)) {
    out.push({ kind: "item", key: it.id, at: 24 * 60 + 1, item: it });
  }
  return out;
}



function seedMyItems(date?: string): PlanItem[] {
  const dd = date ?? null;
  return [
    {
      id: "my-seed-lunch",
      kind: "myplan",
      type: "activity",
      date: dd,
      time: "13:00",
      title: "Lunch at Olivia",
      secondary: "Aker Brygge",
      location: "Aker Brygge",
      note: null,
    },
    {
      id: "my-seed-docs",
      kind: "myplan",
      type: "reminder",
      date: dd,
      time: "14:00",
      title: "Pick up documents",
      secondary: "Hotel reception",
      location: "Hotel reception",
      note: null,
    },
    {
      id: "my-seed-tickets",
      kind: "myplan",
      type: "reminder",
      date: null,
      time: null,
      title: "Buy train tickets to Oslo",
      note: null,
    },
    {
      id: "my-seed-latecheckout",
      kind: "myplan",
      type: "reminder",
      date: null,
      time: null,
      title: "Call hotel about late check-out",
      note: null,
    },
  ];
}





const MY_PLAN_TYPES: { value: PlanItemType; label: string }[] = [
  { value: "activity", label: "Activity" },
  { value: "meeting-point", label: "Meeting point" },
  { value: "free-time", label: "Free time" },
  { value: "reminder", label: "Reminder" },
];

/* ── date helpers ───────────────────────────────────────── */
const d = (iso: string) => new Date(`${iso}T00:00:00`);
const dayNum = (iso: string) => String(d(iso).getDate()).padStart(2, "0");
const monthShort = (iso: string) => d(iso).toLocaleDateString("en-GB", { month: "short" });
const weekday = (iso: string) => d(iso).toLocaleDateString("en-GB", { weekday: "short" });
const longDate = (iso: string) =>
  d(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
const monthLong = (iso: string) => d(iso).toLocaleDateString("en-GB", { month: "long" });

/* ── journey ribbon geometry ────────────────────────────── */
interface RibbonMetrics {
  w: number;
  h: number;
  yEdge: number;
  xSpine: number | null;
  ySpineEnd: number;
  xTitleRight: number;
  xDateLeft: number;
}

const EMPTY_METRICS: RibbonMetrics = {
  w: 0,
  h: 0,
  yEdge: 0,
  xSpine: null,
  ySpineEnd: 0,
  xTitleRight: 0,
  xDateLeft: 0,
};

const HOOK_R = 16;
/** the raised plateau rides the card's top edge — 1, not 0, so the
    2px stroke stays fully inside the SVG instead of being half-clipped */
const SWEEP_TOP = 1;
const SWEEP_RUN = 210;
const SWEEP_MIN_RUN = 72;
const SWEEP_MIN_WIDTH = 560;

const r2 = (n: number) => Math.round(n * 100) / 100;

function journeyPaths(m: RibbonMetrics) {
  const yEdge = r2(m.yEdge);

  /* The bottom edge does not run flat over the timeline — both arms
     bend down into it, so the spine reads as the edge itself turning
     the corner rather than a separate line touching it. */
  let path: string;
  if (m.xSpine !== null && m.ySpineEnd > m.yEdge + HOOK_R) {
    const x = r2(m.xSpine);
    const yTurn = r2(m.yEdge + HOOK_R);
    path =
      `M 0 ${yEdge} H ${r2(m.xSpine - HOOK_R)} Q ${x} ${yEdge} ${x} ${yTurn} V ${r2(m.ySpineEnd)}` +
      ` M ${r2(m.w)} ${yEdge} H ${r2(m.xSpine + HOOK_R)} Q ${x} ${yEdge} ${x} ${yTurn}`;
  } else {
    path = `M 0 ${yEdge} H ${r2(m.w)}`;
  }


  const xEnd = m.xDateLeft - 22;
  const xStart = Math.max(m.xTitleRight + 16, xEnd - SWEEP_RUN);
  const raised =
    m.w >= SWEEP_MIN_WIDTH && m.xDateLeft > 0 && xEnd - xStart >= SWEEP_MIN_RUN && m.yEdge > SWEEP_TOP;

  if (!raised) return { path, sweep: "", wedge: "" };

  const k = (xEnd - xStart) * 0.55;
  const curve = `C ${r2(xStart + k)} ${yEdge} ${r2(xEnd - k)} ${SWEEP_TOP} ${r2(xEnd)} ${SWEEP_TOP}`;
  const rise = `M ${r2(xStart)} ${yEdge} ${curve} H ${r2(m.w)}`;
  return { path, sweep: rise, wedge: `${rise} V ${yEdge} Z` };
}

function ViewSwitch({
  view,
  onChange,
}: {
  view: "Timeline" | "Calendar";
  onChange: (v: "Timeline" | "Calendar") => void;
}) {
  return (
    <div className="flex items-center gap-7">
      {(["Timeline", "Calendar"] as const).map((v) => {
        const on = view === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className="inline-flex items-center gap-2 text-[12px] font-medium transition-opacity hover:opacity-80"
            style={{ color: on ? ACTIVE_TEXT : INACTIVE_TEXT }}
          >
            {v === "Timeline" ? (
              <span
                aria-hidden
                className="h-[5px] w-[5px] shrink-0 rounded-full"
                style={{ background: on ? GOLD_SOFT : CALENDAR_ICON_INACTIVE }}
              />
            ) : (
              <CalendarDays
                size={13}
                strokeWidth={1.5}
                style={{ color: on ? GOLD_SOFT : CALENDAR_ICON_INACTIVE }}
              />
            )}
            <span
              className="pb-[5px]"
              style={{ borderBottom: `1px solid ${on ? GOLD_LINE_GRADIENT : "transparent"}` }}
            >
              {v}
            </span>
          </button>
        );
      })}
    </div>
  );
}


/* ── small parts ────────────────────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="block text-[10px] font-semibold uppercase tracking-[0.16em]"
      style={{ color: "#E8C96A" }}
    >
      {children}
    </span>
  );
}


function Pill({ kind }: { kind: "booking" | "myplan" }) {
  const booking = kind === "booking";
  return (
    <span
      className="inline-flex w-[104px] shrink-0 items-center justify-center rounded-[5px] px-2 py-[4px] text-[9.5px] font-semibold uppercase tracking-[0.13em]"
      style={{
        color: booking ? TEXT_2 : "#A9CDAA",
        background: booking ? "rgba(13,28,43,0.18)" : "rgba(123,174,127,0.12)",
        border: booking
          ? "1px solid rgba(255,255,255,0.12)"
          : "1px solid rgba(123,174,127,0.25)",
      }}
    >
      {booking ? "Booking" : "My plan"}
    </span>
  );
}

function Menu({
  items,
}: {
  items: { label: string; icon?: React.ReactNode; onClick: () => void }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative">
      <button
        type="button"
        aria-label="Item actions"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 140)}
        className="grid h-7 w-7 place-items-center rounded-[6px] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
        style={{ color: MUTED }}
      >
        <MoreHorizontal size={16} strokeWidth={1.6} />
      </button>
      {open && (
        <span
          className="absolute right-0 top-8 z-20 flex w-[190px] flex-col rounded-[9px] py-1 text-left"
          style={{
            background: SURFACE_SOFT,
            border: `1px solid ${EDGE}`,
            boxShadow: "0 18px 34px -18px rgba(0,0,0,0.45)",
          }}
        >
          {items.map((it) => (
            <button
              key={it.label}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
                it.onClick();
              }}
              className="flex items-center gap-2 px-3 py-2 text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.05)]"
              style={{ color: TEXT_2 }}
            >
              {it.icon}
              {it.label}
            </button>
          ))}
        </span>
      )}
    </span>
  );
}

function Tile({ tile }: { tile: PlanTile }) {
  return (
    <div
      className="min-w-0 rounded-[12px] px-4 py-[14px]"
      style={{
        minHeight: 64,
        background: INFO_CARD_BG,
        border: `1px solid ${INFO_CARD_BORDER}`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="shrink-0" style={{ color: INFO_GOLD }}>
          {TILE_ICON[tile.icon]}
        </span>
        <span
          className="truncate text-[12px] font-semibold uppercase tracking-[0.05em]"
          style={{ color: INFO_GOLD }}
        >
          {tile.label}
        </span>
      </div>
      <div
        className="mt-1.5 truncate text-[16px] font-semibold sm:text-[16px]"
        style={{ color: INFO_TEXT }}
      >
        {tile.value}
      </div>
      {tile.sub && (
        <div className="mt-0.5 truncate text-[12px]" style={{ color: INFO_TEXT_2 }}>
          {tile.sub}
        </div>
      )}
    </div>
  );
}


function ColHead({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[9.5px] font-semibold uppercase tracking-[0.14em]"
      style={{ color: MUTED }}
    >
      {children}
    </div>
  );
}

function GoldLink({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 text-[12px] font-medium transition-opacity hover:opacity-70"
      style={{ color: GOLD_DEEP }}
    >
      {label}
    </button>
  );
}

function CheckRow({ entries }: { entries: string[] }) {
  if (!entries.length) return null;
  return (
    <div className="mt-5 flex w-full flex-wrap items-center gap-x-4 gap-y-2.5 py-[10px] lg:flex-nowrap">
      {entries.map((e, i) => (
        <React.Fragment key={`${e}-${i}`}>
          {i > 0 && (
            <span className="h-[16px] w-px shrink-0" style={{ background: "rgba(255,255,255,0.10)" }} />
          )}
          <span className="flex items-center gap-2 whitespace-nowrap text-[14px]" style={{ color: INFO_TEXT }}>
            <CheckCircle2
              size={16}
              strokeWidth={1.5}
              className="shrink-0"
              style={{ color: INFO_GOLD }}
            />
            {e}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── expanded content ───────────────────────────────────── */

function Expanded({
  item,
  onRequestChange,
  onEditNote,
}: {
  item: PlanItem;
  onRequestChange: () => void;
  onEditNote: (item: PlanItem) => void;
}) {
  const cols = [
    item.dietary?.length ? "dietary" : null,
    
    item.extras?.length ? "extras" : null,
  ].filter(Boolean) as string[];

  return (
    <div
      className="ml-[26px] mt-2 rounded-[14px] p-4 sm:px-6 sm:py-5"
      style={{
        background: INFO_BG,
        border: `1px solid ${INFO_BORDER}`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      }}
    >
      {item.tiles?.length ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {item.tiles.map((t) => (
            <Tile key={t.label} tile={t} />
          ))}
        </div>
      ) : null}

      {item.attention && (
        <div
          className="mt-4 inline-flex items-center gap-2 rounded-[8px] px-3 py-1.5 text-[12.5px]"
          style={{
            color: INFO_GOLD,
            background: "rgba(232,201,106,0.10)",
            border: "1px solid rgba(232,201,106,0.28)",
          }}
        >
          {item.attention}
        </div>
      )}

      {cols.length > 0 && (
        <div className="mt-5 grid gap-6 sm:grid-cols-3">
          {item.dietary?.length ? (
            <div className="min-w-0">
              <ColHead>Dietary requirements</ColHead>
              <ul className="mt-2.5 space-y-1.5">
                {item.dietary.map((r, i) => (
                  <li
                    key={`${r.name}-${i}`}
                    className="truncate text-[13px]"
                    style={{ color: INFO_TEXT_2 }}
                  >
                    <span style={{ color: INFO_TEXT }}>{r.name}</span> · {r.room} · {r.restriction}
                  </li>
                ))}
              </ul>
              <div className="mt-2.5">
                <GoldLink label="View all dietary requirements →" />
              </div>
            </div>
          ) : null}


          {item.extras?.length ? (
            <div
              className="min-w-0 sm:pl-6"
              style={cols.length > 1 ? { borderLeft: `1px solid ${INFO_BORDER}` } : undefined}
            >
              <ColHead>Extras</ColHead>
              <ul className="mt-2.5 space-y-1.5">
                {item.extras.map((x) => (
                  <li key={x.label} className="truncate text-[13px]" style={{ color: INFO_TEXT_2 }}>
                    <span style={{ color: INFO_TEXT }}>{x.label}</span> · {x.count}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      <CheckRow
        entries={[
          ...(item.included ?? []),
          ...(item.facts ?? []).flatMap((f) => [f.label, f.value]),
        ]}
      />


      {item.specialArrangement && (
        <div
          className="mt-5 rounded-[10px] px-3.5 py-3"
          style={{
            background: INFO_CARD_BG,
            border: `1px solid ${INFO_BORDER}`,
          }}
        >
          <ColHead>Special arrangement</ColHead>
          <p className="mt-1.5 text-[13px]" style={{ color: INFO_TEXT_2 }}>
            {item.specialArrangement}
          </p>
        </div>
      )}

      <div className="relative mt-5 pt-5" style={{ borderTop: `1px solid ${INFO_BORDER}` }}>
        <div className="flex items-center gap-2">
          <FileText size={16} strokeWidth={1.5} style={{ color: INFO_GOLD }} />
          <span
            className="text-[12px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: INFO_GOLD }}
          >
            Notes
          </span>
        </div>
        {item.note ? (
          <>
            <button
              type="button"
              aria-label="Edit note"
              onClick={() => onEditNote(item)}
              className="absolute right-0 top-4 grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-[rgba(255,255,255,0.06)]"
              style={{ border: `1px solid ${INFO_CARD_BORDER}`, color: INFO_GOLD }}
            >
              <Pencil size={16} strokeWidth={1.6} />
            </button>
            <p
              className="mt-3 max-w-[70ch] whitespace-pre-line text-[15px] leading-normal"
              style={{ color: INFO_TEXT }}
            >
              {item.note.text}
            </p>
          </>
        ) : (
          <button
            type="button"
            onClick={() => onEditNote(item)}
            className="mt-3 text-[14px] transition-opacity hover:opacity-70"
            style={{ color: INFO_TEXT_2 }}
          >
            + Add note
          </button>
        )}
      </div>

      <div
        className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-5"
        style={{ borderTop: `1px solid ${INFO_BORDER}` }}
      >
        <div className="flex items-center gap-2 text-[12.5px]" style={{ color: INFO_TEXT_2 }}>
          {item.note && (
            <>
              <span>Added by {item.note.author}</span>
              <span>•</span>
              <span>{item.note.date}</span>
              <span>•</span>
            </>
          )}
          <button
            type="button"
            onClick={() => onEditNote(item)}
            className="text-[12.5px] font-medium transition-opacity hover:opacity-70"
            style={{ color: INFO_GOLD }}
          >
            Edit
          </button>
        </div>
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={onRequestChange}
            className="rounded-[8px] px-[18px] py-[10px] text-[12.5px] font-medium transition-colors hover:bg-[rgba(232,201,106,0.08)]"
            style={{ color: INFO_GOLD, background: "transparent", border: `1px solid ${INFO_GOLD}` }}
          >
            Request a change
          </button>
          <button
            type="button"
            onClick={onRequestChange}
            className="text-[12.5px] font-medium transition-opacity hover:opacity-70"
            style={{ color: INFO_GOLD }}
          >
            View full details →
          </button>
        </div>
      </div>

    </div>
  );
}

/* ── timeline row ───────────────────────────────────────── */

function Row({
  item,
  open,
  last,
  onToggle,
  onRequestChange,
  onEdit,
  onDelete,
  onEditNote,
}: {
  item: PlanItem;
  open: boolean;
  last: boolean;
  onToggle: () => void;
  onRequestChange: () => void;
  onEdit: (item: PlanItem) => void;
  onDelete: (id: string) => void;
  onEditNote: (item: PlanItem) => void;
}) {
  return (
    <li className="relative">
      <div className="relative">
        {/* open circular node */}
        <span
          aria-hidden
          data-timeline-dot
          className="absolute left-[-2px] top-1/2 z-[2] h-[6px] w-[6px] -translate-y-1/2 rounded-full"
          style={{
            background: GOLD_STUD_BG,
            boxShadow: open ? GOLD_STUD_SHADOW_ACTIVE : GOLD_STUD_SHADOW,
          }}
        />

      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        aria-expanded={open}
        className="group ml-[26px] flex cursor-pointer items-center gap-4 rounded-[8px] px-3 py-[17px] transition-all hover:bg-[rgba(255,255,255,0.02)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{
          background: "transparent",
          borderBottom: last ? "1px solid transparent" : "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span
          className="w-[92px] shrink-0 text-[14px] tabular-nums"
          style={{ color: TIME_TEXT }}
        >
          {item.time ?? "—"}
        </span>
        <span
          className="h-[36px] w-px shrink-0"
          style={{ background: "rgba(235, 238, 240, 0.32)" }}
          aria-hidden
        />
        <ActivityIcon type={item.type} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14.5px] font-semibold" style={{ color: TEXT }}>
            {item.title}
          </span>
          {(item.summary || item.secondary) && (
            <span className="mt-[2px] block truncate text-[12.5px]" style={{ color: TEXT_2 }}>
              {item.summary ?? item.secondary}
            </span>
          )}
        </span>
        <span className="w-[104px] shrink-0">
          <Pill kind={item.kind} />
        </span>

        {item.kind === "booking" ? (
          <Menu
            items={[
              { label: "Request a change", icon: <Pencil size={13} />, onClick: onRequestChange },
            ]}
          />
        ) : (
          <Menu
            items={[
              { label: "Edit", icon: <Pencil size={13} />, onClick: () => onEdit(item) },
              { label: "Delete", icon: <Trash2 size={13} />, onClick: () => onDelete(item.id) },
            ]}
          />
        )}
      </div>
      </div>
      {open && <Expanded item={item} onRequestChange={onRequestChange} onEditNote={onEditNote} />}
    </li>
  );
}

/* ── add to plan editor ─────────────────────────────────── */

export interface DraftItem {
  id?: string;
  date: string;
  time: string;
  title: string;
  location: string;
  notes: string;
  type: PlanItemType;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span
        className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.13em]"
        style={{ color: MUTED }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  background: SURFACE_SOFT,
  border: `1px solid ${EDGE}`,
  color: TEXT,
  colorScheme: "dark",
};

function Editor({
  draft,
  onChange,
  onSave,
  onClose,
}: {
  draft: DraftItem;
  onChange: (d: DraftItem) => void;
  onSave: (d: DraftItem, withoutTime: boolean) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[380px] flex-col overflow-y-auto px-6 py-6"
      style={{
        background: CARD,
        borderLeft: `1px solid ${EDGE}`,
        boxShadow: "-24px 0 60px -40px rgba(0,0,0,0.55)",
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <Eyebrow>Your personal plan</Eyebrow>
          <h3 className="mt-1 text-[24px] leading-none" style={{ color: TEXT, fontFamily: SERIF }}>
            {draft.id ? "Edit plan item" : "Add to plan"}
          </h3>
          <p className="mt-1.5 text-[11.5px]" style={{ color: MUTED }}>
            Only a title is required.
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" style={{ color: MUTED }}>
          <X size={17} strokeWidth={1.6} />
        </button>
      </div>

      <div className="mt-5 space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date (optional)">
            <input
              type="date"
              value={draft.date}
              onChange={(e) => onChange({ ...draft, date: e.target.value })}
              className="w-full rounded-[8px] px-2.5 py-2 text-[12.5px] outline-none"
              style={inputStyle}
            />
          </Field>
          <Field label="Time (optional)">
            <input
              type="time"
              value={draft.time}
              onChange={(e) => onChange({ ...draft, time: e.target.value })}
              className="w-full rounded-[8px] px-2.5 py-2 text-[12.5px] outline-none"
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="What's happening?">
          <input
            value={draft.title}
            onChange={(e) => onChange({ ...draft, title: e.target.value })}
            placeholder="Guided city walk"
            className="w-full rounded-[8px] px-2.5 py-2 text-[12.5px] outline-none"
            style={inputStyle}
          />
        </Field>
        <Field label="Location (optional)">
          <input
            value={draft.location}
            onChange={(e) => onChange({ ...draft, location: e.target.value })}
            className="w-full rounded-[8px] px-2.5 py-2 text-[12.5px] outline-none"
            style={inputStyle}
          />
        </Field>
        <Field label="Notes (optional)">
          <textarea
            value={draft.notes}
            rows={3}
            onChange={(e) => onChange({ ...draft, notes: e.target.value })}
            className="w-full resize-none rounded-[8px] px-2.5 py-2 text-[12.5px] outline-none"
            style={inputStyle}
          />
        </Field>
        <Field label="Type (optional)">
          <div className="flex flex-wrap gap-1.5">
            {MY_PLAN_TYPES.map((t) => {
              const on = draft.type === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => onChange({ ...draft, type: t.value })}
                  className="rounded-full px-3 py-[5px] text-[11.5px]"
                  style={{
                    color: on ? GOLD_DEEP : TEXT_2,
                    background: on ? GOLD_TINT : "transparent",
                    border: `1px solid ${on ? "rgba(216,184,93,0.50)" : EDGE}`,
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </Field>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <button
          type="button"
          disabled={!draft.title.trim()}
          onClick={() => onSave(draft, false)}
          className="rounded-[9px] px-4 py-[10px] text-[12.5px] font-medium transition-colors hover:bg-[rgba(216,184,93,0.10)]"
          style={{
            color: draft.title.trim() ? GOLD_DEEP : MUTED,
            background: "transparent",
            border: `1px solid ${draft.title.trim() ? GOLD : "rgba(255,255,255,0.10)"}`,
            cursor: draft.title.trim() ? "pointer" : "not-allowed",
          }}
        >
          Save to plan
        </button>
        <button
          type="button"
          disabled={!draft.title.trim()}
          onClick={() => onSave(draft, true)}
          className="rounded-[9px] px-4 py-[10px] text-[12px]"
          style={{ color: TEXT_2, border: `1px solid ${EDGE}` }}
        >
          Add without a time
        </button>
      </div>
    </div>
  );
}

/* ── calendar rendering of the same data ────────────────── */

function CalendarView({ items, onSelect }: { items: PlanItem[]; onSelect: (id: string) => void }) {
  const days = Array.from(new Set(items.filter((i) => i.date).map((i) => i.date as string))).sort();
  if (days.length === 0) {
    return (
      <p className="py-10 text-center text-[12.5px]" style={{ color: MUTED }}>
        Nothing scheduled yet.
      </p>
    );
  }
  return (
    <div className="grid gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-3">
      {days.map((day) => (
        <div
          key={day}
          className="rounded-[12px] p-3.5"
          style={{ background: SURFACE_SOFT, border: `1px solid ${HAIR}` }}
        >
          <div className="flex items-baseline gap-2">
            <span
              className="text-[22px] leading-none"
              style={{
                background: GOLD_TEXT_GRADIENT,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
                fontFamily: DATE_SERIF,
                fontWeight: 400,
              }}
            >
              {dayNum(day)}
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.10em]"
              style={{ color: DAY_META }}
            >
              {monthShort(day)} · {weekday(day)}
            </span>


          </div>

          <ul className="mt-3 space-y-1.5">
            {items
              .filter((i) => i.date === day)
              .map((i) => (
                <li key={i.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(i.id)}
                    className="flex w-full items-center gap-2 text-left text-[12px] transition-opacity hover:opacity-70"
                    style={{ color: TEXT_2 }}
                  >
                    <span className="w-[38px] shrink-0 tabular-nums" style={{ color: TIME_TEXT }}>
                      {i.time ?? "—"}
                    </span>

                    <span
                      className="h-[6px] w-[6px] shrink-0 rounded-full"
                      style={{ background: i.kind === "booking" ? MUTED : GOLD }}
                    />

                    <span className="truncate">{i.title}</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}


/* ── main view ──────────────────────────────────────────── */

export function GroupPlanView({
  bookingItems,
  defaultDate,
  onRequestChange,
  destination,
}: {
  bookingItems: PlanItem[];
  defaultDate?: string;
  onRequestChange: () => void;
  destination?: string;
}) {
  const [myItems, setMyItems] = useState<PlanItem[]>(() => seedMyItems(defaultDate));
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [view, setView] = useState<"Timeline" | "Calendar">("Timeline");
  const [draft, setDraft] = useState<DraftItem | null>(null);
  const columnRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState<RibbonMetrics>(EMPTY_METRICS);

  const withNotes = (item: PlanItem): PlanItem => {
    const local = notesById[item.id];
    if (local === undefined) return item;
    return {
      ...item,
      note: local.trim()
        ? { text: local, author: "you", date: longDate(new Date().toISOString().slice(0, 10)) }
        : null,
    };
  };

  const all = useMemo(
    () => [...bookingItems, ...myItems].map(withNotes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [bookingItems, myItems, notesById],
  );

  const scheduled = all
    .filter((i) => i.date)
    .sort((a, b) =>
      `${a.date} ${a.time ?? "99:99"}`.localeCompare(`${b.date} ${b.time ?? "99:99"}`),
    );
  const unscheduled = all.filter((i) => !i.date);
  const groups = useMemo(() => {
    const map = new Map<string, PlanItem[]>();
    for (const i of scheduled) {
      const key = i.date as string;
      map.set(key, [...(map.get(key) ?? []), i]);
    }
    return [...map.entries()];
  }, [scheduled]);

  /* selectable days = the days the booking actually spans */
  const dayKeys = useMemo(
    () => [...new Set(all.filter((i) => i.date).map((i) => i.date as string))].sort(),
    [all],
  );

  const [focusDay, setFocusDay] = useState<string | null>(null);
  const [unscheduledOpen, setUnscheduledOpen] = useState(true);
  const activeDay = focusDay ?? defaultDate ?? dayKeys[0] ?? null;

  const dayItems = useMemo(
    () => (activeDay ? all.filter((i) => i.date === activeDay) : []),
    [all, activeDay],
  );
  const dayMine = useMemo(() => dayItems.filter((i) => i.kind === "myplan"), [dayItems]);
  const dayBookings = useMemo(
    () => dayItems.filter((i) => i.kind === "booking" && i.time),
    [dayItems],
  );

  const stream = useMemo(
    () => buildDayStream(dayItems, activeDay !== dayKeys[dayKeys.length - 1]),
    [dayItems, activeDay, dayKeys],
  );

  const nextBooking = dayBookings[0] ?? null;
  /* PlanItem carries a start time only — the end is the assumed duration */
  const nextActivityTime = (() => {
    if (!nextBooking?.time) return "—";
    const dur = ASSUMED_MIN[nextBooking.type];
    return dur > 0
      ? `${nextBooking.time} – ${toHHMM(toMin(nextBooking.time) + dur)}`
      : nextBooking.time;
  })();
  const firstFree = stream.find((e) => e.kind === "free") ?? null;

  const todayISO = new Date().toISOString().slice(0, 10);
  const dayIdx = activeDay ? dayKeys.indexOf(activeDay) : -1;
  const dayLabel = activeDay === todayISO ? "TODAY" : `DAY ${dayIdx + 1}`;

  const openEditor = (date?: string, item?: PlanItem) => {
    setDraft(
      item
        ? {
            id: item.id,
            date: item.date ?? "",
            time: item.time ?? "",
            title: item.title,
            location: item.location ?? "",
            notes: item.note?.text ?? "",
            type: item.type,
          }
        : {
            date: date ?? defaultDate ?? "",
            time: "",
            title: "",
            location: "",
            notes: "",
            type: "activity",
          },
    );
  };

  const save = (dr: DraftItem, withoutTime: boolean) => {
    const item: PlanItem = {
      id: dr.id ?? `my-${Date.now()}`,
      kind: "myplan",
      type: dr.type,
      date: withoutTime ? null : dr.date || null,
      time: withoutTime ? null : dr.time || null,
      title: dr.title.trim(),
      secondary: dr.location || undefined,
      summary: dr.location || undefined,
      location: dr.location || undefined,
      note: dr.notes.trim()
        ? {
            text: dr.notes.trim(),
            author: "you",
            date: longDate(new Date().toISOString().slice(0, 10)),
          }
        : null,
    };
    setMyItems((prev) => (dr.id ? prev.map((p) => (p.id === dr.id ? item : p)) : [...prev, item]));
    setDraft(null);
  };

  const remove = (id: string) => {
    setMyItems((prev) => prev.filter((p) => p.id !== id));
    setOpenId((o) => (o === id ? null : o));
  };

  const editNote = (item: PlanItem) => {
    const next = window.prompt("Note for this item", item.note?.text ?? "");
    if (next === null) return;
    setNotesById((p) => ({ ...p, [item.id]: next }));
  };

  const rowProps = {
    onRequestChange,
    onEdit: (item: PlanItem) => openEditor(undefined, item),
    onDelete: remove,
    onEditNote: editNote,
  };

  useLayoutEffect(() => {
    const column = columnRef.current;
    const ribbon = ribbonRef.current;
    if (!column || !ribbon) return;

    const measure = () => {
      const columnBox = column.getBoundingClientRect();
      const yEdge = ribbon.getBoundingClientRect().height - 1;

      const dots = column.querySelectorAll<HTMLElement>("[data-timeline-dot]");
      const first = dots.item(0);
      const last = dots.item(dots.length - 1);
      let xSpine: number | null = null;
      let ySpineEnd = yEdge;
      if (first && last) {
        const firstBox = first.getBoundingClientRect();
        const lastBox = last.getBoundingClientRect();
        xSpine = firstBox.left + firstBox.width / 2 - columnBox.left;
        ySpineEnd = lastBox.top + lastBox.height / 2 - columnBox.top + 15;
      }

      const titleBox = titleRef.current?.getBoundingClientRect();
      const dateBox = dateRef.current?.getBoundingClientRect();

      const next: RibbonMetrics = {
        w: columnBox.width,
        h: columnBox.height,
        yEdge,
        xSpine,
        ySpineEnd,
        xTitleRight: titleBox ? titleBox.right - columnBox.left : 0,
        xDateLeft: dateBox ? dateBox.left - columnBox.left : 0,
      };

      setMetrics((prev) => {
        const near = (a: number, b: number) => Math.abs(a - b) < 0.5;
        return (prev.xSpine === null) === (next.xSpine === null) &&
          near(prev.xSpine ?? 0, next.xSpine ?? 0) &&
          near(prev.w, next.w) &&
          near(prev.h, next.h) &&
          near(prev.yEdge, next.yEdge) &&
          near(prev.ySpineEnd, next.ySpineEnd) &&
          near(prev.xTitleRight, next.xTitleRight) &&
          near(prev.xDateLeft, next.xDateLeft)
          ? prev
          : next;
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(column);
    observer.observe(ribbon);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [groups, openId, view]);

  const paths = journeyPaths(metrics);

  const firstDate = scheduled[0]?.date ?? null;
  const lastDate = scheduled[scheduled.length - 1]?.date ?? null;
  const dateBig =
    firstDate && lastDate
      ? firstDate === lastDate
        ? dayNum(firstDate)
        : `${dayNum(firstDate)} – ${dayNum(lastDate)}`
      : "";
  const dateMeta =
    firstDate && lastDate
      ? firstDate.slice(0, 7) === lastDate.slice(0, 7)
        ? `${monthLong(firstDate)} ${d(firstDate).getFullYear()}`
        : `${monthShort(firstDate)} – ${monthShort(lastDate)} ${d(lastDate).getFullYear()}`
      : "";
  const country = destination?.split(",").pop()?.trim() ?? "";

  return (
    <div className="pb-14" style={{ background: PAGE }}>
      <div
        className="rounded-[20px]"
        style={{
          background: "#192F43",
          border: `1px solid ${EDGE}`,
          boxShadow: "0 1px 2px rgba(0,0,0,0.08), 0 30px 60px -45px rgba(0,0,0,0.30)",
        }}
      >
        <div className="flex flex-col p-2 lg:flex-row">
          {/* ══ left · itinerary timeline (≈65%) ══ */}
          <section className="min-w-0 flex-1 lg:w-[64%]">
            <div ref={columnRef} className="relative -ml-2 -mt-2 -mr-2 lg:mr-0">
            <div ref={ribbonRef} className="relative pl-9 pr-9 pt-9 pb-8 lg:pr-7">
              <div
                aria-hidden
                className="absolute inset-0 rounded-tl-[19px] rounded-tr-[19px] lg:rounded-tr-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.022) 0%, rgba(6,18,32,0.18) 100%)",
                }}
              />

              <div className="relative z-[2] flex flex-wrap items-end justify-between gap-x-10 gap-y-7">
                <div ref={titleRef} className="min-w-0">
                  <Eyebrow>Your booking</Eyebrow>
                  <h2
                    className="mt-[7px] text-[40px] leading-[1.02]"
                    style={{ color: TEXT, fontFamily: SERIF }}
                  >
                    Group Plan
                  </h2>
                  <p className="mt-2 text-[13px]" style={{ color: TEXT_2 }}>
                    Your itinerary for the group.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-14 gap-y-6">
                  {dateBig && (
                    <div ref={dateRef} className="min-w-0">
                      <div
                        className="text-[38px] leading-[0.95] tracking-[-0.015em]"
                        style={{
                          background: GOLD_TEXT_GRADIENT,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          color: "transparent",
                          filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.16))",
                          fontFamily: DATE_SERIF,
                          fontWeight: 400,
                        }}
                      >
                        {dateBig}
                      </div>
                      <div
                        className="mt-[9px] text-[10px] font-semibold uppercase tracking-[0.16em]"
                        style={{ color: INFO_GOLD }}
                      >
                        {dateMeta}
                      </div>
                      {country && (
                        <div
                          className="mt-2 text-[9px] font-medium uppercase"
                          style={{ color: DAY_META, letterSpacing: "0.42em" }}
                        >
                          {country}
                        </div>
                      )}
                    </div>
                  )}
                  <ViewSwitch view={view} onChange={setView} />
                </div>
              </div>
            </div>

            {metrics.w > 0 && metrics.h > 0 && (
              <svg
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 z-[1]"
                width={metrics.w}
                height={metrics.h}
                viewBox={`0 0 ${metrics.w} ${metrics.h}`}
                fill="none"
              >
                <defs>
                  <linearGradient id="gp-sweep" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={GOLD_PATH} stopOpacity={GOLD_PATH_OPACITY} />
                    <stop offset="86%" stopColor={GOLD_PATH} stopOpacity={GOLD_PATH_OPACITY} />
                    <stop offset="100%" stopColor={GOLD_PATH} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gp-wedge" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.05} />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                {paths.wedge && <path d={paths.wedge} fill="url(#gp-wedge)" />}
                {paths.sweep && (
                  <path d={paths.sweep} stroke="url(#gp-sweep)" strokeWidth={2} strokeLinecap="round" />
                )}
                <path
                  d={paths.path}
                  stroke={GOLD_PATH}
                  strokeOpacity={GOLD_PATH_OPACITY}
                  strokeWidth={2}
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 1px rgba(216,184,93,0.22))" }}
                />
              </svg>
            )}

            <div className="pl-9 pr-9 pt-5 pb-7 lg:pr-7">
            {view === "Calendar" ? (
              <CalendarView
                items={scheduled}
                onSelect={(id) => {
                  setView("Timeline");
                  setOpenId(id);
                }}
              />
            ) : (
              <>
                <div className="relative">
                  {groups.map(([day, items], gi) => (
                    <div
                      key={day}
                      className="flex gap-5 sm:gap-7"
                      style={
                        gi > 0
                          ? { borderTop: `1px solid ${HAIR_SOFT}`, marginTop: 12, paddingTop: 20 }
                          : { paddingTop: 6 }
                      }
                    >
                      <div className="w-[64px] shrink-0 pt-[2px]">
                        <div
                          className="text-[38px] leading-[0.95] tracking-[-0.025em]"
                          style={{
                            background: GOLD_TEXT_GRADIENT,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            color: "transparent",
                            filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.16))",
                            fontFamily: DATE_SERIF,
                            fontWeight: 400,
                          }}
                        >

                          {dayNum(day)}
                        </div>

                        <div
                          className="mt-2 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.10em]"
                          style={{ color: DAY_META }}
                        >
                          {monthShort(day)} · {weekday(day)}
                        </div>

                      </div>
                      <ul className="relative min-w-0 flex-1 space-y-2">
                        {items.map((i, ix) => (
                          <Row
                            key={i.id}
                            item={i}
                            open={openId === i.id}
                            last={ix === items.length - 1}
                            onToggle={() => setOpenId((o) => (o === i.id ? null : i.id))}
                            {...rowProps}
                          />
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => openEditor()}
                  className="mt-6 flex h-[62px] w-full items-center justify-center gap-2 rounded-[12px] text-[16px] font-medium transition-colors hover:bg-[rgba(216,184,93,0.10)]"
                  style={{
                    color: GOLD_DEEP,
                    border: `1px solid rgba(216,184,93,0.45)`,
                    background: "transparent",
                  }}
                >
                  <Plus size={16} strokeWidth={1.7} /> Add time or activity
                </button>
              </>
            )}

            {/* legend */}
            <div
              className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-2 pt-5"
              style={{ borderTop: `1px solid ${HAIR_SOFT}` }}
            >
              <Pill kind="booking" />
              <span className="text-[12px]" style={{ color: TEXT_2 }}>
                Part of your hotel booking
              </span>
              <span className="text-[12px]" style={{ color: MUTED }}>
                ·
              </span>
              <Pill kind="myplan" />
              <span className="text-[12px]" style={{ color: TEXT_2 }}>
                Added by you
              </span>
            </div>
            </div>
            </div>
          </section>

          {/* ══ right · group planner (≈35%) ══ */}
          <aside
            className="m-4 w-full shrink-0 rounded-[18px] px-6 py-7 lg:mt-4 lg:mr-4 lg:mb-4 lg:ml-4 lg:w-[calc(36%-32px)]"
            style={{
              background: PLANNER_BG,
              border: `1px solid ${PLANNER_LINE}`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.035), 0 8px 24px rgba(0,0,0,0.10)",
            }}
          >
            {/* ── header ── */}
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.15em]"
              style={{ color: PLANNER_GOLD }}
            >
              Your personal plan
            </span>
            <h3
              className="mt-2.5 text-[30px] leading-none"
              style={{ color: PLANNER_TEXT, fontFamily: SERIF }}
            >
              Group Planner
            </h3>
            <p className="mt-2.5 text-[14px]" style={{ color: PLANNER_MUTED }}>
              Plan your free time.
            </p>

            <span
              aria-hidden
              className="mt-6 block h-px w-full"
              style={{ background: PLANNER_LINE }}
            />

            {/* ── day switcher — quiet ── */}
            <div className="mt-5 flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: PLANNER_MUTED }}
                >
                  {dayLabel}
                </span>
                {activeDay && (
                  <span
                    className="truncate text-[10px] font-medium uppercase tracking-[0.12em]"
                    style={{ color: PLANNER_MUTED }}
                  >
                    {`• ${weekday(activeDay)} ${dayNum(activeDay)} ${monthShort(activeDay).slice(0, 3)}`.toUpperCase()}
                  </span>
                )}
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous day"
                  disabled={dayIdx <= 0}
                  onClick={() => setFocusDay(dayKeys[dayIdx - 1] ?? null)}
                  className="grid h-[22px] w-[22px] place-items-center rounded-[6px] transition-colors hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-30"
                  style={{ color: PLANNER_MUTED, border: `1px solid ${PLANNER_LINE}` }}
                >
                  <ChevronLeft size={13} strokeWidth={1.7} />
                </button>
                <button
                  type="button"
                  aria-label="Next day"
                  disabled={dayIdx < 0 || dayIdx >= dayKeys.length - 1}
                  onClick={() => setFocusDay(dayKeys[dayIdx + 1] ?? null)}
                  className="grid h-[22px] w-[22px] place-items-center rounded-[6px] transition-colors hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-30"
                  style={{ color: PLANNER_MUTED, border: `1px solid ${PLANNER_LINE}` }}
                >
                  <ChevronRight size={13} strokeWidth={1.7} />
                </button>
              </span>
            </div>

            {/* ── 1 · next group activity ── */}
            <PlannerLabel>Next group activity</PlannerLabel>
            {nextBooking ? (
              <div
                className="mt-3 flex items-start justify-between gap-3 rounded-[12px] px-5 py-[18px]"
                style={{ background: PLANNER_SURFACE, border: `1px solid ${PLANNER_LINE}` }}
              >
                <div className="min-w-0">
                  <div
                    className="text-[22px] font-semibold leading-none tabular-nums"
                    style={{ color: PLANNER_TEXT }}
                  >
                    {nextActivityTime}
                  </div>
                  <div
                    className="mt-2 truncate text-[15px] font-semibold"
                    style={{ color: PLANNER_TEXT }}
                  >
                    {nextBooking.title}
                  </div>
                  {(nextBooking.location || nextBooking.secondary) && (
                    <div className="mt-1 truncate text-[12.5px]" style={{ color: PLANNER_MUTED }}>
                      {[nextBooking.location, nextBooking.secondary]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  )}
                </div>
                <CalendarDays
                  size={18}
                  strokeWidth={1.5}
                  className="mt-1 shrink-0"
                  style={{ color: PLANNER_GOLD }}
                />
              </div>
            ) : (
              <p className="mt-3 text-[12.5px]" style={{ color: PLANNER_MUTED }}>
                Nothing scheduled for this day.
              </p>
            )}

            {/* ── 2 · my plans ── */}
            <PlannerLabel>My plans</PlannerLabel>
            {dayMine.length === 0 ? (
              <p className="mt-3 text-[12.5px]" style={{ color: PLANNER_MUTED }}>
                No personal plans yet.
              </p>
            ) : (
              <ul className="mt-3">
                {dayMine
                  .slice()
                  .sort((a, b) => (a.time ?? "99:99").localeCompare(b.time ?? "99:99"))
                  .map((item, i) => (
                    <li
                      key={item.id}
                      className="flex items-start gap-4 py-3"
                      style={
                        i === 0 ? undefined : { borderTop: `1px solid ${PLANNER_LINE}` }
                      }
                    >
                      <span
                        className="w-[44px] shrink-0 text-[14px] font-semibold tabular-nums"
                        style={{ color: PLANNER_TEXT }}
                      >
                        {item.time ?? "—"}
                      </span>
                      <span className="relative w-[9px] shrink-0 self-stretch" aria-hidden>
                        <span
                          className="absolute inset-y-[-12px] left-1/2 w-px -translate-x-1/2"
                          style={{ background: PLANNER_LINE }}
                        />
                        <span
                          className="absolute left-1/2 top-[6px] h-[8px] w-[8px] -translate-x-1/2 rounded-full"
                          style={{ background: PLANNER_GOLD }}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className="block truncate text-[15px] font-semibold leading-tight"
                          style={{ color: PLANNER_TEXT }}
                        >
                          {item.title}
                        </span>
                        {(item.secondary || item.location) && (
                          <span
                            className="mt-1 block truncate text-[12.5px]"
                            style={{ color: PLANNER_MUTED }}
                          >
                            {item.secondary ?? item.location}
                          </span>
                        )}
                      </span>
                      <Menu
                        items={[
                          {
                            label: "Edit",
                            icon: <Pencil size={13} />,
                            onClick: () => openEditor(undefined, item),
                          },
                          {
                            label: "Delete",
                            icon: <Trash2 size={13} />,
                            onClick: () => remove(item.id),
                          },
                        ]}
                      />
                    </li>
                  ))}
              </ul>
            )}

            {/* ── 3 · primary action ── */}
            <button
              type="button"
              onClick={() => openEditor(activeDay ?? undefined)}
              className="mt-5 flex h-[47px] w-full items-center justify-center gap-2.5 rounded-[11px] text-[14.5px] font-medium transition-colors hover:bg-[rgba(201,168,95,0.08)]"
              style={{
                background: PLANNER_SURFACE,
                border: `1px solid rgba(201,168,95,0.45)`,
                color: PLANNER_TEXT,
              }}
            >
              <Plus size={17} strokeWidth={1.9} style={{ color: PLANNER_GOLD }} />
              Add personal plan
            </button>

            {/* ── 4 · available time — only when meaningful ── */}
            {firstFree && firstFree.kind === "free" && (
              <>
                <PlannerLabel>
                  {firstFree.end === null
                    ? `After ${toHHMM(firstFree.start)}`
                    : `Free ${toHHMM(firstFree.start)} – ${toHHMM(firstFree.end)}`}
                </PlannerLabel>
                <div
                  className="mt-3 flex items-center gap-3.5 rounded-[12px] px-4 py-3.5"
                  style={{ background: PLANNER_SURFACE, border: `1px solid ${PLANNER_LINE}` }}
                >
                  <span
                    className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full"
                    style={{ background: "rgba(201,168,95,0.10)", color: PLANNER_GOLD }}
                  >
                    {firstFree.end === null ? (
                      <Moon size={15} strokeWidth={1.5} />
                    ) : (
                      <Clock size={15} strokeWidth={1.5} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className="block truncate text-[14.5px] font-semibold"
                      style={{ color: PLANNER_TEXT }}
                    >
                      {firstFree.minutes === null
                        ? "Your evening is free"
                        : `${fmtDur(firstFree.minutes)} available`}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        openEditor(activeDay ?? undefined);
                        setDraft((prev) =>
                          prev ? { ...prev, time: toHHMM(firstFree.start) } : prev,
                        );
                      }}
                      className="mt-0.5 text-[13px] font-medium transition-opacity hover:opacity-75"
                      style={{ color: PLANNER_GOLD }}
                    >
                      {firstFree.minutes === null ? "+ Add something" : "+ Add plan"}
                    </button>
                  </span>
                </div>
              </>
            )}

            {unscheduled.length > 0 && (
              <PlannerSection
                title="Unscheduled"
                count={unscheduled.length}
                collapsible
                open={unscheduledOpen}
                onToggle={() => setUnscheduledOpen((o) => !o)}
              >
                <div className="mt-1">
                  {unscheduled.map((i) => (
                    <div key={i.id} className="flex items-center gap-2.5 py-[7px]">
                      <button
                        type="button"
                        aria-label={`Mark "${i.title}" done`}
                        onClick={() => remove(i.id)}
                        className="h-[15px] w-[15px] shrink-0 rounded-full transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                        style={{ border: "1px solid rgba(255,255,255,0.28)", background: "transparent" }}
                      />
                      <span
                        className="min-w-0 flex-1 truncate text-[13px]"
                        style={{ color: PLANNER_TEXT }}
                      >
                        {i.title}
                      </span>
                      <Menu
                        items={[
                          {
                            label: "Edit",
                            icon: <Pencil size={13} />,
                            onClick: () => openEditor(undefined, i),
                          },
                          {
                            label: "Delete",
                            icon: <Trash2 size={13} />,
                            onClick: () => remove(i.id),
                          },
                        ]}
                      />
                    </div>
                  ))}
                </div>
              </PlannerSection>
            )}
          </aside>

        </div>
      </div>

      {draft && (
        <Editor draft={draft} onChange={setDraft} onSave={save} onClose={() => setDraft(null)} />
      )}
    </div>
  );
}

function PlannerSection({
  title,
  count,
  collapsible,
  open,
  onToggle,
  children,
}: {
  title: string;
  count: number;
  collapsible?: boolean;
  open?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}) {
  const header = (
    <>
      <span
        className="text-[10.5px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: MUTED }}
      >
        {title}
      </span>
      <span className="flex items-center gap-2">
        <span
          className="inline-grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full text-[11px] font-semibold leading-none tabular-nums"
          style={{
            color: GOLD_DEEP,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {count}
        </span>
        {collapsible && (
          <ChevronDown
            size={14}
            strokeWidth={1.6}
            className="transition-transform"
            style={{ color: MUTED, transform: open ? "rotate(180deg)" : "none" }}
          />
        )}
      </span>
    </>
  );

  return (
    <div className="mt-8" style={{ paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.09)" }}>
      {collapsible ? (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={!!open}
          className="flex w-full items-center justify-between pb-2 text-left"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.09)" }}
        >
          {header}
        </button>
      ) : (
        <div
          className="flex items-center justify-between pb-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.09)" }}
        >
          {header}
        </div>
      )}
      {(!collapsible || open) && <div>{children}</div>}
    </div>
  );
}
