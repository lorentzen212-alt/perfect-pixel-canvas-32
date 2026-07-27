import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import leisureStep1HeroAsset from "@/assets/leisure-step1-hero-v3.png.asset.json";
import s2HeroImg from "@/assets/s2-accommodation-hero.jpg";
import roomSingleImg from "@/assets/room-single.jpg.asset.json";
import roomDoubleImg from "@/assets/room-double.jpg.asset.json";
import roomTwinImg from "@/assets/room-twin.jpg.asset.json";
import roomTripleImg from "@/assets/room-triple.jpg.asset.json";
import roomFamilyImg from "@/assets/room-family.jpg.asset.json";
import roomAccessibleImg from "@/assets/room-accessible.jpg.asset.json";
import s2StayHeroImg from "@/assets/s2-stay-hero-v2.png.asset.json";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  ChevronLeft,

  Minus,
  Plus,
  Loader2,
  Search,
  Sparkles,
  Pencil,
  Copy,
  CheckCircle2,
  Home as HomeIcon,
  Utensils,
  Coffee,
  Bus,
  Car,
  ConciergeBell,
  DoorOpen,
  Gift,
  Briefcase,
  ShieldCheck,
  Mountain,
  Snowflake,
  Landmark,
  Compass,
  Wine,
  Users,
  Waves,
  Camera,
  Flame,
  MapPin,
  Star,
  Bell,
  BedDouble,
  User as UserIcon,
  Accessibility,
  ChevronDown,
  Send,
  Lock,
  Clock,
  CalendarDays,
  Info,
  UserRound,
  Users2,
  MessageSquare,
  Tag,
  Trash2,
  Lightbulb,

  Headphones,
  PartyPopper,
  PlaneLanding,
  Plane,
  X,
} from "lucide-react";


import { cn } from "@/lib/utils";
import { BookingHeader } from "@/components/BookingHeader";

