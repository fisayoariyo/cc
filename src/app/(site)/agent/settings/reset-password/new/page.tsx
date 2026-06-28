import type { Metadata } from 'next';
import { AgentSettingsResetPasswordNewPageClient } from '@/components/agent/agent-client-pages';

export const metadata: Metadata = {
  title: 'Create new password',
};

export default function AgentSettingsResetPasswordNewPage() {
  return <AgentSettingsResetPasswordNewPageClient />;
}
