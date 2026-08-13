import * as React from "react";
import {
  ArrowRight,
  Bus,
  ChevronRight,
  ConciergeBell,
  Lock,
  Luggage,
  Plus,
  Utensils,
} from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";

/* ── local light palette — mirrors ChangesFolder ── */
const WHITE = "#FFFFFF";
const INK = "#1B2530";
const INK_SOFT = "rgba(27,37,48,0.62)";
const INK_FAINT = "rgba(27,37,48,0.45)";
const HAIR = "rgba(27,37,48,0.10)";
const HAIR_SOFT = "rgba(27,37,48,0.07)";
const BRONZE_DEEP = "#A96C12";
const GOLD_HI = "#CC8C1E";
const CREAM = "#F7F2EA";
const TILE = "#F5EFE6";
const GREEN_BG = "#E7F1E9";
const GREEN_TX = "#3F7A55";
const AMBER_BG = "#F6EEDC";
const CARD_SHADOW = "0 1px 2px rgba(24,30,36,0.04)";

/* ── the tracked requests ── */

type Status = "awaiting" | "confirmed" | "completed";

type TrackedRequest = {
  id: string;
  title: string;
  requested: string;
  status: Status;
  icon: React.ReactNode;
  detail: string;
};

const REQUESTS: TrackedRequest[] = [
  {
    id: "late-checkout",
    title: "Late check-out until 15:00",
    requested: "10 Aug 2026",
    status: "awaiting",
    icon: <ConciergeBell size={22} strokeWidth={1.7} />,
    detail: "Sent to Radisson Blu Bergen. We'll confirm as soon as the hotel replies.",
  },
  {
    id: "dinner-time",
    title: "Dinner time change to 19:30",
    requested: "10 Aug 2026",
    status: "confirmed",
    icon: <Utensils size={22} strokeWidth={1.7} />,
    detail: "The hotel moved your group dinner to 19:30 on 16 Sep 2026.",
  },
  {
    id: "coach-parking",
    title: "Coach parking",
    requested: "8 Aug 2026",
    status: "confirmed",
    icon: <Bus size={22} strokeWidth={1.7} />,
    detail: "Coach parking is reserved for the full stay at the hotel's rear entrance.",
  },
  {
    id: "luggage-room",
    title: "Extra luggage room",
    requested: "8 Aug 2026",
    status: "completed",
    icon: <Luggage size={22} strokeWidth={1.7} />,
    detail: "A secure luggage room was set aside for departure day and has been handed over.",
  },
];

const STATUS_LABEL: Record<Status, string> = {
  awaiting: "Awaiting response",
  confirmed: "Confirmed",
  completed: "Completed",
};

const STATUS_TONE: Record<Status, { bg: string; tx: string }> = {
  awaiting: { bg: AMBER_BG, tx: BRONZE_DEEP },
  confirmed: { bg: GREEN_BG, tx: GREEN_TX },
  completed: { bg: "rgba(27,37,48,0.06)", tx: INK_SOFT },
};

type FilterKey = "all" | Status;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "awaiting", label: "Awaiting response" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
];

const STEPS = [
  { title: "You make a request", body: "Tell us what you need." },
  { title: "We handle it", body: "We contact the hotel." },
  { title: "You get updates", body: "Track it here in real time." },
];

/* ── pieces ── */

