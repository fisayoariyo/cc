import 'server-only';

import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export type ViewerContext = {
  userId: string;
  email: string | null;
  fullName: string | null;
  role: string | null;
  status: string | null;
  onboardingPaid: boolean;
};

export const getViewerContext = cache(async (): Promise<ViewerContext | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, status, onboarding_paid')
    .eq('id', user.id)
    .maybeSingle();

  return {
    userId: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? null,
    role: profile?.role ?? null,
    status: profile?.status ?? null,
    onboardingPaid: Boolean(profile?.onboarding_paid),
  };
});

export const hasClientService = cache(async (userId: string, service: 'travel' | 'real_estate' | 'construction') => {
  const supabase = await createClient();
  const { data } = await supabase
    .from('client_services')
    .select('id')
    .eq('user_id', userId)
    .eq('service', service)
    .maybeSingle();

  return Boolean(data);
});

