-- Travel workflow hardening:
-- - service-specific stage history
-- - document review fields for admin decisions

CREATE TABLE IF NOT EXISTS public.application_stage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.travel_applications(id) ON DELETE CASCADE,
  stage_key text NOT NULL,
  stage_label text NOT NULL,
  note_to_client text,
  changed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.application_stage_history
  ADD COLUMN IF NOT EXISTS stage_key text;

ALTER TABLE public.application_stage_history
  ADD COLUMN IF NOT EXISTS stage_label text;

ALTER TABLE public.application_stage_history
  ADD COLUMN IF NOT EXISTS note_to_client text;

ALTER TABLE public.application_documents
  ADD COLUMN IF NOT EXISTS admin_note text,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS application_stage_history_app_idx
  ON public.application_stage_history(application_id, changed_at DESC);

CREATE INDEX IF NOT EXISTS application_documents_app_status_idx
  ON public.application_documents(application_id, status);

ALTER TABLE public.application_stage_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients view own stage history" ON public.application_stage_history;
CREATE POLICY "Clients view own stage history"
  ON public.application_stage_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.travel_applications t
      WHERE t.id = application_stage_history.application_id
        AND t.client_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins manage all stage history" ON public.application_stage_history;
CREATE POLICY "Admins manage all stage history"
  ON public.application_stage_history FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));
