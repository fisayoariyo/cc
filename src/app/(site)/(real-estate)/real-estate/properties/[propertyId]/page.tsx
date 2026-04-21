import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PropertyDetailView from '@/components/property/PropertyDetailView';
import { getPropertyBySlug } from '@/data/properties';
import { propertyRowToRecord } from '@/lib/mappers/property';
import { getPropertyById } from '@/lib/supabase/data';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Props = { params: Promise<{ propertyId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { propertyId } = await params;
  if (UUID_REGEX.test(propertyId)) {
    const row = await getPropertyById(propertyId);
    if (row && row.status === 'active') {
      const p = propertyRowToRecord(row);
      return {
        title: p.title,
        description: p.description.slice(0, 160),
        openGraph: {
          title: p.title,
          description: p.description.slice(0, 160),
          images: [{ url: p.image }],
        },
      };
    }
  }
  const mock = getPropertyBySlug(propertyId);
  if (!mock) return { title: 'Property' };
  return {
    title: mock.title,
    description: mock.description.slice(0, 160),
    openGraph: {
      title: mock.title,
      description: mock.description.slice(0, 160),
      images: [{ url: mock.image }],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { propertyId } = await params;

  if (UUID_REGEX.test(propertyId)) {
    const row = await getPropertyById(propertyId);
    if (row && row.status === 'active') {
      return <PropertyDetailView property={propertyRowToRecord(row)} />;
    }
    notFound();
  }

  const mock = getPropertyBySlug(propertyId);
  if (!mock) notFound();
  return <PropertyDetailView property={mock} />;
}
