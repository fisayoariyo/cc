import { createClient } from '@/lib/supabase/server';
import { unstable_cache } from 'next/cache';
import type {
  ApplicationDocumentRow,
  ApplicationStageHistoryRow,
  ClientServiceRow,
  ComparePropertyRow,
  ConstructionProjectRow,
  ConstructionStageHistoryRow,
  FavoritePropertyRow,
  InquiryRow,
  NotificationRow,
  ProfileRow,
  PropertyRow,
  SavedSearchRow,
  TravelApplicationRow,
} from '@/lib/types/database';

const PROFILE_COLUMNS =
  'id, full_name, email, role, status, onboarding_paid, phone_number, passport_number, created_at, updated_at';
const PROPERTY_COLUMNS =
  'id, title, description, price, location, category, property_type, images, amenities, labels, status, admin_notes, reviewed_at, reviewed_by, is_featured, agent_id, created_at, updated_at';
const TRAVEL_APPLICATION_COLUMNS =
  'id, client_id, service_type, destination, current_stage, notes, created_at, updated_at';
const INQUIRY_COLUMNS =
  'id, full_name, email, phone, inquiry_type, message, channel, status, created_at, updated_at';
const APPLICATION_DOCUMENT_COLUMNS =
  'id, application_id, client_id, file_path, document_type, status, admin_note, reviewed_at, reviewed_by, created_at, updated_at';
const APPLICATION_STAGE_HISTORY_COLUMNS =
  'id, application_id, stage_key, stage_label, note_to_client, changed_by, changed_at';
const CLIENT_SERVICE_COLUMNS = 'id, user_id, service, created_at';
const FAVORITE_COLUMNS = 'id, user_id, property_id, created_at';
const COMPARE_COLUMNS = 'id, user_id, property_id, created_at';
const SAVED_SEARCH_COLUMNS = 'id, user_id, service, title, query, created_at';
const CONSTRUCTION_PROJECT_COLUMNS =
  'id, client_id, title, project_type, location, budget_range, timeline, description, current_stage, status, created_by, created_at, updated_at';
const CONSTRUCTION_STAGE_HISTORY_COLUMNS =
  'id, project_id, stage_key, stage_label, note_to_client, changed_by, changed_at';
const NOTIFICATION_COLUMNS =
  'id, user_id, title, body, type, link_url, metadata, is_read, created_at';

const getCachedActiveProperties = unstable_cache(
  async (): Promise<PropertyRow[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('properties')
      .select(PROPERTY_COLUMNS)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('getActiveProperties', error.message);
      return [];
    }
    return (data ?? []) as PropertyRow[];
  },
  ['active-properties'],
  { revalidate: 120, tags: ['active-properties'] },
);

export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.error('getProfile', error.message);
    return null;
  }
  return data as ProfileRow | null;
}

export async function getActiveProperties(): Promise<PropertyRow[]> {
  return getCachedActiveProperties();
}

export async function getPropertyById(id: string): Promise<PropertyRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('properties')
    .select(PROPERTY_COLUMNS)
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('getPropertyById', error.message);
    return null;
  }
  return data as PropertyRow | null;
}

export async function getAllPropertiesForAdmin(): Promise<PropertyRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('properties')
    .select(PROPERTY_COLUMNS)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getAllPropertiesForAdmin', error.message);
    return [];
  }
  return (data ?? []) as PropertyRow[];
}

export async function getPropertiesForAgent(agentId: string): Promise<PropertyRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('properties')
    .select(PROPERTY_COLUMNS)
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getPropertiesForAgent', error.message);
    return [];
  }
  return (data ?? []) as PropertyRow[];
}

export async function getTravelApplicationsForClient(clientId: string): Promise<TravelApplicationRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('travel_applications')
    .select(TRAVEL_APPLICATION_COLUMNS)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getTravelApplicationsForClient', error.message);
    return [];
  }
  return (data ?? []) as TravelApplicationRow[];
}

export async function getAllTravelApplicationsForAdmin(): Promise<TravelApplicationRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('travel_applications')
    .select(TRAVEL_APPLICATION_COLUMNS)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getAllTravelApplicationsForAdmin', error.message);
    return [];
  }
  return (data ?? []) as TravelApplicationRow[];
}

/** Agents pending verification: role agent + status pending (your schema uses status text). */
export async function getAllAgentsForAdmin(): Promise<ProfileRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('role', 'agent')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getAllAgentsForAdmin', error.message);
    return [];
  }
  return (data ?? []) as ProfileRow[];
}

export async function getPendingAgents(): Promise<ProfileRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_COLUMNS)
    .eq('role', 'agent')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });
  if (error) {
    console.error('getPendingAgents', error.message);
    return [];
  }
  return (data ?? []) as ProfileRow[];
}

export async function countPropertiesByStatus(): Promise<Record<string, number>> {
  const rows = await getAllPropertiesForAdmin();
  const counts: Record<string, number> = {
    draft: 0,
    pending: 0,
    edits_requested: 0,
    active: 0,
    rejected: 0,
    sold: 0,
    archived: 0,
  };
  for (const r of rows) {
    counts[r.status] = (counts[r.status] ?? 0) + 1;
  }
  return counts;
}

