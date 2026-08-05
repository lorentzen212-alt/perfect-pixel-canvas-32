import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

export type SiteEditPayload = {
  text?: string | null;
  styles?: Record<string, string>;
};

export type SiteEditRow = {
  route: string;
  element_path: string;
  edit: SiteEditPayload;
  signature: string | null;
};

/** Public read — anyone visiting the site gets the saved edits for a route. */
export const listSiteEdits = createServerFn({ method: "GET" })
  .inputValidator((data: { route: string }) => ({ route: String(data?.route ?? "/") }))
  .handler(async ({ data }): Promise<SiteEditRow[]> => {
    const url = process.env["SUPABASE_URL"]!;
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const client = createClient<Database>(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input as RequestInfo, { ...init, headers: h });
        },
      },
    });

    const { data: rows, error } = await client
      .from("site_edits")
      .select("route, element_path, edit, signature")
      .eq("route", data.route);

    if (error) return [];
    return (rows ?? []) as SiteEditRow[];
  });

type SavePayload = {
  route: string;
  edits: { element_path: string; edit: SiteEditPayload; signature?: string | null }[];
};

/** Admin-only write — replaces the stored edit set for one route. */
export const saveSiteEdits = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: SavePayload) => ({
    route: String(data?.route ?? "/"),
    edits: Array.isArray(data?.edits) ? data.edits : [],
  }))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    if (roleError || !isAdmin) {
      return { ok: false as const, reason: "forbidden" as const };
    }

    const keep = data.edits.map((e) => e.element_path);

    if (data.edits.length > 0) {
      const { error } = await supabase.from("site_edits").upsert(
        data.edits.map((e) => ({
          route: data.route,
          element_path: e.element_path,
          edit: e.edit as never,
          signature: e.signature ?? null,
          updated_by: userId,
        })),
        { onConflict: "route,element_path" },
      );
      if (error) return { ok: false as const, reason: error.message };
    }

    let del = supabase.from("site_edits").delete().eq("route", data.route);
    if (keep.length > 0) del = del.not("element_path", "in", `(${keep.map((k) => `"${k}"`).join(",")})`);
    const { error: delError } = await del;
    if (delError) return { ok: false as const, reason: delError.message };

    return { ok: true as const, count: data.edits.length };
  });
