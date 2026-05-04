'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import type { ClientServiceType } from '@/lib/types/database';
import {
  firstStageForService,
  getTravelServiceLabel,
  getStageLabel,
  isTravelApplicationFinished,
  normalizeTravelServiceType,
} from '@/lib/travel-stages';
import { CONSTRUCTION_CONSULTATION_URL } from '@/lib/consultation';
import { createNotification, createNotificationsForAdmins } from '@/lib/supabase/notifications';
import { TRAVEL_DOCUMENT_MAX_UPLOAD_BYTES, TRAVEL_DOCUMENT_MAX_UPLOAD_MB } from '@/lib/upload-limits';

export async function addClientService(service: ClientServiceType) {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'Please sign in again.' };
  if (viewer.role !== 'client') return { error: 'Only clients can add services.' };

  const supabase = await createClient();
  const { error } = await supabase.from('client_services').insert({ user_id: viewer.userId, service });
  if (error && !error.message.toLowerCase().includes('duplicate')) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  return { ok: true };
}

export async function addClientServiceAndContinue(service: ClientServiceType): Promise<void> {
  const result = await addClientService(service);
  if (result && 'error' in result) {
    const message = typeof result.error === 'string' ? result.error : 'Could not add service.';
    redirect(`/dashboard?error=${encodeURIComponent(message)}`);
  }

  if (service === 'travel') {
    redirect('/travel/dashboard');
  }
  if (service === 'real_estate') {
    redirect('/real-estate/dashboard');
  }
  redirect(CONSTRUCTION_CONSULTATION_URL);
}

export type TravelFormState = { error: string } | null;
export type UploadDocState = { error: string } | { success: true } | null;
export type DeleteTravelApplicationState = { error: string } | { success: true } | null;

export async function createTravelApplication(
  prevState: TravelFormState,
  formData: FormData,
): Promise<TravelFormState> {
  const viewer = await getViewerContext();
  if (!viewer) {
    return { error: 'You must be signed in.' };
  }

  const supabase = await createClient();

  const service_type = normalizeTravelServiceType(String(formData.get('service_type') ?? '').trim());
  const destination = String(formData.get('destination') ?? '').trim();
  const notes = String(formData.get('notes') ?? '').trim();

  if (!service_type || !destination) {
    return { error: 'Service type and destination are required.' };
  }

  const { data: existingApplications, error: existingError } = await supabase
    .from('travel_applications')
    .select('id, service_type, current_stage, deletion_request_status')
    .eq('client_id', viewer.userId)
    .eq('service_type', service_type);

  if (existingError) {
    return { error: existingError.message };
  }

  const pendingDeletionForType = (existingApplications ?? []).some(
    (application) => application.deletion_request_status === 'pending',
  );
  const hasOpenApplicationForType = (existingApplications ?? []).some((application) => {
    return !isTravelApplicationFinished(application.service_type, application.current_stage);
  });

  if (hasOpenApplicationForType) {
    return {
      error: pendingDeletionForType
        ? `Your ${getTravelServiceLabel(service_type)} deletion request is still pending admin approval. Wait for the team to confirm it before starting another one.`
        : `You already have an active ${getTravelServiceLabel(service_type)} application. Open it from your applications list or delete it before starting another one.`,
    };
  }

  const { data, error } = await supabase
    .from('travel_applications')
    .insert({
      client_id: viewer.userId,
      service_type,
      destination,
      notes: notes || null,
      current_stage: firstStageForService(service_type),
    })
    .select('id')
    .maybeSingle();

  if (error) {
    return { error: error.message };
  }

  const stage = firstStageForService(service_type);
  await supabase.from('application_stage_history').insert({
    application_id: data?.id,
    stage_key: stage,
    stage_label: getStageLabel(service_type, stage),
    changed_by: null,
  });

  if (data?.id) {
    await createNotification({
      userId: viewer.userId,
      title: 'Travel application started',
      body: `Your ${service_type} application has started. Upload your documents to continue.`,
      type: 'travel',
      linkUrl: '/travel/dashboard/applications',
      metadata: { application_id: data.id, service_type },
    });

    await createNotificationsForAdmins({
      title: 'New travel application',
      body: `${viewer.fullName || viewer.email || 'A client'} started a ${service_type} application for ${destination}.`,
      type: 'travel_admin',
      linkUrl: '/admin/travel-applications',
      metadata: { application_id: data.id, client_id: viewer.userId, service_type },
    });
  }

  revalidatePath('/travel/dashboard');
  revalidatePath('/travel/dashboard/applications');
  redirect(
    `/travel/dashboard/applications?created=${encodeURIComponent(data?.id ?? '')}#application-${encodeURIComponent(data?.id ?? '')}`,
  );
}

