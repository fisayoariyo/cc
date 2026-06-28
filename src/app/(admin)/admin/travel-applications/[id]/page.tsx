import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  FileText,
  MessageSquareText,
  PlaneTakeoff,
} from 'lucide-react';
import { postTravelAdminMessage } from '@/app/actions/case-messages';
import { AdminCaseMessageForm } from '@/components/communications/AdminCaseMessageForm';
import { CaseMessagesFeed } from '@/components/communications/CaseMessagesFeed';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';
import {
  getDocumentsForApplications,
  getStageHistoryForApplications,
  getTravelApplicationById,
} from '@/lib/supabase/data';
import { getCaseMessagesForTravelApplications } from '@/lib/supabase/case-messages';
import { getStageLabel, getTravelServiceLabel, getDocumentStatusLabel } from '@/lib/travel-stages';
import { getDocumentDisplayName } from '@/lib/format';
import type { TravelStageKey } from '@/lib/types/database';
import { DocumentReviewControls } from '../document-review-controls';
import { DeletionRequestControls } from '../deletion-request-controls';
import { TravelStageSelect } from '../travel-stage-select';

export const metadata: Metadata = {
  title: 'Travel application',
};

export default async function AdminTravelApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getTravelApplicationById(id);

  if (!application) {
    notFound();
  }

  const clientId = application.client_id;
  const [docMap, historyMap, messageMap, profile] = await Promise.all([
    getDocumentsForApplications([application.id]),
    getStageHistoryForApplications([application.id]),
    getCaseMessagesForTravelApplications([application.id]),
    clientId
      ? createClient().then((supabase) =>
          supabase
            ? supabase
                .from('profiles')
                .select('full_name, email')
                .eq('id', clientId)
                .maybeSingle()
                .then(({ data }) => data)
            : null,
        )
      : Promise.resolve(null),
  ]);

  const docs = docMap[application.id] ?? [];
  const history = historyMap[application.id] ?? [];
  const messages = messageMap[application.id] ?? [];
  const latestHistory = history[0] ?? null;
  const applicantLabel =
    profile?.full_name || profile?.email || clientId?.slice(0, 8) || '—';

  const serviceLabel = getTravelServiceLabel(application.service_type);
  const currentStageLabel = getStageLabel(application.service_type, application.current_stage);
  const isCompleted =
    application.current_stage === 'completed' || application.current_stage === 'approved';
  const hasPendingDeletionRequest = application.deletion_request_status === 'pending';

  return (
    <div className="space-y-4 lg:space-y-6">
      <Link
        href="/admin/travel-applications"
        prefetch
        className="inline-flex items-center gap-2 text-sm font-medium text-[#4b2e6f] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>

      <div className="rounded-2xl border border-[#ece8f2] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[1.8rem] font-semibold tracking-[-0.03em] text-foreground">
                {applicantLabel}
              </h2>
              <Badge variant="secondary">{serviceLabel}</Badge>
              <Badge className="bg-[#efe8f7] text-[#4b2e6f] hover:bg-[#efe8f7]">
                {currentStageLabel}
              </Badge>
              {hasPendingDeletionRequest ? (
                <Badge className="bg-[#fff3e0] text-[#a66300] hover:bg-[#fff3e0]">
                  Deletion requested
                </Badge>
              ) : null}
            </div>
            <p className="text-[15px] text-muted-foreground">
              {application.destination ?? 'No destination provided'}
            </p>
            {application.notes ? (
              <p className="text-sm text-muted-foreground">{application.notes}</p>
            ) : null}
          </div>

          <div className="grid gap-4 text-sm lg:min-w-[250px]">
            <div>
              <p className="text-xs text-muted-foreground">Submitted</p>
              <p className="mt-1 font-medium text-foreground">
                {new Date(application.created_at).toLocaleString('en-GB')}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Activity</p>
              <p className="mt-1 font-medium text-foreground">
                {docs.length} document{docs.length === 1 ? '' : 's'} and {messages.length} message
                {messages.length === 1 ? '' : 's'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {hasPendingDeletionRequest ? (
            <div className="rounded-2xl border border-[#f0d5aa] bg-[#fff7ea] p-5 shadow-sm sm:p-6">
              <h3 className="text-[1.2rem] font-semibold text-foreground">Deletion request pending</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The client has asked to remove this application from their dashboard. Approve
                deletion to remove the case, files, and related messages, or keep the application
                active.
              </p>
              <div className="mt-4">
                <DeletionRequestControls applicationId={application.id} />
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-[#ece8f2] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4 text-[#4b2e6f]" />
              ) : (
                <PlaneTakeoff className="h-4 w-4 text-[#4b2e6f]" />
              )}
              <h3 className="text-[1.2rem] font-semibold text-foreground">
                {isCompleted ? 'Case completed' : 'Current action'}
              </h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {isCompleted
                ? 'This case is marked complete. The client should now see the final stage on their dashboard. You can still send a final message or change the stage if it was closed too early.'
                : 'Update the stage here. The selected client will see the stage change and any client note you send.'}
            </p>
            <div className="mt-4 max-w-md">
              <TravelStageSelect
                id={application.id}
                serviceType={application.service_type}
                current={application.current_stage as TravelStageKey}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#ece8f2] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#4b2e6f]" />
              <h3 className="text-[1.2rem] font-semibold text-foreground">Documents</h3>
            </div>
            {docs.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                No documents uploaded yet for this application.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {docs.map((doc) => (
                  <div key={doc.id} className="rounded-2xl border border-[#ece8f2] bg-[#fbfafc] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {getDocumentDisplayName(doc.document_type, doc.file_path)}
                        </p>
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

          <div className="rounded-2xl border border-[#ece8f2] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-[#4b2e6f]" />
              <h3 className="text-[1.2rem] font-semibold text-foreground">Messages</h3>
            </div>
            <div className="mt-4">
              <CaseMessagesFeed messages={messages} emptyLabel="No conversation yet." showVisibility />
            </div>
            <div className="mt-4">
              <AdminCaseMessageForm
                action={postTravelAdminMessage}
                hiddenFields={[{ name: 'application_id', value: application.id }]}
                defaultVisibility="client"
                submitLabel="Send update"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#ece8f2] bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#4b2e6f]" />
              <h3 className="text-[1.2rem] font-semibold text-foreground">Timeline & updates</h3>
            </div>
            {history.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No stage history recorded yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {latestHistory?.note_to_client ? (
                  <div className="rounded-2xl border border-[#ece8f2] bg-[#f7f3fb] p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#4b2e6f]">
                      Latest client note
                    </p>
                    <p className="mt-2 text-sm text-foreground">{latestHistory.note_to_client}</p>
                  </div>
                ) : null}
                {history.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-[#ece8f2] bg-[#fbfafc] p-4">
                    <p className="text-sm font-medium text-foreground">{entry.stage_label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(entry.changed_at).toLocaleString('en-GB')}
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
    </div>
  );
}