function StatusBadge({ status }: { status: Status }) {
  const tone = STATUS_TONE[status];
  return (
    <span
      className="inline-flex h-[24px] shrink-0 items-center rounded-full px-3 text-[10.5px] font-semibold uppercase"
      style={{ background: tone.bg, color: tone.tx, letterSpacing: "0.09em" }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function RequestCard({
  request,
  open,
  onToggle,
}: {
  request: TrackedRequest;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <li
      className="rounded-[14px] transition-colors"
      style={{ background: WHITE, border: `1px solid ${HAIR}`, boxShadow: CARD_SHADOW }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left"
      >
        <span
          className="grid h-[56px] w-[56px] shrink-0 place-items-center rounded-[14px]"
          style={{ background: TILE, color: INK }}
        >
          {request.icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold" style={{ color: INK }}>
            {request.title}
          </span>
          <span className="mt-1 block truncate text-[13px]" style={{ color: INK_SOFT }}>
            Requested {request.requested}
          </span>
        </span>
        <StatusBadge status={request.status} />
        <ChevronRight
          size={18}
          aria-hidden
          className="shrink-0 transition-transform"
          style={{ color: INK_FAINT, transform: open ? "rotate(90deg)" : "none" }}
        />
      </button>
      {open && (
        <p
          className="mx-5 mb-4 pt-3.5 text-[13px]"
          style={{ borderTop: `1px solid ${HAIR_SOFT}`, color: INK_SOFT }}
        >
          {request.detail}
        </p>
      )}
    </li>
  );
}

function HowItWorks() {
  return (
    <div
      className="rounded-[14px] p-6"
      style={{ background: CREAM, border: `1px solid ${HAIR_SOFT}` }}
    >
      <h3 className="text-[21px]" style={{ color: INK, fontFamily: SERIF, fontWeight: 600 }}>
        How it works
      </h3>

      <ol className="mt-5 space-y-5">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-3.5">
            <span
              className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full text-[12px] font-semibold tabular-nums"
              style={{ background: "rgba(27,37,48,0.08)", color: INK }}
            >
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold" style={{ color: INK }}>
                {step.title}
              </span>
              <span className="mt-0.5 block text-[13px]" style={{ color: INK_SOFT }}>
                {step.body}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <div
        className="mt-6 flex items-start gap-3 pt-5"
        style={{ borderTop: `1px solid ${HAIR_SOFT}` }}
      >
        <Lock size={16} className="mt-[2px] shrink-0" style={{ color: INK_SOFT }} />
        <span className="text-[13px]" style={{ color: INK_SOFT }}>
          All requests are handled securely on your behalf.
        </span>
      </div>
    </div>
  );
}

function NeedHelp({ onMessage }: { onMessage: () => void }) {
  return (
    <div
      className="mt-6 rounded-[14px] p-6"
      style={{ background: WHITE, border: `1px solid ${HAIR}`, boxShadow: CARD_SHADOW }}
    >
      <p className="text-[14px] font-medium" style={{ color: INK }}>
        Need help with your request?
      </p>
      <button
        type="button"
        onClick={onMessage}
        className="mt-4 inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[10px] text-[14.5px] font-semibold transition-opacity hover:opacity-90"
        style={{ background: INK, color: WHITE }}
      >
        Message HotelGroupBook <ArrowRight size={16} />
      </button>
    </div>
  );
}

/* ── the tab body ── */

export function RequestStatus({
  onMessage,
  onNewRequest,
}: {
  onMessage: () => void;
  onNewRequest: () => void;
}) {
  const [filter, setFilter] = React.useState<FilterKey>("all");
  const [openId, setOpenId] = React.useState<string | null>(null);

  const countFor = (key: FilterKey) =>
    key === "all" ? REQUESTS.length : REQUESTS.filter((r) => r.status === key).length;

  const shown = filter === "all" ? REQUESTS : REQUESTS.filter((r) => r.status === filter);

  return (
    <div className="grid flex-1 grid-cols-1 gap-8 px-5 pb-12 pt-8 sm:px-8 xl:grid-cols-[minmax(0,1fr)_340px]">
      {/* ─ left — the tracked requests ─ */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-[24px]" style={{ color: INK, fontFamily: SERIF, fontWeight: 600 }}>
              Requests &amp; confirmations
            </h2>
            <p className="mt-1.5 text-[13.5px]" style={{ color: INK_SOFT }}>
              Track your requests and see what&rsquo;s been confirmed.
            </p>
          </div>
          {/* sits at the right edge of this column, level with the heading */}
          <button
            type="button"
            onClick={onNewRequest}
            className="inline-flex h-[48px] shrink-0 items-center gap-2 rounded-[10px] px-5 text-[14.5px] font-semibold transition-opacity hover:opacity-90"
            style={{
              background: `linear-gradient(180deg, ${GOLD_HI} 0%, ${BRONZE_DEEP} 100%)`,
              color: WHITE,
              boxShadow: "0 8px 18px -12px rgba(169,108,18,0.9)",
            }}
          >
            <Plus size={17} strokeWidth={2} />
            New request
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2.5">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={active}
                className="inline-flex h-[38px] items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors"
                style={
                  active
                    ? { background: INK, color: WHITE }
                    : { background: WHITE, color: INK, border: `1px solid ${HAIR}` }
                }
              >
                {f.label}
                <span
                  className="tabular-nums"
                  style={{ color: active ? "rgba(255,255,255,0.65)" : INK_FAINT }}
                >
                  {countFor(f.key)}
                </span>
              </button>
            );
          })}
        </div>

        {shown.length === 0 ? (
          <p className="mt-6 text-[13.5px]" style={{ color: INK_SOFT }}>
            Nothing here yet — requests with this status will appear as they come in.
          </p>
        ) : (
          <ul className="mt-5 space-y-3.5">
            {shown.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                open={openId === r.id}
                onToggle={() => setOpenId((prev) => (prev === r.id ? null : r.id))}
              />
            ))}
          </ul>
        )}
      </div>

      {/* ─ right — guidance ─ */}
      <aside className="min-w-0">
        <HowItWorks />
        <NeedHelp onMessage={onMessage} />
      </aside>
    </div>
  );
}
