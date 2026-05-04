import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, CircleDashed, Clock3, ArrowRight } from 'lucide-react';
import { TravelApplicationForm } from '@/app/(site)/dashboard/travel-form';
import { DocumentUploadForm } from '@/app/(site)/dashboard/document-upload-form';
import { ClientCaseMessageForm } from '@/components/communications/ClientCaseMessageForm';
import { CaseMessagesFeed } from '@/components/communications/CaseMessagesFeed';
import { Badge } from '@/components/ui/badge';
import { getDocumentsForClient, getStageHistoryForApplications, getTravelApplicationsForClient } from '@/lib/supabase/data';
import { getCaseMessagesForTravelApplications } from '@/lib/supabase/case-messages';
import {
  getDocumentStatusLabel,
  getNextStepGuidance,
  getNextStageOption,
  getStageLabel,
  getStageOptions,
  getTravelServiceChoice,
  getTravelServiceLabel,
  getTravelTimelineSteps,
  isTravelApplicationFinished,
  isDocumentApproved,
} from '@/lib/travel-stages';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { postTravelClientMessage } from '@/app/actions/case-messages';
import { DeleteTravelApplicationButton } from './delete-travel-application-button';
import { getDocumentDisplayName } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Travel applications',
};

export default async function TravelApplicationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ flow?: string; created?: string }>;
}) {
  const viewer = await getViewerContext();
  if (!viewer) return null;
  const params = (await searchParams) ?? {};
  const applications = await getTravelApplicationsForClient(viewer.userId);
  const visibleApplications = applications.filter((application) => application.deletion_request_status !== 'pending');
  const pendingDeletionRequests = applications.filter((application) => application.deletion_request_status === 'pending');
  const requestedFlow = params.flow ? getTravelServiceChoice(params.flow).value : null;
  const hasOpenApplicationForRequestedFlow = requestedFlow
    ? applications.some(
        (application) =>
          application.service_type === requestedFlow &&
          !isTravelApplicationFinished(application.service_type, application.current_stage),
      )
    : false;
  const isStartMode = Boolean(params.flow) && !params.created && !hasOpenApplicationForRequestedFlow;
  const shouldShowStarter = Boolean(params.flow || params.created) && !hasOpenApplicationForRequestedFlow;

  const docs = isStartMode
    ? []
    : await getDocumentsForClient(viewer.userId);

  const historyMap = isStartMode
    ? {}
    : await getStageHistoryForApplications(visibleApplications.map((a) => a.id));
  const messageMap = isStartMode
    ? {}
    : await getCaseMessagesForTravelApplications(visibleApplications.map((a) => a.id));
  const docsByApplication = docs.reduce<Record<string, typeof docs>>((acc, d) => {
    if (!acc[d.application_id]) acc[d.application_id] = [];
    acc[d.application_id].push(d);
    return acc;
  }, {});

  const openApplicationMessage = hasOpenApplicationForRequestedFlow && requestedFlow
    ? (
      applications.some(
        (application) =>
          application.service_type === requestedFlow && application.deletion_request_status === 'pending',
      )
        ? `Your ${getTravelServiceLabel(requestedFlow)} deletion request is pending admin approval. You can start a different travel type while you wait.`
        : `You already have an active ${getTravelServiceLabel(requestedFlow)} application. Open it below, or start a different travel type from your dashboard.`
    )
    : null;

  return (
    <div className="space-y-8">
      <section className="max-w-3xl space-y-2">
        <h1 className="text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3rem]">Applications</h1>
        <p className="text-[15px] leading-7 text-muted-foreground">
          Start a new application, upload your documents, and follow each step as our team moves you forward.
        </p>
      </section>

      {shouldShowStarter ? (
        <TravelApplicationForm
          initialServiceType={params.flow}
          createdApplicationId={params.created}
        />
      ) : null}

      {openApplicationMessage ? (
        <div className="rounded-2xl border border-[#d7c8eb] bg-[#f7f3fb] px-4 py-3 text-[15px] text-[#4b2e6f]">
          {openApplicationMessage}
        </div>
      ) : null}

      {pendingDeletionRequests.length ? (
        <div className="rounded-2xl border border-[#d7c8eb] bg-[#f7f3fb] px-4 py-3 text-[15px] text-[#4b2e6f]">
          {pendingDeletionRequests.length === 1
            ? 'One application deletion request is pending admin approval.'
            : `${pendingDeletionRequests.length} application deletion requests are pending admin approval.`}
        </div>
      ) : null}

      {!isStartMode ? (
      <section className="space-y-5">
        <div className="space-y-1">
          <h2 className="text-[1.65rem] font-semibold tracking-[-0.03em] text-foreground">My travel applications</h2>
          <p className="text-[15px] text-muted-foreground">Each application keeps its own timeline, uploads, and next actions.</p>
        </div>
        {visibleApplications.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-border/70 bg-muted/20 p-8 text-center">
            <p className="text-[15px] text-muted-foreground">
              No active applications right now. Start your next travel flow from the dashboard chooser.
            </p>
            <Link
              href="/travel/dashboard"
              className="mt-4 inline-flex rounded-full bg-[#c88a2d] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#b67b25]"
            >
              Go to dashboard
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {visibleApplications.map((a) => {
              const applicationDocs = docsByApplication[a.id] ?? [];
              const currentStage = getStageLabel(a.service_type, a.current_stage);
              const nextStage = getNextStageOption(a.service_type, a.current_stage);
              const docsUploaded = applicationDocs.length > 0;
              const docsApproved = docsUploaded && applicationDocs.every((doc) => isDocumentApproved(doc.status));
              const timeline = getTravelTimelineSteps(a.service_type);
              const allStageOptions = getStageOptions(a.service_type);
              const serviceChoice = getTravelServiceChoice(a.service_type);
              const currentStageIndex = allStageOptions.findIndex((step) => step.value === a.current_stage);
              const documentsReceivedStageIndex = allStageOptions.findIndex((step) => step.value === 'documents_received');
              const documentsReceivedByTeam =
                docsUploaded ||
                (documentsReceivedStageIndex !== -1 && currentStageIndex >= documentsReceivedStageIndex);
              const reviewProgressedBeyondIntake =
                documentsReceivedStageIndex !== -1 && currentStageIndex > documentsReceivedStageIndex;
              const latestUpdate = historyMap[a.id]?.[0];
              const caseMessages = messageMap[a.id] ?? [];
              const isCreated = params.created === a.id;

              return (
                <li
                  key={a.id}
                  id={`application-${a.id}`}
                  className={`rounded-[24px] border bg-card p-5 space-y-6 shadow-sm sm:p-6 ${
                    isCreated
                      ? 'border-[#6b4a95]'
                      : 'border-border/70'
                  }`}
                >
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[1.1rem] font-semibold tracking-[-0.02em] text-foreground">{getTravelServiceLabel(a.service_type)}</p>
                        {isCreated ? <Badge className="bg-[#4b2e6f] text-white">Just created</Badge> : null}
                        <Badge variant="secondary" className="w-fit shrink-0">
                          {currentStage}
                        </Badge>
                      </div>
                      <p className="text-[15px] text-muted-foreground">{a.destination}</p>
                      {a.notes ? <p className="text-[15px] text-muted-foreground">{a.notes}</p> : null}
                      {!isTravelApplicationFinished(a.service_type, a.current_stage) ? (
                        <div className="pt-2">
                          <DeleteTravelApplicationButton
                            applicationId={a.id}
                            serviceLabel={getTravelServiceLabel(a.service_type)}
                          />
                        </div>
                      ) : null}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[390px]">
                      <div className="rounded-2xl border border-border/60 bg-card px-3 py-3">
                        <p className="text-xs text-muted-foreground">Application</p>
                        <p className="mt-1 text-sm font-medium text-foreground">Started</p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-card px-3 py-3">
                        <p className="text-xs text-muted-foreground">Documents</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {docsUploaded ? `${applicationDocs.length} uploaded` : 'Waiting for upload'}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border/60 bg-card px-3 py-3">
                        <p className="text-xs text-muted-foreground">Next stage</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {nextStage?.label ?? 'Final stage reached'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-primary" />
                      <p className="text-[15px] font-semibold text-foreground">Progress</p>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <p className="text-[15px] font-medium text-foreground">Application started</p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {currentStageIndex > 0
                            ? 'Your case has moved beyond the starting point and is now active with the team.'
                            : 'Your travel case is live and visible to the team.'}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                          {documentsReceivedByTeam ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <CircleDashed className="h-4 w-4 text-muted-foreground" />
                          )}
                          <p className="text-[15px] font-medium text-foreground">Documents received</p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {documentsReceivedByTeam
                            ? 'The team has confirmed receipt of your documents and is reviewing them now.'
                            : docsUploaded
                              ? `${applicationDocs.length} document${applicationDocs.length === 1 ? '' : 's'} uploaded. Waiting for the team to confirm receipt.`
                            : 'Upload your first document to unlock review.'}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-2">
                          {docsApproved || reviewProgressedBeyondIntake ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : (
                            <CircleDashed className="h-4 w-4 text-muted-foreground" />
                          )}
                          <p className="text-[15px] font-medium text-foreground">Reviewed by admin</p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {docsApproved
                            ? 'Your uploaded documents are approved for the current stage.'
                            : reviewProgressedBeyondIntake
                              ? 'Your case has moved past document intake into the next review step.'
                            : 'We will tick this as soon as the team clears your uploaded documents.'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl bg-card px-3 py-3">
                      {timeline.map((step, index) => {
                        const stepIndex = allStageOptions.findIndex((item) => item.value === step.value);
                        const isActive = step.value === a.current_stage;
                        const isComplete = currentStageIndex > stepIndex && !isActive;

                        return (
                          <div key={step.value} className="inline-flex items-center gap-2">
                            <span
                              className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-medium ${
                                isActive
                                  ? 'bg-primary text-primary-foreground'
                                  : isComplete
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {step.label}
                            </span>
                            {index < timeline.length - 1 ? <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" /> : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_340px] xl:items-start">
                    <div className="space-y-3 min-w-0">
                      <div className="space-y-1 rounded-[20px] border border-border/70 bg-card p-5 shadow-sm">
                        <p className="text-[15px] font-semibold text-foreground">Latest update</p>
                        {latestUpdate ? (
                          <div className="mt-2 space-y-1">
                            <p className="text-[15px] text-foreground">{latestUpdate.stage_label}</p>
                            <p className="text-sm text-muted-foreground">
                              {latestUpdate.note_to_client || 'No extra note from the team yet.'}
                            </p>
                          </div>
                        ) : (
                          <p className="mt-2 text-sm text-muted-foreground">
                            Updates from the team will appear here.
                          </p>
                        )}
                      </div>

                      <div className="w-full max-w-[720px]">
                        <DocumentUploadForm applicationId={a.id} />
                      </div>

                      <div className="space-y-3">
                        <p className="text-[15px] font-semibold text-foreground">Case messages</p>
                        <CaseMessagesFeed
                          messages={caseMessages}
                          emptyLabel="No messages yet. Use this space to ask questions or send updates."
                        />
                        <div className="w-full max-w-[720px]">
                          <ClientCaseMessageForm
                            action={postTravelClientMessage}
                            applicationId={a.id}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[15px] font-semibold text-foreground">Uploaded documents</p>
                        {applicationDocs.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No documents uploaded yet for this application.
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {applicationDocs.map((doc) => (
                              <div
                                key={doc.id}
                                className="rounded-2xl border border-border bg-card px-3 py-3 text-sm"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="font-medium text-foreground">
                                    {getDocumentDisplayName(doc.document_type, doc.file_path)}
                                  </p>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary">{getDocumentStatusLabel(doc.status)}</Badge>
                                    <Link
                                      href={`/api/travel-documents/${doc.id}`}
                                      className="text-sm font-medium text-[#4b2e6f] underline-offset-4 hover:underline"
                                    >
                                      Download
                                    </Link>
                                  </div>
                                </div>
                                <p className="mt-2 text-xs text-muted-foreground">
                                  Uploaded {new Date(doc.created_at).toLocaleString()}
                                </p>
                                {doc.admin_note ? (
                                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{doc.admin_note}</p>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <aside className="rounded-[28px] border border-border bg-card p-5 shadow-sm sm:p-6">
                      <p className="text-[1.45rem] font-semibold tracking-[-0.03em] text-foreground">What happens next</p>
                      <ul className="mt-5 space-y-4">
                        <li className="flex gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                          <div>
                            <p className="text-[15px] font-medium text-foreground">Create your application</p>
                            <p className="text-sm leading-6 text-muted-foreground">
                              Your case appears instantly in your dashboard timeline.
                            </p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                          <div>
                            <p className="text-[15px] font-medium text-foreground">Upload supporting documents</p>
                            <p className="text-sm leading-6 text-muted-foreground">
                              {getNextStepGuidance(a.service_type, a.current_stage)}
                            </p>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                          <div>
                            <p className="text-[15px] font-medium text-foreground">Wait for admin review</p>
                            <p className="text-sm leading-6 text-muted-foreground">
                              Once your documents are approved, your next stage becomes visible.
                            </p>
                          </div>
                        </li>
                      </ul>

                      <div className="mt-5 rounded-2xl bg-muted/30 p-4">
                        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          Suggested uploads
                        </p>
                        <ul className="mt-3 space-y-2">
                          {serviceChoice.documents.map((document) => (
                            <li key={document} className="text-[15px] text-foreground">
                              {document}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </aside>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      ) : null}
    </div>
  );
}
