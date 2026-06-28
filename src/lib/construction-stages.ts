export const CONSTRUCTION_STAGES = [
  { value: 'inquiry_received', label: 'Inquiry Received' },
  { value: 'consultation_scheduled', label: 'Consultation Scheduled' },
  { value: 'quotation_sent', label: 'Quotation Sent' },
  { value: 'agreement_signed', label: 'Agreement Signed' },
  { value: 'construction_in_progress', label: 'Construction in Progress' },
  { value: 'milestone_update', label: 'Milestone Update' },
  { value: 'nearing_completion', label: 'Nearing Completion' },
  { value: 'handover_complete', label: 'Handover Complete' },
] as const;

export function constructionStageLabel(stage: string | null | undefined): string {
  if (!stage) return 'Unknown';
  return CONSTRUCTION_STAGES.find((s) => s.value === stage)?.label ?? stage.replace(/_/g, ' ');
}
