'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { humanizeAuthError } from '@/lib/supabase/auth-errors';

async function getAppOrigin(): Promise<string | undefined> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (!host) return undefined;
  const proto = h.get('x-forwarded-proto') ?? 'http';
  return `${proto}://${host}`;
}

export type SignUpState =
  | { error: string }
  | { success: true; needsEmailConfirmation: boolean; role: 'client' | 'agent' }
  | null;

const MIN_PASSWORD_LENGTH = 6;

export async function signUp(prevState: SignUpState, formData: FormData): Promise<SignUpState> {
  const fullName = String(formData.get('full_name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const rawRole = String(formData.get('role') ?? 'client');
  const role = rawRole === 'agent' ? 'agent' : 'client';
  const rawService = String(formData.get('service_interest') ?? 'travel');
  const serviceInterest = rawService === 'real_estate' ? 'real_estate' : 'travel';
  const phone = String(formData.get('phone') ?? '').trim();
  const passportNumber = String(formData.get('passport_number') ?? '').trim();
  const preferredLocation = String(formData.get('preferred_location') ?? '').trim();
  const budgetRange = String(formData.get('budget_range') ?? '').trim();
  const agencyName = String(formData.get('agency_name') ?? '').trim();
  const registrationNumber = String(formData.get('registration_number') ?? '').trim();

  if (!fullName) {
    return { error: 'Please enter your full name.' };
  }
  if (!email) {
    return { error: 'Please enter your email address.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (role === 'agent') {
    if (!phone) return { error: 'Phone is required for agent registration.' };
  } else {
    if (serviceInterest === 'travel') {
      if (!phone) return { error: 'Phone number is required for travel clients.' };
      if (!passportNumber) return { error: 'Passport number is required for travel clients.' };
    }
    if (serviceInterest === 'real_estate') {
      if (!preferredLocation) return { error: 'Preferred location is required for real estate clients.' };
      if (!budgetRange) return { error: 'Budget range is required for real estate clients.' };
    }
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: 'Authentication is not configured. Check environment variables.' };
  }

  const supabase = await createClient();

  const origin = await getAppOrigin();
  const callbackNext = role === 'agent' ? '/agent/under-review' : '/dashboard';
  /** After clicking the Supabase email link, user lands on /auth/callback (must be in Supabase Redirect URLs). */
  const emailRedirectTo = origin ? `${origin}/auth/callback?next=${encodeURIComponent(callbackNext)}` : undefined;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        full_name: fullName,
        role,
        phone,
        passport_number: passportNumber,
        agency_name: agencyName,
        registration_number: registrationNumber,
        service_interest: serviceInterest,
        preferred_location: preferredLocation,
        budget_range: budgetRange,
      },
    },
  });

  if (error) {
    return { error: humanizeAuthError(error.message) };
  }

  if (!data.user) {
    return { error: 'Could not create an account. Please try again.' };
  }

  const needsEmailConfirmation = !data.session;

  if (!needsEmailConfirmation) {
    redirect(role === 'agent' ? '/agent/under-review' : '/dashboard');
  }

  return { success: true, needsEmailConfirmation, role };
}
