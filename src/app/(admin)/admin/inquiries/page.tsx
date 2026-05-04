import { Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getAllInquiriesForAdmin } from '@/lib/supabase/data';
import { getCaseMessagesForInquiries } from '@/lib/supabase/case-messages';
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
  const rows = allRows.filter((row) => {
    const matchesQuery =
      !query ||
      row.email.toLowerCase().includes(query) ||
      row.inquiry_type.toLowerCase().includes(query) ||
      (row.message ?? '').toLowerCase().includes(query);
    const matchesStatus = status === 'all' || row.status === status;
    return matchesQuery && matchesStatus;
  });
  const messageMap = await getCaseMessagesForInquiries(rows.map((row) => row.id));

  const newCount = allRows.filter((row) => row.status === 'new').length;
  const actionedCount = allRows.filter((row) => row.status === 'actioned').length;
  const archivedCount = allRows.filter((row) => row.status === 'archived').length;

  return (
    <div className="space-y-8">
      <section className="max-w-3xl space-y-2">
        <h2 className="text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3rem]">
          Inquiry inbox
        </h2>
        <p className="text-[15px] leading-7 text-muted-foreground">
          Handle website messages, keep notes in thread, and move each inquiry through the right status.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'New', value: newCount },
          { label: 'Actioned', value: actionedCount },
          { label: 'Archived', value: archivedCount },
        ].map((item, index) => (
          <div
            key={item.label}
            className={`rounded-2xl p-4 text-white shadow-sm ${
              index === 0
                ? 'bg-gradient-to-br from-[#2f1b49] to-[#4b2e6f]'
                : index === 1
                  ? 'bg-gradient-to-br from-[#3a2358] to-[#593881]'
                  : 'bg-gradient-to-br from-[#442963] to-[#6a4698]'
            }`}
          >
            <p className="text-sm text-white/80">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold">{item.value}</p>
          </div>
        ))}
      </section>

      <form className="grid gap-3 rounded-2xl border border-border/70 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,1.4fr)_220px_180px]">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search email, subject, or message"
          className="h-11 rounded-xl border border-input bg-[#fbfafc] px-3 text-[15px]"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-11 rounded-xl border border-input bg-[#fbfafc] px-3 text-[15px]"
        >
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="actioned">Actioned</option>
          <option value="archived">Archived</option>
        </select>
        <button
          type="submit"
          className="rounded-[14px] bg-[#c88a2d] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#b67b25]"
        >
          Apply filters
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-border/70 bg-white shadow-sm">
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
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No inquiries yet. Submissions from /contact will appear here.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className={row.status === 'new' ? 'bg-[#fbf8ff]' : undefined}>
                  <TableCell className="max-w-[220px] font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      {row.status === 'new' ? (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#4b2e6f]" aria-hidden />
                      ) : null}
                      {row.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden max-w-xs truncate md:table-cell">{row.inquiry_type}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline">{row.channel}</Badge>
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                    {new Date(row.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <InquiryDetailDialog
                      inquiryId={row.id}
                      fullName={row.full_name}
                      email={row.email}
                      phone={row.phone}
                      inquiryType={row.inquiry_type}
                      createdAt={row.created_at}
                      messages={messageMap[row.id] ?? []}
                    />
                  </TableCell>
                  <TableCell>
                    <InquiryStatusSelect id={row.id} status={row.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" type="button" asChild>
                      <a href={`mailto:${row.email}?subject=Re: ${encodeURIComponent(row.inquiry_type)}`}>
                        <Mail className="mr-1 h-4 w-4" />
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
