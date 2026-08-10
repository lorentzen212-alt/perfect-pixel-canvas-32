import type { Stay } from "@/features/me/step3/stay";
import { GOLD, NAVY, SERIF } from "@/features/me/tokens";
import { supabase } from "@/integrations/supabase/client";
import { upsertProfile, useAuth } from "@/lib/auth";
import type { NewBookingInput } from "@/lib/bookingsApi";
import { createBooking, nightsBetween } from "@/lib/bookingsApi";
import type { MeAccommodationStay } from "@/lib/meDraftStore";
import { useMeDraft } from "@/lib/meDraftStore";
import { clearPendingRequest, savePendingRequest } from "@/lib/pendingRequest";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BedDouble, Calendar as CalendarIcon, Check, ClipboardCheck, Clock, Gift, Headphones, Lock, Mail, MapPin, Pencil, Phone, ShieldCheck, Sparkles, Star, User, Users, Utensils } from "lucide-react";
import React from "react";
import { useState } from "react";

export function StepSevenReview({
  onBack,
  onEdit,
}: {
  onBack: () => void;
  onEdit: (step: number) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const draft = useMeDraft();
  const navigate = useNavigate();

  const GOLD = "#D4AF6A";
  const GOLD_HI = "#F0D890";
  const CREAM = "#FBF5EA";
  const CREAM_2 = "#F6EEDD";
  const NAVY = "#0A1B2C";
  const NAVY_2 = "#0E2236";
  const INK = "#0B1620";

  // -------- Derived, humanised values (no fallbacks / demo data) --------
  const loc = draft.location ?? {};
  const locationTitle =
    loc.destinationName && loc.countryName
      ? loc.isAnywhere
        ? loc.destinationName
        : `${loc.destinationName}, ${loc.countryName}`
      : loc.destinationName || loc.countryName || "";
  const budgetLabel = loc.budget
    ? { economy: "Economy", mid: "Mid-range", premium: "Premium", luxury: "Luxury" }[loc.budget]
    : "";
  const hasLocation = Boolean(locationTitle || loc.preferredVenue || budgetLabel);

  const stays = draft.accommodationStays ?? [];
  const roomsTotalAll = stays.reduce(
    (n, s) =>
      n + s.rooms.sgl + s.rooms.dbl + s.rooms.twn + s.rooms.trp + s.rooms.ste,
    0,
  );
  const guestsTotalAll = stays.reduce(
    (n, s) =>
      n +
      s.rooms.sgl +
      s.rooms.dbl * 2 +
      s.rooms.twn * 2 +
      s.rooms.trp * 3 +
      s.rooms.ste * 2,
    0,
  );
  const hasAccommodation = stays.length > 0;

  const meetings = draft.meetingSpaces ?? [];
  const hasMeetings = meetings.length > 0;

  const catering = draft.catering ?? [];
  const cateringExtras = draft.cateringExtras ?? { dietary: [], dietaryOther: "", drinks: [], notes: "" };
  const dietaryList = [
    ...cateringExtras.dietary.filter((d) => d && d !== "Other"),
    ...(cateringExtras.dietary.includes("Other") && cateringExtras.dietaryOther
      ? [cateringExtras.dietaryOther]
      : []),
  ];
  const hasCatering =
    catering.length > 0 ||
    dietaryList.length > 0 ||
    (cateringExtras.drinks?.length ?? 0) > 0 ||
    Boolean(cateringExtras.notes?.trim());

  const extras = draft.extras ?? [];
  const extrasNotes = draft.extrasNotes?.trim() ?? "";
  const hasExtras = extras.length > 0 || Boolean(extrasNotes);

  const details = draft.eventDetails ?? {};
  const hasDetails = Boolean(
    details.eventName ||
      details.company ||
      details.contactPerson ||
      details.email ||
      details.phone,
  );

  const fmt = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  };
  const roomsBreakdown = (r: MeAccommodationStay["rooms"]) => {
    const parts: string[] = [];
    if (r.sgl) parts.push(`${r.sgl} Single`);
    if (r.dbl) parts.push(`${r.dbl} Double`);
    if (r.twn) parts.push(`${r.twn} Twin`);
    if (r.trp) parts.push(`${r.trp} Triple`);
    if (r.ste) parts.push(`${r.ste} Suite`);
    return parts.join(", ");
  };

  const { session: authSession } = useAuth();

  const handleSubmit = async () => {
    if (submitting || submitted) return;
    setSubmitting(true);
    try {
      const contactName = String(details.contactPerson ?? "");
      const firstStay = stays[0];
      const lastStay = stays[stays.length - 1];
      const startDate = firstStay?.checkIn || meetings[0]?.date || null;
      const endDate = lastStay?.checkOut || meetings[meetings.length - 1]?.date || null;
      const input: NewBookingInput = {
        bookingType: "me",
        name: String(details.eventName ?? "") || (locationTitle ? `${locationTitle} Event` : "Meetings & Events Request"),
        destination: locationTitle,
        country: loc.countryName ?? null,
        city: loc.destinationName ?? null,
        startDate,
        endDate,
        nights: nightsBetween(startDate, endDate),
        rooms: roomsTotalAll,
        guests: guestsTotalAll,
        delegates: meetings.reduce((n, m) => Math.max(n, m.attendees ?? 0), 0) || null,
        meetingSpaces: meetings.length || null,
        contact: {
          firstName: String(contactName).split(" ")[0] ?? "",
          lastName: String(contactName).split(" ").slice(1).join(" "),
          email: String(details.email ?? ""),
          phone: String(details.phone ?? ""),
          company: String(details.company ?? ""),
        },
        request: {
          type: "me",
          location: loc,
          accommodationStays: stays,
          meetingSpaces: meetings,
          catering,
          cateringExtras,
          extras,
          extrasNotes,
          eventDetails: details,
        },
        roomLines: stays.flatMap((stay) =>
          (
            [
              ["Single", stay.rooms.sgl],
              ["Double", stay.rooms.dbl],
              ["Twin", stay.rooms.twn],
              ["Triple", stay.rooms.trp],
              ["Suite", stay.rooms.ste],
            ] as const
          )
            .filter(([, qty]) => qty > 0)
            .map(([room_type, quantity]) => ({
              room_type,
              quantity,
              check_in: stay.checkIn || null,
              check_out: stay.checkOut || null,
            })),
        ),
      };

      // Single global session (falls back to the shared client if not hydrated yet).
      const user =
        authSession?.user ?? (await supabase.auth.getSession()).data.session?.user;
      if (!user) {
        savePendingRequest(input);
        navigate({ to: "/auth", search: { next: "/manage-bookings", mode: "signup" } });
        return;
      }

      // Keep the customer's saved profile intact: only fill blanks.
      const { data: existing } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, company_name, phone, country")
        .eq("user_id", user.id)
        .maybeSingle();
      await upsertProfile(user.id, {
        first_name: existing?.first_name?.trim() || (String(contactName).split(" ")[0] ?? ""),
        last_name:
          existing?.last_name?.trim() || String(contactName).split(" ").slice(1).join(" "),
        email: existing?.email?.trim() || String(details.email ?? "") || user.email || "",
        company_name: existing?.company_name?.trim() || String(details.company ?? "") || null,
        phone: existing?.phone?.trim() || String(details.phone ?? "") || null,
        country: existing?.country?.trim() || loc.countryName || null,
      });

      await createBooking(user.id, input);
      clearPendingRequest();
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* -------- Section row primitive -------- */
  type SectionProps = {
    step?: number;
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
    isFirst?: boolean;
    isLast?: boolean;
    showEdit?: boolean;
    labelStyle?: React.CSSProperties;
  };
  const SectionRow = ({
    step,
    icon,
    label,
    children,
    isFirst,
    isLast,
    showEdit = true,
    labelStyle,
  }: SectionProps) => (
    <div
      className="grid grid-cols-[132px_1fr] sm:grid-cols-[188px_1fr]"
      style={{
        borderTop: isFirst ? "none" : "1px solid rgba(212,175,106,0.23)",
      }}
    >
      {/* Left navy panel */}
      <div
        className="flex flex-col items-start justify-start gap-3 p-5 sm:p-6"
        style={{
          backgroundColor: "#193649",
          borderTopLeftRadius: isFirst ? 18 : 0,
          borderBottomLeftRadius: isLast ? 18 : 0,
        }}
      >
        <span
          className="inline-flex h-9 w-9 items-center justify-center"
          style={{ color: GOLD }}
        >
          {icon}
        </span>
        <div
          className="text-[10.5px] sm:text-[11.5px] tracking-[0.20em] uppercase leading-[1.35]"
          style={{ color: GOLD, fontWeight: 500, whiteSpace: "normal", ...labelStyle }}
        >
          {label}
        </div>
      </div>
      {/* Right cream panel */}
      <div
        className="relative p-5 sm:p-7"
        style={{
          backgroundColor: "#FAF6EE",
          backgroundImage:
            "linear-gradient(180deg, #FBF6EB 0%, #F6EFDF 100%)",
          borderTopRightRadius: isFirst ? 18 : 0,
          borderBottomRightRadius: isLast ? 18 : 0,
        }}
      >
        {showEdit && step !== undefined && (
          <button
            type="button"
            onClick={() => onEdit(step)}
            className="absolute right-4 top-4 sm:right-5 sm:top-5 inline-flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[12.5px]"
            style={{
              backgroundColor: "#FAF8F4",
              border: "1px solid rgba(212,175,106,0.55)",
              color: "#7A5A1E",
              boxShadow: "0 1px 2px rgba(10,27,44,0.04)",
            }}
            aria-label={`Edit ${label}`}
          >
            <Pencil size={12} strokeWidth={2.2} style={{ color: GOLD }} />
            <span style={{ fontWeight: 500 }}>Edit</span>
          </button>
        )}
        <div className="pr-16 sm:pr-20">{children}</div>
      </div>
    </div>
  );

  /* -------- Sidebar card primitive -------- */
  const SideCard = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div
      className="relative overflow-hidden rounded-[16px] p-6"
      style={{
        backgroundImage:
          "linear-gradient(180deg, #FBF6EB 0%, #F4EBD5 100%)",
        border: "1px solid rgba(212,175,106,0.45)",
        boxShadow:
          "0 30px 60px -30px rgba(0,0,0,0.55), 0 6px 14px -6px rgba(6,20,34,0.35), inset 0 1px 0 rgba(255,255,255,0.7)",
      }}
    >
      {/* Marble texture veil */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 15%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 45%), radial-gradient(ellipse at 85% 90%, rgba(180,150,90,0.09) 0%, rgba(180,150,90,0) 50%), url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.75  0 0 0 0 0.65  0 0 0 0 0.45  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "auto, auto, 260px 260px",
          mixBlendMode: "multiply",
          opacity: 0.9,
        }}
      />
      <div className="relative">
        <div
          className="text-[12px] tracking-[0.22em] uppercase text-center"
          style={{ color: GOLD, fontWeight: 600 }}
        >
          {title}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );

  const nextSteps = [
    { title: "Submitted", body: "Once you submit your request" },
    { title: "We Review", body: "Our team will review your request and select the most suitable hotels" },
    { title: "Hotels Contacted", body: "We contact the best matching hotels for you", Icon: Mail },
    { title: "Offers Received", body: "We collect the best offers and compare them", Icon: Gift },
    { title: "Proposal to You", body: "You will receive a curated proposal with the best options" },
  ];

  return (
    <div
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden pb-16"
      style={{
        position: "relative",
        width: "100vw",
        maxWidth: "none",
        minHeight: "100%",
        backgroundColor: "#0B1C33",
        backgroundImage: [
          // Central soft top sheen
          "radial-gradient(ellipse 70% 40% at 50% -5%, rgba(255,246,220,0.05) 0%, rgba(255,246,220,0) 60%)",
          // Warm corner glow (top-right, matches trails)
          "radial-gradient(ellipse 55% 45% at 100% 0%, rgba(214,168,84,0.14) 0%, rgba(214,168,84,0.05) 30%, rgba(214,168,84,0) 60%)",
          // Subtle opposite-corner cool depth
          "radial-gradient(ellipse 60% 50% at 0% 100%, rgba(9,20,36,0.9) 0%, rgba(9,20,36,0) 55%)",
          // Deep vignette
          "radial-gradient(ellipse 90% 75% at 50% 45%, rgba(11,28,51,0) 0%, rgba(6,15,28,0.55) 70%, rgba(3,9,18,0.95) 100%)",
          // Base tonal wash
          "linear-gradient(180deg, #0D2038 0%, #0B1C33 45%, #071427 100%)",
        ].join(","),
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Gold dust along the outer edges — soft radial haze */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            "radial-gradient(ellipse 40% 8% at 50% 0%, rgba(214,170,84,0.08) 0%, rgba(214,170,84,0) 70%)",
            "radial-gradient(ellipse 40% 8% at 50% 100%, rgba(198,154,74,0.07) 0%, rgba(198,154,74,0) 70%)",
            "radial-gradient(ellipse 8% 45% at 0% 50%, rgba(198,154,74,0.06) 0%, rgba(198,154,74,0) 70%)",
            "radial-gradient(ellipse 8% 45% at 100% 50%, rgba(214,170,84,0.08) 0%, rgba(214,170,84,0) 70%)",
          ].join(","),
        }}
      />

      {/* Flowing golden light trails — top-right corner only */}
      <svg
        aria-hidden
        className="pointer-events-none absolute z-0 luxury-trail"
        style={{
          top: "-6%",
          right: "-4%",
          width: "58%",
          height: "42%",
          animation: "luxury-trail-shimmer 8s ease-in-out infinite",
          opacity: 0.75,
          filter: "blur(0.3px)",
        }}
        viewBox="0 0 800 500"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="trailGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(214,170,84,0)" />
            <stop offset="55%" stopColor="rgba(228,188,110,0.55)" />
            <stop offset="88%" stopColor="rgba(245,215,140,0.9)" />
            <stop offset="100%" stopColor="rgba(255,236,180,0)" />
          </linearGradient>
          <radialGradient id="trailBurst" cx="88%" cy="18%" r="18%">
            <stop offset="0%" stopColor="rgba(255,236,180,0.55)" />
            <stop offset="60%" stopColor="rgba(214,170,84,0.12)" />
            <stop offset="100%" stopColor="rgba(214,170,84,0)" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="800" height="500" fill="url(#trailBurst)" />
        {[
          "M-20 220 C 200 180, 420 150, 780 40",
          "M-20 250 C 220 210, 460 180, 780 60",
          "M-20 280 C 240 250, 500 210, 780 90",
          "M-20 310 C 260 280, 520 240, 780 120",
          "M-20 340 C 280 310, 540 270, 780 150",
          "M-20 200 C 180 150, 400 120, 780 25",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke="url(#trailGold)"
            strokeWidth={0.6 + (i % 3) * 0.25}
            strokeLinecap="round"
            opacity={0.55 - i * 0.06}
          />
        ))}
      </svg>

      {/* Star flares — a few cinematic sparkles */}
      {[
        { top: "14%", left: "6%", size: 34, delay: "0s" },
        { top: "58%", left: "94%", size: 26, delay: "2.4s" },
        { top: "82%", left: "10%", size: 22, delay: "4.1s" },
        { top: "8%", left: "42%", size: 18, delay: "1.6s" },
      ].map((f, i) => (
        <span
          key={`flare-${i}`}
          aria-hidden
          className="pointer-events-none absolute z-0 luxury-flare"
          style={{
            top: f.top,
            left: f.left,
            width: f.size,
            height: f.size,
            animation: `luxury-flare 7s ease-in-out ${f.delay} infinite`,
            background:
              "radial-gradient(circle, rgba(255,240,200,0.9) 0%, rgba(245,215,140,0.35) 18%, rgba(214,170,84,0) 55%)",
          }}
        >
          <span
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 46%, rgba(255,236,180,0.85) 50%, transparent 54%), linear-gradient(0deg, transparent 46%, rgba(255,236,180,0.85) 50%, transparent 54%)",
            }}
          />
        </span>
      ))}

      {/* Scattered sparkles — varying brightness, edges only */}
      {[
        { top: "5%",  left: "18%", s: 2,   b: 0.55, d: "0s"   },
        { top: "9%",  left: "68%", s: 1.5, b: 0.4,  d: "1.2s" },
        { top: "12%", left: "88%", s: 2.5, b: 0.85, d: "2.6s" },
        { top: "22%", left: "4%",  s: 2,   b: 0.7,  d: "0.7s" },
        { top: "28%", left: "96%", s: 1.5, b: 0.5,  d: "3.4s" },
        { top: "36%", left: "9%",  s: 1.5, b: 0.4,  d: "1.9s" },
        { top: "44%", left: "93%", s: 2,   b: 0.65, d: "4.1s" },
        { top: "52%", left: "3%",  s: 2.5, b: 0.9,  d: "2.2s" },
        { top: "62%", left: "97%", s: 1.5, b: 0.45, d: "0.4s" },
        { top: "71%", left: "7%",  s: 2,   b: 0.7,  d: "3.6s" },
        { top: "78%", left: "92%", s: 1.5, b: 0.5,  d: "1.5s" },
        { top: "88%", left: "16%", s: 2,   b: 0.65, d: "2.9s" },
        { top: "93%", left: "62%", s: 1.5, b: 0.45, d: "4.7s" },
        { top: "96%", left: "88%", s: 2.5, b: 0.8,  d: "0.9s" },
        { top: "3%",  left: "34%", s: 1.5, b: 0.4,  d: "3.2s" },
        { top: "17%", left: "78%", s: 1.5, b: 0.5,  d: "2.1s" },
        { top: "84%", left: "44%", s: 1.5, b: 0.45, d: "1.1s" },
      ].map((p, i) => (
        <span
          key={`sp-${i}`}
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-full luxury-particle"
          style={{
            top: p.top,
            left: p.left,
            width: p.s,
            height: p.s,
            backgroundColor: `rgba(250,232,190,${p.b})`,
            boxShadow: `0 0 ${4 + p.s}px rgba(245,215,145,${p.b * 0.55})`,
            animation: `luxury-twinkle ${6 + (i % 4)}s ease-in-out ${p.d} infinite`,
          }}
        />
      ))}

      {/* Slow floating drift motes — subtle movement */}
      {[
        { top: "24%", left: "12%", d: "0s" },
        { top: "66%", left: "88%", d: "2.5s" },
        { top: "48%", left: "6%",  d: "5.1s" },
      ].map((m, i) => (
        <span
          key={`d-${i}`}
          aria-hidden
          className="pointer-events-none absolute z-0 rounded-full luxury-drift"
          style={{
            top: m.top,
            left: m.left,
            width: 3,
            height: 3,
            backgroundColor: "rgba(252,236,196,0.55)",
            boxShadow: "0 0 8px rgba(245,215,145,0.45)",
            animation: `luxury-drift 14s ease-in-out ${m.d} infinite`,
          }}
        />
      ))}




      <div className="relative z-[1] mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-8">
        <div className="pt-[38px]">



          <div className="max-w-[720px]" style={{ paddingBottom: "30px" }}>

            <h1
              className="leading-[1.02] whitespace-nowrap"
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(34px, 4.4vw, 58px)",
                fontWeight: 500,
                letterSpacing: "0.005em",
                color: "#FFF8EA",
                textShadow: "0 2px 24px rgba(245,220,150,0.18)",
              }}
            >
              Executive Event Review
            </h1>
            <div className="relative mt-5 w-[320px] max-w-full">
              <div
                className="h-[2px] w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, transparent, #B98F3D 18%, #F5E9B8 50%, #B98F3D 82%, transparent)",
                  boxShadow: "0 0 12px rgba(245,220,150,0.55)",
                }}
              />
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 h-[8px] w-[80px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,235,180,0.85) 0%, rgba(255,215,130,0.35) 40%, rgba(255,215,130,0) 75%)",
                  filter: "blur(2px)",
                }}
              />
            </div>
            <p
              className="mt-5 text-[16px] sm:text-[17px] leading-relaxed"
              style={{ color: "rgba(250,240,220,0.88)" }}
            >
              You&apos;re all set! Please review your request before submitting it to our team.
            </p>
          </div>
        </div>




      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        {/* LEFT — sectioned card */}
        <div
          className="overflow-hidden rounded-[20px]"
          style={{
            backgroundColor: NAVY_2,
            border: "1px solid rgba(212,175,106,0.42)",
            boxShadow:
              "0 50px 90px -40px rgba(0,0,0,0.75), 0 10px 24px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Row 0 — Your Event Summary intro */}
          <SectionRow
            icon={<ClipboardCheck size={22} strokeWidth={1.8} />}
            label={"Your Event\u00A0Summary"}
            showEdit={false}
            isFirst
          >
            <div className="text-[15px] leading-relaxed text-[#334155]">
              Here is a summary of your request.
              <br />
              You can go back and edit any section if needed.
            </div>
          </SectionRow>

          {(() => {
            const sections: React.ReactNode[] = [];

            if (hasLocation) {
              sections.push(
                <SectionRow
                  key="location"
                  step={1}
                  icon={<MapPin size={22} strokeWidth={1.8} />}
                  label="Location"
                >
                  {locationTitle && (
                    <div style={{ fontFamily: SERIF, fontSize: "24px", color: INK, fontWeight: 500 }}>
                      {locationTitle}
                    </div>
                  )}
                  {loc.preferredVenue && (
                    <div className="mt-2 text-[14px] text-[#334155]">
                      Preferred venue: {loc.preferredVenue}
                    </div>
                  )}
                  {budgetLabel && (
                    <div className="mt-1 text-[14px] text-[#334155]">
                      Budget: {budgetLabel}
                    </div>
                  )}
                </SectionRow>,
              );
            }

            if (hasAccommodation) {
              sections.push(
                <SectionRow
                  key="accommodation"
                  step={2}
                  icon={<BedDouble size={22} strokeWidth={1.8} />}
                  label="Accommodation"
                >
                  <div style={{ fontFamily: SERIF, fontSize: "24px", color: INK, fontWeight: 500 }}>
                    {guestsTotalAll} {guestsTotalAll === 1 ? "Guest" : "Guests"}
                  </div>
                  <div className="mt-1 text-[14px] text-[#334155]">
                    {roomsTotalAll} {roomsTotalAll === 1 ? "Room" : "Rooms"}
                  </div>
                  <div className="mt-3 space-y-3 text-[14px] text-[#334155]">
                    {stays.map((s, i) => (
                      <div key={s.id}>
                        {stays.length > 1 && (
                          <div className="text-[12px] uppercase tracking-[0.08em] text-[#64748B] mb-1">
                            Stay {i + 1}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={14} strokeWidth={2} style={{ color: GOLD }} />
                          Check-in: {fmt(s.checkIn)}
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={14} strokeWidth={2} style={{ color: GOLD }} />
                          Check-out: {fmt(s.checkOut)}
                        </div>
                        {roomsBreakdown(s.rooms) && (
                          <div className="mt-1">{roomsBreakdown(s.rooms)}</div>
                        )}
                        <div className="mt-1">
                          Meal plan: {s.mealPlan === "breakfast" ? "Breakfast included" : "Room only"}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionRow>,
              );
            }

            if (hasMeetings) {
              sections.push(
                <SectionRow
                  key="meetings"
                  step={3}
                  icon={<Users size={22} strokeWidth={1.8} />}
                  label={"Meeting &\u00A0Space"}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {meetings.map((m) => (
                      <div key={m.id}>
                        <div className="text-[13.5px] font-semibold" style={{ color: INK }}>
                          {m.name || "Meeting Room"}
                        </div>
                        {m.attendees > 0 && (
                          <div className="text-[13px] text-[#334155] mt-1">
                            {m.attendees} {m.attendees === 1 ? "attendee" : "attendees"}
                          </div>
                        )}
                        {m.setupLabel && (
                          <div className="text-[13px] text-[#334155]">{m.setupLabel}</div>
                        )}
                        {(m.date || m.startTime || m.endTime) && (
                          <div className="text-[13px] text-[#334155]">
                            {[fmt(m.date), [m.startTime, m.endTime].filter(Boolean).join("–")]
                              .filter(Boolean)
                              .join(" · ")}
                          </div>
                        )}
                        {m.equipmentLabels.length > 0 && (
                          <div className="text-[13px] text-[#334155] mt-1">
                            {m.equipmentLabels.join(", ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionRow>,
              );
            }

            if (hasCatering) {
              sections.push(
                <SectionRow
                  key="catering"
                  step={4}
                  icon={<Utensils size={22} strokeWidth={1.8} />}
                  label="Catering"
                >
                  {catering.length > 0 && (
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-[#334155]">
                      {catering.map((c) => (
                        <span key={c.servingId} className="inline-flex items-center gap-2">
                          <Utensils size={14} strokeWidth={2} style={{ color: GOLD }} />
                          {c.label}
                          {c.variant ? ` — ${c.variant}` : ""}
                          {c.time ? ` · ${c.time}` : ""}
                        </span>
                      ))}
                    </div>
                  )}
                  {dietaryList.length > 0 && (
                    <div className="mt-3 text-[13.5px] text-[#334155]">
                      Dietary requirements: {dietaryList.join(", ")}
                    </div>
                  )}
                  {(cateringExtras.drinks?.length ?? 0) > 0 && (
                    <div className="mt-1 text-[13.5px] text-[#334155]">
                      Drinks: {cateringExtras.drinks.join(", ")}
                    </div>
                  )}
                  {cateringExtras.notes?.trim() && (
                    <div className="mt-1 text-[13.5px] text-[#334155]">
                      Notes: {cateringExtras.notes}
                    </div>
                  )}
                </SectionRow>,
              );
            }

            if (hasExtras) {
              sections.push(
                <SectionRow
                  key="extras"
                  step={5}
                  icon={<Star size={22} strokeWidth={1.8} />}
                  label={"Extras &\u00A0Activities"}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {extras.map((x) => (
                      <div key={x.id}>
                        <div
                          className="inline-flex items-center gap-2 text-[13.5px] font-semibold"
                          style={{ color: INK }}
                        >
                          <Sparkles size={15} strokeWidth={2} style={{ color: GOLD }} />
                          {x.title}
                        </div>
                        {x.summary.length > 0 && (
                          <div className="mt-1 text-[13px] text-[#334155]">
                            {x.summary.join(" · ")}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {extrasNotes && (
                    <div className="mt-3 text-[13.5px] text-[#334155]">Notes: {extrasNotes}</div>
                  )}
                </SectionRow>,
              );
            }

            if (hasDetails) {
              sections.push(
                <SectionRow
                  key="details"
                  step={6}
                  icon={<ClipboardCheck size={22} strokeWidth={1.8} />}
                  label="Additional Information"
                  labelStyle={{ letterSpacing: "0.14em" }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[13.5px] text-[#334155]">
                    {details.eventName && (
                      <div>
                        <div className="font-semibold" style={{ color: INK }}>Event name</div>
                        <div className="mt-1">{details.eventName}</div>
                      </div>
                    )}
                    {details.company && (
                      <div>
                        <div className="font-semibold" style={{ color: INK }}>Company</div>
                        <div className="mt-1">{details.company}</div>
                      </div>
                    )}
                    {details.contactPerson && (
                      <div>
                        <div className="font-semibold" style={{ color: INK }}>Contact</div>
                        <div className="mt-1">{details.contactPerson}</div>
                      </div>
                    )}
                    {details.email && (
                      <div>
                        <div className="font-semibold" style={{ color: INK }}>Email</div>
                        <div className="mt-1">{details.email}</div>
                      </div>
                    )}
                    {details.phone && (
                      <div>
                        <div className="font-semibold" style={{ color: INK }}>Phone</div>
                        <div className="mt-1">
                          {details.countryCode ? `${details.countryCode} ` : ""}{details.phone}
                        </div>
                      </div>
                    )}
                  </div>
                </SectionRow>,
              );
            }

            // Mark the last rendered row as isLast so the timeline terminates correctly.
            return sections.map((node, i) => {
              if (!React.isValidElement(node)) return node;
              return React.cloneElement(node as React.ReactElement<SectionProps>, {
                isLast: i === sections.length - 1,
              });
            });
          })()}
        </div>

        {/* RIGHT — sidebar */}
        <div className="space-y-5">
          {/* What Happens Next */}
          <SideCard title="What Happens Next?">
            <ol className="relative">
              {/* connecting line */}
              <span
                aria-hidden
                className="absolute left-[17px] top-3 bottom-3 w-px"
                style={{ backgroundColor: "rgba(212,175,106,0.45)" }}
              />
              {nextSteps.map((s, i) => (
                <li key={s.title} className="relative pl-12 pb-4 last:pb-0">
                  <span
                    className="absolute left-0 top-0 inline-flex h-[34px] w-[34px] items-center justify-center rounded-full"
                    style={{
                      backgroundColor: "#FFFBF0",
                      border: "1.5px solid rgba(212,175,106,0.75)",
                      color: GOLD,
                      boxShadow: "0 1px 2px rgba(10,27,44,0.06)",
                    }}
                  >
                    {i === 0 ? (
                      <Check size={16} strokeWidth={2.4} />
                    ) : i === 1 ? (
                      <User size={15} strokeWidth={2} />
                    ) : i === 2 ? (
                      <Mail size={15} strokeWidth={2} />
                    ) : i === 3 ? (
                      <Gift size={15} strokeWidth={2} />
                    ) : (
                      <User size={15} strokeWidth={2} />
                    )}
                  </span>
                  <div className="text-[13.5px] font-semibold" style={{ color: INK }}>
                    {i + 1}. {s.title}
                  </div>
                  <div className="mt-1 text-[12.5px] leading-snug text-[#4C5866]">
                    {s.body}
                  </div>
                </li>
              ))}
            </ol>
          </SideCard>

          {/* Estimated Response Time */}
          <SideCard title="Estimated Response Time">
            <div className="flex items-start gap-3">
              <span
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "#FFFBF0",
                  border: "1.5px solid rgba(212,175,106,0.7)",
                  color: GOLD,
                }}
              >
                <Clock size={16} strokeWidth={2} />
              </span>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: "22px", color: INK, fontWeight: 500, lineHeight: 1.1 }}>
                  Within 24 hours
                </div>
                <div className="mt-1 text-[12.5px] leading-snug text-[#4C5866]">
                  You will receive an update from us within 24 hours.
                </div>
              </div>
            </div>
          </SideCard>

          {/* Need Help */}
          <SideCard title="Need Help?">
            <div className="flex items-start gap-3">
              <span
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "#FFFBF0",
                  border: "1.5px solid rgba(212,175,106,0.7)",
                  color: GOLD,
                }}
              >
                <Headphones size={16} strokeWidth={2} />
              </span>
              <p className="text-[13px] leading-snug text-[#4C5866]">
                Our team is here to assist you with anything you need.
              </p>
            </div>
            <div className="mt-4 space-y-2.5 text-[13.5px]" style={{ color: INK }}>
              <a href="tel:+4721010101" className="flex items-center gap-2.5 hover:text-[#7A5A1E]">
                <Phone size={14} strokeWidth={2} style={{ color: GOLD }} />
                +47 21 01 01 01
              </a>
              <a
                href="mailto:events@hotelgroupbook.com"
                className="flex items-center gap-2.5 hover:text-[#7A5A1E]"
              >
                <Mail size={14} strokeWidth={2} style={{ color: GOLD }} />
                events@hotelgroupbook.com
              </a>
            </div>
          </SideCard>

          {/* Ready to Submit */}
          <SideCard title="Ready to Submit?">
            <p className="text-center text-[13px] text-[#4C5866]">
              When you&apos;re happy with your request, click the button below.
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || submitted}
              className="mt-4 w-full inline-flex items-center justify-center rounded-[10px] transition-colors disabled:opacity-80"
              style={{
                height: "50px",
                color: "#241703",
                fontFamily: SERIF,
                fontSize: "16px",
                letterSpacing: "0.02em",
                backgroundImage:
                  "linear-gradient(180deg, #F4DFA1 0%, #E6C56A 45%, #C9A24A 100%)",
                border: "1px solid rgba(122,86,20,0.65)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(122,86,20,0.35), 0 10px 24px -14px rgba(201,162,74,0.55)",
                fontWeight: 600,
              }}
            >
              {submitted ? "Request Sent" : submitting ? "Sending…" : "Submit Event Request"}
            </button>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-[#4C5866]">
              <Lock size={12} strokeWidth={2} />
              No payment required
            </div>
          </SideCard>
        </div>
      </div>

      {/* SECURITY BAR */}
      <div
        className="relative overflow-hidden rounded-[18px] px-6 sm:px-8 py-5"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #FBF6EB 0%, #F4EBD5 100%), url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.75  0 0 0 0 0.65  0 0 0 0 0.45  0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundBlendMode: "multiply",
          border: "1px solid rgba(212,175,106,0.5)",
          boxShadow:
            "0 30px 60px -35px rgba(0,0,0,0.6), 0 6px 14px -6px rgba(6,20,34,0.4), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-4">
          <div className="flex items-start gap-4">
            <span
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{
                backgroundColor: "#FFFBF0",
                border: "1.5px solid rgba(212,175,106,0.7)",
                color: GOLD,
              }}
            >
              <ShieldCheck size={22} strokeWidth={1.9} />
            </span>
            <div>
              <div style={{ fontFamily: SERIF, fontSize: "20px", color: INK, fontWeight: 500 }}>
                Your information is secure
              </div>
              <div className="mt-1 text-[13px] text-[#4C5866]">
                We treat your data with the utmost confidentiality.
                <br className="hidden sm:block" />
                Your request will only be shared with relevant hotels.
              </div>
            </div>
          </div>
          {/* Decorative gold key tag */}
          <div className="hidden sm:flex items-center justify-end pr-2" aria-hidden>
            <svg width="110" height="60" viewBox="0 0 110 60" fill="none">
              <defs>
                <linearGradient id="hgbKeyGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F5E9B8" />
                  <stop offset="50%" stopColor="#D4AF6A" />
                  <stop offset="100%" stopColor="#8A6A1F" />
                </linearGradient>
              </defs>
              <rect x="10" y="10" width="42" height="40" rx="6" fill="url(#hgbKeyGold)" />
              <text x="31" y="35" textAnchor="middle" fontFamily="serif" fontSize="12" fontWeight="700" fill="#0A1B2C">HGB</text>
              <circle cx="70" cy="30" r="9" stroke="url(#hgbKeyGold)" strokeWidth="3" fill="none" />
              <rect x="79" y="28.5" width="22" height="3" fill="url(#hgbKeyGold)" />
              <rect x="94" y="28.5" width="3" height="8" fill="url(#hgbKeyGold)" />
              <rect x="88" y="28.5" width="3" height="6" fill="url(#hgbKeyGold)" />
            </svg>
          </div>
        </div>
      </div>

      {/* FOOTER ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[14px]"
          style={{ color: GOLD_HI }}
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Step 6
        </button>
        <div className="inline-flex items-center gap-2 text-[13px] text-white/75">
          <ShieldCheck size={14} strokeWidth={2} style={{ color: GOLD }} />
          You&apos;re almost there! One last step.
        </div>
        <span aria-hidden />
      </div>
      </div>
    </div>
  );
}



/* --------- Placeholder for later steps --------- */
