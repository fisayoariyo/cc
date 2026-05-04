import RealEstatePage from '@/components/pages/RealEstatePage';
import { INITIAL_PROPERTIES } from '@/data/properties';

export default function Page() {
  const featuredProperties = INITIAL_PROPERTIES.filter((p) => p.featured).slice(0, 3);
  return <RealEstatePage featuredProperties={featuredProperties} />;
}
