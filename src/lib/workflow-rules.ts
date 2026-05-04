import type { PropertyStatus } from '@/lib/types/database';

export const LISTING_STATUS_VALUES: PropertyStatus[] = [
  'draft',
  'pending',
  'edits_requested',
  'active',
  'rejected',
  'sold',
  'archived',
];

export const LISTING_AGENT_TRANSITIONS: Record<PropertyStatus, PropertyStatus[]> = {
  draft: ['draft', 'pending'],
  pending: ['pending', 'archived'],
  edits_requested: ['draft', 'pending', 'edits_requested'],
  active: ['active', 'sold', 'archived'],
  rejected: ['draft', 'pending', 'rejected'],
  sold: ['sold', 'archived'],
  archived: ['archived'],
};
