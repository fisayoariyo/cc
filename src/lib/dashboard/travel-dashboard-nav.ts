import { Bell, CircleHelp, FileText, LayoutDashboard, UserCircle } from 'lucide-react';
import type { DashboardNavItem } from '@/components/dashboard/dashboard-nav';

export const TRAVEL_DASHBOARD_NAV: DashboardNavItem[] = [
  { href: '/travel/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/travel/dashboard/applications', label: 'Applications', icon: FileText },
  {
    href: '/travel/dashboard/updates',
    label: 'Updates',
    icon: Bell,
    match: (pathname) => pathname === '/travel/dashboard/updates',
  },
  { href: '/travel/dashboard/profile', label: 'Profile', icon: UserCircle },
  { href: '/travel/dashboard/help', label: 'Help & support', icon: CircleHelp },
];

export function travelMobileNavItems(unreadUpdatesCount = 0): DashboardNavItem[] {
  return [
    {
      href: '/travel/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      match: (pathname) => pathname === '/travel/dashboard',
    },
    { href: '/travel/dashboard/applications', label: 'Applications', icon: FileText },
    {
      href: '/travel/dashboard/updates',
      label: 'Updates',
      icon: Bell,
      badge: unreadUpdatesCount,
      match: (pathname) => pathname === '/travel/dashboard/updates',
    },
    {
      href: '/travel/dashboard/profile',
      label: 'Profile',
      icon: UserCircle,
      match: (pathname) =>
        pathname.startsWith('/travel/dashboard/profile') || pathname.startsWith('/travel/dashboard/help'),
    },
  ];
}

export function travelSidebarNavItems(unreadUpdatesCount = 0): DashboardNavItem[] {
  return TRAVEL_DASHBOARD_NAV.map((item) =>
    item.href === '/travel/dashboard/updates' ? { ...item, badge: unreadUpdatesCount } : item,
  );
}
