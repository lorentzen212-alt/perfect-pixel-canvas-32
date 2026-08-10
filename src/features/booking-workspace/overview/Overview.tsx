import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, MessageSquare, Users } from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";
import {
  Card,
  Eyebrow,
  GoldLink,
  Medallion,
  Plate,
  SectionRule,
  Slot,
  SolidButton,
} from "./primitives";
import { GOLD, GREEN, HAIR, INK, INK_2, INK_3 } from "./materials";

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
    <Card className="flex flex-col px-6 py-4">
      <Eyebrow>What happens next</Eyebrow>
      <ol className="mt-3 flex-1">
        {steps.map((s, i) => {
          const done = s.state === "done";
          const active = s.state === "active";
          return (
            <li key={s.label} className="relative flex gap-4 pb-4 last:pb-0">
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[12px] top-[25px] bottom-[2px] w-px"
                  style={{ background: done ? "rgba(46,107,69,0.35)" : "rgba(27,37,48,0.18)" }}
                />
              )}
              <span
                className="relative grid h-[25px] w-[25px] shrink-0 place-items-center rounded-full text-[11px] font-semibold"
                style={{
                  background: done ? GREEN : active ? GOLD : "transparent",
                  boxShadow: done || active ? "none" : `inset 0 0 0 1px rgba(27,37,48,0.25)`,
                  color: done || active ? "#F9F6EF" : INK_3,
                }}
              >
                {done ? <Check size={13} strokeWidth={3} /> : i + 1}
              </span>

              <span className="flex min-w-0 flex-1 items-start justify-between gap-4">
                <span className="min-w-0">
                  <span
                    className="block text-[13.5px] font-semibold leading-snug"
                    style={{ color: INK }}
                  >
                    {s.label}
                  </span>
                  {s.desc && (
                    <span className="mt-0.5 block text-[12px] leading-snug" style={{ color: INK_2 }}>
                      {s.desc}
                    </span>
                  )}
                </span>
                <span
                  className="shrink-0 pt-[1px] text-[12px]"
                  style={{ color: active ? GOLD : INK_2, fontWeight: active ? 600 : 400 }}
                >
                  {s.sub}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
      <GoldLink label="View full timeline" onClick={onViewAll} className="mt-4" />
    </Card>
  );
}

/* ── 2b · booking details — business card inset in a recess ── */
function DetailsCard({
  rows,
  footer,
  children,
}: {
  rows: DetailRow[];
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Slot>
      <div className="px-5 py-4">
        <Eyebrow>Booking details</Eyebrow>
        <dl className="mt-2.5">
          {rows.map((row, i) => (
            <div
              key={row.k}
              className="grid grid-cols-[minmax(0,132px)_minmax(0,1fr)] items-start gap-4 py-[7px]"
              style={i > 0 ? { borderTop: `1px solid ${HAIR}` } : undefined}
            >
              <dt className="flex items-center gap-2.5 text-[12.5px]" style={{ color: INK_2 }}>
                {row.icon && (
                  <span className="shrink-0" style={{ color: "rgba(27,37,48,0.45)" }}>
                    {row.icon}
                  </span>
                )}
                <span className="truncate">{row.k}</span>
              </dt>
              <dd className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="truncate text-[12.5px] font-medium" style={{ color: INK }}>
                    {row.v}
                  </span>
                  {row.stars ? (
                    <span className="shrink-0 text-[11px]" style={{ color: GOLD }}>
                      {"★".repeat(row.stars)}
                    </span>
                  ) : null}
                </span>
                {row.v2 && (
                  <span className="block truncate text-[11.5px]" style={{ color: INK_3 }}>
                    {row.v2}
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        {footer && (
          <div className="mt-3 flex justify-center pt-3" style={{ borderTop: `1px solid ${HAIR}` }}>
            {footer}
          </div>
        )}
        {children}
      </div>
    </Slot>
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
            <DetailsCard rows={detailRows} footer={detailsFooter}>
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
