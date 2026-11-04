-- Run this in Supabase Dashboard > SQL Editor > New query.
-- The only account allowed to manage portfolio content is chianaeli@gmail.com.

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('longForm', 'reels', 'designs')),
  type text not null check (type in ('video', 'image')),
  title text not null,
  description text default '',
  label text default '',
  url text not null,
  thumbnail text default '',
  created_at timestamptz not null default now()
);

alter table public.portfolio_projects enable row level security;

drop policy if exists "Public can view portfolio projects" on public.portfolio_projects;
create policy "Public can view portfolio projects"
  on public.portfolio_projects for select to anon, authenticated using (true);

drop policy if exists "ANC admin can add portfolio projects" on public.portfolio_projects;
create policy "ANC admin can add portfolio projects"
  on public.portfolio_projects for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'chianaeli@gmail.com');

drop policy if exists "ANC admin can delete portfolio projects" on public.portfolio_projects;
create policy "ANC admin can delete portfolio projects"
  on public.portfolio_projects for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'chianaeli@gmail.com');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio', 'portfolio', true, 524288000,
  array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set public = true, file_size_limit = 524288000,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view portfolio media" on storage.objects;
create policy "Public can view portfolio media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio');

drop policy if exists "ANC admin can upload portfolio media" on storage.objects;
create policy "ANC admin can upload portfolio media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and (auth.jwt() ->> 'email') = 'chianaeli@gmail.com');

drop policy if exists "ANC admin can delete portfolio media" on storage.objects;
create policy "ANC admin can delete portfolio media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and (auth.jwt() ->> 'email') = 'chianaeli@gmail.com');
