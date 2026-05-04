export type TravelServiceType =
  | 'visa'
  | 'education'
  | 'tourism'
  | 'flights'
  | 'immigration'
  | 'relocation';

export type TravelStageOption = { value: string; label: string };

export type TravelServiceChoice = {
  value: 'education' | 'immigration' | 'tourism';
  label: string;
  shortLabel: string;
  prompt: string;
  description: string;
  destinationLabel: string;
  notesPlaceholder: string;
  documents: string[];
};

const TRAVEL_SERVICE_LABELS: Record<TravelServiceType, string> = {
  visa: 'Visa Support',
  education: 'Education Abroad',
  tourism: 'Leisure Travel',
  flights: 'Flight Booking',
  immigration: 'Work Abroad',
  relocation: 'Relocation Support',
};

export const TRAVEL_SERVICE_OPTIONS: TravelServiceChoice[] = [
  {
    value: 'education',
    label: 'Education Abroad',
    shortLabel: 'Edu',
    prompt: 'Study',
    description: 'Apply for admission, scholarship or funding support, then move into visa processing.',
    destinationLabel: 'Preferred country or school destination',
    notesPlaceholder: 'Tell us your current study level, target school, course, or timeline.',
    documents: [
      'International Passport',
      'Three letters of recommendation',
      'Transcript',
      'CV',
      'Letter of Intent / Statement of Purpose',
      'WAEC Result',
      'University Certificate',
    ],
  },
  {
    value: 'immigration',
    label: 'Work Abroad',
    shortLabel: 'Work',
    prompt: 'Work',
    description: 'Share your CV and profile details so the team can start job applications and guide you to visa stage.',
    destinationLabel: 'Preferred country or work destination',
    notesPlaceholder: 'Tell us your role, industry, years of experience, or preferred country.',
    documents: [
      'CV',
      'Police character report',
      'Passport data page',
      'References (based on demand)',
      'Medical report',
    ],
  },
  {
    value: 'tourism',
    label: 'Leisure Travel',
    shortLabel: 'Leisure',
    prompt: 'Leisure',
    description: 'Plan your itinerary first, then prepare the right visa documents for your chosen destination.',
    destinationLabel: 'Where would you like to go?',
    notesPlaceholder: 'Tell us your travel dates, trip style, budget, or anything you already know.',
    documents: [
      'Passport data page',
      'Bank statement',
      'Proof of Return (proof of employment, studentship, landed property, or business)',
      'Police character report',
      'Yellow card (for an African country)',
      'Medical report',
    ],
  },
];

const EDUCATION_STAGES: TravelStageOption[] = [
  { value: 'application_started', label: 'Application Started' },
  { value: 'documents_received', label: 'Documents Received' },
  { value: 'profile_review', label: 'Profile Review' },
  { value: 'school_application_in_progress', label: 'School Application in Progress' },
  { value: 'scholarship_or_funding_review', label: 'Scholarship / Funding Review' },
  { value: 'offer_received', label: 'Offer Received' },
  { value: 'visa_preparation', label: 'Visa Preparation' },
  { value: 'visa_submitted', label: 'Visa Submitted' },
  { value: 'visa_decision', label: 'Visa Decision' },
  { value: 'completed', label: 'Completed' },
];

const WORK_STAGES: TravelStageOption[] = [
  { value: 'application_started', label: 'Application Started' },
  { value: 'documents_received', label: 'Documents Received' },
  { value: 'profile_review', label: 'Profile Review' },
  { value: 'job_application_in_progress', label: 'Job Application in Progress' },
  { value: 'offer_received', label: 'Offer Received' },
  { value: 'visa_preparation', label: 'Visa Preparation' },
  { value: 'visa_submitted', label: 'Visa Submitted' },
  { value: 'visa_decision', label: 'Visa Decision' },
  { value: 'completed', label: 'Completed' },
];

const LEISURE_STAGES: TravelStageOption[] = [
  { value: 'application_started', label: 'Application Started' },
  { value: 'documents_received', label: 'Documents Received' },
  { value: 'itinerary_planning', label: 'Itinerary Planning' },
  { value: 'itinerary_confirmed', label: 'Itinerary Confirmed' },
  { value: 'visa_preparation', label: 'Visa Preparation' },
  { value: 'visa_submitted', label: 'Visa Submitted' },
  { value: 'visa_decision', label: 'Visa Decision' },
  { value: 'completed', label: 'Completed' },
];

const LEGACY_VISA_STAGES: TravelStageOption[] = [
  { value: 'application_received', label: 'Application Received' },
  { value: 'document_review', label: 'Document Review' },
  { value: 'documents_verified', label: 'Documents Verified' },
  { value: 'visa_submission_prepared', label: 'Visa Submission Prepared' },
  { value: 'submitted_to_embassy', label: 'Submitted to Embassy/Consulate' },
  { value: 'decision_pending', label: 'Decision Pending' },
  { value: 'approved', label: 'Approved' },
];

const LEGACY_FLIGHT_STAGES: TravelStageOption[] = [
  { value: 'request_received', label: 'Request Received' },
  { value: 'fare_options_shared', label: 'Fare Options Shared' },
  { value: 'payment_confirmed', label: 'Payment Confirmed' },
  { value: 'ticket_issued', label: 'Ticket Issued' },
];

const LEGACY_RELOCATION_STAGES: TravelStageOption[] = [
  { value: 'application_received', label: 'Application Received' },
  { value: 'eligibility_assessment', label: 'Eligibility Assessment' },
  { value: 'documents_and_profile_complete', label: 'Documents & Profile Complete' },
  { value: 'application_in_progress', label: 'Application in Progress' },
  { value: 'approved_travel_planning', label: 'Approved - Travel Planning' },
  { value: 'completed', label: 'Completed' },
];

