import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Bus, Check, Clock, Coffee, ShieldCheck, Users, Utensils } from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";
import {
  Card,
  Eyebrow,
  
  Medallion,
  Plate,
  SectionRule,

  ShineGoldButton,
} from "./primitives";
import { GOLD, GOLD_2, GREEN, HAIR, INK, INK_2, INK_3 } from "./materials";

export interface JourneyStep {
  label: string;
  sub: string;
  /** supporting line under the step title */
  desc?: string;
  state: "done" | "active" | "todo";
}

export interface SummaryCell {
  icon: React.ReactNode;
  lead: string;
  label: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface DetailRow {
  k: string;
  v: string;
  /** secondary line under the value */
  v2?: string;
  icon?: React.ReactNode;
  stars?: number;
}

/* ── 1 · current action — raised horizontal band ───────────── */
function CurrentAction({
  bookingId,
  title,
  description,
}: {
  bookingId: string;
  title: string;
  description: string;
}) {
  return (
    <Card className="flex flex-col gap-3 px-5 py-[8px] sm:flex-row sm:items-center sm:gap-5 sm:px-6">
      <Medallion size={48}>
        <Users size={24} strokeWidth={1.5} />
      </Medallion>

      <div className="min-w-0 flex-1">
        <Eyebrow>Current action</Eyebrow>
        <p
          className="mt-0.5 text-[18px] leading-tight"
          style={{ color: INK, fontFamily: SERIF, fontWeight: 500 }}
        >
          {title}
        </p>
        <p className="mt-1.5 text-[12.5px]" style={{ color: INK_2 }}>
          {description}
        </p>
      </div>

      <Link to="/rooming/$bookingId" params={{ bookingId }} className="shrink-0 self-start sm:self-auto">
        <ShineGoldButton>
          Create rooming list
          <ArrowRight size={14} />
        </ShineGoldButton>
      </Link>
    </Card>
  );
}

/* ── 2a · what happens next — numbered vertical timeline ───── */
function NextSteps({ steps, onViewAll }: { steps: JourneyStep[]; onViewAll?: () => void }) {
  return (
    <Card className="relative flex h-full flex-col px-5 pb-2.5 pt-[9px] sm:px-6">
      <span
        className="relative text-[11.5px] font-semibold uppercase"
        style={{ color: "#A98232", letterSpacing: "0.14em" }}
      >
        What happens next
      </span>

      <ol className="relative mt-2 flex min-h-0 flex-1 flex-col">
        {steps.map((s, i) => {
          const done = s.state === "done";
          const active = s.state === "active";
          const circle: React.CSSProperties = done
            ? {
                height: 28,
                width: 28,
                background: "#2E7D55",
                color: "#FFFFFF",
                fontSize: 11,
                boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
              }
            : active
              ? {
                  height: 28,
                  width: 28,
                  background: "linear-gradient(135deg, #B8860B, #DAA520)",
                  color: "#FFFFFF",
                  fontSize: 12,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                }
              : {
                  height: 28,
                  width: 28,
                  background: "#F7F7F7",
                  border: "1px solid #DADDE0",
                  color: "#6B7177",
                  fontSize: 11,
                };
          const isDash = !s.sub || s.sub.trim() === "—" || s.sub.trim() === "-";
          return (
            <li
              key={s.label}
              className="relative flex flex-1 items-center gap-[14px]"
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute -inset-x-3 top-1/2 h-[46px] -translate-y-1/2 overflow-hidden rounded-[9px]"
                  style={{
                    background: "#F7F1E5",
                    border: "1px solid #E2CFB1",
                  }}
                >
                  <span
                    className="absolute inset-y-0 left-0 w-[4px]"
                    style={{ background: "#D4AF37" }}
                  />
                </span>
              )}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[14px] top-1/2 w-[2px] -translate-x-1/2"
                  style={{
                    height: "100%",
                    background: done || active ? "#2E7D55" : "#D4D2CC",
                  }}
                />
              )}
              <span
                className="relative z-[1] grid shrink-0 place-items-center rounded-full font-semibold"
                style={circle}
              >
                {done ? <Check size={14} strokeWidth={3} /> : i + 1}
              </span>

              <span className="relative z-[1] flex min-w-0 flex-1 items-center justify-between gap-4">
                <span className="min-w-0">
                  <span className="block text-[14.5px] font-semibold leading-snug" style={{ color: "#17232C" }}>
                    {s.label}
                  </span>
                  {s.desc && (
                    <span className="mt-[3px] block text-[12.5px] leading-snug" style={{ color: "#6B7177" }}>
                      {s.desc}
                    </span>
                  )}
                </span>
                {s.sub &&
                  (active ? (
                    <span
                      className="shrink-0 whitespace-nowrap rounded-full px-3 py-[6px] text-[11.5px] font-semibold"
                      style={{ background: "#FFFFFF00", border: "1px solid #D4AF37", color: "#A97824" }}
                    >
                      {s.sub}
                    </span>
                  ) : done || isDash ? (
                    <span className="shrink-0 whitespace-nowrap text-[12.5px]" style={{ color: "#8A9195" }}>
                      {s.sub}
                    </span>
                  ) : (
                    <span
                      className="shrink-0 whitespace-nowrap rounded-full px-3 py-[6px] text-[11.5px] font-semibold"
                      style={{ background: "rgba(100,110,115,0.025)", border: "1px solid rgba(100,110,115,0.22)", color: "#66737D" }}
                    >
                      {s.sub}
                    </span>
                  ))}
              </span>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={onViewAll}
        className="group relative inline-flex w-fit items-center gap-2.5 pt-[12px] text-[12.5px] font-medium transition-colors duration-200 hover:text-[#8C6A22]"
        style={{ color: "#A98232" }}
      >
        View full timeline
        <ArrowRight
          size={13}
          className="transition-transform duration-200 group-hover:translate-x-[3px]"
        />
      </button>
    </Card>

  );
}


/* ── 2b · booking details — business card inset in a recess ── */
function DetailsCard({
  rows,
  footer,
  children,
  status,
}: {
  rows: DetailRow[];
  footer?: React.ReactNode;
  children?: React.ReactNode;
  status?: { label: string; tone: "pending" | "confirmed" };
}) {
  return (
    <div
      className="relative self-start"
      style={{
        background: "#F7F5EF",
        border: "1px solid rgba(75,85,92,0.30)",
        borderRadius: 14,
        boxShadow:
          "0 2px 3px rgba(20,30,36,0.08), 0 7px 14px rgba(20,30,36,0.10), inset 0 1px 0 rgba(255,255,255,0.92), inset 0 0 0 1px rgba(255,255,255,0.50)",
      }}
    >
      <div className="relative px-6 py-[7px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow>Booking details</Eyebrow>
          {status && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em]"
              style={
                status.tone === "confirmed"
                  ? { color: GREEN, background: "rgba(46,107,69,0.08)", border: "1px solid rgba(46,107,69,0.24)" }
                  : { color: GOLD_2, background: "rgba(195,138,32,0.08)", border: "1px solid rgba(195,138,32,0.28)" }
              }
            >
              <ShieldCheck size={13} />
              {status.label}
            </span>
          )}
        </div>
        <dl className="mt-[6px]">
          {rows.map((row, i) => {
            const isPaymentPill = row.k === "Payment terms" && /pending/i.test(row.v);
            return (
              <div key={row.k} className="flex items-center gap-x-[14px]">
                <span
                  className="grid h-[32px] w-[32px] shrink-0 place-items-center rounded-[8px]"
                  style={{
                    background: "#FCFBF8",
                    border: "1px solid rgba(125,125,115,0.16)",
                    boxShadow:
                      "0 2px 5px rgba(25,35,40,0.09), 0 1px 2px rgba(25,35,40,0.05), inset 0 1px 0 rgba(255,255,255,0.95)",
                    color: "#A97824",
                    visibility: row.icon ? undefined : "hidden",
                  }}
                >
                  {row.icon}
                </span>

                <div
                  className="grid min-h-[27px] flex-1 grid-cols-[150px_minmax(0,1fr)] items-center gap-x-[10px] py-[2px]"
                  style={{
                    borderBottom:
                      i < rows.length - 1 ? "1px solid rgba(50,60,65,0.10)" : undefined,
                  }}
                >
                  <dt
                    className="truncate text-[11px] uppercase"
                    style={{ color: "#59636A", fontWeight: 600, letterSpacing: "0.05em" }}
                  >
                    {row.k}
                  </dt>
                  <dd className="min-w-0">
                    {isPaymentPill ? (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-semibold uppercase tracking-[0.04em]"
                        style={{
                          color: "#A97824",
                          background: "#F5EBD8",
                          border: "1px solid rgba(169,120,36,0.12)",
                        }}
                      >
                        <Clock size={13} />
                        {row.v}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[14px] font-medium" style={{ color: "#17232C" }}>
                          {row.v}
                        </span>
                        {row.stars ? (
                          <span className="shrink-0 text-[11px]" style={{ color: GOLD }}>
                            {"★".repeat(row.stars)}
                          </span>
                        ) : null}
                      </span>
                    )}
                    {row.v2 && (
                      <span className="block truncate text-[11.5px]" style={{ color: "#8A9195" }}>
                        {row.v2}
                      </span>
                    )}
                  </dd>
                </div>
              </div>
            );
          })}
        </dl>

