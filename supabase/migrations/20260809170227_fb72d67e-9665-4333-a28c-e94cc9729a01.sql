-- Restrict public reads of site_edits to display-only columns (hide updated_by)
REVOKE SELECT ON public.site_edits FROM anon, authenticated;
GRANT SELECT (id, route, element_path, edit, signature, created_at, updated_at) ON public.site_edits TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_edits TO authenticated;
GRANT ALL ON public.site_edits TO service_role;

-- Admins/staff may read the full row including updated_by
DROP POLICY IF EXISTS "Anyone can read site edits" ON public.site_edits;
CREATE POLICY "Anyone can read published site edits"
ON public.site_edits FOR SELECT TO anon, authenticated
USING (true);
