import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bed,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Home,
  MessageSquare,
  Pencil,
  Plus,
  StickyNote,
  Users,
  X,
} from "lucide-react";
import { SERIF, TopBar } from "@/components/DashboardChrome";
import { GlobalSidebar } from "@/components/GlobalSidebar";
import { type Booking } from "@/lib/bookings";
import { useAuth } from "@/lib/auth";
import { fetchBooking } from "@/lib/bookingsApi";
import {
  ROOM_TYPES,
  allocationStatus,
  capacityOf,
  flagOf,
  guestName,
  isNamed,
  labelOf,
  roomingIssues,
  statsOf,
  type Allocation,
  type RoomingList,
} from "@/lib/rooming";
import { bookingQueryOptions, roomingQueryOptions } from "./rooming-list.$bookingId";

export const Route = createFileRoute("/rooming/$bookingId")({
  component: RoomingWorkspaceRoute,
  loader: async ({ context, params }) => {
    try {
      const booking = await context.queryClient.ensureQueryData(
        bookingQueryOptions(params.bookingId),
      );
      if (booking) {
        await context.queryClient.ensureQueryData(
          roomingQueryOptions(params.bookingId, booking.rooms),
        );
      }
    } catch {
      /* unauthenticated / prerender — the component handles it */
    }
  },
  head: () => ({
    meta: [
      { title: "Rooming List Workspace — HotelGroupBook" },
      {
        name: "description",
        content:
          "Review rooming list progress, versions, room overview and outstanding guest details before entering the editor.",
      },
      { property: "og:title", content: "Rooming List Workspace — HotelGroupBook" },
      {
        property: "og:description",
        content: "A calm control centre for your group rooming list — status first, editing second.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

/* ── tokens — warm ivory "premium paper" workspace ── */
const PLATE = "#F6F2EA"; // warm ivory workspace
const PLATE_TEXTURE =
  "radial-gradient(1200px 480px at 12% -8%, rgba(212,175,55,0.10), transparent 62%), radial-gradient(900px 420px at 92% 4%, rgba(198,171,120,0.10), transparent 60%), linear-gradient(180deg, #F7F3EC 0%, #F5F1EA 100%)";
const INK = "#F8F4ED"; // warm ivory card surface
const CARD_GRAD = "linear-gradient(180deg, #FBF8F1 0%, #F6F1E7 100%)"; // soft champagne
const LINE = "rgba(158,136,100,0.22)"; // warm 1px border
const LINE_SOFT = "rgba(158,136,100,0.14)";
const CARD_SHADOW = "0 1px 2px rgba(58,44,20,0.06), 0 16px 34px -26px rgba(58,44,20,0.42)";
/* dark navy panel (KPI band + section header bars) */
const NAVY_PANEL =
  "linear-gradient(180deg, #17324A 0%, #12283C 55%, #102336 100%)";
const NAVY_BAR = "linear-gradient(180deg, #17324A 0%, #13293D 100%)";
const NAVY_BORDER = "rgba(255,255,255,0.10)";
const NAVY_INNER = "inset 0 1px 0 rgba(255,255,255,0.10)";
const ON_NAVY = "#F3F7FA";
const ON_NAVY_2 = "rgba(221,232,241,0.84)";
const ON_NAVY_MUTED = "rgba(196,211,224,0.60)";
const TEXT = "#16293A"; // dark navy
const TEXT_2 = "#3D5468";
const MUTED = "#7B8896";
/* hero (dark image) text */
const HERO_TEXT = "rgba(226,233,239,0.88)";
const HERO_MUTED = "rgba(214,224,232,0.62)";
const GOLD_HI = "#F3D987";
const GOLD_MET = "#D4AF37";
const GOLD_MET_MID = "#C5962D";
const GOLD_MET_LOW = "#A97816";
const GOLD_SOFT = "#A9852F";
const GREEN = "#4F8A62";
const AMBER = "#B67C1E";
const RED = "#B4584A";

const GOLD_BAR = `linear-gradient(90deg, ${GOLD_MET_LOW}, ${GOLD_HI} 45%, ${GOLD_MET_MID})`;


const TABS = [
  "Overview",
  "Rooming List",
  "Changes",
  "Documents",
  "Messages",
  "Notes",
] as const;

const TAB_ICON: Record<(typeof TABS)[number], React.ReactNode> = {
  Overview: <Home size={14} />,
  "Rooming List": <ClipboardList size={14} />,
  Changes: <Pencil size={14} />,
  Documents: <FileText size={14} />,
  Messages: <MessageSquare size={14} />,
  Notes: <StickyNote size={14} />,
};

function fmtDateTime(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return `Today, ${time}`;
  return `${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${time}`;
}

function fmtDay(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function RoomingWorkspaceRoute() {
  const { bookingId } = Route.useParams();
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !session) {
      navigate({ to: "/auth", search: { next: `/rooming/${bookingId}` }, replace: true });
    }
  }, [authLoading, session, bookingId, navigate]);

  const { data: booking, isLoading } = useQuery({
    ...bookingQueryOptions(bookingId),
    enabled: Boolean(session) || authLoading,
  });

  if (!booking) {
    if (authLoading || isLoading || !session) return null;
    throw notFound();
  }
  return <Workspace booking={booking} />;
}

function Workspace({ booking }: { booking: Booking }) {
  const queryClient = useQueryClient();
  const [navOpen, setNavOpen] = useState(false);
  const [list, setList] = useState<RoomingList | null>(
    () => queryClient.getQueryData<RoomingList>(["rooming", booking.id]) ?? null,
  );
  const { session, signOut } = useAuth();

  useEffect(() => {
    let active = true;
    (async () => {
      const loaded = await queryClient.ensureQueryData(
        roomingQueryOptions(booking.id, booking.rooms),
      );
      if (active) setList(loaded);
    })().catch((err) => console.error("[rooming]", err));
    return () => {
      active = false;
    };
  }, [booking.id, booking.rooms, queryClient]);

  const displayName =
    (session?.user.user_metadata?.full_name as string | undefined) ?? session?.user.email ?? "";
  const initials = displayName
    .split(/[\s@.]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const stats = useMemo(() => (list ? statsOf(list) : null), [list]);
  const issues = useMemo(() => (list ? roomingIssues(list) : []), [list]);

  const active = useMemo(
    () => (list?.allocations ?? []).filter((a) => a.status !== "cancelled"),
    [list],
  );

  const statusCounts = useMemo(() => {
    let complete = 0;
    let pending = 0;
    let missing = 0;
    for (const a of active) {
      const s = allocationStatus(a);
      if (s === "complete") complete += 1;
      else if (s === "attention") pending += 1;
      else missing += 1;
    }
    return { complete, pending, missing };
  }, [active]);

  const byType = useMemo(() => {
    const map = new Map<string, { label: string; rooms: number; guests: number }>();
    for (const a of active) {
      const key = a.type;
      const row = map.get(key) ?? { label: labelOf(a.type), rooms: 0, guests: 0 };
      row.rooms += 1;
      row.guests += capacityOf(a.type, a.occupancy);
      map.set(key, row);
    }
    return ROOM_TYPES.filter((t) => map.get(t.value)).map((t) => ({
      value: t.value,
      ...map.get(t.value)!,
    }));
  }, [active]);

  const countries = useMemo(() => {
    const map = new Map<string, number>();
    for (const a of active)
      for (const g of a.guests) if (g.nationality) map.set(g.nationality, (map.get(g.nationality) ?? 0) + 1);
    for (const g of list?.unassigned ?? [])
      if (g.nationality) map.set(g.nationality, (map.get(g.nationality) ?? 0) + 1);
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [active, list]);

  const dueISO = booking.rooming?.due;
  const daysLeft = useMemo(() => {
    if (!dueISO) return null;
    const d = new Date(dueISO);
    if (Number.isNaN(d.getTime())) return null;
    return Math.ceil((d.getTime() - Date.now()) / 86400000);
  }, [dueISO]);

  const totalGuests = active.reduce((n, a) => n + a.guests.filter(isNamed).length, 0);
  const avgOccupancy = active.length ? (totalGuests / active.length).toFixed(2) : "0.00";
  const percent = stats?.percent ?? 0;
  const submitted = Boolean(list?.submittedAt);

  const previewGroups = useMemo(() => {
    const groups = new Map<string, Allocation[]>();
    for (const a of active) {
      const arr = groups.get(a.type) ?? [];
      arr.push(a);
      groups.set(a.type, arr);
    }
    return [...groups.entries()].slice(0, 2).map(([type, rooms]) => ({
      label: `${labelOf(type as Allocation["type"])} Rooms`,
      rooms,
      names: rooms.flatMap((r) => r.guests.filter(isNamed).map(guestName)),
    }));
  }, [active]);

  const versions = useMemo(() => {
    const out: { id: string; label: string; note: string; sub: string; current: boolean }[] = [];
    out.push({
      id: "current",
      label: `Version ${list?.changeLog?.length ? list.changeLog.length + 1 : 1}`,
      note: submitted ? `Submitted ${fmtDay(list?.submittedAt)}` : `Edited ${fmtDateTime(list?.savedAt)}`,
      sub: `${totalGuests} guests`,
      current: true,
    });
    (list?.changeLog ?? []).slice(0, 3).forEach((c, i) => {
      out.push({
        id: c.id,
        label: `Version ${(list?.changeLog?.length ?? 0) - i}`,
        note: "Change proposal",
        sub: `${c.added.length} added · ${c.removed.length} removed`,
        current: false,
      });
    });
    return out;
  }, [list, submitted, totalGuests]);

  const editorLink = { to: "/rooming-list/$bookingId" as const, params: { bookingId: booking.id } };

  return (
    <div className="min-h-screen" style={{ backgroundColor: PLATE }}>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] lg:block">
        <GlobalSidebar
          active="Rooming Lists"
          roomingBookingId={booking.id}
          displayName={displayName}
          initials={initials}
          email={session?.user.email ?? ""}
          onSignOut={() => void signOut()}
        />
      </aside>

      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[268px]">
            <GlobalSidebar
              active="Rooming Lists"
              roomingBookingId={booking.id}
              displayName={displayName}
              initials={initials}
              email={session?.user.email ?? ""}
              onSignOut={() => void signOut()}
            />
            <button
              aria-label="Close navigation"
              onClick={() => setNavOpen(false)}
              className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-md"
              style={{ color: HERO_TEXT }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pl-[240px]">
        <TopBar
          onOpenNav={() => setNavOpen(true)}
          left={
            <Link
              to="/bookings/$bookingId"
              params={{ bookingId: booking.id }}
              className="inline-flex items-center gap-2 text-[13px] transition-opacity hover:opacity-80"
              style={{ color: HERO_TEXT }}
            >
              <ArrowLeft size={15} />
              Back to booking
            </Link>
          }
        />

        {/* ══ compact header + folder tabs ══ */}
        <header className="relative isolate">
          <img
            src={booking.image}
            alt={`${booking.destination} landscape`}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "saturate(0.85) contrast(1.05)" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(9,20,29,0.78) 0%, rgba(9,20,29,0.66) 45%, rgba(12,26,37,0.92) 100%)",
            }}
          />
          <div className="relative px-5 pt-7 sm:px-9">
            <p className="flex items-center gap-1.5 text-[12.5px]" style={{ color: HERO_MUTED }}>
              <Link
                to="/bookings/$bookingId"
                params={{ bookingId: booking.id }}
                className="transition-opacity hover:opacity-80"
              >
                Booking workspace
              </Link>
              <ChevronRight size={13} />
              <span style={{ color: HERO_TEXT }}>{booking.name}</span>
            </p>
            <h1
              className="mt-1 truncate text-[30px] leading-[1.1] sm:text-[34px]"
              style={{ color: "#F7F4ED", fontFamily: SERIF, fontWeight: 400 }}
            >
              Rooming List
            </h1>
            <p className="mt-1 text-[13px]" style={{ color: HERO_MUTED }}>
              Manage, review and submit your rooming list
            </p>

            <nav className="mt-6 flex items-end gap-[6px] overflow-x-auto">
              {TABS.map((t) => {
                const isActive = t === "Rooming List";
                const cls =
                  "relative whitespace-nowrap rounded-t-[13px] px-5 pb-[13px] pt-[11px] text-[13px] transition-colors duration-200 flex items-center gap-2.5";
                const st: React.CSSProperties = isActive
                  ? {
                      background: "linear-gradient(180deg, #FFFDF8 0%, #F7F3EC 100%)",
                      color: TEXT,
                      fontWeight: 600,
                      boxShadow: "0 -6px 18px -12px rgba(58,44,20,0.45)",
                    }
                  : {
                      backgroundColor: "rgba(12,26,36,0.55)",
                      color: "rgba(226,233,239,0.78)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      borderBottom: "none",
                    };

                const inner = (
                  <>
                    <span style={{ color: isActive ? GOLD_MET_MID : "rgba(226,233,239,0.62)" }}>
                      {TAB_ICON[t]}
                    </span>
                    {t}
                  </>
                );
                if (t === "Overview") {
                  return (
                    <Link
                      key={t}
                      to="/bookings/$bookingId"
                      params={{ bookingId: booking.id }}
                      className={cls}
                      style={st}
                    >
                      {inner}
                    </Link>
                  );
                }
                return (
                  <span key={t} className={cls} style={st}>
                    {inner}
                  </span>
                );
              })}
            </nav>
          </div>
        </header>

        {/* ══ plate ══ */}
        <div
          className="relative min-h-[75vh] px-5 pb-14 pt-5 sm:px-9"
          style={{ background: PLATE_TEXTURE }}
        >
          {/* KPI strip */}
          <section
            className="grid gap-4 rounded-[18px] px-4 py-4 lg:grid-cols-[minmax(0,1fr)_248px]"
            style={{
              background: NAVY_PANEL,
              border: `1px solid ${NAVY_BORDER}`,
              boxShadow: `${NAVY_INNER}, 0 20px 44px -30px rgba(6,16,26,0.85)`,
            }}
          >
            <div className="grid gap-0 sm:grid-cols-2 xl:grid-cols-5">
              <Kpi label="Rooming list progress">
                <div className="flex items-center gap-3">
                  <Ring percent={percent} />
                  <span className="text-[12px]" style={{ color: ON_NAVY_2 }}>
                    {stats?.filled ?? 0} of {stats?.totalSlots ?? 0}
                    <br />
                    completed
                  </span>
                </div>
              </Kpi>

              <Kpi label="Deadline">
                <div className="flex items-center gap-3">
                  <CalendarDays size={20} style={{ color: GOLD_HI }} />
                  <span>
                    <span className="block text-[15px]" style={{ color: ON_NAVY }}>
                      {daysLeft === null ? "Not set" : `${Math.max(0, daysLeft)} days`}
                    </span>
                    <span className="text-[11.5px]" style={{ color: ON_NAVY_MUTED }}>
                      {dueISO ? `Due ${fmtDay(dueISO)}` : "No deadline yet"}
                    </span>
                  </span>
                </div>
              </Kpi>

              <Kpi label="Rooms & guests">
                <div className="flex items-center gap-3">
                  <Bed size={20} style={{ color: GOLD_HI }} />
                  <span>
                    <span className="block text-[15px]" style={{ color: ON_NAVY }}>
                      {active.length} rooms
                    </span>
                    <span className="text-[11.5px]" style={{ color: ON_NAVY_MUTED }}>
                      {totalGuests} guests
                    </span>
                  </span>
                </div>
              </Kpi>

              <Kpi label="Rooms status">
                <ul className="space-y-[3px] text-[11.5px]" style={{ color: ON_NAVY_2 }}>
                  <li className="flex items-center gap-2">
                    <Dot color="#5FBF87" /> {statusCounts.complete} Completed
                  </li>
                  <li className="flex items-center gap-2">
                    <Dot color="#E0A93F" /> {statusCounts.pending} Pending
                  </li>
                  <li className="flex items-center gap-2">
                    <Dot color="#D3766A" /> {statusCounts.missing} Missing
                  </li>
                </ul>
              </Kpi>

              <Kpi label="Last updated" last>
                <div className="flex items-center gap-3">
                  <Clock size={20} style={{ color: GOLD_HI }} />
                  <span>
                    <span className="block text-[13.5px]" style={{ color: ON_NAVY }}>
                      {fmtDateTime(list?.savedAt)}
                    </span>
                    <span className="text-[11.5px]" style={{ color: ON_NAVY_MUTED }}>
                      By {displayName || "you"}
                    </span>
                  </span>
                </div>
              </Kpi>
            </div>

            <div className="flex flex-col justify-center gap-2.5">
              <Link {...editorLink} className="hgb-gold-btn" style={goldBtn}>
                <Pencil size={14} /> Continue editing
              </Link>
              <Link {...editorLink} style={ghostBtn}>
                <Plus size={14} /> Create new version
              </Link>
            </div>
          </section>

          {/* main grid */}
          <div className="mt-4 grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
            {/* left column */}
            <div className="min-w-0 space-y-4">
              <Panel title="Rooming list versions">
                <div className="space-y-2.5">
                  {versions.map((v) => (
                    <Link
                      key={v.id}
                      {...editorLink}
                      className="flex items-center gap-3 rounded-[12px] px-3.5 py-3 transition-colors"
                      style={{
                        background: v.current
                          ? "linear-gradient(180deg, #FBF3DF 0%, #F7EFE0 100%)"
                          : "linear-gradient(180deg, #FFFDF8 0%, #FAF6EF 100%)",
                        border: `1px solid ${v.current ? "rgba(197,150,45,0.42)" : LINE_SOFT}`,
                        boxShadow: CARD_SHADOW,
                      }}
                    >
                      <FileText size={15} style={{ color: GOLD_SOFT }} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-[13px]" style={{ color: TEXT }}>
                            {v.label}
                          </span>
                          {v.current && (
                            <span
                              className="rounded-full px-2 py-[1px] text-[10px]"
                              style={{ backgroundColor: "rgba(79,138,98,0.14)", color: GREEN }}
                            >
                              Current
                            </span>
                          )}
                        </span>
                        <span className="block truncate text-[11.5px]" style={{ color: MUTED }}>
                          {v.note}
                        </span>
                        <span className="block text-[11.5px]" style={{ color: MUTED }}>
                          {v.sub}
                        </span>
                      </span>
                      <ChevronRight size={15} style={{ color: MUTED }} />
                    </Link>
                  ))}
                </div>
                <Link
                  {...editorLink}
                  className="mt-3 inline-block text-[12px] underline-offset-4 hover:underline"
                  style={{ color: GOLD_SOFT }}
                >
                  View all versions
                </Link>
              </Panel>

              <Panel title="Needs attention">
                {issues.length === 0 ? (
                  <p className="flex items-center gap-2 text-[12.5px]" style={{ color: GREEN }}>
                    <CheckCircle2 size={15} /> Nothing outstanding
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {issues.slice(0, 5).map((i) => (
                      <li key={i.id} className="flex gap-2.5">
                        <AlertTriangle size={14} className="mt-[2px] shrink-0" style={{ color: AMBER }} />
                        <span className="min-w-0">
                          <span className="block text-[12.5px]" style={{ color: TEXT_2 }}>
                            {i.title}
                          </span>
                          <span className="block text-[11.5px]" style={{ color: MUTED }}>
                            {i.detail}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                <Link
                  {...editorLink}
                  className="mt-3 inline-block text-[12px] underline-offset-4 hover:underline"
                  style={{ color: GOLD_SOFT }}
                >
                  Go to editor
                </Link>
              </Panel>

              <Panel title="Recent activity">
                <ul className="space-y-3">
                  {[
                    { label: "Rooming list saved", when: fmtDateTime(list?.savedAt) },
                    ...(submitted
                      ? [{ label: "Submitted to hotel", when: fmtDateTime(list?.submittedAt) }]
                      : []),
                    { label: "Rooms confirmed by hotel", when: fmtDay(booking.startDate) },
                  ].map((a) => (
                    <li key={a.label} className="flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2.5 text-[12.5px]" style={{ color: TEXT_2 }}>
                        <CheckCircle2 size={14} style={{ color: GOLD_SOFT }} />
                        <span className="truncate">{a.label}</span>
                      </span>
                      <span className="shrink-0 text-[11.5px]" style={{ color: MUTED }}>
                        {a.when}
                      </span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>

            {/* centre column */}
            <div className="min-w-0 space-y-4">
              <Panel title="Room overview" right={`${active.length} rooms`}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {byType.map((t) => (
                    <div
                      key={t.value}
                      className="rounded-[12px] px-4 py-3.5"
                      style={{
                        background: "linear-gradient(180deg, #FFFDF8 0%, #FAF6EF 100%)",
                        border: `1px solid ${LINE_SOFT}`,
                        boxShadow: CARD_SHADOW,
                      }}
                    >
                      <span className="flex items-center gap-2.5">
                        <Bed size={17} style={{ color: GOLD_SOFT }} />
                        <span className="text-[13px]" style={{ color: TEXT }}>
                          {t.label}
                        </span>
                      </span>
                      <p className="mt-2 text-[11.5px]" style={{ color: MUTED }}>
                        {t.rooms} rooms
                        <br />
                        {t.guests} guests
                      </p>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Rooming list preview" action={<span className="text-[11.5px]" style={{ color: GOLD_SOFT }}>View full preview</span>}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {previewGroups.map((g) => (
                    <div
                      key={g.label}
                      className="rounded-[12px] px-4 py-3.5"
                      style={{
                        background: "linear-gradient(180deg, #FFFDF8 0%, #FAF6EF 100%)",
                        border: `1px solid ${LINE_SOFT}`,
                        boxShadow: CARD_SHADOW,
                      }}
                    >
                      <p className="text-[12.5px] font-semibold" style={{ color: TEXT }}>
                        {g.label}{" "}
                        <span className="font-normal" style={{ color: MUTED }}>
                          ({g.rooms.length} rooms)
                        </span>
                      </p>
                      <ol className="mt-2 space-y-1 text-[12px]" style={{ color: TEXT_2 }}>
                        {g.names.slice(0, 6).map((n, i) => (
                          <li key={`${n}-${i}`} className="truncate">
                            {i + 1}. {n}
                          </li>
                        ))}
                      </ol>
                      {g.names.length > 6 && (
                        <p className="mt-1.5 text-[11.5px]" style={{ color: MUTED }}>
                          … and {g.names.length - 6} more
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Link {...editorLink} style={{ ...goldBtn, minWidth: 260 }}>
                    Open full editor <ArrowRight size={15} />
                  </Link>
                </div>
              </Panel>
            </div>

            {/* right column */}
            <div className="min-w-0 space-y-4">
              <Panel title="Rooming list summary">
                <dl className="space-y-2.5 text-[12.5px]">
                  <SummaryRow label="Total rooms" value={String(active.length)} />
                  <SummaryRow label="Total guests" value={String(totalGuests)} />
                  <SummaryRow label="Average occupancy" value={avgOccupancy} />
                </dl>

                <p className="mt-5 text-[10.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
                  Country of origin
                </p>
                <ul className="mt-2.5 space-y-2 text-[12.5px]">
                  {countries.length === 0 && (
                    <li style={{ color: MUTED }}>No countries captured yet</li>
                  )}
                  {countries.map(([label, count]) => (
                    <li key={label} className="flex items-center justify-between gap-3">
                      <span className="flex min-w-0 items-center gap-2" style={{ color: TEXT_2 }}>
                        <span>{flagOf(label)}</span>
                        <span className="truncate">{label}</span>
                      </span>
                      <span style={{ color: TEXT }}>{count}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  {...editorLink}
                  className="mt-3 inline-block text-[12px] underline-offset-4 hover:underline"
                  style={{ color: GOLD_SOFT }}
                >
                  Edit country information
                </Link>
              </Panel>

              <Panel title="Timeline">
                <ol className="space-y-3.5">
                  {[
                    { label: "Template downloaded", done: true, when: fmtDay(booking.startDate) },
                    { label: "Editing in progress", done: !submitted, when: fmtDateTime(list?.savedAt) },
                    { label: "Ready for submission", done: percent === 100, when: dueISO ? fmtDay(dueISO) : "—" },
                    { label: "Submitted to hotel", done: submitted, when: submitted ? fmtDateTime(list?.submittedAt) : "" },
                    { label: "Confirmed by hotel", done: false, when: "" },
                  ].map((s) => (
                    <li key={s.label} className="flex gap-3">
                      <span
                        className="mt-[2px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full"
                        style={{
                          border: `1px solid ${s.done ? GREEN : "rgba(123,136,150,0.35)"}`,
                          backgroundColor: s.done ? "rgba(79,138,98,0.16)" : "transparent",
                          color: GREEN,
                        }}
                      >
                        {s.done && <Check size={11} />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12.5px]" style={{ color: s.done ? TEXT : TEXT_2 }}>
                          {s.label}
                        </span>
                        {s.when && (
                          <span className="block text-[11.5px]" style={{ color: MUTED }}>
                            {s.when}
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ol>
              </Panel>

              <Panel title="Guests">
                <p className="flex items-center gap-2.5 text-[12.5px]" style={{ color: TEXT_2 }}>
                  <Users size={15} style={{ color: GOLD_SOFT }} />
                  {totalGuests} named · {stats?.missing ?? 0} still missing
                </p>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── small pieces ───────────────────────────────────── */

const goldBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  borderRadius: 12,
  padding: "11px 18px",
  fontSize: 13.5,
  fontWeight: 600,
  color: "#22190A",
  background: GOLD_BAR,
  border: `1px solid ${GOLD_MET}`,
  boxShadow: "0 10px 24px -16px rgba(212,175,55,0.8)",
};

const ghostBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  borderRadius: 12,
  padding: "11px 18px",
  fontSize: 13.5,
  color: "#6E5518",
  border: `1px solid rgba(169,133,47,0.42)`,
  backgroundColor: "rgba(212,175,55,0.08)",
};

function Kpi({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-[14px] px-4 py-3.5"
      style={{
        background: "linear-gradient(180deg, #FFFDF8 0%, #FBF7F0 100%)",
        border: `1px solid ${LINE}`,
        boxShadow: CARD_SHADOW,
      }}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: MUTED }}>
        {label}
      </p>
      <div className="mt-2.5">{children}</div>
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="h-[7px] w-[7px] rounded-full" style={{ backgroundColor: color }} />;
}

function Ring({ percent }: { percent: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative grid h-[56px] w-[56px] place-items-center">
      <svg width="56" height="56" className="absolute inset-0 -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(158,136,100,0.22)" strokeWidth="4" />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke={GOLD_MET}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${(c * percent) / 100} ${c}`}
        />
      </svg>
      <span className="text-[13px] font-semibold" style={{ color: TEXT }}>
        {percent}%
      </span>
    </span>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b pb-2" style={{ borderColor: LINE_SOFT }}>
      <dt style={{ color: MUTED }}>{label}</dt>
      <dd style={{ color: TEXT }}>{value}</dd>
    </div>
  );
}

function Panel({
  title,
  right,
  action,
  children,
}: {
  title: string;
  right?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className="overflow-hidden rounded-[16px]"
      style={{
        backgroundColor: INK,
        border: `1px solid ${LINE}`,
        boxShadow: CARD_SHADOW,
      }}
    >
      <div
        className="flex items-center justify-between gap-4 px-5 py-3"
        style={{ backgroundColor: "transparent", borderBottom: `1px solid ${LINE_SOFT}` }}
      >
        <h3
          className="text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: TEXT }}
        >
          {title}
        </h3>
        {action ?? (right ? <span className="text-[11.5px]" style={{ color: MUTED }}>{right}</span> : null)}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}
