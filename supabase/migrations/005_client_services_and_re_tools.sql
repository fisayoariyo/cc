-- Multi-service client access + real-estate client tools:
-- client services, saved searches, favorites, and compare list.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'client_service_type') THEN
    CREATE TYPE client_service_type AS ENUM ('travel', 'real_estate', 'construction');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.client_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service client_service_type NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, service)
);

CREATE TABLE IF NOT EXISTS public.saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service client_service_type NOT NULL DEFAULT 'real_estate',
  title text NOT NULL,
  query jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.favorite_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

CREATE TABLE IF NOT EXISTS public.compare_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id)
);

ALTER TABLE public.client_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compare_properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients view own services" ON public.client_services;
CREATE POLICY "Clients view own services"
  ON public.client_services FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Clients add own services" ON public.client_services;
CREATE POLICY "Clients add own services"
  ON public.client_services FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage all client services" ON public.client_services;
CREATE POLICY "Admins manage all client services"
  ON public.client_services FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Clients manage own saved searches" ON public.saved_searches;
CREATE POLICY "Clients manage own saved searches"
  ON public.saved_searches FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage all saved searches" ON public.saved_searches;
CREATE POLICY "Admins manage all saved searches"
  ON public.saved_searches FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Clients manage own favorites" ON public.favorite_properties;
CREATE POLICY "Clients manage own favorites"
  ON public.favorite_properties FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage all favorites" ON public.favorite_properties;
CREATE POLICY "Admins manage all favorites"
  ON public.favorite_properties FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Clients manage own compare list" ON public.compare_properties;
CREATE POLICY "Clients manage own compare list"
  ON public.compare_properties FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage all compare list" ON public.compare_properties;
CREATE POLICY "Admins manage all compare list"
  ON public.compare_properties FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE INDEX IF NOT EXISTS client_services_user_service_idx ON public.client_services(user_id, service);
CREATE INDEX IF NOT EXISTS saved_searches_user_service_idx ON public.saved_searches(user_id, service);
CREATE INDEX IF NOT EXISTS favorite_properties_user_idx ON public.favorite_properties(user_id);
CREATE INDEX IF NOT EXISTS compare_properties_user_idx ON public.compare_properties(user_id);

-- Seed default client service from signup metadata when available.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r user_role;
  service_text text;
BEGIN
  r := 'client'::user_role;
  IF new.raw_user_meta_data ? 'role' THEN
    IF trim(new.raw_user_meta_data->>'role') = 'agent' THEN
      r := 'agent'::user_role;
    END IF;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, role, status, phone_number)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    r,
    CASE WHEN r = 'agent'::user_role THEN 'pending' ELSE 'verified' END,
    NULLIF(new.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE
    SET email = excluded.email,
        full_name = COALESCE(NULLIF(excluded.full_name, ''), profiles.full_name),
        phone_number = COALESCE(NULLIF(excluded.phone_number, ''), profiles.phone_number);

  IF r = 'agent'::user_role THEN
    INSERT INTO public.agent_profiles (
      user_id,
      agency_name,
      registration_number,
      verification_status,
      payment_status
    )
    VALUES (
      new.id,
      NULLIF(new.raw_user_meta_data->>'agency_name', ''),
      NULLIF(new.raw_user_meta_data->>'registration_number', ''),
      'pending',
      'unpaid'
    )
    ON CONFLICT (user_id) DO UPDATE
      SET agency_name = COALESCE(EXCLUDED.agency_name, agent_profiles.agency_name),
          registration_number = COALESCE(EXCLUDED.registration_number, agent_profiles.registration_number);
  ELSE
    service_text := NULLIF(new.raw_user_meta_data->>'service_interest', '');
    IF service_text IN ('travel', 'real_estate', 'construction') THEN
      INSERT INTO public.client_services (user_id, service)
      VALUES (new.id, service_text::client_service_type)
      ON CONFLICT (user_id, service) DO NOTHING;
    END IF;
  END IF;

  RETURN new;
END;
$$;
