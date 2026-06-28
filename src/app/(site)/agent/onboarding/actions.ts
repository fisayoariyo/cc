'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getViewerContext } from '@/lib/supabase/dashboard-access';
import { isAgentOnboardingComplete } from '@/lib/agent-onboarding';
import { validateFullNameSingleField } from '@/lib/auth/validation';

export type OnboardingActionState = { error: string } | { ok: true } | null;

const NIN_PATTERN = /^\d{11}$/;

function cleanFileName(name: string) {
  return name.replace(/[^\w.-]+/g, '_');
}

export async function saveAgentLocation(prev: OnboardingActionState, formData: FormData): Promise<OnboardingActionState> {
  const viewer = await getViewerContext();
  if (!viewer || viewer.role !== 'agent') return { error: 'Not allowed.' };

  const state = String(formData.get('agent_state') ?? '').trim();
  const lga = String(formData.get('agent_lga') ?? '').trim();
  if (!state) return { error: 'Please select your state.' };
  if (!lga) return { error: 'Please select your LGA.' };

  const supabase = await createClient();
  if (!supabase) return { error: 'Configuration missing. Please contact support.' };

  const { error } = await supabase
    .from('profiles')
    .update({ agent_state: state, agent_lga: lga, onboarding_step: 'details' })
    .eq('id', viewer.userId)
    .eq('role', 'agent');

  if (error) return { error: error.message };

  revalidatePath('/agent/onboarding/location');
  revalidatePath('/agent/onboarding/details');
  return { ok: true };
}

function isUploadFile(value: FormDataEntryValue | null): value is File {
  return (
    typeof value === 'object' &&
    value !== null &&
    'arrayBuffer' in value &&
    typeof (value as File).size === 'number' &&
    (value as File).size > 0
  );
}

export async function saveAgentDocuments(prev: OnboardingActionState, formData: FormData): Promise<OnboardingActionState> {
  const viewer = await getViewerContext();
  if (!viewer || viewer.role !== 'agent') return { error: 'Not allowed.' };

  const nin = String(formData.get('nin') ?? '').trim();
  const file = formData.get('photo');

  if (!NIN_PATTERN.test(nin)) return { error: 'NIN must be exactly 11 digits.' };

  const supabase = await createClient();
  if (!supabase) return { error: 'Configuration missing. Please contact support.' };

  const { data: existing } = await supabase
    .from('profiles')
    .select('photo_url')
    .eq('id', viewer.userId)
    .maybeSingle();

  let photoUrl = existing?.photo_url ?? null;

  if (isUploadFile(file)) {
    if (file.size > 5 * 1024 * 1024) return { error: 'Photo must be 5MB or smaller.' };
    if (!file.type.startsWith('image/')) return { error: 'Please upload an image file.' };

    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
    const filePath = `${viewer.userId}/photo_${Date.now()}_${cleanFileName(file.name || `photo.${ext}`)}`;

    const { error: uploadError } = await supabase.storage
      .from('agent-documents')
      .upload(filePath, file, { contentType: file.type || 'image/jpeg', upsert: false });
    if (uploadError) return { error: `Photo upload failed: ${uploadError.message}` };

    const { data: publicData } = supabase.storage.from('agent-documents').getPublicUrl(filePath);
    photoUrl = publicData.publicUrl;
  }

  if (!photoUrl) return { error: 'Please upload a profile photo.' };

  const { error } = await supabase
    .from('profiles')
    .update({ nin, photo_url: photoUrl, onboarding_step: 'location' })
    .eq('id', viewer.userId)
    .eq('role', 'agent');

  if (error) return { error: error.message };

  revalidatePath('/agent/onboarding/identity');
  revalidatePath('/agent/onboarding/location');
  return { ok: true };
}

