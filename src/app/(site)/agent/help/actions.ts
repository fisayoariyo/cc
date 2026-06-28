'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { createNotificationsForAdmins } from '@/lib/supabase/notifications';
import { AGENT_SUPPORT_ISSUE_TYPES } from '@/lib/support-tickets';

export type SubmitSupportTicketState = { error: string } | { success: true } | null;

async function nextTicketCode(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>) {
  const { count } = await supabase
    .from('agent_support_tickets')
    .select('id', { count: 'exact', head: true });
  const next = (count ?? 0) + 1;
  return `ISS-${String(next).padStart(3, '0')}`;
}

export async function submitSupportTicket(
  _prev: SubmitSupportTicketState,
  formData: FormData,
): Promise<SubmitSupportTicketState> {
  const viewer = await getViewerContext();
  if (!viewer || viewer.role !== 'agent') {
    return { error: 'You must be signed in as an agent to submit a ticket.' };
  }

  const issueType = String(formData.get('issue_type') ?? '').trim();
  const listingReference = String(formData.get('listing_reference') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();

  if (!issueType || !AGENT_SUPPORT_ISSUE_TYPES.includes(issueType as (typeof AGENT_SUPPORT_ISSUE_TYPES)[number])) {
    return { error: 'Please select a valid issue type.' };
  }
  if (!description) {
    return { error: 'Please describe the issue.' };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: 'Configuration missing. Please try again later.' };
  }

  const ticketCode = await nextTicketCode(supabase);

  const { data: ticket, error } = await supabase
    .from('agent_support_tickets')
    .insert({
      ticket_code: ticketCode,
      agent_id: viewer.userId,
      issue_type: issueType,
      listing_reference: listingReference || null,
      description,
      status: 'pending',
    })
    .select('id, ticket_code')
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  await createNotificationsForAdmins({
    title: 'New agent support ticket',
    body: `${viewer.fullName ?? 'An agent'} reported: ${issueType}.`,
    type: 'agent_support_ticket',
    linkUrl: ticket?.id ? `/admin/reported-issues/${ticket.id}` : '/admin/reported-issues',
    metadata: {
      ticket_id: ticket?.id,
      ticket_code: ticket?.ticket_code,
      issue_type: issueType,
    },
  });

  revalidatePath('/agent/help');
  revalidatePath('/admin/reported-issues');

  return { success: true };
}
