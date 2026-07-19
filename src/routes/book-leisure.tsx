import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Building2,
  User,
  Calendar as CalendarIcon,
  ChevronDown,
  Lock,
  Star,
  FileText,
  Check,
  Minus,
  Plus,
  Loader2,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/book-leisure")({
  component: BookLeisure,
  head: () => ({
    meta: [
      { title: "Book Leisure — HotelGroupBook" },
      {
        name: "description",
        content:
          "Tell us about your group and we'll find the best hotel offers for you.",
      },
    ],
  }),
});

const SERIF = '"Cormorant Garamond", Georgia, serif';
const GOLD = "#F5C25A";
const GOLD_SOFT = "#E9B96A";
const NAVY_BG = "#061523";
const PANEL_ACTIVE = "#0F2437";
const BORDER = "rgba(245, 194, 90, 0.35)";
const BORDER_SOFT = "rgba(245, 194, 90, 0.18)";
const CARD_BG = "#FCFAF6";
const DIVIDER = "#ECE6DA";

type StepKey = 1 | 2 | 3;

const STEPS = [
  { n: 1 as StepKey, title: "Your Trip", sub: "Where and when", Icon: MapPin },
  { n: 2 as StepKey, title: "Requests", sub: "What you need", Icon: Building2 },
  { n: 3 as StepKey, title: "Your Details", sub: "Who to contact", Icon: User },
];

type CountryCode = "NO" | "SE" | "DK" | "FI";

const COUNTRIES: { code: CountryCode; name: string; Flag: () => React.ReactElement }[] = [
  { code: "NO", name: "Norway", Flag: FlagNO },
  { code: "SE", name: "Sweden", Flag: FlagSE },
  { code: "DK", name: "Denmark", Flag: FlagDK },
  { code: "FI", name: "Finland", Flag: FlagFI },
];

const CITIES: Record<CountryCode, string[]> = {
  NO: [
    "Oslo", "Bergen", "Tromsø", "Trondheim", "Stavanger", "Kristiansand",
    "Ålesund", "Bodø", "Lillehammer", "Fredrikstad", "Drammen", "Sandnes",
    "Molde", "Haugesund", "Narvik", "Alta", "Hamar", "Larvik", "Tønsberg",
  ],
  SE: [
    "Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro",
    "Linköping", "Helsingborg", "Jönköping", "Lund", "Umeå", "Kiruna",
  ],
  DK: [
    "Copenhagen", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Roskilde",
    "Kolding", "Vejle", "Herning", "Helsingør",
  ],
  FI: [
    "Helsinki", "Espoo", "Tampere", "Turku", "Oulu", "Rovaniemi",
    "Jyväskylä", "Kuopio", "Lahti", "Vaasa",
  ],
};

const SPECIAL_REQUESTS = [
  "Breakfast Box",
  "Lunch",
  "Dinner",
  "Meeting Room",
  "Porter Service",
  "Airport Transfer",
  "Early Check-in",
  "Late Check-out",
];

