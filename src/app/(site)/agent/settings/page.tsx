import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AgentSettingsPageClient } from '@/components/agent/agent-client-pages';
import { AgentRouteLoading } from '@/components/agent/agent-route-loading';

export const metadata: Metadata = {
  title: 'Settings',
};

export default function AgentSettingsPage() {
  return (
    <Suspense fallback={<AgentRouteLoading className="bg-[#f4f2f7] lg:bg-transparent" />}>
      <AgentSettingsPageClient />
    </Suspense>
  );
}
