import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAgentOnboardingPath } from '@/lib/agent-onboarding';
import { buildLoginRedirectPath } from '@/lib/auth/login-redirect';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { getAgentOnboardingProfile } from '../actions';
import { IdentityView } from './identity-view';

export const metadata: Metadata = { title: 'Identity verification' };

export default async function IdentityPage() {
  const [viewer, profile] = await Promise.all([getViewerContext(), getAgentOnboardingProfile()]);

  if (!viewer) redirect(buildLoginRedirectPath('/agent/onboarding/identity'));
  if (viewer.role !== 'agent') redirect('/dashboard');
  if (!profile) redirect(buildLoginRedirectPath('/agent/onboarding/identity'));

  const path = getAgentOnboardingPath(profile);
  if (path !== '/agent/onboarding/identity') redirect(path);

  return (
    <main className="min-h-screen bg-white lg:h-[100dvh] lg:overflow-hidden">
      <IdentityView profile={profile} />
    </main>
  );
}
