import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AgentListingsSearchPageClient } from '@/components/agent/agent-client-pages';
import { AgentRouteLoading } from '@/components/agent/agent-route-loading';

export const metadata: Metadata = {
  title: 'Search listings',
};

export default function AgentListingsSearchPage() {
  return (
    <Suspense fallback={<AgentRouteLoading />}>
      <AgentListingsSearchPageClient />
    </Suspense>
  );
}
