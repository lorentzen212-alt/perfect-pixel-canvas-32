import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";

import { supabase } from "@/integrations/supabase/client";
import { listSiteEdits, saveSiteEdits } from "@/lib/siteEdits.functions";
import {
  docsEqual,
  signatureOf,
  applyInstantEdit,
  emptyInstantDoc,
  instantEditsAllowed,
  instantElementAt,
  instantPathOf,
  isInstantEnabled,
  isTextOnly,
  loadInstantDoc,
  saveInstantDoc,
  setInstantEnabled,
  type InstantDoc,
  type InstantEdit,
} from "@/lib/instantEdits/store";

const isUi = (el: Element | null) => !!el?.closest("[data-ie-ui]");

function pickTarget(el: Element | null): HTMLElement | null {
  let cur = el as HTMLElement | null;
  while (cur && cur !== document.body) {
    if (isUi(cur)) return null;
    const r = cur.getBoundingClientRect();
    if (r.width >= 8 && r.height >= 8) return cur;
    cur = cur.parentElement;
  }
  return null;
}

const label = (el: HTMLElement) =>
  el.tagName.toLowerCase() + (el.id ? `#${el.id}` : "");

export default function InstantEdits() {
  const routePath = useRouterState({ select: (s) => s.location.pathname });
  const [allowed, setAllowed] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [doc, setDoc] = useState<InstantDoc>(emptyInstantDoc());
  const [selected, setSelected] = useState<string | null>(null);
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null);
  const [selRect, setSelRect] = useState<DOMRect | null>(null);
  const [inlineEditing, setInlineEditing] = useState(false);
  const [savedDoc, setSavedDoc] = useState<InstantDoc>(emptyInstantDoc());
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const appliedRef = useRef<Set<HTMLElement>>(new Set());
  const fetchEdits = useServerFn(listSiteEdits);
  const pushEdits = useServerFn(saveSiteEdits);

  useEffect(() => {
    setAllowed(instantEditsAllowed());
    setEnabled(isInstantEnabled());
  }, []);

  /* admin detection — only admins may publish edits */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      const uid = auth.user?.id;
      if (!uid) return;
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid)
        .eq("role", "admin")
        .maybeSingle();
      if (!cancelled) setIsAdmin(!!roles);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* what is currently stored on the server for this route */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchEdits({ data: { route: routePath } });
        if (cancelled) return;
        const remote: InstantDoc = {};
        rows.forEach((r) => {
          remote[r.element_path] = r.edit as InstantEdit;
        });
        setSavedDoc(remote);
        // no local working copy yet → adopt the published version
        if (Object.keys(loadInstantDoc(routePath)).length === 0 && Object.keys(remote).length) {
          setDoc(remote);
          saveInstantDoc(routePath, remote);
        }
      } catch {
        /* offline / not available — keep working locally */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [routePath, fetchEdits]);

  /* load + apply saved edits for the route */
  useEffect(() => {
    const loaded = loadInstantDoc(routePath);
    setDoc(loaded);
    setSelected(null);
    setInlineEditing(false);
    let raf = 0;
    let tries = 0;
    const run = () => {
      Object.entries(loaded).forEach(([path, edit]) => {
        const el = instantElementAt(path);
        if (el) {
          applyInstantEdit(el, edit);
          appliedRef.current.add(el);
        }
      });
      if (tries++ < 12) raf = window.setTimeout(run, 120);
    };
    run();
    return () => window.clearTimeout(raf);
  }, [routePath]);

  const selectedEl = selected ? instantElementAt(selected) : null;
  const edit: InstantEdit = (selected && doc[selected]) || {};

  const commit = useCallback(
    (path: string, next: InstantEdit) => {
      const merged: InstantDoc = { ...doc, [path]: { ...doc[path], ...next } };
      setDoc(merged);
      saveInstantDoc(routePath, merged);
      const el = instantElementAt(path);
      if (el) {
        applyInstantEdit(el, merged[path]!);
        appliedRef.current.add(el);
        setSelRect(el.getBoundingClientRect());
      }
    },
    [doc, routePath],
  );

  const resetElement = useCallback(
    (path: string) => {
      const next = { ...doc };
      delete next[path];
      setDoc(next);
      saveInstantDoc(routePath, next);
      window.location.reload();
    },
    [doc, routePath],
  );

  const resetPage = useCallback(() => {
    saveInstantDoc(routePath, {});
    window.location.reload();
  }, [routePath]);

  const dirty = useMemo(() => !docsEqual(doc, savedDoc), [doc, savedDoc]);

  const save = useCallback(async () => {
    setSaving(true);
    setStatus(null);
    try {
      const payload = Object.entries(doc).map(([element_path, edit]) => {
        const el = instantElementAt(element_path);
        return {
          element_path,
          edit,
          signature: el ? signatureOf(el) : null,
        };
      });
      const res = await pushEdits({ data: { route: routePath, edits: payload } });
      if (res.ok) {
        setSavedDoc(doc);
        setStatus("Saved — live for everyone");
      } else {
        setStatus(
          res.reason === "forbidden"
            ? "You need to be signed in as an admin to save."
            : `Could not save: ${res.reason}`,
        );
      }
    } catch {
      setStatus("Could not save — please sign in as an admin and try again.");
    } finally {
      setSaving(false);
    }
  }, [doc, routePath, pushEdits]);

  const discard = useCallback(() => {
    saveInstantDoc(routePath, savedDoc);
    window.location.reload();
  }, [routePath, savedDoc]);

  /* pointer interaction while enabled */
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      if (inlineEditing) return;
      const t = pickTarget(document.elementFromPoint(e.clientX, e.clientY));
      setHoverRect(t ? t.getBoundingClientRect() : null);
    };
    const onClick = (e: MouseEvent) => {
      if (isUi(e.target as Element)) return;
      if (inlineEditing) return;
      const t = pickTarget(e.target as Element);
      if (!t) return;
      e.preventDefault();
      e.stopPropagation();
      setSelected(instantPathOf(t));
      setSelRect(t.getBoundingClientRect());
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setInlineEditing(false);
        setSelected(null);
      }
    };
    const sync = () => {
      const el = selected ? instantElementAt(selected) : null;
      setSelRect(el ? el.getBoundingClientRect() : null);
    };
    window.addEventListener("mousemove", onMove, true);
    window.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", sync, true);
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("mousemove", onMove, true);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", sync, true);
      window.removeEventListener("resize", sync);
    };
  }, [enabled, selected, inlineEditing]);

  /* inline contentEditable */
  useEffect(() => {
    const el = selectedEl;
    if (!el) return;
    if (!inlineEditing) {
      if (el.isContentEditable) el.removeAttribute("contenteditable");
      return;
    }
    el.setAttribute("contenteditable", "plaintext-only");
    el.focus();
    const onBlur = () => {
      commit(selected!, { text: el.textContent ?? "" });
      setInlineEditing(false);
    };
    el.addEventListener("blur", onBlur);
    return () => {
      el.removeEventListener("blur", onBlur);
      el.removeAttribute("contenteditable");
    };
  }, [inlineEditing, selectedEl, selected, commit]);

  const canEditText = useMemo(() => !!selectedEl && isTextOnly(selectedEl), [selectedEl]);
  const editCount = Object.keys(doc).length;

  if (!allowed) return null;

  return (
    <div data-ie-ui="">
      {/* launcher */}
      <button
        type="button"
        onClick={() => {
          const next = !enabled;
          setEnabled(next);
          setInstantEnabled(next);
          if (!next) {
            setSelected(null);
            setHoverRect(null);
            setInlineEditing(false);
          }
        }}
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 2147483000,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          borderRadius: 999,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.01em",
          color: enabled ? "#1B2A38" : "#F5EFE2",
          background: enabled
            ? "linear-gradient(180deg,#F1D77A,#C99322)"
            : "linear-gradient(180deg,#22344A,#16232F)",
          border: "1px solid rgba(201,147,34,0.5)",
          boxShadow: "0 14px 34px rgba(6,14,22,0.45)",
          cursor: "pointer",
        }}
      >
        <PencilIcon />
        Instant Edits
        {editCount > 0 && (
          <span
            style={{
              fontSize: 11,
              padding: "1px 7px",
              borderRadius: 999,
              background: enabled ? "rgba(27,42,56,0.18)" : "rgba(241,215,122,0.18)",
            }}
          >
            {editCount}
          </span>
        )}
      </button>

      {enabled && (
        <>
          {/* hover outline */}
          {hoverRect && (
            <div
              style={{
                position: "fixed",
                pointerEvents: "none",
                zIndex: 2147482000,
                top: hoverRect.top,
                left: hoverRect.left,
                width: hoverRect.width,
                height: hoverRect.height,
                outline: "1px dashed rgba(241,215,122,0.85)",
                background: "rgba(241,215,122,0.06)",
              }}
            />
          )}
          {/* selection outline */}
          {selRect && (
            <div
              style={{
                position: "fixed",
                pointerEvents: "none",
                zIndex: 2147482100,
                top: selRect.top,
                left: selRect.left,
                width: selRect.width,
                height: selRect.height,
                outline: "2px solid #C99322",
                boxShadow: "0 0 0 4px rgba(201,147,34,0.18)",
              }}
            />
          )}

          <Panel
            selected={selected}
            selectedEl={selectedEl}
            edit={edit}
            canEditText={canEditText}
            inlineEditing={inlineEditing}
            onInline={setInlineEditing}
            onChange={(p) => selected && commit(selected, p)}
            onResetElement={() => selected && resetElement(selected)}
            onResetPage={resetPage}
            onClose={() => setSelected(null)}
            dirty={dirty}
            saving={saving}
            status={status}
            isAdmin={isAdmin}
            dirtyCount={Object.keys(doc).length}
            onSave={save}
            onDiscard={discard}
          />
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Panel({
  selected,
  selectedEl,
  edit,
  canEditText,
  inlineEditing,
  onInline,
  onChange,
  onResetElement,
  onResetPage,
  onClose,
  dirty,
  saving,
  status,
  isAdmin,
  dirtyCount,
  onSave,
  onDiscard,
}: {
  selected: string | null;
  selectedEl: HTMLElement | null;
  edit: InstantEdit;
  canEditText: boolean;
  inlineEditing: boolean;
  onInline: (v: boolean) => void;
  onChange: (p: InstantEdit) => void;
  onResetElement: () => void;
  onResetPage: () => void;
  onClose: () => void;
  dirty: boolean;
  saving: boolean;
  status: string | null;
  isAdmin: boolean;
  dirtyCount: number;
  onSave: () => void;
  onDiscard: () => void;
}) {
  const shell: React.CSSProperties = {
    position: "fixed",
    right: 18,
    bottom: 74,
    width: 306,
    maxHeight: "72vh",
    overflowY: "auto",
    zIndex: 2147483000,
    borderRadius: 14,
    padding: 14,
    color: "#EAF1F8",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: 12,
    background: "linear-gradient(180deg,#1B2A38,#121D28)",
    border: "1px solid rgba(201,147,34,0.35)",
    boxShadow: "0 26px 60px rgba(4,10,16,0.6)",
  };

  if (!selected || !selectedEl) {
    return (
      <div style={shell}>
        <Title>Instant Edits</Title>
        <p style={{ opacity: 0.7, lineHeight: 1.6, margin: "8px 0 0" }}>
          Click any element on the page to change its text, size and styling — no prompting
          required.
        </p>
        <button style={ghostBtn} onClick={onResetPage}>
          Reset all edits on this page
        </button>
      <SaveBar
        dirty={dirty}
        saving={saving}
        status={status}
        isAdmin={isAdmin}
        count={dirtyCount}
        onSave={onSave}
        onDiscard={onDiscard}
      />
      </div>
    );
  }

  return (
    <div style={shell}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Title>{label(selectedEl)}</Title>
        <button style={{ ...ghostBtn, width: "auto", margin: 0, padding: "3px 8px" }} onClick={onClose}>
          ✕
        </button>
      </div>

      {canEditText && (
        <Field label="Text">
          <textarea
            value={edit.text ?? selectedEl.textContent ?? ""}
            onChange={(e) => onChange({ text: e.target.value })}
            rows={3}
            style={{ ...input, resize: "vertical" }}
          />
          <button style={ghostBtn} onClick={() => onInline(!inlineEditing)}>
            {inlineEditing ? "Finish inline editing" : "Edit inline on page"}
          </button>
        </Field>
      )}

      <Row>
        <Field label="Font size">
          <input
            type="number"
            value={edit.fontSize ?? ""}
            placeholder={String(Math.round(parseFloat(getComputedStyle(selectedEl).fontSize)))}
            onChange={(e) =>
              onChange({ fontSize: e.target.value ? Number(e.target.value) : undefined })
            }
            style={input}
          />
        </Field>
        <Field label="Weight">
          <select
            value={edit.fontWeight ?? ""}
            onChange={(e) => onChange({ fontWeight: e.target.value || undefined })}
            style={input}
          >
            <option value="">auto</option>
            {["300", "400", "500", "600", "700", "800"].map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
        </Field>
      </Row>

      <Row>
        <Field label="Letter spacing">
          <input
            type="number"
            step="0.1"
            value={edit.letterSpacing ?? ""}
            onChange={(e) =>
              onChange({ letterSpacing: e.target.value ? Number(e.target.value) : undefined })
            }
            style={input}
          />
        </Field>
        <Field label="Line height">
          <input
            type="number"
            step="0.05"
            value={edit.lineHeight ?? ""}
            onChange={(e) =>
              onChange({ lineHeight: e.target.value ? Number(e.target.value) : undefined })
            }
            style={input}
          />
        </Field>
      </Row>

      <Field label="Align">
        <div style={{ display: "flex", gap: 6 }}>
          {["left", "center", "right"].map((a) => (
            <button
              key={a}
              onClick={() => onChange({ align: edit.align === a ? undefined : a })}
              style={{
                ...chip,
                borderColor: edit.align === a ? "#C99322" : "rgba(255,255,255,0.14)",
                color: edit.align === a ? "#F1D77A" : "#EAF1F8",
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </Field>

      <Row>
        <Field label="Text colour">
          <input
            type="color"
            value={edit.color ?? "#ffffff"}
            onChange={(e) => onChange({ color: e.target.value })}
            style={{ ...input, padding: 2, height: 30 }}
          />
        </Field>
        <Field label="Background">
          <input
            type="color"
            value={edit.background ?? "#1b2a38"}
            onChange={(e) => onChange({ background: e.target.value })}
            style={{ ...input, padding: 2, height: 30 }}
          />
        </Field>
      </Row>

      <Row>
        <Field label="Metallic text">
          <button
            onClick={() => onChange({ colorMetallic: !edit.colorMetallic })}
            style={{
              ...chip,
              width: "100%",
              borderColor: edit.colorMetallic ? "#C99322" : "rgba(255,255,255,0.14)",
              color: edit.colorMetallic ? "#F1D77A" : "#EAF1F8",
            }}
          >
            {edit.colorMetallic ? "On" : "Off"}
          </button>
        </Field>
        <Field label="Metallic background">
          <button
            onClick={() => onChange({ bgMetallic: !edit.bgMetallic })}
            style={{
              ...chip,
              width: "100%",
              borderColor: edit.bgMetallic ? "#C99322" : "rgba(255,255,255,0.14)",
              color: edit.bgMetallic ? "#F1D77A" : "#EAF1F8",
            }}
          >
            {edit.bgMetallic ? "On" : "Off"}
          </button>
        </Field>
      </Row>

      {(edit.colorMetallic || edit.bgMetallic) && (
        <Row>
          <Field label={`Polish ${edit.metallicStrength ?? 60}%`}>
            <input
              type="range"
              min={0}
              max={100}
              value={edit.metallicStrength ?? 60}
              onChange={(e) => onChange({ metallicStrength: Number(e.target.value) })}
              style={{ width: "100%" }}
            />
          </Field>
          <Field label={`Light ${edit.metallicAngle ?? 155}°`}>
            <input
              type="range"
              min={0}
              max={360}
              value={edit.metallicAngle ?? 155}
              onChange={(e) => onChange({ metallicAngle: Number(e.target.value) })}
              style={{ width: "100%" }}
            />
          </Field>
        </Row>
      )}

      <Row>
        <Field label="Padding">
          <input
            type="number"
            value={edit.padding ?? ""}
            onChange={(e) =>
              onChange({ padding: e.target.value ? Number(e.target.value) : undefined })
            }
            style={input}
          />
        </Field>
        <Field label="Radius">
          <input
            type="number"
            value={edit.radius ?? ""}
            onChange={(e) =>
              onChange({ radius: e.target.value ? Number(e.target.value) : undefined })
            }
            style={input}
          />
        </Field>
      </Row>

      <Field label="Custom Tailwind classes">
        <input
          value={edit.classes ?? ""}
          placeholder="e.g. tracking-wide uppercase shadow-lg"
          onChange={(e) => onChange({ classes: e.target.value })}
          style={input}
        />
      </Field>

      <button style={ghostBtn} onClick={onResetElement}>
        Reset this element
      </button>
      <button style={ghostBtn} onClick={onResetPage}>
        Reset all edits on this page
      </button>
      <SaveBar
        dirty={dirty}
        saving={saving}
        status={status}
        isAdmin={isAdmin}
        count={dirtyCount}
        onSave={onSave}
        onDiscard={onDiscard}
      />
    </div>
  );
}

function SaveBar({
  dirty,
  saving,
  status,
  isAdmin,
  count,
  onSave,
  onDiscard,
}: {
  dirty: boolean;
  saving: boolean;
  status: string | null;
  isAdmin: boolean;
  count: number;
  onSave: () => void;
  onDiscard: () => void;
}) {
  return (
    <div
      style={{
        marginTop: 12,
        paddingTop: 10,
        borderTop: "1px solid rgba(201,147,34,0.28)",
      }}
    >
      <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 8 }}>
        {dirty ? `Unsaved changes (${count})` : count > 0 ? "All changes saved" : "No changes yet"}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={onSave}
          disabled={saving || !dirty}
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(201,147,34,0.5)",
            cursor: saving || !dirty ? "default" : "pointer",
            opacity: saving || !dirty ? 0.5 : 1,
            fontWeight: 600,
            color: "#1B2A38",
            background: "linear-gradient(180deg,#F1D77A,#C99322)",
          }}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          onClick={onDiscard}
          disabled={saving || !dirty}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.16)",
            background: "transparent",
            color: "#EAF1F8",
            cursor: saving || !dirty ? "default" : "pointer",
            opacity: saving || !dirty ? 0.5 : 1,
          }}
        >
          Discard
        </button>
      </div>
      {!isAdmin && (
        <div style={{ fontSize: 10.5, opacity: 0.6, marginTop: 8, lineHeight: 1.5 }}>
          Sign in as an admin to publish these changes to all visitors.
        </div>
      )}
      {status && (
        <div style={{ fontSize: 11, marginTop: 8, color: "#F1D77A", lineHeight: 1.5 }}>{status}</div>
      )}
    </div>
  );
}

const Title = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#F1D77A" }}>
    {children}
  </div>
);

const Field = ({ label: l, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginTop: 10, flex: 1, minWidth: 0 }}>
    <div style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.6, marginBottom: 4 }}>
      {l}
    </div>
    {children}
  </div>
);

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", gap: 8 }}>{children}</div>
);

const input: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 8,
  padding: "6px 8px",
  color: "#EAF1F8",
  fontSize: 12,
  fontFamily: "inherit",
};

const chip: React.CSSProperties = {
  flex: 1,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 8,
  padding: "5px 6px",
  fontSize: 11,
  cursor: "pointer",
  color: "#EAF1F8",
};

const ghostBtn: React.CSSProperties = {
  width: "100%",
  marginTop: 10,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.14)",
  borderRadius: 8,
  padding: "7px 8px",
  color: "#EAF1F8",
  fontSize: 11,
  fontFamily: "inherit",
  cursor: "pointer",
};

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}
