import { CalendarCheck, CircleHelp, FolderKanban, LayoutDashboard } from 'lucide-react';
import { DesktopServiceShell } from '@/components/dashboard/DesktopServiceShell';
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
    <DesktopServiceShell
      subtitle="Track construction requests, consultation, BOQ, and project milestones."
      fullName={viewer.fullName ?? viewer.email}
      navItems={[
        { href: '/real-estate/construction/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        {
          href: '/real-estate/construction/dashboard#projects',
          label: 'Projects',
          icon: FolderKanban,
          match: (pathname) => pathname === '/real-estate/construction/dashboard',
        },
        { href: '/real-estate/construction', label: 'Construction page', icon: CalendarCheck },
        { href: '/contact', label: 'Help & support', icon: CircleHelp },
      ]}
      primaryActionHref="/real-estate/construction"
      primaryActionLabel="Start Project"
    >
      {children}
    </DesktopServiceShell>
  );
}
