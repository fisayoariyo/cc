import type { Metadata } from 'next';
import { LifeBuoy } from 'lucide-react';
import { AdminPageShell } from '@/components/admin/admin-page-shell';
import { getSupportTicketsForAdmin } from '@/lib/supabase/data';
import { ReportedIssuesTable } from './reported-issues-table';

export const metadata: Metadata = {
  title: 'Reported issues',
};

export default async function AdminReportedIssuesPage() {
  const tickets = await getSupportTicketsForAdmin();

  return (
    <AdminPageShell
      icon={LifeBuoy}
      iconClassName="bg-[#4b2e6f]/10 text-[#4b2e6f]"
      title="Reported issues"
      subtitle="Internal support tickets raised by agents from the Help desk."
    >
      <ReportedIssuesTable tickets={tickets} />
    </AdminPageShell>
  );
}
