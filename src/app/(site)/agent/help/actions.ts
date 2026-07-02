'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { createNotificationsForAdmins } from '@/lib/supabase/notifications';
import { friendlyDbError } from '@/lib/supabase/db-errors';
import { AGENT_SUPPORT_ISSUE_TYPES } from '@/lib/support-tickets';

export type SubmitSupportTicketState = { error: string } | { success: true } | null;

/** Highest existing numeric suffix + 1, so re-numbering survives deleted rows. */
async function nextTicketNumber(supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>) {
  const { data } = await supabase
    .from('agent_support_tickets')
    .select('ticket_code')
    .order('created_at', { ascending: false })
    .limit(200);

  let max = 0;
  for (const row of data ?? []) {
    const match = /(\d+)$/.exec(String((row as { ticket_code?: string }).ticket_code ?? ''));
    if (match) max = Math.max(max, Number(match[1]));
  }
  return max + 1;
}

function formatTicketCode(n: number) {
  return `ISS-${String(n).padStart(3, '0')}`;
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

  // Retry on unique-code collisions (concurrent submissions / re-numbering races).
  let ticket: { id: string; ticket_code: string } | null = null;
  let lastError: { message?: string | null; code?: string | null } | null = null;
  const baseNumber = await nextTicketNumber(supabase);

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = formatTicketCode(baseNumber + attempt);
    const { data, error } = await supabase
      .from('agent_support_tickets')
      .insert({
        ticket_code: candidate,
        agent_id: viewer.userId,
        issue_type: issueType,
        listing_reference: listingReference || null,
        description,
        status: 'pending',
      })
      .select('id, ticket_code')
      .maybeSingle();

    if (!error) {
      ticket = data as { id: string; ticket_code: string } | null;
      lastError = null;
      break;
    }

    lastError = error;
    const isDuplicate = error.code === '23505' || error.message?.toLowerCase().includes('duplicate key');
    if (!isDuplicate) break;
  }

  if (lastError) {
    return { error: friendlyDbError(lastError, 'Could not submit your ticket. Please try again.') };
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
