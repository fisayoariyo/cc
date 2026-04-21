'use client';

import { useActionState } from 'react';
import { uploadApplicationDocument, type UploadDocState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DocumentUploadForm({
  applicationId,
}: {
  applicationId: string;
}) {
  const [state, formAction, isPending] = useActionState<UploadDocState, FormData>(
    uploadApplicationDocument,
    null,
  );

  return (
    <form action={formAction} className="rounded-xl border border-border bg-card p-3 space-y-3">
      <input type="hidden" name="application_id" value={applicationId} />
      <div className="space-y-1">
        <Label htmlFor={`doc-type-${applicationId}`} className="text-xs">
          Document type
        </Label>
        <Input
          id={`doc-type-${applicationId}`}
          name="document_type"
          placeholder="e.g. Passport, Statement, Degree"
          className="h-9"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`file-${applicationId}`} className="text-xs">
          File (max 10MB)
        </Label>
        <Input id={`file-${applicationId}`} name="file" type="file" required className="h-9" />
      </div>
      {state && 'error' in state && (
        <p className="text-xs text-destructive">{state.error}</p>
      )}
      {state && 'success' in state && (
        <p className="text-xs text-muted-foreground">Uploaded successfully.</p>
      )}
      <Button type="submit" size="sm" className="rounded-full" disabled={isPending}>
        {isPending ? 'Uploading…' : 'Upload document'}
      </Button>
    </form>
  );
}
