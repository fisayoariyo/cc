import type { ComponentType } from 'react';

export type DashboardNavItem = {
  href: string;
  label: string;
  icon?: ComponentType<{ size?: string | number; className?: string }>;
  badge?: number;
  match?: (pathname: string) => boolean;
};

export function isDashboardNavActive(pathname: string, href: string) {
  const [path] = href.split('#');

  if (path === '/admin') return pathname === '/admin';
  if (path === '/agent') return pathname === '/agent';
  if (path.endsWith('/dashboard')) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }
  if (path === '/properties') {
    return pathname === '/properties' || pathname.startsWith('/properties/');
  }
  if (path === '/contact') return pathname === '/contact';
  if (path === '/real-estate/construction') return pathname === '/real-estate/construction';

  return pathname === path || pathname.startsWith(`${path}/`);
}

export function isNavItemActive(pathname: string, item: DashboardNavItem) {
  return item.match ? item.match(pathname) : isDashboardNavActive(pathname, item.href);
}

export const dashboardSidebarLinkClass = (active: boolean) =>
  active
    ? 'bg-[#4b2e6f] text-white shadow-[0_10px_22px_rgba(75,46,111,0.24)]'
    : 'text-muted-foreground hover:bg-[#f4f1f7] hover:text-foreground';
