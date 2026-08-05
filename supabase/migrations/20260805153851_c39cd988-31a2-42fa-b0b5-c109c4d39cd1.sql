CREATE TABLE public.site_edits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  route TEXT NOT NULL,
  element_path TEXT NOT NULL,
  edit JSONB NOT NULL DEFAULT '{}'::jsonb,
  signature TEXT,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (route, element_path)
);

GRANT SELECT ON public.site_edits TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_edits TO authenticated;
GRANT ALL ON public.site_edits TO service_role;

ALTER TABLE public.site_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site edits"
  ON public.site_edits FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site edits"
  ON public.site_edits FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site edits"
  ON public.site_edits FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site edits"
  ON public.site_edits FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER site_edits_updated_at
  BEFORE UPDATE ON public.site_edits
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();