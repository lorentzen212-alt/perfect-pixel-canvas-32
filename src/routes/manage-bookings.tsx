import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isProfileComplete, useAuth } from "@/lib/auth";
import { readPendingRequest, clearPendingRequest } from "@/lib/pendingRequest";
import { fetchBookings, createBooking, cancelBooking } from "@/lib/bookingsApi";
import { toast } from "sonner";
import pageTextureAsset from "@/assets/limestone-texture.jpg.asset.json";
import lobbyHeroAsset from "@/assets/manage-hero-fjord-reception.png.asset.json";


import {
  Bell,
  BedDouble,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ClipboardList,
  Copy,

  Hourglass,

  LifeBuoy,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Moon,
  MoreVertical,
  Plus,
  Grid2X2,
  LayoutList,
  Search,
  Settings,
  SlidersHorizontal,
  Briefcase,
  BellRing,
  User,
  Users,
  X,
  ArrowRight,
  ArrowLeft,
  FileSignature,
  Building2,
  FileText,
  Send,
  BadgeCheck,
} from "lucide-react";
import logo from "@/assets/hotelgroupbook-logo.png.asset.json";
import sidebarAtmos from "@/assets/sidebar-navy-glow.png.asset.json";
import cardStone from "@/assets/card-stone-surface.png.asset.json";
import statStone from "@/assets/stat-card-stone.png.asset.json";

import bellAsset from "@/assets/status-proposal-bell.jpg.asset.json";
import signingAsset from "@/assets/status-awaiting-signing.png.asset.json";
import keyAsset from "@/assets/status-confirmed-key.png.asset.json";
import mountains from "@/assets/dashboard-mountains.jpg";

import cardStoneTexture from "@/assets/card-stone-texture.png.asset.json";
import workspaceStone from "@/assets/workspace-burnt-timber.jpg.asset.json";



import {
  STATUS_META,
  filterBookings,
  formatRange,
  type Booking,
  type BookingStatus,
  type DateFilter,
} from "@/lib/bookings";

