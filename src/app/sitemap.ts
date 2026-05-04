import type { MetadataRoute } from 'next';
import { getPublishedSuccessStories } from '@/lib/supabase/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.charisconsult.com';
  const now = new Date();
  const stories = await getPublishedSuccessStories(200);

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contact',
    '/real-estate',
    '/success-stories',
    '/travels',
    '/privacy',
    '/terms',
    '/login',
    '/register',
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));

  const storyRoutes: MetadataRoute.Sitemap = stories.map((story) => ({
    url: `${baseUrl}/success-stories/${story.slug}`,
    lastModified: new Date(story.updated_at || story.created_at),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...storyRoutes];
}
