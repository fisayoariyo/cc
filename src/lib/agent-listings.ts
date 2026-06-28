import type { PropertyRow, PropertyStatus } from '@/lib/types/database';

export function formatListingDisplayId(id: string, createdAt: string) {
  const year = new Date(createdAt).getFullYear();
  const token = id.replace(/-/g, '').slice(0, 6).toUpperCase();
  return `CHR-${token.slice(0, 2)}-${year}-${token}`;
}

export function formatListingDate(value: string) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export type ListingStatusTone = 'success' | 'pending' | 'danger' | 'muted';

export function listingStatusMeta(status: PropertyStatus) {
  if (status === 'active' || status === 'sold') {
    return { label: status === 'sold' ? 'Sold' : 'Live', tone: 'success' as ListingStatusTone, pending: false };
  }
  if (status === 'pending' || status === 'edits_requested') {
    return { label: 'Pending review', tone: 'pending' as ListingStatusTone, pending: true };
  }
  if (status === 'draft') {
    return { label: 'Draft', tone: 'pending' as ListingStatusTone, pending: true };
  }
  if (status === 'rejected') {
    return { label: 'Rejected', tone: 'danger' as ListingStatusTone, pending: true };
  }
  return { label: 'Archived', tone: 'muted' as ListingStatusTone, pending: false };
}

export function listingCoverImage(row: PropertyRow) {
  const first = row.images?.[0];
  return first && first.trim() ? first : null;
}

export function summarizeAgentListings(rows: PropertyRow[]) {
  const active = rows.filter((row) => row.status === 'active').length;
  const pending = rows.filter((row) => row.status === 'pending' || row.status === 'edits_requested').length;
  const drafts = rows.filter((row) => row.status === 'draft' || row.status === 'rejected').length;
  const live = rows.filter((row) => row.status === 'active' || row.status === 'sold').length;
  const progress = rows.length ? Math.round((live / rows.length) * 100) : 0;

  return { active, pending, drafts, live, total: rows.length, progress };
}
