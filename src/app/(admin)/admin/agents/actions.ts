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
  if (!supabase) return { error: 'Configuration missing.' };

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
  revalidatePath(`/admin/agents/${profileId}`);
  revalidatePath('/admin');
  return { ok: true };
}

export async function confirmAgentOnboardingPayment(profileId: string) {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'Not signed in.' };
  if (viewer.role !== 'admin') return { error: 'Not allowed.' };

  const supabase = await createClient();
  if (!supabase) return { error: 'Configuration missing.' };

  const { data: agent } = await supabase
    .from('profiles')
    .select('id, role, status, onboarding_paid, full_name')
    .eq('id', profileId)
    .eq('role', 'agent')
    .maybeSingle();

  if (!agent) return { error: 'Agent not found.' };
  if (agent.status !== 'verified') {
    return { error: 'Agent must be verified before payment can be confirmed.' };
  }
  if (agent.onboarding_paid) {
    return { error: 'Onboarding payment is already confirmed for this agent.' };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ onboarding_paid: true })
    .eq('id', profileId);

  if (profileError) return { error: profileError.message };

  await supabase.from('agent_onboarding_payments').insert({
    user_id: profileId,
    provider: 'admin',
    reference: `admin_confirm_${profileId.replace(/-/g, '')}_${Date.now()}`,
    amount: 5000,
    status: 'success',
    raw_payload: { confirmed_by: viewer.userId },
  });

  const { notifyAgentListingUnlocked } = await import('@/lib/supabase/notifications');
  await notifyAgentListingUnlocked(profileId);

  revalidatePath('/admin/agents');
  revalidatePath(`/admin/agents/${profileId}`);
  revalidatePath('/agent');
  return { ok: true };
}
