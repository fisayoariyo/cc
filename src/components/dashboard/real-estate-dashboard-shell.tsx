'use client';

import { CircleHelp, Heart, LayoutDashboard } from 'lucide-react';
import { DesktopServiceShell } from '@/components/dashboard/DesktopServiceShell';

export function RealEstateDashboardShell({
  fullName,
  children,
}: {
  fullName?: string | null;
  children: React.ReactNode;
}) {
  return (
    <DesktopServiceShell
      subtitle="Manage favorites, searches, and property updates."
      fullName={fullName}
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
