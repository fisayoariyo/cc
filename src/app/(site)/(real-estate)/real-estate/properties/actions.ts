'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function toggleFavoriteProperty(propertyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Please sign in first.' };

  const { data: existing } = await supabase
    .from('favorite_properties')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .maybeSingle();

  if (existing?.id) {
    const { error } = await supabase.from('favorite_properties').delete().eq('id', existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from('favorite_properties').insert({ user_id: user.id, property_id: propertyId });
    if (error) return { error: error.message };
  }

  revalidatePath('/properties');
  revalidatePath('/real-estate/dashboard');
  return { ok: true };
}

export async function toggleCompareProperty(propertyId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Please sign in first.' };

  const { data: existing } = await supabase
    .from('compare_properties')
    .select('id')
    .eq('user_id', user.id)
    .eq('property_id', propertyId)
    .maybeSingle();
  if (existing?.id) {
    const { error } = await supabase.from('compare_properties').delete().eq('id', existing.id);
    if (error) return { error: error.message };
  } else {
    const { count } = await supabase
      .from('compare_properties')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    if ((count ?? 0) >= 3) return { error: 'Compare list supports up to 3 properties.' };
    const { error } = await supabase.from('compare_properties').insert({ user_id: user.id, property_id: propertyId });
    if (error) return { error: error.message };
  }

  revalidatePath('/properties');
  revalidatePath('/real-estate/dashboard');
  return { ok: true };
}

export async function saveRealEstateSearch(input: { title: string; query: Record<string, string> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Please sign in first.' };
  if (!input.title.trim()) return { error: 'Search title is required.' };

  const { error } = await supabase.from('saved_searches').insert({
    user_id: user.id,
    service: 'real_estate',
    title: input.title.trim(),
    query: input.query,
  });
  if (error) return { error: error.message };

  revalidatePath('/properties');
  revalidatePath('/real-estate/dashboard');
  return { ok: true };
}
