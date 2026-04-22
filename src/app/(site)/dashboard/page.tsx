import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getClientServices } from '@/lib/supabase/data';
import { addClientServiceAndContinue } from './actions';

const SERVICE_ROUTES = {
  travel: '/travels/dashboard',
  real_estate: '/real-estate/dashboard',
  construction: '/construction/dashboard',
} as const;

const SERVICE_LABELS = {
  travel: 'Travel',
  real_estate: 'Real Estate',
  construction: 'Construction',
} as const;

export default async function DashboardResolverPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/dashboard');

  const [profileRes, servicesRes] = await Promise.all([
    supabase.from('profiles').select('role, full_name').eq('id', user.id).maybeSingle(),
    getClientServices(user.id),
  ]);
  const profile = profileRes.data;
  if (profile?.role === 'admin') redirect('/admin');
  if (profile?.role === 'agent') redirect('/agent');

  const services = servicesRes.map((s) => s.service);
  if (services.length === 1) {
    redirect(SERVICE_ROUTES[services[0]]);
  }

  const params = (await searchParams) ?? {};
  const errorMessage = params.error;

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 py-6 sm:py-8">
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-foreground">Choose your client workspace</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {profile?.full_name ? `${profile.full_name}, ` : ''}pick one service to continue. You can add more anytime.
          </p>
        </div>
        {errorMessage ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(SERVICE_ROUTES) as Array<keyof typeof SERVICE_ROUTES>).map((service) => {
            const enabled = services.includes(service);
            return (
              <div key={service} className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
                <p className="font-medium text-foreground">{SERVICE_LABELS[service]}</p>
                {enabled ? (
                  <Link
                    href={SERVICE_ROUTES[service]}
                    className="inline-flex rounded-full px-4 py-2 text-sm bg-primary text-primary-foreground"
                  >
                    Open dashboard
                  </Link>
                ) : (
                  <form action={addClientServiceAndContinue.bind(null, service)}>
                    <button
                      type="submit"
                      className="inline-flex rounded-full px-4 py-2 text-sm border border-border hover:bg-muted"
                    >
                      Add service
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
