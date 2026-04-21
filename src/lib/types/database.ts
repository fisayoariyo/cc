/** Aligns with SQL schema run in Supabase (user_role, property_status, travel_status). */

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

export type TravelStatus =
  | 'application_received'
  | 'document_review'
  | 'documents_incomplete_action_required'
  | 'documents_verified'
  | 'visa_submission_prepared'
  | 'submitted_to_embassy'
  | 'decision_pending'
  | 'approved'
  | 'rejected_next_steps'
  | 'school_selection_in_progress'
  | 'applications_submitted'
  | 'awaiting_admission_decision'
  | 'admission_received_documents_needed'
  | 'visa_application_in_progress'
  | 'visa_approved_travel_planning'
  | 'eligibility_assessment'
  | 'action_required_profile_gaps'
  | 'profile_complete'
  | 'expression_of_interest_filed'
  | 'awaiting_response'
  | 'offer_or_nomination_received'
  | 'visa_or_pr_in_progress'
  | 'inquiry_received'
  | 'itinerary_draft_in_progress'
  | 'itinerary_shared_awaiting_approval'
  | 'itinerary_confirmed'
  | 'bookings_in_progress'
  | 'bookings_confirmed'
  | 'travel_documents_sent'
  | 'request_received'
  | 'fare_options_shared'
  | 'payment_confirmed'
  | 'ticket_issued'
  | 'housing_and_logistics_planning'
  | 'documents_and_profile_complete'
  | 'application_in_progress'
  | 'approved_travel_planning'
  | 'completed';

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
  labels: string[] | null;
  status: PropertyStatus;
  admin_notes: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  is_featured: boolean | null;
  agent_id: string | null;
  created_at: string;
  updated_at: string;
};

export type AgentProfileRow = {
  id: string;
  user_id: string;
  agency_name: string | null;
  registration_number: string | null;
  verification_status: string;
  payment_status: string;
  onboarding_fee_amount: number;
  rejection_reason: string | null;
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
  query: Record<string, string>;
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
  current_stage: TravelStatus;
  notes: string | null;
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
