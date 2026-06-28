import { createMarketingPageLoader } from '@/components/landing/lazy-marketing-page';

const AboutPage = createMarketingPageLoader(() => import('@/components/pages/AboutPage'));

export default function Page() {
  return <AboutPage />;
}
