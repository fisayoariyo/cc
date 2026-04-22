import { AdminPropertyForm } from '@/components/admin/AdminPropertyForm';

export default function AgentNewListingPage() {
  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-light text-foreground">New listing</h1>
          <p className="text-muted-foreground text-sm mt-1">This listing is assigned to you as the agent.</p>
        </div>
        <AdminPropertyForm redirectTo="/agent" actor="agent" />
      </div>
    </div>
  );
}
