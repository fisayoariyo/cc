import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAgentOnboardingPath } from '@/lib/agent-onboarding';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { getAgentOnboardingProfile } from '../actions';
import { VerifyEmailView } from './verify-email-view';

export const metadata: Metadata = { title: 'Verify email' };

export default async function VerifyEmailPage() {
  const viewer = await getViewerContext();
  if (!viewer) redirect('/login?next=/agent/onboarding/verify-email');
  if (viewer.role !== 'agent') redirect('/dashboard');

  const profile = await getAgentOnboardingProfile();
  if (!profile) redirect('/login?next=/agent/onboarding/verify-email');

  const path = getAgentOnboardingPath(profile);
  if (path !== '/agent/onboarding/verify-email') redirect(path);

  return (
    <main className="min-h-screen bg-white lg:h-[100dvh] lg:overflow-hidden">
      <VerifyEmailView email={viewer.email} />
    </main>
  );
}
