
-- 1) Segments (like categories/sections)
create table if not exists public.segments (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  sort_order int not null
<lov-tool-use id="call_LmPwbGEdsXpUWoCACTzI9MDR" name="lov-view" data="{\"file_path\":\"src/components/FestivePopup.tsx\",\"lines\":\"\"}">
</lov-tool-use>

<lov-tool-use id="call_v9YbnJHdXqpOvb2Rh0RYg0yX" name="lov-view" data="{\"file_path\":\"src/components/sections/Offers.tsx\",\"lines\":\"\"}">
</lov-tool-use>

<lov-tool-use id="call_GL85kCJ42r9egsUUWf70qIuX" name="lov-view" data="{\"file_path\":\"src/components/ui/sheet.tsx\",\"lines\":\"\"}">
</lov-tool-use>

<lov-tool-use id="thinking-d58baff7-a758-4ea4-8be7-2b66bba7060c" name="lov-think" data="" duration="0.000044">
</lov-tool-use>

<lov-tool-use id="thinking-0aec4997-150d-41ff-a5be-263888722335" name="lov-think" data="**Implementing SQL changes**

I’m figuring out the final steps, like presenting an \"Implement the plan\" button to switch to default mode for code changes and including Supabase links. The custom-actions allow for adding lov-link entries, but guidelines say I should wait for user approval on SQL changes. So, after including lov-sql, I’ll ask the user to review it. It seems I can include the plan and lov-sql, then provide the \"Implement the plan\" button after securing SQL approval." duration="3.701666">
</lov-tool-use>

<lov-tool-use id="thinking-858e851e-aac8-4984-a862-abab0ab4523a" name="lov-think" data="**Planning code changes**

I can move forward with Phase A code changes since they don’t need SQL approval. To keep things organized, I’ll state that we’ll implement Phase A immediately and handle Phase B after SQL approval. Since changes can’t be made in the current mode, I’ll propose a plan and include the SQL. The \"Implement the plan\" quick reply will switch us to the default mode for Phase A implementation while waiting for SQL approval. Then I’ll work on crafting the SQL!" duration="1.996430">
</lov-tool-use>
Thanks — I can reproduce the issues from your description. Here’s what’s causing them and how we’ll fix them step-by-step:

- View all freezes and goes full-screen on mobile
  - Why: The “View all” modal is a Radix Dialog with no height constraint on mobile, so it takes over the viewport and the page behind is scroll-locked. The modal content itself isn’t scrollable, which feels like a freeze.
  - Fix: Constrain the DialogContent and make it scrollable on mobile (e.g., w-[90vw] max-w-[90vw] md:max-w-3xl max-h-[80vh] overflow-y-auto). Apply the same scroll constraints to ProductDetailsDialog and LeadModal so none of them can trap scroll on small screens.

- Buy/Enquire → WhatsApp only
  - Why: The LeadModal currently shows “Send on WhatsApp” and “Submit”; the Submit only shows an alert.
  - Fix: Replace with a single primary “Submit” button that opens WhatsApp (wa.me) with a prefilled message containing the product name, customer name, and phone. Keep “Call Now” as a secondary button.

- Discount badge overflowing (“only the 1 is visible”)
  - Why: The badge can overflow tight rows on mobile when combined with the price and strikethrough MRP.
  - Fix: Make the badge shrink-0 with a pill style and ensure the price row uses gap-2 (remove extra ml-2). Add min-w-0 to the text container so truncation/wrapping works correctly.
  - Badge spec: inline-flex items-center shrink-0 rounded-full bg-[#ef4444] text-white font-bold text-[14px] md:text-xs leading-none px-2 py-0.5

- Mobile scroll traps and StickyActions
  - Keep main with pb-28 so the floating buttons never hide content.
  - Ensure sections use md:overflow-hidden overflow-visible and mobile height is min-h-[80vh] instead of min-h-screen so small screens don’t get height-locked.

- Admin Portal: universal control via Supabase (no local UI overrides)
  - Create a Supabase-backed CMS for segments, products, and product specifications with public read and admin-only write.
  - Wire the Admin Portal to manage all content (segments and products CRUD, specs CRUD, plus site colors/logo/festive via site_settings). Changes go live instantly across the site.

lov-plan
Phase A: Immediate UX fixes (no backend)
1) CategorySection.tsx
- Update DialogContent for “View all” to be mobile-friendly and scrollable:
  - className: "w-[90vw] max-w-[90vw] md:max-w-3xl max-h-[80vh] overflow-y-auto"
2) ProductDetailsDialog.tsx
- Constrain dialog height for mobile:
  - className: "max-w-lg max-h-[85vh] overflow-y-auto"
