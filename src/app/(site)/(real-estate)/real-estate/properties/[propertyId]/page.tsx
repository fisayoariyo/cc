import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PropertyDetailView from '@/components/property/PropertyDetailView';
import { propertyRowToRecord } from '@/lib/mappers/property';
import { getActivePropertyById, getActivePropertyBySlug } from '@/lib/supabase/data';

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Props = { params: Promise<{ propertyId: string }> };

async function resolveActiveProperty(propertyId: string) {
  if (UUID_REGEX.test(propertyId)) {
    return getActivePropertyById(propertyId);
  }
  return getActivePropertyBySlug(propertyId);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { propertyId } = await params;
  const row = await resolveActiveProperty(propertyId);
  if (!row) return { title: 'Property not found' };

  const property = propertyRowToRecord(row);
  return {
    title: property.title,
    description: property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.slice(0, 160),
      images: [{ url: property.image }],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { propertyId } = await params;
  const row = await resolveActiveProperty(propertyId);
  if (!row) notFound();

  return <PropertyDetailView property={propertyRowToRecord(row)} />;
}
