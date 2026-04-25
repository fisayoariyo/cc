import type { Metadata } from 'next';
import Link from 'next/link';
import { getCompareProperties, getFavoriteProperties, getNotificationsForUser, getSavedSearches } from '@/lib/supabase/data';
import { getViewerContext } from '@/lib/supabase/dashboard-access';

export const metadata: Metadata = {
  title: 'Real estate dashboard',
};

export default async function RealEstateDashboardPage() {
  const viewer = await getViewerContext();
  if (!viewer) return null;

  const [favorites, compare, searches, notices] = await Promise.all([
    getFavoriteProperties(viewer.userId),
    getCompareProperties(viewer.userId),
    getSavedSearches(viewer.userId),
    getNotificationsForUser(viewer.userId, 5),
  ]);

  return (
    <div className="w-full space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-foreground">Real estate client dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Welcome back{viewer.fullName ? `, ${viewer.fullName}` : ''}. Manage saved searches, favorites, and
            compare list.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Saved searches', value: searches.length },
            { label: 'Favorites', value: favorites.length },
            { label: 'Compare list', value: compare.length },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="text-2xl font-medium text-foreground">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-medium text-foreground">Quick actions</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/properties" className="rounded-full px-4 py-2 text-sm bg-primary text-primary-foreground">
              Browse properties
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-medium text-foreground mb-3">Recent saved searches</h2>
          {searches.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved searches yet. Save one from the properties page.</p>
          ) : (
            <ul className="space-y-2">
              {searches.slice(0, 6).map((s) => (
                <li key={s.id} className="text-sm text-muted-foreground flex items-center justify-between gap-3">
                  <span className="text-foreground">{s.title}</span>
                  <span>{new Date(s.created_at).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-lg font-medium text-foreground mb-3">Recent updates</h2>
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
    </div>
  );
}
