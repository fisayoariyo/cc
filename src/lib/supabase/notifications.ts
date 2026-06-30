import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import {
  AGENT_LISTING_UNLOCK_BODY,
  AGENT_LISTING_UNLOCK_NOTIFICATION_TYPE,
  AGENT_LISTING_UNLOCK_TITLE,
} from '@/lib/agent-listing-access';

export async function createNotification(input: {
  userId: string;
  title: string;
  body: string;
  type?: string;
  linkUrl?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createClient();
  if (!supabase) return { error: 'Configuration missing.' };

  const { error } = await supabase.from('notifications').insert({
    user_id: input.userId,
    title: input.title,
    body: input.body,
    type: input.type ?? 'general',
    link_url: input.linkUrl ?? null,
    metadata: input.metadata ?? {},
  });

  if (error) {
    console.error('createNotification', error.message);
    return { error: error.message };
  }

  return { ok: true as const };
}

export async function notifyAgentListingUnlocked(userId: string) {
  return createNotification({
    userId,
    type: AGENT_LISTING_UNLOCK_NOTIFICATION_TYPE,
    title: AGENT_LISTING_UNLOCK_TITLE,
    body: AGENT_LISTING_UNLOCK_BODY,
    linkUrl: '/agent/listings/new',
    metadata: { celebration: true, dismissible: true },
  });
}

export async function createNotificationsForAdmins(
  input: {
    title: string;
    body: string;
    type?: string;
    linkUrl?: string;
    metadata?: Record<string, unknown>;
  },
  client?: SupabaseClient,
) {
  const supabase = client ?? (await createClient());
  if (!supabase) return { error: 'Configuration missing.' };

  const { data: admins, error: adminsError } = await supabase
    .from('profiles')
    .select('id')
    .eq('role', 'admin');

  if (adminsError) {
    console.error('createNotificationsForAdmins', adminsError.message);
    return { error: adminsError.message };
  }

  const adminIds = (admins ?? []).map((admin) => admin.id).filter(Boolean);
  if (!adminIds.length) return { ok: true as const };

  const { error } = await supabase.from('notifications').insert(
    adminIds.map((userId) => ({
      user_id: userId,
      title: input.title,
      body: input.body,
      type: input.type ?? 'general',
      link_url: input.linkUrl ?? null,
      metadata: input.metadata ?? {},
    })),
  );

  if (error) {
    console.error('createNotificationsForAdmins', error.message);
    return { error: error.message };
  }

  return { ok: true as const };
}
