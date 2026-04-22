import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AdminPropertyForm } from '@/components/admin/AdminPropertyForm';
import { getPropertyById } from '@/lib/supabase/data';

type Props = { params: Promise<{ id: string }> };

export default async function AgentEditListingPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const property = await getPropertyById(id);
  if (!property || property.agent_id !== user.id) {
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
