import type { Metadata } from 'next';
import { AgentHelpPageClient } from '@/components/agent/agent-client-pages';

export const metadata: Metadata = {
  title: 'Help & Support',
};

export default function AgentHelpPage() {
  return <AgentHelpPageClient />;
}
