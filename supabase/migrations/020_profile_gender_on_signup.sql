-- Persist gender from signup metadata onto profiles (admin agent verification reads profiles.gender).

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

  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    role,
    status,
    phone_number,
    passport_number,
    gender,
    onboarding_paid
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    r,
    CASE WHEN r = 'agent'::user_role THEN 'pending' ELSE 'verified' END,
    NULLIF(new.raw_user_meta_data->>'phone', ''),
    NULLIF(new.raw_user_meta_data->>'passport_number', ''),
    NULLIF(new.raw_user_meta_data->>'gender', ''),
    false
  )
  ON CONFLICT (id) DO UPDATE
    SET email = excluded.email,
        full_name = COALESCE(NULLIF(excluded.full_name, ''), profiles.full_name),
        phone_number = COALESCE(NULLIF(excluded.phone_number, ''), profiles.phone_number),
        passport_number = COALESCE(NULLIF(excluded.passport_number, ''), profiles.passport_number),
        gender = COALESCE(NULLIF(excluded.gender, ''), profiles.gender);

  IF r <> 'agent'::user_role THEN
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

-- Backfill gender for existing accounts where signup metadata already has it.
UPDATE public.profiles AS p
SET gender = NULLIF(u.raw_user_meta_data->>'gender', '')
FROM auth.users AS u
WHERE p.id = u.id
  AND p.gender IS NULL
  AND NULLIF(u.raw_user_meta_data->>'gender', '') IS NOT NULL;
