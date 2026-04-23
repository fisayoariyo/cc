'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { CONSTRUCTION_STAGES, constructionStageLabel } from '@/lib/construction-stages';
import { createNotification } from '@/lib/supabase/notifications';

export async function createConstructionProject(formData: FormData) {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'Not signed in.' };
  if (viewer.role !== 'admin') return { error: 'Not allowed.' };

  const supabase = await createClient();

  const clientId = String(formData.get('client_id') ?? '').trim();
  const title = String(formData.get('title') ?? '').trim();
  const projectType = String(formData.get('project_type') ?? '').trim();
  const location = String(formData.get('location') ?? '').trim();
  const budgetRange = String(formData.get('budget_range') ?? '').trim();
  const timeline = String(formData.get('timeline') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();

  if (!clientId || !title || !projectType || !location) {
    return { error: 'Client ID, title, project type, and location are required.' };
  }

  const firstStage = CONSTRUCTION_STAGES[0].value;
  const { data, error } = await supabase
    .from('construction_projects')
    .insert({
      client_id: clientId,
      title,
      project_type: projectType,
      location,
      budget_range: budgetRange || null,
      timeline: timeline || null,
      description: description || null,
      current_stage: firstStage,
      status: 'in_progress',
      created_by: viewer.userId,
    })
    .select('id')
    .maybeSingle();
  if (error) return { error: error.message };

  await supabase.from('construction_stage_history').insert({
    project_id: data?.id,
    stage_key: firstStage,
    stage_label: constructionStageLabel(firstStage),
    changed_by: viewer.userId,
  });

  await createNotification({
    userId: clientId,
    type: 'construction',
    title: 'Construction project created',
    body: `${title} has been created and is now at stage: ${constructionStageLabel(firstStage)}.`,
    linkUrl: '/construction/dashboard',
  });

  revalidatePath('/admin/construction-projects');
  revalidatePath('/construction/dashboard');
  revalidatePath('/admin');
  return { ok: true };
}

export async function updateConstructionProjectStage(projectId: string, stageKey: string, note?: string) {
  const viewer = await getViewerContext();
  if (!viewer) return { error: 'Not signed in.' };
  if (viewer.role !== 'admin') return { error: 'Not allowed.' };

  const supabase = await createClient();

  const allowed = CONSTRUCTION_STAGES.map((s) => s.value);
  if (!allowed.includes(stageKey as (typeof CONSTRUCTION_STAGES)[number]['value'])) {
    return { error: 'Invalid stage.' };
  }

  const { data: project } = await supabase
    .from('construction_projects')
    .select('id, client_id, title')
    .eq('id', projectId)
    .maybeSingle();
  if (!project) return { error: 'Project not found.' };

  const { error } = await supabase.from('construction_projects').update({ current_stage: stageKey }).eq('id', projectId);
  if (error) return { error: error.message };

  await supabase.from('construction_stage_history').insert({
    project_id: projectId,
    stage_key: stageKey,
    stage_label: constructionStageLabel(stageKey),
    note_to_client: note?.trim() || null,
    changed_by: viewer.userId,
  });

  await createNotification({
    userId: project.client_id,
    type: 'construction',
    title: 'Construction stage updated',
    body: `${project.title}: ${constructionStageLabel(stageKey)}${note?.trim() ? ` - ${note.trim()}` : ''}`,
    linkUrl: '/construction/dashboard',
  });

  revalidatePath('/admin/construction-projects');
  revalidatePath('/construction/dashboard');
  revalidatePath('/admin');
  return { ok: true };
}
