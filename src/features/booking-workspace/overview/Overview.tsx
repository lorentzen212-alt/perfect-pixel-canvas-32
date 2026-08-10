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
    <Card className="relative flex h-full flex-col px-5 pb-6 pt-4 sm:px-6">
      <span
        className="relative text-[11.5px] font-semibold uppercase"
        style={{ color: "#A98232", letterSpacing: "0.14em" }}
      >
        What happens next
      </span>

      <ol className="relative mt-1.5 flex min-h-0 flex-1 flex-col gap-[13px]">
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
              className="relative flex items-center gap-[14px] py-[10px]"
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute -inset-x-3 inset-y-0 overflow-hidden rounded-[9px]"
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
                    height: "calc(100% + 13px)",
                    background: done || active ? "#2E7D55" : "#D4D2CC",
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
        className="group relative inline-flex w-fit items-center gap-2.5 pt-[36px] text-[12.5px] font-medium transition-colors duration-200 hover:text-[#8C6A22]"
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
        border: "1px solid rgba(90,100,105,0.30)",
        borderRadius: 13,
        boxShadow:
          "0 2px 3px rgba(25,35,40,0.08), 0 7px 14px rgba(25,35,40,0.10), inset 0 1px 0 rgba(255,255,255,0.90), inset 0 0 0 1px rgba(255,255,255,0.55)",
      }}
    >
      <div className="relative px-5 py-[15px]">

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow>Booking details</Eyebrow>
          {status && (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.1em]"
              style={
                status.tone === "confirmed"
                  ? { color: GREEN, background: "rgba(46,107,69,0.08)", border: "1px solid rgba(46,107,69,0.24)" }
                  : { color: "#A98232", background: "rgba(169,130,50,0.08)", border: "1px solid rgba(169,130,50,0.28)" }
              }
            >
              <ShieldCheck size={13} />
              {status.label}
            </span>
          )}
        </div>
        <dl className="mt-[9px]">
          {rows.map((row, i) => {
            const isPaymentPill = row.k === "Payment terms" && /pending/i.test(row.v);
            return (
              <div
                key={row.k}
                className="-mx-1.5 grid grid-cols-[34px_minmax(0,1fr)] items-center gap-x-[12px] px-1.5"
                style={{
                  minHeight: 37,
                  background: i % 2 === 1 ? "rgba(90,95,90,0.022)" : "transparent",
                }}
              >
                <span
                  className="grid h-[33px] w-[33px] shrink-0 place-items-center rounded-[8px]"
                  style={{
                    background: "#FBFAF6",
                    border: "1px solid rgba(150,135,105,0.18)",
                    boxShadow:
                      "0 2px 4px rgba(30,40,45,0.07), inset 0 1px 0 rgba(255,255,255,0.95)",
                    color: "#B18428",
                    visibility: row.icon ? undefined : "hidden",
                  }}
                >
                  {row.icon}
                </span>
                <div
                  className="grid min-w-0 grid-cols-[146px_minmax(0,1fr)] items-center gap-x-[16px] self-stretch"
                  style={{
                    borderBottom:
                      i < rows.length - 1 ? "1px solid rgba(50,60,65,0.10)" : undefined,
                  }}
                >
                  <dt
                    className="truncate text-[10.5px] uppercase"
                    style={{ color: "#A98232", fontWeight: 600, letterSpacing: "0.06em" }}
                  >
                    {row.k}
                  </dt>
                  <dd className="min-w-0">
                    {isPaymentPill ? (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.04em]"
                        style={{
                          color: "#A98232",
                          background: "#F5EBD8",
                          border: "1px solid rgba(169,130,50,0.16)",
                        }}
                      >
                        <Clock size={12} />
                        {row.v}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span
                          className="truncate text-[13.5px]"
                          style={{ color: "#10253A", fontWeight: 500 }}
                        >
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
                      <span
                        className="block truncate text-[10.5px] leading-tight"
                        style={{ color: "#8A949B" }}
                      >
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
          <div className="mt-[15px] flex justify-center pb-[1px]">{footer}</div>
        )}
        {children}
      </div>
    </div>
  );
}

/* ── 2c · need help ────────────────────────────────────────── */
function NeedHelp({ onMessage }: { onMessage?: () => void }) {
  return (
    <Card className="px-5 py-[10px]">
      <Eyebrow>Need help?</Eyebrow>
      <p className="mt-1 text-[12.5px]" style={{ color: INK_2 }}>
        Questions or changes to your booking?
      </p>
      <button
        type="button"
        onClick={onMessage}
        className="mt-[7px] flex w-full items-center justify-center gap-2.5 rounded-[6px] py-[7px] text-[13px] font-semibold transition-opacity hover:opacity-80"
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

        <div className="grid items-stretch gap-4 lg:grid-cols-[54fr_46fr]">
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
