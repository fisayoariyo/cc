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
