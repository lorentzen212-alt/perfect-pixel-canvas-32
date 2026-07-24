import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
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
} from "lucide-react";

import { cn } from "@/lib/utils";

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
  NO: ["Bergen", "Oslo", "Lofoten", "Tromsø", "Stavanger", "Trondheim", "Geiranger", "Ålesund"],
  SE: ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Kiruna", "Umeå"],
  DK: ["Copenhagen", "Aarhus", "Odense", "Aalborg"],
  FI: ["Helsinki", "Tampere", "Rovaniemi", "Turku", "Oulu"],
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

  // Step 2 - Rooms
  const [rooms, setRooms] = useState<Record<string, number>>({
    single: 4,
    twin: 10,
    double: 8,
    triple: 2,
    family: 2,
    accessible: 0,
  });
  const [earlyCheckin, setEarlyCheckin] = useState(false);
  const [lateCheckout, setLateCheckout] = useState(false);
  const [connectingRooms, setConnectingRooms] = useState(false);
  const [roomNotes, setRoomNotes] = useState("");

  // Step 3 - Extras
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [extrasComments, setExtrasComments] = useState("");
  const [recommendExtras, setRecommendExtras] = useState(true);

  // Step 4 - Experiences
  const [expCategory, setExpCategory] = useState("All");
  const [selectedExps, setSelectedExps] = useState<Set<string>>(new Set());
  const [letUsRecommend, setLetUsRecommend] = useState(false);

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

  const totalRooms = Object.values(rooms).reduce((a, b) => a + b, 0);
  const roomCount = (k: string) => rooms[k] ?? 0;
  const setRoom = (k: string, v: number) =>
    setRooms((r) => ({ ...r, [k]: Math.max(0, v) }));

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
        preferredHotel,
        earlyCheckin,
        lateCheckout,
        connectingRooms,
        roomNotes,
        specialRequests: Array.from(selectedExtras),
        experiences: Array.from(selectedExps),
        letUsRecommend,
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
        rooms={rooms}
        setRoom={setRoom}
        totalRooms={totalRooms}
        earlyCheckin={earlyCheckin}
        setEarlyCheckin={setEarlyCheckin}
        lateCheckout={lateCheckout}
        setLateCheckout={setLateCheckout}
        connectingRooms={connectingRooms}
        setConnectingRooms={setConnectingRooms}
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
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[minmax(0,34fr)_minmax(0,66fr)]">
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
                setRoom={setRoom}
                totalRooms={totalRooms}
                earlyCheckin={earlyCheckin}
                setEarlyCheckin={setEarlyCheckin}
                lateCheckout={lateCheckout}
                setLateCheckout={setLateCheckout}
                connectingRooms={connectingRooms}
                setConnectingRooms={setConnectingRooms}
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
const S1_NAVY_SOFT = "#0E1D2E";
const S1_GOLD = "#D4A64A";
const S1_GOLD_SOFT = "#E8C775";
const S1_BORDER = "rgba(212,166,74,0.28)";
const S1_BORDER_SOFT = "rgba(255,255,255,0.08)";

const S1_HERO =
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";

