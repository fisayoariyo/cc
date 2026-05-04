import type { PropertyRecord } from '@/data/properties';
import type { PropertyRow } from '@/lib/types/database';
import { formatNaira } from '@/lib/format';

const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1774685110718-c5b4fe026144?w=800&q=80';

/** Maps DB row to existing UI types (mock shape) for PropertyCard / PropertyDetailView. */
export function propertyRowToRecord(row: PropertyRow): PropertyRecord {
  const imgs = row.images?.filter(Boolean) ?? [];
  const image = imgs[0] ?? PLACEHOLDER_IMG;
  const city =
    row.location
      .split(',')[0]
      ?.trim()
      .toLowerCase()
      .replace(/\s+/g, '-') ?? 'other';
  return {
    id: row.id,
    slug: row.id,
    image,
    images: imgs.length ? imgs : [image],
    title: row.title,
    location: row.location,
    price: formatNaira(row.price),
    beds: 0,
    baths: 0,
    sqm: 0,
    type: row.category ?? 'Buy',
    propertyType: 'residential',
    city,
    description: row.description ?? '',
    status: row.status === 'active' ? 'published' : 'draft',
    featured: row.is_featured ?? false,
  };
}
