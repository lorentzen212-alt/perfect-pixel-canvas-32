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
  flagOf,
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

/* Light blue-white-grey workspace tokens (names kept so existing markup keeps working) */
const BG_ALT = "#E7EEF5";
const CARD = "#F5F8FB";
const CARD_BORDER = "rgba(110,135,160,0.16)";
const CARD_SHADOW = "0 8px 30px rgba(35,60,85,0.06)";
const BORDER = "rgba(90,115,140,0.14)";
const TEXT = "#10233F";
const TEXT_2 = "#50657A";
const MUTED = "#71859A";
const GOLD = "#285D91";
const GOLD_SOFT = "#285D91";
const GOLD_DEEP = "rgba(40,93,145,0.32)";
const GREEN = "#3E9B57";
const AMBER = "#B0800F";
const ROW = "rgba(255,255,255,0.45)";
const PANEL = "rgba(245,248,251,0.72)";
const NAVY = "#153E6C";

/* dark matte navy room-allocation card tokens */
const CARD_NAVY = "linear-gradient(180deg, #1D456C 0%, #173A5D 100%)";
const CARD_NAVY_HOVER = "linear-gradient(180deg, #214C76 0%, #1A4165 100%)";
const RT = "#F4F7FA";
const RT_2 = "#D9E3EC";
const RT_3 = "rgba(255,255,255,0.68)";
const R_BORDER = "rgba(255,255,255,0.09)";
const R_GREEN = "#74D97C";
const R_AMBER = "#E7B44B";

