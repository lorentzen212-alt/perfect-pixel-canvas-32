import s2SuiteFjordImg from "@/assets/s2-suite-fjord.png.asset.json";
import { BookingHeader } from "@/components/BookingHeader";
import { smoothScrollToElement } from "@/features/leisure/scroll";
import { STEP2_ROOMS_ORDER, emptyDraftRooms, stayGuestsTotal, stayNights, stayRoomsTotal } from "@/features/leisure/stay";
import { AccommodationSummary } from "@/features/leisure/step2/AccommodationSummary";
import { S2CompletedStayCard, S2StayCard } from "@/features/leisure/step2/cards";
import { DRAFT_REMOVE_ID, defaultDraftCategories } from "@/features/leisure/step2/data";
import { S2DiamondRule, S2RoomCard } from "@/features/leisure/step2/parts";
import { S2_BG, S2_BG_GRADIENT, S2_CREAM, S2_GOLD_DEEP, S2_GOLD_SOFT, S2_HAIR_GOLD, S2_IVORY, S2_NAVY_BTN, S2_NAVY_MUTED, S2_NAVY_TEXT, S2_TEXT, SERIF } from "@/features/leisure/tokens";
import { type LeisureStay, type StepKey } from "@/features/leisure/types";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import React, { useRef, useState } from "react";

export function LeisureStep2Screen({
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
