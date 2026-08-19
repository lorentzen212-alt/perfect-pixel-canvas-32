import * as React from "react";

export type InfoCell = { icon: React.ReactNode; lead: string; sub: string };

/** Shared booking information strip.
 *  tone="plate"  — the original strip that sits directly on the workspace plate.
 *  tone="framed" — the top band inside a raised board, dividers running edge to edge. */
export function InfoStrip({
  cells,
  tone = "plate",
}: {
  cells: InfoCell[];
  tone?: "plate" | "framed";
}) {
  const framed = tone === "framed";
  return (
    <div
      className={
        framed
          ? "flex flex-wrap items-center gap-y-4 px-6 py-4"
          : "flex flex-wrap items-center gap-y-5 py-6"
      }
      style={framed ? { borderBottom: "1px solid rgba(16,24,40,0.08)" } : undefined}
    >
      {cells.map((s, i) => (
        <div
          key={s.lead + i}
          className={
            framed
              ? "flex min-w-[190px] flex-1 items-center gap-3 self-stretch px-6"
              : "flex min-w-[190px] flex-1 items-center gap-3 px-4 first:pl-0"
          }
          style={
            i > 0
              ? {
                  borderLeft: framed
                    ? "1px solid rgba(16,24,40,0.10)"
                    : "1px solid rgba(21,32,43,0.13)",
                }
              : undefined
          }
        >
          <span className="shrink-0" style={{ color: "#D4AF37" }}>
            {s.icon}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-semibold" style={{ color: "#15202B" }}>
              {s.lead}
            </span>
            <span className="block truncate text-[12px]" style={{ color: "rgba(21,32,43,0.6)" }}>
              {s.sub}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}
