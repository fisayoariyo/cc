import Link from 'next/link';
import Image from 'next/image';
import { RefreshCcw } from 'lucide-react';
import {
  formatListingDate,
  formatListingDisplayId,
  listingCoverImage,
  listingStatusMeta,
} from '@/lib/agent-listings';
import { agentPrimaryButtonClass } from '@/lib/agent-dashboard-theme';
import type { PropertyRow } from '@/lib/types/database';
import { cn } from '@/components/ui/utils';

function statusClass(tone: ReturnType<typeof listingStatusMeta>['tone']) {
  if (tone === 'success') return 'text-[#4b2e6f]';
  if (tone === 'pending') return 'text-[#c88700]';
  if (tone === 'danger') return 'text-red-600';
  return 'text-[#6b7280]';
}

export function AgentListingCard({ row, compact = false }: { row: PropertyRow; compact?: boolean }) {
  const cover = listingCoverImage(row);
  const status = listingStatusMeta(row.status);
  const displayId = formatListingDisplayId(row.id, row.created_at);

  return (
    <article
      className={cn(
        'flex h-full min-w-0 flex-col rounded-2xl border border-[#ece8f2] bg-white p-4 shadow-sm',
        compact ? 'min-h-[280px]' : 'min-h-[300px] lg:min-h-[340px]',
      )}
    >
      <div className="relative mb-3 flex items-start justify-between gap-2">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f4f2f7] lg:h-20 lg:w-20">
          {cover ? (
            <Image src={cover} alt="" fill className="object-cover" sizes="64px" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-[#9ca3af]">No photo</div>
          )}
        </div>
        {status.pending ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#c88700]">
            <RefreshCcw className="h-3.5 w-3.5" />
            Review
          </span>
        ) : null}
      </div>

      <div className="space-y-1.5 text-sm">
        <p className="line-clamp-2 font-semibold leading-snug text-[#1F2A24]">{row.title}</p>
        <p className="text-[#6b7280]">
          <span className="font-medium text-[#1F2A24]">ID:</span> {displayId}
        </p>
        <p className="text-[#6b7280]">
          <span className="font-medium text-[#1F2A24]">Listed:</span> {formatListingDate(row.created_at)}
        </p>
        <p className={cn('font-semibold', statusClass(status.tone))}>
          <span className="font-medium text-[#6b7280]">Status:</span> {status.label}
        </p>
      </div>

      <Link href={`/agent/listings/${row.id}`} className={cn(agentPrimaryButtonClass, 'mt-auto pt-4')}>
        View Details
      </Link>
    </article>
  );
}

export function AgentListingCardStatusText({ status }: { status: PropertyRow['status'] }) {
  const meta = listingStatusMeta(status);
  return <span className={cn('font-semibold', statusClass(meta.tone))}>{meta.label}</span>;
}
