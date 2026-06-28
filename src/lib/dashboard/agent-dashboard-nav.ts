import { Building2, Headset, Home, Settings } from 'lucide-react';
import type { DashboardNavItem } from '@/components/dashboard/dashboard-nav';

/** Bottom bar on mobile — Dashboard, Listings, Settings only. */
export const AGENT_MOBILE_NAV: DashboardNavItem[] = [
  {
    href: '/agent',
    label: 'Dashboard',
    icon: Home,
    match: (pathname) => pathname === '/agent',
  },
  {
    href: '/agent/listings',
    label: 'Listings',
    icon: Building2,
    match: (pathname) => pathname.startsWith('/agent/listings'),
  },
  {
    href: '/agent/settings',
    label: 'Settings',
    icon: Settings,
    match: (pathname) => pathname.startsWith('/agent/settings'),
  },
];

export const AGENT_DASHBOARD_NAV: DashboardNavItem[] = [
  {
    href: '/agent',
    label: 'Dashboard',
    icon: Home,
    match: (pathname) => pathname === '/agent',
  },
  {
    href: '/agent/listings',
    label: 'Listings',
    icon: Building2,
    match: (pathname) => pathname.startsWith('/agent/listings'),
  },
  {
    href: '/agent/settings',
    label: 'Settings',
    icon: Settings,
    match: (pathname) => pathname.startsWith('/agent/settings'),
  },
  {
    href: '/agent/help',
    label: 'Help & Support',
    icon: Headset,
    match: (pathname) => pathname.startsWith('/agent/help'),
  },
];

export function agentMobileHeading(pathname: string, fullName?: string | null) {
  if (pathname.startsWith('/agent/listings')) {
    return {
      title: 'Listings',
      subtitle: 'Create and manage your property listings.',
    };
  }

  if (pathname.startsWith('/agent/settings/reset-password')) {
    return {
      title: 'Settings',
      subtitle: 'Reset your account password securely.',
    };
  }

  if (pathname.startsWith('/agent/settings/faqs')) {
    return {
      title: 'Settings',
      subtitle: 'Quick answers to common agent questions.',
    };
  }

  if (pathname.startsWith('/agent/settings')) {
    return {
      title: 'Settings',
      subtitle: 'Manage your account and security preferences.',
    };
  }

  if (pathname.startsWith('/agent/help')) {
    return {
      title: 'Help & Support',
      subtitle: 'Submit a ticket and reach the Charis Consult support team.',
    };
  }

  return {
    title: `Welcome, Agent ${fullName || ''}`.trim(),
    subtitle: 'Track listings, sales, and account updates.',
  };
}

export function agentHidesMobileHeader(pathname: string) {
  if (pathname === '/agent') return true;
  if (pathname === '/agent/listings') return true;
  if (pathname === '/agent/listings/search') return true;
  if (pathname.startsWith('/agent/settings')) return true;
  if (pathname === '/agent/help') return true;
  if (pathname === '/agent/listings/new') return false;
  if (pathname.endsWith('/edit')) return false;
  return /^\/agent\/listings\/[^/]+$/.test(pathname);
}
