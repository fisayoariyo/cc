import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { getNotificationsForUser, getPropertiesForAgent } from '@/lib/supabase/data';
import { AgentListingsManager, AgentPaymentGate, AgentPendingReviewCard } from './agent-dashboard-controls';

export const metadata: Metadata = {
  title: 'Agent dashboard',
};

export default async function AgentDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const { payment } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, rows, notices] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, email, role, status, onboarding_paid, phone_number, passport_number, created_at, updated_at')
      .eq('id', user.id)
      .maybeSingle(),
    getPropertiesForAgent(user.id),
    getNotificationsForUser(user.id, 5),
  ]);
  const profile = profileRes.data;
  const canManageListings = profile?.status === 'verified' && profile?.onboarding_paid;

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 px-4 sm:px-6 pb-16">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light text-foreground">Agent dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base max-w-xl">
              {profile?.full_name ? `${profile.full_name} — ` : ''}
              Verification:{' '}
              <span className="text-foreground font-medium capitalize">{profile?.status ?? 'pending'}</span>
              {' | '}
              Payment:{' '}
              <span className="text-foreground font-medium capitalize">
                {profile?.onboarding_paid ? 'paid' : 'pending'}
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

        {profile?.status !== 'verified' ? <AgentPendingReviewCard /> : null}
        {profile?.status === 'verified' && !profile?.onboarding_paid ? <AgentPaymentGate /> : null}
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
    </div>
  );
}
