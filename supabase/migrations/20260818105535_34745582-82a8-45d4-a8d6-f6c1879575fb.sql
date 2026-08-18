ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS free_cancellation_until TIMESTAMP WITH TIME ZONE;
COMMENT ON COLUMN public.bookings.free_cancellation_until IS 'Deadline until which the booking can be cancelled free of charge. NULL when the rate has no free cancellation.';
GRANT SELECT ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;