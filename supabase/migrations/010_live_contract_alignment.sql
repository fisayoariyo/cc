-- Catch-up migration for the current live public schema.
-- Keeps the old history intact while normalizing fresh environments to the
-- columns and policies the app reads today.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE t.typname = 'property_status' AND e.enumlabel = 'pending'
  ) THEN
    ALTER TYPE public.property_status ADD VALUE 'pending';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE t.typname = 'property_status' AND e.enumlabel = 'sold'
  ) THEN
    ALTER TYPE public.property_status ADD VALUE 'sold';
  END IF;
END
$$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone_number text,
  ADD COLUMN IF NOT EXISTS passport_number text,
  ADD COLUMN IF NOT EXISTS onboarding_paid boolean DEFAULT false;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'phone'
  ) THEN
    UPDATE public.profiles
    SET phone_number = COALESCE(phone_number, phone)
    WHERE phone_number IS NULL
      AND phone IS NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'onboarding_fee_paid'
  ) THEN
    UPDATE public.profiles
    SET onboarding_paid = COALESCE(onboarding_paid, onboarding_fee_paid)
    WHERE onboarding_paid IS NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'status'
      AND udt_name = 'user_status'
  ) THEN
    ALTER TABLE public.profiles
      ALTER COLUMN status DROP DEFAULT;

    ALTER TABLE public.profiles
      ALTER COLUMN status TYPE text
      USING status::text;

    ALTER TABLE public.profiles
      ALTER COLUMN status SET DEFAULT 'pending';
  END IF;
END
$$;

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS phone,
  DROP COLUMN IF EXISTS onboarding_fee_paid;

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS category text;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'properties'
      AND column_name = 'city'
  ) THEN
    UPDATE public.properties
    SET location = COALESCE(
      location,
      NULLIF(trim(concat_ws(', ', city, address)), ''),
      city,
      address
    )
    WHERE location IS NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'properties'
      AND column_name = 'listing_type'
  ) THEN
    UPDATE public.properties
    SET category = CASE listing_type::text
      WHEN 'sale' THEN 'Buy'
      WHEN 'rent' THEN 'Rent'
      ELSE category
    END
    WHERE category IS NULL;
  END IF;
END
$$;

UPDATE public.properties
SET status = 'pending'::public.property_status
WHERE status::text = 'pending_approval';

UPDATE public.properties
SET status = 'active'::public.property_status
WHERE status::text = 'featured';

DROP INDEX IF EXISTS public.properties_labels_gin_idx;
ALTER TABLE public.properties DROP COLUMN IF EXISTS labels;

DROP POLICY IF EXISTS "properties_select_public" ON public.properties;
DROP POLICY IF EXISTS "properties_insert_agent" ON public.properties;
DROP POLICY IF EXISTS "properties_insert_admin" ON public.properties;
DROP POLICY IF EXISTS "properties_update_agent_or_admin" ON public.properties;
DROP POLICY IF EXISTS "properties_delete_agent_or_admin" ON public.properties;
DROP POLICY IF EXISTS "Anyone can view active properties" ON public.properties;
DROP POLICY IF EXISTS "Agents can manage their own properties" ON public.properties;
DROP POLICY IF EXISTS "Admins have full access to everything" ON public.properties;

CREATE POLICY "Anyone can view active properties"
  ON public.properties FOR SELECT
  USING (status = 'active'::property_status);

CREATE POLICY "Agents can manage their own properties"
  ON public.properties FOR ALL
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

CREATE POLICY "Admins have full access to everything"
  ON public.properties FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'::user_role
    )
  );

ALTER TABLE public.travel_applications
  ADD COLUMN IF NOT EXISTS destination text,
  ADD COLUMN IF NOT EXISTS notes text;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'travel_applications'
      AND column_name = 'current_stage'
      AND udt_name <> 'text'
  ) THEN
    ALTER TABLE public.travel_applications
      ALTER COLUMN current_stage DROP DEFAULT;

    ALTER TABLE public.travel_applications
      ALTER COLUMN current_stage TYPE text
      USING current_stage::text;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'travel_applications'
      AND column_name = 'internal_notes'
  ) THEN
    UPDATE public.travel_applications
    SET notes = COALESCE(notes, internal_notes)
    WHERE notes IS NULL
      AND internal_notes IS NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'travel_applications'
      AND column_name = 'form_data'
  ) THEN
    UPDATE public.travel_applications
    SET destination = COALESCE(destination, NULLIF(form_data->>'destination', ''))
    WHERE destination IS NULL;
  END IF;
END
$$;

ALTER TABLE public.travel_applications
  ALTER COLUMN current_stage SET DEFAULT 'application_received';

ALTER TABLE public.application_documents
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS file_path text,
  ADD COLUMN IF NOT EXISTS document_type text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

UPDATE public.application_documents AS d
SET client_id = t.client_id
FROM public.travel_applications AS t
WHERE d.application_id = t.id
  AND d.client_id IS NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'application_documents'
      AND column_name = 'document_name'
  ) THEN
    UPDATE public.application_documents
    SET document_type = COALESCE(document_type, document_name)
    WHERE document_type IS NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'application_documents'
      AND column_name = 'file_url'
  ) THEN
    UPDATE public.application_documents
    SET file_path = COALESCE(file_path, NULLIF(file_url, ''))
    WHERE file_path IS NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'application_documents'
      AND column_name = 'document_name'
  ) THEN
    UPDATE public.application_documents
    SET file_path = COALESCE(file_path, document_name, id::text)
    WHERE file_path IS NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'application_documents'
      AND column_name = 'uploaded_at'
  ) THEN
    UPDATE public.application_documents
    SET created_at = COALESCE(created_at, uploaded_at, reviewed_at, now()),
        updated_at = COALESCE(updated_at, reviewed_at, uploaded_at, created_at, now());
  END IF;
END
$$;

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
    false
  )
  ON CONFLICT (id) DO UPDATE
    SET email = excluded.email,
        full_name = COALESCE(NULLIF(excluded.full_name, ''), profiles.full_name),
        phone_number = COALESCE(NULLIF(excluded.phone_number, ''), profiles.phone_number),
        passport_number = COALESCE(NULLIF(excluded.passport_number, ''), profiles.passport_number);

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

DROP TABLE IF EXISTS public.agent_profiles CASCADE;
