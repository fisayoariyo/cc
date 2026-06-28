import Link from 'next/link';
import { Plus } from 'lucide-react';
import { AdminPageShell } from '@/components/admin/admin-page-shell';
import {
  adminAccentButtonClass,
  adminFilterBarClass,
  adminTablePanelClass,
  ADMIN_FORM_FIELD_CLASS,
  ADMIN_FORM_SELECT_CLASS,
} from '@/lib/admin-dashboard-theme';
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
    <AdminPageShell
      title="Listings"
      subtitle="Moderate agent property submissions."
      actions={
        <Link href="/admin/listings/new" className={`${adminAccentButtonClass} w-fit px-4 py-2.5`}>
          <Plus className="h-4 w-4" />
          New listing
        </Link>
      }
    >
      <form className={`${adminFilterBarClass} md:grid-cols-3`}>
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by title, location, agent ID"
          className={ADMIN_FORM_FIELD_CLASS}
        />
        <select name="status" defaultValue={status} className={ADMIN_FORM_SELECT_CLASS}>
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="edits_requested">Edits requested</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="sold">Sold</option>
          <option value="archived">Archived</option>
        </select>
        <button type="submit" className={adminAccentButtonClass}>
          Apply filters
        </button>
      </form>

      <div className={adminTablePanelClass}>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden lg:table-cell">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-[#6b7280]">
                  No listings match your filters.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-[220px] font-medium text-[#1F2A24]">
                    <Link href={`/admin/listings/${row.id}`} prefetch className="hover:text-[#4b2e6f] hover:underline">
                      {row.title}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{row.location}</TableCell>
                  <TableCell className="hidden lg:table-cell">{formatNaira(row.price)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ListingModerationControls listingId={row.id} status={row.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminPageShell>
  );
}
