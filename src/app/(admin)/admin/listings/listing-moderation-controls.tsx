'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { moderatePropertyListing } from './actions';

export function ListingModerationControls({
  listingId,
  status,
}: {
  listingId: string;
  status: string;
}) {
  const [pending, start] = useTransition();
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  async function run(decision: 'approve' | 'request_edits' | 'reject' | 'archive') {
    start(() => {
      void (async () => {
        const res = await moderatePropertyListing({ listingId, decision, note });
        setNotice(res && 'error' in res ? res.error ?? 'Failed.' : 'Updated.');
      })();
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <textarea
        className="w-full min-w-[200px] rounded-md border border-input bg-background px-2 py-1 text-xs"
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional note (required for request edits)"
      />
      <div className="flex items-center gap-1">
        <Button
          size="sm"
          type="button"
          variant="outline"
          className="rounded-full bg-transparent"
          disabled={pending || status === 'active'}
          onClick={() => run('approve')}
        >
          Approve
        </Button>
        <Button
          size="sm"
          type="button"
          variant="outline"
          className="rounded-full bg-transparent"
          disabled={pending}
          onClick={() => run('request_edits')}
        >
          Request edits
        </Button>
        <Button
          size="sm"
          type="button"
          variant="outline"
          className="rounded-full bg-transparent"
          disabled={pending || status === 'rejected'}
          onClick={() => run('reject')}
        >
          Reject
        </Button>
      </div>
      <Button
        size="sm"
        type="button"
        variant="ghost"
        className="rounded-full"
        disabled={pending || status === 'archived'}
        onClick={() => run('archive')}
      >
        Archive
      </Button>
      {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
    </div>
  );
}