const NORWAY_TILES: { name: string; img: string }[] = [
  { name: "Bergen", img: "https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?auto=format&fit=crop&w=800&q=80" },
  { name: "Oslo", img: "https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?auto=format&fit=crop&w=800&q=80" },
  { name: "Lofoten", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80" },
  { name: "Tromsø", img: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=800&q=80" },
  { name: "Stavanger", img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80" },
  { name: "Trondheim", img: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=800&q=80" },
  { name: "Geiranger", img: "https://images.unsplash.com/photo-1502786129293-79981df4e689?auto=format&fit=crop&w=800&q=80" },
];

const COUNTRY_FLAG_EMOJI: Record<CountryCode, string> = {
  NO: "🇳🇴",
  SE: "🇸🇪",
  DK: "🇩🇰",
  FI: "🇫🇮",
};

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
  const countryName = COUNTRIES.find((c) => c.code === country)!.name;
  const tiles =
    country === "NO"
      ? NORWAY_TILES
      : CITIES[country].slice(0, 7).map((n) => ({
          name: n,
          img: `https://source.unsplash.com/featured/600x400/?${encodeURIComponent(
            n + " " + countryName,
          )}`,
        }));

  return (
    <main
      className="min-h-screen w-full"
      style={{
        backgroundColor: S1_NAVY,
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#F5F1E6",
      }}
    >
      {/* Top bar: logo + step tracker */}
      <header
        className="w-full"
        style={{ borderBottom: `1px solid ${S1_BORDER_SOFT}` }}
      >
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-7">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div
              className="grid h-11 w-11 place-items-center rounded-[10px]"
              style={{
                background: `linear-gradient(135deg, ${S1_GOLD_SOFT}, ${S1_GOLD})`,
                color: S1_NAVY,
                fontFamily: SERIF,
              }}
            >
              <span className="text-[16px] font-semibold leading-none tracking-wide">HGB</span>
            </div>
            <div className="leading-tight">
              <div
                style={{ fontFamily: SERIF, color: "#F5F1E6" }}
                className="text-[19px] font-medium"
              >
                HotelGroupBook
              </div>
              <div
                className="text-[11px] tracking-[0.14em]"
                style={{ color: "rgba(245,241,230,0.55)" }}
              >
                Group journeys, made simple
              </div>
            </div>
          </Link>

          {/* Step tracker */}
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 lg:gap-x-3">
            {[1, 2, 3, 4, 5, 6].map((n, i) => {
              const active = n === 1;
              return (
                <li key={n} className="flex items-center gap-2 lg:gap-3">
                  <button
                    type="button"
                    onClick={() => onStepGo(n as StepKey)}
                    className="flex flex-col items-center gap-1.5"
                  >
                    <span
                      className="grid h-8 w-8 place-items-center rounded-full text-[13px] font-semibold transition-all"
                      style={{
                        background: active
                          ? `linear-gradient(135deg, ${S1_GOLD_SOFT}, ${S1_GOLD})`
                          : "transparent",
                        color: active ? S1_NAVY : "rgba(245,241,230,0.55)",
                        border: `1px solid ${active ? S1_GOLD : "rgba(245,241,230,0.22)"}`,
                        boxShadow: active
                          ? "0 6px 18px -8px rgba(212,166,74,0.55)"
                          : "none",
                      }}
                    >
                      {n}
                    </span>
                    <span
                      className="text-[11.5px] tracking-wide"
                      style={{
                        color: active ? S1_GOLD_SOFT : "rgba(245,241,230,0.55)",
                        fontWeight: active ? 600 : 500,
                      }}
                    >
                      {STEP_META[n as StepKey].title}
                    </span>
                  </button>
                  {i < 5 && (
                    <span
                      className="mt-[-14px] hidden h-px w-8 lg:block xl:w-14"
                      style={{ backgroundColor: "rgba(245,241,230,0.18)" }}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      {/* Layout */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[minmax(0,34fr)_minmax(0,66fr)] lg:gap-10 lg:px-10 lg:py-12">
        {/* LEFT HERO */}
        <aside
          className="relative overflow-hidden rounded-[24px] min-h-[520px] lg:min-h-[820px]"
          style={{
            border: `1px solid ${S1_BORDER_SOFT}`,
            boxShadow: "0 40px 80px -40px rgba(0,0,0,0.6)",
          }}
        >
          <img
            src={S1_HERO}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(8,19,31,0.35) 0%, rgba(8,19,31,0.48) 55%, rgba(8,19,31,0.86) 100%)",
            }}
          />
          <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between p-8 sm:p-10 lg:min-h-[820px] lg:p-12">
            <div>
              <div
                className="text-[11px] font-medium tracking-[0.32em]"
                style={{ color: S1_GOLD_SOFT }}
              >
                CHAPTER I
              </div>
              <h1
                className="mt-6 text-[42px] sm:text-[52px] lg:text-[60px] leading-[1.02] font-medium text-white"
                style={{ fontFamily: SERIF }}
              >
                Where will<br />your group<br />adventure begin?
              </h1>
              <p
                className="mt-6 max-w-[360px] text-[15.5px] leading-relaxed"
                style={{ color: "rgba(255,255,255,0.82)" }}
              >
                Tell us your destination<br />and hotel preferences.
              </p>
            </div>

            <ul className="space-y-3.5 pt-8">
              {["One request.", "Multiple offers.", "The perfect trip."].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-3 text-[15px] text-white/95"
                >
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
          </div>
        </aside>

        {/* RIGHT PANEL */}
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
            Step 1 – Destination
          </h2>
          <p
            className="mt-2 text-[14.5px]"
            style={{ color: "rgba(245,241,230,0.62)" }}
          >
            Where would you like to host your group trip?
          </p>

          {/* Country selector */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {COUNTRIES.map((c) => {
              const active = c.code === country;
              return (
                <button
                  key={c.code}
                  onClick={() => setCountry(c.code)}
                  className="flex items-center justify-center gap-2.5 rounded-[14px] px-4 py-3.5 text-[14px] font-medium transition-all"
                  style={{
                    background: active
                      ? `linear-gradient(135deg, ${S1_GOLD_SOFT}, ${S1_GOLD})`
                      : S1_NAVY,
                    color: active ? S1_NAVY : "#F5F1E6",
                    border: `1px solid ${active ? S1_GOLD : "rgba(245,241,230,0.14)"}`,
                    boxShadow: active
                      ? "0 10px 26px -14px rgba(212,166,74,0.55)"
                      : "none",
                  }}
                >
                  <span className="text-[18px] leading-none">
                    {COUNTRY_FLAG_EMOJI[c.code]}
                  </span>
                  {c.name}
                </button>
              );
            })}
          </div>

          {/* Popular destinations */}
          <div className="mt-8">
            <div
              className="text-[14px] font-medium"
              style={{ color: "rgba(245,241,230,0.85)" }}
            >
              Popular destinations in {countryName}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {tiles.map((t) => {
                const active =
                  t.name === city && !customDestination.trim();
                return (
                  <button
                    key={t.name}
                    onClick={() => {
                      setCity(t.name);
                      setCustomDestination("");
                    }}
                    className="group relative flex h-[168px] flex-col overflow-hidden rounded-[16px] text-left transition-all"
                    style={{
                      border: `1px solid ${active ? S1_GOLD : "rgba(245,241,230,0.10)"}`,
                      boxShadow: active
                        ? "0 16px 34px -18px rgba(212,166,74,0.55)"
                        : "0 10px 24px -16px rgba(0,0,0,0.55)",
                    }}
                  >
                    <img
                      src={t.img}
                      alt={t.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      onError={(e) => (e.currentTarget.style.opacity = "0")}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(8,19,31,0.05) 40%, rgba(8,19,31,0.85) 100%)",
                      }}
                    />
                    <div className="relative z-10 mt-auto flex items-center gap-2 p-3.5">
                      <MapPin
                        size={14}
                        strokeWidth={2.2}
                        style={{ color: S1_GOLD_SOFT }}
                      />
                      <span className="text-[14px] font-medium text-white">
                        {t.name}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Anywhere tile */}
              {country === "NO" && (
                <button
                  onClick={() => {
                    setCity("Anywhere in Norway");
                    setCustomDestination("");
                  }}
                  className="group flex h-[168px] flex-col items-center justify-center gap-3 rounded-[16px] text-center transition-all"
                  style={{
                    background: S1_NAVY,
                    border: `1px solid ${
                      city === "Anywhere in Norway" ? S1_GOLD : "rgba(212,166,74,0.35)"
                    }`,
                    boxShadow:
                      city === "Anywhere in Norway"
                        ? "0 16px 34px -18px rgba(212,166,74,0.55)"
                        : "0 10px 24px -16px rgba(0,0,0,0.55)",
                  }}
                >
                  <MapPin
                    size={26}
                    strokeWidth={1.8}
                    style={{ color: S1_GOLD_SOFT }}
                  />
                  <span
                    className="text-[14px] font-medium leading-tight"
                    style={{ color: S1_GOLD_SOFT }}
                  >
                    Anywhere
                    <br />
                    in Norway
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="mt-8">
            <div
              className="text-[14px] font-medium"
              style={{ color: "rgba(245,241,230,0.85)" }}
            >
              Or search for any destination
            </div>
            <div
              className="mt-3 flex items-center gap-3 rounded-[14px] px-4 py-3.5"
              style={{
                backgroundColor: S1_NAVY,
                border: `1px solid rgba(245,241,230,0.12)`,
              }}
            >
              <Search size={16} style={{ color: S1_GOLD_SOFT }} />
              <input
                value={customDestination}
                onChange={(e) => setCustomDestination(e.target.value)}
                placeholder="Type city, region or venue"
                className="w-full bg-transparent text-[14px] outline-none"
                style={{ color: "#F5F1E6" }}
              />
            </div>
          </div>

          {/* Preferred hotel */}
          <div className="mt-6">
            <div
              className="rounded-[14px] p-4"
              style={{
                backgroundColor: S1_NAVY,
                border: `1px solid rgba(245,241,230,0.12)`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div
                    className="text-[14px] font-semibold"
                    style={{ color: "#F5F1E6" }}
                  >
                    Preferred hotel or special requests{" "}
                    <span
                      style={{
                        color: "rgba(245,241,230,0.55)",
                        fontWeight: 400,
                      }}
                    >
                      (optional)
                    </span>
                  </div>
                  <textarea
                    value={preferredHotel}
                    onChange={(e) => setPreferredHotel(e.target.value)}
                    placeholder="Tell us if you have a preferred hotel or anything important we should know…"
                    rows={2}
                    className="mt-1.5 w-full resize-none bg-transparent text-[13.5px] outline-none"
                    style={{ color: "rgba(245,241,230,0.85)" }}
                  />
                </div>
                <Pencil
                  size={16}
                  style={{ color: S1_GOLD_SOFT, flexShrink: 0 }}
                />
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-10 flex flex-col-reverse items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2 text-[13.5px]">
              <ShieldCheck
                size={16}
                strokeWidth={2}
                style={{ color: S1_GOLD_SOFT }}
              />
              <span style={{ color: S1_GOLD_SOFT }}>
                Your request is free and non-binding
              </span>
            </div>

            <button
              type="button"
              onClick={onNext}
              disabled={!canContinue}
              className="inline-flex items-center gap-2.5 rounded-[14px] px-8 py-4 text-[14.5px] font-semibold transition-all hover:-translate-y-[1px]"
              style={{
                background: `linear-gradient(135deg, ${S1_GOLD_SOFT} 0%, ${S1_GOLD} 100%)`,
                color: S1_NAVY,
                boxShadow:
                  "0 18px 40px -16px rgba(212,166,74,0.55), inset 0 1px 0 rgba(255,255,255,0.4)",
                opacity: canContinue ? 1 : 0.55,
                cursor: canContinue ? "pointer" : "not-allowed",
              }}
            >
              Next step
              <ArrowRight size={17} strokeWidth={2.4} />
            </button>
          </div>

          <p
            className="mt-4 text-center text-[12.5px] sm:text-right"
            style={{ color: "rgba(245,241,230,0.5)" }}
          >
            We find the best options so you can choose what suits your group.
          </p>
        </section>
      </div>
    </main>
  );
}

/* =============================================================
   LEISURE STEP 2 — Accommodation (dark navy premium)
   ============================================================= */

const S2_HERO =
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=80";

const STEP2_ROOMS: {
  key: string;
  title: string;
  desc: string;
  img: string;
}[] = [
  { key: "single", title: "Single rooms", desc: "1 person", img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=400&q=80" },
  { key: "triple", title: "Triple rooms", desc: "3 people", img: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=400&q=80" },
  { key: "twin", title: "Twin rooms", desc: "2 separate beds", img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80" },
  { key: "family", title: "Family rooms", desc: "4+ people", img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80" },
  { key: "double", title: "Double rooms", desc: "1 double bed", img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80" },
  { key: "accessible", title: "Accessible rooms", desc: "Wheelchair friendly", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80" },
];

function LeisureStepShell({
  activeStep,
  onStepGo,
  children,
  hero,
  chapter,
  headline,
  subtext,
}: {
  activeStep: StepKey;
  onStepGo: (s: StepKey) => void;
  children: React.ReactNode;
  hero: string;
  chapter: string;
  headline: React.ReactNode;
  subtext: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen w-full"
      style={{
        backgroundColor: S1_NAVY,
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#F5F1E6",
      }}
    >
      <header
        className="w-full"
        style={{ borderBottom: `1px solid ${S1_BORDER_SOFT}` }}
      >
        <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-7">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="grid h-11 w-11 place-items-center rounded-[10px]"
              style={{
                background: `linear-gradient(135deg, ${S1_GOLD_SOFT}, ${S1_GOLD})`,
                color: S1_NAVY,
                fontFamily: SERIF,
              }}
            >
              <span className="text-[16px] font-semibold leading-none tracking-wide">HGB</span>
            </div>
            <div className="leading-tight">
              <div style={{ fontFamily: SERIF, color: "#F5F1E6" }} className="text-[19px] font-medium">
                HotelGroupBook
              </div>
              <div className="text-[11px] tracking-[0.14em]" style={{ color: "rgba(245,241,230,0.55)" }}>
                Group journeys, made simple
              </div>
            </div>
          </Link>

          <ol className="flex flex-wrap items-center gap-x-2 gap-y-3 lg:gap-x-3">
            {[1, 2, 3, 4, 5, 6].map((n, i) => {
              const active = n === activeStep;
              const done = n < activeStep;
              return (
                <li key={n} className="flex items-center gap-2 lg:gap-3">
                  <button
                    type="button"
                    onClick={() => (done || active ? onStepGo(n as StepKey) : null)}
                    className="flex flex-col items-center gap-1.5"
                    style={{ cursor: done || active ? "pointer" : "default" }}
                  >
                    <span
                      className="grid h-8 w-8 place-items-center rounded-full text-[13px] font-semibold transition-all"
                      style={{
                        background: active
                          ? `linear-gradient(135deg, ${S1_GOLD_SOFT}, ${S1_GOLD})`
                          : "transparent",
                        color: active ? S1_NAVY : done ? S1_GOLD_SOFT : "rgba(245,241,230,0.55)",
                        border: `1px solid ${active || done ? S1_GOLD : "rgba(245,241,230,0.22)"}`,
                        boxShadow: active ? "0 6px 18px -8px rgba(212,166,74,0.55)" : "none",
                      }}
                    >
                      {done ? <Check size={14} strokeWidth={2.6} /> : n}
                    </span>
                    <span
                      className="text-[11.5px] tracking-wide"
                      style={{
                        color: active ? S1_GOLD_SOFT : done ? "#F5F1E6" : "rgba(245,241,230,0.55)",
                        fontWeight: active ? 600 : 500,
                      }}
                    >
                      {STEP_META[n as StepKey].title}
                    </span>
                  </button>
                  {i < 5 && (
                    <span
                      className="mt-[-14px] hidden h-px w-8 lg:block xl:w-14"
                      style={{ backgroundColor: "rgba(245,241,230,0.18)" }}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-[minmax(0,34fr)_minmax(0,66fr)] lg:gap-10 lg:px-10 lg:py-12">
        <aside
          className="relative overflow-hidden rounded-[24px] min-h-[520px] lg:min-h-[820px]"
          style={{
            border: `1px solid ${S1_BORDER_SOFT}`,
            boxShadow: "0 40px 80px -40px rgba(0,0,0,0.6)",
          }}
        >
          <img src={hero} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(8,19,31,0.35) 0%, rgba(8,19,31,0.48) 55%, rgba(8,19,31,0.86) 100%)",
            }}
          />
          <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between p-8 sm:p-10 lg:min-h-[820px] lg:p-12">
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
          </div>
        </aside>

        {children}
      </div>
    </main>
  );
}

function DarkCheckbox({
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
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 text-[14px] transition-colors"
      style={{ color: "#F5F1E6" }}
    >
      <span
        className="grid h-[22px] w-[22px] place-items-center rounded-[6px] transition-all"
        style={{
          background: checked ? `linear-gradient(135deg, ${S1_GOLD_SOFT}, ${S1_GOLD})` : S1_NAVY,
          border: `1.5px solid ${checked ? S1_GOLD : "rgba(245,241,230,0.28)"}`,
          boxShadow: checked ? "0 6px 14px -8px rgba(212,166,74,0.55)" : "none",
        }}
      >
        {checked && <Check size={13} strokeWidth={3} style={{ color: S1_NAVY }} />}
      </span>
      {label}
    </button>
  );
}

function RoomCounter({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const disabled = value === 0;
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={disabled}
        className="grid h-8 w-8 place-items-center transition-opacity"
        style={{ color: S1_GOLD_SOFT, opacity: disabled ? 0.35 : 1 }}
      >
        <Minus size={18} strokeWidth={2.4} />
      </button>
      <span
        className="min-w-[22px] text-center text-[20px] font-medium text-white"
        style={{ fontFamily: SERIF }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="grid h-8 w-8 place-items-center transition-transform hover:scale-110"
        style={{ color: S1_GOLD_SOFT }}
      >
        <Plus size={18} strokeWidth={2.4} />
      </button>
    </div>
  );
}

function LeisureStep2Screen({
  rooms,
  setRoom,
  earlyCheckin,
  setEarlyCheckin,
  lateCheckout,
  setLateCheckout,
  connectingRooms,
  setConnectingRooms,
  roomNotes,
  setRoomNotes,
  canContinue,
  onNext,
  onBack,
  onStepGo,
}: {
  rooms: Record<string, number>;
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
  canContinue: boolean;
  onNext: () => void;
  onBack: () => void;
  onStepGo: (s: StepKey) => void;
}) {
  const [roomNearElevator, setRoomNearElevator] = useState(false);

  return (
    <LeisureStepShell
      activeStep={2}
      onStepGo={onStepGo}
      hero={S2_HERO}
      chapter="CHAPTER II"
      headline={
        <>
          Choose where<br />your group<br />will rest.
        </>
      }
      subtext={
        <>
          Design the perfect room<br />distribution for your group.
        </>
      }
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
          Step 2 – Accommodation
        </h2>
        <p className="mt-2 text-[14.5px]" style={{ color: "rgba(245,241,230,0.62)" }}>
          How many rooms will your group need?
        </p>

        <div
          className="mt-8 text-[14px] font-medium"
          style={{ color: "rgba(245,241,230,0.85)" }}
        >
          Choose your room distribution
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {STEP2_ROOMS.map((r) => {
            const value = rooms[r.key] ?? 0;
            const active = value > 0;
            return (
              <div
                key={r.key}
                className="group flex items-center gap-4 rounded-[18px] p-3 transition-all hover:-translate-y-[1px]"
                style={{
                  backgroundColor: S1_NAVY,
                  border: `1px solid ${active ? S1_GOLD : "rgba(245,241,230,0.10)"}`,
                  boxShadow: active
                    ? "0 16px 34px -18px rgba(212,166,74,0.35)"
                    : "0 10px 26px -18px rgba(0,0,0,0.55)",
                }}
              >
                <div
                  className="h-[68px] w-[92px] flex-shrink-0 overflow-hidden rounded-[12px]"
                  style={{ border: `1px solid rgba(245,241,230,0.10)` }}
                >
                  <img
                    src={r.img}
                    alt={r.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-medium text-white">{r.title}</div>
                  <div
                    className="mt-0.5 text-[12.5px]"
                    style={{ color: "rgba(245,241,230,0.55)" }}
                  >
                    {r.desc}
                  </div>
                </div>
                <RoomCounter
                  value={value}
                  onChange={(v) => setRoom(r.key, v)}
                />
              </div>
            );
          })}
        </div>

        {/* Additional preferences */}
        <div className="mt-10">
          <div className="text-[14px]" style={{ color: "#F5F1E6" }}>
            <span className="font-semibold">Additional preferences</span>{" "}
            <span style={{ color: "rgba(245,241,230,0.55)" }}>(optional)</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
            <DarkCheckbox label="Early check-in" checked={earlyCheckin} onChange={setEarlyCheckin} />
            <DarkCheckbox label="Late check-out" checked={lateCheckout} onChange={setLateCheckout} />
            <DarkCheckbox label="Connecting rooms" checked={connectingRooms} onChange={setConnectingRooms} />
            <DarkCheckbox
              label="Room near elevator"
              checked={roomNearElevator}
              onChange={setRoomNearElevator}
            />
          </div>
        </div>

        {/* Comments */}
        <div
          className="mt-6 rounded-[14px] p-4"
          style={{
            backgroundColor: S1_NAVY,
            border: `1px solid rgba(245,241,230,0.12)`,
          }}
        >
          <textarea
            value={roomNotes}
            onChange={(e) => setRoomNotes(e.target.value)}
            placeholder="Tell us anything important about the room distribution…"
            rows={3}
            className="w-full resize-none bg-transparent text-[14px] outline-none"
            style={{ color: "#F5F1E6" }}
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
            className="inline-flex items-center gap-2.5 rounded-[14px] px-8 py-4 text-[14.5px] font-semibold transition-all hover:-translate-y-[1px]"
            style={{
              background: `linear-gradient(135deg, ${S1_GOLD_SOFT} 0%, ${S1_GOLD} 100%)`,
              color: S1_NAVY,
              boxShadow:
                "0 18px 40px -16px rgba(212,166,74,0.55), inset 0 1px 0 rgba(255,255,255,0.4)",
              opacity: canContinue ? 1 : 0.55,
              cursor: canContinue ? "pointer" : "not-allowed",
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
   STEP 3 - Extras (redesigned)
   ========================================================= */

const S3_HERO =
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80";

type ExtraCard = {
  key: string;
  title: string;
  img: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  options: string[];
};

const STEP3_CARDS: ExtraCard[] = [
  {
    key: "dining",
    title: "Dining",
    img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80",
    icon: Utensils,
    options: ["Early Breakfast", "Breakfast Box", "Lunch", "Packed Lunch", "Dinner"],
  },
  {
    key: "arrival",
    title: "Arrival Services",
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
    icon: Bell,
    options: ["Airport Transfer", "Porter In", "Porter Out", "Hospitality Desk", "Welcome Drink"],
  },
  {
    key: "hotel",
    title: "Hotel Services",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
    icon: BedDouble,
    options: [
      "Early Check-in",
      "Late Check-out",
      "Preferred Room Upgrade",
      "Connecting Rooms",
      "Laundry Service",
    ],
  },
  {
    key: "special",
    title: "Special Requests",
    img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
    icon: Gift,
    options: [
      "Gift Bags",
      "Celebration Setup",
      "Accessibility Requirements",
      "VIP Amenities",
      "Other Requests",
    ],
  },
];

function LeisureStep3Screen({
  selected,
  onToggle,
  comments,
  setComments,
  recommend,
  setRecommend,
  onNext,
  onBack,
  onStepGo,
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
}) {
  return (
    <LeisureStepShell
      activeStep={3}
      onStepGo={onStepGo}
      hero={S3_HERO}
      chapter="CHAPTER III"
      headline={
        <>
          The small<br />moments that<br />matter.
        </>
      }
      subtext={
        <>
          Add the details that turn<br />a trip into a story.
        </>
      }
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
          Step 3 – Extras
        </h2>
        <p className="mt-2 text-[14.5px]" style={{ color: "rgba(245,241,230,0.62)" }}>
          Select the extras and services you need.
        </p>

        {/* Five service cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {STEP3_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className="flex flex-col overflow-hidden rounded-[18px]"
                style={{
                  backgroundColor: S1_NAVY,
                  border: `1px solid ${S1_BORDER}`,
                  boxShadow: "0 18px 40px -24px rgba(0,0,0,0.55)",
                }}
              >
                <div className="relative h-[140px] w-full overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="h-full w-full object-cover"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(8,19,31,0) 40%, rgba(8,19,31,0.85) 100%)",
                    }}
                  />
                  <div
                    className="absolute -bottom-6 left-4 grid h-12 w-12 place-items-center rounded-full"
                    style={{
                      background: `linear-gradient(135deg, ${S1_NAVY_SOFT}, ${S1_NAVY})`,
                      border: `1px solid ${S1_GOLD}`,
                      boxShadow: "0 10px 24px -10px rgba(212,166,74,0.55)",
                    }}
                  >
                    <Icon size={20} strokeWidth={1.8} style={{ color: S1_GOLD_SOFT }} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col px-4 pb-5 pt-8">
                  <div
                    className="text-[16px] font-medium text-white"
                    style={{ fontFamily: SERIF, fontSize: 19 }}
                  >
                    {card.title}
                  </div>
                  <div className="mt-3 flex flex-col gap-2.5">
                    {card.options.map((opt) => (
                      <DarkCheckbox
                        key={opt}
                        label={opt}
                        checked={selected.has(opt)}
                        onChange={() => onToggle(opt)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* HGB Recommendations card */}
          <div
            className="flex flex-col items-center rounded-[18px] px-4 py-6 text-center"
            style={{
              backgroundColor: S1_NAVY,
              border: `1px solid ${S1_BORDER}`,
              boxShadow: "0 18px 40px -24px rgba(0,0,0,0.55)",
            }}
          >
            <div
              className="grid h-12 w-12 place-items-center rounded-full"
              style={{
                background: `linear-gradient(135deg, ${S1_NAVY_SOFT}, ${S1_NAVY})`,
                border: `1px solid ${S1_GOLD}`,
                boxShadow: "0 10px 24px -10px rgba(212,166,74,0.55)",
              }}
            >
              <Star size={20} strokeWidth={1.8} style={{ color: S1_GOLD_SOFT }} />
            </div>
            <div
              className="mt-4 text-[16px] font-medium"
              style={{ fontFamily: SERIF, fontSize: 18, color: S1_GOLD_SOFT, lineHeight: 1.25 }}
            >
              Let HotelGroupBook<br />recommend extras
            </div>
            <p
              className="mt-3 text-[12.5px] leading-relaxed"
              style={{ color: "rgba(245,241,230,0.65)" }}
            >
              We&apos;ll suggest the most suitable services based on your destination, hotel and group size.
            </p>
            <div className="mt-auto pt-5">
              <DarkCheckbox
                label="Recommend the best extras for my group"
                checked={recommend}
                onChange={setRecommend}
              />
            </div>
          </div>
        </div>

        {/* Additional comments */}
        <div
          className="mt-8 flex items-start gap-4 rounded-[16px] p-4"
          style={{
            backgroundColor: S1_NAVY,
            border: `1px solid ${S1_BORDER}`,
          }}
        >
          <div
            className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full"
            style={{
              background: `linear-gradient(135deg, ${S1_NAVY_SOFT}, ${S1_NAVY})`,
              border: `1px solid ${S1_GOLD}`,
            }}
          >
            <Pencil size={16} strokeWidth={1.8} style={{ color: S1_GOLD_SOFT }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14.5px]" style={{ color: "#F5F1E6" }}>
              <span className="font-semibold">Additional comments</span>{" "}
              <span style={{ color: "rgba(245,241,230,0.55)" }}>(optional)</span>
            </div>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tell us anything else we should know..."
              rows={2}
              className="mt-1 w-full resize-none bg-transparent text-[13.5px] outline-none"
              style={{ color: "#F5F1E6" }}
            />
          </div>
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
            className="inline-flex items-center gap-2.5 rounded-[14px] px-8 py-4 text-[14.5px] font-semibold transition-all hover:-translate-y-[1px]"
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
