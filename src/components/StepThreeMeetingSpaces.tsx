import { useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Plus,
  Pencil,
  Trash2,
  Check,
  MapPin,
  DoorOpen,
  Projector,
  Monitor,
  Mic2,
  Volume2,
  ClipboardList,
  PenSquare,
  Presentation,
  Speaker,
  Video,
  Radio,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";

/* Design tokens */
const SERIF = '"Cormorant Garamond", Georgia, serif';
const NAVY = "#0B1624";
const NAVY_DEEP = "#08131F";
const GOLD = "#D4A94A";
const GOLD_SOFT = "#E8C876";
const BEIGE = "#F6F2EC";
const CARD_BG = "#FBF8F2";

/* ---------- Types ---------- */
type SetupId =
  | "theater"
  | "cinema"
  | "classroom"
  | "round"
  | "boardroom"
  | "cabaret"
  | "ushape"
  | "breakout"
  | "other";

type MeetingRoom = {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  setup: SetupId;
  equipment: string[];
  notes: string;
  customLayout?: string;
};

/* ---------- Setup data ---------- */
const SETUPS: {
  id: SetupId;
  label: string;
  tag?: string;
  description: string;
  capacity: string;
  bestFor: string[];
}[] = [
  {
    id: "theater",
    label: "Theater",
    tag: "Plenary room",
    description: "Rows of chairs facing a stage or presenter.",
    capacity: "80 – 400+ attendees",
    bestFor: ["Presentations", "Conferences", "Keynote speeches"],
  },
  {
    id: "cinema",
    label: "Cinema",
    description: "Continuous rows with a center aisle, film-hall style.",
    capacity: "60 – 300 attendees",
    bestFor: ["Screenings", "Product launches", "Panel talks"],
  },
  {
    id: "classroom",
    label: "Classroom",
    description: "Rows of tables and chairs facing the presenter.",
    capacity: "30 – 120 attendees",
    bestFor: ["Training", "Workshops", "Note-taking sessions"],
  },
  {
    id: "round",
    label: "Round Tables",
    description: "Round tables of 8 – 10 for group work and dining.",
    capacity: "40 – 300 attendees",
    bestFor: ["Group work", "Gala dinners", "Networking"],
  },
  {
    id: "boardroom",
    label: "Boardroom",
    description: "A single long table for focused discussion.",
    capacity: "8 – 24 attendees",
    bestFor: ["Executive meetings", "Board reviews", "Strategy"],
  },
  {
    id: "cabaret",
    label: "Cabaret",
    description: "Half-round tables facing the stage for interaction.",
    capacity: "30 – 150 attendees",
    bestFor: ["Workshops", "Presentations with group work"],
  },
  {
    id: "ushape",
    label: "U-Shape",
    description: "Tables arranged in a U with an open center.",
    capacity: "15 – 40 attendees",
    bestFor: ["Trainings", "Interactive meetings"],
  },
  {
    id: "breakout",
    label: "Breakout Room",
    tag: "Breakout",
    description: "Small flexible space for parallel group sessions.",
    capacity: "8 – 30 attendees",
    bestFor: ["Group work", "Parallel sessions", "Discussions"],
  },
  {
    id: "other",
    label: "Other",
    tag: "Custom layout",
    description: "Describe your preferred layout in the field below.",
    capacity: "Custom",
    bestFor: ["Bespoke arrangements", "Mixed setups", "Special requirements"],
  },
];

/* ---------- Equipment data ---------- */
const EQUIPMENT: { id: string; label: string; Icon: typeof Projector }[] = [
  { id: "projector", label: "Projector", Icon: Projector },
  { id: "screen", label: "Large Screen", Icon: Monitor },
  { id: "microphone", label: "Microphone", Icon: Mic2 },
  { id: "speakers", label: "Speakers", Icon: Speaker },
  { id: "flipchart", label: "Flipchart", Icon: ClipboardList },
  { id: "whiteboard", label: "Whiteboard", Icon: PenSquare },
  { id: "stage", label: "Stage", Icon: Presentation },
  { id: "podium", label: "Podium", Icon: Volume2 },
  { id: "hybrid", label: "Hybrid Meeting", Icon: Radio },
  { id: "video", label: "Video Conference", Icon: Video },
];

/* ---------- Setup Illustration ---------- */
function SetupGlyph({ id, size = 44 }: { id: SetupId; size?: number }) {
  const stroke = "currentColor";
  const dot = (cx: number, cy: number, r = 1.4) => (
    <circle cx={cx} cy={cy} r={r} fill={stroke} />
  );
  const rect = (
    x: number,
    y: number,
    w: number,
    h: number,
    r = 0.8,
  ) => (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      fill="none"
      stroke={stroke}
      strokeWidth={0.9}
    />
  );

  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      aria-hidden
      className="shrink-0"
    >
      {/* stage bar */}
      <line
        x1="8"
        y1="7"
        x2="32"
        y2="7"
        stroke={stroke}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {id === "theater" &&
        [...Array(4)].map((_, r) =>
          [...Array(9)].map((_, c) => dot(8 + c * 3, 13 + r * 5)),
        )}
      {id === "cinema" &&
        [...Array(4)].map((_, r) =>
          [...Array(11)].map((_, c) => {
            const x = 5 + c * 3;
            if (Math.abs(x - 20) < 1.4) return null;
            return dot(x, 13 + r * 5);
          }),
        )}
      {id === "classroom" &&
        [...Array(3)].map((_, r) => (
          <g key={r}>
            {rect(6, 12 + r * 8, 12, 2, 0.6)}
            {rect(22, 12 + r * 8, 12, 2, 0.6)}
            {[...Array(4)].map((_, c) => dot(8 + c * 3, 17 + r * 8))}
            {[...Array(4)].map((_, c) => dot(24 + c * 3, 17 + r * 8))}
          </g>
        ))}
      {id === "round" &&
        [
          [12, 16],
          [28, 16],
          [12, 28],
          [28, 28],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle
              cx={x}
              cy={y}
              r={3.4}
              fill="none"
              stroke={stroke}
              strokeWidth="0.9"
            />
            {[...Array(6)].map((_, k) => {
              const a = (k / 6) * Math.PI * 2;
              return dot(x + Math.cos(a) * 5, y + Math.sin(a) * 5);
            })}
          </g>
        ))}
      {id === "boardroom" && (
        <>
          {rect(11, 15, 18, 10, 1.6)}
          {[...Array(5)].map((_, c) => dot(13 + c * 4, 12))}
          {[...Array(5)].map((_, c) => dot(13 + c * 4, 28))}
          {dot(9, 20)}
          {dot(31, 20)}
        </>
      )}
      {id === "cabaret" &&
        [
          [13, 18],
          [27, 18],
          [13, 30],
          [27, 30],
        ].map(([x, y], i) => (
          <g key={i}>
            <path
              d={`M ${x - 4} ${y} A 4 4 0 0 1 ${x + 4} ${y}`}
              fill="none"
              stroke={stroke}
              strokeWidth="0.9"
            />
            {[...Array(5)].map((_, k) => {
              const a = Math.PI - (k / 4) * Math.PI;
              return dot(x + Math.cos(a) * 5.5, y + Math.sin(a) * -5.5);
            })}
          </g>
        ))}
      {id === "ushape" && (
        <>
          <path
            d="M 10 12 L 10 30 L 30 30 L 30 12"
            fill="none"
            stroke={stroke}
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {[...Array(5)].map((_, k) => dot(8, 14 + k * 4))}
          {[...Array(5)].map((_, k) => dot(32, 14 + k * 4))}
          {[...Array(4)].map((_, k) => dot(14 + k * 4, 32))}
        </>
      )}
      {id === "breakout" && (
        <>
          {rect(7, 10, 12, 9, 1.2)}
          {rect(21, 10, 12, 9, 1.2)}
          {rect(7, 22, 12, 9, 1.2)}
          {rect(21, 22, 12, 9, 1.2)}
          {dot(13, 14.5)}
          {dot(27, 14.5)}
          {dot(13, 26.5)}
          {dot(27, 26.5)}
        </>
      )}
      {id === "other" && (
        <>
          <defs>
            <linearGradient id="otherGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={GOLD_SOFT} />
              <stop offset="50%" stopColor={GOLD} />
              <stop offset="100%" stopColor="#B88A2E" />
            </linearGradient>
          </defs>
          <rect
            x="6"
            y="6"
            width="28"
            height="28"
            rx="6"
            fill="none"
            stroke="url(#otherGold)"
            strokeWidth="1.6"
          />
          <path
            d="M24 12 L27 15 L17 25 L14 25 L14 22 Z"
            fill="none"
            stroke="url(#otherGold)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 14 L25 17"
            fill="none"
            stroke="url(#otherGold)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

/* ---------- helpers ---------- */
function fmtDate(iso: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/* ---------- Component ---------- */
export function StepThreeMeetingSpaces({
  onBack,
  onNext,
  direction,
  request,
}: {
  onBack: () => void;
  onNext: () => void;
  direction: "forward" | "back";
  request?: {
    destination?: string;
    dates?: string;
    guestRooms?: number;
    attendees?: number;
  };
}) {
  const [needsRooms, setNeedsRooms] = useState<boolean>(true);
  const [rooms, setRooms] = useState<MeetingRoom[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // draft
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [attendees, setAttendees] = useState<number>(0);
  const [setup, setSetup] = useState<SetupId>("theater");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [comments, setComments] = useState("");
  const [customLayout, setCustomLayout] = useState("");

  const roomIndex = rooms.length + 1;
  const activeSetup = SETUPS.find((s) => s.id === setup)!;

  const resetDraft = () => {
    setName("");
    setDate("");
    setStart("09:00");
    setEnd("17:00");
    setAttendees(0);
    setSetup("theater");
    setEquipment([]);
    setNotes("");
    setCustomLayout("");
    setEditingId(null);
  };

  const saveRoom = () => {
    const room: MeetingRoom = {
      id: editingId ?? crypto.randomUUID(),
      name: name.trim() || `Meeting Room ${roomIndex}`,
      date,
      startTime: start,
      endTime: end,
      attendees,
      setup,
      equipment,
      notes,
      customLayout: setup === "other" ? customLayout.trim() : undefined,
    };
    setRooms((prev) =>
      editingId ? prev.map((r) => (r.id === editingId ? room : r)) : [...prev, room],
    );
    resetDraft();
  };

  const editRoom = (id: string) => {
    const r = rooms.find((x) => x.id === id);
    if (!r) return;
    setEditingId(id);
    setName(r.name);
    setDate(r.date);
    setStart(r.startTime);
    setEnd(r.endTime);
    setAttendees(r.attendees);
    setSetup(r.setup);
    setEquipment(r.equipment);
    setNotes(r.notes);
    setCustomLayout(r.customLayout ?? "");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) resetDraft();
  };

  const toggleEquip = (id: string) =>
    setEquipment((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  /* ---------- Smart Recommendation Engine ----------
     Dynamic plan built from event size (and, in future, event type,
     duration, hotel type, VIP flags, budget, etc.). Everything the
     engine returns is a *suggestion* — nothing is locked. */
  type PlannedRoom = {
    label: string;
    setup: SetupId;
    attendees: number;
    kind: "plenary" | "breakout" | "meeting";
    equipment: string[];
  };
  type Plan = {
    tier: "boardroom" | "theater" | "conference" | "largeConference";
    attendees: number;
    rooms: PlannedRoom[];
    equipment: string[];
    catering: string[];
    summary: string[];
  } | null;

  const plan: Plan = useMemo(() => {
    const primary = rooms[0]?.attendees || attendees;
    if (!primary || primary <= 0) return null;

    if (primary <= 25) {
      return {
        tier: "boardroom",
        attendees: primary,
        rooms: [
          {
            label: "Meeting Room",
            setup: "boardroom",
            attendees: primary,
            kind: "meeting",
            equipment: ["screen"],
          },
        ],
        equipment: ["screen"],
        catering: ["Coffee Break"],
        summary: ["1 Boardroom setup", "Large screen", "Coffee break"],
      };
    }
    if (primary <= 75) {
      return {
        tier: "theater",
        attendees: primary,
        rooms: [
          {
            label: "Meeting Room",
            setup: "theater",
            attendees: primary,
            kind: "plenary",
            equipment: ["projector", "screen", "microphone"],
          },
        ],
        equipment: ["projector", "screen", "microphone"],
        catering: ["Coffee Break"],
        summary: [
          "1 Theater room",
          "Projector & large screen",
          "Microphones",
          "Coffee break",
        ],
      };
    }
    if (primary <= 200) {
      const breakouts = primary <= 120 ? 4 : 5;
      const cap = 25;
      return {
        tier: "conference",
        attendees: primary,
        rooms: [
          {
            label: "Plenary Room",
            setup: "theater",
            attendees: primary,
            kind: "plenary",
            equipment: ["projector", "screen", "microphone"],
          },
          ...Array.from({ length: breakouts }, () => ({
            label: "Breakout Room",
            setup: "breakout" as SetupId,
            attendees: cap,
            kind: "breakout" as const,
            equipment: ["screen"],
          })),
        ],
        equipment: ["projector", "screen", "microphone"],
        catering: ["Coffee Break", "Lunch"],
        summary: [
          `1 Plenary Room (${primary} people, theater)`,
          `${breakouts} Breakout Rooms (up to ${cap} each)`,
          "Projector, Large Screen, Microphones",
          "Coffee Break & Lunch",
        ],
      };
    }
    const breakouts = 10;
    const cap = 30;
    return {
      tier: "largeConference",
      attendees: primary,
        rooms: [
          {
            label: "Large Plenary Room",
            setup: "theater",
            attendees: primary,
            kind: "plenary",
            equipment: [
              "stage",
              "podium",
              "projector",
              "screen",
              "microphone",
              "hybrid",
            ],
          },
          ...Array.from({ length: breakouts }, () => ({
            label: "Breakout Room",
            setup: "breakout" as SetupId,
            attendees: cap,
            kind: "breakout" as const,
            equipment: ["screen"],
          })),
        ],
        equipment: [
          "stage",
          "podium",
          "projector",
          "screen",
          "microphone",
          "hybrid",
        ],
      catering: ["Coffee Break", "Lunch", "Dinner"],
      summary: [
        `1 Large Plenary Room (${primary} people)`,
        `${breakouts} Breakout Rooms`,
        "Stage, Podium, Projector, Microphones",
        "Hybrid meeting setup",
        "Coffee Break, Lunch & Dinner",
      ],
    };
  }, [rooms, attendees]);

  const [applied, setApplied] = useState(false);

  const applyRecommendation = () => {
    if (!plan) return;
    const baseDate = date || rooms[0]?.date || "";
    const baseStart = start || rooms[0]?.startTime || "09:00";
    const baseEnd = end || rooms[0]?.endTime || "17:00";
    let breakoutIdx = 0;
    const created: MeetingRoom[] = plan.rooms.map((r, i) => {
      const isBreakout = r.kind === "breakout";
      if (isBreakout) breakoutIdx += 1;
      const label = isBreakout ? `Breakout Room ${breakoutIdx}` : r.label;
      return {
        id: crypto.randomUUID(),
        name: `Meeting Room ${i + 1} · ${label}`,
        date: baseDate,
        startTime: baseStart,
        endTime: baseEnd,
        attendees: r.attendees,
        setup: r.setup,
        equipment: r.equipment,
        notes: "",
      };
    });
    setRooms(created);
    setEquipment(plan.rooms[0]?.equipment ?? ["wifi"]);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(
          "hgb:catering-recommended",
          JSON.stringify(plan.catering),
        );
      } catch {
        /* non-fatal */
      }
    }
    setEditingId(null);
    setApplied(true);
  };

  return (
    <div
      className={
        direction === "forward"
          ? "animate-slide-in-right"
          : "animate-slide-in-left"
      }
    >
      <div
        className="overflow-hidden rounded-[22px]"
        style={{
          background: BEIGE,
          border: "1px solid #EAE3D5",
          boxShadow:
            "0 40px 90px -50px rgba(10,27,44,0.18), 0 12px 32px -24px rgba(10,27,44,0.08)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
          {/* LEFT — CONTENT */}
          <div className="p-6 sm:p-10 lg:p-12">
            {/* Title */}
            <div>
              <h2
                className="text-[#0A1B2C] text-3xl lg:text-[40px] leading-[1.1]"
                style={{ fontFamily: SERIF }}
              >
                Meeting Spaces
              </h2>
              <div
                className="mt-3 h-[2px] w-16"
                style={{ background: `linear-gradient(90deg,${GOLD_SOFT},${GOLD})` }}
              />
              <p className="mt-4 text-[#4A5866] text-[15px] max-w-xl leading-relaxed">
                Tell us about your meeting requirements. The more details you
                provide, the better hotels can match your event.
              </p>
            </div>

            {/* Need rooms toggle */}
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <span className="text-[#0A1B2C] text-[15px] font-medium">
                Do you need meeting rooms?
              </span>
              <div className="flex items-center gap-6">
                {[
                  { v: true, label: "Yes" },
                  { v: false, label: "No, continue to Catering" },
                ].map((o) => {
                  const on = needsRooms === o.v;
                  return (
                    <button
                      key={String(o.v)}
                      type="button"
                      onClick={() => setNeedsRooms(o.v)}
                      className="inline-flex items-center gap-2.5 text-[14.5px] transition-colors"
                      style={{ color: on ? "#0A1B2C" : "#5B6B7A" }}
                    >
                      <span
                        className="grid h-[18px] w-[18px] place-items-center rounded-full transition-all"
                        style={{
                          border: `1.5px solid ${on ? GOLD : "#C9BFA9"}`,
                          background: on ? GOLD : "transparent",
                        }}
                      >
                        {on && (
                          <span className="block h-[6px] w-[6px] rounded-full bg-[#0A1B2C]" />
                        )}
                      </span>
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {needsRooms && (
              <>
                {/* EDITOR CARD */}
                <div
                  className="mt-8 rounded-[18px] p-6 lg:p-8"
                  style={{
                    background: CARD_BG,
                    border: "1px solid #E8E0CE",
                    boxShadow:
                      "0 12px 30px -22px rgba(10,27,44,0.14), 0 2px 6px -3px rgba(10,27,44,0.05)",
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <h3
                        className="text-[#0A1B2C] text-[22px] leading-none"
                        style={{ fontFamily: SERIF }}
                      >
                        {editingId
                          ? `Editing ${name || "meeting room"}`
                          : `Meeting Room ${roomIndex}`}
                      </h3>
                      <span
                        className="rounded-full px-2.5 py-[3px] text-[11.5px] font-medium"
                        style={{
                          background: "rgba(212,169,74,0.14)",
                          color: "#8A6B1F",
                          border: "1px solid rgba(212,169,74,0.32)",
                        }}
                      >
                        {activeSetup.tag ?? activeSetup.label}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={saveRoom}
                      className="inline-flex items-center gap-2 rounded-full px-4 h-[38px] text-[13.5px] font-medium transition-all hover:-translate-y-[1px]"
                      style={{
                        color: "#0A1B2C",
                        background:
                          "linear-gradient(180deg,#F7E4A6 0%, #E8C876 55%, #C9A34A 100%)",
                        border: "1px solid rgba(184,137,23,0.55)",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.55), 0 6px 16px -8px rgba(184,137,23,0.35)",
                      }}
                    >
                      <Plus size={15} strokeWidth={2.4} />
                      {editingId ? "Save changes" : "Add this room"}
                    </button>
                  </div>

                  {/* Row: name / date / start / end / attendees */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.9fr] gap-4">
                    <Field label="Room name (optional)">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Main Conference Room"
                        className="input"
                      />
                    </Field>
                    <Field label="Date" icon={<CalendarIcon size={15} />}>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="input"
                      />
                    </Field>
                    <Field label="Start time" icon={<Clock size={15} />}>
                      <input
                        type="time"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="input"
                      />
                    </Field>
                    <Field label="End time" icon={<Clock size={15} />}>
                      <input
                        type="time"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="input"
                      />
                    </Field>
                    <Field label="Number of attendees" icon={<Users size={15} />}>
                      <input
                        type="number"
                        min={0}
                        value={attendees || ""}
                        onChange={(e) =>
                          setAttendees(Number(e.target.value) || 0)
                        }
                        placeholder="0"
                        className="input"
                      />
                    </Field>
                  </div>

                  {/* Room setup */}
                  <div className="mt-8">
                    <div className="text-[13.5px] font-medium text-[#3B4757] mb-3">
                      Room setup
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      {SETUPS.filter((s) => s.id !== "breakout").map((s) => (
                        <SetupCard
                          key={s.id}
                          setup={s}
                          selected={setup === s.id}
                          onClick={() => setSetup(s.id)}
                        />
                      ))}
                    </div>
                    <div className="mt-3">
                      <SetupCard
                        setup={SETUPS.find((s) => s.id === "breakout")!}
                        selected={setup === "breakout"}
                        onClick={() => setSetup("breakout")}
                        wide
                      />
                    </div>
                  </div>

                  {/* Setup detail panel */}
                  <div
                    className="mt-6 rounded-[14px] p-5 lg:p-6 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-start"
                    style={{
                      background: "#F1EADB",
                      border: "1px solid #E4DBC4",
                    }}
                  >
                    <div
                      className="rounded-[12px] p-4 grid place-items-center"
                      style={{
                        background:
                          "linear-gradient(180deg,#FBF7EC,#F1E7CE)",
                        border: "1px solid #E2D5B0",
                        color: NAVY,
                        width: 128,
                        height: 96,
                      }}
                    >
                      <SetupGlyph id={activeSetup.id} size={64} />
                    </div>
                    <div>
                      <div
                        className="text-[#0A1B2C] text-[20px] leading-tight"
                        style={{ fontFamily: SERIF }}
                      >
                        {activeSetup.label} style
                      </div>
                      <p className="mt-1.5 text-[#4A5866] text-[14px] leading-relaxed max-w-md">
                        {activeSetup.description}
                      </p>
                      <p className="mt-3 text-[13px] text-[#3B4757]">
                        <span className="font-medium text-[#0A1B2C]">
                          Best for:
                        </span>{" "}
                        {activeSetup.bestFor.join(" · ")}
                      </p>
                    </div>
                    <div className="min-w-[160px]">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-[#7A6A45] font-semibold">
                        Capacity
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[#0A1B2C] text-[15px] font-medium">
                        <Users size={15} style={{ color: GOLD }} />
                        {activeSetup.capacity}
                      </div>
                      <div className="mt-4 text-[11px] uppercase tracking-[0.14em] text-[#7A6A45] font-semibold">
                        Ideal for
                      </div>
                      <ul className="mt-1 space-y-1">
                        {activeSetup.bestFor.map((b) => (
                          <li
                            key={b}
                            className="flex items-center gap-1.5 text-[13.5px] text-[#3B4757]"
                          >
                            <Check size={13} style={{ color: "#3E8F5C" }} />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Equipment */}
                  <div className="mt-8">
                    <div className="text-[13.5px] font-medium text-[#3B4757] mb-3">
                      Equipment
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                      {EQUIPMENT.map(({ id, label, Icon }) => {
                        const on = equipment.includes(id);
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => toggleEquip(id)}
                            className="flex items-center gap-3 rounded-[12px] px-3.5 h-[46px] text-[13.5px] transition-all"
                            style={{
                              background: on ? "#FFF9EB" : "#FFFFFF",
                              border: `1px solid ${on ? "rgba(212,169,74,0.65)" : "#E6DEC9"}`,
                              boxShadow: on
                                ? "0 4px 14px -8px rgba(212,169,74,0.45), inset 0 0 0 1px rgba(212,169,74,0.15)"
                                : "0 1px 2px rgba(10,27,44,0.03)",
                              color: "#0A1B2C",
                            }}
                          >
                            <span
                              className="grid h-[18px] w-[18px] place-items-center rounded-[5px] transition-colors"
                              style={{
                                background: on ? GOLD : "transparent",
                                border: `1.5px solid ${on ? GOLD : "#C7BEA6"}`,
                              }}
                            >
                              {on && (
                                <Check
                                  size={12}
                                  strokeWidth={3}
                                  className="text-[#0A1B2C]"
                                />
                              )}
                            </span>
                            <Icon
                              size={16}
                              style={{ color: on ? "#8A6B1F" : "#6E7A88" }}
                            />
                            <span className="font-medium">{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-8">
                    <div className="text-[13.5px] font-medium text-[#3B4757] mb-2">
                      Additional requirements{" "}
                      <span className="text-[#8A8578] font-normal">
                        (optional)
                      </span>
                    </div>
                    <div
                      className="rounded-[12px] p-3.5"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid #E6DEC9",
                      }}
                    >
                      <textarea
                        value={notes}
                        onChange={(e) =>
                          setNotes(e.target.value.slice(0, 500))
                        }
                        placeholder="Any additional information or special requests..."
                        rows={2}
                        className="w-full resize-none bg-transparent outline-none text-[14px] text-[#0A1B2C] placeholder:text-[#9AA3AF]"
                      />
                      <div className="mt-1 text-right text-[11.5px] text-[#9C9484]">
                        {notes.length}/500
                      </div>
                    </div>
                  </div>
                </div>

                {/* SAVED ROOMS */}
                {rooms.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {rooms.map((r, i) => {
                      const s = SETUPS.find((x) => x.id === r.setup)!;
                      return (
                        <div
                          key={r.id}
                          className="flex flex-wrap items-center gap-3 rounded-[14px] px-5 py-3.5"
                          style={{
                            background: "#FFFFFF",
                            border: "1px solid #E8E0CE",
                            boxShadow:
                              "0 6px 18px -14px rgba(10,27,44,0.10)",
                          }}
                        >
                          <div className="flex items-center gap-3 min-w-[220px]">
                            <div
                              className="grid h-9 w-9 place-items-center rounded-[10px]"
                              style={{
                                background: NAVY,
                                color: GOLD_SOFT,
                              }}
                            >
                              <DoorOpen size={16} />
                            </div>
                            <div>
                              <div className="text-[15px] font-medium text-[#0A1B2C]">
                                {r.name || `Meeting Room ${i + 1}`}
                              </div>
                              <div className="text-[12px] text-[#6E7A88]">
                                {s.label}
                                {s.tag ? ` · ${s.tag}` : ""}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-5 text-[13px] text-[#3B4757] flex-1">
                            <span className="flex items-center gap-1.5">
                              <CalendarIcon size={13} style={{ color: GOLD }} />
                              {fmtDate(r.date) || "—"}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock size={13} style={{ color: GOLD }} />
                              {r.startTime} – {r.endTime}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users size={13} style={{ color: GOLD }} />
                              {r.attendees || 0} attendees
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => editRoom(r.id)}
                              className="grid h-9 w-9 place-items-center rounded-full text-[#3B4757] hover:bg-[#F1EADB] transition-colors"
                              aria-label="Edit room"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteRoom(r.id)}
                              className="grid h-9 w-9 place-items-center rounded-full text-[#3B4757] hover:bg-[#F7E1E1] hover:text-[#B03A3A] transition-colors"
                              aria-label="Delete room"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Footer nav */}
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-full px-5 h-[48px] text-[14px] font-medium text-white transition-all hover:-translate-y-[1px]"
                style={{
                  background:
                    "linear-gradient(180deg,#132639,#0B1624)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow:
                    "0 10px 24px -14px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              >
                <ArrowLeft size={15} />
                Back to Accommodation
              </button>

              <div className="hidden md:flex items-center gap-2 text-[12.5px] text-[#7B8290]">
                <Sparkles size={13} style={{ color: GOLD }} />
                Your information is secure and shared only with selected hotels.
              </div>
            </div>
          </div>

          {/* RIGHT — SIDEBAR */}
          <aside
            className="p-5 lg:p-6 lg:pl-0 flex flex-col gap-5"
            style={{ background: "transparent" }}
          >
            {/* Your Request */}
            <SidebarCard>
              <SidebarHeader
                title="Your Request"
                right={
                  <span className="flex items-center gap-1.5 text-[11.5px] text-[#8CE0A6]">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: "#4ADE80", boxShadow: "0 0 8px #4ADE80" }}
                    />
                    Live update
                  </span>
                }
              />
              <ul className="mt-4 space-y-3.5">
                <RequestRow
                  Icon={MapPin}
                  label={request?.destination ?? "Oslo, Norway"}
                />
                <RequestRow
                  Icon={CalendarIcon}
                  label={request?.dates ?? "Add dates"}
                />
                <RequestRow
                  Icon={DoorOpen}
                  label={`${request?.guestRooms ?? 0} Rooms`}
                />
                <RequestRow
                  Icon={Users}
                  label={`${request?.attendees ?? 0} Attendees`}
                />
                <RequestRow
                  Icon={Presentation}
                  label={`${rooms.length} Meeting Room${rooms.length === 1 ? "" : "s"}`}
                  trailing={
                    rooms.length > 0 ? (
                      <span
                        className="rounded-full px-2 py-[3px] text-[10.5px] font-medium"
                        style={{
                          background: "rgba(74,222,128,0.16)",
                          color: "#7EE7A0",
                          border: "1px solid rgba(74,222,128,0.28)",
                        }}
                      >
                        Added
                      </span>
                    ) : null
                  }
                />
              </ul>
            </SidebarCard>

            {/* Recommended */}
            <SidebarCard>
              <SidebarHeader
                title="Recommended for your event"
                icon={<Sparkles size={14} style={{ color: GOLD_SOFT }} />}
              />
              {plan ? (
                <>
                  <p className="mt-1.5 text-[12px] text-[#96A0B0]">
                    Based on {plan.attendees} attendees
                    {plan.rooms.length > 1 ? " · conference format" : ""}
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    {plan.summary.map((rec) => (
                      <li
                        key={rec}
                        className="flex items-start gap-2.5 text-[13px] text-[#DDE4EE]"
                      >
                        <Check
                          size={14}
                          strokeWidth={2.6}
                          className="mt-[3px]"
                          style={{ color: "#7EE7A0" }}
                        />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>

                  {applied ? (
                    <>
                      <div
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full h-[46px] text-[13.5px] font-semibold"
                        style={{
                          color: "#0F2A1D",
                          background:
                            "linear-gradient(180deg,#B7ECC7 0%, #7ED09A 100%)",
                          border: "1px solid rgba(46,142,92,0.55)",
                          boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.45), 0 10px 22px -14px rgba(46,142,92,0.45)",
                        }}
                      >
                        <Check size={15} strokeWidth={3} />
                        Recommendation Applied
                      </div>
                      <p className="mt-2.5 text-[12px] leading-relaxed text-[#96A0B0]">
                        Your meeting setup has been created automatically.
                        You can still edit everything manually.
                      </p>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={applyRecommendation}
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full h-[46px] text-[13.5px] font-semibold transition-all hover:-translate-y-[1px]"
                      style={{
                        color: "#0A1B2C",
                        background:
                          "linear-gradient(180deg,#F7E4A6 0%, #E8C876 55%, #C9A34A 100%)",
                        border: "1px solid rgba(184,137,23,0.65)",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.5), 0 12px 26px -14px rgba(184,137,23,0.5)",
                      }}
                    >
                      <Sparkles size={15} strokeWidth={2.2} />
                      Apply Recommendation
                    </button>
                  )}
                </>
              ) : (
                <p className="mt-3 text-[12.5px] leading-relaxed text-[#96A0B0]">
                  Add attendees or a first meeting room and we'll build a
                  tailored setup for you automatically.
                </p>
              )}
            </SidebarCard>


            {/* Comments */}
            <SidebarCard>
              <SidebarHeader
                title="Leave a comment or special requests"
                icon={<MessageSquare size={14} style={{ color: GOLD_SOFT }} />}
              />
              <div
                className="mt-4 rounded-[12px] p-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <textarea
                  value={comments}
                  onChange={(e) =>
                    setComments(e.target.value.slice(0, 500))
                  }
                  placeholder="Anything else the hotels should know?"
                  rows={5}
                  className="w-full resize-none bg-transparent outline-none text-[13.5px] text-white placeholder:text-[#7A8494]"
                />
                <div className="mt-1 text-right text-[11px] text-[#7A8494]">
                  {comments.length}/500
                </div>
              </div>
            </SidebarCard>

            {/* Continue CTA */}
            <button
              type="button"
              onClick={onNext}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-full h-[52px] text-[14.5px] font-semibold transition-all hover:-translate-y-[1px]"
              style={{
                color: "#0A1B2C",
                background:
                  "linear-gradient(180deg,#F7D97A 0%, #D4AF37 55%, #B88917 100%)",
                border: "1px solid rgba(184,137,23,0.85)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.45), 0 12px 26px -14px rgba(184,137,23,0.55)",
              }}
            >
              Save Meeting Spaces & Continue to Catering
              <ArrowRight size={16} />
            </button>
          </aside>
        </div>
      </div>

      {/* local input styles */}
      <style>{`
        .input {
          width: 100%;
          height: 42px;
          background: #FFFFFF;
          border: 1px solid #E6DEC9;
          border-radius: 10px;
          padding: 0 12px;
          font-size: 14px;
          color: #0A1B2C;
          outline: none;
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .input:focus {
          border-color: ${GOLD};
          box-shadow: 0 0 0 3px rgba(212,169,74,0.18);
        }
      `}</style>
    </div>
  );
}

/* ---------- Small subcomponents ---------- */
function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-[#3B4757]">
        {icon && <span style={{ color: "#8A6B1F" }}>{icon}</span>}
        {label}
      </span>
      {children}
    </label>
  );
}

function SetupCard({
  setup,
  selected,
  onClick,
  wide,
}: {
  setup: (typeof SETUPS)[number];
  selected: boolean;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="group relative flex flex-col items-center justify-center rounded-[14px] px-3 py-4 text-[12.5px] font-medium transition-all"
      style={{
        background: selected
          ? "linear-gradient(180deg,#FBF3DD,#F5E6B8)"
          : "#FFFFFF",
        border: `1px solid ${selected ? "rgba(184,137,23,0.55)" : "#E6DEC9"}`,
        color: "#0A1B2C",
        boxShadow: selected
          ? "0 10px 24px -14px rgba(184,137,23,0.35), inset 0 1px 0 rgba(255,255,255,0.7)"
          : "0 2px 6px -4px rgba(10,27,44,0.06)",
        minHeight: wide ? 72 : 96,
      }}
    >
      <span
        className="absolute right-2 top-2 grid h-[16px] w-[16px] place-items-center rounded-full transition-colors"
        style={{
          background: selected ? GOLD : "#FFFFFF",
          border: `1.5px solid ${selected ? GOLD : "#D5CBB2"}`,
        }}
      >
        {selected && (
          <Check size={10} strokeWidth={3.2} className="text-[#0A1B2C]" />
        )}
      </span>
      <span
        style={{ color: selected ? "#8A6B1F" : "#6E7A88" }}
        className="transition-colors"
      >
        <SetupGlyph id={setup.id} size={wide ? 34 : 38} />
      </span>
      <span className="mt-2">{setup.label}</span>
      {setup.tag && (
        <span
          className="mt-1 text-[10px] uppercase tracking-[0.1em] font-semibold"
          style={{ color: "#8A6B1F" }}
        >
          {setup.tag}
        </span>
      )}
    </button>
  );
}

function SidebarCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[18px] p-5 lg:p-6"
      style={{
        background:
          "linear-gradient(180deg,#0F1F30 0%, #08131F 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "0 20px 40px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        color: "#E6EBF3",
      }}
    >
      {children}
    </div>
  );
}

function SidebarHeader({
  title,
  right,
  icon,
}: {
  title: string;
  right?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div
        className="text-white text-[17px] leading-tight flex items-center gap-2"
        style={{ fontFamily: SERIF, fontWeight: 500 }}
      >
        {icon}
        {title}
      </div>
      {right}
    </div>
  );
}

function RequestRow({
  Icon,
  label,
  trailing,
}: {
  Icon: typeof Users;
  label: string;
  trailing?: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-3">
      <span
        className="grid h-8 w-8 place-items-center rounded-full"
        style={{
          background: "rgba(232,200,118,0.10)",
          border: "1px solid rgba(232,200,118,0.22)",
          color: GOLD_SOFT,
        }}
      >
        <Icon size={14} />
      </span>
      <span className="flex-1 text-[13.5px] text-[#E6EBF3]">{label}</span>
      {trailing}
    </li>
  );
}
