'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { CaseMessageFormState } from '@/app/actions/case-messages';

export function AdminCaseMessageForm({
  action,
  hiddenFields,
  defaultVisibility = 'internal',
  submitLabel,
}: {
  action: (state: CaseMessageFormState, formData: FormData) => Promise<CaseMessageFormState>;
  hiddenFields: Array<{ name: string; value: string }>;
  defaultVisibility?: 'client' | 'internal';
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState<CaseMessageFormState, FormData>(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && 'success' in state) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4">
      {hiddenFields.map((field) => (
        <input key={field.name} type="hidden" name={field.name} value={field.value} />
      ))}

      <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
        <Textarea
          name="body"
          required
          rows={4}
          placeholder="Add a note or send an update..."
          className="min-h-[120px] rounded-2xl bg-card"
        />
        <div className="space-y-3">
          <select
            name="visibility"
            defaultValue={defaultVisibility}
            className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm"
          >
            <option value="internal">Internal note</option>
            <option value="client">Client visible</option>
          </select>
          <Button type="submit" className="w-full rounded-full" disabled={isPending}>
            {isPending ? 'Sending...' : submitLabel}
          </Button>
        </div>
      </div>

      {state && 'error' in state ? <p className="text-sm text-destructive">{state.error}</p> : null}
      {state && 'success' in state ? <p className="text-sm text-muted-foreground">Saved.</p> : null}
    </form>
  );
}
