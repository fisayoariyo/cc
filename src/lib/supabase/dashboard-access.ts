import 'server-only';

import { cache } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  VIEWER_HEADER_NAMES,
  decodeViewerHeaderValue,
} from '@/lib/supabase/viewer-headers';

import type { AgentViewer } from '@/lib/agent-viewer-types';

export type ViewerContext = AgentViewer;

export const getViewerContext = cache(async (): Promise<ViewerContext | null> => {
  const requestHeaders = await headers();
  const headerUserId = requestHeaders.get(VIEWER_HEADER_NAMES.userId);

  if (headerUserId) {
    return {
      userId: headerUserId,
      email: decodeViewerHeaderValue(requestHeaders.get(VIEWER_HEADER_NAMES.email)),
      fullName: decodeViewerHeaderValue(requestHeaders.get(VIEWER_HEADER_NAMES.fullName)),
      role: decodeViewerHeaderValue(requestHeaders.get(VIEWER_HEADER_NAMES.role)),
      status: decodeViewerHeaderValue(requestHeaders.get(VIEWER_HEADER_NAMES.status)),
      onboardingPaid: requestHeaders.get(VIEWER_HEADER_NAMES.onboardingPaid) === '1',
      photoUrl: decodeViewerHeaderValue(requestHeaders.get(VIEWER_HEADER_NAMES.photoUrl)),
      phone: decodeViewerHeaderValue(requestHeaders.get(VIEWER_HEADER_NAMES.phone)),
      agentState: decodeViewerHeaderValue(requestHeaders.get(VIEWER_HEADER_NAMES.agentState)),
      agentLga: decodeViewerHeaderValue(requestHeaders.get(VIEWER_HEADER_NAMES.agentLga)),
    };
  }

  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, status, onboarding_paid, photo_url, phone_number, agent_state, agent_lga')
    .eq('id', user.id)
    .maybeSingle();

  return {
    userId: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? null,
    role: profile?.role ?? null,
    status: profile?.status ?? null,
    onboardingPaid: Boolean(profile?.onboarding_paid),
    photoUrl: profile?.status === 'verified' ? profile?.photo_url ?? null : null,
    phone: profile?.phone_number ?? null,
    agentState: profile?.agent_state ?? null,
    agentLga: profile?.agent_lga ?? null,
  };
});

export const hasClientService = cache(async (userId: string, service: 'travel' | 'real_estate' | 'construction') => {
  const supabase = await createClient();
  if (!supabase) return false;
  const { data } = await supabase
    .from('client_services')
    .select('id')
    .eq('user_id', userId)
    .eq('service', service)
    .maybeSingle();

  return Boolean(data);
});

export async function requireClientDashboardAccess({
  service,
  loginNext,
}: {
  service: 'travel' | 'real_estate' | 'construction';
  loginNext: string;
}) {
  const viewer = await getViewerContext();
  if (!viewer) redirect(`/login?next=${loginNext}`);
  if (viewer.role === 'admin') redirect('/admin');
  if (viewer.role === 'agent') redirect('/agent');

  const hasService = await hasClientService(viewer.userId, service);
  if (!hasService) redirect('/dashboard');

  return viewer;
}
