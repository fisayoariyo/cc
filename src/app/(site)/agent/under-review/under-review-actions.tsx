'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, RefreshCcw } from 'lucide-react';
import { AGENT_PRIMARY_BTN, AGENT_SECONDARY_BTN } from '@/components/auth/agent-auth-styles';
import { Button } from '@/components/ui/button';

export function AgentUnderReviewActions() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  return (
    <>
      <Button
        type="button"
        className={AGENT_PRIMARY_BTN}
        disabled={refreshing}
        onClick={() => {
          setRefreshing(true);
          router.refresh();
          window.setTimeout(() => setRefreshing(false), 600);
        }}
      >
        <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        {refreshing ? 'Refreshing status...' : 'Refresh status'}
      </Button>

      <Button asChild variant="secondary" className={AGENT_SECONDARY_BTN}>
        <Link href="/contact">
          Contact support
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </>
  );
}

export { AgentVerifiedActions, AgentRejectedActions } from './agent-status-actions';
