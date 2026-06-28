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

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, status, onboarding_step')
    .eq('id', data.user.id)
    .maybeSingle();

  const role = profile?.role ?? 'client';

  if (role === 'admin' && intent !== 'admin') {
    await supabase.auth.signOut();
    return { error: 'Admin accounts must sign in at /admin/login.' };
  }

  if (intent === 'admin' && role !== 'admin') {
    await supabase.auth.signOut();
    return { error: 'This account does not have admin access. Use an admin account to continue.' };
  }

  if (next) {
    if (role === 'agent') {
      redirect(getAgentPostAuthPath(profile ?? { status: 'pending', onboarding_step: 'location' }));
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
    redirect(getAgentPostAuthPath(profile ?? { status: 'pending', onboarding_step: 'location' }));
  }
  redirect('/dashboard');
}
