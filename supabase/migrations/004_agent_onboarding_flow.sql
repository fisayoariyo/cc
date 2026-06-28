-- Agent onboarding workflow support:
-- pending review -> verified -> payment required -> active dashboard access.

CREATE TABLE IF NOT EXISTS public.agent_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  agency_name text,
  registration_number text,
  verification_status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'unpaid',
  onboarding_fee_amount numeric NOT NULL DEFAULT 5000,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agents view own agent profile" ON public.agent_profiles;
CREATE POLICY "Agents view own agent profile"
  ON public.agent_profiles FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Agents update own agent profile" ON public.agent_profiles;
CREATE POLICY "Agents update own agent profile"
  ON public.agent_profiles FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage all agent profiles" ON public.agent_profiles;
CREATE POLICY "Admins manage all agent profiles"
  ON public.agent_profiles FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE INDEX IF NOT EXISTS agent_profiles_user_idx ON public.agent_profiles(user_id);
CREATE INDEX IF NOT EXISTS agent_profiles_verification_idx ON public.agent_profiles(verification_status);
CREATE INDEX IF NOT EXISTS agent_profiles_payment_idx ON public.agent_profiles(payment_status);

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS labels text[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS properties_labels_gin_idx ON public.properties USING GIN(labels);

-- Keep signup trigger aligned with agent onboarding metadata.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r user_role;
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
  END IF;

  RETURN new;
END;
$$;
