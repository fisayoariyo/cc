'use client';

import { useState, useTransition } from 'react';
import { setInquiryStatus } from './actions';
import type { InquiryStatus } from '@/lib/types/database';

export function InquiryStatusSelect({ id, status }: { id: string; status: InquiryStatus }) {
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);
  return (
    <div className="space-y-1">
      <select
        defaultValue={status}
        disabled={pending}
        className="h-9 w-full min-w-[120px] rounded-md border border-input bg-background px-2 text-sm"
        onChange={(e) => {
          const next = e.target.value as InquiryStatus;
          startTransition(() => {
            void (async () => {
              const res = await setInquiryStatus(id, next);
              setNotice(res && 'error' in res ? (res.error ?? 'Failed to save.') : 'Saved');
            })();
          });
        }}
      >
        <option value="new">New</option>
        <option value="actioned">Actioned</option>
        <option value="archived">Archived</option>
      </select>
      {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
    </div>
  );
}
