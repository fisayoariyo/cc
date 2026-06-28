'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { AgentListingCard } from '@/components/agent/agent-listing-card';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import {
  agentAccentButtonClass,
  agentPageHeaderStackClass,
  agentPrimaryButtonClass,
  agentSubtitleClass,
} from '@/lib/agent-dashboard-theme';
import { listingStatusMeta, summarizeAgentListings } from '@/lib/agent-listings';
import type { PropertyRow } from '@/lib/types/database';
import { cn } from '@/components/ui/utils';

type AgentListingsGridProps = {
  rows: PropertyRow[];
  title: string;
  subtitle: string;
  backHref?: string;
  showSummary?: boolean;
  initialQuery?: string;
  canCreateListings?: boolean;
};

export function AgentListingsGrid({
  rows,
  title,
  subtitle,
  backHref,
  showSummary = true,
  initialQuery = '',
  canCreateListings = true,
}: AgentListingsGridProps) {
  const [query, setQuery] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const stats = summarizeAgentListings(rows);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let next = rows.filter((row) => {
      const meta = listingStatusMeta(row.status);
      const matchesQuery =
        !q ||
        row.title.toLowerCase().includes(q) ||
        row.location.toLowerCase().includes(q) ||
        row.id.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'live' && !meta.pending) ||
        (statusFilter === 'pending' && meta.pending);
      return matchesQuery && matchesStatus;
    });

    next = [...next].sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return next;
  }, [query, rows, sortBy, statusFilter]);

  return (
    <div className="space-y-6">
      {backHref ? (
        <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#1F2A24]">
          ← Go back
        </Link>
      ) : null}

      <div className={agentPageHeaderStackClass}>
        <DashboardPageTitle className="text-[#1F2A24]">{title}</DashboardPageTitle>
        <p className={agentSubtitleClass}>{subtitle}</p>
      </div>

      {showSummary ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="inline-flex items-center gap-2 text-[#4b2e6f]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#4b2e6f]" />
              {stats.live} Live
            </span>
            <span className="inline-flex items-center gap-2 text-[#c88700]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FFBB3C]" />
              {stats.pending + stats.drafts} Pending
            </span>
          </div>
          <Link href="/agent/listings" className={agentPrimaryButtonClass}>
            Review queue
          </Link>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search listing by title, location, or ID..."
            className="h-12 w-full rounded-xl border border-[#e5e7eb] bg-white pl-10 pr-28 text-sm"
          />
          <button type="button" className={cn(agentPrimaryButtonClass, 'absolute right-1.5 top-1.5 h-9 px-4')}>
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-10 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm"
        >
          <option value="all">Status</option>
          <option value="live">Live</option>
          <option value="pending">Pending</option>
        </select>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="h-10 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm"
        >
          <option value="newest">Sort by</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {!showSummary ? (
        <p className="text-sm font-medium text-[#6b7280]">Search result ({filtered.length})</p>
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e5e7eb] bg-white p-10 text-center text-sm text-[#6b7280]">
          No listings found.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {filtered.map((row) => (
            <AgentListingCard key={row.id} row={row} />
          ))}
        </div>
      )}

      {showSummary && canCreateListings ? (
        <Link href="/agent/listings/new" className={cn(agentAccentButtonClass, 'max-w-sm')}>
          + Add new listing
        </Link>
      ) : null}
    </div>
  );
}
