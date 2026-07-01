import { redirect } from 'next/navigation';
import { getAgentOnboardingPath } from '@/lib/agent-onboarding';
import { buildLoginRedirectPath } from '@/lib/auth/login-redirect';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { getAgentOnboardingProfile } from './actions';

export default async function AgentOnboardingPage() {
  const viewer = await getViewerContext();
  if (!viewer) redirect(buildLoginRedirectPath('/agent/onboarding'));
  if (viewer.role !== 'agent') redirect('/dashboard');
  if (viewer.status === 'verified') redirect('/agent');

  const profile = await getAgentOnboardingProfile();
  if (!profile) redirect(buildLoginRedirectPath('/agent/onboarding'));

  redirect(getAgentOnboardingPath(profile));
}