export const Route = createFileRoute("/manage-bookings")({
  component: ManageBookings,
  head: () => ({
    meta: [
      { title: "Dashboard — HotelGroupBook" },
      {
        name: "description",
        content:
          "Manage every group stay and event in one calm dashboard: statuses, offers, rooming lists and documents.",
      },
      { property: "og:title", content: "Dashboard — HotelGroupBook" },
      {
        property: "og:description",
        content:
          "Manage every group stay and event in one calm dashboard: statuses, offers, rooming lists and documents.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

import {
  SIDEBAR,
  SIDEBAR_LAYERS,
  SIDE_TEXT,
  SIDE_TEXT_2,
  SIDE_MUTED,
  SIDE_LINE,
  GOLD_DEEP,
  PAGE,
  CARD,
  CARD_BORDER,
  CARD_SHADOW,
  PANEL,
  HAIRLINE,
  TEXT,
  TEXT_2,
  MUTED,
  GOLD,
  GOLD_SOFT,
  PEARL,
  RULE,
  BLUE,
  GOLD_BRUSHED,
  GOLD_BRUSHED_H,
  GREEN,
  RED,
  CHAMPAGNE,
  CHAMPAGNE_LINE,
  IVORY,
  SERIF,
  SANS,
} from "@/features/dashboard/tokens";
import {
  countryOf,
  groupOf,
  primaryAction,
  trackIndex,
  GROUP_LABEL,
  GROUP_COLOR,
  TRACK_STEPS,
  type Group,
  type DateChoice,
} from "@/features/dashboard/bookingMeta";
import { BookingCard } from "@/features/dashboard/BookingCard";
import { StatTile } from "@/features/dashboard/StatTile";
import { FilterSelect, STATUS_DOTS } from "@/features/dashboard/FilterSelect";











import { GlobalSidebar as Sidebar, RAIL_MS, RAIL_EASE } from "@/components/GlobalSidebar";


/* ── select ──────────────────────────────────────────── */

function Select<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div
      className="group relative flex-1 rounded-[11px]"
      style={{
        background: "rgba(216,222,228,0.90)",
        border: "1px solid rgba(255,255,255,0.16)",
      }}
    >
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full cursor-pointer appearance-none bg-transparent py-[10px] pl-4 pr-10 text-left text-[13.5px] outline-none"
        style={{ color: "#242A31", letterSpacing: "0.005em" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ backgroundColor: "#FBF9F4", color: "#2C3038" }}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={17}
        strokeWidth={1.8}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
        style={{ color: "#4A525B" }}
      />

    </div>
  );

}






/* ── page ────────────────────────────────────────────── */


function ManageBookings() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<Group>("all");
  const [country, setCountry] = useState<string>("all");
  const [dateChoice, setDateChoice] = useState<DateChoice>("all");
  const [view, setView] = useState<"grid" | "list">("list");
  const [scope, setScope] = useState<"active" | "cancelled" | "all">("active");
  const [navOpen, setNavOpen] = useState(false);

  /* ⌘K / Ctrl+K focuses the workspace search */
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);


  /* luxury rail: labels fade out before the width animates, and fade in after it opens */
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [railLabels, setRailLabels] = useState(true);
  const railTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => railTimers.current.forEach(clearTimeout), []);
  const toggleRail = () => {
    railTimers.current.forEach(clearTimeout);
    railTimers.current = [];
    if (railCollapsed) {
      setRailCollapsed(false);
      railTimers.current.push(setTimeout(() => setRailLabels(true), 240));
    } else {
      setRailLabels(false);
      railTimers.current.push(setTimeout(() => setRailCollapsed(true), 160));
    }
  };



  const navigate = useNavigate();
  const { session, loading: authLoading, profile, signOut } = useAuth();

  useEffect(() => {
    if (!authLoading && !session) {
      navigate({ to: "/auth", search: { next: "/manage-bookings" }, replace: true });
    }
  }, [authLoading, session, navigate]);

  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
    enabled: Boolean(session),
  });

  /* a request built before signing in is submitted automatically on arrival */
  const pendingHandled = useRef(false);
  useEffect(() => {
    if (!session || pendingHandled.current) return;
    const pending = readPendingRequest();
    if (!pending) return;
    pendingHandled.current = true;
    void createBooking(session.user.id, pending)
      .then(() => {
        clearPendingRequest();
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
      })
      .catch((err) => console.error("[pending request]", err));
  }, [session, queryClient]);

  const results = useMemo(() => {
    const dateFilter: DateFilter =
      dateChoice === "this_month" ? "all" : (dateChoice as DateFilter);
    let list = filterBookings(bookings, { query, status: "all", date: dateFilter });
    if (scope === "active") list = list.filter((b) => b.status !== "cancelled");
    if (scope === "cancelled") list = list.filter((b) => b.status === "cancelled");
    if (dateChoice === "this_month") {
      const now = new Date();
      list = list.filter((b) => {
        const d = new Date(b.startDate);
        return (
          !Number.isNaN(d.getTime()) &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    }
    if (group !== "all") list = list.filter((b) => groupOf(b) === group);
    if (country !== "all") list = list.filter((b) => countryOf(b) === country);
    return list;
  }, [bookings, query, group, country, dateChoice, scope]);

  const countryOptions = useMemo(() => {
    const set = new Set<string>();
    for (const b of bookings) {
      const c = countryOf(b);
      if (c) set.add(c);
    }
    return [
      { value: "all", label: "Country" },
      ...[...set].sort().map((c) => ({ value: c, label: c })),
    ];
  }, [bookings]);

  const counts = useMemo(() => {
    const c = { proposal: 0, awaiting: 0, confirmed: 0, attention: 0, cancelled: 0 };
    for (const b of bookings) c[groupOf(b)] += 1;
    return c;
  }, [bookings]);

  // bookings where the user must act (review a proposal, supply a rooming list, etc.)
  const needsAttention = counts.proposal + counts.attention;

  const scopeCounts = useMemo(() => {
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    return { active: bookings.length - cancelled, cancelled, all: bookings.length };
  }, [bookings]);

  const roomingTarget =
    bookings.find((b) => b.status === "rooming_list_required")?.id ?? bookings[0]?.id;




  /* upcoming stays within the next 7 days + the nearest deadlines */
  const upcoming = useMemo(() => {
    const now = Date.now();
    return bookings
      .filter((b) => b.status !== "cancelled")
      .map((b) => ({ b, t: new Date(b.startDate).getTime() }))
      .filter((x) => !Number.isNaN(x.t) && x.t >= now)
      .sort((a, z) => a.t - z.t);
  }, [bookings]);

  const next7 = useMemo(() => {
    const now = Date.now();
    const week = now + 7 * 864e5;
    return upcoming.filter((x) => x.t <= week).length;
  }, [upcoming]);




  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`.trim() || profile.email
    : (session?.user.email ?? "");
  const firstName = profile?.first_name?.trim() || displayName.split("@")[0] || "back";
  const initials =
    (profile?.first_name?.[0] ?? displayName[0] ?? "").toUpperCase() +
    (profile?.last_name?.[0] ?? "").toUpperCase();

  const notificationCount = counts.proposal + counts.attention;
  const heroImage = bookings[0]?.image ?? mountains;
  const railWidth = railCollapsed ? 76 : 240;


  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#263440",
        backgroundImage:
          "linear-gradient(180deg, #233140 0%, #263440 45%, #243341 100%)",
        fontFamily: SANS,
      }}
    >
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden lg:block"
        style={{
          width: railWidth,
          transition: `width ${RAIL_MS}ms ${RAIL_EASE}`,
        }}
      >
        <Sidebar
          active="Dashboard"
          roomingBookingId={roomingTarget}
          displayName={displayName}
          initials={initials}
          email={session?.user.email ?? ""}
          onSignOut={() => void signOut()}
          collapsed={railCollapsed}
          showLabels={railLabels}
          onToggle={toggleRail}
        />
      </aside>

      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/70"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[268px]">
            <Sidebar
              active="Dashboard"
              roomingBookingId={roomingTarget}
              displayName={displayName}
              initials={initials}
              email={session?.user.email ?? ""}
              onSignOut={() => void signOut()}
            />
            <button
              aria-label="Close navigation"
              onClick={() => setNavOpen(false)}
              className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-md"
              style={{ color: SIDE_TEXT_2 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="hgb-rail-shift" style={{ ["--rail-w" as string]: `${railWidth}px` }}>
        <main
          className="relative min-h-screen lg:pt-10"
          style={{
            backgroundColor: "#263440",
            backgroundImage:
              "linear-gradient(180deg, #233140 0px, #263440 45%, #243341 100%)",
          }}

        >
          {/* lobby hero — wide landscape photograph fading into the dashboard */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[300px] sm:h-[380px] lg:h-[440px] overflow-hidden"
          >
            <img
              src={lobbyHeroAsset.url}
              alt=""
              className="h-full w-full object-cover object-[58%_35%] sm:object-[54%_35%] lg:object-[center_35%]"
              style={{ filter: "brightness(1.09) contrast(0.94) saturate(0.96)" }}
            />
            {/* shadow lift — softens the deepest blacks without washing out */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, rgba(148,166,184,0.07) 0%, rgba(148,166,184,0.05) 100%)",
                mixBlendMode: "screen",
              }}
            />

            {/* subtle localized readability veil behind the left headline only */}
            <div
              className="absolute inset-y-0 left-0 w-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(38,52,64,0.16) 0%, rgba(38,52,64,0.06) 30%, rgba(38,52,64,0) 55%)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(38,52,64,0) 0%, rgba(38,52,64,0.08) 25%, rgba(38,52,64,0.30) 55%, rgba(38,52,64,0.70) 82%, #263440 100%)",
              }}
            />
          </div>







          <div className="relative mx-auto w-full max-w-[1580px] px-4 pb-10 pt-5 sm:px-6 lg:px-8 xl:px-10">

            {/* mobile bar */}
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <button
                type="button"
                aria-label="Open navigation"
                onClick={() => setNavOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-md"
                style={{ color: TEXT_2, border: `1px solid ${HAIRLINE}` }}
              >
                <Menu size={18} />
              </button>
              <img src={logo.url} alt="HotelGroupBook" className="h-7 w-auto" />
            </div>

            {/* hero header */}
            <header className="mt-[150px] flex items-start justify-between gap-6 sm:mt-[210px] lg:mt-[225px]">
              <div
                className="relative min-w-0 top-[-20px] lg:top-[-35px]"
                style={{ position: "relative", left: 0, textShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute"
                  style={{
                    left: -40,
                    right: -80,
                    top: -34,
                    bottom: -26,
                    background:
                      "linear-gradient(90deg, rgba(38,52,64,0.60) 0%, rgba(38,52,64,0.30) 45%, rgba(38,52,64,0) 100%)",
                    filter: "blur(6px)",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute"
                  style={{ left: 0, top: -16, width: 64, height: 2, background: "#C5A24B" }}
                />


                <h1
                  className="relative text-[34px] leading-[1.1] sm:text-[43px]"
                  style={{ color: "#FFFFFF", fontFamily: SERIF, fontWeight: 400 }}
                >
                  Welcome, {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
                </h1>
                <p className="relative mt-1.5 text-[16px]" style={{ color: "rgba(255,255,255,0.85)" }}>
                  Your groups, stays and next steps — all in one place.
                </p>
              </div>




              <div className="absolute right-4 top-6 z-10 hidden shrink-0 items-center gap-5 sm:right-6 lg:right-8 lg:-top-4 lg:flex xl:right-10">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-white/5"
                  style={{ color: "#E5E9EE" }}
                >
                  <Bell size={20} strokeWidth={1.7} />
                  {notificationCount > 0 && (
                    <span
                      className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-[4px] text-[10.5px] font-semibold"
                      style={{ backgroundColor: GOLD, color: "#20180A" }}
                    >
                      {notificationCount}
                    </span>
                  )}
                </button>

                <Link to="/account" className="flex items-center gap-3">
                  <span
                    className="grid h-11 w-11 place-items-center overflow-hidden rounded-full text-[13px] font-semibold tracking-[0.06em]"
                    style={{
                      border: "1px solid rgba(226,190,110,0.45)",
                      color: GOLD_SOFT,
                      backgroundColor: "rgba(10,18,27,0.45)",
                    }}
                  >
                    {initials || "—"}
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block truncate text-[15px]" style={{ color: "#F1EFE9" }}>
                      {displayName || "Your account"}
                    </span>
                    <span className="block truncate text-[12.5px]" style={{ color: "#A9B7C3" }}>
                      Group Coordinator
                    </span>
                  </span>
                  <ChevronDown size={18} style={{ color: "#A9B7C3" }} />
                </Link>
              </div>

              <div className="flex items-center gap-3 lg:hidden">
                <Link
                  to="/book-leisure"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px]"
                  style={{ border: `1px solid ${GOLD}88`, color: GOLD_SOFT }}
                >
                  <Plus size={15} /> New
                </Link>
              </div>
            </header>


            {/* stat tiles */}
            <section className="mt-[1px] grid grid-cols-2 items-stretch gap-3 lg:mt-[-19px] xl:grid-cols-4">
              <StatTile
                label="Awaiting response"
                count={counts.awaiting}
                icon={<Hourglass size={30} strokeWidth={1.4} />}
                active={group === "awaiting"}
                accent="#58AFFF"
                bgPos="15% center"
                footer="View bookings"
                onClick={() => setGroup(group === "awaiting" ? "all" : "awaiting")}
              />
              <StatTile
                label="Proposal ready"
                count={counts.proposal}
                icon={<FileSignature size={30} strokeWidth={1.4} />}
                action={counts.proposal > 0}
                active={group === "proposal"}
                accent="#F2B632"
                bgPos="40% center"
                footer="Review proposals"
                onClick={() => setGroup(group === "proposal" ? "all" : "proposal")}
              />
              <StatTile
                label="Confirmed"
                count={counts.confirmed}
                icon={<Check size={30} strokeWidth={1.4} />}
                active={group === "confirmed"}
                accent="#7DD59B"
                bgPos="65% center"
                footer="View bookings"
                onClick={() => setGroup(group === "confirmed" ? "all" : "confirmed")}
              />
              <StatTile
                label="Needs attention"
                count={needsAttention}
                icon={<BellRing size={30} strokeWidth={1.4} />}
                active={group === "attention"}
                action={needsAttention > 0}
                accent={needsAttention > 0 ? "#B8C1CA" : "#8C9AA6"}
                bgPos="85% center"
                footer="Review now"
                onClick={() => setGroup(group === "attention" ? "all" : "attention")}
              />

            </section>





            {!isProfileComplete(profile) && (
              <section
                className="mt-4 flex flex-col gap-3 rounded-[14px] px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
                style={{ background: PANEL, border: `1px solid ${GOLD}55` }}
              >
                <div className="min-w-0">
                  <p className="text-[14px]" style={{ color: TEXT }}>
                    Complete your profile
                  </p>
                  <p className="mt-0.5 text-[12.5px]" style={{ color: MUTED }}>
                    Add your contact details once and reuse them for future bookings.
                  </p>
                </div>
                <Link
                  to="/account"
                  className="shrink-0 rounded-lg px-4 py-2 text-center text-[12px] font-semibold uppercase tracking-[0.14em]"
                  style={{
                    background: "linear-gradient(180deg, #D9BC72 0%, #C7A34A 55%, #A9853A 100%)",
                    color: "#20180A",
                  }}
                >
                  Complete profile
                </Link>
              </section>
            )}


            {/* booking list — full width */}
            <div className="mt-[6px] lg:mt-[11px]">
            <div className="min-w-0">


            {/* bookings — premium stone workspace panel */}
            <section
              className="hgb-stone-surface relative isolate mt-[10px] overflow-hidden rounded-[22px] pt-[16px] pb-[22px] pl-[22px] pr-[22px] sm:pt-[19px] sm:pb-[26px] sm:pl-[26px] sm:pr-[26px]"
              style={{
                border: "1px solid rgba(120,116,104,0.22)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.62), inset 0 -1px 0 rgba(0,0,0,0.06), 0 26px 60px -28px rgba(6,10,15,0.62)",
              }}
            >
              {/* Rad 1 — Active / Cancelled / All */}
              <div className="mb-[8px] flex flex-wrap items-center gap-2">
                {(
                  [
                    { key: "active" as const, label: "Active Bookings", n: scopeCounts.active },
                    { key: "cancelled" as const, label: "Cancelled Bookings", n: scopeCounts.cancelled },
                    { key: "all" as const, label: "All Bookings", n: scopeCounts.all },
                  ]
                ).map(({ key, label, n }) => {
                  const on = scope === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setScope(key)}
                      className="hgb-scope-tab rounded-[10px] px-[15px] py-[8px] text-[13px] font-medium transition-all duration-200"
                      style={
                        on
                          ? {
                              backgroundColor: "#2A3442",
                              border: "1px solid rgba(255,255,255,0.10)",
                              color: "#F2F3F3",
                              boxShadow:
                                "inset 0 1px 0 rgba(255,255,255,0.07), 0 2px 5px rgba(6,20,31,0.10)",
                            }
                          : {
                              backgroundColor: "#EEEDE9",
                              border: "1px solid rgba(15,22,32,0.09)",
                              color: "#59616A",
                            }
                      }
                    >
                      {label} {n}
                    </button>
                  );
                })}
              </div>

              {/* Rad 2 — søk, filtre, visningsvalg */}
              <div className="mb-[12px] flex flex-col gap-3 md:flex-row md:items-center">
                <div
                  className="relative flex min-w-0 flex-1 items-center rounded-[11px]"
                  style={{
                    background: "rgba(255,255,255,0.52)",
                    border: "1px solid rgba(110,106,96,0.20)",
                  }}
                >
                  <Search
                    size={17}
                    strokeWidth={1.9}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "#7B786C" }}
                  />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search bookings..."
                    aria-label="Search bookings by name, destination, hotel or reference"
                    className="w-full bg-transparent py-[11px] pl-[44px] pr-4 text-[14px] outline-none"
                    style={{ color: "#2E3138" }}
                  />
                </div>

                <FilterSelect
                  label="Status filter"
                  menuWidth={196}

                  value={group}
                  onChange={setGroup}
                  options={[
                    { value: "all", label: "Status" },
                    { value: "awaiting", label: "Awaiting Response" },
                    { value: "proposal", label: "Proposal Ready" },
                    { value: "confirmed", label: "Confirmed" },
                    { value: "attention", label: "Needs Attention" },
                    { value: "cancelled", label: "Cancelled" },
                  ]}
                />
                <FilterSelect
                  label="Country filter"
                  value={country}
                  onChange={setCountry}
                  options={countryOptions}
                />
                <FilterSelect
                  label="Arrival filter"
                  value={dateChoice}
                  onChange={setDateChoice}
                  options={[
                    { value: "all", label: "Arrival" },
                    { value: "upcoming", label: "Upcoming" },
                    { value: "this_month", label: "This Month" },
                    { value: "next_90", label: "Next 3 Months" },
                    { value: "past", label: "Past Stays" },
                  ]}
                />

                <div className="flex min-w-0 items-center gap-2.5">
                  {(
                    [
                      { key: "grid" as const, icon: Grid2X2, label: "Grid view" },
                      { key: "list" as const, icon: LayoutList, label: "List view" },
                    ]
                  ).map(({ key, icon: Icon, label }) => {
                    const on = view === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-label={label}
                        aria-pressed={on}
                        onClick={() => setView(key)}
                        className="grid h-[42px] w-[44px] shrink-0 place-items-center rounded-[11px] transition-all duration-200"
                        style={
                          on
                            ? {
                                background: "rgba(255,255,255,0.72)",
                                border: "1px solid rgba(184,142,67,0.7)",
                                color: "#8A6A24",
                              }
                            : {
                                background: "rgba(255,255,255,0.42)",
                                border: "1px solid rgba(110,106,96,0.20)",
                                color: "#6B6858",
                              }
                        }
                      >
                        <Icon size={17} strokeWidth={1.9} />
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    aria-label="More filters"
                    onClick={() => {
                      setQuery("");
                      setGroup("all");
                      setCountry("all");
                      setDateChoice("all");
                    }}
                    className="grid h-[42px] w-[44px] shrink-0 place-items-center rounded-[11px]"
                    style={{
                      background: "rgba(255,255,255,0.42)",
                      border: "1px solid rgba(110,106,96,0.20)",
                      color: "#6B6858",
                    }}
                  >
                    <SlidersHorizontal size={17} strokeWidth={1.9} />
                  </button>
                </div>
              </div>



              <div
                className={
                  view === "list" ? "space-y-[14px]" : "grid grid-cols-1 gap-[14px] xl:grid-cols-2"
                }
              >

                {results.map((b) => (
                  <div key={b.id} className="hgb-card-recess">
                    <BookingCard booking={b} compact={view === "grid"} />
                  </div>

                ))}
                {results.length === 0 && (
                  <p className="py-12 text-center text-[13.5px]" style={{ color: "#C3C8CD" }}>
                    {isLoading
                      ? "Loading your bookings…"
                      : bookings.length === 0
                        ? "You have no bookings yet. Start a new request to see it here."
                        : "No bookings match your filters."}
                  </p>
                )}
              </div>

              <footer className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[12.5px]" style={{ color: "#C3C8CD" }}>
                  Can&rsquo;t find a booking?{" "}
                  <Link to="/account" style={{ color: "#E3C583" }}>
                    Contact us →
                  </Link>
                </p>
                <span className="text-[12.5px]" style={{ color: "#C3C8CD" }}>
                  Showing {results.length} of {bookings.length}
                </span>

              </footer>
            </section>
            </div>

            {/* right sidebar column removed — booking list spans full width */}

            </div>




          </div>
        </main>
      </div>
    </div>
  );
}
