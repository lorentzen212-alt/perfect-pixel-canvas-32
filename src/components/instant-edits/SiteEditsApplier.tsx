import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";

import { listSiteEdits } from "@/lib/siteEdits.functions";
import {
  applyInstantEdit,
  instantElementAt,
  signatureMismatch,
  type InstantEdit,
} from "@/lib/instantEdits/store";

/**
 * Applies the saved (published) Instant Edits for the current route
 * for every visitor — not just the admin who made them.
 */
export default function SiteEditsApplier() {
  const routePath = useRouterState({ select: (s) => s.location.pathname });
  const fetchEdits = useServerFn(listSiteEdits);

  const { data } = useQuery({
    queryKey: ["site-edits", routePath],
    queryFn: () => fetchEdits({ data: { route: routePath } }),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!data || data.length === 0) return;
    let timer = 0;
    let tries = 0;
    const run = () => {
      for (const row of data) {
        const el = instantElementAt(row.element_path);
        if (!el) continue;
        if (signatureMismatch(el, row.signature)) continue;
        applyInstantEdit(el, row.edit as InstantEdit);
      }
      if (tries++ < 12) timer = window.setTimeout(run, 120);
    };
    run();
    return () => window.clearTimeout(timer);
  }, [data, routePath]);

  return null;
}
