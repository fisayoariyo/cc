import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';

export const metadata: Metadata = {
  title: 'Travel dashboard',
};

export default async function TravelClientDashboardPage() {
  const viewer = await getViewerContext();
  if (!viewer) return null;

  const supabase = await createClient();

  const [appsCountRes, docsCountRes, completedCountRes, noticesCountRes] = await Promise.all([
    supabase.from('travel_applications').select('id', { count: 'exact', head: true }).eq('client_id', viewer.userId),
    supabase.from('application_documents').select('id', { count: 'exact', head: true }).eq('client_id', viewer.userId),
    supabase
      .from('travel_applications')
      .select('id', { count: 'exact', head: true })
      .eq('client_id', viewer.userId)
      .in('current_stage', ['completed', 'approved']),
    supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', viewer.userId),
  ]);
  const applicationsCount = appsCountRes.count ?? 0;
  const docsCount = docsCountRes.count ?? 0;
  const completedCount = completedCountRes.count ?? 0;
  const noticesCount = noticesCountRes.count ?? 0;
  const pendingApplications = Math.max(0, applicationsCount - completedCount);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-600 p-4 text-white shadow-sm">
          <p className="text-xs text-white/85">Applications</p>
          <p className="mt-2 text-3xl font-semibold">{applicationsCount}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-teal-600 p-4 text-white shadow-sm">
          <p className="text-xs text-white/85">Uploaded docs</p>
          <p className="mt-2 text-3xl font-semibold">{docsCount}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-cyan-700 to-cyan-600 p-4 text-white shadow-sm">
          <p className="text-xs text-white/85">Pending stages</p>
          <p className="mt-2 text-3xl font-semibold">{pendingApplications}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Quick links</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
          href="/travel/dashboard/applications"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Manage applications
          </Link>
          <Link
          href="/travel/dashboard/updates"
            className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
          >
            View updates ({noticesCount})
          </Link>
          <Link
          href="/travel/dashboard/profile"
            className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
          >
            Open profile
          </Link>
        </div>
      </section>
    </div>
  );
}
