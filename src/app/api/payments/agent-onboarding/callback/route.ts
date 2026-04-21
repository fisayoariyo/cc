import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyPaystackTransaction } from '@/lib/payments/paystack';
import { createNotification } from '@/lib/supabase/notifications';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get('reference')?.trim();
  const fallback = new URL('/agent?payment=failed', url.origin);
  if (!reference) return NextResponse.redirect(fallback);

  const supabase = await createClient();
  const { data: payment } = await supabase
    .from('agent_onboarding_payments')
    .select('id, user_id, amount, status')
    .eq('reference', reference)
    .maybeSingle();
  if (!payment) return NextResponse.redirect(fallback);

  try {
    const verified = await verifyPaystackTransaction(reference);
    const success = verified.status === 'success' && verified.amount >= Number(payment.amount) * 100;
    if (!success) {
      await supabase
        .from('agent_onboarding_payments')
        .update({ status: 'failed', raw_payload: verified })
        .eq('id', payment.id);
      return NextResponse.redirect(fallback);
    }

    await supabase
      .from('agent_onboarding_payments')
      .update({ status: 'success', raw_payload: verified })
      .eq('id', payment.id);
    await supabase.from('profiles').update({ onboarding_paid: true }).eq('id', payment.user_id);
    await supabase.from('agent_profiles').update({ payment_status: 'paid' }).eq('user_id', payment.user_id);
    await createNotification({
      userId: payment.user_id,
      type: 'agent_payment',
      title: 'Onboarding payment confirmed',
      body: 'Your onboarding payment was confirmed. Agent dashboard access is now active.',
      linkUrl: '/agent',
    });

    return NextResponse.redirect(new URL('/agent?payment=success', url.origin));
  } catch (error) {
    await supabase
      .from('agent_onboarding_payments')
      .update({ status: 'failed', raw_payload: { reason: String(error) } })
      .eq('id', payment.id);
    return NextResponse.redirect(fallback);
  }
}
