-- Add admin-reviewed deletion requests for travel applications.

ALTER TABLE public.travel_applications
  ADD COLUMN IF NOT EXISTS deletion_request_status text,
  ADD COLUMN IF NOT EXISTS deletion_requested_at timestamptz,
  ADD COLUMN IF NOT EXISTS deletion_requested_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deletion_reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS deletion_reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'travel_applications_deletion_request_status_check'
  ) THEN
    ALTER TABLE public.travel_applications
      ADD CONSTRAINT travel_applications_deletion_request_status_check
      CHECK (deletion_request_status IN ('pending', 'rejected') OR deletion_request_status IS NULL);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS travel_applications_deletion_request_idx
  ON public.travel_applications (deletion_request_status, client_id, service_type);

DROP POLICY IF EXISTS "Admins can delete travel applications" ON public.travel_applications;
CREATE POLICY "Admins can delete travel applications"
  ON public.travel_applications FOR DELETE
  USING (public.is_admin_user(auth.uid()));
