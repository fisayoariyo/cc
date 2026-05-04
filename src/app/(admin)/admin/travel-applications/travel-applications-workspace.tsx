'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, FileText, MessageSquareText, PlaneTakeoff } from 'lucide-react';
import { postTravelAdminMessage } from '@/app/actions/case-messages';
import { AdminCaseMessageForm } from '@/components/communications/AdminCaseMessageForm';
import { CaseMessagesFeed } from '@/components/communications/CaseMessagesFeed';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';
import { DocumentReviewControls } from './document-review-controls';
import { DeletionRequestControls } from './deletion-request-controls';
import { TravelStageSelect } from './travel-stage-select';
import { getDocumentStatusLabel } from '@/lib/travel-stages';
import type {
  ApplicationDocumentRow,
  ApplicationStageHistoryRow,
  CaseMessageRow,
  TravelApplicationRow,
  TravelStageKey,
} from '@/lib/types/database';

type TravelAdminApplicationItem = TravelApplicationRow & {
  applicantLabel: string;
  serviceLabel: string;
  currentStageLabel: string;
};

type TravelApplicationsWorkspaceProps = {
  applications: TravelAdminApplicationItem[];
  docsByApplication: Record<string, ApplicationDocumentRow[]>;
  historyByApplication: Record<string, ApplicationStageHistoryRow[]>;
  messagesByApplication: Record<string, CaseMessageRow[]>;
};

