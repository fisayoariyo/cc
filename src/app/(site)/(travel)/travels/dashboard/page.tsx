import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getDocumentsForClient, getNotificationsForUser, getTravelApplicationsForClient } from '@/lib/supabase/data';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Travel dashboard',
};

export default async function TravelClientDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, applications, docs, notices] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
    getTravelApplicationsForClient(user.id),
    getDocumentsForClient(user.id),
    getNotificationsForUser(user.id, 5),
  ]);
  const profile = profileRes.data;
  const pendingApplications = applications.filter((a) => !['completed', 'approved'].includes(a.current_stage)).length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium text-foreground">
              Welcome, {profile?.full_name ?? 'Client'}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Overview of your travel workspace. Use the sidebar to move between pages.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="rounded-full bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/10">Online</Badge>
            <Link
              href="/travels/dashboard/applications"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <PlusCircle size={16} />
              Go to applications
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-600 p-4 text-white shadow-sm">
          <p className="text-xs text-white/85">Applications</p>
          <p className="mt-2 text-3xl font-semibold">{applications.length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-teal-700 to-teal-600 p-4 text-white shadow-sm">
          <p className="text-xs text-white/85">Uploaded docs</p>
          <p className="mt-2 text-3xl font-semibold">{docs.length}</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-cyan-700 to-cyan-600 p-4 text-white shadow-sm">
          <p className="text-xs text-white/85">Pending stages</p>
          <p className="mt-2 text-3xl font-semibold">{pendingApplications}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Quick links</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href="/travels/dashboard/applications"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Manage applications
          </Link>
          <Link
            href="/travels/dashboard/updates"
            className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
          >
            View updates ({notices.length})
          </Link>
          <Link
            href="/travels/dashboard/profile"
            className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
          >
            Open profile
          </Link>
        </div>
      </section>
    </div>
  );
}
