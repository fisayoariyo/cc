'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { humanizeAuthError } from '@/lib/supabase/auth-errors';
import { getAgentPostAuthPath } from '@/lib/agent-onboarding';

export type SignInState = { error: string } | null;

function safeNextPath(raw: string | undefined): string | null {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return null;
  return raw;
}

export async function signIn(prevState: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const next = safeNextPath(String(formData.get('next') ?? ''));
  const intent = String(formData.get('intent') ?? '').trim();

  if (!email) {
    return { error: 'Please enter your email address.' };
  }
  if (!password) {
    return { error: 'Please enter your password.' };
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: 'Authentication is not configured. Check environment variables.' };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: 'Authentication is not configured. Check environment variables.' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: humanizeAuthError(error.message) };
  }

  if (!data.user) {
    return { error: 'Could not sign in. Please try again.' };
  }

  let profile: { role?: string | null; status?: string | null; onboarding_step?: string | null } | null =
    null;
  const fullProfile = await supabase
    .from('profiles')
    .select('role, status, onboarding_step')
    .eq('id', data.user.id)
    .maybeSingle();
  if (fullProfile.error) {
    // Safety net for DBs missing the latest onboarding columns (migration 015+).
    const coreProfile = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', data.user.id)
      .maybeSingle();
    if (coreProfile.error || !coreProfile.data?.role) {
      await supabase.auth.signOut();
      return { error: 'Your account profile is incomplete. Contact support.' };
    }
    profile = coreProfile.data;
  } else {
    if (!fullProfile.data?.role) {
      await supabase.auth.signOut();
      return { error: 'Your account profile is incomplete. Contact support.' };
    }
    profile = fullProfile.data;
  }

  const role = profile.role;

  if (role === 'admin' && intent !== 'admin') {
    await supabase.auth.signOut();
    return { error: 'Admin accounts must sign in at /admin/login.' };
  }

  if (intent === 'admin' && role !== 'admin') {
    await supabase.auth.signOut();
    return { error: 'This account does not have admin access. Use an admin account to continue.' };
  }

  const agentPath = () =>
    getAgentPostAuthPath({
      status: profile?.status ?? 'pending',
      onboarding_step: profile?.onboarding_step ?? 'location',
    });

  if (next) {
    if (role === 'agent') {
      if (next.startsWith('/agent') && profile.status === 'verified') {
        redirect(next);
      }
      redirect(agentPath());
    }
    if (intent === 'admin' && role === 'admin') {
      redirect(next.startsWith('/admin') ? next : '/admin');
    }
    redirect(next);
  }
  if (role === 'admin') {
    redirect('/admin');
  }
  if (role === 'agent') {
    redirect(agentPath());
  }
  redirect('/dashboard');
}
