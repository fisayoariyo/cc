import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getNotificationsForUser, getPropertiesForAgent } from '@/lib/supabase/data';
import { AgentListingsManager, AgentPaymentGate } from './agent-dashboard-controls';
import { getViewerContext } from '@/lib/supabase/dashboard-access';

export const metadata: Metadata = {
  title: 'Agent dashboard',
};

export default async function AgentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const { payment } = await searchParams;
  const viewer = await getViewerContext();
  if (!viewer) return null;
  if (viewer.status !== 'verified') redirect('/agent/under-review');

  const [rows, notices] = await Promise.all([
    getPropertiesForAgent(viewer.userId),
    getNotificationsForUser(viewer.userId, 5),
  ]);
  const canManageListings = viewer.status === 'verified' && viewer.onboardingPaid;

  return (
    <div className="space-y-8">
      <section className="max-w-3xl space-y-2">
        <h2 className="text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3rem]">
          Agent dashboard
        </h2>
        <p className="text-[15px] leading-7 text-muted-foreground">
          Follow verification, manage listings, and keep an eye on admin updates without leaving your workspace.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Verification', value: viewer.status ?? 'pending' },
          { label: 'Payment', value: viewer.onboardingPaid ? 'Paid' : 'Pending' },
          { label: 'Listings', value: String(rows.length) },
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
            <p className="mt-2 text-3xl font-semibold capitalize">{item.value}</p>
          </div>
        ))}
      </section>

      {payment === 'success' ? (
        <p className="rounded-2xl border border-[#d9c6a2] bg-[#fff7ea] px-4 py-3 text-sm text-foreground">
          Onboarding payment confirmed. Your agent account is now active.
        </p>
      ) : null}
      {payment === 'failed' ? (
        <p className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Payment verification failed. Please try again.
        </p>
      ) : null}

      {viewer.status === 'verified' && !viewer.onboardingPaid ? <AgentPaymentGate /> : null}

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_340px]">
        <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[1.6rem] font-semibold tracking-[-0.03em] text-foreground">
                Listing workspace
              </h3>
              <p className="mt-2 text-[15px] text-muted-foreground">
                Create, update, and track listing status from one place.
              </p>
            </div>
            {canManageListings ? (
              <Link
                href="/agent/listings/new"
                className="hidden rounded-full bg-[#c88a2d] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#b67b25] sm:inline-flex"
              >
                Add listing
              </Link>
            ) : null}
          </div>
          <div className="mt-5">{canManageListings ? <AgentListingsManager rows={rows} /> : null}</div>
        </div>

        <div className="space-y-4">
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

          <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-foreground">Need support?</h3>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Use the help area for account, verification, or listing issues.
            </p>
            <Link
              href="/agent/help"
              className="mt-4 inline-flex rounded-full border border-[#ddd4e6] bg-white px-4 py-2.5 text-[15px] text-foreground hover:bg-[#f7f3fb]"
            >
              Open help & support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
