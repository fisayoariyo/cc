import type { AgentViewer } from '@/lib/agent-viewer-types';

export const AGENT_LISTING_UNLOCK_NOTIFICATION_TYPE = 'agent_listing_unlocked';

export const AGENT_LISTING_UNLOCK_TITLE = 'You can now make a listing';
export const AGENT_LISTING_UNLOCK_BODY = 'Payment received. Your onboarding fee has been confirmed.';

export function agentCanManageListings(
  viewer: Pick<AgentViewer, 'role' | 'status' | 'onboardingPaid'>,
) {
  return viewer.role === 'agent' && viewer.status === 'verified' && viewer.onboardingPaid;
}
