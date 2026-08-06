import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCheck,
  Download,
  ExternalLink,
  FileText,
  Mail,
  MoreVertical,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Archive,
} from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";

/* ── shared navy material (identical to Booking Overview / Changes / Documents) ── */
const NAVY_TEXTURE =
  "radial-gradient(1100px 420px at 18% -10%, rgba(255,255,255,0.045), transparent 62%), radial-gradient(700px 360px at 88% 108%, rgba(120,160,195,0.05), transparent 60%)";
const INK = `${NAVY_TEXTURE}, linear-gradient(180deg, #24445E 0%, #203D55 55%, #1C374D 100%)`;
const INK_2 = `${NAVY_TEXTURE}, linear-gradient(180deg, #2A4B64 0%, #26455C 55%, #223F54 100%)`;
const NAVY_INNER =
  "inset 0 1px 0 rgba(255,255,255,0.03), inset 0 -1px 0 rgba(0,0,0,0.12), inset 0 8px 22px -18px rgba(0,0,0,0.35), 0 0 0 1px rgba(8,18,28,0.25)";
const NAVY_BORDER = "rgba(255,255,255,0.06)";
const TEXT = "#F3F1EB";
const TEXT_2 = "rgba(233,238,243,0.80)";
const MUTED = "rgba(206,218,228,0.55)";
const GOLD_MET_MID = "#C5962D";
const GOLD_SOFT = "#D9BE74";
const GREEN = "#7FBE96";

type Attachment = { name: string; size: string };

type Msg = {
  id: string;
  from: "hotel" | "you";
  body?: string;
  attachment?: Attachment;
  time: string;
  read?: boolean;
};

type Conversation = {
  id: string;
  name: string;
  initials: string;
  role: string;
  preview: string;
  stamp: string;
  unread?: number;
  online?: boolean;
  dot?: string;
  contact: { person: string; role: string; email: string; phone: string };
  messages: Msg[];
};

const SEGMENTS = ["All", "Hotel", "You", "Important"] as const;
type Segment = (typeof SEGMENTS)[number];

