import { createMarketingPageLoader } from '@/components/landing/lazy-marketing-page';
import { propertyRowToRecord } from '@/lib/mappers/property';
import { getActiveProperties } from '@/lib/supabase/data';

const RealEstatePage = createMarketingPageLoader(() => import('@/components/pages/RealEstatePage'));

export default async function Page() {
  const rows = await getActiveProperties();
  const featuredProperties = rows
    .filter((property) => property.is_featured)
    .slice(0, 3)
    .map(propertyRowToRecord);

  return <RealEstatePage featuredProperties={featuredProperties} />;
}
