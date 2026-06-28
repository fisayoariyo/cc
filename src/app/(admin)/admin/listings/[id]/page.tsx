import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import { notFound } from 'next/navigation';
import { AdminPropertyForm } from '@/components/admin/AdminPropertyForm';
import { getPropertyById } from '@/lib/supabase/data';

type Props = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  const property = await getPropertyById(id);
  if (!property) notFound();

  return (
    <div className="space-y-6">
      <div>
        <DashboardPageTitle>Edit listing</DashboardPageTitle>
        <p className="text-muted-foreground text-sm mt-1">{property.title}</p>
      </div>
      <AdminPropertyForm initial={property} showAgentField redirectTo="/admin/listings" />
    </div>
  );
}
