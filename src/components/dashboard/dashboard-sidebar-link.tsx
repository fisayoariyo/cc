'use client';

import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import { dashboardSidebarLinkClass, type DashboardNavItem } from '@/components/dashboard/dashboard-nav';
import { cn } from '@/components/ui/utils';

export function DashboardSidebarLink({
  item,
  active,
  onNavigate,
}: {
  item: DashboardNavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const Icon = item.icon ?? LayoutDashboard;

  return (
    <Link
      href={item.href}
      prefetch
      onClick={onNavigate}
      className={cn(
        'flex h-[46px] items-center gap-2 rounded-[10px] px-3 py-2 text-[15px] transition-colors',
        dashboardSidebarLinkClass(active),
      )}
    >
      <Icon size={16} className={active ? 'text-white' : ''} />
      <span>{item.label}</span>
      {item.badge && item.badge > 0 ? (
        <span
          className={cn(
            'ml-auto inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-semibold',
            active ? 'bg-white/20 text-white' : 'bg-[#efe8f7] text-[#4b2e6f]',
          )}
        >
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}
