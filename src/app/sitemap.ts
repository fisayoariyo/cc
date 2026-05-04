import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.charisconsult.com';
  const now = new Date();

  return [
    '',
    '/about',
    '/contact',
    '/real-estate',
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
}
