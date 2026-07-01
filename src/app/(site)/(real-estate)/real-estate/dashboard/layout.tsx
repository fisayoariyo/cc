import { RealEstateDashboardShell } from '@/components/dashboard/real-estate-dashboard-shell';
import { requireClientDashboardAccess } from '@/lib/supabase/dashboard-access';

export default async function RealEstateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await requireClientDashboardAccess({
    service: 'real_estate',
    loginNext: '/real-estate/dashboard',
  });

  return (
    <RealEstateDashboardShell fullName={viewer.fullName ?? viewer.email}>{children}</RealEstateDashboardShell>
  );
}
