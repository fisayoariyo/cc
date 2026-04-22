'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Plus } from 'lucide-react';
import Image from 'next/image';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';
import { SidebarAccountMenu } from '@/components/dashboard/SidebarAccountMenu';
import { useEffect } from 'react';
import { DashboardInteractionFeedback } from '@/components/dashboard/DashboardInteractionFeedback';

type NavItem = {
  href: string;
  label: string;
};

export function DesktopServiceShell({
  subtitle,
  fullName,
  navItems,
  primaryActionHref,
  primaryActionLabel,
  children,
}: {
  subtitle: string;
  fullName?: string | null;
  navItems: NavItem[];
  primaryActionHref: string;
  primaryActionLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    navItems.forEach((item) => router.prefetch(item.href));
    router.prefetch(primaryActionHref);
  }, [navItems, primaryActionHref, router]);

  return (
    <DashboardInteractionFeedback>
      <div className="min-h-screen bg-muted/30 p-3 sm:p-4">
        <div className="min-h-[calc(100vh-1.5rem)] rounded-[20px] bg-white p-3 sm:p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <div className="grid h-full gap-[10px] lg:grid-cols-[295px_minmax(0,1fr)]">
            <aside className="rounded-[20px] bg-white px-[20px] py-[24px] lg:px-[24px] lg:py-[28px]">
            <div className="mb-[44px]">
              <Image src={logoLockupColor} alt="DotCharis Consult" className="h-11 w-auto object-contain" priority />
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch
                    className={`flex h-[45px] w-full items-center rounded-[10px] px-[14px] text-[15px] leading-[18px] font-normal transition-colors ${
                      active
                        ? 'bg-[#03624D] text-white shadow-[0_6px_14px_rgba(3,98,77,0.18)]'
                        : 'text-[#030F0F]/80 hover:bg-[#03624D]/10 hover:text-[#03624D]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <SidebarAccountMenu fullName={fullName} fallbackLabel="Client" />
            </aside>

            <section className="min-w-0 min-h-0 flex flex-col gap-[14px]">
              <header className="flex min-h-[95px] items-center justify-between rounded-[20px] border border-border/60 bg-white px-[20px] py-[14px] lg:px-[26px]">
                <div className="min-w-0">
                  <h1 className="truncate text-[20px] font-bold leading-6 text-foreground">Welcome, {fullName || 'Client'}</h1>
                  <p className="mt-2 text-[15px] font-light leading-[18px] text-muted-foreground">{subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="inline-flex items-center gap-1 rounded-[50px] bg-[#03624D] px-[10px] py-1.5 text-[12px] font-bold text-white hover:bg-[#03624D]">
                    Online
                    <ChevronDown size={10} strokeWidth={2.4} />
                  </Badge>
                  <Link
                    href={primaryActionHref}
                    prefetch
                    className="inline-flex h-[47px] shrink-0 items-center justify-center gap-2 rounded-[15px] bg-[#03624D] px-[20px] text-[15px] font-medium text-white"
                  >
                    <Plus size={17} strokeWidth={2.5} />
                    {primaryActionLabel}
                  </Link>
                </div>
              </header>
              <main className="w-full min-w-0 min-h-[calc(100vh-210px)] rounded-[20px] bg-[#F6F6F6] p-4 lg:p-6">
                {children}
              </main>
            </section>
          </div>
        </div>
      </div>
    </DashboardInteractionFeedback>
  );
}

