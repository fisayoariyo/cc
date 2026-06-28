'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { LayoutDashboard, MoreHorizontal, X } from 'lucide-react';
import {
  DashboardMobileBottomNav,
  type DashboardBottomNavItem,
} from '@/components/dashboard/DashboardMobileBottomNav';
import { DashboardSidebarLink } from '@/components/dashboard/dashboard-sidebar-link';
import { isNavItemActive, type DashboardNavItem } from '@/components/dashboard/dashboard-nav';

type DashboardMobileBottomNavMoreProps = {
  primaryItems: DashboardNavItem[];
  overflowItems: DashboardNavItem[];
  overflowTitle?: string;
  extraLinks?: Array<{ href: string; label: string }>;
};

export function DashboardMobileBottomNavMore({
  primaryItems,
  overflowItems,
  overflowTitle = 'More tools',
  extraLinks = [],
}: DashboardMobileBottomNavMoreProps) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const overflowActive = overflowItems.some((item) => isNavItemActive(pathname, item));

  const bottomNavItems: DashboardBottomNavItem[] = [
    ...primaryItems.map((item) => ({
      href: item.href,
      label: item.label,
      icon: item.icon ?? LayoutDashboard,
      badge: item.badge,
      match: item.match ?? ((currentPath: string) => isNavItemActive(currentPath, item)),
    })),
    {
      href: '#more',
      label: 'More',
      icon: MoreHorizontal,
      match: () => overflowActive,
    },
  ];

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 flex h-[72px] items-stretch justify-around border-t border-border/70 bg-white/96 px-1 backdrop-blur-md lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label="Dashboard navigation"
      >
        {bottomNavItems.map((item) => {
          const active = item.match ? item.match(pathname) : false;
          const Icon = item.icon;

          if (item.href === '#more') {
            return (
              <button
                key="more"
                type="button"
                onClick={() => setMoreOpen(true)}
                className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium transition-colors ${
                  active || moreOpen ? 'text-[#4b2e6f]' : 'text-muted-foreground'
                }`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                    active || moreOpen ? 'bg-[#4b2e6f] text-white' : 'bg-transparent'
                  }`}
                >
                  <Icon size={18} />
                </span>
                <span className="max-w-full truncate leading-none">More</span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium transition-colors ${
                active ? 'text-[#4b2e6f]' : 'text-muted-foreground'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                  active ? 'bg-[#4b2e6f] text-white' : 'bg-transparent'
                }`}
              >
                <Icon size={18} className={active ? 'text-white' : undefined} />
              </span>
              <span className="max-w-full truncate leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {moreOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-[60] bg-foreground/20 lg:hidden"
            aria-label="Close more menu"
            onClick={() => setMoreOpen(false)}
          />
          <aside className="fixed inset-x-0 bottom-[calc(72px+env(safe-area-inset-bottom,0px))] z-[70] rounded-t-2xl border border-border/70 bg-white px-4 py-5 shadow-2xl lg:hidden">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">{overflowTitle}</p>
              <button
                type="button"
                className="rounded-lg border border-border/70 p-2"
                aria-label="Close more menu"
                onClick={() => setMoreOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="space-y-2">
              {overflowItems.map((item) => (
                <DashboardSidebarLink
                  key={item.href}
                  item={item}
                  active={isNavItemActive(pathname, item)}
                  onNavigate={() => setMoreOpen(false)}
                />
              ))}
              {extraLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMoreOpen(false)}
                  className="flex h-[46px] items-center rounded-[10px] px-3 py-2 text-[15px] text-muted-foreground hover:bg-[#f4f1f7] hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      ) : null}
    </>
  );
}
