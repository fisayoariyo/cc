import type { Metadata } from 'next';
import { AgentListingsPageClient } from '@/components/agent/agent-client-pages';

export const metadata: Metadata = {
  title: 'Agent listings',
};

export default function AgentListingsPage() {
  return <AgentListingsPageClient />;
}
