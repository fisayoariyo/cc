-- Add inquiries + optional documents table + performance constraints/indexes.
-- Safe to run after your initial schema and 002 migration.

-- ---------------------------------------------------------------------------
-- Inquiry status enum + inquiries table
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_status') THEN
    CREATE TYPE inquiry_status AS ENUM ('new', 'actioned', 'archived');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  inquiry_type text NOT NULL,
  message text NOT NULL,
  channel text NOT NULL DEFAULT 'web_form',
  status inquiry_status NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit inquiry"
  ON public.inquiries FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins manage all inquiries" ON public.inquiries;
CREATE POLICY "Admins manage all inquiries"
  ON public.inquiries FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- Optional travel application documents (if PRD flow needs uploads)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.application_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.travel_applications(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  document_type text,
  status text NOT NULL DEFAULT 'not_submitted',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.application_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients manage own documents" ON public.application_documents;
CREATE POLICY "Clients manage own documents"
  ON public.application_documents FOR ALL
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage all documents" ON public.application_documents;
CREATE POLICY "Admins manage all documents"
  ON public.application_documents FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

-- ---------------------------------------------------------------------------
-- Hardening constraints + indexes
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'properties_price_positive'
  ) THEN
    ALTER TABLE public.properties
      ADD CONSTRAINT properties_price_positive CHECK (price > 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'travel_apps_client_required'
  ) THEN
    ALTER TABLE public.travel_applications
      ADD CONSTRAINT travel_apps_client_required CHECK (client_id IS NOT NULL);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS profiles_role_status_idx ON public.profiles (role, status);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);
CREATE INDEX IF NOT EXISTS properties_status_created_idx ON public.properties (status, created_at DESC);
CREATE INDEX IF NOT EXISTS properties_agent_idx ON public.properties (agent_id);
CREATE INDEX IF NOT EXISTS travel_apps_client_stage_idx ON public.travel_applications (client_id, current_stage);
CREATE INDEX IF NOT EXISTS travel_apps_created_idx ON public.travel_applications (created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_status_created_idx ON public.inquiries (status, created_at DESC);
CREATE INDEX IF NOT EXISTS inquiries_email_idx ON public.inquiries (email);
CREATE INDEX IF NOT EXISTS app_docs_application_idx ON public.application_documents (application_id);
CREATE INDEX IF NOT EXISTS app_docs_client_idx ON public.application_documents (client_id);
