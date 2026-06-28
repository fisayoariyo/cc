'use client';

import { useEffect, useState } from 'react';
import { AgentDashboardHome } from '@/components/agent/agent-dashboard-home';
import { AgentListingsGrid } from '@/components/agent/agent-listings-grid';
import { AgentPaymentCelebrationBanner } from '@/components/agent/agent-payment-celebration-banner';
import { useAgentListings } from '@/components/agent/agent-listings-provider';
import { fetchAgentListingUnlockNotice } from '@/app/(site)/agent/actions';
import type { NotificationRow } from '@/lib/types/database';

export function AgentDashboardRoute({
  firstName,
  canCreateListings,
  showPaywall,
  paymentFailed,
}: {
  firstName: string;
  canCreateListings: boolean;
  showPaywall: boolean;
  paymentFailed: boolean;
}) {
  const { rows, loading } = useAgentListings();
  const [listingUnlockNotice, setListingUnlockNotice] = useState<NotificationRow | null>(null);

  useEffect(() => {
    let active = true;
    void fetchAgentListingUnlockNotice().then((notice) => {
      if (active) setListingUnlockNotice(notice);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-4 lg:space-y-6">
      {paymentFailed ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 font-sans text-sm text-destructive">
          Payment verification failed. Please try again.
        </p>
      ) : null}

      {listingUnlockNotice ? <AgentPaymentCelebrationBanner notice={listingUnlockNotice} /> : null}

      <AgentDashboardHome
        fullName={firstName}
        rows={rows}
        canCreateListings={canCreateListings}
        listingsLoading={loading}
        showPaymentNotice={showPaywall}
      />
    </div>
  );
}

export function AgentListingsRoute({
  title,
  subtitle,
  backHref,
  showSummary = true,
  initialQuery = '',
  canCreateListings = true,
}: {
  title: string;
  subtitle: string;
  backHref?: string;
  showSummary?: boolean;
  initialQuery?: string;
  canCreateListings?: boolean;
}) {
  const { rows, loading } = useAgentListings();

  return (
    <div className="p-4 lg:p-0">
      {loading && rows.length === 0 ? (
        <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-[#ece8f2]" />
      ) : null}
      <AgentListingsGrid
        rows={rows}
        title={title}
        subtitle={subtitle}
        backHref={backHref}
        showSummary={showSummary}
        initialQuery={initialQuery}
        canCreateListings={canCreateListings}
      />
    </div>
  );
}
