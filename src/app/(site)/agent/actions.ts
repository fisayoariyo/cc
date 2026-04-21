'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { PropertyStatus } from '@/lib/types/database';
import { initializePaystackTransaction } from '@/lib/payments/paystack';
import { LISTING_AGENT_TRANSITIONS, LISTING_STATUS_VALUES } from '@/lib/workflow-rules';

const AGENT_ALLOWED: PropertyStatus[] = LISTING_STATUS_VALUES;

export async function completeAgentOnboardingPayment() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const { data: profile } = await supabase.from('profiles').select('status').eq('id', user.id).maybeSingle();
  if (profile?.status !== 'verified') {
    return { error: 'Your account must be verified before onboarding payment.' };
  }

  const { data: fullProfile } = await supabase
    .from('profiles')
    .select('email, onboarding_paid')
    .eq('id', user.id)
    .maybeSingle();
  if (fullProfile?.onboarding_paid) {
    return { ok: true };
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    // Development fallback when Paystack is not configured.
    const { error: pErr } = await supabase
      .from('profiles')
      .update({ onboarding_paid: true })
      .eq('id', user.id);
    if (pErr) return { error: pErr.message };
    await supabase.from('agent_profiles').update({ payment_status: 'paid' }).eq('user_id', user.id);
    revalidatePath('/agent');
    return { ok: true, mode: 'fallback' as const };
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const reference = `agent_onboard_${user.id.replace(/-/g, '')}_${Date.now()}`;
  const amount = 5000;
  const callbackUrl = `${origin}/api/payments/agent-onboarding/callback`;

  const { error: insertErr } = await supabase.from('agent_onboarding_payments').insert({
    user_id: user.id,
    provider: 'paystack',
    reference,
    amount,
    status: 'initialized',
  });
  if (insertErr) return { error: insertErr.message };

  try {
    const payment = await initializePaystackTransaction({
      email: fullProfile?.email || user.email || 'agent@example.com',
      amountKobo: amount * 100,
      reference,
      callbackUrl,
      metadata: { user_id: user.id, type: 'agent_onboarding' },
    });
    return { ok: true, authorizationUrl: payment.authorization_url };
  } catch (error) {
    await supabase
      .from('agent_onboarding_payments')
      .update({ status: 'failed', raw_payload: { reason: String(error) } })
      .eq('reference', reference);
    return { error: error instanceof Error ? error.message : 'Payment initialization failed.' };
  }
}

export async function updateAgentListingMeta(input: {
  id: string;
  status: PropertyStatus;
  is_featured: boolean;
  labels: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const { data: me } = await supabase
    .from('profiles')
    .select('status, onboarding_paid')
    .eq('id', user.id)
    .maybeSingle();
  if (me?.status !== 'verified' || !me?.onboarding_paid) {
    return { error: 'Only verified and paid agents can manage listings.' };
  }
  if (!AGENT_ALLOWED.includes(input.status)) {
    return { error: 'Invalid status.' };
  }

  const { data: listing } = await supabase
    .from('properties')
    .select('status')
    .eq('id', input.id)
    .eq('agent_id', user.id)
    .maybeSingle();
  if (!listing) return { error: 'Listing not found.' };

  const current = listing.status as PropertyStatus;
  const next = input.status;
  const canTransition = LISTING_AGENT_TRANSITIONS[current]?.includes(next) ?? false;
  if (!canTransition) {
    return { error: `Cannot change status from ${current} to ${next}.` };
  }

  const labels = input.labels.map((s) => s.trim()).filter(Boolean);
  const { error } = await supabase
    .from('properties')
    .update({
      status: input.status,
      is_featured: input.is_featured,
      labels,
    })
    .eq('id', input.id)
    .eq('agent_id', user.id);

  if (error) return { error: error.message };
  revalidatePath('/agent');
  revalidatePath('/real-estate/properties');
  return { ok: true };
}
