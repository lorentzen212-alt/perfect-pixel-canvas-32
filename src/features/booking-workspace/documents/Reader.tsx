import { useState } from "react";
import { Download, Maximize2, Minus, MoreVertical, Plus } from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { GoldLink, ShineGoldButton } from "@/features/booking-workspace/overview/primitives";
import { GOLD, HAIR, INK, INK_2, INK_3 } from "@/features/booking-workspace/overview/materials";
import type { BookingDoc } from "@/components/BookingDocuments";
import type { Booking } from "@/lib/bookings";
import { formatDay } from "@/lib/bookings";
import { proposalForDocument, type ProposalStatus } from "@/lib/proposals";
import { ProposalPaper } from "./ProposalPaper";
import { GenericPaper } from "./GenericPaper";

const EDGE_SOFT = "rgba(27,37,48,0.08)";
const PAPER_SHADOW = "0 1px 2px rgba(20,30,36,0.06), 0 18px 40px -30px rgba(20,30,36,0.45)";

const ZOOMS = [75, 100, 125, 150] as const;

function QuietButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-[7px] px-3.5 py-[8px] text-[12.5px] transition-opacity"
      style={{
        border: `1px solid ${EDGE_SOFT}`,
        background: "#FFFFFF",
        color: disabled ? INK_3 : INK_2,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

export function Reader({
  booking,
  doc,
  proposalStatus,
  onProposalStatusChange,
  onAskQuestion,
  onDownload,
}: {
  booking: Booking;
  doc: BookingDoc | undefined;
  proposalStatus: ProposalStatus;
  onProposalStatusChange: (next: ProposalStatus) => void;
  onAskQuestion?: () => void;
  onDownload?: (doc: BookingDoc) => void;
}) {
  const [zoom, setZoom] = useState(100);
  const [full, setFull] = useState(false);

  if (!doc) return null;

  const proposal = proposalForDocument(doc, booking.id);
  const canDownload = Boolean(doc.url);

  const subtitle = proposal
    ? `From ${proposal.hotelName} · ${formatDay(proposal.issueDate)}`
    : `From ${doc.uploadedBy === "Hotel" ? (booking.hotel ?? "the hotel") : "you"} · ${doc.uploadedLabel}`;

  const paper = proposal ? (
    <ProposalPaper booking={booking} proposal={proposal} />
  ) : (
    <GenericPaper booking={booking} doc={doc} />
  );

  const zoomIndex = ZOOMS.indexOf(zoom as (typeof ZOOMS)[number]);

  return (
    <div className="min-w-0">
      {/* ── HEADER ── */}
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="flex min-w-0 items-center gap-2.5">
            <h3
              className="truncate text-[19px] leading-tight"
              style={{ color: INK, fontFamily: SERIF, fontWeight: 500 }}
            >
              {doc.name}
            </h3>
            <span
              className="shrink-0 rounded-full px-2 py-[2px] text-[9px] uppercase tracking-[0.16em]"
              style={{ border: `1px solid ${HAIR}`, color: GOLD }}
            >
              Current
            </span>
          </span>
          <p className="mt-1 truncate text-[11.5px]" style={{ color: INK_3 }}>
            {subtitle}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => canDownload && onDownload?.(doc)}
            disabled={!canDownload}
            title={canDownload ? "Download PDF" : "No file available to download"}
            className="inline-flex items-center gap-2 rounded-[7px] px-3.5 py-2 text-[12px] font-medium transition-opacity hover:opacity-90"
            style={{
              background: canDownload ? INK : "rgba(27,37,48,0.10)",
              color: canDownload ? "#FAF8F3" : INK_3,
              cursor: canDownload ? "pointer" : "not-allowed",
            }}
          >
            <Download size={13} /> Download PDF
          </button>
          <button
            type="button"
            aria-label="More document options"
            className="grid h-[32px] w-[30px] place-items-center rounded-[7px]"
            style={{ border: `1px solid ${EDGE_SOFT}`, background: "#FFFFFF", color: INK_2 }}
          >
            <MoreVertical size={15} />
          </button>
        </div>
      </div>

      {/* ── PAPER ── */}
      <div className="overflow-hidden">
        <div
          style={{
            background: "#FFFFFF",
            border: `1px solid ${EDGE_SOFT}`,
            borderRadius: 6,
            boxShadow: PAPER_SHADOW,
            zoom: `${zoom}%`,
          }}
        >
          {paper}
        </div>
      </div>

      {/* ── CONTROLS (directly beneath the paper) ── */}
      <div className="mt-3.5 flex items-center justify-center">
        <div
          className="inline-flex items-center gap-1 rounded-full px-1.5 py-1"
          style={{ border: `1px solid ${EDGE_SOFT}`, background: "rgba(255,255,255,0.72)" }}
        >
          <button
            type="button"
            aria-label="Zoom out"
            disabled={zoomIndex <= 0}
            onClick={() => setZoom(ZOOMS[Math.max(0, zoomIndex - 1)])}
            className="grid h-[26px] w-[26px] place-items-center rounded-full transition-opacity disabled:opacity-35"
            style={{ color: INK_2 }}
          >
            <Minus size={13} />
          </button>
          <span
            className="min-w-[42px] text-center text-[11.5px] tabular-nums"
            style={{ color: INK_2 }}
          >
            {zoom}%
          </span>
          <button
            type="button"
            aria-label="Zoom in"
            disabled={zoomIndex >= ZOOMS.length - 1}
            onClick={() => setZoom(ZOOMS[Math.min(ZOOMS.length - 1, zoomIndex + 1)])}
            className="grid h-[26px] w-[26px] place-items-center rounded-full transition-opacity disabled:opacity-35"
            style={{ color: INK_2 }}
          >
            <Plus size={13} />
          </button>
          <span aria-hidden className="mx-1 h-[14px] w-px" style={{ background: HAIR }} />
          <button
            type="button"
            aria-label="View fullscreen"
            onClick={() => setFull(true)}
            className="grid h-[26px] w-[26px] place-items-center rounded-full"
            style={{ color: INK_2 }}
          >
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      {/* ── ACTIONS ── */}
      <div className="mt-5">
        {proposal && proposalStatus === "awaiting_decision" ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <QuietButton onClick={onAskQuestion}>Ask a question</QuietButton>
            <button
              type="button"
              onClick={() => onProposalStatusChange("declined")}
              className="rounded-[7px] px-3.5 py-[8px] text-[12.5px] transition-opacity hover:opacity-75"
              style={{ border: `1px solid ${HAIR}`, color: INK_2, background: "transparent" }}
            >
              Decline proposal
            </button>
            <div className="flex flex-col items-end gap-1.5">
              <ShineGoldButton onClick={() => onProposalStatusChange("accepted")}>
                Accept proposal →
              </ShineGoldButton>
              <span className="text-[10.5px]" style={{ color: INK_3 }}>
                By accepting, you agree to the proposal terms and conditions.
              </span>
            </div>
          </div>
        ) : proposal ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <QuietButton onClick={onAskQuestion}>Ask a question</QuietButton>
            <span className="text-[12.5px]" style={{ color: INK_2 }}>
              {proposalStatus === "accepted" ? "Proposal accepted" : "Proposal declined"}
            </span>
            <QuietButton onClick={() => canDownload && onDownload?.(doc)} disabled={!canDownload}>
              <Download size={13} /> Download
            </QuietButton>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <QuietButton onClick={onAskQuestion}>Ask a question</QuietButton>
            <QuietButton onClick={() => canDownload && onDownload?.(doc)} disabled={!canDownload}>
              <Download size={13} /> Download
            </QuietButton>
          </div>
        )}
        {!proposal && (
          <div className="mt-3 flex justify-end">
            <GoldLink label="Open in Messages" onClick={onAskQuestion} />
          </div>
        )}
      </div>

      <Dialog open={full} onOpenChange={setFull}>
        <DialogContent className="max-w-[900px] overflow-y-auto bg-transparent p-0 shadow-none sm:max-w-[900px]">
          <DialogTitle className="sr-only">{doc.name}</DialogTitle>
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 6,
              boxShadow: PAPER_SHADOW,
              maxHeight: "86vh",
              overflowY: "auto",
            }}
          >
            {paper}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
