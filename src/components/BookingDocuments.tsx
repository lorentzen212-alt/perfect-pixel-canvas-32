import * as React from "react";
import { useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Files,
  Grid2X2,
  Layers,
  Lock,
  MoreHorizontal,
  Receipt,
  ScrollText,
  Search,
  Ticket,
  Upload,
  UploadCloud,
  ClipboardList,
  List,
} from "lucide-react";
import { SERIF } from "@/components/DashboardChrome";

/* ── shared navy material (identical to Booking Overview / Changes) ── */
const NAVY_TEXTURE =
  "radial-gradient(1100px 420px at 18% -10%, rgba(255,255,255,0.045), transparent 62%), radial-gradient(700px 360px at 88% 108%, rgba(120,160,195,0.05), transparent 60%)";
const INK = `${NAVY_TEXTURE}, linear-gradient(180deg, #24445E 0%, #203D55 55%, #1C374D 100%)`;
const INK_2 = `${NAVY_TEXTURE}, linear-gradient(180deg, #2A4B64 0%, #26455C 55%, #223F54 100%)`;
const NAVY_INNER =
  "inset 0 1px 0 rgba(255,255,255,0.03), inset 0 -1px 0 rgba(0,0,0,0.12), inset 0 8px 22px -18px rgba(0,0,0,0.35), 0 0 0 1px rgba(8,18,28,0.25)";
const NAVY_BORDER = "rgba(255,255,255,0.06)";
const TEXT = "#F3F1EB";
const TEXT_2 = "rgba(233,238,243,0.78)";
const MUTED = "rgba(206,218,228,0.55)";
const GOLD_MET_MID = "#C5962D";
const GOLD_SOFT = "#D9BE74";

export type DocCategory =
  | "Contracts"
  | "Proposals"
  | "Invoices"
  | "Vouchers"
  | "Rooming lists"
  | "Other";

export type BookingDoc = {
  id: string;
  name: string;
  version: string;
  category: DocCategory;
  uploadedBy: "Hotel" | "You";
  uploadedLabel: string;
  uploadedAt: number;
  size: number; // bytes
  url?: string;
};

const CAT_COLOR: Record<DocCategory, string> = {
  Contracts: "#D9A441",
  Proposals: "#7FA7D4",
  Invoices: "#8DA88A",
  Vouchers: "#D08A7A",
  "Rooming lists": "#9A8FD0",
  Other: "#9BA9B4",
};

const CAT_ICON: Record<DocCategory, React.ReactNode> = {
  Contracts: <ScrollText size={17} />,
  Proposals: <FileText size={17} />,
  Invoices: <Receipt size={17} />,
  Vouchers: <Ticket size={17} />,
  "Rooming lists": <ClipboardList size={17} />,
  Other: <Layers size={17} />,
};

const CATEGORIES: DocCategory[] = [
  "Contracts",
  "Proposals",
  "Invoices",
  "Vouchers",
  "Rooming lists",
  "Other",
];