export const TRAVEL_STAGE_MAP: Record<TravelServiceType, TravelStageOption[]> = {
  visa: LEGACY_VISA_STAGES,
  education: EDUCATION_STAGES,
  tourism: LEISURE_STAGES,
  flights: LEGACY_FLIGHT_STAGES,
  immigration: WORK_STAGES,
  relocation: LEGACY_RELOCATION_STAGES,
};

export function normalizeTravelServiceType(raw: string | null | undefined): TravelServiceType {
  const value = (raw ?? '').trim().toLowerCase();

  if (value === 'study' || value === 'edu' || value === 'school') return 'education';
  if (value === 'work' || value === 'job') return 'immigration';
  if (value === 'leisure' || value === 'vacation' || value === 'holiday') return 'tourism';

  if (value in TRAVEL_STAGE_MAP) return value as TravelServiceType;
  return 'education';
}

export function getStageOptions(serviceType: string | null | undefined): TravelStageOption[] {
  return TRAVEL_STAGE_MAP[normalizeTravelServiceType(serviceType)];
}

export function getStageLabel(serviceType: string | null | undefined, stage: string | null | undefined): string {
  if (!stage) return 'Unknown';
  const option = getStageOptions(serviceType).find((item) => item.value === stage);
  return option?.label ?? stage.replace(/_/g, ' ');
}

export function firstStageForService(serviceType: string | null | undefined): string {
  return getStageOptions(serviceType)[0]?.value ?? 'application_started';
}

export function getTravelServiceLabel(serviceType: string | null | undefined): string {
  return TRAVEL_SERVICE_LABELS[normalizeTravelServiceType(serviceType)];
}

export function getTravelServiceChoice(serviceType: string | null | undefined): TravelServiceChoice {
  const normalized = normalizeTravelServiceType(serviceType);
  return (
    TRAVEL_SERVICE_OPTIONS.find((option) => option.value === normalized) ??
    TRAVEL_SERVICE_OPTIONS[0]
  );
}

export function getNextStageOption(serviceType: string | null | undefined, currentStage: string | null | undefined) {
  const options = getStageOptions(serviceType);
  if (!currentStage) return options[0] ?? null;

  const currentIndex = options.findIndex((item) => item.value === currentStage);
  if (currentIndex === -1) return options[0] ?? null;
  return options[currentIndex + 1] ?? null;
}

export function isTravelApplicationFinished(
  serviceType: string | null | undefined,
  currentStage: string | null | undefined,
): boolean {
  if (!currentStage) return false;

  const normalizedStage = currentStage.trim().toLowerCase();
  if (normalizedStage === 'completed' || normalizedStage === 'approved' || normalizedStage === 'ticket_issued') {
    return true;
  }

  return getNextStageOption(serviceType, currentStage) === null;
}

export function getTravelTimelineSteps(serviceType: string | null | undefined) {
  return getStageOptions(serviceType).slice(0, 5);
}

export function getDocumentStatusLabel(status: string | null | undefined): string {
  const normalized = (status ?? '').trim().toLowerCase();
  if (!normalized) return 'Pending review';
  if (normalized === 'accepted' || normalized === 'approved') return 'Approved by admin';
  if (normalized === 'rejected') return 'Not approved';
  if (normalized === 'resubmit_required') return 'New copy requested';
  if (normalized === 'under_review') return 'Under review';
  return normalized.replace(/_/g, ' ');
}

export function isDocumentApproved(status: string | null | undefined): boolean {
  const normalized = (status ?? '').trim().toLowerCase();
  return normalized === 'accepted' || normalized === 'approved';
}

export function getNextStepGuidance(serviceType: string | null | undefined, currentStage: string | null | undefined) {
  const normalized = normalizeTravelServiceType(serviceType);
  const stage = (currentStage ?? '').trim().toLowerCase();

  if (stage === 'application_started') {
    return 'Upload the first set of documents so our team can review your case and move you to the next stage.';
  }
  if (stage === 'documents_received') {
    return 'Your documents are in with the team. We will review them and confirm what is needed next.';
  }
  if (stage === 'profile_review') {
    return 'We are reviewing your profile details and matching them to the best next processing step.';
  }
  if (stage === 'visa_preparation') {
    return 'Start gathering visa-ready documents now so there is no delay once the team requests final submission.';
  }
  if (stage === 'visa_submitted') {
    return 'Your application has moved to visa submission. Watch for updates from the team and embassy decision notices.';
  }
  if (stage === 'visa_decision') {
    return 'We are waiting on the visa outcome. Keep checking updates in case the team requests one final action.';
  }

  if (normalized === 'education') {
    if (stage === 'school_application_in_progress') {
      return 'Our team is preparing or submitting your school application. Keep your academic documents ready in case we request one more file.';
    }
    if (stage === 'scholarship_or_funding_review') {
      return 'We are checking scholarship or funding opportunities connected to your study application.';
    }
    if (stage === 'offer_received') {
      return 'An offer is in. The next step is visa preparation, so keep your passport and financial documents ready.';
    }
  }

  if (normalized === 'immigration') {
    if (stage === 'job_application_in_progress') {
      return 'Our team is working through job applications. Keep your CV and credentials updated in case we need a revised version.';
    }
    if (stage === 'offer_received') {
      return 'A work offer has been received. The next step is visa preparation and supporting document checks.';
    }
  }

  if (normalized === 'tourism') {
    if (stage === 'itinerary_planning') {
      return 'We are shaping your itinerary. Keep your preferred dates, budget, and accommodation details nearby.';
    }
    if (stage === 'itinerary_confirmed') {
      return 'Your itinerary is confirmed. The next step is visa preparation using the destination-specific checklist.';
    }
  }

  return 'We will update this application as the next step becomes available.';
}
