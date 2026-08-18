-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Creates one row per signed-in user holding their whole app state as JSON,
-- mirroring the shape already used in localStorage: { days, history, checked }.

create table if not exists public.plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.plans enable row level security;

create policy "Users can read their own plan"
  on public.plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own plan"
  on public.plans for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own plan"
  on public.plans for update
  using (auth.uid() = user_id);
