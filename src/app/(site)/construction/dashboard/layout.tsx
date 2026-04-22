import { redirect } from 'next/navigation';
import { DesktopServiceShell } from '@/components/dashboard/DesktopServiceShell';
import { getViewerContext, hasClientService } from '@/lib/supabase/dashboard-access';

export default async function ConstructionDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewerContext();
  if (!viewer) redirect('/login?next=/construction/dashboard');
  const service = await hasClientService(viewer.userId, 'construction');
  if (viewer.role === 'admin') redirect('/admin');
  if (viewer.role === 'agent') redirect('/agent');
  if (!service) redirect('/dashboard');

  return (
    <DesktopServiceShell
      subtitle="Track project stages and communication updates."
      fullName={viewer.fullName ?? viewer.email}
      navItems={[
        { href: '/construction/dashboard', label: 'Dashboard' },
        { href: '/contact', label: 'Start new inquiry' },
        { href: '/dashboard', label: 'Switch service' },
        { href: '/contact', label: 'Help & support' },
      ]}
      primaryActionHref="/contact"
      primaryActionLabel="Start Inquiry"
    >
      {children}
    </DesktopServiceShell>
  );
}

