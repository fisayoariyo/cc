'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { useAgentListings } from '@/components/agent/agent-listings-provider';
import { agentAccentButtonClass } from '@/lib/agent-dashboard-theme';
import { updateAgentListingMeta } from './actions';
import type { PropertyRow } from '@/lib/types/database';
import { formatNaira } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export { AgentPaymentGate } from '@/components/agent/agent-payment-gate';

export function AgentPendingReviewCard() {
  return (
    <div className="rounded-2xl border border-border/70 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-medium text-foreground">Under review</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Your agent registration is currently under admin review. You will unlock listing controls once verified.
      </p>
    </div>
  );
}

function AgentListingCard({ row, onSaved }: { row: PropertyRow; onSaved?: () => void }) {
  const [pending, start] = useTransition();
  const [status, setStatus] = useState(row.status);
  const [featured, setFeatured] = useState(!!row.is_featured);
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="space-y-4 rounded-2xl border border-border/70 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-foreground">{row.title}</p>
          <p className="text-sm text-muted-foreground">{row.location}</p>
          {row.admin_notes ? <p className="mt-1 text-xs text-muted-foreground">Admin: {row.admin_notes}</p> : null}
        </div>
        <Badge variant={status === 'active' ? 'default' : 'secondary'} className="capitalize">
          {status}
        </Badge>
      </div>
      <p className="text-sm text-foreground">{formatNaira(row.price)}</p>
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Status</label>
        <select
          className="h-10 w-full rounded-xl border border-input bg-[#fbfafc] px-3 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        >
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="edits_requested">Edits requested</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="sold">Sold</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Mark as featured
      </label>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="rounded-xl bg-[#4b2e6f] text-white hover:bg-[#40255f]"
          disabled={pending}
          onClick={() =>
            start(() => {
              void (async () => {
                const res = await updateAgentListingMeta({
                  id: row.id,
                  status,
                  is_featured: featured,
                });
                setNotice(res && 'error' in res ? res.error ?? 'Failed.' : 'Saved');
                if (!res || !('error' in res)) {
                  onSaved?.();
                }
              })();
            })
          }
        >
          {pending ? 'Saving...' : 'Save'}
        </Button>
        <Button variant="outline" size="sm" asChild className="rounded-xl bg-transparent">
          <Link href={`/agent/listings/${row.id}`}>Edit form</Link>
        </Button>
      </div>
      {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
    </div>
  );
}

export function AgentListingsManager({ rows }: { rows: PropertyRow[] }) {
  const { refresh } = useAgentListings();
  const [view, setView] = useState<'list' | 'grid'>('list');
  const stats = useMemo(() => {
    return {
      total: rows.length,
      draft: rows.filter((row) => row.status === 'draft').length,
      active: rows.filter((row) => row.status === 'active').length,
      pending: rows.filter((row) => row.status === 'pending').length,
      editsRequested: rows.filter((row) => row.status === 'edits_requested').length,
      rejected: rows.filter((row) => row.status === 'rejected').length,
      sold: rows.filter((row) => row.status === 'sold').length,
    };
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        {[
          { key: 'Total', value: stats.total },
          { key: 'Draft', value: stats.draft },
          { key: 'Active', value: stats.active },
          { key: 'Pending', value: stats.pending },
          { key: 'Edits', value: stats.editsRequested + stats.rejected },
          { key: 'Sold', value: stats.sold },
        ].map((item) => (
          <div key={item.key} className="rounded-2xl border border-border/70 bg-[#fbfafc] p-4">
            <p className="text-xs text-muted-foreground">{item.key}</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild className={agentAccentButtonClass}>
          <Link href="/agent/listings/new">Add New Listing</Link>
        </Button>
        <div className="inline-flex items-center gap-1 rounded-xl border border-border/70 bg-white p-1">
          <button
            type="button"
            onClick={() => setView('list')}
            className={`rounded-lg px-3 py-1 text-xs ${
              view === 'list' ? 'bg-[#4b2e6f] text-white' : 'text-muted-foreground'
            }`}
          >
            <List className="mr-1 inline h-3 w-3" />
            List
          </button>
          <button
            type="button"
            onClick={() => setView('grid')}
            className={`rounded-lg px-3 py-1 text-xs ${
              view === 'grid' ? 'bg-[#4b2e6f] text-white' : 'text-muted-foreground'
            }`}
          >
            <LayoutGrid className="mr-1 inline h-3 w-3" />
            Grid
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No listings yet. Create your first property.
        </p>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {rows.map((row) => (
            <AgentListingCard key={row.id} row={row} onSaved={refresh} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border/70 bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-[220px] truncate font-medium text-foreground">{row.title}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">{row.location}</TableCell>
                  <TableCell>{formatNaira(row.price)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={row.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/agent/listings/${row.id}`}>Edit</Link>
                    </Button>
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
