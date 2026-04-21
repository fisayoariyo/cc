'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { saveProperty, type PropertySaveState } from '@/app/(admin)/admin/listings/actions';
import type { PropertyRow } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
export function AdminPropertyForm({
  initial,
  redirectTo = '/admin/listings',
  showAgentField = false,
  actor = 'admin',
}: {
  initial?: PropertyRow | null;
  redirectTo?: string;
  showAgentField?: boolean;
  actor?: 'admin' | 'agent';
}) {
  const [state, formAction, isPending] = useActionState<PropertySaveState, FormData>(
    saveProperty,
    null,
  );

  const imagesText = (initial?.images ?? []).join('\n');
  const amenitiesText = (initial?.amenities ?? []).join('\n');
  const labelsText = (initial?.labels ?? []).join('\n');
  const isAgent = actor === 'agent';

  return (
    <form action={formAction} className="max-w-2xl space-y-6">
      <input type="hidden" name="redirect_to" value={redirectTo} />
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}

      {state?.error ? (
        <div
          className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {state.error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required defaultValue={initial?.title ?? ''} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={initial?.description ?? ''}
            className="resize-y min-h-[120px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price (NGN)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={initial?.price != null ? String(initial.price) : ''}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" required defaultValue={initial?.location ?? ''} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            required
            defaultValue={initial?.category ?? 'Buy'}
            className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base md:text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
            <option value="Short-let">Short-let</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="property_type">Property type</Label>
          <Input
            id="property_type"
            name="property_type"
            placeholder="e.g. Apartment, Duplex, Land"
            defaultValue={initial?.property_type ?? ''}
          />
        </div>
        {isAgent ? (
          <input type="hidden" name="status" value={initial?.status ?? 'draft'} />
        ) : (
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              required
              defaultValue={initial?.status ?? 'pending'}
              className="flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base md:text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending review</option>
              <option value="edits_requested">Edits requested</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
              <option value="sold">Sold</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        )}
        {showAgentField ? (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="agent_id">Agent user ID (optional)</Label>
            <Input
              id="agent_id"
              name="agent_id"
              placeholder="UUID of agent profile — leave empty for unassigned"
              defaultValue={initial?.agent_id ?? ''}
            />
          </div>
        ) : null}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="images">Image URLs (one per line or comma-separated)</Label>
          <Textarea id="images" name="images" rows={4} defaultValue={imagesText} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="amenities">Amenities (one per line)</Label>
          <Textarea id="amenities" name="amenities" rows={3} defaultValue={amenitiesText} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="labels">Labels (one per line)</Label>
          <Textarea id="labels" name="labels" rows={2} defaultValue={labelsText} />
        </div>
        {!isAgent ? (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="admin_notes">Admin notes (visible when edits are requested/rejected)</Label>
            <Textarea id="admin_notes" name="admin_notes" rows={3} defaultValue={initial?.admin_notes ?? ''} />
          </div>
        ) : initial?.admin_notes ? (
          <div className="md:col-span-2 rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Admin note</p>
            <p>{initial.admin_notes}</p>
          </div>
        ) : null}
        <div className="flex items-center gap-2 md:col-span-2">
          <input
            id="is_featured"
            name="is_featured"
            type="checkbox"
            value="on"
            defaultChecked={initial?.is_featured ?? false}
            className="h-4 w-4 rounded border border-input"
          />
          <Label htmlFor="is_featured" className="font-normal cursor-pointer">
            Featured listing
          </Label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {isAgent ? (
          <>
            <Button type="submit" name="submission_mode" value="draft" className="rounded-full" disabled={isPending}>
              {isPending ? 'Saving…' : 'Save draft'}
            </Button>
            <Button
              type="submit"
              name="submission_mode"
              value={initial?.status === 'edits_requested' || initial?.status === 'rejected' ? 'resubmit' : 'submit'}
              className="rounded-full"
              disabled={isPending}
            >
              {isPending
                ? 'Submitting…'
                : initial?.status === 'edits_requested' || initial?.status === 'rejected'
                  ? 'Resubmit for review'
                  : 'Submit for review'}
            </Button>
          </>
        ) : (
          <Button type="submit" className="rounded-full" disabled={isPending}>
            {isPending ? 'Saving…' : initial?.id ? 'Save changes' : 'Create listing'}
          </Button>
        )}
        <Button asChild type="button" variant="outline" className="rounded-full bg-transparent">
          <Link href={redirectTo.startsWith('/agent') ? '/agent' : '/admin/listings'}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