export async function getAllInquiriesForAdmin(): Promise<InquiryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('inquiries')
    .select(INQUIRY_COLUMNS)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getAllInquiriesForAdmin', error.message);
    return [];
  }
  return (data ?? []) as InquiryRow[];
}

export async function getDocumentsForClient(clientId: string): Promise<ApplicationDocumentRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('application_documents')
    .select(APPLICATION_DOCUMENT_COLUMNS)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getDocumentsForClient', error.message);
    return [];
  }
  return (data ?? []) as ApplicationDocumentRow[];
}

export async function getDocumentsForApplications(
  applicationIds: string[],
): Promise<Record<string, ApplicationDocumentRow[]>> {
  if (!applicationIds.length) return {};
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('application_documents')
    .select(APPLICATION_DOCUMENT_COLUMNS)
    .in('application_id', applicationIds);
  if (error) {
    console.error('getDocumentsForApplications', error.message);
    return {};
  }
  const grouped: Record<string, ApplicationDocumentRow[]> = {};
  for (const row of (data ?? []) as ApplicationDocumentRow[]) {
    if (!grouped[row.application_id]) grouped[row.application_id] = [];
    grouped[row.application_id].push(row);
  }
  return grouped;
}

export async function getStageHistoryForApplications(
  applicationIds: string[],
): Promise<Record<string, ApplicationStageHistoryRow[]>> {
  if (!applicationIds.length) return {};
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('application_stage_history')
    .select(APPLICATION_STAGE_HISTORY_COLUMNS)
    .in('application_id', applicationIds)
    .order('changed_at', { ascending: false });
  if (error) {
    console.error('getStageHistoryForApplications', error.message);
    return {};
  }
  const grouped: Record<string, ApplicationStageHistoryRow[]> = {};
  for (const row of (data ?? []) as ApplicationStageHistoryRow[]) {
    if (!grouped[row.application_id]) grouped[row.application_id] = [];
    grouped[row.application_id].push(row);
  }
  return grouped;
}

export async function getClientServices(userId: string): Promise<ClientServiceRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('client_services')
    .select(CLIENT_SERVICE_COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) {
    console.error('getClientServices', error.message);
    return [];
  }
  return (data ?? []) as ClientServiceRow[];
}

export async function getFavoriteProperties(userId: string): Promise<FavoritePropertyRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('favorite_properties')
    .select(FAVORITE_COLUMNS)
    .eq('user_id', userId);
  if (error) {
    console.error('getFavoriteProperties', error.message);
    return [];
  }
  return (data ?? []) as FavoritePropertyRow[];
}

export async function getCompareProperties(userId: string): Promise<ComparePropertyRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('compare_properties')
    .select(COMPARE_COLUMNS)
    .eq('user_id', userId);
  if (error) {
    console.error('getCompareProperties', error.message);
    return [];
  }
  return (data ?? []) as ComparePropertyRow[];
}

export async function getSavedSearches(userId: string): Promise<SavedSearchRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('saved_searches')
    .select(SAVED_SEARCH_COLUMNS)
    .eq('user_id', userId)
    .eq('service', 'real_estate')
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getSavedSearches', error.message);
    return [];
  }
  return (data ?? []) as SavedSearchRow[];
}

export async function getConstructionProjectsForClient(userId: string): Promise<ConstructionProjectRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('construction_projects')
    .select(CONSTRUCTION_PROJECT_COLUMNS)
    .eq('client_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getConstructionProjectsForClient', error.message);
    return [];
  }
  return (data ?? []) as ConstructionProjectRow[];
}

export async function getConstructionProjectsForAdmin(): Promise<ConstructionProjectRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('construction_projects')
    .select(CONSTRUCTION_PROJECT_COLUMNS)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('getConstructionProjectsForAdmin', error.message);
    return [];
  }
  return (data ?? []) as ConstructionProjectRow[];
}

export async function getConstructionHistoryByProjectIds(
  projectIds: string[],
): Promise<Record<string, ConstructionStageHistoryRow[]>> {
  if (!projectIds.length) return {};
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('construction_stage_history')
    .select(CONSTRUCTION_STAGE_HISTORY_COLUMNS)
    .in('project_id', projectIds)
    .order('changed_at', { ascending: false });
  if (error) {
    console.error('getConstructionHistoryByProjectIds', error.message);
    return {};
  }
  const grouped: Record<string, ConstructionStageHistoryRow[]> = {};
  for (const row of (data ?? []) as ConstructionStageHistoryRow[]) {
    if (!grouped[row.project_id]) grouped[row.project_id] = [];
    grouped[row.project_id].push(row);
  }
  return grouped;
}

export async function getNotificationsForUser(userId: string, limit = 8): Promise<NotificationRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('notifications')
    .select(NOTIFICATION_COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    console.error('getNotificationsForUser', error.message);
    return [];
  }
  return (data ?? []) as NotificationRow[];
}
