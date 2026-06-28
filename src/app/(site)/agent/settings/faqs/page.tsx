import type { Metadata } from 'next';
import { AgentSettingsFaqsPageClient } from '@/components/agent/agent-client-pages';

export const metadata: Metadata = {
  title: 'FAQs',
};

export default function AgentSettingsFaqsPage() {
  return <AgentSettingsFaqsPageClient />;
}
