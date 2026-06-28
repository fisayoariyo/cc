'use client';

import { useActionState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { CaseMessageFormState } from '@/app/actions/case-messages';

export function ClientCaseMessageForm({
  action,
  applicationId,
}: {
  action: (state: CaseMessageFormState, formData: FormData) => Promise<CaseMessageFormState>;
  applicationId: string;
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
      <input type="hidden" name="application_id" value={applicationId} />
      <Textarea
        name="body"
        required
        rows={4}
        placeholder="Ask a question or send an update to the team..."
        className="min-h-[120px] rounded-2xl bg-card"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">Your message will appear in your case timeline and notify the team.</p>
        <Button type="submit" className="rounded-full" disabled={isPending}>
          {isPending ? 'Sending...' : 'Send message'}
        </Button>
      </div>
      {state && 'error' in state ? <p className="text-sm text-destructive">{state.error}</p> : null}
      {state && 'success' in state ? <p className="text-sm text-muted-foreground">Message sent.</p> : null}
    </form>
  );
}
