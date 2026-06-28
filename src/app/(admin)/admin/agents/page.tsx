import { AdminPageShell } from '@/components/admin/admin-page-shell';
import { getAllAgentsForAdmin } from '@/lib/supabase/data';
import { AgentVerificationTable } from './agent-verification-table';

export default async function AdminAgentsPage() {
  const agents = await getAllAgentsForAdmin();

  return (
    <AdminPageShell
      title="Agent verification"
      subtitle="Review profiles, verify details, then approve or reject accounts."
    >
      <AgentVerificationTable agents={agents} />
    </AdminPageShell>
  );
}
