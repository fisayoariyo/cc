export type TravelServiceType =
  | 'visa'
  | 'education'
  | 'tourism'
  | 'flights'
  | 'immigration'
  | 'relocation';

export type TravelStageOption = { value: string; label: string };

export const TRAVEL_SERVICE_OPTIONS: Array<{ value: TravelServiceType; label: string }> = [
  { value: 'visa', label: 'Visa Advisory' },
  { value: 'education', label: 'Educational Advancements' },
  { value: 'tourism', label: 'Tourism & Travel Planning' },
  { value: 'flights', label: 'Flight Reservations' },
  { value: 'immigration', label: 'Work & Immigration Pathways' },
  { value: 'relocation', label: 'Relocation & Specialized Travel' },
];

export const TRAVEL_STAGE_MAP: Record<TravelServiceType, TravelStageOption[]> = {
  visa: [
    { value: 'application_received', label: 'Application Received' },
    { value: 'document_review', label: 'Document Review' },
    { value: 'documents_incomplete_action_required', label: 'Documents Incomplete - Action Required' },
    { value: 'documents_verified', label: 'Documents Verified' },
    { value: 'visa_submission_prepared', label: 'Visa Submission Prepared' },
    { value: 'submitted_to_embassy', label: 'Submitted to Embassy/Consulate' },
    { value: 'decision_pending', label: 'Decision Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected_next_steps', label: 'Rejected - Next Steps Available' },
  ],
  education: [
    { value: 'application_received', label: 'Application Received' },
    { value: 'school_selection_in_progress', label: 'School Selection in Progress' },
    { value: 'applications_submitted', label: 'Application to Institution(s) Submitted' },
    { value: 'awaiting_admission_decision', label: 'Awaiting Admission Decision' },
    { value: 'admission_received_documents_needed', label: 'Admission Received - Documents Needed' },
    { value: 'visa_application_in_progress', label: 'Visa Application in Progress' },
    { value: 'visa_approved_travel_planning', label: 'Visa Approved - Travel Planning' },
    { value: 'completed', label: 'Completed' },
  ],
  immigration: [
    { value: 'application_received', label: 'Application Received' },
    { value: 'eligibility_assessment', label: 'Eligibility Assessment' },
    { value: 'action_required_profile_gaps', label: 'Action Required - Profile Gaps' },
    { value: 'profile_complete', label: 'Profile Complete' },
    { value: 'expression_of_interest_filed', label: 'Expression of Interest / Job Application Filed' },
    { value: 'awaiting_response', label: 'Awaiting Response' },
    { value: 'offer_or_nomination_received', label: 'Offer/Nomination Received' },
    { value: 'visa_or_pr_in_progress', label: 'Visa/PR Application in Progress' },
    { value: 'approved', label: 'Approved' },
  ],
  tourism: [
    { value: 'inquiry_received', label: 'Inquiry Received' },
    { value: 'itinerary_draft_in_progress', label: 'Itinerary Draft in Progress' },
    { value: 'itinerary_shared_awaiting_approval', label: 'Itinerary Shared - Awaiting Approval' },
    { value: 'itinerary_confirmed', label: 'Itinerary Confirmed' },
    { value: 'bookings_in_progress', label: 'Bookings in Progress' },
    { value: 'bookings_confirmed', label: 'Bookings Confirmed' },
    { value: 'travel_documents_sent', label: 'Travel Documents Sent' },
    { value: 'completed', label: 'Completed' },
  ],
  flights: [
    { value: 'request_received', label: 'Request Received' },
    { value: 'fare_options_shared', label: 'Fare Options Shared' },
    { value: 'payment_confirmed', label: 'Payment Confirmed' },
    { value: 'ticket_issued', label: 'Ticket Issued' },
  ],
  relocation: [
    { value: 'application_received', label: 'Application Received' },
    { value: 'eligibility_assessment', label: 'Eligibility Assessment' },
    { value: 'housing_and_logistics_planning', label: 'Housing & Logistics Planning' },
    { value: 'documents_and_profile_complete', label: 'Documents & Profile Complete' },
    { value: 'application_in_progress', label: 'Application in Progress' },
    { value: 'approved_travel_planning', label: 'Approved - Travel Planning' },
    { value: 'completed', label: 'Completed' },
  ],
};

export function normalizeTravelServiceType(raw: string | null | undefined): TravelServiceType {
  const value = (raw ?? '').trim().toLowerCase();
  if (value in TRAVEL_STAGE_MAP) return value as TravelServiceType;
  return 'visa';
}

export function getStageOptions(serviceType: string | null | undefined): TravelStageOption[] {
  return TRAVEL_STAGE_MAP[normalizeTravelServiceType(serviceType)];
}

export function getStageLabel(serviceType: string | null | undefined, stage: string | null | undefined): string {
  if (!stage) return 'Unknown';
  const option = getStageOptions(serviceType).find((s) => s.value === stage);
  return option?.label ?? stage.replace(/_/g, ' ');
}

export function firstStageForService(serviceType: string | null | undefined): string {
  return getStageOptions(serviceType)[0]?.value ?? 'application_received';
}
