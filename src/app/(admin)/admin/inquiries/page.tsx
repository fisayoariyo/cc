import { Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllInquiriesForAdmin } from '@/lib/supabase/data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InquiryStatusSelect } from './inquiry-status-select';
import { InquiryDetailDialog } from './inquiry-detail-dialog';

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = '', status = 'all' } = await searchParams;
  const allRows = await getAllInquiriesForAdmin();
  const query = q.trim().toLowerCase();
  const rows = allRows.filter((r) => {
    const matchesQuery =
      !query ||
      r.email.toLowerCase().includes(query) ||
      r.inquiry_type.toLowerCase().includes(query) ||
      (r.message ?? '').toLowerCase().includes(query);
    const matchesStatus = status === 'all' || r.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-foreground">Inquiry inbox</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Central inbox for web, phone, and email leads (stored in Supabase).
        </p>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-xl border border-border bg-card p-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search email, subject, message"
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="actioned">Actioned</option>
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
              <TableHead>From</TableHead>
              <TableHead className="hidden md:table-cell">Subject</TableHead>
              <TableHead className="hidden lg:table-cell">Channel</TableHead>
              <TableHead className="hidden sm:table-cell">Received</TableHead>
              <TableHead className="text-right">Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Reply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                  No inquiries yet. Submissions from /contact will appear here.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((q) => (
                <TableRow key={q.id} className={q.status === 'new' ? 'bg-primary/[0.04]' : undefined}>
                  <TableCell className="font-medium text-foreground max-w-[180px]">
                    <div className="flex items-center gap-2">
                      {q.status === 'new' && <span className="h-2 w-2 rounded-full bg-primary shrink-0" aria-hidden />}
                      {q.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">{q.inquiry_type}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline">{q.channel}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                    {new Date(q.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <InquiryDetailDialog
                      fullName={q.full_name}
                      email={q.email}
                      phone={q.phone}
                      inquiryType={q.inquiry_type}
                      message={q.message}
                      createdAt={q.created_at}
                    />
                  </TableCell>
                  <TableCell>
                    <InquiryStatusSelect id={q.id} status={q.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" type="button" asChild>
                      <a href={`mailto:${q.email}?subject=Re: ${encodeURIComponent(q.inquiry_type)}`}>
                        <Mail className="w-4 h-4 mr-1" />
                        Reply
                      </a>
                    </Button>
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
