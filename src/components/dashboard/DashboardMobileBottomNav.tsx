'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/components/ui/utils';

export const DASHBOARD_BOTTOM_NAV_HEIGHT = 72;

export type DashboardBottomNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
  badge?: number;
  match?: (pathname: string) => boolean;
};

function defaultMatch(pathname: string, href: string) {
  const [path] = href.split('#');
  if (path.endsWith('/dashboard') || path === '/admin' || path === '/agent') {
    return pathname === path;
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function dashboardMainBottomPaddingClassName(floating = false) {
  // Full literal class strings so Tailwind's scanner generates them (dynamic
  // template-literal class names are not detected and silently produce no padding,
  // which lets page content slide under the fixed mobile bottom nav).
  return floating
    ? 'pb-[calc(88px+env(safe-area-inset-bottom,0px))]'
    : 'pb-[calc(72px+env(safe-area-inset-bottom,0px))]';
}

export function DashboardMobileBottomNav({
  items,
  floating = false,
}: {
  items: DashboardBottomNavItem[];
  floating?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'fixed z-50 flex h-[72px] items-stretch justify-around px-1 backdrop-blur-md lg:hidden',
        floating
          ? 'inset-x-4 bottom-3 left-1/2 mx-auto w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl border border-[#ece8f2] bg-white/98 shadow-[0_8px_30px_rgba(31,42,36,0.12)]'
          : 'inset-x-0 bottom-0 border-t border-border/70 bg-white/96',
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Dashboard navigation"
    >
      {items.map((item) => {
        const active = item.match ? item.match(pathname) : defaultMatch(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-medium transition-colors',
              active ? 'text-[#4b2e6f]' : 'text-muted-foreground',
            )}
          >
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-xl transition-colors',
                active ? 'bg-[#4b2e6f] text-white' : 'bg-transparent',
              )}
            >
              <Icon size={18} className={active ? 'text-white' : undefined} />
            </span>
            <span className="max-w-full truncate leading-none">{item.label}</span>
            {item.badge && item.badge > 0 ? (
              <span
                className={cn(
                  'absolute right-[calc(50%-22px)] top-1 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                  active ? 'bg-[#efe8f7] text-[#4b2e6f]' : 'bg-[#efe8f7] text-[#4b2e6f]',
                )}
              >
                {item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
