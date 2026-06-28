'use client';

import { type FormEvent, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
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
  const documentTypeRef = useRef<HTMLInputElement>(null);
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
          ref={documentTypeRef}
          name="document_type"
          placeholder="Passport, statement, transcript, CV..."
          required
          className="h-10 rounded-xl"
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor={`file-${applicationId}`} className="text-sm">
          Select file
        </Label>
        <input
          id={`file-${applicationId}`}
          ref={fileInputRef}
          name="file"
          type="file"
          required
          className="h-12 rounded-2xl border-border/70 bg-card file:mr-4 file:rounded-full file:bg-[#efe8f7] file:px-3 file:text-[#4b2e6f]"
          onChange={(event) => {
            const nextFile = event.currentTarget.files?.[0] ?? null;
            const nextFileName = nextFile?.name ?? '';
            setFileName(nextFileName);
            setState(null);

            if (nextFile && documentTypeRef.current && !documentTypeRef.current.value.trim()) {
              documentTypeRef.current.value = nextFile.name
                .replace(/\.[^.]+$/, '')
                .replace(/[_-]+/g, ' ')
                .trim();
            }
          }}
        />
        <p className="text-xs text-muted-foreground">
          {fileName || `Enter a document name and upload a file up to ${TRAVEL_DOCUMENT_MAX_UPLOAD_MB}MB.`}
        </p>
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
