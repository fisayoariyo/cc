import type { Metadata } from 'next';
import { createMarketingPageLoader } from '@/components/landing/lazy-marketing-page';

const ConstructionPage = createMarketingPageLoader(
  () => import('@/components/pages/ConstructionPage'),
  'min-h-screen animate-pulse bg-[#FEFAF4]',
);

export const metadata: Metadata = {
  title: 'Construction | From Blueprint to Reality',
  description:
    'Commercial and residential construction built with precision and delivered on time. Charis Consult — 500+ projects, 20+ years experience.',
};

export default function Page() {
  return <ConstructionPage />;
}
