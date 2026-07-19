import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  Loader2,
  Minus,
  Plus,
  Presentation,
  MapPin,
  BedDouble,
  Utensils,
  Sparkles,
  FileText,
  ClipboardList,
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

export const Route = createFileRoute("/meetings-events")({
  component: BookMEPage,
  head: () => ({
    meta: [
      { title: "Book Meetings & Events — HotelGroupBook" },
      {
        name: "description",
        content:
          "Plan meetings, conferences and corporate events with the perfect venue, accommodation and catering.",
      },
    ],
  }),
});

const SERIF = '"Cormorant Garamond", Georgia, serif';
const GOLD = "#F5C25A";
const NAVY_BG = "#061523";
const PANEL_ACTIVE = "#0F2437";
const BORDER = "rgba(245, 194, 90, 0.35)";
const BORDER_SOFT = "rgba(245, 194, 90, 0.18)";

type StepKey = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const STEPS: {
  n: StepKey;
  title: string;
  sub: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}[] = [
  { n: 1, title: "Event Details", sub: "Type, dates & attendees", Icon: ClipboardList },
  { n: 2, title: "Location", sub: "Where to host", Icon: MapPin },
  { n: 3, title: "Accommodation", sub: "Rooms & nights", Icon: BedDouble },
  { n: 4, title: "Meeting Spaces", sub: "Rooms & setup", Icon: Presentation },
  { n: 5, title: "Catering", sub: "Food & beverage", Icon: Utensils },
  { n: 6, title: "Extras", sub: "AV, transfers & more", Icon: Sparkles },
  { n: 7, title: "Review & Submit", sub: "Confirm your request", Icon: FileText },
];

const EVENT_TYPES = [
  "Conference",
  "Corporate Meeting",
  "Product Launch",
  "Team Building",
  "Board Meeting",
  "Training / Workshop",
  "Gala Dinner",
  "Incentive Trip",
];

const CITIES = [
  "Oslo",
  "Bergen",
  "Stockholm",
  "Gothenburg",
  "Copenhagen",
  "Aarhus",
  "Helsinki",
  "Tampere",
  "Reykjavik",
  "Tromsø",
];

const ROOM_SETUPS = [
  "Theatre",
  "Classroom",
  "U-shape",
  "Boardroom",
  "Cabaret",
  "Banquet",
  "Reception",
];

const CATERING_OPTIONS = [
  "Breakfast",
  "Coffee Breaks",
  "Lunch",
  "Dinner",
  "Gala Dinner",
  "Cocktail Reception",
];

const AV_OPTIONS = [
  "Projector & Screen",
  "Sound System",
  "Wireless Microphones",
  "Stage & Lighting",
  "Live Streaming",
  "Simultaneous Translation",
];

const EXTRA_OPTIONS = [
  "Airport Transfers",
  "On-site Coordinator",
  "Branded Signage",
  "Photographer",
  "Entertainment",
  "Guided Excursion",
];

