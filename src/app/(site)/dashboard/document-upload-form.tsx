'use client';

import { type FormEvent, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Paperclip } from 'lucide-react';
import { uploadApplicationDocument, type UploadDocState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TRAVEL_DOCUMENT_MAX_UPLOAD_MB } from '@/lib/upload-limits';

export function DocumentUploadForm({
  applicationId,
}: {
  applicationId: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [state, setState] = useState<UploadDocState>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = formRef.current;
    const input = fileInputRef.current;
    const file = input?.files?.[0] ?? null;

    if (!form || !file) {
      setState({ error: 'Please select a file.' });
      return;
    }

    const formData = new FormData(form);
    formData.set('file', file);

    startTransition(() => {
      void (async () => {
        const result = await uploadApplicationDocument(null, formData);
        setState(result);

        if (result && 'success' in result) {
          setFileName('');
          form.reset();
          router.refresh();
        }
      })();
    });
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="rounded-[20px] border border-border bg-card p-4 space-y-3"
    >
      <input type="hidden" name="application_id" value={applicationId} />

      <div className="space-y-1">
        <h3 className="text-[15px] font-semibold text-foreground">Upload supporting documents</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Upload what you already have. Admin will review it and your next step will update here.
        </p>
      </div>

      <div className="space-y-1">
        <Label htmlFor={`doc-type-${applicationId}`} className="text-sm">
          Document type
        </Label>
        <Input
          id={`doc-type-${applicationId}`}
          name="document_type"
          placeholder="Passport, statement, transcript, CV..."
          className="h-10 rounded-xl"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={`file-${applicationId}`} className="text-sm">
          Select file
        </Label>
        <label
          htmlFor={`file-${applicationId}`}
          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border bg-background px-3 py-3 transition-colors hover:bg-muted/40"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#efe8f7] text-[#4b2e6f]">
            <Paperclip className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-foreground">
              {fileName || 'Choose a file'}
            </span>
            <span className="block text-xs text-muted-foreground">
              {`Max ${TRAVEL_DOCUMENT_MAX_UPLOAD_MB}MB per upload`}
            </span>
          </span>
        </label>
        <input
          id={`file-${applicationId}`}
          name="file"
          type="file"
          required
          className="sr-only"
          onChange={(event) => {
            const nextFileName = event.currentTarget.files?.[0]?.name ?? '';
            setFileName(nextFileName);
            setState(null);
          }}
        />
      </div>

      {state && 'error' in state ? <p className="text-sm text-destructive">{state.error}</p> : null}
      {state && 'success' in state ? (
        <p className="text-sm text-muted-foreground">
          Uploaded successfully. It now appears in your document list below.
        </p>
      ) : null}

      <Button type="submit" size="sm" className="rounded-full bg-[#c88a2d] text-white hover:bg-[#b67b25]" disabled={isPending}>
        {isPending ? 'Uploading...' : fileName ? 'Upload selected document' : 'Upload document'}
      </Button>
    </form>
  );
}
