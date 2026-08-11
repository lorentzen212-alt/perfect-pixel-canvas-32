import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUp,
  Bed,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleSlash,
  Clock,
  Download,
  FileSpreadsheet,
  MapPin,
  MoreVertical,
  Pencil,

  Plus,
  Search,
  Upload,
  User,
  Users,
  Utensils,
  X,
} from "lucide-react";
import { SidebarContent, TopBarLight } from "@/components/DashboardChrome";
import { FloatingPopover } from "@/components/FloatingPopover";

import { type Booking } from "@/lib/bookings";
import { useAuth } from "@/lib/auth";
import { fetchBooking, fetchRoomDistribution } from "@/lib/bookingsApi";
import { loadRoomingListFromDb, saveRoomingListToDb } from "@/lib/roomingApi";
import {
  ALLERGY_TAGS,
  DIETARY_TAGS,
  NATIONALITIES,
  ROOM_REQUEST_OPTIONS,
  ROOM_TYPES,
  UPGRADE_STATUS_META,
  type Allocation,
  type Guest,
  type RoomCategory,
  type RoomType,
  type RoomingIssue,
  type RoomingList,
  type UpgradePreference,
  type UpgradeRequest,
  type UpgradeStatus,
  allocationHasRequirements,
  allocationStatus,
  canUpgrade,
  capacityOf,
  categoryLabel,
  commonUpgradeOptions,
  distributionFor,
  type Distribution,
  guestName,
  guestRequirementSummary,
  hasRoomTypeChange,
  invalidForCategory,
  isAllergy,
  isCancelled,
  isNamed,
  labelOf,
  newGuest,
  newUpgradeRequest,
  roomingIssues,
  statsOf,
  upgradeOptionsFor,
} from "@/lib/rooming";

/* shared query definitions so the router loader can warm the cache before the
   route renders — the workspace then paints instantly from cache. */
export const bookingQueryOptions = (bookingId: string) => ({
  queryKey: ["booking", bookingId] as const,
  queryFn: () => fetchBooking(bookingId),
});

export const roomingQueryOptions = (bookingId: string, rooms?: number | null) => ({
  queryKey: ["rooming", bookingId] as const,
  queryFn: async () => {
    const dist = await fetchRoomDistribution(bookingId);
    return loadRoomingListFromDb(
      bookingId,
      Object.keys(dist).length ? (dist as Distribution) : distributionFor(bookingId, rooms ?? 12),
    );
  },
  staleTime: 5 * 60_000,
});

export const Route = createFileRoute("/rooming-list/$bookingId")({
  component: RoomingListRoute,
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
const CARD = "#142D49";
const SURFACE_2 = "#1B3B5E";
const CARD_BORDER = "rgba(255,255,255,0.10)";
const CARD_SHADOW = "0 8px 30px rgba(8,20,34,0.28)";
const BORDER = "rgba(255,255,255,0.12)";
const TEXT = "#F7F7F5"; // primary — soft off-white
const TEXT_2 = "#D9DDE0"; // secondary — light neutral grey
const MUTED = "#B8BDC2"; // micro labels / eyebrows — muted neutral grey
const GOLD = "#E7B94F"; // warm champagne — accent text/icons on navy
const GOLD_SOFT = "#E0B14A";
const GOLD_DEEP = "rgba(231,185,79,0.34)";
const GREEN = "#74D97C";
const AMBER = "#E7B94F";
const ROW = "rgba(255,255,255,0.07)";
const PANEL = "#142D49";
const NAVY = "#142D49";

/* overview header palette — cloudy off-white + muted slate blue */
const HERO_CARD_BG = "#FCFCFB"; // premium porcelain white
const STAT_BG = "#718CA2";
const STAT_TEXT = "#FFFFFF";
const STAT_HEAD = "#F7F8F8";
const STAT_TEXT_2 = "rgba(255,255,255,0.78)";
const STAT_SEP = "rgba(255,255,255,0.20)";
const STAT_SHADOW = "0 5px 10px rgba(28,48,64,0.08), 0 12px 22px rgba(28,48,64,0.10)";

/* light input-field tokens used inside the navy Guest Details panel */
const FIELD_BG = "#EEF2F6"; // soft cool off-white / very light blue-grey
const FIELD_BORDER_LIGHT = "#CBD8E3"; // very subtle cool blue-grey
const FIELD_TEXT = "#10233F"; // dark navy entered text
const FIELD_PLACEHOLDER = "#88A0B6"; // muted blue-grey placeholder
const FIELD_LABEL = "#7C93A8"; // muted blue-grey label

/* dark matte navy room-allocation card tokens — deep muted Atlantic blue */
const CARD_NAVY = "linear-gradient(180deg, #FCFBF9 0%, #FAF8F4 100%)";
const CARD_NAVY_HOVER = "linear-gradient(180deg, #FFFFFF 0%, #FCFBF9 100%)";
const RT = "#0D0D0D"; // primary ink
const RT_2 = "#2D2D2D"; // secondary ink
const RT_3 = "rgba(45,45,45,0.62)"; // micro ink
const R_BORDER = "rgba(255,255,255,0.09)";
const R_GREEN = "#0F6B4F";
const R_AMBER = "#9A6A12";
/* cancelled allocation palette — muted, never a bright warning red */
const CANCEL_ACCENT = "#A85B5B";
const CANCEL_TEXT = "#8E4A4A";
const CANCEL_EDGE =
  "linear-gradient(180deg, #C39A9A 0%, #A85B5B 100%)";

/* premium room-card sub-surfaces — slightly lighter slate blue */

const CTRL_BG = "#F5F3EE";

const CTRL_BORDER = "#E8E4DD";
const GUEST_BG = "#FFFFFF";
const GUEST_BORDER = "#E8E4DD";
const SANS_UI = '"IBM Plex Sans", "Inter", system-ui, sans-serif';
const SERIF = '"Libre Baskerville", Georgia, serif';
const GOLD_EDGE =
  "linear-gradient(180deg,#C5A059 0%,#C5A059 100%)";
const GOLD_METAL_TEXT: React.CSSProperties = {
  backgroundImage: "linear-gradient(155deg,#A96F08 0%,#E7B94F 36%,#FFE9A6 54%,#C99322 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

/* champagne metallic surfaces */
const GOLD_SURFACE =
  "linear-gradient(135deg,#A96F08 0%,#D5A12B 32%,#F0C85B 52%,#C98D17 78%,#A96F08 100%)";
const GOLD_BAR =
  "linear-gradient(90deg,#B47B10 0%,#DCA62E 38%,#F3D56A 62%,#C58A16 100%)";

const HERO_INK = "#10233F";
const HERO_INK_2 = "#4A6076";
const HERO_ACCENT = "#2C5B8C";



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
        backgroundImage: GOLD_SURFACE,
        border: "1px solid rgba(169,111,8,0.65)",
        boxShadow:
          "inset 0 1px 0 rgba(255,233,166,0.45), inset 0 -1px 0 rgba(120,78,6,0.35), 0 3px 10px rgba(120,78,6,0.28)",
        textShadow: "0 1px 1px rgba(96,62,4,0.35)",
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
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !session) {
      navigate({ to: "/auth", search: { next: `/rooming-list/${bookingId}` }, replace: true });
    }
  }, [authLoading, session, bookingId, navigate]);

  const { data: booking, isLoading } = useQuery({
    ...bookingQueryOptions(bookingId),
    enabled: Boolean(session) || authLoading,
  });

  /* no loading screen: the router keeps the previous page mounted while the
     loader warms the cache, so this only renders once data is available. */
  if (!booking) {
    if (authLoading || isLoading || !session) return null;
    throw notFound();
  }
  return <RoomingWorkspace booking={booking} />;
}


type ViewFilter = "all" | "missing" | "complete" | "dietary" | "requests" | "upgrades" | "cancelled";
type UpgradeFilter = "all" | UpgradeStatus;

