-- Generic case communication layer for inquiries and service workflows.

CREATE OR REPLACE FUNCTION public.is_staff_user(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.id = uid
      AND profiles.role IN ('admin', 'agent')
  );
$$;

CREATE TABLE IF NOT EXISTS public.case_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id uuid REFERENCES public.inquiries(id) ON DELETE CASCADE,
  travel_application_id uuid REFERENCES public.travel_applications(id) ON DELETE CASCADE,
  construction_project_id uuid REFERENCES public.construction_projects(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_name text,
  sender_email text,
  body text NOT NULL,
  visibility text NOT NULL DEFAULT 'client',
  mentioned_user_ids uuid[] NOT NULL DEFAULT '{}'::uuid[],
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT case_messages_parent_check CHECK (
    ((inquiry_id IS NOT NULL)::int +
     (travel_application_id IS NOT NULL)::int +
     (construction_project_id IS NOT NULL)::int) = 1
  ),
  CONSTRAINT case_messages_visibility_check CHECK (
    visibility IN ('client', 'internal')
  )
);

CREATE INDEX IF NOT EXISTS case_messages_inquiry_idx
  ON public.case_messages(inquiry_id, created_at ASC)
  WHERE inquiry_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS case_messages_travel_application_idx
  ON public.case_messages(travel_application_id, created_at ASC)
  WHERE travel_application_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS case_messages_construction_project_idx
  ON public.case_messages(construction_project_id, created_at ASC)
  WHERE construction_project_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS case_messages_sender_idx
  ON public.case_messages(sender_id, created_at DESC)
  WHERE sender_id IS NOT NULL;

ALTER TABLE public.case_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Staff manage all case messages" ON public.case_messages;
CREATE POLICY "Staff manage all case messages"
  ON public.case_messages FOR ALL
  USING (public.is_staff_user(auth.uid()))
  WITH CHECK (public.is_staff_user(auth.uid()));

DROP POLICY IF EXISTS "Clients read own case messages" ON public.case_messages;
CREATE POLICY "Clients read own case messages"
  ON public.case_messages FOR SELECT
  USING (
    visibility = 'client'
    AND (
      EXISTS (
        SELECT 1
        FROM public.travel_applications t
        WHERE t.id = case_messages.travel_application_id
          AND t.client_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1
        FROM public.construction_projects c
        WHERE c.id = case_messages.construction_project_id
          AND c.client_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Clients add own case messages" ON public.case_messages;
CREATE POLICY "Clients add own case messages"
  ON public.case_messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND visibility = 'client'
    AND (
      EXISTS (
        SELECT 1
        FROM public.travel_applications t
        WHERE t.id = case_messages.travel_application_id
          AND t.client_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1
        FROM public.construction_projects c
        WHERE c.id = case_messages.construction_project_id
          AND c.client_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Anyone can add inquiry intake message" ON public.case_messages;
CREATE POLICY "Anyone can add inquiry intake message"
  ON public.case_messages FOR INSERT
  WITH CHECK (
    inquiry_id IS NOT NULL
    AND sender_id IS NULL
    AND visibility = 'client'
  );
