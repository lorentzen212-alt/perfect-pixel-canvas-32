
import { supabase } from "@/integrations/supabase/client";
import { BrandLogo } from "@/components/BrandLogo";
import { upsertProfile, useAuth } from "@/lib/auth";
import { createBooking, nightsBetween, type NewBookingInput } from "@/lib/bookingsApi";
import { savePendingRequest, clearPendingRequest } from "@/lib/pendingRequest";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";


import { cn } from "@/lib/utils";
import { GOLD, HAIR, INK, IVORY, IVORY_SOFT, MUTED, NAVY_DEEP, SERIF } from "@/features/leisure/tokens";
import { CITIES, COUNTRIES, STEP_META } from "@/features/leisure/data";
import type { CountryCode, LeisureStay, StepKey } from "@/features/leisure/types";

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
   Main Component
   ============================================================= */

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
import { PrimaryButton } from "@/features/leisure/legacy/primitives";
import { ConfirmationScreen } from "@/features/leisure/legacy/ConfirmationScreen";
import { ChapterTrack, HeroPanel, StepAccommodation, StepContact, StepDestination, StepExperiences, StepExtras, StepReview } from "@/features/leisure/legacy/LegacySteps";
import { LeisureStep1Screen } from "@/features/leisure/step1/Step1Screen";
import { LeisureStep3Screen } from "@/features/leisure/step3/Step3Screen";
import { LeisureStep4Screen } from "@/features/leisure/step4/Step4Screen";
import { S5_COUNTRIES } from "@/features/leisure/step5/fields";
import { LeisureStep5Screen } from "@/features/leisure/step5/Step5Screen";
import { LeisureStep6Screen } from "@/features/leisure/step6/Step6Screen";
import { LeisureStep2Screen } from "@/features/leisure/step2/Step2Screen";






/* =============================================================
   Step 1 — shared destination data model
   ============================================================= */





/* =============================================================
   Step 1 — sub-components
   ============================================================= */






/* =============================================================
   LEISURE STEP 2 — Accommodation (dark navy premium)
   ============================================================= */









































/* =========================================================
   STEP 3 - Concierge Collection (redesigned)
   ========================================================= */


/* ---- Smart configuration metadata for expandable service panels ---- */







/* -------- Smart configuration panel components -------- */











/* =========================================================
   STEP 4 - Experiences (redesigned)
   ========================================================= */







/* =========================================================
   STEP 5 - Contact (redesigned)
   ========================================================= */














/* =========================================================
   STEP 6 - Review (redesigned)
   ========================================================= */

/* Step 6 champagne-gold palette (colour only) */









