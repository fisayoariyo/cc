import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BarChart3, Bell, Heart, Search, Scale, Star } from 'lucide-react';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
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

  const metricCards = [
    {
      label: 'Saved Searches',
      value: searches.length,
      helper: 'Reusable property filters',
      icon: Search,
    },
    {
      label: 'Favorites',
      value: favorites.length,
      helper: 'Properties kept for follow-up',
      icon: Heart,
    },
    {
      label: 'Compare List',
      value: compare.length,
      helper: 'Side-by-side shortlist',
      icon: Scale,
    },
  ] as const;

  const activityBars = [
    searches.length,
    favorites.length,
    compare.length,
    notices.length,
    Math.max(1, favorites.length + searches.length),
    Math.max(1, compare.length + notices.length),
  ];
  const maxBar = Math.max(1, ...activityBars);

  return (
    <div className="space-y-5">
      <section className="max-w-3xl space-y-2">
        <p className="inline-flex rounded-full bg-[#efe8f7] px-3 py-1 text-sm font-medium text-[#500085]">
          Real estate workspace
        </p>
        <DashboardPageTitle as="h2">Property decisions, organized</DashboardPageTitle>
        <p className="text-[15px] leading-7 text-muted-foreground">
          Welcome back{viewer.fullName ? `, ${viewer.fullName}` : ''}. Track searches, favorites,
          property comparisons, and team updates from one place.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="grid gap-4 md:grid-cols-3">
          {metricCards.map((item) => (
            <div key={item.label} className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-5 text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground">
                    {item.value}
                  </p>
                </div>
                <item.icon className="h-5 w-5 text-[#500085]" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{item.helper}</p>
            </div>
          ))}
        </div>

        <aside className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
          <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground">Key Metrics</p>
          <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-1">
            <div className="rounded-2xl border border-border/70 bg-[#fbfafc] p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Shortlist</p>
              <p className="mt-2 text-2xl font-semibold text-[#500085]">{favorites.length + compare.length}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-[#fbfafc] p-4">
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Updates</p>
              <p className="mt-2 text-2xl font-semibold text-[#166534]">{notices.length}</p>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Property activity</p>
              <h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.05em] text-foreground">
                {favorites.length + searches.length} / {Math.max(3, favorites.length + searches.length + 2)}
                <span className="ml-3 text-sm font-medium tracking-normal text-[#166534]">active signals</span>
              </h2>
            </div>
            <BarChart3 className="h-5 w-5 text-[#500085]" />
          </div>

          <div className="mt-8 flex h-[190px] items-end gap-4 overflow-hidden rounded-2xl bg-[#fbfafc] px-4 py-5">
            {['Search', 'Fav', 'Comp', 'Notes', 'Watch', 'Flow'].map((label, index) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-3">
                <div
                  className={`w-full max-w-[70px] rounded-2xl border border-border/70 ${
                    activityBars[index] ? 'bg-[#500085]' : 'bg-white'
                  }`}
                  style={{ height: 44 + (activityBars[index] / maxBar) * 112 }}
                />
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-[-0.03em]">Latest Activity</h3>
            <Bell className="h-5 w-5 text-[#500085]" />
          </div>
          {notices.length === 0 ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">No notifications yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {notices.map((notice) => (
                <li key={notice.id} className="rounded-2xl border border-border/70 bg-[#fbfafc] p-4">
                  <p className="text-sm font-semibold text-foreground">{notice.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{notice.body}</p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>

      <section className="rounded-[18px] border border-border/70 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border/70 pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.03em]">Recent property work</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Saved searches and shortlist activity you can pick up from.
            </p>
          </div>
          <Link
            href="/properties"
            className="inline-flex w-fit items-center gap-2 rounded-[14px] bg-[#500085] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#3B0063]"
          >
            Browse properties
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {searches.length === 0 && favorites.length === 0 && compare.length === 0 ? (
          <div className="py-12 text-center">
            <Star className="mx-auto h-10 w-10 text-[#500085]" />
            <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em]">No property activity yet</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Browse properties, save a search, favorite listings, or add options to compare.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="mt-4 w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
                <tr className="border-b border-border/70">
                  <th className="py-3 pr-4 font-medium">Item</th>
                  <th className="py-3 pr-4 font-medium">Type</th>
                  <th className="py-3 pr-4 font-medium">Date</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {searches.slice(0, 6).map((search) => (
                  <tr key={search.id} className="border-b border-border/60 last:border-b-0">
                    <td className="py-4 pr-4 font-semibold text-foreground">{search.title}</td>
                    <td className="py-4 pr-4 text-muted-foreground">Saved search</td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {new Date(search.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <span className="inline-flex rounded-full bg-[#efe8f7] px-3 py-1 text-xs font-medium text-[#500085]">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
                {favorites.length ? (
                  <tr className="border-b border-border/60 last:border-b-0">
                    <td className="py-4 pr-4 font-semibold text-foreground">{favorites.length} favorited properties</td>
                    <td className="py-4 pr-4 text-muted-foreground">Shortlist</td>
                    <td className="py-4 pr-4 text-muted-foreground">Updated recently</td>
                    <td className="py-4">
                      <span className="inline-flex rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-medium text-[#166534]">
                        Ready
                      </span>
                    </td>
                  </tr>
                ) : null}
                {compare.length ? (
                  <tr className="border-b border-border/60 last:border-b-0">
                    <td className="py-4 pr-4 font-semibold text-foreground">{compare.length} properties in compare</td>
                    <td className="py-4 pr-4 text-muted-foreground">Comparison</td>
                    <td className="py-4 pr-4 text-muted-foreground">Updated recently</td>
                    <td className="py-4">
                      <span className="inline-flex rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-medium text-[#92400e]">
                        Review
                      </span>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
