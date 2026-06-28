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
import { AGENT_SUPPORT_ISSUE_TYPES, formatSupportTicketDate } from '@/lib/support-tickets';
import type { AgentSupportTicketWithAgent } from '@/lib/types/database';
import { IssueActionsMenu, IssueStatusBadge } from './issue-actions-menu';

const PAGE_SIZE = 8;

export function ReportedIssuesTable({ tickets }: { tickets: AgentSupportTicketWithAgent[] }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [issueType, setIssueType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = tickets.filter((ticket) => {
      const matchesQuery =
        !q ||
        ticket.ticket_code.toLowerCase().includes(q) ||
        (ticket.agent?.full_name ?? '').toLowerCase().includes(q) ||
        (ticket.listing_reference ?? '').toLowerCase().includes(q);
      const matchesStatus = status === 'all' || ticket.status === status;
      const matchesType = issueType === 'all' || ticket.issue_type === issueType;
      return matchesQuery && matchesStatus && matchesType;
    });

    rows = [...rows].sort((a, b) => {
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return rows;
  }, [tickets, query, status, issueType, sortBy]);

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
            placeholder="Search issues by ID"
            className="h-11 w-full rounded-full border border-[#e5e7eb] bg-white pl-10 pr-4 text-sm text-[#111827] placeholder:text-[#9ca3af] focus-visible:border-[#3B0063] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B0063]/30"
          />
        </div>
        <button
          type="button"
          className="h-11 shrink-0 rounded-full bg-[#4b2e6f] px-6 text-sm font-semibold text-white hover:bg-[#3d245c]"
          onClick={() => setVisibleCount(PAGE_SIZE)}
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
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={issueType}
          onChange={(event) => {
            setIssueType(event.target.value);
            setVisibleCount(PAGE_SIZE);
          }}
          className="h-10 rounded-full border border-[#e5e7eb] bg-white pl-4 pr-6 text-sm"
        >
          <option value="all">Issue type</option>
          {AGENT_SUPPORT_ISSUE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="h-10 rounded-full border border-[#e5e7eb] bg-white pl-4 pr-6 text-sm"
        >
          <option value="newest">Sort by</option>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Issue ID</TableHead>
              <TableHead>Agent name</TableHead>
              <TableHead className="hidden md:table-cell">Listing ID</TableHead>
              <TableHead className="hidden sm:table-cell">Issue type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-12 text-center text-muted-foreground">
                  No reported issues yet. Agent tickets will appear here.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-semibold text-[#1F2A24]">{ticket.ticket_code}</TableCell>
                  <TableCell>{ticket.agent?.full_name ?? '—'}</TableCell>
                  <TableCell className="hidden md:table-cell">{ticket.listing_reference ?? '—'}</TableCell>
                  <TableCell className="hidden sm:table-cell">{ticket.issue_type}</TableCell>
                  <TableCell>
                    <IssueStatusBadge status={ticket.status} />
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {formatSupportTicketDate(ticket.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <IssueActionsMenu ticket={ticket} />
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
