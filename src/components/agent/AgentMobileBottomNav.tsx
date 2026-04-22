'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Home, Settings } from 'lucide-react';

const ITEMS = [
  { href: '/agent', label: 'Dashboard', icon: Home },
  { href: '/agent/listings/new', label: 'Listings', icon: Building2 },
  { href: '/agent/help', label: 'Settings', icon: Settings },
] as const;

function isActive(pathname: string, href: string) {
  if (href === '/agent') return pathname === '/agent';
  if (href === '/agent/listings/new') return pathname.startsWith('/agent/listings');
  return pathname.startsWith('/agent/help');
}

export function AgentMobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-3 z-40 px-4 lg:hidden">
      <div className="mx-auto flex max-w-sm items-center justify-between rounded-2xl border border-border bg-card/95 px-2 py-2 shadow-lg backdrop-blur">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-[86px] flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] ${
                active ? 'bg-[#03624D] text-white' : 'text-muted-foreground'
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

