'use client';

import Image from 'next/image';
import Link from 'next/link';
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
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';
import { DashboardInteractionFeedback } from '@/components/dashboard/DashboardInteractionFeedback';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/listings', label: 'Listings', icon: Building2 },
  { href: '/admin/agents', label: 'Agents', icon: Users },
  { href: '/admin/travel-applications', label: 'Travel', icon: Plane },
  { href: '/admin/construction-projects', label: 'Construction', icon: Hammer },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
] as const;

function NavContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="mb-8 px-2">
        <Image src={logoLockupColor} alt="Charis Consult" className="h-11 w-auto object-contain" priority />
      </div>

      <nav className="space-y-2">
        {NAV_ITEMS.map((item) => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex h-[46px] items-center gap-2 rounded-[10px] px-3 py-2 text-[15px] transition-colors',
                active
                  ? 'bg-[#4b2e6f] text-white shadow-[0_10px_22px_rgba(75,46,111,0.24)]'
                  : 'text-muted-foreground hover:bg-[#f4f1f7] hover:text-foreground',
              )}
            >
              <item.icon size={16} className={active ? 'text-white' : ''} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-xl border border-border/70 bg-[#fbfafc] px-3 py-3">
        <p className="text-xs text-muted-foreground">Signed in as</p>
        <p className="truncate text-sm font-medium text-foreground">Admin</p>
      </div>

      <Link href="/" className="mt-4 inline-flex text-sm text-muted-foreground hover:text-foreground">
        Back to site
      </Link>
    </>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <DashboardInteractionFeedback>
      <div className="min-h-screen bg-white lg:hidden">
        <header className="border-b border-border/60 bg-white px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <button
                type="button"
                className="rounded-xl border border-border/70 p-2 text-foreground"
                onClick={() => setOpen((value) => !value)}
                aria-label="Toggle menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold text-foreground">Welcome, Admin</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review queues, client updates, and team activity.
                </p>
              </div>
            </div>
            <Badge className="rounded-full bg-[#efe8f7] text-[#4b2e6f] hover:bg-[#efe8f7]">Online</Badge>
          </div>
        </header>

        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-[295px] border-r border-border/70 bg-white px-4 py-5 transition-transform',
            open ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <NavContent pathname={pathname} onNavigate={() => setOpen(false)} />
        </aside>

        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-foreground/20"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <main className="min-h-[calc(100vh-84px)] bg-[#fbfafc] p-4">{children}</main>
      </div>

      <div className="hidden min-h-screen bg-white lg:block">
        <div className="grid min-h-screen lg:grid-cols-[295px_minmax(0,1fr)]">
          <aside className="border-r border-border/60 bg-white px-4 py-5">
            <NavContent pathname={pathname} />
          </aside>

          <div className="min-w-0 min-h-0 flex flex-col">
            <header className="border-b border-border/60 bg-white px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-semibold text-foreground sm:text-[2.1rem]">
                    Welcome, Admin
                  </h1>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    Review queues, client updates, and team activity.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-[#efe8f7] text-[#4b2e6f] hover:bg-[#efe8f7]">
                    Online
                  </Badge>
                  <Link
                    href="/admin/inquiries"
                    className="inline-flex items-center gap-2 rounded-[14px] bg-[#c88a2d] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#b67b25]"
                  >
                    <Inbox size={16} />
                    Open inbox
                  </Link>
                </div>
              </div>
            </header>

            <main className="w-full min-w-0 flex-1 bg-[#fbfafc] p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </DashboardInteractionFeedback>
  );
}
