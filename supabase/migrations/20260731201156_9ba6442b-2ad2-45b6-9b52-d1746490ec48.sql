-- Harden has_role: only reveal role info about the caller (or to admins)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT CASE
    WHEN auth.uid() IS NULL THEN false
    WHEN _user_id <> auth.uid()
      AND NOT EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role
      )
    THEN false
    ELSE EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    )
  END
$function$;

-- Lock down execution: no PUBLIC/anon access to SECURITY DEFINER helpers
REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.owns_booking(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_read_booking(uuid) FROM PUBLIC, anon;

-- RLS policy expressions run as the querying role, so authenticated must keep EXECUTE
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.owns_booking(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_read_booking(uuid) TO authenticated, service_role;