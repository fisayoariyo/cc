'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import type { PropertyStatus } from '@/lib/types/database';
import { initializePaystackTransaction } from '@/lib/payments/paystack';
import { LISTING_AGENT_TRANSITIONS, LISTING_STATUS_VALUES } from '@/lib/workflow-rules';

const AGENT_ALLOWED: PropertyStatus[] = LISTING_STATUS_VALUES;

export async function completeAgentOnboardingPayment() {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'Not signed in.' };

  const supabase = await createClient();
  if (viewer.status !== 'verified') {
    return { error: 'Your account must be verified before onboarding payment.' };
  }

  const { data: fullProfile } = await supabase
    .from('profiles')
    .select('email, onboarding_paid')
    .eq('id', viewer.userId)
    .maybeSingle();
  if (fullProfile?.onboarding_paid) {
    return { ok: true };
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    // Development fallback when Paystack is not configured.
    const { error: pErr } = await supabase
      .from('profiles')
      .update({ onboarding_paid: true })
      .eq('id', viewer.userId);
    if (pErr) return { error: pErr.message };
    revalidatePath('/agent');
    return { ok: true, mode: 'fallback' as const };
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const reference = `agent_onboard_${viewer.userId.replace(/-/g, '')}_${Date.now()}`;
  const amount = 5000;
  const callbackUrl = `${origin}/api/payments/agent-onboarding/callback`;

  const { error: insertErr } = await supabase.from('agent_onboarding_payments').insert({
    user_id: viewer.userId,
    provider: 'paystack',
    reference,
    amount,
    status: 'initialized',
  });
  if (insertErr) return { error: insertErr.message };

  try {
    const payment = await initializePaystackTransaction({
      email: fullProfile?.email || viewer.email || 'agent@example.com',
      amountKobo: amount * 100,
      reference,
      callbackUrl,
      metadata: { user_id: viewer.userId, type: 'agent_onboarding' },
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
}) {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'Not signed in.' };

  const supabase = await createClient();
  if (viewer.status !== 'verified' || !viewer.onboardingPaid) {
    return { error: 'Only verified and paid agents can manage listings.' };
  }
  if (!AGENT_ALLOWED.includes(input.status)) {
    return { error: 'Invalid status.' };
  }

  const { data: listing } = await supabase
    .from('properties')
    .select('status')
    .eq('id', input.id)
    .eq('agent_id', viewer.userId)
    .maybeSingle();
  if (!listing) return { error: 'Listing not found.' };

  const current = listing.status as PropertyStatus;
  const next = input.status;
  const canTransition = LISTING_AGENT_TRANSITIONS[current]?.includes(next) ?? false;
  if (!canTransition) {
    return { error: `Cannot change status from ${current} to ${next}.` };
  }

  const { error } = await supabase
    .from('properties')
    .update({
      status: input.status,
      is_featured: input.is_featured,
    })
    .eq('id', input.id)
    .eq('agent_id', viewer.userId);

  if (error) return { error: error.message };
  revalidatePath('/agent');
  revalidatePath('/properties');
  return { ok: true };
}
