import PropertiesListingPage from '@/components/pages/PropertiesListingPage';
import { propertyRowToRecord } from '@/lib/mappers/property';
import { createClient } from '@/lib/supabase/server';
import { getActiveProperties, getCompareProperties, getFavoriteProperties } from '@/lib/supabase/data';

export default async function Page() {
  const supabase = await createClient();
  const [rows, authRes] = await Promise.all([
    getActiveProperties(),
    supabase.auth.getUser(),
  ]);
  const initialProperties = rows.map(propertyRowToRecord);
  const {
    data: { user },
  } = authRes;

  const [favorites, compare] = user
    ? await Promise.all([getFavoriteProperties(user.id), getCompareProperties(user.id)])
    : [[], []];

  return (
    <PropertiesListingPage
      initialProperties={initialProperties}
      favoriteIds={favorites.map((f) => f.property_id)}
      compareIds={compare.map((c) => c.property_id)}
      canManage={!!user}
    />
  );
}
