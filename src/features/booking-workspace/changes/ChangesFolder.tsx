import * as React from "react";
import {
  ArrowRight,
  BedDouble,
  Calendar,
  CalendarDays,
  ClipboardList,
  ConciergeBell,
  History,
  Info,
  Lock,
  MessageSquare,
  Minus,
  Plus,
  Users,
  CreditCard,
  FileText,
  Accessibility,
} from "lucide-react";
import { Plate } from "@/features/booking-workspace/overview/primitives";

/* ── local light palette ── */
const IVORY = "#FAF7F5";
const WHITE = "#FFFFFF";
const INK = "#1B2530";
const INK_SOFT = "rgba(27,37,48,0.62)";
const INK_FAINT = "rgba(27,37,48,0.45)";
const HAIR = "rgba(27,37,48,0.10)";
const HAIR_SOFT = "rgba(27,37,48,0.07)";
const BRONZE = "#C0801E";
const BRONZE_DEEP = "#A96C12";
/* top stop of the submit button's gold face */
const GOLD_HI = "#CC8C1E";
const GREEN_BG = "#E7F1E9";
const GREEN_TX = "#3F7A55";
const RED_BG = "#FBE9E6";
const RED_TX = "#C2452C";
const CREAM = "#F7F2EA";

export type RoomLine = { type: string; note: string; qty: number; perRoom: number };

type SubTabKey = "rooms" | "addons" | "other";

const SUB_TABS: { key: SubTabKey; label: string; icon: React.ReactNode }[] = [
  { key: "rooms", label: "Rooms & dates", icon: <CalendarDays size={17} strokeWidth={1.7} /> },
  {
    key: "addons",
    label: "Add-ons & services",
    icon: <ConciergeBell size={17} strokeWidth={1.7} />,
  },
  { key: "other", label: "Other request", icon: <MessageSquare size={17} strokeWidth={1.7} /> },
];

function roomIcon(type: string) {
  const t = type.toLowerCase();
  if (t.includes("family") || t.includes("accessible"))
    return <Accessibility size={18} strokeWidth={1.7} />;
  if (t.includes("triple")) return <Users size={18} strokeWidth={1.7} />;
  return <BedDouble size={18} strokeWidth={1.7} />;
}

function DeltaBadge({ diff }: { diff: number }) {
  const tone =
    diff > 0
      ? { bg: GREEN_BG, tx: GREEN_TX }
      : diff < 0
        ? { bg: RED_BG, tx: RED_TX }
        : { bg: "rgba(27,37,48,0.05)", tx: INK_FAINT };
  return (
    <span
      className="inline-flex h-[26px] min-w-[52px] items-center justify-center rounded-full px-3 text-[12.5px] font-semibold tabular-nums"
      style={{ background: tone.bg, color: tone.tx }}
    >
      {diff > 0 ? `+${diff}` : diff}
    </span>
  );
}

