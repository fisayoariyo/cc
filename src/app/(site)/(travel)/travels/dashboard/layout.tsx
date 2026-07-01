import { TravelDashboardShell } from '@/components/dashboard/travel-dashboard-shell';
import { requireClientDashboardAccess } from '@/lib/supabase/dashboard-access';
import { getUnreadNotificationsCount } from '@/lib/supabase/data';

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
    <TravelDashboardShell fullName={viewer.fullName ?? viewer.email} unreadUpdatesCount={unreadUpdatesCount}>
      {children}
    </TravelDashboardShell>
  );
}
