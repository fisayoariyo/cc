import type { Metadata } from 'next';
import { AgentSettingsResetPasswordPageClient } from '@/components/agent/agent-client-pages';

export const metadata: Metadata = {
  title: 'Reset password',
};

export default function AgentSettingsResetPasswordPage() {
  return <AgentSettingsResetPasswordPageClient />;
}
