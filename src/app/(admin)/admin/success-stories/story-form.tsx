'use client';

import Link from 'next/link';
import { useActionState, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  slugifyStoryTitle,
  SUCCESS_STORY_SERVICE_OPTIONS,
} from '@/lib/success-stories';
import type { SuccessStoryRow } from '@/lib/types/database';
import { saveSuccessStory, type SuccessStoryFormState } from './actions';

function joinLines(items: string[] | null | undefined): string {
  return (items ?? []).join('\n');
}

type FormDefaults = {
  id: string;
  title: string;
  slug: string;
  service: string;
  summary: string;
  storyBody: string;
  clientLabel: string;
  location: string;
  outcome: string;
  coverImageUrl: string;
  coverImageAlt: string;
  highlightVideoUrl: string;
  highlightVideoPosterUrl: string;
  galleryImageUrls: string;
  galleryVideoUrls: string;
  sortOrder: string;
  featured: boolean;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
};

export function SuccessStoryForm({
  story,
}: {
  story?: SuccessStoryRow | null;
}) {
  const defaults = useMemo<FormDefaults>(() => {
    return {
      id: story?.id ?? '',
      title: story?.title ?? '',
      slug: story?.slug ?? '',
      service: story?.service ?? 'travel',
      summary: story?.summary ?? '',
      storyBody: story?.story_body ?? '',
      clientLabel: story?.client_label ?? '',
      location: story?.location ?? '',
      outcome: story?.outcome ?? '',
      coverImageUrl: story?.cover_image_url ?? '',
      coverImageAlt: story?.cover_image_alt ?? '',
      highlightVideoUrl: story?.highlight_video_url ?? '',
      highlightVideoPosterUrl: story?.highlight_video_poster_url ?? '',
      galleryImageUrls: joinLines(story?.gallery_image_urls),
      galleryVideoUrls: joinLines(story?.gallery_video_urls),
      sortOrder: String(story?.sort_order ?? 0),
      featured: Boolean(story?.featured),
      published: Boolean(story?.published),
      seoTitle: story?.seo_title ?? '',
      seoDescription: story?.seo_description ?? '',
    };
  }, [story]);

  const [state, formAction, isPending] = useActionState<SuccessStoryFormState, FormData>(
    saveSuccessStory,
    null,
  );
  const [slug, setSlug] = useState(defaults.slug);
  const [autoSlug, setAutoSlug] = useState(!story);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="story_id" value={defaults.id} />

      <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={defaults.title}
              required
              onChange={(event) => {
                if (!autoSlug) return;
                setSlug(slugifyStoryTitle(event.currentTarget.value));
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              required
              onChange={(event) => {
                setAutoSlug(false);
                setSlug(event.currentTarget.value);
              }}
            />
            <p className="text-xs text-muted-foreground">Shown in the public URL.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <select
              id="service"
              name="service"
              defaultValue={defaults.service}
              className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2 text-sm"
            >
              {SUCCESS_STORY_SERVICE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              name="summary"
              rows={3}
              defaultValue={defaults.summary}
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="story_body">Story body</Label>
            <Textarea
              id="story_body"
              name="story_body"
              rows={9}
              defaultValue={defaults.storyBody}
              required
            />
            <p className="text-xs text-muted-foreground">
              Use blank lines between paragraphs for cleaner reading on the public page.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_label">Client label</Label>
            <Input
              id="client_label"
              name="client_label"
              defaultValue={defaults.clientLabel}
              placeholder="Anonymous client, Family in Ibadan, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={defaults.location} placeholder="Ibadan, UK, Dubai..." />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="outcome">Outcome</Label>
            <Textarea
              id="outcome"
              name="outcome"
              rows={3}
              defaultValue={defaults.outcome}
              placeholder="What changed for the client? What was delivered?"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cover_image_url">Cover image URL</Label>
            <Input
              id="cover_image_url"
              name="cover_image_url"
              defaultValue={defaults.coverImageUrl}
              placeholder="https://..."
              required
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cover_image_alt">Cover image alt text</Label>
            <Input
              id="cover_image_alt"
              name="cover_image_alt"
              defaultValue={defaults.coverImageAlt}
              placeholder="Describe what is in the cover image"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlight_video_url">Highlight video URL</Label>
            <Input
              id="highlight_video_url"
              name="highlight_video_url"
              defaultValue={defaults.highlightVideoUrl}
              placeholder="YouTube, Vimeo, or direct MP4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="highlight_video_poster_url">Video poster URL</Label>
            <Input
              id="highlight_video_poster_url"
              name="highlight_video_poster_url"
              defaultValue={defaults.highlightVideoPosterUrl}
              placeholder="Optional still image for direct video files"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gallery_image_urls">Gallery image URLs</Label>
            <Textarea
              id="gallery_image_urls"
              name="gallery_image_urls"
              rows={6}
              defaultValue={defaults.galleryImageUrls}
              placeholder="One image URL per line"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gallery_video_urls">Gallery video URLs</Label>
            <Textarea
              id="gallery_video_urls"
              name="gallery_video_urls"
              rows={6}
              defaultValue={defaults.galleryVideoUrls}
              placeholder="One video URL per line"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort order</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={defaults.sortOrder}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="seo_title">SEO title</Label>
            <Input
              id="seo_title"
              name="seo_title"
              defaultValue={defaults.seoTitle}
              placeholder="Optional custom page title"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="seo_description">SEO description</Label>
            <Textarea
              id="seo_description"
              name="seo_description"
              rows={3}
              defaultValue={defaults.seoDescription}
              placeholder="Optional custom meta description"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-[#fbfafc] px-4 py-3">
            <input type="checkbox" name="featured" defaultChecked={defaults.featured} className="h-4 w-4" />
            <span className="text-sm text-foreground">Feature this story on the homepage and gallery hero.</span>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-border/70 bg-[#fbfafc] px-4 py-3">
            <input type="checkbox" name="published" defaultChecked={defaults.published} className="h-4 w-4" />
            <span className="text-sm text-foreground">Publish this story to the public website.</span>
          </label>
        </div>
      </div>

      {state && 'error' in state ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-full bg-[#4b2e6f] text-white hover:bg-[#40255f]" disabled={isPending}>
          {isPending ? 'Saving...' : story ? 'Save story' : 'Create story'}
        </Button>
        <Button asChild type="button" variant="outline" className="rounded-full bg-transparent">
          <Link href="/admin/success-stories">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
