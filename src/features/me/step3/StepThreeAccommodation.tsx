import accommodationBannerImg from "@/assets/rooms/accommodation-banner.jpg";
import breakfastImg from "@/assets/rooms/breakfast.jpg";
import doubleRoomImg from "@/assets/rooms/double.jpg";
import roomOnlyImg from "@/assets/rooms/room-only.jpg";
import singleRoomImg from "@/assets/rooms/single.jpg";
import tripleRoomImg from "@/assets/rooms/triple.jpg";
import twinRoomImg from "@/assets/rooms/twin.jpg";
import { AccommodationIcon, LuxIconBadge } from "@/features/me/step3/icons";
import { DateField, MealOption, RoomRow, SummaryRow } from "@/features/me/step3/parts";
import type { MealPlan, RoomMix, Stay } from "@/features/me/step3/stay";
import { emptyRooms, fmtDate, guestsCapacity, roomsSummary, roomsTotal } from "@/features/me/step3/stay";
import { SANS, SERIF } from "@/features/me/tokens";
import type { MeAccommodationStay } from "@/lib/meDraftStore";
import { setMeSection } from "@/lib/meDraftStore";
import { ArrowRight, BedDouble, Calendar as CalendarIcon, Check, Coffee, Mail, Pencil, Phone, Plus, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";

export function StepThreeAccommodation({

  onBack,
  onNext,
  direction,
}: {
  onBack: () => void;
  onNext: () => void;
  direction: "forward" | "back";
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState<RoomMix>(emptyRooms());
  const [roomCategory, setRoomCategory] = useState<
    Record<"sgl" | "dbl" | "twn" | "trp", string>
  >({ sgl: "Standard", dbl: "Standard", twn: "Standard", trp: "Standard" });
  const [mealPlan, setMealPlan] = useState<MealPlan>("breakfast");
  const [stays, setStays] = useState<Stay[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [special, setSpecial] = useState("");

  const totalRooms = stays.reduce((n, s) => n + roomsTotal(s.rooms), 0);
  const totalGuests = stays.reduce((n, s) => n + guestsCapacity(s.rooms), 0);
  const primaryMeal = stays[0]?.mealPlan ?? mealPlan;

  // Commit accommodation into shared draft.
  useEffect(() => {
    setMeSection(
      "accommodationStays",
      stays.map<MeAccommodationStay>((s) => ({
        id: s.id,
        checkIn: s.checkIn,
        checkOut: s.checkOut,
        rooms: s.rooms,
        mealPlan: s.mealPlan,
      })),
    );
  }, [stays]);

  useEffect(() => {
    setMeSection("accommodationExtras", {
      special: special.trim() || undefined,
      roomCategory,
    });
  }, [special, roomCategory]);

  const clearDraft = () => {
    setCheckIn("");
    setCheckOut("");
    setRooms(emptyRooms());
    setMealPlan("breakfast");
    setEditingId(null);
  };

  const addStay = () => {
    if (!checkIn || !checkOut) return;
    const stay: Stay = {
      id: editingId ?? crypto.randomUUID(),
      checkIn,
      checkOut,
      rooms,
      mealPlan,
    };
    setStays((prev) =>
      editingId ? prev.map((s) => (s.id === editingId ? stay : s)) : [...prev, stay],
    );
    clearDraft();
  };

  const editStay = (id: string) => {
    const s = stays.find((x) => x.id === id);
    if (!s) return;
    setEditingId(id);
    setCheckIn(s.checkIn);
    setCheckOut(s.checkOut);
    setRooms(s.rooms);
    setMealPlan(s.mealPlan);
  };

  const removeStay = (id: string) => {
    setStays((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) clearDraft();
  };

  return (
    <div
      className={
        ""
      }
    >
      <div className="mb-6">
        <h2
          className="text-[#0A1B2C] text-3xl lg:text-[38px] leading-tight"
          style={{ fontFamily: SERIF }}
        >
          Step 2&nbsp;– Accommodation
        </h2>
        <div className="mt-3 h-[2px] w-16" style={{ background: "linear-gradient(90deg,#F7D97A,#B88917)" }} />
        <p className="mt-4 text-[#4A5866] text-[15px] max-w-xl leading-relaxed">
          Add the room mix for each stay period. You can add multiple stay periods if
          guests are arriving or departing on different dates.
        </p>
      </div>

      <div
        className="overflow-hidden rounded-[20px]"
        style={{
          background:
            "linear-gradient(180deg, #FAF9F6 0%, #F7F6F2 50%, #F4F3EF 100%)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.75), 0 12px 34px rgba(15,23,42,0.06), 0 3px 10px rgba(15,23,42,0.03)",
          border: "1px solid #E8E6E1",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
          {/* LEFT COLUMN */}
          <div className="p-6 sm:p-9 lg:p-11 lg:pr-9">
            {/* Accommodation Period card */}
            <div
              className="rounded-[16px] overflow-hidden"
              style={{
                backgroundColor: "#FAF8F4",
                border: "1px solid #EEEBE3",
                boxShadow: "0 6px 18px -10px rgba(10,27,44,0.08)",
              }}
            >
              <div className="relative w-full" style={{ height: 145 }}>
                <img
                  src={accommodationBannerImg}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: "center" }}
                  draggable={false}
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(10,27,44,0) 60%, rgba(10,27,44,0.32) 100%)",
                  }}
                />
              </div>
              <div className="pt-4 pb-6 px-6 lg:pt-5 lg:pb-7 lg:px-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AccommodationIcon />

                  <div>
                  <h3
                    className="text-[#1A1F24] text-[20px] leading-tight tracking-[0.04em]"
                    style={{ fontFamily: SANS, fontWeight: 600 }}
                  >
                    Accommodation Period{" "}
                    <span className="text-[#8A94A0] text-[15px] font-normal tracking-normal">
                      ({editingId ? "Editing" : "Draft"})
                    </span>
                  </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearDraft}
                  className="inline-flex items-center gap-2 rounded-md border px-3 h-9 text-[13px] text-[#4A5866] bg-white hover:bg-[#FBF7EA] transition-colors"
                  style={{ borderColor: "#E3DFD3", boxShadow: "0 1px 2px rgba(10,27,44,0.04)" }}
                >
                  <Trash2 size={14} style={{ color: "#B88917" }} />
                  Clear
                </button>
              </div>

              {/* Dates */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-end gap-4">
                <DateField label="Check-in" value={checkIn} onChange={setCheckIn} />
                <div className="hidden sm:flex items-center justify-center pb-3">
                  <ArrowRight size={18} className="text-[#4A5866]" />
                </div>
                <DateField label="Check-out" value={checkOut} onChange={setCheckOut} />
              </div>

              {/* Room Categories — stacked full-width rows */}
              <div className="mt-8">
                <div className="mb-4 sm:hidden">
                  <h4
                    className="text-[#1F2937] text-[15px]"
                    style={{ fontFamily: SANS, fontWeight: 600 }}
                  >
                    Room Categories
                  </h4>
                </div>
                <div
                  className="mb-3 hidden sm:grid items-baseline gap-6 pb-2 border-b px-5"
                  style={{ gridTemplateColumns: "44px minmax(0,1fr) 132px 180px", borderColor: "#ECE7DC" }}
                >
                  <div aria-hidden />
                  <h4
                    className="text-[#1F2937] text-[16.5px] ml-[-82px]"
                    style={{ fontFamily: SANS, fontWeight: 600, letterSpacing: "0.02em" }}
                  >
                    Room Categories
                  </h4>
                  <span
                    className="text-[11px] tracking-[0.05em] text-[#1F2937] uppercase text-center"
                    style={{ fontFamily: SANS, fontWeight: 600 }}
                  >
                    Guests
                  </span>
                  <span
                    className="text-[11px] tracking-[0.05em] text-[#1F2937] uppercase text-center"
                    style={{ fontFamily: SANS, fontWeight: 600 }}
                  >
                    Preferred Room Category
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <RoomRow
                    image={singleRoomImg}
                    label="Single Room"
                    value={rooms.sgl}
                    onChange={(v) => setRooms({ ...rooms, sgl: v })}
                    category={roomCategory.sgl}
                    onCategoryChange={(c) => setRoomCategory({ ...roomCategory, sgl: c })}
                  />
                  <RoomRow
                    image={doubleRoomImg}
                    label="Double Room"
                    value={rooms.dbl}
                    onChange={(v) => setRooms({ ...rooms, dbl: v })}
                    category={roomCategory.dbl}
                    onCategoryChange={(c) => setRoomCategory({ ...roomCategory, dbl: c })}
                  />
                  <RoomRow
                    image={twinRoomImg}
                    label="Twin Room"
                    value={rooms.twn}
                    onChange={(v) => setRooms({ ...rooms, twn: v })}
                    category={roomCategory.twn}
                    onCategoryChange={(c) => setRoomCategory({ ...roomCategory, twn: c })}
                  />
                  <RoomRow
                    image={tripleRoomImg}
                    label="Triple Room"
                    value={rooms.trp}
                    onChange={(v) => setRooms({ ...rooms, trp: v })}
                    category={roomCategory.trp}
                    onCategoryChange={(c) => setRoomCategory({ ...roomCategory, trp: c })}
                  />

                </div>
              </div>


              {/* Meal Plan */}
              <div className="mt-8 border-t pt-6" style={{ borderColor: "#EEEBE3" }}>
                <h4
                  className="text-[#1F2937] text-[16.5px] mb-4"
                  style={{ fontFamily: SANS, fontWeight: 600, letterSpacing: "0.02em" }}
                >
                  Meal Plan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MealOption
                    image={roomOnlyImg}
                    label="Room Only"
                    selected={mealPlan === "room"}
                    onClick={() => setMealPlan("room")}
                  />
                  <MealOption
                    image={breakfastImg}
                    label="Breakfast Included"
                    selected={mealPlan === "breakfast"}
                    onClick={() => setMealPlan("breakfast")}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={clearDraft}
                  className="inline-flex items-center justify-center rounded-md border px-6 h-[46px] text-[14px] font-medium text-[#0A1B2C] bg-white hover:bg-[#F5EFE1]"
                  style={{ borderColor: "#D9D3C4" }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addStay}
                  disabled={!checkIn || !checkOut}
                  className="group inline-flex items-center justify-center gap-2 rounded-md px-6 h-[46px] text-[14px] font-semibold text-white disabled:opacity-50 transition-colors"
                  style={{
                    background:
                      "linear-gradient(180deg,#153353 0%,#0C2440 55%,#081A30 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.4), 0 12px 28px -14px rgba(10,27,44,0.7), 0 2px 6px -2px rgba(10,27,44,0.35)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  {editingId ? "Save changes" : "Add this stay"}
                  <ArrowRight size={16} style={{ color: "#F2C860" }} />
                </button>
              </div>
              </div>
            </div>

            {/* Complete stay and continue (outlined gold) */}
            <button
              type="button"
              onClick={() => {
                try {
                  if (typeof window !== "undefined" && totalGuests > 0) {
                    window.localStorage.setItem(
                      "hgb:guest-count",
                      String(totalGuests),
                    );
                  }
                } catch {
                  /* non-fatal */
                }
                onNext();
              }}
              className="complete-stay-btn mt-5 w-full inline-flex items-center justify-center gap-2 h-[52px] text-[15px] font-medium"
            >
              <Plus size={18} className="complete-stay-plus" />
              Complete stay and continue
            </button>

            {/* Added Stays */}
            {stays.length > 0 && (
              <div className="mt-9">
                <h4 className="text-[#0A1B2C] text-[15px] font-semibold mb-4">Added Stays</h4>
                <div className="flex flex-col gap-3">
                  {stays.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-4 rounded-[12px] px-4 py-3"
                      style={{
                        backgroundColor: "#FAF8F4",
                        border: "1px solid #EEEBE3",
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <LuxIconBadge size={36} tone="onDark">
                          <CalendarIcon size={16} strokeWidth={1.8} />
                        </LuxIconBadge>
                        <div className="min-w-0">
                          <div className="text-[#0A1B2C] text-[14px] font-semibold truncate">
                            {fmtDate(s.checkIn)} – {fmtDate(s.checkOut)}
                          </div>
                          <div className="text-[#4A5866] text-[13px] truncate">
                            {roomsSummary(s.rooms) || "No rooms"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => editStay(s.id)}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[13px] text-[#0A1B2C] hover:bg-[#F5EFE1]"
                        >
                          <Pencil size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeStay(s.id)}
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[13px] text-[#B45B4A] hover:bg-[#FBECEA]"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add another stay */}
            <button
              type="button"
              onClick={clearDraft}
              className="add-stay-btn mt-5 w-full inline-flex items-center justify-center gap-2 rounded-[12px] h-[54px] text-[15px] font-semibold text-white"
            >
              <Plus size={18} style={{ color: "#F2C860" }} />
              Add another stay
            </button>


            {/* Special Requests */}
            <div className="mt-9">
              <label className="block">
                <span className="text-[#0A1B2C] text-[15px] font-semibold">
                  Special Requests <span className="font-normal text-[#8A94A0]">(Optional)</span>
                </span>
                <span className="mt-1 block text-[#4A5866] text-[13px]">
                  Tell us about any specific requirements.
                </span>
                <textarea
                  value={special}
                  onChange={(e) => setSpecial(e.target.value)}
                  rows={3}
                  placeholder="E.g. early check-in, late check-out, welcome gift, specific floor, etc."
                  className="mt-3 w-full rounded-[10px] px-4 py-3 text-[14px] text-[#0A1B2C] placeholder:text-[#9BA4AE] outline-none transition-all focus:border-[#D4AF37] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.14)]"
                  style={{
                    backgroundColor: "#FAF8F4",
                    border: "1px solid #E6E2D5",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), 0 1px 2px rgba(10,27,44,0.04)",
                  }}
                />
              </label>
            </div>

            {/* Back */}
            <div className="mt-10 flex">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center justify-center gap-2 rounded-md border px-6 h-[46px] text-[14px] font-medium text-[#0A1B2C] bg-white hover:bg-[#F5EFE1]"
                style={{ borderColor: "#D9D3C4" }}
              >
                Back
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR - premium navy */}
          <aside
            className="relative p-7 lg:p-8 text-white"
            style={{
              background:
                "linear-gradient(180deg, #112842 0%, #0F2239 50%, #0D1D31 100%)",
              boxShadow: "inset 1px 0 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* subtle vertical divider gradient with champagne reflection */}
            <div
              className="pointer-events-none absolute left-0 top-6 bottom-6 w-px"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(247,217,122,0.18) 22%, rgba(212,175,55,0.34) 50%, rgba(247,217,122,0.16) 78%, transparent 100%)",
              }}
            />

            {/* Summary */}
            <h3
              className="text-white text-[24px] leading-tight"
              style={{ fontFamily: SERIF }}
            >
              Summary
            </h3>
            <div
              className="mt-3 h-[2px] w-14"
              style={{
                background:
                  "linear-gradient(90deg,#F7D97A 0%,#D4AF37 60%,rgba(212,175,55,0) 100%)",
              }}
            />

            <div className="mt-6 flex flex-col gap-4">
              <SummaryRow icon={<Users size={16} />} label="Total Guests" value={totalGuests} />
              <SummaryRow icon={<CalendarIcon size={16} />} label="Stay Periods" value={stays.length} />
              <SummaryRow icon={<BedDouble size={16} />} label="Total Rooms Requested" value={totalRooms} />
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <LuxIconBadge size={36} tone="onDark">
                  <Coffee size={16} />
                </LuxIconBadge>
                <div>
                  <div className="text-white/70 text-[13px]">Meal Plan</div>
                  <div className="text-white text-[15px] font-medium">
                    {primaryMeal === "breakfast" ? "Breakfast Included" : "Room Only"}
                  </div>
                </div>
              </div>
            </div>

            {/* Need help card */}
            <div
              className="mt-7 rounded-[14px] p-5"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(212,175,55,0.22)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
            >
              <h4 className="text-white text-[20px]" style={{ fontFamily: SERIF }}>
                Need help?
              </h4>
              <div
                className="mt-2 h-[2px] w-10"
                style={{ background: "linear-gradient(90deg,#F7D97A,rgba(247,217,122,0))" }}
              />
              <p className="mt-3 text-white/75 text-[13.5px] leading-relaxed">
                Our M&amp;E specialists are ready to assist you.
              </p>
              <div className="mt-4 flex flex-col gap-3">
                <a
                  href="tel:+4721002100"
                  className="flex items-center gap-3 text-white/90 text-[13.5px] hover:text-[#F7D97A] transition-colors"
                >
                  <LuxIconBadge size={32} tone="onDark">
                    <Phone size={14} />
                  </LuxIconBadge>
                  +47 21 00 21 00
                </a>
                <a
                  href="mailto:meetings@hotelgroupbook.com"
                  className="flex items-center gap-3 text-white/90 text-[13.5px] hover:text-[#F7D97A] transition-colors whitespace-nowrap"
                >
                  <LuxIconBadge size={32} tone="onDark">
                    <Mail size={14} />
                  </LuxIconBadge>
                  meetings@hotelgroupbook.com
                </a>
              </div>
            </div>

            {/* Trust box */}
            <div
              className="mt-5 rounded-[14px] p-5 text-center"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                border: "1px solid rgba(212,175,55,0.22)",
              }}
            >
              <div className="mx-auto flex items-center justify-center">
                <LuxIconBadge size={44} tone="onDark">
                  <Users size={20} />
                </LuxIconBadge>
              </div>
              <p
                className="mt-3 text-white text-[15px] leading-snug"
                style={{ fontFamily: SERIF }}
              >
                Built by group booking
                <br />
                professionals
              </p>
              <p className="mt-2 text-white/70 text-[12.5px] leading-relaxed">
                with experience from{" "}
                <span className="text-[#F7D97A] font-semibold">10,000+ groups.</span>
              </p>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
