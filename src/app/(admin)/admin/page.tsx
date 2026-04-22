import Link from 'next/link';
import { Building2, Hammer, Inbox, Plane, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  const stats = [
    { label: 'Active listings', value: String(activeListings), href: '/admin/listings', icon: Building2 },
    { label: 'Pending listings', value: String(pendingListings), href: '/admin/listings', icon: Building2 },
    { label: 'Pending agents', value: String(pendingAgents), href: '/admin/agents', icon: Users },
    { label: 'Travel applications', value: String(travelCount), href: '/admin/travel-applications', icon: Plane },
    { label: 'Construction projects', value: String(constructionCount), href: '/admin/construction-projects', icon: Hammer },
    { label: 'Open inquiries', value: String(openInquiries), href: '/admin/inquiries', icon: Inbox },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-light text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Live counts from Supabase.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="h-full hover:border-primary/40 transition-colors shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <s.icon className="h-4 w-4 text-primary shrink-0" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-light text-foreground">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/admin/listings/new"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Add listing
          </Link>
          <Link
            href="/admin/agents"
            className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Review agents
          </Link>
          <Link
            href="/admin/travel-applications"
            className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Travel queue
          </Link>
          <Link
            href="/admin/construction-projects"
            className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Construction queue
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
