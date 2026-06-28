-- Agent next-of-kin, address, and onboarding step update (remove email step)

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS agent_address text,
  ADD COLUMN IF NOT EXISTS next_of_kin_name text,
  ADD COLUMN IF NOT EXISTS next_of_kin_phone text,
  ADD COLUMN IF NOT EXISTS next_of_kin_relationship text;

-- Agents stuck on the old email step move forward to details
UPDATE public.profiles
SET onboarding_step = 'details'
WHERE role = 'agent' AND onboarding_step = 'email';

COMMENT ON COLUMN public.profiles.onboarding_step IS 'Agent flow: location | documents | details | submitted';
