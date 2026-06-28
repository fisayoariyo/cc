'use server';

import { createClient } from '@/lib/supabase/server';
import { humanizeAuthError } from '@/lib/supabase/auth-errors';

export type OtpSendState = { error: string } | { success: true; email: string } | null;

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

export async function sendAgentPasswordResetOtp(
  prev: OtpSendState,
  formData: FormData,
): Promise<OtpSendState> {
  const email = normalizeEmail(String(formData.get('email') ?? ''));
  if (!email) return { error: 'Please enter your email address.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  const supabase = await createClient();
  if (!supabase) return { error: 'Authentication is not configured. Check environment variables.' };

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });

  if (error) return { error: humanizeAuthError(error.message) };

  return { success: true, email };
}

export async function resendAgentPasswordResetOtp(email: string): Promise<OtpSendState> {
  const normalized = normalizeEmail(email);
  if (!normalized) return { error: 'Email missing. Go back and try again.' };

  const supabase = await createClient();
  if (!supabase) return { error: 'Authentication is not configured. Check environment variables.' };

  const { error } = await supabase.auth.signInWithOtp({
    email: normalized,
    options: { shouldCreateUser: false },
  });

  if (error) return { error: humanizeAuthError(error.message) };
  return { success: true, email: normalized };
}