        {footer && (
          <div className="mt-[5px] flex justify-center pb-[1px]">{footer}</div>
        )}

        {children}
      </div>
    </div>
  );
}

/* ── 2c · booking extras ───────────────────────────────────── */
export interface ExtraItem {
  label: string;
  status: string;
  tone: "positive" | "muted";
  icon: React.ReactNode;
}

const DEFAULT_EXTRAS: ExtraItem[] = [
  { label: "Breakfast", status: "Included", tone: "positive", icon: <Coffee size={19} strokeWidth={1.5} /> },
  { label: "Dinner", status: "Not added", tone: "muted", icon: <Utensils size={19} strokeWidth={1.5} /> },
  { label: "Coach parking", status: "Confirmed", tone: "positive", icon: <Bus size={19} strokeWidth={1.5} /> },
];

function BookingExtras({
  items = DEFAULT_EXTRAS,
  onView,
}: {
  items?: ExtraItem[];
  onView?: () => void;
}) {
  const includedCount = items.filter((i) => i.tone === "positive").length;
  return (
    <Card className="px-5 py-[7px]">
      <div className="flex items-center justify-between gap-3">
        <Eyebrow>Booking extras</Eyebrow>
        <span
          className="shrink-0 rounded-full px-2.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.1em]"
          style={{ color: GOLD, background: "rgba(176,112,15,0.07)", border: "1px solid rgba(176,112,15,0.20)" }}
        >
          {includedCount} included
        </span>
      </div>

      <ul className="mt-[7px] grid grid-cols-3">
        {items.map((item, i) => (
          <li
            key={item.label}
            className="flex flex-col items-center gap-[5px] px-2"
            style={{ borderLeft: i === 0 ? undefined : `1px solid ${HAIR}` }}
          >
            <span
              className="grid h-[34px] w-[34px] place-items-center rounded-[10px]"
              style={{
                background: "#FBFAF6",
                border: "1px solid rgba(150,125,80,0.20)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
                color: "#A98232",
              }}
            >
              {item.icon}
            </span>
            <span className="text-center">
              <span className="block text-[13px] font-semibold leading-tight" style={{ color: INK }}>
                {item.label}
              </span>
              <span
                className="mt-[2px] block text-[11.5px] leading-tight"
                style={{ color: item.tone === "positive" ? GREEN : INK_2 }}
              >
                {item.status}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-[7px] flex justify-center pt-[6px]" style={{ borderTop: `1px solid ${HAIR}` }}>
        <button
          type="button"
          onClick={onView}
          className="group inline-flex items-center gap-2 text-[12.5px] font-medium transition-colors hover:text-[#8C6A22]"
          style={{ color: "#A98232" }}
        >
          View booking extras
          <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
        </button>
      </div>
    </Card>
  );
}

/* ── 3 · closing summary strip — one ivory strip, 4 cells ──── */
function SummaryStrip({ cells }: { cells: SummaryCell[] }) {
  return (
    <Card className="grid grid-cols-2 sm:grid-cols-4">
      {cells.map((c, i) => (
        <div
          key={c.label + i}
          className="flex items-center gap-3.5 px-5 py-[14px]"
          style={{ borderLeft: i === 0 ? undefined : `1px solid ${HAIR}` }}
        >
          <Medallion size={40}>{c.icon}</Medallion>
          <span className="min-w-0">
            <span
              className="block truncate text-[19px] leading-tight"
              style={{ color: INK, fontFamily: SERIF, fontWeight: 500 }}
            >
              {c.lead}
            </span>
            <span className="block truncate text-[11.5px]" style={{ color: INK_2 }}>
              {c.label}
            </span>
            <button
              type="button"
              onClick={c.onAction}
              className="mt-1 inline-flex items-center gap-1.5 text-[11.5px] font-medium transition-opacity hover:opacity-70"
              style={{ color: GOLD }}
            >
              {c.actionLabel ?? "View details"}
              <ArrowRight size={12} />
            </button>
          </span>
        </div>
      ))}
    </Card>
  );
}

/* ── the folder composition ────────────────────────────────── */
export function OverviewFolder({
  bookingId,
  actionTitle = "Add rooming list",
  actionDescription = "Add guest names and room assignments so the hotel can prepare for your stay.",
  journey,
  detailRows,
  detailsFooter,
  detailsExtra,
  detailsStatus,
  summary,
  onViewTimeline,
  onMessage,
  secondary,
}: {
  bookingId: string;
  actionTitle?: string;
  actionDescription?: string;
  journey: JourneyStep[];
  detailRows: DetailRow[];
  detailsFooter?: React.ReactNode;
  detailsExtra?: React.ReactNode;
  detailsStatus?: { label: string; tone: "pending" | "confirmed" };
  summary: SummaryCell[];
  onViewTimeline?: () => void;
  onMessage?: () => void;
  secondary?: React.ReactNode;
}) {
  return (
    <Plate>
      <div className="flex flex-1 flex-col space-y-[9px] px-5 pb-[8px] pt-2.5 sm:px-7">
        <CurrentAction
          bookingId={bookingId}
          title={actionTitle}
          description={actionDescription}
        />

        <div className="grid items-stretch gap-[9px] lg:grid-cols-[54fr_46fr]">
          <NextSteps steps={journey} onViewAll={onViewTimeline} />
          <div className="space-y-[9px]">
            <DetailsCard rows={detailRows} footer={detailsFooter} status={detailsStatus}>
              {detailsExtra}
            </DetailsCard>
            <BookingExtras onView={onMessage} />
          </div>
        </div>

        <SummaryStrip cells={summary} />

        {secondary && (
          <div className="space-y-4 pt-4">
            <SectionRule label="More booking information" />
            {secondary}
          </div>
        )}
      </div>
    </Plate>
  );
}
