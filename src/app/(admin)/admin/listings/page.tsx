import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNaira } from '@/lib/format';
import { getAllPropertiesForAdmin } from '@/lib/supabase/data';
import { ListingModerationControls } from './listing-moderation-controls';

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = '', status = 'all' } = await searchParams;
  const allRows = await getAllPropertiesForAdmin();
  const query = q.trim().toLowerCase();
  const rows = allRows.filter((r) => {
    const matchesQuery =
      !query ||
      r.title.toLowerCase().includes(query) ||
      r.location.toLowerCase().includes(query) ||
      (r.agent_id ?? '').toLowerCase().includes(query);
    const matchesStatus = status === 'all' || r.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-foreground">Listings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage property listings (Supabase).</p>
        </div>
        <Button asChild className="rounded-full w-fit">
          <Link href="/admin/listings/new">
            <Plus className="w-4 h-4 mr-2" />
            New listing
          </Link>
        </Button>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border border-border bg-card p-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by title, location, agent ID"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="edits_requested">Edits requested</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="sold">Sold</option>
          <option value="archived">Archived</option>
        </select>
        <button type="submit" className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
          Apply filters
        </button>
      </form>

      <div className="rounded-xl border border-border bg-card overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Admin note</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  No listings yet. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground max-w-[200px] truncate">{p.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{p.location}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatNaira(p.price)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={p.status === 'active' ? 'default' : p.status === 'rejected' ? 'destructive' : 'secondary'} className="capitalize">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-xs max-w-[260px] truncate">
                    {p.admin_notes ?? '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex flex-col items-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/listings/${p.id}`}>Edit</Link>
                      </Button>
                      <ListingModerationControls listingId={p.id} status={p.status} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
