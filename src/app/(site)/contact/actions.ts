'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

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

  const supabase = await createClient();
  const { error } = await supabase.from('inquiries').insert({
    full_name,
    email,
    phone: phone || null,
    inquiry_type,
    message,
    channel: 'web_form',
  });
  if (error) {
    return { error: error.message };
  }

  revalidatePath('/admin/inquiries');
  return { success: true };
}
