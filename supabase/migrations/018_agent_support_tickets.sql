-- Agent support tickets → admin reported issues queue

CREATE TABLE IF NOT EXISTS public.agent_support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_code text NOT NULL UNIQUE,
  agent_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  issue_type text NOT NULL,
  listing_reference text,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES public.profiles (id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS agent_support_tickets_agent_id_idx
  ON public.agent_support_tickets (agent_id);

CREATE INDEX IF NOT EXISTS agent_support_tickets_status_idx
  ON public.agent_support_tickets (status);

CREATE INDEX IF NOT EXISTS agent_support_tickets_created_at_idx
  ON public.agent_support_tickets (created_at DESC);

DROP TRIGGER IF EXISTS agent_support_tickets_set_updated_at ON public.agent_support_tickets;
CREATE TRIGGER agent_support_tickets_set_updated_at
  BEFORE UPDATE ON public.agent_support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.agent_support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Agents read own support tickets" ON public.agent_support_tickets;
CREATE POLICY "Agents read own support tickets"
  ON public.agent_support_tickets FOR SELECT
  USING (agent_id = auth.uid());

DROP POLICY IF EXISTS "Agents create own support tickets" ON public.agent_support_tickets;
CREATE POLICY "Agents create own support tickets"
  ON public.agent_support_tickets FOR INSERT
  WITH CHECK (agent_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage support tickets" ON public.agent_support_tickets;
CREATE POLICY "Admins manage support tickets"
  ON public.agent_support_tickets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'::public.user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'::public.user_role
    )
  );
