import { CircleHelp, Heart, LayoutDashboard } from 'lucide-react';
import { DesktopServiceShell } from '@/components/dashboard/DesktopServiceShell';
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
    <DesktopServiceShell
      subtitle="Manage favorites, searches, and property updates."
      fullName={viewer.fullName ?? viewer.email}
      navItems={[
        { href: '/real-estate/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/properties', label: 'Browse properties', icon: Heart },
        { href: '/contact', label: 'Help & support', icon: CircleHelp },
      ]}
      primaryActionHref="/properties"
      primaryActionLabel="Browse Properties"
    >
      {children}
    </DesktopServiceShell>
  );
}
