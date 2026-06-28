import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAgentOnboardingPath } from '@/lib/agent-onboarding';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { getAgentOnboardingProfile } from '../actions';
import { IdentityView } from './identity-view';

export const metadata: Metadata = { title: 'Identity verification' };

export default async function IdentityPage() {
  const [viewer, profile] = await Promise.all([getViewerContext(), getAgentOnboardingProfile()]);

  if (!viewer) redirect('/login?next=/agent/onboarding/identity');
  if (viewer.role !== 'agent') redirect('/dashboard');
  if (!profile) redirect('/login?next=/agent/onboarding/identity');

  const path = getAgentOnboardingPath(profile);
  if (path !== '/agent/onboarding/identity') redirect(path);

  return (
    <main className="min-h-screen bg-white lg:h-[100dvh] lg:overflow-hidden">
      <IdentityView profile={profile} />
    </main>
  );
}
