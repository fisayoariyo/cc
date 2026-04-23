import { notFound } from 'next/navigation';
import { AdminPropertyForm } from '@/components/admin/AdminPropertyForm';
import { getPropertyById } from '@/lib/supabase/data';
import { getViewerContext } from '@/lib/supabase/dashboard-access';

type Props = { params: Promise<{ id: string }> };

export default async function AgentEditListingPage({ params }: Props) {
  const { id } = await params;
  const viewer = await getViewerContext();
  if (!viewer) return null;

  const property = await getPropertyById(id);
  if (!property || property.agent_id !== viewer.userId) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-light text-foreground">Edit listing</h1>
          <p className="text-muted-foreground text-sm mt-1">{property.title}</p>
        </div>
        <AdminPropertyForm initial={property} redirectTo="/agent" actor="agent" />
      </div>
    </div>
  );
}