function seedConversations(hotelName: string): Conversation[] {
  return [
    {
      id: "hotel",
      name: hotelName,
      initials: "RB",
      role: "Hotel contact",
      preview: "Thank you! We have received the rooming list.",
      stamp: "14:22",
      unread: 2,
      online: true,
      contact: {
        person: "Maria Andersen",
        role: "Groups & Events Manager",
        email: "maria.andersen@radissonblu.com",
        phone: "+47 55 21 30 00",
      },
      messages: [
        {
          id: "m1",
          from: "hotel",
          body: "Hello Emma,",
          time: "14:15",
        },
        {
          id: "m2",
          from: "hotel",
          body: "Thank you for your message. We have availability for your dates and the proposal is now ready for review.",
          time: "14:15",
        },
        {
          id: "m3",
          from: "hotel",
          attachment: { name: "Bergen Group Stay – Proposal.pdf", size: "2.4 MB" },
          time: "14:16",
        },
        {
          id: "m4",
          from: "you",
          body: "Thank you! That looks great.\nCould you also confirm the late check-out for 15:00?",
          time: "14:18",
          read: true,
        },
        {
          id: "m5",
          from: "hotel",
          body: "Yes, late check-out until 15:00 is confirmed.",
          time: "14:20",
        },
        {
          id: "m6",
          from: "hotel",
          body: "Thank you! We have received the rooming list.\nIs there anything else you need from us?",
          time: "14:22",
        },
      ],
    },
    {
      id: "events",
      name: "Events Team",
      initials: "ET",
      role: "Meetings & events",
      preview: "Updated proposal attached.",
      stamp: "Yesterday",
      dot: GREEN,
      contact: {
        person: "Jonas Berg",
        role: "Events Coordinator",
        email: "events@radissonblu.com",
        phone: "+47 55 21 30 12",
      },
      messages: [
        { id: "e1", from: "hotel", body: "Updated proposal attached for the meeting room setup.", time: "16:04" },
        { id: "e2", from: "hotel", attachment: { name: "Meeting_Setup_v2.pdf", size: "1.1 MB" }, time: "16:04" },
      ],
    },
    {
      id: "fb",
      name: "F&B Team",
      initials: "FB",
      role: "Food & beverage",
      preview: "Menu options for your dinner.",
      stamp: "23 Jul",
      dot: "#7FA8D6",
      contact: {
        person: "Ingrid Solheim",
        role: "F&B Manager",
        email: "fb@radissonblu.com",
        phone: "+47 55 21 30 22",
      },
      messages: [
        { id: "f1", from: "hotel", body: "Menu options for your group dinner are ready — three set menus with vegetarian alternatives.", time: "10:12" },
      ],
    },
    {
      id: "hk",
      name: "Housekeeping",
      initials: "HK",
      role: "Rooms division",
      preview: "Special requests noted.",
      stamp: "22 Jul",
      dot: "#7FA8D6",
      contact: {
        person: "Lise Haugen",
        role: "Housekeeping Supervisor",
        email: "housekeeping@radissonblu.com",
        phone: "+47 55 21 30 34",
      },
      messages: [{ id: "h1", from: "hotel", body: "Special requests noted — connecting rooms on floor 4.", time: "09:40" }],
    },
    {
      id: "sales",
      name: "Sales Manager",
      initials: "SM",
      role: "Contracting",
      preview: "Contract is ready for signature.",
      stamp: "21 Jul",
      dot: "#7FA8D6",
      contact: {
        person: "Petter Vik",
        role: "Sales Manager",
        email: "sales@radissonblu.com",
        phone: "+47 55 21 30 08",
      },
      messages: [{ id: "s1", from: "hotel", body: "The contract is ready for signature at your convenience.", time: "13:02" }],
    },
    {
      id: "payment",
      name: "Payment Team",
      initials: "PT",
      role: "Finance",
      preview: "Payment confirmed.",
      stamp: "20 Jul",
      dot: "#7FA8D6",
      contact: {
        person: "Anne Fjeld",
        role: "Accounts Receivable",
        email: "finance@radissonblu.com",
        phone: "+47 55 21 30 44",
      },
      messages: [{ id: "p1", from: "hotel", body: "Deposit payment confirmed. Thank you.", time: "11:25" }],
    },
  ];
}

