import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { buildLoginRedirectPath } from '@/lib/auth/login-redirect';
import { AGENT_STATUS_ACTIONS_GAP } from '@/components/auth/agent-auth-styles';
import { AGENT_AUTH_CONTENT_WIDTH, AgentAuthShell } from '@/components/auth/AgentAuthShell';
import { AgentGoBackLink } from '@/components/auth/agent-auth-page-body';
import {
  agentStatusBadgeVariant,
  AgentStatusOutcome,
  agentStatusOutcomeCopy,
} from '@/components/auth/agent-status-outcome';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import {
  AgentRejectedActions,
  AgentUnderReviewActions,
  AgentVerifiedActions,
} from './under-review-actions';

export const metadata: Metadata = {
  title: 'Agent account status',
};

export default async function AgentUnderReviewPage() {
  const viewer = await getViewerContext();

  if (!viewer) {
    redirect(buildLoginRedirectPath('/agent/under-review'));
  }

  if (viewer.role !== 'agent') {
    redirect('/dashboard');
  }

  const variant = agentStatusBadgeVariant(viewer.status);
  const copy = agentStatusOutcomeCopy(variant);

  const actions = (
    <div className="flex w-full flex-col gap-3">
      {variant === 'verified' ? (
        <AgentVerifiedActions />
      ) : variant === 'rejected' ? (
        <AgentRejectedActions />
      ) : (
        <AgentUnderReviewActions />
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-white lg:h-[100dvh] lg:overflow-hidden">
      <AgentAuthShell
        title={copy.shellTitle}
        description={copy.shellDescription}
        visualTitle="Digitally onboard property agents"
        visualCopy="Create verified agent profiles, complete onboarding, and activate listing access across Charis Consult."
        contentWidthClass={AGENT_AUTH_CONTENT_WIDTH}
        agentAuthMobile
        footerMode="inline"
        compactLayout
        actionsClassName={AGENT_STATUS_ACTIONS_GAP}
        leading={<AgentGoBackLink href="/" label="Go back home" />}
        actions={actions}
      >
        <AgentStatusOutcome
          variant={variant}
          fullName={viewer.fullName}
          title={copy.title}
          description={copy.description}
        />
      </AgentAuthShell>
    </main>
  );
}
