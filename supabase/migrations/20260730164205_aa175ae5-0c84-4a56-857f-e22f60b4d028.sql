REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.owns_booking(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_read_booking(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.owns_booking(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.can_read_booking(uuid) TO authenticated, service_role;