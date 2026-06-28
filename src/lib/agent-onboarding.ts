export type AgentOnboardingStep = 'location' | 'documents' | 'details' | 'submitted';

export const AGENT_ONBOARDING_STEPS: AgentOnboardingStep[] = [
  'documents',
  'location',
  'details',
  'submitted',
];

export function isAgentOnboardingComplete(step: string | null | undefined) {
  return step === 'submitted';
}

export type AgentOnboardingProfileSlice = {
  emailConfirmed?: boolean;
  onboarding_step: string | null;
  nin: string | null;
  photo_url: string | null;
  agent_state: string | null;
  agent_lga: string | null;
  agent_address: string | null;
  next_of_kin_name: string | null;
  next_of_kin_phone: string | null;
  next_of_kin_relationship: string | null;
};

/** hashp-style route guard: next incomplete step (identity → location → details). */
export function getAgentOnboardingPath(profile: AgentOnboardingProfileSlice): string {
  if (profile.emailConfirmed === false) return '/agent/onboarding/verify-email';
  if (!profile.nin || !profile.photo_url) return '/agent/onboarding/identity';
  if (!profile.agent_state || !profile.agent_lga) return '/agent/onboarding/location';
  if (
    !profile.agent_address ||
    !profile.next_of_kin_name ||
    !profile.next_of_kin_phone ||
    !profile.next_of_kin_relationship
  ) {
    return '/agent/onboarding/details';
  }
  if (isAgentOnboardingComplete(profile.onboarding_step)) return '/agent/under-review';
  return '/agent/onboarding/details';
}

export function getAgentPostAuthPath(profile: {
  status: string | null;
  onboarding_step: string | null;
  nin?: string | null;
  photo_url?: string | null;
  agent_state?: string | null;
  agent_lga?: string | null;
  agent_address?: string | null;
  next_of_kin_name?: string | null;
  next_of_kin_phone?: string | null;
  next_of_kin_relationship?: string | null;
  emailConfirmed?: boolean;
}): '/agent' | '/agent/under-review' | string {
  if (profile.status === 'verified') return '/agent';
  if (isAgentOnboardingComplete(profile.onboarding_step)) return '/agent/under-review';
  return getAgentOnboardingPath({
    emailConfirmed: profile.emailConfirmed ?? true,
    onboarding_step: profile.onboarding_step,
    nin: profile.nin ?? null,
    photo_url: profile.photo_url ?? null,
    agent_state: profile.agent_state ?? null,
    agent_lga: profile.agent_lga ?? null,
    agent_address: profile.agent_address ?? null,
    next_of_kin_name: profile.next_of_kin_name ?? null,
    next_of_kin_phone: profile.next_of_kin_phone ?? null,
    next_of_kin_relationship: profile.next_of_kin_relationship ?? null,
  });
}
