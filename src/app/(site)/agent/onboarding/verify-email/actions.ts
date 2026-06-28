'use server';

import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { humanizeAuthError } from '@/lib/supabase/auth-errors';

export type VerifyEmailActionState = { error: string } | { ok: true } | null;

export async function resendAgentSignupOtp(): Promise<VerifyEmailActionState> {
  const viewer = await getViewerContext();
  if (!viewer?.email || viewer.role !== 'agent') return { error: 'Not allowed.' };

  const supabase = await createClient();
  if (!supabase) return { error: 'Configuration missing. Please contact support.' };

  const { error } = await supabase.auth.resend({ type: 'signup', email: viewer.email });
  if (error) return { error: humanizeAuthError(error.message) };
  return { ok: true };
}
