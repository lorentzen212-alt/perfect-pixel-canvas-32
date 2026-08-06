import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Bus,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Grid2X2,
  Hotel,
  Link2,
  List,
  MessageSquare,
  MoreHorizontal,
  NotebookPen,
  Paperclip,
  Pin,
  Plus,
  Search,
  Sparkles,
  Star,
  User,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";

/* ── shared navy material (identical to Overview / Changes / Documents) ── */
const NAVY_TEXTURE =
  "radial-gradient(1100px 420px at 18% -10%, rgba(255,255,255,0.045), transparent 62%), radial-gradient(700px 360px at 88% 108%, rgba(120,160,195,0.05), transparent 60%)";
const INK = `${NAVY_TEXTURE}, linear-gradient(180deg, #24445E 0%, #203D55 55%, #1C374D 100%)`;
const INK_2 = `${NAVY_TEXTURE}, linear-gradient(180deg, #2A4B64 0%, #26455C 55%, #223F54 100%)`;
const NAVY_INNER =
  "inset 0 1px 0 rgba(255,255,255,0.03), inset 0 -1px 0 rgba(0,0,0,0.12), inset 0 8px 22px -18px rgba(0,0,0,0.35), 0 0 0 1px rgba(8,18,28,0.25)";
const NAVY_BORDER = "rgba(255,255,255,0.06)";
const TEXT = "#F3F1EB";
const TEXT_2 = "rgba(233,238,243,0.78)";
const MUTED = "rgba(206,218,228,0.55)";
const GOLD_MET_MID = "#C5962D";
const GOLD_SOFT = "#D9BE74";
const GOLD_GRAD = "linear-gradient(180deg, #E7C877 0%, #C5962D 52%, #A87C21 100%)";

export type NoteCategory =
  | "Guest information"
  | "Rooming list"
  | "Special requests"
  | "Dietary"
  | "Hotel communication"
  | "Meetings & Events"
  | "Transport"
  | "Accommodation"
  | "Finance"
  | "Internal notes";

type Priority = "Important" | "Normal" | "Info";

export type Note = {
  id: string;
  title: string;
  preview: string;
  body: string;
  category: NoteCategory;
  priority: Priority;
  author: string;
  updatedLabel: string;
  updatedAt: number;
  pinned: boolean;
  checklist?: { label: string; done: boolean }[];
  attachments?: string[];
  links?: { label: string; href: string }[];
  mentions?: string[];
  dueLabel?: string;
};

const CAT_COLOR: Record<NoteCategory, string> = {
  "Guest information": "#7FA7D4",
  "Rooming list": "#5FBFAE",
  "Special requests": "#D9A441",
  Dietary: "#D9705A",
  "Hotel communication": "#9A8FD0",
  "Meetings & Events": "#B08FD0",
  Transport: "#E0B341",
  Accommodation: "#6FA8DC",
  Finance: "#8DA88A",
  "Internal notes": "#9BA9B4",
};

const CAT_ICON: Record<NoteCategory, React.ReactNode> = {
  "Guest information": <User size={16} />,
  "Rooming list": <ClipboardList size={16} />,
  "Special requests": <Sparkles size={16} />,
  Dietary: <UtensilsCrossed size={16} />,
  "Hotel communication": <MessageSquare size={16} />,
  "Meetings & Events": <Users size={16} />,
  Transport: <Bus size={16} />,
  Accommodation: <Hotel size={16} />,
  Finance: <CreditCard size={16} />,
  "Internal notes": <NotebookPen size={16} />,
};

const CATEGORIES = Object.keys(CAT_COLOR) as NoteCategory[];

const day = 86400000;
const now = Date.now();

