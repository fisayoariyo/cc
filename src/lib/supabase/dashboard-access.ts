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

async function loadProfileFromDb(userId: string) {
  const supabase = await createClient();
  if (!supabase) return null;

  const fullProfile = await supabase
    .from('profiles')
    .select('full_name, role, status, onboarding_paid, photo_url, phone_number, agent_state, agent_lga')
    .eq('id', userId)
    .maybeSingle();

  if (fullProfile.error) {
    // Mirror middleware fallback when optional onboarding columns are not migrated yet.
    const coreProfile = await supabase
      .from('profiles')
      .select('full_name, role, status')
      .eq('id', userId)
      .maybeSingle();

    if (coreProfile.error || !coreProfile.data?.role) {
      return null;
    }

    return {
      ...coreProfile.data,
      onboarding_paid: null,
      photo_url: null,
      phone_number: null,
      agent_state: null,
      agent_lga: null,
    };
  }

  if (!fullProfile.data?.role) {
    return null;
  }

  return fullProfile.data;
}

function viewerFromProfile(
  user: { id: string; email?: string | null },
  profile: NonNullable<Awaited<ReturnType<typeof loadProfileFromDb>>>,
): ViewerContext {
  return {
    userId: user.id,
    email: user.email ?? null,
    fullName: profile.full_name ?? null,
    role: profile.role ?? null,
    status: profile.status ?? null,
    onboardingPaid: Boolean(profile.onboarding_paid),
    photoUrl: profile.status === 'verified' ? profile.photo_url ?? null : null,
    phone: profile.phone_number ?? null,
    agentState: profile.agent_state ?? null,
    agentLga: profile.agent_lga ?? null,
  };
}

export const getViewerContext = cache(async (): Promise<ViewerContext | null> => {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const requestHeaders = await headers();
  const headerUserId = requestHeaders.get(VIEWER_HEADER_NAMES.userId);

  // Reject spoofed viewer headers on API routes and any request where headers
  // do not match the verified session user.
  if (headerUserId && headerUserId !== user.id) {
    return null;
  }

  const profile = await loadProfileFromDb(user.id);
  if (!profile) return null;

  // Middleware-populated headers are a display optimization only after session
  // verification; role and status always come from the database.
  if (headerUserId === user.id) {
    return {
      ...viewerFromProfile(user, profile),
      fullName: decodeViewerHeaderValue(requestHeaders.get(VIEWER_HEADER_NAMES.fullName)) ?? profile.full_name ?? null,
      photoUrl:
        profile.status === 'verified'
          ? decodeViewerHeaderValue(requestHeaders.get(VIEWER_HEADER_NAMES.photoUrl)) ??
            profile.photo_url ??
            null
          : null,
      phone: decodeViewerHeaderValue(requestHeaders.get(VIEWER_HEADER_NAMES.phone)) ?? profile.phone_number ?? null,
      agentState: decodeViewerHeaderValue(requestHeaders.get(VIEWER_HEADER_NAMES.agentState)) ?? profile.agent_state ?? null,
      agentLga: decodeViewerHeaderValue(requestHeaders.get(VIEWER_HEADER_NAMES.agentLga)) ?? profile.agent_lga ?? null,
    };
  }

  return viewerFromProfile(user, profile);
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
