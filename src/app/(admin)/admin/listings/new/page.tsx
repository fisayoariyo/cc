import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import { AdminPropertyForm } from '@/components/admin/AdminPropertyForm';

export default function NewListingPage() {
  return (
    <div className="space-y-6">
      <div>
        <DashboardPageTitle>New listing</DashboardPageTitle>
        <p className="text-muted-foreground text-sm mt-1">Creates a row in Supabase `properties`.</p>
      </div>
      <AdminPropertyForm showAgentField redirectTo="/admin/listings" />
    </div>
  );
}
