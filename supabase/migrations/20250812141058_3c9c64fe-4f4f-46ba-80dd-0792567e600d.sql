
-- Create tables for segments, products, and product specifications
-- Public can read; only admins can modify via has_role(auth.uid(), 'admin'::app_role)

-- 1) Segments
create table if not exists public.segments (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  segment_id uuid not null references public.segments(id) on delete cascade,
  name text not null,
  image_url text,
  price_mrp integer not null,
  price_exchange_mrp integer, -- optional: price when exchanging old battery
  discount_percent integer not null default 0,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_products_segment_sort on public.products(segment_id, sort_order);
create index if not exists idx_products_visible on public.products(visible);

-- 3) Product specifications
create table if not exists public.product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  value text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_specs_product_sort on public.product_specs(product_id, sort_order);

-- Trigger to keep updated_at fresh on updates
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_segments_updated_at on public.segments;
create trigger trg_segments_updated_at
before update on public.segments
for each row
execute procedure public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row
execute procedure public.set_updated_at();

-- Enable RLS
alter table public.segments enable row level security;
alter table public.products enable row level security;
alter table public.product_specs enable row level security;

-- Policies: anyone can read
drop policy if exists "Anyone can read segments" on public.segments;
create policy "Anyone can read segments"
on public.segments
for select
using (true);

drop policy if exists "Anyone can read products" on public.products;
create policy "Anyone can read products"
on public.products
for select
using (true);

drop policy if exists "Anyone can read product specs" on public.product_specs;
create policy "Anyone can read product specs"
on public.product_specs
for select
using (true);

-- Policies: only admins can write
drop policy if exists "Admins can manage segments" on public.segments;
create policy "Admins can manage segments"
on public.segments
for all
using (has_role(auth.uid(), 'admin'::app_role))
with check (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products
for all
using (has_role(auth.uid(), 'admin'::app_role))
with check (has_role(auth.uid(), 'admin'::app_role));

drop policy if exists "Admins can manage product specs" on public.product_specs;
create policy "Admins can manage product specs"
on public.product_specs
for all
using (has_role(auth.uid(), 'admin'::app_role))
with check (has_role(auth.uid(), 'admin'::app_role));
