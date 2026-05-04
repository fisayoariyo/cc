-- Allow clients to delete their own travel applications and speed up active-app checks per service.

DROP POLICY IF EXISTS "Clients can delete own travel applications" ON public.travel_applications;
CREATE POLICY "Clients can delete own travel applications"
  ON public.travel_applications FOR DELETE
  USING (client_id = auth.uid());

CREATE INDEX IF NOT EXISTS travel_active_service_lookup_idx
  ON public.travel_applications (client_id, service_type, current_stage);
