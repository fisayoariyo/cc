import { redirect } from 'next/navigation';
import { PlusCircle } from 'lucide-react';
import { DesktopServiceShell } from '@/components/dashboard/DesktopServiceShell';
import { requireClientDashboardAccess } from '@/lib/supabase/dashboard-access';
import { getUnreadNotificationsCount } from '@/lib/supabase/data';
import {
  travelMobileNavItems,
  travelSidebarNavItems,
} from '@/lib/dashboard/travel-dashboard-nav';

export default async function TravelDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await requireClientDashboardAccess({
    service: 'travel',
    loginNext: '/travel/dashboard',
  });
  const unreadUpdatesCount = await getUnreadNotificationsCount(viewer.userId);

  return (
    <DesktopServiceShell
      subtitle="Manage travel applications and track updates."
      fullName={viewer.fullName ?? viewer.email}
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
