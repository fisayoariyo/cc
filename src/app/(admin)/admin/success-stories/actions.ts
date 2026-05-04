'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import {
  normalizeSuccessStoryService,
  parseLineList,
  slugifyStoryTitle,
} from '@/lib/success-stories';

export type SuccessStoryFormState = { error: string } | null;

function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function parseBoolean(value: FormDataEntryValue | null): boolean {
  return value === 'on' || value === 'true' || value === '1';
}

export async function saveSuccessStory(
  prevState: SuccessStoryFormState,
  formData: FormData,
): Promise<SuccessStoryFormState> {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'You must be signed in.' };
  if (viewer.role !== 'admin') return { error: 'Only admins can manage success stories.' };

  const supabase = await createClient();
  const storyId = String(formData.get('story_id') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const slug = String(formData.get('slug') ?? '').trim() || slugifyStoryTitle(title);
  const summary = String(formData.get('summary') ?? '').trim();
  const storyBody = String(formData.get('story_body') ?? '').trim();
  const service = normalizeSuccessStoryService(String(formData.get('service') ?? '').trim());
  const clientLabel = String(formData.get('client_label') ?? '').trim() || null;
  const location = String(formData.get('location') ?? '').trim() || null;
  const outcome = String(formData.get('outcome') ?? '').trim() || null;
  const coverImageUrl = String(formData.get('cover_image_url') ?? '').trim();
  const coverImageAlt = String(formData.get('cover_image_alt') ?? '').trim() || null;
  const highlightVideoUrl = String(formData.get('highlight_video_url') ?? '').trim() || null;
  const highlightVideoPosterUrl =
    String(formData.get('highlight_video_poster_url') ?? '').trim() || null;
  const galleryImageUrls = parseLineList(String(formData.get('gallery_image_urls') ?? ''));
  const galleryVideoUrls = parseLineList(String(formData.get('gallery_video_urls') ?? ''));
  const sortOrder = Number(String(formData.get('sort_order') ?? '0'));
  const featured = parseBoolean(formData.get('featured'));
  const published = parseBoolean(formData.get('published'));
  const seoTitle = String(formData.get('seo_title') ?? '').trim() || null;
  const seoDescription = String(formData.get('seo_description') ?? '').trim() || null;

  if (!title) return { error: 'Title is required.' };
  if (!slug) return { error: 'Slug is required.' };
  if (!summary) return { error: 'Summary is required.' };
  if (!storyBody) return { error: 'Story details are required.' };
  if (!coverImageUrl) return { error: 'Cover image URL is required.' };
  if (!isValidHttpUrl(coverImageUrl)) return { error: 'Cover image URL must be a valid http(s) URL.' };
  if (highlightVideoUrl && !isValidHttpUrl(highlightVideoUrl)) {
    return { error: 'Highlight video URL must be a valid http(s) URL.' };
  }
  if (highlightVideoPosterUrl && !isValidHttpUrl(highlightVideoPosterUrl)) {
    return { error: 'Video poster URL must be a valid http(s) URL.' };
  }

  for (const url of [...galleryImageUrls, ...galleryVideoUrls]) {
    if (!isValidHttpUrl(url)) {
      return { error: 'All gallery media URLs must be valid http(s) URLs.' };
    }
  }

  const duplicateSlugQuery = supabase
    .from('success_stories')
    .select('id')
    .eq('slug', slug);
  const { data: existingSlug } = storyId
    ? await duplicateSlugQuery.neq('id', storyId).maybeSingle()
    : await duplicateSlugQuery.maybeSingle();

  if (existingSlug) {
    return { error: 'That slug is already in use. Choose another one.' };
  }

  const payload = {
    slug,
    title,
    summary,
    story_body: storyBody,
    service,
    client_label: clientLabel,
    location,
    outcome,
    cover_image_url: coverImageUrl,
    cover_image_alt: coverImageAlt,
    highlight_video_url: highlightVideoUrl,
    highlight_video_poster_url: highlightVideoPosterUrl,
    gallery_image_urls: galleryImageUrls,
    gallery_video_urls: galleryVideoUrls,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    featured,
    published,
    seo_title: seoTitle,
    seo_description: seoDescription,
    updated_by: viewer.userId,
  };

  const { error } = storyId
    ? await supabase.from('success_stories').update(payload).eq('id', storyId)
    : await supabase.from('success_stories').insert({
        ...payload,
        created_by: viewer.userId,
      });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/success-stories');
  revalidatePath('/admin');
  revalidatePath('/admin/success-stories');
  redirect('/admin/success-stories');
}

export async function deleteSuccessStory(id: string) {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'You must be signed in.' };
  if (viewer.role !== 'admin') return { error: 'Only admins can manage success stories.' };

  const supabase = await createClient();
  const { error } = await supabase.from('success_stories').delete().eq('id', id);
  if (error) return { error: error.message };

  revalidatePath('/');
  revalidatePath('/about');
  revalidatePath('/success-stories');
  revalidatePath('/admin');
  revalidatePath('/admin/success-stories');
  return { success: true };
}
