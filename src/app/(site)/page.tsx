import { Suspense } from 'react';
import {
  createMarketingPageLoader,
  LandingPageSkeleton,
} from '@/components/landing/lazy-marketing-page';
import { getFeaturedSuccessStories } from '@/lib/supabase/data';

const HomePage = createMarketingPageLoader(
  () => import('@/components/pages/HomePage'),
  'min-h-screen animate-pulse bg-[#07192f]',
);

async function HomeWithStories() {
  const featuredStories = await getFeaturedSuccessStories(3);
  return <HomePage featuredStories={featuredStories} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={<LandingPageSkeleton className="min-h-screen animate-pulse bg-[#07192f]" />}
    >
      <HomeWithStories />
    </Suspense>
  );
}
