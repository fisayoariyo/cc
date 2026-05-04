import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BadgeCheck } from 'lucide-react';
import { AgentAuthShell } from '@/components/auth/AgentAuthShell';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { AgentUnderReviewActions } from './under-review-actions';

export const metadata: Metadata = {
  title: 'Agent account under review',
};

export default async function AgentUnderReviewPage() {
  const viewer = await getViewerContext();

  if (!viewer) {
    redirect('/login?next=/agent/under-review');
  }

  if (viewer.role !== 'agent') {
    redirect('/dashboard');
  }

  if (viewer.status === 'verified') {
    redirect('/agent');
  }

  return (
    <main className="min-h-screen bg-white lg:h-[100dvh] lg:overflow-hidden">
      <AgentAuthShell
        title="Account Under Review"
        description="Your details have been submitted successfully and are currently being reviewed."
        visualTitle="Digitally onboard property agents"
        visualCopy="Create verified agent profiles, complete onboarding, and activate listing access across Charis Consult."
        contentWidthClass="max-w-[500px]"
        titleClassName="text-[34px] sm:text-[38px] lg:text-[34px] xl:text-[38px] lg:whitespace-nowrap"
        visualTitleClassName="text-[24px] xl:text-[28px] lg:whitespace-nowrap"
      >
        <div className="space-y-6">
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(145deg,#ffca5f_0%,#eba61d_100%)] shadow-[inset_0_-8px_0_rgba(153,103,18,0.18)]">
              <BadgeCheck className="h-10 w-10 text-white" strokeWidth={2.2} />
            </div>

            <div className="space-y-3">
              <h2 className="mx-auto max-w-[460px] text-[22px] font-semibold leading-[1.2] tracking-[-0.03em] text-[#101828] sm:text-[24px] lg:text-[26px]">
                You will be able to start publishing properties once your account is verified.
              </h2>
              <p className="mx-auto max-w-[430px] text-[14px] leading-7 text-slate-500">
                {viewer.fullName ? `${viewer.fullName}, ` : ''}
                this usually takes a short while. We will notify you once your account is approved.
              </p>
            </div>
          </div>

          <AgentUnderReviewActions />
        </div>
      </AgentAuthShell>
    </main>
  );
}
