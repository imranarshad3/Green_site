create function public.requesting_user_id()
returns text
language sql
stable
as $$
  select nullif(auth.jwt() ->> 'sub', '')
$$;

create table public.admins (
  user_id text primary key,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create policy "Users can see whether they are an admin"
  on public.admins for select
  to authenticated
  using (user_id = public.requesting_user_id());

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = public.requesting_user_id()
  )
$$;

create type public.product_type as enum ('plant', 'fertilizer');

create table public.products (
  id bigint generated always as identity primary key,
  type public.product_type not null,
  name text not null,
  slug text not null unique,
  category text not null,
  price numeric(10, 2) not null check (price >= 0),
  old_price numeric(10, 2) check (old_price >= 0),
  rating numeric(2, 1) check (rating between 0 and 5),
  reviews integer not null default 0 check (reviews >= 0),
  badge text,

  images text[] not null default '{}',
  care_level text,
  colors text[] not null default '{}',
  light text,
  watering text,
  pet_friendly boolean,
  description text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_type_idx on public.products (type) where is_active;

alter table public.products enable row level security;

create policy "Anyone can view active products"
  on public.products for select
  to anon, authenticated
  using (is_active or public.is_admin());

create policy "Admins can add products"
  on public.products for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update products"
  on public.products for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete products"
  on public.products for delete
  to authenticated
  using (public.is_admin());

create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create table public.cart_items (
  id bigint generated always as identity primary key,
  user_id text not null default public.requesting_user_id(),
  product_id bigint not null references public.products (id) on delete cascade,

  size text check (size in ('Small', 'Medium', 'Large')),
  pot_style text check (pot_style in ('Ivory', 'Sand', 'Charcoal')),
  quantity integer not null check (quantity between 1 and 99),
  created_at timestamptz not null default now(),
  unique nulls not distinct (user_id, product_id, size, pot_style)
);

create index cart_items_user_idx on public.cart_items (user_id);

alter table public.cart_items enable row level security;

create policy "Users manage their own cart"
  on public.cart_items for all
  to authenticated
  using (user_id = public.requesting_user_id())
  with check (user_id = public.requesting_user_id());

create table public.wishlist_items (
  user_id text not null default public.requesting_user_id(),
  product_id bigint not null references public.products (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

alter table public.wishlist_items enable row level security;

create policy "Users manage their own wishlist"
  on public.wishlist_items for all
  to authenticated
  using (user_id = public.requesting_user_id())
  with check (user_id = public.requesting_user_id());

create type public.order_status as enum (
  'processing', 'shipped', 'delivered', 'cancelled'
);

create sequence public.order_number_seq start 1001;

create table public.orders (
  id bigint generated always as identity primary key,
  order_number text not null unique
    default 'PLT-' || to_char(now(), 'YYYY') || '-' || nextval('public.order_number_seq'),
  user_id text not null,
  status public.order_status not null default 'processing',
  subtotal numeric(10, 2) not null,
  discount numeric(10, 2) not null,
  delivery numeric(10, 2) not null,
  total numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

create index orders_user_idx on public.orders (user_id, created_at desc);

create table public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders (id) on delete cascade,

  product_id bigint references public.products (id) on delete set null,
  name text not null,
  image text,
  price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  size text,
  pot_style text
);

create index order_items_order_idx on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Users see their own orders; admins see all"
  on public.orders for select
  to authenticated
  using (user_id = public.requesting_user_id() or public.is_admin());

create policy "Admins can update orders"
  on public.orders for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Order items follow their order"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (o.user_id = public.requesting_user_id() or public.is_admin())
    )
  );

revoke update on public.orders from authenticated;
grant update (status) on public.orders to authenticated;

create function public.place_order()
returns public.orders
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id text := public.requesting_user_id();
  v_subtotal numeric(10, 2);
  v_discount numeric(10, 2);
  v_delivery numeric(10, 2);
  v_order public.orders;
begin
  if v_user_id is null then
    raise exception 'You must be signed in to place an order'
      using errcode = '28000';
  end if;

  select coalesce(sum(p.price * c.quantity), 0)
    into v_subtotal
    from public.cart_items c
    join public.products p on p.id = c.product_id and p.is_active
   where c.user_id = v_user_id;

  if v_subtotal = 0 then
    raise exception 'Your cart is empty' using errcode = 'P0001';
  end if;

  v_discount := case when v_subtotal >= 60 then 9 else 0 end;
  v_delivery := case when v_subtotal >= 50 then 0 else 6 end;

  insert into public.orders (user_id, subtotal, discount, delivery, total)
  values (v_user_id, v_subtotal, v_discount, v_delivery,
          v_subtotal - v_discount + v_delivery)
  returning * into v_order;

  insert into public.order_items
    (order_id, product_id, name, image, price, quantity, size, pot_style)
  select v_order.id, p.id, p.name, p.images[1], p.price, c.quantity,
         c.size, c.pot_style
    from public.cart_items c
    join public.products p on p.id = c.product_id and p.is_active
   where c.user_id = v_user_id
   order by c.created_at;

  delete from public.cart_items where user_id = v_user_id;

  return v_order;
end;
$$;

revoke execute on function public.place_order() from public, anon;
grant execute on function public.place_order() to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do nothing;

create policy "Admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

create policy "Admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

create table public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  subject text not null default 'General' check (char_length(subject) <= 120),
  message text not null check (char_length(message) between 10 and 4000),

  user_id text default public.requesting_user_id(),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

create index contact_messages_created_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (
    handled = false
    and user_id is not distinct from public.requesting_user_id()
  );

create policy "Admins can read contact messages"
  on public.contact_messages for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update contact messages"
  on public.contact_messages for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

revoke update on public.contact_messages from anon, authenticated;
grant update (handled) on public.contact_messages to authenticated;

insert into public.products
  (type, name, slug, category, price, old_price, rating, reviews, badge, images,
   care_level, colors, light, watering, pet_friendly, description)
values
  ('plant', 'Anthurium Flower', 'anthurium-flower', 'Flowering', 34, 40, 5, 48, 'SALE', array['plants/anthurium.webp', 'plants/peperomia.webp', 'plants/birds-nest-fern.webp'], 'Moderate', array['#292929', '#e9b86d', '#eee9dc', '#bc6831'], 'Bright indirect light', 'Water when the top inch of soil is dry', false, 'A striking flowering houseplant with glossy green leaves and vivid red blooms.'),
  ('plant', 'Peperomia Ginny', 'peperomia-ginny', 'Foliage', 25, null, 5, 36, 'NEW', array['plants/peperomia.webp'], 'Easy', array['#292929', '#e9b86d', '#eee9dc', '#bc6831'], 'Medium to bright indirect light', 'Let the soil partially dry between waterings', true, 'A compact variegated peperomia with attractive green, cream and pink-edged leaves.'),
  ('plant', 'Bird''s Nest Fern', 'birds-nest-fern', 'Foliage', 45, null, 5, 29, null, array['plants/birds-nest-fern.webp'], 'Moderate', array['#292929', '#e9b86d', '#eee9dc'], 'Medium to bright indirect light', 'Keep the soil lightly and consistently moist', true, 'A lush tropical fern with broad, gently rippled fronds growing from a central rosette.'),
  ('plant', 'Monstera Deliciosa', 'monstera-deliciosa', 'Foliage', 55, null, 4, 61, 'BESTSELLER', array['plants/monstera.webp'], 'Easy', array['#292929', '#e9b86d', '#eee9dc'], 'Bright indirect light', 'Water when the top 2 inches of soil are dry', false, 'A classic tropical houseplant recognized by its large, naturally split leaves.'),
  ('plant', 'Pink Calathea', 'pink-calathea', 'Flowering', 42, null, 5, 34, 'NEW', array['plants/pink-calathea.webp'], 'Moderate', array['#292929', '#e9b86d', '#eee9dc'], 'Bright filtered light', 'Keep soil evenly moist without waterlogging', true, 'A colorful prayer-plant style houseplant with pink, green and cream foliage.'),
  ('plant', 'Peace Lily', 'peace-lily', 'Flowering', 38, null, 4, 52, null, array['plants/peace-lily.webp'], 'Easy', array['#292929', '#e9b86d', '#eee9dc'], 'Medium to bright indirect light', 'Water when the surface begins to dry', false, 'An elegant flowering plant with glossy foliage and clean white blooms.'),
  ('plant', 'Snake Plant', 'snake-plant', 'Succulents & Cacti', 29, null, 5, 74, null, array['plants/snake-plant.webp'], 'Easy', array['#292929', '#e9b86d', '#eee9dc'], 'Low to bright indirect light', 'Allow soil to dry completely between waterings', false, 'A hardy architectural plant with upright sword-shaped leaves and minimal watering needs.'),
  ('plant', 'ZZ Plant', 'zz-plant', 'Foliage', 48, null, 5, 43, null, array['plants/zz-plant.webp'], 'Easy', array['#292929', '#e9b86d', '#eee9dc'], 'Low to bright indirect light', 'Let the soil dry well between waterings', false, 'A resilient foliage plant with glossy leaflets and an easy-care growth habit.'),
  ('plant', 'Calathea Orbifolia', 'calathea-orbifolia', 'Hanging Plants', 62, null, 4, 31, null, array['plants/calathea-orbifolia.webp'], 'Moderate', array['#292929', '#e9b86d', '#eee9dc'], 'Bright indirect light', 'Keep soil lightly moist and avoid letting it dry completely', true, 'A decorative calathea with broad rounded leaves and distinctive silver-green striping.'),
  ('fertilizer', 'Balanced Growth', 'balanced-growth', 'Bestseller', 18, null, null, 0, null, array['fertilizers/balanced-growth.webp'], null, '{}', null, null, null, 'For foliage and everyday growth.'),
  ('fertilizer', 'Root Revival', 'root-revival', 'Root Care', 22, null, null, 0, null, array['fertilizers/root-revival.webp'], null, '{}', null, null, null, 'For stronger, healthier roots.'),
  ('fertilizer', 'Leaf & Bloom', 'leaf-and-bloom', 'New Formula', 20, null, null, 0, null, array['fertilizers/leaf-bloom.webp'], null, '{}', null, null, null, 'For vibrant foliage and flowers.');
