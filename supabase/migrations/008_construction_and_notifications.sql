-- Construction project tracker + in-app notifications.

CREATE TABLE IF NOT EXISTS public.construction_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  project_type text NOT NULL,
  location text NOT NULL,
  budget_range text,
  timeline text,
  description text,
  current_stage text NOT NULL DEFAULT 'inquiry_received',
  status text NOT NULL DEFAULT 'in_progress',
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.construction_stage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.construction_projects(id) ON DELETE CASCADE,
  stage_key text NOT NULL,
  stage_label text NOT NULL,
  note_to_client text,
  changed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL,
  type text NOT NULL DEFAULT 'general',
  link_url text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS construction_projects_client_idx
  ON public.construction_projects(client_id, created_at DESC);
CREATE INDEX IF NOT EXISTS construction_stage_history_project_idx
  ON public.construction_stage_history(project_id, changed_at DESC);
CREATE INDEX IF NOT EXISTS notifications_user_idx
  ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS notifications_user_unread_idx
  ON public.notifications(user_id, is_read);

ALTER TABLE public.construction_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Clients view own construction projects" ON public.construction_projects;
CREATE POLICY "Clients view own construction projects"
  ON public.construction_projects FOR SELECT
  USING (client_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage all construction projects" ON public.construction_projects;
CREATE POLICY "Admins manage all construction projects"
  ON public.construction_projects FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Clients view own construction history" ON public.construction_stage_history;
CREATE POLICY "Clients view own construction history"
  ON public.construction_stage_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.construction_projects p
      WHERE p.id = construction_stage_history.project_id
        AND p.client_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins manage all construction history" ON public.construction_stage_history;
CREATE POLICY "Admins manage all construction history"
  ON public.construction_stage_history FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Users read own notifications" ON public.notifications;
CREATE POLICY "Users read own notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users mark own notifications read" ON public.notifications;
CREATE POLICY "Users mark own notifications read"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins manage all notifications" ON public.notifications;
CREATE POLICY "Admins manage all notifications"
  ON public.notifications FOR ALL
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));