function BookMEPage() {
  const [step, setStep] = useState<StepKey>(1);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // Step 1 — Event Details
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState<string>("Conference");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [attendees, setAttendees] = useState<number>(50);

  // Step 2 — Location
  const [city, setCity] = useState<string>("Oslo");
  const [venuePreference, setVenuePreference] = useState<string>("Hotel");

  // Step 3 — Accommodation
  const [needsRooms, setNeedsRooms] = useState<boolean>(true);
  const [nights, setNights] = useState<number>(2);
  const [singleRooms, setSingleRooms] = useState<number>(10);
  const [doubleRooms, setDoubleRooms] = useState<number>(15);

  // Step 4 — Meeting Spaces
  const [numRooms, setNumRooms] = useState<number>(1);
  const [setupStyle, setSetupStyle] = useState<string>("Theatre");
  const [breakoutRooms, setBreakoutRooms] = useState<number>(0);

  // Step 5 — Catering
  const [catering, setCatering] = useState<Set<string>>(
    new Set(["Coffee Breaks", "Lunch"]),
  );
  const [dietary, setDietary] = useState<string>("");

  // Step 6 — Extras
  const [av, setAv] = useState<Set<string>>(new Set(["Projector & Screen"]));
  const [extras, setExtras] = useState<Set<string>>(new Set());

  // Step 7 — Contact / Review
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [confirmationRef, setConfirmationRef] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const totalRooms = singleRooms + doubleRooms;
  const roomCapacity = singleRooms + doubleRooms * 2;

  const goNext = () => {
    setDirection("forward");
    setStep((s) => (Math.min(7, s + 1) as StepKey));
  };
  const goBack = () => {
    setDirection("back");
    setStep((s) => (Math.max(1, s - 1) as StepKey));
  };

  const toggle = (
    set: Set<string>,
    setter: (s: Set<string>) => void,
    value: string,
  ) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  };

  const validateAll = (): string[] => {
    const errs: string[] = [];
    if (!eventName.trim()) errs.push("Event name is required.");
    if (!startDate || !endDate) errs.push("Start and end dates are required.");
    if (startDate && endDate && endDate < startDate)
      errs.push("End date must be after start date.");
    if (attendees < 1) errs.push("At least one attendee is required.");
    if (needsRooms && roomCapacity < attendees)
      errs.push(
        `Room capacity (${roomCapacity}) does not cover attendees (${attendees}).`,
      );
    if (!companyName.trim()) errs.push("Company name is required.");
    if (!contactName.trim()) errs.push("Contact name is required.");
    if (!/^\S+@\S+\.\S+$/.test(contactEmail))
      errs.push("A valid email is required.");
    if (!/^[+\d][\d\s()-]{6,}$/.test(contactPhone))
      errs.push("A valid phone number is required.");
    if (!agreed) errs.push("You must agree to the terms.");
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validateAll();
    setErrors(errs);
    if (errs.length) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    const year = new Date().getFullYear();
    const id = Math.floor(10000 + Math.random() * 89999);
    const ref = `HGB-ME-${year}-${id}`;
    const payload = {
      ref,
      createdAt: new Date().toISOString(),
      type: "meetings-events",
      eventName,
      eventType,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      attendees,
      city,
      venuePreference,
      needsRooms,
      nights,
      singleRooms,
      doubleRooms,
      numRooms,
      setupStyle,
      breakoutRooms,
      catering: Array.from(catering),
      dietary,
      av: Array.from(av),
      extras: Array.from(extras),
      companyName,
      contactName,
      contactEmail,
      contactPhone,
      notes,
    };
    try {
      const existing = JSON.parse(localStorage.getItem("hgb-requests") || "[]");
      existing.push(payload);
      localStorage.setItem("hgb-requests", JSON.stringify(existing));
    } catch {
      // ignore
    }
    setSubmitting(false);
    setConfirmationRef(ref);
  };

  if (confirmationRef) {
    return (
      <ConfirmationScreen
        reference={confirmationRef}
        onGoHome={() => navigate({ to: "/" })}
        onGoToRequests={() => navigate({ to: "/" })}
      />
    );
  }

  return (
    <main
      className="relative min-h-screen overflow-hidden text-white"
      style={{ backgroundColor: NAVY_BG }}
    >
      <GoldParticles />

      <div className="relative z-10 mx-auto flex max-w-[1360px] flex-col gap-8 px-6 py-10 lg:flex-row lg:px-10 lg:py-14">
        <Sidebar step={step} />

        <div className="flex-1">
          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <div className="text-xs uppercase tracking-[0.22em] text-white/50">
              Step {step} of 7
            </div>
          </div>

          <h1
            className="mb-2 text-[38px] leading-tight sm:text-[46px]"
            style={{ fontFamily: SERIF, color: "#F7EFDD" }}
          >
            Book Meetings &amp; Events
          </h1>
          <p className="mb-8 max-w-xl text-[15px] text-white/70">
            Tell us about your event and we&apos;ll design the perfect programme —
            venue, accommodation, catering and every detail in between.
          </p>

          {/* Card */}
          <div
            className={cn(
              "relative rounded-2xl bg-[#FCFAF6] p-6 text-[#0B1B2C] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] sm:p-8",
              "transition-all duration-300",
              direction === "forward" ? "animate-in slide-in-from-right-4" : "animate-in slide-in-from-left-4",
            )}
            key={step}
          >
            {step === 1 && (
              <StepEventDetails
                eventName={eventName}
                setEventName={setEventName}
                eventType={eventType}
                setEventType={setEventType}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                attendees={attendees}
                setAttendees={setAttendees}
              />
            )}
            {step === 2 && (
              <StepLocation
                city={city}
                setCity={setCity}
                venuePreference={venuePreference}
                setVenuePreference={setVenuePreference}
              />
            )}
            {step === 3 && (
              <StepAccommodation
                needsRooms={needsRooms}
                setNeedsRooms={setNeedsRooms}
                nights={nights}
                setNights={setNights}
                singleRooms={singleRooms}
                setSingleRooms={setSingleRooms}
                doubleRooms={doubleRooms}
                setDoubleRooms={setDoubleRooms}
                attendees={attendees}
                totalRooms={totalRooms}
                roomCapacity={roomCapacity}
              />
            )}
            {step === 4 && (
              <StepMeetingSpaces
                numRooms={numRooms}
                setNumRooms={setNumRooms}
                setupStyle={setupStyle}
                setSetupStyle={setSetupStyle}
                breakoutRooms={breakoutRooms}
                setBreakoutRooms={setBreakoutRooms}
              />
            )}
            {step === 5 && (
              <StepCatering
                catering={catering}
                onToggle={(v) => toggle(catering, setCatering, v)}
                dietary={dietary}
                setDietary={setDietary}
              />
            )}
            {step === 6 && (
              <StepExtras
                av={av}
                onToggleAv={(v) => toggle(av, setAv, v)}
                extras={extras}
                onToggleExtra={(v) => toggle(extras, setExtras, v)}
              />
            )}
            {step === 7 && (
              <StepReview
                companyName={companyName}
                setCompanyName={setCompanyName}
                contactName={contactName}
                setContactName={setContactName}
                contactEmail={contactEmail}
                setContactEmail={setContactEmail}
                contactPhone={contactPhone}
                setContactPhone={setContactPhone}
                notes={notes}
                setNotes={setNotes}
                agreed={agreed}
                setAgreed={setAgreed}
                summary={{
                  eventName,
                  eventType,
                  startDate,
                  endDate,
                  attendees,
                  city,
                  venuePreference,
                  needsRooms,
                  nights,
                  singleRooms,
                  doubleRooms,
                  numRooms,
                  setupStyle,
                  breakoutRooms,
                  catering: Array.from(catering),
                  av: Array.from(av),
                  extras: Array.from(extras),
                }}
                errors={errors}
              />
            )}

            {/* Nav */}
            <div className="mt-8 flex items-center justify-between border-t border-[#ECE6DA] pt-6">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 1 || submitting}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-[#0B1B2C] transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={16} /> Back
              </button>

              {step < 7 ? (
                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all"
                  style={{
                    background:
                      "linear-gradient(180deg, #16385A 0%, #0F2A47 100%)",
                    boxShadow:
                      "0 8px 24px -8px rgba(15,42,71,0.6), inset 0 1px 0 rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.16)",
                  }}
                >
                  Continue <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all disabled:opacity-70"
                  style={{
                    background:
                      "linear-gradient(180deg, #16385A 0%, #0F2A47 100%)",
                    boxShadow:
                      "0 8px 24px -8px rgba(15,42,71,0.6), inset 0 1px 0 rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.16)",
                  }}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Request <Check size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- Sidebar ---------- */

function Sidebar({ step }: { step: StepKey }) {
  return (
    <aside className="relative w-full shrink-0 lg:w-[280px]">
      <div className="relative pl-4">
        {/* vertical gold line */}
        <span
          aria-hidden
          className="absolute left-[29px] top-3 bottom-3 w-px"
          style={{
            background:
              "linear-gradient(180deg, rgba(245,194,90,0.05) 0%, rgba(245,194,90,0.55) 12%, rgba(245,194,90,0.55) 88%, rgba(245,194,90,0.05) 100%)",
          }}
        />
        <ul className="flex flex-col gap-3">
          {STEPS.map((s) => {
            const isActive = s.n === step;
            const isDone = s.n < step;
            return (
              <li key={s.n} className="relative flex items-center gap-4">
                <span
                  className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold transition-all duration-[250ms]"
                  style={{
                    backgroundColor: isActive
                      ? GOLD
                      : isDone
                        ? GOLD
                        : "transparent",
                    color: isActive || isDone ? "#0B1B2C" : "#FFFFFF",
                    border: `1px solid ${isActive || isDone ? GOLD : BORDER}`,
                    boxShadow: isActive
                      ? "0 0 0 4px rgba(245,194,90,0.14), 0 0 24px -4px rgba(245,194,90,0.6)"
                      : "none",
                  }}
                >
                  {isDone ? <Check size={16} strokeWidth={2.4} /> : s.n}
                </span>
                <div
                  className={cn(
                    "flex-1 rounded-xl px-3 py-2 transition-all duration-[250ms]",
                    isActive
                      ? "text-white"
                      : "text-white/70",
                  )}
                  style={{
                    backgroundColor: isActive ? PANEL_ACTIVE : "transparent",
                    border: `1px solid ${isActive ? BORDER : "transparent"}`,
                    boxShadow: isActive
                      ? "0 10px 30px -12px rgba(245,194,90,0.35)"
                      : undefined,
                  }}
                >
                  <div
                    className="text-[13.5px] font-medium leading-tight"
                    style={{ color: isActive ? "#F7EFDD" : undefined }}
                  >
                    {s.title}
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-white/55">
                    {s.sub}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}

/* ---------- Shared field bits ---------- */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1.5 block text-[12.5px] font-medium uppercase tracking-[0.14em] text-[#5B6472]">
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-[#E3DCC9] bg-white px-4 py-3 text-[14.5px] text-[#0B1B2C] outline-none transition focus:border-[#0F2A47] focus:ring-2 focus:ring-[#0F2A47]/10",
        props.className,
      )}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-lg border border-[#E3DCC9] bg-white px-4 py-3 text-[14.5px] text-[#0B1B2C] outline-none transition focus:border-[#0F2A47] focus:ring-2 focus:ring-[#0F2A47]/10",
        props.className,
      )}
    />
  );
}

function DropdownSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className="h-[46px] w-full rounded-lg border border-[#E3DCC9] bg-white pl-4 pr-11 text-[14.5px] text-[#0B1B2C] [&>svg]:hidden"
      >
        <SelectValue placeholder={placeholder} />
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#0B1B2C]"
        />
      </SelectTrigger>
      <SelectContent className="bg-white shadow-[0_20px_60px_-20px_rgba(11,27,44,0.35)]">
        {options.map((o) => (
          <SelectItem
            key={o}
            value={o}
            className="cursor-pointer text-[#0B1B2C] focus:bg-[#F5EFE1] focus:text-[#0B1B2C]"
          >
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function DateField({
  value,
  onChange,
  placeholder,
}: {
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
  placeholder: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-[46px] w-full items-center justify-between rounded-lg border border-[#E3DCC9] bg-white px-4 text-left text-[14.5px] text-[#0B1B2C] transition hover:border-[#0F2A47]"
        >
          <span className={cn(!value && "text-[#8A94A2]")}>
            {value ? format(value, "d MMM yyyy") : placeholder}
          </span>
          <CalendarIcon size={18} className="text-[#0B1B2C]" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}

function Counter({
  value,
  onChange,
  min = 0,
  max = 999,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-[#E3DCC9] bg-white p-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="grid h-9 w-9 place-items-center rounded-md text-[#0B1B2C] transition hover:bg-black/5"
        aria-label="decrease"
      >
        <Minus size={16} />
      </button>
      <span className="w-10 text-center text-[15px] font-semibold tabular-nums text-[#0B1B2C]">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="grid h-9 w-9 place-items-center rounded-md text-[#0B1B2C] transition hover:bg-black/5"
        aria-label="increase"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

function CheckboxPill({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13.5px] transition-all",
        checked
          ? "border-[#0F2A47] bg-[#0F2A47] text-white"
          : "border-[#E3DCC9] bg-white text-[#0B1B2C] hover:border-[#0F2A47]/40",
      )}
    >
      <span
        className={cn(
          "grid h-4 w-4 place-items-center rounded-[4px] border",
          checked ? "border-white bg-white/20" : "border-[#C6BFA9]",
        )}
      >
        {checked && <Check size={12} strokeWidth={3} className="text-white" />}
      </span>
      {label}
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="mb-6 text-[26px] leading-tight"
      style={{ fontFamily: SERIF, color: "#0B1B2C" }}
    >
      {children}
    </h2>
  );
}

/* ---------- Step components ---------- */

function StepEventDetails(props: {
  eventName: string;
  setEventName: (v: string) => void;
  eventType: string;
  setEventType: (v: string) => void;
  startDate: Date | undefined;
  setStartDate: (d: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (d: Date | undefined) => void;
  attendees: number;
  setAttendees: (n: number) => void;
}) {
  return (
    <div>
      <SectionTitle>Event Details</SectionTitle>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FieldLabel>Event Name</FieldLabel>
          <TextInput
            placeholder="e.g. Annual Sales Conference 2026"
            value={props.eventName}
            onChange={(e) => props.setEventName(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Event Type</FieldLabel>
          <DropdownSelect
            value={props.eventType}
            onChange={props.setEventType}
            options={EVENT_TYPES}
          />
        </div>
        <div>
          <FieldLabel>Expected Attendees</FieldLabel>
          <Counter
            value={props.attendees}
            onChange={props.setAttendees}
            min={1}
            max={5000}
          />
        </div>
        <div>
          <FieldLabel>Start Date</FieldLabel>
          <DateField
            value={props.startDate}
            onChange={props.setStartDate}
            placeholder="Select start date"
          />
        </div>
        <div>
          <FieldLabel>End Date</FieldLabel>
          <DateField
            value={props.endDate}
            onChange={props.setEndDate}
            placeholder="Select end date"
          />
        </div>
      </div>
    </div>
  );
}

function StepLocation(props: {
  city: string;
  setCity: (v: string) => void;
  venuePreference: string;
  setVenuePreference: (v: string) => void;
}) {
  return (
    <div>
      <SectionTitle>Location</SectionTitle>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel>City</FieldLabel>
          <DropdownSelect
            value={props.city}
            onChange={props.setCity}
            options={CITIES}
          />
        </div>
        <div>
          <FieldLabel>Venue Preference</FieldLabel>
          <DropdownSelect
            value={props.venuePreference}
            onChange={props.setVenuePreference}
            options={["Hotel", "Conference Centre", "Boutique Venue", "Resort", "Unique Space"]}
          />
        </div>
      </div>
    </div>
  );
}

function StepAccommodation(props: {
  needsRooms: boolean;
  setNeedsRooms: (v: boolean) => void;
  nights: number;
  setNights: (n: number) => void;
  singleRooms: number;
  setSingleRooms: (n: number) => void;
  doubleRooms: number;
  setDoubleRooms: (n: number) => void;
  attendees: number;
  totalRooms: number;
  roomCapacity: number;
}) {
  const covered = props.roomCapacity >= props.attendees;
  const missing = Math.max(0, props.attendees - props.roomCapacity);
  return (
    <div>
      <SectionTitle>Accommodation</SectionTitle>
      <div className="mb-6 flex flex-wrap gap-3">
        <CheckboxPill
          label="Yes, we need overnight rooms"
          checked={props.needsRooms}
          onChange={() => props.setNeedsRooms(true)}
        />
        <CheckboxPill
          label="No, day event only"
          checked={!props.needsRooms}
          onChange={() => props.setNeedsRooms(false)}
        />
      </div>
      {props.needsRooms && (
        <>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <FieldLabel>Nights</FieldLabel>
              <Counter value={props.nights} onChange={props.setNights} min={1} max={30} />
            </div>
            <div>
              <FieldLabel>Single Rooms</FieldLabel>
              <Counter value={props.singleRooms} onChange={props.setSingleRooms} />
            </div>
            <div>
              <FieldLabel>Double Rooms</FieldLabel>
              <Counter value={props.doubleRooms} onChange={props.setDoubleRooms} />
            </div>
          </div>
          <div
            className="mt-6 flex items-center gap-3 rounded-xl border p-4 transition-all duration-[250ms]"
            style={{
              backgroundColor: covered ? "#EAF8EF" : "#FDECEC",
              borderColor: covered ? "#BFE5CC" : "#F3C2C2",
              color: covered ? "#1F6B3A" : "#8A1F1F",
            }}
          >
            <div
              className="grid h-8 w-8 place-items-center rounded-full"
              style={{ backgroundColor: covered ? "#CDEAD6" : "#F6D5D5" }}
            >
              {covered ? <Check size={16} /> : <span className="font-bold">!</span>}
            </div>
            <div className="text-[13.5px]">
              {covered ? (
                <>
                  {props.totalRooms} rooms cover {props.roomCapacity} guests —
                  allocation is valid.
                </>
              ) : (
                <>Missing {missing} guest {missing === 1 ? "place" : "places"} — please add more rooms.</>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StepMeetingSpaces(props: {
  numRooms: number;
  setNumRooms: (n: number) => void;
  setupStyle: string;
  setSetupStyle: (v: string) => void;
  breakoutRooms: number;
  setBreakoutRooms: (n: number) => void;
}) {
  return (
    <div>
      <SectionTitle>Meeting Spaces</SectionTitle>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <FieldLabel>Main Meeting Rooms</FieldLabel>
          <Counter value={props.numRooms} onChange={props.setNumRooms} min={0} />
        </div>
        <div>
          <FieldLabel>Setup Style</FieldLabel>
          <DropdownSelect
            value={props.setupStyle}
            onChange={props.setSetupStyle}
            options={ROOM_SETUPS}
          />
        </div>
        <div>
          <FieldLabel>Breakout Rooms</FieldLabel>
          <Counter value={props.breakoutRooms} onChange={props.setBreakoutRooms} min={0} />
        </div>
      </div>
    </div>
  );
}

function StepCatering(props: {
  catering: Set<string>;
  onToggle: (v: string) => void;
  dietary: string;
  setDietary: (v: string) => void;
}) {
  return (
    <div>
      <SectionTitle>Catering</SectionTitle>
      <FieldLabel>Meals & Breaks</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {CATERING_OPTIONS.map((o) => (
          <CheckboxPill
            key={o}
            label={o}
            checked={props.catering.has(o)}
            onChange={() => props.onToggle(o)}
          />
        ))}
      </div>
      <div className="mt-6">
        <FieldLabel>Dietary Requirements</FieldLabel>
        <Textarea
          rows={4}
          placeholder="e.g. 5 vegetarian, 2 gluten-free, 1 halal…"
          value={props.dietary}
          onChange={(e) => props.setDietary(e.target.value)}
        />
      </div>
    </div>
  );
}

function StepExtras(props: {
  av: Set<string>;
  onToggleAv: (v: string) => void;
  extras: Set<string>;
  onToggleExtra: (v: string) => void;
}) {
  return (
    <div>
      <SectionTitle>Extras</SectionTitle>
      <FieldLabel>Audio / Visual</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {AV_OPTIONS.map((o) => (
          <CheckboxPill
            key={o}
            label={o}
            checked={props.av.has(o)}
            onChange={() => props.onToggleAv(o)}
          />
        ))}
      </div>
      <div className="mt-6">
        <FieldLabel>Additional Services</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {EXTRA_OPTIONS.map((o) => (
            <CheckboxPill
              key={o}
              label={o}
              checked={props.extras.has(o)}
              onChange={() => props.onToggleExtra(o)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepReview(props: {
  companyName: string;
  setCompanyName: (v: string) => void;
  contactName: string;
  setContactName: (v: string) => void;
  contactEmail: string;
  setContactEmail: (v: string) => void;
  contactPhone: string;
  setContactPhone: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  agreed: boolean;
  setAgreed: (v: boolean) => void;
  summary: {
    eventName: string;
    eventType: string;
    startDate?: Date;
    endDate?: Date;
    attendees: number;
    city: string;
    venuePreference: string;
    needsRooms: boolean;
    nights: number;
    singleRooms: number;
    doubleRooms: number;
    numRooms: number;
    setupStyle: string;
    breakoutRooms: number;
    catering: string[];
    av: string[];
    extras: string[];
  };
  errors: string[];
}) {
  const s = props.summary;
  const rows: [string, string][] = [
    ["Event", `${s.eventName || "—"} · ${s.eventType}`],
    [
      "Dates",
      s.startDate && s.endDate
        ? `${format(s.startDate, "d MMM yyyy")} – ${format(s.endDate, "d MMM yyyy")}`
        : "—",
    ],
    ["Attendees", `${s.attendees}`],
    ["Location", `${s.city} · ${s.venuePreference}`],
    [
      "Accommodation",
      s.needsRooms
        ? `${s.nights} nights · ${s.singleRooms} single / ${s.doubleRooms} double`
        : "Day event only",
    ],
    [
      "Meeting Spaces",
      `${s.numRooms} main (${s.setupStyle}) · ${s.breakoutRooms} breakout`,
    ],
    ["Catering", s.catering.length ? s.catering.join(", ") : "—"],
    ["AV", s.av.length ? s.av.join(", ") : "—"],
    ["Extras", s.extras.length ? s.extras.join(", ") : "—"],
  ];
  return (
    <div>
      <SectionTitle>Review &amp; Submit</SectionTitle>
      <div className="mb-6 overflow-hidden rounded-xl border border-[#ECE6DA]">
        {rows.map(([k, v], i) => (
          <div
            key={k}
            className={cn(
              "flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-6",
              i % 2 === 0 ? "bg-[#FBF7EE]" : "bg-white",
            )}
          >
            <div className="w-40 shrink-0 text-[12.5px] uppercase tracking-[0.14em] text-[#5B6472]">
              {k}
            </div>
            <div className="text-[14px] text-[#0B1B2C]">{v}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel>Company Name</FieldLabel>
          <TextInput
            value={props.companyName}
            onChange={(e) => props.setCompanyName(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Contact Name</FieldLabel>
          <TextInput
            value={props.contactName}
            onChange={(e) => props.setContactName(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Email</FieldLabel>
          <TextInput
            type="email"
            value={props.contactEmail}
            onChange={(e) => props.setContactEmail(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Phone</FieldLabel>
          <TextInput
            value={props.contactPhone}
            onChange={(e) => props.setContactPhone(e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>Additional Notes</FieldLabel>
          <Textarea
            rows={4}
            value={props.notes}
            onChange={(e) => props.setNotes(e.target.value)}
          />
        </div>
      </div>

      <label className="mt-5 inline-flex cursor-pointer items-start gap-3 text-[13.5px] text-[#0B1B2C]">
        <input
          type="checkbox"
          checked={props.agreed}
          onChange={(e) => props.setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#0F2A47]"
        />
        <span>
          I agree to the terms and understand this is a request — availability
          and pricing will be confirmed by our team.
        </span>
      </label>

      {props.errors.length > 0 && (
        <ul className="mt-4 space-y-1 rounded-lg border border-[#F3C2C2] bg-[#FDECEC] p-3 text-[13px] text-[#8A1F1F]">
          {props.errors.map((e) => (
            <li key={e}>• {e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Confirmation ---------- */

function ConfirmationScreen({
  reference,
  onGoHome,
  onGoToRequests,
}: {
  reference: string;
  onGoHome: () => void;
  onGoToRequests: () => void;
}) {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16 text-white"
      style={{ backgroundColor: NAVY_BG }}
    >
      <GoldParticles />
      <div className="relative z-10 flex w-full max-w-[560px] flex-col items-center rounded-3xl border p-10 text-center"
        style={{
          borderColor: BORDER,
          background: "linear-gradient(180deg, rgba(15,36,55,0.85) 0%, rgba(6,21,35,0.85) 100%)",
          boxShadow: "0 40px 100px -30px rgba(0,0,0,0.7)",
        }}
      >
        <div
          className="mb-6 grid h-24 w-24 place-items-center rounded-full"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #F5D98A, #B8892E 70%)",
            boxShadow: "0 0 60px -10px rgba(245,194,90,0.7)",
          }}
        >
          <Check size={44} strokeWidth={3} className="text-[#0B1B2C]" />
        </div>
        <h1
          className="mb-2 text-[40px] leading-tight"
          style={{ fontFamily: SERIF, color: "#F7EFDD" }}
        >
          Thank you!
        </h1>
        <p className="mb-6 text-white/70">
          Your meetings &amp; events request has been received. Our team will be in
          touch shortly with tailored proposals.
        </p>
        <div
          className="mb-8 rounded-lg border px-4 py-3 text-[13px] tracking-[0.14em] text-white/80"
          style={{ borderColor: BORDER_SOFT }}
        >
          Reference: <span className="text-[#F5C25A]">{reference}</span>
        </div>
        <div className="flex w-full flex-col gap-3">
          <button
            type="button"
            onClick={onGoToRequests}
            className="w-full rounded-xl px-6 py-4 text-[15px] font-medium transition-all hover:brightness-110"
            style={{
              color: GOLD,
              backgroundColor: "transparent",
              border: `1.5px solid ${GOLD}`,
              boxShadow:
                "0 0 0 1px rgba(245,194,90,0.10), 0 0 24px -6px rgba(245,194,90,0.45)",
            }}
          >
            Go to My Requests
          </button>
          <button
            type="button"
            onClick={onGoHome}
            className="w-full rounded-xl px-6 py-4 text-[15px] font-medium text-white transition-all hover:brightness-110"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            Back to Homepage
          </button>
        </div>
      </div>
    </main>
  );
}

/* ---------- Background particles ---------- */

function GoldParticles() {
  const particles = useMemo(() => {
    const rand = (seed: number) => {
      const x = Math.sin(seed * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    const TONES = ["#D4AF37", "#E1B955", "#F5D98A", "#B8892E", "#F2C14E"];
    type P = { x: number; y: number; size: number; opacity: number; color: string; blur: boolean; glow: boolean };
    const list: P[] = [];
    let seed = 0;
    const next = () => rand(++seed);
    for (let i = 0; i < 260; i++) {
      const side = i % 2 === 0 ? "left" : "right";
      const edgeDist = Math.pow(next(), 1.6) * 18;
      const x = side === "left" ? edgeDist : 100 - edgeDist;
      const y = next() * 100;
      const size = 0.4 + Math.pow(next(), 2) * 2.4;
      const fade = 1 - edgeDist / 18;
      const opacity = (0.18 + next() * 0.55) * (0.35 + fade * 0.65);
      list.push({
        x, y, size, opacity,
        color: TONES[Math.floor(next() * TONES.length)],
        blur: next() > 0.9,
        glow: size > 1.6 && next() > 0.7,
      });
    }
    const corners = [
      { cx: 0, cy: 0 }, { cx: 100, cy: 0 }, { cx: 0, cy: 100 }, { cx: 100, cy: 100 },
    ];
    corners.forEach((c) => {
      for (let i = 0; i < 90; i++) {
        const rx = Math.pow(next(), 1.4) * 26;
        const ry = Math.pow(next(), 1.4) * 30;
        const x = c.cx === 0 ? rx : 100 - rx;
        const y = c.cy === 0 ? ry : 100 - ry;
        const size = 0.4 + Math.pow(next(), 2) * 2.6;
        const dist = Math.max(rx / 26, ry / 30);
        const opacity = (0.22 + next() * 0.55) * (1 - dist * 0.55);
        list.push({
          x, y, size, opacity,
          color: TONES[Math.floor(next() * TONES.length)],
          blur: next() > 0.88,
          glow: size > 1.7 && next() > 0.65,
        });
      }
    });
    return list;
  }, []);

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
            backgroundColor: p.color,
            opacity: p.opacity,
            boxShadow: p.glow
              ? `0 0 ${p.size * 3}px rgba(245,194,90,${Math.min(0.6, p.opacity * 0.9)})`
              : undefined,
            filter: p.blur ? "blur(0.8px)" : "blur(0.25px)",
          }}
        />
      ))}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 62% 58% at 50% 50%, rgba(6,21,35,1) 0%, rgba(6,21,35,0.92) 30%, rgba(6,21,35,0.55) 55%, rgba(6,21,35,0) 82%)",
        }}
      />
    </div>
  );
}
