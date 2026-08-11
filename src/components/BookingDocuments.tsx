import * as React from "react";
import { useMemo, useRef, useState } from "react";
import {
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileText,
  Layers,
  Lock,
  MoreVertical,
  Receipt,
  ScrollText,
  Ticket,
} from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";
import { Plate } from "@/features/booking-workspace/overview/primitives";
import { GOLD, HAIR, INK, INK_2, INK_3 } from "@/features/booking-workspace/overview/materials";

/* ── warm document-desk surfaces ── */
const PAPER = "#FAF9F6";
const HOVER = "#F1EFE9";
const BEHIND = "#ECEAE4";
const EDGE = "rgba(27,37,48,0.12)";
const EDGE_SOFT = "rgba(27,37,48,0.08)";
const SELECTED = "#FAF6EC";

export type DocCategory =
  | "Contracts"
  | "Proposals"
  | "Confirmation"
  | "Invoices"
  | "Vouchers"
  | "Rooming lists"
  | "Other";

export type BookingDoc = {
  id: string;
  name: string;
  version: string;
  category: DocCategory;
  /** the type shown on the row's second line — "Proposal", "Confirmation", "PDF" */
  kind: string;
  uploadedBy: "Hotel" | "You";
  uploadedLabel: string;
  uploadedAt: number;
  size: number; // bytes
  url?: string;
  /** kept out of the primary list until "Show all documents" */
  archived?: boolean;
};

const CAT_ICON: Record<DocCategory, React.ReactNode> = {
  Contracts: <ScrollText size={15} />,
  Proposals: <FileText size={15} />,
  Confirmation: <FileText size={15} />,
  Invoices: <Receipt size={15} />,
  Vouchers: <Ticket size={15} />,
  "Rooming lists": <ClipboardList size={15} />,
  Other: <Layers size={15} />,
};

export function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

const MAX_BYTES = 25 * 1024 * 1024;
const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg";

/* ── seeded document library for a booking (replaced by real data when a
      documents backend exists — the shape stays identical) ── */
export function seedDocuments(reference: string): BookingDoc[] {
  const mk = (
    i: number,
    name: string,
    kind: string,
    category: DocCategory,
    uploadedBy: "Hotel" | "You",
    label: string,
    at: number,
    size: number,
    archived = false,
  ): BookingDoc => ({
    id: `${reference}-doc-${i}`,
    name,
    version: "1.0",
    category,
    kind,
    uploadedBy,
    uploadedLabel: label,
    uploadedAt: at,
    size,
    archived,
  });

  const d = (day: number, month = 7) => Date.UTC(2026, month, day);

  return [
    /* ── primary hotel documents ── */
    mk(1, "Hotel proposal #01", "Proposal", "Proposals", "Hotel", "11 Aug 2026", d(11), 2.4 * 1024 * 1024),
    mk(2, "Booking Confirmation", "Confirmation", "Confirmation", "Hotel", "10 Aug 2026", d(10), 640 * 1024),
    mk(3, "Proforma invoice", "PDF", "Invoices", "Hotel", "11 Aug 2026", d(11), 856 * 1024),
    mk(4, "Terms & Conditions", "PDF", "Contracts", "Hotel", "10 Aug 2026", d(10), 480 * 1024),
    mk(5, "Hotel information", "PDF", "Other", "Hotel", "9 Aug 2026", d(9), 520 * 1024),
    mk(6, "Rate details", "PDF", "Other", "Hotel", "9 Aug 2026", d(9), 310 * 1024),

    /* ── your documents ── */
    mk(20, "Rooming list v2", "Spreadsheet", "Rooming lists", "You", "8 Aug 2026", d(8), 45 * 1024),
    mk(21, "Payment confirmation", "PDF", "Other", "You", "7 Aug 2026", d(7), 730 * 1024),
    mk(22, "Signed contract", "PDF", "Contracts", "You", "6 Aug 2026", d(6), 990 * 1024),

    /* ── archive — hidden until "Show all documents" ── */
    mk(40, "Hotel proposal draft", "Proposal", "Proposals", "Hotel", "4 Aug 2026", d(4), 1.8 * 1024 * 1024, true),
    mk(41, "Deposit invoice", "PDF", "Invoices", "Hotel", "2 Aug 2026", d(2), 320 * 1024, true),
    mk(42, "Transfer schedule", "PDF", "Other", "Hotel", "28 Jul 2026", d(28, 6), 180 * 1024, true),
    mk(43, "Rooming list v1", "Spreadsheet", "Rooming lists", "You", "27 Jul 2026", d(27, 6), 38 * 1024, true),
    mk(44, "Allergy overview", "Spreadsheet", "Other", "You", "26 Jul 2026", d(26, 6), 30 * 1024, true),
  ];
}

