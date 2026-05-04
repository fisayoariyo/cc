'use server';

import { revalidatePath } from 'next/cache';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { createClient } from '@/lib/supabase/server';

export async function markTravelNotificationsRead() {
  const viewer = await getViewerContext();
  if (!viewer) return { success: false };

  const supabase = await createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', viewer.userId)
    .eq('is_read', false);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/travel/dashboard');
  revalidatePath('/travel/dashboard/updates');
  return { success: true };
}
