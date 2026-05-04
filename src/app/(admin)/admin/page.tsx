import Link from 'next/link';
import { ArrowRight, Building2, Hammer, Inbox, Plane, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [
    activeListingsRes,
    pendingListingsRes,
    pendingAgentsRes,
    missingAgentStatusRes,
    travelRes,
    constructionRes,
    openInquiriesRes,
  ] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'agent').eq('status', 'pending'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'agent').is('status', null),
    supabase.from('travel_applications').select('id', { count: 'exact', head: true }),
    supabase.from('construction_projects').select('id', { count: 'exact', head: true }),
    supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
  ]);

  const activeListings = activeListingsRes.count ?? 0;
  const pendingListings = pendingListingsRes.count ?? 0;
  const pendingAgents = (pendingAgentsRes.count ?? 0) + (missingAgentStatusRes.count ?? 0);
  const travelCount = travelRes.count ?? 0;
  const constructionCount = constructionRes.count ?? 0;
  const openInquiries = openInquiriesRes.count ?? 0;

  const primaryStats = [
    { label: 'Open inquiries', value: openInquiries, href: '/admin/inquiries', icon: Inbox },
    { label: 'Travel queue', value: travelCount, href: '/admin/travel-applications', icon: Plane },
    { label: 'Pending agents', value: pendingAgents, href: '/admin/agents', icon: Users },
  ] as const;

  const secondaryStats = [
    { label: 'Active listings', value: activeListings, href: '/admin/listings', icon: Building2 },
    { label: 'Pending listings', value: pendingListings, href: '/admin/listings', icon: Building2 },
    { label: 'Construction projects', value: constructionCount, href: '/admin/construction-projects', icon: Hammer },
  ] as const;

  const actions = [
    { label: 'Review inquiries', href: '/admin/inquiries', copy: 'Check new messages and assign follow-up.' },
    { label: 'Open travel queue', href: '/admin/travel-applications', copy: 'Review documents, stages, and client updates.' },
    { label: 'Manage listings', href: '/admin/listings', copy: 'Approve properties and keep the catalog clean.' },
  ] as const;

  return (
    <div className="space-y-8">
      <section className="max-w-3xl space-y-2">
        <h2 className="text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3rem]">
          Operations overview
        </h2>
        <p className="text-[15px] leading-7 text-muted-foreground">
          Watch the queues that need attention first, then move into listings, travel cases, and new inquiries.
        </p>
      </section>

      <section className="grid gap-3 lg:grid-cols-3">
        {primaryStats.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className={`rounded-2xl p-5 text-white shadow-sm transition-transform hover:-translate-y-0.5 ${
              index === 0
                ? 'bg-gradient-to-br from-[#2f1b49] to-[#4b2e6f]'
                : index === 1
                  ? 'bg-gradient-to-br from-[#3a2358] to-[#593881]'
                  : 'bg-gradient-to-br from-[#442963] to-[#6a4698]'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-white/80">{item.label}</p>
                <p className="mt-3 text-4xl font-semibold leading-none">{item.value}</p>
              </div>
              <item.icon className="h-5 w-5 text-white/90" />
            </div>
          </Link>
        ))}
      </section>

      <section className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_360px]">
        <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[1.6rem] font-semibold tracking-[-0.03em] text-foreground">
                Priority work areas
              </h3>
              <p className="mt-2 text-[15px] text-muted-foreground">
                The biggest queues stay at the top so the team can move quickly without scanning multiple tools.
              </p>
            </div>
            <Link
              href="/admin/inquiries"
              className="hidden rounded-full border border-[#ddd4e6] bg-white px-4 py-2 text-[15px] text-foreground hover:bg-[#f7f3fb] sm:inline-flex"
            >
              Open inbox
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {secondaryStats.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-2xl border border-border/70 bg-[#fbfafc] p-4 transition-colors hover:border-[#cdbde2] hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">{item.value}</p>
                  </div>
                  <item.icon className="h-4 w-4 text-[#4b2e6f]" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-[1.45rem] font-semibold tracking-[-0.03em] text-foreground">Quick actions</h3>
          <div className="mt-4 space-y-3">
            {actions.map((action, index) => (
              <Link
                key={action.label}
                href={action.href}
                className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-4 transition-colors ${
                  index === 0
                    ? 'border-[#4b2e6f]/20 bg-[#f7f3fb]'
                    : 'border-border/70 bg-[#fbfafc] hover:bg-white'
                }`}
              >
                <div>
                  <p className="text-[15px] font-medium text-foreground">{action.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{action.copy}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#4b2e6f]" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
