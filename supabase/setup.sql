-- Run this once in your Supabase project: Dashboard > SQL Editor > New query > paste > Run.
-- It creates everything the Robotics Club site needs. Safe to run again.

-- Site content ('site') and the admin account ('auth'), stored as JSON documents.
create table if not exists public.site_store (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- Messages sent through the public contact form.
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

-- Lock both tables. With row level security on and no policies, nobody can read or write
-- them through the public API; only the website's server (using the service role key) can.
alter table public.site_store enable row level security;
alter table public.contact_messages enable row level security;

-- Public bucket for images uploaded in the admin, so they can be shown on the site.
-- Only the website's server can upload; anyone can view.
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;
