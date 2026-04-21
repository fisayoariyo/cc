'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createNotification } from '@/lib/supabase/notifications';

export async function setAgentVerification(profileId: string, status: 'verified' | 'rejected') {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Not signed in.' };
  }

  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (me?.role !== 'admin') {
    return { error: 'Not allowed.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', profileId)
    .eq('role', 'agent');

  if (error) {
    return { error: error.message };
  }

  await supabase
    .from('agent_profiles')
    .update({
      verification_status: status,
      ...(status === 'rejected' ? { payment_status: 'unpaid' } : {}),
    })
    .eq('user_id', profileId);

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
