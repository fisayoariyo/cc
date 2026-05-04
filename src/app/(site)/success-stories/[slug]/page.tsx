import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublishedSuccessStories, getSuccessStoryBySlug } from '@/lib/supabase/data';
import {
  getSuccessStorySeoDescription,
  getSuccessStoryServiceLabel,
  splitStoryBody,
} from '@/lib/success-stories';
import { SuccessStoryCard } from '@/components/success-stories/success-story-card';
import { SuccessStoryVideo } from '@/components/success-stories/success-story-video';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getSuccessStoryBySlug(slug);

  if (!story) {
    return {
      title: 'Success Story',
    };
  }

  return {
    title: story.seo_title?.trim() || story.title,
    description: getSuccessStorySeoDescription(story),
    openGraph: {
      title: story.seo_title?.trim() || story.title,
      description: getSuccessStorySeoDescription(story),
      images: story.cover_image_url ? [{ url: story.cover_image_url, alt: story.cover_image_alt || story.title }] : [],
    },
  };
}

export default async function SuccessStoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const story = await getSuccessStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const relatedStories = (await getPublishedSuccessStories(6, story.service))
    .filter((item) => item.id !== story.id)
    .slice(0, 3);
  const bodyParagraphs = splitStoryBody(story.story_body);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: story.title,
    description: getSuccessStorySeoDescription(story),
    image: story.cover_image_url,
    about: getSuccessStoryServiceLabel(story.service),
  };

  return (
    <div className="min-h-screen bg-[#fbfafc] pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article>
        <section className="border-b border-border/60 bg-white px-6 py-16 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
            <div className="space-y-5">
              <Link
                href="/success-stories"
                className="inline-flex rounded-full border border-[#d7c8eb] bg-[#f7f3fb] px-3 py-1 text-sm font-medium text-[#4b2e6f]"
              >
                Back to success stories
              </Link>
              <p className="inline-flex rounded-full bg-[#efe8f7] px-3 py-1 text-sm font-medium text-[#4b2e6f]">
                {getSuccessStoryServiceLabel(story.service)}
              </p>
              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-foreground md:text-6xl">
                {story.title}
              </h1>
              <p className="text-[17px] leading-8 text-muted-foreground">{story.summary}</p>

              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {story.location ? (
                  <span className="rounded-full bg-[#fbfafc] px-3 py-1">{story.location}</span>
                ) : null}
                {story.client_label ? (
                  <span className="rounded-full bg-[#fbfafc] px-3 py-1">{story.client_label}</span>
                ) : null}
              </div>

              {story.outcome ? (
                <div className="rounded-[24px] border border-border/70 bg-[#fbfafc] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                    Outcome
                  </p>
                  <p className="mt-2 text-[15px] leading-7 text-foreground">{story.outcome}</p>
                </div>
              ) : null}
            </div>

            <div className="overflow-hidden rounded-[32px] border border-border/70 bg-white shadow-sm">
              <img
                src={story.cover_image_url}
                alt={story.cover_image_alt || story.title}
                loading="eager"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section className="px-6 py-12 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <aside className="space-y-6">
              {story.highlight_video_url ? (
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                    Video highlight
                  </h2>
                  <SuccessStoryVideo
                    url={story.highlight_video_url}
                    poster={story.highlight_video_poster_url}
                    title={story.title}
                  />
                </div>
              ) : null}

              {story.gallery_image_urls.length > 0 ? (
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                    Photo gallery
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {story.gallery_image_urls.map((imageUrl, index) => (
                      <div
                        key={`${imageUrl}-${index}`}
                        className="overflow-hidden rounded-[22px] border border-border/70 bg-white shadow-sm"
                      >
                        <img
                          src={imageUrl}
                          alt={`${story.title} gallery ${index + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="aspect-[4/3] h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {story.gallery_video_urls.length > 0 ? (
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                    More videos
                  </h2>
                  <div className="space-y-4">
                    {story.gallery_video_urls.map((videoUrl, index) => (
                      <SuccessStoryVideo
                        key={`${videoUrl}-${index}`}
                        url={videoUrl}
                        title={`${story.title} video ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>

            <div className="space-y-5 rounded-[32px] border border-border/70 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
                The story
              </h2>
              <div className="space-y-5 text-[16px] leading-8 text-muted-foreground">
                {bodyParagraphs.length > 0 ? (
                  bodyParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)
                ) : (
                  <p>{story.summary}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {relatedStories.length > 0 ? (
          <section className="px-6 pb-20 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
                    More {getSuccessStoryServiceLabel(story.service)} stories
                  </h2>
                  <p className="mt-2 text-[15px] text-muted-foreground">
                    Explore other outcomes from the same service line.
                  </p>
                </div>
                <Link
                  href={`/success-stories?service=${story.service}`}
                  className="rounded-full border border-[#d7c8eb] bg-white px-4 py-2 text-sm font-medium text-[#4b2e6f] hover:bg-[#f7f3fb]"
                >
                  View all
                </Link>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {relatedStories.map((item, index) => (
                  <SuccessStoryCard key={item.id} story={item} priority={index === 0} />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </article>
    </div>
  );
}