/* ── shared panel shell ── */
function Panel({
  title,
  action,
  children,
  className,
  bodyClass,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClass?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-[16px] ${className ?? ""}`}
      style={{ background: INK, border: `1px solid ${NAVY_BORDER}`, boxShadow: NAVY_INNER }}
    >
      {title && (
        <header className="flex items-center justify-between gap-3 px-5 pt-5">
          <h3 className="truncate text-[16.5px]" style={{ color: TEXT, fontFamily: SERIF }}>
            {title}
          </h3>
          {action}
        </header>
      )}
      <div className={bodyClass ?? "px-5 pb-5 pt-4"}>{children}</div>
    </section>
  );
}

function Avatar({ initials, online, size = 38 }: { initials: string; online?: boolean; size?: number }) {
  return (
    <span className="relative shrink-0">
      <span
        className="grid place-items-center rounded-full text-[12px] font-semibold"
        style={{
          width: size,
          height: size,
          background: INK_2,
          border: "1px solid rgba(255,255,255,0.10)",
          color: GOLD_SOFT,
        }}
      >
        {initials}
      </span>
      {online && (
        <span
          className="absolute -bottom-0.5 -right-0.5 h-[10px] w-[10px] rounded-full"
          style={{ background: GREEN, border: "2px solid #21405A" }}
        />
      )}
    </span>
  );
}

function IconBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full transition-opacity hover:opacity-80"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.09)",
        color: TEXT_2,
      }}
    >
      {children}
    </button>
  );
}

function GoldButton({
  children,
  onClick,
  to,
  params,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  params?: Record<string, string>;
}) {
  const style: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(197,150,45,0.45)",
    color: GOLD_SOFT,
  };
  const cls =
    "mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-[12.5px] font-semibold transition-opacity hover:opacity-85";
  if (to) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Link to={to as any} params={params as any} className={cls} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} style={style}>
      {children}
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="mt-3.5 first:mt-0">
      <p className="text-[11px]" style={{ color: MUTED }}>
        {label}
      </p>
      <p className="mt-0.5 break-words text-[13px] font-semibold" style={{ color: TEXT }}>
        {value}
      </p>
    </div>
  );
}

function FileCard({ name, size, meta }: { name: string; size: string; meta?: string }) {
  return (
    <div
      className="flex min-w-0 items-center gap-3 rounded-[11px] px-3 py-2.5"
      style={{ background: "rgba(255,255,255,0.045)", border: `1px solid ${NAVY_BORDER}` }}
    >
      <span
        className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[8px]"
        style={{ background: "rgba(217,164,65,0.14)", color: "#E0B45C" }}
      >
        <FileText size={15} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12.5px] font-medium" style={{ color: TEXT }}>
          {name}
        </span>
        <span className="block truncate text-[11px]" style={{ color: MUTED }}>
          {size}
          {meta ? ` · ${meta}` : ""}
        </span>
      </span>
      <button
        type="button"
        aria-label={`Download ${name}`}
        className="shrink-0 transition-opacity hover:opacity-75"
        style={{ color: GOLD_SOFT }}
      >
        <Download size={15} />
      </button>
    </div>
  );
}

export function BookingMessagesView({
  bookingId,
  reference,
  bookingName,
  stayDates,
  hotelName = "Radisson Blu Bergen",
}: {
  bookingId: string;
  reference: string;
  bookingName: string;
  stayDates: string;
  hotelName?: string;
}) {
  const [conversations, setConversations] = useState<Conversation[]>(() => seedConversations(hotelName));
  const [activeId, setActiveId] = useState("hotel");
  const [segment, setSegment] = useState<Segment>("All");
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [draft, setDraft] = useState("");
  const feedRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  const list = useMemo(() => {
    let out = conversations;
    if (segment === "Hotel") out = out.filter((c) => c.id === "hotel");
    if (segment === "You") out = out.filter((c) => c.messages.some((m) => m.from === "you"));
    if (segment === "Important") out = out.filter((c) => (c.unread ?? 0) > 0);
    return out;
  }, [conversations, segment]);

  const visibleMessages = useMemo(() => {
    if (!query.trim()) return active.messages;
    const q = query.toLowerCase();
    return active.messages.filter(
      (m) => m.body?.toLowerCase().includes(q) || m.attachment?.name.toLowerCase().includes(q),
    );
  }, [active, query]);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight });
  }, [activeId, conversations]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setConversations((cur) =>
      cur.map((c) =>
        c.id === active.id
          ? {
              ...c,
              preview: text,
              stamp: time,
              messages: [...c.messages, { id: `n${Date.now()}`, from: "you", body: text, time, read: false }],
            }
          : c,
      ),
    );
    setDraft("");
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[268px_minmax(0,1fr)_310px]">
      {/* ══ LEFT · conversations ══ */}
      <Panel
        title="Conversations"
        action={
          <span className="flex shrink-0 items-center gap-2">
            <IconBtn label="Filter conversations">
              <SlidersHorizontal size={14} />
            </IconBtn>
            <IconBtn label="New conversation">
              <Plus size={15} />
            </IconBtn>
          </span>
        }
        bodyClass="flex flex-col px-4 pb-4 pt-4"
      >
        <div
          className="flex gap-1 rounded-[10px] p-1"
          style={{ background: "rgba(0,0,0,0.16)", border: `1px solid ${NAVY_BORDER}` }}
        >
          {SEGMENTS.map((s) => {
            const on = s === segment;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSegment(s)}
                className="flex-1 rounded-[7px] py-1.5 text-[11.5px] font-medium transition-colors"
                style={
                  on
                    ? { background: "rgba(255,255,255,0.09)", color: TEXT }
                    : { color: MUTED }
                }
              >
                {s}
              </button>
            );
          })}
        </div>

        <div className="mt-3 min-h-0 space-y-1.5 lg:max-h-[520px] lg:overflow-y-auto">
          {list.map((c) => {
            const on = c.id === active.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setActiveId(c.id);
                  setConversations((cur) => cur.map((x) => (x.id === c.id ? { ...x, unread: 0 } : x)));
                }}
                className="flex w-full items-start gap-3 rounded-[12px] px-3 py-3 text-left transition-colors"
                style={{
                  background: on ? "rgba(255,255,255,0.07)" : "transparent",
                  border: on ? "1px solid rgba(197,150,45,0.5)" : "1px solid transparent",
                }}
              >
                <Avatar initials={c.initials} online={c.online} size={34} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="truncate text-[13px] font-semibold" style={{ color: TEXT }}>
                      {c.name}
                    </span>
                    <span className="shrink-0 text-[11px]" style={{ color: MUTED }}>
                      {c.stamp}
                    </span>
                  </span>
                  <span className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="truncate text-[11.5px]" style={{ color: MUTED }}>
                      {c.preview}
                    </span>
                    {c.unread ? (
                      <span
                        className="grid h-[17px] min-w-[17px] shrink-0 place-items-center rounded-full px-1 text-[10px] font-semibold"
                        style={{ background: GOLD_MET_MID, color: "#22180A" }}
                      >
                        {c.unread}
                      </span>
                    ) : c.dot ? (
                      <span
                        className="h-[7px] w-[7px] shrink-0 rounded-full"
                        style={{ background: c.dot }}
                      />
                    ) : null}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[10px] py-2.5 text-[12px] font-medium transition-opacity hover:opacity-85"
          style={{
            background: "rgba(255,255,255,0.045)",
            border: `1px solid ${NAVY_BORDER}`,
            color: TEXT_2,
          }}
        >
          <Archive size={13} /> View archived
        </button>
      </Panel>

      {/* ══ CENTER · active conversation ══ */}
      <section
        className="flex min-w-0 flex-col rounded-[16px]"
        style={{ background: INK, border: `1px solid ${NAVY_BORDER}`, boxShadow: NAVY_INNER }}
      >
        <header
          className="flex items-center gap-3 px-5 py-4"
          style={{ borderBottom: `1px solid ${NAVY_BORDER}` }}
        >
          <Avatar initials={active.initials} online={active.online} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold" style={{ color: TEXT }}>
              {active.name}
            </p>
            <p className="flex items-center gap-2 text-[11.5px]" style={{ color: MUTED }}>
              {active.role}
              {active.online && (
                <span className="flex items-center gap-1.5" style={{ color: GREEN }}>
                  <span className="h-[6px] w-[6px] rounded-full" style={{ background: GREEN }} />
                  Online
                </span>
              )}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <IconBtn label="Search messages" onClick={() => setShowSearch((v) => !v)}>
              <Search size={14} />
            </IconBtn>
            <IconBtn label="Call hotel">
              <Phone size={14} />
            </IconBtn>
            <IconBtn label="More options">
              <MoreVertical size={15} />
            </IconBtn>
          </div>
        </header>

        {showSearch && (
          <div className="px-5 pt-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in conversation…"
              className="w-full rounded-[10px] px-3.5 py-2.5 text-[12.5px] outline-none"
              style={{
                background: "rgba(0,0,0,0.18)",
                border: `1px solid ${NAVY_BORDER}`,
                color: TEXT,
              }}
            />
          </div>
        )}

        <div ref={feedRef} className="min-h-[320px] flex-1 space-y-4 overflow-y-auto px-5 py-5 lg:max-h-[520px]">
          <p className="text-center text-[11px]" style={{ color: MUTED }}>
            Today
          </p>
          {visibleMessages.map((m) => {
            const mine = m.from === "you";
            return (
              <div key={m.id} className={`flex items-end gap-2.5 ${mine ? "justify-end" : ""}`}>
                {!mine && <Avatar initials={active.initials} size={30} />}
                <div className="min-w-0 max-w-[78%]">
                  <div
                    className="rounded-[14px] px-4 py-3"
                    style={
                      mine
                        ? {
                            background: "linear-gradient(180deg, #9A7A33 0%, #866826 100%)",
                            border: "1px solid rgba(226,196,124,0.30)",
                            color: "#FBF6E9",
                            borderBottomRightRadius: 6,
                          }
                        : {
                            background: INK_2,
                            border: `1px solid ${NAVY_BORDER}`,
                            color: TEXT_2,
                            borderBottomLeftRadius: 6,
                          }
                    }
                  >
                    {m.body && (
                      <p className="whitespace-pre-line text-[13px] leading-[1.55]">{m.body}</p>
                    )}
                    {m.attachment && (
                      <div className={m.body ? "mt-3" : ""}>
                        <FileCard name={m.attachment.name} size={m.attachment.size} />
                      </div>
                    )}
                    <p
                      className={`mt-1.5 flex items-center gap-1.5 text-[10.5px] ${mine ? "justify-end" : ""}`}
                      style={{ color: mine ? "rgba(251,246,233,0.7)" : MUTED }}
                    >
                      {m.time}
                      {mine && m.read && <CheckCheck size={12} />}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 pb-5">
          <div
            className="flex items-center gap-2 rounded-[13px] px-3 py-2"
            style={{ background: "rgba(0,0,0,0.20)", border: `1px solid ${NAVY_BORDER}` }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Type your message..."
              className="min-w-0 flex-1 bg-transparent px-1.5 py-2 text-[13px] outline-none"
              style={{ color: TEXT }}
            />
            <IconBtn label="Attach file">
              <Paperclip size={14} />
            </IconBtn>
            <button
              type="button"
              onClick={send}
              aria-label="Send message"
              className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(180deg, #E7C777 0%, #C5962D 100%)",
                color: "#22180A",
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ══ RIGHT · details ══ */}
      <div className="min-w-0 space-y-4 lg:col-span-2 xl:col-span-1">
        <Panel title="Conversation details">
          <DetailRow label="Hotel" value={hotelName} />
          <DetailRow
            label="Contact person"
            value={
              <>
                {active.contact.person}
                <span className="mt-0.5 block text-[11.5px] font-normal" style={{ color: MUTED }}>
                  {active.contact.role}
                </span>
              </>
            }
          />

          <DetailRow label="Email" value={active.contact.email} />
          <DetailRow label="Phone" value={active.contact.phone} />
          <GoldButton
            onClick={() => {
              window.location.href = `mailto:${active.contact.email}`;
            }}
          >
            <Mail size={13} /> View contact card <ExternalLink size={12} />
          </GoldButton>
        </Panel>

        <Panel title="Related booking">
          <DetailRow label="Booking reference" value={reference} />
          <DetailRow label="Your reference" value={bookingName} />
          <DetailRow label="Stay dates" value={stayDates} />
          <GoldButton to="/bookings/$bookingId" params={{ bookingId }}>
            View booking <ExternalLink size={12} />
          </GoldButton>
        </Panel>

        <Panel title="Attachments">
          <div className="space-y-2">
            <FileCard name="Proposal.pdf" size="2.4 MB" meta="Today" />
            <FileCard name="Contract.pdf" size="1.1 MB" meta="20 Jul 2026" />
            <FileCard name="Invoice.pdf" size="856 KB" meta="23 Jul 2026" />
          </div>
          <GoldButton to="/bookings/$bookingId" params={{ bookingId }}>
            View all documents <ArrowRight size={13} />
          </GoldButton>
        </Panel>
      </div>
    </div>
  );
}

export default BookingMessagesView;