const SEED: Note[] = [
  {
    id: "n1",
    title: "VIP guest arriving early on 12 Sep",
    preview: "The group leader, Mr. Erik Nilsen, will arrive early around 10:00.",
    body: "The group leader, Mr. Erik Nilsen, will arrive early around 10:00. Hotel has been asked to hold luggage and prepare an early check-in for room 412 if available.",
    category: "Guest information",
    priority: "Important",
    author: "Emma Hansen",
    updatedLabel: "Today, 11:24",
    updatedAt: now,
    pinned: true,
    checklist: [
      { label: "Confirm early check-in with front desk", done: true },
      { label: "Arrange luggage storage", done: false },
    ],
    mentions: ["@Nicklas"],
    dueLabel: "12 Sep 2026",
  },
  {
    id: "n2",
    title: "Vegetarian meal requested",
    preview: "3 guests are vegetarian and 2 guests have gluten allergy.",
    body: "3 guests are vegetarian and 2 guests have a gluten allergy. Kitchen confirmed alternatives for both dinner services.",
    category: "Dietary",
    priority: "Important",
    author: "Emma Hansen",
    updatedLabel: "Today, 09:15",
    updatedAt: now - 2 * 3600000,
    pinned: false,
    attachments: ["dietary-overview.pdf"],
  },
  {
    id: "n3",
    title: "Meeting room changed to Fjord Hall",
    preview: "U-shape setup for 20 people with projector and flipchart.",
    body: "The 13 Sep session was moved to Fjord Hall. U-shape setup for 20 people with projector and flipchart. Coffee break at 10:30.",
    category: "Meetings & Events",
    priority: "Normal",
    author: "Emma Hansen",
    updatedLabel: "Yesterday, 16:40",
    updatedAt: now - day,
    pinned: false,
  },
  {
    id: "n4",
    title: "Payment reminder — prepayment terms confirmed",
    preview: "Prepayment 29 days prior to arrival.",
    body: "Prepayment of 30% is due 29 days prior to arrival. Finance notified, invoice reference attached.",
    category: "Finance",
    priority: "Normal",
    author: "Emma Hansen",
    updatedLabel: "22 Jul 2026",
    updatedAt: now - 14 * day,
    pinned: false,
    attachments: ["invoice-HGB-00104.pdf"],
  },
  {
    id: "n5",
    title: "Rooming list submitted",
    preview: "Rooming list must be received no later than 10 days before arrival.",
    body: "First version of the rooming list was submitted to the hotel. Remaining 16 guest names must be received no later than 10 days before arrival.",
    category: "Rooming list",
    priority: "Important",
    author: "Emma Hansen",
    updatedLabel: "20 Jul 2026",
    updatedAt: now - 16 * day,
    pinned: true,
    dueLabel: "02 Sep 2026",
  },
  {
    id: "n6",
    title: "Airport transfer booked",
    preview: "Group arrival 12 Sep. 2 buses from Bergen Airport at 11:00.",
    body: "Two buses booked from Bergen Airport at 11:00 on 12 Sep. Driver contact will be shared 24h before arrival.",
    category: "Transport",
    priority: "Normal",
    author: "Emma Hansen",
    updatedLabel: "18 Jul 2026",
    updatedAt: now - 18 * day,
    pinned: false,
  },
  {
    id: "n7",
    title: "Extra twin rooms requested",
    preview: "Requested 4 additional twin rooms for the second night.",
    body: "Requested 4 additional twin rooms for the second night. Awaiting hotel confirmation on availability and rate parity.",
    category: "Special requests",
    priority: "Important",
    author: "Nicklas Lorentzen",
    updatedLabel: "16 Jul 2026",
    updatedAt: now - 20 * day,
    pinned: false,
  },
  {
    id: "n8",
    title: "Hotel approved late check-out",
    preview: "Late check-out until 15:00 approved for all rooms.",
    body: "The hotel approved late check-out until 15:00 for all rooms on departure day at no extra cost.",
    category: "Hotel communication",
    priority: "Info",
    author: "Radisson Blu",
    updatedLabel: "10 Jul 2026",
    updatedAt: now - 26 * day,
    pinned: false,
    links: [{ label: "Confirmation e-mail", href: "#" }],
  },
  {
    id: "n9",
    title: "Allergy information for dinner service",
    preview: "One guest has a severe nut allergy — kitchen informed.",
    body: "One guest has a severe nut allergy. The kitchen has been informed and will prepare a separate plated menu.",
    category: "Dietary",
    priority: "Important",
    author: "Emma Hansen",
    updatedLabel: "08 Jul 2026",
    updatedAt: now - 28 * day,
    pinned: false,
  },
  {
    id: "n10",
    title: "Internal reminder — send final invoice split",
    preview: "Split invoicing between two cost centres before departure.",
    body: "Remember to split invoicing between the two cost centres before departure and forward to accounting.",
    category: "Internal notes",
    priority: "Info",
    author: "Nicklas Lorentzen",
    updatedLabel: "05 Jul 2026",
    updatedAt: now - 31 * day,
    pinned: false,
    mentions: ["@Emma"],
  },
  {
    id: "n11",
    title: "Accommodation upgrade for organiser",
    preview: "Organiser upgraded to a junior suite, complimentary.",
    body: "The organiser was upgraded to a junior suite complimentary as part of the group agreement.",
    category: "Accommodation",
    priority: "Info",
    author: "Radisson Blu",
    updatedLabel: "02 Jul 2026",
    updatedAt: now - 34 * day,
    pinned: false,
  },
  {
    id: "n12",
    title: "Welcome desk in lobby at 11:30",
    preview: "Staffed welcome desk with key envelopes prepared per room.",
    body: "A staffed welcome desk will be set up in the lobby at 11:30 with key envelopes prepared per room.",
    category: "Guest information",
    priority: "Normal",
    author: "Emma Hansen",
    updatedLabel: "30 Jun 2026",
    updatedAt: now - 37 * day,
    pinned: false,
  },
];

