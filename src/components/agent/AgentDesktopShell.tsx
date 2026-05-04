'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Headset, Home, Plus } from 'lucide-react';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';
import { AgentMobileBottomNav } from '@/components/agent/AgentMobileBottomNav';
import { DashboardInteractionFeedback } from '@/components/dashboard/DashboardInteractionFeedback';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

const NAV_LINKS = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: '/agent' },
  { key: 'listings', label: 'Listings', icon: Building2, href: '/agent/listings/new' },
  { key: 'support', label: 'Help & Support', icon: Headset, href: '/agent/help' },
] as const;

function activeKey(pathname: string) {
  if (pathname === '/agent') return 'dashboard';
  if (pathname.startsWith('/agent/listings')) return 'listings';
  if (pathname.startsWith('/agent/help')) return 'support';
  return 'dashboard';
}

export default function AgentDesktopShell({
  fullName,
  children,
}: {
  fullName?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = activeKey(pathname);
  const mobileHeading =
    active === 'dashboard'
      ? { title: `Welcome, Agent ${fullName || ''}`.trim(), subtitle: 'Manage listings, updates, and onboarding in one place.' }
      : active === 'listings'
        ? { title: 'Manage listings', subtitle: 'Create new listings and follow review status.' }
        : { title: 'Help & support', subtitle: 'Get support, answers, and account guidance.' };

  if (pathname.startsWith('/agent/under-review')) {
    return <>{children}</>;
  }

  return (
    <DashboardInteractionFeedback>
      <div className="min-h-screen bg-white lg:hidden">
        <header className="border-b border-border/60 bg-white px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold text-foreground">{mobileHeading.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{mobileHeading.subtitle}</p>
            </div>
            <Badge className="rounded-full bg-[#efe8f7] text-[#4b2e6f] hover:bg-[#efe8f7]">Online</Badge>
          </div>
          <Link
            href="/agent/listings/new"
            className="mt-4 inline-flex items-center gap-2 rounded-[12px] bg-[#c88a2d] px-3 py-2 text-sm font-medium text-white hover:bg-[#b67b25]"
          >
            <Plus size={14} strokeWidth={2.4} />
            New listing
          </Link>
        </header>

        <main className="min-h-[calc(100vh-84px)] bg-[#fbfafc] p-4 pb-24">{children}</main>
      </div>

      <AgentMobileBottomNav />

      <div className="hidden min-h-screen bg-white lg:block">
        <div className="grid min-h-screen lg:grid-cols-[295px_minmax(0,1fr)]">
          <aside className="border-r border-border/60 bg-white px-4 py-5">
            <div className="mb-8 px-2">
              <Image src={logoLockupColor} alt="Charis Consult" className="h-11 w-auto object-contain" priority />
            </div>

            <nav className="space-y-2">
              {NAV_LINKS.map((item) => {
                const activeItem = active === item.key;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      'flex h-[46px] items-center gap-2 rounded-[10px] px-3 py-2 text-[15px] transition-colors',
                      activeItem
                        ? 'bg-[#4b2e6f] text-white shadow-[0_10px_22px_rgba(75,46,111,0.24)]'
                        : 'text-muted-foreground hover:bg-[#f4f1f7] hover:text-foreground',
                    )}
                  >
                    <item.icon size={16} className={activeItem ? 'text-white' : ''} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 rounded-xl border border-border/70 bg-[#fbfafc] px-3 py-3">
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <p className="truncate text-sm font-medium text-foreground">{fullName || 'Agent'}</p>
            </div>
          </aside>

          <section className="min-w-0 min-h-0 flex flex-col">
            <header className="border-b border-border/60 bg-white px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-semibold text-foreground sm:text-[2.1rem]">
                    Welcome, Agent {fullName || ''}
                  </h1>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    Manage listings, updates, and onboarding in one place.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-[#efe8f7] text-[#4b2e6f] hover:bg-[#efe8f7]">Online</Badge>
                  <Link
                    href="/agent/listings/new"
                    className="inline-flex items-center gap-2 rounded-[14px] bg-[#c88a2d] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#b67b25]"
                  >
                    <Plus size={16} strokeWidth={2.4} />
                    New listing
                  </Link>
                </div>
              </div>
            </header>

            <main className="w-full min-w-0 flex-1 bg-[#fbfafc] p-4 sm:p-6 lg:p-8">{children}</main>
          </section>
        </div>
      </div>
    </DashboardInteractionFeedback>
  );
}
