import HomePage from '@/components/pages/HomePage';
import { getFeaturedSuccessStories } from '@/lib/supabase/data';

export default async function Page() {
  const featuredStories = await getFeaturedSuccessStories(3);
  return <HomePage featuredStories={featuredStories} />;
}