function Counter({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div
      className="inline-flex h-[34px] items-stretch overflow-hidden rounded-[8px]"
      style={{ border: `1px solid ${HAIR}`, background: WHITE }}
    >
      <button
        type="button"
        aria-label={`Decrease ${label}`}
        onClick={() => onChange(Math.max(0, value - 1))}
        className="grid w-[34px] place-items-center transition-colors hover:bg-[rgba(27,37,48,0.04)]"
        style={{ color: INK_SOFT }}
      >
        <Minus size={14} />
      </button>
      <span
        className="grid w-[46px] place-items-center text-[13.5px] font-semibold tabular-nums"
        style={{ color: INK, borderLeft: `1px solid ${HAIR}`, borderRight: `1px solid ${HAIR}` }}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase ${label}`}
        onClick={() => onChange(value + 1)}
        className="grid w-[34px] place-items-center transition-colors hover:bg-[rgba(27,37,48,0.04)]"
        style={{ color: INK_SOFT }}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function StatCard({
  icon,
  label,
  from,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  from: number;
  to: number;
}) {
  const diff = to - from;
  return (
    <div className="flex min-w-0 flex-1 items-center gap-4 px-5 py-4">
      <span
        className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-full"
        style={{ background: "rgba(192,128,30,0.10)", color: BRONZE }}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[13px]" style={{ color: INK_SOFT }}>
          {label}
        </span>
        <span className="mt-1 flex items-center gap-2.5">
          <span
            className="text-[28px] font-semibold leading-none tabular-nums"
            style={{ color: INK }}
          >
            {from}
          </span>
          <ArrowRight size={16} style={{ color: INK_FAINT }} />
          <span
            className="text-[28px] font-semibold leading-none tabular-nums"
            style={{ color: INK }}
          >
            {to}
          </span>
          {diff !== 0 && (
            <span
              className="ml-1 inline-flex h-[22px] items-center rounded-full px-2 text-[11.5px] font-semibold"
              style={{
                background: diff > 0 ? GREEN_BG : RED_BG,
                color: diff > 0 ? GREEN_TX : RED_TX,
              }}
            >
              {diff > 0 ? `+${diff}` : diff}
            </span>
          )}
        </span>
      </span>
    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  last,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 py-[15px]"
      style={last ? undefined : { borderBottom: `1px solid ${HAIR_SOFT}` }}
    >
      <span className="shrink-0" style={{ color: BRONZE }}>
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-[13.5px]" style={{ color: INK_SOFT }}>
        {label}
      </span>
      <span className="shrink-0 text-[13.5px] font-medium" style={{ color: INK }}>
        {value}
      </span>
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10.5px] font-semibold uppercase"
      style={{ color: INK_FAINT, letterSpacing: "0.16em" }}
    >
      {children}
    </div>
  );
}

function Radio({
  checked,
  label,
  onSelect,
}: {
  checked: boolean;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button type="button" onClick={onSelect} className="flex items-center gap-2.5">
      <span
        className="grid h-[20px] w-[20px] place-items-center rounded-full"
        style={{
          border: `2px solid ${checked ? BRONZE : "rgba(27,37,48,0.26)"}`,
          background: WHITE,
        }}
      >
        {checked && (
          <span className="h-[9px] w-[9px] rounded-full" style={{ background: BRONZE }} />
        )}
      </span>
      <span className="text-[13.5px] font-medium" style={{ color: INK }}>
        {label}
      </span>
    </button>
  );
}

export function ChangesFolder({
  rooms,
  baseRooms,
  onRoomsChange,
  stayDates,
  reference,
  paymentTerms,
  onHistory,
  onMessage,
  onSubmit,
}: {
  rooms: RoomLine[];
  baseRooms: RoomLine[];
  onRoomsChange: (next: RoomLine[]) => void;
  stayDates: string;
  reference: string;
  paymentTerms: string;
  onHistory: () => void;
  onMessage: () => void;
  onSubmit?: () => void;
}) {
  const [sub, setSub] = React.useState<SubTabKey>("rooms");
  const [scope, setScope] = React.useState<"original" | "specific">("original");
  const [when, setWhen] = React.useState("");
  const [note, setNote] = React.useState("");

  /* the native date control renders the browser locale mask, so it stays a
     plain text field showing "dd.mm.yyyy" until the picker is opened */
  const [dateMode, setDateMode] = React.useState(false);
  const dateRef = React.useRef<HTMLInputElement>(null);
  const openDatePicker = () => {
    setDateMode(true);
    requestAnimationFrame(() => {
      dateRef.current?.focus();
      dateRef.current?.showPicker?.();
    });
  };

  const lines = rooms.map((r, i) => {
    const base = baseRooms[i]?.qty ?? r.qty;
    return { ...r, base, diff: r.qty - base, index: i };
  });

  const currentRooms = lines.reduce((s, l) => s + l.base, 0);
  const afterRooms = lines.reduce((s, l) => s + l.qty, 0);
  const currentGuests = lines.reduce((s, l) => s + l.base * l.perRoom, 0);
  const afterGuests = lines.reduce((s, l) => s + l.qty * l.perRoom, 0);
  const changed = lines.some((l) => l.diff !== 0);

  return (
    <Plate tone="light">
      <div className="flex flex-1 flex-col">
        {/* ── sub navigation ── */}
        <div
          className="flex flex-wrap items-center gap-x-2 gap-y-1 px-5 sm:px-8"
          style={{ borderBottom: `1px solid ${HAIR_SOFT}` }}
        >
          {SUB_TABS.map((t, i) => {
            const active = sub === t.key;
            return (
              <React.Fragment key={t.key}>
                {i > 0 && (
                  <span
                    aria-hidden
                    className="hidden h-[26px] w-px shrink-0 sm:block"
                    style={{ background: HAIR }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => setSub(t.key)}
                  className="relative inline-flex items-center gap-2.5 px-4 py-[18px] text-[14.5px] transition-colors"
                  style={{
                    color: active ? BRONZE_DEEP : INK_SOFT,
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  <span style={{ color: active ? BRONZE : INK_FAINT }}>{t.icon}</span>
                  {t.label}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full"
                      style={{ background: BRONZE }}
                    />
                  )}
                </button>
              </React.Fragment>
            );
          })}
          <button
            type="button"
            onClick={onHistory}
            className="ml-auto inline-flex items-center gap-2 py-[18px] text-[13.5px] font-medium transition-opacity hover:opacity-80"
            style={{ color: BRONZE_DEEP }}
          >
            <History size={16} />
            View change history
          </button>
        </div>

        {/* ── grid ── */}
        <div className="grid flex-1 grid-cols-1 gap-7 px-5 pb-12 pt-7 sm:px-8 xl:grid-cols-[minmax(0,1fr)_452px]">
          {/* ─ left ─ */}
          <div className="min-w-0">
            {sub === "rooms" ? (
              <>
                <Eyebrow>Apply changes to</Eyebrow>
                <div className="mt-2 flex flex-wrap items-end gap-x-10 gap-y-5">
                  <div className="flex items-center gap-8 pb-[11px]">
                    <Radio
                      checked={scope === "original"}
                      label="Original stay"
                      onSelect={() => setScope("original")}
                    />
                    <Radio
                      checked={scope === "specific"}
                      label="Specific dates"
                      onSelect={() => setScope("specific")}
                    />
                  </div>
                  <label className="block min-w-[240px] max-w-[380px] flex-1">
                    <span className="text-[12.5px]" style={{ color: INK_SOFT }}>
                      Select dates <span style={{ color: INK_FAINT }}>(optional)</span>
                    </span>
                    <span
                      className="mt-2 flex h-[46px] items-center gap-2 rounded-[10px] px-3.5"
                      style={{ background: WHITE, border: `1px solid ${HAIR}` }}
                    >
                      <input
                        ref={dateRef}
                        type={dateMode || when ? "date" : "text"}
                        value={when}
                        onChange={(e) => setWhen(e.target.value)}
                        onFocus={() => setDateMode(true)}
                        onBlur={() => {
                          if (!when) setDateMode(false);
                        }}
                        placeholder="dd.mm.yyyy"
                        className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-[rgba(27,37,48,0.45)] [&::-webkit-calendar-picker-indicator]:hidden"
                        style={{ color: INK }}
                        aria-label="Select dates"
                      />
                      <button
                        type="button"
                        onClick={openDatePicker}
                        aria-label="Open date picker"
                        className="shrink-0 transition-opacity hover:opacity-70"
                        style={{ color: INK_FAINT }}
                      >
                        <Calendar size={16} strokeWidth={1.7} />
                      </button>
                    </span>
                  </label>
                </div>

                <div className="mt-8" style={{ borderTop: `1px solid ${HAIR_SOFT}` }} />

                <div className="mt-7 flex items-center gap-4">
                  <Eyebrow>Room changes</Eyebrow>
                  <span className="ml-auto hidden items-center gap-0 sm:flex">
                    <span
                      className="w-[110px] text-center text-[10.5px] font-semibold uppercase"
                      style={{ color: INK_FAINT, letterSpacing: "0.16em" }}
                    >
                      Current
                    </span>
                    <span
                      className="w-[150px] text-center text-[10.5px] font-semibold uppercase"
                      style={{ color: INK_FAINT, letterSpacing: "0.16em" }}
                    >
                      Requested
                    </span>
                    <span
                      className="w-[96px] text-center text-[10.5px] font-semibold uppercase"
                      style={{ color: INK_FAINT, letterSpacing: "0.16em" }}
                    >
                      Change
                    </span>
                  </span>
                </div>

                <ul className="mt-3">
                  {lines.map((l, i) => (
                    <li key={l.type} className="flex flex-wrap items-stretch gap-y-3">
                      {/* name + current share one ruled block; the hairline on its
                          right edge separates them from the editable columns */}
                      <span
                        className="flex min-w-[280px] flex-1 items-stretch sm:border-r"
                        style={{
                          borderRightColor: HAIR_SOFT,
                          borderBottom:
                            i < lines.length - 1
                              ? `1px solid ${HAIR_SOFT}`
                              : "1px solid transparent",
                        }}
                      >
                        <span className="flex min-w-0 flex-1 items-center gap-3 py-[15px] pr-4">
                          <span className="shrink-0" style={{ color: BRONZE }}>
                            {roomIcon(l.type)}
                          </span>
                          <span className="min-w-0">
                            <span
                              className="block truncate text-[14.5px] font-medium"
                              style={{ color: INK }}
                            >
                              {l.type}
                            </span>
                            <span
                              className="block truncate text-[12px]"
                              style={{ color: INK_FAINT }}
                            >
                              {l.note}
                            </span>
                          </span>
                        </span>
                        <span
                          className="flex w-[70px] shrink-0 items-center justify-center text-[15px] font-semibold tabular-nums sm:w-[110px]"
                          style={{ color: INK }}
                        >
                          {l.base}
                        </span>
                      </span>
                      <span className="flex w-[150px] items-center justify-center">
                        <Counter
                          value={l.qty}
                          label={l.type}
                          onChange={(n) =>
                            onRoomsChange(
                              rooms.map((x, j) => (j === l.index ? { ...x, qty: n } : x)),
                            )
                          }
                        />
                      </span>
                      <span className="flex w-[96px] items-center justify-center">
                        <DeltaBadge diff={l.diff} />
                      </span>
                    </li>
                  ))}
                </ul>

                <div
                  className="mt-7 flex flex-col overflow-hidden [&>*+*]:border-t [&>*+*]:border-[rgba(27,37,48,0.10)] sm:flex-row sm:[&>*+*]:border-l sm:[&>*+*]:border-t-0"
                  style={{
                    background: WHITE,
                    border: `1px solid ${HAIR}`,
                    borderRadius: 14,
                    borderColor: HAIR,
                    boxShadow: "0 1px 2px rgba(24,30,36,0.04)",
                  }}
                >
                  <StatCard
                    icon={<BedDouble size={22} strokeWidth={1.7} />}
                    label="Rooms"
                    from={currentRooms}
                    to={afterRooms}
                  />
                  <StatCard
                    icon={<Users size={22} strokeWidth={1.7} />}
                    label="Guests"
                    from={currentGuests}
                    to={afterGuests}
                  />
                </div>

                <div className="mt-8">
                  <Eyebrow>Other changes (optional)</Eyebrow>
                  <label className="mt-3 block">
                    <span className="sr-only">Add a note for the hotel</span>
                    <span
                      className="block rounded-[12px] p-4"
                      style={{ background: WHITE, border: `1px solid ${HAIR}` }}
                    >
                      <textarea
                        rows={3}
                        value={note}
                        maxLength={1000}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note for the hotel…"
                        className="w-full resize-none bg-transparent text-[13.5px] outline-none"
                        style={{ color: INK }}
                      />
                      <span
                        className="mt-2 block text-right text-[11.5px]"
                        style={{ color: INK_FAINT }}
                      >
                        {note.length}/1000
                      </span>
                    </span>
                  </label>
                </div>
              </>
            ) : (
              <div
                className="rounded-[14px] px-8 py-16 text-center"
                style={{ background: WHITE, border: `1px solid ${HAIR}` }}
              >
                <span
                  className="mx-auto grid h-[52px] w-[52px] place-items-center rounded-full"
                  style={{ background: "rgba(192,128,30,0.10)", color: BRONZE }}
                >
                  {sub === "addons" ? <ConciergeBell size={22} /> : <ClipboardList size={22} />}
                </span>
                <h3 className="mt-4 text-[17px] font-semibold" style={{ color: INK }}>
                  {sub === "addons" ? "Add-ons & services" : "Other request"}
                </h3>
                <p className="mx-auto mt-2 max-w-[380px] text-[13px]" style={{ color: INK_SOFT }}>
                  {sub === "addons"
                    ? "Request catering, transfers or extra services for this stay."
                    : "Tell us anything else you would like us to change for this booking."}
                </p>
                <button
                  type="button"
                  onClick={onMessage}
                  className="mt-5 inline-flex h-[42px] items-center gap-2 rounded-[9px] px-5 text-[13.5px] font-semibold"
                  style={{ background: BRONZE_DEEP, color: WHITE }}
                >
                  Message HotelGroupBook <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>

          {/* ─ right — change summary ─ */}
          <aside className="min-w-0">
            <div
              className="rounded-[14px] p-5 sm:p-6"
              style={{
                background: WHITE,
                border: `1px solid ${HAIR}`,
                boxShadow: "0 1px 2px rgba(24,30,36,0.04), 0 12px 28px -22px rgba(24,30,36,0.35)",
              }}
            >
              <Eyebrow>Change summary</Eyebrow>

              <div className="mt-3">
                <SummaryRow
                  icon={<CalendarDays size={17} strokeWidth={1.7} />}
                  label="Stay dates"
                  value={stayDates}
                />
                <SummaryRow
                  icon={<BedDouble size={17} strokeWidth={1.7} />}
                  label="Rooms"
                  value={`${currentRooms} → ${afterRooms} rooms`}
                />
                <SummaryRow
                  icon={<Users size={17} strokeWidth={1.7} />}
                  label="Guests"
                  value={`${currentGuests} → ${afterGuests} guests`}
                />
                <SummaryRow
                  icon={<FileText size={17} strokeWidth={1.7} />}
                  label="Reference"
                  value={reference}
                />
                <SummaryRow
                  icon={<CreditCard size={17} strokeWidth={1.7} />}
                  label="Payment terms"
                  value={paymentTerms}
                  last
                />
              </div>

              <div
                className="mt-5 flex items-start gap-3 rounded-[11px] px-4 py-3.5"
                style={{ background: CREAM }}
              >
                <Info size={16} className="mt-[1px] shrink-0" style={{ color: INK_FAINT }} />
                <span className="text-[12.5px]" style={{ color: INK_SOFT }}>
                  We'll review your request and respond as soon as possible.
                </span>
              </div>

              <button
                type="button"
                onClick={onSubmit}
                disabled={!changed}
                className="mt-5 inline-flex h-[52px] w-full items-center justify-center gap-2.5 rounded-[10px] text-[15px] font-semibold transition-opacity"
                style={{
                  background: `linear-gradient(180deg, ${GOLD_HI} 0%, ${BRONZE_DEEP} 100%)`,
                  color: WHITE,
                  opacity: changed ? 1 : 0.5,
                  cursor: changed ? "pointer" : "not-allowed",
                  boxShadow: "0 8px 18px -12px rgba(169,108,18,0.9)",
                }}
              >
                Submit change request <ArrowRight size={17} />
              </button>

              <div
                className="mt-3 flex items-center justify-center gap-2 text-[12px]"
                style={{ color: INK_FAINT }}
              >
                <Lock size={13} />
                Your request is sent securely
              </div>

              <div
                className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 pt-5 text-[12.5px]"
                style={{ borderTop: `1px solid ${HAIR_SOFT}`, color: INK_SOFT }}
              >
                Need help with your changes?
                <button
                  type="button"
                  onClick={onMessage}
                  className="inline-flex items-center gap-1.5 font-medium transition-opacity hover:opacity-80"
                  style={{ color: BRONZE_DEEP }}
                >
                  Message HotelGroupBook <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </Plate>
  );
}
