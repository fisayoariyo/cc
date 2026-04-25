'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import type { ClientServiceType } from '@/lib/types/database';
import { firstStageForService, getStageLabel, normalizeTravelServiceType } from '@/lib/travel-stages';
import { CONSTRUCTION_CONSULTATION_URL } from '@/lib/consultation';

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

export type TravelFormState = { error: string } | { success: true } | null;
export type UploadDocState = { error: string } | { success: true } | null;

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

  revalidatePath('/travel/dashboard');
  return { success: true };
}

function cleanFileName(name: string): string {
  return name.replace(/[^\w.\-]+/g, '_').toLowerCase();
}

export async function uploadApplicationDocument(
  prevState: UploadDocState,
  formData: FormData,
): Promise<UploadDocState> {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'You must be signed in.' };

  const supabase = await createClient();

  const applicationId = String(formData.get('application_id') ?? '').trim();
  const documentType = String(formData.get('document_type') ?? '').trim() || 'General';
  const file = formData.get('file');
  if (!applicationId) return { error: 'Application id is missing.' };
  if (!(file instanceof File)) return { error: 'Please select a file.' };
  if (file.size <= 0) return { error: 'Selected file is empty.' };
  if (file.size > 10 * 1024 * 1024) return { error: 'File must be 10MB or smaller.' };

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
  if (rowError) return { error: rowError.message };

  revalidatePath('/travel/dashboard');
  revalidatePath('/admin/travel-applications');
  return { success: true };
}
