'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { completeAgentOnboardingPayment, updateAgentListingMeta } from './actions';
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

export function AgentPendingReviewCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-medium text-foreground mb-2">Under review</h2>
      <p className="text-sm text-muted-foreground">
        Your agent registration is currently under admin review. You will unlock listing controls once verified.
      </p>
    </div>
  );
}

export function AgentPaymentGate() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [notice, setNotice] = useState<string | null>(null);
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
      <h2 className="text-lg font-medium text-foreground">Onboarding payment required</h2>
      <p className="text-sm text-muted-foreground">
        Your verification is complete. Pay NGN 5,000 onboarding fee to activate your agent dashboard tools.
      </p>
      <Button
        type="button"
        className="rounded-full"
        disabled={pending}
        onClick={() =>
          start(() => {
            void (async () => {
              const res = await completeAgentOnboardingPayment();
              if (res && 'error' in res) {
                setNotice(res.error ?? 'Failed.');
                return;
              }
              if (res && 'authorizationUrl' in res && res.authorizationUrl) {
                window.location.href = res.authorizationUrl;
                return;
              }
              setNotice(
                res && 'mode' in res && res.mode === 'fallback'
                  ? 'Payment marked as paid (development fallback mode).'
                  : 'Payment recorded. Refreshing...',
              );
              router.refresh();
            })();
          })
        }
      >
        {pending ? 'Processing…' : 'Pay NGN 5,000'}
      </Button>
      {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
      <p className="text-xs text-muted-foreground">
        If Paystack keys are configured, this opens secure checkout and returns here automatically.
      </p>
    </div>
  );
}

function AgentListingCard({ row }: { row: PropertyRow }) {
  const [pending, start] = useTransition();
  const [status, setStatus] = useState(row.status);
  const [featured, setFeatured] = useState(!!row.is_featured);
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-foreground">{row.title}</p>
          <p className="text-sm text-muted-foreground">{row.location}</p>
          {row.admin_notes ? <p className="text-xs text-muted-foreground mt-1">Admin: {row.admin_notes}</p> : null}
        </div>
        <Badge variant={status === 'active' ? 'default' : 'secondary'} className="capitalize">
          {status}
        </Badge>
      </div>
      <p className="text-sm text-foreground">{formatNaira(row.price)}</p>
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Status</label>
        <select
          className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
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
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
        Mark as featured
      </label>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="rounded-full"
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
              })();
            })
          }
        >
          {pending ? 'Saving…' : 'Save'}
        </Button>
        <Button variant="outline" size="sm" asChild className="rounded-full bg-transparent">
          <Link href={`/agent/listings/${row.id}`}>Edit form</Link>
        </Button>
      </div>
      {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
    </div>
  );
}

export function AgentListingsManager({ rows }: { rows: PropertyRow[] }) {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const stats = useMemo(() => {
    return {
      total: rows.length,
      draft: rows.filter((r) => r.status === 'draft').length,
      active: rows.filter((r) => r.status === 'active').length,
      pending: rows.filter((r) => r.status === 'pending').length,
      editsRequested: rows.filter((r) => r.status === 'edits_requested').length,
      rejected: rows.filter((r) => r.status === 'rejected').length,
      sold: rows.filter((r) => r.status === 'sold').length,
    };
  }, [rows]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { k: 'Total', v: stats.total },
          { k: 'Draft', v: stats.draft },
          { k: 'Active', v: stats.active },
          { k: 'Pending', v: stats.pending },
          { k: 'Edits', v: stats.editsRequested + stats.rejected },
          { k: 'Sold', v: stats.sold },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">{s.k}</p>
            <p className="text-xl font-medium text-foreground">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button asChild className="rounded-full">
          <Link href="/agent/listings/new">Add New Listing</Link>
        </Button>
        <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setView('list')}
            className={`px-3 py-1 rounded-full text-xs ${view === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
          >
            <List className="h-3 w-3 inline mr-1" />
            List
          </button>
          <button
            type="button"
            onClick={() => setView('grid')}
            className={`px-3 py-1 rounded-full text-xs ${view === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground'}`}
          >
            <LayoutGrid className="h-3 w-3 inline mr-1" />
            Grid
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground rounded-2xl border border-dashed border-border p-8 text-center">
          No listings yet. Create your first property.
        </p>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rows.map((r) => (
            <AgentListingCard key={r.id} row={r} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-x-auto shadow-sm">
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
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-foreground max-w-[220px] truncate">{r.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{r.location}</TableCell>
                  <TableCell>{formatNaira(r.price)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={r.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/agent/listings/${r.id}`}>Edit</Link>
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
