import s6MarbleAsset from "@/assets/s6-marble-texture.png.asset.json";
import { LeisureStepShell } from "@/features/leisure/shell/LeisureStepShell";
import { CITY_HERO_MAP, ROOM_TITLE, S6ReviewRow, S6_HERO, S6_IMG_CONCIERGE, S6_IMG_DINING, S6_IMG_EXPERIENCE, S6_IMG_STAY } from "@/features/leisure/step6/parts";
import { S6_GOLD, S6_GOLD_LIGHT, SERIF } from "@/features/leisure/tokens";
import { type StepKey } from "@/features/leisure/types";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight, BedDouble, CalendarDays, Clock, ConciergeBell, Loader2, MapPin, MessageSquare, Mountain, ShieldCheck, UserRound, Users2, Utensils } from "lucide-react";

export function LeisureStep6Screen({
  data,
  onEdit,
  onBack,
  onSubmit,
  submitting,
  onStepGo,
}: {
  data: {
    country: string;
    city: string;
    guests: number;
    arrival?: Date;
    departure?: Date;
    rooms: Record<string, number>;
    earlyCheckin: boolean;
    lateCheckout: boolean;
    connectingRooms: boolean;
    extras: string[];
    experiences: string[];
    letUsRecommend: boolean;
    contactName: string;
    email: string;
    phone: string;
    organisation: string;
    additionalComments: string;
  };
  onEdit: (s: StepKey) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  onStepGo: (s: StepKey) => void;
}) {
  const cityImg =
    CITY_HERO_MAP[data.city] ||
    "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=900&q=80";

  const dateRange =
    data.arrival && data.departure
      ? `${format(data.arrival, "d")} – ${format(data.departure, "d MMM yyyy")}`
      : data.arrival
      ? format(data.arrival, "d MMM yyyy")
      : "Dates to confirm";

  const roomLines = Object.entries(data.rooms)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${v} ${ROOM_TITLE[k] ?? k} rooms`);

  const extrasVisible = data.extras.slice(0, 6);
  const extrasMore = Math.max(0, data.extras.length - extrasVisible.length);

  const expsVisible = data.experiences.slice(0, 4);
  const expsMore = Math.max(0, data.experiences.length - expsVisible.length);

  const canSubmit =
    !submitting &&
    !!data.country &&
    !!data.city &&
    !!data.contactName &&
    !!data.email &&
    !!data.phone;

  const nights =
    data.arrival && data.departure
      ? Math.max(
          0,
          Math.round(
            (data.departure.getTime() - data.arrival.getTime()) / 86400000,
          ),
        )
      : 0;

  const specialRequestsCount =
    (data.earlyCheckin ? 1 : 0) +
    (data.lateCheckout ? 1 : 0) +
    (data.connectingRooms ? 1 : 0) +
    (data.additionalComments.trim() ? 1 : 0);

  const totalRooms = Object.values(data.rooms).reduce((a, b) => a + b, 0);

  const reviewCards = [
    {
      icon: <MapPin size={30} strokeWidth={1.1} />,
      title: "Destination",
      detail:
        [data.city, data.country].filter(Boolean).join(", ") ||
        "To be confirmed",
      image: cityImg,
      onClick: () => onEdit(1),
    },
    {
      icon: <BedDouble size={30} strokeWidth={1.1} />,
      title: "Stay",
      detail: [
        nights > 0 ? `${nights} ${nights === 1 ? "Night" : "Nights"}` : dateRange,
        `${data.guests} ${data.guests === 1 ? "Guest" : "Guests"}`,
        totalRooms > 0
          ? `${totalRooms} ${totalRooms === 1 ? "Room" : "Rooms"}`
          : null,
      ]
        .filter(Boolean)
        .join("  •  "),
      image: S6_IMG_STAY,
      onClick: () => onEdit(2),
    },
    {
      icon: <Utensils size={30} strokeWidth={1.1} />,
      title: "Dining",
      detail:
        data.extras.length > 0
          ? `${data.extras.length} ${
              data.extras.length === 1 ? "Selection" : "Selections"
            }`
          : "No selections",
      image: S6_IMG_DINING,
      onClick: () => onEdit(3),
    },
    {
      icon: <Mountain size={30} strokeWidth={1.1} />,
      title: "Experiences",
      detail: data.letUsRecommend
        ? "Concierge recommendations"
        : data.experiences.length > 0
        ? `${data.experiences.length} ${
            data.experiences.length === 1 ? "Service" : "Services"
          }`
        : "No services",
      image: S6_IMG_EXPERIENCE,
      onClick: () => onEdit(4),
    },
    {
      icon: <ConciergeBell size={30} strokeWidth={1.1} />,
      title: "Special Requests",
      detail:
        specialRequestsCount > 0
          ? `${specialRequestsCount} ${
              specialRequestsCount === 1 ? "Request" : "Requests"
            }`
          : "No requests",
      image: S6_IMG_CONCIERGE,
      onClick: () => onEdit(5),
    },
  ];



  const destinationLabel =
    [data.city, data.country].filter(Boolean).join(", ") || "To be confirmed";

  const roomBreakdown = Object.entries(data.rooms)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${v} × ${ROOM_TITLE[k] ?? k} Rooms`);

  const serviceLines = [
    ...data.extras,
    ...(data.letUsRecommend ? ["Concierge recommendations"] : data.experiences),
  ];

  const specialRequestLines = [
    data.earlyCheckin ? "Early check-in if possible" : null,
    data.lateCheckout ? "Late check-out if possible" : null,
    data.connectingRooms ? "Connecting rooms preferred" : null,
    data.additionalComments.trim() || null,
  ].filter(Boolean) as string[];

  const summaryStats = [
    { icon: <Users2 size={26} strokeWidth={1.2} />, value: String(data.guests), label: "Guests" },
    { icon: <BedDouble size={26} strokeWidth={1.2} />, value: String(totalRooms), label: "Rooms" },
    { icon: <Clock size={26} strokeWidth={1.2} />, value: String(nights), label: "Nights" },
    {
      icon: <ConciergeBell size={26} strokeWidth={1.2} />,
      value: String(serviceLines.length),
      label: "Services",
    },
  ];


  return (
    <LeisureStepShell
      activeStep={6}
      onStepGo={onStepGo}
      pageBg="radial-gradient(120% 80% at 50% -10%, #1B2B3D 0%, #14202E 45%, #0D1723 100%) fixed"
      hideHero
      wide
      hero={S6_HERO}
      chapter="CHAPTER VI"
      headline={
        <>
          Your journey,<br />perfectly planned.
        </>
      }
      subtext={
        <>Review your details before we start finding the best hotel offers for your group.</>
      }
    >
      <section className="relative mx-auto w-full max-w-[1500px] px-2 pb-28 sm:px-4">
        <div
          className="grid grid-cols-1 overflow-hidden rounded-[20px] lg:grid-cols-[22%_56%_22%]"
          style={{
            boxShadow: "0 50px 120px -60px rgba(0,0,0,0.9)",
            border: "1px solid rgba(231,201,107,0.18)",
          }}
        >
          {/* LEFT — ivory intro */}
          <div
            className="relative flex flex-col justify-between overflow-hidden px-[45px] pt-[60px] pb-[38px]"
            style={{
              backgroundImage: `url(${s6MarbleAsset.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#F4F2ED",
            }}
          >
            <div>
              <div
                className="text-[11px] font-semibold uppercase tracking-[0.22em]"
                style={{ color: "#B08D3F", fontFamily: "Karla, Inter, sans-serif" }}
              >
                Step 6 of 6
              </div>
              <h2
                className="mt-[40px] text-[40px] leading-[1.06] font-normal"
                style={{ fontFamily: SERIF, color: "#16233A" }}
              >
                Your request<br />is ready for review
              </h2>
              <div
                className="mt-[30px] h-px w-[50px]"
                style={{ background: "#C7A34A" }}
              />
              <p
                className="mt-[32px] max-w-[215px] text-[13.5px] leading-[2]"
                style={{ color: "rgba(22,35,58,0.68)", fontFamily: "Karla, Inter, sans-serif" }}
              >
                Please review the details below before we submit your request to our hotel
                partners.
              </p>
            </div>

            <div className="mt-[110px]">
              <div
                className="text-[46px] leading-none"
                style={{ fontFamily: "'Mrs Saint Delafield', cursive", color: "#B08D3F" }}
              >
                Thank you
              </div>
              <div
                className="mt-[18px] text-[13px]"
                style={{ color: "#16233A", fontFamily: "Karla, Inter, sans-serif" }}
              >
                HotelGroupBook Concierge
              </div>
            </div>
          </div>


          {/* CENTER — review grid */}
          <div
            className="px-7 py-12 lg:px-12 lg:py-14"
            style={{ background: "#F5F1EB" }}
          >
            <div
              className="text-[11px] font-medium uppercase tracking-[0.26em]"
              style={{ color: "#B08D3F" }}
            >
              Request Details
            </div>
            <div className="mt-4 h-px w-full" style={{ background: "rgba(199,163,74,0.22)" }} />

            <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
              <div>
                <S6ReviewRow
                  icon={<MapPin size={17} strokeWidth={1.4} />}
                  label="Destination"
                  primary={destinationLabel}
                  onEdit={() => onEdit(1)}
                />
                <S6ReviewRow
                  icon={<CalendarDays size={17} strokeWidth={1.4} />}
                  label="Stay"
                  primary={dateRange}
                  secondary={nights > 0 ? [`${nights} ${nights === 1 ? "Night" : "Nights"}`] : []}
                  onEdit={() => onEdit(2)}
                />
                <S6ReviewRow
                  icon={<BedDouble size={17} strokeWidth={1.4} />}
                  label="Accommodation"
                  primary={`${totalRooms} ${totalRooms === 1 ? "Room" : "Rooms"}  •  ${data.guests} ${
                    data.guests === 1 ? "Guest" : "Guests"
                  }`}
                  secondary={roomBreakdown.length ? [roomBreakdown.join("  •  ")] : []}
                  onEdit={() => onEdit(2)}
                />
              </div>

              <div>
                <S6ReviewRow
                  icon={<ConciergeBell size={17} strokeWidth={1.4} />}
                  label="Services & Extras"
                  primary={serviceLines[0] ?? "No selections"}
                  secondary={serviceLines.slice(1)}
                  onEdit={() => onEdit(3)}
                />
                <S6ReviewRow
                  icon={<UserRound size={17} strokeWidth={1.4} />}
                  label="Contact Details"
                  primary={data.contactName || "To be confirmed"}
                  secondary={[data.email, data.phone].filter(Boolean)}
                  onEdit={() => onEdit(5)}
                />
                <S6ReviewRow
                  icon={<MessageSquare size={17} strokeWidth={1.4} />}
                  label="Special Requests"
                  primary={specialRequestLines[0] ?? "None"}
                  secondary={specialRequestLines.slice(1)}
                  onEdit={() => onEdit(5)}
                />
              </div>
            </div>
          </div>

          {/* RIGHT — executive summary */}
          <div
            className="s6-exec relative overflow-hidden px-8 py-12 lg:px-7 lg:py-14"
            style={{
              background:
                "linear-gradient(180deg,#183253 0%,#132C49 42%,#0F2440 100%)",
              borderLeft: "1px solid rgba(197,162,75,0.35)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -60px 90px -60px rgba(0,0,0,0.65), 0 28px 70px -50px rgba(0,0,0,0.85)",
            }}
          >
            {/* vignette + micro texture */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 70% at 50% 0%, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0) 55%), radial-gradient(100% 80% at 50% 100%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 60%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>\")",
              }}
            />
            {/* champagne metallic gradients for icons */}
            <svg width="0" height="0" aria-hidden="true" className="absolute">
              <defs>
                <linearGradient id="s6Champagne" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FBF1DA" />
                  <stop offset="22%" stopColor="#E7D3A7" />
                  <stop offset="48%" stopColor="#C9AE79" />
                  <stop offset="70%" stopColor="#E3CEA0" />
                  <stop offset="100%" stopColor="#A98C57" />
                </linearGradient>
              </defs>
            </svg>

            <div className="relative flex flex-col items-center -mt-[33px]">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-6 left-1/2 h-[120px] w-[220px] -translate-x-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(231,211,167,0.10), rgba(231,211,167,0))",
                }}
              />
              <div
                className="s6-champagne-text text-[43px] leading-none"
                style={{ fontFamily: SERIF }}
              >
                H
              </div>
              <div
                className="mt-[2px] text-[11.5px] font-medium uppercase tracking-[0.30em]"
                style={{ color: "#EFE8DA" }}
              >
                Executive Summary
              </div>
              <div className="mt-3 flex w-[86%] items-center gap-3">
                <span
                  className="h-px flex-1"
                  style={{
                    background:
                      "linear-gradient(90deg,rgba(197,162,75,0) 0%,rgba(197,162,75,0.45) 60%,rgba(231,211,167,0.75) 100%)",
                  }}
                />
                <span
                  className="h-[6px] w-[6px] rotate-45"
                  style={{
                    background:
                      "linear-gradient(135deg,#FBF1DA 0%,#E3CEA0 45%,#C9AE79 70%,#A98C57 100%)",
                    boxShadow: "0 0 6px rgba(231,211,167,0.45)",
                  }}
                />
                <span
                  className="h-px flex-1"
                  style={{
                    background:
                      "linear-gradient(90deg,rgba(231,211,167,0.75) 0%,rgba(197,162,75,0.45) 40%,rgba(197,162,75,0) 100%)",
                  }}
                />
              </div>
            </div>

            <div className="relative mt-[34px] pl-[10px]">
              {summaryStats.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-5 py-6"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    marginRight: "-10px",
                  }}
                >
                  <span
                    className="flex w-[30px] shrink-0 items-center justify-center"
                    style={{ color: "#C5A24B" }}
                  >
                    {s.icon}
                  </span>
                  <div className="flex min-w-0 items-baseline gap-[12px]">
                    <span
                      className="text-[37px] leading-none"
                      style={{
                        fontFamily: SERIF,
                        color: "#FFFFFF",
                        textShadow: "0 1px 12px rgba(0,0,0,0.35)",
                      }}
                    >
                      {s.value}
                    </span>
                    <span
                      className="text-[14.7px] font-light leading-none"
                      style={{ color: "rgba(255,255,255,0.72)" }}
                    >
                      {s.label}
                    </span>
                  </div>
                </div>
              ))}

              <div
                className="flex items-center gap-5 py-6"
                style={{ marginRight: "-10px" }}
              >
                <span
                  className="flex w-[30px] shrink-0 items-center justify-center"
                  style={{ color: "#C5A24B" }}
                >
                  <MapPin size={26} strokeWidth={1.2} />
                </span>
                <div className="min-w-0">
                  <div
                    className="text-[14.7px] font-light leading-none"
                    style={{ color: "rgba(255,255,255,0.72)" }}
                  >
                    Destination
                  </div>
                  <div
                    className="mt-[7px] truncate text-[23px] leading-none"
                    style={{ fontFamily: SERIF, color: "#FFFFFF" }}
                  >
                    {destinationLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* STICKY FOOTER */}
        <div
          className="sticky bottom-0 z-20 mt-5 flex flex-col items-stretch gap-4 rounded-[16px] px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8"
          style={{
            background: "linear-gradient(180deg,#122032,#0D1826)",
            border: "1px solid rgba(231,201,107,0.22)",
            boxShadow: "0 -20px 60px -40px rgba(0,0,0,0.9)",
          }}
        >
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-3 text-[15px] font-medium transition-opacity hover:opacity-80"
            style={{ color: S6_GOLD_LIGHT }}
          >
            <ArrowLeft size={17} strokeWidth={1.8} />
            Back
          </button>

          <div className="flex items-start gap-3">
            <ShieldCheck size={22} strokeWidth={1.4} style={{ color: S6_GOLD }} className="mt-0.5 shrink-0" />
            <div className="min-w-0">
              <div
                className="text-[11px] font-medium uppercase tracking-[0.22em]"
                style={{ color: S6_GOLD }}
              >
                Secure &amp; Confidential
              </div>
              <div className="mt-1 text-[13px]" style={{ color: "rgba(236,229,214,0.70)" }}>
                We only share your request with carefully selected hotels.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="s6-submit group flex h-[58px] w-full items-center justify-center gap-3 rounded-[12px] text-[14px] font-semibold uppercase tracking-[0.22em] transition-all duration-300 hover:brightness-[1.05] disabled:cursor-not-allowed disabled:opacity-50 sm:w-[360px]"
            style={{
              background:
                "linear-gradient(180deg, #F7E4A6 0%, #F3D987 26%, #E7C96B 52%, #D4AF37 78%, #C5962D 100%)",
              color: "#1A2331",
              fontFamily: SERIF,
              border: "1px solid rgba(243,217,135,0.75)",
              boxShadow: "0 16px 36px -26px rgba(231,201,107,0.65)",
            }}
          >
            {submitting ? (
              <>
                <Loader2 size={18} strokeWidth={2.2} className="animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Submit Request
                <ArrowRight
                  size={18}
                  strokeWidth={1.8}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </div>
      </section>
    </LeisureStepShell>
  );
}
