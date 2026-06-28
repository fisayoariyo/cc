'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';
import { RouteTransitionFeedback } from '@/components/route-transition-feedback';
import { DashboardMobileBottomNav } from '@/components/dashboard/DashboardMobileBottomNav';
import { DashboardShellHeader } from '@/components/dashboard/dashboard-shell-header';
import { DashboardSidebarLink } from '@/components/dashboard/dashboard-sidebar-link';
import { isNavItemActive, type DashboardNavItem } from '@/components/dashboard/dashboard-nav';
import { dashboardMainBottomPaddingClassName } from '@/components/dashboard/DashboardMobileBottomNav';
import { SidebarAccountMenu } from '@/components/dashboard/SidebarAccountMenu';
import { cn } from '@/components/ui/utils';

export function DesktopServiceShell({
  subtitle,
  fullName,
  navItems,
  mobileNavItems,
  primaryActionHref,
  primaryActionLabel,
  mobilePrimaryActionLabel,
  primaryActionIcon,
  accountFallbackLabel = 'Client',
  welcomeTitle,
  mobileWelcomeTitle,
  mobileSubtitle,
  accountSlot,
  hideMobileHeader = false,
  floatingMobileNav = false,
  children,
}: {
  subtitle: string;
  fullName?: string | null;
  navItems: DashboardNavItem[];
  mobileNavItems?: DashboardNavItem[];
  primaryActionHref: string;
  primaryActionLabel: string;
  mobilePrimaryActionLabel?: string;
  primaryActionIcon?: React.ComponentType<{ size?: string | number; className?: string }>;
  accountFallbackLabel?: string;
  welcomeTitle?: string;
  mobileWelcomeTitle?: string;
  mobileSubtitle?: string;
  accountSlot?: React.ReactNode;
  hideMobileHeader?: boolean;
  floatingMobileNav?: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const resolvedWelcomeTitle = welcomeTitle ?? `Welcome, ${fullName || accountFallbackLabel}`;
  const resolvedMobileTitle = mobileWelcomeTitle ?? resolvedWelcomeTitle;
  const resolvedMobileSubtitle = mobileSubtitle ?? subtitle;
  const bottomNavItems = (mobileNavItems ?? navItems).map((item) => ({
    href: item.href,
    label: item.label,
    icon: item.icon ?? LayoutDashboard,
    badge: item.badge,
    match: item.match ?? ((currentPath: string) => isNavItemActive(currentPath, item)),
  }));

  return (
    <RouteTransitionFeedback themeScope="app">
      <div className="flex min-h-screen flex-col lg:hidden">
        {hideMobileHeader ? null : (
          <header className="shrink-0 border-b border-border/60 bg-white px-4 py-4">
            <DashboardShellHeader
              title={resolvedMobileTitle}
              subtitle={resolvedMobileSubtitle}
              primaryActionHref={primaryActionHref}
              primaryActionLabel={mobilePrimaryActionLabel ?? primaryActionLabel}
              primaryActionIcon={primaryActionIcon}
              compact
            />
          </header>
        )}

        <main
          className={cn(
            'flex-1 overflow-y-auto bg-[#fbfafc]',
            hideMobileHeader ? 'p-0' : 'p-4',
            dashboardMainBottomPaddingClassName(floatingMobileNav),
          )}
        >
          {children}
        </main>
      </div>

      <DashboardMobileBottomNav items={bottomNavItems} floating={floatingMobileNav} />

      <div className="hidden h-screen overflow-hidden bg-white lg:block">
        <div className="grid h-screen lg:grid-cols-[295px_minmax(0,1fr)]">
          <aside className="overflow-y-auto border-r border-border/60 bg-white px-4 py-5">
            <div className="mb-8 px-2">
              <Image src={logoLockupColor} alt="Charis Consult" className="h-11 w-auto object-contain" priority />
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <DashboardSidebarLink
                  key={item.href}
                  item={item}
                  active={isNavItemActive(pathname, item)}
                />
              ))}
            </nav>

            {accountSlot ?? (
              <SidebarAccountMenu fullName={fullName} fallbackLabel={accountFallbackLabel} />
            )}
          </aside>

          <section className="flex h-full min-h-0 min-w-0 flex-col">
            <header className="shrink-0 border-b border-border/60 bg-white px-6 py-5">
              <DashboardShellHeader
                title={resolvedWelcomeTitle}
                subtitle={subtitle}
                primaryActionHref={primaryActionHref}
                primaryActionLabel={primaryActionLabel}
                primaryActionIcon={primaryActionIcon}
              />
            </header>

            <main className="w-full min-w-0 flex-1 overflow-y-auto bg-[#fbfafc] p-4 sm:p-6 lg:p-8">{children}</main>
          </section>
        </div>
      </div>
    </RouteTransitionFeedback>
  );
}