function cleanFileName(name: string): string {
  return name.replace(/[^\w.\-]+/g, '_').toLowerCase();
}

function inferDocumentTypeFromFileName(name: string): string {
  return name
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .trim();
}

export async function uploadApplicationDocument(
  prevState: UploadDocState,
  formData: FormData,
): Promise<UploadDocState> {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'You must be signed in.' };

  const supabase = await createClient();

  const applicationId = String(formData.get('application_id') ?? '').trim();
  const file = formData.get('file');
  if (!applicationId) return { error: 'Application id is missing.' };
  if (!(file instanceof File)) return { error: 'Please select a file.' };
  if (file.size <= 0) return { error: 'Selected file is empty.' };
  if (file.size > TRAVEL_DOCUMENT_MAX_UPLOAD_BYTES) {
    return { error: `File must be ${TRAVEL_DOCUMENT_MAX_UPLOAD_MB}MB or smaller.` };
  }

  const documentType =
    String(formData.get('document_type') ?? '').trim() || inferDocumentTypeFromFileName(file.name);
  if (!documentType) return { error: 'Please enter a document name.' };

  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
  const filePath = `${viewer.userId}/${applicationId}/${Date.now()}_${cleanFileName(file.name || `document.${ext}`)}`;

  const { error: uploadError } = await supabase.storage
    .from('application-documents')
    .upload(filePath, file, { contentType: file.type || 'application/octet-stream' });
  if (uploadError) return { error: uploadError.message };

  const { error: rowError } = await supabase.from('application_documents').insert({
    application_id: applicationId,
    client_id: viewer.userId,
    file_path: filePath,
    document_type: documentType,
    status: 'under_review',
  });
  if (rowError) {
    await supabase.storage.from('application-documents').remove([filePath]);
    return { error: rowError.message };
  }

  await createNotification({
    userId: viewer.userId,
    title: 'Document uploaded',
    body: `${documentType} uploaded successfully. We will review it and update your next step.`,
    type: 'travel_document',
    linkUrl: '/travel/dashboard/applications',
    metadata: { application_id: applicationId, document_type: documentType },
  });

  await createNotificationsForAdmins({
    title: 'Travel document uploaded',
    body: `${viewer.fullName || viewer.email || 'A client'} uploaded ${documentType} for a travel application.`,
    type: 'travel_admin',
    linkUrl: '/admin/travel-applications',
    metadata: { application_id: applicationId, client_id: viewer.userId, document_type: documentType },
  });

  revalidatePath('/travel/dashboard');
  revalidatePath('/travel/dashboard/applications');
  revalidatePath('/admin/travel-applications');
  return { success: true };
}

export async function requestTravelApplicationDeletion(
  applicationId: string,
): Promise<DeleteTravelApplicationState> {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'You must be signed in.' };
  if (viewer.role !== 'client') return { error: 'Only clients can request application deletion.' };

  const supabase = await createClient();

  const { data: application, error: applicationError } = await supabase
    .from('travel_applications')
    .select('id, client_id, service_type, current_stage, destination, deletion_request_status')
    .eq('id', applicationId)
    .eq('client_id', viewer.userId)
    .maybeSingle();

  if (applicationError || !application) {
    return { error: applicationError?.message || 'Application not found.' };
  }

  if (application.deletion_request_status === 'pending') {
    return { error: 'Deletion request already pending admin approval.' };
  }

  const { error: updateError } = await supabase
    .from('travel_applications')
    .update({
      deletion_request_status: 'pending',
      deletion_requested_at: new Date().toISOString(),
      deletion_requested_by: viewer.userId,
      deletion_reviewed_at: null,
      deletion_reviewed_by: null,
    })
    .eq('id', applicationId)
    .eq('client_id', viewer.userId);

  if (updateError) return { error: updateError.message };

  await createNotificationsForAdmins({
    title: 'Travel deletion request',
    body: `${viewer.fullName || viewer.email || 'A client'} requested deletion for a ${application.service_type} application for ${application.destination || 'their destination'}.`,
    type: 'travel_admin',
    linkUrl: '/admin/travel-applications',
    metadata: { application_id: applicationId, client_id: viewer.userId, service_type: application.service_type },
  });

  await createNotification({
    userId: viewer.userId,
    title: 'Deletion request sent',
    body: `Your ${getTravelServiceLabel(application.service_type)} application deletion request is now pending admin approval.`,
    type: 'travel',
    linkUrl: '/travel/dashboard/applications',
    metadata: { application_id: applicationId, service_type: application.service_type, deletion_request_status: 'pending' },
  });

  revalidatePath('/travel/dashboard');
  revalidatePath('/travel/dashboard/applications');
  revalidatePath('/admin/travel-applications');
  return { success: true };
}