export async function saveAgentDetails(prev: OnboardingActionState, formData: FormData): Promise<OnboardingActionState> {
  const viewer = await getViewerContext();
  if (!viewer || viewer.role !== 'agent') return { error: 'Not allowed.' };

  const address = String(formData.get('agent_address') ?? '').trim();
  const nextOfKinName = String(formData.get('next_of_kin_name') ?? '').trim();
  const nextOfKinPhone = String(formData.get('next_of_kin_phone') ?? '').trim();
  const nextOfKinRelationship = String(formData.get('next_of_kin_relationship') ?? '').trim();

  if (!address) return { error: 'Please enter your address.' };
  if (!nextOfKinName) return { error: 'Please enter your next of kin name.' };
  const kinNameCheck = validateFullNameSingleField(nextOfKinName);
  if (!kinNameCheck.ok) return { error: kinNameCheck.message };
  if (!nextOfKinPhone) return { error: 'Please enter your next of kin phone number.' };
  if (!nextOfKinRelationship) return { error: 'Please enter your relationship with next of kin.' };

  const supabase = await createClient();
  if (!supabase) return { error: 'Configuration missing. Please contact support.' };

  const { error } = await supabase
    .from('profiles')
    .update({
      agent_address: address,
      next_of_kin_name: nextOfKinName,
      next_of_kin_phone: nextOfKinPhone,
      next_of_kin_relationship: nextOfKinRelationship,
    })
    .eq('id', viewer.userId)
    .eq('role', 'agent');

  if (error) return { error: error.message };

  revalidatePath('/agent/onboarding/details');
  revalidatePath('/agent/under-review');
  return { ok: true };
}

export async function submitAgentOnboarding(): Promise<OnboardingActionState> {
  const viewer = await getViewerContext();
  if (!viewer || viewer.role !== 'agent') return { error: 'Not allowed.' };

  const supabase = await createClient();
  if (!supabase) return { error: 'Configuration missing. Please contact support.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email_confirmed_at) {
    return { error: 'Please confirm your email from the link we sent when you created your account.' };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(
      'onboarding_step, agent_state, agent_lga, agent_address, nin, photo_url, next_of_kin_name, next_of_kin_phone, next_of_kin_relationship',
    )
    .eq('id', viewer.userId)
    .maybeSingle();

  if (
    !profile?.agent_state ||
    !profile.agent_lga ||
    !profile.nin ||
    !profile.photo_url ||
    !profile.agent_address ||
    !profile.next_of_kin_name ||
    !profile.next_of_kin_phone ||
    !profile.next_of_kin_relationship
  ) {
    return { error: 'Complete all onboarding steps first.' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_step: 'submitted' })
    .eq('id', viewer.userId)
    .eq('role', 'agent');

  if (error) return { error: error.message };

  revalidatePath('/agent/onboarding');
  revalidatePath('/agent/under-review');
  revalidatePath('/admin/agents');
  redirect('/agent/under-review');
}

export async function resendAgentVerificationEmail(): Promise<OnboardingActionState> {
  const viewer = await getViewerContext();
  if (!viewer || viewer.role !== 'agent' || !viewer.email) return { error: 'Not allowed.' };

  const supabase = await createClient();
  if (!supabase) return { error: 'Configuration missing. Please contact support.' };

  const { error } = await supabase.auth.resend({ type: 'signup', email: viewer.email });
  if (error) return { error: error.message };
  return { ok: true };
}

export async function getAgentOnboardingProfile() {
  const viewer = await getViewerContext();
  if (!viewer || viewer.role !== 'agent') return null;

  const supabase = await createClient();
  if (!supabase) return null;

  const [{ data: profile }, { data: { user } }] = await Promise.all([
    supabase
      .from('profiles')
      .select(
        'agent_state, agent_lga, agent_address, nin, photo_url, gender, next_of_kin_name, next_of_kin_phone, next_of_kin_relationship, onboarding_step',
      )
      .eq('id', viewer.userId)
      .maybeSingle(),
    supabase.auth.getUser(),
  ]);

  if (!profile) return null;

  return {
    ...profile,
    emailConfirmed: Boolean(user?.email_confirmed_at),
    onboardingComplete: isAgentOnboardingComplete(profile.onboarding_step),
  };
}
