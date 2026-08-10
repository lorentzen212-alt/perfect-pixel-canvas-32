import { PORTER_SERVICES, TRANSPORT_SERVICES, contextArrivalISO, contextDepartureISO, nearestAirportFor } from "@/features/leisure/step3/concierge";
import { S3_BORDER_STRONG, S3_GOLD, S3_GOLD_GRADIENT, S3_GOLD_SOFT, S3_PANEL, S3_TEXT, S3_TEXT_FAINT, S3_TEXT_MUTED } from "@/features/leisure/tokens";
import { type Step3Context } from "@/features/leisure/types";
import { Check } from "lucide-react";
import React from "react";

export const SC_LABEL_CLS = "text-[10.5px] font-medium tracking-[0.18em] uppercase";

export const SC_INPUT_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: `1px solid ${S3_BORDER_STRONG}`,
  color: S3_TEXT,
};

export function SCField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={SC_LABEL_CLS} style={{ color: S3_TEXT_MUTED }}>
        {label}
      </span>
      {children}
    </label>
  );
}

export function SCInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-10 rounded-[10px] px-3 text-[13px] outline-none transition-colors focus:border-[rgba(201,164,106,0.6)]"
      style={SC_INPUT_STYLE}
    />
  );
}

export function SCTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={2}
      className="resize-none rounded-[10px] px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-[rgba(201,164,106,0.6)]"
      style={SC_INPUT_STYLE}
    />
  );
}