function BookLeisure() {
  const [step, setStep] = useState<StepKey>(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // Trip
  const [country, setCountry] = useState<CountryCode>("NO");
  const [city, setCity] = useState<string>("Bergen");
  const [arrival, setArrival] = useState<Date | undefined>();
  const [departure, setDeparture] = useState<Date | undefined>();

  // Group
  const [guests, setGuests] = useState<number>(25);
  const [sgl, setSgl] = useState<number>(4);
  const [dbl, setDbl] = useState<number>(8);
  const [trp, setTrp] = useState<number>(2);

  // Requests
  const [selectedRequests, setSelectedRequests] = useState<Set<string>>(
    new Set(["Dinner"]),
  );
  const [notes, setNotes] = useState(
    "",
  );

  // Details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [terms, setTerms] = useState(false);

  // Submission state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<null | {
    requestId: string;
  }>(null);

  const navigate = useNavigate();

  const totalRooms = sgl + dbl + trp;
  const maxCapacity = sgl * 1 + dbl * 2 + trp * 3;
  const capacityShortfall = guests > maxCapacity;

  const handleCountryChange = (val: CountryCode) => {
    setCountry(val);
    setCity("");
  };

  const handleArrivalChange = (d: Date | undefined) => {
    setArrival(d);
    if (d && departure && departure <= d) setDeparture(undefined);
  };

  const toggleRequest = (r: string) => {
    setSelectedRequests((prev) => {
      const n = new Set(prev);
      if (n.has(r)) n.delete(r);
      else n.add(r);
      return n;
    });
  };

  const go = (next: StepKey) => {
    setDirection(next > step ? "forward" : "back");
    setStep(next);
  };

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const validateAll = () => {
    const e: Record<string, string> = {};
    if (!country) e.country = "Please select a country.";
    if (!city) e.city = "Please select a city.";
    if (!arrival) e.arrival = "Please select an arrival date.";
    else if (arrival < today) e.arrival = "Arrival cannot be in the past.";
    if (!departure) e.departure = "Please select a departure date.";
    else if (arrival && departure <= arrival)
      e.departure = "Departure must be after arrival.";
    if (!guests || guests < 1) e.guests = "Please select number of guests.";
    if (capacityShortfall)
      e.capacity = "Selected rooms don't cover the number of guests.";
    if (!fullName.trim()) e.fullName = "Please enter your full name.";
    if (!email.trim()) e.email = "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      e.email = "Please enter a valid email address.";
    if (!phone.trim()) e.phone = "Please enter your phone number.";
    else if (!/^[+()\d][\d\s()+-]{6,}$/.test(phone.trim()))
      e.phone = "Please enter a valid phone number.";
    if (!terms) e.terms = "Please accept the terms to continue.";
    return e;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    const e = validateAll();
    setErrors(e);
    setSubmitError(null);
    if (Object.keys(e).length > 0) {
      // If a step-1 field failed, jump back so user sees highlights
      if (e.country || e.city || e.arrival || e.departure || e.guests || e.capacity) {
        setDirection("back");
        setStep(1);
      }
      return;
    }
    setSubmitting(true);
    try {
      const year = new Date().getFullYear();
      const seq = Math.floor(Math.random() * 90000) + 10000;
      const requestId = `HGB-${year}-${String(seq).padStart(5, "0")}`;
      const payload = {
        requestId,
        country,
        city,
        arrivalDate: arrival ? format(arrival, "yyyy-MM-dd") : null,
        departureDate: departure ? format(departure, "yyyy-MM-dd") : null,
        guests,
        sgl,
        dbl,
        trp,
        totalRooms,
        maxCapacity,
        specialRequests: Array.from(selectedRequests),
        additionalInformation: notes,
        contactName: fullName,
        company,
        email,
        phone,
        status: "Searching hotels",
        submittedAt: new Date().toISOString(),
      };
      // Persist to localStorage under "My Requests"
      if (typeof window !== "undefined") {
        const existing = JSON.parse(
          window.localStorage.getItem("hgb_requests") || "[]",
        );
        existing.unshift(payload);
        window.localStorage.setItem("hgb_requests", JSON.stringify(existing));
      }
      // Small delay for premium loading feel
      await new Promise((r) => setTimeout(r, 700));
      setConfirmation({ requestId });
    } catch (err) {
      console.error(err);
      setSubmitError(
        "We couldn't submit your request. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmation) {
    return (
      <ConfirmationScreen
        requestId={confirmation.requestId}
        onGoToRequests={() => navigate({ to: "/" })}
        onGoHome={() => navigate({ to: "/" })}
      />
    );
  }


  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{ backgroundColor: NAVY_BG }}
    >
      <GoldParticles />

      <div className="relative mx-auto max-w-[1500px] px-4 py-6 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div
          className="relative overflow-hidden rounded-[24px] border"
          style={{
            borderColor: BORDER_SOFT,
            backgroundColor: "rgba(6, 21, 35, 0.85)",
            boxShadow:
              "0 40px 120px -40px rgba(0,0,0,0.75), inset 0 1px 0 rgba(245,194,90,0.06)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
            <Sidebar step={step} onGo={go} />

            <div className="relative p-6 sm:p-10 lg:px-14 lg:py-12 xl:px-[15px]">
              {/* Header row */}
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <h1
                    className="text-white text-4xl sm:text-5xl lg:text-[52px] leading-[1.05] font-medium tracking-tight"
                    style={{ fontFamily: SERIF }}
                  >
                    Book Leisure
                  </h1>
                  <p className="mt-3 text-[15px] text-[#B9C2CC]">
                    Tell us about your group and we'll find the best hotel offers for you.
                  </p>
                </div>
                <TopProgress step={step} />
              </div>

              {/* Slide container */}
              <div className="relative mt-8">
                <div
                  key={step}
                  className={
                    direction === "forward"
                      ? "animate-slide-in-right"
                      : "animate-slide-in-left"
                  }
                >
                  <div
                    className="rounded-[26px] p-6 sm:p-8 lg:p-10 xl:px-[15px]"
                    style={{
                      backgroundColor: CARD_BG,
                      boxShadow:
                        "0 30px 80px -30px rgba(0,0,0,0.55), 0 8px 30px -12px rgba(0,0,0,0.35)",
                    }}
                  >
                    {step === 1 && (
                      <StepOne
                        country={country}
                        setCountry={handleCountryChange}
                        city={city}
                        setCity={setCity}
                        arrival={arrival}
                        setArrival={handleArrivalChange}
                        departure={departure}
                        setDeparture={setDeparture}
                        today={today}
                        guests={guests}
                        setGuests={setGuests}
                        sgl={sgl}
                        setSgl={setSgl}
                        dbl={dbl}
                        setDbl={setDbl}
                        trp={trp}
                        setTrp={setTrp}
                        totalRooms={totalRooms}
                        maxCapacity={maxCapacity}
                        capacityShortfall={capacityShortfall}
                        selectedRequests={selectedRequests}
                        toggleRequest={toggleRequest}
                        notes={notes}
                        setNotes={setNotes}
                      />
                    )}

                    {step === 2 && (
                      <StepTwo notes={notes} setNotes={setNotes} />
                    )}

                    {step === 3 && (
                      <StepThree
                        fullName={fullName}
                        setFullName={setFullName}
                        email={email}
                        setEmail={setEmail}
                        company={company}
                        setCompany={setCompany}
                        phone={phone}
                        setPhone={setPhone}
                        terms={terms}
                        setTerms={setTerms}
                        errors={errors}
                      />
                    )}

                    <div className="mt-8">
                      <PrimaryButton
                        onClick={() => {
                          if (step < 3) {
                            go((step + 1) as StepKey);
                          } else {
                            handleSubmit();
                          }
                        }}
                        loading={step === 3 && submitting}
                        label={
                          step === 3
                            ? submitting
                              ? "Submitting..."
                              : "Submit Request"
                            : "Continue"
                        }
                      />
                      {submitError && step === 3 && (
                        <p
                          className="mt-3 text-center text-[13.5px]"
                          style={{ color: "#B4231F" }}
                        >
                          {submitError}
                        </p>
                      )}
                      <div
                        className="mt-5 flex items-center justify-center gap-2 text-[13px]"
                        style={{ color: "#6B7280" }}
                      >
                        <Lock size={14} strokeWidth={1.8} />
                        <span>It's free and without obligation.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <style>{`
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(28px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-28px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 300ms ease-out; }
        .animate-slide-in-left { animation: slide-in-left 300ms ease-out; }
        .scrollbar-hidden::-webkit-scrollbar { display: none; }
        .scrollbar-hidden { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  );
}

/* ---------- Sidebar ---------- */

function Sidebar({ step, onGo }: { step: StepKey; onGo: (s: StepKey) => void }) {
  return (
    <aside
      className="relative border-b lg:border-b-0 lg:border-r p-6 lg:px-7 lg:py-8"
      style={{ borderColor: BORDER_SOFT, backgroundColor: "rgba(3, 10, 20, 0.55)" }}
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-[14px] font-medium transition-colors hover:text-[#F5C25A]"
        style={{ color: "#E4E7EC" }}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back
      </Link>

      <div className="relative mt-10">
        {/* Vertical timeline segments - one per gap between steps */}
        {[0, 1].map((i) => {
          const completed = step > (i + 1);
          return (
            <div
              key={i}
              className="absolute left-[18px] w-px -translate-x-1/2 transition-all duration-500"
              style={{
                top: `calc(${i} * (100% / 3) + 36px)`,
                height: `calc(100% / 3 - 20px)`,
                background: completed
                  ? `linear-gradient(to bottom, ${GOLD}, ${GOLD_SOFT})`
                  : "transparent",
                backgroundImage: completed
                  ? undefined
                  : `linear-gradient(to bottom, rgba(245,194,90,0.55) 50%, transparent 50%)`,
                backgroundSize: completed ? undefined : "1px 5px",
                backgroundRepeat: completed ? undefined : "repeat-y",
                boxShadow: completed
                  ? "0 0 8px rgba(245,194,90,0.45)"
                  : "none",
                opacity: completed ? 1 : 0.6,
              }}
              aria-hidden="true"
            />
          );
        })}

        <div className="flex flex-col gap-5">
          {STEPS.map(({ n, title, sub, Icon }) => {
            const active = step === n;
            const completed = step > n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onGo(n)}
                className="group relative flex items-start gap-4 text-left"
              >
                <span
                  className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: active
                      ? GOLD
                      : completed
                        ? "rgba(245,194,90,0.08)"
                        : "rgba(6, 21, 35, 0.9)",
                    color: active ? "#0A1626" : GOLD,
                    border: `1px solid ${completed || active ? GOLD : "rgba(245,194,90,0.5)"}`,
                    boxShadow: active
                      ? "0 0 0 5px rgba(245,194,90,0.10), 0 0 22px -4px rgba(245,194,90,0.55)"
                      : completed
                        ? "0 0 12px -4px rgba(245,194,90,0.35)"
                        : "none",
                  }}
                >
                  {completed ? (
                    <Check size={15} strokeWidth={2.4} style={{ color: GOLD }} />
                  ) : (
                    n
                  )}
                </span>

                <div
                  className="flex-1 min-w-0 rounded-2xl px-4 py-3 -my-1 transition-all duration-300 group-hover:border-[rgba(245,194,90,0.25)]"
                  style={
                    active
                      ? {
                          background:
                            "linear-gradient(180deg, rgba(20,44,72,0.9) 0%, rgba(10,26,44,0.9) 100%)",
                          border: `1px solid ${BORDER}`,
                          boxShadow:
                            "inset 0 1px 0 rgba(255,255,255,0.04), 0 0 26px -10px rgba(245,194,90,0.35)",
                        }
                      : {
                          border: "1px solid transparent",
                        }
                  }
                >
                  <div className="flex items-center justify-end">
                    <Icon
                      size={18}
                      strokeWidth={1.6}
                      style={{
                        color: active || completed ? GOLD : "rgba(245,194,90,0.6)",
                      }}
                    />
                  </div>
                  <div
                    className="mt-1 text-[18px] font-medium tracking-tight"
                    style={{
                      color: active ? GOLD : completed ? "#F0E7D2" : "#E8E8E4",
                      fontFamily: SERIF,
                    }}
                  >
                    {title}
                  </div>
                  <div className="text-[12.5px] tracking-wide" style={{ color: "#8B96A3" }}>
                    {sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

/* ---------- Top progress ---------- */

function TopProgress({ step }: { step: StepKey }) {
  return (
    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
      {[1, 2, 3].map((n, i) => (
        <div key={n} className="flex items-center gap-2 sm:gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-[14px] font-semibold transition-all"
            style={{
              backgroundColor: step === n ? GOLD : "transparent",
              color: step === n ? "#0A1626" : step > n ? GOLD : "#B9C2CC",
              border: `1.5px solid ${step >= n ? GOLD : "rgba(245,194,90,0.4)"}`,
            }}
          >
            {n}
          </span>
          {i < 2 && (
            <span
              className="h-px w-6 sm:w-8"
              style={{
                backgroundColor: step > n ? GOLD : "rgba(245,194,90,0.4)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- STEP 1: 4-column form ---------- */

function StepOne(props: {
  country: CountryCode;
  setCountry: (c: CountryCode) => void;
  city: string;
  setCity: (v: string) => void;
  arrival: Date | undefined;
  setArrival: (d: Date | undefined) => void;
  departure: Date | undefined;
  setDeparture: (d: Date | undefined) => void;
  today: Date;
  guests: number;
  setGuests: (n: number) => void;
  sgl: number;
  setSgl: (n: number) => void;
  dbl: number;
  setDbl: (n: number) => void;
  trp: number;
  setTrp: (n: number) => void;
  totalRooms: number;
  maxCapacity: number;
  capacityShortfall: boolean;
  selectedRequests: Set<string>;
  toggleRequest: (r: string) => void;
  notes: string;
  setNotes: (v: string) => void;
}) {
  const activeCountry = COUNTRIES.find((c) => c.code === props.country)!;
  const cities = CITIES[props.country];
  const guestOptions = useMemo(
    () => Array.from({ length: 500 }, (_, i) => i + 1),
    [],
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(200px,1fr)_minmax(200px,1fr)_minmax(200px,0.9fr)_minmax(280px,1fr)] gap-8 xl:gap-0">
      {/* Column 1 - Destination */}
      <ColumnBlock icon={<MapPin size={18} strokeWidth={1.8} />} title="Destination">
        <FieldLabel>Country</FieldLabel>
        <Select
          value={props.country}
          onValueChange={(v) => props.setCountry(v as CountryCode)}
        >
          <DestinationSelectTrigger>
            <span className="flex items-center gap-2 min-w-0">
              <activeCountry.Flag />
              <span className="text-[15px] text-[#0A1626] truncate">
                {activeCountry.name}
              </span>
            </span>
          </DestinationSelectTrigger>
          <StyledSelectContent>
            {COUNTRIES.map(({ code, name, Flag }) => (
              <StyledSelectItem key={code} value={code}>
                <span className="flex items-center gap-2">
                  <Flag />
                  <span>{name}</span>
                </span>
              </StyledSelectItem>
            ))}
          </StyledSelectContent>
        </Select>

        <FieldLabel className="mt-5">City</FieldLabel>
        <Select value={props.city} onValueChange={props.setCity}>
          <DestinationSelectTrigger>
            <span className="text-[15px] truncate" style={{ color: props.city ? "#0A1626" : "#9AA3AF" }}>
              {props.city || "Select city"}
            </span>
          </DestinationSelectTrigger>
          <StyledSelectContent>
            {cities.map((c) => (
              <StyledSelectItem key={c} value={c}>
                {c}
              </StyledSelectItem>
            ))}
          </StyledSelectContent>
        </Select>

        <FieldLabel className="mt-5">Arrival Date</FieldLabel>
        <DateField
          value={props.arrival}
          onChange={props.setArrival}
          disabled={(d) => d < props.today}
          placeholder="Select date"
        />

        <FieldLabel className="mt-5">Departure Date</FieldLabel>
        <DateField
          value={props.departure}
          onChange={props.setDeparture}
          disabled={(d) =>
            d < props.today || (props.arrival ? d <= props.arrival : false)
          }
          placeholder="Select date"
        />
      </ColumnBlock>

      {/* Column 2 - Group Details */}
      <ColumnBlock icon={<User size={18} strokeWidth={1.8} />} title="Group Details" divider>
        <FieldLabel>Number of Guests</FieldLabel>
        <Select
          value={String(props.guests)}
          onValueChange={(v) => props.setGuests(Number(v))}
        >
          <StyledSelectTrigger>
            <span className="text-[15px] text-[#0A1626]">{props.guests}</span>
          </StyledSelectTrigger>
          <StyledSelectContent>
            {guestOptions.map((n) => (
              <StyledSelectItem key={n} value={String(n)}>
                {n}
              </StyledSelectItem>
            ))}
          </StyledSelectContent>
        </Select>

        <div className="mt-6 text-[15px] font-semibold text-[#0A1626]">
          Room Breakdown
        </div>

        <FieldLabel className="mt-4">Single Rooms (SGL)</FieldLabel>
        <Counter value={props.sgl} onChange={props.setSgl} />

        <FieldLabel className="mt-4">Double Rooms (DBL)</FieldLabel>
        <Counter value={props.dbl} onChange={props.setDbl} />

        <FieldLabel className="mt-4">Triple Rooms (TRP)</FieldLabel>
        <Counter value={props.trp} onChange={props.setTrp} />

        <div
          className="mt-5 rounded-xl px-4 py-3"
          style={{ backgroundColor: "#F5EFE1" }}
        >
          <div className="flex items-center justify-between gap-2 text-[13.5px] whitespace-nowrap text-[#0A1626]">
            <span>Total Rooms</span>
            <span className="font-semibold">{props.totalRooms}</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2 text-[13.5px] whitespace-nowrap text-[#0A1626]">
            <span>Maximum Capacity</span>
            <span className="font-semibold">{props.maxCapacity} Guests</span>
          </div>
        </div>
        {props.capacityShortfall && (
          <p className="mt-2 text-[12.5px]" style={{ color: "#B4231F" }}>
            The selected rooms do not have enough capacity for the number of guests.
          </p>
        )}
      </ColumnBlock>

      {/* Column 3 - Special Requests */}
      <ColumnBlock icon={<Star size={18} strokeWidth={1.8} />} title="Special Requests" divider>
        <div className="flex flex-col gap-3">
          {SPECIAL_REQUESTS.map((r) => {
            const checked = props.selectedRequests.has(r);
            return (
              <button
                type="button"
                key={r}
                onClick={() => props.toggleRequest(r)}
                className="flex items-center gap-3 text-left"
              >
                <span
                  className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] transition-colors"
                  style={{
                    backgroundColor: checked ? "#0A1626" : "#FFFFFF",
                    border: checked ? "1px solid #0A1626" : "1px solid #D9D3C4",
                  }}
                >
                  {checked && (
                    <Check size={14} strokeWidth={3} className="text-white" />
                  )}
                </span>
                <span className="text-[15px] text-[#0A1626]">{r}</span>
              </button>
            );
          })}
        </div>
      </ColumnBlock>

      {/* Column 4 - Additional Information */}
      <ColumnBlock
        icon={<FileText size={18} strokeWidth={1.8} />}
        title="Additional Information"
        divider
        rightPaddingClass="xl:pr-2"
      >
        <p className="text-[14px] text-[#6B7280]">
          Tell us more about your request...
        </p>
        <textarea
          value={props.notes}
          onChange={(e) => props.setNotes(e.target.value)}
          rows={10}
          placeholder="We would like a hotel near the city center. Please include options with dinner and meeting room."
          className="mt-[33px] min-h-[340px] w-full overflow-y-auto rounded-2xl bg-white p-6 text-[14.5px] leading-relaxed text-[#0A1626] outline-none placeholder:text-[#9AA3AF] resize-none scrollbar-hidden xl:w-[235px] xl:max-w-full xl:mx-auto"
          style={{
            border: "1px solid #E4DED2",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        />

      </ColumnBlock>
    </div>
  );
}

/* ---------- STEP 2 & 3 (simple) ---------- */

function StepTwo({
  notes,
  setNotes,
}: {
  notes: string;
  setNotes: (v: string) => void;
}) {
  return (
    <div className="min-h-[300px]">
      <h3 className="text-[22px] font-medium text-[#0A1626]" style={{ fontFamily: SERIF }}>
        Anything else we should know?
      </h3>
      <p className="mt-2 text-[14px] text-[#6B7280]">
        Add any additional notes for our team.
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={8}
        placeholder="Add notes here..."
        className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-[14.5px] text-[#0A1626] outline-none placeholder:text-[#9AA3AF] resize-none"
        style={{ border: "1px solid #E4DED2" }}
      />
    </div>
  );
}

function StepThree(props: {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  company: string;
  setCompany: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  terms: boolean;
  setTerms: (b: boolean) => void;
  errors: Record<string, string>;
}) {
  const { errors } = props;
  return (
    <div className="min-h-[300px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <FieldLabel>Full Name</FieldLabel>
          <InputBox
            value={props.fullName}
            onChange={props.setFullName}
            placeholder="Ola Nordmann"
            error={!!errors.fullName}
          />
          {errors.fullName && <FieldError>{errors.fullName}</FieldError>}
          <FieldLabel className="mt-5">Email</FieldLabel>
          <InputBox
            value={props.email}
            onChange={props.setEmail}
            placeholder="you@example.com"
            type="email"
            error={!!errors.email}
          />
          {errors.email && <FieldError>{errors.email}</FieldError>}
        </div>
        <div>
          <FieldLabel>Company</FieldLabel>
          <InputBox
            value={props.company}
            onChange={props.setCompany}
            placeholder="Optional"
          />
          <FieldLabel className="mt-5">Phone</FieldLabel>
          <InputBox
            value={props.phone}
            onChange={props.setPhone}
            placeholder="+47 000 00 000"
            type="tel"
            error={!!errors.phone}
          />
          {errors.phone && <FieldError>{errors.phone}</FieldError>}
        </div>
      </div>

      <label className="mt-6 flex items-start gap-3 cursor-pointer select-none">
        <span
          className="mt-[2px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[6px] transition-colors"
          style={{
            backgroundColor: props.terms ? "#0A1626" : "#FFFFFF",
            border: props.terms
              ? "1px solid #0A1626"
              : `1px solid ${errors.terms ? "#B4231F" : "#D9D3C4"}`,
          }}
          onClick={() => props.setTerms(!props.terms)}
        >
          {props.terms && <Check size={14} strokeWidth={3} className="text-white" />}
        </span>
        <span className="text-[14px] text-[#0A1626] leading-relaxed">
          I agree to the terms and consent to being contacted about my request.
        </span>
      </label>
      {errors.terms && <FieldError>{errors.terms}</FieldError>}
    </div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 text-[12.5px]" style={{ color: "#B4231F" }}>
      {children}
    </p>
  );
}


/* ---------- Primitives ---------- */

function ColumnBlock({
  icon,
  title,
  children,
  divider = false,
  rightPaddingClass = "xl:pr-5",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  divider?: boolean;
  rightPaddingClass?: string;
}) {
  return (
    <div
      className={cn("relative flex flex-col xl:pl-6", divider && "xl:ml-0")}
      style={{
        borderLeft: divider ? `1px solid ${DIVIDER}` : undefined,
      }}
    >
      <div className={rightPaddingClass}>
        <div className="flex items-center gap-2 text-[#0A1626] mb-5">
          <span className="text-[#0A1626]">{icon}</span>
          <span className="text-[17px] font-semibold">{title}</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function FieldLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-2 text-[13.5px] text-[#5B6472]", className)}>
      {children}
    </div>
  );
}

function Counter({
  value,
  onChange,
  min = 0,
  max = 250,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  return (
    <div
      className="flex h-[46px] items-center rounded-xl bg-white"
      style={{ border: "1px solid #E4DED2", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        className="flex h-full w-12 items-center justify-center text-[#0A1626] hover:bg-black/5 rounded-l-xl transition-colors"
        aria-label="Decrease"
      >
        <Minus size={16} strokeWidth={2} />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const v = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
          if (!isNaN(v)) onChange(clamp(v));
        }}
        className="h-full flex-1 min-w-0 text-center text-[15px] font-medium text-[#0A1626] outline-none bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        className="flex h-full w-12 items-center justify-center text-[#0A1626] hover:bg-black/5 rounded-r-xl transition-colors"
        aria-label="Increase"
      >
        <Plus size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

const styledSelectTriggerClass = cn(
  "group flex h-[50px] w-full items-center justify-between rounded-xl bg-white pl-6 pr-5",
  "cursor-pointer transition-shadow hover:shadow-md",
  "border border-[#E4DED2] shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
  "text-left [&>span]:line-clamp-1 focus:outline-none focus:ring-0 [&>svg]:hidden",
);

function StyledSelectTrigger({ children }: { children: React.ReactNode }) {
  return (
    <SelectTrigger className={styledSelectTriggerClass}>
      <SelectValue asChild>
        <span className="flex items-center gap-3 min-w-0">{children}</span>
      </SelectValue>
      <span className="ml-3 flex shrink-0 items-center justify-center transition-transform duration-200 group-data-[state=open]:rotate-180">
        <ChevronDown size={18} strokeWidth={2} className="text-[#0A1626]" />
      </span>
    </SelectTrigger>
  );
}

const destinationSelectTriggerClass = cn(
  "group flex h-[50px] w-full items-center justify-between rounded-xl bg-white pl-6 pr-5",
  "cursor-pointer transition-shadow hover:shadow-md",
  "border border-[#E4DED2] shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
  "text-left [&>span]:line-clamp-1 focus:outline-none focus:ring-0 [&>svg]:hidden",
);

function DestinationSelectTrigger({ children }: { children: React.ReactNode }) {
  return (
    <SelectTrigger className={destinationSelectTriggerClass}>
      <SelectValue asChild>
        <span className="flex items-center gap-3 min-w-0">{children}</span>
      </SelectValue>
      <span className="ml-3 flex shrink-0 items-center justify-center transition-transform duration-200 group-data-[state=open]:rotate-180">
        <ChevronDown size={18} strokeWidth={2} className="text-[#0A1626]" />
      </span>
    </SelectTrigger>
  );
}


function StyledSelectContent({ children }: { children: React.ReactNode }) {
  return (
    <SelectContent
      className="z-[100] max-h-[280px] overflow-hidden rounded-xl border border-[#E4DED2] bg-white p-1.5 shadow-xl"
      position="popper"
    >
      {children}
    </SelectContent>
  );
}

function StyledSelectItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <SelectItem
      value={value}
      className={cn(
        "relative cursor-pointer rounded-lg py-2.5 pl-3 pr-8 text-[15px] text-[#0A1626] outline-none transition-colors",
        "data-[highlighted]:bg-[#F5EFE1] data-[highlighted]:text-[#0A1626]",
        "data-[state=checked]:bg-[#EAE6DD] data-[state=checked]:font-medium",
        "focus:bg-[#F5EFE1] focus:text-[#0A1626]",
      )}
    >
      {children}
    </SelectItem>
  );
}

function DateField({
  value,
  onChange,
  disabled,
  placeholder,
}: {
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
  disabled?: (d: Date) => boolean;
  placeholder: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-[50px] w-full items-center justify-between rounded-xl bg-white pl-6 pr-7 cursor-pointer transition-shadow hover:shadow-md text-left"
          style={{
            border: "1px solid #E4DED2",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <span
            className="text-[15px] min-w-0 truncate"
            style={{ color: value ? "#0A1626" : "#9AA3AF" }}
          >
            {value ? format(value, "dd MMM yyyy") : placeholder}
          </span>
          <span className="flex items-center gap-5 shrink-0">
            <CalendarIcon size={18} strokeWidth={1.6} className="text-[#0A1626]" />
            <ChevronDown size={16} strokeWidth={1.8} className="text-[#5B6472]" />
          </span>
        </button>

      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[100] bg-white" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={disabled}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}

function InputBox({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-[46px] w-full rounded-xl bg-white px-4 text-[15px] text-[#0A1626] outline-none placeholder:text-[#9AA3AF]"
      style={{
        border: "1px solid #E4DED2",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      }}
    />
  );
}

/* ---------- Primary Button ---------- */

function PrimaryButton({
  onClick,
  label = "Get Hotel Offers",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="continue-btn group relative flex h-[64px] w-full items-center justify-center gap-4 rounded-[16px] px-8 text-[17px] font-semibold transition-all duration-[250ms] ease-out"
      style={{
        backgroundColor: "#081828",
        color: GOLD,
        border: `1px solid ${GOLD}`,
        boxShadow:
          "0 12px 40px -12px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,194,90,0.10), 0 0 24px -8px rgba(245,194,90,0.35)",
      }}
    >
      <span>{label}</span>
      <ArrowRight
        size={22}
        strokeWidth={1.8}
        className="transition-transform duration-[250ms] ease-out group-hover:translate-x-1"
      />
      <style>{`
        .continue-btn:hover {
          transform: translateY(-2px);
          border-color: #FFD57A;
          box-shadow:
            0 18px 50px -14px rgba(0,0,0,0.6),
            0 0 0 1px rgba(245,194,90,0.28),
            0 0 40px -6px rgba(245,194,90,0.55);
          background-color: #0A1E32;
        }
      `}</style>
    </button>
  );
}

/* ---------- Flags ---------- */

function FlagNO() {
  return (
    <span
      className="inline-flex h-5 w-7 shrink-0 overflow-hidden rounded-[3px]"
      aria-label="Norway"
      style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06)" }}
    >
      <svg viewBox="0 0 28 20" width="28" height="20" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="20" fill="#BA0C2F" />
        <rect x="8" width="4" height="20" fill="#FFFFFF" />
        <rect y="8" width="28" height="4" fill="#FFFFFF" />
        <rect x="9" width="2" height="20" fill="#00205B" />
        <rect y="9" width="28" height="2" fill="#00205B" />
      </svg>
    </span>
  );
}

function FlagSE() {
  return (
    <span
      className="inline-flex h-5 w-7 shrink-0 overflow-hidden rounded-[3px]"
      aria-label="Sweden"
      style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06)" }}
    >
      <svg viewBox="0 0 28 20" width="28" height="20" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="20" fill="#006AA7" />
        <rect x="8" width="3" height="20" fill="#FECC00" />
        <rect y="8.5" width="28" height="3" fill="#FECC00" />
      </svg>
    </span>
  );
}

function FlagDK() {
  return (
    <span
      className="inline-flex h-5 w-7 shrink-0 overflow-hidden rounded-[3px]"
      aria-label="Denmark"
      style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06)" }}
    >
      <svg viewBox="0 0 28 20" width="28" height="20" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="20" fill="#C8102E" />
        <rect x="8" width="3" height="20" fill="#FFFFFF" />
        <rect y="8.5" width="28" height="3" fill="#FFFFFF" />
      </svg>
    </span>
  );
}

function FlagFI() {
  return (
    <span
      className="inline-flex h-5 w-7 shrink-0 overflow-hidden rounded-[3px]"
      aria-label="Finland"
      style={{ boxShadow: "0 0 0 1px rgba(0,0,0,0.06)" }}
    >
      <svg viewBox="0 0 28 20" width="28" height="20" xmlns="http://www.w3.org/2000/svg">
        <rect width="28" height="20" fill="#FFFFFF" />
        <rect x="8" width="3" height="20" fill="#003580" />
        <rect y="8.5" width="28" height="3" fill="#003580" />
      </svg>
    </span>
  );
}

/* ---------- Background particles ---------- */

function GoldParticles() {
  // Deterministic pseudo-random for stable SSR/CSR output.
  const rand = (seed: number) => {
    const x = Math.sin(seed) * 43758.5453;
    return x - Math.floor(x);
  };

  type P = { x: number; y: number; size: number; opacity: number };
  const particles: P[] = [];

  // Edge bands (left + right), fade horizontally toward center.
  for (let i = 0; i < 90; i++) {
    const r = rand(i + 1);
    const side = i % 2 === 0 ? "left" : "right";
    const edgeX = rand(i + 101) * 14; // 0-14% from edge
    const x = side === "left" ? edgeX : 100 - edgeX;
    const y = rand(i + 201) * 100;
    const size = 0.6 + rand(i + 301) * 1.8;
    const baseOp = 0.12 + rand(i + 401) * 0.35;
    // Fade with distance from edge.
    const fade = 1 - edgeX / 14;
    particles.push({ x, y, size, opacity: baseOp * (0.35 + fade * 0.65) });
    void r;
  }

  // Corner clusters (denser).
  const corners = [
    { cx: 3, cy: 3 },
    { cx: 97, cy: 3 },
    { cx: 3, cy: 97 },
    { cx: 97, cy: 97 },
  ];
  corners.forEach((c, ci) => {
    for (let i = 0; i < 40; i++) {
      const seed = ci * 1000 + i;
      const dx = (rand(seed + 11) - 0.5) * 24;
      const dy = (rand(seed + 31) - 0.5) * 24;
      const size = 0.5 + rand(seed + 51) * 1.6;
      const opacity = 0.15 + rand(seed + 71) * 0.4;
      particles.push({
        x: Math.max(0, Math.min(100, c.cx + dx)),
        y: Math.max(0, Math.min(100, c.cy + dy)),
        size,
        opacity,
      });
    }
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: `${p.y}%`,
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: GOLD,
            opacity: p.opacity,
            boxShadow: p.size > 1.4 ? `0 0 ${p.size * 2}px rgba(245,194,90,${p.opacity * 0.6})` : undefined,
            filter: "blur(0.3px)",
          }}
        />
      ))}
      {/* Center clarity mask — fade particles away from center. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(6,21,35,0.95) 0%, rgba(6,21,35,0.7) 35%, rgba(6,21,35,0) 75%)",
        }}
      />
    </div>
  );
}

