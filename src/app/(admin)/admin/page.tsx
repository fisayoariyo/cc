import { Building2, Hammer, Inbox, Plane, Users } from 'lucide-react';
import { AdminPageShell } from '@/components/admin/admin-page-shell';
import { AdminQuickLink } from '@/components/admin/admin-quick-link';
import { AdminStatCard } from '@/components/admin/admin-stat-card';
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
  ] = supabase
    ? await Promise.all([
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'agent').eq('status', 'pending'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'agent').is('status', null),
        supabase.from('travel_applications').select('id', { count: 'exact', head: true }),
        supabase.from('construction_projects').select('id', { count: 'exact', head: true }),
        supabase.from('inquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      ])
    : [];

  const pendingAgents = (pendingAgentsRes?.count ?? 0) + (missingAgentStatusRes?.count ?? 0);

  const stats = [
    { label: 'Open inquiries', value: openInquiriesRes?.count ?? 0, href: '/admin/inquiries', icon: Inbox },
    { label: 'Travel queue', value: travelRes?.count ?? 0, href: '/admin/travel-applications', icon: Plane },
    { label: 'Pending agents', value: pendingAgents, href: '/admin/agents', icon: Users },
    { label: 'Active listings', value: activeListingsRes?.count ?? 0, href: '/admin/listings', icon: Building2 },
    { label: 'Pending listings', value: pendingListingsRes?.count ?? 0, href: '/admin/listings', icon: Building2 },
    { label: 'Construction', value: constructionRes?.count ?? 0, href: '/admin/construction-projects', icon: Hammer },
  ] as const;

  const quickLinks = [
    { label: 'Inquiry inbox', href: '/admin/inquiries', copy: 'New messages from the site contact form.' },
    { label: 'Travel applications', href: '/admin/travel-applications', copy: 'Documents, stages, and client threads.' },
    { label: 'Agent verification', href: '/admin/agents', copy: 'Approve or reject new agent accounts.' },
    { label: 'Listings', href: '/admin/listings', copy: 'Moderate property submissions.' },
    { label: 'Reported issues', href: '/admin/reported-issues', copy: 'Agent support tickets from Help desk.' },
    { label: 'Success stories', href: '/admin/success-stories', copy: 'Publish homepage proof and media.' },
  ] as const;

  return (
    <AdminPageShell title="Overview" subtitle="Start with the queues that need attention, then jump into any section below.">
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <AdminStatCard
            key={item.label}
            label={item.label}
            value={item.value}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-sans text-base font-bold text-[#1F2A24]">Quick links</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <AdminQuickLink key={link.href} href={link.href} label={link.label} copy={link.copy} />
          ))}
        </div>
      </section>
    </AdminPageShell>
  );
}
