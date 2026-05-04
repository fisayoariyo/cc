import { createClient } from '@/lib/supabase/server';

export async function createNotification(input: {
  userId: string;
  title: string;
  body: string;
  type?: string;
  linkUrl?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createClient();
  await supabase.from('notifications').insert({
    user_id: input.userId,
    title: input.title,
    body: input.body,
    type: input.type ?? 'general',
    link_url: input.linkUrl ?? null,
    metadata: input.metadata ?? {},
  });
}

export async function createNotificationsForAdmins(input: {
  title: string;
  body: string;
  type?: string;
  linkUrl?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = await createClient();
  const { data: admins } = await supabase.from('profiles').select('id').eq('role', 'admin');
  const adminIds = (admins ?? []).map((admin) => admin.id).filter(Boolean);

  if (!adminIds.length) return;

  await supabase.from('notifications').insert(
    adminIds.map((userId) => ({
      user_id: userId,
      title: input.title,
      body: input.body,
      type: input.type ?? 'general',
      link_url: input.linkUrl ?? null,
      metadata: input.metadata ?? {},
    })),
  );
}
