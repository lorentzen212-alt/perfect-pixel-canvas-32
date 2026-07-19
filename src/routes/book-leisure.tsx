import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
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

            <div className="relative p-6 sm:p-10 lg:px-14 lg:py-12">
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
                    className="rounded-[26px] p-6 sm:p-8 lg:p-10"
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
                      />
                    )}

                    <div className="mt-8">
                      <PrimaryButton
                        onClick={() =>
                          step < 3 && go((step + 1) as StepKey)
                        }
                        label={
                          step === 1
                            ? "Get Hotel Offers"
                            : step === 2
                              ? "Continue"
                              : "Submit Request"
                        }
                      />
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
        .animate-slide-in-right { animation: slide-in-right 350ms ease-out; }
        .animate-slide-in-left { animation: slide-in-left 350ms ease-out; }
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
        className="inline-flex items-center gap-2 text-[14px] font-medium"
        style={{ color: "#E4E7EC" }}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back
      </Link>

      <div className="relative mt-10">
        {/* Dotted vertical line - centered through circles (circle w=44 -> center 22) */}
        <div
          className="absolute left-[22px] top-[44px] bottom-[44px] w-px -translate-x-1/2"
          style={{
            backgroundImage: `linear-gradient(to bottom, ${GOLD_SOFT} 50%, transparent 50%)`,
            backgroundSize: "1px 6px",
            backgroundRepeat: "repeat-y",
            opacity: 0.55,
          }}
          aria-hidden="true"
        />

        <div className="flex flex-col gap-5">
          {STEPS.map(({ n, title, sub, Icon }) => {
            const active = step === n;
            return (
              <button
                key={n}
                type="button"
                onClick={() => onGo(n)}
                className="relative flex items-start gap-4 text-left"
              >
                <span
                  className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[15px] font-semibold transition-all"
                  style={{
                    backgroundColor: active ? GOLD : NAVY_BG,
                    color: active ? "#0A1626" : GOLD,
                    border: `1.5px solid ${GOLD}`,
                    boxShadow: active
                      ? "0 0 0 4px rgba(245,194,90,0.12), 0 6px 20px -8px rgba(245,194,90,0.5)"
                      : "none",
                  }}
                >
                  {n}
                </span>

                <div
                  className="flex-1 min-w-0 rounded-2xl px-4 py-3 -my-1 transition-all"
                  style={
                    active
                      ? {
                          backgroundColor: PANEL_ACTIVE,
                          border: `1px solid ${BORDER}`,
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
                        }
                      : {
                          border: "1px solid transparent",
                        }
                  }
                >
                  <div className="flex items-center justify-end">
                    <Icon size={18} strokeWidth={1.6} style={{ color: GOLD }} />
                  </div>
                  <div
                    className="mt-1 text-[18px] font-medium"
                    style={{
                      color: active ? GOLD : "#E8E8E4",
                      fontFamily: SERIF,
                    }}
                  >
                    {title}
                  </div>
                  <div className="text-[13px]" style={{ color: "#8B96A3" }}>
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_minmax(260px,1fr)_minmax(220px,0.9fr)_minmax(280px,1.45fr)] gap-8 xl:gap-0">
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
              <SelectItem key={code} value={code}>
                <span className="flex items-center gap-2">
                  <Flag />
                  <span>{name}</span>
                </span>
              </SelectItem>
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
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
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
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
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
      >
        <p className="text-[14px] text-[#6B7280]">
          Tell us more about your request...
        </p>
        <textarea
          value={props.notes}
          onChange={(e) => props.setNotes(e.target.value)}
          rows={10}
          placeholder="We would like a hotel near the city center. Please include options with dinner and meeting room."
          className="mt-3 min-h-[340px] w-full overflow-y-auto rounded-2xl bg-white p-6 text-[14.5px] leading-relaxed text-[#0A1626] outline-none placeholder:text-[#9AA3AF] resize-none scrollbar-hidden"
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
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[300px]">
      <div>
        <FieldLabel>Full Name</FieldLabel>
        <InputBox value={props.fullName} onChange={props.setFullName} placeholder="Ola Nordmann" />
        <FieldLabel className="mt-5">Email</FieldLabel>
        <InputBox value={props.email} onChange={props.setEmail} placeholder="you@example.com" type="email" />
      </div>
      <div>
        <FieldLabel>Company</FieldLabel>
        <InputBox value={props.company} onChange={props.setCompany} placeholder="Optional" />
        <FieldLabel className="mt-5">Phone</FieldLabel>
        <InputBox value={props.phone} onChange={props.setPhone} placeholder="+47 000 00 000" type="tel" />
      </div>
    </div>
  );
}

/* ---------- Primitives ---------- */

function ColumnBlock({
  icon,
  title,
  children,
  divider = false,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  divider?: boolean;
}) {
  return (
    <div
      className={cn("relative flex flex-col xl:pl-6", divider && "xl:ml-0")}
      style={{
        borderLeft: divider ? `1px solid ${DIVIDER}` : undefined,
      }}
    >
      <div className="xl:pr-5">
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
  "flex h-[50px] w-full items-center justify-between rounded-xl bg-white pl-6 pr-5",
  "cursor-pointer transition-shadow hover:shadow-md",
  "border border-[#E4DED2] shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
  "text-left [&>span]:line-clamp-1 focus:outline-none focus:ring-0",
);


function StyledSelectTrigger({ children }: { children: React.ReactNode }) {
  return (
    <SelectTrigger className={styledSelectTriggerClass}>
      <SelectValue asChild>
        <span className="flex items-center gap-3 min-w-0">{children}</span>
      </SelectValue>
      <ChevronDown size={16} strokeWidth={1.8} className="shrink-0 text-[#5B6472]" />
    </SelectTrigger>
  );
}

const destinationSelectTriggerClass = cn(
  "flex h-[50px] w-full items-center justify-between rounded-xl bg-white pl-6 pr-7",
  "cursor-pointer transition-shadow hover:shadow-md",
  "border border-[#E4DED2] shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
  "text-left [&>span]:line-clamp-1 focus:outline-none focus:ring-0",
);

function DestinationSelectTrigger({ children }: { children: React.ReactNode }) {
  return (
    <SelectTrigger className={destinationSelectTriggerClass}>
      <SelectValue asChild>
        <span className="flex items-center gap-3 min-w-0">{children}</span>
      </SelectValue>
      <ChevronDown size={16} strokeWidth={1.8} className="shrink-0 text-[#5B6472]" />
    </SelectTrigger>
  );
}

function StyledSelectContent({ children }: { children: React.ReactNode }) {
  return (
    <SelectContent className="z-[100] max-h-[280px] bg-white">
      {children}
    </SelectContent>
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
  const particles = [
    { top: "2%", left: "1%", size: 2, opacity: 0.4 },
    { top: "5%", left: "4%", size: 1, opacity: 0.3 },
    { top: "8%", left: "1.5%", size: 1.5, opacity: 0.35 },
    { top: "14%", left: "3%", size: 1, opacity: 0.25 },
    { top: "22%", left: "0.8%", size: 1.5, opacity: 0.3 },
    { top: "36%", left: "2%", size: 2, opacity: 0.35 },
    { top: "50%", left: "1%", size: 1, opacity: 0.25 },
    { top: "64%", left: "3%", size: 1.5, opacity: 0.3 },
    { top: "78%", left: "1.2%", size: 1, opacity: 0.25 },
    { top: "90%", left: "2.5%", size: 2, opacity: 0.4 },
    { top: "96%", left: "6%", size: 1, opacity: 0.25 },
    { top: "2%", right: "2%", size: 1.5, opacity: 0.35 },
    { top: "6%", right: "5%", size: 1, opacity: 0.25 },
    { top: "12%", right: "1%", size: 2, opacity: 0.4 },
    { top: "24%", right: "3%", size: 1, opacity: 0.25 },
    { top: "38%", right: "1.5%", size: 1.5, opacity: 0.3 },
    { top: "52%", right: "4%", size: 1, opacity: 0.25 },
    { top: "68%", right: "1%", size: 2, opacity: 0.35 },
    { top: "82%", right: "3%", size: 1, opacity: 0.25 },
    { top: "94%", right: "2%", size: 1.5, opacity: 0.35 },
    { top: "97%", right: "8%", size: 1, opacity: 0.25 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: (p as { left?: string }).left,
            right: (p as { right?: string }).right,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: GOLD,
            opacity: p.opacity,
            boxShadow: `0 0 6px rgba(245,194,90,${p.opacity * 0.8})`,
          }}
        />
      ))}
    </div>
  );
}