function categorize(name: string): DocCategory {
  const n = name.toLowerCase();
  if (n.includes("contract")) return "Contracts";
  if (n.includes("proposal")) return "Proposals";
  if (n.includes("confirmation")) return "Confirmation";
  if (n.includes("invoice")) return "Invoices";
  if (n.includes("voucher")) return "Vouchers";
  if (n.includes("rooming")) return "Rooming lists";
  return "Other";
}

function docIcon(d: BookingDoc) {
  const spreadsheet = /\.(xlsx|xls|csv)$/i.test(d.name) || d.kind === "Spreadsheet";
  return spreadsheet ? <FileSpreadsheet size={15} /> : CAT_ICON[d.category];
}

/* ══════════════════ folder index tabs ══════════════════ */

type Section = "hotel" | "you";

const TAB_H = 42;

function TabLabel({
  label,
  count,
  active,
}: {
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <>
      <span
        className="truncate text-[12.5px] transition-colors duration-200"
        style={{ color: active ? INK : INK_3, fontWeight: active ? 500 : 400 }}
      >
        {label}
      </span>
      <span
        className="ml-3 grid h-[19px] min-w-[19px] shrink-0 place-items-center rounded-full px-1 text-[10px] transition-colors duration-200"
        style={{
          background: active ? "rgba(27,37,48,0.07)" : "rgba(27,37,48,0.06)",
          color: active ? INK_2 : INK_3,
        }}
      >
        {count}
      </span>
    </>
  );
}

/** the wide raised index section on the left — physically continuous with the body */
function FrontTab({
  label,
  count,
  onClick,
}: {
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute left-0 top-0 z-[3] flex items-center justify-between px-4 transition-colors duration-200"
      style={{
        width: "62%",
        height: TAB_H + 1,
        background: PAPER,
        borderTop: `1px solid ${EDGE_SOFT}`,
        borderLeft: `1px solid ${EDGE_SOFT}`,
        borderRight: `1px solid ${EDGE_SOFT}`,
        borderRadius: "10px 10px 0 0",
        boxShadow: "2px 0 4px -2px rgba(20,30,36,0.10)",
      }}
    >
      <TabLabel label={label} count={count} active />
    </button>
  );
}

/** the layer behind — starts lower, tucks under the front tab, clipped by the body */
function RearTab({
  label,
  count,
  onClick,
}: {
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute right-0 z-[1] flex items-center justify-between px-4 transition-colors duration-200"
      style={{
        left: "calc(62% - 16px)",
        top: 5,
        height: TAB_H + 8,
        background: BEHIND,
        borderTop: `1px solid ${EDGE_SOFT}`,
        borderLeft: `1px solid ${EDGE_SOFT}`,
        borderRight: `1px solid ${EDGE_SOFT}`,
        borderRadius: "10px 10px 0 0",
      }}
    >
      <span className="ml-3 flex min-w-0 flex-1 items-center justify-between pb-[8px]">
        <TabLabel label={label} count={count} active={false} />
      </span>
    </button>
  );
}


/* ══════════════════ document rows ══════════════════ */

