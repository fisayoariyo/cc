import type { Metadata } from 'next';
import Link from 'next/link';
import { constructionStageLabel } from '@/lib/construction-stages';
import { getConstructionHistoryByProjectIds, getConstructionProjectsForClient, getNotificationsForUser } from '@/lib/supabase/data';
import { getViewerContext } from '@/lib/supabase/dashboard-access';

export const metadata: Metadata = {
  title: 'Construction dashboard',
};

export default async function ConstructionDashboardPage() {
  const viewer = await getViewerContext();
  if (!viewer) return null;

  const projects = await getConstructionProjectsForClient(viewer.userId);
  const history = await getConstructionHistoryByProjectIds(projects.map((p) => p.id));
  const notices = await getNotificationsForUser(viewer.userId, 5);

  return (
    <div className="w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-foreground">Construction client dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Track your project lifecycle from inquiry to handover.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-medium text-foreground">My construction projects</h2>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects yet. Start from inquiry and admin will assign one here.</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((p) => (
                <li key={p.id} className="rounded-md border border-border p-3">
                  <p className="font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.project_type} - {p.location}
                  </p>
                  <p className="text-xs text-foreground mt-1">Current stage: {constructionStageLabel(p.current_stage)}</p>
                  {history[p.id]?.[0]?.note_to_client ? (
                    <p className="text-xs text-muted-foreground mt-1">Latest note: {history[p.id][0].note_to_client}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-2">
          <h2 className="text-lg font-medium text-foreground">Recent updates</h2>
          {notices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            <ul className="space-y-2">
              {notices.map((n) => (
                <li key={n.id} className="text-sm">
                  <p className="text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/contact" className="rounded-full px-4 py-2 text-sm bg-primary text-primary-foreground">
            Start project inquiry
          </Link>
        </div>
    </div>
  );
}