const GOLD_BAR = "#285D91";
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
      className={`inline-flex items-center gap-2 rounded-[8px] font-medium transition-colors duration-200 ease-out hover:bg-[rgba(255,255,255,0.9)] ${
        small ? "px-3 py-[6px] text-[12px]" : "px-4 py-[8px] text-[12.5px]"
      }`}
      style={{ color: TEXT, backgroundColor: "rgba(255,255,255,0.62)", border: `1px solid rgba(90,115,140,0.22)` }}

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
    <label className="block rounded-[8px] px-3 py-[7px]" style={{ backgroundColor: "rgba(255,255,255,0.92)", border: `1px solid ${BORDER}` }}>
      <span className="block text-[10px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-[2px] w-full bg-transparent text-[13.5px] outline-none"
        style={{ color: TEXT }}
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
    if (!list || !openGuest) return null;
    if (!openGuest.allocationId) {
      const guest = list.unassigned.find((g) => g.id === openGuest.guestId);
      return guest ? { alloc: null, guest } : null;
    }
    const alloc = list.allocations.find((a) => a.id === openGuest.allocationId);
    const guest = alloc?.guests.find((g) => g.id === openGuest.guestId);
    return alloc && guest ? { alloc, guest } : null;
  }, [list, openGuest]);

  const issues = useMemo(() => (list ? roomingIssues(list) : []), [list]);

  if (!list || !stats) {
    return <div className="min-h-screen" style={{ backgroundColor: BG_ALT }} />;
  }

  const nights = booking.nights;

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at 50% 12%, rgba(255,255,255,0.9), rgba(228,237,245,0.9) 55%, rgba(210,224,236,0.96) 100%), #E7EEF5",
      }}
    >
      <style>{`@keyframes hgbFade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
      @keyframes hgbSlide{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}
      .hgb-row:hover{background:${CARD_NAVY_HOVER} !important;border-color:rgba(255,255,255,0.14) !important}
      .hgb-row:hover .hgb-menu,.hgb-row:hover .hgb-req{opacity:1}
      .hgb-cell{border-top:1px solid rgba(255,255,255,0.07)}
      @media(min-width:1024px){.hgb-cell{border-top:none;border-left:1px solid rgba(255,255,255,0.08)}}`}</style>

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
              style={{ color: GOLD_SOFT }}
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
                <span
                  className="inline-flex items-center rounded-[5px] px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: TEXT_2, backgroundColor: "rgba(128,154,180,0.22)" }}
                >
                  {booking.type === "leisure" ? "Leisure" : "M&E"}
                </span>

                <h1 className="mt-1.5 text-[26px] font-semibold leading-[1.06] tracking-[-0.01em]" style={{ color: TEXT }}>
                  {booking.name}
                </h1>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px]" style={{ color: TEXT_2 }}>
                  {booking.hotel && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={13} style={{ color: GOLD_SOFT }} />
                      {booking.hotel}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays size={13} style={{ color: GOLD_SOFT }} />
                    {new Date(booking.startDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} –{" "}
                    {new Date(booking.endDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock size={13} style={{ color: GOLD_SOFT }} />
                    {nights} nights
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Bed size={13} style={{ color: GOLD_SOFT }} />
                    {stats.totalAllocations} rooms
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users size={13} style={{ color: GOLD_SOFT }} />
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
                      <p className="mt-1.5 text-[12.5px]" style={{ color: MUTED }}>
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
                      className="inline-flex items-center gap-2 rounded-[7px] px-3 py-[7px] text-[12px] transition-colors hover:bg-[rgba(20,45,70,0.05)]"
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
                                ? { color: GOLD, backgroundColor: "#FFFFFF", border: `1px solid ${GOLD_DEEP}`, boxShadow: "0 1px 4px rgba(20,45,70,0.10)" }
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
                          className="w-[150px] bg-transparent text-[12.5px] outline-none"
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
              style={{ color: MUTED, gridTemplateColumns: COLS }}
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
                    onOpenGuest={(guestId) => setOpenGuest({ allocationId: a.id, guestId })}
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
              style={{ backgroundColor: "rgba(245,248,251,0.94)", border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW, backdropFilter: "blur(8px)" }}
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
                    {stats.missing} missing
                  </span>
                </span>

                <div className="ml-auto flex items-center gap-2.5">
                  <GhostButton
                    onClick={() => {
                      setView("missing");
                      setQuery("");
                    }}
                  >
                    Review issues ({stats.missing})
                  </GhostButton>
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
              onClose={() => setOpenGuest(null)}
              onSave={(g) => {
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
  autoFocus,
  onAutoFocused,
  onPatch,
  onOpenGuest,
}: {
  allocation: Allocation;
  locked: boolean;
  autoFocus?: boolean;
  onAutoFocused?: () => void;
  onPatch: (fn: (a: Allocation) => Allocation) => void;
  onOpenGuest: (guestId: string) => void;
}) {
  const cap = capacityOf(allocation.type, allocation.occupancy);
  const named = allocation.guests.filter(isNamed);
  const status = allocationStatus(allocation);
  const [typeOpen, setTypeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [approval, setApproval] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      setAdding(true);
      onAutoFocused?.();
    }
  }, [autoFocus, onAutoFocused]);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  const slotLabel = named.length === 0 ? "Add guest" : named.length === 1 ? "Add second guest" : named.length === 2 ? "Add third guest" : "Add guest";

  const commit = () => {
    if (!first.trim() && !last.trim()) {
      setAdding(false);
      return;
    }
    onPatch((a) => ({ ...a, guests: [...a.guests, newGuest({ firstName: first.trim(), lastName: last.trim() })] }));
    setFirst("");
    setLast("");
    if (named.length + 1 >= cap) setAdding(false);
    else inputRef.current?.focus();
  };

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

  return (
    <div
      id={`alloc-${allocation.id}`}
      className="hgb-row grid rounded-[10px] transition-[background,border-color] duration-200 ease-out lg:[grid-template-columns:14%_42%_21%_19%_4%]"
      style={{
        background: CARD_NAVY,
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 12px rgba(20,45,70,0.10)",
      }}
    >

      {/* ── ALLOCATION ── */}
      <div className="flex flex-col justify-center px-3.5 py-2">
        <p className="text-[19px] font-semibold leading-none tracking-[-0.01em]" style={{ color: RT }}>
          {String(allocation.index).padStart(2, "0")}
        </p>
        <div className="relative mt-1.5">
          <button
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
          {typeOpen && (
            <div
              className="absolute left-0 top-full z-30 mt-1 w-[150px] overflow-hidden rounded-[8px]"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid rgba(90,115,140,0.18)",
                boxShadow: "0 10px 26px rgba(20,45,70,0.16)",
                animation: "hgbFade 160ms ease-out",
              }}
            >
              {ROOM_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => changeType(t.value)}
                  className="flex w-full items-center justify-between px-3 py-2 text-left text-[12.5px] transition-colors hover:bg-[rgba(20,45,70,0.05)]"
                  style={{ color: t.value === allocation.type ? "#153E6C" : "#50657A" }}
                >
                  <span>{t.label}</span>
                  <span className="text-[10.5px]" style={{ color: "#71859A" }}>
                    {t.capacity} guest{t.capacity > 1 ? "s" : ""}
                  </span>
                </button>
              ))}
            </div>
          )}
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
              <span className="inline-flex shrink-0 items-center gap-1.5 text-[12px]" style={{ color: "rgba(255,255,255,0.70)" }}>
                <span className="text-[13px] leading-none">{flagOf(g.nationality)}</span>
                {g.nationality}
              </span>
            )}
          </button>
        ))}

        {!locked && adding && named.length < cap && (
          <div
            className="flex flex-wrap items-center gap-2 rounded-[8px] px-2 py-1.5"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(90,115,140,0.22)",
              boxShadow: "0 8px 20px rgba(20,45,70,0.18)",
              animation: "hgbFade 160ms ease-out",
            }}
          >
            <input
              ref={inputRef}
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setAdding(false);
              }}
              placeholder="First name"
              className="w-[104px] bg-transparent text-[13px] outline-none"
              style={{ color: "#10233F" }}
            />
            <input
              value={last}
              onChange={(e) => setLast(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commit();
                if (e.key === "Escape") setAdding(false);
              }}
              placeholder="Last name"
              className="w-[118px] bg-transparent text-[13px] outline-none"
              style={{ color: "#10233F" }}
            />
            <GoldButton small onClick={commit}>
              Save
            </GoldButton>
            <button type="button" onClick={() => setAdding(false)} style={{ color: "#71859A" }} aria-label="Cancel">
              <X size={14} />
            </button>
          </div>
        )}

        {!locked &&
          !adding &&
          Array.from({ length: Math.max(0, cap - allocation.guests.length) }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setAdding(true)}
              className="flex w-full items-center gap-2 rounded-[6px] px-1.5 py-[3px] text-left text-[12.5px] transition-colors hover:bg-[rgba(231,180,75,0.10)]"
              style={{ color: R_AMBER }}
            >
              <Plus size={13} />
              {i === 0 ? slotLabel : "Add guest"}
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
            type="button"
            onClick={() => setRequestOpen((v) => !v)}
            className="hgb-req mt-[3px] inline-flex w-fit items-center gap-1 text-[12px] opacity-0 transition-opacity duration-200"
            style={{ color: R_AMBER }}
          >
            <Plus size={12} />
            Add room request
          </button>
        )}
        {requestOpen && (
          <div
            className="absolute left-2 top-full z-30 mt-1 w-[190px] overflow-hidden rounded-[8px]"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(90,115,140,0.18)",
              boxShadow: "0 10px 26px rgba(20,45,70,0.16)",
              animation: "hgbFade 160ms ease-out",
            }}
          >
            {ROOM_REQUEST_OPTIONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  onPatch((a) => (a.requests.includes(r) ? a : { ...a, requests: [...a.requests, r] }));
                  setRequestOpen(false);
                }}
                className="block w-full px-3 py-[7px] text-left text-[12.5px] transition-colors hover:bg-[rgba(20,45,70,0.05)]"
                style={{ color: "#50657A" }}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── STATUS ── */}
      <div className="hgb-cell flex flex-col justify-center px-3.5 py-2">
        <span className="inline-flex items-center gap-2 text-[12.5px]" style={{ color: statusColor }}>
          {status === "complete" ? <CheckCircle2 size={14} /> : <Circle size={14} strokeWidth={1.6} />}
          {statusLabel}
        </span>
        <p className="mt-[3px] text-[11.5px]" style={{ color: "rgba(255,255,255,0.65)" }}>
          {named.length} / {cap} guest{cap > 1 ? "s" : ""}
        </p>
      </div>

      {/* ── MENU ── */}
      <div className="hgb-cell relative flex items-center justify-center py-2">
        <button
          type="button"
          aria-label="Allocation actions"
          onClick={() => setMenuOpen((v) => !v)}
          className="hgb-menu grid h-7 w-7 place-items-center rounded-[6px] opacity-0 transition-opacity duration-200"
          style={{ color: RT_3 }}
        >
          <MoreVertical size={15} />
        </button>
        {menuOpen && (
          <div
            className="absolute right-1 top-full z-30 mt-1 w-[168px] overflow-hidden rounded-[8px]"
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(90,115,140,0.18)",
              boxShadow: "0 10px 26px rgba(20,45,70,0.16)",
              animation: "hgbFade 160ms ease-out",
            }}
          >
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
                className="block w-full px-3 py-[7px] text-left text-[12.5px] transition-colors hover:bg-[rgba(20,45,70,0.05)] disabled:opacity-40"
                style={{ color: "#50657A" }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────── guest drawer ───────────────── */

function GuestDrawer({
  allocation,
  guest,
  locked,
  onClose,
  onSave,
  onRemove,
}: {
  allocation: Allocation | null;
  guest: Guest;
  locked: boolean;
  onClose: () => void;
  onSave: (g: Guest) => void;
  onRemove: () => void;
}) {
  const [draft, setDraft] = useState<Guest>(guest);
  const [saved, setSaved] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);

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
          backgroundColor: "rgba(244,248,251,0.86)",
          border: `1px solid ${CARD_BORDER}`,
          boxShadow: CARD_SHADOW,
          backdropFilter: "blur(6px)",
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
          <label className="block rounded-[8px] px-3 py-[7px]" style={{ backgroundColor: "rgba(255,255,255,0.92)", border: `1px solid ${BORDER}` }}>
            <span className="block text-[10px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
              Nationality
            </span>
            <select
              value={draft.nationality ?? ""}
              onChange={(e) => set({ nationality: e.target.value || undefined })}
              className="mt-[2px] w-full bg-transparent text-[13.5px] outline-none"
              style={{ color: TEXT }}
            >
              <option value="" style={{ color: "#111" }}>
                Not specified
              </option>
              {NATIONALITIES.map((n) => (
                <option key={n.code} value={n.label} style={{ color: "#111" }}>
                  {n.flag} {n.label}
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
          <div className="relative mt-2">
            <button type="button" onClick={() => setTagOpen((v) => !v)} className="text-[12px]" style={{ color: GOLD_SOFT }}>
              + Add dietary / allergy
            </button>
            {tagOpen && (
              <div
                className="absolute left-0 top-full z-30 mt-1 w-[190px] overflow-hidden rounded-[8px]"
                style={{ backgroundColor: "rgba(255,255,255,0.92)", border: `1px solid ${BORDER}` }}
              >
                {[...DIETARY_TAGS, ...ALLERGY_TAGS].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      if (!draft.requirements.includes(t)) set({ requirements: [...draft.requirements, t] });
                      setTagOpen(false);
                    }}
                    className="block w-full px-3 py-[6px] text-left text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.04)]"
                    style={{ color: isAllergy(t) ? AMBER : TEXT_2 }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
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
            className="mt-2 w-full resize-none rounded-[8px] px-3 py-2 text-[13px] outline-none"
            style={{ backgroundColor: "rgba(255,255,255,0.92)", border: `1px solid ${BORDER}`, color: TEXT }}
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
          style={{ backgroundColor: "rgba(240,245,250,0.96)", borderTop: `1px solid ${CARD_BORDER}` }}
        >
          <button
            type="button"
            disabled={locked}
            onClick={onRemove}
            className="text-[12.5px] transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ color: "#B47A72" }}
          >
            Remove guest
          </button>
          <div className="flex items-center gap-3">
            {saved && (
              <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: GREEN }}>
                <Check size={13} /> Changes saved
              </span>
            )}
            <GoldButton
              small
              disabled={locked}
              onClick={() => {
                onSave(draft);
                setSaved(true);
                setTimeout(() => setSaved(false), 1800);
              }}
            >
              Save changes
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
            style={{ backgroundColor: "rgba(255,255,255,0.92)", border: `1px solid ${BORDER}`, color: TEXT }}
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
        style={{ backgroundColor: "rgba(255,255,255,0.55)", border: `1px dashed ${GOLD_DEEP}` }}
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
  onClose,
  onFix,
  onSubmit,
}: {
  list: RoomingList;
  stats: ReturnType<typeof statsOf>;
  onClose: () => void;
  onFix: (allocationId: string) => void;
  onSubmit: () => void;
}) {
  const issues = list.allocations
    .filter((a) => allocationStatus(a) !== "complete")
    .map((a) => {
      const cap = capacityOf(a.type, a.occupancy);
      const named = a.guests.filter(isNamed).length;
      return {
        id: a.id,
        title: `${labelOf(a.type)} ${String(a.index).padStart(2, "0")}`,
        detail: named === 0 ? "No guests assigned" : `Missing ${cap - named === 1 ? "" : `${cap - named} `}guest${cap - named > 1 ? "s" : ""}`,
      };
    });

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
          <p className="text-[10.5px] uppercase tracking-[0.18em]" style={{ color: GOLD_SOFT }}>
            Rooming list ready for review
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { v: stats.totalSlots, l: "Guests" },
              { v: stats.totalAllocations, l: "Room allocations" },
              { v: stats.completeAllocations, l: "Complete allocations" },
            ].map((x) => (
              <div key={x.l} className="rounded-[9px] px-3 py-2.5" style={{ backgroundColor: ROW, border: `1px solid ${BORDER}` }}>
                <p className="text-[19px] leading-none" style={{ color: TEXT }}>
                  {x.v}
                </p>
                <p className="mt-1 text-[11px]" style={{ color: MUTED }}>
                  {x.l}
                </p>
              </div>
            ))}
          </div>

          {issues.length > 0 ? (
            <>
              <p className="mt-4 text-[13px]" style={{ color: AMBER }}>
                {issues.length} item{issues.length > 1 ? "s" : ""} need attention
              </p>
              <div className="mt-2 space-y-1.5">
                {issues.slice(0, 8).map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center justify-between rounded-[8px] px-3 py-2"
                    style={{ backgroundColor: ROW, border: `1px solid ${BORDER}` }}
                  >
                    <span className="text-[13px]" style={{ color: TEXT }}>
                      {i.title}
                      <span className="ml-2 text-[12px]" style={{ color: MUTED }}>
                        {i.detail}
                      </span>
                    </span>
                    <button type="button" onClick={() => onFix(i.id)} className="text-[12.5px]" style={{ color: GOLD_SOFT }}>
                      Fix →
                    </button>
                  </div>
                ))}
                {issues.length > 8 && (
                  <p className="text-[12px]" style={{ color: MUTED }}>
                    +{issues.length - 8} more allocations need attention
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-[9px] px-3 py-3" style={{ backgroundColor: "rgba(62,155,87,0.10)", border: "1px solid rgba(62,155,87,0.28)" }}>
              <p className="inline-flex items-center gap-2 text-[13.5px]" style={{ color: GREEN }}>
                <CheckCircle2 size={15} /> Rooming list complete
              </p>
              <p className="mt-1 text-[12.5px]" style={{ color: TEXT_2 }}>
                {stats.totalSlots} guests · {stats.totalAllocations} rooms · 0 missing guest assignments
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
