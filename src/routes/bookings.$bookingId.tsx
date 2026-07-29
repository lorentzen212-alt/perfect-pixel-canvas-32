import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bed,
  Building2,
  Check,
  ChevronRight,
  Clock,
  MapPin,
  Star,
  UtensilsCrossed,
  ConciergeBell,
  Users,
  X,
  CalendarDays,
} from "lucide-react";
import { PAL, SERIF, SidebarContent, TopBar } from "@/components/DashboardChrome";
import { BOOKINGS, roomingProgress, type Booking } from "@/lib/bookings";

export const Route = createFileRoute("/bookings/$bookingId")({
  component: BookingWorkspace,
  head: () => ({
    meta: [
      { title: "Booking Workspace — HotelGroupBook" },
      {
        name: "description",
        content:
          "Manage a single group booking: stay details, hotel, rooms, dining, services and rooming list progress.",
      },
      { property: "og:title", content: "Booking Workspace — HotelGroupBook" },
      {
        property: "og:description",
        content: "Everything for one group stay in a single calm workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const {
  BG_ALT,
  CARD,
  CARD_BORDER,
  CARD_SHADOW,
  ACTION_PANEL,
  BORDER,
  TEXT,
  TEXT_2,
  MUTED,
  GOLD,
  GOLD_DEEP,
  GOLD_SOFT,
  GREEN,
} = PAL;

const TABS = ["Overview", "Rooming List", "Documents", "Activity"];

function GoldLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-opacity hover:opacity-80"
      style={{ color: GOLD_SOFT }}
    >
      {label}
      <span aria-hidden>→</span>
    </button>
  );
}

function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full"
      style={{
        backgroundColor: "rgba(12,30,42,0.55)",
        border: `1px solid rgba(199,163,74,0.22)`,
        color: GOLD,
      }}
    >
      {children}
    </span>
  );
}

function OverviewCard({
  icon,
  title,
  children,
  footer,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <article
      className="flex min-h-[196px] flex-col rounded-[10px] p-4"
      style={{ backgroundColor: CARD, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
    >
      <div className="flex items-center gap-3">
        <IconBubble>{icon}</IconBubble>
        <h3
          className="text-[12.5px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: TEXT }}
        >
          {title}
        </h3>
      </div>
      <div className="mt-3.5 flex-1 text-[13px]" style={{ color: TEXT_2 }}>
        {children}
      </div>
      {footer && <div className="mt-3 pt-1">{footer}</div>}
    </article>
  );
}

function Ring({ value, size = 78 }: { value: number; size?: number }) {
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ height: size, width: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" style={{ height: size, width: size }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="3.5"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={GOLD}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * c} ${c}`}
        />
      </svg>
      <span className="absolute text-[15px] font-medium" style={{ color: TEXT }}>
        {value}%
      </span>
    </div>
  );
}

function HeroMeta({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[13px]" style={{ color: TEXT_2 }}>
      <span style={{ color: GOLD_SOFT }}>{icon}</span>
      {label}
    </span>
  );
}

function BookingWorkspace() {
  const { bookingId } = Route.useParams();
  const booking = BOOKINGS.find((b) => b.id === bookingId || b.reference === bookingId);
  if (!booking) throw notFound();
  return <Workspace booking={booking} />;
}

function Workspace({ booking }: { booking: Booking }) {
  const [navOpen, setNavOpen] = useState(false);
  const [tab, setTab] = useState("Overview");
  const progress = roomingProgress(booking) || 72;
  const rooming = booking.rooming;

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG_ALT }}>
      <aside className="fixed inset-y-0 left-0 hidden w-[244px] lg:block">
        <SidebarContent active="Overview" />
      </aside>

      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/60"
            onClick={() => setNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[268px]">
            <SidebarContent active="Overview" />
            <button
              aria-label="Close navigation"
              onClick={() => setNavOpen(false)}
              className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-md"
              style={{ color: TEXT_2 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="lg:pl-[244px]">
        <TopBar
          onOpenNav={() => setNavOpen(true)}
          left={
            <Link
              to="/manage-bookings"
              className="inline-flex items-center gap-2 text-[13.5px] font-medium transition-opacity hover:opacity-80"
              style={{ color: GOLD_SOFT }}
            >
              <ArrowLeft size={16} />
              Back to My Bookings
            </Link>
          }
        />

        <main className="px-4 py-5 sm:px-6 lg:px-8" style={{ backgroundColor: BG_ALT }}>
          {/* ── hero ─────────────────────────────── */}
          <section
            className="relative overflow-hidden rounded-[12px]"
            style={{ border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
          >
            <img
              src={booking.image}
              alt={`${booking.destination} skyline`}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "saturate(0.95) brightness(0.95)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(23,42,56,0.94) 0%, rgba(23,42,56,0.86) 42%, rgba(26,45,60,0.62) 70%, rgba(26,45,60,0.74) 100%)",
              }}
            />
            <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
              <div className="min-w-0">
                <span
                  className="inline-flex items-center rounded px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.18em]"
                  style={{
                    color: GOLD,
                    backgroundColor: "rgba(199,163,74,0.12)",
                    border: `1px solid rgba(199,163,74,0.34)`,
                  }}
                >
                  {booking.type === "leisure" ? "Leisure" : "M&E"}
                </span>
                <h1
                  className="mt-2 text-[38px] leading-[1.05]"
                  style={{ color: TEXT, fontFamily: SERIF }}
                >
                  {booking.name}
                </h1>
                {booking.hotel && (
                  <p className="mt-2 inline-flex items-center gap-2 text-[14px]" style={{ color: TEXT_2 }}>
                    <MapPin size={15} style={{ color: GOLD_SOFT }} />
                    {booking.hotel}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                  <HeroMeta
                    icon={<CalendarDays size={14} />}
                    label={`${new Date(booking.startDate)
                      .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
                      .toUpperCase()} – ${new Date(booking.endDate)
                      .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
                      .toUpperCase()}`}
                  />
                  <HeroMeta icon={<Clock size={14} />} label={`${booking.nights} nights`} />
                  {booking.rooms != null && (
                    <HeroMeta icon={<Bed size={14} />} label={`${booking.rooms} rooms`} />
                  )}
                  {booking.guests != null && (
                    <HeroMeta icon={<Users size={14} />} label={`${booking.guests} guests`} />
                  )}
                </div>
              </div>

              <div className="grid gap-y-5 gap-x-10 sm:grid-cols-2 lg:min-w-[340px]">
                <div>
                  <p className="text-[11.5px]" style={{ color: MUTED }}>
                    Booking ID
                  </p>
                  <p className="mt-1 text-[14px]" style={{ color: TEXT }}>
                    {booking.reference}
                  </p>
                </div>
                <div>
                  <p className="text-[11.5px]" style={{ color: MUTED }}>
                    Status
                  </p>
                  <p
                    className="mt-1 inline-flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.1em]"
                    style={{ color: TEXT }}
                  >
                    <span
                      className="h-[7px] w-[7px] rounded-full"
                      style={{ backgroundColor: GREEN }}
                    />
                    Confirmed
                  </p>
                </div>
                {booking.hotelReference && (
                  <div className="sm:col-span-2" style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
                    <p className="text-[11.5px]" style={{ color: MUTED }}>
                      Hotel Reference
                    </p>
                    <p className="mt-1 text-[14px]" style={{ color: TEXT }}>
                      {booking.hotelReference}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── next action ──────────────────────── */}
          <section
            className="mt-4 flex flex-col gap-4 rounded-[10px] p-4 sm:flex-row sm:items-center"
            style={{
              backgroundColor: ACTION_PANEL,
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: CARD_SHADOW,
            }}
          >
            <Ring value={progress} />
            <div className="min-w-0 flex-1 sm:pl-2">
              <p
                className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: GOLD }}
              >
                Next Action
              </p>
              <h2 className="mt-1.5 text-[19px] font-medium" style={{ color: TEXT }}>
                Complete your Rooming List
              </h2>
              <p className="mt-1 text-[12.5px]" style={{ color: MUTED }}>
                {rooming ? `${rooming.complete} / ${rooming.total} guests complete` : "42 / 58 guests complete"}
                {"  •  Due 04 September 2026"}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[6px] px-5 py-[10px] text-[13px] font-medium transition-colors hover:bg-[rgba(199,163,74,0.10)]"
              style={{ color: GOLD_SOFT, border: `1px solid ${GOLD_DEEP}` }}
            >
              Continue Rooming List
              <span aria-hidden>→</span>
            </button>
          </section>

          {/* ── tabs ─────────────────────────────── */}
          <nav
            className="mt-5 flex items-center gap-7 overflow-x-auto"
            style={{ borderBottom: `1px solid ${BORDER}` }}
          >
            {TABS.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className="relative whitespace-nowrap pb-3 pt-1 text-[13.5px] transition-colors"
                  style={{ color: active ? TEXT : MUTED }}
                >
                  {t}
                  {active && (
                    <span
                      className="absolute inset-x-0 -bottom-px h-[2px] rounded-full"
                      style={{ backgroundColor: GOLD }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── content grid ─────────────────────── */}
          <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_364px]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <OverviewCard
                icon={<MapPin size={16} />}
                title="Stay"
                footer={<GoldLink label="Edit" />}
              >
                <p style={{ color: TEXT }}>{booking.destination}</p>
                <p className="mt-1.5">14 – 17 September 2026</p>
                <p className="mt-1">{booking.nights} nights</p>
              </OverviewCard>

              <OverviewCard icon={<Building2 size={16} />} title="Hotel">
                <p style={{ color: TEXT }}>{booking.hotel}</p>
                <p className="mt-1.5">4-star hotel</p>
                <p className="mt-3.5 text-[12px]" style={{ color: MUTED }}>
                  Hotel Reference
                </p>
                <p className="mt-0.5">{booking.hotelReference}</p>
              </OverviewCard>

              <OverviewCard
                icon={<Bed size={16} />}
                title="Rooms"
                footer={<GoldLink label="Request change" />}
              >
                <p>12 Twin Rooms</p>
                <p className="mt-1">8 Single Rooms</p>
                <p className="mt-1">2 Triple Rooms</p>
                <p
                  className="mt-3 pt-3 text-[12.5px]"
                  style={{ borderTop: `1px solid ${BORDER}`, color: TEXT }}
                >
                  {booking.rooms} rooms  •  {booking.guests} guests
                </p>
              </OverviewCard>

              <OverviewCard
                icon={<UtensilsCrossed size={16} />}
                title="Dining"
                footer={<GoldLink label="Edit" />}
              >
                <p style={{ color: TEXT }}>Breakfast included</p>
                <p className="mt-3.5 text-[11.5px] uppercase tracking-[0.14em]" style={{ color: MUTED }}>
                  Group dinner
                </p>
                <p className="mt-1">14 September  •  58 guests</p>
              </OverviewCard>

              <OverviewCard
                icon={<ConciergeBell size={16} />}
                title="Services"
                footer={<GoldLink label="Edit" />}
              >
                <p style={{ color: TEXT }}>Porter Service In</p>
                <p className="mt-1" style={{ color: TEXT }}>
                  VIP Welcome Amenity
                </p>
                <p className="mt-3 text-[12.5px]" style={{ color: MUTED }}>
                  + 2 more services
                </p>
              </OverviewCard>

              <OverviewCard
                icon={<Star size={16} />}
                title="Special Requests"
                footer={<GoldLink label="Edit" />}
              >
                <p style={{ color: TEXT }}>Early breakfast required on departure day.</p>
              </OverviewCard>
            </div>

            {/* ── right rail ─────────────────────── */}
            <aside className="grid content-start gap-4">
              <section
                className="rounded-[10px] p-4"
                style={{
                  backgroundColor: ACTION_PANEL,
                  border: `1px solid rgba(199,163,74,0.18)`,
                  boxShadow: CARD_SHADOW,
                }}
              >
                <h3
                  className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: TEXT }}
                >
                  Preparing your stay
                </h3>
                <div className="mt-3.5 flex items-center gap-3.5">
                  <Ring value={progress} size={62} />
                  <div className="h-[6px] flex-1 overflow-hidden rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.09)" }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${progress}%`, backgroundColor: GOLD }}
                    />
                  </div>
                </div>
                <ul className="mt-4 space-y-2.5 text-[13px]">
                  <li className="flex items-center justify-between">
                    <span style={{ color: TEXT_2 }}>Hotel confirmed</span>
                    <span
                      className="grid h-[18px] w-[18px] place-items-center rounded-full"
                      style={{ backgroundColor: "rgba(141,168,138,0.18)", color: GREEN }}
                    >
                      <Check size={12} />
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span style={{ color: TEXT_2 }}>Contract signed</span>
                    <span
                      className="grid h-[18px] w-[18px] place-items-center rounded-full"
                      style={{ backgroundColor: "rgba(141,168,138,0.18)", color: GREEN }}
                    >
                      <Check size={12} />
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span style={{ color: TEXT_2 }}>Rooming List</span>
                    <span style={{ color: GOLD_SOFT }}>
                      {rooming ? `${rooming.complete} / ${rooming.total}` : "42 / 58"}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span style={{ color: TEXT_2 }}>Final details</span>
                    <span style={{ color: MUTED }}>—</span>
                  </li>
                </ul>
              </section>

              <section
                className="rounded-[10px] p-4"
                style={{ backgroundColor: CARD, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
              >
                <h3
                  className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: TEXT }}
                >
                  Upcoming
                </h3>
                <ul className="mt-3 space-y-2">
                  {[
                    { d: "04", m: "Sep", t: "Rooming List", s: "Due in 6 days" },
                    { d: "08", m: "Sep", t: "Final guest details", s: "Due in 10 days" },
                  ].map((it) => (
                    <li
                      key={it.t}
                      className="flex items-center gap-3 rounded-[8px] px-2.5 py-2"
                      style={{ backgroundColor: "rgba(12,30,42,0.35)" }}
                    >
                      <span className="grid w-[34px] shrink-0 text-center">
                        <span className="text-[15px] font-medium leading-none" style={{ color: TEXT }}>
                          {it.d}
                        </span>
                        <span
                          className="mt-0.5 text-[9.5px] uppercase tracking-[0.14em]"
                          style={{ color: MUTED }}
                        >
                          {it.m}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px]" style={{ color: TEXT }}>
                          {it.t}
                        </span>
                        <span className="block truncate text-[11.5px]" style={{ color: MUTED }}>
                          {it.s}
                        </span>
                      </span>
                      <ChevronRight size={16} style={{ color: MUTED }} />
                    </li>
                  ))}
                </ul>
              </section>

              <section
                className="rounded-[10px] p-4"
                style={{ backgroundColor: CARD, border: `1px solid ${CARD_BORDER}`, boxShadow: CARD_SHADOW }}
              >
                <h3
                  className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: TEXT }}
                >
                  Need help?
                </h3>
                <p className="mt-2 text-[12.5px]" style={{ color: MUTED }}>
                  Need help with this booking?
                </p>
                <button
                  type="button"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-[6px] px-4 py-[9px] text-[12.5px] font-medium transition-colors hover:bg-[rgba(199,163,74,0.10)]"
                  style={{ color: GOLD_SOFT, border: `1px solid ${GOLD_DEEP}` }}
                >
                  Contact HotelGroupBook
                  <span aria-hidden>→</span>
                </button>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
