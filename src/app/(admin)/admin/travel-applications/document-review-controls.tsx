'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { reviewApplicationDocument } from './actions';

export function DocumentReviewControls({
  id,
  currentStatus,
  currentNote,
}: {
  id: string;
  currentStatus: string;
  currentNote: string | null;
}) {
  const [pending, start] = useTransition();
  const [note, setNote] = useState(currentNote ?? '');
  const [notice, setNotice] = useState<string | null>(null);

  function run(status: 'accepted' | 'rejected' | 'resubmit_required') {
    start(() => {
      void (async () => {
        const res = await reviewApplicationDocument(id, status, note);
        setNotice(res && 'error' in res ? res.error ?? 'Failed.' : 'Saved');
      })();
    });
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Status: {currentStatus}</p>
      <textarea
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
        placeholder="Admin note"
      />
      <div className="flex items-center gap-1">
        <Button size="sm" type="button" variant="outline" className="rounded-full bg-transparent" disabled={pending} onClick={() => run('accepted')}>
          Accept
        </Button>
        <Button size="sm" type="button" variant="outline" className="rounded-full bg-transparent" disabled={pending} onClick={() => run('rejected')}>
          Reject
        </Button>
        <Button size="sm" type="button" disabled={pending} onClick={() => run('resubmit_required')}>
          Resubmit
        </Button>
      </div>
      {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
    </div>
  );
}
