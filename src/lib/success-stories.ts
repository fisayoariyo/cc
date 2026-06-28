import type { SuccessStoryRow, SuccessStoryServiceType } from '@/lib/types/database';

export const SUCCESS_STORY_SERVICE_OPTIONS: Array<{
  value: SuccessStoryServiceType;
  label: string;
}> = [
  { value: 'travel', label: 'Travel & Mobility' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'construction', label: 'Construction' },
];

export function normalizeSuccessStoryService(raw: string | null | undefined): SuccessStoryServiceType {
  const value = (raw ?? '').trim().toLowerCase();
  if (value === 'travel' || value === 'real_estate' || value === 'construction') {
    return value;
  }
  return 'travel';
}

export function getSuccessStoryServiceLabel(service: string | null | undefined): string {
  const normalized = normalizeSuccessStoryService(service);
  return (
    SUCCESS_STORY_SERVICE_OPTIONS.find((option) => option.value === normalized)?.label ??
    'Success Story'
  );
}

export function slugifyStoryTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function parseLineList(value: string): string[] {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function splitStoryBody(body: string | null | undefined): string[] {
  return (body ?? '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function getSuccessStorySeoDescription(story: Pick<SuccessStoryRow, 'seo_description' | 'summary' | 'outcome'>): string {
  return story.seo_description?.trim() || story.outcome?.trim() || story.summary.trim();
}

export function getVideoEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = parsed.searchParams.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === 'vimeo.com') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function isDirectVideoFile(url: string | null | undefined): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}