export const Route = createFileRoute("/book-leisure")({
  component: BookLeisure,
  head: () => ({
    meta: [
      { title: "Plan a Group Journey — HotelGroupBook" },
      {
        name: "description",
        content:
          "Plan an unforgettable Scandinavian group journey. One request, multiple offers, the perfect trip.",
      },
      { property: "og:title", content: "Plan a Group Journey — HotelGroupBook" },
      {
        property: "og:description",
        content:
          "A calm, luxurious way to plan group travel across Norway, Sweden, Denmark and Finland.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
});

/* =============================================================
   Design tokens
   ============================================================= */

const SERIF = '"Cormorant Garamond", Georgia, serif';
const IVORY = "#F7F2E7";
const IVORY_SOFT = "#FBF7EE";
const NAVY = "#0B1B2B";
const NAVY_DEEP = "#061422";
const INK = "#1B2A3A";
const MUTED = "#6B7280";
const GOLD = "#C9A24A";
const GOLD_SOFT = "#E4C57E";
const HAIR = "#E7DFCD";

/* =============================================================
   Hero imagery (cinematic Scandinavian photography)
   ============================================================= */

const HERO = {
  1: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80", // fjord sunrise
  2: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=80", // luxury suite
  3: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80", // long-table dinner
  4: "https://images.unsplash.com/photo-1508766206392-8bd5cf550d1c?auto=format&fit=crop&w=1600&q=80", // waterfall
  5: "https://images.unsplash.com/photo-1519974719765-e6559eac2575?auto=format&fit=crop&w=1600&q=80", // fireplace lounge
  6: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80", // aerial norway
  confirm:
    "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1600&q=80", // sunrise mountains
};

const ROOM_IMG = {
  single:
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
  twin: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
  double:
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
  triple:
    "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
  family:
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
  accessible:
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
};

const EXP_IMG: Record<string, string> = {
  "Fjord Cruise":
    "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=900&q=80",
  "Northern Lights":
    "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=900&q=80",
  Kayaking:
    "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?auto=format&fit=crop&w=900&q=80",
  "Whale Safari":
    "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=900&q=80",
  "City Tour":
    "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=900&q=80",
  "Wine Tasting":
    "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80",
  Museum:
    "https://images.unsplash.com/photo-1565060169194-19fabf63012c?auto=format&fit=crop&w=900&q=80",
  Hiking:
    "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=900&q=80",
  Ski: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=900&q=80",
  "Local Food Experience":
    "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80",
};

/* =============================================================
   Data
   ============================================================= */

type CountryCode = "NO" | "SE" | "DK" | "FI";

const COUNTRIES: { code: CountryCode; name: string; flag: string }[] = [
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
];

const CITIES: Record<CountryCode, string[]> = {
  NO: ["Oslo", "Bergen", "Tromsø", "Lofoten", "Stavanger", "Trondheim", "Bodø", "Ålesund"],
  SE: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Kiruna", "Åre", "Visby"],
  DK: ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Billund"],
  FI: ["Helsinki", "Rovaniemi", "Tampere", "Turku", "Levi"],
};


const ROOMS = [
  { key: "single", title: "Single Room", desc: "1 person", img: ROOM_IMG.single },
  { key: "twin", title: "Twin Room", desc: "2 separate beds", img: ROOM_IMG.twin },
  { key: "double", title: "Double Room", desc: "1 double bed", img: ROOM_IMG.double },
  { key: "triple", title: "Triple Room", desc: "3 people", img: ROOM_IMG.triple },
  { key: "family", title: "Family Room", desc: "4+ people", img: ROOM_IMG.family },
  { key: "accessible", title: "Accessible Room", desc: "Wheelchair friendly", img: ROOM_IMG.accessible },
] as const;

type ExtraGroup = { title: string; items: { label: string; Icon: typeof Utensils }[] };

const EXTRAS: ExtraGroup[] = [
  {
    title: "Dining",
    items: [
      { label: "Breakfast", Icon: Coffee },
      { label: "Packed Breakfast", Icon: Coffee },
      { label: "Lunch", Icon: Utensils },
      { label: "Packed Lunch", Icon: Utensils },
      { label: "Dinner", Icon: Utensils },
      { label: "Gala Dinner", Icon: Wine },
    ],
  },
  {
    title: "Arrival",
    items: [
      { label: "Porter Service", Icon: Briefcase },
      { label: "Private Check-in", Icon: DoorOpen },
      { label: "Welcome Drink", Icon: Wine },
      { label: "Gift Bags", Icon: Gift },
    ],
  },
  {
    title: "Transport",
    items: [
      { label: "Airport Transfer", Icon: Car },
      { label: "Coach Transfer", Icon: Bus },
      { label: "Parking", Icon: Car },
    ],
  },
  {
    title: "Hotel Services",
    items: [
      { label: "Meeting Room", Icon: Briefcase },
      { label: "Laundry", Icon: ShieldCheck },
      { label: "Late Check-out", Icon: HomeIcon },
    ],
  },
];

type ExpItem = { label: string; category: string; Icon: typeof Mountain };
const EXPERIENCES: ExpItem[] = [
  { label: "Fjord Cruise", category: "Nature", Icon: Waves },
  { label: "Hiking", category: "Nature", Icon: Mountain },
  { label: "Northern Lights", category: "Winter", Icon: Sparkles },
  { label: "Ski", category: "Winter", Icon: Snowflake },
  { label: "City Tour", category: "Culture", Icon: Landmark },
  { label: "Museum", category: "Culture", Icon: Landmark },
  { label: "Kayaking", category: "Adventure", Icon: Compass },
  { label: "Whale Safari", category: "Adventure", Icon: Camera },
  { label: "Local Food Experience", category: "Food", Icon: Flame },
  { label: "Wine Tasting", category: "Food", Icon: Wine },
];

const EXP_CATEGORIES = ["All", "Nature", "Winter", "Culture", "Adventure", "Food", "Group Activities"];

/* =============================================================
   Main Component
   ============================================================= */

type StepKey = 1 | 2 | 3 | 4 | 5 | 6;

const STEP_META: Record<StepKey, { title: string; kicker: string; headline: string; sub: string }> = {
  1: {
    title: "Destination",
    kicker: "Chapter I",
    headline: "Where will your group\nadventure begin?",
    sub: "Tell us your destination and hotel preferences.",
  },
  2: {
    title: "Accommodation",
    kicker: "Chapter II",
    headline: "Choose where\nyour group will rest.",
    sub: "Design the perfect room distribution for your group.",
  },
  3: {
    title: "Extras",
    kicker: "Chapter III",
    headline: "The small\nmoments that matter.",
    sub: "Add the details that turn a trip into a story.",
  },
  4: {
    title: "Experiences",
    kicker: "Chapter IV",
    headline: "Unforgettable\nScandinavian moments.",
    sub: "Curate the experiences your group will remember.",
  },
  5: {
    title: "Contact",
    kicker: "Chapter V",
    headline: "Who should\nwe write to?",
    sub: "We'll send tailored offers to this person.",
  },
  6: {
    title: "Review",
    kicker: "Chapter VI",
    headline: "One last look\nbefore we begin.",
    sub: "Review everything. It's free and non-binding.",
  },
};

function BookLeisure() {
  const navigate = useNavigate();
  const [step, setStep] = useState<StepKey>(1);

  // Step 1 - Destination
  const [country, setCountry] = useState<CountryCode>("NO");
  const [city, setCity] = useState<string>("Bergen");
  const [customDestination, setCustomDestination] = useState("");
  const [preferredHotel, setPreferredHotel] = useState("");

  // Dates + guests (retained from previous flow)
  const [arrival, setArrival] = useState<Date | undefined>();
  const [departure, setDeparture] = useState<Date | undefined>();
  const [guests, setGuests] = useState<number>(25);

  // Step 2 - Multi-stay accommodation
  const [stays, setStays] = useState<LeisureStay[]>([]);
  const [roomNotes, setRoomNotes] = useState("");

  // Step 3 - Extras
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [extrasComments, setExtrasComments] = useState("");
  const [recommendExtras, setRecommendExtras] = useState(true);

  // Step 4 - Experiences
  const [expCategory, setExpCategory] = useState("All");
  const [selectedExps, setSelectedExps] = useState<Set<string>>(new Set());
  const [letUsRecommend, setLetUsRecommend] = useState(false);
  const [preferredExpDate, setPreferredExpDate] = useState<Date | undefined>(undefined);
  const [expDateFlexible, setExpDateFlexible] = useState(false);
  const [additionalExpRequests, setAdditionalExpRequests] = useState("");

  // Step 5 - Contact
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [additionalComments, setAdditionalComments] = useState("");

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<null | { requestId: string }>(null);
  const [copied, setCopied] = useState(false);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  // Aggregated room totals derived from stays (kept for review + payload compatibility)
  const rooms = useMemo<Record<string, number>>(() => {
    const agg: Record<string, number> = {
      single: 0, double: 0, twin: 0, triple: 0, family: 0, accessible: 0,
    };
    for (const s of stays) {
      for (const k of Object.keys(agg)) {
        agg[k] += s.rooms[k] ?? 0;
      }
    }
    return agg;
  }, [stays]);
  const totalRooms = Object.values(rooms).reduce((a, b) => a + b, 0);
  const roomCount = (k: string) => rooms[k] ?? 0;
  const earlyCheckin = false;
  const lateCheckout = false;
  const connectingRooms = false;

  const toggleExtra = (label: string) =>
    setSelectedExtras((prev) => {
      const n = new Set(prev);
      if (n.has(label)) n.delete(label);
      else n.add(label);
      return n;
    });

  const toggleExp = (label: string) =>
    setSelectedExps((prev) => {
      const n = new Set(prev);
      if (n.has(label)) n.delete(label);
      else n.add(label);
      return n;
    });

  const canContinue = (s: StepKey): boolean => {
    if (s === 1) return !!(country && (city || customDestination.trim()));
    if (s === 2) return totalRooms > 0;
    if (s === 5)
      return (
        firstName.trim().length > 0 &&
        lastName.trim().length > 0 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
        phone.trim().length >= 6
      );
    return true;
  };

  const go = (n: StepKey) => {
    setStep(n);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const year = new Date().getFullYear();
      const seq = Math.floor(Math.random() * 90000) + 10000;
      const requestId = `HGB-${year}-${String(seq).padStart(5, "0")}`;
      const payload = {
        requestId,
        country,
        city: customDestination.trim() || city,
        arrivalDate: arrival ? format(arrival, "yyyy-MM-dd") : null,
        departureDate: departure ? format(departure, "yyyy-MM-dd") : null,
        guests,
        rooms,
        totalRooms,
        stays,
        preferredHotel,
        earlyCheckin,
        lateCheckout,
        connectingRooms,
        roomNotes,
        specialRequests: Array.from(selectedExtras),
        experiences: Array.from(selectedExps),
        letUsRecommend,
        preferredExperienceDate: preferredExpDate ? format(preferredExpDate, "yyyy-MM-dd") : null,
        experienceDateFlexible: expDateFlexible,
        additionalExperienceRequests: additionalExpRequests,
        additionalInformation: additionalComments,
        contactName: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        company: organisation,
        email,
        phone,
        status: "Finding matching hotels",
        submittedAt: new Date().toISOString(),
        type: "leisure",
      };
      if (typeof window !== "undefined") {
        const existing = JSON.parse(window.localStorage.getItem("hgb_requests") || "[]");
        existing.unshift(payload);
        window.localStorage.setItem("hgb_requests", JSON.stringify(existing));
      }
      await new Promise((r) => setTimeout(r, 900));
      setConfirmation({ requestId });
      if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <ConfirmationScreen
        requestId={confirmation.requestId}
        copied={copied}
        onCopy={() => {
          if (typeof navigator !== "undefined") {
            navigator.clipboard?.writeText(confirmation.requestId);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          }
        }}
        onGoToRequests={() => navigate({ to: "/manage-bookings" })}
        onHome={() => navigate({ to: "/" })}
      />
    );
  }

  const currentStep: StepKey = step;
  if (currentStep === 1) {
    return (
      <LeisureStep1Screen
        country={country}
        setCountry={(c: CountryCode) => {
          setCountry(c);
          setCity(CITIES[c][0]);
        }}
        city={city}
        setCity={setCity}
        customDestination={customDestination}
        setCustomDestination={setCustomDestination}
        preferredHotel={preferredHotel}
        setPreferredHotel={setPreferredHotel}
        canContinue={canContinue(1)}
        onNext={() => go(2)}
        onStepGo={(s: StepKey) => go(s)}
      />
    );
  }
  if (currentStep === 2) {
    return (
      <LeisureStep2Screen
        stays={stays}
        setStays={setStays}
        roomNotes={roomNotes}
        setRoomNotes={setRoomNotes}
        canContinue={canContinue(2)}
        onNext={() => go(3)}
        onBack={() => go(1)}
        onStepGo={(s: StepKey) => go(s)}
      />
    );
  }
  if (currentStep === 3) {
    return (
      <LeisureStep3Screen
        selected={selectedExtras}
        onToggle={toggleExtra}
        comments={extrasComments}
        setComments={setExtrasComments}
        recommend={recommendExtras}
        setRecommend={setRecommendExtras}
        onNext={() => go(4)}
        onBack={() => go(2)}
        onStepGo={(s: StepKey) => go(s)}
        context={{
          city: customDestination.trim() || city,
          arrival,
          departure,
          stays,
        }}
      />
    );
  }
  if (currentStep === 4) {
    return (
      <LeisureStep4Screen
        category={expCategory}
        setCategory={setExpCategory}
        selected={selectedExps}
        onToggle={toggleExp}
        letUsRecommend={letUsRecommend}
        setLetUsRecommend={setLetUsRecommend}
        preferredDate={preferredExpDate}
        setPreferredDate={setPreferredExpDate}
        dateFlexible={expDateFlexible}
        setDateFlexible={setExpDateFlexible}
        additionalRequests={additionalExpRequests}
        setAdditionalRequests={setAdditionalExpRequests}
        onNext={() => go(5)}
        onBack={() => go(3)}
        onStepGo={(s: StepKey) => go(s)}
      />
    );
  }
  if (currentStep === 5) {
    return (
      <LeisureStep5Screen
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        phone={phone}
        setPhone={setPhone}
        organisation={organisation}
        setOrganisation={setOrganisation}
        additionalComments={additionalComments}
        setAdditionalComments={setAdditionalComments}
        canContinue={canContinue(5)}
        onNext={() => go(6)}
        onBack={() => go(4)}
        onStepGo={(s: StepKey) => go(s)}
      />
    );
  }
  if (currentStep === 6) {
    return (
      <LeisureStep6Screen
        onEdit={(s: StepKey) => go(s)}
        onBack={() => go(5)}
        onSubmit={handleSubmit}
        submitting={submitting}
        onStepGo={(s: StepKey) => go(s)}
        data={{
          country: COUNTRIES.find((c) => c.code === country)?.name ?? "",
          city: customDestination.trim() || city,
          guests,
          arrival,
          departure,
          rooms,
          earlyCheckin,
          lateCheckout,
          connectingRooms,
          extras: Array.from(selectedExtras),
          experiences: Array.from(selectedExps),
          letUsRecommend,
          contactName: `${firstName} ${lastName}`.trim(),
          email,
          phone,
          organisation,
          additionalComments,
        }}
      />
    );
  }






  const meta = STEP_META[step];

  return (
    <main
      className="min-h-screen w-full"
      style={{ backgroundColor: IVORY, fontFamily: "Inter, system-ui, sans-serif", color: INK }}
    >
      {/* Top slim bar */}
      <div
        className="w-full border-b"
        style={{ borderColor: HAIR, backgroundColor: IVORY_SOFT }}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="grid h-9 w-9 place-items-center rounded-[8px]"
              style={{ backgroundColor: NAVY, color: GOLD, fontFamily: SERIF }}
            >
              <span className="text-[15px] font-medium leading-none">HGB</span>
            </div>
            <div className="leading-tight">
              <div style={{ fontFamily: SERIF }} className="text-[17px] font-medium text-[color:var(--ink)]">
                HotelGroupBook
              </div>
              <div className="text-[11px] tracking-[0.14em] uppercase" style={{ color: MUTED }}>
                Group journeys, made simple
              </div>
            </div>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors"
            style={{ color: MUTED }}
          >
            <ArrowLeft size={14} />
            Exit
          </Link>
        </div>
      </div>

      {/* Layout: left hero, right panel */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)]">
        <HeroPanel step={step} />

        <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-14">
          <ChapterTrack step={step} onGo={go} />

          <div
            key={step}
            className="mt-8 rounded-[28px] p-6 sm:p-10 lg:p-12 animate-panel-in"
            style={{
              backgroundColor: IVORY_SOFT,
              boxShadow:
                "0 30px 80px -40px rgba(11,27,43,0.20), 0 8px 30px -12px rgba(11,27,43,0.08)",
              border: `1px solid ${HAIR}`,
            }}
          >
            <div className="mb-8">
              <div className="text-[11px] tracking-[0.24em] uppercase" style={{ color: GOLD }}>
                {meta.kicker} · {meta.title}
              </div>
              <h2
                className="mt-3 text-[34px] sm:text-[42px] leading-[1.05] font-medium"
                style={{ fontFamily: SERIF, color: NAVY_DEEP }}
              >
                {meta.title === "Destination"
                  ? "Tell us where the story begins."
                  : meta.title === "Accommodation"
                    ? "Where your group will rest."
                    : meta.title === "Extras"
                      ? "The small moments that matter."
                      : meta.title === "Experiences"
                        ? "Curate what they'll remember."
                        : meta.title === "Contact"
                          ? "Who should we write to?"
                          : "One last look."}
              </h2>
              <p className="mt-3 max-w-[560px] text-[15px] leading-relaxed" style={{ color: MUTED }}>
                {meta.sub}
              </p>
            </div>

            {step === 1 && (
              <StepDestination
                country={country}
                setCountry={(c) => {
                  setCountry(c);
                  setCity(CITIES[c][0]);
                }}
                city={city}
                setCity={setCity}
                customDestination={customDestination}
                setCustomDestination={setCustomDestination}
                preferredHotel={preferredHotel}
                setPreferredHotel={setPreferredHotel}
              />
            )}
            {step === 2 && (
              <StepAccommodation
                rooms={rooms}
                roomCount={roomCount}
                setRoom={() => {}}
                totalRooms={totalRooms}
                earlyCheckin={earlyCheckin}
                setEarlyCheckin={() => {}}
                lateCheckout={lateCheckout}
                setLateCheckout={() => {}}
                connectingRooms={connectingRooms}
                setConnectingRooms={() => {}}
                roomNotes={roomNotes}
                setRoomNotes={setRoomNotes}
              />
            )}
            {step === 3 && (
              <StepExtras selected={selectedExtras} onToggle={toggleExtra} />
            )}
            {step === 4 && (
              <StepExperiences
                category={expCategory}
                setCategory={setExpCategory}
                selected={selectedExps}
                onToggle={toggleExp}
                letUsRecommend={letUsRecommend}
                setLetUsRecommend={setLetUsRecommend}
              />
            )}
            {step === 5 && (
              <StepContact
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                organisation={organisation}
                setOrganisation={setOrganisation}
                additionalComments={additionalComments}
                setAdditionalComments={setAdditionalComments}
              />
            )}
            {step === 6 && (
              <StepReview
                onEdit={(s) => go(s)}
                data={{
                  country: COUNTRIES.find((c) => c.code === country)?.name ?? "",
                  city: customDestination.trim() || city,
                  guests,
                  arrival,
                  departure,
                  rooms,
                  earlyCheckin,
                  lateCheckout,
                  connectingRooms,
                  preferredHotel,
                  extras: Array.from(selectedExtras),
                  experiences: Array.from(selectedExps),
                  letUsRecommend,
                  contactName: `${firstName} ${lastName}`.trim(),
                  email,
                  phone,
                  organisation,
                  additionalComments,
                }}
              />
            )}

            {/* Nav row */}
            <div
              className="mt-12 flex flex-col-reverse items-center justify-between gap-4 border-t pt-6 sm:flex-row"
              style={{ borderColor: HAIR }}
            >
              <button
                type="button"
                onClick={() => step > 1 && go((step - 1) as StepKey)}
                className={cn(
                  "inline-flex items-center gap-2 text-[14px] font-medium transition-colors",
                  step === 1 ? "opacity-40 pointer-events-none" : "hover:text-[color:var(--gold)]",
                )}
                style={{ color: MUTED }}
              >
                <ArrowLeft size={16} />
                Back
              </button>

              {step < 6 ? (
                <PrimaryButton
                  disabled={!canContinue(step)}
                  onClick={() => go((step + 1) as StepKey)}
                  label="Continue"
                  trailing={<ArrowRight size={16} strokeWidth={2.2} />}
                />
              ) : (
                <PrimaryButton
                  onClick={handleSubmit}
                  label={submitting ? "Sending your request…" : "Send Request"}
                  loading={submitting}
                  trailing={submitting ? null : <ArrowRight size={16} strokeWidth={2.2} />}
                />
              )}
            </div>
            {step === 6 && (
              <p className="mt-4 text-center text-[12.5px]" style={{ color: MUTED }}>
                Free and non-binding · No credit card required
              </p>
            )}
          </div>
        </section>
      </div>

      <style>{`
        @keyframes panel-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-panel-in { animation: panel-in 420ms cubic-bezier(.2,.7,.2,1); }
      `}</style>
    </main>
  );
}

/* =============================================================
   Hero Panel (left)
   ============================================================= */

function HeroPanel({ step }: { step: StepKey }) {
  const src = HERO[step];
  const meta = STEP_META[step];
  const [line1, line2] = meta.headline.split("\n");
  return (
    <aside className="relative min-h-[420px] lg:min-h-[calc(100vh-72px)] lg:sticky lg:top-0 overflow-hidden">
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        style={{ opacity: 1 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,20,34,0.35) 0%, rgba(6,20,34,0.55) 55%, rgba(6,20,34,0.85) 100%)",
        }}
      />
      <div className="relative z-10 flex h-full min-h-[420px] lg:min-h-[calc(100vh-72px)] flex-col justify-between p-8 sm:p-12 lg:p-14 text-white">
        <div>
          <div
            className="text-[11px] tracking-[0.24em] uppercase"
            style={{ color: GOLD_SOFT }}
          >
            {meta.kicker}
          </div>
          <h1
            className="mt-4 text-[38px] sm:text-[46px] lg:text-[52px] leading-[1.02] font-medium"
            style={{ fontFamily: SERIF }}
          >
            {line1}
            {line2 && (
              <>
                <br />
                {line2}
              </>
            )}
          </h1>
          <p className="mt-5 max-w-[380px] text-[15px] leading-relaxed text-white/80">
            {meta.sub}
          </p>
        </div>

        <ul className="space-y-3 pt-6">
          {[
            "One request.",
            "Multiple offers.",
            "The perfect trip.",
          ].map((t) => (
            <li key={t} className="flex items-center gap-3 text-[14px] text-white/90">
              <span
                className="grid h-6 w-6 place-items-center rounded-full"
                style={{ backgroundColor: "rgba(201,162,74,0.18)", border: `1px solid ${GOLD}` }}
              >
                <Check size={12} strokeWidth={2.4} style={{ color: GOLD_SOFT }} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

/* =============================================================
   Chapter track (top of right panel)
   ============================================================= */

function ChapterTrack({ step, onGo }: { step: StepKey; onGo: (s: StepKey) => void }) {
  const items: StepKey[] = [1, 2, 3, 4, 5, 6];
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12.5px]">
      {items.map((n, i) => {
        const active = n === step;
        const done = n < step;
        return (
          <li key={n} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => (done || active ? onGo(n) : null)}
              className={cn("group flex items-center gap-2", done || active ? "cursor-pointer" : "cursor-default")}
            >
              <span
                className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold transition-all"
                style={{
                  backgroundColor: active ? GOLD : done ? "rgba(201,162,74,0.15)" : "transparent",
                  color: active ? NAVY_DEEP : done ? GOLD : MUTED,
                  border: `1px solid ${active || done ? GOLD : HAIR}`,
                }}
              >
                {done ? <Check size={12} strokeWidth={2.6} /> : n}
              </span>
              <span
                className="uppercase tracking-[0.14em]"
                style={{
                  color: active ? NAVY_DEEP : done ? INK : MUTED,
                  fontWeight: active ? 600 : 500,
                }}
              >
                {STEP_META[n].title}
              </span>
            </button>
            {i < items.length - 1 && (
              <span className="h-px w-5" style={{ backgroundColor: HAIR }} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* =============================================================
   STEP 1 - Destination
   ============================================================= */

function StepDestination({
  country,
  setCountry,
  city,
  setCity,
  customDestination,
  setCustomDestination,
  preferredHotel,
  setPreferredHotel,
}: {
  country: CountryCode;
  setCountry: (c: CountryCode) => void;
  city: string;
  setCity: (c: string) => void;
  customDestination: string;
  setCustomDestination: (v: string) => void;
  preferredHotel: string;
  setPreferredHotel: (v: string) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <Label>Choose your country</Label>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COUNTRIES.map((c) => {
            const active = c.code === country;
            return (
              <button
                key={c.code}
                onClick={() => setCountry(c.code)}
                className="group relative flex items-center justify-center gap-2 rounded-[14px] px-4 py-3.5 text-[14px] font-medium transition-all"
                style={{
                  backgroundColor: active ? NAVY_DEEP : "#FFFFFF",
                  color: active ? "#FFF" : INK,
                  border: `1px solid ${active ? NAVY_DEEP : HAIR}`,
                  boxShadow: active
                    ? "0 8px 24px -12px rgba(11,27,43,0.35)"
                    : "0 1px 2px rgba(11,27,43,0.04)",
                }}
              >
                <span className="text-[18px] leading-none">{c.flag}</span>
                {c.name}
                {active && (
                  <span
                    className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full"
                    style={{ backgroundColor: GOLD, color: NAVY_DEEP }}
                  >
                    <Check size={12} strokeWidth={2.8} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>Popular destinations in {COUNTRIES.find((c) => c.code === country)!.name}</Label>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CITIES[country].map((c) => {
            const active = c === city && !customDestination.trim();
            return (
              <button
                key={c}
                onClick={() => {
                  setCity(c);
                  setCustomDestination("");
                }}
                className="relative overflow-hidden rounded-[14px] text-left transition-all"
                style={{
                  border: `1px solid ${active ? GOLD : HAIR}`,
                  backgroundColor: "#FFF",
                  boxShadow: active
                    ? "0 10px 26px -14px rgba(201,162,74,0.55)"
                    : "0 1px 2px rgba(11,27,43,0.04)",
                }}
              >
                <div className="h-24 w-full overflow-hidden">
                  <img
                    src={`https://source.unsplash.com/featured/400x300/?${encodeURIComponent(
                      c + " scandinavia",
                    )}`}
                    alt={c}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => ((e.currentTarget.style.display = "none"))}
                  />
                </div>
                <div className="flex items-center justify-between px-3.5 py-2.5">
                  <span className="text-[14px] font-medium" style={{ color: INK }}>
                    {c}
                  </span>
                  {active && <Check size={16} style={{ color: GOLD }} strokeWidth={2.4} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>Or search for any destination</Label>
        <div
          className="mt-3 flex items-center gap-3 rounded-[14px] bg-white px-4 py-3.5"
          style={{ border: `1px solid ${HAIR}` }}
        >
          <Search size={16} style={{ color: MUTED }} />
          <input
            value={customDestination}
            onChange={(e) => setCustomDestination(e.target.value)}
            placeholder="Type city, region or venue"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
      </div>

      <div>
        <Label>Preferred hotel or special requests <span style={{ color: MUTED, fontWeight: 400 }}>(optional)</span></Label>
        <div className="mt-3 rounded-[14px] bg-white p-4" style={{ border: `1px solid ${HAIR}` }}>
          <textarea
            value={preferredHotel}
            onChange={(e) => setPreferredHotel(e.target.value)}
            placeholder="Tell us if you have a preferred hotel or anything important we should know…"
            rows={3}
            className="w-full resize-none bg-transparent text-[14px] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   STEP 2 - Accommodation
   ============================================================= */

function StepAccommodation(props: {
  rooms: Record<string, number>;
  roomCount: (k: string) => number;
  setRoom: (k: string, v: number) => void;
  totalRooms: number;
  earlyCheckin: boolean;
  setEarlyCheckin: (v: boolean) => void;
  lateCheckout: boolean;
  setLateCheckout: (v: boolean) => void;
  connectingRooms: boolean;
  setConnectingRooms: (v: boolean) => void;
  roomNotes: string;
  setRoomNotes: (v: string) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <Label>Choose your room distribution</Label>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ROOMS.map((r) => {
            const n = props.roomCount(r.key);
            const active = n > 0;
            return (
              <div
                key={r.key}
                className="overflow-hidden rounded-[16px] bg-white transition-all"
                style={{
                  border: `1px solid ${active ? GOLD : HAIR}`,
                  boxShadow: active
                    ? "0 12px 30px -18px rgba(201,162,74,0.55)"
                    : "0 1px 2px rgba(11,27,43,0.04)",
                }}
              >
                <div className="h-32 w-full overflow-hidden">
                  <img src={r.img} alt={r.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <div className="text-[15px] font-medium" style={{ color: NAVY_DEEP }}>
                      {r.title}
                    </div>
                    <div className="text-[12.5px]" style={{ color: MUTED }}>
                      {r.desc}
                    </div>
                  </div>
                  <Counter value={n} onChange={(v) => props.setRoom(r.key, v)} />
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="mt-4 flex items-center justify-between rounded-[12px] px-4 py-3 text-[13px]"
          style={{ backgroundColor: "rgba(201,162,74,0.10)", color: NAVY_DEEP }}
        >
          <span>Total rooms selected</span>
          <span className="font-semibold" style={{ fontFamily: SERIF, fontSize: 20 }}>
            {props.totalRooms}
          </span>
        </div>
      </div>

      <div>
        <Label>Additional preferences <span style={{ color: MUTED, fontWeight: 400 }}>(optional)</span></Label>
        <div className="mt-3 flex flex-wrap gap-2">
          <Toggle label="Early check-in" checked={props.earlyCheckin} onChange={props.setEarlyCheckin} />
          <Toggle label="Late check-out" checked={props.lateCheckout} onChange={props.setLateCheckout} />
          <Toggle label="Connecting rooms" checked={props.connectingRooms} onChange={props.setConnectingRooms} />
        </div>
        <div className="mt-4 rounded-[14px] bg-white p-4" style={{ border: `1px solid ${HAIR}` }}>
          <textarea
            value={props.roomNotes}
            onChange={(e) => props.setRoomNotes(e.target.value)}
            placeholder="Tell us anything important about the room distribution…"
            rows={3}
            className="w-full resize-none bg-transparent text-[14px] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   STEP 3 - Extras
   ============================================================= */

function StepExtras({
  selected,
  onToggle,
}: {
  selected: Set<string>;
  onToggle: (label: string) => void;
}) {
  return (
    <div className="space-y-10">
      {EXTRAS.map((group) => (
        <div key={group.title}>
          <div className="mb-3 flex items-baseline justify-between">
            <div style={{ fontFamily: SERIF, color: NAVY_DEEP }} className="text-[22px] font-medium">
              {group.title}
            </div>
            <div className="text-[12px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
              Select any
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {group.items.map(({ label, Icon }) => {
              const active = selected.has(label);
              return (
                <button
                  key={label}
                  onClick={() => onToggle(label)}
                  className="relative flex items-center gap-3 rounded-[14px] bg-white px-4 py-3.5 text-left transition-all"
                  style={{
                    border: `1px solid ${active ? GOLD : HAIR}`,
                    boxShadow: active
                      ? "0 8px 22px -14px rgba(201,162,74,0.55)"
                      : "0 1px 2px rgba(11,27,43,0.04)",
                  }}
                >
                  <span
                    className="grid h-9 w-9 place-items-center rounded-[10px]"
                    style={{
                      backgroundColor: active ? "rgba(201,162,74,0.15)" : IVORY,
                      color: active ? GOLD : NAVY_DEEP,
                    }}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                  </span>
                  <span className="text-[14px] font-medium" style={{ color: INK }}>
                    {label}
                  </span>
                  {active && (
                    <span
                      className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full"
                      style={{ backgroundColor: GOLD, color: NAVY_DEEP }}
                    >
                      <Check size={12} strokeWidth={2.8} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =============================================================
   STEP 4 - Experiences
   ============================================================= */

function StepExperiences({
  category,
  setCategory,
  selected,
  onToggle,
  letUsRecommend,
  setLetUsRecommend,
}: {
  category: string;
  setCategory: (c: string) => void;
  selected: Set<string>;
  onToggle: (label: string) => void;
  letUsRecommend: boolean;
  setLetUsRecommend: (v: boolean) => void;
}) {
  const filtered = EXPERIENCES.filter((e) => category === "All" || e.category === category);
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {EXP_CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="rounded-full px-4 py-2 text-[13px] font-medium transition-all"
              style={{
                backgroundColor: active ? NAVY_DEEP : "#FFF",
                color: active ? "#FFF" : INK,
                border: `1px solid ${active ? NAVY_DEEP : HAIR}`,
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(({ label, Icon }) => {
          const active = selected.has(label);
          const img = EXP_IMG[label];
          return (
            <button
              key={label}
              onClick={() => onToggle(label)}
              className="group relative overflow-hidden rounded-[16px] bg-white text-left transition-all"
              style={{
                border: `1px solid ${active ? GOLD : HAIR}`,
                boxShadow: active
                  ? "0 14px 34px -18px rgba(201,162,74,0.55)"
                  : "0 1px 2px rgba(11,27,43,0.04)",
              }}
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={img}
                  alt={label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(6,20,34,0) 40%, rgba(6,20,34,0.75) 100%)",
                  }}
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <Icon size={16} strokeWidth={2} />
                  <span className="text-[15px] font-medium" style={{ fontFamily: SERIF }}>
                    {label}
                  </span>
                </div>
                {active && (
                  <span
                    className="absolute top-3 right-3 grid h-7 w-7 place-items-center rounded-full"
                    style={{ backgroundColor: GOLD, color: NAVY_DEEP }}
                  >
                    <Check size={14} strokeWidth={2.8} />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setLetUsRecommend(!letUsRecommend)}
        className="flex w-full items-center justify-between rounded-[16px] p-5 text-left transition-all"
        style={{
          backgroundColor: letUsRecommend ? NAVY_DEEP : "#FFF",
          color: letUsRecommend ? "#FFF" : INK,
          border: `1px solid ${letUsRecommend ? NAVY_DEEP : HAIR}`,
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="grid h-11 w-11 place-items-center rounded-[12px]"
            style={{
              backgroundColor: letUsRecommend ? "rgba(201,162,74,0.20)" : IVORY,
              color: GOLD,
            }}
          >
            <Sparkles size={18} strokeWidth={1.8} />
          </span>
          <div>
            <div className="text-[15px] font-medium" style={{ fontFamily: SERIF, fontSize: 20 }}>
              Let HotelGroupBook recommend experiences
            </div>
            <div className="text-[13px] opacity-80">
              We'll suggest the best options for your group.
            </div>
          </div>
        </div>
        <span
          className="grid h-6 w-6 place-items-center rounded-full"
          style={{
            backgroundColor: letUsRecommend ? GOLD : "transparent",
            border: `1.5px solid ${letUsRecommend ? GOLD : HAIR}`,
            color: NAVY_DEEP,
          }}
        >
          {letUsRecommend && <Check size={13} strokeWidth={2.8} />}
        </span>
      </button>
    </div>
  );
}

/* =============================================================
   STEP 5 - Contact
   ============================================================= */

function StepContact(props: {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  organisation: string;
  setOrganisation: (v: string) => void;
  additionalComments: string;
  setAdditionalComments: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="First name" value={props.firstName} onChange={props.setFirstName} placeholder="Enter first name" />
      <Field label="Last name" value={props.lastName} onChange={props.setLastName} placeholder="Enter last name" />
      <Field label="Email" value={props.email} onChange={props.setEmail} placeholder="Enter email address" type="email" />
      <Field label="Phone" value={props.phone} onChange={props.setPhone} placeholder="+47 000 00 000" type="tel" />
      <div className="sm:col-span-2">
        <Field
          label="Organisation / Group name"
          value={props.organisation}
          onChange={props.setOrganisation}
          placeholder="Enter organisation or group name"
          optional
        />
      </div>
      <div className="sm:col-span-2">
        <Label>
          Additional comments <span style={{ color: MUTED, fontWeight: 400 }}>(optional)</span>
        </Label>
        <div className="mt-3 rounded-[14px] bg-white p-4" style={{ border: `1px solid ${HAIR}` }}>
          <textarea
            value={props.additionalComments}
            onChange={(e) => props.setAdditionalComments(e.target.value)}
            placeholder="Tell us anything else we should know…"
            rows={4}
            className="w-full resize-none bg-transparent text-[14px] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
      </div>
    </div>
  );
}

/* =============================================================
   STEP 6 - Review
   ============================================================= */

function StepReview({
  onEdit,
  data,
}: {
  onEdit: (s: StepKey) => void;
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
    preferredHotel: string;
    extras: string[];
    experiences: string[];
    letUsRecommend: boolean;
    contactName: string;
    email: string;
    phone: string;
    organisation: string;
    additionalComments: string;
  };
}) {
  const roomsSummary = Object.entries(data.rooms)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => {
      const r = ROOMS.find((x) => x.key === k);
      return `${v} ${r?.title ?? k}`;
    });
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ReviewCard title="Destination" onEdit={() => onEdit(1)}>
        <Row label="Country" value={data.country} />
        <Row label="City" value={data.city} />
        {data.preferredHotel && <Row label="Preferences" value={data.preferredHotel} />}
      </ReviewCard>
      <ReviewCard title="Accommodation" onEdit={() => onEdit(2)}>
        {roomsSummary.length === 0 ? (
          <Row label="Rooms" value="None selected" />
        ) : (
          roomsSummary.map((r) => <Row key={r} label="" value={r} />)
        )}
        {(data.earlyCheckin || data.lateCheckout || data.connectingRooms) && (
          <Row
            label="Preferences"
            value={[
              data.earlyCheckin && "Early check-in",
              data.lateCheckout && "Late check-out",
              data.connectingRooms && "Connecting rooms",
            ]
              .filter(Boolean)
              .join(", ")}
          />
        )}
      </ReviewCard>
      <ReviewCard title="Extras" onEdit={() => onEdit(3)}>
        {data.extras.length === 0 ? (
          <Row label="" value="No extras selected" />
        ) : (
          data.extras.map((e) => <Row key={e} label="" value={e} />)
        )}
      </ReviewCard>
      <ReviewCard title="Experiences" onEdit={() => onEdit(4)}>
        {data.experiences.length === 0 && !data.letUsRecommend ? (
          <Row label="" value="No experiences selected" />
        ) : (
          <>
            {data.experiences.map((e) => (
              <Row key={e} label="" value={e} />
            ))}
            {data.letUsRecommend && (
              <Row label="" value="Recommendations requested" />
            )}
          </>
        )}
      </ReviewCard>
      <ReviewCard title="Contact" onEdit={() => onEdit(5)} full>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Row label="Name" value={data.contactName || "—"} />
          <Row label="Email" value={data.email || "—"} />
          <Row label="Phone" value={data.phone || "—"} />
          <Row label="Organisation" value={data.organisation || "—"} />
          {data.additionalComments && (
            <div className="sm:col-span-2">
              <Row label="Comments" value={data.additionalComments} />
            </div>
          )}
        </div>
      </ReviewCard>
    </div>
  );
}

function ReviewCard({
  title,
  onEdit,
  children,
  full,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[16px] bg-white p-5",
        full && "md:col-span-2",
      )}
      style={{ border: `1px solid ${HAIR}` }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: GOLD }}>
          {title}
        </div>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-[12.5px]"
          style={{ color: MUTED }}
        >
          <Pencil size={12} />
          Edit
        </button>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-[14px]">
      {label && <span style={{ color: MUTED }}>{label}</span>}
      <span className="text-right" style={{ color: INK }}>
        {value}
      </span>
    </div>
  );
}

/* =============================================================
   Confirmation Screen
   ============================================================= */

function ConfirmationScreen({
  requestId,
  copied,
  onCopy,
  onGoToRequests,
  onHome,
}: {
  requestId: string;
  copied: boolean;
  onCopy: () => void;
  onGoToRequests: () => void;
  onHome: () => void;
}) {
  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: NAVY_DEEP, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <img
        src={HERO.confirm}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,20,34,0.55) 0%, rgba(6,20,34,0.80) 60%, rgba(6,20,34,0.95) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[720px] flex-col items-center justify-center px-6 py-16 text-center text-white">
        <div
          className="grid h-16 w-16 place-items-center rounded-full"
          style={{
            backgroundColor: "rgba(201,162,74,0.15)",
            border: `1px solid ${GOLD}`,
          }}
        >
          <Check size={28} strokeWidth={2.4} style={{ color: GOLD_SOFT }} />
        </div>
        <h1
          className="mt-8 text-[44px] sm:text-[54px] leading-[1.05] font-medium"
          style={{ fontFamily: SERIF }}
        >
          Your journey<br />starts here.
        </h1>
        <p className="mt-5 max-w-[460px] text-[15.5px] leading-relaxed text-white/85">
          We're now finding the best hotel offers for your group. You'll receive tailored proposals shortly.
        </p>

        <div
          className="mt-10 w-full max-w-[440px] rounded-[18px] p-6 text-left"
          style={{
            backgroundColor: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(12px)",
            border: `1px solid rgba(201,162,74,0.30)`,
          }}
        >
          <div className="flex items-center justify-between text-[13px] text-white/70">
            <span>Request ID</span>
            <button
              onClick={onCopy}
              className="inline-flex items-center gap-1.5 text-white/80 transition-colors hover:text-white"
            >
              {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="mt-1 text-[20px] font-medium" style={{ color: GOLD_SOFT, fontFamily: SERIF }}>
            {requestId}
          </div>
          <div className="my-4 h-px" style={{ backgroundColor: "rgba(255,255,255,0.10)" }} />
          <div className="flex items-center justify-between text-[13px] text-white/70">
            <span>Status</span>
            <span className="inline-flex items-center gap-2 text-white">
              <Loader2 size={14} className="animate-spin" style={{ color: GOLD_SOFT }} />
              Finding matching hotels
            </span>
          </div>
        </div>

        <div className="mt-8 flex w-full max-w-[440px] flex-col gap-3">
          <button
            onClick={onGoToRequests}
            className="rounded-[12px] px-6 py-3.5 text-[14px] font-semibold transition-transform hover:-translate-y-[1px]"
            style={{
              background: `linear-gradient(135deg, ${GOLD_SOFT} 0%, ${GOLD} 100%)`,
              color: NAVY_DEEP,
              boxShadow: "0 14px 34px -12px rgba(201,162,74,0.45)",
            }}
          >
            Go to My Requests
          </button>
          <button
            onClick={onHome}
            className="rounded-[12px] px-6 py-3.5 text-[14px] font-medium text-white transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.20)" }}
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </main>
  );
}

/* =============================================================
   Primitives
   ============================================================= */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12.5px] font-semibold uppercase tracking-[0.14em]" style={{ color: NAVY_DEEP }}>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  optional?: boolean;
}) {
  return (
    <div>
      <Label>
        {label}
        {optional && <span style={{ color: MUTED, fontWeight: 400 }}> (optional)</span>}
      </Label>
      <div
        className="mt-3 rounded-[14px] bg-white px-4 py-3.5"
        style={{ border: `1px solid ${HAIR}` }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9CA3AF]"
        />
      </div>
    </div>
  );
}

function Counter({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="grid h-8 w-8 place-items-center rounded-full transition-colors"
        style={{
          border: `1px solid ${HAIR}`,
          color: value === 0 ? "#C9CFD6" : NAVY_DEEP,
          backgroundColor: "#FFF",
        }}
        disabled={value === 0}
      >
        <Minus size={14} strokeWidth={2.2} />
      </button>
      <span
        className="min-w-[28px] text-center text-[16px] font-semibold"
        style={{ color: NAVY_DEEP, fontFamily: SERIF }}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="grid h-8 w-8 place-items-center rounded-full transition-colors"
        style={{
          border: `1px solid ${GOLD}`,
          color: NAVY_DEEP,
          backgroundColor: "rgba(201,162,74,0.12)",
        }}
      >
        <Plus size={14} strokeWidth={2.2} />
      </button>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all"
      style={{
        backgroundColor: checked ? "rgba(201,162,74,0.14)" : "#FFF",
        color: checked ? NAVY_DEEP : INK,
        border: `1px solid ${checked ? GOLD : HAIR}`,
      }}
    >
      <span
        className="grid h-4 w-4 place-items-center rounded-full"
        style={{
          backgroundColor: checked ? GOLD : "transparent",
          border: `1.5px solid ${checked ? GOLD : HAIR}`,
        }}
      >
        {checked && <Check size={10} strokeWidth={3} style={{ color: NAVY_DEEP }} />}
      </span>
      {label}
    </button>
  );
}

function PrimaryButton({
  onClick,
  label,
  loading,
  disabled,
  trailing,
}: {
  onClick: () => void;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center gap-2.5 rounded-[12px] px-7 py-3.5 text-[14px] font-semibold tracking-wide transition-all",
        (disabled || loading) && "opacity-60 cursor-not-allowed",
      )}
      style={{
        background: `linear-gradient(135deg, ${GOLD_SOFT} 0%, ${GOLD} 100%)`,
        color: NAVY_DEEP,
        boxShadow: "0 14px 34px -14px rgba(201,162,74,0.55), inset 0 1px 0 rgba(255,255,255,0.35)",
      }}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {label}
      {trailing}
    </button>
  );
}

/* =============================================================
   LEISURE STEP 1 — Dark navy premium screen (reference match)
   ============================================================= */

const S1_NAVY = "#08131F";
const S1_NAVY_SOFT = "#142638";
const S1_BG = "#131E2A"; // soft charcoal navy, muted grey-blue undertone, premium matte finish
const S1_GOLD = "#D4A64A";
const S1_GOLD_SOFT = "#E8C775";
const S1_BORDER = "rgba(212,166,74,0.28)";
const S1_BORDER_SOFT = "rgba(255,255,255,0.08)";

const S1_HERO = leisureStep1HeroAsset.url;

import bergenImg from "@/assets/leisure/bergen.jpg.asset.json";
import osloImg from "@/assets/leisure/oslo.jpg.asset.json";
import lofotenImg from "@/assets/leisure/lofoten.jpg.asset.json";
import tromsoImg from "@/assets/leisure/tromso.jpg.asset.json";
import stavangerImg from "@/assets/leisure/stavanger.jpg.asset.json";
import trondheimImg from "@/assets/leisure/trondheim.jpg.asset.json";
import geirangerImg from "@/assets/leisure/geiranger.jpg.asset.json";
import bodoImg from "@/assets/leisure/bodo.jpg.asset.json";
import alesundImg from "@/assets/leisure/alesund.jpg.asset.json";
import stockholmImg from "@/assets/leisure/stockholm.jpg.asset.json";
import gothenburgImg from "@/assets/leisure/gothenburg.jpg.asset.json";
import malmoImg from "@/assets/leisure/malmo.jpg.asset.json";
import uppsalaImg from "@/assets/leisure/uppsala.jpg.asset.json";
import kirunaImg from "@/assets/leisure/kiruna.jpg.asset.json";
import areImg from "@/assets/leisure/are.jpg.asset.json";
import visbyImg from "@/assets/leisure/visby.jpg.asset.json";
import copenhagenImg from "@/assets/leisure/copenhagen.jpg.asset.json";
import aarhusImg from "@/assets/leisure/aarhus.jpg.asset.json";
import odenseImg from "@/assets/leisure/odense.jpg.asset.json";
import aalborgImg from "@/assets/leisure/aalborg.jpg.asset.json";
import billundImg from "@/assets/leisure/billund.jpg.asset.json";
import helsinkiImg from "@/assets/leisure/helsinki.jpg.asset.json";
import rovaniemiImg from "@/assets/leisure/rovaniemi.jpg.asset.json";
import tampereImg from "@/assets/leisure/tampere.jpg.asset.json";
import turkuImg from "@/assets/leisure/turku.jpg.asset.json";
import leviImg from "@/assets/leisure/levi.jpg.asset.json";

const DEST_IMG: Record<string, string> = {
  Oslo: osloImg.url,
  Bergen: bergenImg.url,
  Tromsø: tromsoImg.url,
  Lofoten: lofotenImg.url,
  Stavanger: stavangerImg.url,
  Trondheim: trondheimImg.url,
  Bodø: bodoImg.url,
  Ålesund: alesundImg.url,
  Stockholm: stockholmImg.url,
  Gothenburg: gothenburgImg.url,
  Malmö: malmoImg.url,
  Uppsala: uppsalaImg.url,
  Kiruna: kirunaImg.url,
  Åre: areImg.url,
  Visby: visbyImg.url,
  Copenhagen: copenhagenImg.url,
  Aarhus: aarhusImg.url,
  Odense: odenseImg.url,
  Aalborg: aalborgImg.url,
  Billund: billundImg.url,
  Helsinki: helsinkiImg.url,
  Rovaniemi: rovaniemiImg.url,
  Tampere: tampereImg.url,
  Turku: turkuImg.url,
  Levi: leviImg.url,
};

const ANYWHERE_IMG: Record<CountryCode, string> = {
  NO: geirangerImg.url,
  SE: kirunaImg.url,
  DK: copenhagenImg.url,
  FI: rovaniemiImg.url,
};

const NORWAY_TILES: { name: string; img: string }[] = [
  { name: "Bergen", img: bergenImg.url },
  { name: "Oslo", img: osloImg.url },
  { name: "Lofoten", img: lofotenImg.url },
  { name: "Tromsø", img: tromsoImg.url },
  { name: "Stavanger", img: stavangerImg.url },
  { name: "Trondheim", img: trondheimImg.url },
  { name: "Geiranger", img: geirangerImg.url },
];

const COUNTRY_FLAG_EMOJI: Record<CountryCode, string> = {
  NO: "🇳🇴",
  SE: "🇸🇪",
  DK: "🇩🇰",
  FI: "🇫🇮",
};

/* =============================================================
   Step 1 — shared destination data model
   ============================================================= */

type Destination = {
  id: string;
  name: string;
  country: CountryCode;
  countryName: string;
  image: string;
  alt: string;
};

const FALLBACK_IMG = geirangerImg.url; // premium placeholder when a photo is missing

function makeDest(
  name: string,
  code: CountryCode,
  countryName: string,
  image: string | undefined,
): Destination {
  if (!image) {
    // eslint-disable-next-line no-console
    console.warn(`[destinations] Missing image for "${name}" (${countryName}) — using fallback.`);
  }
  return {
    id: `${code.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    country: code,
    countryName,
    image: image || FALLBACK_IMG,
    alt: `${name}, ${countryName}`,
  };
}

const DESTINATIONS: Record<CountryCode, Destination[]> = (() => {
  const build = (code: CountryCode): Destination[] => {
    const countryName = COUNTRIES.find((c) => c.code === code)!.name;
    const cities = CITIES[code].map((n) => makeDest(n, code, countryName, DEST_IMG[n]));
    cities.push(
      makeDest(`Anywhere in ${countryName}`, code, countryName, ANYWHERE_IMG[code]),
    );
    return cities;
  };
  return { NO: build("NO"), SE: build("SE"), DK: build("DK"), FI: build("FI") };
})();

const ALL_DESTINATIONS: Destination[] = Object.values(DESTINATIONS).flat();

/* =============================================================
   Step 1 — sub-components
   ============================================================= */

function CountrySelector({
  country,
  onChange,
}: {
  country: CountryCode;
  onChange: (c: CountryCode) => void;
}) {
  const flagUrl = (code: CountryCode) =>
    `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
  return (
    <div className="mx-auto mt-5 flex max-w-[1100px] items-center justify-center gap-0 px-6">
      {COUNTRIES.map((c, i) => {
        const active = c.code === country;
        return (
          <div key={c.code} className="flex items-center">
            {i > 0 && (
              <span
                className="mx-6 h-5 w-px lg:mx-10"
                style={{ background: "rgba(245,241,230,0.25)" }}
              />
            )}
            <button
              type="button"
              onClick={() => onChange(c.code)}
              className="group flex flex-col items-center gap-2 transition-all"
            >
              <div className="flex items-center gap-3">
                <img
                  src={flagUrl(c.code)}
                  alt={c.name}
                  className="h-5 w-7 rounded-sm object-cover"
                  style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
                />
                <span
                  className="text-[15px] tracking-[0.16em] transition-colors"
                  style={{
                    color: active ? S1_GOLD : "rgba(245,241,230,0.72)",
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {c.name.toUpperCase()}
                </span>
              </div>
              <div
                className="h-[1.5px] w-full transition-all duration-300"
                style={{
                  background: active
                    ? `linear-gradient(90deg, ${S1_GOLD_SOFT}, ${S1_GOLD}, ${S1_GOLD_SOFT})`
                    : "transparent",
                  opacity: active ? 1 : 0,
                }}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function DestinationCarousel({
  destinations,
  selectedId,
  onSelect,
}: {
  destinations: Destination[];
  selectedId: string | null;
  onSelect: (d: Destination) => void;
}) {
  const PAGE_SIZE = 4;
  const pageCount = Math.max(1, Math.ceil(destinations.length / PAGE_SIZE));
  const [page, setPage] = useState(0);

  // Reset to first page whenever the destination list changes (i.e. country change).
  useEffect(() => {
    setPage(0);
  }, [destinations]);

  const safePage = Math.min(page, pageCount - 1);
  const visible = destinations.slice(
    safePage * PAGE_SIZE,
    safePage * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <div className="mx-auto mt-9 w-full max-w-[1420px] px-4 lg:px-10">
      <div className="relative">
        <button
          type="button"
          onClick={() => setPage((p) => (p - 1 + pageCount) % pageCount)}
          aria-label="Previous"
          className="absolute left-1 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full transition-all hover:scale-110 lg:-left-3"
          style={{ color: S1_GOLD }}
        >
          <ChevronLeft size={38} strokeWidth={1.6} />
        </button>

        <div className="grid grid-cols-2 gap-4 px-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6 lg:px-12">
          {Array.from({ length: PAGE_SIZE }).map((_, idx) => {
            const d = visible[idx];
            if (!d) return <div key={`empty-${idx}`} aria-hidden />;
            const active = d.id === selectedId;
            return (
              <button
                key={d.id}
                onClick={() => onSelect(d)}
                className="group relative flex aspect-[10/14.2] flex-col overflow-hidden rounded-[18px] text-left transition-all duration-300 hover:-translate-y-[4px]"
                style={{
                  border: `1px solid ${active ? S1_GOLD : "rgba(212,166,74,0.10)"}`,
                  boxShadow: active
                    ? "0 32px 64px -26px rgba(0,0,0,0.48), 0 14px 30px -16px rgba(212,166,74,0.28), 0 0 0 1px rgba(212,166,74,0.35) inset"
                    : "0 28px 58px -26px rgba(0,0,0,0.42), 0 12px 28px -16px rgba(0,0,0,0.24)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,166,74,0.55)";
                  e.currentTarget.style.boxShadow =
                    "0 34px 68px -26px rgba(0,0,0,0.46), 0 0 0 1px rgba(212,166,74,0.40) inset, 0 18px 38px -18px rgba(212,166,74,0.18)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = active
                    ? S1_GOLD
                    : "rgba(212,166,74,0.10)";
                  e.currentTarget.style.boxShadow = active
                    ? "0 32px 64px -26px rgba(0,0,0,0.48), 0 14px 30px -16px rgba(212,166,74,0.28), 0 0 0 1px rgba(212,166,74,0.35) inset"
                    : "0 28px 58px -26px rgba(0,0,0,0.42), 0 12px 28px -16px rgba(0,0,0,0.24)";
                }}
              >
                <img
                  src={d.image}
                  alt={d.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.05]"
                  style={{ filter: "contrast(1.02) saturate(1.08) brightness(0.985)" }}
                  onError={(e) => {
                    // eslint-disable-next-line no-console
                    console.warn(`[destinations] Image failed for "${d.name}" — swapping to fallback.`);
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                  }}
                />
                {/* Subtle top light sheen */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/3"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
                  }}
                />
                {/* Premium vignette for depth and colour grading */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 40%, rgba(0,0,0,0) 42%, rgba(0,0,0,0.18) 88%, rgba(0,0,0,0.28) 100%)",
                  }}
                />
                {/* Bottom dark overlay — almost invisible, gradually deepens */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(8,19,31,0) 48%, rgba(8,19,31,0.14) 72%, rgba(6,14,22,0.38) 90%, rgba(4,10,16,0.62) 100%)",
                  }}
                />
                <div className="relative z-10 mt-auto px-5 pb-5">
                  <div
                    className="text-[24px] leading-tight tracking-[0.02em]"
                    style={{ fontFamily: SERIF, fontWeight: 500, color: "#FBF7EE" }}
                  >
                    {d.name.toUpperCase()}
                  </div>
                  <div
                    className="mt-1 text-[11px] tracking-[0.32em]"
                    style={{ color: S1_GOLD }}
                  >
                    {d.countryName.toUpperCase()}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setPage((p) => (p + 1) % pageCount)}
          aria-label="Next"
          className="absolute right-1 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full transition-all hover:scale-110 lg:-right-3"
          style={{ color: S1_GOLD }}
        >
          <ChevronRight size={38} strokeWidth={1.6} />
        </button>

      </div>

      <div className="mt-7 flex items-center justify-center gap-2.5">
        {Array.from({ length: pageCount }).map((_, i) => {
          const active = i === safePage;
          return (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Page ${i + 1}`}
              className="h-[3px] rounded-full transition-all duration-300"
              style={{
                width: active ? 28 : 18,
                background: active
                  ? `linear-gradient(90deg, ${S1_GOLD_SOFT}, ${S1_GOLD})`
                  : "rgba(245,241,230,0.25)",
                boxShadow: active ? "0 0 10px rgba(212,166,74,0.45)" : "none",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function SearchSection({
  query,
  onQueryChange,
  onPickSuggestion,
  preferredHotel,
  onPreferredHotelChange,
  canContinue,
  onNext,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  onPickSuggestion: (d: Destination) => void;
  preferredHotel: string;
  onPreferredHotelChange: (v: string) => void;
  canContinue: boolean;
  onNext: () => void;
}) {
  const [open, setOpen] = useState(false);
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.countryName.toLowerCase().includes(q),
    ).slice(0, 6);
  }, [query]);

  return (
    <div className="mx-auto mt-12 w-full max-w-[1240px] px-6 lg:px-10">
      <div className="flex items-center justify-center gap-4">
        <span
          aria-hidden
          className="h-px w-28 sm:w-36"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,166,74,0) 0%, rgba(212,166,74,0.45) 30%, rgba(212,166,74,0.75) 100%)",
          }}
        />
        <div
          className="text-[13px] tracking-[0.34em]"
          style={{ color: S1_GOLD }}
        >
          OR
        </div>
        <span
          aria-hidden
          className="h-px w-28 sm:w-36"
          style={{
            background:
              "linear-gradient(90deg, rgba(212,166,74,0.75) 0%, rgba(212,166,74,0.45) 70%, rgba(212,166,74,0) 100%)",
          }}
        />
      </div>


      {/* Search field with autocomplete */}
      <div className="relative mt-4">
        <div
          className="flex items-center gap-3 rounded-[14px] px-5 py-4"
          style={{
            backgroundColor: S1_NAVY_SOFT,
            border: `1px solid rgba(212,166,74,0.28)`,
          }}
        >
          <Search size={18} style={{ color: S1_GOLD }} strokeWidth={2} />
          <input
            value={query}
            onChange={(e) => {
              onQueryChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
            placeholder="Type city, region or venue"
            className="w-full bg-transparent text-[14.5px] outline-none placeholder:text-[rgba(245,241,230,0.5)]"
            style={{ color: "#F5F1E6" }}
          />
        </div>

        {open && suggestions.length > 0 && (
          <ul
            className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[14px]"
            style={{
              backgroundColor: S1_NAVY_SOFT,
              border: `1px solid rgba(212,166,74,0.28)`,
              boxShadow: "0 22px 44px -18px rgba(0,0,0,0.7)",
            }}
          >
            {suggestions.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onPickSuggestion(d);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <MapPin size={15} style={{ color: S1_GOLD }} />
                  <span className="text-[14px]" style={{ color: "#F5F1E6" }}>
                    {d.name}
                  </span>
                  <span
                    className="ml-auto text-[11px] tracking-[0.2em]"
                    style={{ color: "rgba(245,241,230,0.55)" }}
                  >
                    {d.countryName.toUpperCase()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Preferred hotel */}
      <div
        className="mt-4 rounded-[14px] px-5 py-4"
        style={{
          backgroundColor: S1_NAVY_SOFT,
          border: `1px solid rgba(212,166,74,0.28)`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="text-[14.5px] font-semibold" style={{ color: "#F5F1E6" }}>
              Preferred hotel or special requests{" "}
              <span style={{ color: "rgba(245,241,230,0.6)", fontWeight: 400 }}>
                (optional)
              </span>
            </div>
            <textarea
              value={preferredHotel}
              onChange={(e) => onPreferredHotelChange(e.target.value)}
              placeholder="Tell us if you have a preferred hotel or anything important we should know…"
              rows={1}
              className="mt-1.5 w-full resize-none bg-transparent text-[13.5px] outline-none placeholder:text-[rgba(245,241,230,0.5)]"
              style={{ color: "rgba(245,241,230,0.9)" }}
            />
          </div>
          <Pencil size={16} style={{ color: S1_GOLD, flexShrink: 0, marginTop: 4 }} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-3 flex flex-col-reverse items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2 text-[13.5px]">
          <ShieldCheck size={16} strokeWidth={2} style={{ color: S1_GOLD }} />
          <span style={{ color: S1_GOLD }}>
            Your request is free and non-binding
          </span>
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="inline-flex items-center gap-3 rounded-[14px] px-10 py-4 text-[15px] font-semibold transition-all hover:-translate-y-[1px]"
          style={{
            background: `linear-gradient(135deg, ${S1_GOLD_SOFT} 0%, ${S1_GOLD} 100%)`,
            color: S1_NAVY,
            boxShadow:
              "0 18px 40px -16px rgba(212,166,74,0.55), inset 0 1px 0 rgba(255,255,255,0.4)",
            opacity: canContinue ? 1 : 0.55,
            cursor: canContinue ? "pointer" : "not-allowed",
            minWidth: 200,
          }}
        >
          Next step
          <ArrowRight size={17} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

function LeisureStep1Screen({
  country,
  setCountry,
  city,
  setCity,
  customDestination,
  setCustomDestination,
  preferredHotel,
  setPreferredHotel,
  canContinue,
  onNext,
  onStepGo,
}: {
  country: CountryCode;
  setCountry: (c: CountryCode) => void;
  city: string;
  setCity: (c: string) => void;
  customDestination: string;
  setCustomDestination: (v: string) => void;
  preferredHotel: string;
  setPreferredHotel: (v: string) => void;
  canContinue: boolean;
  onNext: () => void;
  onStepGo: (s: StepKey) => void;
}) {
  const destinations = DESTINATIONS[country];

  // Derived shared selection id — the same value whether picked via card or autocomplete.
  const selectedId = useMemo(() => {
    if (customDestination.trim()) return null;
    const match = destinations.find((d) => d.name === city);
    return match?.id ?? null;
  }, [customDestination, city, destinations]);

  const handleSelect = (d: Destination) => {
    if (d.country !== country) setCountry(d.country);
    setCity(d.name);
    setCustomDestination("");
  };

  return (
    <main
      className="min-h-screen w-full"
      style={{
        backgroundColor: S1_BG,
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#F5F1E6",
      }}
    >
      <BookingHeader currentStep={1} onStepGo={onStepGo} hideCurrentFlow="leisure" />

      {/* Title */}
      <div className="mx-auto max-w-[1600px] px-6 pt-6 text-center lg:px-10 lg:pt-10">
        <h1
          className="text-[44px] leading-none tracking-[0.02em] sm:text-[64px] lg:text-[86px]"
          style={{
            fontFamily: SERIF,
            color: "#FBF6E8",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          BOOK LEISURE
        </h1>
        <div className="mt-5 flex flex-col items-center">
          <div className="text-[13px] tracking-[0.34em]" style={{ color: S1_GOLD }}>
            CHOOSE YOUR DESTINATION
          </div>
          <div
            className="mt-2 h-px w-24"
            style={{ background: S1_GOLD, opacity: 0.75 }}
          />
        </div>
      </div>

      <CountrySelector country={country} onChange={setCountry} />

      <DestinationCarousel
        destinations={destinations}
        selectedId={selectedId}
        onSelect={handleSelect}
      />

      <SearchSection
        query={customDestination}
        onQueryChange={setCustomDestination}
        onPickSuggestion={handleSelect}
        preferredHotel={preferredHotel}
        onPreferredHotelChange={setPreferredHotel}
        canContinue={canContinue}
        onNext={onNext}
      />

      <div className="h-16 lg:h-24" />
    </main>
  );
}


/* =============================================================
   LEISURE STEP 2 — Accommodation (dark navy premium)
   ============================================================= */

const S2_HERO = s2HeroImg;

const STEP2_ROOMS: {
  key: string;
  title: string;
  desc: string;
  img: string;
}[] = [
  { key: "single", title: "Single Room", desc: "1 person", img: roomSingleImg.url },
  { key: "triple", title: "Triple Room", desc: "3 people", img: roomTripleImg.url },
  { key: "twin", title: "Twin Room", desc: "2 separate beds", img: roomTwinImg.url },
  { key: "family", title: "Family Room", desc: "4+ people", img: roomFamilyImg.url },
  { key: "double", title: "Double Room", desc: "1 double bed", img: roomDoubleImg.url },
  { key: "accessible", title: "Accessible Room", desc: "Wheelchair friendly", img: roomAccessibleImg.url },
];

/* Room categories */
const ROOM_CATEGORY_OPTIONS: Record<string, string[]> = {
  single: ["Standard", "Superior", "Premium", "Junior Suite", "Suite"],
  double: ["Standard", "Superior", "Premium", "Junior Suite", "Suite"],
  twin: ["Standard", "Superior", "Premium"],
  family: ["Family Room", "Junior Suite", "Suite"],
};

/* Default selected category per room type (first option, e.g. "Standard") */
function defaultDraftCategories(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(ROOM_CATEGORY_OPTIONS).map(([k, opts]) => [k, opts[0]]),
  );
}

function LeisureStepShell({
  activeStep,
  onStepGo,
  children,
  hero,
  chapter,
  headline,
  subtext,
  rightSidebar,
  enhancedHero = false,
  pageBg,
  heroOverlay,
  hideHero = false,
}: {
  activeStep: StepKey;
  onStepGo: (s: StepKey) => void;
  children: React.ReactNode;
  hero: string;
  chapter: string;
  headline: React.ReactNode;
  subtext: React.ReactNode;
  rightSidebar?: React.ReactNode;
  enhancedHero?: boolean;
  pageBg?: string;
  heroOverlay?: React.ReactNode;
  hideHero?: boolean;

}) {
  const gridCols = hideHero
    ? "lg:grid-cols-1"
    : rightSidebar
    ? "lg:grid-cols-[minmax(220px,0.68fr)_minmax(640px,2.10fr)_minmax(290px,0.92fr)]"
    : "lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)]";

  return (
    <main
      className="min-h-screen w-full"
      style={{
        background: pageBg ?? S1_NAVY,
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#F5F1E6",
      }}
    >
      <div style={{ borderBottom: `1px solid ${S1_BORDER_SOFT}` }}>
        <BookingHeader
          currentStep={activeStep}
          onStepGo={(s) => onStepGo(s as StepKey)}
          hideCurrentFlow="leisure"
        />
      </div>

      <div className={`mx-auto grid ${hideHero ? "max-w-[1240px] py-4 lg:py-5" : "max-w-[1680px] py-10 lg:py-14"} grid-cols-1 gap-6 px-6 ${gridCols} lg:gap-7 lg:px-8`}>

        {!hideHero && (
        <aside
          className="relative overflow-hidden rounded-[24px] min-h-[520px] lg:min-h-[820px] order-3 lg:order-none"

          style={{
            border: `1px solid ${S1_BORDER_SOFT}`,
            boxShadow: "0 40px 80px -40px rgba(0,0,0,0.6)",
          }}
        >
          <img src={hero} alt="" className={`absolute inset-0 h-full w-full object-cover ${enhancedHero ? "s4-hero-img" : ""}`} />
          {enhancedHero && (
            <>
              <div className="pointer-events-none absolute inset-0 s4-hero-vignette" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[160px] s4-hero-edgefade" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[38%] s4-hero-baselift" />
            </>
          )}
          <div
            className="absolute inset-0"
            style={{
              background: enhancedHero
                ? "linear-gradient(180deg, rgba(8,19,31,0.18) 0%, rgba(8,19,31,0.28) 55%, rgba(8,19,31,0.62) 100%)"
                : "linear-gradient(180deg, rgba(8,19,31,0.35) 0%, rgba(8,19,31,0.48) 55%, rgba(8,19,31,0.86) 100%)",
            }}
          />

          {heroOverlay ? (
            <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-end p-8 sm:p-10 lg:min-h-[820px] lg:p-12">
              {heroOverlay}
            </div>
          ) : (
          <div className="relative z-10 h-full min-h-[520px] p-8 sm:p-10 lg:min-h-[820px] lg:p-12">
            <div className="flex h-full flex-col justify-between lg:ml-[15px] lg:mt-[10px]">

              <div>
                <div className="text-[11px] font-medium tracking-[0.32em]" style={{ color: S1_GOLD_SOFT }}>
                  {chapter}
                </div>
                <h1
                  className="mt-6 text-[42px] sm:text-[52px] lg:text-[60px] leading-[1.02] font-medium text-white"
                  style={{ fontFamily: SERIF }}
                >
                  {headline}
                </h1>
                <div
                  className="mt-6 h-[2px] w-[64px] rounded-full"
                  style={{ background: `linear-gradient(90deg, ${S1_GOLD}, ${S1_GOLD_SOFT})` }}
                />
                <p className="mt-6 max-w-[360px] text-[15.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.82)" }}>
                  {subtext}
                </p>
              </div>

              {enhancedHero ? (
                <div
                  className="mt-8 rounded-[16px] px-5 py-4 sm:px-6"
                  style={{
                    background: "linear-gradient(180deg, rgba(18,34,52,0.46) 0%, rgba(8,19,31,0.56) 100%)",
                    backdropFilter: "blur(10px) saturate(120%)",
                    borderTop: `1px solid rgba(232,199,117,0.55)`,
                    borderLeft: "1px solid rgba(255,255,255,0.08)",
                    borderRight: "1px solid rgba(255,255,255,0.08)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)",
                  }}
                >
                  <div className="flex flex-col items-start gap-2.5 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
                    {["One request.", "Multiple offers.", "The perfect trip."].map((t, i) => (
                      <div key={t} className="flex items-center gap-4">
                        {i > 0 && (
                          <span
                            className="hidden h-[5px] w-[5px] flex-shrink-0 rounded-full sm:block"
                            style={{
                              background: `linear-gradient(135deg, ${S1_GOLD_SOFT}, ${S1_GOLD})`,
                            }}
                          />
                        )}
                        <span className="whitespace-nowrap text-[13px] leading-none text-white/95 lg:text-[13.5px]">{t}</span>
                      </div>
                    ))}
                  </div>

                </div>
              ) : (
                <ul className="space-y-3.5 pt-8">
                  {["One request.", "Multiple offers.", "The perfect trip."].map((t) => (
                    <li key={t} className="flex items-center gap-3 text-[15px] text-white/95">
                      <span
                        className="grid h-6 w-6 place-items-center rounded-full"
                        style={{
                          backgroundColor: "rgba(212,166,74,0.14)",
                          border: `1px solid ${S1_GOLD}`,
                        }}
                      >
                        <Check size={12} strokeWidth={2.6} style={{ color: S1_GOLD_SOFT }} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              )}

            </div>
          </div>
          )}
        </aside>
        )}


        <div className="order-1 lg:order-none min-w-0">{children}</div>

        {rightSidebar && (
          <div className="order-2 lg:order-none min-w-0 lg:sticky lg:top-6 lg:self-start">{rightSidebar}</div>
        )}


      </div>
    </main>
  );
}

function DarkCheckbox({
  label,
  checked,
  onChange,
  align = "left",
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  align?: "left" | "center";
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="group inline-flex items-center gap-3 text-[13px] transition-colors"
      style={{ color: "#F5F1E6", textAlign: align, lineHeight: 1.35 }}
    >
      <span
        className="grid h-6 w-6 place-items-center rounded-lg transition-all duration-200 ease-out group-hover:scale-[1.06]"
        style={{
          background: checked
            ? `linear-gradient(135deg, ${S1_GOLD_SOFT} 0%, ${S1_GOLD} 55%, #B88C2F 100%)`
            : S1_NAVY,
          border: `1px solid ${checked ? S1_GOLD : "rgba(245,241,230,0.22)"}`,
          boxShadow: checked
            ? "inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 16px -8px rgba(212,166,74,0.55)"
            : "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {checked && <Check size={14} strokeWidth={2.8} style={{ color: S1_NAVY }} />}
      </span>
      {label}
    </button>
  );
}

function RoomCounter({
  value,
  onChange,
  onClickStop,
  ariaLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  onClickStop?: (e: React.MouseEvent) => void;
  ariaLabel?: string;
}) {
  const disabled = value === 0;
  const [text, setText] = useState<string>(String(value));
  React.useEffect(() => {
    setText(String(value));
  }, [value]);

  const commit = (raw: string) => {
    const cleaned = raw.replace(/[^\d]/g, "");
    if (cleaned === "") {
      onChange(0);
      setText("0");
      return;
    }
    const n = Math.max(0, parseInt(cleaned, 10) || 0);
    onChange(n);
    setText(String(n));
  };

  return (
    <div
      className="flex items-center justify-end shrink-0"
      style={{ gap: 4, paddingRight: 2 }}
      onClick={onClickStop}
    >
      <button
        type="button"
        aria-label={ariaLabel ? `Decrease ${ariaLabel}` : "Decrease"}
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={disabled}
        className="grid h-[26.5px] w-[26.5px] shrink-0 place-items-center rounded-full transition-all duration-200 hover:bg-white/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold-soft)]"
        style={{ color: S1_GOLD_SOFT, opacity: disabled ? 0.35 : 1, ["--gold-soft" as never]: S1_GOLD_SOFT }}
      >
        <Minus size={13} strokeWidth={2.2} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={ariaLabel ? `${ariaLabel} quantity` : "Quantity"}
        value={text}
        onClick={(e) => {
          e.stopPropagation();
          (e.currentTarget as HTMLInputElement).select();
        }}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d]/g, "");
          setText(v);
          if (v !== "") onChange(Math.max(0, parseInt(v, 10) || 0));
        }}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).blur();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            onChange(value + 1);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            onChange(Math.max(0, value - 1));
          }
        }}
        className="no-spin h-[30.5px] w-[34.5px] rounded-[9px] text-center text-[14px] font-medium text-white outline-none transition-all duration-200 focus:border-[color:var(--gold)]"
        style={{
          fontFamily: SERIF,
          backgroundColor: "rgba(6,16,26,0.85)",
          border: "1px solid rgba(212,166,74,0.32)",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.35)",
          ["--gold" as never]: S1_GOLD,
        }}
      />
      <button
        type="button"
        aria-label={ariaLabel ? `Increase ${ariaLabel}` : "Increase"}
        onClick={() => onChange(value + 1)}
        className="grid h-[26.5px] w-[26.5px] shrink-0 place-items-center rounded-full transition-all duration-200 hover:bg-white/5 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--gold-soft)]"
        style={{ color: S1_GOLD_SOFT, opacity: 0.9, ["--gold-soft" as never]: S1_GOLD_SOFT }}
      >
        <Plus size={13} strokeWidth={2.2} />
      </button>
    </div>
  );
}



/* ==== Leisure Step 2 — Multi-stay workflow ==== */

type LeisureStay = {
  id: string;
  arrival: string; // ISO yyyy-MM-dd
  departure: string;
  rooms: Record<string, number>;
  roomCategories?: Record<string, string>;
};

const GUESTS_PER_ROOM: Record<string, number> = {
  single: 1,
  double: 2,
  twin: 2,
  triple: 3,
  family: 4,
  accessible: 1,
};

const ROOM_LABELS: Record<string, string> = {
  single: "Single Rooms",
  double: "Double Rooms",
  twin: "Twin Rooms",
  triple: "Triple Rooms",
  family: "Family Rooms",
  accessible: "Accessible Rooms",
};

const STEP2_ROOMS_ORDER: string[] = [
  "single",
  "double",
  "twin",
  "triple",
  "family",
  "accessible",
];

const emptyDraftRooms = (): Record<string, number> => ({
  single: 0,
  double: 0,
  twin: 0,
  triple: 0,
  family: 0,
  accessible: 0,
});

function stayNights(a: string, d: string): number {
  if (!a || !d) return 0;
  const ad = new Date(a);
  const dd = new Date(d);
  const diff = Math.round((dd.getTime() - ad.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}
function stayRoomsTotal(r: Record<string, number>): number {
  return Object.values(r).reduce((a, b) => a + b, 0);
}
function stayGuestsTotal(r: Record<string, number>): number {
  return Object.entries(r).reduce(
    (a, [k, v]) => a + v * (GUESTS_PER_ROOM[k] ?? 1),
    0,
  );
}
function fmtStayRange(a: string, d: string): string {
  if (!a || !d) return "";
  const ad = new Date(a);
  const dd = new Date(d);
  const sameMonth = ad.getMonth() === dd.getMonth() && ad.getFullYear() === dd.getFullYear();
  if (sameMonth) {
    return `${format(ad, "d")} – ${format(dd, "d MMMM yyyy")}`;
  }
  return `${format(ad, "d MMM")} – ${format(dd, "d MMM yyyy")}`;
}

/* Step 2 — matte blue-grey design tokens */
const S2_BG = "#2B3E4E";
const S2_BG_GRADIENT =
  "linear-gradient(180deg, #344B5E 0%, #3A5266 52%, #42596D 100%)";
const S2_PANEL = "rgba(46,66,82,0.92)";
const S2_SUNK = "rgba(19,31,42,0.55)";
const S2_CARD = "rgba(46,66,82,0.92)";
const S2_CARD_ACTIVE = "rgba(52,74,92,0.94)";
const S2_FIELD = "#243746";
const S2_TEXT = "#F5F1E6";
/* champagne palette (step 2 only) */
const S2_GOLD = "#D9BF82";
const S2_GOLD_SOFT = "#E7D3A4";
const S2_GOLD_DEEP = "#B99C60";
const S2_CARD_SHADOW =
  "0 1px 0 rgba(255,255,255,0.06) inset, 0 -12px 24px -22px rgba(0,0,0,0.55) inset, 0 18px 38px -26px rgba(6,14,22,0.7)";



/** Sentinel id used when the in-progress draft card asks for removal confirmation. */
const DRAFT_REMOVE_ID = "__draft__";

function LeisureStep2Screen({
  stays,
  setStays,
  roomNotes,
  setRoomNotes,
  canContinue,
  onNext,
  onBack,
  onStepGo,
}: {
  stays: LeisureStay[];
  setStays: React.Dispatch<React.SetStateAction<LeisureStay[]>>;
  roomNotes: string;
  setRoomNotes: (v: string) => void;
  canContinue: boolean;
  onNext: () => void;
  onBack: () => void;
  onStepGo: (s: StepKey) => void;
}) {
  const [draftArrival, setDraftArrival] = useState("");
  const [draftDeparture, setDraftDeparture] = useState("");
  const [draftRooms, setDraftRooms] = useState<Record<string, number>>(emptyDraftRooms());
  const [draftCategories, setDraftCategories] = useState<Record<string, string>>(
    defaultDraftCategories(),
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState<boolean>(stays.length === 0);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [addError, setAddError] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const preEditDraftRef = useRef<{
    arrival: string;
    departure: string;
    rooms: Record<string, number>;
    categories: Record<string, string>;
  } | null>(null);
  const addBtnRef = useRef<HTMLButtonElement | null>(null);

  const draftNights = stayNights(draftArrival, draftDeparture);
  const draftRoomsCount = stayRoomsTotal(draftRooms);
  const draftGuestsCount = stayGuestsTotal(draftRooms);
  const datesValid =
    !!draftArrival &&
    !!draftDeparture &&
    new Date(draftDeparture).getTime() > new Date(draftArrival).getTime();
  const canAddStay = datesValid && draftRoomsCount > 0;
  const stayNumber = editingId
    ? stays.findIndex((s) => s.id === editingId) + 1
    : stays.length + 1;

  const resetDraft = () => {
    setDraftArrival("");
    setDraftDeparture("");
    setDraftRooms(emptyDraftRooms());
    setDraftCategories(defaultDraftCategories());
    setEditingId(null);
  };

  const commitStay = () => {
    if (savingRef.current) return; // prevent duplicate submissions
    if (!canAddStay) {
      setAddError(true);
      setShowEditor(true);
      if (typeof window !== "undefined") {
        addBtnRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    savingRef.current = true;
    setSaving(true);
    try {
      const id =
        editingId ?? (typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now()));
      const stay: LeisureStay = {
        id,
        arrival: draftArrival,
        departure: draftDeparture,
        rooms: { ...draftRooms },
        roomCategories: Object.fromEntries(
          Object.entries(draftCategories).filter(([k, v]) => v && (draftRooms[k] ?? 0) > 0),
        ),
      };
      setStays((prev) =>
        editingId ? prev.map((s) => (s.id === editingId ? stay : s)) : [...prev, stay],
      );
      setAddError(false);
      setLastAddedId(id);
      window.setTimeout(() => {
        setLastAddedId((cur) => (cur === id ? null : cur));
      }, 320);
      // Reset only after the stay has been saved, and keep a fresh form visible.
      const prev = editingId ? preEditDraftRef.current : null;
      preEditDraftRef.current = null;
      resetDraft();
      if (prev) {
        setDraftArrival(prev.arrival);
        setDraftDeparture(prev.departure);
        setDraftRooms({ ...prev.rooms });
        setDraftCategories({ ...prev.categories });
      }
      setShowEditor(true);
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };

  /** Top "+ Add another stay": same handler as "Add this stay". */
  const commitAndStartNext = () => {
    // From a saved stay card with no draft in progress: just open a fresh form.
    if (!showEditor && !draftArrival && !draftDeparture && stayRoomsTotal(draftRooms) === 0) {
      startNewStay();
      return;
    }
    commitStay();
  };



  const editStay = (id: string) => {
    const s = stays.find((x) => x.id === id);
    if (!s) return;
    if (!editingId) {
      preEditDraftRef.current = {
        arrival: draftArrival,
        departure: draftDeparture,
        rooms: { ...draftRooms },
        categories: { ...draftCategories },
      };
    }
    setEditingId(id);
    setAddError(false);
    setPendingRemoveId(null);
    setDraftArrival(s.arrival);
    setDraftDeparture(s.departure);
    setDraftRooms({ ...emptyDraftRooms(), ...s.rooms });
    setDraftCategories({ ...defaultDraftCategories(), ...(s.roomCategories ?? {}) });
    setShowEditor(true);
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /** Leave edit mode without touching the saved stay; restore the pre-edit draft. */
  const cancelEdit = () => {
    const prev = preEditDraftRef.current;
    setEditingId(null);
    setAddError(false);
    setPendingRemoveId(null);
    setDraftArrival(prev?.arrival ?? "");
    setDraftDeparture(prev?.departure ?? "");
    setDraftRooms(prev ? { ...prev.rooms } : emptyDraftRooms());
    setDraftCategories(prev ? { ...prev.categories } : defaultDraftCategories());
    preEditDraftRef.current = null;
    setShowEditor(true);
  };

  const removeStay = (id: string) => {
    setRemovingIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    window.setTimeout(() => {
      setStays((prev) => prev.filter((s) => s.id !== id));
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (editingId === id) resetDraft();
      // Never leave the page without an active stay form.
      setShowEditor(true);
    }, 220);
  };

  const startNewStay = () => {
    resetDraft();
    setShowEditor(true);
  };

  const cancelEditor = () => {
    resetDraft();
    setShowEditor(false);
  };

  /** Ask for confirmation before deleting a saved stay (in-card, no browser dialog). */
  const requestRemoveStay = (id: string) => {
    setPendingRemoveId(id);
  };

  const confirmPendingRemove = () => {
    const id = pendingRemoveId;
    setPendingRemoveId(null);
    if (!id) return;
    if (id === DRAFT_REMOVE_ID) {
      resetDraft();
      setAddError(false);
      setShowEditor(true);
      return;
    }
    removeStay(id);
  };

  const cancelPendingRemove = () => setPendingRemoveId(null);

  const draftIsEmpty =
    !draftArrival && !draftDeparture && draftRoomsCount === 0;

  /** Remove from the editor card: delete the stay being edited, or reset the draft. */
  const handleEditorRemove = () => {
    if (editingId) {
      requestRemoveStay(editingId);
      return;
    }
    if (draftIsEmpty) {
      // Nothing to confirm — keep the form visible and clean.
      resetDraft();
      setAddError(false);
      setShowEditor(true);
      return;
    }
    setPendingRemoveId(DRAFT_REMOVE_ID);
  };



  const totalStays = stays.length;
  const totalRoomsAll = stays.reduce((a, s) => a + stayRoomsTotal(s.rooms), 0);
  const totalGuestsAll = stays.reduce((a, s) => a + stayGuestsTotal(s.rooms), 0);

  // A fresh empty stay form always stays visible, so it must not block continuing.
  const nextEnabled = canContinue && stays.length > 0 && !editingId;

  /* Live caption for the left hero image */
  const heroSource = stays[0]
    ? {
        index: 1,
        arrival: stays[0].arrival,
        departure: stays[0].departure,
      }
    : { index: stayNumber, arrival: draftArrival, departure: draftDeparture };
  const heroNights = stayNights(heroSource.arrival, heroSource.departure);
  const heroStayLabel = `Stay ${heroSource.index}`;
  const heroStayMeta =
    heroSource.arrival && heroSource.departure && heroNights > 0
      ? `${fmtStayRange(heroSource.arrival, heroSource.departure)}  |  ${heroNights} ${heroNights === 1 ? "night" : "nights"}`
      : "Select your dates to begin";

  return (
    <main
      className="min-h-screen w-full"
      style={{
        overflowX: "clip",
        backgroundColor: S2_BG,
        backgroundImage: S2_BG_GRADIENT,
        backgroundRepeat: "no-repeat",
        fontFamily: "Inter, system-ui, sans-serif",
        color: S2_TEXT,
      }}
    >
      <div style={{ borderBottom: `1px solid ${S1_BORDER_SOFT}` }}>
        <BookingHeader
          currentStep={2}
          onStepGo={(s) => onStepGo(s as StepKey)}
          hideCurrentFlow="leisure"
        />
      </div>

      <div
        className="mx-auto grid w-full grid-cols-1 lg:grid-cols-[minmax(363px,1.298fr)_minmax(0,2.86fr)_300px]"
        style={{ maxWidth: 1780, padding: 28, gap: 24 }}
      >
        {/* ---------- LEFT: vertical hotel image ---------- */}
        <aside className="order-2 lg:order-none min-w-0 lg:pr-[10px] lg:self-start">
          <div
            className="relative overflow-hidden lg:sticky lg:top-7"
            style={{
              borderRadius: 28,
              minHeight: 560,
              height: "calc(100vh - 96px)",
              maxHeight: 1120,
              border: "1px solid rgba(217,191,130,0.22)",
              boxShadow:
                "0 2px 0 rgba(255,255,255,0.07) inset, 0 0 0 1px rgba(10,18,26,0.4), 0 18px 40px -26px rgba(4,10,16,0.6), 0 44px 88px -38px rgba(6,13,20,0.78), 0 80px 150px -70px rgba(0,0,0,0.75)",
            }}
          >
            <img
              src={s2StayHeroImg.url}
              alt="Premium hotel room with city and waterfront view"
              className="absolute left-0 top-0 h-full w-full"
              style={{ objectFit: "cover", objectPosition: "center center" }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                borderRadius: 24,
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 60px -18px rgba(0,0,0,0.55)",
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0"
              style={{
                height: "15%",
                background:
                  "linear-gradient(180deg, rgba(11,19,27,0) 0%, rgba(11,19,27,0.42) 45%, rgba(11,19,27,0.78) 100%)",
              }}
            />
            <div className="absolute bottom-9 left-9 right-9">
              <div
                className="text-[12.5px] font-semibold uppercase tracking-[0.26em] text-white"
              >
                {heroStayLabel}
              </div>
              <div className="mt-2 text-[14px]" style={{ color: "rgba(245,241,230,0.8)" }}>
                {heroStayMeta}
              </div>
            </div>
          </div>
        </aside>


        {/* ---------- MAIN: working area ---------- */}
        <section
          className="order-1 lg:order-none min-w-0"
          style={{
            backgroundColor: S2_PANEL,
            borderRadius: 24,
            padding: 30,
            paddingBottom: 22,
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.07), 0 24px 54px -34px rgba(6,13,20,0.7), 0 60px 110px -70px rgba(0,0,0,0.6)",
          }}
        >

          {/* Page heading */}
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="min-w-0">
              <h1
                className="text-[34px] lg:text-[40px] font-medium leading-[1.06] text-white"
                style={{ fontFamily: SERIF }}
              >
                Step 2 – Accommodation
              </h1>
              <p className="mt-2.5 text-[15px]" style={{ color: "rgba(245,241,230,0.62)" }}>
                How many rooms will your group need?
              </p>
            </div>
          </div>

          {/* 1 — ACTIVE STAY EDITOR (always at the top, editor only) */}
          <div className="mt-4">
            <div
              className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: "rgba(247,244,236,0.72)" }}
            >
              {editingId ? "Editing stay" : "Active stay"}
            </div>
            <S2StayCard
              title={editingId ? `Editing Stay ${stayNumber}` : `Stay ${stayNumber}`}
              arrival={draftArrival}
              departure={draftDeparture}
              nights={draftNights}
              rooms={draftRoomsCount}
              guests={draftGuestsCount}
              editable
              onArrival={(v: string) => {
                setDraftArrival(v);
                if (v && (!draftDeparture || new Date(draftDeparture) <= new Date(v))) {
                  const next = new Date(`${v}T00:00:00`);
                  next.setDate(next.getDate() + 1);
                  setDraftDeparture(next.toISOString().slice(0, 10));
                }
              }}
              onDeparture={setDraftDeparture}
              onAddAnother={commitAndStartNext}
              onRemove={handleEditorRemove}
              confirming={
                pendingRemoveId === DRAFT_REMOVE_ID ||
                (!!editingId && pendingRemoveId === editingId)
              }
              onConfirmRemove={confirmPendingRemove}
              onCancelRemove={cancelPendingRemove}
            />
          </div>


          <div
            className="mt-7 text-[11.5px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: "rgba(247,244,236,0.72)" }}
          >
            Room Distribution
          </div>
          <div
            className="mt-2.5"
            style={{
              width: 60,
              height: 1,
              background: `linear-gradient(90deg, ${S2_GOLD} 0%, rgba(217,191,130,0.15) 100%)`,
            }}
          />

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {STEP2_ROOMS_ORDER.map((key) => (
              <S2RoomCard
                key={key}
                roomKey={key}
                value={draftRooms[key] ?? 0}
                onChange={(v) => {
                  if (!showEditor) setShowEditor(true);
                  setDraftRooms((r) => ({ ...r, [key]: Math.max(0, v) }));
                }}
                category={draftCategories[key]}
                onCategoryChange={(v) => setDraftCategories((c) => ({ ...c, [key]: v }))}
              />
            ))}
          </div>

          {/* Notes */}
          <div className="mt-4">
            <div className="text-[14px] font-medium" style={{ color: S2_TEXT }}>
              Anything else we should know?{" "}
              <span style={{ color: "rgba(245,241,230,0.45)" }}>(optional)</span>
            </div>
            <div
              className="mt-3 px-5 py-4 transition-colors duration-300"
              style={{
                borderRadius: 18,
                backgroundColor: S2_SUNK,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 26px 50px -40px rgba(0,0,0,0.7)",
              }}
            >
              <textarea
                value={roomNotes}
                onChange={(e) => setRoomNotes(e.target.value.slice(0, 500))}
                placeholder="Tell us anything important about your accommodation needs…"
                rows={2}
                className="w-full resize-none bg-transparent text-[14px] leading-relaxed outline-none"
                style={{ color: S2_TEXT }}
              />
              <div className="mt-1 text-right text-[11.5px]" style={{ color: "rgba(245,241,230,0.35)" }}>
                {roomNotes.length} / 500
              </div>
            </div>
          </div>

          {/* 4 — Add this stay */}
          <div className="mt-3 flex flex-col items-end gap-2">
            {addError && !canAddStay && (
              <span className="text-[13px]" style={{ color: "rgba(238,170,150,0.95)" }}>
                Please select arrival and departure dates and at least one room.
              </span>
            )}
            <button
              ref={addBtnRef}
              type="button"
              onClick={() => commitStay()}
              aria-disabled={!canAddStay}
              disabled={saving}
              className="s2-btn inline-flex items-center gap-3 px-8 py-4 text-[15px] font-semibold hover:-translate-y-[2px] active:translate-y-0"
              style={{
                borderRadius: 16,
                background: canAddStay
                  ? `linear-gradient(180deg, ${S2_GOLD_SOFT} 0%, ${S2_GOLD} 52%, ${S2_GOLD_DEEP} 100%)`
                  : "rgba(255,255,255,0.05)",
                color: canAddStay ? "#10202F" : "rgba(245,241,230,0.4)",
                boxShadow: canAddStay
                  ? "0 18px 38px -18px rgba(20,14,4,0.55), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -2px 0 rgba(120,95,45,0.35)"
                  : "none",
                cursor: canAddStay ? "pointer" : "not-allowed",
              }}
            >
              {editingId ? "Save changes" : "Add this stay"}
              <ArrowRight size={18} strokeWidth={2.4} />
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-transparent p-0 text-[13.5px] font-light underline-offset-4 transition-opacity duration-200 hover:opacity-100"
                style={{ color: "rgba(245,241,230,0.6)", border: "none", opacity: 0.85 }}
              >
                Cancel
              </button>
            )}
          </div>

          {/* 5 — Completed stays (rendered BELOW "Add this stay") */}
          {stays.some((s) => s.id !== editingId) && (
            <div className="mt-8" data-section="completed-stays">
              <div
                className="text-[11.5px] font-semibold uppercase tracking-[0.28em]"
                style={{ color: "rgba(247,244,236,0.72)" }}
              >
                Completed stays
              </div>
              <div
                className="mt-2.5"
                style={{
                  width: 60,
                  height: 1,
                  background: `linear-gradient(90deg, ${S2_GOLD} 0%, rgba(217,191,130,0.15) 100%)`,
                }}
              />
              <div className="mt-4 space-y-2.5">
                {stays.map((s, idx) => {
                  if (s.id === editingId) return null;
                  return (
                    <S2CompletedStayCard
                      key={s.id}
                      index={idx + 1}
                      arrival={s.arrival}
                      departure={s.departure}
                      nights={stayNights(s.arrival, s.departure)}
                      rooms={stayRoomsTotal(s.rooms)}
                      guests={stayGuestsTotal(s.rooms)}
                      animClass={`${lastAddedId === s.id ? "stay-slide-in" : ""} ${removingIds.has(s.id) ? "stay-removing" : ""}`}
                      onEdit={() => editStay(s.id)}
                      onRemove={() => requestRemoveStay(s.id)}
                      confirming={pendingRemoveId === s.id}
                      onConfirmRemove={confirmPendingRemove}
                      onCancelRemove={cancelPendingRemove}
                    />
                  );
                })}
              </div>
            </div>
          )}





          {/* Navigation */}
          <div className="mt-2 flex items-center justify-between gap-6">
            <button
              type="button"
              onClick={onBack}
              className="s2-btn inline-flex items-center gap-2 px-6 py-3.5 text-[14.5px] font-medium hover:-translate-y-[2px]"
              style={{
                borderRadius: 14,
                color: S2_GOLD_SOFT,
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            >
              <ArrowLeft size={16} strokeWidth={2.2} />
              Back
            </button>

            <div className="flex flex-col items-end gap-1.5">
              <button
                type="button"
                onClick={onNext}
                disabled={!nextEnabled}
                className="s2-btn inline-flex items-center gap-2.5 px-9 py-4 text-[15px] font-semibold hover:-translate-y-[2px]"
                style={{
                  borderRadius: 16,
                  background: `linear-gradient(180deg, ${S2_GOLD_SOFT} 0%, ${S2_GOLD} 52%, ${S2_GOLD_DEEP} 100%)`,
                  color: "#10202F",
                  boxShadow: "0 18px 38px -18px rgba(20,14,4,0.55), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -2px 0 rgba(120,95,45,0.35)",
                  opacity: nextEnabled ? 1 : 0.4,
                  cursor: nextEnabled ? "pointer" : "not-allowed",
                }}
              >
                Next step
                <ArrowRight size={17} strokeWidth={2.4} />
              </button>
              {!nextEnabled && (
                <span className="text-[11.5px]" style={{ color: "rgba(245,241,230,0.45)" }}>
                  {stays.length === 0 ? "Add at least one stay to continue" : "Finish editing to continue"}
                </span>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-center gap-2 text-center text-[13.5px]">
            <span
              className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full"
              style={{
                color: "#10202F",
                background: `linear-gradient(135deg, ${S2_GOLD_SOFT} 0%, ${S2_GOLD} 100%)`,
                boxShadow: "0 0 0 1px rgba(217,191,130,0.35)",
              }}
            >
              <Check size={11} strokeWidth={3.2} />
            </span>
            <span style={{ color: S2_GOLD_SOFT }}>Expert support every step of the way</span>
          </div>
        </section>

        {/* ---------- RIGHT: tip + sticky summary ---------- */}
        <div className="order-3 lg:order-none min-w-0 space-y-6 lg:self-start">
          <div
            style={{
              borderRadius: 20,
              backgroundColor: S2_CARD,
              border: "1px solid rgba(255,255,255,0.05)",
              padding: 22,
              boxShadow: S2_CARD_SHADOW,
            }}
          >
            <Lightbulb size={20} strokeWidth={1.8} style={{ color: S2_GOLD_SOFT }} />
            <div
              className="mt-3 text-[12px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: S2_GOLD_SOFT }}
            >
              Tip
            </div>
            <p className="mt-2.5 text-[13.5px] leading-relaxed" style={{ color: "rgba(245,241,230,0.62)" }}>
              You can add multiple stays after completing this one.
            </p>
          </div>

          <div className="lg:sticky lg:top-7">
          <AccommodationSummary
            stays={stays}
            totalStays={totalStays}
            totalRooms={totalRoomsAll}
            totalGuests={totalGuestsAll}
            nextEnabled={nextEnabled}
            onContinue={onNext}
            lastAddedId={lastAddedId}
            removingIds={removingIds}
          />
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---- Step 2 Stay card (single premium component) ---- */
/** Compact, read-only summary of a saved stay. Used ONLY below "Add this stay". */
function S2CompletedStayCard({
  index,
  arrival,
  departure,
  nights,
  rooms,
  guests,
  onEdit,
  onRemove,
  confirming = false,
  onConfirmRemove,
  onCancelRemove,
  animClass = "",
}: {
  index: number;
  arrival: string;
  departure: string;
  nights: number;
  rooms: number;
  guests: number;
  onEdit: () => void;
  onRemove: () => void;
  confirming?: boolean;
  onConfirmRemove?: () => void;
  onCancelRemove?: () => void;
  animClass?: string;
}) {
  const fmt = (iso: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return "—";
    return format(new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])), "d MMM yyyy");
  };

  return (
    <div
      className={animClass}
      style={{
        borderRadius: 16,
        backgroundImage: "linear-gradient(165deg, rgba(38,58,75,0.65) 0%, rgba(31,49,64,0.65) 100%)",
        border: "1px solid rgba(217,191,130,0.14)",
        padding: "16px 20px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 items-center gap-4">
          <span
            className="grid h-9 w-9 shrink-0 place-items-center text-[14px] font-semibold"
            style={{
              borderRadius: 999,
              border: "1px solid rgba(217,191,130,0.35)",
              color: S2_GOLD_SOFT,
            }}
          >
            {index}
          </span>
          <div className="min-w-0">
            <div className="text-[15px] font-medium" style={{ color: "#F7F3EA" }}>
              {fmt(arrival)} — {fmt(departure)}
            </div>
            <div className="mt-1 text-[12.5px]" style={{ color: "rgba(226,232,240,0.5)" }}>
              {nights} {nights === 1 ? "night" : "nights"} · {rooms} {rooms === 1 ? "room" : "rooms"} · {guests}{" "}
              {guests === 1 ? "guest" : "guests"}
            </div>
          </div>
        </div>

        {confirming ? (
          <div className="flex items-center gap-3">
            <span className="text-[13px]" style={{ color: "rgba(245,241,230,0.7)" }}>
              Remove this stay?
            </span>
            <button
              type="button"
              onClick={onConfirmRemove}
              className="bg-transparent p-0 text-[13px] font-semibold"
              style={{ color: "rgba(238,170,150,0.95)", border: "none" }}
            >
              Yes, remove
            </button>
            <button
              type="button"
              onClick={onCancelRemove}
              className="bg-transparent p-0 text-[13px]"
              style={{ color: "rgba(245,241,230,0.6)", border: "none" }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={onEdit}
              className="bg-transparent p-0 text-[13.5px] font-medium"
              style={{ color: S2_GOLD_SOFT, border: "none" }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="bg-transparent p-0 text-[13.5px]"
              style={{ color: "rgba(245,241,230,0.55)", border: "none" }}
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function S2StayCard({

  title,
  arrival,
  departure,
  nights,
  rooms,
  guests,
  editable = false,
  onArrival,
  onDeparture,
  onAddAnother,
  onEdit,
  onRemove,
  confirming = false,
  onConfirmRemove,
  onCancelRemove,
  animClass = "",
}: {
  title: string;
  arrival: string;
  departure: string;
  nights: number;
  rooms: number;
  guests: number;
  editable?: boolean;
  onArrival?: (v: string) => void;
  onDeparture?: (v: string) => void;
  onAddAnother: () => void;
  onEdit?: () => void;
  onRemove: () => void;
  confirming?: boolean;
  onConfirmRemove?: () => void;
  onCancelRemove?: () => void;
  animClass?: string;
}) {
  const toDate = (iso: string): Date | undefined => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return undefined;
    const y = Number(m[1]);
    if (y < 1900 || y > 2999) return undefined;
    const d = new Date(y, Number(m[2]) - 1, Number(m[3]));
    return isNaN(d.getTime()) ? undefined : d;
  };
  const toISO = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const today = React.useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const DateCol = ({
    label,
    value,
    onChange,
    minDate,
    align,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange?: (v: string) => void;
    minDate?: Date;
    align: "left" | "right";
    placeholder: string;
  }) => {
    const [open, setOpen] = React.useState(false);
    const selected = toDate(value);
    const interactive = editable && !!onChange;

    const dateValue = (
      <span
        className={`whitespace-nowrap font-medium leading-none ${selected ? "text-[21px]" : "text-[15px]"}`}
        style={{ color: selected ? "#F7F3EA" : "rgba(226,216,198,0.45)" }}
      >
        {selected ? format(selected, "d MMM yyyy") : placeholder}
      </span>
    );

    const icon = (
      <span aria-hidden className="shrink-0 leading-none" style={{ color: "rgba(217,191,130,0.9)" }}>
        <CalendarDays size={16} strokeWidth={1.5} />
      </span>
    );

    const field = (
      <div className={`flex min-w-0 flex-col gap-[9px] ${align === "right" ? "items-end text-right" : "items-start text-left"}`}>
        <span
          className="whitespace-nowrap text-[9.5px] font-medium uppercase leading-none tracking-[0.18em]"
          style={{ color: "rgba(226,232,240,0.36)" }}
        >
          {label}
        </span>
        <div className="flex items-center gap-[3px]">
          {align === "right" ? (
            <>
              {dateValue}
              {icon}
            </>
          ) : (
            <>
              {icon}
              {dateValue}
            </>
          )}
        </div>
        {selected ? (
          <span
            className="whitespace-nowrap text-[12px] font-light leading-none"
            style={{ color: "rgba(226,232,240,0.45)" }}
          >
            {format(selected, "EEEE")}
          </span>
        ) : null}
      </div>
    );

    const trigger = (
      <button
        type="button"
        disabled={!interactive}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${label} date`}
        className="s2-date-field flex w-full min-w-0 items-center rounded-[12px] bg-transparent px-2 py-3 text-left transition-colors duration-200 disabled:cursor-default"
        style={{ border: "1px solid transparent", cursor: interactive ? "pointer" : "default", justifyContent: align === "right" ? "flex-end" : "flex-start" }}
      >
        {field}
      </button>
    );

    if (!interactive) return <div className="min-w-0">{trigger}</div>;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent
          align={align === "right" ? "end" : "start"}
          sideOffset={10}
          className="pointer-events-auto z-[120] w-auto border p-0"
          style={{
            backgroundColor: "#1B2C3C",
            borderColor: "rgba(217,191,130,0.28)",
            boxShadow: "0 30px 70px -30px rgba(4,10,16,0.85)",
          }}
        >
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected ?? minDate ?? today}
            disabled={{ before: minDate ?? today }}
            onSelect={(d: Date | undefined) => {
              if (!d) return;
              onChange?.(toISO(d));
              setOpen(false);
            }}
            initialFocus
            className="pointer-events-auto p-3 text-[#F2EDE3]"
          />
        </PopoverContent>
      </Popover>
    );
  };





  const dateTimeline = (
    <div
      className="grid items-center px-[28px] py-[6px]"
      style={{
        width: compact ? "100%" : "92%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: compact ? 0 : 24,
        gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)",
        borderRadius: 15,
        backgroundImage: "linear-gradient(180deg, #203548 0%, #1B2E3E 52%, #182B3A 100%)",
        border: "1px solid rgba(217,191,130,0.30)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.22), 0 22px 50px -34px rgba(6,13,20,0.85)",
      }}
    >
      <DateCol
        label="Arrival"
        value={arrival}
        onChange={onArrival}
        align="left"
        placeholder="Select arrival date"
      />
      <ArrowRight
        size={34}
        strokeWidth={1.1}
        className="mx-3 shrink-0 self-center"
        style={{ color: "rgba(217,191,130,0.9)" }}
      />
      <DateCol
        label="Departure"
        value={departure}
        onChange={onDeparture}
        minDate={(() => {
          const a = toDate(arrival);
          if (!a) return undefined;
          const n = new Date(a);
          n.setDate(n.getDate() + 1);
          return n;
        })()}
        align="right"
        placeholder="Select departure date"
      />
    </div>
  );

  if (compact) return <div className={animClass}>{dateTimeline}</div>;

  return (
    <div
      className={animClass}
      style={{
        height: "auto",
        minHeight: 0,
        borderRadius: 22,
        backgroundImage: "linear-gradient(165deg, #293E4F 0%, #263B4C 52%, #223648 100%)",
        border: "1px solid rgba(217,191,130,0.18)",
        padding: "30px 36px 22px",
        boxShadow:
          "inset 0 1.5px 0 rgba(255,255,255,0.08), 0 6px 18px -6px rgba(6,13,20,0.55), 0 40px 90px -60px rgba(6,13,20,0.95)",
        display: "flex",
        flexDirection: "column",
      }}

    >

      {/* SECTION 1 — header */}
      <div className="flex items-baseline justify-between gap-4">
        <h3
          className="text-[32px] font-medium leading-none"
          style={{ fontFamily: SERIF, color: "#FDFBF6" }}
        >
          {title}
        </h3>
        <button
          type="button"
          onClick={onAddAnother}
          className="inline-flex items-baseline gap-2 bg-transparent p-0 text-[14px] font-extralight leading-none transition-opacity duration-200 hover:opacity-100"
          style={{ color: S2_GOLD_SOFT, opacity: 0.92, border: "none" }}
        >
          <Plus size={15} strokeWidth={1.3} className="translate-y-[2px]" />
          Add another stay
        </button>
      </div>

      {/* SECTION 2 — unified date timeline */}
      <div
        className="grid items-center px-[28px] py-[6px]"
        style={{
          width: "92%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 24,
          gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)",
          borderRadius: 15,
          backgroundImage: "linear-gradient(180deg, #203548 0%, #1B2E3E 52%, #182B3A 100%)",
          border: "1px solid rgba(217,191,130,0.30)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.22), 0 22px 50px -34px rgba(6,13,20,0.85)",
        }}
      >
        <DateCol
          label="Arrival"
          value={arrival}
          onChange={onArrival}
          align="left"
          placeholder="Select arrival date"
        />
        <ArrowRight
          size={34}
          strokeWidth={1.1}
          className="mx-3 shrink-0 self-center"
          style={{ color: "rgba(217,191,130,0.9)" }}
        />
        <DateCol
          label="Departure"
          value={departure}
          onChange={onDeparture}
          minDate={(() => {
            const a = toDate(arrival);
            if (!a) return undefined;
            const n = new Date(a);
            n.setDate(n.getDate() + 1);
            return n;
          })()}
          align="right"
          placeholder="Select departure date"
        />

      </div>


      {/* SECTION 3 — bottom action zone */}
      <div
        className="mt-auto flex items-center justify-between px-3 py-[3px]"
        style={{
          borderRadius: 12,
          backgroundColor: "rgba(12,22,32,0.16)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          transform: "translateY(16px)",
        }}
      >
        {confirming ? (
          <>
            <span
              className="flex min-w-0 flex-1 basis-0 items-center justify-center gap-2.5 whitespace-nowrap py-1 text-[14.5px] font-light"
              style={{ color: "rgba(248,245,238,0.92)" }}
            >
              Remove this stay?
            </span>
            <S2StayDivider />
            <S2StayInfo
              icon={<Trash2 size={18} strokeWidth={1.6} />}
              text="Confirm"
              onClick={onConfirmRemove}
            />
            <S2StayDivider />
            <S2StayInfo icon={<X size={18} strokeWidth={1.6} />} text="Cancel" onClick={onCancelRemove} />
          </>
        ) : (
          <>
            <S2StayInfo icon={<MoonIcon />} text={`${nights} ${nights === 1 ? "Night" : "Nights"}`} />
            <S2StayDivider />
            <S2StayInfo icon={<BedDouble size={19} strokeWidth={1.6} />} text={`${rooms} ${rooms === 1 ? "Room" : "Rooms"}`} />
            <S2StayDivider />
            <S2StayInfo icon={<UserRound size={19} strokeWidth={1.6} />} text={`${guests} ${guests === 1 ? "Guest" : "Guests"}`} />
            {onEdit && (
              <>
                <S2StayDivider />
                <S2StayInfo icon={<Pencil size={18} strokeWidth={1.6} />} text="Edit" onClick={onEdit} />
              </>
            )}
            <S2StayDivider />
            <S2StayInfo icon={<Trash2 size={18} strokeWidth={1.6} />} text="Remove" onClick={onRemove} />
          </>
        )}
      </div>


    </div>
  );
}


function S2StayDivider() {
  return (
    <span
      aria-hidden
      className="mx-[8px] hidden sm:block"
      style={{ width: 1, height: 20, backgroundColor: "rgba(255,255,255,0.10)" }}
    />
  );
}

function S2StayInfo({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="s2-stay-info-icon transition-opacity duration-200" style={{ color: "rgba(217,191,130,0.8)", opacity: 1 }}>
        {icon}
      </span>
      <span className="s2-stay-info-text transition-colors duration-200" style={{ color: "rgba(248,245,238,0.92)" }}>
        {text}
      </span>
    </>
  );
  const cls =
    "s2-stay-info group flex min-w-0 flex-1 basis-0 items-center justify-center gap-2.5 whitespace-nowrap py-1 text-[14.5px] font-light";

  return onClick ? (
    <button type="button" onClick={onClick} className={cls}>
      {content}
    </button>
  ) : (
    <span className={cls}>{content}</span>
  );
}


function S2Metric({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[14px]" style={{ color: "rgba(245,241,230,0.85)" }}>
      <span style={{ color: S2_GOLD_SOFT }}>{icon}</span>
      {text}
    </div>
  );
}

function S2DateField({
  label,
  value,
  editable,
  min,
  onChange,
}: {
  label: string;
  value: string;
  editable?: boolean;
  min?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <label className="block min-w-0">
      <span
        className="text-[11.5px] font-semibold uppercase tracking-[0.18em]"
        style={{ color: "rgba(245,241,230,0.5)" }}
      >
        {label}
      </span>
      <div
        className="mt-2.5 flex h-[58px] items-center gap-3.5 px-5 transition-colors duration-200"
        style={{
          borderRadius: 14,
          backgroundColor: S2_FIELD,
          border: `1px solid ${value ? "rgba(217,191,130,0.32)" : "rgba(255,255,255,0.08)"}`,
        }}
      >
        <CalendarDays size={18} strokeWidth={1.9} style={{ color: S2_GOLD_SOFT }} />
        {editable ? (
          <input
            type="date"
            value={value}
            min={min}
            onChange={(e) => onChange?.(e.target.value)}
            className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none [color-scheme:dark]"
          />
        ) : (
          <span className="truncate text-[15px] text-white">{value ? format(new Date(value), "d MMMM yyyy") : "—"}</span>
        )}
      </div>
    </label>
  );
}

/* ---- Step 2 luxury room card ---- */
function S2RoomCard({
  roomKey,
  value,
  onChange,
  category,
  onCategoryChange,
}: {
  roomKey: string;
  value: number;
  onChange: (v: number) => void;
  category?: string;
  onCategoryChange?: (v: string) => void;
}) {
  const meta = STEP2_ROOMS.find((r) => r.key === roomKey)!;
  const active = value > 0;
  const categoryOptions = ROOM_CATEGORY_OPTIONS[roomKey];

  return (
    <div
      className="group s2-room-card flex flex-col"
      data-active={active ? "true" : "false"}
      style={{
        borderRadius: 20,
        padding: 13,
        backgroundColor: active ? "rgba(58,82,101,0.96)" : S2_CARD,
        backgroundImage: active
          ? "linear-gradient(180deg, rgba(255,255,255,0.085) 0%, rgba(255,255,255,0.022) 44%, rgba(0,0,0,0.05) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.012) 42%, rgba(0,0,0,0.05) 100%)",
        border: `1px solid ${active ? "rgba(217,191,130,0.48)" : "rgba(255,255,255,0.09)"}`,
        boxShadow: active
          ? "inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 18px -14px rgba(4,10,16,0.55), 0 22px 46px -26px rgba(4,10,16,0.7), 0 0 0 1px rgba(217,191,130,0.10), 0 16px 44px -24px rgba(217,191,130,0.42)"
          : "inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 18px -14px rgba(4,10,16,0.5), 0 22px 46px -26px rgba(4,10,16,0.68)",
        transition:
          "transform 180ms cubic-bezier(0.22,0.61,0.36,1), box-shadow 180ms cubic-bezier(0.22,0.61,0.36,1), border-color 180ms ease-out, background-color 180ms ease-out",
      }}
    >
      {/* header */}
      <div className="flex items-center gap-2.5">
        <span
          className="shrink-0"
          style={{ color: active ? S2_GOLD_SOFT : "rgba(245,241,230,0.82)" }}
        >
          {roomIcon(roomKey)}
        </span>
        <div className="min-w-0">
          <div className="text-[14.5px] font-medium leading-tight text-white">{meta.title}</div>
          <div className="mt-[2px] text-[12px]" style={{ color: "rgba(232,238,244,0.55)" }}>
            {meta.desc}
          </div>
        </div>
      </div>

      {/* image */}
      <div
        className="relative mt-3 overflow-hidden"
        style={{
          borderRadius: 13,
          aspectRatio: "16 / 11",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 10px 22px -18px rgba(0,0,0,0.7)",
        }}
      >
        <img
          src={meta.img}
          alt={meta.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          style={{
            objectPosition: "center",
            filter: active
              ? "saturate(1.06) contrast(1.09) brightness(1.01)"
              : "saturate(1.02) contrast(1.03) brightness(0.98)",
            transition: "filter 180ms ease-out",
          }}
        />
      </div>

      {/* counter */}
      <div
        className="mt-3 pt-3"
        style={{ borderTop: "1px solid rgba(214,226,236,0.08)" }}
      >
        <S2Counter value={value} onChange={onChange} label={meta.title} />
      </div>


      <div className="mt-2.5" style={{ height: 1, background: "rgba(214,226,236,0.12)" }} />
      {categoryOptions ? (
        <div className="relative z-10 mt-2" style={{ opacity: active ? 1 : 0.45 }}>
          <div className="text-[11px]" style={{ color: "rgba(232,238,244,0.5)" }}>
            Category
          </div>
          <S2CategorySelect
            value={category ?? categoryOptions[0]}
            options={categoryOptions}
            disabled={!active}
            label={`${meta.title} category`}
            onChange={(v) => onCategoryChange?.(v)}
          />
        </div>
      ) : (
        <div className="relative z-10 mt-2" style={{ opacity: active ? 1 : 0.45 }}>
          <div className="text-[11px]" style={{ color: "rgba(232,238,244,0.5)" }}>
            Room category
          </div>
          <div className="mt-[1px] flex items-center gap-2 text-[14px]">
            <Check size={15} strokeWidth={2.4} style={{ color: S2_GOLD_SOFT }} />
            <span style={{ color: S2_GOLD_SOFT }}>Included</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Step 2 premium custom category dropdown (portal / floating) ---- */
let s2OpenDropdownId = 0;

function S2CategorySelect({
  value,
  options,
  onChange,
  disabled,
  label,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
  label: string;
}) {
  const idRef = useRef(++s2OpenDropdownId);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [rect, setRect] = useState<{ left: number; top: number; width: number; up: boolean }>({
    left: 0,
    top: 0,
    width: 0,
    up: false,
  });
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useMemo(() => [...options], [options]);
  const ROW_H = 46;
  const GAP = 12;
  const PAD = 8;
  const menuHeight = items.length * ROW_H + (items.length - 1) * GAP + PAD * 2 + 2;

  const measure = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const up = spaceBelow < menuHeight + 16 && r.top > spaceBelow;
    setRect({
      left: r.left,
      top: up ? r.top - 8 - menuHeight : r.bottom + 8,
      width: r.width,
      up,
    });
  }, [menuHeight]);

  const close = React.useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 180);
  }, []);

  useEffect(() => {
    if (!open) return;
    measure();
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onOther = (e: Event) => {
      if ((e as CustomEvent).detail !== idRef.current) close();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("s2-dropdown-open", onOther as EventListener);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("s2-dropdown-open", onOther as EventListener);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, measure, close]);

  const toggle = () => {
    if (disabled) return;
    if (open) close();
    else {
      setActiveIdx(Math.max(0, items.indexOf(value)));
      measure();
      window.dispatchEvent(new CustomEvent("s2-dropdown-open", { detail: idRef.current }));
      setOpen(true);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) {
        onChange(items[activeIdx] ?? "");
        close();
      } else toggle();
      return;
    }
    if (e.key === "Escape") {
      if (open) close();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        toggle();
        return;
      }
      setActiveIdx((i) => {
        const n = items.length;
        return e.key === "ArrowDown" ? (i + 1) % n : (i - 1 + n) % n;
      });
    }
  };

  const menu = (
    <div
      ref={menuRef}
      role="listbox"
      aria-label={label}
      className={closing ? "s2-menu-out" : "s2-menu-in"}
      style={{
        position: "fixed",
        left: rect.left,
        top: rect.top,
        width: rect.width,
        zIndex: 9999,
        maxHeight: "min(60vh, " + (menuHeight + 2) + "px)",
        overflowY: "auto",
        borderRadius: 16,
        padding: PAD,
        display: "flex",
        flexDirection: "column",
        gap: GAP,
        backgroundColor: "rgba(19,31,42,0.985)",
        border: "1px solid rgba(217,191,130,0.20)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 28px -18px rgba(4,10,16,0.75), 0 34px 70px -30px rgba(4,10,16,0.9)",
        transformOrigin: rect.up ? "bottom center" : "top center",
      }}
    >
      {items.map((o, i) => {
        const selected = (value || "") === o;
        const highlighted = i === activeIdx;
        return (
          <div
            key={o || "__none"}
            role="option"
            aria-selected={selected}
            onMouseEnter={() => setActiveIdx(i)}
            onClick={() => {
              onChange(o);
              close();
            }}
            className="flex cursor-pointer select-none items-center justify-between gap-3 px-3 text-[13.5px]"
            style={{
              height: ROW_H,
              flex: "0 0 auto",
              borderRadius: 12,
              color: selected ? S2_GOLD_SOFT : "rgba(255,255,255,0.92)",
              backgroundColor: selected
                ? "rgba(217,191,130,0.12)"
                : highlighted
                  ? "rgba(255,255,255,0.06)"
                  : "transparent",
              transition: "background-color 180ms ease-out, color 180ms ease-out",
            }}
          >
            <span className="truncate">{o || "Select category"}</span>
            {selected && <Check size={14} strokeWidth={2.4} style={{ color: S2_GOLD_SOFT }} />}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="relative mt-[1px]">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className="flex w-full cursor-pointer select-none items-center justify-between gap-2 bg-transparent pr-0 text-left text-[14px] font-normal text-white outline-none disabled:cursor-not-allowed"
      >
        <span className="truncate" style={{ color: value ? "#FFFFFF" : "rgba(245,241,230,0.75)" }}>
          {value || "Select category"}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          style={{
            color: "rgba(245,241,230,0.55)",
            transform: open && !closing ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 180ms cubic-bezier(0.22,0.61,0.36,1)",
          }}
        />
      </button>
      {mounted && open && createPortal(menu, document.body)}
    </div>
  );
}

function roomIcon(key: string) {
  const p = { size: 19, strokeWidth: 1.7 } as const;
  switch (key) {
    case "single":
      return <UserIcon {...p} />;
    case "double":
      return <BedDouble {...p} />;
    case "accessible":
      return <Accessibility {...p} />;
    default:
      return <Users {...p} />;
  }
}


function S2Counter({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const [text, setText] = useState(String(value));
  React.useEffect(() => setText(String(value)), [value]);

  const commit = (raw: string) => {
    const cleaned = raw.replace(/[^\d]/g, "");
    const n = cleaned === "" ? 0 : Math.max(0, parseInt(cleaned, 10) || 0);
    onChange(n);
    setText(String(n));
  };

  const btn = (dir: "dec" | "inc") => (
    <button
      type="button"
      aria-label={`${dir === "dec" ? "Decrease" : "Increase"} ${label}`}
      disabled={dir === "dec" && value === 0}
      onClick={() => onChange(dir === "dec" ? Math.max(0, value - 1) : value + 1)}
      className="grid h-[34px] w-[34px] shrink-0 place-items-center transition-all duration-200 hover:bg-white/[0.07] active:scale-95 disabled:opacity-30"
      style={{ borderRadius: 9, color: "rgba(217,191,130,0.9)" }}
    >
      {dir === "dec" ? <Minus size={16} strokeWidth={2.2} /> : <Plus size={16} strokeWidth={2.2} />}
    </button>
  );

  return (
    <div
      className="flex h-[40px] items-center justify-between px-1.5"
      style={{
        borderRadius: 10,
        backgroundColor: "rgba(20,33,45,0.72)",
        border: "1px solid rgba(214,226,236,0.10)",
      }}
    >
      {btn("dec")}
      <input
        type="text"
        inputMode="numeric"
        aria-label={`${label} quantity`}
        value={text}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d]/g, "");
          setText(v);
          if (v !== "") onChange(Math.max(0, parseInt(v, 10) || 0));
        }}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).blur();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            onChange(value + 1);
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            onChange(Math.max(0, value - 1));
          }
        }}
        className="no-spin w-full bg-transparent text-center text-[18px] font-medium text-white outline-none"
        style={{ fontFamily: SERIF }}
      />
      {btn("inc")}
    </div>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function AccommodationSummary({
  stays,
  totalStays,
  totalRooms,
  totalGuests,
  nextEnabled,
  onContinue,
  lastAddedId,
  removingIds,
}: {
  stays: LeisureStay[];
  totalStays: number;
  totalRooms: number;
  totalGuests: number;
  nextEnabled: boolean;
  onContinue: () => void;
  lastAddedId?: string | null;
  removingIds?: Set<string>;
}) {
  return (
    <aside
      style={{
        borderRadius: 24,
        backgroundColor: S2_PANEL,
        border: "1px solid rgba(255,255,255,0.05)",
        padding: 28,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -18px 34px -30px rgba(0,0,0,0.6), 0 30px 66px -38px rgba(6,13,20,0.72)",
      }}
    >
      <div
        className="text-[11.5px] font-semibold uppercase tracking-[0.28em]"
        style={{ color: S2_GOLD_SOFT }}
      >
        Accommodation Summary
      </div>

      <div className="mt-6 space-y-4">
        <S2SumRow icon={<BedDouble size={17} strokeWidth={1.9} />} label="Total rooms" value={totalRooms} />
        <S2SumRow icon={<Users size={20} strokeWidth={1.9} />} label="Total guests" value={totalGuests} />
        <S2SumRow icon={<CalendarDays size={17} strokeWidth={1.9} />} label="Total stays" value={totalStays} />
      </div>

      <div className="my-7 h-px w-full" style={{ background: "rgba(217,191,130,0.18)" }} />

      {stays.length === 0 && (
        <div className="text-[13px] leading-relaxed" style={{ color: "rgba(245,241,230,0.5)" }}>
          No stays added yet. Choose your dates and room types, then press{" "}
          <span style={{ color: S2_GOLD_SOFT }}>Add this stay</span>.
        </div>
      )}

      <div className="space-y-7">
        {stays.map((s, idx) => {
          const nights = stayNights(s.arrival, s.departure);
          return (
            <div
              key={s.id}
              className={`${lastAddedId === s.id ? "stay-slide-in" : ""} ${removingIds?.has(s.id) ? "stay-removing" : ""}`}
            >
              <div
                className="text-[11.5px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: S2_GOLD_SOFT }}
              >
                Stay {idx + 1}
              </div>
              <div className="mt-1.5 text-[12.5px]" style={{ color: "rgba(245,241,230,0.6)" }}>
                {fmtStayRange(s.arrival, s.departure)} • {nights} {nights === 1 ? "night" : "nights"}
              </div>

              <ul className="mt-4 space-y-3.5">
                {STEP2_ROOMS_ORDER.map((k) => {
                  const v = s.rooms[k] ?? 0;
                  if (v === 0) return null;
                  const cat = s.roomCategories?.[k];
                  return (
                    <li key={k} className="s2-sum-row flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <span
                          className="mt-1 h-[16px] w-px shrink-0 rounded-full"
                          style={{ background: `linear-gradient(180deg, ${S2_GOLD_SOFT}, rgba(217,191,130,0.15))` }}
                        />
                        <span className="mt-0.5 shrink-0" style={{ color: S2_GOLD_SOFT }}>
                          {k === "single" ? (
                            <UserRound size={16} strokeWidth={1.8} />
                          ) : k === "double" || k === "twin" ? (
                            <BedDouble size={16} strokeWidth={1.8} />
                          ) : (
                            <Users size={16} strokeWidth={1.8} />
                          )}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[13.5px] font-medium text-white">{ROOM_LABELS[k]}</div>
                          {cat && (
                            <div className="mt-0.5 text-[12px]" style={{ color: "rgba(231,211,164,0.72)" }}>
                              {cat}
                            </div>
                          )}
                        </div>
                      </div>

                      <span
                        className="grid h-[30px] min-w-[42px] shrink-0 place-items-center text-[13.5px] tabular-nums"
                        style={{
                          borderRadius: 9,
                          color: S2_GOLD_SOFT,
                          backgroundColor: "rgba(217,191,130,0.10)",
                          border: "1px solid rgba(217,191,130,0.28)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                        }}
                      >
                        {v}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="my-7 h-px w-full" style={{ background: "rgba(217,191,130,0.18)" }} />

      <div
        className="text-[11.5px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: "rgba(245,241,230,0.55)" }}
      >
        What happens next?
      </div>
      <ul className="mt-5 space-y-3.5">
        {[
          "Your request is reviewed by our group specialists",
          "Matching hotels prepare tailored offers",
          "You'll receive your hotel proposal within 24 hours",
          "Expert support every step of the way",
        ].map((text) => (
          <li key={text} className="flex items-start gap-3">
            <span
              className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full"
              style={{
                color: "#10202F",
                background: `linear-gradient(135deg, ${S2_GOLD_SOFT} 0%, ${S2_GOLD} 100%)`,
                boxShadow: "0 0 0 1px rgba(217,191,130,0.35)",
              }}
            >
              <Check size={11} strokeWidth={3.2} />
            </span>
            <span className="text-[13.5px] leading-snug" style={{ color: "rgba(245,241,230,0.82)" }}>
              {text}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onContinue}
        disabled={!nextEnabled}
        className="s2-btn mt-7 flex w-full items-center justify-center gap-3 py-4 text-[15.5px] font-semibold hover:-translate-y-[2px]"
        style={{
          borderRadius: 16,
          background: `linear-gradient(180deg, ${S2_GOLD_SOFT} 0%, ${S2_GOLD} 52%, ${S2_GOLD_DEEP} 100%)`,
          color: "#10202F",
          boxShadow: "0 18px 38px -18px rgba(20,14,4,0.55), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -2px 0 rgba(120,95,45,0.35)",
          opacity: nextEnabled ? 1 : 0.4,
          cursor: nextEnabled ? "pointer" : "not-allowed",
        }}
      >
        Continue to extras
        <ArrowRight size={18} strokeWidth={2.4} />
      </button>
    </aside>
  );
}

function S2SumRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-[14px]" style={{ color: "rgba(245,241,230,0.8)" }}>
        <span style={{ color: S2_GOLD_SOFT }}>{icon}</span>
        {label}
      </div>
      <span className="text-[17px] font-medium tabular-nums text-white">{value}</span>
    </div>
  );
}



/* =========================================================
   STEP 3 - Concierge Collection (redesigned)
   ========================================================= */

const S3_GRAPHITE = "#1F262E";
const S3_GRAPHITE_SOFT = "#252D36";
const S3_PANEL = "#1A2027";
const S3_PANEL_SOFT = "#212831";
const S3_BORDER = "rgba(255,255,255,0.07)";
const S3_BORDER_STRONG = "rgba(255,255,255,0.11)";
const S3_TEXT = "#EDE7DA";
const S3_TEXT_MUTED = "rgba(237,231,218,0.60)";
const S3_TEXT_FAINT = "rgba(237,231,218,0.42)";
const S3_GOLD = "#C9A46A";
const S3_GOLD_SOFT = "#E1C089";
const S3_GOLD_DEEP = "#8E6E3C";
const S3_GOLD_GRADIENT = `linear-gradient(135deg, ${S3_GOLD_SOFT} 0%, ${S3_GOLD} 45%, ${S3_GOLD_DEEP} 100%)`;

type ConciergeOption = {
  label: string;
  displayLabel?: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
};

type ConciergeCategory = {
  key: string;
  title: string;
  description: string;
  img: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  configTitle: string;
  configPrompt: string;
  options: ConciergeOption[];
};

const CONCIERGE_CATEGORIES: ConciergeCategory[] = [
  {
    key: "arrival",
    title: "Arrival",
    description: "Welcome, porter & first impressions",
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
    icon: ConciergeBell,
    configTitle: "Arrival Experience",
    configPrompt: "How should your group be welcomed on arrival?",
    options: [
      { label: "Hospitality Desk", icon: Users2 },
      { label: "Arrival Porter Service", displayLabel: "Porter Service", icon: Bell },
      { label: "No arrival services required", icon: Check },
    ],
  },
  {
    key: "welcome",
    title: "Welcome",
    description: "Personalised touches on arrival",
    img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80",
    icon: Gift,
    configTitle: "Welcome Touches",
    configPrompt: "How would you like to greet your guests?",
    options: [
      { label: "VIP Welcome Amenities", icon: Gift },
      { label: "Welcome Letter", icon: Pencil },
      { label: "No welcome services required", icon: Check },
    ],
  },
  {
    key: "stay",
    title: "Stay",
    description: "Enhance their hotel experience",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
    icon: BedDouble,
    configTitle: "In-Stay Enhancements",
    configPrompt: "Refinements to elevate the hotel experience.",
    options: [
      { label: "Early Check-in", icon: DoorOpen },
      { label: "Late Check-out", icon: DoorOpen },
      { label: "Room Location Preferences", icon: HomeIcon },
      { label: "No stay services required", icon: Check },
    ],
  },
  {
    key: "dining",
    title: "Dining",
    description: "Breakfast, lunch & dinner",
    img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=900&q=80",
    icon: Utensils,
    configTitle: "Dining Arrangements",
    configPrompt: "Where and when should your group dine?",
    options: [
      { label: "Group Lunch", icon: Utensils },
      { label: "Group Dinner", icon: Utensils },
      { label: "Packed Lunch", icon: Briefcase },
      { label: "Private Dining", icon: Wine },
      { label: "Breakfast Box", icon: Coffee },
      { label: "Early Breakfast", icon: Coffee },
      { label: "No dining services required", icon: Check },
    ],
  },
  {
    key: "meeting",
    title: "Meeting",
    description: "Welcome or information meeting",
    img: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=900&q=80",
    icon: Users,
    configTitle: "Meeting Space",
    configPrompt: "A quiet room for your group briefing.",
    options: [
      { label: "Meeting Room", icon: Users2 },
      { label: "Information Desk", icon: MessageSquare },
      { label: "No meeting services required", icon: Check },
    ],
  },
  {
    key: "departure",
    title: "Departure",
    description: "Farewell assistance & departure services",
    img: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=900&q=80",
    icon: Plane,
    configTitle: "Departure Experience",
    configPrompt: "How should your group leave?",
    options: [
      { label: "Porter Service Out", displayLabel: "Porter Service", icon: Briefcase },
      { label: "No departure services required", icon: Check },
    ],
  },
];

/* ---- Smart configuration metadata for expandable service panels ---- */

const TRANSPORT_SERVICES = new Set(["Arrival Transport", "Departure Transport"]);
const PORTER_SERVICES = new Set(["Arrival Porter Service", "Porter Service Out"]);

const CITY_AIRPORT: Record<string, string> = {
  Oslo: "Oslo Airport (OSL)",
  Bergen: "Bergen Airport (BGO)",
  Tromsø: "Tromsø Airport (TOS)",
  Tromso: "Tromsø Airport (TOS)",
  Stavanger: "Stavanger Airport (SVG)",
  Trondheim: "Trondheim Airport (TRD)",
  Bodø: "Bodø Airport (BOO)",
  Bodo: "Bodø Airport (BOO)",
  Ålesund: "Ålesund Airport (AES)",
  Alesund: "Ålesund Airport (AES)",
};

function nearestAirportFor(city: string | undefined): string {
  if (!city) return "";
  return CITY_AIRPORT[city] ?? "";
}

type Step3Context = {
  city: string;
  arrival?: Date;
  departure?: Date;
  stays: LeisureStay[];
};

function contextArrivalISO(ctx: Step3Context): string {
  if (ctx.stays[0]?.arrival) return ctx.stays[0].arrival;
  return ctx.arrival ? format(ctx.arrival, "yyyy-MM-dd") : "";
}
function contextDepartureISO(ctx: Step3Context): string {
  if (ctx.stays.length) return ctx.stays[ctx.stays.length - 1]!.departure;
  return ctx.departure ? format(ctx.departure, "yyyy-MM-dd") : "";
}

const SMART_SERVICES = new Set<string>([
  "Group Lunch",
  "Group Dinner",
  "Early Check-in",
  "Late Check-out",
  "VIP Welcome Amenities",
  "Hospitality Desk",
  ...Array.from(TRANSPORT_SERVICES),
  ...Array.from(PORTER_SERVICES),
]);


/* -------- Smart configuration panel components -------- */

const SC_LABEL_CLS = "text-[10.5px] font-medium tracking-[0.18em] uppercase";
const SC_INPUT_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: `1px solid ${S3_BORDER_STRONG}`,
  color: S3_TEXT,
};

function SCField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={SC_LABEL_CLS} style={{ color: S3_TEXT_MUTED }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function SCInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-10 rounded-[10px] px-3 text-[13px] outline-none transition-colors focus:border-[rgba(201,164,106,0.6)]"
      style={SC_INPUT_STYLE}
    />
  );
}

function SCTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={2}
      className="resize-none rounded-[10px] px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-[rgba(201,164,106,0.6)]"
      style={SC_INPUT_STYLE}
    />
  );
}

function SCRadioRow({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string | undefined;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="rounded-full px-3.5 py-2 text-[12px] transition-colors"
            style={{
              background: on ? "rgba(201,164,106,0.14)" : "transparent",
              border: `1px solid ${on ? S3_GOLD : S3_BORDER_STRONG}`,
              color: on ? S3_GOLD_SOFT : S3_TEXT,
            }}
            aria-pressed={on}
            data-name={name}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function SmartConfigPanel({
  label,
  displayLabel,
  cfg,
  onChange,
  context,
}: {
  label: string;
  displayLabel?: string;
  cfg: Record<string, string>;
  onChange: (patch: Record<string, string>) => void;
  context: Step3Context;
}) {
  const isTransport = TRANSPORT_SERVICES.has(label);
  const isPorter = PORTER_SERVICES.has(label);
  const isOutbound = label === "Departure Transport" || label === "Porter Service Out";
  const dateSuggestion = isOutbound
    ? contextDepartureISO(context)
    : contextArrivalISO(context);
  const airport = nearestAirportFor(context.city);
  const hotelName = context.city ? `Hotel in ${context.city}` : "";
  const pickupSuggestion = isOutbound ? hotelName : airport;
  const destinationSuggestion = isOutbound ? airport : hotelName;
  const title = (displayLabel ?? label).toUpperCase();

  return (
    <div
      className="overflow-hidden rounded-[14px] p-5"
      style={{
        background: S3_PANEL,
        border: `1px solid ${S3_BORDER_STRONG}`,
        animation: "s3-slide-fade 240ms ease-out both",
      }}
    >
      <style>{`
        @keyframes s3-slide-fade {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="flex items-center gap-2.5 pb-3.5">
        <span
          className="grid h-6 w-6 place-items-center rounded-full"
          style={{ background: S3_GOLD_GRADIENT }}
        >
          <Check size={12} strokeWidth={3} style={{ color: "#1A1207" }} />
        </span>
        <div className="text-[12.5px] font-medium tracking-[0.18em]" style={{ color: S3_TEXT }}>
          {title}
        </div>
        <div className="text-[10.5px] tracking-[0.16em]" style={{ color: S3_TEXT_FAINT }}>
          · CONFIGURE
        </div>
      </div>

      {(label === "Group Lunch" || label === "Group Dinner") && (
        <div className="grid gap-4">
          <SCField label={label === "Group Lunch" ? "Lunch Style" : "Dinner Style"}>
            <SCRadioRow
              name={`${label}-style`}
              value={cfg.style}
              onChange={(v) => onChange({ style: v })}
              options={["2-course", "3-course", "Buffet"]}
            />
          </SCField>
          <SCField label="Optional Notes">
            <SCTextarea
              placeholder="Dietary preferences, timings, seating…"
              value={cfg.notes ?? ""}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {label === "Early Check-in" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <SCField label="Arrival Date (recommended)">
            <SCInput
              type="date"
              value={cfg.date ?? dateSuggestion}
              onChange={(e) => onChange({ date: e.target.value })}
            />
          </SCField>
          <SCField label="Preferred Arrival Time (optional)">
            <SCInput
              type="time"
              value={cfg.time ?? ""}
              onChange={(e) => onChange({ time: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {label === "Late Check-out" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <SCField label="Departure Date (recommended)">
            <SCInput
              type="date"
              value={cfg.date ?? dateSuggestion}
              onChange={(e) => onChange({ date: e.target.value })}
            />
          </SCField>
          <SCField label="Preferred Departure Time (optional)">
            <SCInput
              type="time"
              value={cfg.time ?? ""}
              onChange={(e) => onChange({ time: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {label === "VIP Welcome Amenities" && (
        <div className="grid gap-4">
          <SCField label="Amenity Type">
            <SCRadioRow
              name="vip-amenity"
              value={cfg.amenity}
              onChange={(v) => onChange({ amenity: v })}
              options={[
                "Fruit Platter",
                "Chocolate Selection",
                "Wine",
                "Champagne",
                "Local Speciality",
                "Custom Request",
              ]}
            />
          </SCField>
          <SCField label="Applies To">
            <SCRadioRow
              name="vip-deliver"
              value={cfg.deliverTo}
              onChange={(v) => onChange({ deliverTo: v })}
              options={["All Rooms", "Selected Rooms"]}
            />
          </SCField>
          {cfg.deliverTo === "Selected Rooms" && (
            <SCField label="Room Numbers (optional)">
              <SCInput
                placeholder="e.g. 204, 208, 312"
                value={cfg.rooms ?? ""}
                onChange={(e) => onChange({ rooms: e.target.value })}
              />
            </SCField>
          )}
          <SCField label="Notes (optional)">
            <SCTextarea
              placeholder="Delivery timing, personalisation…"
              value={cfg.notes ?? ""}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {label === "Hospitality Desk" && (
        <div className="grid gap-4">
          <SCField label="Service Type">
            <SCRadioRow
              name="hospitality-type"
              value={cfg.serviceType}
              onChange={(v) => onChange({ serviceType: v })}
              options={[
                "Welcome Desk",
                "Registration Desk",
                "Information Desk",
                "Name Badge Distribution",
                "Guest Assistance",
              ]}
            />
          </SCField>
          <SCField label="Optional Notes">
            <SCTextarea
              placeholder="Setup timing, staffing preferences…"
              value={cfg.notes ?? ""}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {isPorter && (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SCField
              label={
                isOutbound
                  ? "Departure Date (recommended)"
                  : "Arrival Date (recommended)"
              }
            >
              <SCInput
                type="date"
                value={cfg.date ?? dateSuggestion}
                onChange={(e) => onChange({ date: e.target.value })}
              />
            </SCField>
            <SCField label="Preferred Time (optional)">
              <SCInput
                type="time"
                value={cfg.time ?? ""}
                onChange={(e) => onChange({ time: e.target.value })}
              />
            </SCField>
            <SCField label="Estimated Number of Bags (optional)">
              <SCInput
                type="number"
                min={0}
                placeholder="e.g. 24"
                value={cfg.bags ?? ""}
                onChange={(e) => onChange({ bags: e.target.value })}
              />
            </SCField>
          </div>
          <SCField label="Special Instructions (optional)">
            <SCTextarea
              placeholder="Fragile items, room drop-off preferences…"
              value={cfg.notes ?? ""}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {isTransport && (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SCField label="Transport Type">
              <SCRadioRow
                name={`${label}-mode`}
                value={cfg.mode}
                onChange={(v) => onChange({ mode: v })}
                options={["Taxi", "Private Chauffeur", "Coach", "Airport Shuttle"]}
              />
            </SCField>
            <SCField label="Direction">
              <SCRadioRow
                name={`${label}-direction`}
                value={cfg.direction ?? (isOutbound ? "Departure" : "Arrival")}
                onChange={(v) => onChange({ direction: v })}
                options={["Arrival", "Departure", "Both"]}
              />
            </SCField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SCField label="Pickup Date (recommended)">
              <SCInput
                type="date"
                value={cfg.date ?? dateSuggestion}
                onChange={(e) => onChange({ date: e.target.value })}
              />
            </SCField>
            <SCField label="Pickup Time (optional)">
              <SCInput
                type="time"
                value={cfg.time ?? ""}
                onChange={(e) => onChange({ time: e.target.value })}
              />
            </SCField>
            <SCField label={`Pickup Location${pickupSuggestion ? " (recommended)" : " (optional)"}`}>
              <SCInput
                placeholder={pickupSuggestion || "Enter pickup location"}
                value={cfg.pickup ?? pickupSuggestion}
                onChange={(e) => onChange({ pickup: e.target.value })}
              />
            </SCField>
            <SCField label={`Destination${destinationSuggestion ? " (recommended)" : " (optional)"}`}>
              <SCInput
                placeholder={destinationSuggestion || "Enter destination"}
                value={cfg.destination ?? destinationSuggestion}
                onChange={(e) => onChange({ destination: e.target.value })}
              />
            </SCField>
          </div>
          <SCField label="Applies To">
            <SCRadioRow
              name={`${label}-scope`}
              value={cfg.scope}
              onChange={(v) => onChange({ scope: v })}
              options={["Entire Group", "Group Leader", "Number of Guests"]}
            />
            {cfg.scope === "Number of Guests" && (
              <div className="mt-2">
                <SCInput
                  type="number"
                  min={1}
                  placeholder="Number of guests"
                  value={cfg.scopeDetail ?? ""}
                  onChange={(e) => onChange({ scopeDetail: e.target.value })}
                />
              </div>
            )}
          </SCField>
          <SCField label="Special Instructions (optional)">
            <SCTextarea
              placeholder="Flight number, luggage, signage…"
              value={cfg.notes ?? ""}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {label === "Room Location Preferences" && (
        <div className="grid gap-4">
          <SCField label="Room Preference">
            <SCRadioRow
              name="room-location-pref"
              value={cfg.preference}
              onChange={(v) => onChange({ preference: v })}
              options={[
                "Connecting Rooms",
                "Adjacent Rooms",
                "Same Floor",
                "Near Elevator",
                "Quiet Area",
                "High Floor",
              ]}
            />
          </SCField>
          <SCField label="Number of Rooms">
            <SCInput
              type="number"
              min={1}
              placeholder="e.g. 4"
              value={cfg.rooms ?? ""}
              onChange={(e) => onChange({ rooms: e.target.value })}
            />
          </SCField>
          <SCField label="Optional Notes">
            <SCTextarea
              placeholder="Preferences will be shared with the hotel. Requests are subject to availability."
              value={cfg.notes ?? ""}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </SCField>
        </div>
      )}
    </div>
  );
}


function LeisureStep3Screen({
  selected,
  onToggle,
  comments,
  setComments,
  recommend: _recommend,
  setRecommend: _setRecommend,
  onNext,
  onBack,
  onStepGo,
  context,
}: {
  selected: Set<string>;
  onToggle: (label: string) => void;
  comments: string;
  setComments: (v: string) => void;
  recommend: boolean;
  setRecommend: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  onStepGo: (s: StepKey) => void;
  context: Step3Context;
}) {
  const [expanded, setExpanded] = useState<string>("arrival");
  const active = CONCIERGE_CATEGORIES.find((c) => c.key === expanded) ?? CONCIERGE_CATEGORIES[0];
  const [serviceConfig, setServiceConfig] = useState<Record<string, Record<string, string>>>({});
  const updateConfig = (label: string, patch: Record<string, string>) =>
    setServiceConfig((prev) => ({ ...prev, [label]: { ...(prev[label] ?? {}), ...patch } }));
  const activeSmartSelections = active.options.filter(
    (o) => selected.has(o.label) && SMART_SERVICES.has(o.label),
  );

  const countFor = (cat: ConciergeCategory) =>
    cat.options.filter(
      (o) => selected.has(o.label) && !o.label.toLowerCase().startsWith("no "),
    ).length;

  return (
    <main
      className="min-h-screen w-full"
      style={{
        background: `radial-gradient(1200px 800px at 50% -10%, ${S3_GRAPHITE_SOFT} 0%, ${S3_GRAPHITE} 45%, #171C22 100%)`,
        fontFamily: "Inter, system-ui, sans-serif",
        color: S3_TEXT,
      }}
    >
      <div style={{ borderBottom: `1px solid ${S3_BORDER}` }}>
        <BookingHeader
          currentStep={3}
          onStepGo={(s) => onStepGo(s as StepKey)}
          hideCurrentFlow="leisure"
        />
      </div>

      <div className="mx-auto w-full max-w-[1360px] px-6 pb-6 pt-8 sm:px-10 lg:px-14 lg:pt-10">
        {/* Header row */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <div
              className="text-[11px] font-medium tracking-[0.34em]"
              style={{ color: S3_GOLD }}
            >
              STEP 3
            </div>
            <h1
              className="mt-4 text-[40px] leading-[1.05] font-medium sm:text-[52px]"
              style={{ fontFamily: SERIF, color: S3_TEXT }}
            >
              Extras
            </h1>
            <p
              className="mt-4 max-w-[560px] text-[15.5px] leading-relaxed"
              style={{ color: S3_TEXT_MUTED }}
            >
              Handpicked services to complete your group experience.
            </p>
          </div>

          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-[13px] font-medium transition-colors"
            style={{
              background: "transparent",
              border: `1px solid ${S3_BORDER_STRONG}`,
              color: S3_TEXT,
            }}
          >
            <Headphones size={15} strokeWidth={1.8} style={{ color: S3_GOLD }} />
            Need Help?
          </button>
        </div>

        {/* Category cards */}
        <div className="mt-14 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-6 lg:gap-2.5">
          {CONCIERGE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = countFor(cat);
            const isSelected = count > 0;
            const isOpen = expanded === cat.key;
            const isElevated = isOpen || isSelected;

            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setExpanded(cat.key)}
                className="group relative flex flex-col overflow-hidden rounded-[14px] text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px]"
                style={{
                  background: S3_PANEL,
                  border: `1px solid ${isOpen ? S3_GOLD : isSelected ? "rgba(201,164,106,0.65)" : "rgba(255,255,255,0.08)"}`,
                  transform: isOpen ? "translateY(-7px)" : undefined,
                  boxShadow: isOpen
                    ? "0 30px 60px -28px rgba(201,164,106,0.42), 0 18px 38px -22px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(201,164,106,0.18)"
                    : isSelected
                    ? "0 22px 46px -30px rgba(201,164,106,0.35), 0 14px 30px -22px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)"
                    : "0 14px 32px -24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <div className="relative h-[210px] w-full overflow-hidden">
                  <img
                    src={cat.img}
                    alt={cat.title}
                    className="h-full w-full object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
                    style={{
                      filter: isElevated
                        ? "brightness(0.82) contrast(1.05) saturate(0.92) sepia(0.06)"
                        : "brightness(0.72) contrast(1.05) saturate(0.88) sepia(0.06)",
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(120% 90% at 50% 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%), linear-gradient(180deg, rgba(23,28,34,0) 45%, rgba(23,28,34,0.95) 100%)",
                    }}
                  />
                  {isOpen && (
                    <div
                      className="pointer-events-none absolute inset-x-6 -bottom-8 h-10 rounded-full"
                      style={{
                        background:
                          "radial-gradient(60% 100% at 50% 0%, rgba(201,164,106,0.35) 0%, rgba(201,164,106,0) 70%)",
                        filter: "blur(6px)",
                      }}
                    />
                  )}
                  {isSelected && (
                    <span
                      className="absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full"
                      style={{
                        background: S3_GOLD_GRADIENT,
                        boxShadow: "0 6px 18px -8px rgba(201,164,106,0.7)",
                      }}
                    >
                      <Check size={12} strokeWidth={3} style={{ color: "#1A1207" }} />
                    </span>
                  )}
                  <div
                    className="absolute left-1/2 bottom-4 grid h-[46px] w-[46px] -translate-x-1/2 place-items-center rounded-full transition-all duration-500"
                    style={{
                      background: "rgba(23,28,34,0.55)",
                      border: `1px solid ${S3_GOLD}`,
                      backdropFilter: "blur(6px)",
                      boxShadow: isOpen
                        ? "0 8px 24px -10px rgba(201,164,106,0.55), inset 0 0 0 1px rgba(255,255,255,0.05)"
                        : "0 6px 18px -12px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.04)",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.6} style={{ color: S3_GOLD_SOFT }} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-center px-3 pb-4 pt-4 text-center">
                  <div
                    className="text-[13px] font-medium tracking-[0.22em] transition-colors duration-300"
                    style={{ color: isOpen ? "#F6EFDF" : S3_TEXT }}
                  >
                    {cat.title.toUpperCase()}
                  </div>
                  <p
                    className="mt-2 text-[11.5px] leading-[1.45]"
                    style={{ color: S3_TEXT_MUTED }}
                  >
                    {cat.description}
                  </p>
                  <div
                    className="mt-3 text-[10.5px] font-medium tracking-[0.14em]"
                    style={{
                      color: isSelected ? S3_GOLD_SOFT : S3_TEXT_FAINT,
                    }}
                  >
                    {isSelected
                      ? `${count} service${count === 1 ? "" : "s"} selected`
                      : "No services selected"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>



        {/* Configuration area */}
        <section
          className="relative mt-10 overflow-hidden rounded-[18px] p-7 sm:p-8"
          style={{
            background: S3_PANEL_SOFT,
            border: `1px solid ${S3_BORDER}`,
            boxShadow:
              "0 30px 80px -50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {/* nearly invisible champagne glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 80% at 12% 0%, rgba(201,164,106,0.055) 0%, rgba(201,164,106,0) 60%)",
            }}
          />
          <div className="relative flex items-start gap-4">
            <div
              className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full"
              style={{
                background: S3_PANEL,
                border: `1px solid ${S3_GOLD}`,
                boxShadow: "0 6px 18px -10px rgba(201,164,106,0.45), inset 0 0 0 1px rgba(255,255,255,0.04)",
              }}
            >
              <active.icon size={18} strokeWidth={1.6} style={{ color: S3_GOLD_SOFT }} />
            </div>
            <div className="pt-1">
              <div
                className="text-[15px] font-medium tracking-[0.22em]"
                style={{ color: S3_TEXT }}
              >
                {active.configTitle.toUpperCase()}
              </div>
              <div className="mt-1.5 text-[12.5px]" style={{ color: S3_TEXT_MUTED }}>
                {active.configPrompt}
              </div>
            </div>
          </div>

          {/* metallic gold divider */}
          <div
            aria-hidden
            className="relative mt-6 h-px w-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(201,164,106,0) 0%, rgba(201,164,106,0.45) 20%, rgba(225,192,137,0.55) 50%, rgba(201,164,106,0.45) 80%, rgba(201,164,106,0) 100%)",
            }}
          />

          <div
            className="relative mt-6 grid gap-2.5"
            style={{
              gridTemplateColumns: `repeat(${active.options.length}, minmax(0, 1fr))`,
            }}
          >
            {active.options.map((opt) => {
              const OptIcon = opt.icon;
              const isOn = selected.has(opt.label);
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onToggle(opt.label)}
                  className="group/opt relative flex h-[104px] flex-col items-center justify-center overflow-hidden rounded-[12px] px-2.5 text-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px]"
                  style={{
                    background: isOn
                      ? "linear-gradient(180deg, rgba(201,164,106,0.12) 0%, rgba(201,164,106,0.05) 100%)"
                      : "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.012) 100%)",
                    border: `1px solid ${isOn ? S3_GOLD : "rgba(255,255,255,0.09)"}`,
                    backdropFilter: "blur(6px)",
                    boxShadow: isOn
                      ? "0 14px 32px -18px rgba(201,164,106,0.55), 0 0 0 1px rgba(201,164,106,0.22), inset 0 1px 0 rgba(255,255,255,0.06)"
                      : "0 6px 18px -14px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0) 100%)",
                    }}
                  />
                  {isOn && (
                    <span
                      className="absolute right-1.5 top-1.5 grid h-[18px] w-[18px] place-items-center rounded-full"
                      style={{ background: S3_GOLD_GRADIENT }}
                    >
                      <Check size={10} strokeWidth={3} style={{ color: "#1A1207" }} />
                    </span>
                  )}
                  <OptIcon
                    size={22}
                    strokeWidth={1.5}
                    style={{
                      color: isOn ? S3_GOLD_SOFT : "rgba(237,231,218,0.72)",
                      transition: "color 300ms",
                    }}
                  />

                  <div
                    className="mt-2.5 text-[11.5px] leading-[1.25]"
                    style={{ color: S3_TEXT }}
                  >
                    {opt.displayLabel ?? opt.label}
                  </div>
                </button>
              );
            })}
          </div>

          {activeSmartSelections.length > 0 && (
            <div className="relative mt-5 space-y-3">
              {activeSmartSelections.map((opt) => (
                <SmartConfigPanel
                  key={opt.label}
                  label={opt.label}
                  displayLabel={opt.displayLabel}
                  cfg={serviceConfig[opt.label] ?? {}}
                  onChange={(patch) => updateConfig(opt.label, patch)}
                  context={context}
                />

              ))}
            </div>
          )}
        </section>




        {/* Additional requests */}
        <section
          className="mt-6 rounded-[18px] px-6 py-5 sm:px-7 sm:py-6"
          style={{
            background: S3_PANEL_SOFT,
            border: `1px solid ${S3_BORDER}`,
            boxShadow:
              "0 30px 80px -50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start">
            <div className="flex items-start gap-4">
              <div
                className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full"
                style={{
                  background: S3_PANEL,
                  border: `1px solid ${S3_GOLD}`,
                }}
              >
                <Pencil size={16} strokeWidth={1.6} style={{ color: S3_GOLD_SOFT }} />
              </div>
              <div className="pt-0.5">
                <div
                  className="text-[13px] font-medium tracking-[0.2em]"
                  style={{ color: S3_TEXT }}
                >
                  ANYTHING ELSE OUR CONCIERGE<br />TEAM SHOULD PREPARE?
                </div>
                <div className="mt-1.5 text-[11.5px]" style={{ color: S3_TEXT_MUTED }}>
                  Share any requirements that are not covered above.
                </div>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Write your request here…"
                rows={3}
                className="w-full resize-none rounded-[12px] px-5 py-4 pr-12 text-[13.5px] outline-none transition-colors"
                style={{
                  background: "transparent",
                  border: `1px solid ${S3_BORDER_STRONG}`,
                  color: S3_TEXT,
                }}
              />
              <Pencil
                size={15}
                strokeWidth={1.6}
                className="pointer-events-none absolute right-4 top-4"
                style={{ color: S3_GOLD_SOFT }}
              />
            </div>
          </div>
        </section>

        {/* Subtle divider */}
        <div
          aria-hidden
          className="mt-4 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0) 100%)",
          }}
        />

        {/* Bottom actions */}
        <div className="mt-3 flex flex-col-reverse items-stretch justify-between gap-6 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full px-8 text-[14px] font-medium transition-colors hover:bg-white/5"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.18)",
              color: "#FFFFFF",
            }}
          >
            <ArrowLeft size={16} strokeWidth={2} style={{ color: "#FFFFFF" }} />
            Back
          </button>


          <div className="flex flex-col items-end gap-[9px]">
            <button
              type="button"
              onClick={onNext}
              className="inline-flex h-[52px] items-center justify-center gap-3 rounded-[26px] px-12 text-[14px] font-semibold tracking-[0.1em] transition-all hover:-translate-y-[1px]"
              style={{
                background:
                  "linear-gradient(180deg, #F0D28A 0%, #D9B36A 45%, #B8894A 100%)",
                color: "#1C1C1C",
                boxShadow:
                  "0 14px 30px -12px rgba(0,0,0,0.55), 0 4px 12px -4px rgba(184,137,74,0.5), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -2px 6px rgba(90,60,20,0.35)",
              }}
            >
              SAVE & CONTINUE
              <ArrowRight size={18} strokeWidth={2.2} />
            </button>
            <div
              className="inline-flex items-center gap-1.5 text-[12px]"
              style={{ color: S3_TEXT_FAINT }}
            >
              <Lock size={11} strokeWidth={2} />
              Your selections are saved automatically.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



/* =========================================================
   STEP 4 - Experiences (redesigned)
   ========================================================= */

const S4_HERO =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80";

const STEP4_CATEGORIES = [
  "All",
  "Nature & Adventure",
  "Winter",
  "Culture & Sightseeing",
  "Food & Drink",
  "Group Activities",
];

type Step4Exp = { label: string; category: string; img: string };

const STEP4_EXPERIENCES: Step4Exp[] = [
  {
    label: "Fjord Cruise",
    category: "Nature & Adventure",
    img: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Hiking Adventure",
    category: "Nature & Adventure",
    img: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Northern Lights",
    category: "Winter",
    img: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Ski Experience",
    category: "Winter",
    img: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "City Walking Tour",
    category: "Culture & Sightseeing",
    img: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Local Food Experience",
    category: "Food & Drink",
    img: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Whale Safari",
    category: "Nature & Adventure",
    img: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=900&q=80",
  },
  {
    label: "Brewery Tour",
    category: "Food & Drink",
    img: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?auto=format&fit=crop&w=900&q=80",
  },
];

function LeisureStep4Screen({
  category,
  setCategory,
  selected,
  onToggle,
  letUsRecommend,
  setLetUsRecommend,
  preferredDate,
  setPreferredDate,
  dateFlexible,
  setDateFlexible,
  additionalRequests,
  setAdditionalRequests,
  onNext,
  onBack,
  onStepGo,
}: {
  category: string;
  setCategory: (c: string) => void;
  selected: Set<string>;
  onToggle: (label: string) => void;
  letUsRecommend: boolean;
  setLetUsRecommend: (v: boolean) => void;
  preferredDate: Date | undefined;
  setPreferredDate: (d: Date | undefined) => void;
  dateFlexible: boolean;
  setDateFlexible: (v: boolean) => void;
  additionalRequests: string;
  setAdditionalRequests: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
  onStepGo: (s: StepKey) => void;
}) {
  const filtered = STEP4_EXPERIENCES.filter(
    (e) => category === "All" || e.category === category,
  );
  const dateInputRef = useRef<HTMLInputElement>(null);

  return (
    <LeisureStepShell
      activeStep={4}
      onStepGo={onStepGo}
      hero={S4_HERO}
      chapter="CHAPTER IV"
      headline={
        <>
          Curate<br />unforgettable<br />experiences.
        </>
      }
      subtext={
        <>
          Create memories your<br />group will talk about<br />for years to come.
        </>
      }
      enhancedHero
    >

      <section
        className="rounded-[24px] p-6 sm:p-8 lg:p-10"
        style={{
          backgroundColor: S1_NAVY_SOFT,
          border: `1px solid ${S1_BORDER}`,
          boxShadow:
            "0 40px 80px -40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        <h2
          className="text-[28px] sm:text-[32px] leading-tight font-medium text-white"
          style={{ fontFamily: SERIF }}
        >
          Step 4 – Experiences
        </h2>
        <p className="mt-2 text-[14.5px]" style={{ color: "rgba(245,241,230,0.62)" }}>
          What would your group like to experience?
        </p>

        {/* Category filters */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          {STEP4_CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className="rounded-full px-4 py-2 text-[13px] font-medium transition-all"
                style={{
                  background: active
                    ? `linear-gradient(135deg, ${S1_GOLD_SOFT}, ${S1_GOLD})`
                    : S1_NAVY,
                  color: active ? S1_NAVY : "#F5F1E6",
                  border: `1px solid ${active ? S1_GOLD : "rgba(245,241,230,0.18)"}`,
                  boxShadow: active
                    ? "0 10px 22px -14px rgba(212,166,74,0.55)"
                    : "none",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Experience grid */}
        <div className="relative mt-7">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10"
            style={{
              background:
                "radial-gradient(70% 55% at 50% 40%, rgba(212,166,74,0.08), transparent 70%)",
              filter: "blur(6px)",
            }}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((e) => {
              const active = selected.has(e.label);
              const isSignature = e.label === "Northern Lights";
              return (
                <button
                  key={e.label}
                  type="button"
                  onClick={() => onToggle(e.label)}
                  className={`s4-card group relative overflow-hidden rounded-[18px] text-left ${active ? "s4-selected s4-selected-glow" : ""}`}
                  style={{
                    border: `1px solid ${active ? S1_GOLD : S1_BORDER}`,
                    boxShadow: active
                      ? "0 22px 46px -20px rgba(212,166,74,0.55), 0 2px 0 rgba(255,255,255,0.03) inset"
                      : "0 16px 34px -22px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.03) inset",
                  }}
                >
                  <div className="relative h-[170px] w-full overflow-hidden">
                    <img
                      src={e.img}
                      alt={e.label}
                      className="s4-card-img h-full w-full object-cover"
                    />
                    <div
                      className="s4-card-overlay pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(8,19,31,0) 40%, rgba(8,19,31,0.92) 100%), radial-gradient(120% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.35) 100%)",
                      }}
                    />
                    {isSignature && (
                      <span
                        className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-[3px] text-[9.5px] font-semibold tracking-[0.22em]"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(8,19,31,0.78) 0%, rgba(8,19,31,0.62) 100%)",
                          border: `1px solid rgba(232,199,117,0.75)`,
                          boxShadow:
                            "inset 0 0 0 1px rgba(255,235,180,0.18), 0 6px 14px -6px rgba(212,166,74,0.45)",
                          color: "transparent",
                          backgroundImage:
                            "linear-gradient(135deg, rgba(8,19,31,0.78) 0%, rgba(8,19,31,0.62) 100%)",
                          backdropFilter: "blur(8px)",
                          textTransform: "uppercase",
                          lineHeight: 1.4,
                        }}
                      >
                        <Sparkles size={9.5} strokeWidth={2.5} style={{ color: "#EBCB7A" }} />
                        <span
                          style={{
                            background:
                              "linear-gradient(135deg, #F4DB94 0%, #E8C775 45%, #C99A44 100%)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          Signature
                        </span>
                      </span>
                    )}
                    <div className="absolute bottom-3 left-3.5 right-14">
                      <div
                        className="text-white"
                        style={{ fontFamily: SERIF, fontSize: 17.5, lineHeight: 1.15 }}
                      >
                        {e.label}
                      </div>
                    </div>
                    <span
                      className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full transition-all"
                      style={{
                        background: active
                          ? `linear-gradient(135deg, ${S1_GOLD_SOFT} 0%, ${S1_GOLD} 60%, #B88C2F 100%)`
                          : "rgba(8,19,31,0.72)",
                        border: `1px solid ${active ? S1_GOLD : "rgba(245,241,230,0.35)"}`,
                        color: active ? S1_NAVY : "#F5F1E6",
                        boxShadow: active
                          ? "0 10px 20px -8px rgba(212,166,74,0.7), inset 0 1px 0 rgba(255,255,255,0.5)"
                          : "none",
                      }}
                    >
                      {active ? (
                        <Check size={16} strokeWidth={2.8} />
                      ) : (
                        <Plus size={18} strokeWidth={2.2} />
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>


        {/* Preferred Experience Date */}
        <div
          className="mt-8 rounded-[16px] p-5 sm:p-6"
          style={{
            backgroundColor: S1_NAVY,
            border: `1px solid ${S1_BORDER}`,
          }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3
                className="text-[18px] font-medium text-white"
                style={{ fontFamily: SERIF }}
              >
                Preferred Experience Date
              </h3>
              <p
                className="mt-1.5 text-[13.5px]"
                style={{ color: "rgba(245,241,230,0.62)" }}
              >
                When would you ideally like to enjoy your selected experience?
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => dateInputRef.current?.showPicker?.()}
                className="inline-flex items-center gap-3 rounded-[12px] px-4 py-3 text-left transition-all hover:-translate-y-[1px]"
                style={{
                  backgroundColor: S1_NAVY_SOFT,
                  border: `1px solid ${S1_BORDER}`,
                  color: preferredDate ? "#F5F1E6" : "rgba(245,241,230,0.55)",
                  minWidth: 220,
                }}
              >
                <CalendarDays size={18} style={{ color: S1_GOLD_SOFT }} />
                <span className="text-[14.5px] font-medium">
                  {preferredDate ? format(preferredDate, "PPP") : "Select a date"}
                </span>
              </button>
              <input
                ref={dateInputRef}
                type="date"
                className="sr-only"
                value={preferredDate ? format(preferredDate, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setPreferredDate(v ? new Date(v) : undefined);
                }}
              />
              <label
                className="inline-flex cursor-pointer items-center gap-2.5 text-[13.5px]"
                style={{ color: "rgba(245,241,230,0.8)" }}
              >
                <span
                  className="grid h-5 w-5 place-items-center rounded-[5px] transition-colors"
                  style={{
                    backgroundColor: dateFlexible ? S1_GOLD : "transparent",
                    border: `1.5px solid ${dateFlexible ? S1_GOLD : "rgba(245,241,230,0.45)"}`,
                  }}
                >
                  {dateFlexible && (
                    <Check size={12} strokeWidth={3} style={{ color: S1_NAVY }} />
                  )}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={dateFlexible}
                  onChange={(e) => setDateFlexible(e.target.checked)}
                />
                We are flexible with dates
              </label>
            </div>
          </div>
          <p
            className="mt-4 text-[12.5px]"
            style={{ color: "rgba(245,241,230,0.5)" }}
          >
            If no date is selected, our hotel partners will recommend the best available option during your stay.
          </p>
        </div>

        {/* Additional Experience Requests */}
        <div
          className="mt-8 rounded-[16px] px-5 py-4 sm:px-6 sm:py-5"
          style={{
            background: "linear-gradient(180deg, rgba(9,21,34,0.96) 0%, rgba(6,16,26,0.96) 100%)",
            border: `1px solid ${S1_BORDER}`,
          }}
        >
          <h3
            className="text-[17.5px] font-medium text-white"
            style={{ fontFamily: SERIF }}
          >
            Additional Experience Requests
          </h3>
          <p
            className="mt-1 text-[13px] leading-relaxed"
            style={{ color: "rgba(245,241,230,0.6)" }}
          >
            Tell us if you&apos;re looking for an experience that isn&apos;t listed above, or if you have any special wishes for your group.
          </p>
          <textarea
            value={additionalRequests}
            onChange={(e) => setAdditionalRequests(e.target.value)}
            placeholder={`Looking for something unique?\n\nPrivate boat charter · Hike · Photography tour\nDog sledding · Wine tasting · Brewery visit`}
            rows={4}
            className="mt-3.5 w-full resize-y rounded-[13px] px-4 py-3.5 text-[14px] outline-none transition-all duration-200 focus:border-[#D4A64A] focus:ring-4 focus:ring-[rgba(212,166,74,0.12)]"
            style={{
              background: "linear-gradient(180deg, rgba(24,42,62,0.72) 0%, rgba(18,33,50,0.72) 100%)",
              color: "#F5F1E6",
              border: `1px solid rgba(255,255,255,0.09)`,
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
              minHeight: 104,
            }}
          />

        </div>

        {/* Experience Availability */}
        <div
          className="mt-6 rounded-[14px] px-5 py-4 sm:px-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(22,40,60,0.78) 0%, rgba(16,31,48,0.72) 100%)",
            border: `1px solid rgba(255,255,255,0.09)`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          <div
            className="h-px w-full"
            style={{
              background: `linear-gradient(90deg, transparent 0%, rgba(232,199,117,0.5) 18%, rgba(212,166,74,0.8) 50%, rgba(232,199,117,0.5) 82%, transparent 100%)`,
              marginBottom: 14,
            }}
          />
          <div className="flex items-center gap-4">
            <span
              className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full"
              style={{
                background:
                  "linear-gradient(135deg, rgba(232,199,117,0.18), rgba(212,166,74,0.10))",
                border: `1px solid rgba(232,199,117,0.35)`,
                color: S1_GOLD_SOFT,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <Info size={16} strokeWidth={2} />
            </span>
            <div className="flex-1">
              <div
                className="font-medium text-white"
                style={{ fontFamily: SERIF, fontSize: 15.5, letterSpacing: "0.01em" }}
              >
                Experience Availability
              </div>
              <p
                className="mt-1 text-[12.5px] leading-[1.55]"
                style={{ color: "rgba(245,241,230,0.62)" }}
              >
                Experiences vary by destination, season and local availability. If one of your selected experiences isn&apos;t available, our team will recommend the closest premium alternative.
              </p>
            </div>
          </div>

        </div>

        {/* Experience Wishlist Summary */}
        {(selected.size > 0 || preferredDate || dateFlexible || additionalRequests.trim().length > 0) && (
          <div
            className="mt-6 rounded-[16px] p-5"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,38,56,0.9) 0%, rgba(8,19,31,0.9) 100%)",
              border: `1px solid ${S1_BORDER}`,
              boxShadow:
                "0 20px 40px -24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="h-px flex-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${S1_GOLD}, transparent)`,
                }}
              />
              <span
                className="text-[10.5px] font-semibold tracking-[0.28em]"
                style={{ color: S1_GOLD_SOFT, textTransform: "uppercase" }}
              >
                Your experience wishlist
              </span>
              <span
                className="h-px flex-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${S1_GOLD}, transparent)`,
                }}
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {selected.size > 0 && (
                <div className="flex items-start gap-2.5 sm:col-span-2">
                  <Check size={14} strokeWidth={2.6} style={{ color: S1_GOLD_SOFT, marginTop: 3 }} />
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-semibold tracking-[0.16em]" style={{ color: "rgba(245,241,230,0.55)", textTransform: "uppercase" }}>
                      {selected.size} {selected.size === 1 ? "experience" : "experiences"} selected
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {Array.from(selected).map((label) => (
                        <span
                          key={label}
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px]"
                          style={{
                            background: "rgba(212,166,74,0.10)",
                            border: `1px solid rgba(232,199,117,0.35)`,
                            color: "#F5F1E6",
                          }}
                        >
                          <Check size={11} strokeWidth={2.8} style={{ color: S1_GOLD_SOFT }} />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {preferredDate && (
                <div className="flex items-start gap-2.5">
                  <CalendarDays size={14} strokeWidth={2.2} style={{ color: S1_GOLD_SOFT, marginTop: 3 }} />
                  <div>
                    <div className="text-[11.5px] font-semibold tracking-[0.16em]" style={{ color: "rgba(245,241,230,0.55)", textTransform: "uppercase" }}>
                      Preferred date
                    </div>
                    <div className="mt-1 text-[13.5px] text-white">{format(preferredDate, "PPP")}</div>
                  </div>
                </div>
              )}
              {dateFlexible && (
                <div className="flex items-start gap-2.5">
                  <Sparkles size={14} strokeWidth={2.2} style={{ color: S1_GOLD_SOFT, marginTop: 3 }} />
                  <div>
                    <div className="text-[11.5px] font-semibold tracking-[0.16em]" style={{ color: "rgba(245,241,230,0.55)", textTransform: "uppercase" }}>
                      Flexibility
                    </div>
                    <div className="mt-1 text-[13.5px] text-white">Open to alternative dates</div>
                  </div>
                </div>
              )}
              {additionalRequests.trim().length > 0 && (
                <div className="flex items-start gap-2.5 sm:col-span-2">
                  <Info size={14} strokeWidth={2.2} style={{ color: S1_GOLD_SOFT, marginTop: 3 }} />
                  <div className="min-w-0">
                    <div className="text-[11.5px] font-semibold tracking-[0.16em]" style={{ color: "rgba(245,241,230,0.55)", textTransform: "uppercase" }}>
                      Concierge notes
                    </div>
                    <div className="mt-1 line-clamp-2 text-[13.5px] text-white" style={{ lineHeight: 1.5 }}>
                      {additionalRequests.trim()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recommendation panel */}
        <div
          className="relative mt-6 flex flex-col gap-5 overflow-hidden rounded-[16px] px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-7"
          style={{
            background: "linear-gradient(180deg, rgba(26,46,68,0.96) 0%, rgba(15,30,47,0.96) 100%)",
            border: `1px solid rgba(255,255,255,0.11)`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="pointer-events-none absolute right-0 top-1/2 h-[280px] w-[380px] -translate-y-1/2"
            style={{
              background: "radial-gradient(50% 50% at 70% 50%, rgba(212,166,74,0.16), transparent 72%)",
              filter: "blur(6px)",
            }}
          />
          <div className="relative flex items-center gap-4">
            <span
              className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full"
              style={{
                border: `1.5px solid rgba(245,241,230,0.6)`,
                color: "#F5F1E6",
              }}
            >
              <Check size={18} strokeWidth={2.2} />
            </span>
            <div>
              <div
                className="font-medium text-white"
                style={{ fontFamily: SERIF, fontSize: 18, lineHeight: 1.28 }}
              >
                Let HotelGroupBook curate the perfect experience package for your group.
              </div>
              <div className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "rgba(245,241,230,0.6)" }}>
                We&apos;ll recommend the best experiences based on your destination, travel dates and group profile.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLetUsRecommend(!letUsRecommend)}
            className="s4-shimmer s4-surprise relative inline-flex flex-shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-[13px] px-7 py-[14px] text-[14.5px] font-semibold transition-all duration-300 hover:-translate-y-[2px]"
            style={{
              background: `linear-gradient(135deg, ${S1_GOLD_SOFT} 0%, ${S1_GOLD} 55%, #B88C2F 100%)`,
              color: S1_NAVY,
              border: `1px solid ${S1_GOLD}`,
              minWidth: 196,
              boxShadow: letUsRecommend
                ? "0 32px 56px -18px rgba(212,166,74,0.85), 0 8px 18px -8px rgba(212,166,74,0.5), inset 0 1px 0 rgba(255,255,255,0.55)"
                : "0 22px 40px -14px rgba(212,166,74,0.6), 0 6px 14px -6px rgba(212,166,74,0.35), inset 0 1px 0 rgba(255,255,255,0.5)",
            }}
          >
            <Sparkles size={17.5} strokeWidth={2} className="s4-surprise-icon" />
            {letUsRecommend ? "We'll surprise you" : "Surprise me"}
          </button>
        </div>

        {/* Bottom nav */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[14.5px] font-medium transition-colors"
            style={{ color: S1_GOLD_SOFT }}
          >
            <ArrowLeft size={16} strokeWidth={2.2} />
            Back
          </button>

          <button
            type="button"
            onClick={onNext}
            className="s4-shimmer inline-flex items-center gap-2.5 rounded-[14px] px-8 py-4 text-[14.5px] font-semibold transition-all hover:-translate-y-[1px]"
            style={{
              background: `linear-gradient(135deg, ${S1_GOLD_SOFT} 0%, ${S1_GOLD} 55%, #B88C2F 100%)`,
              color: S1_NAVY,
              border: `1px solid ${S1_GOLD}`,
              boxShadow:
                "0 20px 42px -16px rgba(212,166,74,0.6), inset 0 1px 0 rgba(255,255,255,0.45)",
            }}
          >
            Next step
            <ArrowRight size={17} strokeWidth={2.4} />
          </button>
        </div>

        <div className="mt-5 flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-2 text-[13.5px]">
            <ShieldCheck size={16} strokeWidth={2} style={{ color: S1_GOLD_SOFT }} />
            <span style={{ color: S1_GOLD_SOFT }}>
              Your request is free and non-binding
            </span>
          </div>
          <div className="text-[12.5px]" style={{ color: "rgba(245,241,230,0.5)" }}>
            We find the best options so you can choose what suits your group.
          </div>
        </div>

      </section>
    </LeisureStepShell>
  );
}

/* =========================================================
   STEP 5 - Contact (redesigned)
   ========================================================= */

const S5_HERO =
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80";

const PHONE_COUNTRIES: { code: string; dial: string; flag: string; name: string }[] = [
  { code: "NO", dial: "+47", flag: "🇳🇴", name: "Norway" },
  { code: "SE", dial: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "DK", dial: "+45", flag: "🇩🇰", name: "Denmark" },
  { code: "FI", dial: "+358", flag: "🇫🇮", name: "Finland" },
  { code: "IS", dial: "+354", flag: "🇮🇸", name: "Iceland" },
  { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "DE", dial: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "NL", dial: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "FR", dial: "+33", flag: "🇫🇷", name: "France" },
  { code: "ES", dial: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "IT", dial: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "US", dial: "+1", flag: "🇺🇸", name: "United States" },
];

const S5_COUNTRIES: { code: string; name: string; flag: string }[] = [
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
];

function S5FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label
      className="mb-2.5 block text-[11.5px] font-semibold uppercase tracking-[0.16em]"
      style={{ color: "#F5F1E6" }}
    >
      {children}
      {optional && (
        <span className="ml-2 text-[10.5px] font-medium tracking-[0.14em]" style={{ color: "rgba(245,241,230,0.45)" }}>
          (OPTIONAL)
        </span>
      )}
    </label>
  );
}

function S5Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={placeholder}
      className="w-full rounded-[14px] px-5 py-4 text-[15px] outline-none transition-all duration-200"
      style={{
        backgroundColor: S1_NAVY,
        color: "#F5F1E6",
        border: `1px solid ${focused ? S1_GOLD : "rgba(212,166,74,0.28)"}`,
        boxShadow: focused
          ? "0 0 0 4px rgba(212,166,74,0.12), 0 10px 24px -18px rgba(212,166,74,0.55)"
          : "inset 0 1px 0 rgba(255,255,255,0.02)",
      }}
    />
  );
}

function LeisureStep5Screen({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  organisation,
  setOrganisation,
  additionalComments,
  setAdditionalComments,
  canContinue,
  onNext,
  onBack,
  onStepGo,
}: {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  organisation: string;
  setOrganisation: (v: string) => void;
  additionalComments: string;
  setAdditionalComments: (v: string) => void;
  canContinue: boolean;
  onNext: () => void;
  onBack: () => void;
  onStepGo: (s: StepKey) => void;
}) {
  const [dialCode, setDialCode] = useState("+47");
  const [country, setCountry] = useState("");
  const [commentsFocused, setCommentsFocused] = useState(false);

  const dial = PHONE_COUNTRIES.find((p) => p.dial === dialCode) ?? PHONE_COUNTRIES[0];

  return (
    <LeisureStepShell
      activeStep={5}
      onStepGo={onStepGo}
      hero={S5_HERO}
      chapter="CHAPTER V"
      headline={
        <>
          Who should<br />we write to?
        </>
      }
      subtext={<>We'll send tailored offers to this person.</>}
    >
      <section
        className="rounded-[24px] p-6 sm:p-8 lg:p-10"
        style={{
          backgroundColor: S1_NAVY_SOFT,
          border: `1px solid ${S1_BORDER}`,
          boxShadow:
            "0 40px 80px -40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        <h2
          className="text-[28px] sm:text-[32px] leading-tight font-medium text-white"
          style={{ fontFamily: SERIF }}
        >
          Step 5 – Contact
        </h2>
        <p className="mt-2 text-[14.5px]" style={{ color: "rgba(245,241,230,0.62)" }}>
          Who should we contact?
        </p>

        {/* Row 1 */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          <div>
            <S5FieldLabel>First Name</S5FieldLabel>
            <S5Input value={firstName} onChange={setFirstName} placeholder="Enter first name" />
          </div>
          <div>
            <S5FieldLabel>Last Name</S5FieldLabel>
            <S5Input value={lastName} onChange={setLastName} placeholder="Enter last name" />
          </div>
        </div>

        {/* Row 2 */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          <div>
            <S5FieldLabel>Email</S5FieldLabel>
            <S5Input value={email} onChange={setEmail} placeholder="Enter email address" type="email" />
          </div>
          <div>
            <S5FieldLabel>Phone</S5FieldLabel>
            <div
              className="flex items-stretch overflow-hidden rounded-[14px] transition-all duration-200"
              style={{
                backgroundColor: S1_NAVY,
                border: `1px solid rgba(212,166,74,0.28)`,
              }}
            >
              <div
                className="relative flex items-center gap-2 pl-4 pr-2"
                style={{ borderRight: `1px solid rgba(212,166,74,0.22)` }}
              >
                <span className="text-[18px] leading-none">{dial.flag}</span>
                <span className="text-[14px] font-medium" style={{ color: "#F5F1E6" }}>
                  {dial.dial}
                </span>
                <ChevronDown size={14} style={{ color: S1_GOLD_SOFT }} />
                <select
                  value={dialCode}
                  onChange={(e) => setDialCode(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  aria-label="Country code"
                >
                  {PHONE_COUNTRIES.map((p) => (
                    <option key={p.code} value={p.dial} style={{ color: "#000" }}>
                      {p.flag} {p.name} ({p.dial})
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="flex-1 bg-transparent px-4 py-4 text-[15px] outline-none"
                style={{ color: "#F5F1E6" }}
              />
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="mt-6">
          <S5FieldLabel optional>Organisation / Group Name</S5FieldLabel>
          <S5Input
            value={organisation}
            onChange={setOrganisation}
            placeholder="Enter organisation or group name"
          />
        </div>

        {/* Row 4 - Country */}
        <div className="mt-6">
          <S5FieldLabel>Country</S5FieldLabel>
          <div
            className="relative rounded-[14px] transition-all duration-200"
            style={{
              backgroundColor: S1_NAVY,
              border: `1px solid rgba(212,166,74,0.28)`,
            }}
          >
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full cursor-pointer appearance-none bg-transparent px-5 py-4 pr-12 text-[15px] outline-none"
              style={{ color: country ? "#F5F1E6" : "rgba(245,241,230,0.55)" }}
            >
              <option value="" style={{ color: "#000" }}>
                Select country
              </option>
              {S5_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} style={{ color: "#000" }}>
                  {c.flag}  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2"
              style={{ color: S1_GOLD_SOFT }}
            />
          </div>
        </div>

        {/* Row 5 - Additional Comments */}
        <div className="mt-6">
          <S5FieldLabel optional>Additional Comments</S5FieldLabel>
          <textarea
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            onFocus={() => setCommentsFocused(true)}
            onBlur={() => setCommentsFocused(false)}
            placeholder="Tell us anything else we should know…"
            rows={4}
            className="w-full resize-y rounded-[14px] px-5 py-4 text-[15px] outline-none transition-all duration-200"
            style={{
              backgroundColor: S1_NAVY,
              color: "#F5F1E6",
              border: `1px solid ${commentsFocused ? S1_GOLD : "rgba(212,166,74,0.28)"}`,
              boxShadow: commentsFocused
                ? "0 0 0 4px rgba(212,166,74,0.12), 0 10px 24px -18px rgba(212,166,74,0.55)"
                : "inset 0 1px 0 rgba(255,255,255,0.02)",
              minHeight: 120,
            }}
          />
        </div>

        {/* Bottom nav */}
        <div className="mt-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[14.5px] font-medium transition-colors"
            style={{ color: S1_GOLD_SOFT }}
          >
            <ArrowLeft size={16} strokeWidth={2.2} />
            Back
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!canContinue}
            className="inline-flex items-center gap-2.5 rounded-[14px] px-8 py-4 text-[14.5px] font-semibold transition-all hover:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            style={{
              background: `linear-gradient(135deg, ${S1_GOLD_SOFT} 0%, ${S1_GOLD} 100%)`,
              color: S1_NAVY,
              boxShadow:
                "0 18px 40px -16px rgba(212,166,74,0.55), inset 0 1px 0 rgba(255,255,255,0.4)",
            }}
          >
            Next step
            <ArrowRight size={17} strokeWidth={2.4} />
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-1 text-center">
          <div className="flex items-center gap-2 text-[13.5px]">
            <ShieldCheck size={16} strokeWidth={2} style={{ color: S1_GOLD_SOFT }} />
            <span style={{ color: S1_GOLD_SOFT }}>
              Your request is free and non-binding
            </span>
          </div>
          <div className="text-[12.5px]" style={{ color: "rgba(245,241,230,0.5)" }}>
            We find the best options so you can choose what suits your group.
          </div>
        </div>
      </section>
    </LeisureStepShell>
  );
}

/* =========================================================
   STEP 6 - Review (redesigned)
   ========================================================= */

/* Step 6 champagne-gold palette (colour only) */
const S6_GOLD = "#E7C96B";
const S6_GOLD_LIGHT = "#F3D987";

const S6_IMG_STAY =
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80";
const S6_IMG_DINING =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80";
const S6_IMG_EXPERIENCE =
  "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=900&q=80";
const S6_IMG_CONCIERGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80";

function S6LuxCard({
  icon,
  title,
  detail,
  image,
  onClick,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  image: string;
  onClick: () => void;
  index: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="s6-card group relative flex h-[80px] w-full items-stretch overflow-hidden rounded-[20px] text-left lg:h-[84px]"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex flex-1 items-center gap-6 px-6 py-0 sm:px-9">
        <span className="shrink-0" style={{ color: S6_GOLD }}>
          {icon}
        </span>
        <span className="min-w-0">
          <span
            className="block text-[16px] uppercase tracking-[0.13em] text-[#F7F1E3] sm:text-[18px]"
            style={{ fontFamily: SERIF }}
          >
            {title}
          </span>
          <span
            className="mt-1 block truncate text-[13.5px] sm:text-[14.5px]"
            style={{ color: "rgba(236,229,214,0.74)" }}
          >
            {detail}
          </span>
        </span>
      </div>

      <span className="relative hidden w-[215px] shrink-0 overflow-hidden sm:block lg:w-[264px]">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(30,43,59,0.96) 0%, rgba(30,43,59,0.15) 45%, rgba(30,43,59,0) 100%)",
          }}
        />
      </span>

      <span className="flex w-[58px] shrink-0 items-center justify-center sm:w-[72px]">
        <ChevronRight
          size={22}
          strokeWidth={1.6}
          className="transition-transform duration-300 group-hover:translate-x-[3px]"
          style={{ color: S6_GOLD }}
        />
      </span>

    </button>
  );
}

const S6_HERO =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80";

const CITY_HERO_MAP: Record<string, string> = {
  Bergen: "https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?auto=format&fit=crop&w=900&q=80",
  Oslo: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?auto=format&fit=crop&w=900&q=80",
  Lofoten: "https://images.unsplash.com/photo-1520681279154-51b3fb4ea0f8?auto=format&fit=crop&w=900&q=80",
  Tromsø: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=80",
  Stavanger: "https://images.unsplash.com/photo-1580996378027-23090ffcf60e?auto=format&fit=crop&w=900&q=80",
  Stockholm: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=900&q=80",
  Copenhagen: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=900&q=80",
  Helsinki: "https://images.unsplash.com/photo-1559060680-36cba6b95ca6?auto=format&fit=crop&w=900&q=80",
};

const ROOM_TITLE: Record<string, string> = {
  single: "Single",
  twin: "Twin",
  double: "Double",
  triple: "Triple",
  family: "Family",
  accessible: "Accessible",
};

function S6Panel({
  icon,
  title,
  onEdit,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span style={{ color: S6_GOLD_LIGHT }}>{icon}</span>
          <span
            className="text-[15px] font-semibold"
            style={{ color: S6_GOLD_LIGHT, fontFamily: SERIF }}
          >
            {title}
          </span>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 text-[12px] font-medium transition-colors hover:opacity-80"
            style={{ color: S6_GOLD_LIGHT }}
          >
            Edit
            <Pencil size={11} strokeWidth={2} />
          </button>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function S6Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-[14px] leading-relaxed" style={{ color: "#F5F1E6" }}>
      <span
        className="mt-[9px] inline-block h-[3px] w-[3px] flex-shrink-0 rounded-full"
        style={{ backgroundColor: "rgba(245,241,230,0.75)" }}
      />
      <span>{children}</span>
    </li>
  );
}

function LeisureStep6Screen({
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



  return (
    <LeisureStepShell
      activeStep={6}
      onStepGo={onStepGo}
      pageBg="radial-gradient(120% 80% at 50% -10%, #1B2B3D 0%, #14202E 45%, #0D1723 100%) fixed"
      hideHero
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
      <section className="s6-lux relative mx-auto w-full max-w-[1180px] px-4 py-2 sm:px-8 lg:px-10">

        {/* OUTER LUXURY CONTAINER */}
        <div
          className="relative mx-auto w-full max-w-[1100px] overflow-hidden rounded-[22px] px-5 py-4 sm:px-9 sm:py-5"

          style={{
            background:
              "linear-gradient(180deg, rgba(32,45,62,0.97) 0%, rgba(25,37,52,0.98) 55%, rgba(20,31,44,0.99) 100%)",
            border: "1px solid rgba(231,201,107,0.34)",
            boxShadow:
              "0 40px 110px -50px rgba(0,0,0,0.85), inset 0 1px 0 rgba(247,232,190,0.10), inset 0 0 60px -10px rgba(231,201,107,0.10)",
          }}
        >
          {/* subtle gold corner details */}
          <span
            className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rotate-45"
            style={{
              background:
                "linear-gradient(90deg, rgba(231,201,107,0.35), transparent 60%)",
              maskImage:
                "linear-gradient(180deg, rgba(0,0,0,1), transparent 70%)",
              opacity: 0.5,
            }}
          />
          <span
            className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 -rotate-45"
            style={{
              background:
                "linear-gradient(270deg, rgba(231,201,107,0.35), transparent 60%)",
              maskImage:
                "linear-gradient(180deg, rgba(0,0,0,1), transparent 70%)",
              opacity: 0.5,
            }}
          />
          <span
            className="pointer-events-none absolute bottom-0 left-0 h-32 w-64"
            style={{
              background:
                "radial-gradient(circle at 0% 100%, rgba(231,201,107,0.18), transparent 70%)",
            }}
          />
          <span
            className="pointer-events-none absolute bottom-0 right-0 h-32 w-64"
            style={{
              background:
                "radial-gradient(circle at 100% 100%, rgba(231,201,107,0.18), transparent 70%)",
            }}
          />

          <div className="relative">
            {/* HEADER */}
            <div className="flex flex-col items-center text-center">
              <span
                className="text-[13px] font-medium uppercase tracking-[0.28em]"
                style={{ color: S6_GOLD, fontFamily: SERIF }}
              >
                3. Concierge Review
              </span>
              <div className="mt-2 flex w-full max-w-[520px] items-center gap-4">
                <span
                  className="h-px flex-1"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(231,201,107,0.55))",
                  }}
                />
                <ConciergeBell size={24} strokeWidth={1.2} style={{ color: S6_GOLD }} />
                <span
                  className="h-px flex-1"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(231,201,107,0.55), transparent)",
                  }}
                />
              </div>
              <h2
                className="mt-2 text-[30px] leading-[1.05] font-normal uppercase tracking-[0.03em] text-[#F7F1E3] sm:text-[40px]"
                style={{ fontFamily: SERIF }}
              >
                Your Journey at a Glance
              </h2>
              <p
                className="mt-1.5 text-[14px] sm:text-[15px]"
                style={{ color: "rgba(236,229,214,0.72)" }}
              >
                Please review your request details before submitting.
              </p>
            </div>

            {/* REVIEW CARDS */}
            <div className="mt-4 space-y-[10px]">
              {reviewCards.map((c, i) => (
                <S6LuxCard key={c.title} {...c} index={i} />
              ))}
            </div>


            {/* BOTTOM INFORMATION PANEL */}
            <div
              className="mt-[10px] grid grid-cols-1 gap-3 rounded-[16px] px-6 py-[12px] sm:px-8 md:grid-cols-2 md:gap-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(38,52,70,0.96), rgba(28,41,57,0.96))",
                border: "1px solid rgba(231,201,107,0.22)",
                boxShadow: "0 24px 60px -40px rgba(0,0,0,0.7)",
              }}
            >
              <div className="flex items-center gap-4 md:pr-8">
                <span
                  className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full"
                  style={{ border: "1px solid rgba(231,201,107,0.4)" }}
                >
                  <Users size={20} strokeWidth={1.4} style={{ color: S6_GOLD }} />
                </span>
                <div className="min-w-0">
                  <div
                    className="text-[11.5px] font-medium uppercase tracking-[0.14em]"
                    style={{ color: S6_GOLD }}
                  >
                    A Dedicated Concierge Specialist
                  </div>
                  <p
                    className="mt-1 text-[13px] leading-snug"
                    style={{ color: "rgba(236,229,214,0.76)" }}
                  >
                    will personally handle your request
                    <br className="hidden sm:block" /> and find the perfect match for you.
                  </p>
                </div>
              </div>

              <div
                className="flex items-center justify-between gap-4 md:justify-end md:pl-8"
                style={{ borderLeft: "1px solid rgba(231,201,107,0.16)" }}
              >
                <div className="min-w-0 md:text-right">
                  <div
                    className="text-[11.5px] font-medium uppercase tracking-[0.14em]"
                    style={{ color: S6_GOLD }}
                  >
                    Estimated Reply
                  </div>
                  <div
                    className="mt-1 text-[22px] leading-none text-[#F7F1E3] sm:text-[25px]"
                    style={{ fontFamily: SERIF }}
                  >
                    Within 24 Hours
                  </div>
                </div>
                <span
                  className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-full"
                  style={{ border: "1px solid rgba(231,201,107,0.4)" }}
                >
                  <Clock size={20} strokeWidth={1.4} style={{ color: S6_GOLD }} />
                </span>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit}
              className="s6-submit mt-[12px] flex h-[58px] w-full items-center justify-center gap-3 rounded-[12px] text-[15px] font-semibold uppercase tracking-[0.22em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
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
                "Submit Request"
              )}
            </button>
          </div>
        </div>

        {/* OUTSIDE THE REVIEW CONTAINER */}
        <div className="mt-4 flex flex-col items-center gap-2 text-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[14px] font-medium transition-opacity hover:opacity-80"
            style={{ color: S6_GOLD_LIGHT }}
          >
            <ArrowLeft size={15} strokeWidth={2} />
            Back
          </button>
          <div className="flex items-center gap-2 text-[12.5px]">
            <ShieldCheck size={14} strokeWidth={1.8} style={{ color: S6_GOLD_LIGHT }} />
            <span style={{ color: "rgba(236,229,214,0.62)" }}>
              Your request is free and non-binding
            </span>
          </div>
        </div>
      </section>


    </LeisureStepShell>
  );
}
