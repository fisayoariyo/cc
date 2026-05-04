'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, FileText, LayoutDashboard, UserCircle } from 'lucide-react';

const ITEMS = [
  { href: '/travel/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/travel/dashboard/applications', label: 'Applications', icon: FileText },
  { href: '/travel/dashboard/updates', label: 'Updates', icon: Bell },
  { href: '/travel/dashboard/profile', label: 'Profile', icon: UserCircle },
] as const;

export function TravelMobileBottomNav({ unreadUpdatesCount = 0 }: { unreadUpdatesCount?: number }) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-3 z-40 px-4 lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between rounded-2xl border border-border bg-white/95 px-2 py-2 shadow-lg backdrop-blur">
        {ITEMS.map((item) => {
          const active =
      item.href === '/travel/dashboard/profile'
        ? pathname.startsWith('/travel/dashboard/profile') || pathname.startsWith('/travel/dashboard/help')
              : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex min-w-[72px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs ${
                active ? 'bg-[#4b2e6f] text-white' : 'text-muted-foreground'
              }`}
            >
              <item.icon size={16} />
              <span className="truncate">{item.label}</span>
              {item.href === '/travel/dashboard/updates' && unreadUpdatesCount > 0 ? (
                <span
                  className={`absolute right-2 top-1 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    active ? 'bg-white/20 text-white' : 'bg-[#efe8f7] text-[#4b2e6f]'
                  }`}
                >
                  {unreadUpdatesCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
