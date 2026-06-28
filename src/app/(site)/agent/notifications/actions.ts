'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';

export async function dismissAgentNotification(notificationId: string) {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'Not signed in.' };

  const supabase = await createClient();
  if (!supabase) return { error: 'Configuration missing.' };

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', viewer.userId);

  if (error) return { error: error.message };

  revalidatePath('/agent');
  revalidatePath('/agent/listings');
  return { ok: true };
}
