import { redirect } from 'next/navigation';
import { DesktopServiceShell } from '@/components/dashboard/DesktopServiceShell';
import { getViewerContext, hasClientService } from '@/lib/supabase/dashboard-access';

export default async function RealEstateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewerContext();
  if (!viewer) redirect('/login?next=/real-estate/dashboard');
  const service = await hasClientService(viewer.userId, 'real_estate');
  if (viewer.role === 'admin') redirect('/admin');
  if (viewer.role === 'agent') redirect('/agent');
  if (!service) redirect('/dashboard');

  return (
    <DesktopServiceShell
      subtitle="Manage favorites, searches, and property updates."
      fullName={viewer.fullName ?? viewer.email}
      navItems={[
        { href: '/real-estate/dashboard', label: 'Dashboard' },
  { href: '/properties', label: 'Browse properties' },
        { href: '/contact', label: 'Help & support' },
      ]}
      primaryActionHref="/properties"
      primaryActionLabel="Browse Properties"
    >
      {children}
    </DesktopServiceShell>
  );
}
