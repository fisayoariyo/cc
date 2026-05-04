'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { createNotification } from '@/lib/supabase/notifications';

export async function setAgentVerification(profileId: string, status: 'verified' | 'rejected') {
  const viewer = await getViewerContext();
  if (!viewer) {
    return { error: 'Not signed in.' };
  }
  if (viewer.role !== 'admin') {
    return { error: 'Not allowed.' };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', profileId)
    .eq('role', 'agent');

  if (error) {
    return { error: error.message };
  }

  await createNotification({
    userId: profileId,
    type: 'agent',
    title: status === 'verified' ? 'Agent account approved' : 'Agent account rejected',
    body:
      status === 'verified'
        ? 'Your agent account has been verified. Complete onboarding payment to activate dashboard controls.'
        : 'Your agent account was rejected. Contact support for clarification.',
    linkUrl: '/agent',
  });

  revalidatePath('/admin/agents');
  revalidatePath('/admin');
  return { ok: true };
}
