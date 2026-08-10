import { useState } from "react";

export type VellumVariantOpt = "A" | "B" | "C" | "D" | "E" | "current";

export function VellumSwitcher({
  value,
  onChange,
}: {
  value: VellumVariantOpt;
  onChange: (v: VellumVariantOpt) => void;
}) {
  const [open, setOpen] = useState(true);
  const opts: { id: VellumVariantOpt; label: string; hint: string }[] = [
    { id: "A", label: "A · Pure Vellum", hint: "Minimal, timeless, almost invisible" },
    { id: "B", label: "B · Scandinavian depth", hint: "Vellum with architectural volume" },
    { id: "C", label: "C · Hotel lobby light", hint: "Soft sconces, warm floor bounce" },
    { id: "D", label: "D · Marine restraint", hint: "Vellum contained in cool marine light" },
    { id: "E", label: "E · Signature (rec.)", hint: "Three layers of light, nothing else" },
    { id: "current", label: "— Current", hint: "Existing atmosphere, for comparison" },
  ];
  return (
    <div
      className="fixed z-[9999] bottom-4 right-4 select-none"
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {open ? (
        <div
          className="rounded-lg"
          style={{
            width: 268,
            background: "rgba(20, 24, 32, 0.86)",
            backdropFilter: "blur(14px) saturate(140%)",
            WebkitBackdropFilter: "blur(14px) saturate(140%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
            color: "#F2ECDE",
          }}
        >
          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9B98F" }}>
              Vellum · design preview
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Hide"
              style={{ fontSize: 12, color: "rgba(242,236,222,0.6)", padding: "2px 6px" }}
            >
              ×
            </button>
          </div>
          <div className="p-2 flex flex-col gap-1">
            {opts.map((o) => {
              const active = value === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => onChange(o.id)}
                  className="text-left rounded-md px-2.5 py-2"
                  style={{
                    background: active ? "rgba(245,174,0,0.14)" : "transparent",
                    border: active ? "1px solid rgba(245,174,0,0.55)" : "1px solid transparent",
                    color: active ? "#F5E6BE" : "#F2ECDE",
                  }}
                >
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{o.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(242,236,222,0.55)", marginTop: 1 }}>{o.hint}</div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full px-3 py-2"
          style={{
            background: "rgba(20,24,32,0.86)",
            color: "#F2ECDE",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          Vellum · {value}
        </button>
      )}
    </div>
  );
}

/* --------- Step Progress --------- */
