'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Hammer,
  Inbox,
  LayoutDashboard,
  Menu,
  Plane,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/components/ui/utils';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';

const nav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/listings', label: 'Listings', icon: Building2 },
  { href: '/admin/agents', label: 'Agents', icon: Users },
  { href: '/admin/travel-applications', label: 'Travel', icon: Plane },
  { href: '/admin/construction-projects', label: 'Construction', icon: Hammer },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card transform transition-transform lg:translate-x-0 lg:static',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-20 items-center border-b border-border px-5">
          <Link href="/admin" className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <Image src={logoLockupColor} alt="DotCharis Consult" className="h-12 w-auto" />
            <span className="text-sm text-muted-foreground">Admin</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {nav.map((item) => {
            const active =
              item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/12 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-4 lg:px-8">
          <button
            type="button"
            className="lg:hidden p-2 rounded-md border border-border"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="text-sm text-muted-foreground">
            Signed in as <span className="text-foreground font-medium">Admin</span> (demo)
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
