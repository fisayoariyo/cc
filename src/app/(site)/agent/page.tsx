import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AgentDashboardPageClient } from '@/components/agent/agent-client-pages';
import { AgentRouteLoading } from '@/components/agent/agent-route-loading';

export const metadata: Metadata = {
  title: 'Agent dashboard',
};

export default function AgentDashboardPage() {
  return (
    <Suspense fallback={<AgentRouteLoading />}>
      <AgentDashboardPageClient />
    </Suspense>
  );
}
