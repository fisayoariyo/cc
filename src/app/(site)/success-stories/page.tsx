import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedSuccessStories } from '@/lib/supabase/data';
import {
  getSuccessStoryServiceLabel,
  normalizeSuccessStoryService,
  SUCCESS_STORY_SERVICE_OPTIONS,
} from '@/lib/success-stories';
import { SuccessStoryCard } from '@/components/success-stories/success-story-card';

export const metadata: Metadata = {
  title: 'Success Stories',
  description:
    'Browse photos, videos, and outcomes from travel, real estate, and construction success stories delivered by Charis Consult.',
};

export default async function SuccessStoriesPage({
  searchParams,
}: {
  searchParams?: Promise<{ service?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const activeService =
    params.service && ['travel', 'real_estate', 'construction'].includes(params.service)
      ? normalizeSuccessStoryService(params.service)
      : 'all';

  const stories = await getPublishedSuccessStories(
    48,
    activeService === 'all' ? null : activeService,
  );
  const heroStory = stories[0] ?? null;

  return (
    <div className="min-h-screen bg-[#fbfafc] pt-20">
      <section className="border-b border-border/60 bg-white px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="max-w-4xl space-y-4">
            <p className="inline-flex rounded-full bg-[#efe8f7] px-3 py-1 text-sm font-medium text-[#4b2e6f]">
              Success Stories
            </p>
            <h1 className="text-5xl font-semibold tracking-[-0.05em] text-foreground md:text-6xl">
              Proof of work your next client can see.
            </h1>
            <p className="max-w-3xl text-[17px] leading-8 text-muted-foreground">
              Explore outcomes across travel, real estate, and construction through story-led case highlights, curated media, and the results our team has delivered.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/success-stories"
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                activeService === 'all'
                  ? 'bg-[#4b2e6f] text-white'
                  : 'border border-[#d7c8eb] bg-white text-[#4b2e6f]'
              }`}
            >
              All stories
            </Link>
            {SUCCESS_STORY_SERVICE_OPTIONS.map((option) => (
              <Link
                key={option.value}
                href={`/success-stories?service=${option.value}`}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activeService === option.value
                    ? 'bg-[#4b2e6f] text-white'
                    : 'border border-[#d7c8eb] bg-white text-[#4b2e6f]'
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {heroStory ? (
        <section className="px-6 py-10 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-border/70 bg-white shadow-sm lg:grid lg:grid-cols-[1.2fr_minmax(0,0.8fr)]">
            <div className="aspect-[16/10] bg-[#f7f3fb] lg:aspect-auto">
              <img
                src={heroStory.cover_image_url}
                alt={heroStory.cover_image_alt || heroStory.title}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between p-8">
              <div className="space-y-4">
                <p className="inline-flex rounded-full bg-[#efe8f7] px-3 py-1 text-sm font-medium text-[#4b2e6f]">
                  Featured {getSuccessStoryServiceLabel(heroStory.service)}
                </p>
                <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground md:text-4xl">
                  {heroStory.title}
                </h2>
                <p className="text-[16px] leading-7 text-muted-foreground">{heroStory.summary}</p>
                {heroStory.outcome ? (
                  <p className="rounded-2xl bg-[#fbfafc] px-4 py-4 text-sm leading-7 text-foreground">
                    {heroStory.outcome}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {heroStory.location ? (
                  <span className="rounded-full bg-[#fbfafc] px-3 py-1 text-xs text-muted-foreground">
                    {heroStory.location}
                  </span>
                ) : null}
                {heroStory.client_label ? (
                  <span className="rounded-full bg-[#fbfafc] px-3 py-1 text-xs text-muted-foreground">
                    {heroStory.client_label}
                  </span>
                ) : null}
                <Link
                  href={`/success-stories/${heroStory.slug}`}
                  className="inline-flex rounded-full bg-[#c88a2d] px-5 py-3 text-sm font-medium text-white hover:bg-[#b67b25]"
                >
                  Read full story
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-6 pb-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {stories.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-border/70 bg-white p-12 text-center">
              <p className="text-[16px] text-muted-foreground">
                No published stories yet for this category.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {stories.map((story, index) => (
                <SuccessStoryCard key={story.id} story={story} priority={index < 2} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
