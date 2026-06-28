'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, RotateCcw, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  adminTablePanelClass,
  adminFilterResetClass,
  ADMIN_FILTER_FIELD_CLASS,
  ADMIN_FILTER_SELECT_CLASS,
} from '@/lib/admin-dashboard-theme';
import { formatSupportTicketDate } from '@/lib/support-tickets';

type TravelApplicationListItem = {
  id: string;
  applicantLabel: string;
  serviceLabel: string;
  currentStageLabel: string;
  serviceType: string | null;
  currentStage: string | null;
  destination: string | null;
  created_at: string;
  deletion_request_status: string | null;
  docCount: number;
  messageCount: number;
};

type FilterOption = { value: string; label: string };

export function TravelApplicationsList({
  applications,
  serviceOptions,
  stageOptions,
}: {
  applications: TravelApplicationListItem[];
  serviceOptions: FilterOption[];
  stageOptions: FilterOption[];
}) {
  const [query, setQuery] = useState('');
  const [service, setService] = useState('all');
  const [stage, setStage] = useState('all');

  const hasActiveFilters = query.trim() !== '' || service !== 'all' || stage !== 'all';

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applications.filter((application) => {
      const matchesQuery =
        !q ||
        [application.applicantLabel, application.destination, application.serviceLabel, application.id]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q);
      const matchesService = service === 'all' || application.serviceType === service;
      const matchesStage = stage === 'all' || application.currentStage === stage;
      return matchesQuery && matchesService && matchesStage;
    });
  }, [applications, query, service, stage]);

  function resetFilters() {
    setQuery('');
    setService('all');
    setStage('all');
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2.5 md:grid-cols-[minmax(0,1.6fr)_180px_180px_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by applicant, destination, or ID"
            className={`${ADMIN_FILTER_FIELD_CLASS} pl-9`}
          />
        </div>

        <div className="relative">
          <select
            value={service}
            onChange={(event) => setService(event.target.value)}
            className={`${ADMIN_FILTER_SELECT_CLASS} pr-9`}
          >
            <option value="all">All services</option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
        </div>

        <div className="relative">
          <select
            value={stage}
            onChange={(event) => setStage(event.target.value)}
            className={`${ADMIN_FILTER_SELECT_CLASS} pr-9`}
          >
            <option value="all">All stages</option>
            {stageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6b7280]" />
        </div>

        <div className="flex items-center">
          {hasActiveFilters ? (
            <button type="button" onClick={resetFilters} className={adminFilterResetClass}>
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          ) : null}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} of {applications.length} case{applications.length === 1 ? '' : 's'}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#ece8f2] bg-white p-10 text-center text-muted-foreground shadow-sm">
          No applications match your filters.
        </div>
      ) : (
        <div className={adminTablePanelClass}>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Applicant</TableHead>
                <TableHead className="hidden sm:table-cell">Service</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="hidden md:table-cell">Submitted</TableHead>
                <TableHead className="hidden lg:table-cell">Activity</TableHead>
                <TableHead className="text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="max-w-[260px] font-medium text-foreground">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate">{application.applicantLabel}</span>
                        {application.deletion_request_status === 'pending' ? (
                          <Badge className="bg-[#fff3e0] text-[#a66300] hover:bg-[#fff3e0]">
                            Deletion requested
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-0.5 truncate text-sm font-normal text-muted-foreground">
                        {application.destination ?? 'No destination yet'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="secondary">{application.serviceLabel}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-[#efe8f7] text-[#4b2e6f] hover:bg-[#efe8f7]">
                      {application.currentStageLabel}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {formatSupportTicketDate(application.created_at)}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground lg:table-cell">
                    {application.docCount} doc{application.docCount === 1 ? '' : 's'} ·{' '}
                    {application.messageCount} msg{application.messageCount === 1 ? '' : 's'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/travel-applications/${application.id}`}
                      prefetch
                      className="inline-flex items-center gap-1 text-sm font-medium text-[#4b2e6f] hover:underline"
                    >
                      Open
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
