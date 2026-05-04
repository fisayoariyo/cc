CREATE TABLE IF NOT EXISTS public.success_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL,
  story_body text NOT NULL,
  service text NOT NULL,
  client_label text,
  location text,
  outcome text,
  cover_image_url text NOT NULL,
  cover_image_alt text,
  highlight_video_url text,
  highlight_video_poster_url text,
  gallery_image_urls text[] NOT NULL DEFAULT '{}'::text[],
  gallery_video_urls text[] NOT NULL DEFAULT '{}'::text[],
  published boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  seo_title text,
  seo_description text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT success_stories_service_check
    CHECK (service IN ('travel', 'real_estate', 'construction'))
);

CREATE INDEX IF NOT EXISTS success_stories_published_idx
  ON public.success_stories (published, featured, sort_order, created_at DESC);

CREATE INDEX IF NOT EXISTS success_stories_slug_idx
  ON public.success_stories (slug);

DROP TRIGGER IF EXISTS success_stories_set_updated_at ON public.success_stories;
CREATE TRIGGER success_stories_set_updated_at
  BEFORE UPDATE ON public.success_stories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published success stories" ON public.success_stories;
CREATE POLICY "Public can view published success stories"
  ON public.success_stories FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Admins manage success stories" ON public.success_stories;
CREATE POLICY "Admins manage success stories"
  ON public.success_stories FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'::user_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'::user_role
    )
  );
