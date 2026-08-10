import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, Check } from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";
import { Card, Eyebrow, GoldLink, Hair, Plate, SectionRule, Slot } from "./primitives";
import { GOLD, GOLD_2, GREEN, HAIR, INK, INK_2, INK_3 } from "./materials";

export interface JourneyStep {
  label: string;
  sub: string;
  state: "done" | "active" | "todo";
}

export interface SummaryCell {
  icon: React.ReactNode;
  lead: string;
  label: string;
  onAction?: () => void;
}

/* ── 1 · current action — compact horizontal band ──────────── */
function CurrentAction({
  bookingId,
  progress,
  namesFilled,
  namesTotal,
  deadline,
}: {
  bookingId: string;
  progress: number;
  namesFilled: number;
  namesTotal: number;
  deadline: string;
}) {
  return (
    <Card className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
      <span
        className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full"
        style={{
          boxShadow:
            "inset 0 0 0 1px rgba(183,123,19,0.40), inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 2px rgba(15,25,35,0.10)",
          color: GOLD,
        }}
      >
        <ClipboardList size={23} strokeWidth={1.4} />
      </span>

      <div className="min-w-0 flex-1">
        <Eyebrow>Current action</Eyebrow>
        <p
          className="mt-1 text-[19px] leading-tight"
          style={{ color: INK, fontFamily: SERIF, fontWeight: 500 }}
        >
          Add rooming list
        </p>
        <p className="mt-1 text-[12.5px]" style={{ color: INK_2 }}>
          {namesFilled} of {namesTotal || 0} names added · {progress}% complete
          <span style={{ color: GOLD }}> · {deadline}</span>
        </p>
      </div>

      <Link
        to="/rooming/$bookingId"
        params={{ bookingId }}
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-full px-5 py-[9px] text-[12.5px] font-semibold transition-transform hover:-translate-y-[1px] sm:self-auto"
        style={{
          background: `linear-gradient(180deg, #E2BE6C, ${GOLD_2})`,
          color: "#241B06",
          boxShadow: "0 1px 2px rgba(15,25,35,0.18), inset 0 1px 0 rgba(255,255,255,0.55)",
        }}
      >
        Create rooming list
        <ArrowRight size={14} />
      </Link>
    </Card>
  );
}

/* ── 2a · what happens next — dense vertical timeline ──────── */
function NextSteps({ steps, onViewAll }: { steps: JourneyStep[]; onViewAll?: () => void }) {
  return (
    <Card className="px-5 py-4 sm:px-6 sm:py-5">
      <Eyebrow>What happens next</Eyebrow>
      <ol className="mt-3">
        {steps.map((s, i) => {
          const done = s.state === "done";
          const active = s.state === "active";
          return (
            <li key={s.label} className="relative flex items-center gap-3.5 py-[7px] pl-[2px]">
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[9px] top-[26px] w-px"
                  style={{ height: 20, background: done ? "rgba(78,122,92,0.45)" : HAIR }}
                />
              )}
              <span
                className="grid h-[16px] w-[16px] shrink-0 place-items-center rounded-full"
                style={{
                  background: done ? GREEN : active ? GOLD : "transparent",
                  boxShadow: done || active ? "none" : `inset 0 0 0 1px ${HAIR}`,
                  color: "#F7F5F0",
                }}
              >
                {done ? <Check size={10} strokeWidth={3} /> : null}
              </span>
              <span
                className="min-w-0 flex-1 truncate text-[13px]"
                style={{ color: active ? INK : done ? INK : INK_2, fontWeight: active ? 600 : 400 }}
              >
                {s.label}
              </span>
              <span
                className="shrink-0 text-[11.5px]"
                style={{ color: active ? GOLD : INK_3 }}
              >
                {s.sub}
              </span>
            </li>
          );
        })}
      </ol>
      <Hair className="mt-2" />
      <GoldLink label="View full timeline" onClick={onViewAll} className="mt-3" />
    </Card>
  );
}

/* ── 2b · booking details — card inserted into a socket ────── */
function DetailsCard({
  rows,
  footer,
  children,
}: {
  rows: { k: string; v: string }[];
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Slot>
      <Card className="px-4 py-4">
        <Eyebrow>Booking details</Eyebrow>
        <dl className="mt-2.5">
          {rows.map((row, i) => (
            <div
              key={row.k}
              className="grid grid-cols-[104px_minmax(0,1fr)] items-baseline gap-3 py-[6px]"
              style={i > 0 ? { borderTop: `1px solid ${HAIR}` } : undefined}
            >
              <dt
                className="text-[9.5px] font-semibold uppercase"
                style={{ color: INK_3, letterSpacing: "0.16em" }}
              >
                {row.k}
              </dt>
              <dd className="truncate text-[12.5px]" style={{ color: INK }}>
                {row.v}
              </dd>
            </div>
          ))}
        </dl>
        {footer && (
          <div className="mt-2.5 pt-2.5" style={{ borderTop: `1px solid ${HAIR}` }}>
            {footer}
          </div>
        )}
        {children}
      </Card>
    </Slot>
  );
}

/* ── 3 · closing summary strip — one ivory strip, 4 cells ──── */
function SummaryStrip({ cells }: { cells: SummaryCell[] }) {
  return (
    <Card className="grid grid-cols-2 sm:grid-cols-4">
      {cells.map((c, i) => (
        <button
          key={c.label + i}
          type="button"
          onClick={c.onAction}
          className="flex items-center gap-3 px-4 py-[13px] text-left transition-opacity hover:opacity-80"
          style={{
            borderLeft: i % 4 === 0 ? undefined : `1px solid ${HAIR}`,
            borderTop: i >= 2 ? `1px solid ${HAIR}` : undefined,
          }}
        >
          <span className="shrink-0" style={{ color: GOLD }}>
            {c.icon}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold" style={{ color: INK }}>
              {c.lead}
            </span>
            <span className="block truncate text-[11px]" style={{ color: INK_3 }}>
              {c.label}
            </span>
          </span>
        </button>
      ))}
    </Card>
  );
}

/* ── the folder composition ────────────────────────────────── */
export function OverviewFolder({
  bookingId,
  progress,
  namesFilled,
  namesTotal,
  deadline,
  journey,
  detailRows,
  detailsFooter,
  detailsExtra,
  summary,
  onViewTimeline,
  secondary,
}: {
  bookingId: string;
  progress: number;
  namesFilled: number;
  namesTotal: number;
  deadline: string;
  journey: JourneyStep[];
  detailRows: { k: string; v: string }[];
  detailsFooter?: React.ReactNode;
  detailsExtra?: React.ReactNode;
  summary: SummaryCell[];
  onViewTimeline?: () => void;
  secondary?: React.ReactNode;
}) {
  return (
    <Plate>
      <div className="space-y-3.5 px-4 pb-6 pt-5 sm:px-6 sm:pb-8 sm:pt-6">
        <CurrentAction
          bookingId={bookingId}
          progress={progress}
          namesFilled={namesFilled}
          namesTotal={namesTotal}
          deadline={deadline}
        />

        <div className="grid gap-3.5 xl:grid-cols-[62fr_38fr]">
          <NextSteps steps={journey} onViewAll={onViewTimeline} />
          <DetailsCard rows={detailRows} footer={detailsFooter}>
            {detailsExtra}
          </DetailsCard>
        </div>

        <SummaryStrip cells={summary} />

        {secondary && (
          <div className="space-y-3.5 pt-4">
            <SectionRule label="More booking information" />
            {secondary}
          </div>
        )}
      </div>
    </Plate>
  );
}
