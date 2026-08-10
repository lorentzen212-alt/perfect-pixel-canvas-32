import type { ExtraConfigs } from "@/features/me/step5/data";
import { CheckOption, FieldLabel, NumberStepper, RadioOption, inputStyle } from "@/features/me/step5/parts";
import { Bus, Gift, Wine } from "lucide-react";

/* Service-specific config panels */
export function ConfigAirportTransfer({ cfg, set }: { cfg: ExtraConfigs["airport-transfer"]; set: (v: ExtraConfigs["airport-transfer"]) => void }) {
  const types = ["Private Executive Van", "Taxi", "Coach / Bus", "Private Chauffeur", "Other"];
  const dirs = ["Both Directions", "Arrival Only", "Departure Only"];
  return (
    <div className="grid grid-cols-1 gap-5">
      <div>
        <FieldLabel>Choose transfer type</FieldLabel>
        <div className="flex flex-col gap-2">
          {types.map((t) => (
            <RadioOption
              key={t}
              label={t}
              selected={cfg.transferType === t}
              onClick={() => set({ ...cfg, transferType: cfg.transferType === t ? "" : t })}
              badge={t === "Private Executive Van" ? "Recommended" : undefined}
            />
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Transfer direction</FieldLabel>
        <div className="flex flex-col gap-2">
          {dirs.map((d) => (
            <RadioOption key={d} label={d} selected={cfg.direction === d} onClick={() => set({ ...cfg, direction: cfg.direction === d ? "" : d })} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ConfigCoachParking({ cfg, set }: { cfg: ExtraConfigs["coach-parking"]; set: (v: ExtraConfigs["coach-parking"]) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Number of coaches</FieldLabel>
        <NumberStepper value={cfg.coaches} onChange={(v) => set({ ...cfg, coaches: v })} min={1} />
      </div>
      <div>
        <FieldLabel>Coach arrival time</FieldLabel>
        <input type="time" value={cfg.arrival} onChange={(e) => set({ ...cfg, arrival: e.target.value })} className="w-full rounded-[10px] px-3 h-10 text-[13.5px] outline-none" style={inputStyle} />
      </div>
      <div>
        <FieldLabel>Coach departure time</FieldLabel>
        <input type="time" value={cfg.departure} onChange={(e) => set({ ...cfg, departure: e.target.value })} className="w-full rounded-[10px] px-3 h-10 text-[13.5px] outline-none" style={inputStyle} />
      </div>
      <div>
        <FieldLabel>Parking instructions</FieldLabel>
        <input type="text" value={cfg.instructions} onChange={(e) => set({ ...cfg, instructions: e.target.value })} placeholder="Enter instructions..." className="w-full rounded-[10px] px-3 h-10 text-[13.5px] outline-none" style={inputStyle} />
      </div>
    </div>
  );
}

export function ConfigRegistration({ cfg, set }: { cfg: ExtraConfigs["registration-desk"]; set: (v: ExtraConfigs["registration-desk"]) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Registration start time</FieldLabel>
        <input type="time" value={cfg.start} onChange={(e) => set({ ...cfg, start: e.target.value })} className="w-full rounded-[10px] px-3 h-10 text-[13.5px] outline-none" style={inputStyle} />
      </div>
      <div>
        <FieldLabel>Registration end time</FieldLabel>
        <input type="time" value={cfg.end} onChange={(e) => set({ ...cfg, end: e.target.value })} className="w-full rounded-[10px] px-3 h-10 text-[13.5px] outline-none" style={inputStyle} />
      </div>
      <div>
        <FieldLabel>Hotel staff required</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          <RadioOption label="Yes" selected={cfg.staff === "yes"} onClick={() => set({ ...cfg, staff: cfg.staff === "yes" ? "" : "yes" })} />
          <RadioOption label="No" selected={cfg.staff === "no"} onClick={() => set({ ...cfg, staff: cfg.staff === "no" ? "" : "no" })} />
        </div>
      </div>
      <div>
        <FieldLabel>Additional notes</FieldLabel>
        <input type="text" value={cfg.notes} onChange={(e) => set({ ...cfg, notes: e.target.value })} placeholder="Enter notes..." className="w-full rounded-[10px] px-3 h-10 text-[13.5px] outline-none" style={inputStyle} />
      </div>
    </div>
  );
}

export function ConfigPackage({ cfg, set }: { cfg: ExtraConfigs["package-handling"]; set: (v: ExtraConfigs["package-handling"]) => void }) {
  const opts = ["Before Arrival", "During Event", "After Event"];
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Storage required</FieldLabel>
        <div className="flex flex-col gap-2">
          {opts.map((o) => (
            <RadioOption key={o} label={o} selected={cfg.storage === o} onClick={() => set({ ...cfg, storage: cfg.storage === o ? "" : o })} />
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Estimated number of packages</FieldLabel>
        <NumberStepper value={cfg.packages} onChange={(v) => set({ ...cfg, packages: v })} />
      </div>
      <div>
        <FieldLabel>Additional instructions</FieldLabel>
        <input type="text" value={cfg.instructions} onChange={(e) => set({ ...cfg, instructions: e.target.value })} placeholder="Enter instructions..." className="w-full rounded-[10px] px-3 h-10 text-[13.5px] outline-none" style={inputStyle} />
      </div>
    </div>
  );
}

export function ConfigPorter({ cfg, set }: { cfg: ExtraConfigs["porter-service"]; set: (v: ExtraConfigs["porter-service"]) => void }) {
  const opts = ["Arrival", "Departure", "Both"];
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Porter service required for</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {opts.map((o) => (
            <RadioOption key={o} label={o} selected={cfg.requiredFor === o} onClick={() => set({ ...cfg, requiredFor: cfg.requiredFor === o ? "" : o })} />
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Estimated number of guests</FieldLabel>
        <NumberStepper value={cfg.guests} onChange={(v) => set({ ...cfg, guests: v })} />
      </div>
      <div>
        <FieldLabel>Additional notes</FieldLabel>
        <input type="text" value={cfg.notes} onChange={(e) => set({ ...cfg, notes: e.target.value })} placeholder="Enter notes..." className="w-full rounded-[10px] px-3 h-10 text-[13.5px] outline-none" style={inputStyle} />
      </div>
    </div>
  );
}

export function ConfigCloakroom({ cfg, set }: { cfg: ExtraConfigs["cloakroom"]; set: (v: ExtraConfigs["cloakroom"]) => void }) {
  const opts = ["Staffed Cloakroom", "Self-Service"];
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Cloakroom type</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {opts.map((o) => (
            <RadioOption key={o} label={o} selected={cfg.type === o} onClick={() => set({ ...cfg, type: cfg.type === o ? "" : o })} />
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>Estimated number of guests</FieldLabel>
        <NumberStepper value={cfg.guests} onChange={(v) => set({ ...cfg, guests: v })} />
      </div>
      <div>
        <FieldLabel>Additional notes</FieldLabel>
        <input type="text" value={cfg.notes} onChange={(e) => set({ ...cfg, notes: e.target.value })} placeholder="Enter notes..." className="w-full rounded-[10px] px-3 h-10 text-[13.5px] outline-none" style={inputStyle} />
      </div>
    </div>
  );
}

export function ConfigWelcome({ cfg, set }: { cfg: ExtraConfigs["welcome-package"]; set: (v: ExtraConfigs["welcome-package"]) => void }) {
  const opts = ["Welcome Letter", "Chocolate", "Local Gift", "Fruit Basket", "Wine", "VIP Amenities", "Hotel Surprise", "Other"];
  const toggle = (o: string) => {
    const has = cfg.items.includes(o);
    set({ ...cfg, items: has ? cfg.items.filter((x) => x !== o) : [...cfg.items, o] });
  };
  return (
    <div className="flex flex-col gap-4">
      <div>
        <FieldLabel>Choose welcome package</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {opts.map((o) => (
            <CheckOption key={o} label={o} selected={cfg.items.includes(o)} onClick={() => toggle(o)} />
          ))}
        </div>
      </div>
      {cfg.items.includes("Other") && (
        <div>
          <FieldLabel>Describe your welcome package</FieldLabel>
          <input
            type="text"
            value={cfg.otherText}
            onChange={(e) => set({ ...cfg, otherText: e.target.value })}
            placeholder="Describe your welcome package..."
            className="w-full rounded-[10px] px-3 h-10 text-[13.5px] outline-none"
            style={inputStyle}
          />
        </div>
      )}
    </div>
  );
}
