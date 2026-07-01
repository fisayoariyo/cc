import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAgentOnboardingPath } from '@/lib/agent-onboarding';
import { buildLoginRedirectPath } from '@/lib/auth/login-redirect';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { getAgentOnboardingProfile } from '../actions';
import { LocationView } from './location-view';

export const metadata: Metadata = { title: 'Select location' };

export default async function LocationPage() {
  const [viewer, profile] = await Promise.all([getViewerContext(), getAgentOnboardingProfile()]);

  if (!viewer) redirect(buildLoginRedirectPath('/agent/onboarding/location'));
  if (viewer.role !== 'agent') redirect('/dashboard');
  if (!profile) redirect(buildLoginRedirectPath('/agent/onboarding/location'));

  const path = getAgentOnboardingPath(profile);
  if (path !== '/agent/onboarding/location') redirect(path);

  return (
    <main className="min-h-screen bg-white lg:h-[100dvh] lg:overflow-hidden">
      <LocationView profile={profile} />
    </main>
  );
}
