-- Agent onboarding profile fields + document storage

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS agent_state text,
  ADD COLUMN IF NOT EXISTS agent_lga text,
  ADD COLUMN IF NOT EXISTS nin text,
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS onboarding_step text NOT NULL DEFAULT 'location';

COMMENT ON COLUMN public.profiles.onboarding_step IS 'Agent flow: location | documents | email | submitted';

INSERT INTO storage.buckets (id, name, public)
VALUES ('agent-documents', 'agent-documents', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Agents upload own documents" ON storage.objects;
CREATE POLICY "Agents upload own documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'agent-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Agents read own documents" ON storage.objects;
CREATE POLICY "Agents read own documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'agent-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Admins read agent documents" ON storage.objects;
CREATE POLICY "Admins read agent documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'agent-documents'
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );
