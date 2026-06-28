-- Public bucket for property listing photos (agents + admins upload to own folder).

INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Listing authors upload property images" ON storage.objects;
CREATE POLICY "Listing authors upload property images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('agent', 'admin')
    )
  );

DROP POLICY IF EXISTS "Public read property images" ON storage.objects;
CREATE POLICY "Public read property images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'property-images');

DROP POLICY IF EXISTS "Authors delete own property images" ON storage.objects;
CREATE POLICY "Authors delete own property images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
