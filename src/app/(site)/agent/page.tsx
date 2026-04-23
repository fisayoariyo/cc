import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light text-foreground">Agent dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base max-w-xl">
              {viewer.fullName ? `${viewer.fullName} — ` : ''}
              Verification:{' '}
              <span className="text-foreground font-medium capitalize">{viewer.status ?? 'pending'}</span>
              {' | '}
              Payment:{' '}
              <span className="text-foreground font-medium capitalize">
                {viewer.onboardingPaid ? 'paid' : 'pending'}
              </span>
            </p>
          </div>
          {canManageListings ? (
            <Button asChild className="rounded-full w-full sm:w-auto shrink-0">
              <Link href="/agent/listings/new">New listing</Link>
            </Button>
          ) : null}
        </div>

        {payment === 'success' ? (
          <p className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-foreground">
            Onboarding payment confirmed. Your agent account is now active.
          </p>
        ) : null}
        {payment === 'failed' ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Payment verification failed. Please try again.
          </p>
        ) : null}

        {viewer.status === 'verified' && !viewer.onboardingPaid ? <AgentPaymentGate /> : null}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h2 className="text-base font-medium text-foreground mb-2">Recent updates</h2>
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
        {canManageListings ? <AgentListingsManager rows={rows} /> : null}
    </div>
  );
}
