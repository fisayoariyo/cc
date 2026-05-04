import Link from 'next/link';
import { notFound } from 'next/navigation';
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
          <h2 className="text-[2.2rem] font-semibold tracking-[-0.04em] text-foreground sm:text-[2.7rem]">
            Edit success story
          </h2>
          <Link
            href={`/success-stories/${story.slug}`}
            className="inline-flex rounded-full border border-[#d7c8eb] bg-white px-3 py-1.5 text-sm font-medium text-[#4b2e6f] hover:bg-[#f7f3fb]"
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
