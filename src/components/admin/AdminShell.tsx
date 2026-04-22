'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
import { useEffect, useState } from 'react';
import { cn } from '@/components/ui/utils';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';
import { DashboardInteractionFeedback } from '@/components/dashboard/DashboardInteractionFeedback';

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
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    nav.forEach((item) => router.prefetch(item.href));
  }, [router]);

  return (
    <DashboardInteractionFeedback>
      <div className="min-h-screen bg-muted/30 p-3 sm:p-4">
        <div className="min-h-[calc(100vh-1.5rem)] rounded-[20px] bg-white p-3 sm:p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <div className="grid h-full gap-[10px] lg:grid-cols-[295px_minmax(0,1fr)]">
      <aside
        className={cn(
              'fixed inset-y-0 left-0 z-40 w-[295px] rounded-[20px] bg-white px-[20px] py-[24px] transform transition-transform lg:translate-x-0 lg:static lg:px-[24px] lg:py-[28px]',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
            <div className="mb-[44px]">
              <Link href="/admin" className="flex items-center gap-3 text-lg font-semibold text-foreground">
                <Image src={logoLockupColor} alt="DotCharis Consult" className="h-[34px] w-auto object-contain" />
              </Link>
            </div>
            <nav className="space-y-2">
              {nav.map((item) => {
                const active =
                  item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    onClick={() => setOpen(false)}
                    className={cn(
                      'flex h-[45px] w-full items-center gap-[10px] rounded-[10px] px-[14px] text-[15px] leading-[18px] font-normal transition-colors',
                      active
                        ? 'bg-[#03624D] text-white shadow-[0_6px_14px_rgba(3,98,77,0.18)]'
                        : 'text-[#030F0F]/80 hover:bg-[#03624D]/10 hover:text-[#03624D]',
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-8 rounded-xl border border-border bg-muted/30 px-3 py-2">
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <p className="text-sm font-medium text-foreground truncate">Admin</p>
            </div>
            <div className="absolute bottom-5 left-6 right-6">
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

          <div className="min-w-0 flex min-h-0 flex-col gap-[14px]">
            <header className="flex min-h-[95px] items-center justify-between rounded-[20px] border border-border/60 bg-white px-[20px] py-[14px] lg:px-[26px]">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="lg:hidden p-2 rounded-md border border-border"
                  onClick={() => setOpen(!open)}
                  aria-label="Toggle menu"
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
                <div className="text-sm text-muted-foreground">
                  Signed in as <span className="text-foreground font-medium">Admin</span>
                </div>
              </div>
            </header>
            <main className="min-h-0 w-full flex-1 overflow-hidden rounded-[20px] bg-[#F6F6F6] p-4 lg:p-6">
              <div className="h-full w-full overflow-y-auto pr-1">{children}</div>
            </main>
          </div>
        </div>
      </div>
      </div>
    </DashboardInteractionFeedback>
  );
}
