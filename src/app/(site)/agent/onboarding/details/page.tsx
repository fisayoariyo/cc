import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAgentOnboardingPath } from '@/lib/agent-onboarding';
import { buildLoginRedirectPath } from '@/lib/auth/login-redirect';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { getAgentOnboardingProfile } from '../actions';
import { DetailsView } from './details-view';

export const metadata: Metadata = { title: 'Next of kin & address' };

export default async function DetailsPage() {
  const viewer = await getViewerContext();
  if (!viewer) redirect(buildLoginRedirectPath('/agent/onboarding/details'));
  if (viewer.role !== 'agent') redirect('/dashboard');

  const profile = await getAgentOnboardingProfile();
  if (!profile) redirect(buildLoginRedirectPath('/agent/onboarding/details'));

  const path = getAgentOnboardingPath(profile);
  if (path !== '/agent/onboarding/details') redirect(path);

  return (
    <main className="min-h-screen bg-white lg:h-[100dvh] lg:overflow-hidden">
      <DetailsView profile={profile} />
    </main>
  );
}
