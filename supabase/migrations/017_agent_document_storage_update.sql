-- Allow agents to replace their own uploaded photos (upsert)

DROP POLICY IF EXISTS "Agents update own documents" ON storage.objects;
CREATE POLICY "Agents update own documents"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'agent-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'agent-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
