import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bed,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock,
  Download,
  FileSpreadsheet,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";
import { SERIF, SidebarContent, TopBarLight } from "@/components/DashboardChrome";
import { FloatingPopover } from "@/components/FloatingPopover";

import { BOOKINGS, type Booking } from "@/lib/bookings";
import {
  ALLERGY_TAGS,
  DIETARY_TAGS,
  NATIONALITIES,
  ROOM_REQUEST_OPTIONS,
  ROOM_TYPES,
  type Allocation,
  type Guest,
  type RoomType,
  type RoomingIssue,
  type RoomingList,
  allocationStatus,
  capacityOf,
  distributionFor,
  guestName,
  isAllergy,
  isNamed,
  labelOf,
  loadRoomingList,
  newGuest,
  roomingIssues,
  saveRoomingList,
  statsOf,
} from "@/lib/rooming";

export const Route = createFileRoute("/rooming-list/$bookingId")({
  component: RoomingListRoute,
  head: () => ({
    meta: [
      { title: "Rooming List — HotelGroupBook" },
      {
        name: "description",
        content:
          "Assign your guests to the confirmed room allocations for your group stay, add dietary needs and room requests, then submit a hotel-ready rooming list.",
      },
      { property: "og:title", content: "Rooming List — HotelGroupBook" },
      {
        property: "og:description",
        content: "Your room structure is already prepared — simply assign your guests.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

/* Deep matte navy workspace tokens (names kept so existing markup keeps working) */
const BG_ALT = "#E9EEF2";
const CARD = "#1D456C";
const SURFACE_2 = "#22507C";
const CARD_BORDER = "rgba(255,255,255,0.10)";
const CARD_SHADOW = "0 8px 30px rgba(8,20,34,0.28)";
const BORDER = "rgba(255,255,255,0.12)";
const TEXT = "#F7F7F5"; // primary — soft off-white
const TEXT_2 = "#D9DDE0"; // secondary — light neutral grey
const MUTED = "#B8BDC2"; // micro labels / eyebrows — muted neutral grey
const GOLD = "#C5A24B";
const GOLD_SOFT = "#C5A24B";
const GOLD_DEEP = "rgba(197,162,75,0.34)";
const GREEN = "#74D97C";
const AMBER = "#C5A24B";
const ROW = "rgba(255,255,255,0.07)";
const PANEL = "#1D456C";
const NAVY = "#1D456C";

/* light input-field tokens used inside the navy Guest Details panel */
const FIELD_BG = "#EEF2F6"; // soft cool off-white / very light blue-grey
const FIELD_BORDER_LIGHT = "#CBD8E3"; // very subtle cool blue-grey
const FIELD_TEXT = "#10233F"; // dark navy entered text
const FIELD_PLACEHOLDER = "#88A0B6"; // muted blue-grey placeholder
const FIELD_LABEL = "#7C93A8"; // muted blue-grey label

/* dark matte navy room-allocation card tokens */
const CARD_NAVY = "linear-gradient(180deg, #1D456C 0%, #173A5D 100%)";
const CARD_NAVY_HOVER = "linear-gradient(180deg, #214C76 0%, #1A4165 100%)";
const RT = "#F7F7F5"; // primary — soft off-white (matches TEXT)
const RT_2 = "#D9DDE0"; // secondary — light neutral grey
const RT_3 = "#B8BDC2"; // micro — muted neutral grey
const R_BORDER = "rgba(255,255,255,0.09)";
const R_GREEN = "#74D97C";
const R_AMBER = "#C5A24B";

const GOLD_BAR = "#C5A24B";
const HERO_INK = "#10233F";
const HERO_INK_2 = "#4A6076";
const HERO_ACCENT = "#2C5B8C";
const COLS = "14% 42% 21% 19% 4%";


/* ───────────────── primitives ───────────────── */

function GoldButton({
  children,
  onClick,
  small,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  small?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-[8px] font-medium text-white transition-[filter,transform] duration-200 ease-out hover:-translate-y-px hover:brightness-[1.12] active:translate-y-0 disabled:opacity-50 ${
        small ? "px-3 py-[6px] text-[12px]" : "px-4 py-[8px] text-[12.5px]"
      }`}
      style={{
        backgroundColor: NAVY,
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 2px 8px rgba(20,45,70,0.16)",
      }}

    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  small,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-[8px] font-medium transition-colors duration-200 ease-out hover:bg-[rgba(255,255,255,0.10)] ${
        small ? "px-3 py-[6px] text-[12px]" : "px-4 py-[8px] text-[12.5px]"
      }`}
      style={{ color: TEXT, backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid rgba(90,115,140,0.22)` }}

    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block rounded-[8px] px-3 py-[7px]" style={{ backgroundColor: FIELD_BG, border: `1px solid ${FIELD_BORDER_LIGHT}` }}>
      <span className="block text-[10px] uppercase tracking-[0.14em]" style={{ color: FIELD_LABEL }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-[2px] w-full bg-transparent text-[13.5px] outline-none placeholder:text-[#88A0B6]"
        style={{ color: FIELD_TEXT }}
      />
    </label>
  );
}

/* ───────────────── route ───────────────── */

function RoomingListRoute() {
  const { bookingId } = Route.useParams();
  const booking = BOOKINGS.find((b) => b.id === bookingId || b.reference === bookingId);
  if (!booking) throw notFound();
  return <RoomingWorkspace booking={booking} />;
}

type ViewFilter = "all" | "missing" | "complete";

function RoomingWorkspace({ booking }: { booking: Booking }) {
  const [navOpen, setNavOpen] = useState(false);
  const [list, setList] = useState<RoomingList | null>(null);
  const [view, setView] = useState<ViewFilter>("all");
  const [query, setQuery] = useState("");
  const [openGuest, setOpenGuest] = useState<{ allocationId: string | null; guestId: string } | null>(null);
  const [pendingGuest, setPendingGuest] = useState<{ allocationId: string | null; guest: Guest } | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [focusAllocation, setFocusAllocation] = useState<string | null>(null);
  const [savedLabel, setSavedLabel] = useState("Just now");
  const firstRender = useRef(true);

  /* allocations are generated from the confirmed booking room distribution */
  useEffect(() => {
    setList(loadRoomingList(booking.id, distributionFor(booking.id, booking.rooms ?? 12)));
  }, [booking.id, booking.rooms]);

  /* autosave */
  useEffect(() => {
    if (!list) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      saveRoomingList({ ...list, savedAt: new Date().toISOString() });
      setSavedLabel("Just now");
    }, 400);
    return () => clearTimeout(t);
  }, [list]);

  const update = useCallback((fn: (l: RoomingList) => RoomingList) => {
    setList((cur) => (cur ? fn(cur) : cur));
  }, []);

  const patchAllocation = useCallback(
    (id: string, fn: (a: Allocation) => Allocation) =>
      update((l) => ({ ...l, allocations: l.allocations.map((a) => (a.id === id ? fn(a) : a)) })),
    [update],
  );

  const stats = useMemo(() => (list ? statsOf(list) : null), [list]);
  const locked = Boolean(list?.submittedAt);

  const visible = useMemo(() => {
    if (!list) return [];
    const q = query.trim().toLowerCase();
    return list.allocations.filter((a) => {
      const status = allocationStatus(a);
      if (view === "complete" && status !== "complete") return false;
      if (view === "missing" && status === "complete") return false;
      if (q) {
        const hay = [
          ...a.guests.map(guestName),
          labelOf(a.type),
          String(a.index).padStart(2, "0"),
          ...a.requests,
        ]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [list, view, query]);

  const drawerGuest = useMemo(() => {
    if (!list) return null;
    if (pendingGuest) {
      const alloc = pendingGuest.allocationId
        ? (list.allocations.find((a) => a.id === pendingGuest.allocationId) ?? null)
        : null;
      return { alloc, guest: pendingGuest.guest, isNew: true };
    }
    if (!openGuest) return null;
    if (!openGuest.allocationId) {
      const guest = list.unassigned.find((g) => g.id === openGuest.guestId);
      return guest ? { alloc: null, guest, isNew: false } : null;
    }
    const alloc = list.allocations.find((a) => a.id === openGuest.allocationId);
    const guest = alloc?.guests.find((g) => g.id === openGuest.guestId);
    return alloc && guest ? { alloc, guest, isNew: false } : null;
  }, [list, openGuest, pendingGuest]);

  const issues = useMemo(() => (list ? roomingIssues(list) : []), [list]);

  if (!list || !stats) {
    return <div className="min-h-screen" style={{ backgroundColor: BG_ALT }} />;
  }

  const nights = booking.nights;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#E9EEF2",
      }}
    >
      <style>{`@keyframes hgbFade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
      @keyframes hgbSlide{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}
      .hgb-row{transition:transform 170ms ease,box-shadow 170ms ease,background 170ms ease,border-color 170ms ease}
      .hgb-row:hover{background:${CARD_NAVY_HOVER} !important;transform:translateY(-1px);box-shadow:0 8px 20px rgba(16,35,63,0.16) !important}
      .hgb-row:hover .hgb-menu,.hgb-row:hover .hgb-req{opacity:1}
      .hgb-cell{border-top:1px solid rgba(255,255,255,0.05)}
      @media(min-width:1024px){.hgb-cell{border-top:none;border-left:none}}
      .hgb-search::placeholder{color:#B8BDC2}`}</style>

      <aside className="fixed inset-y-0 left-0 hidden w-[244px] lg:block">
        <SidebarContent light active="Rooming List" bookingId={booking.id} />
      </aside>

      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close navigation" className="absolute inset-0 bg-black/40" onClick={() => setNavOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[268px]">
            <SidebarContent light active="Rooming List" bookingId={booking.id} />
          </div>
        </div>
      )}

      <div className="lg:pl-[244px]">
        <TopBarLight
          onOpenNav={() => setNavOpen(true)}

          left={
            <Link
              to="/bookings/$bookingId"
              params={{ bookingId: booking.id }}
              className="inline-flex items-center gap-2 text-[13.5px] font-medium transition-opacity hover:opacity-80"
              style={{ color: HERO_ACCENT }}
            >
              <ArrowLeft size={16} />
              Back to Overview
            </Link>
          }
        />

        <div className="mx-auto flex w-full max-w-[1560px] items-start gap-4 px-4 pb-5 pt-2.5 sm:px-6 lg:px-7">
          <main className="min-w-0 flex-1">

            {/* ── compact booking hero ── */}
            <section className="relative overflow-hidden rounded-[12px]">
              <div className="relative px-1 py-1">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-[5px] px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.18em]"
                    style={{ color: HERO_INK_2, backgroundColor: "rgba(128,154,180,0.22)" }}
                  >
                    {booking.type === "leisure" ? "Leisure" : "M&E"}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-[5px] px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.18em]"
                    style={
                      locked
                        ? { color: GREEN, backgroundColor: "rgba(62,155,87,0.12)" }
                        : { color: AMBER, backgroundColor: "rgba(176,128,15,0.12)" }
                    }
                  >
                    {locked ? (
                      <>
                        <CheckCircle2 size={11} /> Submitted{" "}
                        {new Date(list.submittedAt as string).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </>
                    ) : (
                      "Draft"
                    )}
                  </span>
                </span>


                <h1 className="mt-1.5 text-[26px] font-semibold leading-[1.06] tracking-[-0.01em]" style={{ color: HERO_INK }}>
                  {booking.name}
                </h1>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px]" style={{ color: HERO_INK_2 }}>
                  {booking.hotel && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={13} style={{ color: HERO_ACCENT }} />
                      {booking.hotel}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={13} style={{ color: HERO_ACCENT }} />
                    {new Date(booking.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} –{" "}
                    {new Date(booking.endDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock size={13} style={{ color: HERO_ACCENT }} />
                    {nights} nights
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Bed size={13} style={{ color: HERO_ACCENT }} />
                    {stats.totalAllocations} rooms
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users size={13} style={{ color: HERO_ACCENT }} />
                    {stats.totalSlots} guests
                  </span>
                </div>
              </div>
            </section>

            {/* ── workspace ── */}
            {/* ── summary card ── */}
            <section
              className="mt-2 overflow-visible rounded-[13px]"
              style={{ backgroundColor: PANEL, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
            >

              {locked ? (
                <SubmittedBanner list={list} stats={stats} onRequestChange={() => setShowReview(true)} />
              ) : (
                <>
                  {/* header */}
                  <div className="flex flex-wrap items-center gap-x-7 gap-y-3 px-5 pb-2.5 pt-3.5">
                    <div className="min-w-[220px]">
                      <h2 className="text-[19.5px] font-semibold leading-none" style={{ color: TEXT }}>
                        Rooming List
                      </h2>
                      <p className="mt-1.5 text-[12.5px]" style={{ color: TEXT_2 }}>
                        Add guest details for each room allocation.
                      </p>
                    </div>

                    <div className="min-w-[240px] flex-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[13px]" style={{ color: TEXT_2 }}>
                          {stats.filled} / {stats.totalSlots} guests added
                        </span>
                        <span className="text-[13px] font-medium" style={{ color: GOLD_SOFT }}>
                          {stats.percent}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-[5px] w-full overflow-hidden rounded-full" style={{ backgroundColor: "#CBD7E2" }}>
                        <div
                          className="h-full rounded-full transition-[width] duration-300 ease-out"
                          style={{ width: `${stats.percent}%`, background: GOLD_BAR }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <GhostButton onClick={() => setShowImport(true)}>
                        <Upload size={14} />
                        Import file
                      </GhostButton>
                      <GoldButton
                        onClick={() => {
                          const target = list.allocations.find((a) => a.guests.filter(isNamed).length < capacityOf(a.type, a.occupancy));
                          if (target) setFocusAllocation(target.id);
                        }}
                      >
                        <Plus size={14} />
                        Add guest
                      </GoldButton>
                    </div>
                  </div>

                  {/* allocation summary strip + filters */}
                  <div
                    className="flex flex-wrap items-center gap-x-3 gap-y-2.5 px-5 pb-3.5"
                  >

                    <div
                      className="flex items-stretch overflow-hidden rounded-[9px]"
                      style={{ backgroundColor: ROW, border: `1px solid ${BORDER}` }}
                    >
                      {stats.byType.map((t, i) => (
                        <div
                          key={t.type}
                          className="px-[15px] py-[7px] text-center"
                          style={{ borderLeft: i ? `1px solid ${BORDER}` : undefined }}
                        >
                          <p className="text-[16.5px] font-semibold leading-none" style={{ color: TEXT }}>
                            {t.count}
                          </p>
                          <p className="mt-1 text-[10.5px] uppercase tracking-[0.12em]" style={{ color: MUTED }}>
                            {t.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div
                      className="flex items-stretch overflow-hidden rounded-[9px]"
                      style={{ backgroundColor: ROW, border: `1px solid ${BORDER}` }}
                    >
                      <div className="px-[15px] py-[7px] text-center">
                        <p className="text-[16.5px] font-semibold leading-none" style={{ color: AMBER }}>
                          {stats.missing}
                        </p>
                        <p className="mt-1 text-[10.5px] uppercase tracking-[0.12em]" style={{ color: MUTED }}>
                          Missing guests
                        </p>
                      </div>
                      <div className="px-[15px] py-[7px] text-center" style={{ borderLeft: `1px solid ${BORDER}` }}>
                        <p className="text-[16.5px] font-semibold leading-none" style={{ color: GREEN }}>
                          {stats.completeAllocations}
                        </p>
                        <p className="mt-1 text-[10.5px] uppercase tracking-[0.12em]" style={{ color: MUTED }}>
                          Complete
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowGroup(true)}
                      className="inline-flex items-center gap-2 rounded-[7px] px-3 py-[7px] text-[12px] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                      style={{ color: GOLD_SOFT, border: `1px solid ${BORDER}` }}
                    >
                      Group requests
                      {list.groupRequests.length > 0 && (
                        <span
                          className="rounded-full px-1.5 text-[10.5px]"
                          style={{ backgroundColor: "rgba(40,93,145,0.14)", color: GOLD }}
                        >
                          {list.groupRequests.length}
                        </span>
                      )}
                    </button>

                    <div className="ml-auto flex flex-wrap items-center gap-3">
                      <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                        View
                      </span>
                      <div className="flex rounded-[8px] p-[3px]" style={{ backgroundColor: ROW, border: `1px solid ${BORDER}` }}>
                        {(["all", "missing", "complete"] as ViewFilter[]).map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setView(v)}
                            className="rounded-[6px] px-3 py-[5px] text-[12px] capitalize transition-colors"
                            style={
                              view === v
                                ? { color: GOLD, backgroundColor: SURFACE_2, border: `1px solid ${GOLD_DEEP}`, boxShadow: "0 1px 4px rgba(20,45,70,0.10)" }
                                : { color: TEXT_2, border: "1px solid transparent" }
                            }
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                      <label
                        className="flex items-center gap-2 rounded-[8px] px-3 py-[6px]"
                        style={{ backgroundColor: ROW, border: `1px solid ${BORDER}` }}
                      >
                        <input
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Search guests..."
                          className="hgb-search w-[150px] bg-transparent text-[12.5px] outline-none"
                          style={{ color: TEXT }}
                        />
                        <Search size={14} style={{ color: MUTED }} />
                      </label>
                    </div>
                  </div>
                </>
              )}

            </section>

            {/* ── unassigned guests ── */}
            <UnassignedPanel
              guests={list.unassigned}
              allocations={list.allocations}
              locked={locked}
              onOpenGuest={(guestId) => setOpenGuest({ allocationId: null, guestId })}
              onAdd={(first, last) =>
                update((l) => ({
                  ...l,
                  unassigned: [...l.unassigned, newGuest({ firstName: first, lastName: last })],
                }))
              }
              onRemove={(guestId) =>
                update((l) => ({ ...l, unassigned: l.unassigned.filter((g) => g.id !== guestId) }))
              }
              onAssign={(guestId, allocationId) =>
                update((l) => {
                  const guest = l.unassigned.find((g) => g.id === guestId);
                  if (!guest) return l;
                  return {
                    ...l,
                    unassigned: l.unassigned.filter((g) => g.id !== guestId),
                    allocations: l.allocations.map((a) =>
                      a.id === allocationId ? { ...a, guests: [...a.guests, guest] } : a,
                    ),
                  };
                })
              }
            />

            {/* column headers */}
            <div
              className="hidden px-1 pb-1 pt-3 text-[10.5px] uppercase tracking-[0.16em] lg:grid"
              style={{ color: HERO_INK_2, gridTemplateColumns: COLS }}
            >
              <span className="px-3.5">Allocation</span>
              <span className="px-3.5">Guests</span>
              <span className="px-3.5">Room request</span>
              <span className="px-3.5">Status</span>
              <span />
            </div>

            {/* allocation cards */}
            <div className="space-y-2">
                {visible.map((a) => (
                  <AllocationRow
                    key={a.id}
                    allocation={a}
                    locked={locked}
                    autoFocus={focusAllocation === a.id}
                    onAutoFocused={() => setFocusAllocation(null)}
                    onPatch={(fn) => patchAllocation(a.id, fn)}
                    onOpenGuest={(guestId) => {
                      setPendingGuest(null);
                      setOpenGuest({ allocationId: a.id, guestId });
                    }}
                    onAddGuest={() => {
                      setOpenGuest(null);
                      setPendingGuest({ allocationId: a.id, guest: newGuest() });
                    }}
                  />
                ))}
                {visible.length === 0 && (
                  <p className="px-2 py-8 text-center text-[13px]" style={{ color: MUTED }}>
                    No allocations match this filter.
                  </p>
                )}
              </div>

            {/* sticky action bar */}
            <div
              className="sticky bottom-3 z-20 mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[12px] px-4 py-2.5"
              style={{ backgroundColor: "rgba(29,69,108,0.94)", border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, backdropFilter: "blur(8px)" }}
            >
                <span className="inline-flex items-center gap-2 text-[12.5px]" style={{ color: TEXT_2 }}>
                  <CheckCircle2 size={15} style={{ color: GREEN }} />
                  <span>
                    All changes saved
                    <span className="ml-2 text-[11.5px]" style={{ color: MUTED }}>
                      {savedLabel}
                    </span>
                  </span>
                </span>

                <span className="text-[12.5px]" style={{ color: TEXT }}>
                  {stats.filled} / {stats.totalSlots} guests added
                  <span className="ml-2 text-[11.5px]" style={{ color: MUTED }}>
                    {stats.percent}% · {stats.missing} guest{stats.missing === 1 ? "" : "s"} missing
                  </span>
                </span>

                <div className="ml-auto flex items-center gap-2.5">
                  {issues.length > 0 && (
                    <GhostButton onClick={() => setShowReview(true)}>Review issues ({issues.length})</GhostButton>
                  )}
                  <GoldButton onClick={() => setShowReview(true)}>
                    {locked ? "Request change" : "Review & Submit"}
                  </GoldButton>
                </div>
            </div>
          </main>

          {drawerGuest && (
            <GuestDrawer
              key={drawerGuest.guest.id}
              allocation={drawerGuest.alloc}
              guest={drawerGuest.guest}
              locked={locked}
              isNew={drawerGuest.isNew}
              onClose={() => {
                setOpenGuest(null);
                setPendingGuest(null);
              }}
              onSave={(g) => {
                if (drawerGuest.isNew) {
                  if (drawerGuest.alloc) {
                    patchAllocation(drawerGuest.alloc.id, (a) => ({ ...a, guests: [...a.guests, g] }));
                  } else {
                    update((l) => ({ ...l, unassigned: [...l.unassigned, g] }));
                  }
                  setPendingGuest(null);
                  setOpenGuest(drawerGuest.alloc ? { allocationId: drawerGuest.alloc.id, guestId: g.id } : null);
                  return;
                }
                if (drawerGuest.alloc) {
                  patchAllocation(drawerGuest.alloc.id, (a) => ({
                    ...a,
                    guests: a.guests.map((x) => (x.id === g.id ? g : x)),
                  }));
                } else {
                  update((l) => ({ ...l, unassigned: l.unassigned.map((x) => (x.id === g.id ? g : x)) }));
                }
              }}
              onRemove={() => {
                if (drawerGuest.alloc) {
                  patchAllocation(drawerGuest.alloc.id, (a) => ({
                    ...a,
                    guests: a.guests.filter((x) => x.id !== drawerGuest.guest.id),
                  }));
                } else {
                  update((l) => ({ ...l, unassigned: l.unassigned.filter((x) => x.id !== drawerGuest.guest.id) }));
                }
                setOpenGuest(null);
              }}
            />
          )}

        </div>
      </div>

      {showGroup && (
        <GroupRequestsModal
          requests={list.groupRequests}
          locked={locked}
          onClose={() => setShowGroup(false)}
          onChange={(requests) => update((l) => ({ ...l, groupRequests: requests }))}
        />
      )}

      {showImport && <ImportModal onClose={() => setShowImport(false)} />}

      {showReview && (
        <ReviewModal
          list={list}
          stats={stats}
          issues={issues}
          onClose={() => setShowReview(false)}
          onFix={(id) => {
            setShowReview(false);
            setView("all");
            setQuery("");
            setFocusAllocation(id);
            document.getElementById(`alloc-${id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
          }}
          onSubmit={() => {
            update((l) => ({ ...l, submittedAt: new Date().toISOString() }));
            setShowReview(false);
          }}
        />
      )}
    </div>
  );
}


/* ───────────────── allocation row ───────────────── */


function AllocationRow({
  allocation,
  locked,
  active,
  autoFocus,
  onAutoFocused,
  onPatch,
  onOpenGuest,
  onAddGuest,
}: {
  allocation: Allocation;
  locked: boolean;
  active?: boolean;
  autoFocus?: boolean;
  onAutoFocused?: () => void;
  onPatch: (fn: (a: Allocation) => Allocation) => void;
  onOpenGuest: (guestId: string) => void;
  onAddGuest: () => void;
}) {

  const cap = capacityOf(allocation.type, allocation.occupancy);
  const named = allocation.guests.filter(isNamed);
  const status = allocationStatus(allocation);
  const [typeOpen, setTypeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [approval, setApproval] = useState(false);
  const typeBtnRef = useRef<HTMLButtonElement>(null);
  const requestBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (autoFocus) onAutoFocused?.();
  }, [autoFocus, onAutoFocused]);


  const changeType = (t: RoomType) => {
    setTypeOpen(false);
    const nextCap = capacityOf(t);
    if (nextCap < cap || t === "triple") setApproval(true);
    onPatch((a) => ({ ...a, type: t, guests: a.guests.slice(0, Math.max(nextCap, a.guests.length)) }));
  };

  const statusColor = status === "complete" ? R_GREEN : status === "attention" ? R_AMBER : RT_3;
  const statusLabel =
    status === "complete"
      ? "Complete"
      : named.length === 0
        ? cap > 1
          ? "Missing guests"
          : "Missing guest"
        : cap - named.length > 1
          ? "Missing guests"
          : "Missing guest";

  const isActive = !!active || typeOpen || menuOpen || requestOpen;

  return (
    <div
      id={`alloc-${allocation.id}`}
      className="hgb-row grid rounded-[12px] lg:[grid-template-columns:14%_42%_21%_19%_4%]"
      style={{
        background: CARD_NAVY,
        border: isActive ? "1.5px solid #C5A24B" : "1px solid rgba(255,255,255,0.07)",
        boxShadow: isActive
          ? "0 8px 22px rgba(16,35,63,0.18)"
          : "0 4px 14px rgba(16,35,63,0.12)",
      }}
    >


      {/* ── ALLOCATION ── */}
      <div className="flex flex-col justify-center px-3.5 py-2">
        <p className="text-[19px] font-semibold leading-none tracking-[-0.01em]" style={{ color: RT }}>
          {String(allocation.index).padStart(2, "0")}
        </p>
        <div className="relative mt-1.5">
          <button
            ref={typeBtnRef}
            type="button"
            disabled={locked}
            onClick={() => setTypeOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[12.5px] transition-colors hover:text-white"
            style={{ color: RT_2 }}
          >
            <Bed size={13} style={{ color: RT_3 }} />
            {labelOf(allocation.type)}
            {!locked && <ChevronDown size={13} style={{ color: RT_3 }} />}
          </button>
          <FloatingPopover anchorRef={typeBtnRef} open={typeOpen} onClose={() => setTypeOpen(false)} width={190}>
            {ROOM_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => changeType(t.value)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.07)]"
                style={{ color: t.value === allocation.type ? "#F7F7F5" : "#D9DDE0" }}
              >
                <span>{t.label}</span>
                <span className="text-[10.5px]" style={{ color: "#B8BDC2" }}>
                  {t.capacity} guest{t.capacity > 1 ? "s" : ""}
                </span>
              </button>
            ))}
          </FloatingPopover>

        </div>
        {approval && (
          <div
            className="mt-2 rounded-[7px] px-2 py-1.5"
            style={{ backgroundColor: "rgba(231,180,75,0.10)", border: "1px solid rgba(231,180,75,0.28)" }}
          >
            <p className="text-[10.5px] leading-snug" style={{ color: R_AMBER }}>
              Booking change may require approval
            </p>
            <button type="button" className="mt-1 text-[10.5px]" style={{ color: R_AMBER }} onClick={() => setApproval(false)}>
              Request change →
            </button>
          </div>
        )}
      </div>

      {/* ── GUESTS ── */}
      <div className="hgb-cell flex flex-col justify-center gap-[3px] px-3.5 py-2">
        {allocation.guests.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => onOpenGuest(g.id)}
            className="flex w-full items-center gap-2 rounded-[6px] px-1.5 py-[2px] text-left transition-colors hover:bg-[rgba(255,255,255,0.06)]"
          >
            <User size={13} style={{ color: RT_3 }} />
            <span className="min-w-0 max-w-[62%] truncate text-[13.5px]" style={{ color: RT }}>
              {guestName(g) || "Unnamed guest"}
            </span>
            {g.nationality && (
              <span className="inline-flex shrink-0 items-center text-[12px]" style={{ color: RT_2 }}>
                {g.nationality}
              </span>
            )}
          </button>
        ))}

        {!locked &&
          Array.from({ length: Math.max(0, cap - allocation.guests.length) }).map((_, i) => (
            <button
              key={`slot-${allocation.id}-${allocation.guests.length + i}`}
              type="button"
              onClick={onAddGuest}
              className="flex w-fit items-center gap-1.5 rounded-[6px] px-1.5 py-[2px] text-left text-[12.5px] opacity-80 transition-opacity hover:opacity-100"
              style={{ color: "#C5A24B" }}
            >
              <span className="text-[13px] leading-none">+</span>
              <span>Add guest</span>
            </button>
          ))}


      </div>

      {/* ── ROOM REQUEST ── */}
      <div className="hgb-cell relative flex flex-col justify-center px-3.5 py-2">
        {allocation.requests.length > 0 ? (
          <div className="space-y-[3px]">
            {allocation.requests.map((r) => (
              <span key={r} className="group/req flex items-center gap-1.5 text-[12.5px]" style={{ color: RT_2 }}>
                {r}
                {!locked && (
                  <button
                    type="button"
                    aria-label={`Remove ${r}`}
                    onClick={() => onPatch((a) => ({ ...a, requests: a.requests.filter((x) => x !== r) }))}
                    className="opacity-0 transition-opacity group-hover/req:opacity-100"
                    style={{ color: RT_3 }}
                  >
                    <X size={11} />
                  </button>
                )}
              </span>
            ))}
          </div>
        ) : (
          <span className="block text-[13px]" style={{ color: RT_3 }}>
            —
          </span>
        )}
        {!locked && (
          <button
            ref={requestBtnRef}
            type="button"
            onClick={() => setRequestOpen((v) => !v)}
            className="hgb-req mt-[3px] inline-flex w-fit items-center gap-1 text-[12px] opacity-0 transition-opacity duration-200"
            style={{ color: R_AMBER }}
          >
            <Plus size={12} />
            Add room request
          </button>
        )}
        <FloatingPopover anchorRef={requestBtnRef} open={requestOpen} onClose={() => setRequestOpen(false)} width={220}>
          {ROOM_REQUEST_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                onPatch((a) => (a.requests.includes(r) ? a : { ...a, requests: [...a.requests, r] }));
                setRequestOpen(false);
              }}
              className="block w-full px-3 py-[7px] text-left text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.07)]"
              style={{ color: "#D9DDE0" }}
            >
              {r}
            </button>
          ))}
        </FloatingPopover>

      </div>

      {/* ── STATUS ── */}
      <div className="hgb-cell flex flex-col justify-center px-3.5 py-2">
        <span className="inline-flex items-center gap-2 text-[12.5px]" style={{ color: statusColor }}>
          {status === "complete" ? <CheckCircle2 size={14} /> : <Circle size={14} strokeWidth={1.6} />}
          {statusLabel}
        </span>
        <p className="mt-[3px] text-[11.5px]" style={{ color: TEXT_2 }}>
          {named.length} / {cap} guest{cap > 1 ? "s" : ""}
        </p>
      </div>

      {/* ── MENU ── */}
      <div className="hgb-cell relative flex items-center justify-center py-2">
        <button
          ref={menuBtnRef}
          type="button"
          aria-label="Allocation actions"
          onClick={() => setMenuOpen((v) => !v)}
          className="hgb-menu grid h-7 w-7 place-items-center rounded-[6px] opacity-0 transition-opacity duration-200"
          style={{ color: RT_3 }}
        >
          <MoreVertical size={15} />
        </button>
        <FloatingPopover anchorRef={menuBtnRef} open={menuOpen} onClose={() => setMenuOpen(false)} width={190} align="end">
          {[
            { label: "View details", run: () => allocation.guests[0] && onOpenGuest(allocation.guests[0].id) },
            { label: "Change room type", run: () => setTypeOpen(true) },
            { label: "Add room request", run: () => setRequestOpen(true) },
            { label: "Clear allocation", run: () => onPatch((a) => ({ ...a, guests: [] })) },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={locked}
              onClick={() => {
                item.run();
                setMenuOpen(false);
              }}
              className="block w-full px-3 py-[7px] text-left text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.07)] disabled:opacity-40"
              style={{ color: "#D9DDE0" }}
            >
              {item.label}
            </button>
          ))}
        </FloatingPopover>

      </div>
    </div>
  );
}

/* ───────────────── dietary / allergy popover ───────────────── */

function DietaryPopover({
  anchorRef,
  open,
  onClose,
  selected,
  onToggle,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  onClose: () => void;
  selected: string[];
  onToggle: (tag: string) => void;
}) {
  const [q, setQ] = useState("");
  const [custom, setCustom] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setCustom("");
      const t = setTimeout(() => searchRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const match = (t: string) => t.toLowerCase().includes(q.trim().toLowerCase());
  const diet = DIETARY_TAGS.filter(match);
  const allergies = ALLERGY_TAGS.filter(match);
  const otherSelected = selected.some((t) => /other allergy/i.test(t));

  const addCustom = () => {
    const v = custom.trim();
    if (!v) return;
    const tag = /allerg/i.test(v) ? v : `${v} allergy`;
    if (!selected.includes(tag)) onToggle(tag);
    setCustom("");
  };

  const Option = ({ t }: { t: string }) => {
    const on = selected.includes(t);
    return (
      <button
        type="button"
        onClick={() => onToggle(t)}
        className="flex w-full items-center justify-between px-3 py-[7px] text-left text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.07)]"
        style={{ color: on ? "#F7F7F5" : isAllergy(t) ? AMBER : TEXT_2 }}
      >
        <span>{t}</span>
        {on && <Check size={13} style={{ color: GOLD }} />}
      </button>
    );
  };

  return (
    <FloatingPopover anchorRef={anchorRef} open={open} onClose={onClose} width={300} align="auto">
      <div className="px-3 pb-2 pt-3">
        <p className="text-[10.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
          Add dietary / allergy
        </p>
        <div
          className="mt-2 flex items-center gap-2 rounded-[8px] px-2.5 py-[6px]"
          style={{ backgroundColor: FIELD_BG, border: `1px solid ${FIELD_BORDER_LIGHT}` }}
        >
          <Search size={13} style={{ color: FIELD_PLACEHOLDER }} />
          <input
            ref={searchRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dietary requirements..."
            className="w-full bg-transparent text-[12.5px] outline-none placeholder:text-[#88A0B6]"
            style={{ color: FIELD_TEXT }}
          />
        </div>
      </div>

      {diet.length > 0 && (
        <>
          <p className="px-3 pb-1 pt-1 text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
            Dietary
          </p>
          {diet.map((t) => (
            <Option key={t} t={t} />
          ))}
        </>
      )}

      {allergies.length > 0 && (
        <>
          <p className="px-3 pb-1 pt-2 text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
            Allergies
          </p>
          {allergies.map((t) => (
            <Option key={t} t={t} />
          ))}
        </>
      )}

      {diet.length === 0 && allergies.length === 0 && (
        <p className="px-3 py-3 text-[12px]" style={{ color: MUTED }}>
          No matches.
        </p>
      )}

      {otherSelected && (
        <div className="px-3 pb-3 pt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="mb-1.5 text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
            Specify allergy
          </p>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            onBlur={addCustom}
            placeholder="e.g. Kiwi allergy"
            className="w-full rounded-[8px] px-2.5 py-[6px] text-[12.5px] outline-none placeholder:text-[#88A0B6]"
            style={{ backgroundColor: FIELD_BG, border: `1px solid ${FIELD_BORDER_LIGHT}`, color: FIELD_TEXT }}
          />
        </div>
      )}
    </FloatingPopover>
  );
}

/* ───────────────── guest drawer ───────────────── */


function GuestDrawer({
  allocation,
  guest,
  locked,
  isNew = false,
  onClose,
  onSave,
  onRemove,
}: {
  allocation: Allocation | null;
  guest: Guest;
  locked: boolean;
  isNew?: boolean;
  onClose: () => void;
  onSave: (g: Guest) => void;
  onRemove: () => void;
}) {
  const [draft, setDraft] = useState<Guest>(guest);
  const [saved, setSaved] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const tagBtnRef = useRef<HTMLButtonElement>(null);


  const set = (patch: Partial<Guest>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <aside
      className="fixed inset-0 z-40 lg:sticky lg:top-[68px] lg:z-auto lg:w-[322px] lg:shrink-0"
      style={{ animation: "hgbSlide 200ms ease-out" }}
    >
      <button aria-label="Close guest details" className="absolute inset-0 bg-black/50 lg:hidden" onClick={onClose} />
      <div
        className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col overflow-y-auto lg:static lg:h-[calc(100vh-96px)] lg:max-w-none lg:rounded-[13px]"
        style={{
          backgroundColor: "#1D456C",
          border: `1px solid ${CARD_BORDER}`,
          boxShadow: CARD_SHADOW,
        }}
      >
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <h3 className="text-[17px]" style={{ color: TEXT, fontFamily: SERIF }}>
            Guest details
          </h3>
          <button type="button" aria-label="Close" onClick={onClose} style={{ color: MUTED }}>
            <X size={17} />
          </button>
        </div>

        <div className="flex items-center gap-3 px-4 py-3" style={{ borderTop: `1px solid ${BORDER}` }}>
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[11.5px] font-medium"
            style={{ backgroundColor: "rgba(128,154,180,0.28)", color: TEXT }}
          >
            {(draft.firstName[0] ?? "") + (draft.lastName[0] ?? "")}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[14px]" style={{ color: TEXT }}>
              {guestName(draft) || "New guest"}
            </p>
            <p className="text-[11.5px]" style={{ color: MUTED }}>
              {allocation
                ? `Allocation ${String(allocation.index).padStart(2, "0")} • ${labelOf(allocation.type)}`
                : "Not yet assigned to a room"}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 px-4 pb-3">
          <p className="text-[10.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
            Personal details
          </p>
          <Field label="First name" value={draft.firstName} onChange={(v) => set({ firstName: v })} />
          <Field label="Last name" value={draft.lastName} onChange={(v) => set({ lastName: v })} />
          <label className="block rounded-[8px] px-3 py-[7px]" style={{ backgroundColor: FIELD_BG, border: `1px solid ${FIELD_BORDER_LIGHT}` }}>
            <span className="block text-[10px] uppercase tracking-[0.14em]" style={{ color: FIELD_LABEL }}>
              Nationality
            </span>
            <select
              value={draft.nationality ?? ""}
              onChange={(e) => set({ nationality: e.target.value || undefined })}
              className="mt-[2px] w-full bg-transparent text-[13.5px] outline-none"
              style={{ color: FIELD_TEXT }}
            >
              <option value="" style={{ color: "#111" }}>
                Not specified
              </option>
              {NATIONALITIES.map((n) => (
                <option key={n.code} value={n.label} style={{ color: "#111" }}>
                  {n.label}
                </option>
              ))}
            </select>
          </label>
          <Field label="Email (optional)" value={draft.email ?? ""} onChange={(v) => set({ email: v })} type="email" />
          <Field label="Phone (optional)" value={draft.phone ?? ""} onChange={(v) => set({ phone: v })} />
        </div>

        <div className="px-4 pb-3">
          <p className="text-[10.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
            Dietary / allergies
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {draft.requirements.map((t) => {
              const strong = isAllergy(t);
              return (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 rounded-[6px] px-2 py-[4px] text-[11.5px]"
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: strong ? "#6E88A3" : "#809AB4",
                    border: "1px solid rgba(255,255,255,0.14)",
                  }}
                >
                  {t}
                  <button
                    type="button"
                    aria-label={`Remove ${t}`}
                    onClick={() => set({ requirements: draft.requirements.filter((x) => x !== t) })}
                  >
                    <X size={11} />
                  </button>
                </span>
              );
            })}
          </div>
          <div className="mt-2">
            <button
              ref={tagBtnRef}
              type="button"
              onClick={() => setTagOpen((v) => !v)}
              className="text-[12px] transition-opacity hover:opacity-80"
              style={{ color: GOLD_SOFT }}
            >
              + Add dietary / allergy
            </button>
            <DietaryPopover
              anchorRef={tagBtnRef}
              open={tagOpen}
              onClose={() => setTagOpen(false)}
              selected={draft.requirements}
              onToggle={(t) =>
                set({
                  requirements: draft.requirements.includes(t)
                    ? draft.requirements.filter((x) => x !== t)
                    : [...draft.requirements, t],
                })
              }
            />
          </div>

        </div>

        <div className="px-4 pb-4">
          <p className="text-[10.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
            Special requests
          </p>
          <textarea
            value={draft.specialRequests ?? ""}
            maxLength={500}
            onChange={(e) => set({ specialRequests: e.target.value })}
            rows={4}
            placeholder="Accessibility requirement, baby cot, personal preference…"
            className="mt-2 w-full resize-none rounded-[8px] px-3 py-2 text-[13px] outline-none placeholder:text-[#88A0B6]"
            style={{ backgroundColor: FIELD_BG, border: `1px solid ${FIELD_BORDER_LIGHT}`, color: FIELD_TEXT }}
          />
          <div className="mt-1 flex items-center justify-between text-[11px]" style={{ color: MUTED }}>
            <span>{(draft.specialRequests ?? "").length} / 500</span>
            <button type="button" onClick={() => set({ specialRequests: "" })} style={{ color: MUTED }}>
              Clear
            </button>
          </div>
        </div>

        <div
          className="sticky bottom-0 mt-auto flex items-center justify-between gap-3 px-4 py-3"
          style={{ backgroundColor: "rgba(24,58,92,0.96)", borderTop: `1px solid ${CARD_BORDER}` }}
        >
          {isNew ? (
            <button
              type="button"
              onClick={onClose}
              className="text-[12.5px] transition-opacity hover:opacity-80"
              style={{ color: MUTED }}
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              disabled={locked}
              onClick={onRemove}
              className="text-[12.5px] transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ color: "#B47A72" }}
            >
              Remove guest
            </button>
          )}
          <div className="flex items-center gap-3">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: GREEN }}>
                <Check size={13} /> Changes saved
              </span>
            )}
            <GoldButton
              small
              disabled={locked || (isNew && !isNamed(draft))}
              onClick={() => {
                onSave(draft);
                if (isNew) return;
                setSaved(true);
                setTimeout(() => setSaved(false), 1800);
              }}
            >
              {isNew ? "Add guest" : "Save changes"}
            </GoldButton>
          </div>
        </div>

      </div>
    </aside>
  );
}

/* ───────────────── modals ───────────────── */

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-4">
      <button aria-label="Close" className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative max-h-[82vh] w-full max-w-[540px] overflow-y-auto rounded-[13px] p-5"
        style={{ backgroundColor: CARD, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, animation: "hgbFade 180ms ease-out" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[19px]" style={{ color: TEXT, fontFamily: SERIF }}>
            {title}
          </h3>
          <button type="button" aria-label="Close" onClick={onClose} style={{ color: MUTED }}>
            <X size={17} />
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

function GroupRequestsModal({
  requests,
  locked,
  onClose,
  onChange,
}: {
  requests: string[];
  locked: boolean;
  onClose: () => void;
  onChange: (r: string[]) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <Modal title="Group requests" onClose={onClose}>
      <p className="text-[12.5px]" style={{ color: MUTED }}>
        Requests that apply to the whole rooming list — no need to repeat them on every guest.
      </p>
      <div className="mt-3 space-y-2">
        {requests.map((r) => (
          <div
            key={r}
            className="flex items-center justify-between rounded-[8px] px-3 py-2 text-[13px]"
            style={{ backgroundColor: ROW, border: `1px solid ${BORDER}`, color: TEXT_2 }}
          >
            {r}
            {!locked && (
              <button type="button" aria-label={`Remove ${r}`} onClick={() => onChange(requests.filter((x) => x !== r))} style={{ color: MUTED }}>
                <X size={13} />
              </button>
            )}
          </div>
        ))}
        {requests.length === 0 && (
          <p className="text-[12.5px]" style={{ color: MUTED }}>
            No group requests yet.
          </p>
        )}
      </div>
      {!locked && (
        <div className="mt-3 flex items-center gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && value.trim()) {
                onChange([...requests, value.trim()]);
                setValue("");
              }
            }}
            placeholder="e.g. Rooms requested on the same floor."
            className="flex-1 rounded-[8px] px-3 py-2 text-[13px] outline-none"
            style={{ backgroundColor: "rgba(255,255,255,0.055)", border: `1px solid ${BORDER}`, color: TEXT }}
          />
          <GoldButton
            small
            onClick={() => {
              if (value.trim()) {
                onChange([...requests, value.trim()]);
                setValue("");
              }
            }}
          >
            <Plus size={13} /> Add group request
          </GoldButton>
        </div>
      )}
    </Modal>
  );
}

function ImportModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="Import guest list" onClose={onClose}>
      <p className="text-[12.5px]" style={{ color: MUTED }}>
        Upload an Excel or CSV guest list. Columns are mapped to guest name, room type, roommate, nationality, dietary,
        allergies and special requests — your own template structure is supported.
      </p>
      <div
        className="mt-4 grid place-items-center rounded-[10px] px-4 py-8 text-center"
        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px dashed ${GOLD_DEEP}` }}
      >
        <FileSpreadsheet size={22} style={{ color: GOLD_SOFT }} />
        <p className="mt-2 text-[13px]" style={{ color: TEXT_2 }}>
          Drop your .xlsx or .csv file here
        </p>
        <p className="mt-1 text-[11.5px]" style={{ color: MUTED }}>
          Intelligent column mapping — coming with your next stay
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <GhostButton onClick={onClose}>Close</GhostButton>
      </div>
    </Modal>
  );
}

function ReviewModal({
  list,
  stats,
  issues,
  onClose,
  onFix,
  onSubmit,
}: {
  list: RoomingList;
  stats: ReturnType<typeof statsOf>;
  issues: RoomingIssue[];
  onClose: () => void;
  onFix: (allocationId: string) => void;
  onSubmit: () => void;
}) {

  const locked = Boolean(list.submittedAt);

  return (
    <Modal title={locked ? "Request change" : "Review & submit"} onClose={onClose}>
      {locked ? (
        <>
          <p className="text-[12.5px]" style={{ color: MUTED }}>
            Your rooming list is submitted. Propose changes and our team will confirm them with the hotel.
          </p>
          <div className="mt-3 rounded-[9px] px-3 py-3" style={{ backgroundColor: ROW, border: `1px solid ${BORDER}` }}>
            <p className="text-[10.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
              Requested changes
            </p>
            <p className="mt-2 text-[13px]" style={{ color: TEXT_2 }}>
              No changes proposed yet. Describe the change you need and we will prepare a change summary before
              submitting it to the hotel.
            </p>
          </div>
          <div className="mt-4 flex justify-end">
            <GoldButton onClick={onClose}>Submit change request →</GoldButton>
          </div>
        </>
      ) : (
        <>
          <p className="text-[10.5px] uppercase tracking-[0.18em]" style={{ color: issues.length ? AMBER : GREEN }}>
            {issues.length ? "Almost ready" : "Rooming list ready"}
          </p>
          <p className="mt-1.5 text-[14px]" style={{ color: TEXT }}>
            {issues.length
              ? `${stats.filled} / ${stats.totalSlots} guests complete · ${issues.length} item${issues.length > 1 ? "s" : ""} need attention`
              : `${stats.totalSlots} guests · ${stats.totalAllocations} rooms`}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {stats.byType.map((t) => (
              <span
                key={t.type}
                className="rounded-[8px] px-3 py-1.5 text-[12.5px]"
                style={{ backgroundColor: ROW, border: `1px solid ${BORDER}`, color: TEXT_2 }}
              >
                <strong style={{ color: TEXT }}>{t.count}</strong> {t.label}
              </span>
            ))}
          </div>

          {issues.length > 0 ? (
            <>
              <p className="mt-4 text-[13px]" style={{ color: AMBER }}>
                Issues to review
              </p>
              <div className="mt-2 space-y-1.5">
                {issues.slice(0, 10).map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center justify-between gap-3 rounded-[8px] px-3 py-2"
                    style={{ backgroundColor: ROW, border: `1px solid ${BORDER}` }}
                  >
                    <span className="min-w-0 text-[13px]" style={{ color: TEXT }}>
                      {i.title}
                      <span className="ml-2 text-[12px]" style={{ color: MUTED }}>
                        {i.detail}
                      </span>
                    </span>
                    {i.allocationId && (
                      <button
                        type="button"
                        onClick={() => onFix(i.allocationId as string)}
                        className="shrink-0 text-[12.5px]"
                        style={{ color: GOLD_SOFT }}
                      >
                        Fix →
                      </button>
                    )}
                  </div>
                ))}
                {issues.length > 10 && (
                  <p className="text-[12px]" style={{ color: MUTED }}>
                    +{issues.length - 10} more items need attention
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-[9px] px-3 py-3" style={{ backgroundColor: "rgba(62,155,87,0.10)", border: "1px solid rgba(62,155,87,0.28)" }}>
              <p className="inline-flex items-center gap-2 text-[13.5px]" style={{ color: GREEN }}>
                <CheckCircle2 size={15} /> All required information completed
              </p>
              <p className="mt-1 text-[12.5px]" style={{ color: TEXT_2 }}>
                {stats.totalSlots} guests · {stats.totalAllocations} rooms · no unassigned guests
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-end gap-2.5">
            <GhostButton onClick={onClose}>Keep editing</GhostButton>
            <GoldButton onClick={onSubmit} disabled={issues.length > 0}>
              Submit rooming list →
            </GoldButton>
          </div>
        </>
      )}
    </Modal>
  );
}

/* ───────────────── submitted state ───────────────── */

function SubmittedBanner({
  list,
  stats,
  onRequestChange,
}: {
  list: RoomingList;
  stats: ReturnType<typeof statsOf>;
  onRequestChange: () => void;
}) {
  const when = list.submittedAt ? new Date(list.submittedAt) : null;
  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
      <div>
        <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: GREEN }}>
          <CheckCircle2 size={15} /> Rooming list submitted
        </p>
        <p className="mt-1.5 text-[13.5px]" style={{ color: TEXT }}>
          {stats.filled} guests · {stats.totalAllocations} room allocations
        </p>
        {when && (
          <p className="mt-0.5 text-[12px]" style={{ color: MUTED }}>
            Submitted{" "}
            {when.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })} at{" "}
            {when.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}
        <p className="mt-1 max-w-[420px] text-[12px]" style={{ color: MUTED }}>
          Changes now require approval from HotelGroupBook.
        </p>
      </div>
      <div className="ml-auto flex flex-wrap items-center gap-2.5">
        <GhostButton>View submission</GhostButton>
        <GhostButton>
          <Download size={14} />
          Download
        </GhostButton>
        <GoldButton onClick={onRequestChange}>Request change →</GoldButton>
      </div>
    </div>
  );
}

/* ───────────────── unassigned guests ───────────────── */

function UnassignedPanel({
  guests,
  allocations,
  locked,
  onOpenGuest,
  onAdd,
  onRemove,
  onAssign,
}: {
  guests: Guest[];
  allocations: Allocation[];
  locked: boolean;
  onOpenGuest: (guestId: string) => void;
  onAdd: (first: string, last: string) => void;
  onRemove: (guestId: string) => void;
  onAssign: (guestId: string, allocationId: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [assignFor, setAssignFor] = useState<string | null>(null);

  const available = allocations.filter((a) => a.guests.filter(isNamed).length < capacityOf(a.type, a.occupancy));

  const commit = () => {
    if (!first.trim() && !last.trim()) {
      setAdding(false);
      return;
    }
    onAdd(first.trim(), last.trim());
    setFirst("");
    setLast("");
  };

  if (locked && guests.length === 0) return null;

  /* compact, calm status strip when every guest is already allocated */
  if (guests.length === 0) {
    return (
      <section
        className="mt-2.5 rounded-[12px] px-4"
        style={{
          minHeight: 46,
          backgroundColor: "#F4F6F7",
          border: "1px solid #DCE3E9",
          boxShadow: "0 1px 2px rgba(20,45,70,0.05)",
        }}
      >
        <div className="flex min-h-[46px] flex-wrap items-center gap-x-3 gap-y-1 py-1.5">
          <span
            className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(116,177,127,0.16)", color: "#4E9A63" }}
          >
            <Check size={12} />
          </span>
          <p className="text-[12.5px] font-medium" style={{ color: "#1D456C" }}>
            All guests assigned
          </p>
          <p className="text-[12px]" style={{ color: "#6C7E8E" }}>
            Every guest is currently allocated to a room.
          </p>
          {!locked && (
            <button
              type="button"
              onClick={() => setAdding((v) => !v)}
              className="ml-auto inline-flex items-center gap-1.5 text-[12.5px]"
              style={{ color: "#C5A24B" }}
            >
              <Plus size={13} />
              Add guest without room
            </button>
          )}
        </div>

        {adding && !locked && (
          <div
            className="mb-2 flex flex-wrap items-center gap-2 rounded-[8px] px-2.5 py-2"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #DCE3E9" }}
          >
            <input
              autoFocus
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setAdding(false);
              }}
              placeholder="First name"
              className="w-[118px] bg-transparent text-[13px] outline-none"
              style={{ color: FIELD_TEXT }}
            />
            <input
              value={last}
              onChange={(e) => setLast(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setAdding(false);
              }}
              placeholder="Last name"
              className="w-[132px] bg-transparent text-[13px] outline-none"
              style={{ color: FIELD_TEXT }}
            />
            <GoldButton small onClick={commit}>
              Add
            </GoldButton>
            <button type="button" aria-label="Cancel" onClick={() => setAdding(false)} style={{ color: "#6C7E8E" }}>
              <X size={14} />
            </button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section
      className="mt-2.5 rounded-[12px] px-4 py-3"
      style={{ backgroundColor: PANEL, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-[10.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
          Unassigned guests
          <span className="ml-2 text-[11.5px] font-semibold tracking-normal" style={{ color: guests.length ? AMBER : MUTED }}>
            {guests.length}
          </span>
        </p>
        <p className="text-[12px]" style={{ color: TEXT_2 }}>
          Saved with your rooming list — assign them to a room whenever you are ready.
        </p>
        {!locked && (
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="ml-auto inline-flex items-center gap-1.5 text-[12.5px]"
            style={{ color: GOLD_SOFT }}
          >
            <Plus size={13} />
            Add guest without room
          </button>
        )}
      </div>

      {adding && !locked && (
        <div
          className="mt-2.5 flex flex-wrap items-center gap-2 rounded-[8px] px-2.5 py-2"
          style={{ backgroundColor: SURFACE_2, border: `1px solid ${BORDER}` }}
        >
          <input
            autoFocus
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setAdding(false);
            }}
            placeholder="First name"
            className="w-[118px] bg-transparent text-[13px] outline-none"
            style={{ color: TEXT }}
          />
          <input
            value={last}
            onChange={(e) => setLast(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setAdding(false);
            }}
            placeholder="Last name"
            className="w-[132px] bg-transparent text-[13px] outline-none"
            style={{ color: TEXT }}
          />
          <GoldButton small onClick={commit}>
            Add
          </GoldButton>
          <button type="button" aria-label="Cancel" onClick={() => setAdding(false)} style={{ color: MUTED }}>
            <X size={14} />
          </button>
        </div>
      )}

      {guests.length === 0 ? (
        <p className="mt-2 text-[12.5px]" style={{ color: TEXT_2 }}>
          Every guest is assigned to a room.
        </p>
      ) : (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {guests.map((g) => (
            <div
              key={g.id}
              className="relative flex items-center gap-2 rounded-[9px] py-[6px] pl-2.5 pr-2"
              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}` }}
            >
              <button
                type="button"
                onClick={() => onOpenGuest(g.id)}
                className="inline-flex items-center gap-2 text-left text-[13px]"
                style={{ color: TEXT }}
              >
                <User size={13} style={{ color: MUTED }} />
                {guestName(g) || "Unnamed guest"}
                {g.nationality && <span className="text-[12px]" style={{ color: TEXT_2 }}>{g.nationality}</span>}
              </button>

              {!locked && (
                <>
                  <button
                    type="button"
                    onClick={() => setAssignFor((v) => (v === g.id ? null : g.id))}
                    className="inline-flex items-center gap-1 rounded-[6px] px-2 py-[3px] text-[11.5px]"
                    style={{ color: GOLD_SOFT, border: `1px solid ${BORDER}` }}
                  >
                    Assign
                    <ChevronDown size={12} />
                  </button>
                  <button type="button" aria-label={`Remove ${guestName(g)}`} onClick={() => onRemove(g.id)} style={{ color: MUTED }}>
                    <X size={13} />
                  </button>
                </>
              )}

              {assignFor === g.id && (
                <div
                  className="absolute left-0 top-full z-30 mt-1 max-h-[240px] w-[220px] overflow-y-auto rounded-[8px]"
                  style={{
                    backgroundColor: SURFACE_2,
                    border: "1px solid rgba(90,115,140,0.18)",
                    boxShadow: "0 10px 26px rgba(20,45,70,0.16)",
                    animation: "hgbFade 160ms ease-out",
                  }}
                >
                  {available.length === 0 && (
                    <p className="px-3 py-2 text-[12.5px]" style={{ color: MUTED }}>
                      No room has an open place.
                    </p>
                  )}
                  {available.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        onAssign(g.id, a.id);
                        setAssignFor(null);
                      }}
                      className="flex w-full items-center justify-between px-3 py-[7px] text-left text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                      style={{ color: TEXT_2 }}
                    >
                      <span>
                        {String(a.index).padStart(2, "0")} · {labelOf(a.type)}
                      </span>
                      <span className="text-[11px]" style={{ color: MUTED }}>
                        {a.guests.filter(isNamed).length} / {capacityOf(a.type, a.occupancy)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
