-- Run AFTER your initial schema in the Supabase SQL Editor (additive).
-- Fixes: client travel apps, admin profile visibility, signup role from metadata.

-- ---------------------------------------------------------------------------
-- Travel applications — clients must see/create/update their own rows
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Clients can view own travel applications" ON travel_applications;
CREATE POLICY "Clients can view own travel applications"
  ON travel_applications FOR SELECT
  USING (client_id = auth.uid());

DROP POLICY IF EXISTS "Clients can insert own travel applications" ON travel_applications;
CREATE POLICY "Clients can insert own travel applications"
  ON travel_applications FOR INSERT
  WITH CHECK (client_id = auth.uid());

DROP POLICY IF EXISTS "Clients can update own travel applications" ON travel_applications;
CREATE POLICY "Clients can update own travel applications"
  ON travel_applications FOR UPDATE
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Profiles — admins list agents / verify (read all + update status/role)
-- ---------------------------------------------------------------------------
-- NOTE: do NOT query profiles inside profiles RLS expressions directly.
-- That can trigger recursive policy evaluation in some setups.
CREATE OR REPLACE FUNCTION public.is_admin_user(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = uid
      AND p.role = 'admin'
  );
$$;

DROP POLICY IF EXISTS "Admins can select all profiles" ON profiles;
CREATE POLICY "Admins can select all profiles"
  ON profiles FOR SELECT
  USING (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- Signup: respect role + full_name from auth metadata (agent/client)
-- ---------------------------------------------------------------------------
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
    -- Never promote to admin via signup metadata; promote admins in SQL manually.
    IF trim(new.raw_user_meta_data->>'role') = 'agent' THEN
      r := 'agent'::user_role;
    END IF;
  END IF;

  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    r
  )
  ON CONFLICT (id) DO UPDATE
    SET email = excluded.email,
        full_name = COALESCE(NULLIF(excluded.full_name, ''), profiles.full_name);

  RETURN new;
END;
$$;
