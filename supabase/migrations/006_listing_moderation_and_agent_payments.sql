-- Listing moderation state machine + agent onboarding payment tracking.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE t.typname = 'property_status' AND e.enumlabel = 'draft'
  ) THEN
    ALTER TYPE property_status ADD VALUE 'draft';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE t.typname = 'property_status' AND e.enumlabel = 'edits_requested'
  ) THEN
    ALTER TYPE property_status ADD VALUE 'edits_requested';
  END IF;
END
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE t.typname = 'property_status' AND e.enumlabel = 'rejected'
  ) THEN
    ALTER TYPE property_status ADD VALUE 'rejected';
  END IF;
END
$$;

ALTER TABLE public.properties
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agent_payment_status') THEN
    CREATE TYPE agent_payment_status AS ENUM ('initialized', 'success', 'failed');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS public.agent_onboarding_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'paystack',
  reference text NOT NULL UNIQUE,
  amount numeric NOT NULL DEFAULT 5000,
  status agent_payment_status NOT NULL DEFAULT 'initialized',
  raw_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agent_onboarding_payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agents view own onboarding payments" ON public.agent_onboarding_payments;
CREATE POLICY "Agents view own onboarding payments"
  ON public.agent_onboarding_payments FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Agents create own onboarding payments" ON public.agent_onboarding_payments;
CREATE POLICY "Agents create own onboarding payments"
  ON public.agent_onboarding_payments FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage all onboarding payments" ON public.agent_onboarding_payments;
CREATE POLICY "Admins manage all onboarding payments"
  ON public.agent_onboarding_payments FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE INDEX IF NOT EXISTS agent_onboarding_payments_user_idx
  ON public.agent_onboarding_payments(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS properties_status_reviewed_idx
  ON public.properties(status, reviewed_at DESC);
