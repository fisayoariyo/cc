'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { InquiryStatus } from '@/lib/types/database';

const VALID: InquiryStatus[] = ['new', 'actioned', 'archived'];

export async function setInquiryStatus(id: string, status: InquiryStatus) {
  if (!VALID.includes(status)) return { error: 'Invalid status.' };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Not signed in.' };

  const { data: me } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (me?.role !== 'admin') return { error: 'Not allowed.' };

  const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
  return { ok: true };
}
