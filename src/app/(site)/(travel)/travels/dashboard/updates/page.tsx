import type { Metadata } from 'next';
import { getNotificationsForUser } from '@/lib/supabase/data';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { Badge } from '@/components/ui/badge';
import { MarkUpdatesRead } from './mark-updates-read';

export const metadata: Metadata = {
  title: 'Travel updates',
};

export default async function TravelUpdatesPage() {
  const viewer = await getViewerContext();
  if (!viewer) return null;

  const notices = await getNotificationsForUser(viewer.userId, 20);
  const hasUnread = notices.some((notice) => !notice.is_read);

  return (
    <div className="space-y-8">
      <MarkUpdatesRead hasUnread={hasUnread} />

      <section className="max-w-3xl space-y-2">
        <h1 className="text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3rem]">Recent updates</h1>
        <p className="text-[15px] leading-7 text-muted-foreground">Notifications and stage updates for your travel requests.</p>
      </section>

      <section>
        {notices.length === 0 ? (
          <p className="text-[15px] text-muted-foreground">No notifications yet.</p>
        ) : (
          <ul className="space-y-3">
            {notices.map((n) => (
              <li key={n.id} className="rounded-[20px] border border-border/70 bg-card p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] font-medium text-foreground">{n.title}</p>
                  {!n.is_read ? <Badge className="bg-[#efe8f7] text-[#4b2e6f] hover:bg-[#efe8f7]">New</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
