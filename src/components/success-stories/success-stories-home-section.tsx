import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SuccessStoryCard } from './success-story-card';
import type { SuccessStoryRow } from '@/lib/types/database';

export function SuccessStoriesHomeSection({
  stories,
}: {
  stories: SuccessStoryRow[];
}) {
  if (!stories.length) return null;

  return (
    <section className="bg-[#fbfafc] px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="inline-flex rounded-full bg-[#efe8f7] px-3 py-1 text-sm font-medium text-[#4b2e6f]">
              What We&apos;ve Delivered
            </p>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
              Real projects, real outcomes, real trust.
            </h2>
            <p className="text-[16px] leading-7 text-muted-foreground">
              Browse selected success stories across travel, real estate, and construction to see the quality of delivery clients can expect from us.
            </p>
          </div>

          <Link
            href="/success-stories"
            className="inline-flex items-center gap-2 rounded-full bg-[#c88a2d] px-5 py-3 text-sm font-medium text-white hover:bg-[#b67b25]"
          >
            See all success stories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {stories.slice(0, 3).map((story, index) => (
            <SuccessStoryCard key={story.id} story={story} priority={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
