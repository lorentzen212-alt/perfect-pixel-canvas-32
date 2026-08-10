import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, MessageSquare, ShieldCheck, Users } from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";
import {
  Card,
  Eyebrow,
  
  Medallion,
  Plate,
  SectionRule,

  SolidButton,
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
    <Card className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:gap-5 sm:px-6">
      <Medallion size={56}>
        <Users size={24} strokeWidth={1.5} />
      </Medallion>

      <div className="min-w-0 flex-1">
        <Eyebrow>Current action</Eyebrow>
        <p
          className="mt-1.5 text-[21px] leading-tight"
          style={{ color: INK, fontFamily: SERIF, fontWeight: 500 }}
        >
          {title}
        </p>
        <p className="mt-1.5 text-[12.5px]" style={{ color: INK_2 }}>
          {description}
        </p>
      </div>

      <Link to="/rooming/$bookingId" params={{ bookingId }} className="shrink-0 self-start sm:self-auto">
        <SolidButton>
          Create rooming list
          <ArrowRight size={14} />
        </SolidButton>
      </Link>
    </Card>
  );
}

/* ── 2a · what happens next — numbered vertical timeline ───── */
function NextSteps({ steps, onViewAll }: { steps: JourneyStep[]; onViewAll?: () => void }) {
  return (
    <div
      className="relative flex flex-col self-start px-7 pb-7 pt-7"
      style={{
        background: "#F7F5EF",
        border: "1px solid rgba(100,110,115,0.25)",
        borderRadius: 15,
        boxShadow:
          "0 8px 20px rgba(20,32,40,0.10), 0 2px 5px rgba(20,32,40,0.07), inset 0 1px 0 rgba(255,255,255,0.85)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[9px] rounded-[9px]"
        style={{ border: "1px solid rgba(105,110,110,0.16)" }}
      />
      <span
        className="relative text-[11.5px] font-semibold uppercase"
        style={{ color: "#A98232", letterSpacing: "0.14em" }}
      >
        What happens next
      </span>
      <ol className="relative mt-4">
        {steps.map((s, i) => {
          const done = s.state === "done";
          const active = s.state === "active";
          const circle = done
            ? {
                height: 28,
                width: 28,
                background: "#2F7650",
                color: "#F9F6EF",
                fontSize: 11,
                boxShadow: "0 1px 3px rgba(20,40,30,0.15), inset 0 1px 0 rgba(255,255,255,0.15)",
              }
            : active
              ? {
                  height: 31,
                  width: 31,
                  background: "#B67B08",
                  color: "#FFFFFF",
                  fontSize: 13,
                  boxShadow: "0 2px 5px rgba(150,100,10,0.18)",
                }
              : {
                  height: 28,
                  width: 28,
                  background: "#F8F7F3",
                  border: "1px solid #C9CBCB",
                  color: "#77818A",
                  fontSize: 11,
                };
          return (
            <li
              key={s.label}
              className="relative flex items-center gap-4"
              style={{ minHeight: active ? 62 : 54 }}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute -inset-x-3 inset-y-[3px] rounded-[9px]"
                  style={{
                    background: "rgba(184,134,32,0.055)",
                    border: "1px solid rgba(184,134,32,0.25)",
                    boxShadow: "inset 2px 0 0 #B18428",
                  }}
                />
              )}
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[14.5px] top-1/2 h-full w-[1.5px]"
                  style={{
                    background: done || active ? "#2F7650" : "#D4D2CC",
                  }}
                />
              )}
              <span
                className="relative z-[1] grid shrink-0 place-items-center rounded-full font-semibold"
                style={circle}
              >
                {done ? <Check size={13} strokeWidth={3} /> : i + 1}
              </span>

              <span className="relative z-[1] flex min-w-0 flex-1 items-center justify-between gap-4">
                <span className="min-w-0">
                  <span className="block text-[14.5px] font-semibold leading-snug" style={{ color: "#10253A" }}>
                    {s.label}
                  </span>
                  {s.desc && (
                    <span className="mt-[3px] block text-[12.5px] leading-snug" style={{ color: "#74818B" }}>
                      {s.desc}
                    </span>
                  )}
                </span>
                {s.sub &&
                  (active ? (
                    <span
                      className="shrink-0 whitespace-nowrap rounded-full px-3 py-[6px] text-[11.5px] font-semibold"
                      style={{ background: "rgba(184,134,32,0.04)", border: "1px solid rgba(184,134,32,0.55)", color: "#A66F08" }}
                    >
                      {s.sub}
                    </span>
                  ) : done ? (
                    <span className="shrink-0 whitespace-nowrap text-[12.5px]" style={{ color: "#64727D" }}>
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
        className="group relative mt-6 inline-flex w-fit items-center gap-2.5 text-[12.5px] font-medium transition-colors duration-200 hover:text-[#8C6A22]"
        style={{ color: "#A98232" }}
      >
        View full timeline
        <ArrowRight
          size={13}
          className="transition-transform duration-200 group-hover:translate-x-[3px]"
        />
      </button>
    </div>
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
        border: "1px solid rgba(100,110,115,0.25)",
        borderRadius: 15,
        boxShadow:
          "0 8px 20px rgba(20,32,40,0.10), 0 2px 5px rgba(20,32,40,0.07), inset 0 1px 0 rgba(255,255,255,0.85)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[9px] rounded-[9px]"
        style={{ border: "1px solid rgba(105,110,110,0.16)" }}
      />
      <div className="relative px-7 py-6">

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
        <dl className="mt-2">
          {rows.map((row, i) => {
            const isPaymentPill = row.k === "Payment terms" && /pending/i.test(row.v);
            return (
              <div
                key={row.k}
                className="grid grid-cols-[minmax(0,180px)_minmax(0,1fr)] items-center gap-2.5 py-[5px]"
                style={{
                  background: i % 2 === 1 ? "#F3F1EB" : "transparent",
                  borderTop: i > 0 ? `1px solid ${HAIR}` : undefined,
                }}
              >
                <dt
                  className="flex items-center gap-2 text-[11px] font-semibold uppercase"
                  style={{ color: GOLD_2, letterSpacing: "0.05em" }}
                >
                  {row.icon && (
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-[8px]"
                      style={{
                        background: "#FFFFFF",
                        border: "1px solid rgba(195,138,32,0.18)",
                        boxShadow: "0 2px 4px rgba(20,32,40,0.04), 0 1px 2px rgba(20,32,40,0.03)",
                        color: GOLD_2,
                      }}
                    >
                      {row.icon}
                    </span>
                  )}
                  <span className="truncate">{row.k}</span>
                </dt>
                <dd className="min-w-0">
                  {isPaymentPill ? (
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold uppercase tracking-[0.04em]"
                      style={{ color: GOLD_2, background: "rgba(195,138,32,0.10)" }}
                    >
                      <Clock size={13} />
                      {row.v}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="truncate text-[14px] font-medium" style={{ color: INK }}>
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
                    <span className="block truncate text-[11.5px]" style={{ color: INK_3 }}>
                      {row.v2}
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
        {footer && (
          <div className="mt-2.5 flex justify-center pt-2.5" style={{ borderTop: `1px solid ${HAIR}` }}>
            {footer}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/* ── 2c · need help ────────────────────────────────────────── */
function NeedHelp({ onMessage }: { onMessage?: () => void }) {
  return (
    <Card className="px-5 py-3.5">
      <Eyebrow>Need help?</Eyebrow>
      <p className="mt-1 text-[12.5px]" style={{ color: INK_2 }}>
        Questions or changes to your booking?
      </p>
      <button
        type="button"
        onClick={onMessage}
        className="mt-2.5 flex w-full items-center justify-center gap-2.5 rounded-[6px] py-[9px] text-[13px] font-semibold transition-opacity hover:opacity-80"
        style={{
          color: GOLD,
          boxShadow: "inset 0 0 0 1px rgba(176,112,15,0.45)",
          background: "rgba(255,255,255,0.5)",
        }}
      >
        <MessageSquare size={15} />
        Message HotelGroupBook
        <ArrowRight size={14} />
      </button>
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
          className="flex items-center gap-3.5 px-5 py-[13px]"
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
      <div className="space-y-4 px-5 pb-6 pt-5 sm:px-7 sm:pb-6">
        <CurrentAction
          bookingId={bookingId}
          title={actionTitle}
          description={actionDescription}
        />

        <div className="grid items-start gap-4 lg:grid-cols-[54fr_46fr]">
          <NextSteps steps={journey} onViewAll={onViewTimeline} />
          <div className="space-y-4">
            <DetailsCard rows={detailRows} footer={detailsFooter} status={detailsStatus}>
              {detailsExtra}
            </DetailsCard>
            <NeedHelp onMessage={onMessage} />
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
