import { AdminPropertyForm } from '@/components/admin/AdminPropertyForm';

export default function NewListingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-foreground">New listing</h1>
        <p className="text-muted-foreground text-sm mt-1">Creates a row in Supabase `properties`.</p>
      </div>
      <AdminPropertyForm showAgentField redirectTo="/admin/listings" />
    </div>
  );
}
