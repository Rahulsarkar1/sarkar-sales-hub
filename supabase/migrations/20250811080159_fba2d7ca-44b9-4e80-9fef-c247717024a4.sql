-- Ensure enum type exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END$$;

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
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'Anyone can read site settings'
  ) THEN
    CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT USING (true);
  END IF;
END$$;

-- Only admins can insert/update/delete settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'site_settings' AND policyname = 'Admins can modify site settings'
  ) THEN
    CREATE POLICY "Admins can modify site settings" ON public.site_settings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END$$;

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
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can view branding files'
  ) THEN
    CREATE POLICY "Public can view branding files" ON storage.objects FOR SELECT USING (bucket_id = 'branding');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can manage branding files'
  ) THEN
    CREATE POLICY "Admins can manage branding files" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'branding' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'branding' AND public.has_role(auth.uid(), 'admin'));
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can view promo files'
  ) THEN
    CREATE POLICY "Public can view promo files" ON storage.objects FOR SELECT USING (bucket_id = 'promos');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admins can manage promo files'
  ) THEN
    CREATE POLICY "Admins can manage promo files" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'promos' AND public.has_role(auth.uid(), 'admin')) WITH CHECK (bucket_id = 'promos' AND public.has_role(auth.uid(), 'admin'));
  END IF;
END$$;

-- Realtime support (optional but useful later)
alter table public.site_settings replica identity full;
DO $$
BEGIN
  BEGIN
    EXECUTE 'alter publication supabase_realtime add table public.site_settings';
  EXCEPTION WHEN others THEN
    -- ignore if already added
    NULL;
  END;
END$$;