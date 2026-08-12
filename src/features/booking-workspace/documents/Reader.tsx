import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Download,
  Maximize2,
  MessageCircle,
  Minus,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { INK, INK_2, INK_3 } from "@/features/booking-workspace/overview/materials";
import type { BookingDoc } from "@/components/BookingDocuments";
import type { Booking } from "@/lib/bookings";
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

function AskButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-[40px] items-center gap-2 rounded-[8px] px-5 text-[12.5px] font-medium transition-opacity hover:opacity-80"
      style={{ border: "1px solid rgba(27,37,48,0.16)", background: "#FFFFFF", color: INK }}
    >
      Ask a question <MessageCircle size={14} />
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

  const proposal = proposalForDocument(doc, booking);
  const canDownload = Boolean(doc.url);

  const paper = proposal ? (
    <ProposalPaper booking={booking} proposal={proposal} isCurrent={!doc.archived} />
  ) : (
    <GenericPaper booking={booking} doc={doc} />
  );

  const zoomIndex = ZOOMS.indexOf(zoom as (typeof ZOOMS)[number]);

  return (
    <div className="min-w-0">
      {/* ── HEADER — actions only; the document identity lives inside the paper ── */}
      <div className="mb-3 flex items-center justify-end gap-2">
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
      <div className="mt-3.5 flex items-center justify-center gap-1.5" style={{ color: INK_3 }}>
        <Search size={13} />
        <button
          type="button"
          aria-label="Zoom out"
          disabled={zoomIndex <= 0}
          onClick={() => setZoom(ZOOMS[Math.max(0, zoomIndex - 1)])}
          className="grid h-[24px] w-[24px] place-items-center transition-opacity disabled:opacity-35"
          style={{ color: INK_2 }}
        >
          <Minus size={13} />
        </button>
        <span className="relative inline-flex items-center">
          <select
            aria-label="Zoom level"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="appearance-none bg-transparent pr-4 text-[11.5px] tabular-nums outline-none"
            style={{ color: INK_2 }}
          >
            {ZOOMS.map((z) => (
              <option key={z} value={z}>
                {z}%
              </option>
            ))}
          </select>
          <ChevronDown
            size={11}
            className="pointer-events-none absolute right-0"
            style={{ color: INK_3 }}
          />
        </span>
        <button
          type="button"
          aria-label="Zoom in"
          disabled={zoomIndex >= ZOOMS.length - 1}
          onClick={() => setZoom(ZOOMS[Math.min(ZOOMS.length - 1, zoomIndex + 1)])}
          className="grid h-[24px] w-[24px] place-items-center transition-opacity disabled:opacity-35"
          style={{ color: INK_2 }}
        >
          <Plus size={13} />
        </button>
        <button
          type="button"
          aria-label="View fullscreen"
          onClick={() => setFull(true)}
          className="grid h-[24px] w-[24px] place-items-center"
          style={{ color: INK_2 }}
        >
          <Maximize2 size={13} />
        </button>
      </div>

      {/* ── ACTIONS ── */}
      <div className="mt-5">
        {proposal && proposalStatus === "awaiting_decision" ? (
          <>
            <div className="flex items-center gap-[14px]">
              <AskButton onClick={onAskQuestion} />
              <button
                type="button"
                onClick={() => onProposalStatusChange("declined")}
                className="inline-flex h-[40px] items-center justify-center rounded-[8px] px-5 text-[12.5px] font-medium transition-opacity hover:opacity-80"
                style={{ border: "1px solid #D9694F", color: "#C2452C", background: "#FFFFFF" }}
              >
                Decline proposal
              </button>
              <button
                type="button"
                onClick={() => onProposalStatusChange("accepted")}
                className="inline-flex h-[40px] items-center justify-center gap-2 rounded-[8px] px-6 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "#E08A2B" }}
              >
                Accept proposal <ArrowRight size={14} />
              </button>
            </div>
            <p className="mt-2 text-right text-[10px]" style={{ color: INK_3 }}>
              By accepting, you agree to the proposal terms and conditions.
            </p>
          </>
        ) : proposal ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <AskButton onClick={onAskQuestion} />
            <span className="text-[12.5px]" style={{ color: INK_2 }}>
              {proposalStatus === "accepted" ? "Proposal accepted" : "Proposal declined"}
            </span>
            <QuietButton onClick={() => canDownload && onDownload?.(doc)} disabled={!canDownload}>
              <Download size={13} /> Download
            </QuietButton>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <AskButton onClick={onAskQuestion} />
            <QuietButton onClick={() => canDownload && onDownload?.(doc)} disabled={!canDownload}>
              <Download size={13} /> Download
            </QuietButton>
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
