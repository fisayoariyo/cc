'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import {
  formatListingDate,
  formatListingDisplayId,
  listingCoverImage,
  listingStatusMeta,
} from '@/lib/agent-listings';
import { agentPrimaryButtonClass } from '@/lib/agent-dashboard-theme';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import { formatNaira } from '@/lib/format';
import type { PropertyRow } from '@/lib/types/database';
import { cn } from '@/components/ui/utils';

export function AgentListingDetailView({ property }: { property: PropertyRow }) {
  const [tab, setTab] = useState<'details' | 'photos'>('details');
  const status = listingStatusMeta(property.status);
  const cover = listingCoverImage(property);
  const displayId = formatListingDisplayId(property.id, property.created_at);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      <Link
        href="/agent/listings"
        className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#1F2A24]"
      >
        <ArrowLeft className="h-4 w-4" />
        Go back
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <DashboardPageTitle className="text-[#1F2A24]">Listing details</DashboardPageTitle>
        <Link href={`/agent/listings/${property.id}/edit`} className={agentPrimaryButtonClass}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Edit listing
        </Link>
      </div>

      <div className="inline-flex rounded-xl bg-[#f4f2f7] p-1">
        <button
          type="button"
          onClick={() => setTab('details')}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-semibold',
            tab === 'details' ? 'bg-[#4b2e6f] text-white' : 'text-[#6b7280]',
          )}
        >
          Details
        </button>
        <button
          type="button"
          onClick={() => setTab('photos')}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-semibold',
            tab === 'photos' ? 'bg-[#4b2e6f] text-white' : 'text-[#6b7280]',
          )}
        >
          Photos
        </button>
      </div>

      {tab === 'details' ? (
        <div className="space-y-6 rounded-2xl border border-[#ece8f2] bg-white p-5 shadow-sm">
          <section className="space-y-3">
            <h2 className="text-sm font-medium text-[#6b7280]">Publication status</h2>
            <DetailRow label="Status" value={status.label} highlight={status.pending} />
            <DetailRow label="Listing ID" value={displayId} />
            <DetailRow label="Listed on" value={formatListingDate(property.created_at)} />
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-medium text-[#6b7280]">Property information</h2>
            <DetailRow label="Title" value={property.title} />
            <DetailRow label="Location" value={property.location} />
            <DetailRow label="Price" value={formatNaira(property.price)} />
            <DetailRow label="Category" value={property.category ?? '—'} />
            <DetailRow label="Property type" value={property.property_type ?? '—'} />
          </section>

          <section className="space-y-3">
            <h2 className="text-sm font-medium text-[#6b7280]">Listing details</h2>
            <DetailRow label="Description" value={property.description ?? '—'} />
            <DetailRow
              label="Amenities"
              value={property.amenities?.length ? property.amenities.join(', ') : '—'}
            />
            <DetailRow label="Featured" value={property.is_featured ? 'Yes' : 'No'} />
          </section>

          {property.admin_notes ? (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-[#6b7280]">Admin feedback</h2>
              <DetailRow label="Notes" value={property.admin_notes} highlight />
            </section>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(property.images?.length ? property.images : cover ? [cover] : []).map((image) => (
            <div key={image} className="relative aspect-square overflow-hidden rounded-2xl bg-[#f4f2f7]">
              <Image src={image} alt="" fill className="object-cover" sizes="(max-width: 768px) 50vw, 200px" />
            </div>
          ))}
          {!property.images?.length && !cover ? (
            <p className="col-span-full text-sm text-[#6b7280]">No photos uploaded yet.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <p className="text-sm leading-relaxed text-[#6b7280]">
      {label}:{' '}
      <span className={cn('font-semibold text-[#1F2A24]', highlight && 'text-[#c88700]')}>{value}</span>
    </p>
  );
}
