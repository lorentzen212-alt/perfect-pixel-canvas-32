import { CITIES, COUNTRIES, EXPERIENCES, EXP_CATEGORIES, EXP_IMG, EXTRAS, HERO, ROOMS, STEP_META } from "@/features/leisure/data";
import { Counter, Field, Label, Toggle } from "@/features/leisure/legacy/primitives";
import { GOLD, GOLD_SOFT, HAIR, INK, IVORY, MUTED, NAVY_DEEP, SERIF } from "@/features/leisure/tokens";
import { type CountryCode, type StepKey } from "@/features/leisure/types";
import { cn } from "@/lib/utils";
import { Check, Pencil, Search, Sparkles } from "lucide-react";
import React from "react";

export function HeroPanel({ step }: { step: StepKey }) {
  const src = HERO[step];
  const meta = STEP_META[step];
  const [line1, line2] = meta.headline.split("\n");
  return (
    <aside className="relative min-h-[420px] lg:min-h-[calc(100vh-72px)] lg:sticky lg:top-0 overflow-hidden">
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        style={{ opacity: 1 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,20,34,0.35) 0%, rgba(6,20,34,0.55) 55%, rgba(6,20,34,0.85) 100%)",
        }}
      />
      <div className="relative z-10 flex h-full min-h-[420px] lg:min-h-[calc(100vh-72px)] flex-col justify-between p-8 sm:p-12 lg:p-14 text-white">
        <div>
          <div
            className="text-[11px] tracking-[0.24em] uppercase"
            style={{ color: GOLD_SOFT }}
          >
            {meta.kicker}
          </div>
          <h1
            className="mt-4 text-[38px] sm:text-[46px] lg:text-[52px] leading-[1.02] font-medium"
            style={{ fontFamily: SERIF }}
          >
            {line1}
            {line2 && (
              <>
                <br />
                {line2}
              </>
            )}
          </h1>
          <p className="mt-5 max-w-[380px] text-[15px] leading-relaxed text-white/80">
            {meta.sub}
          </p>
        </div>

        <ul className="space-y-3 pt-6">
          {[
            "One request.",
            "Multiple offers.",
            "The perfect trip.",
          ].map((t) => (
            <li key={t} className="flex items-center gap-3 text-[14px] text-white/90">
              <span
                className="grid h-6 w-6 place-items-center rounded-full"
                style={{ backgroundColor: "rgba(201,162,74,0.18)", border: `1px solid ${GOLD}` }}
              >
                <Check size={12} strokeWidth={2.4} style={{ color: GOLD_SOFT }} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export function ChapterTrack({ step, onGo }: { step: StepKey; onGo: (s: StepKey) => void }) {
  const items: StepKey[] = [1, 2, 3, 4, 5, 6];
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[12.5px]">
      {items.map((n, i) => {
        const active = n === step;
        const done = n < step;
        return (
          <li key={n} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => (done || active ? onGo(n) : null)}
              className={cn("group flex items-center gap-2", done || active ? "cursor-pointer" : "cursor-default")}
            >
              <span
                className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-semibold transition-all"
                style={{
                  backgroundColor: active ? GOLD : done ? "rgba(201,162,74,0.15)" : "transparent",
                  color: active ? NAVY_DEEP : done ? GOLD : MUTED,
                  border: `1px solid ${active || done ? GOLD : HAIR}`,
                }}
              >
                {done ? <Check size={12} strokeWidth={2.6} /> : n}
              </span>
              <span
                className="uppercase tracking-[0.14em]"
                style={{
                  color: active ? NAVY_DEEP : done ? INK : MUTED,
                  fontWeight: active ? 600 : 500,
                }}
              >
                {STEP_META[n].title}
              </span>
            </button>
            {i < items.length - 1 && (
              <span className="h-px w-5" style={{ backgroundColor: HAIR }} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function StepDestination({
  country,
  setCountry,
  city,
  setCity,
  customDestination,
  setCustomDestination,
  preferredHotel,
  setPreferredHotel,
}: {
  country: CountryCode;
  setCountry: (c: CountryCode) => void;
  city: string;
  setCity: (c: string) => void;
  customDestination: string;
  setCustomDestination: (v: string) => void;
  preferredHotel: string;
  setPreferredHotel: (v: string) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <Label>Choose your country</Label>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {COUNTRIES.map((c) => {
            const active = c.code === country;
            return (
              <button
                key={c.code}
                onClick={() => setCountry(c.code)}
                className="group relative flex items-center justify-center gap-2 rounded-[14px] px-4 py-3.5 text-[14px] font-medium transition-all"
                style={{
                  backgroundColor: active ? NAVY_DEEP : "#FFFFFF",
                  color: active ? "#FFF" : INK,
                  border: `1px solid ${active ? NAVY_DEEP : HAIR}`,
                  boxShadow: active
                    ? "0 8px 24px -12px rgba(11,27,43,0.35)"
                    : "0 1px 2px rgba(11,27,43,0.04)",
                }}
              >
                <span className="text-[18px] leading-none">{c.flag}</span>
                {c.name}
                {active && (
                  <span
                    className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full"
                    style={{ backgroundColor: GOLD, color: NAVY_DEEP }}
                  >
                    <Check size={12} strokeWidth={2.8} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>Popular destinations in {COUNTRIES.find((c) => c.code === country)!.name}</Label>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CITIES[country].map((c) => {
            const active = c === city && !customDestination.trim();
            return (
              <button
                key={c}
                onClick={() => {
                  setCity(c);
                  setCustomDestination("");
                }}
                className="relative overflow-hidden rounded-[14px] text-left transition-all"
                style={{
                  border: `1px solid ${active ? GOLD : HAIR}`,
                  backgroundColor: "#FFF",
                  boxShadow: active
                    ? "0 10px 26px -14px rgba(201,162,74,0.55)"
                    : "0 1px 2px rgba(11,27,43,0.04)",
                }}
              >
                <div className="h-24 w-full overflow-hidden">
                  <img
                    src={`https://source.unsplash.com/featured/400x300/?${encodeURIComponent(
                      c + " scandinavia",
                    )}`}
                    alt={c}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => ((e.currentTarget.style.display = "none"))}
                  />
                </div>
                <div className="flex items-center justify-between px-3.5 py-2.5">
                  <span className="text-[14px] font-medium" style={{ color: INK }}>
                    {c}
                  </span>
                  {active && <Check size={16} style={{ color: GOLD }} strokeWidth={2.4} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label>Or search for any destination</Label>
        <div
          className="mt-3 flex items-center gap-3 rounded-[14px] bg-white px-4 py-3.5"
          style={{ border: `1px solid ${HAIR}` }}
        >
          <Search size={16} style={{ color: MUTED }} />
          <input
            value={customDestination}
            onChange={(e) => setCustomDestination(e.target.value)}
            placeholder="Type city, region or venue"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
      </div>

      <div>
        <Label>Preferred hotel or special requests <span style={{ color: MUTED, fontWeight: 400 }}>(optional)</span></Label>
        <div className="mt-3 rounded-[14px] bg-white p-4" style={{ border: `1px solid ${HAIR}` }}>
          <textarea
            value={preferredHotel}
            onChange={(e) => setPreferredHotel(e.target.value)}
            placeholder="Tell us if you have a preferred hotel or anything important we should know…"
            rows={3}
            className="w-full resize-none bg-transparent text-[14px] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
      </div>
    </div>
  );
}

export function StepAccommodation(props: {
  rooms: Record<string, number>;
  roomCount: (k: string) => number;
  setRoom: (k: string, v: number) => void;
  totalRooms: number;
  earlyCheckin: boolean;
  setEarlyCheckin: (v: boolean) => void;
  lateCheckout: boolean;
  setLateCheckout: (v: boolean) => void;
  connectingRooms: boolean;
  setConnectingRooms: (v: boolean) => void;
  roomNotes: string;
  setRoomNotes: (v: string) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <Label>Choose your room distribution</Label>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {ROOMS.map((r) => {
            const n = props.roomCount(r.key);
            const active = n > 0;
            return (
              <div
                key={r.key}
                className="overflow-hidden rounded-[16px] bg-white transition-all"
                style={{
                  border: `1px solid ${active ? GOLD : HAIR}`,
                  boxShadow: active
                    ? "0 12px 30px -18px rgba(201,162,74,0.55)"
                    : "0 1px 2px rgba(11,27,43,0.04)",
                }}
              >
                <div className="h-32 w-full overflow-hidden">
                  <img src={r.img} alt={r.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <div className="text-[15px] font-medium" style={{ color: NAVY_DEEP }}>
                      {r.title}
                    </div>
                    <div className="text-[12.5px]" style={{ color: MUTED }}>
                      {r.desc}
                    </div>
                  </div>
                  <Counter value={n} onChange={(v) => props.setRoom(r.key, v)} />
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="mt-4 flex items-center justify-between rounded-[12px] px-4 py-3 text-[13px]"
          style={{ backgroundColor: "rgba(201,162,74,0.10)", color: NAVY_DEEP }}
        >
          <span>Total rooms selected</span>
          <span className="font-semibold" style={{ fontFamily: SERIF, fontSize: 20 }}>
            {props.totalRooms}
          </span>
        </div>
      </div>

      <div>
        <Label>Additional preferences <span style={{ color: MUTED, fontWeight: 400 }}>(optional)</span></Label>
        <div className="mt-3 flex flex-wrap gap-2">
          <Toggle label="Early check-in" checked={props.earlyCheckin} onChange={props.setEarlyCheckin} />
          <Toggle label="Late check-out" checked={props.lateCheckout} onChange={props.setLateCheckout} />
          <Toggle label="Connecting rooms" checked={props.connectingRooms} onChange={props.setConnectingRooms} />
        </div>
        <div className="mt-4 rounded-[14px] bg-white p-4" style={{ border: `1px solid ${HAIR}` }}>
          <textarea
            value={props.roomNotes}
            onChange={(e) => props.setRoomNotes(e.target.value)}
            placeholder="Tell us anything important about the room distribution…"
            rows={3}
            className="w-full resize-none bg-transparent text-[14px] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
      </div>
    </div>
  );
}

export function StepExtras({
  selected,
  onToggle,
}: {
  selected: Set<string>;
  onToggle: (label: string) => void;
}) {
  return (
    <div className="space-y-10">
      {EXTRAS.map((group) => (
        <div key={group.title}>
          <div className="mb-3 flex items-baseline justify-between">
            <div style={{ fontFamily: SERIF, color: NAVY_DEEP }} className="text-[22px] font-medium">
              {group.title}
            </div>
            <div className="text-[12px] uppercase tracking-[0.18em]" style={{ color: MUTED }}>
              Select any
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {group.items.map(({ label, Icon }) => {
              const active = selected.has(label);
              return (
                <button
                  key={label}
                  onClick={() => onToggle(label)}
                  className="relative flex items-center gap-3 rounded-[14px] bg-white px-4 py-3.5 text-left transition-all"
                  style={{
                    border: `1px solid ${active ? GOLD : HAIR}`,
                    boxShadow: active
                      ? "0 8px 22px -14px rgba(201,162,74,0.55)"
                      : "0 1px 2px rgba(11,27,43,0.04)",
                  }}
                >
                  <span
                    className="grid h-9 w-9 place-items-center rounded-[10px]"
                    style={{
                      backgroundColor: active ? "rgba(201,162,74,0.15)" : IVORY,
                      color: active ? GOLD : NAVY_DEEP,
                    }}
                  >
                    <Icon size={16} strokeWidth={1.8} />
                  </span>
                  <span className="text-[14px] font-medium" style={{ color: INK }}>
                    {label}
                  </span>
                  {active && (
                    <span
                      className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full"
                      style={{ backgroundColor: GOLD, color: NAVY_DEEP }}
                    >
                      <Check size={12} strokeWidth={2.8} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export function StepExperiences({
  category,
  setCategory,
  selected,
  onToggle,
  letUsRecommend,
  setLetUsRecommend,
}: {
  category: string;
  setCategory: (c: string) => void;
  selected: Set<string>;
  onToggle: (label: string) => void;
  letUsRecommend: boolean;
  setLetUsRecommend: (v: boolean) => void;
}) {
  const filtered = EXPERIENCES.filter((e) => category === "All" || e.category === category);
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {EXP_CATEGORIES.map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="rounded-full px-4 py-2 text-[13px] font-medium transition-all"
              style={{
                backgroundColor: active ? NAVY_DEEP : "#FFF",
                color: active ? "#FFF" : INK,
                border: `1px solid ${active ? NAVY_DEEP : HAIR}`,
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(({ label, Icon }) => {
          const active = selected.has(label);
          const img = EXP_IMG[label];
          return (
            <button
              key={label}
              onClick={() => onToggle(label)}
              className="group relative overflow-hidden rounded-[16px] bg-white text-left transition-all"
              style={{
                border: `1px solid ${active ? GOLD : HAIR}`,
                boxShadow: active
                  ? "0 14px 34px -18px rgba(201,162,74,0.55)"
                  : "0 1px 2px rgba(11,27,43,0.04)",
              }}
            >
              <div className="relative h-40 w-full overflow-hidden">
                <img
                  src={img}
                  alt={label}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(6,20,34,0) 40%, rgba(6,20,34,0.75) 100%)",
                  }}
                />
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <Icon size={16} strokeWidth={2} />
                  <span className="text-[15px] font-medium" style={{ fontFamily: SERIF }}>
                    {label}
                  </span>
                </div>
                {active && (
                  <span
                    className="absolute top-3 right-3 grid h-7 w-7 place-items-center rounded-full"
                    style={{ backgroundColor: GOLD, color: NAVY_DEEP }}
                  >
                    <Check size={14} strokeWidth={2.8} />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setLetUsRecommend(!letUsRecommend)}
        className="flex w-full items-center justify-between rounded-[16px] p-5 text-left transition-all"
        style={{
          backgroundColor: letUsRecommend ? NAVY_DEEP : "#FFF",
          color: letUsRecommend ? "#FFF" : INK,
          border: `1px solid ${letUsRecommend ? NAVY_DEEP : HAIR}`,
        }}
      >
        <div className="flex items-center gap-4">
          <span
            className="grid h-11 w-11 place-items-center rounded-[12px]"
            style={{
              backgroundColor: letUsRecommend ? "rgba(201,162,74,0.20)" : IVORY,
              color: GOLD,
            }}
          >
            <Sparkles size={18} strokeWidth={1.8} />
          </span>
          <div>
            <div className="text-[15px] font-medium" style={{ fontFamily: SERIF, fontSize: 20 }}>
              Let HotelGroupBook recommend experiences
            </div>
            <div className="text-[13px] opacity-80">
              We'll suggest the best options for your group.
            </div>
          </div>
        </div>
        <span
          className="grid h-6 w-6 place-items-center rounded-full"
          style={{
            backgroundColor: letUsRecommend ? GOLD : "transparent",
            border: `1.5px solid ${letUsRecommend ? GOLD : HAIR}`,
            color: NAVY_DEEP,
          }}
        >
          {letUsRecommend && <Check size={13} strokeWidth={2.8} />}
        </span>
      </button>
    </div>
  );
}

export function StepContact(props: {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  organisation: string;
  setOrganisation: (v: string) => void;
  additionalComments: string;
  setAdditionalComments: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <Field label="First name" value={props.firstName} onChange={props.setFirstName} placeholder="Enter first name" />
      <Field label="Last name" value={props.lastName} onChange={props.setLastName} placeholder="Enter last name" />
      <Field label="Email" value={props.email} onChange={props.setEmail} placeholder="Enter email address" type="email" />
      <Field label="Phone" value={props.phone} onChange={props.setPhone} placeholder="+47 000 00 000" type="tel" />
      <div className="sm:col-span-2">
        <Field
          label="Organisation / Group name"
          value={props.organisation}
          onChange={props.setOrganisation}
          placeholder="Enter organisation or group name"
          optional
        />
      </div>
      <div className="sm:col-span-2">
        <Label>
          Additional comments <span style={{ color: MUTED, fontWeight: 400 }}>(optional)</span>
        </Label>
        <div className="mt-3 rounded-[14px] bg-white p-4" style={{ border: `1px solid ${HAIR}` }}>
          <textarea
            value={props.additionalComments}
            onChange={(e) => props.setAdditionalComments(e.target.value)}
            placeholder="Tell us anything else we should know…"
            rows={4}
            className="w-full resize-none bg-transparent text-[14px] outline-none placeholder:text-[#9CA3AF]"
          />
        </div>
      </div>
    </div>
  );
}

export function StepReview({
  onEdit,
  data,
}: {
  onEdit: (s: StepKey) => void;
  data: {
    country: string;
    city: string;
    guests: number;
    arrival?: Date;
    departure?: Date;
    rooms: Record<string, number>;
    earlyCheckin: boolean;
    lateCheckout: boolean;
    connectingRooms: boolean;
    preferredHotel: string;
    extras: string[];
    experiences: string[];
    letUsRecommend: boolean;
    contactName: string;
    email: string;
    phone: string;
    organisation: string;
    additionalComments: string;
  };
}) {
  const roomsSummary = Object.entries(data.rooms)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => {
      const r = ROOMS.find((x) => x.key === k);
      return `${v} ${r?.title ?? k}`;
    });
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ReviewCard title="Destination" onEdit={() => onEdit(1)}>
        <Row label="Country" value={data.country} />
        <Row label="City" value={data.city} />
        {data.preferredHotel && <Row label="Preferences" value={data.preferredHotel} />}
      </ReviewCard>
      <ReviewCard title="Accommodation" onEdit={() => onEdit(2)}>
        {roomsSummary.length === 0 ? (
          <Row label="Rooms" value="None selected" />
        ) : (
          roomsSummary.map((r) => <Row key={r} label="" value={r} />)
        )}
        {(data.earlyCheckin || data.lateCheckout || data.connectingRooms) && (
          <Row
            label="Preferences"
            value={[
              data.earlyCheckin && "Early check-in",
              data.lateCheckout && "Late check-out",
              data.connectingRooms && "Connecting rooms",
            ]
              .filter(Boolean)
              .join(", ")}
          />
        )}
      </ReviewCard>
      <ReviewCard title="Extras" onEdit={() => onEdit(3)}>
        {data.extras.length === 0 ? (
          <Row label="" value="No extras selected" />
        ) : (
          data.extras.map((e) => <Row key={e} label="" value={e} />)
        )}
      </ReviewCard>
      <ReviewCard title="Experiences" onEdit={() => onEdit(4)}>
        {data.experiences.length === 0 && !data.letUsRecommend ? (
          <Row label="" value="No experiences selected" />
        ) : (
          <>
            {data.experiences.map((e) => (
              <Row key={e} label="" value={e} />
            ))}
            {data.letUsRecommend && (
              <Row label="" value="Recommendations requested" />
            )}
          </>
        )}
      </ReviewCard>
      <ReviewCard title="Contact" onEdit={() => onEdit(5)} full>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Row label="Name" value={data.contactName || "—"} />
          <Row label="Email" value={data.email || "—"} />
          <Row label="Phone" value={data.phone || "—"} />
          <Row label="Organisation" value={data.organisation || "—"} />
          {data.additionalComments && (
            <div className="sm:col-span-2">
              <Row label="Comments" value={data.additionalComments} />
            </div>
          )}
        </div>
      </ReviewCard>
    </div>
  );
}

export function ReviewCard({
  title,
  onEdit,
  children,
  full,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[16px] bg-white p-5",
        full && "md:col-span-2",
      )}
      style={{ border: `1px solid ${HAIR}` }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-[0.18em]" style={{ color: GOLD }}>
          {title}
        </div>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 text-[12.5px]"
          style={{ color: MUTED }}
        >
          <Pencil size={12} />
          Edit
        </button>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-[14px]">
      {label && <span style={{ color: MUTED }}>{label}</span>}
      <span className="text-right" style={{ color: INK }}>
        {value}
      </span>
    </div>
  );
}
