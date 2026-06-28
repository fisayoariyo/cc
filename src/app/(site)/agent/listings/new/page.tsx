import type { Metadata } from 'next';
import { AgentNewListingPageClient } from '@/components/agent/agent-listing-page-views';

export const metadata: Metadata = {
  title: 'New listing',
};

export default function AgentNewListingPage() {
  return <AgentNewListingPageClient />;
}
