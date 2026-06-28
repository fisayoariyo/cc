import PropertiesListingPage from '@/components/pages/PropertiesListingPage';
import { propertyRowToRecord } from '@/lib/mappers/property';
import { createClient } from '@/lib/supabase/server';
import { getActiveProperties, getCompareProperties, getFavoriteProperties } from '@/lib/supabase/data';

export default async function Page() {
  const rows = await getActiveProperties();
  const initialProperties = rows.map(propertyRowToRecord);

  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

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
