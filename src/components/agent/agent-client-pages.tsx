'use client';

import { useSearchParams } from 'next/navigation';
import { AgentDashboardRoute, AgentListingsRoute } from '@/components/agent/agent-dashboard-routes';
import { AgentSettingsView } from '@/components/agent/agent-settings-view';
import { AgentListingsPaywall } from '@/components/agent/agent-listings-paywall';
import { useAgentViewer } from '@/components/agent/agent-viewer-provider';
import { formatAgentLocation } from '@/lib/agent-profile';
import { agentCanManageListings } from '@/lib/agent-listing-access';
import { SupportTicketForm } from '@/app/(site)/agent/help/support-ticket-form';
import { AgentSettingsFaqsPanel } from '@/app/(site)/agent/settings/faqs/agent-settings-faqs-panel';
import { AgentSettingsResetPasswordOtpForm } from '@/app/(site)/agent/settings/reset-password/reset-password-otp-form';
import { AgentSettingsResetPasswordNewForm } from '@/app/(site)/agent/settings/reset-password/new/reset-password-new-form';

export function AgentDashboardPageClient() {
  const viewer = useAgentViewer();
  const searchParams = useSearchParams();
  const firstName = (viewer.fullName ?? viewer.email ?? 'Agent').split(' ')[0];

  return (
    <AgentDashboardRoute
      firstName={firstName}
      canCreateListings={agentCanManageListings(viewer)}
      showPaywall={viewer.status === 'verified' && !viewer.onboardingPaid}
      paymentFailed={searchParams.get('payment') === 'failed'}
    />
  );
}

export function AgentListingsPageClient() {
  const viewer = useAgentViewer();
  if (!agentCanManageListings(viewer)) {
    return (
      <div className="p-4 lg:p-0">
        <AgentListingsPaywall />
      </div>
    );
  }

  return (
    <AgentListingsRoute
      title="My listings"
      subtitle="View all your property listings and their review status."
      canCreateListings
    />
  );
}

export function AgentListingsSearchPageClient() {
  const viewer = useAgentViewer();
  const searchParams = useSearchParams();

  if (!agentCanManageListings(viewer)) {
    return <AgentListingsPaywall />;
  }

  return (
    <AgentListingsRoute
      title="Search listings"
      subtitle="Find a listing by title, location, or ID."
      backHref="/agent"
      showSummary={false}
      initialQuery={searchParams.get('q') ?? ''}
    />
  );
}

export function AgentSettingsPageClient() {
  const viewer = useAgentViewer();
  const searchParams = useSearchParams();

  return (
    <AgentSettingsView
      passwordUpdated={searchParams.get('password') === 'updated'}
      profile={{
        fullName: viewer.fullName ?? 'Agent',
        email: viewer.email ?? '—',
        phone: viewer.phone,
        location: formatAgentLocation(viewer.agentState, viewer.agentLga),
        photoUrl: viewer.photoUrl,
      }}
    />
  );
}

export function AgentHelpPageClient() {
  return (
    <div className="min-h-full bg-[#f4f2f7] px-5 pb-6 pt-5 lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0">
      <SupportTicketForm />
    </div>
  );
}

export function AgentSettingsFaqsPageClient() {
  return <AgentSettingsFaqsPanel />;
}

export function AgentSettingsResetPasswordPageClient() {
  const viewer = useAgentViewer();
  if (!viewer.email) return null;
  return <AgentSettingsResetPasswordOtpForm email={viewer.email} />;
}

export function AgentSettingsResetPasswordNewPageClient() {
  return <AgentSettingsResetPasswordNewForm />;
}
