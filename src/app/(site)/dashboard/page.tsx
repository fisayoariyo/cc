import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getClientServices } from '@/lib/supabase/data';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { addClientServiceAndContinue } from './actions';
import { CONSTRUCTION_CONSULTATION_URL } from '@/lib/consultation';
import { isClientDashboardService, LAST_CLIENT_SERVICE_COOKIE } from '@/lib/last-client-service';

const SERVICE_ROUTES = {
  travel: '/travels/dashboard',
  real_estate: '/real-estate/dashboard',
} as const;

const SERVICE_LABELS = {
  travel: 'Travel',
  real_estate: 'Real Estate',
} as const;

export default async function DashboardResolverPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const viewer = await getViewerContext();
  if (!viewer) redirect('/login?next=/dashboard');
  if (viewer.role === 'admin') redirect('/admin');
  if (viewer.role === 'agent') redirect(viewer.status === 'verified' ? '/agent' : '/agent/under-review');

  const services = (await getClientServices(viewer.userId)).map((s) => s.service);
  const cookieStore = await cookies();
  const lastService = cookieStore.get(LAST_CLIENT_SERVICE_COOKIE)?.value;

  if (services.length === 1) {
    if (services[0] === 'construction') {
      redirect(CONSTRUCTION_CONSULTATION_URL);
    }
    redirect(SERVICE_ROUTES[services[0]]);
  }

  const dashboardServices = services.filter(
    (service): service is keyof typeof SERVICE_ROUTES => service === 'travel' || service === 'real_estate',
  );
  const hasConstructionService = services.includes('construction');
  const hasConstructionOnly = services.length > 0 && dashboardServices.length === 0 && services.includes('construction');

  if (hasConstructionOnly) {
    redirect(CONSTRUCTION_CONSULTATION_URL);
  }

  const params = (await searchParams) ?? {};
  const errorMessage = params.error;

  if (isClientDashboardService(lastService) && dashboardServices.includes(lastService)) {
    redirect(SERVICE_ROUTES[lastService]);
  }

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 py-6 sm:py-8">
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-foreground">Choose your client workspace</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {viewer.fullName ? `${viewer.fullName}, ` : ''}pick one service to continue. You can add more anytime.
          </p>
        </div>
        {errorMessage ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(SERVICE_ROUTES) as Array<keyof typeof SERVICE_ROUTES>).map((service) => {
            const enabled = dashboardServices.includes(service);
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
          {hasConstructionService ? (
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
              <p className="font-medium text-foreground">Construction Consultation</p>
              <p className="text-sm text-muted-foreground">
                Construction now starts with a booked consultation instead of a client dashboard.
              </p>
              <a
                href={CONSTRUCTION_CONSULTATION_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full px-4 py-2 text-sm bg-primary text-primary-foreground"
              >
                Book consultation
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
