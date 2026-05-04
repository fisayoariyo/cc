'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import type { InquiryStatus } from '@/lib/types/database';

const VALID: InquiryStatus[] = ['new', 'actioned', 'archived'];

export async function setInquiryStatus(id: string, status: InquiryStatus) {
  if (!VALID.includes(status)) return { error: 'Invalid status.' };

  const viewer = await getViewerContext();
  if (!viewer) return { error: 'Not signed in.' };
  if (viewer.role !== 'admin') return { error: 'Not allowed.' };

  const supabase = await createClient();

  const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/admin/inquiries');
  revalidatePath('/admin');
  return { ok: true };
}