function RoomingWorkspace({ booking }: { booking: Booking }) {
  const queryClient = useQueryClient();
  const [navOpen, setNavOpen] = useState(false);
  const [list, setList] = useState<RoomingList | null>(
    () => queryClient.getQueryData<RoomingList>(["rooming", booking.id]) ?? null,
  );

  const [view, setView] = useState<ViewFilter>("all");
  const [upgradeFilter, setUpgradeFilter] = useState<UpgradeFilter>("all");
  const [query, setQuery] = useState("");
  const [openGuest, setOpenGuest] = useState<{ allocationId: string | null; guestId: string } | null>(null);
  /* single source of truth for the currently selected (existing) guest while editing */
  const [editDraft, setEditDraft] = useState<Guest | null>(null);
  const [pendingGuest, setPendingGuest] = useState<{
    allocationId: string | null;
    guest: Guest;
    raw: string;
    editing: boolean;
  } | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [focusAllocation, setFocusAllocation] = useState<string | null>(null);
  const [savedLabel, setSavedLabel] = useState("Just now");
  /* ── upgrade workflow ── */
  const [upgradeMode, setUpgradeMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmUpgrade, setConfirmUpgrade] = useState<{
    category: RoomCategory;
    preference: UpgradePreference;
    note: string;
  } | null>(null);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  /* ── manage existing upgrade requests (separate workflow) ── */
  const [manageMode, setManageMode] = useState(false);
  const [manageSelected, setManageSelected] = useState<string[]>([]);
  const [confirmRemove, setConfirmRemove] = useState<string[] | null>(null);
  /* ── cancel / restore allocation ── */
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [showCancelled, setShowCancelled] = useState(false);

  const firstRender = useRef(true);


  /* allocations are generated from the confirmed booking room distribution.
     the router loader already primed this query, so it is normally instant. */
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


  /* autosave */
  useEffect(() => {
    if (!list) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      void saveRoomingListToDb({ ...list, savedAt: new Date().toISOString() })
        .then(() => setSavedLabel("Just now"))
        .catch((err) => console.error("[rooming save]", err));
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

  const matchesQuery = useCallback(
    (a: Allocation) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      const hay = [
        ...a.guests.map(guestName),
        labelOf(a.type),
        String(a.index).padStart(2, "0"),
        ...a.requests,
        isCancelled(a) ? "cancelled" : "",
        a.upgradeRequest ? categoryLabel(a.upgradeRequest.category) : "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    },
    [query],
  );

  /* the active rooming list NEVER contains cancelled allocations */
  const visible = useMemo(() => {
    if (!list) return [];
    if (view === "cancelled") return list.allocations.filter((a) => isCancelled(a) && matchesQuery(a));
    return list.allocations.filter((a) => {
      if (isCancelled(a)) return false;
      const status = allocationStatus(a);
      if (view === "complete" && status !== "complete") return false;
      if (view === "missing" && status === "complete") return false;
      if (view === "dietary" && !allocationHasRequirements(a)) return false;
      if (view === "requests" && a.requests.length === 0 && !a.upgradeRequest) return false;
      if (view === "upgrades") {
        if (!a.upgradeRequest) return false;
        if (upgradeFilter !== "all" && a.upgradeRequest.status !== upgradeFilter) return false;
      }
      return matchesQuery(a);
    });
  }, [list, view, matchesQuery, upgradeFilter]);

  /* archived allocations — kept for history, never part of any active total */
  const cancelledAllocations = useMemo(
    () => (list ? list.allocations.filter(isCancelled) : []),
    [list],
  );

  /* the Cancelled filter only exists while something is cancelled */
  useEffect(() => {
    if (view === "cancelled" && cancelledAllocations.length === 0) setView("all");
  }, [view, cancelledAllocations.length]);


  /* ── upgrade derived state ── */
  const eligible = useMemo(
    () => (list ? list.allocations.filter((a) => canUpgrade(a) && !a.upgradeRequest) : []),
    [list],
  );
  const selectedAllocations = useMemo(
    () => (list ? list.allocations.filter((a) => selected.includes(a.id)) : []),
    [list, selected],
  );
  const upgradeRequests = useMemo(
    () => (list ? list.allocations.filter((a) => a.upgradeRequest && !isCancelled(a)) : []),
    [list],
  );


  const isWithdrawable = (a: Allocation) =>
    !!a.upgradeRequest &&
    !a.upgradeRequest.appliedAt &&
    (a.upgradeRequest.status === "requested" || a.upgradeRequest.status === "price_offered");

  const selectedForWithdraw = useMemo(
    () => selectedAllocations.filter(isWithdrawable),
    [selectedAllocations],
  );
  const selectedForRequest = useMemo(
    () => selectedAllocations.filter((a) => !a.upgradeRequest),
    [selectedAllocations],
  );

  const withdrawUpgrades = useCallback(
    (ids: string[]) => {
      update((l) => ({
        ...l,
        allocations: l.allocations.map((a) => (ids.includes(a.id) ? { ...a, upgradeRequest: null } : a)),
      }));
    },
    [update],
  );

  /**
   * Cancelling a room never deletes guest data: every guest is moved intact
   * (dietary tags, requests, contact details) into the unassigned pool, and the
   * cancelled record keeps a historical, non-active note of who was assigned.
   */
  const cancelAllocation = useCallback(
    (id: string) => {
      update((l) => {
        const target = l.allocations.find((a) => a.id === id);
        const moving = target ? target.guests.filter(isNamed) : [];
        return {
          ...l,
          allocations: l.allocations.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status: "cancelled" as const,
                  upgradeRequest: null,
                  guests: [],
                  previousGuests: moving.map((g) => ({ id: g.id, name: guestName(g) })),
                }
              : a,
          ),
          unassigned: [...l.unassigned, ...moving],
        };
      });
      setSelected((s) => s.filter((x) => x !== id));
      setManageSelected((s) => s.filter((x) => x !== id));
      setConfirmCancel(null);
    },
    [update],
  );



  const restoreAllocation = useCallback(
    (id: string) => {
      update((l) => ({
        ...l,
        allocations: l.allocations.map((a) => (a.id === id ? { ...a, status: "active" as const } : a)),
      }));
    },
    [update],
  );

  const toggleSelected = useCallback(


    (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    [],
  );

  const exitUpgradeMode = useCallback(() => {
    setUpgradeMode(false);
    setSelected([]);
    setConfirmUpgrade(null);
    setConfirmWithdraw(false);
  }, []);

  /* manage-existing-requests workflow (kept separate from the add workflow) */
  const exitManageMode = useCallback(() => {
    setManageMode(false);
    setManageSelected([]);
    setConfirmRemove(null);
  }, []);

  /* leaving nothing to manage — return to the normal list */
  useEffect(() => {
    if (manageMode && upgradeRequests.length === 0) exitManageMode();
  }, [manageMode, upgradeRequests.length, exitManageMode]);



  const enterManageMode = useCallback(() => {
    setUpgradeMode(false);
    setSelected([]);
    setConfirmUpgrade(null);
    setConfirmWithdraw(false);
    setManageSelected([]);
    setManageMode(true);
  }, []);

  const toggleManageSelected = useCallback(
    (id: string) => setManageSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])),
    [],
  );

  const removeUpgradeRequests = useCallback(
    (ids: string[]) => {
      withdrawUpgrades(ids);
      setManageSelected((s) => s.filter((id) => !ids.includes(id)));
      setConfirmRemove(null);
    },
    [withdrawUpgrades],
  );

  const submitUpgrades = useCallback(
    (ids: string[], category: RoomCategory, preference: UpgradePreference, note: string) => {
      update((l) => ({
        ...l,
        allocations: l.allocations.map((a) =>
          ids.includes(a.id) ? { ...a, upgradeRequest: newUpgradeRequest(category, preference, note) } : a,
        ),
      }));
    },
    [update],
  );


  /** the stored (committed) record for the currently selected existing guest */
  const selectedStored = useMemo(() => {
    if (!list || !openGuest) return null;
    if (!openGuest.allocationId) {
      const guest = list.unassigned.find((g) => g.id === openGuest.guestId);
      return guest ? { alloc: null as Allocation | null, guest } : null;
    }
    const alloc = list.allocations.find((a) => a.id === openGuest.allocationId) ?? null;
    const guest = alloc?.guests.find((g) => g.id === openGuest.guestId) ?? null;
    return alloc && guest ? { alloc, guest } : null;
  }, [list, openGuest]);

  /* load the selected guest into the shared draft whenever the selection changes */
  const selectedKey = openGuest ? `${openGuest.allocationId ?? "none"}:${openGuest.guestId}` : null;
  const loadedKey = useRef<string | null>(null);
  useEffect(() => {
    if (!selectedKey || !selectedStored) {
      loadedKey.current = null;
      setEditDraft(null);
      return;
    }
    if (loadedKey.current !== selectedKey) {
      loadedKey.current = selectedKey;
      setEditDraft(selectedStored.guest);
    }
  }, [selectedKey, selectedStored]);

  /** the live draft for the selected guest (falls back to the stored record) */
  const liveGuest = useMemo(() => {
    if (!selectedStored) return null;
    return editDraft && editDraft.id === selectedStored.guest.id ? editDraft : selectedStored.guest;
  }, [editDraft, selectedStored]);

  const drawerGuest = useMemo(() => {
    if (!list) return null;
    if (pendingGuest) {
      const alloc = pendingGuest.allocationId
        ? (list.allocations.find((a) => a.id === pendingGuest.allocationId) ?? null)
        : null;
      return { alloc, guest: pendingGuest.guest, isNew: true };
    }
    if (!selectedStored || !liveGuest) return null;
    return { alloc: selectedStored.alloc, guest: liveGuest, isNew: false };
  }, [list, pendingGuest, selectedStored, liveGuest]);

  const issues = useMemo(() => (list ? roomingIssues(list) : []), [list]);

  if (!list || !stats) {
    return null;
  }


  const nights = booking.nights;

  return (
    <div
      className="hgb-route-in min-h-screen"
      style={{
        backgroundColor: "#EEF3F6",
        backgroundImage:
          "linear-gradient(180deg, #F1F5F7 0%, #EDF2F5 45%, #E9EFF3 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <style>{`@keyframes hgbFade{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
      @keyframes hgbSlide{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}
      .hgb-row{background:${CARD_NAVY} !important;background-color:#FCFBF9 !important;opacity:1 !important;transition:transform 200ms ease,box-shadow 200ms ease,background 300ms ease,border-color 300ms ease}
      .hgb-row[data-selected="true"]{background:linear-gradient(0deg, rgba(197,160,89,0.07), rgba(197,160,89,0.07)), ${CARD_NAVY} !important}
      .hgb-row:hover{background:${CARD_NAVY_HOVER} !important;border-color:#C5A059 !important;box-shadow:0 4px 14px rgba(45,45,45,0.07) !important}
      .hgb-row:hover .hgb-menu,.hgb-row:hover .hgb-req{opacity:1}
      .hgb-cell{border-top:1px solid rgba(232,228,221,0.8)}
      @media(min-width:1024px){.hgb-cell{border-top:none;border-left:1px solid rgba(232,228,221,0.9)}}
      .hgb-inline::placeholder{color:rgba(45,45,45,0.42)}
      .hgb-inline:focus{border-color:#C5A059 !important}
      .hgb-search::placeholder{color:#B8BDC2}
      .hgb-guest{transition:background-color 150ms ease,border-color 150ms ease}
      .hgb-guest:not([data-guest-selected="true"]):hover{background-color:#F5F3EE !important;border-color:#C5A059 !important}
      .hgb-guest[data-guest-selected="true"] .hgb-edit{opacity:0.85}
      .hgb-guest .hgb-edit{opacity:0;transition:opacity 150ms ease}
      .hgb-guest:hover .hgb-edit{opacity:0.75}`}</style>


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
              search={{ tab: "Rooming List" }}
              params={{ bookingId: booking.id }}
              className="inline-flex items-center gap-2 text-[13.5px] font-medium transition-opacity hover:opacity-80"
              style={{ color: HERO_ACCENT }}
            >
              <ArrowLeft size={16} />
              Back to rooming workspace
            </Link>

          }
        />

        <div className="mx-auto flex w-full max-w-[1560px] items-start gap-4 px-4 pb-5 pt-2.5 sm:px-6 lg:px-7">
          <main className="min-w-0 flex-1">

            {/* ── booking + rooming overview card ── */}
            <section
              className="relative overflow-visible rounded-[17px] px-5 py-5 sm:px-6"
              style={{
                backgroundColor: HERO_CARD_BG,
                backgroundImage:
                  "linear-gradient(180deg, #FCFCFB 0%, #FAFBFA 55%, #F8F9F8 100%)",
                border: "1px solid rgba(65,82,96,0.08)",
                boxShadow:
                  "0 2px 4px rgba(15,32,48,0.05), 0 10px 24px rgba(15,32,48,0.10), 0 22px 50px rgba(15,32,48,0.08), inset 0 1px 0 rgba(255,255,255,0.75)",
              }}
            >
              {/* row 1 — badges + actions */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-[6px] px-2.5 py-[5px] text-[10.5px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: HERO_INK_2, backgroundColor: "rgba(128,154,180,0.20)" }}
                  >
                    {booking.type === "leisure" ? "Leisure" : "M&E"}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-[5px] text-[10.5px] font-semibold uppercase tracking-[0.16em]"
                    style={
                      locked
                        ? { color: "#2F7C47", backgroundColor: "rgba(62,155,87,0.14)" }
                        : { color: "#9A7113", backgroundColor: "rgba(231,185,79,0.22)" }
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

                {!locked && (
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowImport(true)}
                      className="inline-flex items-center gap-2 rounded-[9px] px-4 py-[10px] text-[13px] font-medium transition-colors hover:bg-[rgba(16,35,63,0.04)]"
                      style={{ color: HERO_INK, backgroundColor: "#FFFFFF", border: "1px solid rgba(16,35,63,0.14)" }}
                    >
                      <Upload size={14} style={{ color: HERO_INK_2 }} />
                      Import file
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (upgradeMode) {
                          exitUpgradeMode();
                          return;
                        }
                        exitManageMode();
                        setUpgradeMode(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-[9px] px-4 py-[10px] text-[13px] font-medium transition-colors hover:bg-[rgba(16,35,63,0.04)]"
                      style={{
                        color: HERO_INK,
                        backgroundColor: upgradeMode ? "rgba(231,185,79,0.14)" : "#FFFFFF",
                        border: `1px solid ${upgradeMode ? "rgba(169,111,8,0.45)" : "rgba(16,35,63,0.14)"}`,
                      }}
                    >
                      <ArrowUp size={14} style={{ color: HERO_INK_2 }} />
                      {upgradeMode ? "Exit upgrade mode" : "Upgrade rooms"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const target = list.allocations.find(
                          (a) => a.guests.filter(isNamed).length < capacityOf(a.type, a.occupancy),
                        );
                        if (target) setFocusAllocation(target.id);
                      }}
                      className="inline-flex items-center gap-2 rounded-[9px] px-4 py-[10px] text-[13px] font-medium transition-colors hover:bg-[rgba(231,185,79,0.10)]"
                      style={{
                        color: "#9A7113",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid rgba(169,111,8,0.42)",
                      }}
                    >
                      Add guest
                      <Plus size={14} style={{ color: "#B47B10" }} />
                    </button>
                    <GoldButton onClick={() => void saveRoomingListToDb(list)}>
                      <Download size={14} />
                      Save
                    </GoldButton>
                  </div>
                )}
              </div>

              {/* title */}
              <h1
                className="mt-3.5 text-[30px] leading-[1.05] tracking-[-0.005em]"
                style={{ color: HERO_INK, fontFamily: SERIF }}
              >
                {booking.name}
              </h1>

              {/* meta */}
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px]" style={{ color: HERO_INK_2 }}>
                {booking.hotel && (
                  <>
                    <span className="inline-flex items-center gap-2">
                      <MapPin size={13} style={{ color: HERO_ACCENT }} />
                      {booking.hotel}
                    </span>
                    <span style={{ color: "rgba(16,35,63,0.28)" }}>·</span>
                  </>
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
                <span style={{ color: "rgba(16,35,63,0.28)" }}>·</span>
                <span className="inline-flex items-center gap-2">
                  <Clock size={13} style={{ color: HERO_ACCENT }} />
                  {nights} nights
                </span>
                <span style={{ color: "rgba(16,35,63,0.28)" }}>·</span>
                <span className="inline-flex items-center gap-2">
                  <Bed size={13} style={{ color: HERO_ACCENT }} />
                  {stats.totalAllocations} rooms
                </span>
                <span style={{ color: "rgba(16,35,63,0.28)" }}>·</span>
                <span className="inline-flex items-center gap-2">
                  <Users size={13} style={{ color: HERO_ACCENT }} />
                  {stats.totalSlots} guests
                </span>
              </div>

              {locked ? (
                <div
                  className="mt-4 overflow-hidden rounded-[13px]"
                  style={{ backgroundColor: PANEL, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
                >
                  <SubmittedBanner list={list} stats={stats} onRequestChange={() => setShowReview(true)} />
                </div>
              ) : (
                <>
                  {/* ── navy stat panels ── */}
                  <div className="mt-4 flex flex-col gap-3.5 lg:flex-row lg:items-stretch">
                    {/* main panel */}
                    <div
                      className="flex flex-1 flex-wrap items-center gap-y-4 rounded-[14px] px-6 py-5"
                      style={{ backgroundColor: STAT_BG, border: `1px solid ${STAT_SEP}`, boxShadow: STAT_SHADOW }}
                    >
                      <div className="min-w-[186px] pr-5">
                        <p
                          className="text-[13px] font-medium uppercase tracking-[0.22em]"
                          style={{ color: STAT_HEAD }}
                        >
                          Rooming List
                        </p>
                        <span
                          className="mt-2 block h-[2px] w-[30px] rounded-full"
                          style={{ backgroundImage: GOLD_BAR }}
                        />
                        <p className="mt-3 text-[12.5px]" style={{ color: STAT_TEXT_2 }}>
                          {stats.filled} / {stats.totalSlots} guests added
                        </p>
                        <div className="mt-2.5 flex items-center gap-2.5">
                          <div
                            className="h-[6px] w-[140px] overflow-hidden rounded-full"
                            style={{ backgroundColor: "rgba(255,255,255,0.28)" }}
                          >
                            <div
                              className="h-full rounded-full transition-[width] duration-300 ease-out"
                              style={{
                                width: `${stats.percent}%`,
                                backgroundImage: GOLD_BAR,
                                boxShadow: "inset 0 1px 0 rgba(255,233,166,0.55)",
                              }}
                            />
                          </div>
                          <span className="text-[12.5px] font-medium" style={{ color: STAT_TEXT_2 }}>
                            {stats.percent}%
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-wrap items-stretch">
                        <div
                          className="flex flex-1 min-w-[120px] flex-col items-center justify-center px-3"
                          style={{ borderLeft: `1px solid ${STAT_SEP}` }}
                        >
                          <span className="flex items-center gap-2.5">
                            <Bed size={20} style={{ color: "#F0CE7C" }} />
                            <span className="text-[27px] font-semibold leading-none" style={{ color: STAT_TEXT }}>
                              {stats.totalAllocations}
                            </span>
                          </span>
                          <p className="mt-2.5 whitespace-nowrap text-[10.5px] uppercase tracking-[0.14em]" style={{ color: STAT_TEXT_2 }}>
                            Total rooms
                          </p>
                        </div>
                        {stats.byType.map((t) => (
                          <div
                            key={t.type}
                            className="flex flex-1 min-w-[92px] flex-col items-center justify-center px-2"
                            style={{ borderLeft: `1px solid ${STAT_SEP}` }}
                          >
                            <span className="flex items-center gap-2">
                              <Users size={17} style={{ color: "rgba(255,255,255,0.72)" }} />
                              <span className="text-[24px] font-semibold leading-none" style={{ color: STAT_TEXT }}>
                                {t.count}
                              </span>
                            </span>
                            <p className="mt-2.5 whitespace-nowrap text-[10.5px] uppercase tracking-[0.14em]" style={{ color: STAT_TEXT_2 }}>
                              {t.label}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* status panel */}
                    <div
                      className="flex items-stretch rounded-[14px] px-2 py-5 lg:w-[300px]"
                      style={{ backgroundColor: STAT_BG, border: `1px solid ${STAT_SEP}`, boxShadow: STAT_SHADOW }}
                    >
                      <div className="flex flex-1 flex-col items-center justify-center px-3">
                        <span className="flex items-center gap-2">
                          <AlertTriangle size={17} style={{ color: "#F5D98F" }} />
                          <span className="text-[24px] font-semibold leading-none" style={{ color: "#F5D98F" }}>
                            {stats.missing}
                          </span>
                        </span>
                        <p className="mt-2.5 whitespace-nowrap text-[10.5px] uppercase tracking-[0.14em]" style={{ color: STAT_TEXT_2 }}>
                          Missing guests
                        </p>
                      </div>
                      <div
                        className="flex flex-1 flex-col items-center justify-center px-3"
                        style={{ borderLeft: `1px solid ${STAT_SEP}` }}
                      >
                        <span className="flex items-center gap-2">
                          <CheckCircle2 size={17} style={{ color: GREEN }} />
                          <span className="text-[24px] font-semibold leading-none" style={{ color: GREEN }}>
                            {stats.completeAllocations}
                          </span>
                        </span>
                        <p className="mt-2.5 whitespace-nowrap text-[10.5px] uppercase tracking-[0.14em]" style={{ color: STAT_TEXT_2 }}>
                          Complete
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── filters row ── */}
                  <div
                    className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2.5 pt-4"
                    style={{ borderTop: "1px solid rgba(16,35,63,0.10)" }}
                  >
                    <span className="text-[13.5px] font-medium" style={{ color: HERO_INK_2 }}>
                      View:
                    </span>
                    <div
                      className="ml-[4px] flex items-stretch overflow-hidden rounded-[10px]"
                      style={{
                        backgroundColor: "#FDFEFE",
                        border: "1px solid #D8E0E7",
                        height: 41,
                        boxShadow: "0 1px 3px rgba(15, 23, 42, 0.03)",
                      }}
                    >
                      {(cancelledAllocations.length > 0
                        ? (["all", "missing", "complete", "cancelled"] as ViewFilter[])
                        : (["all", "missing", "complete"] as ViewFilter[])
                      ).map((v, i) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setView(v)}
                          className="flex items-center justify-center px-5 text-[13.5px] capitalize transition-colors"
                          style={
                            view === v
                              ? {
                                  color: "#8A6A1C",
                                  fontWeight: 600,
                                  backgroundColor: "#FBF4E5",
                                  boxShadow: "inset 0 0 0 1px #D6AD55",
                                  borderRadius: i === 0 ? "10px 0 0 10px" : 0,
                                  borderLeft: i === 0 ? undefined : "1px solid transparent",
                                }
                              : {
                                  color: "#34495E",
                                  fontWeight: 500,
                                  borderLeft: i === 0 ? undefined : "1px solid #E1E6EB",
                                }
                          }
                          onMouseEnter={(e) => {
                            if (view !== v) e.currentTarget.style.backgroundColor = "rgba(40, 75, 105, 0.04)";
                          }}
                          onMouseLeave={(e) => {
                            if (view !== v) e.currentTarget.style.backgroundColor = "transparent";
                          }}
                        >
                          {v}
                        </button>
                      ))}
                      <SecondaryFilterMenu view={view} onChange={setView} />
                    </div>

                    <span className="mx-1.5 inline-block w-px" style={{ height: 24, backgroundColor: "#D8E0E7" }} />

                    <button
                      type="button"
                      onClick={() => setShowGroup(true)}
                      className="inline-flex items-center gap-2 rounded-[10px] px-4 text-[13.5px] transition-colors hover:bg-[rgba(40,75,105,0.04)]"
                      style={{
                        color: "#34495E",
                        height: 41,
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #D8E0E7",
                      }}
                    >
                      <Users size={15} strokeWidth={1.7} />
                      Group requests
                      {list.groupRequests.length > 0 && (
                        <span
                          className="rounded-full px-1.5 text-[10.5px]"
                          style={{ backgroundColor: "rgba(231,185,79,0.22)", color: "#9A7113" }}
                        >
                          {list.groupRequests.length}
                        </span>
                      )}
                    </button>


                    {upgradeRequests.length > 0 && (
                      <button
                        type="button"
                        title="Manage upgrade requests"
                        onClick={() => {
                          if (manageMode) {
                            exitManageMode();
                            return;
                          }
                          setView("upgrades");
                          setUpgradeFilter("all");
                          enterManageMode();
                        }}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-[8px] px-3 py-[7px] text-[12px] transition-colors hover:bg-[rgba(231,185,79,0.12)]"
                        style={{
                          color: "#9A7113",
                          backgroundColor: manageMode || view === "upgrades" ? "rgba(231,185,79,0.16)" : "transparent",
                          border: `1px solid ${manageMode || view === "upgrades" ? "rgba(169,111,8,0.42)" : "rgba(16,35,63,0.14)"}`,
                        }}
                      >
                        <ArrowUp size={12} />
                        {upgradeRequests.length} upgrade request{upgradeRequests.length === 1 ? "" : "s"}
                      </button>
                    )}

                    <label
                      className="ml-auto flex items-center gap-2 rounded-[9px] px-4 py-[9px]"
                      style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(16,35,63,0.14)" }}
                    >
                      <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search guests..."
                        className="hgb-search-light w-[190px] bg-transparent text-[12.5px] outline-none"
                        style={{ color: HERO_INK }}
                      />
                      <Search size={15} style={{ color: HERO_INK_2 }} />
                    </label>
                  </div>


                  {/* upgrade status sub-filter */}
                  {view === "upgrades" && upgradeRequests.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 px-5 pb-3.5">
                      <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                        Upgrades
                      </span>
                      {(["all", "requested", "price_offered", "approved", "declined"] as UpgradeFilter[]).map((f) => {
                        const count =
                          f === "all"
                            ? upgradeRequests.length
                            : upgradeRequests.filter((a) => a.upgradeRequest?.status === f).length;
                        const label = f === "all" ? "All upgrades" : UPGRADE_STATUS_META[f].label;
                        const on = upgradeFilter === f;
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setUpgradeFilter(f)}
                            className="rounded-[7px] px-2.5 py-[5px] text-[11.5px] transition-colors"
                            style={{
                              color: on ? GOLD : TEXT_2,
                              backgroundColor: on ? SURFACE_2 : "transparent",
                              border: `1px solid ${on ? GOLD_DEEP : BORDER}`,
                            }}
                          >
                            {label} · {count}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* upgrade mode panel */}
                  {upgradeMode && (
                    <UpgradeModePanel
                      allocations={list.allocations}
                      eligible={eligible}
                      selected={selected}
                      selectedForRequest={selectedForRequest}
                      selectedForWithdraw={selectedForWithdraw}
                      onSelectAll={(on) => setSelected(on ? eligible.map((a) => a.id) : [])}
                      onCancel={exitUpgradeMode}
                      onWithdraw={() => setConfirmWithdraw(true)}
                      onRequest={(category, preference, note) => setConfirmUpgrade({ category, preference, note })}
                    />

                  )}

                  {/* manage existing upgrade requests panel */}
                  {manageMode && upgradeRequests.length > 0 && (
                    <ManageUpgradesPanel
                      requests={upgradeRequests}
                      selected={manageSelected}
                      onSelectAll={(on) => setManageSelected(on ? upgradeRequests.map((a) => a.id) : [])}
                      onRemove={() => setConfirmRemove(manageSelected)}
                      onDone={exitManageMode}
                    />
                  )}
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

            <div className="pt-3" />



            {/* column headers */}
            {/* ── decorative paper sheet + navy backing board (visual only) ── */}
            <div className="hgb-doc-board">
              <div className="hgb-doc-paper">
                <span className="hgb-binder-clip" aria-hidden="true">
                  <svg width="50" height="54" viewBox="0 0 50 54" fill="none">
                    <defs>
                      <linearGradient id="hgbClipBody" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D1AC5A" />
                        <stop offset="38%" stopColor="#B58A35" />
                        <stop offset="100%" stopColor="#8C6928" />
                      </linearGradient>
                      <linearGradient id="hgbClipWire" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#E0C283" />
                        <stop offset="100%" stopColor="#8C6928" />
                      </linearGradient>
                    </defs>
                    <path d="M14 24 C14 10, 22 6, 25 6" stroke="url(#hgbClipWire)" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M36 24 C36 10, 28 6, 25 6" stroke="url(#hgbClipWire)" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <rect x="2" y="22" width="46" height="27" rx="4" fill="url(#hgbClipBody)" />
                    <rect x="2.5" y="22.5" width="45" height="26" rx="3.5" stroke="rgba(60,42,10,0.55)" fill="none" />
                    <rect x="5" y="24.5" width="40" height="2" rx="1" fill="rgba(255,241,208,0.5)" />
                    <rect x="5" y="45" width="40" height="2" rx="1" fill="rgba(50,35,8,0.35)" />
                  </svg>
                </span>
                <span className="hgb-paper-fold" aria-hidden="true" />

            {/* column headers */}
            <div className="hidden lg:grid lg:[grid-template-columns:24%_36%_22%_14%_4%] px-0 pb-[7px]">

              {[
                { label: "Allocation", cls: "pl-5 pr-2" },
                { label: "Guests", cls: "px-4" },
                { label: "Room request", cls: "px-4" },
                { label: "Status", cls: "px-4" },
              ].map((h) => (
                <span
                  key={h.label}
                  className={`${h.cls} text-[12px] font-semibold uppercase leading-[15px] tracking-[0.16em]`}
                  style={{ color: "rgba(45,45,45,0.55)", fontFamily: SANS_UI }}
                >
                  {h.label}
                </span>
              ))}
              <span />
            </div>

            {/* allocation cards */}
            <div className="space-y-[8px]">
                {visible.map((a) => (
                  <AllocationRow
                    key={a.id}
                    allocation={a}
                    locked={locked}
                    active={openGuest?.allocationId === a.id || pendingGuest?.allocationId === a.id}
                    openGuestId={openGuest?.allocationId === a.id ? openGuest.guestId : null}
                    guestDraft={openGuest?.allocationId === a.id ? liveGuest : null}
                    onGuestDraftName={(guestId, name) =>
                      setEditDraft((d) => (d && d.id === guestId ? { ...d, ...splitName(name) } : d))
                    }
                    autoFocus={focusAllocation === a.id}
                    onAutoFocused={() => setFocusAllocation(null)}
                    upgradeMode={upgradeMode}
                    manageMode={manageMode}
                    selected={manageMode ? manageSelected.includes(a.id) : selected.includes(a.id)}
                    onToggleSelected={() => (manageMode ? toggleManageSelected(a.id) : toggleSelected(a.id))}
                    onRemoveUpgrade={() => setConfirmRemove([a.id])}
                    rowSelected={selectedRow === a.id}
                    onSelectRow={() => setSelectedRow((s) => (s === a.id ? null : a.id))}
                    onCancelAllocation={() => setConfirmCancel(a.id)}
                    onRestoreAllocation={() => restoreAllocation(a.id)}
                    showRequirementDetail={view === "dietary"}
                    onPatch={(fn) => patchAllocation(a.id, fn)}
                    onOpenGuest={(guestId) => {
                      setPendingGuest(null);
                      setOpenGuest({ allocationId: a.id, guestId });
                    }}
                    onAddGuest={() => {
                      setOpenGuest(null);
                      setPendingGuest({ allocationId: a.id, guest: newGuest(), raw: "", editing: true });
                    }}
                    pending={
                      pendingGuest?.allocationId === a.id
                        ? { raw: pendingGuest.raw, editing: pendingGuest.editing }
                        : null
                    }
                    onPendingNameChange={(v) =>
                      setPendingGuest((p) => (p ? { ...p, raw: v, guest: { ...p.guest, ...splitName(v) } } : p))
                    }
                    onPendingConfirm={() => {
                      const p = pendingGuest;
                      if (!p || p.allocationId !== a.id || !p.raw.trim()) return;
                      const committed: Guest = { ...p.guest, ...splitName(p.raw) };
                      /* append only — never touches existing guests */
                      patchAllocation(a.id, (al) => ({ ...al, guests: [...al.guests, committed] }));
                      setPendingGuest(null);
                      setOpenGuest({ allocationId: a.id, guestId: committed.id });
                    }}

                    onPendingEdit={() => setPendingGuest((p) => (p ? { ...p, editing: true } : p))}
                    onPendingCancel={() => {
                      setPendingGuest(null);
                      setOpenGuest(null);
                    }}
                    onRenameGuest={(guestId, name) => {
                      patchAllocation(a.id, (al) => ({
                        ...al,
                        guests: al.guests.map((g) =>
                          g.id === guestId ? { ...g, ...splitName(name) } : g,
                        ),
                      }));
                    }}
                    onRemoveGuest={(guestId) => {
                      patchAllocation(a.id, (al) => ({ ...al, guests: al.guests.filter((g) => g.id !== guestId) }));
                      setOpenGuest((o) => (o?.guestId === guestId ? null : o));
                    }}


                  />
                ))}
                {visible.length === 0 && (
                  <p className="px-2 py-8 text-center text-[13px]" style={{ color: MUTED }}>
                    No allocations match this filter.
                  </p>
                )}
              </div>
              </div>
            </div>



            {/* ── archived: cancelled allocations (collapsed by default) ── */}
            {view !== "cancelled" && cancelledAllocations.length > 0 && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowCancelled((s) => !s)}
                  className="flex w-full items-center gap-3 rounded-[10px] px-4 py-[10px] text-left transition-colors"
                  style={{
                    backgroundColor: "rgba(32,58,82,0.55)",
                    border: "1px solid rgba(184,101,101,0.20)",
                  }}
                >
                  <span
                    className="text-[11.5px] font-medium uppercase tracking-[0.16em]"
                    style={{ color: CANCEL_TEXT }}
                  >
                    Cancelled allocations
                  </span>
                  <span
                    className="rounded-full px-2 py-[1px] text-[11px]"
                    style={{ backgroundColor: "rgba(184,101,101,0.16)", color: CANCEL_TEXT }}
                  >
                    {cancelledAllocations.length}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[12px]" style={{ color: MUTED }}>
                    {showCancelled ? "Hide cancelled" : "Show cancelled"}
                    <ChevronDown
                      size={14}
                      strokeWidth={2}
                      style={{ transform: showCancelled ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }}
                    />
                  </span>
                </button>

                {showCancelled && (
                  <div className="mt-2 space-y-[8px]" style={{ opacity: 0.92 }}>
                    {cancelledAllocations.map((a) => (
                      <AllocationRow
                        key={a.id}
                        allocation={a}
                        locked={locked}
                        rowSelected={selectedRow === a.id}
                        onSelectRow={() => setSelectedRow((s) => (s === a.id ? null : a.id))}
                        onRestoreAllocation={() => restoreAllocation(a.id)}
                        onPatch={(fn) => patchAllocation(a.id, fn)}
                        onOpenGuest={() => {}}
                        onAddGuest={() => {}}
                        onRemoveGuest={() => {}}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}



            {/* action bar — natural document flow, sits under the final room card */}
            <div
              className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-[12px] px-4 py-2.5"
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
              onDraftChange={
                drawerGuest.isNew
                  ? (g) =>
                      setPendingGuest((p) => {
                        if (!p) return p;
                        const joined = `${g.firstName ?? ""} ${g.lastName ?? ""}`.trim();
                        const rawChanged =
                          `${p.guest.firstName ?? ""} ${p.guest.lastName ?? ""}`.trim() !== joined;
                        return { ...p, guest: g, raw: rawChanged ? joined : p.raw };
                      })
                  : /* existing guest — the drawer edits the shared selected-guest draft */
                    (g) => setEditDraft(g)
              }
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

      {confirmUpgrade && (
        <UpgradeConfirmModal
          allocations={selectedForRequest}
          category={confirmUpgrade.category}
          preference={confirmUpgrade.preference}
          note={confirmUpgrade.note}
          onClose={() => setConfirmUpgrade(null)}
          onRemove={(id) => setSelected((s) => s.filter((x) => x !== id))}
          onRestore={(id) => setSelected((s) => (s.includes(id) ? s : [...s, id]))}
          onConfirm={() => {
            submitUpgrades(
              selectedForRequest.map((a) => a.id),
              confirmUpgrade.category,
              confirmUpgrade.preference,
              confirmUpgrade.note,
            );
            exitUpgradeMode();
          }}
        />
      )}



      {confirmRemove && confirmRemove.length > 0 && (
        <Modal
          title={confirmRemove.length === 1 ? "Remove room upgrade request?" : "Remove room upgrade requests?"}
          onClose={() => setConfirmRemove(null)}
        >
          <p className="text-[12.5px]" style={{ color: MUTED }}>
            {confirmRemove.length === 1
              ? `You're about to remove the upgrade request from Room ${String(
                  list.allocations.find((a) => a.id === confirmRemove[0])?.index ?? 0,
                ).padStart(2, "0")}.`
              : `You're about to remove upgrade requests from ${confirmRemove.length} rooms.`}{" "}
            The booked room types, categories, guests and normal room requests remain unchanged.
          </p>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmRemove(null)}
              className="rounded-[8px] px-3 py-[7px] text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.07)]"
              style={{ color: MUTED }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => removeUpgradeRequests(confirmRemove)}
              className="rounded-[8px] px-3 py-[7px] text-[12.5px] transition-colors"
              style={{
                color: "#E2A2A2",
                backgroundColor: "rgba(190,110,110,0.12)",
                border: "1px solid rgba(190,110,110,0.34)",
              }}
            >
              {confirmRemove.length === 1 ? "Remove request" : `Remove ${confirmRemove.length} requests`}
            </button>
          </div>
        </Modal>
      )}

      {confirmCancel &&
        (() => {
          const target = list?.allocations.find((a) => a.id === confirmCancel);
          if (!target) return null;
          const moving = target.guests.filter(isNamed);
          return (
            <Modal
              title={`Cancel Allocation ${String(target.index).padStart(2, "0")}?`}
              onClose={() => setConfirmCancel(null)}
            >
              <p className="text-[12.5px]" style={{ color: MUTED }}>
                This room will be removed from your active room allocation and moved to Cancelled Allocations. It
                will no longer count toward your room totals. Nothing is deleted — allocation numbers are never
                renumbered and it can be restored at any time.
              </p>
              {moving.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                    {moving.length} guest{moving.length === 1 ? "" : "s"} will move to Unassigned Guests — all
                    details kept
                  </p>

                  {moving.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-[8px] px-3 py-[7px] text-[12.5px]"
                      style={{ backgroundColor: ROW, border: `1px solid ${BORDER}`, color: TEXT_2 }}
                    >
                      {guestName(g)}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmCancel(null)}
                  className="rounded-[8px] px-3 py-[7px] text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.07)]"
                  style={{ color: MUTED }}
                >
                  Keep room
                </button>
                <button
                  type="button"
                  onClick={() => cancelAllocation(target.id)}
                  className="rounded-[8px] px-3 py-[7px] text-[12.5px] transition-colors"
                  style={{
                    color: "#E2A2A2",
                    backgroundColor: "rgba(184,101,101,0.12)",
                    border: `1px solid ${CANCEL_ACCENT}55`,
                  }}
                >
                  Cancel allocation
                </button>
              </div>
            </Modal>
          );
        })()}

      {confirmWithdraw && (
        <Modal title="Withdraw upgrade requests" onClose={() => setConfirmWithdraw(false)}>
          <p className="text-[12.5px]" style={{ color: MUTED }}>
            Withdraw upgrade requests for {selectedForWithdraw.length} room
            {selectedForWithdraw.length === 1 ? "" : "s"}? The booked room types, categories, guests and normal room
            requests remain unchanged.
          </p>
          <div className="mt-3 max-h-[180px] space-y-1.5 overflow-y-auto">
            {selectedForWithdraw.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between rounded-[8px] px-3 py-[7px] text-[12.5px]"
                style={{ backgroundColor: ROW, border: `1px solid ${BORDER}`, color: TEXT_2 }}
              >
                <span>
                  {labelOf(a.type)} {String(a.index).padStart(2, "0")} · {categoryLabel(a.bookedRoomCategory)}
                </span>
                <span style={{ color: MUTED }}>
                  {a.upgradeRequest ? `${categoryLabel(a.upgradeRequest.category)} request` : ""}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setConfirmWithdraw(false)}
              className="rounded-[8px] px-3 py-[7px] text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.07)]"
              style={{ color: MUTED }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                withdrawUpgrades(selectedForWithdraw.map((a) => a.id));
                exitUpgradeMode();
              }}
              className="rounded-[8px] px-3 py-[7px] text-[12.5px] transition-colors"
              style={{
                color: "#E2A2A2",
                backgroundColor: "rgba(190,110,110,0.12)",
                border: "1px solid rgba(190,110,110,0.34)",
              }}
            >
              Withdraw requests
            </button>
          </div>
        </Modal>
      )}

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


function splitName(v: string) {
  const parts = v.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

function AllocationRow({
  allocation,
  locked,
  active,
  openGuestId,
  guestDraft,
  onGuestDraftName,
  autoFocus,
  onAutoFocused,
  upgradeMode,
  manageMode,
  selected,
  onToggleSelected,
  onRemoveUpgrade,
  rowSelected,
  onSelectRow,
  onCancelAllocation,
  onRestoreAllocation,
  showRequirementDetail,
  onPatch,
  onOpenGuest,
  onAddGuest,
  onRemoveGuest,
  onRenameGuest,

  pending,
  onPendingNameChange,
  onPendingConfirm,
  onPendingEdit,
  onPendingCancel,
}: {
  allocation: Allocation;
  locked: boolean;
  active?: boolean;
  openGuestId?: string | null;
  /** live shared draft for the currently selected guest (single source of truth) */
  guestDraft?: Guest | null;
  onGuestDraftName?: (guestId: string, name: string) => void;
  autoFocus?: boolean;
  onAutoFocused?: () => void;
  upgradeMode?: boolean;
  manageMode?: boolean;
  selected?: boolean;
  onToggleSelected?: () => void;
  onRemoveUpgrade?: () => void;
  /** whole-row selection (independent from upgrade selection) */
  rowSelected?: boolean;
  onSelectRow?: () => void;
  onCancelAllocation?: () => void;
  onRestoreAllocation?: () => void;
  showRequirementDetail?: boolean;
  onPatch: (fn: (a: Allocation) => Allocation) => void;
  onOpenGuest: (guestId: string) => void;
  onAddGuest: () => void;
  onRemoveGuest: (guestId: string) => void;
  onRenameGuest?: (guestId: string, name: string) => void;

  /** non-null when this room has an active new-guest entry */
  pending?: { raw: string; editing: boolean } | null;
  onPendingNameChange?: (v: string) => void;
  onPendingConfirm?: () => void;
  onPendingEdit?: () => void;
  onPendingCancel?: () => void;
}) {

  const cap = capacityOf(allocation.type, allocation.occupancy);
  const named = allocation.guests.filter(isNamed);
  const status = allocationStatus(allocation);
  const [typeOpen, setTypeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const typeBtnRef = useRef<HTMLButtonElement>(null);
  const requestBtnRef = useRef<HTMLButtonElement>(null);
  const upgradeBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (autoFocus) onAutoFocused?.();
  }, [autoFocus, onAutoFocused]);


  const changeType = (t: RoomType) => {
    setTypeOpen(false);
    const nextCap = capacityOf(t);
    onPatch((a) => ({ ...a, type: t, guests: a.guests.slice(0, Math.max(nextCap, a.guests.length)) }));
  };

  /* warning compares against the ORIGINAL confirmed booking value, never the previous value */
  /* kept: underlying booking-change logic (no visual notice is rendered) */
  void hasRoomTypeChange(allocation);


  const cancelled = isCancelled(allocation);
  /* a cancelled allocation is inactive — no new edits are allowed on it */
  const readOnly = locked || cancelled;

  const upgradeEligible = canUpgrade(allocation);
  const withdrawable =
    !!allocation.upgradeRequest &&
    !allocation.upgradeRequest.appliedAt &&
    (allocation.upgradeRequest.status === "requested" ||
      allocation.upgradeRequest.status === "price_offered");
  const selectable =
    !!upgradeMode && !readOnly && ((upgradeEligible && !allocation.upgradeRequest) || withdrawable);


  const statusColor = cancelled
    ? CANCEL_TEXT
    : status === "complete"
      ? R_GREEN
      : status === "attention"
        ? R_AMBER
        : RT_3;
  const statusLabel = cancelled
    ? "Cancelled"
    : status === "complete"
      ? "Complete"
      : named.length === 0
        ? cap > 1
          ? "Missing guests"
          : "Missing guest"
        : cap - named.length > 1
          ? "Missing guests"
          : "Missing guest";

  const isActive = !!active || typeOpen || menuOpen || requestOpen || upgradeOpen;

  return (
    <div
      id={`alloc-${allocation.id}`}
      data-selected={selected ? "true" : "false"}
      className="hgb-row relative grid overflow-hidden rounded-[3px] lg:[grid-template-columns:24%_36%_22%_14%_4%]"
      style={{
        fontFamily: SANS_UI,
        backgroundColor: cancelled ? "#F7F2F0" : "#FCFBF9",
        backgroundImage: cancelled
          ? `linear-gradient(0deg, rgba(168,91,91,0.06), rgba(168,91,91,0.06)), ${CARD_NAVY}`
          : selected
            ? `linear-gradient(0deg, rgba(197,160,89,0.07), rgba(197,160,89,0.07)), ${CARD_NAVY}`
            : CARD_NAVY,
        border: cancelled
          ? "1px solid rgba(168,91,91,0.35)"
          : selected || rowSelected
            ? "1px solid #C5A059"
            : isActive
              ? "1px solid #C5A059"
              : "1px solid #E8E4DD",
        boxShadow: isActive
          ? "0 6px 18px rgba(45,45,45,0.10)"
          : "0 1px 3px rgba(45,45,45,0.06)",
        opacity: cancelled ? 0.88 : upgradeMode && !selectable && !selected ? 0.78 : 1,
      }}
    >

      {/* stationery gold left edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[3px] transition-colors duration-300"
        style={{
          backgroundImage: cancelled
            ? CANCEL_EDGE
            : status === "complete" || isActive || selected || rowSelected
              ? GOLD_EDGE
              : "linear-gradient(180deg,#E8E4DD 0%,#E8E4DD 100%)",
        }}
      />


      {/* ── ALLOCATION ── */}
      <div className="flex items-center gap-2 py-[19px] pl-5 pr-2">
        {manageMode && allocation.upgradeRequest ? (
          <RoomSelectCircle
            checked={!!selected}
            disabled={readOnly}
            onChange={() => onToggleSelected?.()}
            title="Select this upgrade request"
          />
        ) : (
          upgradeMode && (
            <RoomSelectCircle
              checked={!!selected}
              disabled={!selectable}
              onChange={() => onToggleSelected?.()}
              title={
                withdrawable
                  ? "Select to withdraw this upgrade request"
                  : allocation.upgradeRequest
                    ? "An upgrade has already been requested for this room"
                    : upgradeEligible
                      ? undefined
                      : "No higher room category available"
              }
            />
          )
        )}

        <button
          type="button"
          onClick={() => onSelectRow?.()}
          title={rowSelected ? "Deselect allocation" : "Select allocation"}
          className="w-[54px] shrink-0 text-left text-[46px] leading-none tracking-[-0.01em] outline-none"
          style={{
            color: cancelled ? CANCEL_TEXT : "#0D0D0D",
            fontFamily: SERIF,
            fontWeight: 700,
          }}
        >
          {String(allocation.index).padStart(2, "0")}
        </button>


        <div className="min-w-0 flex-1">
          <span
            className="mb-[5px] block text-[9.5px] font-bold uppercase tracking-[0.18em]"
            style={{ color: "rgba(45,45,45,0.55)" }}
          >
            Room type
          </span>
          <div
            className="relative w-full max-w-[172px] rounded-[4px] px-3 py-2.5"
            style={{
              backgroundColor: CTRL_BG,
              border: `1px solid ${CTRL_BORDER}`,
              boxShadow: "0 1px 2px rgba(45,45,45,0.04)",
            }}
          >
            <button
              ref={typeBtnRef}
              type="button"
              disabled={readOnly}
              onClick={() => setTypeOpen((v) => !v)}
              className="flex w-full items-center gap-2 text-[13.5px]"
              style={{ color: RT }}
            >
              <Bed size={15} className="shrink-0" style={{ color: "#C5A059" }} />
              <span className="min-w-0 flex-1 truncate text-left">{labelOf(allocation.type)}</span>
              {!readOnly && <ChevronDown size={14} className="shrink-0" style={{ color: RT_3 }} />}
            </button>
            <div className="mt-2 flex">
              <span
                className="inline-flex items-center rounded-full px-2.5 py-[3px] text-[9.5px] uppercase tracking-[0.18em]"
                style={{
                  color: "#8A6D2F",
                  backgroundColor: "rgba(197,160,89,0.08)",
                  border: "1px solid rgba(197,160,89,0.45)",
                }}
              >
                {categoryLabel(allocation.bookedRoomCategory)}
              </span>
            </div>
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

          {/* booking-change notice intentionally not rendered (logic preserved via hasRoomTypeChange) */}

        </div>
      </div>



      {/* ── GUESTS ── */}
      <div className="hgb-cell flex flex-col justify-center gap-[8px] px-4 py-[19px]">
        {allocation.guests.map((g) => (
          <SavedGuestRow
            key={g.id}
            guest={guestDraft && guestDraft.id === g.id ? guestDraft : g}
            locked={readOnly}
            isSelected={openGuestId === g.id}
            showRequirementDetail={showRequirementDetail}
            onOpen={() => onOpenGuest(g.id)}
            onDraftName={(name) => onGuestDraftName?.(g.id, name)}
            onRename={(name) => onRenameGuest?.(g.id, name)}
            onRemove={() => onRemoveGuest(g.id)}
          />
        ))}

        {cancelled && (allocation.previousGuests?.length ?? 0) > 0 && (
          <div className="flex flex-col gap-[5px]">
            <p className="text-[10px] uppercase tracking-[0.16em]" style={{ color: RT_3 }}>
              Previously assigned
            </p>
            {allocation.previousGuests!.map((p) => (
              <p key={p.id} className="truncate text-[12.5px]" style={{ color: RT_3, fontStyle: "italic" }}>
                {p.name}
              </p>
            ))}
            <p className="text-[10.5px]" style={{ color: RT_3, opacity: 0.75 }}>
              Moved to unassigned guests
            </p>
          </div>
        )}




        {!readOnly &&
          Array.from({ length: Math.max(0, cap - allocation.guests.length) }).map((_, i) =>
            i === 0 && pending ? (
              pending.editing ? (
                <div key={`pending-${allocation.id}`} className="flex w-full items-center gap-1.5">
                  <input
                    autoFocus
                    value={pending.raw}
                    onChange={(e) => onPendingNameChange?.(e.target.value)}
                    onKeyDownCapture={(e) => {
                      // text entry always wins over row/global shortcuts
                      e.stopPropagation();
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onPendingConfirm?.();
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        onPendingCancel?.();
                      }
                    }}
                    onKeyUpCapture={(e) => e.stopPropagation()}
                    onKeyPressCapture={(e) => e.stopPropagation()}
                    placeholder="Enter guest name..."
                    className="hgb-inline h-[42px] w-full rounded-[3px] px-3 text-[13.5px] outline-none transition-colors"
                    style={{
                      backgroundColor: GUEST_BG,
                      border: `1px solid ${GUEST_BORDER}`,
                      color: RT,
                    }}

                  />
                  <button
                    type="button"
                    aria-label="Cancel guest entry"
                    onClick={onPendingCancel}
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] transition-colors hover:bg-[rgba(168,91,91,0.10)] hover:text-[#A85B5B]"
                    style={{ color: RT_3 }}
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div
                  key={`pending-${allocation.id}`}
                  className="flex w-full items-center gap-1.5 rounded-[3px] px-2.5"
                  style={{ minHeight: 46, backgroundColor: GUEST_BG, border: `1px solid ${GUEST_BORDER}` }}
                >
                  <button
                    type="button"
                    onClick={onPendingEdit}
                    title="Click to edit name"
                    className="flex min-w-0 flex-1 items-center gap-2.5 py-2 text-left"
                  >
                    <User size={14} className="shrink-0" style={{ color: "#C5A059" }} />
                    <span className="min-w-0 truncate text-[13.5px] font-medium" style={{ color: RT }}>
                      {pending.raw}
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Cancel guest entry"
                    onClick={onPendingCancel}
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] opacity-70 transition-colors hover:bg-[rgba(168,91,91,0.10)] hover:text-[#A85B5B] hover:opacity-100"
                    style={{ color: RT_3 }}
                  >
                    <X size={13} />
                  </button>
                </div>
              )
            ) : (
              <button
                key={`slot-${allocation.id}-${allocation.guests.length + i}`}
                type="button"
                onClick={onAddGuest}
                className="flex w-fit items-center gap-1.5 px-1 py-[6px] text-left text-[12.5px] underline decoration-[#C5A059]/40 underline-offset-4 transition-colors hover:decoration-[#C5A059]"
                style={{ color: "#2D2D2D" }}
              >
                <Plus size={13} />
                <span>Add guest</span>
              </button>
            ),

          )}


      </div>

      {/* ── ROOM REQUEST ── */}
      <div className="hgb-cell relative flex flex-col justify-center px-4 py-[17px]">
        {allocation.requests.length > 0 ? (
          <div className="space-y-[3px]">
            {allocation.requests.map((r) => (
              <span key={r} className="group/req flex items-center gap-1.5 text-[12.5px]" style={{ color: RT_2 }}>
                {r}
                {!readOnly && (
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
        ) : null}


        {allocation.upgradeRequest && (
          <UpgradeIndicator
            request={allocation.upgradeRequest}
            bookedCategory={allocation.bookedRoomCategory}
            roomLabel={`Room ${String(allocation.index).padStart(2, "0")}`}
            locked={readOnly}
            onWithdraw={() => onPatch((a) => ({ ...a, upgradeRequest: null }))}
            onRequestChange={() =>
              onPatch((a) =>
                a.upgradeRequest
                  ? {
                      ...a,
                      upgradeRequest: {
                        ...a.upgradeRequest,
                        status: "requested",
                        note: [a.upgradeRequest.note, "Change requested after approval."]
                          .filter(Boolean)
                          .join(" "),
                      },
                    }
                  : a,
              )
            }

            onApply={() =>
              onPatch((a) =>
                a.upgradeRequest
                  ? {
                      ...a,
                      bookedRoomCategory: a.upgradeRequest.category,
                      upgradeRequest: { ...a.upgradeRequest, appliedAt: new Date().toISOString() },
                    }
                  : a,
              )
            }
          />
        )}

        {!readOnly && (
          <div className="mt-[6px] flex w-full flex-col items-start">
            {allocation.requests.length === 0 && (
              <button
                ref={requestBtnRef}
                type="button"
                onClick={() => setRequestOpen((v) => !v)}
                className="inline-flex w-fit items-center gap-2 py-[5px] text-[12.5px] underline decoration-[#C5A059]/40 underline-offset-4 transition-colors hover:decoration-[#C5A059]"
                style={{ color: "#2D2D2D" }}
              >
                <Plus size={13} />
                Add special request
              </button>
            )}
            {!allocation.upgradeRequest && upgradeEligible && (
              <>
                {allocation.requests.length === 0 && (
                  <span
                    className="my-[3px] block h-px w-[34px]"
                    style={{ backgroundColor: "#E8E4DD" }}
                  />
                )}
                <button
                  ref={upgradeBtnRef}
                  type="button"
                  onClick={() => setUpgradeOpen((v) => !v)}
                  className="inline-flex w-fit items-center gap-2 py-[5px] text-[12.5px] underline decoration-[#C5A059]/40 underline-offset-4 transition-colors hover:decoration-[#C5A059]"
                  style={{ color: "#2D2D2D" }}
                >
                  <Plus size={13} />
                  Request room upgrade
                </button>
              </>
            )}
          </div>
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

        <FloatingPopover anchorRef={upgradeBtnRef} open={upgradeOpen} onClose={() => setUpgradeOpen(false)} width={300}>
          <UpgradeForm
            title="Request room upgrade"
            options={upgradeOptionsFor(allocation)}
            submitLabel="Add request"
            onCancel={() => setUpgradeOpen(false)}
            onSubmit={(category, preference, note) => {
              onPatch((a) => ({ ...a, upgradeRequest: newUpgradeRequest(category, preference, note) }));
              setUpgradeOpen(false);
            }}
          />
        </FloatingPopover>

      </div>


      {/* ── STATUS ── */}
      <div className="hgb-cell flex items-center gap-3 px-4 py-[19px]">
        <span
          className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full"
          style={{
            border: `1.4px solid ${status === "complete" ? "rgba(15,107,79,0.55)" : "rgba(197,160,89,0.55)"}`,
            boxShadow:
              status === "complete"
                ? "inset 0 0 0 1px rgba(15,107,79,0.10)"
                : "none",
            color: statusColor,
          }}
        >
          {cancelled ? (
            <CircleSlash size={13} strokeWidth={2.2} />
          ) : status === "complete" ? (
            <Check size={13} strokeWidth={2.4} />
          ) : null}
        </span>
        <div className="min-w-0">
          <p
            className="truncate text-[11.5px] font-medium uppercase tracking-[0.10em]"
            style={{ color: statusColor }}
          >
            {statusLabel}
          </p>
          <p className="mt-[3px] truncate text-[11.5px]" style={{ color: RT_3 }}>
            {cancelled
              ? "Not counted in totals"
              : `${named.length} of ${cap} guest${cap > 1 ? "s" : ""} assigned`}
          </p>
        </div>
      </div>

      {/* ── MENU ── */}
      <div className="hgb-cell relative flex items-center justify-center py-[17px]">
        <button
          ref={menuBtnRef}
          type="button"
          aria-label="Allocation actions"
          onClick={() => setMenuOpen((v) => !v)}
          className="grid h-7 w-7 place-items-center rounded-[6px] opacity-70 transition-opacity duration-200 hover:opacity-100"
          style={{ color: "#C5A059" }}
        >

          <MoreVertical size={15} />
        </button>
        <FloatingPopover anchorRef={menuBtnRef} open={menuOpen} onClose={() => setMenuOpen(false)} width={190} align="end">
          {(cancelled
            ? [
                {
                  label: "Restore allocation",
                  tone: "#8FC79A",
                  run: () => onRestoreAllocation?.(),
                },
              ]
            : [
                {
                  label: "View details",
                  tone: undefined as string | undefined,
                  run: () => allocation.guests[0] && onOpenGuest(allocation.guests[0].id),
                },
                { label: "Change room type", tone: undefined, run: () => setTypeOpen(true) },
                { label: "Add room request", tone: undefined, run: () => setRequestOpen(true) },
                ...(upgradeEligible && !allocation.upgradeRequest
                  ? [{ label: "Request room upgrade", tone: undefined, run: () => setUpgradeOpen(true) }]
                  : []),
                ...(allocation.upgradeRequest
                  ? [{ label: "Remove upgrade request", tone: undefined, run: () => onRemoveUpgrade?.() }]
                  : []),
                { label: "Clear allocation", tone: undefined, run: () => onPatch((a) => ({ ...a, guests: [] })) },
                { label: "Cancel allocation", tone: CANCEL_TEXT, run: () => onCancelAllocation?.() },
              ]
          ).map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={locked}
              onClick={() => {
                item.run();
                setMenuOpen(false);
              }}
              className="block w-full px-3 py-[7px] text-left text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.07)] disabled:opacity-40"
              style={{ color: item.tone ?? "#D9DDE0" }}
            >
              {item.label}
            </button>
          ))}
        </FloatingPopover>

      </div>
    </div>
  );
}

/* ───────────────── saved guest row (with confirm-remove) ───────────────── */

function SavedGuestRow({
  guest,
  locked,
  isSelected,
  showRequirementDetail,
  onOpen,
  onDraftName,
  onRename,
  onRemove,
}: {
  guest: Guest;
  locked: boolean;
  isSelected?: boolean;
  showRequirementDetail?: boolean;
  onOpen: () => void;
  /** live (uncommitted) name change — updates the shared selected-guest draft */
  onDraftName?: (name: string) => void;
  onRename?: (name: string) => void;
  onRemove: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const req = guestRequirementSummary(guest);
  /* `guest` is already the live shared draft when this row is selected */
  const displayName = guestName(guest);
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState(displayName);
  /** name as it was when editing started — used to restore on Escape */
  const originalRef = useRef(displayName);
  /** last value this input pushed into the shared draft */
  const pushedRef = useRef(displayName);

  /* keep the inline field in sync with the shared draft (e.g. Guest Details edits) */
  useEffect(() => {
    if (!editing) {
      setRaw(displayName);
      pushedRef.current = displayName;
      return;
    }
    if (displayName !== pushedRef.current) {
      setRaw(displayName);
      pushedRef.current = displayName;
    }
  }, [displayName, editing]);

  /** one shared handler for pill click + pencil click */
  const editGuest = () => {
    onOpen();
    if (locked) return;
    originalRef.current = displayName;
    pushedRef.current = displayName;
    setRaw(displayName);
    setEditing(true);
  };
  const startEdit = editGuest;
  const setName = (v: string) => {
    setRaw(v);
    pushedRef.current = v;
    onDraftName?.(v);
  };
  const commit = () => {
    setEditing(false);
    const v = raw.trim();
    if (v && v !== originalRef.current) onRename?.(v);
  };
  const cancel = () => {
    setEditing(false);
    setRaw(originalRef.current);
    pushedRef.current = originalRef.current;
    onDraftName?.(originalRef.current);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        if (!editing) editGuest();
      }}
      onKeyDown={(e) => {
        if (!editing && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          editGuest();
        }
      }}
      data-guest-selected={isSelected ? "true" : "false"}
      className="hgb-guest flex w-full items-center gap-1.5 rounded-[3px] px-2.5 transition-colors"
      style={{
        minHeight: 46,
        cursor: "pointer",
        backgroundColor: isSelected ? "rgba(197,160,89,0.12)" : GUEST_BG,
        border: `1px solid ${isSelected ? "#C5A059" : GUEST_BORDER}`,
        boxShadow: isSelected ? "inset 0 0 0 1px rgba(197,160,89,0.20)" : undefined,
      }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5 py-2 text-left">
        <User size={14} className="shrink-0" style={{ color: "#C5A059" }} />
        {editing ? (
          <input
            autoFocus
            value={raw}
            onChange={(e) => setName(e.target.value)}
            onBlur={commit}
            onFocus={(e) => e.currentTarget.select()}
            onKeyDownCapture={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                e.preventDefault();
                commit();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                cancel();
              }
            }}
            onKeyUpCapture={(e) => e.stopPropagation()}
            onKeyPressCapture={(e) => e.stopPropagation()}
            className="hgb-inline min-w-0 flex-1 bg-transparent text-[13.5px] font-medium outline-none"
            style={{
              color: RT,
              borderBottom: "1px solid #C5A059",
              caretColor: "#8A6D2F",
            }}
          />
        ) : (
          <span
            title="Click to edit this guest"
            className="min-w-0 flex-1 truncate text-[13.5px] font-medium"
            style={{ color: RT, cursor: "pointer" }}
          >
            {displayName || "Unnamed guest"}
          </span>
        )}
        {!editing && (
          <button
            type="button"
            aria-label="Edit guest name"
            onClick={(e) => {
              e.stopPropagation();
              editGuest();
            }}
            className="hgb-edit shrink-0 bg-transparent p-0 leading-none"
          >
            <Pencil size={11} style={{ color: "#C5A059" }} />
          </button>
        )}


        {req.count > 0 && (
          <span
            title={req.tooltip}
            onClick={(e) => {
              e.stopPropagation();
              editGuest();
            }}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-[6px] px-1.5 py-[2px] text-[10.5px] leading-[15px]"
            style={
              req.hasAllergy
                ? { color: "#8A6D2F", backgroundColor: "rgba(197,160,89,0.14)", border: "1px solid rgba(197,160,89,0.40)" }
                : { color: RT_2, backgroundColor: "rgba(45,45,45,0.05)", border: "1px solid rgba(45,45,45,0.14)" }
            }
          >
            {req.hasAllergy ? <AlertTriangle size={9.5} /> : <Utensils size={9.5} />}
            {req.hasAllergy ? "Allergy" : "Dietary"}
          </span>
        )}
        {showRequirementDetail && req.count > 0 && (
          <span className="min-w-0 shrink truncate text-[11px]" style={{ color: RT_3 }}>
            {req.tooltip}
          </span>
        )}
      </div>



      {!locked && (
        <>
          <button
            ref={btnRef}
            type="button"
            aria-label={`Remove ${guestName(guest) || "guest"}`}
            onClick={(e) => {
              e.stopPropagation();
              setConfirm((v) => !v);
            }}
            className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] opacity-70 transition-colors hover:bg-[rgba(168,91,91,0.10)] hover:text-[#A85B5B] hover:opacity-100"
            style={{ color: RT_3 }}

          >
            <X size={13} />
          </button>
          <FloatingPopover anchorRef={btnRef} open={confirm} onClose={() => setConfirm(false)} width={248} align="end">
            <div className="px-3 py-2.5">
              <p className="text-[12.5px]" style={{ color: "#D9DDE0" }}>
                Remove {guestName(guest) || "this guest"} from this room?
              </p>
              <div className="mt-2.5 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirm(false)}
                  className="rounded-[6px] px-2.5 py-[5px] text-[12px] transition-colors hover:bg-[rgba(255,255,255,0.07)]"
                  style={{ color: "#B8BDC2" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirm(false);
                    onRemove();
                  }}
                  className="rounded-[6px] px-2.5 py-[5px] text-[12px] transition-colors"
                  style={{
                    color: "#E08C8C",
                    backgroundColor: "rgba(214,109,109,0.14)",
                    border: "1px solid rgba(214,109,109,0.30)",
                  }}
                >
                  Remove guest
                </button>
              </div>
            </div>
          </FloatingPopover>
        </>
      )}
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
  const [showCustom, setShowCustom] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const customRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setCustom("");
      setShowCustom(false);
      const t = setTimeout(() => searchRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (showCustom) {
      const t = setTimeout(() => customRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
  }, [showCustom]);


  const match = (t: string) => t.toLowerCase().includes(q.trim().toLowerCase());
  const OTHER = "Other allergy";
  const diet = DIETARY_TAGS.filter(match);
  const allergies = ALLERGY_TAGS.filter((t) => t !== OTHER).filter(match);
  const showOtherOption = match(OTHER);

  const addCustom = () => {
    const v = custom.trim().replace(/\s+/g, " ");
    if (!v) return;
    const tag = /allerg/i.test(v) ? v : `${v} allergy`;
    const dup = selected.some((s) => s.toLowerCase() === tag.toLowerCase());
    if (!dup) onToggle(tag);
    setCustom("");
    setShowCustom(false);
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

      {showOtherOption && (
        <button
          type="button"
          onClick={() => setShowCustom(true)}
          className="flex w-full items-center justify-between px-3 py-[7px] text-left text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.07)]"
          style={{ color: showCustom ? "#F7F7F5" : AMBER }}
        >
          <span>Other allergy</span>
          <Plus size={12} style={{ color: GOLD }} />
        </button>
      )}

      {showCustom && (
        <div className="px-3 pb-3 pt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="mb-1.5 text-[10px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
            Other allergy
          </p>
          <div className="flex items-center gap-2">
            <input
              ref={customRef}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustom();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  setCustom("");
                  setShowCustom(false);
                }
              }}
              placeholder="Enter allergy..."
              className="w-full rounded-[8px] px-2.5 py-[6px] text-[12.5px] outline-none placeholder:text-[#88A0B6]"
              style={{ backgroundColor: FIELD_BG, border: `1px solid ${FIELD_BORDER_LIGHT}`, color: FIELD_TEXT }}
            />
            <button
              type="button"
              onClick={addCustom}
              disabled={!custom.trim()}
              className="rounded-[7px] px-2.5 py-[6px] text-[12px] transition-colors disabled:opacity-40"
              style={{
                color: GOLD,
                backgroundColor: "rgba(231,185,79,0.14)",
                border: "1px solid rgba(231,185,79,0.36)",
              }}
            >
              Add
            </button>
          </div>
          {custom.trim() &&
            selected.some(
              (s) =>
                s.toLowerCase() ===
                (/allerg/i.test(custom.trim()) ? custom.trim() : `${custom.trim()} allergy`).toLowerCase(),
            ) && (
              <p className="mt-1.5 text-[11px]" style={{ color: AMBER }}>
                Already added for this guest.
              </p>
            )}
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
  onDraftChange,
}: {
  allocation: Allocation | null;
  guest: Guest;
  locked: boolean;
  isNew?: boolean;
  onClose: () => void;
  onSave: (g: Guest) => void;
  onRemove: () => void;
  /** when provided the drawer is controlled — used to keep the inline row input in sync */
  onDraftChange?: (g: Guest) => void;
}) {
  const [localDraft, setLocalDraft] = useState<Guest>(guest);
  const [saved, setSaved] = useState(false);
  const [tagOpen, setTagOpen] = useState(false);
  const tagBtnRef = useRef<HTMLButtonElement>(null);

  const draft = onDraftChange ? guest : localDraft;

  const set = (patch: Partial<Guest>) => {
    if (onDraftChange) onDraftChange({ ...guest, ...patch });
    else setLocalDraft((d) => ({ ...d, ...patch }));
  };

  return (
    <aside
      className="fixed inset-0 z-40 lg:sticky lg:top-[68px] lg:z-auto lg:w-[322px] lg:shrink-0"
      style={{ animation: "hgbSlide 200ms ease-out" }}
    >
      <button aria-label="Close guest details" className="absolute inset-0 bg-black/50 lg:hidden" onClick={onClose} />
      <div
        className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col overflow-y-auto lg:static lg:h-[calc(100vh-96px)] lg:max-w-none lg:rounded-[13px]"
        style={{
          backgroundColor: "#173A5A",
          border: `1px solid ${CARD_BORDER}`,
          boxShadow: CARD_SHADOW,
        }}
      >
        <div className="flex items-center justify-between px-4 pb-2 pt-4">
          <h3 className="text-[17px]" style={{ color: TEXT, fontFamily: SERIF }}>
            {isNew ? "New guest" : "Edit guest"}
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
          <p className="text-[12.5px] font-medium" style={{ color: "#142D49" }}>
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
              style={{ color: "#E7B94F" }}
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

/* ══════════════════════════════════════════════════════════════
   Room upgrade workflow
   ══════════════════════════════════════════════════════════════ */

function UpgradeCheckbox({
  checked,
  disabled,
  onChange,
  title,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label="Select room for upgrade"
      title={title}
      disabled={disabled}
      onClick={onChange}
      className="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-[5px] transition-colors disabled:cursor-not-allowed"
      style={{
        background: checked
          ? "linear-gradient(180deg, #F4D675 0%, #D4AF37 52%, #A96F08 100%)"
          : "#FFFFFF",
        border: `1px solid ${checked ? "#C99322" : "rgba(184,134,11,0.42)"}`,
        opacity: disabled ? 0.45 : 1,
      }}
    >
      {checked && <Check size={12} strokeWidth={3} style={{ color: "#FFFFFF" }} />}

    </button>
  );
}

/** Thin circular selection control used on the premium room cards. */
function RoomSelectCircle({
  checked,
  disabled,
  onChange,
  title,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label="Select room"
      title={title}
      disabled={disabled}
      onClick={onChange}
      className="grid h-[20px] w-[20px] shrink-0 place-items-center rounded-full transition-colors disabled:cursor-not-allowed"
      style={{
        backgroundColor: checked ? "rgba(231,185,79,0.18)" : "transparent",
        border: `1.2px solid ${checked ? "rgba(230,196,122,0.85)" : "rgba(255,255,255,0.24)"}`,
        opacity: disabled ? 0.32 : 1,
      }}
    >
      {checked && <Check size={11} strokeWidth={2.6} style={{ color: "#E6C47A" }} />}
    </button>
  );
}


/** Small gold pill showing the current upgrade request state on a room card. */
/** Small confirmation popover for withdrawing / changing an upgrade request. */
function WithdrawUpgradePopover({
  anchorRef,
  open,
  onClose,
  request,
  roomLabel,
  onWithdraw,
  onRequestChange,
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  onClose: () => void;
  request: UpgradeRequest;
  roomLabel: string;
  onWithdraw: () => void;
  onRequestChange: () => void;
}) {
  const cat = categoryLabel(request.category);
  const approved = request.status === "approved";
  const declined = request.status === "declined";
  const title = approved
    ? "Upgrade already approved"
    : declined
      ? "Remove declined request?"
      : "Remove upgrade request?";
  const body = approved
    ? "This upgrade has already been approved. Changes may require review by your concierge."
    : request.status === "price_offered"
      ? `Withdraw this upgrade request and decline the current upgrade offer? ${cat} upgrade requested for ${roomLabel}.`
      : declined
        ? `The ${cat} upgrade for ${roomLabel} was declined. Removing it lets you create a new request.`
        : `${cat} upgrade requested for ${roomLabel}. This will withdraw the upgrade request. The original booked room remains unchanged.`;

  return (
    <FloatingPopover anchorRef={anchorRef} open={open} onClose={onClose} width={280} align="auto">
      <div className="px-3 py-3">
        <p className="text-[10.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
          {title}
        </p>
        <p className="mt-1.5 text-[12px] leading-snug" style={{ color: TEXT_2 }}>
          {body}
        </p>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[7px] px-2.5 py-[6px] text-[12px] transition-colors hover:bg-[rgba(255,255,255,0.07)]"
            style={{ color: MUTED }}
          >
            Cancel
          </button>
          {approved ? (
            <button
              type="button"
              onClick={onRequestChange}
              className="rounded-[7px] px-2.5 py-[6px] text-[12px] transition-colors"
              style={{
                color: GOLD,
                backgroundColor: "rgba(231,185,79,0.14)",
                border: "1px solid rgba(231,185,79,0.36)",
              }}
            >
              Request change
            </button>
          ) : (
            <button
              type="button"
              onClick={onWithdraw}
              className="rounded-[7px] px-2.5 py-[6px] text-[12px] transition-colors"
              style={{
                color: "#E2A2A2",
                backgroundColor: "rgba(190,110,110,0.12)",
                border: "1px solid rgba(190,110,110,0.34)",
              }}
            >
              {declined ? "Remove request" : "Withdraw request"}
            </button>
          )}
        </div>
      </div>
    </FloatingPopover>
  );
}

function UpgradeIndicator({

  request,
  bookedCategory,
  roomLabel,
  locked,
  onWithdraw,
  onRequestChange,
  onApply,
}: {
  request: UpgradeRequest;
  bookedCategory: RoomCategory;
  roomLabel: string;
  locked: boolean;
  onWithdraw: () => void;
  onRequestChange: () => void;
  onApply: () => void;
}) {
  const meta = UPGRADE_STATUS_META[request.status];
  const applied = Boolean(request.appliedAt);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const xRef = useRef<HTMLButtonElement>(null);
  const canRemove = !locked && !applied;

  return (
    <div className="mt-[3px] space-y-[5px]">
      <div className="group/upg flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 text-[12.5px]" style={{ color: GOLD }}>
          <ArrowUp size={12} />
          {categoryLabel(request.category)} requested
        </span>
      </div>
      <span
        className="group/pill inline-flex items-center gap-1 rounded-[5px] px-1.5 py-[1px] text-[10.5px]"
        style={{ color: meta.color, backgroundColor: meta.bg, border: `1px solid ${meta.border}` }}
      >
        {request.status === "approved" ? <Check size={9.5} /> : <Clock size={9.5} />}
        {applied ? "Upgrade applied" : meta.label}
        {canRemove && (
          <button
            ref={xRef}
            type="button"
            aria-label="Remove upgrade request"
            onClick={() => setConfirmOpen((v) => !v)}
            className="hgb-x ml-[1px] opacity-45 transition-opacity hover:opacity-100 group-hover/pill:opacity-80"
            style={{ color: "inherit" }}
          >
            <X size={9.5} />
          </button>
        )}
      </span>
      {canRemove && (
        <WithdrawUpgradePopover
          anchorRef={xRef}
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          request={request}
          roomLabel={roomLabel}
          onWithdraw={() => {
            setConfirmOpen(false);
            onWithdraw();
          }}
          onRequestChange={() => {
            setConfirmOpen(false);
            onRequestChange();
          }}
        />
      )}

      {request.status === "price_offered" && (
        <p className="text-[10.5px] leading-snug" style={{ color: "#B8BDC2" }}>
          Your concierge will share the upgrade price for approval.
        </p>
      )}
      {request.status === "approved" && !applied && !locked && (
        <button
          type="button"
          onClick={onApply}
          className="mt-[2px] rounded-[6px] px-2 py-[4px] text-[11px] transition-colors"
          style={{
            color: GOLD,
            backgroundColor: "rgba(231,185,79,0.12)",
            border: "1px solid rgba(231,185,79,0.34)",
          }}
        >
          Apply approved upgrade
        </button>
      )}
      {applied && (
        <p className="text-[10.5px]" style={{ color: "#B8BDC2" }}>
          Booked as {categoryLabel(bookedCategory)}
        </p>
      )}
    </div>
  );
}

/** Shared category + preference + note form used for single and bulk requests. */
function UpgradeForm({
  title,
  options,
  submitLabel,
  disabledReason,
  onSubmit,
  onCancel,
}: {
  title?: string;
  options: RoomCategory[];
  submitLabel: string;
  disabledReason?: string;
  onSubmit: (category: RoomCategory, preference: UpgradePreference, note: string) => void;
  onCancel?: () => void;
}) {
  const [category, setCategory] = useState<RoomCategory | null>(options[0] ?? null);
  const [preference, setPreference] = useState<UpgradePreference>("if_available");
  const [note, setNote] = useState("");
  const catRef = useRef<HTMLButtonElement>(null);
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    if (category && !options.includes(category)) setCategory(options[0] ?? null);
    if (!category && options.length) setCategory(options[0]);
  }, [options, category]);

  return (
    <div className="px-3 py-3">
      {title && (
        <p className="mb-2 text-[11px] uppercase tracking-[0.14em]" style={{ color: "#B8BDC2" }}>
          {title}
        </p>
      )}

      <label className="block text-[11px] uppercase tracking-[0.12em]" style={{ color: "#B8BDC2" }}>
        Upgrade to
      </label>
      <button
        ref={catRef}
        type="button"
        disabled={options.length === 0}
        onClick={() => setCatOpen((v) => !v)}
        className="mt-1 flex w-full items-center justify-between rounded-[8px] px-3 py-[7px] text-left text-[12.5px] disabled:opacity-50"
        style={{ backgroundColor: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.14)", color: "#F7F7F5" }}
      >
        {category ? categoryLabel(category) : "No higher category"}
        <ChevronDown size={13} style={{ color: "#B8BDC2" }} />
      </button>
      <FloatingPopover anchorRef={catRef} open={catOpen} onClose={() => setCatOpen(false)} width={220}>
        {options.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCategory(c);
              setCatOpen(false);
            }}
            className="block w-full px-3 py-[7px] text-left text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.07)]"
            style={{ color: c === category ? "#F7F7F5" : "#D9DDE0" }}
          >
            {categoryLabel(c)}
          </button>
        ))}
      </FloatingPopover>

      <p className="mt-3 text-[11px] uppercase tracking-[0.12em]" style={{ color: "#B8BDC2" }}>
        Preference
      </p>
      <div className="mt-1 space-y-1.5">
        {(
          [
            { value: "if_available", label: "Upgrade if available" },
            { value: "price", label: "Request price first" },
          ] as { value: UpgradePreference; label: string }[]
        ).map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setPreference(o.value)}
            className="flex w-full items-center gap-2 rounded-[7px] px-2.5 py-[6px] text-left text-[12.5px] transition-colors"
            style={{
              color: preference === o.value ? "#F7F7F5" : "#D9DDE0",
              backgroundColor: preference === o.value ? "rgba(231,185,79,0.12)" : "transparent",
              border: `1px solid ${preference === o.value ? "rgba(231,185,79,0.34)" : "rgba(255,255,255,0.10)"}`,
            }}
          >
            {preference === o.value ? (
              <CheckCircle2 size={13} style={{ color: GOLD }} />
            ) : (
              <Circle size={13} style={{ color: "#B8BDC2" }} />
            )}
            {o.label}
          </button>
        ))}
      </div>

      <label className="mt-3 block text-[11px] uppercase tracking-[0.12em]" style={{ color: "#B8BDC2" }}>
        Note (optional)
      </label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="e.g. Upgrade only for the VIP guests."
        className="mt-1 w-full resize-none rounded-[8px] px-3 py-2 text-[12.5px] outline-none"
        style={{ backgroundColor: "rgba(255,255,255,0.055)", border: "1px solid rgba(255,255,255,0.14)", color: "#F7F7F5" }}
      />

      {disabledReason && (
        <p className="mt-2 text-[11px] leading-snug" style={{ color: GOLD }}>
          {disabledReason}
        </p>
      )}

      <div className="mt-3 flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[7px] px-2.5 py-[6px] text-[12px] transition-colors hover:bg-[rgba(255,255,255,0.07)]"
            style={{ color: "#B8BDC2" }}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          disabled={!category}
          onClick={() => category && onSubmit(category, preference, note)}
          className="rounded-[7px] px-3 py-[6px] text-[12px] transition-colors disabled:opacity-50"
          style={{
            color: GOLD,
            backgroundColor: "rgba(231,185,79,0.14)",
            border: "1px solid rgba(231,185,79,0.36)",
          }}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

/** Bulk management of EXISTING upgrade requests (separate from the add workflow). */
function ManageUpgradesPanel({
  requests,
  selected,
  onSelectAll,
  onRemove,
  onDone,
}: {
  requests: Allocation[];
  selected: string[];
  onSelectAll: (on: boolean) => void;
  onRemove: () => void;
  onDone: () => void;
}) {
  const count = selected.filter((id) => requests.some((a) => a.id === id)).length;
  const all = requests.length > 0 && count === requests.length;
  const some = count > 0 && !all;

  return (
    <div
      className="mt-4 overflow-hidden rounded-[12px] py-[10px] pl-[26px] pr-[28px]"
      style={{
        backgroundColor: "#FDFDFC",
        boxShadow: "inset 2px 0 0 #C96F6F, 0 2px 8px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <button
          type="button"
          role="checkbox"
          aria-checked={all ? true : some ? "mixed" : false}
          aria-label="Select all upgrade requests"
          onClick={() => onSelectAll(!all)}
          className="grid h-[19px] w-[19px] shrink-0 place-items-center rounded-[5px] transition-colors"
          style={{
            background:
              count > 0
                ? "linear-gradient(180deg, #E8A4A4 0%, #C96F6F 52%, #A85050 100%)"
                : "#FFFFFF",
            border: `1px solid ${count > 0 ? "#B05858" : "rgba(176,88,88,0.42)"}`,
          }}
        >
          {all ? (
            <Check size={12} strokeWidth={3} style={{ color: "#FFFFFF" }} />
          ) : some ? (
            <span className="h-[2px] w-[9px] rounded-full" style={{ backgroundColor: "#C96F6F" }} />
          ) : null}
        </button>
        <span className="text-[14px] font-semibold" style={{ color: "#B05858" }}>
          Remove upgrades
        </span>
        <span
          aria-hidden
          className="hidden h-[28px] w-px sm:block"
          style={{ backgroundColor: "rgba(100, 122, 145, 0.22)" }}
        />
        <button
          type="button"
          onClick={() => onSelectAll(!all)}
          className="text-[14px] font-normal"
          style={{ color: "#1E3A52" }}
        >
          Select all upgrade requests
        </button>
        <span className="text-[14px]" style={{ color: "#7B8CA0" }}>
          <span className="font-semibold" style={{ color: "#1E3A52" }}>
            {count} of {requests.length}
          </span>{" "}
          selected
        </span>
        {count > 0 && (
          <>
            <span className="mx-1" style={{ color: "#A9B6C4" }}>
              •
            </span>
            <button
              type="button"
              onClick={onRemove}
              className="rounded-[8px] border border-[rgba(201,111,111,0.28)] bg-[rgba(201,111,111,0.08)] px-2.5 py-[5px] text-[14px] font-medium text-[#B05858] transition-colors hover:border-[rgba(201,111,111,0.5)] hover:bg-[rgba(201,111,111,0.16)]"
            >
              {count === 1 ? "Remove upgrade request" : `Remove upgrade requests (${count})`}
            </button>
          </>
        )}
        <button
          type="button"
          onClick={onDone}
          className="ml-auto text-[14px] font-medium text-[#1E3A52] transition-colors hover:text-[#B05858]"
        >
          {count > 0 ? "Cancel selection" : "Done"}
        </button>
      </div>
    </div>
  );
}

/** Sticky panel shown while Upgrade Mode is active. */
function UpgradeModePanel({
  allocations,
  eligible,
  selected,
  selectedForRequest,
  selectedForWithdraw,
  onSelectAll,
  onCancel,
  onWithdraw,
  onRequest,
}: {
  allocations: Allocation[];
  eligible: Allocation[];
  selected: string[];
  selectedForRequest: Allocation[];
  selectedForWithdraw: Allocation[];
  onSelectAll: (on: boolean) => void;
  onCancel: () => void;
  onWithdraw: () => void;
  onRequest: (category: RoomCategory, preference: UpgradePreference, note: string) => void;
}) {
  const allSelected = eligible.length > 0 && selected.length === eligible.length;
  const options = commonUpgradeOptions(selectedForRequest);
  const ineligible = allocations.length - eligible.length;

  return (
    <div
      className="mt-4 overflow-hidden rounded-[12px] py-[10px] pl-[26px] pr-[28px]"
      style={{
        backgroundColor: "#FDFDFC",
        boxShadow: "inset 2px 0 0 #D4AF37, 0 2px 8px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <UpgradeCheckbox checked={allSelected} onChange={() => onSelectAll(!allSelected)} />
        <span className="text-[14px] font-semibold" style={{ color: "#B8860B" }}>
          Upgrade mode
        </span>
        <span
          aria-hidden
          className="hidden h-[28px] w-px sm:block"
          style={{ backgroundColor: "rgba(100, 122, 145, 0.22)" }}
        />
        <button
          type="button"
          onClick={() => onSelectAll(!allSelected)}
          className="text-[14px] font-normal"
          style={{ color: "#1E3A52" }}
        >
          Select all eligible rooms
        </button>
        <span className="text-[14px]" style={{ color: "#7B8CA0" }}>
          <span className="font-semibold" style={{ color: "#1E3A52" }}>
            {selected.length} of {eligible.length}
          </span>{" "}
          selected
          {ineligible > 0 ? (
            <>
              <span className="mx-2" style={{ color: "#A9B6C4" }}>
                •
              </span>
              {ineligible} not eligible
            </>
          ) : null}
        </span>
        {selectedForWithdraw.length > 0 && (
          <span className="inline-flex items-center gap-2.5 text-[12px]" style={{ color: "#1E3A52" }}>
            <span style={{ color: "#7B8CA0" }}>
              {selectedForWithdraw.length} upgrade request{selectedForWithdraw.length === 1 ? "" : "s"} selected
            </span>
            <button
              type="button"
              onClick={onWithdraw}
              className="rounded-[7px] px-2.5 py-[5px] text-[12px] transition-colors"
              style={{
                color: "#A8443F",
                backgroundColor: "rgba(190,110,110,0.08)",
                border: "1px solid rgba(190,110,110,0.24)",
              }}
            >
              Withdraw selected requests
            </button>
          </span>
        )}
        <button
          type="button"
          onClick={onCancel}
          className="ml-auto text-[14px] font-medium transition-colors hover:text-[#B8860B]"
          style={{ color: "#1E3A52" }}
        >
          Exit upgrade mode
        </button>
      </div>


      {selectedForRequest.length > 0 && (
        <div
          className="mt-3 rounded-[10px]"
          style={{ backgroundColor: SURFACE_2, border: `1px solid ${GOLD_DEEP}` }}
        >
          <UpgradeForm
            title={`Upgrade ${selectedForRequest.length} room${selectedForRequest.length > 1 ? "s" : ""}`}
            options={options}
            submitLabel="Review upgrade request"
            disabledReason={
              options.length === 0
                ? "The selected rooms have no shared higher category. Adjust your selection."
                : undefined
            }
            onSubmit={onRequest}
          />
        </div>
      )}
    </div>
  );
}


/** Bulk confirmation step before submitting upgrade requests. */
function UpgradeConfirmModal({
  allocations,
  category,
  preference,
  note,
  onClose,
  onConfirm,
  onRemove,
  onRestore,
}: {
  allocations: Allocation[];
  category: RoomCategory;
  preference: UpgradePreference;
  note: string;
  onClose: () => void;
  onConfirm: () => void;
  onRemove: (id: string) => void;
  onRestore: (id: string) => void;
}) {
  const blocked = invalidForCategory(allocations, category);
  const count = allocations.length - blocked.length;
  const [undo, setUndo] = useState<{ id: string; label: string } | null>(null);

  useEffect(() => {
    if (!undo) return;
    const t = setTimeout(() => setUndo(null), 4500);
    return () => clearTimeout(t);
  }, [undo]);

  return (
    <Modal title="Confirm upgrade request" onClose={onClose}>
      <p className="text-[12.5px]" style={{ color: MUTED }}>
        This sends a request only. Your booked room types stay unchanged until an upgrade is approved and you apply it.
      </p>

      <div className="mt-3 space-y-2">
        <SummaryLine label="Rooms" value={`${count} room(s)`} />
        <SummaryLine label="Upgrade to" value={categoryLabel(category)} />
        <SummaryLine
          label="Preference"
          value={preference === "price" ? "Request price first" : "Upgrade if available"}
        />
        {note.trim() && <SummaryLine label="Note" value={note.trim()} />}
      </div>

      <div className="mt-3 max-h-[180px] space-y-1.5 overflow-y-auto">
        {allocations.map((a) => {
          const bad = blocked.includes(a);
          const label = `${labelOf(a.type)} ${String(a.index).padStart(2, "0")}`;
          return (
            <div
              key={a.id}
              className="group/upg flex items-center gap-3 rounded-[8px] px-3 py-[7px] text-[12.5px]"
              style={{ backgroundColor: ROW, border: `1px solid ${BORDER}`, color: bad ? MUTED : TEXT_2 }}
            >
              <span className="flex-1">
                {label} · {categoryLabel(a.bookedRoomCategory)}
              </span>
              <span style={{ color: bad ? MUTED : GOLD }}>
                {bad ? "Not eligible — skipped" : `→ ${categoryLabel(category)}`}
              </span>
              <button
                type="button"
                title={`Remove ${label} from this upgrade request`}
                aria-label={`Remove ${label} from this upgrade request`}
                onClick={() => {
                  onRemove(a.id);
                  setUndo({ id: a.id, label });
                }}
                className="grid h-5 w-5 shrink-0 place-items-center rounded-[5px] opacity-45 transition-all hover:bg-[rgba(214,109,109,0.16)] hover:text-[#E08C8C] hover:opacity-100 group-hover/upg:opacity-80"
                style={{ color: MUTED }}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
        {allocations.length === 0 && (
          <div
            className="rounded-[8px] px-3 py-[10px] text-center text-[12.5px]"
            style={{ backgroundColor: ROW, border: `1px solid ${BORDER}`, color: MUTED }}
          >
            0 rooms selected
          </div>
        )}
      </div>

      {undo && (
        <div className="mt-2.5 flex items-center justify-between gap-3 text-[11.5px]" style={{ color: MUTED }}>
          <span>{undo.label} removed from upgrade request.</span>
          <button
            type="button"
            onClick={() => {
              onRestore(undo.id);
              setUndo(null);
            }}
            className="underline underline-offset-2 transition-opacity hover:opacity-80"
            style={{ color: GOLD }}
          >
            Undo
          </button>
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-[8px] px-3 py-[7px] text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.07)]"
          style={{ color: MUTED }}
        >
          {count === 0 ? "Back to room selection" : "Back"}
        </button>
        <GoldButton small onClick={onConfirm} disabled={count === 0}>
          <ArrowUp size={13} /> Send upgrade request
        </GoldButton>
      </div>
    </Modal>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
        {label}
      </span>
      <span className="text-right text-[12.5px]" style={{ color: TEXT }}>
        {value}
      </span>
    </div>
  );
}

/** Extra view filters kept in a portal menu so the segmented control stays compact. */
function SecondaryFilterMenu({ view, onChange }: { view: ViewFilter; onChange: (v: ViewFilter) => void }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const extras: { value: ViewFilter; label: string }[] = [
    { value: "dietary", label: "Dietary & allergies" },
    { value: "requests", label: "Requests" },
    { value: "upgrades", label: "Upgrades" },
    
  ];
  const active = extras.find((e) => e.value === view);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center gap-1.5 px-5 text-[13.5px] transition-colors"
        style={
          active
            ? {
                color: "#8A6A1C",
                fontWeight: 600,
                backgroundColor: "#FBF4E5",
                boxShadow: "inset 0 0 0 1px #D6AD55",
                borderRadius: "0 10px 10px 0",
              }
            : { color: "#34495E", fontWeight: 500, borderLeft: "1px solid #E1E6EB" }
        }
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.backgroundColor = "rgba(40, 75, 105, 0.04)";
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        {active ? active.label : "More"}
        <ChevronDown
          size={14}
          strokeWidth={2}
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }}
        />
      </button>
      <FloatingPopover anchorRef={btnRef} open={open} onClose={() => setOpen(false)} width={210} align="start">

        {extras.map((e) => (
          <button
            key={e.value}
            type="button"
            onClick={() => {
              onChange(e.value);
              setOpen(false);
            }}
            className="block w-full px-3 py-[7px] text-left text-[12.5px] transition-colors hover:bg-[rgba(255,255,255,0.07)]"
            style={{ color: view === e.value ? "#F7F7F5" : "#D9DDE0" }}
          >
            {e.label}
          </button>
        ))}
      </FloatingPopover>
    </>
  );
}