3) LeadModal.tsx
- Remove “Send on WhatsApp” and existing “Submit”.
- Add a single primary “Submit” that opens the WhatsApp URL with:
  - "Hi Sarkar Sales, I'm interested in {productName}.\nName: {name}\nPhone: {phone}"
- Keep “Call Now” secondary button.
4) ProductCard.tsx and Header.tsx (search results rows)
- Update the discount badge to the red pill:
  - Badges: "inline-flex items-center shrink-0 rounded-full bg-[#ef4444] text-white font-bold text-[14px] md:text-xs leading-none px-2 py-0.5"
- Replace extraneous ml-2 with gap-2 on the price row; ensure the row/container has min-w-0 and allows wrapping if needed.
5) Index.tsx
- Keep pb-28 on main.
- Ensure large sections use md:overflow-hidden overflow-visible, and mobile height uses min-h-[80vh] so it never locks.
6) Verify search behavior
- Clicking a result opens ProductDetailsDialog (already implemented) showing specs, “with exchange” price, and MRP.

Phase B: Supabase-backed Admin CMS (universal)
1) Database (see SQL below)
- Create tables: segments, products, product_specs with public read and admin-only write policies using has_role.
2) Admin UI
- Build CRUD screens for segments (add/edit/delete), products (add/edit/delete with image, price_mrp, discount_percent, order, visible), and specs (label/value pairs per product).
- Use site_settings for colors/logo/festive (already present), expose controls in Admin to update them, and apply theme tokens globally.
3) Frontend integration
- Replace the local catalog with Supabase content in the homepage and search.
- Use @tanstack/react-query for live updates and cache.

</lov-plan>

Please review and approve the SQL to set up the CMS tables and policies. After it’s applied, I’ll wire the Admin Portal and frontend to use them.

<lov-sql>
-- Segments (site sections/categories)
create table if not exists public.segments (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  name text not null,
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  segment_id uuid not null references public.segments(id) on delete cascade,
  name text not null,
  image_url text,
  price_mrp integer not null, -- store rupees as integer
  discount_percent smallint not null default 0,
  sort_order int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint discount_between_0_100 check (discount_percent >= 0 and discount_percent <= 100)
);

create index if not exists idx_products_segment_id on public.products(segment_id);

-- Product specifications (free-form label/value pairs)
create table if not exists public.product_specs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  value text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_product_specs_product_id on public.product_specs(product_id);

-- Updated_at triggers
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
for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_product_specs_updated_at on public.product_specs;
create trigger trg_product_specs_updated_at
before update on public.product_specs
for each row execute function public.set_updated_at();

-- RLS: enable and lock down writes to admins only; allow public read
alter table public.segments enable row level security;
alter table public.products enable row level security;
alter table public.product_specs enable row level security;

-- Read (public)
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

-- Admin write policies (insert, update, delete)
drop policy if exists "Admins manage segments" on public.segments;
create policy "Admins manage segments"
on public.segments
for all
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
on public.products
for all
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins manage product specs" on public.product_specs;
create policy "Admins manage product specs"
on public.product_specs
for all
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));