function DocRow({
  doc,
  selected,
  last,
  onSelect,
}: {
  doc: BookingDoc;
  selected: boolean;
  last: boolean;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-[13px] text-left transition-colors duration-200"
      style={{
        background: selected ? SELECTED : hover ? HOVER : "transparent",
        borderBottom: last ? "none" : `1px solid ${HAIR}`,
      }}
    >
      {selected && (
        <span
          aria-hidden
          className="absolute inset-y-[6px] left-0 w-[2px] rounded-full"
          style={{ background: GOLD }}
        />
      )}
      <span className="flex min-w-0 items-center gap-3">
        <span className="shrink-0" style={{ color: selected ? GOLD : INK_3 }}>
          {docIcon(doc)}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span
              className="truncate text-[13px]"
              style={{ color: INK, fontWeight: selected ? 600 : 450 }}
            >
              {doc.name}
            </span>
            {selected && (
              <span
                className="shrink-0 text-[9px] uppercase tracking-[0.16em]"
                style={{ color: GOLD }}
              >
                Current
              </span>
            )}
          </span>
          <span className="mt-[2px] block truncate text-[11.5px]" style={{ color: INK_3 }}>
            {doc.kind}
          </span>
        </span>
      </span>
      <span className="shrink-0 whitespace-nowrap text-[11.5px]" style={{ color: INK_2 }}>
        {doc.uploadedLabel}
      </span>
    </button>
  );
}

/* ══════════════════ main view ══════════════════ */

