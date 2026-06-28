-- DotCharis Consult — initial schema (PRD v2.0 + project rules)
-- Run this in Supabase SQL Editor (Dashboard → SQL → New query) after creating the project.
-- Then enable Auth email provider under Authentication → Providers if needed.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('admin', 'agent', 'client');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.user_status as enum ('pending', 'verified', 'rejected', 'suspended');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.agent_verification_status as enum ('pending', 'verified', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.listing_type as enum ('sale', 'rent');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.property_status as enum (
    'draft',
    'pending_approval',
    'edits_requested',
    'active',
    'featured',
    'rejected',
    'archived'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.travel_service_type as enum (
    'visa',
    'education',
    'tourism',
    'flights',
    'immigration',
    'relocation'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.travel_application_status as enum (
    'draft',
    'submitted',
    'in_progress',
    'action_required',
    'completed',
    'cancelled'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.document_status as enum (
    'not_submitted',
    'under_review',
    'accepted',
    'rejected',
    'resubmit_required'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.inquiry_status as enum ('new', 'actioned', 'archived');
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- profiles (1:1 with auth.users — app-level role & onboarding)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  role public.user_role not null default 'client',
  status public.user_status not null default 'pending',
  onboarding_fee_paid boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles (role);
create index if not exists profiles_status_idx on public.profiles (status);

-- ---------------------------------------------------------------------------
-- agent_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.agent_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  agency_name text,
  registration_number text,
  verification_status public.agent_verification_status not null default 'pending',
  rejection_reason text,
  verified_at timestamptz,
  verified_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

create index if not exists agent_profiles_user_id_idx on public.agent_profiles (user_id);

-- ---------------------------------------------------------------------------
-- properties
-- ---------------------------------------------------------------------------
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.profiles (id) on delete set null,
  slug text not null unique,
  title text not null,
  description text,
  listing_type public.listing_type not null default 'sale',
  property_type text not null default 'residential',
  price numeric(20, 2) not null,
  city text not null,
  address text,
  bedrooms int not null default 0,
  bathrooms int not null default 0,
  size_sqm numeric(12, 2),
  amenities text[] not null default '{}',
  labels text[] not null default '{}',
  images text[] not null default '{}',
  status public.property_status not null default 'draft',
  admin_notes text,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references public.profiles (id)
);

create index if not exists properties_agent_id_idx on public.properties (agent_id);
create index if not exists properties_status_idx on public.properties (status);
create index if not exists properties_city_idx on public.properties (city);
create index if not exists properties_slug_idx on public.properties (slug);

-- ---------------------------------------------------------------------------
-- travel_applications
-- ---------------------------------------------------------------------------
create table if not exists public.travel_applications (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  service_type public.travel_service_type not null,
  form_data jsonb not null default '{}',
  current_stage int not null default 0,
  status public.travel_application_status not null default 'draft',
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists travel_applications_client_id_idx on public.travel_applications (client_id);
create index if not exists travel_applications_status_idx on public.travel_applications (status);

-- ---------------------------------------------------------------------------
-- application_documents
-- ---------------------------------------------------------------------------
create table if not exists public.application_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.travel_applications (id) on delete cascade,
  document_name text not null,
  file_url text,
  status public.document_status not null default 'not_submitted',
  admin_note text,
  uploaded_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id)
);

create index if not exists application_documents_application_id_idx
  on public.application_documents (application_id);

-- ---------------------------------------------------------------------------
-- application_stage_history
-- ---------------------------------------------------------------------------
create table if not exists public.application_stage_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.travel_applications (id) on delete cascade,
  stage_index int not null,
  stage_label text not null,
  note_to_client text,
  changed_by uuid references public.profiles (id),
  changed_at timestamptz not null default now()
);

create index if not exists application_stage_history_app_id_idx
  on public.application_stage_history (application_id);

-- ---------------------------------------------------------------------------
-- inquiries (public site form submissions — PRD §9.5)
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_type text not null,
  source_page text,
  full_name text,
  email text,
  phone text,
  message text,
  metadata jsonb not null default '{}',
  status public.inquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger helper
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists agent_profiles_set_updated_at on public.agent_profiles;
create trigger agent_profiles_set_updated_at
  before update on public.agent_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

drop trigger if exists travel_applications_set_updated_at on public.travel_applications;
create trigger travel_applications_set_updated_at
  before update on public.travel_applications
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- New auth user → profile row (default client)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    case
      when new.raw_user_meta_data->>'role' in ('admin', 'agent', 'client')
      then (new.raw_user_meta_data->>'role')::public.user_role
      else 'client'::public.user_role
    end,
    'pending'
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.agent_profiles enable row level security;
alter table public.properties enable row level security;
alter table public.travel_applications enable row level security;
alter table public.application_documents enable row level security;
alter table public.application_stage_history enable row level security;
alter table public.inquiries enable row level security;

-- profiles: users read/update own row; admins read all (via policy using profiles.role)
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (
    auth.uid() = id
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- agent_profiles: agent sees own; admin sees all
create policy "agent_profiles_select"
  on public.agent_profiles for select
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "agent_profiles_insert_own"
  on public.agent_profiles for insert
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'agent')
  );

create policy "agent_profiles_update_own"
  on public.agent_profiles for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- properties: agents CRUD own listings; public read active/featured; admin all
create policy "properties_select_public"
  on public.properties for select
  using (
    status in ('active', 'featured')
    or agent_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "properties_insert_agent"
  on public.properties for insert
  with check (
    agent_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      join public.agent_profiles ap on ap.user_id = p.id
      where p.id = auth.uid()
        and p.role = 'agent'
        and p.status = 'verified'
        and p.onboarding_fee_paid = true
        and ap.verification_status = 'verified'
    )
  );

create policy "properties_insert_admin"
  on public.properties for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "properties_update_agent_or_admin"
  on public.properties for update
  using (
    agent_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "properties_delete_agent_or_admin"
  on public.properties for delete
  using (
    agent_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- travel: client owns; admin all
create policy "travel_applications_select"
  on public.travel_applications for select
  using (
    client_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "travel_applications_insert_client"
  on public.travel_applications for insert
  with check (
    client_id = auth.uid()
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'client')
  );

create policy "travel_applications_update"
  on public.travel_applications for update
  using (
    client_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- documents: client on parent app; admin all
create policy "application_documents_select"
  on public.application_documents for select
  using (
    exists (
      select 1 from public.travel_applications t
      where t.id = application_id
        and (t.client_id = auth.uid()
          or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
    )
  );

create policy "application_documents_modify"
  on public.application_documents for all
  using (
    exists (
      select 1 from public.travel_applications t
      where t.id = application_id
        and (t.client_id = auth.uid()
          or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
    )
  );

create policy "application_stage_history_select"
  on public.application_stage_history for select
  using (
    exists (
      select 1 from public.travel_applications t
      where t.id = application_id
        and (t.client_id = auth.uid()
          or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
    )
  );

create policy "application_stage_history_insert_admin"
  on public.application_stage_history for insert
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- inquiries: authenticated users may submit; anonymous public forms should use a Server Action
-- with SUPABASE_SERVICE_ROLE_KEY (bypasses RLS) or a dedicated Edge Function.
create policy "inquiries_insert_authenticated"
  on public.inquiries for insert
  with check (auth.uid() is not null);

create policy "inquiries_select_admin"
  on public.inquiries for select
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "inquiries_update_admin"
  on public.inquiries for update
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

comment on table public.profiles is 'App users; role and onboarding_fee_paid gate agent listing rights per project rules.';
comment on table public.properties is 'PRD §10.3 — listing workflow statuses.';
comment on table public.travel_applications is 'PRD §10.4 — travel client applications.';

-- After your first signup (or create user in Supabase Auth UI), grant admin:
-- update public.profiles set role = 'admin', status = 'verified' where email = 'your@email.com';
