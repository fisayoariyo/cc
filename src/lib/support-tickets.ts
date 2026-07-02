export const AGENT_SUPPORT_ISSUE_TYPES = [
  'Profile update',
  'Listing issue',
  'Verification',
  'Payment & onboarding',
  'Other',
] as const;

export type AgentSupportIssueType = (typeof AGENT_SUPPORT_ISSUE_TYPES)[number];

/** Charis Consult support lines shown on the agent Help & Support page. */
export const CHARIS_SUPPORT_PHONES = ['0907 641 7113'] as const;

export type SupportTicketStatus = 'pending' | 'resolved';

export function formatSupportTicketDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function supportTicketStatusLabel(status: SupportTicketStatus) {
  return status === 'resolved' ? 'Resolved' : 'Pending';
}
