'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { DesktopServiceShell } from '@/components/dashboard/DesktopServiceShell';
import { AgentListingsProvider } from '@/components/agent/agent-listings-provider';
import {
  AGENT_DASHBOARD_NAV,
  AGENT_MOBILE_NAV,
  agentHidesMobileHeader,
  agentMobileHeading,
} from '@/lib/dashboard/agent-dashboard-nav';

import { AgentSidebarAccountMenu } from '@/components/agent/agent-sidebar-account-menu';

export default function AgentDesktopShell({
  fullName,
  photoUrl,
  onboardingPaid = false,
  children,
}: {
  fullName?: string | null;
  photoUrl?: string | null;
  onboardingPaid?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    for (const item of AGENT_DASHBOARD_NAV) {
      router.prefetch(item.href);
    }
    router.prefetch('/agent/listings/new');
    router.prefetch('/agent/listings/search');
  }, [router]);

  if (pathname.startsWith('/agent/under-review') || pathname.startsWith('/agent/onboarding')) {
    return <>{children}</>;
  }

  const mobileHeading = agentMobileHeading(pathname, fullName);
  const hideMobileHeader = agentHidesMobileHeader(pathname);

  return (
    <DesktopServiceShell
      subtitle="Manage listings, updates, and onboarding in one place."
      fullName={fullName}
      welcomeTitle={`Welcome, Agent ${fullName || ''}`.trim()}
      mobileWelcomeTitle={mobileHeading.title}
      mobileSubtitle={mobileHeading.subtitle}
      navItems={AGENT_DASHBOARD_NAV}
      mobileNavItems={AGENT_MOBILE_NAV}
      hideMobileHeader={hideMobileHeader}
      floatingMobileNav
      primaryActionHref={onboardingPaid ? '/agent/listings/new' : '/agent/listings'}
      primaryActionLabel="New listing"
      accountFallbackLabel="Agent"
      accountSlot={
        <AgentSidebarAccountMenu fullName={fullName} photoUrl={photoUrl} fallbackLabel="Agent" />
      }
    >
      <AgentListingsProvider>{children}</AgentListingsProvider>
    </DesktopServiceShell>
  );
}
