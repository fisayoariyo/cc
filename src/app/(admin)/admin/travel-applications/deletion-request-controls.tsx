'use client';

import { useState, useTransition } from 'react';
import { approveTravelApplicationDeletion, rejectTravelApplicationDeletion } from './actions';
import { Button } from '@/components/ui/button';

export function DeletionRequestControls({ applicationId }: { applicationId: string }) {
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);

  function run(action: 'approve' | 'reject') {
    setNotice(null);
    startTransition(() => {
      void (async () => {
        const result =
          action === 'approve'
            ? await approveTravelApplicationDeletion(applicationId)
            : await rejectTravelApplicationDeletion(applicationId);

        setNotice(result && 'error' in result ? result.error ?? 'Failed.' : 'Saved');
      })();
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
          disabled={pending}
          onClick={() => run('approve')}
        >
          {pending ? 'Saving...' : 'Approve deletion'}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-full bg-transparent"
          disabled={pending}
          onClick={() => run('reject')}
        >
          Keep application
        </Button>
      </div>
      {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
    </div>
  );
}
