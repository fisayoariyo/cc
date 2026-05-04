import { createClient } from '@/lib/supabase/server';
import type { CaseMessageRow } from '@/lib/types/database';

const CASE_MESSAGE_COLUMNS =
  'id, inquiry_id, travel_application_id, construction_project_id, sender_id, sender_name, sender_email, body, visibility, mentioned_user_ids, created_at';

export async function getCaseMessagesForInquiries(
  inquiryIds: string[],
): Promise<Record<string, CaseMessageRow[]>> {
  if (!inquiryIds.length) return {};
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('case_messages')
    .select(CASE_MESSAGE_COLUMNS)
    .in('inquiry_id', inquiryIds)
    .order('created_at', { ascending: true });
  if (error) {
    console.error('getCaseMessagesForInquiries', error.message);
    return {};
  }

  const grouped: Record<string, CaseMessageRow[]> = {};
  for (const row of (data ?? []) as CaseMessageRow[]) {
    if (!row.inquiry_id) continue;
    if (!grouped[row.inquiry_id]) grouped[row.inquiry_id] = [];
    grouped[row.inquiry_id].push(row);
  }
  return grouped;
}

export async function getCaseMessagesForTravelApplications(
  applicationIds: string[],
): Promise<Record<string, CaseMessageRow[]>> {
  if (!applicationIds.length) return {};
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('case_messages')
    .select(CASE_MESSAGE_COLUMNS)
    .in('travel_application_id', applicationIds)
    .order('created_at', { ascending: true });
  if (error) {
    console.error('getCaseMessagesForTravelApplications', error.message);
    return {};
  }

  const grouped: Record<string, CaseMessageRow[]> = {};
  for (const row of (data ?? []) as CaseMessageRow[]) {
    if (!row.travel_application_id) continue;
    if (!grouped[row.travel_application_id]) grouped[row.travel_application_id] = [];
    grouped[row.travel_application_id].push(row);
  }
  return grouped;
}
