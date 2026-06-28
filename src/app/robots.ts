import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/agent/', '/dashboard/', '/travel/dashboard/', '/real-estate/dashboard/'],
    },
    sitemap: 'https://www.charisconsult.com/sitemap.xml',
  };
}
