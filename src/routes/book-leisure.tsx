
import { supabase } from "@/integrations/supabase/client";
import { hasProfileDetails, isProfileComplete, upsertProfile, useAuth } from "@/lib/auth";
import { createBooking, nightsBetween, type NewBookingInput } from "@/lib/bookingsApi";
import { savePendingRequest, clearPendingRequest } from "@/lib/pendingRequest";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import leisureStep1HeroAsset from "@/assets/leisure-step1-hero-v3.png.asset.json";
import s2HeroImg from "@/assets/s2-accommodation-hero.jpg";
import roomSingleImg from "@/assets/rooms/room-single.jpg";
import roomDoubleImg from "@/assets/rooms/room-double.jpg";
import roomTwinImg from "@/assets/rooms/room-twin.jpg";
import roomTripleImg from "@/assets/rooms/room-triple.jpg";
import roomFamilyImg from "@/assets/rooms/room-family.jpg";
import roomAccessibleImg from "@/assets/rooms/room-accessible.jpg";

import s2SuiteFjordImg from "@/assets/s2-suite-fjord.png.asset.json";
import s4AuroraHeroImg from "@/assets/s4-aurora-hero.png.asset.json";
import s5BlackGoldHero from "@/assets/s5-black-gold-hero.png.asset.json";
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
  User,
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
  Moon,
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
  const { session: authSession } = useAuth();
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
  const [contactCountry, setContactCountry] = useState("");

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

  const buildRequestInput = (): NewBookingInput => {
    const cityName = customDestination.trim() || city;
    const start = arrival ? format(arrival, "yyyy-MM-dd") : null;
    const end = departure ? format(departure, "yyyy-MM-dd") : null;
    return {
      bookingType: "leisure",
      name: cityName ? `${cityName} Group Stay` : "Group Stay",
      destination: [cityName, country].filter(Boolean).join(", "),
      country: country || null,
      city: cityName || null,
      startDate: start,
      endDate: end,
      nights: nightsBetween(start, end),
      rooms: totalRooms,
      guests,
      contact: {
        firstName,
        lastName,
        email,
        phone,
        company: organisation,
        country:
          S5_COUNTRIES.find((c) => c.code === contactCountry)?.name || contactCountry || null,
      },

      request: {
        type: "leisure",
        country,
        city: cityName,
        arrivalDate: start,
        departureDate: end,
        guests,
        rooms,
        totalRooms,
        stays,
        preferredHotel,
        roomNotes,
        specialRequests: Array.from(selectedExtras),
        extrasComments,
        recommendExtras,
        experiences: Array.from(selectedExps),
        letUsRecommend,
        preferredExperienceDate: preferredExpDate ? format(preferredExpDate, "yyyy-MM-dd") : null,
        experienceDateFlexible: expDateFlexible,
        additionalExperienceRequests: additionalExpRequests,
        additionalInformation: additionalComments,
      },
      roomLines: Object.entries(rooms)
        .filter(([, qty]) => qty > 0)
        .map(([room_type, quantity]) => ({
          room_type,
          quantity,
          check_in: start,
          check_out: end,
        })),
    };
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const input = buildRequestInput();
      // Single global session (falls back to the shared client if not hydrated yet).
      const user =
        authSession?.user ?? (await supabase.auth.getSession()).data.session?.user;

      if (!user) {
        /* the request is kept intact and submitted right after sign-in */
        savePendingRequest(input);
        navigate({ to: "/auth", search: { next: "/manage-bookings", mode: "signup" } });
        return;
      }

      // Profile stays the customer's own reusable record: ensure it exists and
      // only fill blanks — never overwrite details they already saved.
      const { data: existing } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, company_name, phone, country")
        .eq("user_id", user.id)
        .maybeSingle();
      await upsertProfile(user.id, {
        first_name: existing?.first_name?.trim() || firstName,
        last_name: existing?.last_name?.trim() || lastName,
        email: existing?.email?.trim() || email || user.email || "",
        company_name: existing?.company_name?.trim() || organisation || null,
        phone: existing?.phone?.trim() || phone || null,
        country: existing?.country?.trim() || contactCountry || country || null,
      });

      const created = await createBooking(user.id, input);
      clearPendingRequest();
      setConfirmation({ requestId: created.reference });
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
        contactCountry={contactCountry}
        setContactCountry={setContactCountry}
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
          <Link to="/" className="flex items-center gap-3" aria-label="HotelGroupBook">
            <BrandLogo size="md" tone="light" />
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
import s6MarbleAsset from "@/assets/s6-marble-texture.png.asset.json";


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
      <BookingHeader background="transparent" currentStep={1} onStepGo={onStepGo} hideCurrentFlow="leisure" />

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
  { key: "single", title: "Single Room", desc: "1 person", img: roomSingleImg },
  { key: "triple", title: "Triple Room", desc: "3 people", img: roomTripleImg },
  { key: "twin", title: "Twin Room", desc: "2 separate beds", img: roomTwinImg },
  { key: "family", title: "Family Room", desc: "4+ people", img: roomFamilyImg },
  { key: "double", title: "Double Room", desc: "1 double bed", img: roomDoubleImg },
  { key: "accessible", title: "Accessible Room", desc: "Wheelchair friendly", img: roomAccessibleImg },
];

/* Room categories */
const ACCESSIBLE_CATEGORY_LABEL = "Available room";

const ROOM_CATEGORY_OPTIONS: Record<string, string[]> = {
  single: ["Standard", "Superior", "Premium", "Junior Suite", "Suite"],
  double: ["Standard", "Superior", "Premium", "Junior Suite", "Suite"],
  twin: ["Standard", "Superior", "Premium", "Junior Suite", "Suite"],
  triple: ["Superior", "Premium", "Junior Suite", "Suite"],
  family: ["Family Room", "Junior Suite", "Suite"],
};