export function TravelApplicationsWorkspace({
  applications,
  docsByApplication,
  historyByApplication,
  messagesByApplication,
}: TravelApplicationsWorkspaceProps) {
  const [selectedId, setSelectedId] = useState(applications[0]?.id ?? null);

  const selectedApplication = useMemo(
    () => applications.find((application) => application.id === selectedId) ?? applications[0] ?? null,
    [applications, selectedId],
  );

  if (!selectedApplication) {
    return (
      <div className="rounded-2xl border border-border/70 bg-white p-10 text-center text-muted-foreground shadow-sm">
        No applications yet.
      </div>
    );
  }

  const docs = docsByApplication[selectedApplication.id] ?? [];
  const history = historyByApplication[selectedApplication.id] ?? [];
  const messages = messagesByApplication[selectedApplication.id] ?? [];
  const latestHistory = history[0] ?? null;
  const isCompleted = selectedApplication.current_stage === 'completed' || selectedApplication.current_stage === 'approved';
  const hasPendingDeletionRequest = selectedApplication.deletion_request_status === 'pending';

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="space-y-3">
        <div className="rounded-2xl border border-border/70 bg-white p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Applications</p>
          <p className="mt-1 text-[1.55rem] font-semibold tracking-[-0.03em] text-foreground">
            {applications.length} cases
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Select a case to review documents, send updates, or move the stage forward.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm">
          {applications.map((application) => {
            const isActive = application.id === selectedApplication.id;

            return (
              <button
                key={application.id}
                type="button"
                onClick={() => setSelectedId(application.id)}
                className={cn(
                  'w-full border-b border-border/70 px-4 py-4 text-left transition-colors last:border-b-0',
                  isActive
                    ? 'bg-[#f7f3fb]'
                    : 'bg-white hover:bg-[#fcfbfe]',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-foreground">{application.applicantLabel}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{application.destination ?? 'No destination yet'}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{application.serviceLabel}</Badge>
                      <Badge className="bg-[#efe8f7] text-[#4b2e6f] hover:bg-[#efe8f7]">
                        {application.currentStageLabel}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Submitted {new Date(application.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ArrowRight className={cn('mt-1 h-4 w-4 shrink-0', isActive ? 'text-[#4b2e6f]' : 'text-muted-foreground')} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[1.8rem] font-semibold tracking-[-0.03em] text-foreground">
                  {selectedApplication.applicantLabel}
                </h3>
                <Badge variant="secondary">{selectedApplication.serviceLabel}</Badge>
                <Badge className="bg-[#efe8f7] text-[#4b2e6f] hover:bg-[#efe8f7]">
                  {selectedApplication.currentStageLabel}
                </Badge>
                {hasPendingDeletionRequest ? (
                  <Badge className="bg-[#fff3e0] text-[#a66300] hover:bg-[#fff3e0]">
                    Deletion requested
                  </Badge>
                ) : null}
              </div>
              <p className="text-[15px] text-muted-foreground">
                {selectedApplication.destination ?? 'No destination provided'}
              </p>
              {selectedApplication.notes ? (
                <p className="text-sm text-muted-foreground">{selectedApplication.notes}</p>
              ) : null}
            </div>

            <div className="grid gap-4 text-sm lg:min-w-[250px]">
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="mt-1 font-medium text-foreground">
                  {new Date(selectedApplication.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Activity</p>
                <p className="mt-1 font-medium text-foreground">
                  {docs.length} document{docs.length === 1 ? '' : 's'} and {messages.length} message{messages.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            {hasPendingDeletionRequest ? (
              <div className="rounded-2xl border border-[#f0d5aa] bg-[#fff7ea] p-5 shadow-sm sm:p-6">
                <h4 className="text-[1.2rem] font-semibold text-foreground">Deletion request pending</h4>
                <p className="mt-2 text-sm text-muted-foreground">
                  The client has asked to remove this application from their dashboard. Approve deletion to remove the case, files, and related messages, or keep the application active.
                </p>
                <div className="mt-4">
                  <DeletionRequestControls applicationId={selectedApplication.id} />
                </div>
              </div>
            ) : null}

            <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4 text-[#4b2e6f]" />
                ) : (
                  <PlaneTakeoff className="h-4 w-4 text-[#4b2e6f]" />
                )}
                <h4 className="text-[1.2rem] font-semibold text-foreground">
                  {isCompleted ? 'Case completed' : 'Current action'}
                </h4>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {isCompleted
                  ? 'This case is marked complete. The client should now see the final stage on their dashboard. You can still send a final message or change the stage if it was closed too early.'
                  : 'Update the stage here. The selected client will see the stage change and any client note you send.'}
              </p>
              <div className="mt-4 max-w-md">
                <TravelStageSelect
                  id={selectedApplication.id}
                  serviceType={selectedApplication.service_type}
                  current={selectedApplication.current_stage as TravelStageKey}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#4b2e6f]" />
                <h4 className="text-[1.2rem] font-semibold text-foreground">Documents</h4>
              </div>
              {docs.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No documents uploaded yet for this application.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {docs.map((doc) => (
                    <div key={doc.id} className="rounded-2xl border border-border/70 bg-[#fbfafc] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{doc.document_type ?? 'Document'}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Current: {getDocumentStatusLabel(doc.status)}
                          </p>
                        </div>
                        <Link
                          href={`/api/travel-documents/${doc.id}`}
                          className="text-sm font-medium text-[#4b2e6f] underline-offset-4 hover:underline"
                        >
                          Download file
                        </Link>
                      </div>
                      <div className="mt-3">
                        <DocumentReviewControls
                          id={doc.id}
                          currentStatus={doc.status}
                          currentNote={doc.admin_note}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <MessageSquareText className="h-4 w-4 text-[#4b2e6f]" />
                <h4 className="text-[1.2rem] font-semibold text-foreground">Messages</h4>
              </div>
              <div className="mt-4">
                <CaseMessagesFeed
                  messages={messages}
                  emptyLabel="No conversation yet."
                  showVisibility
                />
              </div>
              <div className="mt-4">
                <AdminCaseMessageForm
                  action={postTravelAdminMessage}
                  hiddenFields={[{ name: 'application_id', value: selectedApplication.id }]}
                  defaultVisibility="client"
                  submitLabel="Send update"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-[#4b2e6f]" />
                <h4 className="text-[1.2rem] font-semibold text-foreground">Timeline & updates</h4>
              </div>
              {history.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">No stage history recorded yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {latestHistory?.note_to_client ? (
                    <div className="rounded-2xl border border-border/70 bg-[#f7f3fb] p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#4b2e6f]">Latest client note</p>
                      <p className="mt-2 text-sm text-foreground">{latestHistory.note_to_client}</p>
                    </div>
                  ) : null}
                  {history.map((entry) => (
                    <div key={entry.id} className="rounded-2xl border border-border/70 bg-[#fbfafc] p-4">
                      <p className="text-sm font-medium text-foreground">{entry.stage_label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(entry.changed_at).toLocaleString()}
                      </p>
                      {entry.note_to_client ? (
                        <p className="mt-2 text-sm text-muted-foreground">{entry.note_to_client}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
