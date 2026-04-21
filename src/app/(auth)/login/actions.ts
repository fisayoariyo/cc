'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { humanizeAuthError } from '@/lib/supabase/auth-errors';

export type SignInState = { error: string } | null;

function safeNextPath(raw: string | undefined): string | null {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return null;
  return raw;
}

export async function signIn(prevState: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const next = safeNextPath(String(formData.get('next') ?? ''));

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
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle();

  const role = profile?.role ?? 'client';

  if (next) {
    redirect(next);
  }
  if (role === 'admin') {
    redirect('/admin');
  }
  if (role === 'agent') {
    redirect('/agent');
  }
  redirect('/dashboard');
}
