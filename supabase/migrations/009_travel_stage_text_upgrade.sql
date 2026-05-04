-- Align travel stage storage with service-specific string stages used by the app.
-- Fixes errors like:
--   invalid input value for enum travel_status: "request_received"

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'travel_applications'
      AND column_name = 'current_stage'
      AND udt_name = 'travel_status'
  ) THEN
    ALTER TABLE public.travel_applications
      ALTER COLUMN current_stage DROP DEFAULT;

    ALTER TABLE public.travel_applications
      ALTER COLUMN current_stage TYPE text
      USING current_stage::text;

    ALTER TABLE public.travel_applications
      ALTER COLUMN current_stage SET DEFAULT 'application_received';
  END IF;
END
$$;

UPDATE public.travel_applications
SET current_stage = CASE current_stage
  WHEN 'review' THEN 'application_received'
  WHEN 'payment_pending' THEN 'awaiting_payment'
  WHEN 'processing' THEN 'document_review'
  WHEN 'completed' THEN 'completed'
  WHEN 'rejected' THEN 'rejected_next_steps'
  ELSE current_stage
END
WHERE current_stage IN ('review', 'payment_pending', 'processing', 'completed', 'rejected');

