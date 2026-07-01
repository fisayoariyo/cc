import { ConstructionDashboardShell } from '@/components/dashboard/construction-dashboard-shell';
import { requireClientDashboardAccess } from '@/lib/supabase/dashboard-access';

export default async function ConstructionDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await requireClientDashboardAccess({
    service: 'construction',
    loginNext: '/real-estate/construction/dashboard',
  });

  return (
    <ConstructionDashboardShell fullName={viewer.fullName ?? viewer.email}>{children}</ConstructionDashboardShell>
  );
}
