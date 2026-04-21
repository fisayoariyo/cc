'use server';

import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { humanizeAuthError } from '@/lib/supabase/auth-errors';

export type ForgotState = { error: string } | { success: true } | null;

async function getAppOrigin(): Promise<string | undefined> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (!host) return undefined;
  const proto = h.get('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}`;
}

export async function requestPasswordReset(
  prevState: ForgotState,
  formData: FormData,
): Promise<ForgotState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  if (!email) {
    return { error: 'Please enter your email address.' };
  }
  const supabase = await createClient();
  const origin = await getAppOrigin();
  const redirectTo = origin ? `${origin}/reset-password` : undefined;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  if (error) {
    return { error: humanizeAuthError(error.message) };
  }
  return { success: true };
}
