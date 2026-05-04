'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { createNotification, createNotificationsForAdmins } from '@/lib/supabase/notifications';
import type { CaseMessageVisibility } from '@/lib/types/database';

export type CaseMessageFormState = { error: string } | { success: true } | null;

function snippet(text: string, max = 120) {
  const clean = text.trim().replace(/\s+/g, ' ');
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export async function postInquiryStaffMessage(
  prevState: CaseMessageFormState,
  formData: FormData,
): Promise<CaseMessageFormState> {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'You must be signed in.' };
  if (viewer.role !== 'admin' && viewer.role !== 'agent') return { error: 'Not allowed.' };

  const inquiryId = String(formData.get('inquiry_id') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  const visibility = String(formData.get('visibility') ?? 'internal').trim() as CaseMessageVisibility;

  if (!inquiryId || !body) return { error: 'Message cannot be empty.' };
  if (visibility !== 'internal' && visibility !== 'client') return { error: 'Invalid visibility.' };

  const supabase = await createClient();
  const { error } = await supabase.from('case_messages').insert({
    inquiry_id: inquiryId,
    sender_id: viewer.userId,
    sender_name: viewer.fullName ?? viewer.email,
    sender_email: viewer.email,
    body,
    visibility,
  });
  if (error) return { error: error.message };

  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
  return { success: true };
}

export async function postTravelAdminMessage(
  prevState: CaseMessageFormState,
  formData: FormData,
): Promise<CaseMessageFormState> {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'You must be signed in.' };
  if (viewer.role !== 'admin' && viewer.role !== 'agent') return { error: 'Not allowed.' };

  const applicationId = String(formData.get('application_id') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  const visibility = String(formData.get('visibility') ?? 'client').trim() as CaseMessageVisibility;

  if (!applicationId || !body) return { error: 'Message cannot be empty.' };
  if (visibility !== 'internal' && visibility !== 'client') return { error: 'Invalid visibility.' };

  const supabase = await createClient();
  const { data: app, error: appError } = await supabase
    .from('travel_applications')
    .select('id, client_id, destination')
    .eq('id', applicationId)
    .maybeSingle();
  if (appError || !app) return { error: appError?.message || 'Application not found.' };

  const { error } = await supabase.from('case_messages').insert({
    travel_application_id: applicationId,
    sender_id: viewer.userId,
    sender_name: viewer.fullName ?? viewer.email,
    sender_email: viewer.email,
    body,
    visibility,
  });
  if (error) return { error: error.message };

  if (visibility === 'client' && app.client_id) {
    await createNotification({
      userId: app.client_id,
      title: 'New message from Charis Consult',
      body: snippet(body),
      type: 'travel_message',
      linkUrl: '/travel/dashboard/applications',
      metadata: { application_id: applicationId },
    });
  } else {
    await createNotificationsForAdmins({
      title: 'New internal travel note',
      body: `${viewer.fullName || viewer.email || 'A staff member'} added an internal note for ${app.destination || 'a travel application'}.`,
      type: 'travel_admin',
      linkUrl: '/admin/travel-applications',
      metadata: { application_id: applicationId },
    });
  }

  revalidatePath('/admin/travel-applications');
  revalidatePath('/travel/dashboard/applications');
  revalidatePath('/admin');
  return { success: true };
}

export async function postTravelClientMessage(
  prevState: CaseMessageFormState,
  formData: FormData,
): Promise<CaseMessageFormState> {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'You must be signed in.' };
  if (viewer.role !== 'client') return { error: 'Not allowed.' };

  const applicationId = String(formData.get('application_id') ?? '').trim();
  const body = String(formData.get('body') ?? '').trim();
  if (!applicationId || !body) return { error: 'Message cannot be empty.' };

  const supabase = await createClient();
  const { data: app, error: appError } = await supabase
    .from('travel_applications')
    .select('id, client_id, destination')
    .eq('id', applicationId)
    .eq('client_id', viewer.userId)
    .maybeSingle();
  if (appError || !app) return { error: appError?.message || 'Application not found.' };

  const { error } = await supabase.from('case_messages').insert({
    travel_application_id: applicationId,
    sender_id: viewer.userId,
    sender_name: viewer.fullName ?? viewer.email,
    sender_email: viewer.email,
    body,
    visibility: 'client',
  });
  if (error) return { error: error.message };

  await createNotificationsForAdmins({
    title: 'New client travel message',
    body: `${viewer.fullName || viewer.email || 'A client'} sent a message about ${app.destination || 'their application'}.`,
    type: 'travel_admin',
    linkUrl: '/admin/travel-applications',
    metadata: { application_id: applicationId, client_id: viewer.userId },
  });

  revalidatePath('/travel/dashboard/applications');
  revalidatePath('/admin/travel-applications');
  revalidatePath('/admin');
  return { success: true };
}
