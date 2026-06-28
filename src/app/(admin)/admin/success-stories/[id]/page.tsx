import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DashboardPageTitle } from '@/components/dashboard/DashboardPageTitle';
import { dashboardOutlineButtonClass } from '@/lib/dashboard-theme';
import { getSuccessStoryByIdForAdmin } from '@/lib/supabase/data';
import { SuccessStoryForm } from '../story-form';

export default async function EditSuccessStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const story = await getSuccessStoryByIdForAdmin(id);

  if (!story) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section className="max-w-3xl space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <DashboardPageTitle as="h2">Edit success story</DashboardPageTitle>
          <Link
            href={`/success-stories/${story.slug}`}
            className={`inline-flex ${dashboardOutlineButtonClass} px-3 py-1.5`}
          >
            Preview public page
          </Link>
        </div>
        <p className="text-[15px] leading-7 text-muted-foreground">
          Update the story, media links, and publishing controls without affecting any of the existing service dashboards.
        </p>
      </section>

      <SuccessStoryForm story={story} />
    </div>
  );
}
