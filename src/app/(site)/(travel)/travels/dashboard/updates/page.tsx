import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getNotificationsForUser } from '@/lib/supabase/data';

export const metadata: Metadata = {
  title: 'Travel updates',
};

export default async function TravelUpdatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const notices = await getNotificationsForUser(user.id, 20);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Recent updates</h1>
        <p className="mt-1 text-sm text-muted-foreground">Notifications and stage updates for your travel requests.</p>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
        {notices.length === 0 ? (
          <p className="text-sm text-muted-foreground">No notifications yet.</p>
        ) : (
          <ul className="space-y-3">
            {notices.map((n) => (
              <li key={n.id} className="rounded-xl border border-border bg-muted/20 p-3">
                <p className="text-sm font-medium text-foreground">{n.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

