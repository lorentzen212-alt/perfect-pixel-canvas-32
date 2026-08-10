import { ConfigAirportTransfer, ConfigCloakroom, ConfigCoachParking, ConfigPackage, ConfigPorter, ConfigRegistration, ConfigWelcome } from "@/features/me/step5/configs";
import type { ExtraConfigs, ExtraDef, ExtraId } from "@/features/me/step5/data";
import { GOLD, SERIF } from "@/features/me/tokens";
import React from "react";

export function ExtraCard({
  def,
  selected,
  saved,
  open,
  onCardClick,
  onRemove,
  summaryLines,
}: {
  def: ExtraDef;
  selected: boolean;
  saved: boolean;
  open: boolean;
  onCardClick: () => void;
  onRemove: () => void;
  summaryLines: string[];
}) {
  const { Icon } = def;
  const highlighted = selected || saved || open;
  const showGreen = saved;
  const showGold = !saved && (selected || open);
  const EMERALD = "#1B6B4F";
  const EMERALD_BORDER = "#155440";

  return (
    <div
      className="relative flex flex-col overflow-hidden rounded-[16px] transition-all duration-200"
      style={{
        background: highlighted
          ? "linear-gradient(180deg, #FFFBEF 0%, #FBF3DC 100%)"
          : "linear-gradient(180deg, #FCFAF5 0%, #F5EEDC 100%)",
        border: highlighted ? "1.5px solid #C79A32" : "1px solid #ECE4CC",
        boxShadow: highlighted
          ? "0 14px 30px -18px rgba(184,138,46,0.35), 0 2px 8px -4px rgba(10,27,44,0.06)"
          : "0 10px 24px -18px rgba(10,27,44,0.20), 0 2px 6px -3px rgba(10,27,44,0.05)",
        height: "100%",
      }}
    >
      {/* Clickable card head */}
      <button
        type="button"
        onClick={onCardClick}
        className="group flex flex-col text-left transition-all"
      >
        <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
          <img src={def.image} alt={def.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <span
            className="absolute right-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full transition-all"
            style={{
              background: showGreen ? EMERALD : showGold ? "#C79A32" : "rgba(255,255,255,0.9)",
              border: showGreen
                ? `1.5px solid ${EMERALD_BORDER}`
                : showGold
                  ? "1.5px solid #B88917"
                  : "1.5px solid rgba(255,255,255,0.95)",
              boxShadow: "0 2px 6px rgba(10,27,44,0.25)",
            }}
          >
            {(showGreen || showGold) && <Check size={14} strokeWidth={3} style={{ color: "#FFFFFF" }} />}
          </span>
        </div>

        <div className="relative -mt-6 flex justify-center">
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(180deg, #FFFDF6 0%, #FBF3DC 100%)",
              border: "1px solid #E3D2A1",
              boxShadow: "0 6px 14px -8px rgba(184,138,46,0.45), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            <Icon size={20} strokeWidth={1.8} style={{ color: "#B88A2E" }} />
          </span>
        </div>

        <div className="px-5 pt-2 pb-4 text-center">
          <h4 className="text-[#0A1B2C] text-[19px] leading-tight" style={{ fontFamily: SERIF, fontWeight: 500 }}>
            {def.title}
          </h4>
          <p className="mt-2 text-[13px] leading-relaxed text-[#5A6472]">{def.description}</p>

          {/* Summary lines on card */}
          {saved && !open && summaryLines.length > 0 && (
            <div className="mt-3 flex flex-col items-center gap-1.5">
              {summaryLines.map((line) => (
                <div key={line} className="inline-flex items-center gap-1.5 text-[12.5px] text-[#3C3222]">
                  <Check size={12} strokeWidth={3} style={{ color: "#B88A2E" }} />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </button>

      <div className="mb-4" />
    </div>
  );
}

export function ExtraAccordion({
  def,
  saved,
  onDone,
  onHide,
  onRemove,
  configs,
  setConfigs,
}: {
  def: ExtraDef;
  saved: boolean;
  onDone: () => void;
  onHide: () => void;
  onRemove: () => void;
  configs: ExtraConfigs;
  setConfigs: React.Dispatch<React.SetStateAction<ExtraConfigs>>;
}) {
  const setCfg = <K extends ExtraId>(id: K, val: ExtraConfigs[K]) =>
    setConfigs((prev) => ({ ...prev, [id]: val }));

  const body = (() => {
    switch (def.id) {
      case "airport-transfer":
        return <ConfigAirportTransfer cfg={configs["airport-transfer"]} set={(v) => setCfg("airport-transfer", v)} />;
      case "coach-parking":
        return <ConfigCoachParking cfg={configs["coach-parking"]} set={(v) => setCfg("coach-parking", v)} />;
      case "registration-desk":
        return <ConfigRegistration cfg={configs["registration-desk"]} set={(v) => setCfg("registration-desk", v)} />;
      case "package-handling":
        return <ConfigPackage cfg={configs["package-handling"]} set={(v) => setCfg("package-handling", v)} />;
      case "porter-service":
        return <ConfigPorter cfg={configs["porter-service"]} set={(v) => setCfg("porter-service", v)} />;
      case "cloakroom":
        return <ConfigCloakroom cfg={configs["cloakroom"]} set={(v) => setCfg("cloakroom", v)} />;
      case "welcome-package":
        return <ConfigWelcome cfg={configs["welcome-package"]} set={(v) => setCfg("welcome-package", v)} />;
    }
  })();

  return (
    <div
      className="col-span-full rounded-[16px] p-6 sm:p-7"
      style={{
        background: "linear-gradient(180deg, #FFFDF6 0%, #FBF6E7 100%)",
        border: "1px solid #E3D2A1",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7), 0 14px 30px -22px rgba(184,138,46,0.25)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <def.Icon size={16} strokeWidth={2} style={{ color: "#B88A2E" }} />
        <h4 className="text-[17px] text-[#0A1B2C]" style={{ fontFamily: SERIF, fontWeight: 500 }}>
          Configure {def.title}
        </h4>
      </div>
      {body}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onHide}
            className="inline-flex items-center gap-1.5 rounded-[10px] px-4 text-[13px] font-medium text-[#0A1B2C] transition-all hover:bg-[#F5EEDA]"
            style={{
              height: 40,
              background: "#FAF8F4",
              border: "1px solid #E3D2A1",
            }}
          >
            Hide <ChevronUp size={14} strokeWidth={2.4} />
          </button>
          {saved && (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center rounded-[10px] px-4 text-[12.5px] font-medium text-[#2B2B2B] transition-all hover:bg-[#FBF3DC]"
              style={{
                height: 40,
                background: "transparent",
                border: "1px solid #D9BE6C",
              }}
            >
              Remove Service
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onDone}
          className="group inline-flex items-center justify-center gap-2 rounded-[10px] text-[13.5px] font-semibold text-[#0A1B2C] transition-all duration-200 hover:brightness-105 px-6"
          style={{
            height: 42,
            background: `linear-gradient(180deg, #F7D07A 0%, ${GOLD} 55%, #C89A3A 100%)`,
            boxShadow: "0 14px 28px -16px rgba(200,154,58,0.55), 0 3px 8px -3px rgba(200,154,58,0.35), inset 0 1px 0 rgba(255,255,255,0.5)",
            border: "1px solid rgba(184,138,46,0.45)",
          }}
        >
          Done
          <Check size={15} strokeWidth={2.6} />
        </button>
      </div>
    </div>
  );
}
