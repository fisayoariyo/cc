import { INITIAL_PROPERTIES } from '@/data/properties';
import { createMarketingPageLoader } from '@/components/landing/lazy-marketing-page';

const RealEstatePage = createMarketingPageLoader(() => import('@/components/pages/RealEstatePage'));

export default function Page() {
  const featuredProperties = INITIAL_PROPERTIES.filter((p) => p.featured).slice(0, 3);
  return <RealEstatePage featuredProperties={featuredProperties} />;
}
