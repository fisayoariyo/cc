import { createMarketingPageLoader } from '@/components/landing/lazy-marketing-page';

const TravelPage = createMarketingPageLoader(() => import('@/components/pages/TravelPage'));

export default function Page() {
  return <TravelPage />;
}
