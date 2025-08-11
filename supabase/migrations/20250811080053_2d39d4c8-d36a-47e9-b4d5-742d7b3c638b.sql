-- Create enum for roles
create type if not exists public.app_role as enum ('admin', 'moderator', 'user');

-- Create user_roles table
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

-- site_settings singleton table using a fixed key
create table if not exists public.site_settings (
  key text primary key default 'default',
  site_name text not null default 'Sarkar Sales',
  tagline text,
  phone text,
  whatsapp_number text,
  email text,
  address text,
  map_embed_src text,
  city text,
  canonical_url text,
  logo_url text,
  primary_color text,
  secondary_color text,
  base_font_size int default 16,
  festive_enabled boolean default false,
  festive_image_url text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- RLS: anyone can read settings (public website)
create policy if not exists "Anyone can read site settings"
  on public.site_settings
  for select
  using (true);

-- Only admins can insert/update/delete settings
create policy if not exists "Admins can modify site settings"
  on public.site_settings
  for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Seed default row if not exists
insert into public.site_settings (key, site_name, tagline, phone, whatsapp_number, email, address, map_embed_src, city, canonical_url)
values (
  'default', 'Sarkar Sales', 'Exide Batteries & Microtek Inverters', '+91 90000 00000', '919000000000', 'sales@sarkarsales.example.com',
  'Near Main Market, Your City, India', 'https://www.google.com/maps?&q=Your%20City%20Main%20Market&output=embed', 'Your City', 'https://sarkarsales.example.com/'
)
on conflict (key) do nothing;

-- Storage buckets for branding and promos
insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('promos', 'promos', true)
on conflict (id) do nothing;

-- Storage policies: public can view, only admins can write
create policy if not exists "Public can view branding files" on storage.objects
for select using (bucket_id = 'branding');

create policy if not exists "Admins can manage branding files" on storage.objects
for all to authenticated
using (bucket_id = 'branding' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'branding' and public.has_role(auth.uid(), 'admin'));

create policy if not exists "Public can view promo files" on storage.objects
for select using (bucket_id = 'promos');

create policy if not exists "Admins can manage promo files" on storage.objects
for all to authenticated
using (bucket_id = 'promos' and public.has_role(auth.uid(), 'admin'))
with check (bucket_id = 'promos' and public.has_role(auth.uid(), 'admin'));

-- Realtime support (optional but useful later)
alter table public.site_settings replica identity full;
-- Add to publication for realtime
-- Note: If table already in publication, this will error; safe to ignore in deployment pipelines
do $$
begin
  execute 'alter publication supabase_realtime add table public.site_settings';
exception when others then null;
end $$;