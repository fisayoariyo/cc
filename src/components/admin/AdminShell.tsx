'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  AlertCircle,
  Building2,
  Hammer,
  Images,
  Inbox,
  LayoutDashboard,
  Plane,
  Users,
} from 'lucide-react';
import logoLockupColor from '@/assets/CC Logo Lockup (color).svg';
import { DashboardInteractionFeedback } from '@/components/dashboard/DashboardInteractionFeedback';
import { DashboardShellHeader } from '@/components/dashboard/dashboard-shell-header';
import { DashboardSidebarAccountMenu } from '@/components/dashboard/dashboard-sidebar-account-menu';
import { DashboardSidebarLink } from '@/components/dashboard/dashboard-sidebar-link';
import { isNavItemActive, type DashboardNavItem } from '@/components/dashboard/dashboard-nav';

const ALL_NAV_ITEMS: DashboardNavItem[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/travel-applications', label: 'Travel', icon: Plane },
  { href: '/admin/construction-projects', label: 'Construction', icon: Hammer },
  { href: '/admin/listings', label: 'Agent Management', icon: Building2 },
  { href: '/admin/agents', label: 'Agent Verification', icon: Users },
  { href: '/admin/success-stories', label: 'Success Stories', icon: Images },
  { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox },
  { href: '/admin/reported-issues', label: 'Reported Issues', icon: AlertCircle },
];

function AdminSidebar({
  pathname,
  fullName,
  photoUrl,
  onNavigate,
}: {
  pathname: string;
  fullName?: string | null;
  photoUrl?: string | null;
  onNavigate?: () => void;
}) {
  return (
    <>
      <div className="mb-8 px-2">
        <Image src={logoLockupColor} alt="Charis Consult" className="h-11 w-auto object-contain" priority />
      </div>

      <nav className="space-y-2">
        {ALL_NAV_ITEMS.map((item) => (
          <DashboardSidebarLink
            key={item.href}
            item={item}
            active={isNavItemActive(pathname, item)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <DashboardSidebarAccountMenu
        fullName={fullName}
        photoUrl={photoUrl}
        fallbackLabel="Admin"
        logoutHref="/admin/login"
        logoutDescription="Are you sure you want to log out? You will need to sign in again to access the admin dashboard."
      />

      <Link href="/" className="mt-4 inline-flex text-sm text-muted-foreground hover:text-foreground">
        Back to site
      </Link>
    </>
  );
}

export default function AdminShell({
  children,
  fullName,
  photoUrl,
}: {
  children: React.ReactNode;
  fullName?: string | null;
  photoUrl?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const displayName = fullName?.trim() || 'Admin';
  const welcomeTitle = displayName === 'Admin' ? 'Welcome, Admin' : `Welcome, ${displayName}`;

  useEffect(() => {
    for (const item of ALL_NAV_ITEMS) {
      router.prefetch(item.href);
    }
    router.prefetch('/admin/listings/new');
    router.prefetch('/admin/success-stories/new');
  }, [router]);

  return (
    <DashboardInteractionFeedback>
      <div className="flex min-h-screen items-center justify-center bg-[#fbfafc] px-6 lg:hidden">
        <div className="max-w-md space-y-3 text-center">
          <p className="text-lg font-medium text-foreground">Admin workspace is desktop-only</p>
          <p className="text-sm text-muted-foreground">
            Open Charis Consult on a desktop browser to review agents, listings, and client queues.
          </p>
          <Link href="/" className="inline-flex text-sm text-[#4b2e6f] hover:underline">
            Back to site
          </Link>
        </div>
      </div>

      <div className="hidden h-screen overflow-hidden bg-[#fbfafc] lg:block">
        <div className="grid h-screen lg:grid-cols-[295px_minmax(0,1fr)]">
          <aside className="overflow-y-auto border-r border-[#ece8f2] bg-white px-4 py-5">
            <AdminSidebar pathname={pathname} fullName={fullName} photoUrl={photoUrl} />
          </aside>

          <div className="flex h-full min-h-0 min-w-0 flex-col">
            <header className="shrink-0 border-b border-[#ece8f2] bg-white px-6 py-5">
              <DashboardShellHeader
                title={welcomeTitle}
                subtitle="Your queues and team tools in one place."
              />
            </header>

            <main className="w-full min-w-0 flex-1 overflow-y-auto bg-[#fbfafc] p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </DashboardInteractionFeedback>
  );
}
