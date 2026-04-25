'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import type { PropertyCategory, PropertyStatus } from '@/lib/types/database';
import { createNotification } from '@/lib/supabase/notifications';
import { LISTING_STATUS_VALUES } from '@/lib/workflow-rules';

export type PropertySaveState = { error: string } | null;

const CATEGORIES: PropertyCategory[] = ['Buy', 'Rent', 'Short-let'];
const STATUSES: PropertyStatus[] = LISTING_STATUS_VALUES;

function parseImages(text: string): string[] {
  return text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseAmenities(text: string): string[] {
  return text
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function saveProperty(prevState: PropertySaveState, formData: FormData): Promise<PropertySaveState> {
  const viewer = await getViewerContext();
  if (!viewer) {
    return { error: 'You must be signed in.' };
  }

  const supabase = await createClient();
  const role = viewer.role;
  if (role !== 'admin' && role !== 'agent') {
    return { error: 'Not allowed.' };
  }

  const id = String(formData.get('id') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const priceRaw = String(formData.get('price') ?? '').replace(/[^\d.]/g, '');
  const price = Number(priceRaw);
  const location = String(formData.get('location') ?? '').trim();
  const category = String(formData.get('category') ?? '') as PropertyCategory;
  const propertyType = String(formData.get('property_type') ?? '').trim();
  const statusInput = String(formData.get('status') ?? 'pending') as PropertyStatus;
  const submissionMode = String(formData.get('submission_mode') ?? '').trim();
  const isFeatured = formData.get('is_featured') === 'on';
  const images = parseImages(String(formData.get('images') ?? ''));
  const amenities = parseAmenities(String(formData.get('amenities') ?? ''));
  const adminNotes = String(formData.get('admin_notes') ?? '').trim();
  const agentIdForm = String(formData.get('agent_id') ?? '').trim();

  if (!title || !location || !Number.isFinite(price) || price <= 0) {
    return { error: 'Title, location, and a valid price are required.' };
  }
  if (!CATEGORIES.includes(category)) {
    return { error: 'Invalid category.' };
  }
  if (!STATUSES.includes(statusInput)) {
    return { error: 'Invalid status.' };
  }

  let agent_id: string | null = null;
  if (role === 'agent') {
    agent_id = viewer.userId;
  } else if (role === 'admin') {
    agent_id = agentIdForm || null;
  }

  let status: PropertyStatus = statusInput;
  let admin_notes: string | null = adminNotes || null;

  if (role === 'agent') {
    const existing = id
      ? await supabase
          .from('properties')
          .select('id, status, agent_id')
          .eq('id', id)
          .eq('agent_id', viewer.userId)
          .maybeSingle()
      : null;
    if (id && !existing?.data?.id) {
      return { error: 'Listing not found or not owned by you.' };
    }

    const currentStatus = (existing?.data?.status as PropertyStatus | undefined) ?? 'draft';
    if (!id) {
      status = submissionMode === 'submit' ? 'pending' : 'draft';
    } else if (currentStatus === 'draft') {
      status = submissionMode === 'submit' ? 'pending' : 'draft';
    } else if (currentStatus === 'edits_requested' || currentStatus === 'rejected') {
      status = submissionMode === 'resubmit' || submissionMode === 'submit' ? 'pending' : 'draft';
    } else {
      status = currentStatus;
    }
    // Agents cannot set moderation notes/reviewer columns directly.
    admin_notes = null;
  }

  const payload = {
    title,
    description: description || null,
    price,
    location,
    category,
    property_type: propertyType || null,
    images,
    amenities,
    status,
    is_featured: isFeatured,
    admin_notes,
    agent_id,
  };

  if (id) {
    const { error } = await supabase.from('properties').update(payload).eq('id', id);
    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase.from('properties').insert(payload);
    if (error) {
      return { error: error.message };
    }
  }

  revalidatePath('/admin/listings');
  revalidatePath('/admin');
  revalidatePath('/properties');
  revalidatePath('/agent');

  const redirectTo = String(formData.get('redirect_to') ?? '/admin/listings');
  const safe =
    redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/admin/listings';
  redirect(safe);
}

export async function moderatePropertyListing(input: {
  listingId: string;
  decision: 'approve' | 'request_edits' | 'reject' | 'archive';
  note?: string;
}) {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'Not signed in.' };
  if (viewer.role !== 'admin') return { error: 'Only admins can moderate listings.' };

  const supabase = await createClient();

  const note = input.note?.trim() ?? '';
  if (input.decision === 'request_edits' && !note) {
    return { error: 'Please add edit instructions for the agent.' };
  }

  const statusByDecision: Record<typeof input.decision, PropertyStatus> = {
    approve: 'active',
    request_edits: 'edits_requested',
    reject: 'rejected',
    archive: 'archived',
  };

  const { data: listing } = await supabase.from('properties').select('title, agent_id').eq('id', input.listingId).maybeSingle();
  const { error } = await supabase
    .from('properties')
    .update({
      status: statusByDecision[input.decision],
      admin_notes: note || null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: viewer.userId,
      is_featured: input.decision === 'approve',
    })
    .eq('id', input.listingId);

  if (error) return { error: error.message };

  if (listing?.agent_id) {
    await createNotification({
      userId: listing.agent_id,
      type: 'listing',
      title: `Listing ${statusByDecision[input.decision].replace(/_/g, ' ')}`,
      body: `${listing.title}: ${note || 'Admin updated your listing status.'}`,
      linkUrl: '/agent',
    });
  }

  revalidatePath('/admin/listings');
  revalidatePath('/admin');
  revalidatePath('/agent');
  revalidatePath('/properties');
  return { ok: true };
}
