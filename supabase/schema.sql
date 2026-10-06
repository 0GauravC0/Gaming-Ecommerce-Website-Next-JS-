create type public.app_role as enum ('admin', 'customer');
create type public.order_status as enum ('Pending', 'Shipped', 'Delivered');
create type public.review_status as enum ('Pending', 'Approved', 'Rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    case
      when lower(new.email) = lower(coalesce(current_setting('app.admin_email', true), 'admin@gamestore.test'))
      then 'admin'::public.app_role
      else 'customer'::public.app_role
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create table public.categories (
  id bigint generated always as identity primary key,
  name text not null unique
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id bigint references public.categories(id),
  price numeric(12, 2) not null,
  rating numeric(2, 1) not null default 0,
  stock integer not null default 0,
  image_url text,
  description text,
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null,
  line text not null,
  city text not null,
  phone text not null
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  total numeric(12, 2) not null,
  status public.order_status not null default 'Pending',
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null,
  price numeric(12, 2) not null
);

create table public.wishlist_items (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  product_id uuid not null references public.products(id),
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  status public.review_status not null default 'Pending',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.wishlist_items enable row level security;
alter table public.reviews enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create policy "Products are public" on public.products for select using (true);
create policy "Categories are public" on public.categories for select using (true);
create policy "Admins manage products" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "Admins manage categories" on public.categories for all using (public.is_admin()) with check (public.is_admin());

create policy "Users view own profile" on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users manage own addresses" on public.addresses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admins view addresses" on public.addresses for select using (public.is_admin());

create policy "Users view own orders" on public.orders for select using (auth.uid() = user_id or public.is_admin());
create policy "Users create own orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Admins update orders" on public.orders for update using (public.is_admin());

create policy "Users view own order items" on public.order_items
  for select using (
    public.is_admin()
    or exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );
create policy "Users create own order items" on public.order_items
  for insert with check (
    exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid())
  );

create policy "Users manage own wishlist" on public.wishlist_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Approved reviews are public" on public.reviews for select using (status = 'Approved' or auth.uid() = user_id or public.is_admin());
create policy "Users create reviews" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Admins moderate reviews" on public.reviews for update using (public.is_admin());

insert into public.categories (name) values
  ('Gaming Laptop'),
  ('Gaming Monitors'),
  ('Gaming Accessories'),
  ('Gaming Mouse'),
  ('Gaming Setups'),
  ('PC Builds')
on conflict do nothing;
