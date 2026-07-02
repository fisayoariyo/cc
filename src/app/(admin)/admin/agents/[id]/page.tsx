import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import { getAgentForAdminById } from '@/lib/supabase/data';
import { Badge } from '@/components/ui/badge';
import { AgentVerifyButtons } from '../agent-actions';
import { AgentPaymentConfirmButton } from '../agent-payment-confirm-button';

export const metadata: Metadata = {
  title: 'Agent verification details',
};

export default async function AdminAgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await getAgentForAdminById(id);
  if (!agent) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <DashboardPageTitle>Agent verification</DashboardPageTitle>
          <p className="mt-1 text-sm text-muted-foreground">Review submitted profile details before approval.</p>
        </div>
        <Link href="/admin/agents" className="text-sm text-[#4b2e6f] hover:underline">
          Back to list
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          {agent.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={agent.photo_url}
              alt={agent.full_name ?? 'Agent photo'}
              className="mx-auto h-56 w-56 rounded-2xl object-cover"
            />
          ) : (
            <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-2xl bg-[#fbfafc] text-sm text-muted-foreground">
              No photo uploaded
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-medium text-foreground">{agent.full_name ?? 'Unnamed agent'}</h2>
            <Badge
              variant={
                agent.status === 'verified' ? 'default' : agent.status === 'rejected' ? 'destructive' : 'secondary'
              }
              className="capitalize"
            >
              {(agent.status ?? 'pending').replace(/_/g, ' ')}
            </Badge>
          </div>

          {agent.onboarding_step !== 'submitted' ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              This agent has not finished submitting onboarding — address and next-of-kin fields may still be empty
              until they complete the final step.
            </p>
          ) : null}

          <dl className="grid gap-3 sm:grid-cols-2">
            {[
              { label: 'Email', value: agent.email },
              { label: 'Phone', value: agent.phone_number },
              { label: 'State', value: agent.agent_state },
              { label: 'LGA', value: agent.agent_lga },
              { label: 'NIN', value: agent.nin },
              { label: 'Gender', value: agent.gender },
              { label: 'Address', value: agent.agent_address },
              { label: 'Next of kin', value: agent.next_of_kin_name },
              { label: 'Next of kin phone', value: agent.next_of_kin_phone },
              { label: 'Relationship', value: agent.next_of_kin_relationship },
              { label: 'Onboarding step', value: agent.onboarding_step },
              {
                label: 'Onboarding paid',
                value: agent.onboarding_paid ? 'Yes' : 'No',
              },
              {
                label: 'Registered',
                value: new Date(agent.created_at).toLocaleString(),
              },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-border/60 bg-[#fbfafc] p-3">
                <dt className="text-xs text-muted-foreground">{item.label}</dt>
                <dd className="mt-1 text-sm font-medium capitalize text-foreground">{item.value ?? '—'}</dd>
              </div>
            ))}
          </dl>

          {agent.status === 'pending' || !agent.status ? (
            <div className="border-t border-border/60 pt-4">
              <AgentVerifyButtons profileId={agent.id} />
            </div>
          ) : null}

          {agent.status === 'verified' && !agent.onboarding_paid ? (
            <AgentPaymentConfirmButton profileId={agent.id} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
