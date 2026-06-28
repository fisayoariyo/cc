import { Inbox } from 'lucide-react';
import { AdminPageShell } from '@/components/admin/admin-page-shell';
import { AdminStatCard } from '@/components/admin/admin-stat-card';
import { getAllInquiriesForAdmin } from '@/lib/supabase/data';
import { getCaseMessagesForInquiries } from '@/lib/supabase/case-messages';
import { InquiriesTable } from './inquiries-table';

export default async function AdminInquiriesPage() {
  const allRows = await getAllInquiriesForAdmin();
  const messageMap = await getCaseMessagesForInquiries(allRows.map((row) => row.id));

  const newCount = allRows.filter((row) => row.status === 'new').length;
  const actionedCount = allRows.filter((row) => row.status === 'actioned').length;
  const archivedCount = allRows.filter((row) => row.status === 'archived').length;

  return (
    <AdminPageShell
      icon={Inbox}
      iconClassName="bg-[#E88A5F]/10 text-[#E88A5F]"
      title="Inquiry inbox"
      subtitle="Public messages from the website contact form — reply and update status."
    >
      <section className="grid gap-3 sm:grid-cols-3">
        <AdminStatCard label="New" value={newCount} />
        <AdminStatCard label="Actioned" value={actionedCount} />
        <AdminStatCard label="Archived" value={archivedCount} />
      </section>

      <InquiriesTable rows={allRows} messageMap={messageMap} />
    </AdminPageShell>
  );
}
