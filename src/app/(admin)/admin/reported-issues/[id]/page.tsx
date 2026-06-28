import type { Metadata } from 'next';
import Link from 'next/link';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import { dashboardButtonRadiusClass } from '@/lib/dashboard-theme';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ProfileAvatar } from '@/components/dashboard/profile-avatar';
import { getSupportTicketForAdminById } from '@/lib/supabase/data';
import { formatSupportTicketDate } from '@/lib/support-tickets';
import { IssueStatusBadge, ViewAgentProfileLink } from '../issue-actions-menu';
import { ResolveIssueButton } from '../resolve-issue-button';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const ticket = await getSupportTicketForAdminById(id);
  return {
    title: ticket ? `${ticket.ticket_code} · Reported issue` : 'Reported issue',
  };
}

export default async function AdminReportedIssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = await getSupportTicketForAdminById(id);
  if (!ticket) notFound();

  const agent = ticket.agent;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/reported-issues"
            className={`inline-flex h-9 w-9 items-center justify-center ${dashboardButtonRadiusClass} border border-[#e5e7eb] text-[#6b7280] hover:bg-[#fbfafc]`}
            aria-label="Back to reported issues"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <DashboardPageTitle as="h2">Reported issue details</DashboardPageTitle>
        </div>
        <ResolveIssueButton ticketId={ticket.id} disabled={ticket.status === 'resolved'} />
      </div>

      <div className="rounded-2xl border border-[#F0EDE6] bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-[#6b7280]">Issue Details</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-sm text-[#6b7280]">Type of Issue</p>
            <p className="mt-1 font-semibold text-[#1F2A24]">{ticket.issue_type}</p>
          </div>
          <div>
            <p className="text-sm text-[#6b7280]">Listing ID</p>
            <p className="mt-1 font-semibold text-[#1F2A24]">{ticket.listing_reference ?? '—'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm text-[#6b7280]">Description</p>
            <p className="mt-1 font-semibold leading-relaxed text-[#1F2A24]">{ticket.description}</p>
          </div>
          <div>
            <p className="text-sm text-[#6b7280]">Issue date</p>
            <p className="mt-1 font-semibold text-[#1F2A24]">{formatSupportTicketDate(ticket.created_at)}</p>
          </div>
          <div>
            <p className="text-sm text-[#6b7280]">Status</p>
            <div className="mt-2">
              <IssueStatusBadge status={ticket.status} />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#F0EDE6] bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-[#6b7280]">Agent Details</p>
        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start">
          <ProfileAvatar
            photoUrl={agent?.photo_url ?? null}
            name={agent?.full_name}
            className="h-28 w-28 rounded-2xl text-2xl"
          />
          <div className="space-y-4">
            <div>
              <p className="text-sm text-[#6b7280]">Full Name</p>
              <p className="mt-1 font-semibold text-[#1F2A24]">{agent?.full_name ?? '—'}</p>
            </div>
            <div>
              <p className="text-sm text-[#6b7280]">Phone number</p>
              <p className="mt-1 font-semibold text-[#1F2A24]">{agent?.phone_number ?? '—'}</p>
            </div>
            <div>
              <p className="text-sm text-[#6b7280]">Email</p>
              <p className="mt-1 font-semibold text-[#1F2A24]">{agent?.email ?? '—'}</p>
            </div>
            {agent?.id ? <ViewAgentProfileLink agentId={agent.id} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
