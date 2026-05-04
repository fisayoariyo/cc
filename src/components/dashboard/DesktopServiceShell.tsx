'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, LayoutDashboard, Plus } from 'lucide-react';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';
import { SidebarAccountMenu } from '@/components/dashboard/SidebarAccountMenu';
import { DashboardInteractionFeedback } from '@/components/dashboard/DashboardInteractionFeedback';

type NavItem = {
  href: string;
  label: string;
  icon?: React.ComponentType<{ size?: string | number; className?: string }>;
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

  return (
    <DashboardInteractionFeedback>
      <div className="min-h-screen bg-white">
        <div className="grid min-h-screen lg:grid-cols-[295px_minmax(0,1fr)]">
          <aside className="border-r border-border/60 bg-white px-4 py-5">
            <div className="mb-8 px-2">
              <Image src={logoLockupColor} alt="Charis Consult" className="h-11 w-auto object-contain" priority />
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon ?? LayoutDashboard;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex h-[46px] items-center gap-2 rounded-[10px] px-3 py-2 text-[15px] transition-colors ${
                      active
                        ? 'bg-[#4b2e6f] text-white shadow-[0_10px_22px_rgba(75,46,111,0.24)]'
                        : 'text-muted-foreground hover:bg-[#f4f1f7] hover:text-foreground'
                    }`}
                  >
                    <Icon size={16} className={active ? 'text-white' : ''} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <SidebarAccountMenu fullName={fullName} fallbackLabel="Client" />
          </aside>

          <section className="min-w-0 min-h-0 flex flex-col">
            <header className="border-b border-border/60 bg-white px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="truncate text-2xl font-semibold text-foreground sm:text-[2.1rem]">
                    Welcome, {fullName || 'Client'}
                  </h1>
                  <p className="mt-1 text-[15px] text-muted-foreground">{subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="inline-flex items-center gap-1 rounded-full bg-[#efe8f7] px-[10px] py-1.5 text-[12px] font-bold text-[#4b2e6f] hover:bg-[#efe8f7]">
                    Online
                    <ChevronDown size={10} strokeWidth={2.4} />
                  </Badge>
                  <Link
                    href={primaryActionHref}
                    className="inline-flex items-center gap-2 rounded-[14px] bg-[#c88a2d] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#b67b25]"
                  >
                    <Plus size={16} strokeWidth={2.4} />
                    {primaryActionLabel}
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
