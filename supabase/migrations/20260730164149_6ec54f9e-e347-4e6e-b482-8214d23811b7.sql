-- ─── roles ─────────────────────────────────────────────
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'customer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- ─── shared helpers ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ─── profiles ──────────────────────────────────────────
CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  company_name text,
  phone text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile" ON public.profiles
  FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Staff can view profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── bookings ──────────────────────────────────────────
CREATE TYPE public.booking_type AS ENUM ('leisure', 'me');

CREATE SEQUENCE public.booking_reference_seq START 100;

CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS text LANGUAGE sql VOLATILE SET search_path = public AS $$
  SELECT 'HGB-' || to_char(now(), 'YYYY') || '-' ||
         lpad((nextval('public.booking_reference_seq') % 100000)::text, 5, '0')
$$;

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reference text NOT NULL UNIQUE DEFAULT public.generate_booking_reference(),
  booking_type public.booking_type NOT NULL DEFAULT 'leisure',
  status text NOT NULL DEFAULT 'request_submitted',
  status_note text,
  name text NOT NULL DEFAULT '',
  destination text NOT NULL DEFAULT '',
  country text,
  city text,
  hotel_name text,
  hotel_reference text,
  hotel_reference_source text,
  start_date date,
  end_date date,
  nights integer NOT NULL DEFAULT 0,
  rooms integer,
  guests integer,
  delegates integer,
  meeting_spaces integer,
  image_key text,
  contact jsonb NOT NULL DEFAULT '{}'::jsonb,
  request jsonb NOT NULL DEFAULT '{}'::jsonb,
  cancelled_at timestamptz,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX bookings_user_id_idx ON public.bookings(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own bookings" ON public.bookings
  FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Staff can view all bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Admins can update all bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.owns_booking(_booking_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = _booking_id AND b.user_id = auth.uid())
$$;

CREATE OR REPLACE FUNCTION public.can_read_booking(_booking_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.owns_booking(_booking_id)
      OR public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'staff')
$$;

-- ─── booking_rooms ─────────────────────────────────────
CREATE TABLE public.booking_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  room_type text NOT NULL,
  room_category text NOT NULL DEFAULT 'standard',
  quantity integer NOT NULL DEFAULT 0,
  occupancy integer,
  meal_plan text,
  check_in date,
  check_out date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX booking_rooms_booking_idx ON public.booking_rooms(booking_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_rooms TO authenticated;
GRANT ALL ON public.booking_rooms TO service_role;
ALTER TABLE public.booking_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage booking rooms" ON public.booking_rooms
  FOR ALL TO authenticated
  USING (public.owns_booking(booking_id)) WITH CHECK (public.owns_booking(booking_id));
CREATE POLICY "Staff read booking rooms" ON public.booking_rooms
  FOR SELECT TO authenticated USING (public.can_read_booking(booking_id));
CREATE TRIGGER booking_rooms_updated_at BEFORE UPDATE ON public.booking_rooms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── booking_allocations ───────────────────────────────
CREATE TABLE public.booking_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  booking_room_id uuid REFERENCES public.booking_rooms(id) ON DELETE SET NULL,
  client_id text NOT NULL,
  allocation_index integer NOT NULL,
  status text NOT NULL DEFAULT 'active',
  room_type text NOT NULL,
  booked_room_type text NOT NULL,
  booked_room_category text NOT NULL DEFAULT 'standard',
  occupancy integer,
  requests text[] NOT NULL DEFAULT '{}',
  upgrade_request jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (booking_id, client_id)
);
CREATE INDEX booking_allocations_booking_idx ON public.booking_allocations(booking_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_allocations TO authenticated;
GRANT ALL ON public.booking_allocations TO service_role;
ALTER TABLE public.booking_allocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage allocations" ON public.booking_allocations
  FOR ALL TO authenticated
  USING (public.owns_booking(booking_id)) WITH CHECK (public.owns_booking(booking_id));
CREATE POLICY "Staff read allocations" ON public.booking_allocations
  FOR SELECT TO authenticated USING (public.can_read_booking(booking_id));
CREATE TRIGGER booking_allocations_updated_at BEFORE UPDATE ON public.booking_allocations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── booking_guests ────────────────────────────────────
CREATE TABLE public.booking_guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  allocation_id uuid REFERENCES public.booking_allocations(id) ON DELETE CASCADE,
  client_id text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  nationality text,
  email text,
  phone text,
  requirements text[] NOT NULL DEFAULT '{}',
  special_requests text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (booking_id, client_id)
);
CREATE INDEX booking_guests_booking_idx ON public.booking_guests(booking_id);
CREATE INDEX booking_guests_allocation_idx ON public.booking_guests(allocation_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_guests TO authenticated;
GRANT ALL ON public.booking_guests TO service_role;
ALTER TABLE public.booking_guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage guests" ON public.booking_guests
  FOR ALL TO authenticated
  USING (public.owns_booking(booking_id)) WITH CHECK (public.owns_booking(booking_id));
CREATE POLICY "Staff read guests" ON public.booking_guests
  FOR SELECT TO authenticated USING (public.can_read_booking(booking_id));
CREATE TRIGGER booking_guests_updated_at BEFORE UPDATE ON public.booking_guests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── booking_rooming_lists ─────────────────────────────
CREATE TABLE public.booking_rooming_lists (
  booking_id uuid PRIMARY KEY REFERENCES public.bookings(id) ON DELETE CASCADE,
  group_requests text[] NOT NULL DEFAULT '{}',
  change_log jsonb NOT NULL DEFAULT '[]'::jsonb,
  saved_at timestamptz,
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_rooming_lists TO authenticated;
GRANT ALL ON public.booking_rooming_lists TO service_role;
ALTER TABLE public.booking_rooming_lists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage rooming list" ON public.booking_rooming_lists
  FOR ALL TO authenticated
  USING (public.owns_booking(booking_id)) WITH CHECK (public.owns_booking(booking_id));
CREATE POLICY "Staff read rooming list" ON public.booking_rooming_lists
  FOR SELECT TO authenticated USING (public.can_read_booking(booking_id));
CREATE TRIGGER booking_rooming_lists_updated_at BEFORE UPDATE ON public.booking_rooming_lists
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();