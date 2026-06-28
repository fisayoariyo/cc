'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { saveProperty, type PropertySaveState } from '@/app/(admin)/admin/listings/actions';
import type { PropertyRow } from '@/lib/types/database';
import {
  AGENT_FORM_FIELD_CLASS,
  AGENT_FORM_LABEL_CLASS,
  AGENT_FORM_SELECT_CLASS,
  AGENT_FORM_TEXTAREA_CLASS,
  agentButtonRadiusClass,
} from '@/lib/agent-dashboard-theme';
import { dashboardButtonRadiusClass } from '@/lib/dashboard-theme';
import { PropertyImageUploadField } from '@/components/admin/property-image-upload-field';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/components/ui/utils';
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
  const [imagesUploading, setImagesUploading] = useState(false);

  const amenitiesText = (initial?.amenities ?? []).join('\n');
  const isAgent = actor === 'agent';
  const fieldClass = isAgent ? AGENT_FORM_FIELD_CLASS : undefined;
  const textareaClass = isAgent ? cn(AGENT_FORM_TEXTAREA_CLASS, 'resize-y') : 'resize-y min-h-[120px]';
  const selectClass = isAgent
    ? AGENT_FORM_SELECT_CLASS
    : 'flex h-9 w-full rounded-md border border-input bg-input-background px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-sm';
  const labelClass = isAgent ? AGENT_FORM_LABEL_CLASS : undefined;
  const submitDisabled = isPending || imagesUploading;

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
          <Label htmlFor="title" className={labelClass}>Title</Label>
          <Input id="title" name="title" required defaultValue={initial?.title ?? ''} className={fieldClass} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description" className={labelClass}>Description</Label>
          <Textarea
            id="description"
            name="description"
            rows={5}
            defaultValue={initial?.description ?? ''}
            className={textareaClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className={labelClass}>Price (NGN)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={1}
            step={1}
            required
            defaultValue={initial?.price != null ? String(initial.price) : ''}
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className={labelClass}>Location</Label>
          <Input id="location" name="location" required defaultValue={initial?.location ?? ''} className={fieldClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className={labelClass}>Category</Label>
          <select
            id="category"
            name="category"
            required
            defaultValue={initial?.category ?? 'Buy'}
            className={selectClass}
          >
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
            <option value="Short-let">Short-let</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="property_type" className={labelClass}>Property type</Label>
          <Input
            id="property_type"
            name="property_type"
            placeholder="e.g. Apartment, Duplex, Land"
            defaultValue={initial?.property_type ?? ''}
            className={fieldClass}
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
        <PropertyImageUploadField
          initialImages={initial?.images}
          variant={isAgent ? 'agent' : 'admin'}
          onUploadingChange={setImagesUploading}
        />
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="amenities" className={labelClass}>Amenities (one per line)</Label>
          <Textarea id="amenities" name="amenities" rows={3} defaultValue={amenitiesText} className={textareaClass} />
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
            <Button type="submit" name="submission_mode" value="draft" className={agentButtonRadiusClass} disabled={submitDisabled}>
              {isPending ? 'Saving…' : imagesUploading ? 'Uploading photos…' : 'Save draft'}
            </Button>
            <Button
              type="submit"
              name="submission_mode"
              value={initial?.status === 'edits_requested' || initial?.status === 'rejected' ? 'resubmit' : 'submit'}
              className={agentButtonRadiusClass}
              disabled={submitDisabled}
            >
              {isPending
                ? 'Submitting…'
                : imagesUploading
                  ? 'Uploading photos…'
                  : initial?.status === 'edits_requested' || initial?.status === 'rejected'
                    ? 'Resubmit for review'
                    : 'Submit for review'}
            </Button>
          </>
        ) : (
          <Button type="submit" className={isAgent ? agentButtonRadiusClass : dashboardButtonRadiusClass} disabled={submitDisabled}>
            {isPending ? 'Saving…' : imagesUploading ? 'Uploading photos…' : initial?.id ? 'Save changes' : 'Create listing'}
          </Button>
        )}
        <Button asChild type="button" variant="outline" className={cn(isAgent ? agentButtonRadiusClass : dashboardButtonRadiusClass, 'bg-transparent')}>
          <Link href={redirectTo.startsWith('/agent') ? '/agent' : '/admin/listings'}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
