import Link from 'next/link';
import { ArrowRight, Plus, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getAllSuccessStoriesForAdmin } from '@/lib/supabase/data';
import { getSuccessStoryServiceLabel } from '@/lib/success-stories';
import { DeleteSuccessStoryButton } from './delete-success-story-button';

export default async function AdminSuccessStoriesPage() {
  const stories = await getAllSuccessStoriesForAdmin();
  const featuredCount = stories.filter((story) => story.featured).length;
  const publishedCount = stories.filter((story) => story.published).length;

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-2">
          <h2 className="text-[2.35rem] font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-[3rem]">
            Success stories
          </h2>
          <p className="text-[15px] leading-7 text-muted-foreground">
            Curate the proof section of the brand with story-led outcomes, media galleries, and featured content for the homepage.
          </p>
        </div>

        <Link
          href="/admin/success-stories/new"
          className="inline-flex items-center gap-2 rounded-[14px] bg-[#c88a2d] px-4 py-2.5 text-[15px] font-medium text-white hover:bg-[#b67b25]"
        >
          <Plus className="h-4 w-4" />
          New story
        </Link>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Stories', value: stories.length },
          { label: 'Published', value: publishedCount },
          { label: 'Featured', value: featuredCount },
        ].map((item, index) => (
          <div
            key={item.label}
            className={`rounded-2xl p-4 text-white shadow-sm ${
              index === 0
                ? 'bg-gradient-to-br from-[#2f1b49] to-[#4b2e6f]'
                : index === 1
                  ? 'bg-gradient-to-br from-[#3a2358] to-[#593881]'
                  : 'bg-gradient-to-br from-[#442963] to-[#6a4698]'
            }`}
          >
            <p className="text-sm text-white/80">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold">{item.value}</p>
          </div>
        ))}
      </section>

      {stories.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-border/70 bg-white p-12 text-center shadow-sm">
          <p className="text-[16px] text-muted-foreground">
            No success stories yet. Add your first one and it can be featured on the homepage immediately.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {stories.map((story) => (
            <div
              key={story.id}
              className="grid gap-5 rounded-[28px] border border-border/70 bg-white p-5 shadow-sm lg:grid-cols-[220px_minmax(0,1fr)]"
            >
              <div className="overflow-hidden rounded-[22px] border border-border/60 bg-[#f7f3fb]">
                <img
                  src={story.cover_image_url}
                  alt={story.cover_image_alt || story.title}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[1.35rem] font-semibold tracking-[-0.03em] text-foreground">
                        {story.title}
                      </h3>
                      {story.featured ? (
                        <Badge className="bg-[#efe8f7] text-[#4b2e6f] hover:bg-[#efe8f7]">
                          <Star className="mr-1 h-3.5 w-3.5" />
                          Featured
                        </Badge>
                      ) : null}
                      <Badge variant={story.published ? 'default' : 'secondary'}>
                        {story.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {getSuccessStoryServiceLabel(story.service)}
                      {story.location ? ` · ${story.location}` : ''}
                      {story.client_label ? ` · ${story.client_label}` : ''}
                    </p>
                    <p className="max-w-3xl text-[15px] leading-7 text-muted-foreground">
                      {story.summary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/success-stories/${story.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-[#d7c8eb] bg-white px-3 py-2 text-sm font-medium text-[#4b2e6f] hover:bg-[#f7f3fb]"
                    >
                      Preview
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/success-stories/${story.id}`}
                      className="inline-flex rounded-full bg-[#4b2e6f] px-4 py-2 text-sm font-medium text-white hover:bg-[#40255f]"
                    >
                      Edit
                    </Link>
                    <DeleteSuccessStoryButton storyId={story.id} title={story.title} />
                  </div>
                </div>

                {story.outcome ? (
                  <div className="rounded-2xl bg-[#fbfafc] px-4 py-3 text-sm text-foreground">
                    {story.outcome}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
