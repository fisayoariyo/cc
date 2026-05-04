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
  const optionsBase = getStageOptions(serviceType).map((option) => ({ ...option, value: option.value }));
  const options = optionsBase.some((option) => option.value === current)
    ? optionsBase
    : [{ value: current, label: current.replace(/_/g, ' ') }, ...optionsBase];

  return (
    <div className="space-y-1">
      <select
        value={stage}
        disabled={pending}
        onChange={(event) => setStage(event.target.value)}
        className="h-10 w-full min-w-[150px] rounded-xl border border-input bg-[#fbfafc] px-3 text-sm"
        aria-label="Update stage"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        rows={2}
        placeholder="Optional update for client"
        className="w-full rounded-xl border border-input bg-[#fbfafc] px-3 py-2 text-xs"
      />
      <Button
        type="button"
        size="sm"
        className="rounded-full bg-[#4b2e6f] text-white hover:bg-[#40255f]"
        disabled={pending}
        onClick={() =>
          startTransition(() => {
            void (async () => {
              const res = await updateTravelStage(id, serviceType ?? 'education', stage, note);
              setNotice(res && 'error' in res ? (res.error ?? 'Failed to save.') : 'Saved');
              if (!(res && 'error' in res)) setNote('');
            })();
          })
        }
      >
        {pending ? 'Saving...' : 'Update stage'}
      </Button>
      {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
    </div>
  );
}
