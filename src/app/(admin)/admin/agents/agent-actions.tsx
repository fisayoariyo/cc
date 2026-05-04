'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { setAgentVerification } from './actions';
import { Button } from '@/components/ui/button';

export function AgentVerifyButtons({ profileId }: { profileId: string }) {
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function run(status: 'verified' | 'rejected') {
    setPending(true);
    const res = await setAgentVerification(profileId, status);
    setNotice(res && 'error' in res ? (res.error ?? 'Failed to update.') : `Marked as ${status}.`);
    setPending(false);
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        size="sm"
        variant="outline"
        className="rounded-full bg-transparent"
        type="button"
        disabled={pending}
        onClick={() => void run('rejected')}
      >
        <X className="w-3 h-3 mr-1" />
        Reject
      </Button>
      <Button size="sm" className="rounded-full" type="button" disabled={pending} onClick={() => void run('verified')}>
        <Check className="w-3 h-3 mr-1" />
        Approve
      </Button>
      {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
    </div>
  );
}
