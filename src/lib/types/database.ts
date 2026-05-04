/** Mirrors the live public schema export; travel stages are stored as text keys. */

export type UserRole = 'admin' | 'agent' | 'client';
export type ClientServiceType = 'travel' | 'real_estate' | 'construction';

export type PropertyStatus =
  | 'draft'
  | 'pending'
  | 'edits_requested'
  | 'active'
  | 'rejected'
  | 'sold'
  | 'archived';

export type PropertyCategory = 'Buy' | 'Rent' | 'Short-let';

export type TravelStageKey = string;

export type InquiryStatus = 'new' | 'actioned' | 'archived';

export type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  status: string | null;
  onboarding_paid: boolean | null;
  phone_number: string | null;
  passport_number: string | null;
  created_at: string;
  updated_at: string;
};

export type PropertyRow = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  location: string;
  category: PropertyCategory | null;
  property_type: string | null;
  images: string[] | null;
  amenities: string[] | null;
  status: PropertyStatus;
  admin_notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  is_featured: boolean | null;
  agent_id: string | null;
  created_at: string;
  updated_at: string;
};

export type ClientServiceRow = {
  id: string;
  user_id: string;
  service: ClientServiceType;
  created_at: string;
};

export type SavedSearchRow = {
  id: string;
  user_id: string;
  service: ClientServiceType;
  title: string;
  query: Record<string, unknown>;
  created_at: string;
};

export type FavoritePropertyRow = {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
};

export type ComparePropertyRow = {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
};

export type TravelApplicationRow = {
  id: string;
  client_id: string | null;
  service_type: string | null;
  destination: string | null;
  current_stage: TravelStageKey;
  notes: string | null;
  deletion_request_status: 'pending' | 'rejected' | null;
  deletion_requested_at: string | null;
  deletion_requested_by: string | null;
  deletion_reviewed_at: string | null;
  deletion_reviewed_by: string | null;
  created_at: string;
  updated_at: string;
};

export type InquiryRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  inquiry_type: string;
  message: string;
  channel: string;
  status: InquiryStatus;
  created_at: string;
  updated_at: string;
};

export type ApplicationDocumentRow = {
  id: string;
  application_id: string;
  client_id: string;
  file_path: string;
  document_type: string | null;
  status: string;
  admin_note: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ApplicationStageHistoryRow = {
  id: string;
  application_id: string;
  stage_key: string;
  stage_label: string;
  note_to_client: string | null;
  changed_by: string | null;
  changed_at: string;
};

export type ConstructionProjectRow = {
  id: string;
  client_id: string;
  title: string;
  project_type: string;
  location: string;
  budget_range: string | null;
  timeline: string | null;
  description: string | null;
  current_stage: string;
  status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ConstructionStageHistoryRow = {
  id: string;
  project_id: string;
  stage_key: string;
  stage_label: string;
  note_to_client: string | null;
  changed_by: string | null;
  changed_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  link_url: string | null;
  metadata: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
};

export type CaseMessageVisibility = 'client' | 'internal';

export type CaseMessageRow = {
  id: string;
  inquiry_id: string | null;
  travel_application_id: string | null;
  construction_project_id: string | null;
  sender_id: string | null;
  sender_name: string | null;
  sender_email: string | null;
  body: string;
  visibility: CaseMessageVisibility;
  mentioned_user_ids: string[];
  created_at: string;
};
