import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSuccessStoryServiceLabel } from '@/lib/success-stories';
import type { SuccessStoryRow } from '@/lib/types/database';

export function SuccessStoryCard({
  story,
  priority = false,
}: {
  story: SuccessStoryRow;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/success-stories/${story.slug}`}
      className="group overflow-hidden rounded-[28px] border border-border/70 bg-white shadow-sm transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f7f3fb]">
        <img
          src={story.cover_image_url}
          alt={story.cover_image_alt || story.title}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#4b2e6f] backdrop-blur">
          {getSuccessStoryServiceLabel(story.service)}
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div className="space-y-2">
          <h3 className="text-[1.25rem] font-semibold tracking-[-0.03em] text-foreground">
            {story.title}
          </h3>
          <p className="text-[15px] leading-7 text-muted-foreground">{story.summary}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {story.location ? (
            <span className="rounded-full bg-[#f7f3fb] px-3 py-1">{story.location}</span>
          ) : null}
          {story.client_label ? (
            <span className="rounded-full bg-[#fbfafc] px-3 py-1">{story.client_label}</span>
          ) : null}
        </div>

        <div className="inline-flex items-center gap-2 text-sm font-medium text-[#4b2e6f]">
          Read story
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
