import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TravelDashboardSidebar } from './_components/travel-dashboard-sidebar';

export default async function TravelDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/travels/dashboard');
  }

  const [{ data: profile }, { data: service }] = await Promise.all([
    supabase.from('profiles').select('full_name, role').eq('id', user.id).maybeSingle(),
    supabase.from('client_services').select('id').eq('user_id', user.id).eq('service', 'travel').maybeSingle(),
  ]);

  if (profile?.role === 'admin') redirect('/admin');
  if (profile?.role === 'agent') redirect('/agent');
  if (!service) redirect('/dashboard');

  return (
    <div className="min-h-screen bg-muted/30 pt-20 sm:pt-24 px-3 sm:px-6 pb-12">
      <div className="mx-auto w-full max-w-[1500px] grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] items-start">
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-7.5rem)]">
          <TravelDashboardSidebar fullName={profile?.full_name ?? user.email} />
        </div>
        <main className="w-full min-w-0">{children}</main>
      </div>
    </div>
  );
}

