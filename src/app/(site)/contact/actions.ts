'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createNotificationsForAdmins } from '@/lib/supabase/notifications';

export type InquirySubmitState = { error: string } | { success: true } | null;

export async function submitInquiry(
  prevState: InquirySubmitState,
  formData: FormData,
): Promise<InquirySubmitState> {
  const full_name = String(formData.get('full_name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const phone = String(formData.get('phone') ?? '').trim();
  const inquiry_type = String(formData.get('inquiry_type') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  if (!full_name || !email || !inquiry_type || !message) {
    return { error: 'Please complete all required fields.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  // Public contact form: a visitor is usually anonymous, so this trusted
  // server action uses the service-role client to bypass RLS (per schema notes).
  const supabase = createAdminClient() ?? (await createClient());
  if (!supabase) return { error: 'Configuration missing. Please try again later.' };
  const { data: inquiryRow, error: insertError } = await supabase
    .from('inquiries')
    .insert({
      full_name,
      email,
      phone: phone || null,
      inquiry_type,
      message,
      channel: 'web_form',
    })
    .select('id')
    .maybeSingle();
  if (insertError) {
    return { error: insertError.message };
  }

  await supabase.from('case_messages').insert({
    inquiry_id: inquiryRow?.id,
    sender_name: full_name,
    sender_email: email,
    body: message,
    visibility: 'client',
  });

  await createNotificationsForAdmins(
    {
      title: 'New inquiry received',
      body: `${full_name} sent a ${inquiry_type} inquiry.`,
      type: 'inquiry_received',
      linkUrl: '/admin/inquiries',
      metadata: {
        inquiry_id: inquiryRow?.id,
        email,
        inquiryType: inquiry_type,
        channel: 'web_form',
      },
    },
    supabase,
  );

  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
  return { success: true };
}