export function SCRadioRow({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string | undefined;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const on = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="rounded-full px-3.5 py-2 text-[12px] transition-colors"
            style={{
              background: on ? "rgba(201,164,106,0.14)" : "transparent",
              border: `1px solid ${on ? S3_GOLD : S3_BORDER_STRONG}`,
              color: on ? S3_GOLD_SOFT : S3_TEXT,
            }}
            aria-pressed={on}
            data-name={name}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function SmartConfigPanel({
  label,
  displayLabel,
  cfg,
  onChange,
  context,
}: {
  label: string;
  displayLabel?: string;
  cfg: Record<string, string>;
  onChange: (patch: Record<string, string>) => void;
  context: Step3Context;
}) {
  const isTransport = TRANSPORT_SERVICES.has(label);
  const isPorter = PORTER_SERVICES.has(label);
  const isOutbound = label === "Departure Transport" || label === "Porter Service Out";
  const dateSuggestion = isOutbound
    ? contextDepartureISO(context)
    : contextArrivalISO(context);
  const airport = nearestAirportFor(context.city);
  const hotelName = context.city ? `Hotel in ${context.city}` : "";
  const pickupSuggestion = isOutbound ? hotelName : airport;
  const destinationSuggestion = isOutbound ? airport : hotelName;
  const title = (displayLabel ?? label).toUpperCase();

  return (
    <div
      className="overflow-hidden rounded-[14px] p-5"
      style={{
        background: S3_PANEL,
        border: `1px solid ${S3_BORDER_STRONG}`,
        animation: "s3-slide-fade 240ms ease-out both",
      }}
    >
      <style>{`
        @keyframes s3-slide-fade {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="flex items-center gap-2.5 pb-3.5">
        <span
          className="grid h-6 w-6 place-items-center rounded-full"
          style={{ background: S3_GOLD_GRADIENT }}
        >
          <Check size={12} strokeWidth={3} style={{ color: "#1A1207" }} />
        </span>
        <div className="text-[12.5px] font-medium tracking-[0.18em]" style={{ color: S3_TEXT }}>
          {title}
        </div>
        <div className="text-[10.5px] tracking-[0.16em]" style={{ color: S3_TEXT_FAINT }}>
          · CONFIGURE
        </div>
      </div>

      {(label === "Group Lunch" || label === "Group Dinner") && (
        <div className="grid gap-4">
          <SCField label={label === "Group Lunch" ? "Lunch Style" : "Dinner Style"}>
            <SCRadioRow
              name={`${label}-style`}
              value={cfg.style}
              onChange={(v) => onChange({ style: v })}
              options={["2-course", "3-course", "Buffet"]}
            />
          </SCField>
          <SCField label="Optional Notes">
            <SCTextarea
              placeholder="Dietary preferences, timings, seating…"
              value={cfg.notes ?? ""}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {label === "Early Check-in" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <SCField label="Arrival Date (recommended)">
            <SCInput
              type="date"
              value={cfg.date ?? dateSuggestion}
              onChange={(e) => onChange({ date: e.target.value })}
            />
          </SCField>
          <SCField label="Preferred Arrival Time (optional)">
            <SCInput
              type="time"
              value={cfg.time ?? ""}
              onChange={(e) => onChange({ time: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {label === "Late Check-out" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <SCField label="Departure Date (recommended)">
            <SCInput
              type="date"
              value={cfg.date ?? dateSuggestion}
              onChange={(e) => onChange({ date: e.target.value })}
            />
          </SCField>
          <SCField label="Preferred Departure Time (optional)">
            <SCInput
              type="time"
              value={cfg.time ?? ""}
              onChange={(e) => onChange({ time: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {label === "VIP Welcome Amenities" && (
        <div className="grid gap-4">
          <SCField label="Amenity Type">
            <SCRadioRow
              name="vip-amenity"
              value={cfg.amenity}
              onChange={(v) => onChange({ amenity: v })}
              options={[
                "Fruit Platter",
                "Chocolate Selection",
                "Wine",
                "Champagne",
                "Local Speciality",
                "Custom Request",
              ]}
            />
          </SCField>
          <SCField label="Applies To">
            <SCRadioRow
              name="vip-deliver"
              value={cfg.deliverTo}
              onChange={(v) => onChange({ deliverTo: v })}
              options={["All Rooms", "Selected Rooms"]}
            />
          </SCField>
          {cfg.deliverTo === "Selected Rooms" && (
            <SCField label="Room Numbers (optional)">
              <SCInput
                placeholder="e.g. 204, 208, 312"
                value={cfg.rooms ?? ""}
                onChange={(e) => onChange({ rooms: e.target.value })}
              />
            </SCField>
          )}
          <SCField label="Notes (optional)">
            <SCTextarea
              placeholder="Delivery timing, personalisation…"
              value={cfg.notes ?? ""}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {label === "Hospitality Desk" && (
        <div className="grid gap-4">
          <SCField label="Service Type">
            <SCRadioRow
              name="hospitality-type"
              value={cfg.serviceType}
              onChange={(v) => onChange({ serviceType: v })}
              options={[
                "Welcome Desk",
                "Registration Desk",
                "Information Desk",
                "Name Badge Distribution",
                "Guest Assistance",
              ]}
            />
          </SCField>
          <SCField label="Optional Notes">
            <SCTextarea
              placeholder="Setup timing, staffing preferences…"
              value={cfg.notes ?? ""}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {isPorter && (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SCField
              label={
                isOutbound
                  ? "Departure Date (recommended)"
                  : "Arrival Date (recommended)"
              }
            >
              <SCInput
                type="date"
                value={cfg.date ?? dateSuggestion}
                onChange={(e) => onChange({ date: e.target.value })}
              />
            </SCField>
            <SCField label="Preferred Time (optional)">
              <SCInput
                type="time"
                value={cfg.time ?? ""}
                onChange={(e) => onChange({ time: e.target.value })}
              />
            </SCField>
            <SCField label="Estimated Number of Bags (optional)">
              <SCInput
                type="number"
                min={0}
                placeholder="e.g. 24"
                value={cfg.bags ?? ""}
                onChange={(e) => onChange({ bags: e.target.value })}
              />
            </SCField>
          </div>
          <SCField label="Special Instructions (optional)">
            <SCTextarea
              placeholder="Fragile items, room drop-off preferences…"
              value={cfg.notes ?? ""}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {isTransport && (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <SCField label="Transport Type">
              <SCRadioRow
                name={`${label}-mode`}
                value={cfg.mode}
                onChange={(v) => onChange({ mode: v })}
                options={["Taxi", "Private Chauffeur", "Coach", "Airport Shuttle"]}
              />
            </SCField>
            <SCField label="Direction">
              <SCRadioRow
                name={`${label}-direction`}
                value={cfg.direction ?? (isOutbound ? "Departure" : "Arrival")}
                onChange={(v) => onChange({ direction: v })}
                options={["Arrival", "Departure", "Both"]}
              />
            </SCField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SCField label="Pickup Date (recommended)">
              <SCInput
                type="date"
                value={cfg.date ?? dateSuggestion}
                onChange={(e) => onChange({ date: e.target.value })}
              />
            </SCField>
            <SCField label="Pickup Time (optional)">
              <SCInput
                type="time"
                value={cfg.time ?? ""}
                onChange={(e) => onChange({ time: e.target.value })}
              />
            </SCField>
            <SCField label={`Pickup Location${pickupSuggestion ? " (recommended)" : " (optional)"}`}>
              <SCInput
                placeholder={pickupSuggestion || "Enter pickup location"}
                value={cfg.pickup ?? pickupSuggestion}
                onChange={(e) => onChange({ pickup: e.target.value })}
              />
            </SCField>
            <SCField label={`Destination${destinationSuggestion ? " (recommended)" : " (optional)"}`}>
              <SCInput
                placeholder={destinationSuggestion || "Enter destination"}
                value={cfg.destination ?? destinationSuggestion}
                onChange={(e) => onChange({ destination: e.target.value })}
              />
            </SCField>
          </div>
          <SCField label="Applies To">
            <SCRadioRow
              name={`${label}-scope`}
              value={cfg.scope}
              onChange={(v) => onChange({ scope: v })}
              options={["Entire Group", "Group Leader", "Number of Guests"]}
            />
            {cfg.scope === "Number of Guests" && (
              <div className="mt-2">
                <SCInput
                  type="number"
                  min={1}
                  placeholder="Number of guests"
                  value={cfg.scopeDetail ?? ""}
                  onChange={(e) => onChange({ scopeDetail: e.target.value })}
                />
              </div>
            )}
          </SCField>
          <SCField label="Special Instructions (optional)">
            <SCTextarea
              placeholder="Flight number, luggage, signage…"
              value={cfg.notes ?? ""}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </SCField>
        </div>
      )}

      {label === "Room Location Preferences" && (
        <div className="grid gap-4">
          <SCField label="Room Preference">
            <SCRadioRow
              name="room-location-pref"
              value={cfg.preference}
              onChange={(v) => onChange({ preference: v })}
              options={[
                "Connecting Rooms",
                "Adjacent Rooms",
                "Same Floor",
                "Near Elevator",
                "Quiet Area",
                "High Floor",
              ]}
            />
          </SCField>
          <SCField label="Number of Rooms">
            <SCInput
              type="number"
              min={1}
              placeholder="e.g. 4"
              value={cfg.rooms ?? ""}
              onChange={(e) => onChange({ rooms: e.target.value })}
            />
          </SCField>
          <SCField label="Optional Notes">
            <SCTextarea
              placeholder="Preferences will be shared with the hotel. Requests are subject to availability."
              value={cfg.notes ?? ""}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          </SCField>
        </div>
      )}
    </div>
  );
}
