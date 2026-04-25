'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import type { PropertyRecord, PropertyStatus } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

type FormState = {
  title: string;
  slug: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqm: number;
  type: string;
  propertyType: 'residential' | 'commercial';
  city: string;
  description: string;
  status: PropertyStatus;
  image: string;
  imagesText: string;
  featured: boolean;
};

const empty: FormState = {
  title: '',
  slug: '',
  location: '',
  price: '',
  beds: 4,
  baths: 4,
  sqm: 300,
  type: 'For Sale',
  propertyType: 'residential',
  city: 'lagos',
  description: '',
  status: 'draft',
  image: '',
  imagesText: '',
  featured: false,
};

type Mode = 'create' | 'edit';

export default function ListingForm({
  mode,
  initial,
}: {
  mode: Mode;
  initial?: PropertyRecord;
}) {
  const router = useRouter();
  const base = useMemo(() => {
    if (mode === 'edit' && initial) {
      return {
        title: initial.title,
        slug: initial.slug,
        location: initial.location,
        price: initial.price,
        beds: initial.beds,
        baths: initial.baths,
        sqm: initial.sqm,
        type: initial.type,
        propertyType: initial.propertyType,
        city: initial.city,
        description: initial.description,
        status: initial.status,
        image: initial.image,
        imagesText: initial.images.join('\n'),
        featured: !!initial.featured,
      };
    }
    return { ...empty, slug: '' };
  }, [mode, initial]);

  const [form, setForm] = useState<FormState>(base);
  const [autoSlug, setAutoSlug] = useState(mode === 'create');

  const update = (k: keyof FormState, v: string | number | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(mode === 'create' ? 'Listing created (demo — not persisted).' : 'Listing saved (demo — not persisted).');
    router.push('/admin/listings');
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => {
                const t = e.target.value;
                update('title', t);
                if (autoSlug && mode === 'create') update('slug', slugify(t));
              }}
              required
              className="bg-card"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">URL slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => {
                setAutoSlug(false);
                update('slug', e.target.value);
              }}
              required
              className="bg-card font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">Shown as /properties/[slug]</p>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => update('status', v as PropertyStatus)}
            >
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={form.location} onChange={(e) => update('location', e.target.value)} required className="bg-card" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" value={form.price} onChange={(e) => update('price', e.target.value)} required className="bg-card" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Listing type</Label>
            <Input id="type" value={form.type} onChange={(e) => update('type', e.target.value)} className="bg-card" />
          </div>
          <div className="space-y-2">
            <Label>Property type</Label>
            <Select
              value={form.propertyType}
              onValueChange={(v) => update('propertyType', v as 'residential' | 'commercial')}
            >
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>City key</Label>
            <Select value={form.city} onValueChange={(v) => update('city', v)}>
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ibadan">Ibadan</SelectItem>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="abuja">Abuja</SelectItem>
                <SelectItem value="ogun">Ogun</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="beds">Beds</Label>
            <Input
              id="beds"
              type="number"
              min={0}
              value={form.beds}
              onChange={(e) => update('beds', Number(e.target.value))}
              className="bg-card"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="baths">Baths</Label>
            <Input
              id="baths"
              type="number"
              min={0}
              value={form.baths}
              onChange={(e) => update('baths', Number(e.target.value))}
              className="bg-card"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sqm">Area (m²)</Label>
            <Input
              id="sqm"
              type="number"
              min={0}
              value={form.sqm}
              onChange={(e) => update('sqm', Number(e.target.value))}
              className="bg-card"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="image">Cover image URL</Label>
            <Input id="image" value={form.image} onChange={(e) => update('image', e.target.value)} className="bg-card" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="images">Gallery image URLs (one per line)</Label>
            <Textarea
              id="images"
              rows={4}
              value={form.imagesText}
              onChange={(e) => update('imagesText', e.target.value)}
              className="bg-card font-mono text-sm"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={6}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="bg-card"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" className="rounded-full">
            {mode === 'create' ? 'Create listing' : 'Save changes'}
          </Button>
          <Button type="button" variant="outline" className="rounded-full bg-transparent" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
  );
}
