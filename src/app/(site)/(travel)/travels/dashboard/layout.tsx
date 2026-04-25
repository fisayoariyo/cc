import { redirect } from 'next/navigation';
import { TravelDashboardSidebar } from './_components/travel-dashboard-sidebar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { TravelMobileBottomNav } from './_components/travel-mobile-bottom-nav';
import { DashboardInteractionFeedback } from '@/components/dashboard/DashboardInteractionFeedback';
import { getViewerContext, hasClientService } from '@/lib/supabase/dashboard-access';

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

  return (
    <DashboardInteractionFeedback>
      <div className="min-h-screen bg-muted/30 p-3 sm:p-4 lg:hidden">
        <div className="min-h-[calc(100vh-1.5rem)] rounded-[20px] bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <header className="rounded-2xl bg-white px-4 py-4 border border-border/60">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold text-foreground">Welcome, {viewer.fullName ?? 'Client'}</h1>
                <p className="mt-1 text-xs text-muted-foreground">Manage travel applications and track updates.</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="rounded-full bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/10">Online</Badge>
                <Link
        href="/travel/dashboard/applications"
                  className="inline-flex items-center gap-2 rounded-[12px] bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <PlusCircle size={14} />
                  New
                </Link>
              </div>
            </div>
          </header>
          <main className="mt-3 min-h-[calc(100vh-210px)] rounded-2xl bg-[#F6F6F6] p-3 pb-24">{children}</main>
        </div>
      </div>

      <TravelMobileBottomNav />

      <div className="hidden min-h-screen bg-muted/30 p-3 sm:p-4 lg:block">
        <div className="min-h-[calc(100vh-1.5rem)] rounded-[20px] bg-white p-3 sm:p-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <div className="grid h-full gap-3 lg:grid-cols-[295px_minmax(0,1fr)]">
            <div className="h-full min-h-0">
              <TravelDashboardSidebar fullName={viewer.fullName ?? viewer.email} />
            </div>
            <div className="min-w-0 min-h-0 flex flex-col gap-3">
              <header className="rounded-2xl bg-white px-4 py-4 sm:px-6 sm:py-5 border border-border/60">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h1 className="truncate text-xl sm:text-2xl font-semibold text-foreground">
                      Welcome, {viewer.fullName ?? 'Client'}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Ready to manage travel applications and track updates.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/10">
                      Online
                    </Badge>
                    <Link
        href="/travel/dashboard/applications"
                      className="inline-flex items-center gap-2 rounded-[14px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      <PlusCircle size={16} />
                      New Application
                    </Link>
                  </div>
                </div>
              </header>

              <main className="w-full min-w-0 min-h-[calc(100vh-210px)] rounded-2xl bg-[#F6F6F6] p-3 sm:p-5 lg:p-6">
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </DashboardInteractionFeedback>
  );
}