export function BookingDocumentsView({ reference }: { reference: string }) {
  const [docs, setDocs] = useState<BookingDoc[]>(() => seedDocuments(reference));
  const [section, setSection] = useState<Section>("hotel");
  const [showAll, setShowAll] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(() => seedDocuments(reference)[0].id);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hotelDocs = useMemo(() => docs.filter((d) => d.uploadedBy === "Hotel"), [docs]);
  const yourDocs = useMemo(() => docs.filter((d) => d.uploadedBy === "You"), [docs]);

  /* badges count only what the section actually shows right now */
  const hotelVisible = useMemo(
    () => (showAll ? hotelDocs : hotelDocs.filter((d) => !d.archived)).length,
    [hotelDocs, showAll],
  );
  const yourVisible = useMemo(
    () => (showAll ? yourDocs : yourDocs.filter((d) => !d.archived)).length,
    [yourDocs, showAll],
  );

  const list = useMemo(() => {
    const source = section === "hotel" ? hotelDocs : yourDocs;
    return showAll ? source : source.filter((d) => !d.archived);
  }, [section, hotelDocs, yourDocs, showAll]);

  const hasArchive = useMemo(
    () => (section === "hotel" ? hotelDocs : yourDocs).some((d) => d.archived),
    [section, hotelDocs, yourDocs],
  );

  const selected = useMemo(
    () => docs.find((d) => d.id === selectedId) ?? docs[0],
    [docs, selectedId],
  );

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const accepted: BookingDoc[] = [];
    for (const f of Array.from(files)) {
      const ext = `.${f.name.split(".").pop()?.toLowerCase() ?? ""}`;
      if (!ACCEPT.split(",").includes(ext)) {
        setError(`${f.name}: unsupported file type`);
        continue;
      }
      if (f.size > MAX_BYTES) {
        setError(`${f.name}: exceeds the 25 MB limit`);
        continue;
      }
      accepted.push({
        id: `${Date.now()}-${f.name}`,
        name: f.name,
        version: "1.0",
        category: categorize(f.name),
        kind: /\.(xlsx|xls|csv)$/i.test(f.name) ? "Spreadsheet" : "PDF",
        uploadedBy: "You",
        uploadedLabel: "Just now",
        uploadedAt: Date.now(),
        size: f.size,
        url: URL.createObjectURL(f),
      });
    }
    if (accepted.length) {
      setError(null);
      setDocs((d) => [...accepted, ...d]);
      setSection("you");
    }
  }

  function download(doc: BookingDoc) {
    if (!doc.url) return;
    const a = document.createElement("a");
    a.href = doc.url;
    a.download = doc.name;
    a.click();
  }

  return (
    <Plate>
      <div className="flex flex-1 flex-col px-5 pb-[22px] pt-[18px] sm:px-7">
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />

        <div className="grid min-w-0 items-start gap-[30px] lg:grid-cols-[34fr_66fr]">
          {/* ── LEFT: the physical folder ── */}
          <div className="min-w-0">
            <div className="relative" style={{ height: 42 }}>
              {section === "hotel" ? (
                <>
                  <RearTab
                    label="Your documents"
                    count={yourVisible}
                    onClick={() => setSection("you")}
                  />
                  <FrontTab
                    label="Booking documents"
                    count={hotelVisible}
                    onClick={() => setSection("hotel")}
                  />
                </>
              ) : (
                <>
                  <RearTab
                    label="Booking documents"
                    count={hotelVisible}
                    onClick={() => setSection("hotel")}
                  />
                  <FrontTab
                    label="Your documents"
                    count={yourVisible}
                    onClick={() => setSection("you")}
                  />
                </>
              )}
            </div>

            {/* body + the second sheet behind it */}
            <div className="relative z-[2]">
              <span
                aria-hidden
                className="absolute inset-x-[3px] bottom-[-4px] top-[8px]"
                style={{ background: BEHIND, borderRadius: "0 0 10px 10px" }}
              />
              <div
                className="relative p-5"
                style={{
                  background: PAPER,
                  border: `1px solid ${EDGE_SOFT}`,
                  borderRadius: "0 10px 10px 10px",
                  boxShadow: "0 1px 3px rgba(20,30,36,0.05), 0 -1px 2px rgba(20,30,36,0.05)",
                }}
              >

                <div
                  className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-3 pb-2 text-[9.5px] uppercase tracking-[0.18em]"
                  style={{ color: INK_3 }}
                >
                  <span>Document name</span>
                  <span>Date</span>
                </div>

                <div className="-mx-3">
                  {list.map((d, i) => (
                    <DocRow
                      key={d.id}
                      doc={d}
                      selected={d.id === selected?.id}
                      last={i === list.length - 1}
                      onSelect={() => setSelectedId(d.id)}
                    />
                  ))}
                  {list.length === 0 && (
                    <p className="px-3 py-8 text-center text-[12.5px]" style={{ color: INK_3 }}>
                      No documents here yet.
                    </p>
                  )}
                </div>

                {section === "you" && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragging(false);
                      addFiles(e.dataTransfer.files);
                    }}
                    onClick={() => inputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
                    className="mt-3 cursor-pointer rounded-[8px] px-4 py-4 text-center transition-colors duration-200"
                    style={{
                      border: `1px dashed ${dragging ? GOLD : EDGE}`,
                      background: dragging ? SELECTED : "transparent",
                    }}
                  >
                    <p className="text-[12px]" style={{ color: INK_2 }}>
                      Drop a file here or{" "}
                      <span style={{ color: GOLD }}>browse</span>
                      <span style={{ color: INK_3 }}> · max 25 MB</span>
                    </p>
                  </div>
                )}

                {error && (
                  <p className="mt-2 text-[11.5px]" style={{ color: "#A44A38" }}>
                    {error}
                  </p>
                )}

                {hasArchive && (
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    className="mt-3 text-[12px] transition-opacity hover:opacity-75"
                    style={{ color: GOLD }}
                  >
                    {showAll ? "Show fewer documents" : "Show all documents"}
                  </button>
                )}
              </div>
            </div>
          </div>


          {/* ── RIGHT: the reading area shell ── */}
          <div className="min-w-0">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3
                  className="truncate text-[19px] leading-tight"
                  style={{ color: INK, fontFamily: SERIF, fontWeight: 500 }}
                >
                  {selected?.name}
                </h3>
                <p className="mt-1 text-[11.5px]" style={{ color: INK_3 }}>
                  {selected?.uploadedLabel} · {selected?.kind}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => selected && download(selected)}
                  className="inline-flex items-center gap-2 rounded-[7px] px-3.5 py-2 text-[12px] font-medium transition-opacity hover:opacity-90"
                  style={{ background: INK, color: PAPER }}
                >
                  <Download size={13} /> Download PDF
                </button>
                <button
                  type="button"
                  aria-label="More document options"
                  className="grid h-[32px] w-[30px] place-items-center rounded-[7px]"
                  style={{ border: `1px solid ${EDGE}`, background: PAPER, color: INK_2 }}
                >
                  <MoreVertical size={15} />
                </button>
              </div>
            </div>

            <div
              className="grid min-h-[620px] place-content-center rounded-[10px] px-8 py-16 text-center"
              style={{
                background: "#FDFCFA",
                border: `1px solid ${EDGE_SOFT}`,
                boxShadow: "0 1px 3px rgba(20,30,36,0.05)",
              }}
            >
              <p className="text-[15px]" style={{ color: INK_2, fontFamily: SERIF }}>
                {selected?.name}
              </p>
              <p className="mt-1 text-[12px]" style={{ color: INK_3 }}>
                {selected?.kind}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Plate>
  );
}
