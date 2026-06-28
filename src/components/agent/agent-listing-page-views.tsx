'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import { AdminPropertyForm } from '@/components/admin/AdminPropertyForm';
import { AgentListingDetailView } from '@/components/agent/agent-listing-detail-view';
import { AgentListingsPaywall } from '@/components/agent/agent-listings-paywall';
import { useAgentListings } from '@/components/agent/agent-listings-provider';
import { useAgentViewer } from '@/components/agent/agent-viewer-provider';
import { fetchAgentProperty } from '@/app/(site)/agent/actions';
import { agentCanManageListings } from '@/lib/agent-listing-access';
import type { PropertyRow } from '@/lib/types/database';

function ListingPageSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-6 p-4 lg:p-0">
      <div className="max-w-3xl animate-pulse space-y-4">
        <div className="h-4 w-24 rounded bg-[#ece8f2]" />
        <div className="h-8 w-56 rounded bg-[#ece8f2]" />
        <p className="text-sm text-[#6b7280]">{title}</p>
        <div className="h-48 rounded-2xl bg-[#ece8f2]" />
        <div className="h-32 rounded-2xl bg-[#ece8f2]" />
      </div>
    </div>
  );
}

function useAgentProperty(id: string) {
  const { rows } = useAgentListings();
  const cached = rows.find((row) => row.id === id) ?? null;
  const [property, setProperty] = useState<PropertyRow | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (cached) {
      setProperty(cached);
      setLoading(false);
      setMissing(false);
      return;
    }

    let active = true;
    setLoading(true);
    setMissing(false);

    void fetchAgentProperty(id).then((row) => {
      if (!active) return;
      if (!row) {
        setMissing(true);
        setProperty(null);
      } else {
        setProperty(row);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [id, cached]);

  return { property, loading, missing };
}

export function AgentListingDetailPageClient() {
  const { id } = useParams<{ id: string }>();
  const viewer = useAgentViewer();
  const { property, loading, missing } = useAgentProperty(id);

  if (!agentCanManageListings(viewer)) {
    return <AgentListingsPaywall />;
  }

  if (missing) notFound();
  if (loading || !property) {
    return <ListingPageSkeleton title="Loading listing details…" />;
  }

  return (
    <div className="p-4 lg:p-0">
      <AgentListingDetailView property={property} />
    </div>
  );
}

export function AgentListingEditPageClient() {
  const { id } = useParams<{ id: string }>();
  const viewer = useAgentViewer();
  const { property, loading, missing } = useAgentProperty(id);

  if (!agentCanManageListings(viewer)) {
    return <AgentListingsPaywall />;
  }

  if (missing) notFound();
  if (loading || !property) {
    return <ListingPageSkeleton title="Loading listing form…" />;
  }

  return (
    <div className="space-y-6 p-4 lg:p-0">
      <div className="max-w-2xl space-y-6">
        <div>
          <DashboardPageTitle>Edit listing</DashboardPageTitle>
          <p className="mt-1 text-sm text-muted-foreground">{property.title}</p>
        </div>
        <AdminPropertyForm initial={property} redirectTo="/agent/listings" actor="agent" />
      </div>
    </div>
  );
}

export function AgentNewListingPageClient() {
  const viewer = useAgentViewer();

  if (!agentCanManageListings(viewer)) {
    return <AgentListingsPaywall />;
  }

  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-6">
        <div>
          <DashboardPageTitle>New listing</DashboardPageTitle>
          <p className="mt-1 text-sm text-muted-foreground">This listing is assigned to you as the agent.</p>
        </div>
        <AdminPropertyForm redirectTo="/agent/listings" actor="agent" />
      </div>
    </div>
  );
}
