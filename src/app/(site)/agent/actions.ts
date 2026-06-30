'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { agentCanManageListings } from '@/lib/agent-listing-access';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { getAgentListingUnlockNotice, getPropertiesForAgent, getPropertyById } from '@/lib/supabase/data';
import type { PropertyStatus } from '@/lib/types/database';
import { LISTING_AGENT_TRANSITIONS, LISTING_STATUS_VALUES } from '@/lib/workflow-rules';

const AGENT_ALLOWED: PropertyStatus[] = LISTING_STATUS_VALUES;

export async function fetchAgentListings() {
  const viewer = await getViewerContext();
  if (!viewer || !agentCanManageListings(viewer)) return [];
  return getPropertiesForAgent(viewer.userId);
}

export async function fetchAgentListingUnlockNotice() {
  const viewer = await getViewerContext();
  if (!viewer) return null;
  return getAgentListingUnlockNotice(viewer.userId);
}

export async function fetchAgentProperty(id: string) {
  const viewer = await getViewerContext();
  if (!viewer || !agentCanManageListings(viewer)) return null;

  const property = await getPropertyById(id);
  if (!property || property.agent_id !== viewer.userId) return null;
  return property;
}

export async function updateAgentListingMeta(input: {
  id: string;
  status: PropertyStatus;
  is_featured: boolean;
}) {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'Not signed in.' };

  const supabase = await createClient();
  if (!supabase) return { error: 'Configuration missing.' };
  if (viewer.status !== 'verified' || !viewer.onboardingPaid) {
    return { error: 'Only verified and paid agents can manage listings.' };
  }
  if (!AGENT_ALLOWED.includes(input.status)) {
    return { error: 'Invalid status.' };
  }

  const { data: listing } = await supabase
    .from('properties')
    .select('status')
    .eq('id', input.id)
    .eq('agent_id', viewer.userId)
    .maybeSingle();
  if (!listing) return { error: 'Listing not found.' };

  const current = listing.status as PropertyStatus;
  const next = input.status;
  const canTransition = LISTING_AGENT_TRANSITIONS[current]?.includes(next) ?? false;
  if (!canTransition) {
    return { error: `Cannot change status from ${current} to ${next}.` };
  }

  const { error } = await supabase
    .from('properties')
    .update({
      status: input.status,
      is_featured: input.is_featured,
    })
    .eq('id', input.id)
    .eq('agent_id', viewer.userId);

  if (error) return { error: error.message };
  revalidatePath('/agent');
  revalidatePath('/properties');
  return { ok: true };
}
