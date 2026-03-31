-- Synax / ticket backend — Supabase Postgres şeması
-- Supabase SQL Editor'da bir kez çalıştırın.
-- Sunucu SUPABASE_SERVICE_ROLE_KEY ile bağlanır (RLS bypass).

create table if not exists public.events (
  id text primary key,
  title text not null,
  description text not null,
  image text not null,
  status text not null check (status in ('active', 'past')),
  application_form jsonb not null default '{"version": 1, "questions": []}'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.bracelets (
  id text primary key,
  title text not null,
  description text not null,
  image text not null,
  sort_order int not null default 0
);

create table if not exists public.applications (
  id text primary key,
  event_id text not null references public.events (id) on delete cascade,
  event_title_snapshot text not null,
  status text not null check (status in ('pending', 'accepted', 'issued', 'rejected')),
  created_at timestamptz not null,
  form_version int not null default 1,
  answers jsonb not null default '{}'::jsonb
);

create index if not exists idx_events_sort on public.events (sort_order, created_at);
create index if not exists idx_bracelets_sort on public.bracelets (sort_order);
create index if not exists idx_applications_event on public.applications (event_id);
create index if not exists idx_applications_created on public.applications (created_at desc);

alter table public.events enable row level security;
alter table public.bracelets enable row level security;
alter table public.applications enable row level security;

-- Anon: doğrudan erişim yok; tüm okuma/yazma kendi Express API üzerinden (service role).
