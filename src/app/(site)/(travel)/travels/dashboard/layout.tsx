import { redirect } from 'next/navigation';
import { TravelDashboardSidebar } from './_components/travel-dashboard-sidebar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { TravelMobileBottomNav } from './_components/travel-mobile-bottom-nav';
import { DashboardInteractionFeedback } from '@/components/dashboard/DashboardInteractionFeedback';
import { getViewerContext, hasClientService } from '@/lib/supabase/dashboard-access';
import { getUnreadNotificationsCount } from '@/lib/supabase/data';

export default async function TravelDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const viewer = await getViewerContext();
  if (!viewer) {
    redirect('/login?next=/travel/dashboard');
  }

  const service = await hasClientService(viewer.userId, 'travel');
  if (viewer.role === 'admin') redirect('/admin');
  if (viewer.role === 'agent') redirect('/agent');
  if (!service) redirect('/dashboard');
  const unreadUpdatesCount = await getUnreadNotificationsCount(viewer.userId);

  return (
    <DashboardInteractionFeedback>
      <div className="min-h-screen bg-white lg:hidden">
        <header className="border-b border-border/60 bg-white px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold text-foreground">Welcome, {viewer.fullName ?? 'Client'}</h1>
              <p className="mt-1 text-sm text-muted-foreground">Manage travel applications and track updates.</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-[#efe8f7] text-[#4b2e6f] hover:bg-[#efe8f7]">Online</Badge>
              <Link
                href="/travel/dashboard"
                className="inline-flex items-center gap-2 rounded-[12px] bg-[#c88a2d] px-3 py-2 text-sm font-medium text-white hover:bg-[#b67b25]"
              >
                <PlusCircle size={14} />
                Start
              </Link>
            </div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-84px)] bg-[#fbfafc] p-4 pb-24">{children}</main>
      </div>

      <TravelMobileBottomNav unreadUpdatesCount={unreadUpdatesCount} />

      <div className="hidden min-h-screen bg-white lg:block">
        <div className="grid min-h-screen lg:grid-cols-[295px_minmax(0,1fr)]">
          <div className="border-r border-border/60 bg-white px-4 py-5">
            <TravelDashboardSidebar
              fullName={viewer.fullName ?? viewer.email}
              unreadUpdatesCount={unreadUpdatesCount}
            />
          </div>
          <div className="min-w-0 min-h-0 flex flex-col">
            <header className="border-b border-border/60 bg-white px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="truncate text-2xl sm:text-[2.1rem] font-semibold text-foreground">
                    Welcome, {viewer.fullName ?? 'Client'}
                  </h1>
                  <p className="mt-1 text-[15px] text-muted-foreground">
                    Ready to manage travel applications and track updates.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-[#efe8f7] text-[#4b2e6f] hover:bg-[#efe8f7]">
                    Online
                  </Badge>
                  <Link
                    href="/travel/dashboard"
                    className="inline-flex items-center gap-2 rounded-[14px] bg-[#c88a2d] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#b67b25]"
                  >
                    <PlusCircle size={16} />
                    Start Application
                  </Link>
                </div>
              </div>
            </header>

            <main className="w-full min-w-0 flex-1 bg-[#fbfafc] p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </DashboardInteractionFeedback>
  );
}
