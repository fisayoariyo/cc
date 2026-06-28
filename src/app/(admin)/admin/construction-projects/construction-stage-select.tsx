'use client';

import { useState, useTransition } from 'react';
import { CONSTRUCTION_STAGES } from '@/lib/construction-stages';
import { updateConstructionProjectStage } from './actions';
import { Button } from '@/components/ui/button';

export function ConstructionStageSelect({
  projectId,
  current,
}: {
  projectId: string;
  current: string;
}) {
  const [stage, setStage] = useState(current);
  const [note, setNote] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-2">
      <select
        className="h-9 w-full min-w-[180px] rounded-md border border-input bg-background px-2 text-sm"
        value={stage}
        onChange={(e) => setStage(e.target.value)}
      >
        {CONSTRUCTION_STAGES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <textarea
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
        placeholder="Optional note to client"
      />
      <Button
        type="button"
        size="sm"
        disabled={pending}
        onClick={() =>
          start(() => {
            void (async () => {
              const res = await updateConstructionProjectStage(projectId, stage, note);
              setNotice(res && 'error' in res ? res.error ?? 'Failed to save.' : 'Saved');
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
