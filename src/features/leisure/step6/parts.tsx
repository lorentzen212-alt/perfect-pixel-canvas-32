import { S6_GOLD, S6_GOLD_LIGHT, SERIF } from "@/features/leisure/tokens";
import { ChevronRight, Pencil } from "lucide-react";
import React from "react";

export const S6_IMG_STAY =
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80";

export const S6_IMG_DINING =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80";

export const S6_IMG_EXPERIENCE =
  "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&w=900&q=80";

export const S6_IMG_CONCIERGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80";

export function S6LuxCard({
  icon,
  title,
  detail,
  image,
  onClick,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  image: string;
  onClick: () => void;
  index: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="s6-card group relative flex h-[80px] w-full items-stretch overflow-hidden rounded-[20px] text-left lg:h-[84px]"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="flex flex-1 items-center gap-6 px-6 py-0 sm:px-9">
        <span className="shrink-0" style={{ color: S6_GOLD }}>
          {icon}
        </span>
        <span className="min-w-0">
          <span
            className="block text-[16px] uppercase tracking-[0.13em] text-[#F7F1E3] sm:text-[18px]"
            style={{ fontFamily: SERIF }}
          >
            {title}
          </span>
          <span
            className="mt-1 block truncate text-[13.5px] sm:text-[14.5px]"
            style={{ color: "rgba(236,229,214,0.74)" }}
          >
            {detail}
          </span>
        </span>
      </div>

      <span className="relative hidden w-[215px] shrink-0 overflow-hidden sm:block lg:w-[264px]">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(30,43,59,0.96) 0%, rgba(30,43,59,0.15) 45%, rgba(30,43,59,0) 100%)",
          }}
        />
      </span>

      <span className="flex w-[58px] shrink-0 items-center justify-center sm:w-[72px]">
        <ChevronRight
          size={22}
          strokeWidth={1.6}
          className="transition-transform duration-300 group-hover:translate-x-[3px]"
          style={{ color: S6_GOLD }}
        />
      </span>

    </button>
  );
}

export const S6_HERO =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80";

export const CITY_HERO_MAP: Record<string, string> = {
  Bergen: "https://images.unsplash.com/photo-1601439678777-b2b3c56fa627?auto=format&fit=crop&w=900&q=80",
  Oslo: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?auto=format&fit=crop&w=900&q=80",
  Lofoten: "https://images.unsplash.com/photo-1520681279154-51b3fb4ea0f8?auto=format&fit=crop&w=900&q=80",
  Tromsø: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=80",
  Stavanger: "https://images.unsplash.com/photo-1580996378027-23090ffcf60e?auto=format&fit=crop&w=900&q=80",
  Stockholm: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=900&q=80",
  Copenhagen: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=900&q=80",
  Helsinki: "https://images.unsplash.com/photo-1559060680-36cba6b95ca6?auto=format&fit=crop&w=900&q=80",
};

export const ROOM_TITLE: Record<string, string> = {
  single: "Single",
  twin: "Twin",
  double: "Double",
  triple: "Triple",
  family: "Family",
  accessible: "Accessible",
};

export function S6Panel({
  icon,
  title,
  onEdit,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span style={{ color: S6_GOLD_LIGHT }}>{icon}</span>
          <span
            className="text-[15px] font-semibold"
            style={{ color: S6_GOLD_LIGHT, fontFamily: SERIF }}
          >
            {title}
          </span>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 text-[12px] font-medium transition-colors hover:opacity-80"
            style={{ color: S6_GOLD_LIGHT }}
          >
            Edit
            <Pencil size={11} strokeWidth={2} />
          </button>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function S6Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-[14px] leading-relaxed" style={{ color: "#F5F1E6" }}>
      <span
        className="mt-[9px] inline-block h-[3px] w-[3px] flex-shrink-0 rounded-full"
        style={{ backgroundColor: "rgba(245,241,230,0.75)" }}
      />
      <span>{children}</span>
    </li>
  );
}

export function S6ReviewRow({
  icon,
  label,
  primary,
  secondary = [],
  onEdit,
}: {
  icon: React.ReactNode;
  label: string;
  primary: string;
  secondary?: string[];
  onEdit: () => void;
}) {
  return (
    <div
      className="flex items-start gap-7 px-[6px] py-[46px]"
      style={{
        borderBottom: "1px solid rgba(163,150,131,0.16)",
      }}
    >
      <span
        className="relative grid h-[39px] w-[39px] shrink-0 place-items-center rounded-full"
        style={{
          border: "1px solid rgba(176,141,63,0.55)",
          background: "transparent",
          color: "#B08D3F",
        }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div
          className="text-[9.8px] font-medium uppercase tracking-[0.3em]"
          style={{ color: "#B08D3F" }}
        >
          {label}
        </div>
        <div
          className="mt-3 text-[17.5px] font-medium leading-[1.4]"
          style={{ color: "#1F2328" }}
        >
          {primary}
        </div>
        {secondary.map((line) => (
          <div
            key={line}
            className="mt-1.5 text-[12.5px] font-normal leading-[1.6]"
            style={{ color: "rgba(70,74,80,0.62)" }}
          >
            {line}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onEdit}
        className="s6-edit-link mt-[18px] inline-flex shrink-0 items-center gap-2.5 text-[12.5px] font-normal"
      >
        Edit
        <ChevronRight className="s6-edit-arrow" size={13} strokeWidth={1.3} />
      </button>
    </div>
  );
}