/* Default selected category per room type (first option, e.g. "Standard") */
function defaultDraftCategories(): Record<string, string> {
  return {
    ...Object.fromEntries(
      Object.entries(ROOM_CATEGORY_OPTIONS).map(([k, opts]) => [k, opts[0]]),
    ),
    accessible: ACCESSIBLE_CATEGORY_LABEL,
  };
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
  wide = false,
  ultraWide = false,
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
  wide?: boolean;
  ultraWide?: boolean;


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
      <BookingHeader
        background="transparent"
        currentStep={activeStep}
        onStepGo={(s) => onStepGo(s as StepKey)}
        hideCurrentFlow="leisure"
      />


      <div className={`mx-auto grid ${hideHero ? (ultraWide ? "max-w-[1780px] py-8 lg:py-10" : wide ? "max-w-[1500px] py-8 lg:py-10" : "max-w-[1240px] py-4 lg:py-5") : "max-w-[1680px] py-10 lg:py-14"} grid-cols-1 gap-6 px-6 ${gridCols} lg:gap-7 lg:px-8`}>

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
const S2_BG = "#10263E";
const S2_BG_GRADIENT =
  "linear-gradient(180deg, #10263E 0%, #0D2035 100%)";
const S2_PANEL = "rgba(28,59,89,0.92)";
const S2_SUNK = "rgba(15,30,48,0.55)";
const S2_CARD = "rgba(28,59,89,0.92)";
const S2_CARD_ACTIVE = "rgba(34,69,102,0.94)";
const S2_FIELD = "#15304A";
const S2_TEXT = "#F5F1E6";
/* champagne palette (step 2 only) */
const S2_GOLD = "#D9BF82";
const S2_GOLD_SOFT = "#E7D3A4";
const S2_GOLD_DEEP = "#B99C60";
/* Step 2 redesign tokens — ivory / navy / champagne */
const S2_INK = "#10263E";
const S2_IVORY = "#F7F4ED";
const S2_CREAM = "#FBF9F4";
const S2_HAIR_GOLD = "rgba(201,164,92,0.22)";
const S2_NAVY_TEXT = "#12212E";
const S2_NAVY_MUTED = "rgba(18,33,46,0.58)";
const S2_NAVY_BTN = "#17334E";
const S2_SUMMARY_BG = "#142E48";
const S2_CARD_SHADOW =
  "0 1px 0 rgba(255,255,255,0.06) inset, 0 -12px 24px -22px rgba(5,20,34,0.4) inset, 0 14px 34px rgba(5,20,34,0.16)";




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
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [stayAddedFlash, setStayAddedFlash] = useState(false);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const staysSectionRef = useRef<HTMLDivElement | null>(null);
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
      setJustAddedId(id);
      setStayAddedFlash(true);
      window.setTimeout(() => setStayAddedFlash(false), 1100);
      window.setTimeout(() => {
        setLastAddedId((cur) => (cur === id ? null : cur));
      }, 320);
      window.setTimeout(() => {
        setJustAddedId((cur) => (cur === id ? null : cur));
      }, 2200);
      // Calm, concierge-like reveal of the newly saved stay.
      if (typeof window !== "undefined") {
        window.requestAnimationFrame(() => {
          window.setTimeout(() => {
            const el = staysSectionRef.current;
            if (el) smoothScrollToElement(el, 96, 500);
          }, 60);
        });
      }

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
      <BookingHeader
        background="transparent"
        compact
        currentStep={2}
        onStepGo={(s) => onStepGo(s as StepKey)}
        hideCurrentFlow="leisure"
      />

      <div className="mx-auto w-full" style={{ maxWidth: 1920, padding: "40px 20px 30px" }}>
        <div
          className="grid grid-cols-1 overflow-hidden lg:grid-cols-[22%_minmax(0,59%)_minmax(0,19%)]"
          style={{
            borderRadius: 14,
            border: `1px solid ${S2_HAIR_GOLD}`,
            backgroundColor: S2_IVORY,
            boxShadow: "0 40px 90px -50px rgba(0,0,0,0.85)",
          }}
        >
          {/* ---------- LEFT: cinematic image ---------- */}
          <aside className="relative min-h-[280px] lg:min-h-[720px]">
            <img
              src={s2SuiteFjordImg.url}
              alt="Luxury suite with panoramic fjord view, fireplace and lounge seating"
              className="absolute inset-0 h-full w-full"
              style={{
                objectFit: "cover",
                objectPosition: "54% 74%",
                filter:
                  "brightness(1.06) contrast(1.05) saturate(1.04) hue-rotate(-6deg)",
              }}
            />
            {/* Cool blue tone lift (~10%) — soft-light preserves warm interior */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: "rgba(40,72,120,0.14)",
                mixBlendMode: "soft-light",
              }}
            />
            <div
              className="absolute inset-0"
              style={{ backgroundColor: "rgba(0,0,0,0.19)" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(6,14,24,0.40) 0%, rgba(6,14,24,0.20) 42%, rgba(6,14,24,0.07) 75%, rgba(6,14,24,0.00) 100%)",
              }}
            />
            <div
              className="relative flex h-full flex-col items-start justify-start px-8 pb-12 pt-[17%] text-left lg:px-11"
            >
              <div
                className="text-[11px] font-light tracking-[0.30em]"
                style={{ color: "rgba(247,242,232,0.80)", fontFamily: SERIF }}
              >
                Step 2 of 6
              </div>
              <h1
                className="mt-5 text-[34px] font-light leading-[1.1] lg:text-[38px]"
                style={{ fontFamily: SERIF, color: "#FFFDF8" }}
              >
                Accommodation
              </h1>
              <S2DiamondRule refined />
            </div>

          </aside>

          {/* ---------- CENTER: working area ---------- */}
          <section
            className="min-w-0 px-6 py-8 lg:px-6 lg:pt-[26px] lg:pb-9"
            style={{ backgroundColor: S2_IVORY }}
          >
            {/* ===== Your Stay premium module ===== */}
            <div
              className="s2-stay-module"
              style={{
                background: "linear-gradient(160deg, #0F2237 0%, #102943 100%)",
                borderRadius: 28,
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
                padding: "36px 40px 32px",
              }}
            >
              {/* Stay heading */}
              <div className="flex flex-wrap items-center justify-between gap-6">
                <h2
                  className="text-[34px] font-normal leading-none"
                  style={{ fontFamily: SERIF, color: "#FFFDF8" }}
                >
                  {editingId ? `Editing Stay ${stayNumber}` : "Your Stay"}
                </h2>
                <button
                  type="button"
                  onClick={commitAndStartNext}
                  className="bg-transparent p-0 text-[15px] font-light transition-opacity hover:opacity-75"
                  style={{ color: "#D9BF82", border: "none" }}
                >
                  + Add another stay
                </button>
              </div>

              {/* Stay card (dates + meta + edit/remove) */}
              <div className="mt-[14px]">

                <S2StayCard
                  compact
                  title={editingId ? `Editing Stay ${stayNumber}` : `Stay ${stayNumber}`}
                  arrival={draftArrival}
                  departure={draftDeparture}
                  nights={draftNights}
                  rooms={draftRoomsCount}
                  guests={draftGuestsCount}
                  editable
                  onArrival={(v: string) => {
                    setDraftArrival(v);
                    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
                    if (!m) return;
                    // Calendar-day arithmetic in local time (no ms math, no UTC shift)
                    const next = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
                    next.setDate(next.getDate() + 1);
                    const nextISO = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}-${String(next.getDate()).padStart(2, "0")}`;
                    setDraftDeparture(nextISO);
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

              {/* Saved stays */}
              {stays.some((s) => s.id !== editingId) && (
                <div className="mt-5" ref={staysSectionRef}>
                  <div
                    className="text-[11px] font-medium uppercase tracking-[0.22em]"
                    style={{ color: "rgba(246,242,234,0.62)" }}
                  >
                    Your stays
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                          highlight={justAddedId === s.id}
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
            </div>


            {/* Room distribution */}
            <h3
              className="mt-9 text-[26px] font-normal leading-none"
              style={{ fontFamily: SERIF, color: S2_NAVY_TEXT }}
            >
              Room distribution
            </h3>
            <p className="mt-3 text-[13.5px] font-light" style={{ color: S2_NAVY_MUTED }}>
              Select the number of rooms and the preferred category for your group.
            </p>


            <div className="mt-6 grid grid-cols-1 items-stretch gap-x-[12px] gap-y-[13px] px-0 sm:grid-cols-2 lg:grid-cols-3 lg:px-0">
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

            {/* Disclaimer */}
            <div className="mx-auto mt-[18px] mb-[22px] flex max-w-[680px] flex-col items-center gap-3">
              <div className="h-px w-[120px]" style={{ background: "rgba(197,162,75,0.18)" }} />
              <div
                className="flex items-center justify-center gap-[7px] text-center text-[12px] font-normal leading-[1.5]"
                style={{ color: "rgba(197,162,75,0.78)" }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ color: "rgba(197,162,75,0.78)", flexShrink: 0 }}
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M12 10.5v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                  <circle cx="12" cy="7.6" r="0.9" fill="currentColor" />
                </svg>
                <span>Images are illustrative. Actual room appearance may vary depending on the selected hotel.</span>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <div className="text-[13px] font-light" style={{ color: S2_NAVY_TEXT }}>
                Anything else we should know?{" "}
                <span style={{ color: S2_NAVY_MUTED }}>(optional)</span>
              </div>
              <div
                className="mt-2 px-4 py-3"
                style={{
                  borderRadius: 6,
                  backgroundColor: S2_CREAM,
                  border: `1px solid ${S2_HAIR_GOLD}`,
                }}
              >
                <textarea
                  value={roomNotes}
                  onChange={(e) => setRoomNotes(e.target.value.slice(0, 500))}
                  placeholder="Tell us anything important about your accommodation needs…"
                  rows={2}
                  className="w-full resize-none bg-transparent text-[13.5px] leading-relaxed outline-none placeholder:text-[#9AA3AA]"
                  style={{ color: S2_NAVY_TEXT, minHeight: 44 }}
                />
                <div className="mt-1 text-right text-[11px]" style={{ color: S2_NAVY_MUTED }}>
                  {roomNotes.length} / 500
                </div>
              </div>
            </div>

            {/* Add this stay */}
            <div className="mt-7 flex flex-col items-center gap-2">
              {addError && !canAddStay && (
                <span className="text-[12.5px]" style={{ color: "#A9563F" }}>
                  Please select arrival and departure dates and at least one room.
                </span>
              )}
              <button
                ref={addBtnRef}
                type="button"
                onClick={() => commitStay()}
                aria-disabled={!canAddStay}
                disabled={saving}
                className="group inline-flex w-full max-w-[300px] items-center justify-center gap-3 px-8 py-3.5 text-[12.5px] font-medium uppercase tracking-[0.18em] transition-all duration-300 hover:-translate-y-[1px]"
                style={{
                  borderRadius: 4,
                  backgroundColor: S2_NAVY_BTN,
                  border: `1px solid ${canAddStay ? "rgba(217,191,130,0.55)" : "rgba(217,191,130,0.25)"}`,
                  color: canAddStay ? S2_GOLD_SOFT : "rgba(231,211,164,0.45)",
                  boxShadow: "0 12px 26px -18px rgba(8,19,31,0.7)",
                  cursor: canAddStay ? "pointer" : "not-allowed",
                }}
              >
                {editingId ? "Save changes" : "Add this stay"}
                <ArrowRight
                  size={16}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:translate-x-[4px]"
                />
              </button>
              {stayAddedFlash && (
                <span
                  className="s2-added-flash inline-flex items-center gap-2 text-[12.5px]"
                  style={{ color: S2_GOLD_DEEP }}
                  role="status"
                >
                  <Check size={14} strokeWidth={2.6} />
                  Stay added
                </span>
              )}
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-transparent p-0 text-[13px] font-light underline-offset-4"
                  style={{ color: S2_NAVY_MUTED, border: "none" }}
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Navigation */}
            <div
              className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-5"
              style={{ borderTop: `1px solid ${S2_HAIR_GOLD}` }}
            >
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 bg-transparent p-0 text-[13.5px] font-light"
                style={{ color: S2_NAVY_MUTED, border: "none" }}
              >
                <ArrowLeft size={16} strokeWidth={1.7} />
                Back
              </button>
              <div className="flex flex-col items-end gap-1">
                <button
                  type="button"
                  onClick={onNext}
                  disabled={!nextEnabled}
                  className="inline-flex items-center gap-2.5 px-7 py-3 text-[12.5px] font-medium uppercase tracking-[0.18em] transition-all duration-300 hover:-translate-y-[1px]"
                  style={{
                    borderRadius: 4,
                    backgroundColor: nextEnabled ? S2_NAVY_BTN : "#24384B",
                    border: `1px solid rgba(201,164,92,${nextEnabled ? 0.55 : 0.2})`,
                    color: nextEnabled ? S2_GOLD_SOFT : "#7F8C99",
                    opacity: 1,
                    cursor: nextEnabled ? "pointer" : "not-allowed",
                  }}
                >
                  Next step
                  <ArrowRight size={16} strokeWidth={1.7} />
                </button>
                {!nextEnabled && (
                  <span className="text-[11px]" style={{ color: S2_NAVY_MUTED }}>
                    {stays.length === 0
                      ? "Add at least one stay to continue"
                      : "Finish editing to continue"}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* ---------- RIGHT: summary ---------- */}
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
    </main>
  );
}

/* Thin champagne rule with a small centred diamond. */
function S2DiamondRule({ width = 120, refined = false }: { width?: number; refined?: boolean }) {
  return (
    <div
      className="flex items-center"
      style={{
        width,
        marginTop: refined ? 40 : undefined,
        marginBottom: refined ? 40 : undefined,
      }}
    >
      <span className="h-px flex-1" style={{ background: refined ? "rgba(217,191,130,0.38)" : "rgba(217,191,130,0.55)" }} />
      <span
        className="mx-2 block"
        style={{
          width: refined ? 3.5 : 5,
          height: refined ? 3.5 : 5,
          transform: "rotate(45deg)",
          border: refined ? "1px solid rgba(231,211,164,0.7)" : "1px solid rgba(231,211,164,0.9)",
        }}
      />
      <span className="h-px flex-1" style={{ background: refined ? "rgba(217,191,130,0.38)" : "rgba(217,191,130,0.55)" }} />
    </div>
  );
}

/* ---- Step 2 Stay card (single premium component) ---- */
/** Compact, read-only summary of a saved stay. Used ONLY below "Add this stay". */
/** Calm, eased page scroll (default 500ms ease-in-out). */
function smoothScrollToElement(el: HTMLElement, offset = 96, duration = 500) {
  const startY = window.scrollY;
  const targetY = Math.max(0, el.getBoundingClientRect().top + startY - offset);
  const delta = targetY - startY;
  if (Math.abs(delta) < 2) return;
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    window.scrollTo(0, targetY);
    return;
  }
  const start = performance.now();
  const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, startY + delta * ease(t));
    if (t < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
}

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
  highlight = false,
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
  highlight?: boolean;
}) {
  const fmtLong = (iso: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return { date: "—", day: "" };
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return { date: format(d, "dd MMMM yyyy"), day: format(d, "EEEE").toUpperCase() };
  };
  const roman = (n: number) =>
    ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"][n] ?? String(n);
  const inn = fmtLong(arrival);
  const out = fmtLong(departure);

  const GOLD_STRIP =
    "linear-gradient(180deg, #6E5527 0%, #C9A65C 12%, #F3DCA4 32%, #D8B872 52%, #9C7B36 78%, #E2C98F 100%)";
  const GOLD_TEXT = "#E3C68C";
  const IVORY = "#F7F1E3";

  const stat = (icon: React.ReactNode, value: number, label: string) => (
    <div className="flex flex-1 items-center justify-center gap-2">
      <span style={{ color: GOLD_TEXT }}>{icon}</span>
      <span className="leading-none">
        <span className="block text-[18px] font-medium leading-none" style={{ fontFamily: SERIF, color: IVORY }}>
          {value}
        </span>
        <span className="mt-1 block text-[11px]" style={{ color: "rgba(240,245,251,0.55)" }}>
          {label}
        </span>
      </span>
    </div>
  );

  return (
    <div
      className={`${animClass} ${highlight ? "s2-stay-justadded" : ""} relative flex h-full flex-col overflow-hidden`}
      style={{
        borderRadius: 20,
        maxWidth: 520,
        backgroundImage: "linear-gradient(165deg, #16293D 0%, #0F1F30 100%)",
        border: `1px solid ${highlight ? "rgba(233,208,150,0.85)" : "rgba(217,191,130,0.34)"}`,
        padding: "18px 22px 16px 26px",
        transition: "border-color 600ms ease, box-shadow 600ms ease, transform 600ms ease",
        boxShadow: highlight
          ? "inset 0 1px 0 rgba(255,255,255,0.09), 0 0 0 1px rgba(233,208,150,0.22), 0 34px 70px -30px rgba(3,8,14,0.85), 0 0 28px -8px rgba(217,191,130,0.35)"
          : "inset 0 1px 0 rgba(255,255,255,0.06), 0 26px 54px -28px rgba(3,8,14,0.8), 0 8px 20px -14px rgba(0,0,0,0.5)",
      }}
    >
      {highlight && (
        <div
          className="s2-added-note absolute right-5 top-[46px] flex items-center gap-[6px] text-[11.5px]"
          style={{ color: "rgba(150,205,165,0.95)" }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Stay added successfully
        </div>
      )}
      {/* metallic gold left strip */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full"
        style={{ width: 6, backgroundImage: GOLD_STRIP, boxShadow: "1px 0 6px -2px rgba(217,191,130,0.45)" }}
      />

      {/* top row */}
      <div className="flex items-start justify-between gap-3">
        <span
          className="text-[11px] font-medium uppercase tracking-[0.28em]"
          style={{ color: GOLD_TEXT }}
        >
          Stay {roman(index)}
        </span>
        <span
          className="flex items-center gap-[5px] rounded-full px-3 py-[3px] text-[11px] font-semibold"
          style={{
            backgroundImage: "linear-gradient(180deg, #5FA56D 0%, #4E9460 48%, #3F7E53 100%)",
            color: "#FFFFFF",
            border: "1px solid rgba(63,126,83,0.6)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.32), inset 0 -1px 2px rgba(34,74,48,0.4), 0 2px 8px -4px rgba(0,0,0,0.45)",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ color: "#FFFFFF" }} aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Saved
        </span>
      </div>

      {/* dates */}
      <div className="mt-4 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-[17px] font-medium leading-tight" style={{ fontFamily: SERIF, color: IVORY }}>
            {inn.date}
          </div>
          <div className="mt-1 text-[10.5px] uppercase tracking-[0.16em]" style={{ color: GOLD_TEXT }}>
            {inn.day}
          </div>
        </div>
        <ArrowRight size={20} strokeWidth={1.4} style={{ color: GOLD_TEXT, flexShrink: 0 }} />
        <div className="min-w-0 flex-1 text-right">
          <div className="truncate text-[17px] font-medium leading-tight" style={{ fontFamily: SERIF, color: IVORY }}>
            {out.date}
          </div>
          <div className="mt-1 text-[10.5px] uppercase tracking-[0.16em]" style={{ color: GOLD_TEXT }}>
            {out.day}
          </div>
        </div>
      </div>

      <div className="mt-3.5 h-px w-full" style={{ background: "rgba(217,191,130,0.28)" }} />

      {/* stats */}
      <div className="mt-3 flex items-center">
        {stat(<BedDouble size={17} strokeWidth={1.6} />, rooms, rooms === 1 ? "Room" : "Rooms")}
        <span className="h-7 w-px" style={{ background: "rgba(217,191,130,0.2)" }} />
        {stat(<Users size={17} strokeWidth={1.6} />, guests, guests === 1 ? "Guest" : "Guests")}
        <span className="h-7 w-px" style={{ background: "rgba(217,191,130,0.2)" }} />
        {stat(<Moon size={17} strokeWidth={1.6} />, nights, nights === 1 ? "Night" : "Nights")}
      </div>

      {/* actions */}
      <div className="mt-auto pt-3.5">
        {confirming ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex flex-1 items-center justify-center gap-2 bg-transparent text-[13.5px] font-medium transition-colors duration-200"
              style={{
                color: GOLD_TEXT,
                border: "1px solid rgba(217,191,130,0.45)",
                borderRadius: 12,
                padding: "9px 14px",
              }}
            >
              <Pencil size={15} strokeWidth={1.7} />
              Continue editing
            </button>
            <span className="h-6 w-px" style={{ background: "rgba(217,191,130,0.18)" }} />
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-2 bg-transparent p-0 text-[13px]"
              style={{ color: "rgba(245,241,230,0.6)", border: "none" }}
            >
              <Trash2 size={14} strokeWidth={1.6} />
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function S2AddStayCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="s2-addstay group flex h-full flex-col items-center justify-center gap-3 transition-all duration-300 ease-out hover:-translate-y-[2px]"
      style={{
        borderRadius: 18,
        minHeight: 196,
        padding: "20px 24px",
        backgroundColor: "rgba(255,255,255,0.035)",
        border: "1px dashed rgba(224,201,143,0.68)",
        color: "#EBD7A4",
        cursor: "pointer",
      }}
    >
      <span
        className="s2-addstay-icon grid h-[51px] w-[51px] place-items-center transition-all duration-300 ease-out group-hover:scale-[1.06]"
        style={{
          borderRadius: 999,
          border: "1px solid rgba(228,203,140,0.55)",
          backgroundColor: "rgba(12,23,33,0.55)",
        }}
      >
        <Plus size={23} strokeWidth={1.7} className="transition-transform duration-300 ease-out group-hover:rotate-90" />
      </span>
      <span className="text-[15px] font-medium">Add another stay</span>
      <span className="text-[12.5px] font-light" style={{ color: "rgba(240,236,226,0.55)" }}>
        Create another hotel stay
      </span>
    </button>
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
  compact = false,
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
  compact?: boolean;

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

  const [arrivalOpen, setArrivalOpen] = React.useState(false);
  const [departureOpen, setDepartureOpen] = React.useState(false);

  const DateCol = ({
    label,
    value,
    onChange,
    minDate,
    align,
    placeholder,
    open,
    setOpen,
    onPicked,
  }: {
    label: string;
    value: string;
    onChange?: (v: string) => void;
    minDate?: Date;
    align: "left" | "right";
    placeholder: string;
    open: boolean;
    setOpen: (v: boolean) => void;
    onPicked?: () => void;
  }) => {
    const selected = toDate(value);
    const interactive = editable && !!onChange;


    const dateValue = selected ? (
      compact ? (
        <span
          className="whitespace-nowrap text-[21px] leading-none"
          style={{
            color: "#F4EFE6",
            fontWeight: 500,
            fontFamily: '"Inter Display", "Inter", "SF Pro Display", system-ui, -apple-system, sans-serif',
            letterSpacing: "0.01em",
          }}
        >
          {format(selected, "dd MMMM yyyy")}
        </span>
      ) : (

        <span
          className="whitespace-nowrap leading-none text-[17.5px]"
          style={{
            marginLeft: align === "left" ? 3 : undefined,
            marginRight: align === "right" ? 3 : undefined,
            display: "inline-flex",
            alignItems: "baseline",
            gap: 5,
          }}
        >
          <span
            style={{
              color: "#E8E4DC",
              fontWeight: 600,
              textShadow: "0 1px 1px rgba(0,0,0,.15)",
            }}
          >
            {format(selected, "d")}
          </span>
          <span
            style={{
              color: "#E8E4DC",
              fontWeight: 400,
              letterSpacing: "0.01em",
            }}
          >
            {format(selected, "MMM yyyy")}
          </span>
        </span>
      )
    ) : (
      <span
        className={`whitespace-nowrap leading-none font-medium ${compact ? "text-[15px]" : "text-[15px]"}`}
        style={{
          color: "#8FA0B0",
          marginLeft: !compact && align === "left" ? 3 : undefined,
          marginRight: !compact && align === "right" ? 3 : undefined,
        }}
      >
        {placeholder}
      </span>
    );

    const icon = compact ? null : (
      <span aria-hidden className="shrink-0 leading-none" style={{ color: "#E8E4DC" }}>
        <CalendarDays size={16} strokeWidth={1.5} />
      </span>
    );

    const alignCls = compact
      ? "items-start text-left"
      : align === "right"
        ? "items-end text-right"
        : "items-start text-left";

    const field = (
      <div className={`flex min-w-0 flex-col ${compact ? "gap-[5px]" : "gap-[6px]"} ${alignCls}`}>
        <span
          className={`whitespace-nowrap font-medium uppercase leading-none ${compact ? "text-[11px]" : "text-[9.5px]"}`}
          style={{ color: compact ? "#C7AB77" : "#B99A60", letterSpacing: compact ? "0.25em" : "0.18em" }}
        >
          {compact ? (label === "Arrival" ? "Check-in" : "Check-out") : label}
        </span>
        <div className="flex items-center gap-[3px]">
          {!compact && align === "right" ? (
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
          compact ? (
            <span
              className="whitespace-nowrap leading-none text-[9px] uppercase"
              style={{
                marginTop: 3,
                color: "rgba(199,171,119,0.72)",
                fontWeight: 500,
                letterSpacing: "0.24em",
              }}
            >
              {format(selected, "EEEE")}
            </span>
          ) : (
            <span
              className="whitespace-nowrap leading-none text-[12px]"
              style={{
                color: "#84909D",
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}
            >
              {format(selected, "EEEE")}
            </span>
          )
        ) : null}
        {compact && selected ? (
          <span aria-hidden className="mt-[4px] flex items-center gap-[5px]">
            <span
              style={{
                display: "block",
                width: 51,
                height: 1,
                backgroundColor: "rgba(199,171,119,0.42)",
              }}
            />
            <span
              style={{
                display: "block",
                width: 4,
                height: 4,
                transform: "rotate(45deg)",
                border: "1px solid rgba(199,171,119,0.55)",
              }}
            />
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
        className={`s2-date-field flex w-full min-w-0 items-center rounded-[12px] bg-transparent text-left transition-colors duration-200 disabled:cursor-default ${compact ? "px-0 py-0" : "px-2 py-[9px]"}`}
        style={{ border: "1px solid transparent", cursor: interactive ? "pointer" : "default", justifyContent: !compact && align === "right" ? "flex-end" : "flex-start" }}
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
              // Re-clicking the already selected day yields undefined —
              // keep the value and simply dismiss the calendar.
              if (d) onChange?.(toISO(d));
              setOpen(false);
              onPicked?.();
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
      className="grid items-center px-[22px] py-[10px]"
      style={{
        width: compact ? "100%" : "92%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: compact ? 0 : 24,
        gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)",
        borderRadius: compact ? 0 : 15,
        backgroundImage: compact
          ? "none"
          : "linear-gradient(180deg, #2E4759 0%, #294152 52%, #253C4D 100%)",
        border: compact ? "none" : "1.5px solid rgba(217,191,130,0.42)",
        boxShadow: compact
          ? "none"
          : "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 -1px 0 rgba(0,0,0,0.22), 0 0 0 4px rgba(217,191,130,0.05), 0 0 34px -6px rgba(217,191,130,0.08), 0 22px 50px -34px rgba(6,13,20,0.85)",
      }}
    >
      <DateCol
        label="Arrival"
        value={arrival}
        onChange={onArrival}
        align="left"
        placeholder="Select arrival date"
        open={arrivalOpen}
        setOpen={setArrivalOpen}
      />
      <ArrowRight
        size={34}
        strokeWidth={1.1}
        className="mx-3 shrink-0 self-center"
        style={{ color: "#B99A60" }}
      />
      <DateCol
        label="Departure"
        value={departure}
        onChange={onDeparture}
        open={departureOpen}
        setOpen={setDepartureOpen}
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

  if (compact)
    return (
      <div
        className={animClass}
        style={{
          borderRadius: 14,
          backgroundImage:
            "linear-gradient(180deg, #1C3653 0%, #152C45 100%)",
          border: "1px solid rgba(178,150,96,0.32)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.09), inset 0 0 0 1px rgba(190,162,108,0.05), inset 0 0 70px -24px rgba(0,0,0,0.28), 0 24px 60px -42px rgba(6,16,27,0.72), 0 12px 32px -22px rgba(0,0,0,0.42)",
          overflow: "hidden",
        }}
      >
        {/* Upper zone — dates + statistics */}
        <div className="flex flex-col gap-2 px-[20px] py-[9px] sm:px-6 lg:flex-row lg:items-center lg:gap-5">
          {/* Circular calendar mark — opens the check-in picker */}

          <button
            type="button"
            aria-label="Open check-in date picker"
            disabled={!(editable && !!onArrival)}
            onClick={() => setArrivalOpen(true)}
            className="grid h-[40px] w-[40px] shrink-0 place-items-center transition-colors duration-200 disabled:cursor-default"
            style={{
              borderRadius: 999,
              border: "1px solid rgba(196,168,114,0.58)",
              color: "#D4B683",
              backgroundColor: "transparent",
              cursor: editable && onArrival ? "pointer" : "default",
              boxShadow:
                "0 0 18px -7px rgba(196,168,114,0.5), inset 0 0 14px -9px rgba(196,168,114,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              if (editable && onArrival) e.currentTarget.style.backgroundColor = "rgba(196,168,114,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <CalendarDays size={21} strokeWidth={1.2} />
          </button>


          {/* Dates */}
          <div className="flex min-w-0 flex-1 items-center gap-5 sm:gap-7">
            <div className="min-w-0 flex-1">
              <DateCol
                label="Arrival"
                value={arrival}
                onChange={onArrival}
                align="left"
                placeholder="Select date"
                open={arrivalOpen}
                setOpen={setArrivalOpen}
              />
            </div>
            <ArrowRight
              size={24}
              strokeWidth={1}
              className="shrink-0"
              style={{ color: "#D4B683" }}
            />

            <div className="min-w-0 flex-1">
              <DateCol
                label="Departure"
                value={departure}
                onChange={onDeparture}
                open={departureOpen}
                setOpen={setDepartureOpen}
                minDate={(() => {
                  const a = toDate(arrival);
                  if (!a) return undefined;
                  const n = new Date(a);
                  n.setDate(n.getDate() + 1);
                  return n;
                })()}

                align="left"
                placeholder="Select date"
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="flex shrink-0 items-stretch">
            <S2LuxeStat
              icon={<MoonIcon />}
              value={nights}
              label={nights === 1 ? "Night" : "Nights"}
              first
            />
            <S2LuxeStat
              icon={<BedDouble size={15} strokeWidth={1.3} />}
              value={rooms}
              label={rooms === 1 ? "Room" : "Rooms"}
            />
            <S2LuxeStat
              icon={<UserRound size={15} strokeWidth={1.3} />}
              value={guests}
              label={guests === 1 ? "Guest" : "Guests"}
            />
          </div>
        </div>


        {/* Lower zone — actions */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 px-[18px] py-[5px]"
          style={{ borderTop: "1px solid rgba(217,191,130,0.10)" }}

        >
          {confirming ? (
            <>
              <span className="text-[14px]" style={{ color: "rgba(216,226,236,0.65)" }}>
                Remove this stay?
              </span>
              <button
                type="button"
                onClick={onConfirmRemove}
                className="s2-luxe-action inline-flex items-center gap-2 bg-transparent p-0 text-[15px]"
                style={{ color: "#FFFFFF", fontWeight: 400, border: "none" }}
              >
                <Trash2 size={17} strokeWidth={1.4} style={{ color: "#D9BF82" }} />
                Yes, remove
              </button>
              <span aria-hidden style={{ width: 1, height: 18, backgroundColor: "rgba(217,191,130,0.28)" }} />
              <button
                type="button"
                onClick={onCancelRemove}
                className="s2-luxe-action inline-flex items-center gap-2 bg-transparent p-0 text-[15px]"
                style={{ color: "rgba(216,226,236,0.7)", fontWeight: 400, border: "none" }}
              >
                <X size={17} strokeWidth={1.4} style={{ color: "#D9BF82" }} />
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onEdit ?? onAddAnother}
                className="s2-luxe-action inline-flex items-center gap-2.5 bg-transparent p-0 text-[15px] transition-opacity duration-200 hover:opacity-75"
                style={{ color: "#FFFFFF", fontWeight: 400, border: "none" }}
              >
                Edit stay
                <Pencil size={17} strokeWidth={1.4} style={{ color: "#D9BF82" }} />
              </button>
              <span aria-hidden style={{ width: 1, height: 18, backgroundColor: "rgba(217,191,130,0.28)" }} />
              <button
                type="button"
                onClick={onRemove}
                className="s2-luxe-action inline-flex items-center gap-2.5 bg-transparent p-0 text-[15px] transition-opacity duration-200 hover:opacity-75"
                style={{ color: "#FFFFFF", fontWeight: 400, border: "none" }}
              >
                Remove stay
                <Trash2 size={17} strokeWidth={1.4} style={{ color: "#D9BF82" }} />
              </button>
            </>
          )}
        </div>
      </div>
    );



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
          className="text-[32px] leading-none"
          style={{ fontFamily: SERIF, color: "#E8E4DC", fontWeight: 600 }}
        >
          {title}
        </h3>
        <button
          type="button"
          onClick={onAddAnother}
          className="inline-flex items-baseline gap-2 bg-transparent p-0 text-[14px] font-extralight leading-none transition-opacity duration-200 hover:opacity-100"
          style={{ color: "#B99A60", border: "none" }}
        >
          <Plus size={15} strokeWidth={1.3} className="translate-y-[2px]" />
          Add another stay
        </button>
      </div>

      {/* SECTION 2 — unified date timeline */}
      {dateTimeline}



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
              className="flex min-w-0 flex-1 basis-0 items-center justify-center gap-2.5 whitespace-nowrap py-1 text-[14.5px]"
              style={{ color: "#84909D", fontWeight: 400 }}
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
            <S2StayInfo tone="remove" icon={<Trash2 size={18} strokeWidth={1.6} />} text="Remove" onClick={onRemove} />
          </>
        )}
      </div>


    </div>
  );
}


function S2LuxeStat({
  icon,
  value,
  label,
  first = false,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  first?: boolean;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-[3px] px-[16px]"
      style={{ borderLeft: first ? undefined : "1px solid rgba(199,171,119,0.15)" }}
    >
      <span aria-hidden className="leading-none" style={{ color: "#D4B683" }}>
        {icon}
      </span>
      <span
        className="text-[19px] leading-none"
        style={{
          color: "#F4EFE6",
          fontWeight: 400,
          fontFamily: '"Playfair Display", "Cormorant Garamond", serif',
        }}
      >
        {value}
      </span>
      <span className="text-[10.5px] leading-none" style={{ color: "#C7AB77", letterSpacing: "0.08em" }}>
        {label}
      </span>
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
  tone = "primary",
}: {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  tone?: "primary" | "remove";
}) {
  const isRemove = tone === "remove";
  const content = (
    <>
      <span
        className="s2-stay-info-icon transition-colors duration-200"
        style={{ color: isRemove ? "rgba(232,228,220,0.75)" : "#E8E4DC", opacity: 1 }}
      >
        {icon}
      </span>
      <span
        className="s2-stay-info-text transition-colors duration-200"
        style={{
          color: isRemove ? "rgba(232,228,220,0.75)" : "#E8E4DC",
          fontWeight: 500,
        }}
      >
        {text}
      </span>
    </>
  );
  const cls =
    "s2-stay-info group flex min-w-0 flex-1 basis-0 items-center justify-center gap-2.5 whitespace-nowrap py-1 text-[14.5px]";

  if (isRemove) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cls}
        onMouseEnter={(e) => {
          e.currentTarget.querySelectorAll<HTMLElement>(".s2-stay-info-icon, .s2-stay-info-text").forEach((el) => {
            el.style.color = "#B99A60";
          });
        }}
        onMouseLeave={(e) => {
          e.currentTarget.querySelectorAll<HTMLElement>(".s2-stay-info-icon, .s2-stay-info-text").forEach((el) => {
            el.style.color = "rgba(232,228,220,0.75)";
          });
        }}
      >
        {content}
      </button>
    );
  }

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
  const capacity =
    roomKey === "family"
      ? "2–4 Guests"
      : roomKey === "accessible"
        ? "1–2 Guests"
        : `${GUESTS_PER_ROOM[roomKey] ?? 1} ${(GUESTS_PER_ROOM[roomKey] ?? 1) === 1 ? "Guest" : "Guests"}`;
  const showInfo = roomKey === "family" || roomKey === "accessible";

  return (
    <div
      className="group s2-room-card flex h-full flex-col overflow-hidden transition-[transform,box-shadow,border-color] duration-300 ease-out"
      data-active={active ? "true" : "false"}
      style={{
        borderRadius: 20,
        backgroundColor: "#F8F5F0",
        padding: 0,
        border: `1px solid ${active ? "rgba(198,169,103,0.5)" : "rgba(205,173,96,0.18)"}`,
        boxShadow:
          "0 2px 4px rgba(8,19,31,0.03), 0 18px 34px -12px rgba(8,19,31,0.16)",
      }}
    >
      {/* 1 — full-bleed image */}
      <img
        src={meta.img}
        alt={meta.title}
        style={{
          display: "block",
          width: "100%",
          height: 190,
          objectFit: "cover",
          objectPosition: "center",
          margin: 0,
          padding: 0,
          borderTopLeftRadius: 19,
          borderTopRightRadius: 19,
        }}
      />

      {/* metallic champagne divider between image and content */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, rgba(205,173,96,0.10) 0%, rgba(214,187,124,0.55) 50%, rgba(205,173,96,0.10) 100%)",
        }}
      />

      {/* 2 — name + guest count + learn more */}
      <div
        className="flex flex-1 flex-col"
        style={{
          padding: "22px 22px 16px",
          backgroundImage:
            "linear-gradient(180deg, rgba(240,232,219,0.55) 0%, rgba(248,245,240,0) 90px)",
        }}
      >

        <div className="flex items-start justify-between gap-2">
          <div
            className="truncate text-[18px] leading-[1.15]"
            style={{ fontFamily: SERIF, fontWeight: 500, color: "#182333" }}
          >
            {meta.title}
          </div>
          {showInfo && (
            <span
              title={meta.desc}
              aria-label={meta.desc}
              className="mt-[2px] grid h-[20px] w-[20px] shrink-0 place-items-center rounded-full text-[12px] font-normal transition-colors duration-200"
              style={{ border: "1px solid rgba(198,169,103,0.75)", color: "#B39254", fontFamily: SERIF }}
            >
              i
            </span>
          )}
        </div>
        <div className="mt-[6px] flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-[8px] text-[15px] font-medium leading-none"
            style={{ color: "#7D8188" }}
          >
            <span style={{ color: "#C0A062", display: "inline-flex" }}>{roomIcon(roomKey)}</span>
            {capacity}
          </div>
          {!showInfo && (
            <span
              title={meta.desc}
              className="flex shrink-0 cursor-default items-center gap-[5px] text-[14px] font-medium leading-none transition-opacity duration-200 hover:opacity-75"
              style={{ color: "#8B6A2F" }}
            >
              Learn more
              <ChevronDown
                size={14}
                strokeWidth={1.9}
                style={{ transform: "rotate(-90deg)", color: "#8B6A2F" }}
              />
            </span>
          )}
        </div>

        {/* hairline divider */}
        <div
          className="h-px"
          style={{ backgroundColor: "#ECE5DB", marginTop: 12, marginBottom: 10 }}
        />

        {/* 3 — control row */}
        <div className="mt-auto flex w-full items-center gap-[10px]">
          <S2Counter light value={value} onChange={onChange} label={meta.title} />
          {categoryOptions ? (
            <div className="min-w-0 flex-1">
              <S2CategorySelect
                light
                value={category ?? categoryOptions[0]}
                options={categoryOptions}
                label={`${meta.title} category`}
                onChange={(v) => onCategoryChange?.(v)}
              />
            </div>
          ) : (
            <div
              className="flex h-[42px] min-w-0 flex-1 items-center justify-between gap-1 overflow-hidden text-[15px] font-medium"
              style={{
                borderRadius: 12,
                padding: "0 18px",
                color: "#FFFFFF",
                backgroundColor: "#0F2946",
              }}
              title={ACCESSIBLE_CATEGORY_LABEL}
            >
              <span className="truncate">{ACCESSIBLE_CATEGORY_LABEL}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



/* ---- Step 2 premium custom category dropdown (portal / floating) ---- */
let s2OpenDropdownId = 0;

function S2CategorySelect({
  value,
  options,
  onChange,
  label,
  light = false,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  label: string;
  light?: boolean;
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
    if (open) close();
    else {
      setActiveIdx(Math.max(0, items.indexOf(value)));
      measure();
      window.dispatchEvent(new CustomEvent("s2-dropdown-open", { detail: idRef.current }));
      setOpen(true);
    }
  };
  const onKeyDown = (e: React.KeyboardEvent) => {

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
    <div className={light ? "relative" : "relative mt-[1px]"}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className={
            light
              ? "flex h-[42px] w-full min-w-0 cursor-pointer select-none items-center justify-between gap-1 whitespace-nowrap text-left text-[15px] font-medium outline-none transition-colors duration-200"
              : "flex w-full cursor-pointer select-none items-center justify-between gap-2 bg-transparent pr-0 text-left text-[14px] font-normal text-white outline-none"
        }
        style={
          light
            ? {
                borderRadius: 12,
                padding: "0 18px",
                color: "#FFFFFF",
                backgroundColor: "#0F2946",
              }
            : undefined
        }

      >
        <span
          className="truncate"
          style={{
            color: light
              ? value
                ? "#FFFFFF"
                : "rgba(255,255,255,0.7)"
              : value
                ? "#FFFFFF"
                : "rgba(245,241,230,0.75)",
          }}
        >
          {value || "Select category"}
        </span>
        <ChevronDown
          size={light ? 16 : 16}
          strokeWidth={2}
          style={{
            color: light ? "#C9A76A" : "rgba(245,241,230,0.55)",
            flexShrink: 0,
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
  const p = { size: 15, strokeWidth: 1.7 } as const;
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
  light = false,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  light?: boolean;
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
      className={`grid shrink-0 place-items-center outline-none transition-all duration-200 active:scale-95 disabled:opacity-30 ${light ? "h-[24px] w-[24px] hover:bg-[rgba(201,167,106,0.14)]" : "h-[30px] w-[30px] hover:bg-white/[0.07]"}`}
      style={{ borderRadius: 999, color: light ? "#C9A76A" : "rgba(217,191,130,0.9)" }}
    >
      {dir === "dec" ? (
        <Minus size={light ? 15 : 16} strokeWidth={1.8} />
      ) : (
        <Plus size={light ? 15 : 16} strokeWidth={1.8} />
      )}
    </button>
  );


  return (
    <div
      className={`flex items-center justify-between ${light ? "h-[42px] shrink-0 px-2" : "h-[35px] px-1.5 transition-colors duration-200"}`}
      style={{
        borderRadius: light ? 12 : 999,
        width: light ? 104 : undefined,
        backgroundColor: light ? "#FFFFFF" : "rgba(20,33,45,0.72)",
        border: light ? "1px solid #E4DDD2" : "1px solid rgba(214,226,236,0.10)",
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
        className={`no-spin w-full min-w-0 bg-transparent text-center outline-none ${light ? "text-[15px] font-normal" : "text-[18px] font-medium text-white"}`}
        style={{ fontFamily: light ? "Inter, sans-serif" : SERIF, color: light ? "#1B3A52" : undefined }}
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
  const distribution = STEP2_ROOMS_ORDER.map((k) => ({
    key: k,
    label: ROOM_LABELS[k],
    count: stays.reduce((sum, s) => sum + (s.rooms[k] ?? 0), 0),
  }));

  const isEmpty = totalRooms === 0 && totalGuests === 0 && totalStays === 0;

  const divider = (
    <div
      className="my-6 h-px w-full"
      style={{ background: "linear-gradient(90deg, rgba(217,191,130,0.30), rgba(217,191,130,0.05))" }}
    />
  );


  return (
    <aside
      className="flex flex-col px-6 py-8 lg:py-9"
      style={{
        backgroundColor: S2_SUMMARY_BG,
        backgroundImage: "linear-gradient(180deg, #142E48 0%, #10263D 100%)",
        borderLeft: `1px solid ${S2_HAIR_GOLD}`,
        boxShadow: "inset 1px 0 0 rgba(201,164,92,0.18)",
      }}
    >
      <div
        className="text-[26px] font-normal leading-[1.1]"
        style={{ fontFamily: SERIF, color: "#FFFDF8" }}
      >
        Accommodation
      </div>
      <div
        className="mt-2.5 text-[10px] font-medium uppercase tracking-[0.26em]"
        style={{ color: S2_GOLD_SOFT }}
      >
        Live Summary
      </div>

      {/* Key metrics */}
      <div className="mt-7 grid grid-cols-3">
        {[
          { label: "Rooms", value: totalRooms },
          { label: "Guests", value: totalGuests },
          { label: "Stays", value: totalStays },
        ].map((row, i) => (
          <div
            key={row.label}
            className="flex flex-col items-center px-1 text-center"
            style={
              i > 0
                ? { borderLeft: "1px solid rgba(255,255,255,0.10)" }
                : undefined
            }
          >
            <span
              className="text-[34px] leading-none tabular-nums font-light"
              style={{ fontFamily: SERIF, color: "#FFFDF8" }}
            >
              {row.value}
            </span>
            <span
              className="mt-3 text-[9.5px] font-medium uppercase tracking-[0.20em]"
              style={{ color: "rgba(246,242,234,0.55)" }}
            >
              {row.label}
            </span>
          </div>
        ))}
      </div>

      {divider}

      <div
        className="text-[10.5px] font-medium uppercase tracking-[0.24em]"
        style={{ color: S2_GOLD_SOFT }}
      >
        Room Distribution
      </div>

      <ul className="mt-4">
        {distribution.map((r, i) => (
          <li
            key={r.key}
            className="flex items-baseline justify-between gap-3 py-3"
            style={i > 0 ? { borderTop: "1px solid rgba(255,255,255,0.07)" } : undefined}
          >
            <span
              className="truncate text-[13.5px] font-light"
              style={{ color: r.count > 0 ? "rgba(246,242,234,0.92)" : "rgba(246,242,234,0.55)" }}
            >
              {r.label}
            </span>
            <span
              className="text-[13.5px] tabular-nums font-light"
              style={{ color: r.count > 0 ? S2_GOLD_SOFT : "rgba(246,242,234,0.45)" }}
            >
              {r.count}
            </span>
          </li>
        ))}
      </ul>


      {isEmpty && (
        <p
          className="mt-6 text-[12.5px] font-light leading-relaxed"
          style={{ color: "rgba(246,242,234,0.50)" }}
        >
          No stays added yet.
          <br />
          Choose your dates and rooms to begin.
        </p>
      )}


      <button
        type="button"
        onClick={onContinue}
        disabled={!nextEnabled}
        className="mt-auto flex w-full items-center justify-center gap-2.5 text-[11.5px] font-medium uppercase tracking-[0.18em] transition-transform duration-300 hover:-translate-y-[1px]"
        style={{
          marginTop: 32,
          borderRadius: 4,
          paddingTop: 15,
          paddingBottom: 15,
          backgroundColor: "transparent",
          border: `1px solid ${nextEnabled ? "rgba(217,191,130,0.55)" : "rgba(217,191,130,0.22)"}`,
          color: nextEnabled ? S2_GOLD_SOFT : "rgba(231,211,164,0.40)",
          opacity: nextEnabled ? 1 : 0.7,
          cursor: nextEnabled ? "pointer" : "not-allowed",
        }}
      >
        Continue
        <ArrowRight size={15} strokeWidth={1.7} />
      </button>
    </aside>
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
      <BookingHeader
        background="transparent"
        currentStep={3}
        onStepGo={(s) => onStepGo(s as StepKey)}
        hideCurrentFlow="leisure"
      />


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

const S4_HERO = s4AuroraHeroImg.url;

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
    label: "Northern Lights",
    category: "Winter",
    img: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=900&q=80",
  },
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
  const [hoveredExp, setHoveredExp] = useState<Step4Exp | null>(null);

  const handleToggleExp = (label: string) => {
    if (!selected.has(label) && letUsRecommend) setLetUsRecommend(false);
    onToggle(label);
  };

  const S4_INK = "#12212E";
  const S4_MUTED = "rgba(18,33,46,0.60)";
  const S4_HAIR = "rgba(201,164,92,0.28)";
  const S4_GOLD = "#C9A45C";
  const S4_GOLD_LT = "#E3CB94";

  const summaryLines = (
    <div className="space-y-6">
      <div>
        <div
          className="text-[19px] font-medium text-white"
          style={{ fontFamily: SERIF }}
        >
          Selected Experiences
        </div>
        <div
          className="mt-3 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, rgba(232,199,117,0.55), rgba(232,199,117,0.12) 70%, transparent)",
          }}
        />
      </div>

      {selected.size === 0 ? (
        <div
          key={letUsRecommend ? "concierge" : "empty"}
          className="s4-sum-state flex min-h-[168px] flex-col items-center justify-center rounded-[16px] px-5 py-7 text-center"
          style={{
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(232,199,117,0.22)",
          }}
        >
          <Sparkles
            size={20}
            strokeWidth={1.6}
            className={letUsRecommend ? "s4-sum-sparkle" : undefined}
            style={{ color: S1_GOLD_SOFT, margin: "0 auto" }}
          />
          <div
            className="mt-3 text-[15px] text-white"
            style={{ fontFamily: SERIF }}
          >
            {letUsRecommend ? "Concierge Curation" : "Your itinerary"}
          </div>
          {!letUsRecommend && (
            <div
              className="mt-1.5 text-[12px] uppercase tracking-[0.16em]"
              style={{ color: "rgba(232,199,117,0.72)" }}
            >
              0 experiences selected
            </div>
          )}
          <div
            className="mt-2.5 text-[12px] leading-[1.6]"
            style={{ color: "rgba(245,241,230,0.55)" }}
          >
            {letUsRecommend
              ? "Our specialists will hand-pick the perfect experiences for your group."
              : "Choose experiences to personalise your group’s stay."}
          </div>
        </div>

      ) : (
        <div className="flex flex-col gap-2.5">
          {Array.from(selected).map((label) => {
            const exp = STEP4_EXPERIENCES.find((x) => x.label === label);
            return (
              <div
                key={label}
                className="s4-sum-row flex items-center gap-3 rounded-[14px] p-2.5 pr-3"
                style={{
                  background: "rgba(212,166,74,0.08)",
                  border: "1px solid rgba(232,199,117,0.26)",
                }}
              >
                {exp && (
                  <img
                    src={exp.img}
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-[10px] object-cover"
                    style={{ border: "1px solid rgba(232,199,117,0.30)" }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div
                    className="line-clamp-2 text-[13.5px] leading-[1.3] text-white"
                    style={{ fontFamily: SERIF }}
                  >
                    {label}
                  </div>
                  <div
                    className="mt-[3px] text-[10.5px] uppercase tracking-[0.14em]"
                    style={{ color: "rgba(232,199,117,0.66)" }}
                  >
                    {exp?.category ?? "Experience"} · ×1
                  </div>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${label}`}
                  onClick={() => onToggle(label)}
                  className="s4-sum-remove grid h-7 w-7 shrink-0 place-items-center rounded-full"
                  style={{
                    border: "1px solid rgba(232,199,117,0.30)",
                    color: "rgba(245,241,230,0.6)",
                  }}
                >
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            );
          })}
        </div>

      )}

      {(preferredDate || dateFlexible || additionalRequests.trim().length > 0) && (
        <div
          className="space-y-4 pt-5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}
        >
          {preferredDate && (
            <div className="flex items-start gap-3">
              <CalendarDays
                size={15}
                strokeWidth={1.8}
                style={{ color: S1_GOLD_SOFT, marginTop: 2 }}
              />
              <div>
                <div
                  className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "rgba(245,241,230,0.5)" }}
                >
                  Preferred date
                </div>
                <div className="mt-1 text-[13.5px] text-white">
                  {format(preferredDate, "PPP")}
                </div>
              </div>
            </div>
          )}
          {dateFlexible && (
            <div className="flex items-start gap-3">
              <Sparkles
                size={15}
                strokeWidth={1.8}
                style={{ color: S1_GOLD_SOFT, marginTop: 2 }}
              />
              <div>
                <div
                  className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "rgba(245,241,230,0.5)" }}
                >
                  Flexibility
                </div>
                <div className="mt-1 text-[13.5px] text-white">
                  Open to alternative dates
                </div>
              </div>
            </div>
          )}
          {additionalRequests.trim().length > 0 && (
            <div className="flex items-start gap-3">
              <Info
                size={15}
                strokeWidth={1.8}
                style={{ color: S1_GOLD_SOFT, marginTop: 2 }}
              />
              <div className="min-w-0">
                <div
                  className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "rgba(245,241,230,0.5)" }}
                >
                  Concierge notes
                </div>
                <div
                  className="mt-1 line-clamp-3 text-[13.5px] text-white"
                  style={{ lineHeight: 1.5 }}
                >
                  {additionalRequests.trim()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const recommended = STEP4_EXPERIENCES.find((e) => e.label === "Northern Lights")!;
  const recommendedActive = selected.has(recommended.label);

  const goldRule = (
    <div
      className="h-px w-full"
      style={{
        background:
          "linear-gradient(90deg, rgba(232,199,117,0.62), rgba(232,199,117,0.16) 62%, transparent)",
      }}
    />
  );

  return (
    <LeisureStepShell
      activeStep={4}
      onStepGo={onStepGo}
      hero={S4_HERO}
      chapter="CHAPTER IV"
      headline={null}
      subtext={null}
      hideHero
      wide
      ultraWide
    >
      <div
        className="relative grid grid-cols-1 items-stretch overflow-hidden rounded-[26px] lg:grid-cols-[24.9fr_54.6fr_20.5fr]"
        style={{
          background: "#F7F3EA",
          border: "1px solid rgba(201,164,92,0.30)",
          boxShadow:
            "0 60px 120px -55px rgba(6,16,26,0.72), 0 18px 44px -34px rgba(6,16,26,0.45)",
        }}
      >
        {/* ---------- HERO + CENTER + SUMMARY: one premium composition ---------- */}

          {/* ---------- LEFT HERO ---------- */}
          <aside className="relative order-2 min-h-[380px] overflow-hidden lg:order-none lg:overflow-visible">
            <img
              src={S4_HERO}
              alt="Northern lights over a fjord terrace with fire pit"
              className="absolute top-0 left-0 h-full w-full object-cover lg:w-[calc(100%+80px)]"
            />
            {hoveredExp && hoveredExp.label !== "Northern Lights" && (
              <img
                key={hoveredExp.label}
                src={hoveredExp.img}
                alt=""
                aria-hidden
                className="s4-hero-swap absolute top-0 left-0 h-full w-full object-cover lg:w-[calc(100%+80px)]"
              />
            )}
            {/* subtle navy readability veil (~22%) */}
            <div
              className="absolute top-0 left-0 h-full w-full lg:w-[calc(100%+80px)]"
              style={{ background: "rgba(8,19,31,0.22)" }}
            />
            <div
              className="absolute bottom-0 left-0 h-[52%] w-full lg:w-[calc(100%+80px)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(8,19,31,0) 0%, rgba(8,19,31,0.18) 55%, rgba(8,19,31,0.42) 100%)",
              }}
            />
            <div className="relative z-10 flex h-full flex-col justify-end p-9 lg:p-11">
              <div
                className="text-[11px] font-medium uppercase tracking-[0.30em]"
                style={{ color: S4_GOLD_LT, textShadow: "0 1px 8px rgba(4,12,20,0.7)" }}
              >
                Step 4 of 6
              </div>
              <h1
                className="mt-4 text-[40px] leading-[1.04] text-white lg:text-[46px]"
                style={{
                  fontFamily: SERIF,
                  fontWeight: 500,
                  textShadow: "0 2px 18px rgba(4,12,20,0.6)",
                }}
              >
                Experiences
              </h1>
              <div className="mt-5 flex items-center gap-2.5">
                <span
                  className="h-px w-[70px]"
                  style={{ background: `linear-gradient(90deg, ${S4_GOLD_LT}, transparent)` }}
                />
                <span
                  className="block h-[6px] w-[6px] rotate-45"
                  style={{ background: `linear-gradient(135deg, ${S4_GOLD_LT}, ${S4_GOLD})` }}
                />
              </div>
              <p
                className="mt-5 max-w-[300px] text-[15px] leading-[1.7]"
                style={{ color: "rgba(255,255,255,0.9)", textShadow: "0 1px 10px rgba(4,12,20,0.6)" }}
              >
                Create unforgettable moments for your group.
              </p>
            </div>
          </aside>


        {/* ---------- CENTER ---------- */}
        <section
          className="relative z-[2] order-1 min-w-0 px-7 py-9 sm:px-10 sm:py-10 lg:order-none lg:px-[54px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(247,243,234,0) 0%, rgba(245,241,231,0.12) 70px, rgba(243,239,227,0.5) 150px, rgba(243,239,227,0.86) 230px, rgba(243,239,227,0) 320px), radial-gradient(120% 80% at 50% 0%, #FBF8F1 0%, #F5F1E7 60%, #EFEADE 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8)",
            color: S4_INK,
          }}
        >


          <header className="text-center">
            <h2
              className="text-[32px] leading-[1.1] sm:text-[38px]"
              style={{ fontFamily: SERIF, color: S4_INK, fontWeight: 500 }}
            >
              Add experiences for your group
            </h2>
            <p className="mx-auto mt-2.5 max-w-[520px] text-[14px]" style={{ color: S4_MUTED }}>
              Make your stay truly memorable with unique activities and experiences.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <span
                className="h-px w-[100px]"
                style={{ background: `linear-gradient(90deg, transparent, ${S4_GOLD})` }}
              />
              <span
                className="block h-[7px] w-[7px] rotate-45"
                style={{ background: `linear-gradient(135deg, ${S4_GOLD_LT}, ${S4_GOLD})` }}
              />
              <span
                className="h-px w-[100px]"
                style={{ background: `linear-gradient(90deg, ${S4_GOLD}, transparent)` }}
              />
            </div>
          </header>

          {/* Category filters */}
          <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-3">
            {STEP4_CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className="s4-filter inline-flex items-center gap-2 rounded-[999px] px-[23px] py-[10.5px] text-[12.5px] font-medium"
                  style={{
                    background: active
                      ? "linear-gradient(180deg, #142536 0%, #08131F 100%)"
                      : "#F7F3EA",
                    color: active ? "#E7D3A7" : S4_INK,
                    border: `1px solid ${active ? "rgba(232,199,117,0.55)" : "rgba(201,164,92,0.22)"}`,
                    boxShadow: active
                      ? "inset 0 1px 0 rgba(255,255,255,0.07), 0 0 0 3px rgba(201,164,92,0.10), 0 10px 24px -18px rgba(8,19,31,0.7)"
                      : "0 4px 12px -10px rgba(8,19,31,0.30)",
                    letterSpacing: "0.015em",
                  }}

                >
                  <Sparkles
                    size={12.5}
                    strokeWidth={2}
                    style={{ color: active ? S4_GOLD_LT : "rgba(201,164,92,0.85)" }}
                  />
                  {c === "All" ? "All Experiences" : c}
                </button>
              );
            })}
          </div>

          {/* Experience grid — two rows tall, scrolls beyond */}
          <div className="relative mt-7">
            <div
              className="s4-scroll grid grid-cols-1 items-stretch gap-x-5 gap-y-7 overflow-y-auto pb-6 pr-1 sm:grid-cols-2 xl:grid-cols-3"
              style={{ maxHeight: 470 }}
            >
            {filtered.map((e) => {
              const active = selected.has(e.label);
              const featured = e.label === "Northern Lights";
              return (
                <button
                  key={e.label}
                  type="button"
                  onClick={() => handleToggleExp(e.label)}
                  onMouseEnter={() => setHoveredExp(e)}
                  onMouseLeave={() =>
                    setHoveredExp((cur) => (cur?.label === e.label ? null : cur))
                  }
                  className={`s4-card group relative flex cursor-pointer flex-col overflow-hidden rounded-[22px] text-left ${active ? "s4-selected" : ""} ${featured ? "s4-featured" : ""}`}
                  style={{
                    background: featured
                      ? "linear-gradient(180deg, #FBF9F5 0%, #F7F4EE 55%, #F3EFE7 100%)"
                      : "linear-gradient(180deg, #F8F5EF 0%, #F5F1EB 55%, #F1ECE3 100%)",
                    border: `1px solid ${active ? S4_GOLD : "rgba(214,196,163,0.55)"}`,
                    boxShadow: active
                      ? "0 14px 32px -20px rgba(201,164,92,0.45), 0 3px 10px -6px rgba(18,33,46,0.10)"
                      : "0 12px 28px -20px rgba(18,33,46,0.20), 0 2px 8px -6px rgba(18,33,46,0.08)",
                  }}
                >
                  <div
                    className="s4-card-media relative w-full overflow-hidden"
                    style={{ height: 172, borderRadius: "21px 21px 0 0" }}
                  >
                    <img
                      src={e.img}
                      alt={e.label}
                      className="s4-card-img h-full w-full object-cover"
                    />
                    {featured && (
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(70% 55% at 50% 22%, rgba(255,240,210,0.20) 0%, rgba(255,240,210,0.07) 45%, transparent 75%)",
                        }}
                      />
                    )}
                    <div
                      className="s4-card-overlay pointer-events-none absolute inset-x-0 bottom-0"
                      style={{
                        height: "38%",
                        background:
                          "linear-gradient(180deg, rgba(8,19,31,0) 0%, rgba(8,19,31,0.30) 100%)",
                      }}
                    />
                    {featured && (
                      <span
                        className="absolute left-4 top-4 rounded-full px-[7px] py-[2px] text-[7px] font-normal uppercase tracking-[0.22em]"
                        style={{
                          background: "rgba(10,20,32,0.34)",
                          border: "1px solid rgba(226,203,148,0.28)",
                          color: "rgba(236,220,186,0.88)",
                          backdropFilter: "blur(5px)",
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>

                  <div
                    className="flex flex-1 items-center justify-between gap-5 px-[24px]"
                    style={{
                      paddingTop: featured ? 13 : 22,
                      paddingBottom: featured ? 20 : 20,
                    }}
                  >

                    <div className="min-w-0">
                      <div
                        className="s4-card-title"
                        style={{
                          fontFamily: SERIF,
                          fontSize: 20.5,
                          fontWeight: 500,
                          lineHeight: 1.2,
                          letterSpacing: "0.005em",
                          color: "#1F2328",
                        }}
                      >
                        {e.label}
                      </div>
                      <div
                        className="s4-card-cat mt-[9px] text-[11px] uppercase leading-[1.4]"
                        style={{
                          color: "rgba(45,48,52,0.52)",
                          letterSpacing: "0.14em",
                        }}
                      >
                        {e.category}
                      </div>
                    </div>
                    <span
                      className={`s4-plus ${active ? "s4-plus-active" : ""} grid h-10 w-10 shrink-0 place-items-center rounded-full`}
                      style={{
                        background: active
                          ? `linear-gradient(135deg, ${S4_GOLD_LT} 0%, ${S4_GOLD} 70%)`
                          : "linear-gradient(180deg, #FCFAF6 0%, #F5F1EB 100%)",
                        border: `1px solid ${active ? S4_GOLD : "rgba(197,162,75,0.50)"}`,
                        color: active ? "#FFFFFF" : S4_GOLD,
                        boxShadow: "0 2px 8px -4px rgba(18,33,46,0.12)",
                      }}
                    >
                      {active ? (
                        <Check size={14} strokeWidth={2.6} />
                      ) : (
                        <Plus size={15} strokeWidth={1.6} />
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
            </div>
            {/* elegant catalogue fade instead of a scrollbar */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-[68px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(243,238,228,0) 0%, rgba(243,238,228,0.72) 55%, #F1ECE0 100%)",
              }}
            />
          </div>


          {/* Special Requests */}
          <div
            className="mt-7 rounded-[18px] p-6"
            style={{
              background: "rgba(255,255,255,0.66)",
              border: `1px solid ${S4_HAIR}`,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <h3
              className="text-[20px]"
              style={{ fontFamily: SERIF, color: S4_INK, fontWeight: 500 }}
            >
              Special Requests or Questions?
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: S4_MUTED }}>
              Have any requests, accessibility needs or questions? Let us know and we&apos;ll do
              our best to arrange everything for your group.
            </p>
            <textarea
              value={additionalRequests}
              onChange={(ev) => setAdditionalRequests(ev.target.value)}
              placeholder="Tell us anything you'd like us to know..."
              className="s5-input mt-4 w-full resize-none rounded-[14px] px-4 py-3.5 text-[14px] outline-none transition-all duration-200 focus:border-[#C9A45C] focus:ring-4 focus:ring-[rgba(201,164,92,0.12)]"
              style={{
                background: "#FFFDF8",
                color: S4_INK,
                border: `1px solid ${S4_HAIR}`,
                height: 120,
              }}
            />

            {/* Preferred date + flexibility + concierge (functionality preserved) */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => dateInputRef.current?.showPicker?.()}
                className="inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 text-left text-[13px] font-medium transition-all hover:-translate-y-[1px]"
                style={{
                  background: "#FFFDF8",
                  border: `1px solid ${S4_HAIR}`,
                  color: preferredDate ? S4_INK : S4_MUTED,
                }}
              >
                <CalendarDays size={15} style={{ color: S4_GOLD }} />
                {preferredDate ? format(preferredDate, "PPP") : "Preferred date"}
              </button>
              <input
                ref={dateInputRef}
                type="date"
                className="sr-only"
                value={preferredDate ? format(preferredDate, "yyyy-MM-dd") : ""}
                onChange={(ev) => {
                  const v = ev.target.value;
                  setPreferredDate(v ? new Date(v) : undefined);
                }}
              />
              <label
                className="inline-flex cursor-pointer items-center gap-2 text-[13px]"
                style={{ color: S4_INK }}
              >
                <span
                  className="grid h-[18px] w-[18px] place-items-center rounded-[5px] transition-colors"
                  style={{
                    backgroundColor: dateFlexible ? S4_GOLD : "#FFFDF8",
                    border: `1.5px solid ${dateFlexible ? S4_GOLD : "rgba(18,33,46,0.25)"}`,
                  }}
                >
                  {dateFlexible && <Check size={11} strokeWidth={3} style={{ color: "#FFF" }} />}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={dateFlexible}
                  onChange={(ev) => setDateFlexible(ev.target.checked)}
                />
                Flexible with dates
              </label>
              <button
                type="button"
                onClick={() => setLetUsRecommend(!letUsRecommend)}
                className="s4-surprise ml-auto inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-300 hover:-translate-y-[1px]"
                style={{
                  background: letUsRecommend
                    ? `linear-gradient(135deg, ${S4_GOLD_LT} 0%, ${S4_GOLD} 70%)`
                    : "transparent",
                  color: letUsRecommend ? "#12212E" : "#A8823C",
                  border: `1px solid ${letUsRecommend ? S4_GOLD : "rgba(201,164,92,0.5)"}`,
                }}
              >
                {letUsRecommend ? "We'll surprise you" : "Surprise me"}
                <ArrowRight size={15} strokeWidth={2} className="s4-surprise-icon" />
              </button>
            </div>
          </div>

          {/* Bottom nav */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2.5 rounded-[14px] px-8 py-[14px] text-[13px] font-medium uppercase tracking-[0.14em] transition-all hover:-translate-y-[1px]"
              style={{
                background: "rgba(255,255,255,0.78)",
                color: S4_INK,
                border: `1px solid ${S4_HAIR}`,
              }}
            >
              <ArrowLeft size={16} strokeWidth={2} style={{ color: S4_GOLD }} />
              Back
            </button>
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center gap-2.5 rounded-[14px] px-10 py-[14px] text-[13px] font-medium uppercase tracking-[0.14em] transition-all hover:-translate-y-[1px]"
              style={{
                background: "linear-gradient(180deg, #16293C 0%, #0B1826 100%)",
                color: "#F6EFDF",
                border: "1px solid rgba(232,199,117,0.4)",
                boxShadow: "0 22px 44px -22px rgba(8,19,31,0.8)",
              }}
            >
              Next
              <ArrowRight size={17} strokeWidth={2} style={{ color: S4_GOLD_LT }} />
            </button>
          </div>
        </section>

        {/* ---------- RIGHT SUMMARY: right column of the same container ---------- */}
        <div className="order-3 min-w-0 lg:order-none">
          <aside
            className="flex h-full flex-col px-[38px] pb-[44px] pt-[40px] sm:px-[42px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(16,32,50,0.98) 0%, rgba(8,19,31,0.98) 100%)",
              borderLeft: "1px solid rgba(226,203,148,0.20)",
            }}
          >

            <div className="text-[19px] font-medium text-white" style={{ fontFamily: SERIF }}>
              Your Request
            </div>
            <div className="mt-3">{goldRule}</div>

            <div className="mt-5 flex items-center gap-3">
              <ShieldCheck size={15} strokeWidth={1.8} style={{ color: S1_GOLD_SOFT }} />
              <span className="text-[13px]" style={{ color: "rgba(245,241,230,0.8)" }}>
                Free &amp; non-binding request
              </span>
            </div>

            <div className="mt-8">{summaryLines}</div>

            <div className="mt-9">
              <div className="text-[16px] text-white" style={{ fontFamily: SERIF }}>
                Recommended for your group
              </div>
              <div className="mt-3">{goldRule}</div>
              <button
                type="button"
                onClick={() => handleToggleExp(recommended.label)}
                className="mt-4 flex w-full items-center gap-3.5 rounded-[16px] px-4 py-3.5 text-left transition-all hover:-translate-y-[1px]"
                style={{
                  background: "rgba(255,255,255,0.035)",
                  border: `1px solid ${recommendedActive ? "rgba(226,203,148,0.55)" : "rgba(226,203,148,0.20)"}`,
                }}
              >
                <img
                  src={recommended.img}
                  alt={recommended.label}
                  className="h-[52px] w-[52px] flex-shrink-0 rounded-[10px] object-cover"
                />
                <div className="min-w-0">
                  <div className="truncate text-[13.5px] text-white">{recommended.label}</div>
                  <div
                    className="mt-1 text-[11.5px] italic leading-[1.45]"
                    style={{ color: "rgba(245,241,230,0.6)" }}
                  >
                    An unforgettable once-in-a-lifetime experience
                  </div>
                </div>
              </button>
            </div>
          </aside>
        </div>

      </div>
    </LeisureStepShell>
  );
}


/* =========================================================
   STEP 5 - Contact (redesigned)
   ========================================================= */

const S5_HERO =
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1600&q=80";

const S5_PANEL_IMAGE = s5BlackGoldHero.url;


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

const S5_COUNTRIES: { code: string; name: string }[] = [
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "CA", name: "Canada" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IS", name: "Iceland" },
  { code: "IE", name: "Ireland" },
  { code: "IT", name: "Italy" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "ES", name: "Spain" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "Other", name: "Other" },
];

const S5_SHELL = "#0B1624";
const S5_FIELD = "#08111C";
const S5_GOLD = "#C9A45C";
const S5_GOLD_LIGHT = "#E7C878";
const S5_BORDER = "rgba(201,164,92,0.22)";
const S5_PLACEHOLDER = "rgba(226,218,200,0.42)";

function S5FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label
      className="mb-1.5 block text-[10.5px] font-medium uppercase tracking-[0.22em]"
      style={{ color: "rgba(245,241,230,0.72)" }}
    >
      {children}
      {optional && (
        <span className="ml-2 text-[10px] font-normal tracking-[0.18em]" style={{ color: "rgba(245,241,230,0.34)" }}>
          (OPTIONAL)
        </span>
      )}
    </label>
  );
}

const s5FieldStyle = (focused: boolean): React.CSSProperties => ({
  backgroundColor: S5_FIELD,
  color: "#F5F1E6",
  border: `1px solid ${focused ? "rgba(201,164,92,0.75)" : S5_BORDER}`,
  boxShadow: focused
    ? "0 0 0 3px rgba(201,164,92,0.12), 0 12px 30px -22px rgba(201,164,92,0.6)"
    : "inset 0 1px 0 rgba(255,255,255,0.02)",
  transition: "all 250ms ease",
});

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
      className="s5-input h-[50px] w-full rounded-[12px] px-5 text-[14.5px] outline-none"
      style={s5FieldStyle(focused)}
    />
  );
}

/* Decorative flowing champagne lines + geometric mark for the left panel */
function S5Decoration() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 select-none" aria-hidden>
      <svg
        viewBox="0 0 420 300"
        className="block h-[240px] w-full"
        preserveAspectRatio="none"
        fill="none"
        style={{ opacity: 0.55 }}
      >
        <g stroke={S5_GOLD} strokeWidth="0.6" opacity="0.55">
          {Array.from({ length: 16 }).map((_, i) => (
            <path
              key={i}
              d={`M -40 ${300 - i * 6} C 90 ${250 - i * 11}, 170 ${300 - i * 15}, 300 ${170 - i * 4} S 420 ${250 - i * 6}, 470 ${300 - i * 3}`}
              opacity={0.18 + i * 0.035}
            />
          ))}
        </g>
      </svg>
      <div className="absolute left-2 top-0 -translate-y-[85%]">
        <svg width="92" height="92" viewBox="0 0 100 100" fill="none" style={{ opacity: 0.6 }}>
          <g stroke={S5_GOLD} strokeWidth="0.8">
            <circle cx="50" cy="50" r="26" />
            <rect x="26" y="26" width="48" height="48" transform="rotate(45 50 50)" />
            <rect x="30" y="30" width="40" height="40" />
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 4;
              return (
                <line
                  key={i}
                  x1={50 + Math.cos(a) * 6}
                  y1={50 + Math.sin(a) * 6}
                  x2={50 + Math.cos(a) * 22}
                  y2={50 + Math.sin(a) * 22}
                />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
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
  contactCountry,
  setContactCountry,

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
  contactCountry?: string;
  setContactCountry?: (v: string) => void;
  canContinue: boolean;
  onNext: () => void;
  onBack: () => void;
  onStepGo: (s: StepKey) => void;
}) {
  const [dialCode, setDialCode] = useState("+47");
  const [localCountry, setLocalCountry] = useState("");
  const country = contactCountry ?? localCountry;
  const setCountry = setContactCountry ?? setLocalCountry;
  const [commentsFocused, setCommentsFocused] = useState(false);

  const { session, profile } = useAuth();
  const [prefilled, setPrefilled] = useState(false);
  const [saveToProfile, setSaveToProfile] = useState(false);
  const canPrefill = hasProfileDetails(profile);
  const profileComplete = isProfileComplete(profile);

  const dial = PHONE_COUNTRIES.find((p) => p.dial === dialCode) ?? PHONE_COUNTRIES[0];

  const applyAccountDetails = () => {
    if (!profile) return;
    const hasTyped =
      firstName.trim() || lastName.trim() || email.trim() || phone.trim() || organisation.trim();
    if (hasTyped && !prefilled) {
      const ok = window.confirm(
        "Replace the contact details you have already entered with your account details?",
      );
      if (!ok) return;
    }
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
    setEmail(profile.email || session?.user.email || "");
    if (profile.phone) {
      const match = PHONE_COUNTRIES.find((p) => profile.phone!.trim().startsWith(p.dial));
      if (match) {
        setDialCode(match.dial);
        setPhone(profile.phone.trim().slice(match.dial.length).trim());
      } else {
        setPhone(profile.phone);
      }
    }
    setOrganisation(profile.company_name ?? "");
    if (profile.country) {
      const c = S5_COUNTRIES.find(
        (x) =>
          x.code.toLowerCase() === profile.country!.trim().toLowerCase() ||
          x.name.toLowerCase() === profile.country!.trim().toLowerCase(),
      );
      if (c) setCountry(c.code);
    }
    setPrefilled(true);
  };

  const handleContinue = () => {
    if (session && saveToProfile) {
      const countryName = S5_COUNTRIES.find((c) => c.code === country)?.name ?? country;
      void upsertProfile(session.user.id, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim() || session.user.email || "",
        phone: phone.trim() ? `${dialCode} ${phone.trim()}` : null,
        company_name: organisation.trim() || null,
        country: countryName || null,
      });
    }
    onNext();
  };


  return (
    <LeisureStepShell
      activeStep={5}
      onStepGo={onStepGo}
      hideHero
      wide
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
        className="mx-auto w-full max-w-[1450px] overflow-hidden rounded-[24px]"
        style={{
          backgroundColor: S5_SHELL,
          border: `1px solid ${S5_BORDER}`,
          boxShadow: "0 50px 110px -50px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[24%_76%]">
          {/* ---------- LEFT: editorial ---------- */}
          <div
            className="relative flex min-h-[300px] flex-col justify-start overflow-hidden px-[34px] py-[36px] lg:min-h-full"
            style={{ borderRight: `1px solid ${S5_BORDER}` }}
          >
            <img
              src={S5_PANEL_IMAGE}
              alt="Matte black architectural wall with champagne gold light strip and gold branch arrangement"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "58% 78%" }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(6,10,16,0.28) 0%, rgba(6,10,16,0.12) 30%, rgba(6,10,16,0) 60%)",
              }}
            />
            <div className="relative z-10 max-w-[230px]">
              <div
                className="text-[10.5px] font-medium uppercase tracking-[0.38em]"
                style={{ color: S5_GOLD }}
              >
                Chapter V
              </div>
              <h1
                className="mt-4 text-[32px] leading-[1.07] font-medium text-white lg:text-[36px]"
                style={{ fontFamily: SERIF }}
              >
                Who should<br />we write to?
              </h1>
              <div
                className="mt-5 h-px w-[62px]"
                style={{ background: `linear-gradient(90deg, ${S5_GOLD}, rgba(201,164,92,0))` }}
              />
              <p
                className="mt-5 max-w-[240px] text-[14px] leading-[1.6]"
                style={{ color: "rgba(240,235,224,0.62)" }}
              >
                We'll send tailored offers to this person.
              </p>
            </div>
          </div>


          {/* ---------- RIGHT: form ---------- */}
          <div className="px-7 py-8 sm:px-10 lg:px-12 lg:py-9">
            <h2
              className="text-[28px] leading-tight font-medium text-white lg:text-[31px]"
              style={{ fontFamily: SERIF }}
            >
              Step 5 – Contact
            </h2>
            <p className="mt-1.5 text-[13.5px]" style={{ color: "rgba(240,235,224,0.55)" }}>
              Who should we contact?
            </p>

            {session && (
              <div
                className="mt-5 flex flex-col gap-3 rounded-[14px] px-5 py-3 sm:h-[64px] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-0"
                style={{
                  backgroundColor: "rgba(8,17,28,0.75)",
                  border: `1px solid ${S5_BORDER}`,
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <User size={20} strokeWidth={1.6} className="shrink-0" style={{ color: S5_GOLD }} />
                  <div className="min-w-0">
                    <p
                      className="text-[13.5px] font-medium leading-tight"
                      style={{ color: S5_GOLD_LIGHT, fontFamily: SERIF }}
                    >
                      {canPrefill ? "Use your account details" : "Complete your profile"}
                    </p>
                    <p
                      className="mt-0.5 truncate text-[12.5px] leading-tight"
                      style={{ color: "rgba(240,235,224,0.55)" }}
                    >
                      {canPrefill
                        ? "Fill the form using your HotelGroupBook profile."
                        : "Add your details once and reuse them — or just fill in the form below."}
                    </p>
                  </div>
                </div>
                {canPrefill ? (
                  prefilled ? (
                    <span
                      className="shrink-0 text-[12.5px] font-medium tracking-[0.06em]"
                      style={{ color: S5_GOLD }}
                    >
                      ✓ Account details added
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={applyAccountDetails}
                      className="shrink-0 rounded-[10px] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em]"
                      style={{
                        background:
                          "linear-gradient(180deg, #EBD08A 0%, #D3B063 48%, #B58F42 100%)",
                        color: "#1B1408",
                        boxShadow: "0 12px 26px -16px rgba(201,164,92,0.7), inset 0 1px 0 rgba(255,255,255,0.45)",
                        transition: "all 250ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      Use my account details
                    </button>
                  )
                ) : (
                  <Link
                    to="/account"
                    className="shrink-0 rounded-[10px] px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.16em] transition-all duration-[250ms] hover:-translate-y-[2px]"
                    style={{ border: `1px solid rgba(201,164,92,0.5)`, color: S5_GOLD_LIGHT }}
                  >
                    Complete profile
                  </Link>
                )}
              </div>
            )}

            {/* Fields grid: 20px column gap / 16px row gap */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2" style={{ columnGap: 20, rowGap: 16 }}>
              <div>
                <S5FieldLabel>First Name</S5FieldLabel>
                <S5Input value={firstName} onChange={setFirstName} placeholder="Enter first name" />
              </div>
              <div>
                <S5FieldLabel>Last Name</S5FieldLabel>
                <S5Input value={lastName} onChange={setLastName} placeholder="Enter last name" />
              </div>

              <div>
                <S5FieldLabel>Email</S5FieldLabel>
                <S5Input value={email} onChange={setEmail} placeholder="Enter email address" type="email" />
              </div>
              <div>
                <S5FieldLabel>Phone</S5FieldLabel>
                <div
                  className="flex h-[50px] items-stretch overflow-hidden rounded-[12px]"
                  style={s5FieldStyle(false)}
                >
                  <div
                    className="relative flex items-center gap-2 pl-5 pr-3"
                    style={{ borderRight: `1px solid ${S5_BORDER}` }}
                  >
                    <span className="text-[17px] leading-none">{dial.flag}</span>
                    <span className="text-[13.5px] font-medium tracking-[0.04em]" style={{ color: "#F5F1E6" }}>
                      {dial.dial}
                    </span>
                    <ChevronDown size={14} style={{ color: S5_GOLD }} />
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
                    placeholder="Enter number"
                    className="s5-input flex-1 bg-transparent px-5 text-[14.5px] outline-none"
                    style={{ color: "#F5F1E6" }}
                  />
                </div>
              </div>

              <div>
                <S5FieldLabel optional>Organisation / Group Name</S5FieldLabel>
                <S5Input
                  value={organisation}
                  onChange={setOrganisation}
                  placeholder="Enter organisation or group name"
                />
              </div>
              <div>
                <S5FieldLabel optional>Country (Optional)</S5FieldLabel>
                <div className="relative h-[50px] rounded-[12px]" style={s5FieldStyle(false)}>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="h-full w-full cursor-pointer appearance-none bg-transparent px-5 pr-12 text-[14.5px] outline-none"
                    style={{ color: country ? "#F5F1E6" : S5_PLACEHOLDER }}
                  >
                    <option value="" style={{ color: "#000" }}>
                      Select country
                    </option>
                    {S5_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} style={{ color: "#000" }}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={18}
                    className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2"
                    style={{ color: S5_GOLD }}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <S5FieldLabel optional>Additional Comments</S5FieldLabel>
                <textarea
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  onFocus={() => setCommentsFocused(true)}
                  onBlur={() => setCommentsFocused(false)}
                  placeholder="Let us know anything we should know…"
                  rows={4}
                  className="s5-input w-full resize-y rounded-[12px] px-5 py-3 text-[14.5px] leading-relaxed outline-none"
                  style={{ ...s5FieldStyle(commentsFocused), height: 120, minHeight: 120 }}
                />
              </div>
            </div>

            {session && !profileComplete && (
              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={saveToProfile}
                  onChange={(e) => setSaveToProfile(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#C9A45C]"
                />
                <span className="text-[13px]" style={{ color: "rgba(240,235,224,0.65)" }}>
                  Save these details to my HotelGroupBook profile
                </span>
              </label>
            )}

            {/* Footer row: back / reassurance / continue */}
            <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex shrink-0 items-center gap-2.5 text-[14.5px] transition-all duration-[250ms] hover:opacity-80"
                style={{ color: S5_GOLD }}
              >
                <ArrowLeft size={16} strokeWidth={2} />
                Back
              </button>

              <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center">
                <div className="flex items-center gap-2 text-[13px]">
                  <ShieldCheck size={15} strokeWidth={1.8} style={{ color: S5_GOLD }} />
                  <span style={{ color: S5_GOLD }}>Your request is free and non-binding.</span>
                </div>
                <div className="text-[12px]" style={{ color: "rgba(240,235,224,0.42)" }}>
                  We find the best hotel options so you can choose what suits your group.
                </div>
              </div>

              <button
                type="button"
                onClick={handleContinue}
                disabled={!canContinue}
                className="inline-flex shrink-0 items-center gap-3 rounded-[14px] px-8 py-[15px] text-[12.5px] font-semibold uppercase tracking-[0.18em] transition-all duration-[250ms] hover:-translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
                style={{
                  background: "linear-gradient(180deg, #EBD08A 0%, #D3B063 48%, #B58F42 100%)",
                  color: "#1B1408",
                  boxShadow:
                    "0 22px 48px -20px rgba(201,164,92,0.75), inset 0 1px 0 rgba(255,255,255,0.45)",
                }}
              >
                Continue to review
                <ArrowRight size={17} strokeWidth={2.2} />
              </button>
            </div>
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

function S6ReviewRow({
  icon,
  label,
  primary,
  secondary = [],
  onEdit,
}: {
  icon: React.ReactNode;
  label: string;
  primary: string;
  secondary?: string[];
  onEdit: () => void;
}) {
  return (
    <div
      className="flex items-start gap-7 px-[6px] py-[46px]"
      style={{
        borderBottom: "1px solid rgba(163,150,131,0.16)",
      }}
    >
      <span
        className="relative grid h-[39px] w-[39px] shrink-0 place-items-center rounded-full"
        style={{
          border: "1px solid rgba(176,141,63,0.55)",
          background: "transparent",
          color: "#B08D3F",
        }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div
          className="text-[9.8px] font-medium uppercase tracking-[0.3em]"
          style={{ color: "#B08D3F" }}
        >
          {label}
        </div>
        <div
          className="mt-3 text-[17.5px] font-medium leading-[1.4]"
          style={{ color: "#1F2328" }}
        >
          {primary}
        </div>
        {secondary.map((line) => (
          <div
            key={line}
            className="mt-1.5 text-[12.5px] font-normal leading-[1.6]"
            style={{ color: "rgba(70,74,80,0.62)" }}
          >
            {line}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="s6-edit-link mt-[18px] inline-flex shrink-0 items-center gap-2.5 text-[12.5px] font-normal"
      >
        Edit
        <ChevronRight className="s6-edit-arrow" size={13} strokeWidth={1.3} />
      </button>
    </div>
  );
}
