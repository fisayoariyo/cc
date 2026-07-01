'use client';

import { PlusCircle } from 'lucide-react';
import { DesktopServiceShell } from '@/components/dashboard/DesktopServiceShell';
import {
  travelMobileNavItems,
  travelSidebarNavItems,
} from '@/lib/dashboard/travel-dashboard-nav';

export function TravelDashboardShell({
  fullName,
  unreadUpdatesCount,
  children,
}: {
  fullName?: string | null;
  unreadUpdatesCount: number;
  children: React.ReactNode;
}) {
  return (
    <DesktopServiceShell
      subtitle="Manage travel applications and track updates."
      fullName={fullName}
      navItems={travelSidebarNavItems(unreadUpdatesCount)}
      mobileNavItems={travelMobileNavItems(unreadUpdatesCount)}
      primaryActionHref="/travel/dashboard"
      primaryActionLabel="Start Application"
      mobilePrimaryActionLabel="Start"
      primaryActionIcon={PlusCircle}
      accountFallbackLabel="Travel Client"
    >
      {children}
    </DesktopServiceShell>
  );
}
