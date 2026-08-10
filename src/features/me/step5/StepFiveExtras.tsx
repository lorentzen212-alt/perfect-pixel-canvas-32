import { HelpCard } from "@/features/me/shell/HelpCard";
import { ExtraAccordion, ExtraCard } from "@/features/me/step5/cards";
import type { ExtraConfigs, ExtraId } from "@/features/me/step5/data";
import { DEFAULT_CONFIGS, EXTRAS_DEFS, summaryFor } from "@/features/me/step5/data";
import { GOLD, SERIF } from "@/features/me/tokens";
import { setMeSection } from "@/lib/meDraftStore";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

export function StepFiveExtras({
  onBack,
  onNext,
  direction,
}: {
  onBack: () => void;
  onNext: () => void;
  direction: "forward" | "back";
}) {
  const [selected, setSelected] = useState<Record<ExtraId, boolean>>(() =>
    EXTRAS_DEFS.reduce((acc, d) => ({ ...acc, [d.id]: false }), {} as Record<ExtraId, boolean>),
  );
  const [saved, setSaved] = useState<Record<ExtraId, boolean>>(() =>
    EXTRAS_DEFS.reduce((acc, d) => ({ ...acc, [d.id]: false }), {} as Record<ExtraId, boolean>),
  );
  const [configs, setConfigs] = useState<ExtraConfigs>(DEFAULT_CONFIGS);
  const [openId, setOpenId] = useState<ExtraId | null>(null);
  const [notes, setNotes] = useState("");

  const handleCardClick = (id: ExtraId) => {
    // If the card is saved (green check), clicking it re-opens the accordion
    // with all existing configuration preserved so users can edit their choices.
    // To remove, they must use the "Remove Service" button inside the accordion.
    if (saved[id]) {
      setOpenId((cur) => (cur === id ? null : id));
      return;
    }
    // If selected but not saved (gold, in-progress), a click clears it.
    if (selected[id]) {
      setSelected((prev) => ({ ...prev, [id]: false }));
      setConfigs((prev) => ({ ...prev, [id]: DEFAULT_CONFIGS[id] }));
      setOpenId((cur) => (cur === id ? null : cur));
      return;
    }
    setSelected((prev) => ({ ...prev, [id]: true }));
    setOpenId(id);
  };



  const handleDone = (id: ExtraId) => {
    setSaved((prev) => ({ ...prev, [id]: true }));
    setSelected((prev) => ({ ...prev, [id]: true }));
    setOpenId(null);
  };

  const handleRemove = (id: ExtraId) => {
    setSelected((prev) => ({ ...prev, [id]: false }));
    setSaved((prev) => ({ ...prev, [id]: false }));
    setConfigs((prev) => ({ ...prev, [id]: DEFAULT_CONFIGS[id] }));
    setOpenId((cur) => (cur === id ? null : cur));
  };

  const selectedCount = Object.values(saved).filter(Boolean).length;

  // Commit extras into shared draft (only saved services).
  useEffect(() => {
    const items = EXTRAS_DEFS.filter((d) => saved[d.id]).map((d) => ({
      id: d.id,
      title: d.title,
      summary: summaryFor(d.id, configs[d.id]),
    }));
    setMeSection("extras", items);
  }, [saved, configs]);

  useEffect(() => {
    setMeSection("extrasNotes", notes);
  }, [notes]);

  const summaryItems: Array<{ label: string; value: string }> = [
    { label: "Location", value: "Oslo, Norway" },
    { label: "Accommodation", value: "80 rooms · 2 nights" },
    { label: "Meeting Spaces", value: "1 meeting room" },
    { label: "Catering", value: "2 items selected" },
    {
      label: "Extras",
      value: selectedCount > 0 ? `${selectedCount} service${selectedCount > 1 ? "s" : ""} selected` : "Not selected",
    },
    { label: "Event Details", value: "Not completed" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* LEFT — main panel */}
        <div
          className="overflow-hidden rounded-[20px] p-6 sm:p-8 lg:p-10"
          style={{
            backgroundColor: "#FAF8F4",
            backgroundImage: "linear-gradient(180deg, #FCFAF5 0%, #F8F5EE 55%, #F3EFE6 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,251,240,0.7), 0 1px 0 rgba(90,72,44,0.05), 0 20px 44px -34px rgba(60,48,28,0.14)",
            border: "1px solid #E7DFCE",
          }}
        >
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium text-[#0A1B2C] hover:text-[#B88A2E] transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h2 className="text-[#0A1B2C] text-3xl lg:text-[34px] leading-tight" style={{ fontFamily: SERIF }}>
            Step 5 – Extras
          </h2>
          <div className="mt-2 h-[2px] w-16" style={{ backgroundColor: GOLD }} />
          <p className="mt-4 text-[#4A5866] text-[15px] max-w-xl leading-relaxed">
            Select any additional services you would like us to arrange for your group.
          </p>

          {/* Cards grid — items-start so an open accordion only stretches its own card */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 items-start">
            {EXTRAS_DEFS.map((def) => {
              const isOpen = openId === def.id;
              const lines = saved[def.id] ? summaryFor(def.id, configs[def.id]) : [];
              return (
                <div key={def.id} className="contents">
                  <ExtraCard
                    def={def}
                    selected={selected[def.id]}
                    saved={saved[def.id]}
                    open={isOpen}
                    onCardClick={() => handleCardClick(def.id)}
                    onRemove={() => handleRemove(def.id)}
                    summaryLines={lines}
                  />
                  {isOpen && (
                    <ExtraAccordion
                      def={def}
                      saved={saved[def.id]}
                      onDone={() => handleDone(def.id)}
                      onHide={() => setOpenId(null)}
                      onRemove={() => handleRemove(def.id)}
                      configs={configs}
                      setConfigs={setConfigs}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Any other requests */}
          <div
            className="mt-8 rounded-[16px] p-5 flex flex-col md:flex-row md:items-start gap-5"
            style={{
              background: "linear-gradient(180deg, #FFFDF6 0%, #FBF6E7 100%)",
              border: "1px solid #EBDDB4",
              boxShadow: "0 10px 26px -18px rgba(184,138,46,0.25)",
            }}
          >
            <div className="flex items-start gap-3 md:w-[320px] shrink-0">
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: "#FDF6E1", border: "1px solid #E3D2A1" }}
              >
                <Pencil size={16} style={{ color: "#B88A2E" }} />
              </span>
              <div>
                <h4 className="text-[16px] font-semibold text-[#0A1B2C]" style={{ fontFamily: SERIF }}>
                  Any other requests?
                </h4>
                <p className="mt-1 text-[13px] text-[#6E5A2E] leading-relaxed">
                  Tell us about any additional services you would like us to arrange.
                </p>
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                rows={3}
                placeholder="Type your request here..."
                className="w-full resize-none rounded-md p-3 text-[13.5px] text-[#0A1B2C] outline-none"
                style={{ background: "#FAF8F4", border: "1px solid #E8E0D3" }}
              />
              <div className="mt-1 text-right text-[11px] text-[#9C9484]">{notes.length} / 500</div>
            </div>
          </div>
        </div>

        {/* RIGHT — Need help + Event Summary + Next */}
        <aside className="self-start flex flex-col gap-5">
          <div
            className="rounded-[16px] p-6"
            style={{
              backgroundColor: "#FAF8F4",
              border: "1px solid #E7DFCE",
              boxShadow: "inset 0 1px 0 rgba(255,251,240,0.7), 0 1px 0 rgba(90,72,44,0.05), 0 20px 44px -34px rgba(60,48,28,0.14)",
            }}
          >
            <HelpCard />
          </div>

          <div
            className="rounded-[16px] p-6"
            style={{
              backgroundColor: "#FAF8F4",
              border: "1px solid #E7DFCE",
              boxShadow: "inset 0 1px 0 rgba(255,251,240,0.7), 0 1px 0 rgba(90,72,44,0.05), 0 20px 44px -34px rgba(60,48,28,0.14)",
            }}
          >
            <h3 className="text-[#0A1B2C] text-[22px] leading-tight" style={{ fontFamily: SERIF }}>
              Your event summary
            </h3>
            <div className="mt-4 flex flex-col gap-4">
              {summaryItems.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#0A1B2C]">{item.label}</p>
                    <p className="text-[13px] text-[#5A6472] mt-0.5">{item.value}</p>
                  </div>
                  {item.label !== "Extras" && item.label !== "Event Details" && (
                    <button
                      type="button"
                      className="text-[13px] font-semibold underline decoration-1 underline-offset-2 transition-colors"
                      style={{ color: "#B88A2E" }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={onNext}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-md text-[15px] font-semibold text-[#0A1B2C] transition-all duration-200 hover:brightness-105"
                style={{
                  height: 52,
                  background: `linear-gradient(180deg, #F7D07A 0%, ${GOLD} 55%, #C89A3A 100%)`,
                  boxShadow: "0 18px 40px -18px rgba(200,154,58,0.55), 0 4px 10px -4px rgba(200,154,58,0.35), inset 0 1px 0 rgba(255,255,255,0.5)",
                  border: "1px solid rgba(184,138,46,0.45)",
                }}
              >
                Next Step
                <ArrowRight size={18} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* --------- Step 7 – Review & Submit (pixel-target premium layout) --------- */

