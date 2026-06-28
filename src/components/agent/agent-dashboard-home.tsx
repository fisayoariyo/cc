'use client';

import Link from 'next/link';
import {
  Building2,
  ClipboardList,
  Plus,
  RefreshCcw,
  Search,
  UserPlus,
} from 'lucide-react';
import { AgentListingCard } from '@/components/agent/agent-listing-card';
import {
  agentAccentButtonClass,
  agentContentStackClass,
  agentPrimaryButtonClass,
  agentSurfacePanelClass,
  AGENT_DASHBOARD_PURPLE,
} from '@/lib/agent-dashboard-theme';
import { AgentOnboardingPaymentNotice } from '@/components/agent/agent-onboarding-payment-notice';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import { summarizeAgentListings } from '@/lib/agent-listings';
import type { PropertyRow } from '@/lib/types/database';
import { cn } from '@/components/ui/utils';

function StatCard({
  label,
  value,
  icon: Icon,
  className,
  action,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn('rounded-2xl bg-white/12 p-4 text-white backdrop-blur-sm', className)}>
      <div className="flex items-start justify-between gap-2">
        <Icon className="h-5 w-5 text-white/85" />
        {action}
      </div>
      <p className="mt-6 text-sm text-white/80">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

export function AgentDashboardHome({
  fullName,
  rows,
  canCreateListings,
  listingsLoading = false,
  showPaymentNotice = false,
}: {
  fullName: string;
  rows: PropertyRow[];
  canCreateListings: boolean;
  listingsLoading?: boolean;
  showPaymentNotice?: boolean;
}) {
  const stats = summarizeAgentListings(rows);
  const statValue = (n: number) => (listingsLoading && rows.length === 0 ? '—' : String(n).padStart(2, '0'));
  const recent = [...rows]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  return (
    <div>
      <section
        className="rounded-b-[28px] px-4 pb-5 pt-4 text-white lg:hidden"
        style={{ background: `linear-gradient(180deg, ${AGENT_DASHBOARD_PURPLE} 0%, #5a387f 100%)` }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <DashboardPageTitle className="text-white">Welcome, Agent {fullName}</DashboardPageTitle>
            <p className="mt-1 text-sm text-white/80">
              Ready to manage property listings and track moderation status.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
            Online
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <StatCard label="Active listings" value={statValue(stats.active)} icon={Building2} />
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Pending review" value={statValue(stats.pending)} icon={ClipboardList} />
            <StatCard
              label="Drafts / action"
              value={statValue(stats.drafts)}
              icon={RefreshCcw}
              action={
                <Link href="/agent/listings" className="text-xs font-semibold text-[#FFBB3C]">
                  Review
                </Link>
              }
            />
          </div>
        </div>
      </section>

      <div className={cn('bg-[#f4f2f7] p-4 pb-6 lg:bg-transparent lg:p-0', agentContentStackClass)}>
        {showPaymentNotice ? <AgentOnboardingPaymentNotice /> : null}

        <section className="hidden lg:grid lg:grid-cols-3 lg:gap-4">
          <StatCard
            label="Active listings"
            value={statValue(stats.active)}
            icon={Building2}
            className="!bg-[#4b2e6f] lg:col-span-1"
          />
          <StatCard
            label="Pending review"
            value={statValue(stats.pending)}
            icon={ClipboardList}
            className="!bg-[#4b2e6f]"
          />
          <StatCard
            label="Drafts / action"
            value={statValue(stats.drafts)}
            icon={RefreshCcw}
            className="!bg-[#4b2e6f]"
            action={
              <Link href="/agent/listings" className="text-xs font-semibold text-[#FFBB3C]">
                Review
              </Link>
            }
          />
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:gap-4">
          <div className={agentSurfacePanelClass}>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f2f7] text-[#4b2e6f]">
              <UserPlus className="h-5 w-5" />
            </div>
            <h2 className="font-sans text-base font-bold text-[#1F2A24]">New listing</h2>
            <p className="mt-1 text-sm text-[#6b7280]">Add property details, photos, and submit for review.</p>
            {canCreateListings ? (
              <Link href="/agent/listings/new" className={cn(agentAccentButtonClass, 'mt-5')}>
                <Plus className="h-4 w-4" />
                Start listing
              </Link>
            ) : (
              <Link href="/agent/listings" className={cn(agentAccentButtonClass, 'mt-5')}>
                Share receipt to unlock
              </Link>
            )}
          </div>

          <div className={agentSurfacePanelClass}>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f2f7] text-[#4b2e6f]">
              <Search className="h-5 w-5" />
            </div>
            <h2 className="font-sans text-base font-bold text-[#1F2A24]">Listing lookup</h2>
            <p className="mt-1 text-sm text-[#6b7280]">Search by title, location, or listing ID.</p>
            <Link href="/agent/listings/search" className={cn(agentAccentButtonClass, 'mt-5')}>
              <Search className="h-4 w-4" />
              Search
            </Link>
          </div>
        </section>

        <section className={cn(agentSurfacePanelClass, 'lg:max-w-2xl')}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-sans text-base font-bold text-[#1F2A24]">Listing moderation</h2>
              <p className="text-sm text-[#6b7280]">Track how many listings are live vs awaiting review.</p>
            </div>
            <Link href="/agent/listings" className={agentPrimaryButtonClass}>
              Review
            </Link>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-[#6b7280]">Moderation progress</span>
              <span className="font-semibold text-[#1F2A24]">{stats.progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#ece8f2]">
              <div
                className="h-full rounded-full bg-[repeating-linear-gradient(135deg,#4b2e6f,#4b2e6f_8px,#5a387f_8px,#5a387f_16px)]"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm">
              <span className="inline-flex items-center gap-2 text-[#4b2e6f]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#4b2e6f]" />
                {stats.live} Live
              </span>
              <span className="inline-flex items-center gap-2 text-[#c88700]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFBB3C]" />
                {stats.pending + stats.drafts} Pending
              </span>
            </div>
          </div>
        </section>

        {recent.length > 0 ? (
          <section className="space-y-3">
            <h2 className="font-sans text-lg font-bold text-[#1F2A24]">Recently listed</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
              {recent.map((row) => (
                <AgentListingCard key={row.id} row={row} />
              ))}
            </div>
            <Link href="/agent/listings" className={cn(agentAccentButtonClass, 'mt-2 max-w-sm')}>
              See all listings
            </Link>
          </section>
        ) : null}
      </div>
    </div>
  );
}