const PRIORITY_STYLE: Record<Priority, { bg: string; color: string; border: string }> = {
  Important: {
    bg: "rgba(197,150,45,0.16)",
    color: GOLD_SOFT,
    border: "rgba(217,190,116,0.34)",
  },
  Normal: {
    bg: "rgba(255,255,255,0.06)",
    color: TEXT_2,
    border: "rgba(255,255,255,0.10)",
  },
  Info: {
    bg: "rgba(127,167,212,0.14)",
    color: "#A9C6E4",
    border: "rgba(127,167,212,0.26)",
  },
};

const PAGE_SIZE = 8;

/* ── small building blocks ── */

function Panel({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section
      className={`rounded-[16px] ${className}`}
      style={{
        background: INK,
        border: `1px solid ${NAVY_BORDER}`,
        boxShadow: NAVY_INNER,
        ...style,
      }}
    >
      {children}
    </section>
  );
}

function Badge({
  label,
  color,
  bg,
  border,
}: {
  label: string;
  color: string;
  bg: string;
  border: string;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-2.5 py-[3px] text-[10.5px] font-semibold tracking-[0.02em]"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      {label}
    </span>
  );
}

function Donut({ data, total }: { data: { label: string; value: number; color: string }[]; total: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative grid h-[136px] w-[136px] shrink-0 place-items-center">
      <svg viewBox="0 0 140 140" className="h-[136px] w-[136px] -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="15" />
        {data.map((d) => {
          const len = total ? (d.value / total) * c : 0;
          const el = (
            <circle
              key={d.label}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="15"
              strokeDasharray={`${Math.max(len - 2, 0)} ${c}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute text-center">
        <div className="text-[22px] leading-none" style={{ color: TEXT, fontFamily: SERIF }}>
          {total}
        </div>
        <div className="mt-1 text-[10.5px]" style={{ color: MUTED }}>
          Total
        </div>
      </div>
    </div>
  );
}

/* ── main view ── */

export function BookingNotesView({
  reference,
  bookingName,
}: {
  reference: string;
  bookingName: string;
}) {
  const [notes, setNotes] = useState<Note[]>(SEED);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<NoteCategory | "all">("all");
  const [sort, setSort] = useState<"recent" | "oldest" | "priority" | "title">("recent");
  const [view, setView] = useState<"list" | "compact">("list");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [glow, setGlow] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const glowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (glowTimer.current) clearTimeout(glowTimer.current); }, []);

  const touch = (id: string) => {
    setGlow(id);
    if (glowTimer.current) clearTimeout(glowTimer.current);
    glowTimer.current = setTimeout(() => setGlow(null), 2600);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = notes.filter((n) => {
      if (cat !== "all" && n.category !== cat) return false;
      if (!q) return true;
      return [n.title, n.preview, n.body, n.category, n.author].join(" ").toLowerCase().includes(q);
    });
    const prioRank: Record<Priority, number> = { Important: 0, Normal: 1, Info: 2 };
    list.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (sort === "recent") return b.updatedAt - a.updatedAt;
      if (sort === "oldest") return a.updatedAt - b.updatedAt;
      if (sort === "title") return a.title.localeCompare(b.title);
      return prioRank[a.priority] - prioRank[b.priority] || b.updatedAt - a.updatedAt;
    });
    return list;
  }, [notes, query, cat, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const counts = useMemo(() => {
    const m = new Map<NoteCategory, number>();
    notes.forEach((n) => m.set(n.category, (m.get(n.category) ?? 0) + 1));
    return CATEGORIES.map((c) => ({ label: c, value: m.get(c) ?? 0, color: CAT_COLOR[c] })).filter(
      (d) => d.value > 0,
    );
  }, [notes]);

  const pinned = notes.filter((n) => n.pinned);
  const open = notes.find((n) => n.id === openId) ?? null;

  const togglePin = (id: string) => {
    setNotes((ns) => ns.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
    touch(id);
    setMenuId(null);
  };

  const addNote = () => {
    const id = `n${Date.now()}`;
    setNotes((ns) => [
      {
        id,
        title: "Untitled note",
        preview: "Add details for this booking note.",
        body: "",
        category: "Internal notes",
        priority: "Normal",
        author: "Emma Hansen",
        updatedLabel: "Just now",
        updatedAt: Date.now(),
        pinned: false,
      },
      ...ns,
    ]);
    setOpenId(id);
    touch(id);
  };

  const patch = (id: string, p: Partial<Note>) => {
    setNotes((ns) =>
      ns.map((n) =>
        n.id === id ? { ...n, ...p, updatedLabel: "Just now", updatedAt: Date.now() } : n,
      ),
    );
    touch(id);
  };

  const selectStyle: React.CSSProperties = {
    background: "rgba(10,22,31,0.34)",
    border: `1px solid ${NAVY_BORDER}`,
    color: TEXT_2,
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_378px]">
      {/* ── LEFT: all notes ── */}
      <Panel className="min-w-0 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-[22px] leading-tight" style={{ color: TEXT, fontFamily: SERIF }}>
              All notes
            </h2>
            <p className="mt-1 text-[12.5px]" style={{ color: MUTED }}>
              Keep track of important details, reminders and internal notes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" color={MUTED} />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search notes..."
                className="h-[34px] w-[188px] rounded-[9px] pl-8 pr-3 text-[12.5px] outline-none placeholder:text-[rgba(206,218,228,0.45)]"
                style={selectStyle}
              />
            </label>

            <select
              value={cat}
              onChange={(e) => {
                setCat(e.target.value as NoteCategory | "all");
                setPage(1);
              }}
              className="h-[34px] rounded-[9px] px-2.5 text-[12.5px] outline-none"
              style={selectStyle}
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-[34px] rounded-[9px] px-2.5 text-[12.5px] outline-none"
              style={selectStyle}
            >
              <option value="recent">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="priority">Priority</option>
              <option value="title">Title A–Z</option>
            </select>

            <div className="flex h-[34px] items-center gap-1 rounded-[9px] px-1" style={selectStyle}>
              {([["list", <List key="l" size={14} />], ["compact", <Grid2X2 key="c" size={14} />]] as const).map(
                ([v, icon]) => (
                  <button
                    key={v}
                    type="button"
                    aria-label={v === "list" ? "List view" : "Compact view"}
                    onClick={() => setView(v)}
                    className="grid h-[26px] w-[28px] place-items-center rounded-[7px] transition-colors"
                    style={{
                      background: view === v ? "rgba(255,255,255,0.10)" : "transparent",
                      color: view === v ? GOLD_SOFT : MUTED,
                    }}
                  >
                    {icon}
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              onClick={addNote}
              className="inline-flex h-[34px] items-center gap-1.5 rounded-[9px] px-3.5 text-[12.5px] font-semibold transition-transform hover:-translate-y-[1px]"
              style={{
                background: GOLD_GRAD,
                color: "#241B06",
                border: "1px solid rgba(255,255,255,0.18)",
                boxShadow: "0 6px 18px -12px rgba(0,0,0,0.65)",
              }}
            >
              <Plus size={14} /> New note
            </button>
          </div>
        </div>

        {/* rows */}
        <div className="mt-5 space-y-2.5">
          {rows.map((n) => {
            const important = n.priority === "Important";
            const isGlow = glow === n.id;
            return (
              <div key={n.id} className="relative flex items-stretch gap-2">
                {n.pinned && (
                  <span className="grid w-4 shrink-0 place-items-start pt-4" style={{ color: GOLD_MET_MID }}>
                    <Pin size={13} fill={GOLD_MET_MID} />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setOpenId(n.id)}
                  className="hgb-note-row min-w-0 flex-1 rounded-[13px] text-left transition-all duration-200 hover:-translate-y-[1px]"
                  style={{
                    background: INK_2,
                    border: `1px solid ${important ? "rgba(217,190,116,0.28)" : NAVY_BORDER}`,
                    boxShadow: isGlow
                      ? "0 0 0 1px rgba(217,190,116,0.45), 0 0 26px -6px rgba(197,150,45,0.55)"
                      : NAVY_INNER,
                    padding: view === "compact" ? "10px 14px" : "14px 16px",
                  }}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px]"
                      style={{
                        color: CAT_COLOR[n.category],
                        background: "rgba(10,22,31,0.32)",
                        border: `1px solid ${NAVY_BORDER}`,
                      }}
                    >
                      {CAT_ICON[n.category]}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-[13.5px] font-semibold" style={{ color: TEXT }}>
                          {n.title}
                        </span>
                        {important && (
                          <Badge label="Important" {...PRIORITY_STYLE.Important} />
                        )}
                      </span>
                      {view === "list" && (
                        <span className="mt-1 block truncate text-[12px]" style={{ color: MUTED }}>
                          {n.preview}
                        </span>
                      )}
                      <span className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px]" style={{ color: MUTED }}>
                        {n.attachments?.length ? (
                          <span className="inline-flex items-center gap-1">
                            <Paperclip size={11} /> {n.attachments.length}
                          </span>
                        ) : null}
                        {n.checklist?.length ? (
                          <span className="inline-flex items-center gap-1">
                            <ClipboardList size={11} />
                            {n.checklist.filter((c) => c.done).length}/{n.checklist.length}
                          </span>
                        ) : null}
                        {n.dueLabel ? (
                          <span className="inline-flex items-center gap-1">
                            <CalendarClock size={11} /> {n.dueLabel}
                          </span>
                        ) : null}
                      </span>
                    </span>

                    <span className="hidden w-[170px] shrink-0 items-center gap-2 md:flex">
                      <span
                        className="h-[7px] w-[7px] shrink-0 rounded-full"
                        style={{ background: CAT_COLOR[n.category] }}
                      />
                      <span className="truncate text-[12px]" style={{ color: TEXT_2 }}>
                        {n.category}
                      </span>
                    </span>

                    <span className="hidden w-[132px] shrink-0 text-right lg:block">
                      <span className="block truncate text-[12px]" style={{ color: TEXT_2 }}>
                        {n.author}
                      </span>
                      <span className="block truncate text-[11px]" style={{ color: MUTED }}>
                        {n.updatedLabel}
                      </span>
                    </span>

                    <span className="flex shrink-0 items-center gap-1">
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={n.pinned ? "Unpin note" : "Pin note"}
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(n.id);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.stopPropagation();
                            togglePin(n.id);
                          }
                        }}
                        className="grid h-7 w-7 place-items-center rounded-[8px] transition-colors"
                        style={{ color: n.pinned ? GOLD_MET_MID : MUTED }}
                      >
                        <Pin size={13} />
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label="Note actions"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuId((m) => (m === n.id ? null : n.id));
                        }}
                        onKeyDown={(e) => e.key === "Enter" && e.stopPropagation()}
                        className="grid h-7 w-7 place-items-center rounded-[8px]"
                        style={{ color: MUTED }}
                      >
                        <MoreHorizontal size={15} />
                      </span>
                    </span>
                  </div>
                </button>

                {menuId === n.id && (
                  <div
                    className="absolute right-2 top-[46px] z-20 w-[168px] rounded-[10px] p-1 text-[12.5px]"
                    style={{ background: INK, border: `1px solid ${NAVY_BORDER}`, boxShadow: "0 18px 40px -20px rgba(0,0,0,0.8)" }}
                  >
                    {[
                      { label: n.pinned ? "Unpin note" : "Pin to top", fn: () => togglePin(n.id) },
                      { label: "Open note", fn: () => { setOpenId(n.id); setMenuId(null); } },
                      {
                        label: n.priority === "Important" ? "Mark as normal" : "Mark as important",
                        fn: () => {
                          patch(n.id, { priority: n.priority === "Important" ? "Normal" : "Important" });
                          setMenuId(null);
                        },
                      },
                      {
                        label: "Delete note",
                        fn: () => {
                          setNotes((ns) => ns.filter((x) => x.id !== n.id));
                          setMenuId(null);
                        },
                      },
                    ].map((it) => (
                      <button
                        key={it.label}
                        type="button"
                        onClick={it.fn}
                        className="block w-full rounded-[7px] px-2.5 py-1.5 text-left transition-colors hover:bg-[rgba(255,255,255,0.07)]"
                        style={{ color: TEXT_2 }}
                      >
                        {it.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {rows.length === 0 && (
            <p className="py-14 text-center text-[13px]" style={{ color: MUTED }}>
              No notes match your search.
            </p>
          )}
        </div>

        {/* pagination */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[12px]" style={{ color: MUTED }}>
            Showing {filtered.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(current * PAGE_SIZE, filtered.length)} of {filtered.length} notes
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Previous page"
              onClick={() => setPage(Math.max(1, current - 1))}
              className="grid h-[30px] w-[30px] place-items-center rounded-[8px]"
              style={selectStyle}
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className="h-[30px] min-w-[30px] rounded-[8px] px-2 text-[12px] font-semibold"
                style={
                  p === current
                    ? { background: GOLD_GRAD, color: "#241B06", border: "1px solid rgba(255,255,255,0.18)" }
                    : selectStyle
                }
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              aria-label="Next page"
              onClick={() => setPage(Math.min(pageCount, current + 1))}
              className="grid h-[30px] w-[30px] place-items-center rounded-[8px]"
              style={selectStyle}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </Panel>

      {/* ── RIGHT column ── */}
      <div className="min-w-0 space-y-4">
        <Panel className="p-5">
          <h3 className="text-[15px] font-semibold" style={{ color: TEXT }}>
            Note categories
          </h3>
          <div className="mt-4 flex items-center gap-4">
            <ul className="min-w-0 flex-1 space-y-[7px]">
              {counts.map((c) => (
                <li key={c.label} className="flex items-center gap-2 text-[12px]">
                  <span className="h-[7px] w-[7px] shrink-0 rounded-full" style={{ background: c.color }} />
                  <span className="min-w-0 flex-1 truncate" style={{ color: TEXT_2 }}>
                    {c.label}
                  </span>
                  <span style={{ color: MUTED }}>{c.value}</span>
                </li>
              ))}
            </ul>
            <Donut data={counts} total={notes.length} />
          </div>
        </Panel>

        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] font-semibold" style={{ color: TEXT }}>
              Pinned notes
            </h3>
            <button
              type="button"
              onClick={() => {
                setCat("all");
                setQuery("");
                setPage(1);
              }}
              className="text-[12px] font-semibold"
              style={{ color: GOLD_SOFT }}
            >
              View all
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {pinned.length === 0 && (
              <p className="py-4 text-[12.5px]" style={{ color: MUTED }}>
                No pinned notes yet.
              </p>
            )}
            {pinned.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => setOpenId(n.id)}
                className="flex w-full items-center gap-3 rounded-[11px] px-3 py-2.5 text-left transition-transform hover:-translate-y-[1px]"
                style={{ background: INK_2, border: `1px solid ${NAVY_BORDER}` }}
              >
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px]"
                  style={{ color: CAT_COLOR[n.category], background: "rgba(10,22,31,0.3)" }}
                >
                  {CAT_ICON[n.category]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-semibold" style={{ color: TEXT }}>
                    {n.title}
                  </span>
                  <span className="block truncate text-[11px]" style={{ color: MUTED }}>
                    {n.category} • {n.updatedLabel}
                  </span>
                </span>
                <Pin size={13} color={GOLD_MET_MID} fill={GOLD_MET_MID} />
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <h3 className="text-[15px] font-semibold" style={{ color: TEXT }}>
            Recent activity
          </h3>
          <ul className="mt-3.5 space-y-3.5">
            {[
              { who: "EH", icon: <NotebookPen size={13} />, text: "Emma added a new note", sub: "VIP guest arriving early on 12 Sep", when: "Today, 11:24" },
              { who: "RB", icon: <MessageSquare size={13} />, text: "Hotel replied", sub: "Late check-out approved", when: "Today, 09:40" },
              { who: "EH", icon: <ClipboardList size={13} />, text: "Rooming list updated", sub: "42 of 58 guests confirmed", when: "Yesterday, 16:12" },
              { who: "NL", icon: <Star size={13} />, text: "Special request approved", sub: "Extra twin rooms", when: "22 Jul 2026" },
              { who: "EH", icon: <Paperclip size={13} />, text: "Document uploaded", sub: "invoice-HGB-00104.pdf", when: "20 Jul 2026" },
            ].map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-semibold"
                  style={{ background: "rgba(10,22,31,0.34)", border: `1px solid ${NAVY_BORDER}`, color: GOLD_SOFT }}
                >
                  {a.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px]" style={{ color: TEXT_2 }}>
                    {a.text}
                  </span>
                  <span className="block truncate text-[12.5px] font-semibold" style={{ color: TEXT }}>
                    {a.sub}
                  </span>
                </span>
                <span className="shrink-0 text-[11px]" style={{ color: MUTED }}>
                  {a.when}
                </span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-4 inline-flex h-[36px] w-full items-center justify-center gap-2 rounded-[10px] text-[12.5px] font-semibold"
            style={{ background: "rgba(10,22,31,0.34)", border: `1px solid ${NAVY_BORDER}`, color: GOLD_SOFT }}
          >
            View full activity <ArrowRight size={14} />
          </button>
        </Panel>
      </div>

      {/* ── slide-over ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0"
            style={{ background: "rgba(6,14,20,0.55)" }}
            onClick={() => setOpenId(null)}
          />
          <aside
            className="hgb-note-slide relative h-full w-full max-w-[460px] overflow-y-auto p-6"
            style={{ background: INK, borderLeft: `1px solid ${NAVY_BORDER}`, boxShadow: "-30px 0 60px -30px rgba(0,0,0,0.8)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11.5px]" style={{ color: MUTED }}>
                  {bookingName} • {reference}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <Badge
                    label={open.category}
                    color={CAT_COLOR[open.category]}
                    bg="rgba(255,255,255,0.06)"
                    border="rgba(255,255,255,0.10)"
                  />
                  <Badge label={open.priority} {...PRIORITY_STYLE[open.priority]} />
                </div>
              </div>
              <button
                type="button"
                aria-label="Close note"
                onClick={() => setOpenId(null)}
                className="grid h-8 w-8 place-items-center rounded-full"
                style={{ background: "rgba(10,22,31,0.34)", border: `1px solid ${NAVY_BORDER}`, color: TEXT_2 }}
              >
                <X size={15} />
              </button>
            </div>

            <input
              value={open.title}
              onChange={(e) => patch(open.id, { title: e.target.value })}
              className="mt-4 w-full bg-transparent text-[22px] leading-tight outline-none"
              style={{ color: TEXT, fontFamily: SERIF }}
            />

            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11.5px]" style={{ color: MUTED }}>
              <span className="inline-flex items-center gap-1">
                <User size={12} /> {open.author}
              </span>
              <span>Updated {open.updatedLabel}</span>
              {open.dueLabel && (
                <span className="inline-flex items-center gap-1" style={{ color: GOLD_SOFT }}>
                  <CalendarClock size={12} /> Due {open.dueLabel}
                </span>
              )}
            </div>

            <textarea
              value={open.body || open.preview}
              onChange={(e) => patch(open.id, { body: e.target.value, preview: e.target.value.slice(0, 110) })}
              rows={7}
              className="mt-4 w-full resize-none rounded-[12px] p-3.5 text-[13px] leading-relaxed outline-none"
              style={{ background: "rgba(10,22,31,0.3)", border: `1px solid ${NAVY_BORDER}`, color: TEXT_2 }}
            />
            <p className="mt-1.5 text-[11px]" style={{ color: MUTED }}>
              Changes save automatically.
            </p>

            {open.checklist?.length ? (
              <div className="mt-5">
                <h4 className="text-[12.5px] font-semibold" style={{ color: TEXT }}>
                  Checklist
                </h4>
                <ul className="mt-2 space-y-1.5">
                  {open.checklist.map((c, i) => (
                    <li key={c.label}>
                      <label className="flex cursor-pointer items-center gap-2.5 text-[12.5px]" style={{ color: TEXT_2 }}>
                        <input
                          type="checkbox"
                          checked={c.done}
                          onChange={() =>
                            patch(open.id, {
                              checklist: open.checklist!.map((x, j) =>
                                j === i ? { ...x, done: !x.done } : x,
                              ),
                            })
                          }
                          className="h-[15px] w-[15px] accent-[#C5962D]"
                        />
                        <span style={{ opacity: c.done ? 0.6 : 1, textDecoration: c.done ? "line-through" : "none" }}>
                          {c.label}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {open.attachments?.length ? (
              <div className="mt-5">
                <h4 className="text-[12.5px] font-semibold" style={{ color: TEXT }}>
                  Attachments
                </h4>
                <ul className="mt-2 space-y-2">
                  {open.attachments.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-[12.5px]"
                      style={{ background: INK_2, border: `1px solid ${NAVY_BORDER}`, color: TEXT_2 }}
                    >
                      <Paperclip size={13} color={GOLD_SOFT} /> {a}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {open.links?.length ? (
              <div className="mt-5">
                <h4 className="text-[12.5px] font-semibold" style={{ color: TEXT }}>
                  Links
                </h4>
                <ul className="mt-2 space-y-1.5">
                  {open.links.map((l) => (
                    <li key={l.label} className="flex items-center gap-2 text-[12.5px]" style={{ color: GOLD_SOFT }}>
                      <Link2 size={13} /> {l.label}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {open.mentions?.length ? (
              <p className="mt-5 text-[12px]" style={{ color: MUTED }}>
                Mentions:{" "}
                <span style={{ color: GOLD_SOFT }}>{open.mentions.join(", ")}</span>
              </p>
            ) : null}

            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => togglePin(open.id)}
                className="inline-flex h-[36px] items-center gap-2 rounded-[10px] px-3.5 text-[12.5px] font-semibold"
                style={{ background: "rgba(10,22,31,0.34)", border: `1px solid ${NAVY_BORDER}`, color: open.pinned ? GOLD_SOFT : TEXT_2 }}
              >
                <Pin size={13} /> {open.pinned ? "Unpin" : "Pin to top"}
              </button>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="inline-flex h-[36px] items-center gap-2 rounded-[10px] px-4 text-[12.5px] font-semibold"
                style={{ background: GOLD_GRAD, color: "#241B06", border: "1px solid rgba(255,255,255,0.18)" }}
              >
                Done
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
