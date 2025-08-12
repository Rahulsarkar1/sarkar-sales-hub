-- Add a description field to products so it can be edited in Admin and shown on the site
alter table public.products
add column if not exists description text;