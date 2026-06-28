'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';

export async function markSupportTicketResolved(ticketId: string) {
  const viewer = await getViewerContext();
  if (!viewer || viewer.role !== 'admin') {
    return { error: 'Not allowed.' };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: 'Configuration missing.' };
  }

  const { error } = await supabase
    .from('agent_support_tickets')
    .update({
      status: 'resolved',
      resolved_at: new Date().toISOString(),
      resolved_by: viewer.userId,
    })
    .eq('id', ticketId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/reported-issues');
  revalidatePath(`/admin/reported-issues/${ticketId}`);

  return { ok: true as const };
}
