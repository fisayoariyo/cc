'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import type { TravelStageKey } from '@/lib/types/database';
import { getStageLabel, getStageOptions } from '@/lib/travel-stages';
import { createNotification } from '@/lib/supabase/notifications';

export async function updateTravelStage(id: string, serviceType: string, current_stage: TravelStageKey, note?: string) {
  const viewer = await getViewerContext();
  if (!viewer) {
    return { error: 'Not signed in.' };
  }
  if (viewer.role !== 'admin') {
    return { error: 'Not allowed.' };
  }

  const supabase = await createClient();

  const allowed = getStageOptions(serviceType).map((s) => s.value);
  if (!allowed.includes(current_stage)) {
    return { error: 'Invalid stage.' };
  }

  const { data: app } = await supabase
    .from('travel_applications')
    .select('id, client_id, service_type')
    .eq('id', id)
    .maybeSingle();
  const { error } = await supabase.from('travel_applications').update({ current_stage }).eq('id', id);

  if (error) {
    return { error: error.message };
  }

  await supabase.from('application_stage_history').insert({
    application_id: id,
    stage_key: current_stage,
    stage_label: getStageLabel(serviceType, current_stage),
    note_to_client: note?.trim() || null,
    changed_by: viewer.userId,
  });

  if (app?.client_id) {
    await createNotification({
      userId: app.client_id,
      type: 'travel',
      title: 'Travel stage updated',
      body: `${getStageLabel(serviceType, current_stage)}${note?.trim() ? ` - ${note.trim()}` : ''}`,
      linkUrl: '/travels/dashboard',
      metadata: { application_id: id, service_type: app.service_type },
    });
  }

  revalidatePath('/admin/travel-applications');
  revalidatePath('/travels/dashboard');
  revalidatePath('/admin');
  return { ok: true };
}

export async function reviewApplicationDocument(
  id: string,
  status: 'accepted' | 'rejected' | 'resubmit_required',
  adminNote?: string,
) {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'Not signed in.' };
  if (viewer.role !== 'admin') return { error: 'Not allowed.' };

  const supabase = await createClient();

  if (status === 'resubmit_required' && !adminNote?.trim()) {
    return { error: 'Provide note for resubmission request.' };
  }

  const { data: doc } = await supabase
    .from('application_documents')
    .select('id, client_id, document_type, application_id')
    .eq('id', id)
    .maybeSingle();
  const { error } = await supabase
    .from('application_documents')
    .update({
      status,
      admin_note: adminNote?.trim() || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: viewer.userId,
    })
    .eq('id', id);
  if (error) return { error: error.message };

  if (doc?.client_id) {
    await createNotification({
      userId: doc.client_id,
      type: 'travel_document',
      title: `Document ${status.replace(/_/g, ' ')}`,
      body: `${doc.document_type ?? 'Document'}: ${adminNote?.trim() || 'Review updated by admin.'}`,
      linkUrl: '/travels/dashboard',
      metadata: { application_id: doc.application_id, document_id: id },
    });
  }

  revalidatePath('/admin/travel-applications');
  revalidatePath('/travels/dashboard');
  return { ok: true };
}