export function formatSize(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

const MAX_BYTES = 25 * 1024 * 1024;
const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg";
const PAGE_SIZE = 6;

/* ── seeded document library for a booking (replaced by real data when a
      documents backend exists — the shape stays identical) ── */
export function seedDocuments(reference: string): BookingDoc[] {
  const now = Date.UTC(2026, 6, 27);
  const day = 86400000;
  const mk = (
    i: number,
    name: string,
    version: string,
    category: DocCategory,
    uploadedBy: "Hotel" | "You",
    ago: number,
    label: string,
    size: number,
  ): BookingDoc => ({
    id: `${reference}-doc-${i}`,
    name,
    version,
    category,
    uploadedBy,
    uploadedLabel: label,
    uploadedAt: now - ago * day,
    size,
  });

  const base: BookingDoc[] = [
    mk(1, "Contract.pdf", "1.2", "Contracts", "Hotel", 1, "Yesterday, 14:22", 1.2 * 1024 * 1024),
    mk(2, "Group Proposal.pdf", "1.0", "Proposals", "Hotel", 2, "25 Jul 2026", 2.4 * 1024 * 1024),
    mk(3, `Invoice_${reference.replace("HGB-", "")}.pdf`, "1.0", "Invoices", "Hotel", 4, "23 Jul 2026", 856 * 1024),
    mk(4, "RoomingList_v2.xlsx", "2.0", "Rooming lists", "You", 5, "22 Jul 2026", 45 * 1024),
    mk(5, "Breakfast_Voucher.pdf", "1.0", "Vouchers", "Hotel", 9, "18 Jul 2026", 612 * 1024),
    mk(6, "Payment_Confirmation.pdf", "1.0", "Other", "You", 12, "15 Jul 2026", 730 * 1024),
  ];

  /* the remaining library — same categories, older */
  const extras: Array<[string, string, DocCategory, "Hotel" | "You", number, string, number]> = [
    ["Contract_Addendum.pdf", "1.0", "Contracts", "Hotel", 14, "13 Jul 2026", 480 * 1024],
    ["Contract_Signed.pdf", "1.1", "Contracts", "You", 16, "11 Jul 2026", 990 * 1024],
    ["Proposal_Revision_A.pdf", "1.1", "Proposals", "Hotel", 18, "09 Jul 2026", 1.8 * 1024 * 1024],
    ["Proposal_Meeting_Rooms.pdf", "1.0", "Proposals", "Hotel", 19, "08 Jul 2026", 1.1 * 1024 * 1024],
    ["Proposal_Dining.pdf", "1.0", "Proposals", "Hotel", 20, "07 Jul 2026", 640 * 1024],
    ["Invoice_Deposit.pdf", "1.0", "Invoices", "Hotel", 21, "06 Jul 2026", 320 * 1024],
    ["Invoice_Services.pdf", "1.0", "Invoices", "Hotel", 22, "05 Jul 2026", 410 * 1024],
    ["Invoice_Dining.pdf", "1.0", "Invoices", "Hotel", 23, "04 Jul 2026", 288 * 1024],
    ["Invoice_Balance.pdf", "1.0", "Invoices", "Hotel", 24, "03 Jul 2026", 356 * 1024],
    ["Dinner_Voucher.pdf", "1.0", "Vouchers", "Hotel", 25, "02 Jul 2026", 520 * 1024],
    ["RoomingList_v1.xlsx", "1.0", "Rooming lists", "You", 26, "01 Jul 2026", 38 * 1024],
    ["RoomingList_Template.xlsx", "1.0", "Rooming lists", "Hotel", 28, "29 Jun 2026", 22 * 1024],
    ["Transfer_Schedule.pdf", "1.0", "Other", "Hotel", 29, "28 Jun 2026", 180 * 1024],
    ["Arrival_Instructions.pdf", "1.0", "Other", "Hotel", 30, "27 Jun 2026", 210 * 1024],
    ["Allergy_Overview.xlsx", "1.0", "Other", "You", 31, "26 Jun 2026", 30 * 1024],
    ["Insurance_Certificate.pdf", "1.0", "Other", "You", 32, "25 Jun 2026", 460 * 1024],
    ["Group_Photo_Consent.pdf", "1.0", "Other", "You", 33, "24 Jun 2026", 140 * 1024],
    ["Hotel_Map.pdf", "1.0", "Other", "Hotel", 34, "23 Jun 2026", 520 * 1024],
  ];

  return [
    ...base,
    ...extras.map((e, i) => mk(100 + i, e[0], e[1], e[2], e[3], e[4], e[5], e[6])),
  ];
}

function fileIcon(name: string) {
  const spreadsheet = /\.(xlsx|xls|csv)$/i.test(name);
  return spreadsheet ? <FileSpreadsheet size={16} /> : <FileText size={16} />;
}

function categorize(name: string): DocCategory {
  const n = name.toLowerCase();
  if (n.includes("contract")) return "Contracts";
  if (n.includes("proposal")) return "Proposals";
  if (n.includes("invoice")) return "Invoices";
  if (n.includes("voucher")) return "Vouchers";
  if (n.includes("rooming")) return "Rooming lists";
  return "Other";
}

/* ── donut ── */
function Donut({ slices, total }: { slices: Array<{ color: string; value: number }>; total: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative shrink-0" style={{ width: 96, height: 96 }}>
      <svg width={96} height={96} viewBox="0 0 112 112" aria-hidden>
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="11" />
        {slices.map((s, i) => {
          const len = total > 0 ? (s.value / total) * c : 0;
          const el = (
            <circle
              key={i}
              cx="56"
              cy="56"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="11"
              strokeLinecap="butt"
              strokeDasharray={`${Math.max(len - 2, 0)} ${c}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 56 56)"
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <span className="absolute inset-0 grid place-content-center text-center">
        <span className="text-[22px] leading-none" style={{ color: TEXT, fontFamily: SERIF }}>
          {total}
        </span>
        <span className="mt-1 text-[10.5px] uppercase tracking-[0.16em]" style={{ color: MUTED }}>
          Total
        </span>
      </span>
    </div>
  );
}

function Panel({
  title,
  action,
  subtitle,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="rounded-[16px] p-5 sm:p-6"
      style={{
        background: INK,
        border: `1px solid ${NAVY_BORDER}`,
        boxShadow: `${NAVY_INNER}, 0 14px 34px -26px rgba(9,20,29,0.45)`,
      }}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-[16px]" style={{ color: TEXT, fontFamily: SERIF, fontWeight: 500 }}>
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-[12.5px]" style={{ color: MUTED }}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ────────────────────────── main view ────────────────────────── */

export function BookingDocumentsView({ reference }: { reference: string }) {
  const [docs, setDocs] = useState<BookingDoc[]>(() => seedDocuments(reference));
  const [active, setActive] = useState<DocCategory | "All documents">("All documents");
  const [query, setQuery] = useState("");
  const [filterCat, setFilterCat] = useState<"all" | DocCategory>("all");
  const [sort, setSort] = useState<"new" | "old" | "name" | "size">("new");
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const counts = useMemo(() => {
    const map = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<DocCategory, number>;
    docs.forEach((d) => (map[d.category] += 1));
    return map;
  }, [docs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = docs.filter((d) => {
      if (active !== "All documents" && d.category !== active) return false;
      if (filterCat !== "all" && d.category !== filterCat) return false;
      if (q && !d.name.toLowerCase().includes(q)) return false;
      return true;
    });
    out = [...out].sort((a, b) => {
      if (sort === "new") return b.uploadedAt - a.uploadedAt;
      if (sort === "old") return a.uploadedAt - b.uploadedAt;
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.size - a.size;
    });
    return out;
  }, [docs, active, filterCat, query, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const slice = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1;
  const to = Math.min(current * PAGE_SIZE, filtered.length);

  const reset = () => {
    setActive("All documents");
    setFilterCat("all");
    setQuery("");
    setPage(1);
  };

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
      setPage(1);
    }
  }

  function download(doc: BookingDoc) {
    if (!doc.url) return;
    const a = document.createElement("a");
    a.href = doc.url;
    a.download = doc.name;
    a.click();
  }

  const important = useMemo(
    () =>
      [...docs]
        .filter((d) => ["Contracts", "Proposals", "Invoices"].includes(d.category))
        .sort((a, b) => b.uploadedAt - a.uploadedAt)
        .slice(0, 3),
    [docs],
  );

  return (
    <div className="space-y-4">
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_322px]">
        {/* ── LEFT: documents library ── */}
        <Panel
          title="Documents"
          subtitle="All documents related to your booking in one place."
          action={
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex shrink-0 items-center gap-2 rounded-[10px] px-4 py-2.5 text-[12.5px] font-semibold transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(180deg, #E7C777 0%, #C5962D 100%)",
                color: "#22180A",
                boxShadow: "0 10px 24px -18px rgba(197,150,45,0.9)",
              }}
            >
              <Upload size={14} /> Upload document
            </button>
          }
        >
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

          {/* category cards */}
          <div className="-mx-1 mt-5 flex gap-2.5 overflow-x-auto px-1 pb-1">
            {(["All documents", ...CATEGORIES] as const).map((c) => {
              const isAll = c === "All documents";
              const on = active === c;
              const n = isAll ? docs.length : counts[c as DocCategory];
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setActive(c);
                    setPage(1);
                  }}
                  className="flex min-w-[112px] flex-1 flex-col items-center gap-2 rounded-[13px] px-3 py-4 transition-colors"
                  style={{
                    background: on ? INK_2 : "rgba(12,26,36,0.28)",
                    border: `1px solid ${on ? "rgba(199,163,74,0.55)" : NAVY_BORDER}`,
                    boxShadow: on ? "inset 0 1px 0 rgba(255,255,255,0.06)" : undefined,
                  }}
                >
                  <span style={{ color: on ? GOLD_SOFT : "rgba(226,233,239,0.6)" }}>
                    {isAll ? <Files size={17} /> : CAT_ICON[c as DocCategory]}
                  </span>
                  <span className="whitespace-nowrap text-[12px]" style={{ color: on ? TEXT : TEXT_2 }}>
                    {c}
                  </span>
                  <span className="text-[12.5px] font-semibold" style={{ color: on ? GOLD_SOFT : MUTED }}>
                    {n}
                  </span>
                </button>
              );
            })}
          </div>

          {/* toolbar */}
          <div className="mt-5 grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="flex min-w-0 flex-wrap gap-2.5">
              <label className="relative min-w-0 flex-1" style={{ minWidth: 180 }}>
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: MUTED }}
                />
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search documents..."
                  aria-label="Search documents"
                  className="w-full rounded-[10px] py-2.5 pl-9 pr-3 text-[12.5px] outline-none"
                  style={{ background: "rgba(12,26,36,0.32)", border: `1px solid ${NAVY_BORDER}`, color: TEXT }}
                />
              </label>
              <select
                value={filterCat}
                onChange={(e) => {
                  setFilterCat(e.target.value as "all" | DocCategory);
                  setPage(1);
                }}
                aria-label="Filter by category"
                className="rounded-[10px] px-3 py-2.5 text-[12.5px] outline-none"
                style={{ background: "rgba(12,26,36,0.32)", border: `1px solid ${NAVY_BORDER}`, color: TEXT }}
              >
                <option value="all">All categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                aria-label="Sort documents"
                className="rounded-[10px] px-3 py-2.5 text-[12.5px] outline-none"
                style={{ background: "rgba(12,26,36,0.32)", border: `1px solid ${NAVY_BORDER}`, color: TEXT }}
              >
                <option value="new">Sort by: Newest first</option>
                <option value="old">Sort by: Oldest first</option>
                <option value="name">Sort by: Name</option>
                <option value="size">Sort by: Size</option>
              </select>
              <div
                className="flex shrink-0 items-center gap-1 rounded-[10px] p-1"
                style={{ background: "rgba(12,26,36,0.32)", border: `1px solid ${NAVY_BORDER}` }}
              >
                {(["list", "grid"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    aria-label={`${v} view`}
                    aria-pressed={view === v}
                    onClick={() => setView(v)}
                    className="grid h-[30px] w-[32px] place-items-center rounded-[7px]"
                    style={{
                      background: view === v ? "rgba(199,163,74,0.16)" : "transparent",
                      color: view === v ? GOLD_SOFT : MUTED,
                    }}
                  >
                    {v === "list" ? <List size={15} /> : <Grid2X2 size={15} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* table / grid */}
          {view === "list" ? (
            <div className="mt-4 min-w-0 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <thead>
                  <tr>
                    {["Document name", "Category", "Uploaded by", "Uploaded", "Size", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="pb-3 text-[10.5px] uppercase tracking-[0.14em] font-medium"
                        style={{ color: MUTED, borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slice.map((d) => (
                    <tr key={d.id} className="hgb-doc-row">
                      <td className="py-3.5 pr-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[8px]"
                            style={{
                              background: "rgba(12,26,36,0.4)",
                              border: `1px solid ${NAVY_BORDER}`,
                              color: CAT_COLOR[d.category],
                            }}
                          >
                            {fileIcon(d.name)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-[13px]" style={{ color: TEXT }}>
                              {d.name}
                            </span>
                            <span className="block text-[11px]" style={{ color: MUTED }}>
                              Version {d.version}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <span
                          className="inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[11px]"
                          style={{
                            color: CAT_COLOR[d.category],
                            border: `1px solid ${CAT_COLOR[d.category]}55`,
                            background: `${CAT_COLOR[d.category]}14`,
                          }}
                        >
                          {d.category}
                        </span>
                      </td>
                      <td
                        className="py-3.5 pr-4 text-[12.5px]"
                        style={{ color: TEXT_2, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        {d.uploadedBy}
                      </td>
                      <td
                        className="whitespace-nowrap py-3.5 pr-4 text-[12.5px]"
                        style={{ color: TEXT_2, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        {d.uploadedLabel}
                      </td>
                      <td
                        className="whitespace-nowrap py-3.5 pr-4 text-[12.5px]"
                        style={{ color: TEXT_2, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        {formatSize(d.size)}
                      </td>
                      <td className="py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            aria-label={`Download ${d.name}`}
                            onClick={() => download(d)}
                            disabled={!d.url}
                            title={d.url ? "Download" : "Available from the hotel"}
                            className="grid h-[28px] w-[28px] place-items-center rounded-[8px] transition-colors disabled:opacity-45"
                            style={{ color: GOLD_SOFT }}
                          >
                            <Download size={15} />
                          </button>
                          <button
                            type="button"
                            aria-label={`More options for ${d.name}`}
                            className="grid h-[28px] w-[28px] place-items-center rounded-[8px]"
                            style={{ color: MUTED }}
                          >
                            <MoreHorizontal size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {slice.length === 0 && (
                <p className="py-10 text-center text-[13px]" style={{ color: MUTED }}>
                  No documents match your filters.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {slice.map((d) => (
                <div
                  key={d.id}
                  className="rounded-[13px] p-4"
                  style={{ background: INK_2, border: `1px solid ${NAVY_BORDER}` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span style={{ color: CAT_COLOR[d.category] }}>{fileIcon(d.name)}</span>
                    <button
                      type="button"
                      aria-label={`Download ${d.name}`}
                      onClick={() => download(d)}
                      disabled={!d.url}
                      className="disabled:opacity-45"
                      style={{ color: GOLD_SOFT }}
                    >
                      <Download size={15} />
                    </button>
                  </div>
                  <p className="mt-3 truncate text-[13px]" style={{ color: TEXT }}>
                    {d.name}
                  </p>
                  <p className="mt-1 text-[11px]" style={{ color: MUTED }}>
                    Version {d.version} · {d.uploadedLabel} · {formatSize(d.size)}
                  </p>
                </div>
              ))}
              {slice.length === 0 && (
                <p className="py-10 text-center text-[13px] sm:col-span-2 lg:col-span-3" style={{ color: MUTED }}>
                  No documents match your filters.
                </p>
              )}
            </div>
          )}

          {/* pagination */}
          <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="truncate text-[12px]" style={{ color: MUTED }}>
              Showing {from} to {to} of {filtered.length} documents
            </p>
            <div className="flex items-center gap-1.5">
              <PagerBtn label="Previous" disabled={current === 1} onClick={() => setPage(current - 1)}>
                <ChevronLeft size={15} />
              </PagerBtn>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  aria-current={p === current ? "page" : undefined}
                  className="grid h-[30px] min-w-[30px] place-items-center rounded-[8px] px-2 text-[12px]"
                  style={{
                    background: p === current ? "rgba(199,163,74,0.16)" : "rgba(12,26,36,0.3)",
                    border: `1px solid ${p === current ? "rgba(199,163,74,0.5)" : NAVY_BORDER}`,
                    color: p === current ? GOLD_SOFT : TEXT_2,
                  }}
                >
                  {p}
                </button>
              ))}
              <PagerBtn label="Next" disabled={current === pages} onClick={() => setPage(current + 1)}>
                <ChevronRight size={15} />
              </PagerBtn>
            </div>
          </div>
        </Panel>

        {/* ── RIGHT: support column ── */}
        <aside className="min-w-0 space-y-4">
          <Panel title="Document summary">
            <div className="mt-4 flex items-center gap-4">
              <Donut
                total={docs.length}
                slices={CATEGORIES.map((c) => ({ color: CAT_COLOR[c], value: counts[c] }))}
              />
              <ul className="min-w-0 flex-1 space-y-2">
                {CATEGORIES.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-[12px]">
                    <span
                      className="h-[7px] w-[7px] shrink-0 rounded-full"
                      style={{ background: CAT_COLOR[c] }}
                    />
                    <span className="min-w-0 flex-1 truncate" style={{ color: TEXT_2 }}>
                      {c}
                    </span>
                    <span style={{ color: TEXT }}>{counts[c]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          <Panel title="Upload new document">
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
              className="mt-4 cursor-pointer rounded-[13px] px-4 py-7 text-center transition-colors"
              style={{
                border: `1px dashed ${dragging ? "rgba(199,163,74,0.7)" : "rgba(255,255,255,0.16)"}`,
                background: dragging ? "rgba(199,163,74,0.07)" : "rgba(12,26,36,0.26)",
              }}
            >
              <UploadCloud size={22} style={{ color: GOLD_SOFT }} className="mx-auto" />
              <p className="mt-2.5 text-[12.5px]" style={{ color: TEXT_2 }}>
                Drag and drop files here
              </p>
              <p className="mt-0.5 text-[12px]" style={{ color: MUTED }}>
                or <span style={{ color: GOLD_SOFT, textDecoration: "underline" }}>browse files</span>
              </p>
              <p className="mt-2 text-[11px]" style={{ color: MUTED }}>
                Max file size: 25 MB
              </p>
            </div>
            {error && (
              <p className="mt-2 text-[11.5px]" style={{ color: "#D08A7A" }}>
                {error}
              </p>
            )}
          </Panel>

          <Panel title="Important documents">
            <ul className="mt-4 space-y-2">
              {important.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center gap-3 rounded-[11px] px-3 py-2.5"
                  style={{ background: INK_2, border: `1px solid ${NAVY_BORDER}` }}
                >
                  <span className="shrink-0" style={{ color: CAT_COLOR[d.category] }}>
                    {fileIcon(d.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px]" style={{ color: TEXT }}>
                      {d.name}
                    </span>
                    <span className="block truncate text-[11px]" style={{ color: MUTED }}>
                      Version {d.version} · {d.uploadedLabel}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-label={`Download ${d.name}`}
                    onClick={() => download(d)}
                    disabled={!d.url}
                    className="shrink-0 disabled:opacity-45"
                    style={{ color: GOLD_SOFT }}
                  >
                    <Download size={15} />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={reset}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-[10px] py-2.5 text-[12.5px] transition-opacity hover:opacity-90"
              style={{ background: "rgba(12,26,36,0.32)", border: `1px solid ${NAVY_BORDER}`, color: GOLD_SOFT }}
            >
              View all documents <ChevronRight size={14} />
            </button>
          </Panel>
        </aside>
      </div>

      <p className="flex items-center gap-2 px-1 text-[11.5px]" style={{ color: "rgba(30,44,54,0.6)" }}>
        <Lock size={13} style={{ color: GOLD_MET_MID }} />
        All documents are securely stored and only visible to authorized users.
      </p>
    </div>
  );
}

function PagerBtn({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-[30px] w-[30px] place-items-center rounded-[8px] disabled:opacity-35"
      style={{ background: "rgba(12,26,36,0.3)", border: `1px solid ${NAVY_BORDER}`, color: TEXT_2 }}
    >
      {children}
    </button>
  );
}
