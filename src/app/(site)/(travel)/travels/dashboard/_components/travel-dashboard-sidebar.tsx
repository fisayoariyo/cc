'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, CircleHelp, FileText, LayoutDashboard, UserCircle } from 'lucide-react';

const ITEMS = [
  { href: '/travels/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/travels/dashboard/applications', label: 'Applications', icon: FileText },
  { href: '/travels/dashboard/updates', label: 'Updates', icon: Bell },
  { href: '/travels/dashboard/profile', label: 'Profile', icon: UserCircle },
  { href: '/travels/dashboard/help', label: 'Help & support', icon: CircleHelp },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === '/travels/dashboard') {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

export function TravelDashboardSidebar({ fullName }: { fullName?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="h-full rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-6 px-2">
        <h2 className="text-base font-semibold text-foreground">Travel Workspace</h2>
        <p className="mt-1 text-xs text-muted-foreground">Client dashboard</p>
      </div>

      <nav className="space-y-2">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-xl border border-border bg-muted/30 px-3 py-2">
        <p className="text-xs text-muted-foreground">Signed in as</p>
        <p className="text-sm font-medium text-foreground truncate">{fullName || 'Travel Client'}</p>
      </div>
    </aside>
  );
}

