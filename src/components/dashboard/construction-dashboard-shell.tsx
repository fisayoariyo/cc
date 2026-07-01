'use client';

import { CalendarCheck, CircleHelp, FolderKanban, LayoutDashboard } from 'lucide-react';
import { DesktopServiceShell } from '@/components/dashboard/DesktopServiceShell';

export function ConstructionDashboardShell({
  fullName,
  children,
}: {
  fullName?: string | null;
  children: React.ReactNode;
}) {
  return (
    <DesktopServiceShell
      subtitle="Track construction requests, consultation, BOQ, and project milestones."
      fullName={fullName}
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
