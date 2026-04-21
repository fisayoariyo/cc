import { AdminPropertyForm } from '@/components/admin/AdminPropertyForm';

export default function AgentNewListingPage() {
  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 px-4 sm:px-6 pb-16">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-light text-foreground">New listing</h1>
          <p className="text-muted-foreground text-sm mt-1">This listing is assigned to you as the agent.</p>
        </div>
        <AdminPropertyForm redirectTo="/agent" actor="agent" />
      </div>
    </div>
  );
}
