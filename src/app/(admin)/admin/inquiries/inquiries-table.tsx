'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { dashboardOutlineButtonClass } from '@/lib/dashboard-theme';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { CaseMessageRow, InquiryRow } from '@/lib/types/database';
import { InquiryActionsMenu, InquiryStatusBadge } from './inquiry-actions-menu';

const PAGE_SIZE = 8;

export function InquiriesTable({
  rows,
  messageMap,
}: {
  rows: InquiryRow[];
  messageMap: Record<string, CaseMessageRow[]>;
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let result = rows.filter((row) => {
      const matchesQuery =
        !q ||
        row.email.toLowerCase().includes(q) ||
        row.full_name.toLowerCase().includes(q) ||
        row.inquiry_type.toLowerCase().includes(q) ||
        (row.message ?? '').toLowerCase().includes(q);
      const matchesStatus = status === 'all' || row.status === status;
      return matchesQuery && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [rows, query, status, sortBy]);

  const visible = filtered.slice(0, visibleCount);
  const canLoadMore = visibleCount < filtered.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder="Search by name, email, or type"
            className="h-11 w-full rounded-full border border-[#e5e7eb] bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9ca3af] focus-visible:border-[#3B0063] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0063]/30"
          />
        </div>
        <button
          type="button"
          onClick={() => setVisibleCount(PAGE_SIZE)}
          className="h-11 shrink-0 rounded-full bg-[#4b2e6f] px-6 text-sm font-semibold text-white hover:bg-[#3d245c]"
        >
          Search
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-[#6b7280]">
        <span className="font-medium text-[#1F2A24]">Filter</span>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          className="h-10 rounded-full border border-[#e5e7eb] bg-white pl-4 pr-6 text-sm"
        >
          <option value="all">Status</option>
          <option value="new">New</option>
          <option value="actioned">Actioned</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="h-10 rounded-full border border-[#e5e7eb] bg-white pl-4 pr-6 text-sm"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>From</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Channel</TableHead>
              <TableHead className="hidden sm:table-cell">Received</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  No inquiries yet. Submissions from /contact will appear here.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((row) => (
                <TableRow key={row.id} className={row.status === 'new' ? 'bg-[#f7f3fb]' : undefined}>
                  <TableCell className="max-w-[240px] font-medium text-[#1F2A24]">
                    <div className="flex items-center gap-2">
                      {row.status === 'new' ? (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#4b2e6f]" aria-hidden />
                      ) : null}
                      <span className="truncate">{row.full_name || row.email}</span>
                    </div>
                    <span className="block truncate text-xs font-normal text-[#6b7280]">{row.email}</span>
                  </TableCell>
                  <TableCell className="hidden max-w-xs truncate md:table-cell">{row.inquiry_type}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline">{row.channel}</Badge>
                  </TableCell>
                  <TableCell className="hidden text-sm text-[#6b7280] sm:table-cell">
                    {new Date(row.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <InquiryStatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <InquiryActionsMenu inquiry={row} messages={messageMap[row.id] ?? []} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {canLoadMore ? (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className={dashboardOutlineButtonClass}
          >
            Load more
          </button>
        </div>
      ) : null}
    </div>
  );
}
