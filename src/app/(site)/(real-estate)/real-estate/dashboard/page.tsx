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
    <div className="space-y-8">
      <section className="max-w-3xl space-y-2">
        <h2 className="text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3rem]">
          Real estate dashboard
        </h2>
        <p className="text-[15px] leading-7 text-muted-foreground">
          Welcome back{viewer.fullName ? `, ${viewer.fullName}` : ''}. Keep saved searches, favorites, and property comparisons close by.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Saved searches', value: searches.length },
          { label: 'Favorites', value: favorites.length },
          { label: 'Compare list', value: compare.length },
        ].map((item, index) => (
          <div
            key={item.label}
            className={`rounded-2xl p-4 text-white shadow-sm ${
              index === 0
                ? 'bg-gradient-to-br from-[#2f1b49] to-[#4b2e6f]'
                : index === 1
                  ? 'bg-gradient-to-br from-[#3a2358] to-[#593881]'
                  : 'bg-gradient-to-br from-[#442963] to-[#6a4698]'
            }`}
          >
            <p className="text-sm text-white/80">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_340px]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-[1.6rem] font-semibold tracking-[-0.03em] text-foreground">Quick actions</h3>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Jump back into property discovery without digging through the site navigation.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/properties"
                className="rounded-full bg-[#c88a2d] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#b67b25]"
              >
                Browse properties
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-foreground">
              Recent saved searches
            </h3>
            {searches.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No saved searches yet. Save one from the properties page.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {searches.slice(0, 6).map((search) => (
                  <li
                    key={search.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/70 bg-[#fbfafc] px-4 py-3"
                  >
                    <span className="text-[15px] font-medium text-foreground">{search.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(search.created_at).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-foreground">Recent updates</h3>
          {notices.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {notices.map((notice) => (
                <li key={notice.id} className="rounded-2xl border border-border/70 bg-[#fbfafc] p-4">
                  <p className="text-[15px] font-medium text-foreground">{notice.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{notice.body}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
