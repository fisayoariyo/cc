'use client';

import { useState, useTransition } from 'react';
import { updateTravelStage } from './actions';
import type { TravelStageKey } from '@/lib/types/database';
import { getStageOptions } from '@/lib/travel-stages';
import { Button } from '@/components/ui/button';
export function TravelStageSelect({
  id,
  serviceType,
  current,
}: {
  id: string;
  serviceType: string | null;
  current: TravelStageKey;
}) {
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);
  const [stage, setStage] = useState<TravelStageKey>(current);
  const [note, setNote] = useState('');
  const optionsBase = getStageOptions(serviceType).map((o) => ({ ...o, value: o.value }));
  const options = optionsBase.some((o) => o.value === current)
    ? optionsBase
    : [{ value: current, label: current.replace(/_/g, ' ') }, ...optionsBase];

  return (
    <div className="space-y-1">
      <select
        value={stage}
        disabled={pending}
        onChange={(e) => setStage(e.target.value)}
        className="h-9 w-full min-w-[140px] rounded-md border border-input bg-background px-2 text-sm"
        aria-label="Update stage"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Optional note to client"
        className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
      />
      <Button
        type="button"
        size="sm"
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            void (async () => {
              const res = await updateTravelStage(id, serviceType ?? 'visa', stage, note);
              setNotice(res && 'error' in res ? (res.error ?? 'Failed to save.') : 'Saved');
              if (!(res && 'error' in res)) setNote('');
            })();
          })
        }
      >
        {pending ? 'Saving…' : 'Save stage'}
      </Button>
      {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
    </div>
  );
}
