import { NextButton } from "@/features/me/common/buttons";
import type { CateringId, CateringServing, MeetingRoomLite } from "@/features/me/step4/data";
import { CATERING_DEFS, DIETARY_OPTIONS, DRINK_OPTIONS, HOTEL_LOCATIONS } from "@/features/me/step4/data";
import { CateringCarousel, SquareCheckbox } from "@/features/me/step4/parts";
import { GOLD, SANS, SERIF } from "@/features/me/tokens";
import { setMeSection } from "@/lib/meDraftStore";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, ChefHat, ChevronDown, Clock, Coffee, GlassWater, Info, MapPin, Minus, Pencil, Plus, ShieldCheck, Sparkles, Trash2, Users, Utensils, UtensilsCrossed, Wine } from "lucide-react";
import React from "react";
import { useEffect, useMemo, useState } from "react";

export function StepFourCatering({
  onBack,
  onNext,
  direction,
}: {
  onBack: () => void;
  onNext: () => void;
  direction: "forward" | "back";
}) {
  // Load persisted data from previous steps
  const [meetingRooms, setMeetingRooms] = useState<MeetingRoomLite[]>([]);
  const [guestCount, setGuestCount] = useState<number>(0);
  const [recommended, setRecommended] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const rr = window.localStorage.getItem("hgb:meeting-rooms");
      if (rr) {
        const parsed = JSON.parse(rr) as MeetingRoomLite[];
        if (Array.isArray(parsed)) setMeetingRooms(parsed);
      }
      const gc = window.localStorage.getItem("hgb:guest-count");
      const attn = window.localStorage.getItem("hgb:attendees");
      const g = Number(gc) || Number(attn) || 0;
      setGuestCount(g);
      const rec = window.localStorage.getItem("hgb:catering-recommended");
      if (rec) {
        const arr = JSON.parse(rec) as string[];
        if (Array.isArray(arr)) setRecommended(arr);
      }
      const saved = window.localStorage.getItem("hgb:catering-state");
      if (saved) {
        const st = JSON.parse(saved);
        if (st?.selected) setSelected(st.selected);
        if (st?.servings) setServings(st.servings);
        if (st?.dietary) setDietary(st.dietary);
        if (st?.dietaryOther) setDietaryOther(st.dietaryOther);
        if (st?.drinks) setDrinks(st.drinks);
        if (st?.notes) setNotes(st.notes);
      }
    } catch {
      /* non-fatal */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fallback demo rooms if none persisted, so page is usable when landing directly.
  const effectiveRooms: MeetingRoomLite[] = useMemo(() => {
    if (meetingRooms.length) return meetingRooms;
    return [
      { id: "m1", name: "Main Conference Room", attendees: guestCount || 65 },
      { id: "m2", name: "Breakout Room A", attendees: 20 },
      { id: "m3", name: "Breakout Room B", attendees: 20 },
    ];
  }, [meetingRooms, guestCount]);

  const effectiveGuests = guestCount || effectiveRooms[0]?.attendees || 0;

  const [selected, setSelected] = useState<Record<CateringId, boolean>>(
    {} as Record<CateringId, boolean>,
  );
  const [servings, setServings] = useState<CateringServing[]>([]);
  const [dietary, setDietary] = useState<string[]>([]);
  const [dietaryOther, setDietaryOther] = useState("");
  const [drinks, setDrinks] = useState<string[]>(["Coffee & Tea", "Wine"]);
  const [notes, setNotes] = useState("");
  const [openLocId, setOpenLocId] = useState<string | null>(null);
  const [openVariantId, setOpenVariantId] = useState<string | null>(null);
  const [recommendationVisible, setRecommendationVisible] = useState(true);
  const [recommendationRendered, setRecommendationRendered] = useState(true);

  // Persist state
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        "hgb:catering-state",
        JSON.stringify({ selected, servings, dietary, dietaryOther, drinks, notes }),
      );
    } catch {
      /* non-fatal */
    }
  }, [selected, servings, dietary, dietaryOther, drinks, notes]);

  // Commit catering into shared draft.
  useEffect(() => {
    setMeSection(
      "catering",
      servings.map((s) => {
        const def = CATERING_DEFS.find((d) => d.id === s.catering);
        return {
          servingId: s.id,
          cateringId: s.catering,
          label: def?.label ?? s.catering,
          time: s.time,
          location: s.location,
          locationOther: s.locationOther,
          variant: s.variant,
        };
      }),
    );
  }, [servings]);

  useEffect(() => {
    setMeSection("cateringExtras", { dietary, dietaryOther, drinks, notes });
  }, [dietary, dietaryOther, drinks, notes]);

  const locationOptions = useMemo(
    () => [...effectiveRooms.map((r) => r.name), ...HOTEL_LOCATIONS],
    [effectiveRooms],
  );

  const findDef = (id: CateringId) => CATERING_DEFS.find((d) => d.id === id)!;

  const addServingForCatering = (id: CateringId) => {
    const def = findDef(id);
    const newId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setServings((prev) => [
      ...prev,
      {
        id: newId,
        catering: id,
        time: def.defaultTime,
        location: def.defaultLocation,
        variant: undefined,
        included: true,
      },
    ]);
    setSelected((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    if (def.variants) setOpenVariantId(newId);
    else setOpenVariantId(null);
    return newId;
  };

  const toggleCatering = (id: CateringId) => {
    const existingList = servings.filter((s) => s.catering === id);
    if (existingList.length > 0) {
      // Already selected → clicking the card again deselects it entirely
      // (removes all servings for this catering type and closes any open variant).
      setServings((prev) => prev.filter((s) => s.catering !== id));
      setSelected((sel) => ({ ...sel, [id]: false }));
      setOpenVariantId((cur) =>
        existingList.some((s) => s.id === cur) ? null : cur,
      );
      return;
    }
    addServingForCatering(id);
  };


  const updateServing = (id: string, patch: Partial<CateringServing>) => {
    setServings((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const removeServing = (id: string) => {
    setServings((prev) => {
      const removed = prev.find((s) => s.id === id);
      const next = prev.filter((s) => s.id !== id);
      if (removed && !next.some((s) => s.catering === removed.catering)) {
        setSelected((sel) => ({ ...sel, [removed.catering]: false }));
      }
      return next;
    });
    setOpenVariantId((cur) => (cur === id ? null : cur));
  };

  const addAnotherServing = () => {
    const base = servings[servings.length - 1];
    const cid = base?.catering ?? "coffee";
    addServingForCatering(cid);
  };

  const applyRecommendation = () => {
    const wanted: CateringId[] = ["coffee", "lunch"];
    wanted.forEach((id) => {
      const existing = servings.find((s) => s.catering === id);
      if (!existing) {
        addServingForCatering(id);
      } else {
        const def = findDef(id);
        if (def.variants && !existing.variant) {
          setOpenVariantId(existing.id);
        }
      }
    });
  };

  const dismissRecommendation = () => {
    setRecommendationVisible(false);
    setTimeout(() => setRecommendationRendered(false), 300);
  };

  const toggleFrom = (
    val: string,
    list: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
    );
  };
  void toggleFrom;

  // Group servings by location for overview
  const overviewGroups = useMemo(() => {
    const map = new Map<string, { time: string; label: string }[]>();
    // seed with all effective rooms
    effectiveRooms.forEach((r) => map.set(r.name, []));
    servings
      .filter((s) => s.included)
      .forEach((s) => {
        const def = findDef(s.catering);
        const loc =
          s.location === "Other (please specify)"
            ? s.locationOther?.trim() || "Other"
            : s.location;
        const label = s.variant ? `${def.label} (${s.variant})` : def.label;
        const arr = map.get(loc) ?? [];
        arr.push({ time: s.time, label });
        map.set(loc, arr);
      });
    // sort each group by time
    return Array.from(map.entries()).map(([loc, items]) => ({
      loc,
      items: items.sort((a, b) => a.time.localeCompare(b.time)),
    }));
  }, [servings, effectiveRooms]);

  const locationsWithCatering = overviewGroups.filter((g) => g.items.length > 0).length;

  return (
    <div
      className={
        ""
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* LEFT — main panel */}
        <div
          className="overflow-hidden rounded-[20px] p-6 sm:p-8 lg:p-10"
          style={{
            backgroundColor: "#FAF8F4",
            backgroundImage:
              "linear-gradient(180deg, #FCFAF5 0%, #F8F5EE 55%, #F3EFE6 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,251,240,0.7), 0 1px 0 rgba(90,72,44,0.05), 0 20px 44px -34px rgba(60,48,28,0.14)",
            border: "1px solid #E7DFCE",
          }}
        >
          {/* Header row */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <button
                type="button"
                onClick={onBack}
                className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium text-[#0A1B2C] hover:text-[#B88A2E] transition-colors"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <h2
                className="text-[#0A1B2C] text-3xl lg:text-[34px] leading-tight"
                style={{ fontFamily: SERIF }}
              >
                Step 4 – Catering
              </h2>
              <div className="mt-2 h-[2px] w-16" style={{ backgroundColor: GOLD }} />
              <p className="mt-4 text-[#4A5866] text-[15px] max-w-xl leading-relaxed">
                Select the catering you would like to include in your event and
                choose where it should be served.
              </p>
            </div>

            {/* Apply Recommendation card */}
            {recommendationRendered && (
              <div
                className={cn(
                   "rounded-[14px] p-5 w-full lg:w-[380px] transition-opacity duration-300 ease-out origin-top",
                  recommendationVisible
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                )}
                style={{
                  background:
                    "linear-gradient(180deg, #FFFDF6 0%, #FBF6E7 100%)",
                  border: "1px solid #EBDDB4",
                  boxShadow: "0 10px 26px -18px rgba(184,138,46,0.35)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={16} style={{ color: "#B88A2E" }} />
                  <span
                    className="text-[15px] font-semibold"
                    style={{ color: "#7C5A16", fontFamily: SERIF }}
                  >
                    Apply Recommendation
                  </span>
                </div>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#6E5A2E]">
                  Based on {effectiveGuests || "your"} guests and your selected
                  rooms, we recommend:
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border px-3 h-8 text-[12px] font-medium text-[#0A1B2C] bg-white" style={{ borderColor: "#E3D2A1" }}>
                    Morning Coffee Break
                  </span>
                  <span className="inline-flex items-center rounded-full border px-3 h-8 text-[12px] font-medium text-[#0A1B2C] bg-white" style={{ borderColor: "#E3D2A1" }}>
                    Lunch (Buffet)
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={dismissRecommendation}
                    className="inline-flex items-center justify-center rounded-full h-8 px-4 text-[12.5px] font-semibold text-[#3A3A3A] transition-all duration-200 hover:bg-[#F7F4EC] hover:shadow-md"
                    style={{
                      background: "#FDFBF6",
                      border: "1px solid #D9C07A",
                      boxShadow: "0 4px 10px -4px rgba(184,138,46,0.18), inset 0 1px 0 rgba(255,255,255,0.8)",
                    }}
                  >
                    No, thanks
                  </button>
                  <button
                    type="button"
                    onClick={applyRecommendation}
                    className="inline-flex items-center gap-1.5 rounded-full h-8 px-4 text-[12.5px] font-semibold text-[#0A1B2C] transition-all duration-200 hover:brightness-105"
                    style={{
                      background:
                        "linear-gradient(180deg,#F7D97A 0%, #D4AF37 55%, #B88917 100%)",
                      border: "1px solid rgba(184,137,23,0.85)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.45), 0 6px 14px -8px rgba(184,137,23,0.55)",
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Catering cards */}
          <CateringCarousel
            defs={CATERING_DEFS}
            selected={selected}
            onToggle={toggleCatering}
          />


          {/* Plan & Choose Where to Serve */}
          <div
            className="mt-8 rounded-[14px] p-5 sm:p-6"
            style={{ background: "#FBFAF6", border: "1px solid #ECE6D6" }}
          >
            <h3
              className="text-[15.5px] font-semibold text-[#0A1B2C]"
              style={{ fontFamily: SANS }}
            >
              Plan &amp; Choose Where to Serve
            </h3>

            {servings.length === 0 ? (
              <p className="mt-3 text-[13.5px] text-[#6E7A88]">
                Select one or more catering options above to plan servings.
              </p>
            ) : (
              <>
                <div className="mt-4 hidden md:grid grid-cols-[minmax(180px,1.2fr)_120px_1fr_44px_44px] gap-3 text-[12px] font-semibold uppercase tracking-wide text-[#6E7A88]">
                  <span>Selected Catering</span>
                  <span>When</span>
                  <span className="flex items-center gap-1.5">
                    Serving Location <Info size={12} />
                  </span>
                  <span />
                  <span />
                </div>

                <div className="mt-3 flex flex-col gap-2.5">
                  {servings.map((s) => {
                    const def = findDef(s.catering);
                    const Icon = def.icon;
                    const isOpen = def.variants && openVariantId === s.id;
                    return (
                      <div key={s.id} className="flex flex-col">
                      <div
                        className="grid grid-cols-1 md:grid-cols-[minmax(180px,1.2fr)_120px_1fr_44px_44px] gap-3 items-center rounded-[10px] px-3 py-2.5"
                        style={{
                          background: "#FAF8F4",
                          border: "1px solid #E7DFCE",
                          borderBottomLeftRadius: isOpen ? 0 : 10,
                          borderBottomRightRadius: isOpen ? 0 : 10,
                        }}
                      >
                        {/* Label + thumbnail */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="h-10 w-10 shrink-0 rounded-md bg-cover bg-center"
                            style={{ backgroundImage: `url(${def.image})` }}
                            aria-hidden
                          />
                          <div className="min-w-0">
                            <div className="text-[14px] font-medium text-[#0A1B2C] truncate flex items-center gap-1.5">
                              <Icon size={13} style={{ color: "#B88A2E" }} />
                              {def.label}
                            </div>
                            {def.variants && (
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenVariantId(openVariantId === s.id ? null : s.id)
                                }
                                className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] text-[#6E7A88] hover:text-[#B88A2E]"
                                aria-expanded={openVariantId === s.id}
                              >
                                {s.variant ?? def.variants.default}
                                <ChevronDown
                                  size={11}
                                  style={{
                                    transition: "transform 240ms ease",
                                    transform:
                                      openVariantId === s.id ? "rotate(180deg)" : "none",
                                  }}
                                />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* When */}
                        <div className="relative">
                          <Clock
                            size={13}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2"
                            style={{ color: "#B88A2E" }}
                          />
                          <input
                            type="time"
                            value={s.time}
                            onChange={(e) => updateServing(s.id, { time: e.target.value })}
                            className="w-full h-[38px] rounded-md text-[13px] text-[#0A1B2C] pl-8 pr-2 outline-none"
                            style={{ background: "#FAF8F4", border: "1px solid #E8E0D3" }}
                          />
                        </div>

                        {/* Serving location dropdown */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenLocId(openLocId === s.id ? null : s.id)
                            }
                            className="w-full h-[38px] rounded-md pl-8 pr-8 text-left text-[13px] text-[#0A1B2C] flex items-center"
                            style={{
                              background: "#FAF8F4",
                              border: "1px solid #E8E0D3",
                            }}
                          >
                            <MapPin
                              size={13}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2"
                              style={{ color: "#B88A2E" }}
                            />
                            <span className="truncate">
                              {s.location === "Other (please specify)"
                                ? s.locationOther || "Other (please specify)"
                                : s.location}
                            </span>
                            <ChevronDown
                              size={14}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6E7A88]"
                            />
                          </button>
                          {openLocId === s.id && (
                            <div
                              className="absolute z-30 mt-1 w-full rounded-md py-1 text-[13px] max-h-[240px] overflow-auto"
                              style={{
                                background: "#FAF8F4",
                                border: "1px solid #E7DEC4",
                                boxShadow:
                                  "0 12px 28px -14px rgba(10,27,44,0.20)",
                              }}
                            >
                              {locationOptions.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    updateServing(s.id, { location: opt });
                                    setOpenLocId(null);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-1.5 text-left hover:bg-[#FBF6E7] text-[#0A1B2C]"
                                >
                                  <MapPin size={12} style={{ color: "#B88A2E" }} />
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                          {s.location === "Other (please specify)" && (
                            <input
                              type="text"
                              placeholder="Specify location"
                              value={s.locationOther ?? ""}
                              onChange={(e) =>
                                updateServing(s.id, { locationOther: e.target.value })
                              }
                              className="mt-1.5 w-full h-[32px] rounded-md px-2 text-[12.5px] text-[#0A1B2C] outline-none"
                              style={{
                                background: "#FAF8F4",
                                border: "1px solid #E8E0D3",
                              }}
                            />
                          )}
                        </div>

                        {/* Included toggle */}
                        <button
                          type="button"
                          onClick={() =>
                            updateServing(s.id, { included: !s.included })
                          }
                          aria-pressed={s.included}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md justify-self-start md:justify-self-center"
                          style={{
                            background: s.included
                              ? "linear-gradient(180deg,#F7D97A 0%, #D4AF37 55%, #B88917 100%)"
                              : "#F4F1E7",
                            border: s.included
                              ? "1px solid rgba(184,137,23,0.85)"
                              : "1px solid #E4DDC8",
                          }}
                          title={s.included ? "Included" : "Excluded"}
                        >
                          {s.included ? (
                            <Check size={14} strokeWidth={3} style={{ color: "#0A1B2C" }} />
                          ) : (
                            <Minus size={14} style={{ color: "#6E7A88" }} />
                          )}
                        </button>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeServing(s.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#6E7A88] hover:bg-[#F4EDE0]"
                          style={{ border: "1px solid #E7E1CE" }}
                          title="Remove"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {isOpen && def.variants && (
                        <div
                          className="rounded-b-[10px] px-4 sm:px-5 pt-4 pb-5"
                          style={{
                            background: "#FBFAF6",
                            borderLeft: "1px solid #EFEAD8",
                            borderRight: "1px solid #EFEAD8",
                            borderBottom: "1px solid #EFEAD8",
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[13px] font-semibold text-[#0A1B2C]"
                              style={{ fontFamily: SANS }}
                            >
                              Choose menu type
                            </span>
                            <span
                              aria-hidden
                              className="h-px flex-1"
                              style={{
                                background:
                                  "linear-gradient(90deg, rgba(184,138,46,0.35), rgba(184,138,46,0))",
                              }}
                            />
                          </div>
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                            {def.variants.options.map((v) => {
                              const selected = (s.variant ?? def.variants!.default) === v;
                              return (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => {
                                    updateServing(s.id, { variant: v });
                                    setOpenVariantId(null);
                                  }}
                                  className="group relative flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-left transition"
                                  style={{
                                    background: "#FFFDF7",
                                    border: selected
                                      ? "1.5px solid #C9A24B"
                                      : "1px solid #E7DEC4",
                                    boxShadow: selected
                                      ? "0 6px 18px -10px rgba(184,138,46,0.45), inset 0 0 0 1px rgba(255,255,255,0.6)"
                                      : "0 1px 2px rgba(10,27,44,0.04)",
                                  }}
                                  aria-pressed={selected}
                                >
                                  <span
                                    className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                                    style={{
                                      border: selected
                                        ? "1.5px solid #B88A2E"
                                        : "1.5px solid #D9C79A",
                                      background: "#FAF8F4",
                                    }}
                                  >
                                    {selected && (
                                      <span
                                        className="h-2 w-2 rounded-full"
                                        style={{
                                          background:
                                            "linear-gradient(180deg,#F7D97A 0%, #D4AF37 55%, #B88917 100%)",
                                        }}
                                      />
                                    )}
                                  </span>
                                  <span
                                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
                                    style={{
                                      background:
                                        "linear-gradient(180deg,#FBF3DE 0%, #F3E4B8 100%)",
                                      border: "1px solid #E6D3A0",
                                    }}
                                  >
                                    {/Chef/i.test(v) ? (
                                      <ChefHat size={12} style={{ color: "#8A6516" }} />
                                    ) : /Buffet/i.test(v) ? (
                                      <UtensilsCrossed
                                        size={12}
                                        style={{ color: "#8A6516" }}
                                      />
                                    ) : (
                                      <Utensils size={12} style={{ color: "#8A6516" }} />
                                    )}
                                  </span>
                                  <span
                                    className="text-[13px] font-medium text-[#0A1B2C]"
                                    style={{ fontFamily: SANS }}
                                  >
                                    {v}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      </div>
                    );
                  })}
                </div>


                <button
                  type="button"
                  onClick={addAnotherServing}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-md px-3.5 h-[36px] text-[13px] font-medium text-[#B88A2E] hover:bg-[#FBF6E7]"
                  style={{ border: "1px solid #E3D2A1", background: "#FFFDF6" }}
                >
                  <Plus size={14} /> Add Another Serving
                </button>
              </>
            )}
          </div>

          {/* Bottom row: dietary / drinks / additional */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Dietary Requirements */}
            <div
              className="rounded-[12px] p-4"
              style={{ background: "#FAF8F4", border: "1px solid #E7DFCE" }}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} style={{ color: "#B88A2E" }} />
                <h4 className="text-[14.5px] font-semibold text-[#0A1B2C]">
                  Dietary Requirements
                </h4>
              </div>
              <p className="mt-0.5 text-[11.5px] text-[#8A8471]">Select all that apply</p>
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                {DIETARY_OPTIONS.map((opt) => (
                  <SquareCheckbox
                    key={opt}
                    label={opt}
                    checked={dietary.includes(opt)}
                    onChange={() =>
                      setDietary((prev) =>
                        prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt],
                      )
                    }
                  />
                ))}
              </div>
              {dietary.includes("Other") && (
                <input
                  type="text"
                  value={dietaryOther}
                  onChange={(e) => setDietaryOther(e.target.value)}
                  placeholder="Please specify"
                  className="mt-2.5 w-full h-[34px] rounded-md px-2.5 text-[12.5px] text-[#0A1B2C] outline-none"
                  style={{ background: "#FAF8F4", border: "1px solid #E8E0D3" }}
                />
              )}
            </div>

            {/* Drinks */}
            <div
              className="rounded-[12px] p-4"
              style={{ background: "#FAF8F4", border: "1px solid #E7DFCE" }}
            >
              <div className="flex items-center gap-2">
                <GlassWater size={15} style={{ color: "#B88A2E" }} />
                <h4 className="text-[14.5px] font-semibold text-[#0A1B2C]">Drinks</h4>
              </div>
              <p className="mt-0.5 text-[11.5px] text-[#8A8471]">Select all that apply</p>
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                {DRINK_OPTIONS.map((opt) => (
                  <SquareCheckbox
                    key={opt}
                    label={opt}
                    checked={drinks.includes(opt)}
                    onChange={() =>
                      setDrinks((prev) =>
                        prev.includes(opt) ? prev.filter((v) => v !== opt) : [...prev, opt],
                      )
                    }
                  />
                ))}
              </div>
            </div>

            {/* Additional Requests */}
            <div
              className="rounded-[12px] p-4"
              style={{ background: "#FAF8F4", border: "1px solid #E7DFCE" }}
            >
              <div className="flex items-center gap-2">
                <Pencil size={14} style={{ color: "#B88A2E" }} />
                <h4 className="text-[14.5px] font-semibold text-[#0A1B2C]">
                  Additional Requests
                </h4>
              </div>
              <p className="mt-0.5 text-[11.5px] text-[#8A8471]">
                Anything we should know about your catering?
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                rows={5}
                placeholder="Tell us about allergies, menu wishes, themed dinners, receptions or any other catering requests..."
                className="mt-2 w-full resize-none rounded-md p-2.5 text-[12.5px] text-[#0A1B2C] outline-none"
                style={{ background: "#FAF8F4", border: "1px solid #E8E0D3" }}
              />
              <div className="mt-1 text-right text-[11px] text-[#9C9484]">
                {notes.length} / 500
              </div>
            </div>
          </div>

          {/* Footer nav */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 rounded-md border px-6 h-[48px] text-[15px] font-medium text-[#0A1B2C] bg-white hover:bg-[#F5EFE1] transition-colors"
              style={{ borderColor: "#D9D3C4" }}
            >
              Back
            </button>
            <NextButton onClick={onNext} label="Next Step" />
          </div>
        </div>

        {/* RIGHT — Catering Overview */}
        <aside className="self-start">
          <div
            className="rounded-[16px] p-5 text-white"
            style={{
              background:
                "linear-gradient(180deg,#112842 0%, #0F2239 55%, #0D1D31 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 20px 40px -20px rgba(10,27,44,0.35)",
            }}
          >
            <div className="flex items-center gap-2">
              <ChefHat size={16} style={{ color: GOLD }} />
              <h3
                className="text-[16px] font-semibold"
                style={{ fontFamily: SERIF, color: "#F5EFE1" }}
              >
                Your Catering Overview
              </h3>
            </div>
            <div
              className="mt-3 h-px w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.55) 50%, transparent 100%)",
              }}
            />

            <div className="mt-4 flex flex-col gap-4">
              {overviewGroups.map((g) => {
                const room = effectiveRooms.find((r) => r.name === g.loc);
                return (
                  <div key={g.loc}>
                    <div className="flex items-center justify-between">
                      <span className="text-[13.5px] font-semibold text-white">
                        {g.loc}
                      </span>
                      {room && (
                        <span className="inline-flex items-center gap-1 text-[12px] text-[#C9CCD1]">
                          <Users size={12} style={{ color: GOLD }} /> {room.attendees}
                        </span>
                      )}
                    </div>
                    {g.items.length === 0 ? (
                      <div className="mt-1.5 text-[12px] text-[#9AA3AF]">
                        No catering selected
                      </div>
                    ) : (
                      <div className="mt-2 flex flex-col gap-1.5">
                        {g.items.map((it, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-[12.5px]"
                          >
                            <Clock size={12} style={{ color: GOLD }} />
                            <span className="text-[#C9CCD1] w-[46px]">{it.time}</span>
                            <span className="text-white">{it.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      className="mt-3 h-px w-full"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(212,175,55,0.16) 0%, rgba(212,175,55,0.28) 50%, rgba(212,175,55,0.10) 100%)",
                      }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-[12.5px]">
              <span className="inline-flex items-center gap-1.5 text-[#C9CCD1]">
                <Users size={13} style={{ color: GOLD }} /> Total Guests
              </span>
              <span className="text-white font-semibold">{effectiveGuests || "—"}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[12.5px]">
              <span className="inline-flex items-center gap-1.5 text-[#C9CCD1]">
                <MapPin size={13} style={{ color: GOLD }} /> Locations with Catering
              </span>
              <span className="text-white font-semibold">
                {locationsWithCatering}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
