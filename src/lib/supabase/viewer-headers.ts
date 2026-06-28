export const VIEWER_HEADER_NAMES = {
  userId: 'x-viewer-id',
  email: 'x-viewer-email',
  fullName: 'x-viewer-full-name',
  role: 'x-viewer-role',
  status: 'x-viewer-status',
  onboardingPaid: 'x-viewer-onboarding-paid',
  photoUrl: 'x-viewer-photo-url',
  phone: 'x-viewer-phone',
  agentState: 'x-viewer-agent-state',
  agentLga: 'x-viewer-agent-lga',
} as const;

export function encodeViewerHeaderValue(value: string | null | undefined) {
  return value ? encodeURIComponent(value) : '';
}

export function decodeViewerHeaderValue(value: string | null) {
  if (!value) return null;

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
