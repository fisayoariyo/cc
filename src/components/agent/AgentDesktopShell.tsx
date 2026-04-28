'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Building2, ChevronDown, Headset, Home, Plus } from 'lucide-react';
import { cn } from '@/components/ui/utils';
import Image from 'next/image';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';
import { AgentMobileBottomNav } from '@/components/agent/AgentMobileBottomNav';
import { DashboardInteractionFeedback } from '@/components/dashboard/DashboardInteractionFeedback';

const NAV_LINKS = [
  { key: 'dashboard', label: 'Dashboard', icon: Home, href: '/agent' },
  { key: 'listings', label: 'Listings', icon: Building2, href: '/agent/listings/new' },
  { key: 'support', label: 'Help & Support', icon: Headset, href: '/agent/help' },
] as const;

function activeKey(pathname: string) {
  if (pathname === '/agent') return 'dashboard';
  if (pathname.startsWith('/agent/listings')) return 'listings';
  if (pathname.startsWith('/agent/help')) return 'support';
  return 'support';
}

export default function AgentDesktopShell({
  fullName,
  children,
}: {
  fullName?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const active = activeKey(pathname);
  const mobileHeading =
    active === 'dashboard'
      ? { title: `Welcome, Agent ${fullName || ''}`.trim(), subtitle: 'Ready to manage listings and track activities' }
      : active === 'listings'
        ? { title: 'Manage listings', subtitle: 'Create or edit your property listings quickly' }
        : { title: 'Settings & support', subtitle: 'Find account help and support options' };

  useEffect(() => {
    router.prefetch('/agent');
    router.prefetch('/agent/listings/new');
    router.prefetch('/agent/help');
    router.prefetch('/agent/under-review');
  }, [router]);

  if (pathname.startsWith('/agent/under-review') || pathname.startsWith('/agent/help')) {
    return <>{children}</>;
  }

  return (
    <DashboardInteractionFeedback>
      <div className="min-h-screen bg-muted/30 p-3 lg:hidden">
        <div className="min-h-[calc(100vh-1.5rem)] rounded-[20px] bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <header className="rounded-[20px] bg-[#03624D] px-4 py-4 text-white">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold">{mobileHeading.title}</h1>
                <p className="mt-1 text-xs text-white/85">{mobileHeading.subtitle}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">
                Online
                <ChevronDown size={10} strokeWidth={2.4} />
              </span>
            </div>
            <Link
              href="/agent/listings/new"
              className="mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-white px-3 text-xs font-semibold text-[#03624D]"
            >
              <Plus size={15} strokeWidth={2.5} />
              Submit new listing
            </Link>
          </header>

          <main className="mt-3 min-h-[calc(100vh-220px)] rounded-[20px] bg-[#F6F6F6] px-3 py-3 pb-24">
            {children}
          </main>
        </div>
      </div>

      <AgentMobileBottomNav />

      <div className="hidden min-h-screen bg-muted/30 p-3 sm:p-4 lg:block">
        <div className="min-h-[calc(100vh-1.5rem)] rounded-[20px] bg-white p-3 sm:p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <div className="grid h-full gap-[10px] lg:grid-cols-[295px_minmax(0,1fr)]">
            <aside className="rounded-[20px] bg-white px-[20px] py-[24px] lg:px-[24px] lg:py-[28px]">
            <Image src={logoLockupColor} alt="Charis Consult" className="mb-[44px] h-[34px] w-auto object-contain" />

              <nav className="space-y-2">
                {NAV_LINKS.map((item) => {
                  const activeItem = active === item.key;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      prefetch
                      className={cn(
                        'flex h-[45px] w-full items-center gap-[10px] rounded-[10px] px-[14px] text-[15px] leading-[18px] font-normal transition-colors',
                        activeItem
                          ? 'bg-[#03624D] text-white shadow-[0_6px_14px_rgba(3,98,77,0.18)]'
                          : 'text-[#030F0F]/80 hover:bg-[#03624D]/10 hover:text-[#03624D]',
                      )}
                    >
                      <item.icon
                        size={20}
                        strokeWidth={activeItem ? 2.1 : 1.9}
                        className={activeItem ? 'text-white' : 'text-[#030F0F]'}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-8 rounded-xl border border-border bg-muted/30 px-3 py-2">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="text-sm font-medium text-foreground truncate">{fullName || 'Agent'}</p>
              </div>
            </aside>

            <section className="min-w-0 flex min-h-0 flex-col gap-[14px]">
              <header className="flex min-h-[95px] items-center justify-between rounded-[20px] border border-border/60 bg-white px-[20px] py-[14px] lg:px-[26px]">
                <div className="flex items-center gap-4">
                  <div className="min-w-0">
                    <h1 className="truncate text-[20px] font-bold leading-6 text-foreground">
                      Welcome, Agent {fullName || ''}
                    </h1>
                    <p className="mt-2 text-[15px] font-light leading-[18px] text-muted-foreground">
                      Ready to manage listings and track activities
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-[50px] bg-[#03624D] px-[10px] py-1.5 text-[12px] font-bold text-white">
                    Online
                    <ChevronDown size={10} strokeWidth={2.4} />
                  </span>
                </div>

                <Link
                  href="/agent/listings/new"
                  className="inline-flex h-[47px] shrink-0 items-center justify-center gap-2 rounded-[15px] bg-[#03624D] px-[20px] text-[15px] font-medium text-white"
                >
                  <Plus size={17} strokeWidth={2.5} />
                  New listing
                </Link>
              </header>

              <div className="min-h-0 w-full flex-1 overflow-hidden rounded-[20px] bg-[#F6F6F6] px-4 py-4 lg:px-6 lg:py-5">
                <div className="h-full w-full overflow-y-auto pr-1">{children}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </DashboardInteractionFeedback>
  );
}
