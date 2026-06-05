create table if not exists public.app_state (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id text primary key,
  payload jsonb not null,
  source text,
  platform text,
  status text,
  updated_at timestamptz not null default now()
);

create index if not exists contacts_platform_idx on public.contacts(platform);
create index if not exists contacts_status_idx on public.contacts(status);
